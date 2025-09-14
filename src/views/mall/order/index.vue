<template>
  <div class="order-list-container">
    <div class="order-header">
      <h2>我的订单</h2>
      <div class="order-tabs">
        <div v-for="tab in orderTabs" :key="tab.value" class="tab-item" :class="{ active: activeTab === tab.value }"
          @click="changeTab(tab.value)">
          {{ tab.label }}
        </div>
      </div>
    </div>

    <div class="order-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>

      <div v-else-if="orderList.length === 0" class="empty-container">
        <div class="empty-text">暂无订单</div>
        <el-button type="primary" @click="goShopping">去购物</el-button>
      </div>

      <div v-else class="order-items">
        <div v-for="order in orderList" :key="order.id" class="order-item"
          :class="{ 'recent-order': isRecentOrder(order.createTime) }">
          <div class="order-header-info">
            <div class="order-left">
              <div class="order-number">
                订单号：{{ order.orderSn }}
                <span v-if="isRecentOrder(order.createTime)" class="new-order-badge">最新</span>
              </div>
              <div class="order-time" v-if="order.createTime">
                <el-icon>
                  <Clock />
                </el-icon>
                下单时间：{{ formatTime(order.createTime) }}
              </div>
            </div>
            <div class="order-status" :class="getStatusClass(order.status)">
              {{ getStatusText(order.status) }}
            </div>
          </div>

          <div class="order-products">
            <div v-for="item in order.orderItemList" :key="item.id" class="product-item"
              @click="viewOrderDetail(order.id)">
              <img :src="item.productPic" :alt="item.productName" class="product-image" />
              <div class="product-info">
                <div class="product-name">{{ item.productName }}</div>
                <div class="product-attr" v-if="item.productAttr">{{ formatProductAttr(item.productAttr) }}</div>
                <div class="product-price">
                  <span class="price">¥{{ item.productPrice }}</span>
                  <span class="quantity">x{{ item.productQuantity }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-info">
              <div class="total-amount">
                共{{ getTotalQuantity(order.orderItemList) }}件商品，合计：
                <span class="amount">¥{{ order.totalAmount }}</span>
              </div>
              <div class="order-time">下单时间：{{ formatTime(order.createTime) }}</div>
            </div>

            <div class="order-actions">
              <el-button v-if="order.status === 0" size="small" @click="payOrder(order)">
                去支付
              </el-button>
              <el-button v-if="order.status === 0" size="small" type="info" @click="cancelOrder(order)">
                取消订单
              </el-button>
              <el-button v-if="order.status === 2" size="small" @click="confirmReceive(order)">
                确认收货
              </el-button>
              <el-button v-if="order.status === 3" size="small" type="warning" @click="applyReturn(order)">
                申请退货
              </el-button>
              <el-button v-if="order.status === 4" size="small" @click="deleteOrder(order)">
                删除订单
              </el-button>
              <el-button size="small" @click="viewOrderDetail(order.id)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="prev, pager, next" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  orderList as getOrderList,
  orderCancelUserOrder,
  orderConfirmReceiveOrder,
  orderDeleteOrder
} from '@/api/mall'

interface OrderItem {
  id: number
  productId: number
  productName: string
  productPic: string
  productPrice: number
  productQuantity: number
  productAttr?: string
}

interface Order {
  id: number
  orderSn: string
  status: number
  totalAmount: number
  createTime: string
  orderItemList: OrderItem[]
}

const router = useRouter()

// 订单状态标签
const orderTabs = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 0 },
  { label: '待发货', value: 1 },
  { label: '待收货', value: 2 },
  { label: '已完成', value: 3 },
  { label: '已关闭', value: 4 }
]

// 数据
const activeTab = ref(-1)
const loading = ref(false)
const orderList = ref<Order[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

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

// 计算订单商品总数量
const getTotalQuantity = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.productQuantity, 0)
}

// 判断是否是最新订单（最近24小时内创建）
const isRecentOrder = (createTime: string): boolean => {
  if (!createTime) return false
  const orderTime = new Date(createTime).getTime()
  const currentTime = new Date().getTime()
  const oneDayInMs = 24 * 60 * 60 * 1000
  return (currentTime - orderTime) < oneDayInMs
}

