import { mall } from '@/api'
import type { CommonResult, AlipayParams, PaymentQueryParams } from '@/api/mall/types'

// 定义订单详情类型
interface OrderDetail {
  orderId: number
  orderSn: string
  productName: string
  totalAmount: number
  status: number
}

/**
 * 支付工具类
 */
export class PaymentUtils {
  /**
   * 发起支付宝支付
   */
  static async createAlipayPayment(orderSn: string): Promise<{
    success: boolean
    paymentUrl?: string
    error?: string
  }> {
    try {
      // 由于orderDetail API需要orderId，我们这里使用orderSn的数字部分作为orderId
      // 在实际项目中，应该有专门的API通过orderSn获取订单详情
      const orderIdMatch = orderSn.match(/(\d+)$/)
      const orderId = orderIdMatch ? parseInt(orderIdMatch[1]) : parseInt(orderSn)

      // 获取订单详情
      const orderResponse = await mall.orderDetail(orderId) as unknown as CommonResult<OrderDetail>

      if (orderResponse.code !== 200 || !orderResponse.data) {
        return {
          success: false,
          error: '获取订单信息失败'
        }
      }

      const order = orderResponse.data

      // 构建支付参数
      const paymentParam: AlipayParams = {
        outTradeNo: orderSn,  // 商户订单号
        subject: `订单支付-${orderSn}`,  // 订单标题
        totalAmount: order.totalAmount.toString()  // 订单总金额，转换为字符串
      }

      // 调用网页支付接口，后端返回HTML页面
      const paymentResponse = await mall.alipayWebPay(paymentParam) as unknown as string

      if (paymentResponse && typeof paymentResponse === 'string') {
        // 创建临时form并提交到支付宝
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = paymentResponse
        document.body.appendChild(tempDiv)

        const form = tempDiv.querySelector('form')
        if (form) {
          // 在新窗口中打开支付页面
          const payWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes')
          if (payWindow) {
            payWindow.document.write(paymentResponse)
            payWindow.document.close()
          }

          document.body.removeChild(tempDiv)

          return {
            success: true,
            paymentUrl: '支付页面已打开'
          }
        } else {
          return {
            success: false,
            error: '支付页面格式错误'
          }
        }
      } else {
        return {
          success: false,
          error: '获取支付页面失败'
        }
      }
    } catch (error) {
      console.error('创建支付宝支付失败:', error)
      return {
        success: false,
        error: '创建支付失败'
      }
    }
  }

  /**
   * 查询支付状态
   */
  static async queryPaymentStatus(orderSn: string): Promise<{
    success: boolean
    status?: string
    error?: string
  }> {
    try {
      const response = await mall.alipayQuery({
        outTradeNo: orderSn
      } as PaymentQueryParams) as unknown as CommonResult<string>

      if (response.code === 200 && response.data) {
        // 后端直接返回支付宝交易状态字符串，如：TRADE_SUCCESS
        return {
          success: true,
          status: response.data
        }
      } else {
        return {
          success: false,
          error: response.message || '查询支付状态失败'
        }
      }
    } catch (error) {
      console.error('查询支付状态失败:', error)
      return {
        success: false,
        error: '查询支付状态失败'
      }
    }
  }

  /**
   * 判断支付是否成功
   */
  static isPaymentSuccess(status: string): boolean {
    return status === 'TRADE_SUCCESS' || status === 'TRADE_FINISHED'
  }

  /**
   * 判断支付是否失败
   */
  static isPaymentFailed(status: string): boolean {
    return status === 'TRADE_CLOSED'
  }

  /**
   * 判断支付是否等待中
   */
  static isPaymentPending(status: string): boolean {
    return status === 'WAIT_BUYER_PAY' || status === 'TRADE_CREATED'
  }

  /**
   * 获取支付状态显示文本
   */
  static getPaymentStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'TRADE_SUCCESS': '支付成功',
      'TRADE_FINISHED': '交易完成',
      'TRADE_CLOSED': '支付失败',
      'WAIT_BUYER_PAY': '等待支付',
      'TRADE_CREATED': '交易创建'
    }
    return statusMap[status] || '未知状态'
  }
}
