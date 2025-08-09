<template>
  <div class="product-detail-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div style="padding: 40px; text-align: center; background: #fff; margin: 20px; border-radius: 8px;">
        <el-icon class="is-loading" style="font-size: 24px; margin-bottom: 10px;">
          <Loading />
        </el-icon>
        <p>正在加载商品详情...</p>
      </div>
    </div>

    <!-- 无数据显示 -->
    <div v-else-if="!product.id" class="no-data-container">
      <div style="padding: 40px; text-align: center; background: #fff; margin: 20px; border-radius: 8px;">
        <p>商品信息加载失败或商品不存在</p>
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>

    <!-- 商品详情内容 -->
    <div v-else class="product-content">
      <!-- 商品图片和基本信息 -->
      <div class="product-main">
        <div class="product-images">
          <div class="main-image">
            <img :src="currentImage" :alt="product.name" @click="showImagePreview" />
          </div>
          <div class="thumbnail-list" v-if="product.albumPics && product.albumPics.length > 0">
            <div v-for="(pic, index) in product.albumPics" :key="index" class="thumbnail-item"
              :class="{ active: currentImage === pic }" @click="currentImage = pic">
              <img :src="pic" :alt="`商品图片${index + 1}`" />
            </div>
          </div>
        </div>

        <div class="product-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <p class="product-subtitle" v-if="product.subTitle">{{ product.subTitle }}</p>

          <div class="price-section">
            <div class="current-price">
              <span class="currency">¥</span>
              <span class="price">{{ product.price }}</span>
            </div>
            <div class="original-price" v-if="product.originalPrice && product.originalPrice > product.price">
              <span>原价：¥{{ product.originalPrice }}</span>
            </div>
          </div>

          <!-- 商品规格选择 -->
          <div class="spec-section"
            v-if="product.productAttributeValueList && product.productAttributeValueList.length > 0">
            <div v-for="attr in groupedAttributes" :key="attr.attributeId" class="spec-group">
              <label class="spec-label">{{ attr.attributeName }}：</label>
              <div class="spec-options">
                <div v-for="value in attr.values" :key="value.id" class="spec-option" :class="{
                  active: selectedSpecs[attr.attributeId] === value.value,
                  disabled: !value.available
                }" @click="selectSpec(attr.attributeId, value.value)">
                  {{ value.value }}
                </div>
              </div>
            </div>
          </div>

          <!-- 购买数量 -->
          <div class="quantity-section">
            <label class="quantity-label">数量：</label>
            <div class="quantity-control">
              <el-button size="small" @click="decreaseQuantity" :disabled="quantity <= 1">-</el-button>
              <el-input v-model.number="quantity" size="small" class="quantity-input" @change="handleQuantityChange"
                title="商品数量" />
              <el-button size="small" @click="increaseQuantity" :disabled="quantity >= product.stock">+</el-button>
            </div>
            <span class="stock-info">库存{{ product.stock }}件</span>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button type="warning" size="large" class="add-cart-btn" @click="addToCart" :loading="addingToCart">
              加入购物车
            </el-button>
            <el-button type="danger" size="large" class="buy-now-btn" @click="buyNow" :loading="buying">
              立即购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- 商品详情 -->
      <div class="product-detail">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="detail-content">
              <div v-if="product.detailHtml" v-html="product.detailHtml"></div>
              <div v-else class="no-detail">
                <p>暂无商品详情</p>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="规格参数" name="params"
            v-if="product.productAttributeValueList && product.productAttributeValueList.length > 0">
            <div class="params-content">
              <div v-for="attr in product.productAttributeValueList" :key="attr.id" class="param-item">
                <span class="param-name">{{ attr.productAttributeName }}：</span>
                <span class="param-value">{{ attr.value }}</span>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 图片预览 -->
      <el-dialog v-model="imagePreviewVisible" title="商品图片预览" width="80%" center>
        <div class="image-preview">
          <img :src="currentImage" alt="商品图片" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productDetail, cartAdd, cartList } from '@/api/mall'
import type { CommonResult, Product, ProductAttributeValue } from '@/api/mall/types'

// 扩展的商品信息（用于详情页显示）
interface ProductDetailInfo extends Product {
  productAttributeValueList?: ProductAttributeValue[]
}

interface AttributeGroup {
  attributeId: number
  attributeName: string
  values: { id: number; value: string; available: boolean }[]
}

const route = useRoute()
const router = useRouter()