// 格式化时间
const formatTime = (time: string): string => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

// 格式化商品属性
const formatProductAttr = (attr: string): string => {
  if (!attr) return ''

  try {
    // 尝试解析JSON格式的属性
    const attrs = JSON.parse(attr)
    if (Array.isArray(attrs)) {
      return attrs.map(item => `${item.key}: ${item.value}`).join(', ')
    }
  } catch (error) {
    // 如果不是JSON格式，直接返回原字符串
    console.warn('商品属性不是有效的JSON格式:', attr)
  }

  return attr
}

// 加载订单列表
const loadOrderList = async () => {
  try {
    loading.value = true
    console.log('开始请求订单列表, 参数:', {
      status: activeTab.value,
      pageNum: currentPage.value, // 现在直接使用currentPage，因为API已改为从1开始
      pageSize: pageSize.value
    })

    const response = await getOrderList({
      status: activeTab.value,
      pageNum: currentPage.value, // 修复：直接使用currentPage，不再减1
      pageSize: pageSize.value
    })

    console.log('订单列表API原始响应:', response)

    // 检查响应格式并处理数据
    if (response && typeof response === 'object') {
      // 响应拦截器返回的数据，直接访问code属性
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('code' in response && (response as any).code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any).data
        if (data && Array.isArray(data.list)) {
          orderList.value = data.list
          total.value = data.total || 0
          console.log('成功设置订单列表:', orderList.value.length, '条订单')
        } else {
          console.warn('API返回数据格式异常，使用默认订单数据')
          loadDefaultOrders()
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('API返回错误:', (response as any).message)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ElMessage.error((response as any).message || '获取订单列表失败')
        loadDefaultOrders()
      }
    } else {
      console.error('API响应格式完全异常:', typeof response, response)
      ElMessage.error('获取订单列表失败')
      loadDefaultOrders()
    }
  } catch (error) {
    console.error('加载订单列表异常:', error)
    ElMessage.error('加载订单列表失败')
    loadDefaultOrders()
  } finally {
    loading.value = false
  }
}

// 加载默认订单数据（当API失败时）
const loadDefaultOrders = () => {
  console.log('API调用失败，显示空订单列表')
  orderList.value = []
  total.value = 0
}

// 切换标签
const changeTab = (status: number) => {
  activeTab.value = status
  currentPage.value = 1
  loadOrderList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadOrderList()
}

// 去购物
const goShopping = () => {
  router.push('/mall/home')
}

// 查看商品详情
const goToProductDetail = (productId: number) => {
  router.push(`/mall/product/detail/${productId}`)
}

// 查看订单详情
const viewOrderDetail = (orderId: number) => {
  router.push(`/mall/order/detail/${orderId}`)
}

// 支付订单
const payOrder = (order: Order) => {
  // 跳转到支付页面，传递订单信息
  router.push(`/mall/payment/${order.id}`)
}

// 取消订单
const cancelOrder = async (order: Order) => {
  try {
    if (!confirm('确定要取消这个订单吗？')) {
      return
    }

    await orderCancelUserOrder(order.id)
    ElMessage.success('订单取消成功')
    loadOrderList()
  } catch (error) {
    console.error('取消订单失败:', error)
    ElMessage.error('取消订单失败')
  }
}

// 申请退货
const applyReturn = (order: Order) => {
  if (!order.orderItemList || order.orderItemList.length === 0) {
    ElMessage.error('该订单没有商品可以退货')
    return
  }

  // 如果只有一个商品，直接跳转
  if (order.orderItemList.length === 1) {
    const product = order.orderItemList[0]
    router.push(`/mall/order/return-apply/${order.id}/${product.productId}`)
  } else {
    // 如果有多个商品，可以让用户选择要退货的商品
    // 这里简化处理，跳转到第一个商品的退货页面
    // 实际应用中可以显示商品选择弹窗
    const product = order.orderItemList[0]
    router.push(`/mall/order/return-apply/${order.id}/${product.productId}`)
  }
}

// 确认收货
const confirmReceive = async (order: Order) => {
  try {
    await orderConfirmReceiveOrder(order.id)
    ElMessage.success('确认收货成功')
    loadOrderList()
  } catch (error) {
    console.error('确认收货失败:', error)
    ElMessage.error('确认收货失败')
  }
}

