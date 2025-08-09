<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="order-create-container">
    <div class="order-header">
      <h2>确认订单</h2>
    </div>

    <div class="order-content">
      <!-- 收货地址 -->
      <div class="address-section">
        <div class="section-title">
          <span>收货地址</span>
          <el-button size="small" type="primary" @click="selectAddress">
            {{ selectedAddress ? '更换地址' : '选择地址' }}
          </el-button>
        </div>

        <div v-if="selectedAddress" class="address-info">
          <div class="address-main">
            <span class="name">{{ selectedAddress.name }}</span>
            <span class="phone">{{ selectedAddress.phoneNumber }}</span>
            <span class="default-tag" v-if="selectedAddress.defaultStatus">默认</span>
          </div>
          <div class="address-detail">
            {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.region }} {{
              selectedAddress.detailAddress }}
          </div>
        </div>

        <div v-else class="no-address">
          <span>请选择收货地址</span>
        </div>
      </div>

      <!-- 商品清单 -->
      <div class="product-section">
        <div class="section-title">商品清单</div>
        <div v-if="loading" class="loading-section">
          <el-text>正在加载商品信息...</el-text>
        </div>
        <div v-else-if="orderItems.length === 0" class="empty-section">
          <el-text>暂无商品</el-text>
        </div>
        <div v-else class="product-list">
          <div v-for="item in orderItems" :key="item.id" class="product-item">
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

      <!-- 优惠券 -->
      <div class="coupon-section">
        <div class="section-title">
          <span>优惠券</span>
          <el-button size="small" @click="selectCoupon">
            {{ selectedCoupon ? '更换优惠券' : '选择优惠券' }}
          </el-button>
        </div>

        <div v-if="selectedCoupon" class="coupon-info">
          <span class="coupon-name">{{ selectedCoupon.name }}</span>
          <span class="coupon-discount">-¥{{ selectedCoupon.amount }}</span>
        </div>

        <div v-else class="no-coupon">
          <span>暂无可用优惠券</span>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="delivery-section">
        <div class="section-title">配送方式</div>
        <div class="delivery-options">
          <div v-for="option in deliveryOptions" :key="option.id" class="delivery-option"
            :class="{ active: selectedDelivery === option.id }" @click="selectedDelivery = option.id">
            <span class="option-name">{{ option.name }}</span>
            <span class="option-price">{{ option.price > 0 ? `¥${option.price}` : '免费' }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="payment-section">
        <div class="section-title">支付方式</div>
        <div class="payment-options">
          <div v-for="option in paymentOptions" :key="option.id" class="payment-option"
            :class="{ active: selectedPayment === option.id }" @click="selectedPayment = option.id">
            <div class="option-info">
              <img :src="option.icon" :alt="option.name" class="payment-icon" />
              <span class="option-name">{{ option.name }}</span>
            </div>
            <div class="option-check">
              <el-radio :model-value="selectedPayment" :label="option.id" />
            </div>
          </div>
        </div>
      </div>

      <!-- 备注 -->
      <div class="note-section">
        <div class="section-title">订单备注</div>
        <el-input v-model="orderNote" type="textarea" :rows="3" placeholder="请输入订单备注（选填）" maxlength="200"
          show-word-limit />
      </div>
    </div>

    <!-- 订单汇总 -->
    <div class="order-summary">
      <div class="summary-item">
        <span>商品金额：</span>
        <span>¥{{ productTotal.toFixed(2) }}</span>
      </div>
      <div class="summary-item">
        <span>运费：</span>
        <span>¥{{ deliveryFee.toFixed(2) }}</span>
      </div>
      <div class="summary-item" v-if="couponDiscount > 0">
        <span>优惠券：</span>
        <span class="discount">-¥{{ couponDiscount.toFixed(2) }}</span>
      </div>
      <div class="summary-total">
        <span>应付金额：</span>
        <span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <!-- 提交按钮 -->
    <div class="submit-section">
      <el-button type="danger" size="large" class="submit-btn" :loading="submitting" @click="submitOrder">
        提交订单
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { orderGenerateConfirmOrder, orderGenerateOrder } from '@/api/mall'
import type { CommonResult } from '@/api/mall/types'

interface Address {
  id: number
  name: string
  phoneNumber: string
  province: string
  city: string
  region: string
  detailAddress: string
  defaultStatus: boolean
}

interface OrderItem {
  id: number
  productId: number
  productName: string
  productPic: string
  productPrice: number
  productQuantity: number
  productAttr?: string
}

interface Coupon {
  id: number
  name: string
  amount: number
  minPoint?: number
}

interface PaymentOption {
  id: number
  name: string
  icon: string
}

interface DeliveryOption {
  id: number
  name: string
  price: number
}

const route = useRoute()
const router = useRouter()

// 数据
const selectedAddress = ref<Address | null>(null)
const selectedCoupon = ref<Coupon | null>(null)
const selectedDelivery = ref(1)
const selectedPayment = ref(1)  // 默认选择支付宝
const orderNote = ref('')
const submitting = ref(false)

const orderItems = ref<OrderItem[]>([])
const loading = ref(false)

const deliveryOptions = ref<DeliveryOption[]>([
  { id: 1, name: '标准快递', price: 0 },
  { id: 2, name: '次日达', price: 15 },
  { id: 3, name: '当日达', price: 25 }
])

const paymentOptions = ref<PaymentOption[]>([
  { id: 1, name: '支付宝', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJDOC4yNjggMiAyIDguMjY4IDIgMTZTOC4yNjggMzAgMTYgMzAgMzAgMjMuNzMyIDMwIDE2IDIzLjczMiAyIDE2IDJaIiBmaWxsPSIjMDA5NkZGIi8+CjxwYXRoIGQ9Ik0yMC4wNzggMTQuNzVIMTQuNzVWMTMuMjVIMjAuMDc4VjE0Ljc1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+' },
  { id: 2, name: '微信支付', icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDJDOC4yNjggMiAyIDguMjY4IDIgMTZTOC4yNjggMzAgMTYgMzAgMzAgMjMuNzMyIDMwIDE2IDIzLjczMiAyIDE2IDJaIiBmaWxsPSIjMDBBRjAwIi8+CjxwYXRoIGQ9Ik0yMC4wNzggMTQuNzVIMTQuNzVWMTMuMjVIMjAuMDc4VjE0Ljc1WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+' }
])

// 计算属性
const productTotal = computed(() => {
  return orderItems.value.reduce((total, item) => {
    return total + (item.productPrice * item.productQuantity)
  }, 0)
})

const deliveryFee = computed(() => {
  const option = deliveryOptions.value.find(opt => opt.id === selectedDelivery.value)
  return option ? option.price : 0
})

const couponDiscount = computed(() => {
  return selectedCoupon.value ? selectedCoupon.value.amount : 0
})

const totalAmount = computed(() => {
  return Math.max(0, productTotal.value + deliveryFee.value - couponDiscount.value)
})

// 选择地址
const selectAddress = () => {
  // 这里可以打开地址选择弹窗或跳转到地址管理页面
  ElMessage.info('地址选择功能开发中')

  // 模拟选择地址
  selectedAddress.value = {
    id: 1,
    name: '张三',
    phoneNumber: '13800138000',
    province: '湖南省',
    city: '长沙市',
    region: '岳麓区',
    detailAddress: '中南大学新校区',
    defaultStatus: true
  }
}

// 选择优惠券
const selectCoupon = () => {
  // 这里可以打开优惠券选择弹窗
  ElMessage.info('优惠券选择功能开发中')

  // 模拟选择优惠券
  selectedCoupon.value = {
    id: 1,
    name: '满减优惠券',
    amount: 50,
    minPoint: 100
  }
}

// 提交订单
const submitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  if (orderItems.value.length === 0) {
    ElMessage.warning('购物车为空')
    return
  }

  if (!selectedPayment.value) {
    ElMessage.warning('请选择支付方式')
    return
  }

  try {
    submitting.value = true

    // 获取选中的购物车项ID
    const cartIdsParam = route.query.cartIds as string
    const cartIds = cartIdsParam ? cartIdsParam.split(',').map(id => Number(id)) : []

    const orderData = {
      memberReceiveAddressId: selectedAddress.value.id,
      couponId: selectedCoupon.value?.id,
      useIntegration: 0, // 暂时不使用积分
      payType: selectedPayment.value,
      cartIds: cartIds
    }

    console.log('提交订单数据:', orderData)

    // 调用生成订单API
    const response = await orderGenerateOrder(orderData) as unknown as CommonResult<{ order: Record<string, unknown> }>

    console.log('订单API响应:', response)

    if (response.code === 200) {
      ElMessage.success('订单提交成功')

      // 跳转到订单列表页面
      router.push('/mall/order')
    } else {
      ElMessage.error(response.message || '订单提交失败')
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error('提交订单失败')
  } finally {
    submitting.value = false
  }
}

// 加载订单确认数据
const loadOrderData = async () => {
  const cartIdsParam = route.query.cartIds as string

  if (!cartIdsParam) {
    ElMessage.error('未找到商品信息')
    router.push('/mall/cart')
    return
  }

  try {
    loading.value = true
    const cartIds = cartIdsParam.split(',').map(id => Number(id))
    const response = await orderGenerateConfirmOrder(cartIds) as unknown as CommonResult<unknown[] | { cartPromotionItemList: unknown[] }>

    // 处理API响应数据
    if (response.code === 200 && response.data) {
      if (Array.isArray(response.data)) {
        // 如果直接返回商品数组
        orderItems.value = response.data.map((item: unknown) => {
          const cartItem = item as Record<string, unknown>
          return {
            id: cartItem.id as number,
            productId: cartItem.productId as number,
            productName: cartItem.productName as string,
            productPic: cartItem.productPic as string,
            productPrice: (cartItem.price || cartItem.productPrice) as number,
            productQuantity: (cartItem.quantity || cartItem.productQuantity) as number,
            productAttr: cartItem.productAttr as string
          }
        })
      } else if ((response.data as Record<string, unknown>).cartPromotionItemList) {
        // 如果返回完整的订单确认对象
        const dataObj = response.data as { cartPromotionItemList: unknown[] }
        orderItems.value = dataObj.cartPromotionItemList.map((item: unknown) => {
          const cartItem = item as Record<string, unknown>
          return {
            id: cartItem.id as number,
            productId: cartItem.productId as number,
            productName: cartItem.productName as string,
            productPic: cartItem.productPic as string,
            productPrice: cartItem.price as number,
            productQuantity: cartItem.quantity as number,
            productAttr: cartItem.productAttr as string
          }
        })
      }
    } else {
      ElMessage.error(response.message || '加载订单数据失败')
      router.push('/mall/cart')
    }
  } catch (error) {
    console.error('加载订单数据失败:', error)
    ElMessage.error('加载订单数据失败')
    router.push('/mall/cart')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrderData()
})
</script>

<style lang="scss" scoped>
.order-create-container {
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
  }

  .address-section,
  .product-section,
  .coupon-section,
  .delivery-section,
  .payment-section,
  .note-section {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 16px;
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

      .default-tag {
        background: #409eff;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
      }
    }

    .address-detail {
      color: #666;
      font-size: 14px;
    }
  }

  .no-address,
  .no-coupon {
    color: #999;
    font-size: 14px;
  }

  .product-list {
    .product-item {
      display: flex;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f5f5f5;

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

  .coupon-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .coupon-name {
      color: #333;
    }

    .coupon-discount {
      color: #e53e3e;
      font-weight: 600;
    }
  }

  .delivery-options,
  .payment-options {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .delivery-option,
    .payment-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: #409eff;
      }

      &.active {
        border-color: #409eff;
        background: #f0f9ff;
      }

      .option-name {
        color: #333;
      }

      .option-price {
        color: #e53e3e;
        font-weight: 600;
      }
    }
  }

  .payment-options {
    .payment-option {
      .option-info {
        display: flex;
        align-items: center;
        gap: 12px;

        .payment-icon {
          width: 24px;
          height: 24px;
        }

        .option-name {
          color: #333;
          font-size: 16px;
        }
      }

      .option-check {
        .el-radio {
          margin: 0;
        }
      }
    }
  }
}

.order-summary {
  background: #fff;
  padding: 20px;
  margin: 0 20px 20px;
  border-radius: 8px;

  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 14px;
    color: #666;

    .discount {
      color: #e53e3e;
    }
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #eee;
    margin-top: 8px;

    .total-amount {
      font-size: 20px;
      font-weight: 600;
      color: #e53e3e;
    }
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 16px 20px;
  border-top: 1px solid #eee;
  z-index: 100;

  .submit-btn {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-weight: 600;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-content {
    padding: 16px;

    .address-section,
    .product-section,
    .coupon-section,
    .delivery-section,
    .note-section {
      padding: 16px;
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
  }

  .order-summary {
    margin: 0 16px 20px;
    padding: 16px;
  }

  .submit-section {
    padding: 12px 16px;
  }
}
</style>