// 数据
const product = ref<ProductDetailInfo>({
  id: 0,
  name: '加载中...',
  price: 0,
  stock: 0,
  pic: ''
})
const quantity = ref(1)
const selectedSpecs = ref<Record<number, string>>({})
const currentImage = ref('')
const activeTab = ref('detail')
const imagePreviewVisible = ref(false)
const addingToCart = ref(false)
const buying = ref(false)
const loading = ref(true)

// 计算属性
const groupedAttributes = computed<AttributeGroup[]>(() => {
  if (!product.value.productAttributeValueList) return []

  const groups: Record<number, AttributeGroup> = {}

  product.value.productAttributeValueList.forEach(attr => {
    if (!groups[attr.productAttributeId]) {
      groups[attr.productAttributeId] = {
        attributeId: attr.productAttributeId,
        attributeName: attr.productAttributeName,
        values: []
      }
    }

    groups[attr.productAttributeId].values.push({
      id: attr.id,
      value: attr.value,
      available: true // 这里可以根据库存等信息判断是否可选
    })
  })

  return Object.values(groups)
})

// 加载商品详情
const loadProductDetail = async () => {
  loading.value = true
  try {
    const productId = route.params.id

    if (!productId) {
      ElMessage.error('商品ID不存在')
      router.back()
      return
    }

    const response = await productDetail(Number(productId))
    // Mock数据直接返回扩展的Product对象
    product.value = response.data as unknown as ProductDetailInfo || {
      id: 0,
      name: '商品不存在',
      price: 0,
      stock: 0,
      pic: ''
    }

    // 设置默认图片
    if (product.value.albumPics && product.value.albumPics.length > 0) {
      currentImage.value = product.value.albumPics[0]
    } else if (product.value.pic) {
      currentImage.value = product.value.pic
    }
  } catch (error) {
    console.error('加载商品详情失败:', error)
    ElMessage.error('加载商品详情失败')
  } finally {
    loading.value = false
  }
}// 选择规格
const selectSpec = (attributeId: number, value: string) => {
  selectedSpecs.value[attributeId] = value
}