// 删除订单
const deleteOrder = async (order: Order) => {
  try {
    await orderDeleteOrder(order.id)
    ElMessage.success('删除成功')
    loadOrderList()
  } catch (error) {
    console.error('删除订单失败:', error)
    ElMessage.error('删除订单失败')
  }
}

onMounted(() => {
  loadOrderList()
})
</script>

<style lang="scss" scoped>
.order-list-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.order-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .order-tabs {
    display: flex;
    gap: 30px;

    .tab-item {
      padding: 10px 0;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #409eff;
        border-bottom-color: #409eff;
        font-weight: 600;
      }
    }
  }
}

.order-content {
  padding: 20px;

  .loading-container {
    text-align: center;
    padding: 50px;

    .loading-text {
      font-size: 16px;
      color: #666;
    }
  }

  .empty-container {
    text-align: center;
    padding: 50px;

    .empty-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
  }

  .order-items {
    .order-item {
      background: #fff;
      border-radius: 8px;
      margin-bottom: 20px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &.recent-order {
        border-left: 4px solid #409eff;
        box-shadow: 0 4px 8px rgba(64, 158, 255, 0.15);
      }

      .order-header-info {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 15px 20px;
        background: #fafafa;
        border-bottom: 1px solid #eee;

        .order-left {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .order-number {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;

            .new-order-badge {
              background: linear-gradient(135deg, #ff6b6b, #ff8e53);
              color: white;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 10px;
              font-weight: 600;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
              animation: pulse 2s infinite;
            }
          }

          .order-time {
            font-size: 12px;
            color: #999;
            display: flex;
            align-items: center;
            gap: 4px;

            i {
              font-size: 12px;
            }
          }
        }

        .order-status {
          font-size: 14px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 4px;
          background: #f0f9ff;

          &.status-pending {
            color: #e6a23c;
            background: #fdf6ec;
          }

          &.status-processing {
            color: #409eff;
            background: #ecf5ff;
          }

          &.status-shipped {
            color: #67c23a;
            background: #f0f9ea;
          }

          &.status-completed {
            color: #909399;
            background: #f4f4f5;
          }

          &.status-closed,
          &.status-cancelled {
            color: #f56c6c;
            background: #fef0f0;
          }
        }
      }

      .order-products {
        .product-item {
          display: flex;
          padding: 15px 20px;
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
            margin-right: 15px;
            flex-shrink: 0;
          }

          .product-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .product-name {
              font-size: 16px;
              color: #333;
              line-height: 1.4;
              margin-bottom: 5px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .product-attr {
              font-size: 12px;
              color: #999;
              margin-bottom: 5px;
            }

            .product-price {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .price {
                font-size: 16px;
                color: #e53e3e;
                font-weight: 600;
              }

              .quantity {
                font-size: 14px;
                color: #666;
              }
            }
          }
        }
      }

      .order-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: #fafafa;

        .order-info {
          .total-amount {
            font-size: 14px;
            color: #333;
            margin-bottom: 5px;

            .amount {
              font-size: 16px;
              color: #e53e3e;
              font-weight: 600;
            }
          }

          .order-time {
            font-size: 12px;
            color: #999;
          }
        }

        .order-actions {
          display: flex;
          gap: 10px;
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-header {
    padding: 16px;

    .order-tabs {
      gap: 20px;
      overflow-x: auto;
      white-space: nowrap;

      .tab-item {
        flex-shrink: 0;
        font-size: 14px;
      }
    }
  }

  .order-content {
    padding: 16px;

    .order-items .order-item {
      .order-header-info {
        padding: 12px 16px;
        font-size: 12px;
      }

      .order-products .product-item {
        padding: 12px 16px;

        .product-image {
          width: 60px;
          height: 60px;
        }

        .product-info {
          .product-name {
            font-size: 14px;
          }

          .product-price {
            .price {
              font-size: 14px;
            }
          }
        }
      }

      .order-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 16px;

        .order-actions {
          align-self: flex-end;
        }
      }
    }
  }
}

// 脉动动画
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7);
  }

  70% {
    box-shadow: 0 0 0 6px rgba(255, 107, 107, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
  }
}
</style>
