<!-- 支付页面 -->
<template>
  <div class="payment-container">
    <div class="payment-header">
      <h2>支付订单</h2>
    </div>

    <div v-if="loading" class="loading-section">
      <el-loading-text>正在加载支付信息...</el-loading-text>
    </div>

    <div v-else-if="!orderInfo" class="error-section">
      <el-text type="danger">订单信息不存在</el-text>
      <el-button type="primary" @click="goBack">返回</el-button>
    </div>

    <div v-else class="payment-content">
      <!-- 订单信息摘要 -->
      <div class="order-summary-section">
        <div class="section-title">订单信息</div>
        <div class="order-info">
          <div class="info-item">
            <span class="label">订单号：</span>
            <span class="value">{{ orderInfo.orderSn }}</span>
          </div>
          <div class="info-item">
            <span class="label">商品金额：</span>
            <span class="value">¥{{ orderInfo.totalAmount }}</span>
          </div>
          <div class="info-item">
            <span class="label">运费：</span>
            <span class="value">¥{{ orderInfo.freightAmount || 0 }}</span>
          </div>
          <div class="info-item total">
            <span class="label">应付金额：</span>
            <span class="value amount">¥{{ orderInfo.payAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="payment-method-section">
        <div class="section-title">选择支付方式</div>
        <div class="payment-methods">
          <div v-for="method in paymentMethods" :key="method.id" class="payment-method"
            :class="{ active: selectedPaymentMethod === method.id }" @click="selectedPaymentMethod = method.id">
            <div class="method-info">
              <img :src="method.icon" :alt="method.name" class="method-icon" />
              <div class="method-details">
                <div class="method-name">{{ method.name }}</div>
                <div class="method-desc">{{ method.description }}</div>
              </div>
            </div>
            <div class="method-check">
              <el-radio v-model="selectedPaymentMethod" :label="method.id" :title="`选择${method.name}`" />
            </div>
          </div>
        </div>
      </div>

      <!-- 支付按钮 -->
      <div class="payment-action">
        <div class="payment-amount">
          <span>应付金额：</span>
          <span class="amount">¥{{ orderInfo.payAmount }}</span>
        </div>
        <el-button type="primary" size="large" class="pay-btn" :loading="paying" @click="handlePay">
          立即支付
        </el-button>
      </div>
    </div>

    <!-- 支付状态弹窗 -->
    <el-dialog v-model="paymentDialogVisible" title="支付中" width="400px" :close-on-click-modal="false"
      :close-on-press-escape="false" :show-close="false">
      <div class="payment-dialog-content">
        <div v-if="paymentStatus === 'pending'" class="payment-pending">
          <el-icon class="loading-icon" size="48">
            <Loading />
          </el-icon>
          <div class="status-text">正在跳转到支付页面...</div>
        </div>

        <div v-else-if="paymentStatus === 'waiting'" class="payment-waiting">
          <el-icon class="waiting-icon" size="48">
            <Clock />
          </el-icon>
          <div class="status-text">请在新窗口完成支付</div>
          <div class="waiting-actions">
            <el-button @click="checkPaymentStatus">检查支付状态</el-button>
            <el-button type="primary" @click="cancelPayment">取消支付</el-button>
          </div>
        </div>

        <div v-else-if="paymentStatus === 'success'" class="payment-success">
          <el-icon class="success-icon" size="48" color="#67C23A">
            <CircleCheck />
          </el-icon>
          <div class="status-text">支付成功！</div>
          <div class="success-actions">
            <el-button type="primary" @click="goToOrderDetail">查看订单</el-button>
            <el-button @click="goToOrderList">订单列表</el-button>
          </div>
        </div>

        <div v-else-if="paymentStatus === 'failed'" class="payment-failed">
          <el-icon class="failed-icon" size="48" color="#F56C6C">
            <CircleClose />
          </el-icon>
          <div class="status-text">支付失败</div>
          <div class="error-message">{{ paymentError }}</div>
          <div class="failed-actions">
            <el-button type="primary" @click="retryPayment">重新支付</el-button>
            <el-button @click="cancelPayment">取消</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, Clock, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { orderDetail, orderPaySuccess } from '@/api/mall'
import type { CommonResult, PayType } from '@/api/mall/types'
import { PaymentUtils } from '@/utils/payment'

interface OrderInfo {
  id: number
  orderSn: string
  totalAmount: number
  freightAmount: number
  payAmount: number
  payType: number
  status: number
}

interface PaymentMethod {
  id: number
  name: string
  description: string
  icon: string
  enabled: boolean
}

const route = useRoute()
const router = useRouter()

// 数据
const loading = ref(false)
const paying = ref(false)
const orderInfo = ref<OrderInfo | null>(null)
const selectedPaymentMethod = ref(1) // 默认支付宝支付
const paymentDialogVisible = ref(false)
const paymentStatus = ref<'pending' | 'waiting' | 'success' | 'failed'>('pending')
const paymentError = ref('')
const paymentWindow = ref<Window | null>(null)
const checkTimer = ref<number | null>(null)

// 支付方式配置
const paymentMethods = ref<PaymentMethod[]>([
  {
    id: 1,
    name: '支付宝',
    description: '使用支付宝安全快捷支付',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDQ4QzM3LjI1NDggNDggNDggMzcuMjU0OCA0OCAyNEM0OCAxMC43NDUyIDM3LjI1NDggMCAyNCAwQzEwLjc0NTIgMCAwIDEwLjc0NTIgMCAyNEMwIDM3LjI1NDggMTAuNzQ1MiA0OCAyNCA0OFoiIGZpbGw9IiMwMDk2RkYiLz4KPHBhdGggZD0iTTMwLjExNyAyMi4xMjVIMjIuMTI1VjE5Ljg3NUgzMC4xMTdWMjIuMTI1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    enabled: true
  },
  {
    id: 2,
    name: '微信支付',
    description: '使用微信安全快捷支付',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDQ4QzM3LjI1NDggNDggNDggMzcuMjU0OCA0OCAyNEM0OCAxMC43NDUyIDM3LjI1NDggMCAyNCAwQzEwLjc0NTIgMCAwIDEwLjc0NTIgMCAyNEMwIDM3LjI1NDggMTAuNzQ1MiA0OCAyNCA0OFoiIGZpbGw9IiMwN0MxNjAiLz4KPHBhdGggZD0iTTMwLjExNyAyMi4xMjVIMjIuMTI1VjE5Ljg3NUgzMC4xMTdWMjIuMTI1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    enabled: false // 暂时禁用微信支付
  },
  {
    id: 99,
    name: '模拟支付',
    description: '支付宝支付',
    icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTI0IDQ4QzM3LjI1NDggNDggNDggMzcuMjU0OCA0OCAyNEM0OCAxMC43NDUyIDM3LjI1NDggMCAyNCAwQzEwLjc0NTIgMCAwIDEwLjc0NTIgMCAyNEMwIDM3LjI1NDggMTAuNzQ1MiA0OCAyNCA0OFoiIGZpbGw9IiNGRkI3MDAiLz4KPHBhdGggZD0iTTM0IDIxTDE5IDM2TDE0IDMxIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=',
    enabled: true
  }
])

// 加载订单信息
const loadOrderInfo = async () => {
  const orderId = route.params.orderId as string
  if (!orderId) {
    ElMessage.error('订单ID不存在')
    goBack()
    return
  }

  try {
    loading.value = true
    const response = await orderDetail(Number(orderId)) as unknown as CommonResult<OrderInfo>

    if (response.code === 200 && response.data) {
      orderInfo.value = response.data
      // 如果订单已支付，跳转到订单详情
      if (response.data.status !== 0) {
        ElMessage.success('订单已支付')
        goToOrderDetail()
      }
    } else {
      ElMessage.error(response.message || '加载订单信息失败')
      goBack()
    }
  } catch (error) {
    console.error('加载订单信息失败:', error)
    ElMessage.error('加载订单信息失败')
    goBack()
  } finally {
    loading.value = false
  }
}

// 处理支付
const handlePay = async () => {
  if (!orderInfo.value) {
    ElMessage.error('订单信息不存在')
    return
  }

  const paymentMethod = paymentMethods.value.find(m => m.id === selectedPaymentMethod.value)
  if (!paymentMethod?.enabled) {
    ElMessage.error('暂不支持该支付方式')
    return
  }

  try {
    paying.value = true
    paymentDialogVisible.value = true
    paymentStatus.value = 'pending'

    // 模拟支付
    if (selectedPaymentMethod.value === 99) {
      // 模拟支付延迟
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 直接设置为支付成功
      paymentStatus.value = 'success'

      // 调用支付成功接口更新订单状态
      try {
        await orderPaySuccess(orderInfo.value.id, PayType.ALIPAY)
        ElMessage.success('支付成功！')
      } catch (error) {
        console.error('更新订单状态失败:', error)
      }

      // 延迟跳转到支付结果页面
      setTimeout(() => {
        if (orderInfo.value) {
          router.push('/mall/payment/result?status=success&orderSn=' + orderInfo.value.orderSn)
        }
      }, 2000)
    } else {
      // 真实支付宝支付
      const paymentResult = await PaymentUtils.createAlipayPayment(orderInfo.value.orderSn)

      if (paymentResult.success && paymentResult.paymentUrl) {
        paymentStatus.value = 'waiting'
        // 开始轮询检查支付状态
        startPaymentStatusCheck()
      } else {
        throw new Error(paymentResult.error || '获取支付URL失败')
      }
    }
  } catch (error) {
    console.error('发起支付失败:', error)
    paymentStatus.value = 'failed'
    paymentError.value = '发起支付失败，请重试'
  } finally {
    paying.value = false
  }
}

// 开始支付状态检查
const startPaymentStatusCheck = () => {
  checkTimer.value = window.setInterval(async () => {
    await checkPaymentStatus()
  }, 3000) // 每3秒检查一次
}

// 停止支付状态检查
const stopPaymentStatusCheck = () => {
  if (checkTimer.value) {
    clearInterval(checkTimer.value)
    checkTimer.value = null
  }
}

// 检查支付状态
const checkPaymentStatus = async () => {
  if (!orderInfo.value) return

  try {
    const result = await PaymentUtils.queryPaymentStatus(orderInfo.value.orderSn)

    if (result.success && result.status) {
      if (PaymentUtils.isPaymentSuccess(result.status)) {
        // 支付成功
        stopPaymentStatusCheck()
        paymentStatus.value = 'success'

        // 调用支付成功接口更新订单状态
        try {
          await orderPaySuccess(orderInfo.value.id, PayType.ALIPAY) // 支付宝支付
        } catch (error) {
          console.error('更新订单状态失败:', error)
        }

        // 延迟跳转到支付结果页面
        setTimeout(() => {
          if (orderInfo.value) {
            router.push('/mall/payment/result?status=success&orderSn=' + orderInfo.value.orderSn)
          }
        }, 2000)
      } else if (PaymentUtils.isPaymentFailed(result.status)) {
        // 支付失败
        stopPaymentStatusCheck()
        paymentStatus.value = 'failed'
        paymentError.value = '支付失败，请重试'
      }
    }
  } catch (error) {
    console.error('检查支付状态失败:', error)
  }
}

// 重新支付
const retryPayment = () => {
  paymentDialogVisible.value = false
  paymentStatus.value = 'pending'
  paymentError.value = ''
  handlePay()
}

// 取消支付
const cancelPayment = async () => {
  stopPaymentStatusCheck()

  if (paymentWindow.value) {
    paymentWindow.value.close()
  }

  // 直接取消支付，不需要确认
  paymentDialogVisible.value = false
  goBack()
}

// 跳转到订单详情
const goToOrderDetail = () => {
  paymentDialogVisible.value = false
  router.push(`/mall/order/detail/${orderInfo.value?.id}`)
}

// 跳转到订单列表
const goToOrderList = () => {
  paymentDialogVisible.value = false
  router.push('/mall/order')
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 页面卸载时清理
onUnmounted(() => {
  stopPaymentStatusCheck()
  if (paymentWindow.value) {
    paymentWindow.value.close()
  }
})

onMounted(() => {
  loadOrderInfo()
})
</script>

<style lang="scss" scoped>
.payment-container {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 100px;
}

.payment-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
}

.loading-section,
.error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  margin: 20px;
  border-radius: 8px;

  .el-button {
    margin-top: 20px;
  }
}

.payment-content {
  padding: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #333;
}

.order-summary-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  .order-info {
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #f5f5f5;

      &.total {
        border-bottom: none;
        padding-top: 15px;
        font-weight: 500;

        .amount {
          color: #ff4757;
          font-size: 18px;
        }
      }

      .label {
        color: #666;
      }

      .value {
        color: #333;
      }
    }
  }
}

.payment-method-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;

  .payment-methods {
    .payment-method {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px;
      border: 2px solid #f0f0f0;
      border-radius: 8px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
      }

      &.active {
        border-color: #1890ff;
        background-color: #f6fbff;
      }

      .method-info {
        display: flex;
        align-items: center;

        .method-icon {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }

        .method-details {
          .method-name {
            font-size: 16px;
            font-weight: 500;
            color: #333;
          }

          .method-desc {
            font-size: 14px;
            color: #666;
            margin-top: 2px;
          }
        }
      }
    }
  }
}

.payment-action {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .payment-amount {
    .amount {
      color: #ff4757;
      font-size: 18px;
      font-weight: 500;
    }
  }

  .pay-btn {
    min-width: 120px;
  }
}

// 支付弹窗样式
.payment-dialog-content {
  text-align: center;
  padding: 20px;

  .loading-icon,
  .waiting-icon,
  .success-icon,
  .failed-icon {
    margin-bottom: 15px;
  }

  .status-text {
    font-size: 16px;
    color: #333;
    margin-bottom: 20px;
  }

  .error-message {
    color: #f56c6c;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .waiting-actions,
  .success-actions,
  .failed-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
}
</style>
