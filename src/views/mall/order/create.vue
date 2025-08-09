<!-- 基于MallLite接口文档的订单确认页面 -->
<template>
  <div class="order-confirm-container">
    <div class="order-header">
      <h2>确认订单</h2>
    </div>

    <div v-if="loading" class="loading-section">
      <el-skeleton :rows="5" animated />
    </div>

    <div v-else-if="!confirmOrderData" class="error-section">
      <el-empty description="订单信息加载失败">
        <el-button type="primary" @click="goBack">返回购物车</el-button>
      </el-empty>
    </div>

    <div v-else class="order-content">
      <!-- 收货地址 -->
      <div class="address-section">
        <div class="section-title">
          <el-icon>
            <Location />
          </el-icon>
          收货地址
        </div>

        <div v-if="!selectedAddress" class="no-address">
          <p>您还没有收货地址，请先添加</p>
          <el-button type="primary" @click="addAddress">添加收货地址</el-button>
        </div>

        <div v-else class="address-content">
          <div class="selected-address" @click="showAddressDialog = true">
            <div class="address-info">
              <div class="contact">
                <span class="name">{{ selectedAddress.name }}</span>
                <span class="phone">{{ selectedAddress.phoneNumber }}</span>
                <span v-if="selectedAddress.defaultStatus" class="default-tag">默认</span>
              </div>
              <div class="address">
                {{ selectedAddress.province }} {{ selectedAddress.city }} {{ selectedAddress.region }} {{
                  selectedAddress.detailAddress }}
              </div>
            </div>
            <el-icon class="arrow-icon">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="products-section">
        <div class="section-title">商品清单</div>
        <div class="product-list">
          <div v-for="item in confirmOrderData.cartPromotionItemList" :key="item.id" class="product-item">
            <img :src="item.productPic" :alt="item.productName" class="product-image" />
            <div class="product-info">
              <h3 class="product-name">{{ item.productName }}</h3>
              <p class="product-attr" v-if="item.productAttr">{{ item.productAttr }}</p>
              <div class="product-price">
                <span class="price">¥{{ item.price }}</span>
                <span class="quantity">x{{ item.quantity }}</span>
              </div>
            </div>
            <div class="product-total">
              ¥{{ (item.price * item.quantity).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 优惠券选择 -->
      <div class="coupon-section">
        <div class="section-title">优惠券</div>
        <div class="coupon-selector" @click="showCouponDialog = true">
          <div class="coupon-info">
            <span v-if="selectedCoupon">
              {{ selectedCoupon.name }} -¥{{ selectedCoupon.amount }}
            </span>
            <span v-else class="no-coupon">
              {{ availableCoupons.length > 0 ? '请选择优惠券' : '暂无可用优惠券' }}
            </span>
          </div>
          <el-icon class="arrow-icon">
            <ArrowRight />
          </el-icon>
        </div>
      </div>

      <!-- 积分使用 -->
      <div class="integration-section" v-if="confirmOrderData.memberIntegration > 0">
        <div class="section-title">积分抵扣</div>
        <div class="integration-content">
          <div class="integration-info">
            <span>可用积分：{{ confirmOrderData.memberIntegration }}</span>
            <span class="integration-rule">（{{ integrationRule }}）</span>
          </div>
          <div class="integration-control">
            <el-switch v-model="useIntegration" @change="onIntegrationChange" :disabled="maxIntegrationAmount <= 0" />
            <el-input-number v-if="useIntegration" v-model="integrationAmount" :min="0" :max="maxIntegrationAmount"
              :step="10" size="small" @change="onIntegrationAmountChange" />
          </div>
        </div>
      </div>

      <!-- 订单备注 -->
      <div class="note-section">
        <div class="section-title">订单备注</div>
        <el-input v-model="orderNote" type="textarea" :rows="3" placeholder="请输入订单备注（选填）" maxlength="200"
          show-word-limit />
      </div>

      <!-- 费用明细 -->
      <div class="amount-section">
        <div class="amount-list">
          <div class="amount-item">
            <span>商品总额</span>
            <span>¥{{ totalProductAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-item">
            <span>运费</span>
            <span>¥{{ freightAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-item" v-if="couponAmount > 0">
            <span>优惠券优惠</span>
            <span class="discount">-¥{{ couponAmount.toFixed(2) }}</span>
          </div>
          <div class="amount-item" v-if="integrationDiscount > 0">
            <span>积分抵扣</span>
            <span class="discount">-¥{{ integrationDiscount.toFixed(2) }}</span>
          </div>
          <div class="amount-item total">
            <span>应付金额</span>
            <span class="total-amount">¥{{ finalAmount.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部提交 -->
    <div class="order-footer" v-if="confirmOrderData">
      <div class="footer-info">
        <div class="total-info">
          <span>实付款：</span>
          <span class="amount">¥{{ finalAmount.toFixed(2) }}</span>
        </div>
      </div>
      <el-button type="danger" size="large" class="submit-btn" :loading="submitting" @click="submitOrder"
        :disabled="!selectedAddress">
        提交订单
      </el-button>
    </div>

    <!-- 地址选择对话框 -->
    <AddressSelectDialog v-model="showAddressDialog" :addresses="confirmOrderData?.memberReceiveAddressList || []"
      :selected-id="selectedAddress?.id" @select="onAddressSelect" @add="addAddress" />

    <!-- 优惠券选择对话框 -->
    <CouponSelectDialog v-model="showCouponDialog" :coupons="availableCoupons" :selected-id="selectedCoupon?.id"
      @select="onCouponSelect" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Location, ArrowRight } from '@element-plus/icons-vue'
import {
  orderGenerateConfirmOrder,
  orderGenerateOrder,
  memberCouponListCart
} from '@/api/mall'
import AddressSelectDialog from '@/components/AddressSelectDialog.vue'
import CouponSelectDialog from '@/components/CouponSelectDialog.vue'
import type {
  ConfirmOrderResult,
  MemberReceiveAddress,
  MemberCoupon,
  OrderParam,
  CommonResult,
  OrderGenerateResponse
} from '@/api/mall/types'

const router = useRouter()
const route = useRoute()

// 数据状态
const loading = ref(true)
const submitting = ref(false)
const confirmOrderData = ref<ConfirmOrderResult | null>(null)
const orderNote = ref('')

// 选择状态
const selectedAddress = ref<MemberReceiveAddress | null>(null)
const selectedCoupon = ref<MemberCoupon | null>(null)
const useIntegration = ref(false)
const integrationAmount = ref(0)

// 对话框状态
const showAddressDialog = ref(false)
const showCouponDialog = ref(false)

// 可用优惠券
const availableCoupons = ref<MemberCoupon[]>([])

// 计算属性
const totalProductAmount = computed(() => {
  if (!confirmOrderData.value) return 0
  return confirmOrderData.value.cartPromotionItemList.reduce((total, item) => {
    return total + (item.price * item.quantity)
  }, 0)
})

const freightAmount = computed(() => {
  return confirmOrderData.value?.calcAmount.freightAmount || 0
})

const couponAmount = computed(() => {
  return selectedCoupon.value?.amount || 0
})

const integrationDiscount = computed(() => {
  if (!useIntegration.value || !confirmOrderData.value) return 0
  const setting = confirmOrderData.value.integrationConsumeSetting
  return integrationAmount.value / setting.deductionPerAmount
})

const maxIntegrationAmount = computed(() => {
  if (!confirmOrderData.value) return 0
  const setting = confirmOrderData.value.integrationConsumeSetting
  const maxByTotal = Math.floor(totalProductAmount.value * setting.maxPercentPerOrder / 100) * setting.deductionPerAmount
  const maxByOwned = confirmOrderData.value.memberIntegration
  return Math.min(maxByTotal, maxByOwned)
})

const integrationRule = computed(() => {
  if (!confirmOrderData.value) return ''
  const setting = confirmOrderData.value.integrationConsumeSetting
  return `每${setting.deductionPerAmount}积分抵扣1元`
})

const finalAmount = computed(() => {
  return Math.max(0, totalProductAmount.value + freightAmount.value - couponAmount.value - integrationDiscount.value)
})

// 方法
const loadConfirmOrder = async () => {
  try {
    loading.value = true
    const cartIds = route.query.cartIds as string
    if (!cartIds) {
      ElMessage.error('缺少订单信息')
      router.back()
      return
    }

    const ids = cartIds.split(',').map(id => parseInt(id))
    const response = await orderGenerateConfirmOrder(ids)

    if (response.code === 200) {
      confirmOrderData.value = response.data

      // 设置默认地址
      const defaultAddress = response.data.memberReceiveAddressList.find(addr => addr.defaultStatus === 1)
      if (defaultAddress) {
        selectedAddress.value = defaultAddress
      } else if (response.data.memberReceiveAddressList.length > 0) {
        selectedAddress.value = response.data.memberReceiveAddressList[0]
      }

      // 加载可用优惠券
      loadAvailableCoupons()
    } else {
      ElMessage.error(response.message)
      router.back()
    }
  } catch (error) {
    console.error('加载确认订单失败:', error)
    ElMessage.error('加载失败，请重试')
    router.back()
  } finally {
    loading.value = false
  }
}

const loadAvailableCoupons = async () => {
  try {
    const response = await memberCouponListCart(1) // 1表示可用的优惠券
    if (response.code === 200) {
      availableCoupons.value = response.data
    }
  } catch (error) {
    console.error('加载优惠券失败:', error)
  }
}

const onAddressSelect = (address: MemberReceiveAddress) => {
  selectedAddress.value = address
  showAddressDialog.value = false
}

const onCouponSelect = (coupon: MemberCoupon | null) => {
  selectedCoupon.value = coupon
  showCouponDialog.value = false
}

const onIntegrationChange = (value: boolean) => {
  if (value) {
    integrationAmount.value = Math.min(100, maxIntegrationAmount.value)
  } else {
    integrationAmount.value = 0
  }
}

const onIntegrationAmountChange = (value: number | undefined) => {
  integrationAmount.value = Math.min(value || 0, maxIntegrationAmount.value)
}

const addAddress = () => {
  router.push('/mall/address/edit')
}

const goBack = () => {
  router.back()
}

const submitOrder = async () => {
  if (!selectedAddress.value) {
    ElMessage.warning('请选择收货地址')
    return
  }

  try {
    submitting.value = true

    const cartIds = route.query.cartIds as string
    const orderParam: OrderParam = {
      memberReceiveAddressId: selectedAddress.value.id,
      payType: 1, // 默认支付宝支付
      cartIds: cartIds.split(',').map(id => parseInt(id))
    }

    if (selectedCoupon.value) {
      orderParam.couponId = selectedCoupon.value.id
    }

    if (useIntegration.value && integrationAmount.value > 0) {
      orderParam.useIntegration = integrationAmount.value
    }

    if (orderNote.value.trim()) {
      orderParam.note = orderNote.value.trim()
    }

    const response = await orderGenerateOrder(orderParam) as unknown as CommonResult<OrderGenerateResponse>

    if (response.code === 200) {
      ElMessage.success('订单提交成功')
      // 跳转到支付页面
      const orderId = response.data.order?.id || response.data.payInfo?.orderId
      if (orderId) {
        router.push(`/mall/payment/${orderId}`)
      } else {
        ElMessage.error('订单ID获取失败')
      }
    } else {
      ElMessage.error(response.message)
    }
  } catch (error) {
    console.error('提交订单失败:', error)
    ElMessage.error('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadConfirmOrder()
})
</script>

<style scoped lang="scss">
.order-confirm-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

.order-header {
  background: white;
  padding: 16px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 500;
  }
}

.loading-section,
.error-section {
  padding: 20px;
}

.order-content {
  padding: 0 16px 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 12px;
  color: #333;
}

.address-section,
.products-section,
.coupon-section,
.integration-section,
.note-section,
.amount-section {
  background: white;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.no-address {
  text-align: center;
  padding: 20px;
  color: #999;
}

.selected-address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .address-info {
    flex: 1;

    .contact {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .name {
        font-weight: 500;
        color: #333;
      }

      .phone {
        color: #666;
      }

      .default-tag {
        background: #f56c6c;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    .address {
      color: #666;
      line-height: 1.5;
    }
  }

  .arrow-icon {
    color: #ccc;
  }
}

.product-list {
  .product-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .product-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 4px 0;
        color: #333;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-clamp: 2;
      }

      .product-attr {
        font-size: 12px;
        color: #999;
        margin: 0 0 8px 0;
      }

      .product-price {
        display: flex;
        align-items: center;
        gap: 8px;

        .price {
          color: #f56c6c;
          font-weight: 500;
        }

        .quantity {
          color: #999;
          font-size: 14px;
        }
      }
    }

    .product-total {
      font-weight: 500;
      color: #f56c6c;
    }
  }
}

.coupon-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  .coupon-info {
    .no-coupon {
      color: #999;
    }
  }

  .arrow-icon {
    color: #ccc;
  }
}

.integration-content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .integration-info {
    .integration-rule {
      color: #999;
      font-size: 12px;
    }
  }

  .integration-control {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.amount-list {
  .amount-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    &.total {
      border-top: 1px solid #eee;
      padding-top: 12px;
      margin-top: 8px;
      font-weight: 500;

      .total-amount {
        color: #f56c6c;
        font-size: 18px;
      }
    }

    .discount {
      color: #f56c6c;
    }
  }
}

.order-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;

  .footer-info {
    .total-info {
      font-size: 16px;

      .amount {
        color: #f56c6c;
        font-weight: 500;
        font-size: 18px;
      }
    }
  }

  .submit-btn {
    min-width: 120px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .order-content {
    padding: 0 12px 20px;

    .address-section,
    .products-section,
    .coupon-section,
    .integration-section,
    .note-section,
    .amount-section {
      padding: 12px;
    }
  }

  .product-list .product-item {
    .product-image {
      width: 60px;
      height: 60px;
    }

    .product-info {
      .product-name {
        font-size: 13px;
      }
    }
  }

  .order-footer {
    padding: 12px;

    .footer-info .total-info {
      font-size: 14px;

      .amount {
        font-size: 16px;
      }
    }

    .submit-btn {
      min-width: 100px;
    }
  }
}
</style>
