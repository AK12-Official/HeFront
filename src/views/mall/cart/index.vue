<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
  <div class="cart-container">
    <!-- 头部 -->
    <div class="cart-header">
      <h2>购物车</h2>
      <el-button v-if="cartItems.length > 0" text type="danger" @click="clearCart">
        清空购物车
      </el-button>
    </div>

    <!-- 空购物车 -->
    <div v-if="cartItems.length === 0" class="empty-cart">
      <el-empty description="购物车空空如也">
        <el-button type="primary" @click="goShopping">去逛逛</el-button>
      </el-empty>
    </div>

    <!-- 购物车列表 -->
    <div v-else class="cart-content">
      <div class="cart-list">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <el-checkbox :model-value="getItemChecked(item)" @change="updateItemCheck(item, $event)"
            :title="`选择商品：${getItemProp(item, 'productName')}`" />

          <div class="product-image">
            <img :src="getItemProp(item, 'productPic')" :alt="getItemProp(item, 'productName')" />
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ getItemProp(item, 'productName') }}</h3>
            <p class="product-attr" v-if="getItemProp(item, 'productAttr')">
              {{ formatProductAttr(getItemProp(item, 'productAttr')) }}
            </p>
            <div class="price-section">
              <span class="price">¥{{ getItemProp(item, 'price') }}</span>
              <div class="quantity-control">
                <el-button size="small" :icon="Minus" @click="decreaseQuantity(item)"
                  :disabled="Number(getItemProp(item, 'quantity')) <= 1" />
                <span class="quantity">{{ getItemProp(item, 'quantity') }}</span>
                <el-button size="small" :icon="Plus" @click="increaseQuantity(item)" />
              </div>
            </div>
          </div>

          <el-button type="danger" text :icon="Delete" @click="removeItem(getItemProp(item, 'id'))" />
        </div>
      </div>

      <!-- 底部操作栏 -->
      <div class="cart-footer">
        <div class="footer-left">
          <el-checkbox :model-value="allChecked" @change="toggleAllCheck" title="全选所有商品">
            全选
          </el-checkbox>
          <span class="total-info">
            共{{ checkedCount }}件商品，合计：
            <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
          </span>
        </div>

        <el-button type="primary" size="large" :disabled="checkedCount === 0" @click="goToCheckout">
          去结算({{ checkedCount }})
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Minus, Delete } from '@element-plus/icons-vue'
import {
  cartList,
  cartDelete,
  cartUpdateQuantity,
  cartClear
} from '@/api/mall'

interface CartItem {
  id: number
  productId: number
  productName: string
  productPic: string
  price: number
  quantity: number
  checked: boolean
  productAttr?: string
}

const router = useRouter()

// 购物车数据
const cartItems = ref<CartItem[]>([])
const loading = ref(false)

// 全选状态
const allChecked = computed({
  get: () => cartItems.value.length > 0 && cartItems.value.every((item: CartItem) => item.checked),
  set: (value: boolean) => {
    cartItems.value.forEach((item: CartItem) => {
      item.checked = value
    })
  }
})

// 选中数量
const checkedCount = computed(() => {
  return cartItems.value.filter((item: CartItem) => item.checked).reduce((sum, item: CartItem) => sum + item.quantity, 0)
})

// 总价
const totalPrice = computed(() => {
  return cartItems.value
    .filter((item: CartItem) => item.checked)
    .reduce((sum, item: CartItem) => sum + item.price * item.quantity, 0)
})

// 加载购物车数据
const loadCartData = async () => {
  loading.value = true
  try {
    const response = await cartList()
    cartItems.value = response.data.map((item: unknown) => ({
      ...item as CartItem,
      checked: false
    }))
  } catch (error) {
    console.error('加载购物车失败:', error)
    ElMessage.error('加载购物车失败')
  } finally {
    loading.value = false
  }
}

// 更新商品选中状态
const updateItemCheck = (item: CartItem, checked: boolean) => {
  item.checked = checked
  // 这里可以添加后端同步逻辑
}

// 切换全选
const toggleAllCheck = (checked: boolean) => {
  cartItems.value.forEach(item => {
    item.checked = checked
  })
}

// 增加数量
const increaseQuantity = async (item: CartItem) => {
  try {
    await cartUpdateQuantity({
      id: item.id,
      quantity: item.quantity + 1
    })
    item.quantity += 1
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新失败')
  }
}

// 减少数量
const decreaseQuantity = async (item: CartItem) => {
  if (item.quantity <= 1) return

  try {
    await cartUpdateQuantity({
      id: item.id,
      quantity: item.quantity - 1
    })
    item.quantity -= 1
    ElMessage.success('更新成功')
  } catch (error) {
    console.error('更新数量失败:', error)
    ElMessage.error('更新失败')
  }
}

// 删除商品
const removeItem = async (itemId: number) => {
  try {
    if (!confirm('确定要删除该商品吗？')) return

    await cartDelete({ ids: String(itemId) })
    cartItems.value = cartItems.value.filter(item => item.id !== itemId)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 清空购物车
const clearCart = async () => {
  try {
    if (!confirm('确定要清空购物车吗？')) return

    await cartClear()
    cartItems.value = []
    ElMessage.success('购物车已清空')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败:', error)
      ElMessage.error('清空失败')
    }
  }
}

// 去购物
const goShopping = () => {
  router.push('/mall/home')
}

// 去结算
const goToCheckout = () => {
  const checkedItems = cartItems.value.filter(item => item.checked)
  if (checkedItems.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }

  // 将选中商品信息传递给结算页面
  const cartIds = checkedItems.map(item => item.id)
  router.push({
    path: '/mall/order/create',
    query: { cartIds: cartIds.join(',') }
  })
}

// 格式化商品属性
const formatProductAttr = (attr: string) => {
  if (!attr) return ''
  try {
    const attrs = JSON.parse(attr)
    return attrs.map((item: { key: string; value: string }) => `${item.key}: ${item.value}`).join('; ')
  } catch {
    return attr
  }
}

// 获取商品属性
const getItemProp = (item: CartItem, prop: string): any => {
  return (item as any)[prop] || ''
}

// 获取商品选中状态
const getItemChecked = (item: CartItem) => {
  return item.checked || false
}

onMounted(() => {
  loadCartData()
})
</script>

<style lang="scss" scoped>
.cart-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h2 {
    margin: 0;
    font-size: 18px;
    color: #333;
  }
}

.empty-cart {
  background: #fff;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
}

.cart-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-list {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  .product-image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .product-info {
    flex: 1;
    min-width: 0;

    .product-name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin: 0 0 8px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-attr {
      font-size: 12px;
      color: #999;
      margin: 0 0 8px 0;
    }

    .price-section {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price {
        font-size: 16px;
        font-weight: 600;
        color: #ff4757;
      }

      .quantity-control {
        display: flex;
        align-items: center;
        gap: 8px;

        .quantity {
          min-width: 40px;
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
}

.cart-footer {
  position: sticky;
  bottom: 0;
  background: #fff;
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .total-info {
      font-size: 14px;
      color: #666;

      .total-price {
        font-size: 18px;
        font-weight: 600;
        color: #ff4757;
      }
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-container {
    padding: 16px;
  }

  .cart-item {
    .product-info .price-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }

  .cart-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;

    .footer-left {
      justify-content: center;
    }
  }
}
</style>
