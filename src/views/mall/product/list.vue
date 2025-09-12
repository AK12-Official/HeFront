<template>
  <div class="product-list-container">
    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索商品" class="search-input" @keyup.enter="handleSearch">
          <template #append>
            <el-button @click="handleSearch">
              <el-icon>
                <Search />
              </el-icon>
            </el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">一级分类：</span>
          <el-select v-model="selectedFirstCategory" placeholder="请选择" clearable @change="handleFirstCategoryChange">
            <el-option v-for="category in firstCategoryList" :key="category.id" :label="category.name"
              :value="category.id" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">二级分类：</span>
          <el-select v-model="selectedSecondCategory" placeholder="请选择" clearable :disabled="!selectedFirstCategory"
            @change="handleSecondCategoryChange">
            <el-option v-for="category in secondCategoryList" :key="category.id" :label="category.name"
              :value="category.id" />
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">排序：</span>
          <el-select v-model="sortType" placeholder="默认排序" @change="handleSortChange">
            <el-option label="默认排序" value=""></el-option>
            <el-option label="价格从低到高" value="price_asc"></el-option>
            <el-option label="价格从高到低" value="price_desc"></el-option>
            <el-option label="销量优先" value="sales_desc"></el-option>
            <el-option label="最新上架" value="create_time_desc"></el-option>
          </el-select>
        </div>

        <div class="filter-item">
          <span class="filter-label">价格区间：</span>
          <el-input v-model="priceRange.min" placeholder="最低价" class="price-input" @change="handlePriceChange" />
          <span class="price-separator">-</span>
          <el-input v-model="priceRange.max" placeholder="最高价" class="price-input" @change="handlePriceChange" />
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
    <div class="product-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>

      <div v-else-if="productList.length === 0" class="empty-container">
        <div class="empty-text">暂无商品</div>
      </div>

      <div v-else class="product-grid">
        <div v-for="product in productList" :key="product.id" class="product-item"
          @click="goToProductDetail(product.id)">
          <div class="product-image">
            <img :src="product.pic" :alt="product.name" @error="handleImageError" />
            <div class="product-badge" v-if="product.promotionType">
              {{ getPromotionText(product.promotionType) }}
            </div>
          </div>

          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-subtitle" v-if="product.subTitle">{{ product.subTitle }}</p>

            <div class="product-price">
              <span class="current-price">¥{{ product.price }}</span>
              <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                ¥{{ product.originalPrice }}
              </span>
            </div>

            <div class="product-stats">
              <span class="sales">已售{{ product.sale || 0 }}件</span>
              <span class="stock">库存{{ product.stock }}件</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="total, prev, pager, next, jumper" @current-change="handlePageChange"
          @size-change="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productSearch, homeProductCateList } from '@/api/mall'
import type { ProductCategory } from '@/api/mall/types'

interface Product {
  id: number
  name: string
  subTitle?: string
  price: number
  originalPrice?: number
  pic: string
  sale?: number
  stock: number
  promotionType?: number
}

interface PriceRange {
  min: string
  max: string
}

const route = useRoute()
const router = useRouter()

// 数据
const loading = ref(false)
const productList = ref<Product[]>([])
const firstCategoryList = ref<ProductCategory[]>([]) // 一级分类列表
const secondCategoryList = ref<ProductCategory[]>([]) // 二级分类列表
const searchKeyword = ref('')
const selectedCategory = ref('0')
const selectedFirstCategory = ref<number | null>(null) // 选中的一级分类
const selectedSecondCategory = ref<number | null>(null) // 选中的二级分类
const sortType = ref('')
const priceRange = ref<PriceRange>({ min: '', max: '' })
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 获取促销类型文本
const getPromotionText = (type: number): string => {
  const promotionMap: Record<number, string> = {
    1: '限时抢购',
    2: '新品首发',
    3: '热销',
    4: '推荐'
  }
  return promotionMap[type] || ''
}

