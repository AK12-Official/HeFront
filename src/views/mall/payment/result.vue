<!-- 支付结果页面 -->
<template>
    <div class="payment-result-container">
        <div class="result-content">
            <div v-if="loading" class="loading-section">
                <el-icon class="loading-icon" size="48">
                    <Loading />
                </el-icon>
                <div class="loading-text">正在查询支付结果...</div>
            </div>

            <div v-else-if="paymentResult === 'success'" class="success-section">
                <el-icon class="success-icon" size="80" color="#67C23A">
                    <CircleCheck />
                </el-icon>
                <div class="result-title">支付成功</div>
                <div class="result-desc">您的订单已支付成功，我们会尽快为您安排发货</div>

                <div v-if="orderInfo" class="order-info">
                    <div class="info-item">
                        <span class="label">订单号：</span>
                        <span class="value">{{ orderInfo.orderSn }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">支付金额：</span>
                        <span class="value amount">¥{{ orderInfo.payAmount }}</span>
                    </div>
                </div>

                <div class="action-buttons">
                    <el-button type="primary" @click="goToOrderDetail">查看订单</el-button>
                    <el-button @click="goToOrderList">订单列表</el-button>
                    <el-button @click="goToHome">继续购物</el-button>
                </div>
            </div>

            <div v-else-if="paymentResult === 'failed'" class="failed-section">
                <el-icon class="failed-icon" size="80" color="#F56C6C">
                    <CircleClose />
                </el-icon>
                <div class="result-title">支付失败</div>
                <div class="result-desc">{{ errorMessage || '支付过程中出现异常，请重试' }}</div>

                <div class="action-buttons">
                    <el-button type="primary" @click="retryPayment">重新支付</el-button>
                    <el-button @click="goToOrderList">查看订单</el-button>
                    <el-button @click="goToHome">返回首页</el-button>
                </div>
            </div>

            <div v-else-if="paymentResult === 'cancel'" class="cancel-section">
                <el-icon class="cancel-icon" size="80" color="#E6A23C">
                    <Warning />
                </el-icon>
                <div class="result-title">支付已取消</div>
                <div class="result-desc">您取消了本次支付，订单仍在等待支付中</div>

                <div class="action-buttons">
                    <el-button type="primary" @click="retryPayment">重新支付</el-button>
                    <el-button @click="goToOrderList">查看订单</el-button>
                    <el-button @click="goToHome">返回首页</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loading, CircleCheck, CircleClose, Warning } from '@element-plus/icons-vue'
import { PaymentUtils } from '@/utils/payment'
import { orderDetail } from '@/api/mall'
import type { OrderDetail } from '@/api/mall/types'

interface OrderInfo {
    id: number
    orderSn: string
    payAmount: number
    status: number
}

const route = useRoute()
const router = useRouter()

// 数据
const loading = ref(true)
const paymentResult = ref<'success' | 'failed' | 'cancel' | null>(null)
const orderInfo = ref<OrderInfo | null>(null)
const errorMessage = ref('')

// 查询支付结果
const checkPaymentResult = async () => {
    const { orderSn, status } = route.query

    if (!orderSn) {
        paymentResult.value = 'failed'
        errorMessage.value = '缺少订单信息'
        loading.value = false
        return
    }

    try {
        // 先查询支付状态
        if (status === 'success') {
            // 从支付宝回调过来的成功状态
            const result = await PaymentUtils.queryPaymentStatus(orderSn as string)

            if (result.success && result.status) {
                if (PaymentUtils.isPaymentSuccess(result.status)) {
                    paymentResult.value = 'success'
                    // 加载订单信息
                    await loadOrderInfo(orderSn as string)
                } else {
                    paymentResult.value = 'failed'
                    errorMessage.value = '支付未完成'
                }
            } else {
                paymentResult.value = 'failed'
                errorMessage.value = result.error || '查询支付状态失败'
            }
        } else if (status === 'cancel') {
            paymentResult.value = 'cancel'
            await loadOrderInfo(orderSn as string)
        } else {
            paymentResult.value = 'failed'
            errorMessage.value = '支付状态异常'
        }
    } catch (error) {
        console.error('查询支付结果失败:', error)
        paymentResult.value = 'failed'
        errorMessage.value = '查询支付结果失败'
    } finally {
        loading.value = false
    }
}

// 加载订单信息
const loadOrderInfo = async (orderSn: string) => {
    try {
        // 从订单号中提取订单ID（假设订单号格式为：ORDER_123456）
        const orderIdMatch = orderSn.match(/(\d+)$/)
        const orderId = orderIdMatch ? parseInt(orderIdMatch[1]) : parseInt(orderSn)

        const response = await orderDetail(orderId)
        if (response.code === 200 && response.data) {
            orderInfo.value = {
                id: response.data.id,
                orderSn: response.data.orderSn,
                payAmount: response.data.payAmount,
                status: response.data.status
            }
        } else {
            // 如果查询失败，使用模拟数据
            orderInfo.value = {
                id: orderId,
                orderSn: orderSn,
                payAmount: 0,
                status: paymentResult.value === 'success' ? 1 : 0
            }
        }
    } catch (error) {
        console.error('加载订单信息失败:', error)
        // 使用模拟数据作为后备
        orderInfo.value = {
            id: 1,
            orderSn: orderSn,
            payAmount: 0,
            status: paymentResult.value === 'success' ? 1 : 0
        }
    }
}

// 重新支付
const retryPayment = () => {
    if (orderInfo.value) {
        router.push(`/mall/payment/${orderInfo.value.id}`)
    } else {
        goToOrderList()
    }
}

// 查看订单详情
const goToOrderDetail = () => {
    if (orderInfo.value) {
        router.push(`/mall/order/${orderInfo.value.id}`)
    } else {
        goToOrderList()
    }
}

// 跳转到订单列表
const goToOrderList = () => {
    router.push('/mall/order')
}

// 返回首页继续购物
const goToHome = () => {
    router.push('/mall/home')
}

onMounted(() => {
    checkPaymentResult()
})
</script>

<style lang="scss" scoped>
.payment-result-container {
    background: #f5f5f5;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.result-content {
    background: #fff;
    border-radius: 12px;
    padding: 40px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-section,
.success-section,
.failed-section,
.cancel-section {
    .result-title {
        font-size: 24px;
        font-weight: 500;
        margin: 20px 0 10px;
    }

    .result-desc {
        color: #666;
        font-size: 16px;
        margin-bottom: 30px;
        line-height: 1.5;
    }

    .loading-text {
        font-size: 16px;
        color: #666;
        margin-top: 20px;
    }
}

.success-section {
    .result-title {
        color: #67C23A;
    }
}

.failed-section {
    .result-title {
        color: #F56C6C;
    }
}

.cancel-section {
    .result-title {
        color: #E6A23C;
    }
}

.order-info {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;

    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;

        &:not(:last-child) {
            border-bottom: 1px solid #eee;
        }

        .label {
            color: #666;
        }

        .value {
            color: #333;
            font-weight: 500;

            &.amount {
                color: #ff4757;
                font-size: 18px;
            }
        }
    }
}

.action-buttons {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;

    .el-button {
        min-width: 100px;
    }
}

.loading-icon {
    animation: rotate 1s linear infinite;
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