// 数量控制
const increaseQuantity = () => {
  if (quantity.value < product.value.stock) {
    quantity.value++
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const handleQuantityChange = (value: number) => {
  if (value < 1) {
    quantity.value = 1
  } else if (value > product.value.stock) {
    quantity.value = product.value.stock
  }
}

// 显示图片预览
const showImagePreview = () => {
  imagePreviewVisible.value = true
}

// 加入购物车
const addToCart = async () => {
  try {
    addingToCart.value = true

    // 检查规格是否选择完整
    const requiredSpecs = groupedAttributes.value
    for (const spec of requiredSpecs) {
      if (!selectedSpecs.value[spec.attributeId]) {
        ElMessage.warning(`请选择${spec.attributeName}`)
        return
      }
    }

    // 调用加入购物车API
    // 如果没有复杂的SKU系统，可以使用商品ID作为SKU ID
    await cartAdd({
      productId: product.value.id,
      productSkuId: product.value.id, // 暂时使用商品ID作为SKU ID
      quantity: quantity.value
    })

    ElMessage.success('已加入购物车')
  } catch (error) {
    console.error('加入购物车失败:', error)
    ElMessage.error('加入购物车失败')
  } finally {
    addingToCart.value = false
  }
}

// 立即购买
const buyNow = async () => {
  try {
    buying.value = true

    // 检查规格是否选择完整
    const requiredSpecs = groupedAttributes.value
    for (const spec of requiredSpecs) {
      if (!selectedSpecs.value[spec.attributeId]) {
        ElMessage.warning(`请选择${spec.attributeName}`)
        return
      }
    }

    // 先添加到购物车
    const cartData = {
      productId: product.value.id,
      quantity: quantity.value,
      productSkuId: product.value.id, // 如果没有SKU，使用产品ID
      memberId: 1, // 这里应该从用户状态获取
      memberUsername: 'user', // 这里应该从用户状态获取
      price: product.value.price,
      productPic: product.value.pic || '',
      productName: product.value.name,
      productSubTitle: product.value.subTitle || '',
      productSkuCode: '',
      memberNickname: 'user',
      createDate: new Date().toISOString(),
      modifyDate: new Date().toISOString(),
      deleteStatus: 0,
      productCategoryId: 1,
      productBrand: '',
      productSn: '',
      productAttr: Object.values(selectedSpecs.value).join(' ')
    }

    // 调用添加购物车API
    const cartResponse = await cartAdd(cartData) as unknown as CommonResult<number>

    console.log('添加购物车响应:', cartResponse)

    if (cartResponse.code === 200) {
      // 如果添加成功，获取购物车列表来找到刚添加的商品
      const cartListResponse = await cartList() as unknown as CommonResult<{ id: number, productId: number }[]>

      if (cartListResponse.code === 200 && cartListResponse.data) {
        // 找到当前商品的购物车项
        const currentCartItem = cartListResponse.data.find(item => item.productId === product.value.id)

        if (currentCartItem) {
          // 跳转到订单确认页面，传递购物车ID
          router.push({
            path: '/mall/order/create',
            query: {
              cartIds: currentCartItem.id.toString()
            }
          })
        } else {
          ElMessage.error('无法找到购物车商品')
        }
      } else {
        ElMessage.error('获取购物车信息失败')
      }
    } else {
      ElMessage.error(cartResponse.message || '添加购物车失败')
    }
  } catch (error) {
    console.error('立即购买失败:', error)
    ElMessage.error('立即购买失败')
  } finally {
    buying.value = false
  }
}

onMounted(() => {
  loadProductDetail()
})
</script>

<style lang="scss" scoped>
.product-detail-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.product-main {
  display: flex;
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  gap: 30px;

  .product-images {
    flex: 1;
    max-width: 500px;

    .main-image {
      width: 100%;
      height: 400px;
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 10px;
      cursor: pointer;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .thumbnail-list {
      display: flex;
      gap: 10px;
      overflow-x: auto;

      .thumbnail-item {
        width: 60px;
        height: 60px;
        border: 2px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        flex-shrink: 0;

        &.active {
          border-color: #409eff;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  .product-info {
    flex: 1;

    .product-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      line-height: 1.4;
    }

    .product-subtitle {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
      line-height: 1.5;
    }

    .price-section {
      margin-bottom: 30px;

      .current-price {
        display: flex;
        align-items: baseline;
        margin-bottom: 8px;

        .currency {
          font-size: 18px;
          color: #e53e3e;
          margin-right: 2px;
        }

        .price {
          font-size: 32px;
          font-weight: 600;
          color: #e53e3e;
        }
      }

      .original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
      }
    }

    .spec-section {
      margin-bottom: 30px;

      .spec-group {
        margin-bottom: 20px;

        .spec-label {
          display: block;
          font-size: 14px;
          color: #333;
          margin-bottom: 10px;
        }

        .spec-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;

          .spec-option {
            padding: 8px 16px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
              border-color: #409eff;
            }

            &.active {
              border-color: #409eff;
              background: #409eff;
              color: #fff;
            }

            &.disabled {
              opacity: 0.5;
              cursor: not-allowed;
              background: #f5f5f5;
            }
          }
        }
      }
    }

    .quantity-section {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      gap: 10px;

      .quantity-label {
        font-size: 14px;
        color: #333;
      }

      .quantity-control {
        display: flex;
        align-items: center;

        .quantity-input {
          width: 60px;
          margin: 0 5px;

          :deep(.el-input__inner) {
            text-align: center;
          }
        }
      }

      .stock-info {
        font-size: 14px;
        color: #666;
      }
    }

    .action-buttons {
      display: flex;
      gap: 15px;

      .add-cart-btn,
      .buy-now-btn {
        height: 50px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 6px;
        min-width: 140px;
      }
    }
  }
}

.product-detail {
  background: #fff;
  padding: 20px;

  .detail-content {
    line-height: 1.6;

    :deep(img) {
      max-width: 100%;
      height: auto;
    }

    .no-detail {
      text-align: center;
      padding: 40px;
      color: #999;
      background: #f9f9f9;
      border-radius: 4px;
    }
  }

  .params-content {
    .param-item {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;

      .param-name {
        width: 120px;
        color: #666;
        flex-shrink: 0;
      }

      .param-value {
        color: #333;
      }
    }
  }
}

.image-preview {
  text-align: center;

  img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .product-main {
    flex-direction: column;
    padding: 16px;
    gap: 20px;

    .product-images {
      max-width: none;

      .main-image {
        height: 300px;
      }
    }

    .product-info {
      .product-title {
        font-size: 20px;
      }

      .price-section .current-price .price {
        font-size: 28px;
      }

      .action-buttons {
        flex-direction: column;

        .add-cart-btn,
        .buy-now-btn {
          width: 100%;
        }
      }
    }
  }

  .product-detail {
    padding: 16px;
  }
}
</style>