// 加载一级分类列表
const loadFirstCategoryList = async () => {
  try {
    const response = await homeProductCateList(0) // parentId=0获取一级分类
    console.log('一级分类列表响应:', response)

    if (response && response.code === 200) {
      firstCategoryList.value = response.data || []
      console.log('成功加载一级分类列表:', firstCategoryList.value.length, '个分类')
    } else {
      console.error('API返回错误:', response.message)
      firstCategoryList.value = []
    }
  } catch (error) {
    console.error('加载一级分类失败:', error)
    firstCategoryList.value = []
  }
}

// 加载二级分类列表
const loadSecondCategoryList = async (parentId: number) => {
  try {
    const response = await homeProductCateList(parentId)
    console.log('二级分类列表响应:', response)

    if (response && response.code === 200) {
      secondCategoryList.value = response.data || []
      console.log('成功加载二级分类列表:', secondCategoryList.value.length, '个分类')
    } else {
      console.error('API返回错误:', response.message)
      secondCategoryList.value = []
    }
  } catch (error) {
    console.error('加载二级分类失败:', error)
    secondCategoryList.value = []
  }
}


// 加载商品列表
const loadProductList = async () => {
  try {
    loading.value = true

    // 构建搜索参数，确保符合API接口要求
    const searchParams = {
      keyword: searchKeyword.value || undefined,
      productCategoryId: (selectedCategory.value && selectedCategory.value !== '0') ? Number(selectedCategory.value) : undefined,
      brandId: undefined, // 暂时不支持品牌筛选
      sort: getSortValue(),
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    // 清理undefined值
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof typeof searchParams] === undefined) {
        delete searchParams[key as keyof typeof searchParams]
      }
    })

    console.log('商品搜索参数:', searchParams)

    const response = await productSearch(searchParams)
    console.log('商品搜索响应:', response)

    // 检查响应格式
    if (response && typeof response === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('code' in response && (response as any).code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any).data

        // 处理两种可能的响应格式：直接数组或分页对象
        if (data) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let productData: any[] = []
          let totalCount = 0

          if (Array.isArray(data)) {
            // 直接返回数组
            productData = data
            totalCount = data.length
          } else if (data.list && Array.isArray(data.list)) {
            // 分页对象格式
            productData = data.list
            totalCount = data.total || data.totalElements || productData.length
          } else if (data.content && Array.isArray(data.content)) {
            // Spring Data分页格式
            productData = data.content
            totalCount = data.totalElements || productData.length
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          productList.value = productData.map((item: any) => ({
            id: item.id,
            name: item.name || item.productName,
            subTitle: item.subTitle || item.subtitle || item.description,
            price: Number(item.price || 0),
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            pic: item.pic || item.image || item.pictureUrl || '',
            sale: Number(item.sale || item.saleCount || 0),
            stock: Number(item.stock || 0),
            promotionType: item.promotionType
          }))

          total.value = totalCount
          console.log('成功加载商品列表:', productList.value.length, '个商品，总计:', totalCount)
        } else {
          console.warn('API返回数据为空，使用默认商品数据')
          loadDefaultProducts()
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        console.error('API返回错误:', (response as any).message)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ElMessage.error((response as any).message || '获取商品列表失败')
        loadDefaultProducts()
      }
    } else {
      console.error('API响应格式完全异常:', typeof response, response)
      ElMessage.error('获取商品列表失败')
      loadDefaultProducts()
    }
  } catch (error) {
    console.error('加载商品列表异常:', error)
    ElMessage.error('加载商品列表失败')
    loadDefaultProducts()
  } finally {
    loading.value = false
  }
}

// 获取排序值
const getSortValue = (): number => {
  switch (sortType.value) {
    case 'price_asc': return 3 // 价格从低到高
    case 'price_desc': return 4 // 价格从高到低
    case 'sales_desc': return 2 // 按销量
    case 'create_time_desc': return 1 // 按新品
    default: return 0 // 按相关度
  }
}

