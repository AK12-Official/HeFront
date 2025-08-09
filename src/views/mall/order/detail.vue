<template>
    <div class="order-detail-container">
        <div class="order-header">
            <h2>订单详情</h2>
        </div>

        <div class="order-content" v-if="orderDetail">
            <!-- 订单状态 -->
            <div class="status-section">
                <div class="status-info">
                    <div class="status-text" :class="getStatusClass(orderDetail.status)">
                        {{ getStatusText(orderDetail.status) }}
                    </div>
                    <div class="order-number">订单号：{{ orderDetail.orderSn }}</div>
                    <div class="create-time">下单时间：{{ formatTime(orderDetail.createTime) }}</div>
                </div>

                <div class="status-actions" v-if="orderDetail.status === 0">
                    <el-button type="danger" @click="payOrder">去支付</el-button>
                </div>
            </div>

            <!-- 收货地址 -->
            <div class="address-section">
                <div class="section-title">收货地址</div>
                <div class="address-info">
                    <div class="address-main">
                        <span class="name">{{ orderDetail.receiverName }}</span>
                        <span class="phone">{{ orderDetail.receiverPhone }}</span>
                    </div>
                    <div class="address-detail">
                        {{ orderDetail.receiverProvince }} {{ orderDetail.receiverCity }} {{ orderDetail.receiverRegion
                        }} {{ orderDetail.receiverDetailAddress }}
                    </div>
                </div>
            </div>

            <!-- 商品信息 -->
            <div class="product-section">
                <div class="section-title">商品信息</div>
                <div class="product-list">
                    <div v-for="item in orderDetail.orderItemList" :key="item.id" class="product-item"
                        @click="goToProduct(item.productId)">
                        <img :src="item.productPic" :alt="item.productName" class="product-image" />
                        <div class="product-info">
                            <h4 class="product-name">{{ item.productName }}</h4>
                            <p class="product-attr" v-if="item.productAttr">{{ item.productAttr }}</p>
                            <div class="product-price-quantity">
                                <span class="price">¥{{ item.productPrice }}</span>
                                <span class="quantity">x{{ item.productQuantity }}</span>
                            </div>
                        </div>
                        <div class="item-total">
                            ¥{{ (item.productPrice * item.productQuantity).toFixed(2) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 物流信息 -->
            <div class="logistics-section" v-if="orderDetail.status >= 2">
                <div class="section-title">物流信息</div>
                <div class="logistics-info">
                    <div class="logistics-item">
                        <span class="label">物流公司：</span>
                        <span>{{ orderDetail.deliveryCompany || '顺丰快递' }}</span>
                    </div>
                    <div class="logistics-item">
                        <span class="label">运单号：</span>
                        <span>{{ orderDetail.deliverySn || 'SF1234567890' }}</span>
                    </div>
                    <div class="logistics-item">
                        <span class="label">发货时间：</span>
                        <span>{{ formatTime(orderDetail.deliveryTime || '') }}</span>
                    </div>
                </div>

                <div class="logistics-track">
                    <div class="track-item" v-for="(track, index) in logisticsTrack" :key="index">
                        <div class="track-time">{{ track.time }}</div>
                        <div class="track-status">{{ track.status }}</div>
                    </div>
                </div>
            </div>

            <!-- 订单信息 -->
            <div class="order-info-section">
                <div class="section-title">订单信息</div>
                <div class="order-info-list">
                    <div class="info-item">
                        <span class="label">订单编号：</span>
                        <span>{{ orderDetail.orderSn }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">下单时间：</span>
                        <span>{{ formatTime(orderDetail.createTime) }}</span>
                    </div>
                    <div class="info-item" v-if="orderDetail.payTime">
                        <span class="label">支付时间：</span>
                        <span>{{ formatTime(orderDetail.payTime) }}</span>
                    </div>
                    <div class="info-item" v-if="orderDetail.deliveryTime">
                        <span class="label">发货时间：</span>
                        <span>{{ formatTime(orderDetail.deliveryTime) }}</span>
                    </div>
                    <div class="info-item" v-if="orderDetail.receiveTime">
                        <span class="label">收货时间：</span>
                        <span>{{ formatTime(orderDetail.receiveTime) }}</span>
                    </div>
                    <div class="info-item" v-if="orderDetail.note">
                        <span class="label">订单备注：</span>
                        <span>{{ orderDetail.note }}</span>
                    </div>
                </div>
            </div>

            <!-- 费用明细 -->
            <div class="cost-section">
                <div class="section-title">费用明细</div>
                <div class="cost-list">
                    <div class="cost-item">
                        <span>商品总价：</span>
                        <span>¥{{ orderDetail.productAmount }}</span>
                    </div>
                    <div class="cost-item">
                        <span>运费：</span>
                        <span>¥{{ orderDetail.freightAmount }}</span>
                    </div>
                    <div class="cost-item" v-if="orderDetail.couponAmount > 0">
                        <span>优惠券减免：</span>
                        <span class="discount">-¥{{ orderDetail.couponAmount }}</span>
                    </div>
                    <div class="cost-item" v-if="orderDetail.integrationAmount > 0">
                        <span>积分减免：</span>
                        <span class="discount">-¥{{ orderDetail.integrationAmount }}</span>
                    </div>
                    <div class="cost-total">
                        <span>实付金额：</span>
                        <span class="total-amount">¥{{ orderDetail.payAmount }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section" v-if="orderDetail">
            <el-button v-if="orderDetail.status === 0" type="danger" size="large" @click="payOrder">
                立即支付
            </el-button>
            <el-button v-if="orderDetail.status === 2" type="primary" size="large" @click="confirmReceive">
                确认收货
            </el-button>
            <el-button size="large" @click="contactService">
                联系客服
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface OrderItem {
    id: number
    productId: number
    productName: string
    productPic: string
    productPrice: number
    productQuantity: number
    productAttr?: string
}

interface OrderDetail {
    id: number
    orderSn: string
    status: number
    createTime: string
    payTime?: string
    deliveryTime?: string
    receiveTime?: string
    note?: string
    receiverName: string
    receiverPhone: string
    receiverProvince: string
    receiverCity: string
    receiverRegion: string
    receiverDetailAddress: string
    deliveryCompany?: string
    deliverySn?: string
    productAmount: number
    freightAmount: number
    couponAmount: number
    integrationAmount: number
    payAmount: number
    orderItemList: OrderItem[]
}

interface LogisticsTrack {
    time: string
    status: string
}

const route = useRoute()
const router = useRouter()

// 数据
const orderDetail = ref<OrderDetail | null>(null)
const logisticsTrack = ref<LogisticsTrack[]>([])

// 获取订单状态文本
const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
        0: '待付款',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭',
        5: '已取消'
    }
    return statusMap[status] || '未知状态'
}

// 获取订单状态样式类
const getStatusClass = (status: number): string => {
    const classMap: Record<number, string> = {
        0: 'status-pending',
        1: 'status-processing',
        2: 'status-shipped',
        3: 'status-completed',
        4: 'status-closed',
        5: 'status-cancelled'
    }
    return classMap[status] || ''
}

// 格式化时间
const formatTime = (time: string): string => {
    if (!time) return ''
    const date = new Date(time)
    return date.toLocaleString('zh-CN')
}

// 加载订单详情
const loadOrderDetail = async () => {
    try {
        const orderId = route.params.id
        if (!orderId) {
            ElMessage.error('订单ID不存在')
            router.back()
            return
        }

        // 模拟订单详情数据
        orderDetail.value = {
            id: Number(orderId),
            orderSn: 'ORD202401010001',
            status: 2,
            createTime: '2024-01-01 10:00:00',
            payTime: '2024-01-01 10:05:00',
            deliveryTime: '2024-01-01 15:00:00',
            note: '请尽快发货',
            receiverName: '张三',
            receiverPhone: '13800138000',
            receiverProvince: '湖南省',
            receiverCity: '长沙市',
            receiverRegion: '岳麓区',
            receiverDetailAddress: '中南大学新校区',
            deliveryCompany: '顺丰快递',
            deliverySn: 'SF1234567890',
            productAmount: 9999,
            freightAmount: 0,
            couponAmount: 50,
            integrationAmount: 0,
            payAmount: 9949,
            orderItemList: [
                {
                    id: 1,
                    productId: 1,
                    productName: 'iPhone 15 Pro Max',
                    productPic: '/static/products/iphone15.jpg',
                    productPrice: 9999,
                    productQuantity: 1,
                    productAttr: '颜色：钛金色；容量：256GB'
                }
            ]
        }

        // 模拟物流轨迹
        if (orderDetail.value.status >= 2) {
            logisticsTrack.value = [
                { time: '2024-01-02 14:30:00', status: '快递已送达，签收人：本人' },
                { time: '2024-01-02 09:15:00', status: '快递正在派送中，预计当日送达' },
                { time: '2024-01-01 20:00:00', status: '快递已到达长沙转运中心' },
                { time: '2024-01-01 15:00:00', status: '商品已发出，承运商：顺丰快递' }
            ]
        }

    } catch (error) {
        console.error('加载订单详情失败:', error)
        ElMessage.error('加载订单详情失败')
    }
}

// 跳转到商品详情
const goToProduct = (productId: number) => {
    router.push(`/mall/product/detail/${productId}`)
}

// 支付订单
const payOrder = () => {
    ElMessage.success('跳转到支付页面')
    // router.push(`/mall/pay/${orderDetail.value?.id}`)
}

// 确认收货
const confirmReceive = () => {
    if (confirm('确认收到商品吗？')) {
        ElMessage.success('确认收货成功')
        if (orderDetail.value) {
            orderDetail.value.status = 3
            orderDetail.value.receiveTime = new Date().toISOString()
        }
    }
}

// 联系客服
const contactService = () => {
    ElMessage.info('客服功能开发中')
}

onMounted(() => {
    loadOrderDetail()
})
</script>

<style lang="scss" scoped>
.order-detail-container {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 80px;
}

.order-header {
    background: #fff;
    padding: 20px;
    border-bottom: 1px solid #eee;

    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }
}

.order-content {
    padding: 20px;

    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
    }

    .status-section,
    .address-section,
    .product-section,
    .logistics-section,
    .order-info-section,
    .cost-section {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 16px;
    }

    .status-section {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .status-info {
            .status-text {
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 8px;

                &.status-pending {
                    color: #e6a23c;
                }

                &.status-processing {
                    color: #409eff;
                }

                &.status-shipped {
                    color: #67c23a;
                }

                &.status-completed {
                    color: #67c23a;
                }

                &.status-closed,
                &.status-cancelled {
                    color: #909399;
                }
            }

            .order-number,
            .create-time {
                font-size: 14px;
                color: #666;
                margin-bottom: 4px;
            }
        }
    }

    .address-info {
        .address-main {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .name {
                font-weight: 600;
                color: #333;
            }

            .phone {
                color: #666;
            }
        }

        .address-detail {
            color: #666;
            font-size: 14px;
        }
    }

    .product-list {
        .product-item {
            display: flex;
            align-items: center;
            padding: 16px 0;
            border-bottom: 1px solid #f5f5f5;
            cursor: pointer;
            transition: background 0.3s ease;

            &:hover {
                background: #fafafa;
            }

            &:last-child {
                border-bottom: none;
            }

            .product-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                margin-right: 16px;
            }

            .product-info {
                flex: 1;

                .product-name {
                    font-size: 16px;
                    color: #333;
                    margin: 0 0 8px 0;
                }

                .product-attr {
                    font-size: 12px;
                    color: #999;
                    margin: 0 0 8px 0;
                }

                .product-price-quantity {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .price {
                        font-size: 16px;
                        color: #e53e3e;
                        font-weight: 600;
                    }

                    .quantity {
                        color: #666;
                    }
                }
            }

            .item-total {
                font-size: 18px;
                font-weight: 600;
                color: #e53e3e;
            }
        }
    }

    .logistics-info {
        margin-bottom: 20px;

        .logistics-item {
            display: flex;
            padding: 8px 0;
            font-size: 14px;

            .label {
                width: 80px;
                color: #666;
            }
        }
    }

    .logistics-track {
        .track-item {
            display: flex;
            padding: 12px 0;
            border-left: 2px solid #e6e6e6;
            padding-left: 20px;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                left: -6px;
                top: 20px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #409eff;
            }

            &:first-child::before {
                background: #67c23a;
            }

            .track-time {
                width: 150px;
                font-size: 12px;
                color: #999;
            }

            .track-status {
                flex: 1;
                font-size: 14px;
                color: #333;
            }
        }
    }

    .order-info-list,
    .cost-list {

        .info-item,
        .cost-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;

            .label {
                color: #666;
            }

            .discount {
                color: #e53e3e;
            }
        }

        .cost-total {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-top: 1px solid #eee;
            margin-top: 8px;

            .total-amount {
                font-size: 18px;
                font-weight: 600;
                color: #e53e3e;
            }
        }
    }
}

.action-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 16px 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
    z-index: 100;

    .el-button {
        flex: 1;
        height: 50px;
        font-size: 16px;
        font-weight: 600;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .order-content {
        padding: 16px;

        .status-section,
        .address-section,
        .product-section,
        .logistics-section,
        .order-info-section,
        .cost-section {
            padding: 16px;
        }

        .status-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
        }

        .product-list .product-item {
            .product-image {
                width: 60px;
                height: 60px;
            }

            .product-info {
                .product-name {
                    font-size: 14px;
                }

                .product-price-quantity .price {
                    font-size: 14px;
                }
            }

            .item-total {
                font-size: 16px;
            }
        }

        .logistics-track .track-item {
            .track-time {
                width: 120px;
            }
        }
    }

    .action-section {
        padding: 12px 16px;
    }
}
</style>
