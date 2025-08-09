<template>
  <div class="product-list-container">
    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索商品" class="search-input" @keyup.enter="handleSearch">
          <template #append>
            <el-button @click="handleSearch">
              <i class="el-icon-search"></i>
            </el-button>
          </template>
        </el-input>
      </div>

      <div class="filter-bar">
        <div class="filter-item">
          <span class="filter-label">分类：</span>
          <el-select v-model="selectedCategory" placeholder="全部分类" @change="handleCategoryChange">
            <el-option label="全部分类" value=""></el-option>
            <el-option v-for="category in categoryList" :key="category.id" :label="category.name"
              :value="category.id"></el-option>
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
            <img :src="product.pic" :alt="product.name" />
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
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { productSearch, productCategoryTreeList } from '@/api/mall'

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

interface Category {
  id: number
  name: string
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
const categoryList = ref<Category[]>([])
const searchKeyword = ref('')
const selectedCategory = ref('')
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

// 加载分类列表
const loadCategoryList = async () => {
  try {
    const response = await productCategoryTreeList()
    console.log('分类列表响应:', response)

    // 检查响应格式
    if (response && typeof response === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('code' in response && (response as any).code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any).data
        if (data && Array.isArray(data)) {
          categoryList.value = data.map((item: any) => ({
            id: item.id,
            name: item.name
          }))
          console.log('成功加载分类列表:', categoryList.value.length, '个分类')
        } else {
          console.warn('API返回分类数据格式异常，使用默认分类数据')
          loadDefaultCategories()
        }
      } else {
        console.error('API返回错误:', (response as any).message)
        loadDefaultCategories()
      }
    } else {
      console.error('API响应格式异常:', typeof response, response)
      loadDefaultCategories()
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    loadDefaultCategories()
  }
}

// 加载默认分类数据（当API失败时）
const loadDefaultCategories = () => {
  console.log('使用默认分类数据')
  categoryList.value = [
    { id: 1, name: '手机数码' },
    { id: 2, name: '电脑办公' },
    { id: 3, name: '家用电器' },
    { id: 4, name: '服装鞋帽' },
    { id: 5, name: '家居生活' },
    { id: 6, name: '图书音像' }
  ]
}

// 加载商品列表
const loadProductList = async () => {
  try {
    loading.value = true

    // 构建搜索参数
    const searchParams = {
      keyword: searchKeyword.value || undefined,
      productCategoryId: selectedCategory.value ? Number(selectedCategory.value) : undefined,
      sort: getSortValue(),
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    console.log('商品搜索参数:', searchParams)

    const response = await productSearch(searchParams)
    console.log('商品搜索响应:', response)

    // 检查响应格式
    if (response && typeof response === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ('code' in response && (response as any).code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = (response as any).data
        if (data && Array.isArray(data.list)) {
          productList.value = data.list.map((item: any) => ({
            id: item.id,
            name: item.name,
            subTitle: item.subTitle || item.subtitle,
            price: item.price,
            originalPrice: item.originalPrice,
            pic: item.pic,
            sale: item.sale,
            stock: item.stock,
            promotionType: item.promotionType
          }))
          total.value = data.total || 0
          console.log('成功加载商品列表:', productList.value.length, '个商品')
        } else {
          console.warn('API返回数据格式异常，使用默认商品数据')
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
  console.log('使用默认商品数据')
  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      subTitle: '钛金属材质，A17 Pro芯片',
      price: 9999,
      originalPrice: 10999,
      pic: '/static/products/iphone15.jpg',
      sale: 1200,
      stock: 50,
      promotionType: 1
    },
    {
      id: 2,
      name: 'MacBook Pro 14英寸',
      subTitle: 'M3芯片，性能强劲',
      price: 14999,
      originalPrice: 16999,
      pic: '/static/products/macbook.jpg',
      sale: 800,
      stock: 30,
      promotionType: 2
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      subTitle: '主动降噪，空间音频',
      price: 1899,
      pic: '/static/products/airpods.jpg',
      sale: 2500,
      stock: 100,
      promotionType: 3
    },
    {
      id: 4,
      name: 'iPad Air 5',
      subTitle: 'M1芯片，10.9英寸',
      price: 4399,
      originalPrice: 4799,
      pic: '/static/products/ipad.jpg',
      sale: 600,
      stock: 80,
      promotionType: 4
    },
    {
      id: 5,
      name: 'Apple Watch Series 9',
      subTitle: '健康监测，运动追踪',
      price: 2999,
      pic: '/static/products/watch.jpg',
      sale: 900,
      stock: 60
    },
    {
      id: 6,
      name: 'Magic Keyboard',
      subTitle: '无线键盘，背光设计',
      price: 799,
      pic: '/static/products/keyboard.jpg',
      sale: 400,
      stock: 120
    }
  ]

  // 应用价格筛选到默认数据
  let filteredProducts = [...mockProducts]

  // 关键词搜索
  if (searchKeyword.value) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      (product.subTitle && product.subTitle.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    )
  }

  // 价格筛选
  if (priceRange.value.min || priceRange.value.max) {
    const minPrice = parseFloat(priceRange.value.min) || 0
    const maxPrice = parseFloat(priceRange.value.max) || Infinity
    filteredProducts = filteredProducts.filter(product =>
      product.price >= minPrice && product.price <= maxPrice
    )
  }

  // 排序
  if (sortType.value) {
    switch (sortType.value) {
      case 'price_asc':
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case 'sales_desc':
        filteredProducts.sort((a, b) => (b.sale || 0) - (a.sale || 0))
        break
      case 'create_time_desc':
        filteredProducts.sort((a, b) => b.id - a.id)
        break
    }
  }

  productList.value = filteredProducts
  total.value = filteredProducts.length
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProductList()
}

// 分类变化
const handleCategoryChange = () => {
  currentPage.value = 1
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

// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.categoryId) {
      selectedCategory.value = newQuery.categoryId as string
    }
    if (newQuery.keyword) {
      searchKeyword.value = newQuery.keyword as string
    }
    loadProductList()
  },
  { immediate: true }
)

onMounted(() => {
  loadCategoryList()
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