// 加载默认商品数据（当API失败时）
const loadDefaultProducts = () => {
  console.log('API调用失败，显示空商品列表')
  productList.value = []
  total.value = 0
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProductList()
}

// 一级分类选择变化
const handleFirstCategoryChange = async (value: number | null) => {
  currentPage.value = 1

  // 清空二级分类选择
  selectedSecondCategory.value = null
  secondCategoryList.value = []

  if (value) {
    // 加载对应的二级分类
    await loadSecondCategoryList(value)

    // 更新选中的分类ID（使用一级分类ID）
    selectedCategory.value = String(value)
  } else {
    selectedCategory.value = '0'
  }

  // 更新URL参数
  const query = { ...route.query }
  if (value) {
    query.categoryId = String(value)
  } else {
    delete query.categoryId
  }

  router.replace({
    path: route.path,
    query
  })

  // 重新加载商品列表
  loadProductList()
}

// 二级分类选择变化
const handleSecondCategoryChange = (value: number | null) => {
  currentPage.value = 1

  if (value) {
    // 使用二级分类ID作为选中的分类
    selectedCategory.value = String(value)
  } else {
    // 如果清空二级分类，回到一级分类
    selectedCategory.value = selectedFirstCategory.value ? String(selectedFirstCategory.value) : '0'
  }

  // 更新URL参数
  const query = { ...route.query }
  if (value) {
    query.categoryId = String(value)
  } else if (selectedFirstCategory.value) {
    query.categoryId = String(selectedFirstCategory.value)
  } else {
    delete query.categoryId
  }

  router.replace({
    path: route.path,
    query
  })

  // 重新加载商品列表
  loadProductList()
}

// 排序变化
const handleSortChange = () => {
  currentPage.value = 1
  loadProductList()
}

// 价格变化
const handlePriceChange = () => {
  currentPage.value = 1
  loadProductList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadProductList()
}

// 页大小变化
const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadProductList()
}

// 跳转到商品详情
const goToProductDetail = (productId: number) => {
  router.push(`/mall/product/detail/${productId}`)
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '' // 清空默认图片
}

// 监听路由参数变化
watch(
  () => route.query,
  async (newQuery) => {
    // 重置页码
    currentPage.value = 1

    if (newQuery.categoryId) {
      const categoryId = Number(newQuery.categoryId)

      // 先检查是否是一级分类
      const firstCategory = firstCategoryList.value.find(cat => cat.id === categoryId)
      if (firstCategory) {
        // 是一级分类
        selectedFirstCategory.value = categoryId
        selectedSecondCategory.value = null
        await loadSecondCategoryList(categoryId)
        selectedCategory.value = String(categoryId)
      } else {
        // 可能是二级分类，需要查找其父分类
        let found = false
        for (const firstCat of firstCategoryList.value) {
          // 先加载二级分类
          await loadSecondCategoryList(firstCat.id)
          const secondCategory = secondCategoryList.value.find(cat => cat.id === categoryId)
          if (secondCategory) {
            selectedFirstCategory.value = firstCat.id
            selectedSecondCategory.value = categoryId
            selectedCategory.value = String(categoryId)
            found = true
            break
          }
        }

        if (!found) {
          selectedFirstCategory.value = null
          selectedSecondCategory.value = null
          secondCategoryList.value = []
          selectedCategory.value = '0'
        }
      }
    } else {
      selectedFirstCategory.value = null
      selectedSecondCategory.value = null
      secondCategoryList.value = []
      selectedCategory.value = '0'
    }

    if (newQuery.keyword) {
      searchKeyword.value = newQuery.keyword as string
    } else {
      searchKeyword.value = ''
    }

    loadProductList()
  }
)

onMounted(async () => {
  console.log('onMounted: 开始加载')

  // 先加载一级分类列表
  await loadFirstCategoryList()
  console.log('onMounted: 一级分类列表加载完成')

  // 等待下一个 tick 确保 DOM 已更新
  await nextTick()

  // 处理路由参数
  if (route.query.categoryId) {
    const categoryId = Number(route.query.categoryId)

    // 先检查是否是一级分类
    const firstCategory = firstCategoryList.value.find(cat => cat.id === categoryId)
    if (firstCategory) {
      // 是一级分类
      selectedFirstCategory.value = categoryId
      selectedSecondCategory.value = null
      await loadSecondCategoryList(categoryId)
      selectedCategory.value = String(categoryId)
    } else {
      // 可能是二级分类，需要查找其父分类
      let found = false
      for (const firstCat of firstCategoryList.value) {
        // 先加载二级分类
        await loadSecondCategoryList(firstCat.id)
        const secondCategory = secondCategoryList.value.find(cat => cat.id === categoryId)
        if (secondCategory) {
          selectedFirstCategory.value = firstCat.id
          selectedSecondCategory.value = categoryId
          selectedCategory.value = String(categoryId)
          found = true
          break
        }
      }

      if (!found) {
        selectedFirstCategory.value = null
        selectedSecondCategory.value = null
        secondCategoryList.value = []
        selectedCategory.value = '0'
      }
    }
    console.log('onMounted: 设置分类ID为', selectedCategory.value)
  } else {
    selectedFirstCategory.value = null
    selectedSecondCategory.value = null
    secondCategoryList.value = []
    selectedCategory.value = '0'
    console.log('onMounted: 设置默认分类')
  }

  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword as string
  } else {
    searchKeyword.value = ''
  }

  // 再次等待 DOM 更新
  await nextTick()

  // 检查选中的分类是否在列表中
  if (selectedCategory.value !== '0') {
    console.log('onMounted: 选中分类验证', {
      selectedCategory: selectedCategory.value,
      selectedFirstCategory: selectedFirstCategory.value,
      selectedSecondCategory: selectedSecondCategory.value,
      firstCategoryCount: firstCategoryList.value.length,
      secondCategoryCount: secondCategoryList.value.length
    })
  }

  loadProductList()
})
</script>

<style lang="scss" scoped>
.product-list-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.filter-section {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #eee;

  .search-bar {
    margin-bottom: 20px;

    .search-input {
      max-width: 400px;
    }
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;

    .filter-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .filter-label {
        font-size: 14px;
        color: #666;
        white-space: nowrap;
      }

      .price-input {
        width: 100px;
      }

      .price-separator {
        color: #666;
        margin: 0 4px;
      }

      // 分类选择器样式优化
      .el-select {
        min-width: 180px;
      }
    }
  }
}

.product-content {
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
    }
  }

  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;

    .product-item {
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .product-image {
        position: relative;
        width: 100%;
        height: 200px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        &:hover img {
          transform: scale(1.05);
        }

        .product-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #ff4757;
          color: white;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 12px;
        }
      }

      .product-info {
        padding: 16px;

        .product-name {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0 0 12px 0;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .product-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 12px;

          .current-price {
            font-size: 18px;
            font-weight: 600;
            color: #e53e3e;
          }

          .original-price {
            font-size: 14px;
            color: #999;
            text-decoration: line-through;
          }
        }

        .product-stats {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #999;

          .sales {
            color: #f56c6c;
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filter-section {
    padding: 16px;

    .filter-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .filter-item {
        width: 100%;
        justify-content: space-between;

        .el-select {
          flex: 1;
          max-width: 200px;
        }
      }
    }
  }

  .product-content {
    padding: 16px;

    .product-grid {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 12px;

      .product-item {
        .product-image {
          height: 120px;
        }

        .product-info {
          padding: 12px;

          .product-name {
            font-size: 14px;
          }

          .product-subtitle {
            font-size: 12px;
          }

          .product-price .current-price {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>
