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
          <el-select v-model="selectedCategory" :key="`category-${categoryList.length}`" placeholder="全部分类"
            @change="handleCategoryChange">
            <el-option label="全部分类" value="0"></el-option>
            <el-option v-for="category in categoryList" :key="category.id" :label="category.name"
              :value="String(category.id)"></el-option>
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
import { productSearch, productCategoryTreeList } from '@/api/mall'
import type { ProductCategoryTree } from '@/api/mall/types'

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
  level?: number
  parentId?: number
  fullPath?: string // 完整路径，用于显示
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
const categoryTreeData = ref<ProductCategoryTree[]>([]) // 原始分类树数据
const searchKeyword = ref('')
const selectedCategory = ref('0')
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
          // 保存原始分类树数据
          categoryTreeData.value = data

          // 处理树形结构的分类数据，展平为一级列表
          const flatCategories: Category[] = []

          // 递归处理分类树，生成带层级的分类选项
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const flattenCategories = (categories: any[], level = 0, parentPath = '') => {
            categories.forEach((category) => {
              if (category.showStatus === 1) { // 只显示启用的分类
                const prefix = '　'.repeat(level) // 使用全角空格表示层级
                const displayName = level > 0 ? `${prefix}${category.name}` : category.name
                const fullPath = parentPath ? `${parentPath} > ${category.name}` : category.name

                flatCategories.push({
                  id: category.id,
                  name: displayName,
                  level: category.level || level,
                  parentId: category.parentId,
                  fullPath: fullPath
                })

                // 递归处理子分类
                if (category.children && Array.isArray(category.children) && category.children.length > 0) {
                  flattenCategories(category.children, level + 1, fullPath)
                }
              }
            })
          }

          flattenCategories(data)
          categoryList.value = flatCategories
          console.log('成功加载分类列表:', categoryList.value.length, '个分类')

          // 调试：检查当前选中的分类是否在列表中
          if (selectedCategory.value && selectedCategory.value !== '0') {
            const foundCategory = categoryList.value.find(cat => String(cat.id) === selectedCategory.value)
            if (foundCategory) {
              console.log('找到选中的分类:', foundCategory.name)
            } else {
              console.warn('未找到选中的分类ID:', selectedCategory.value)
            }
          }
        } else {
          console.warn('API返回分类数据格式异常，使用默认分类数据')
          loadDefaultCategories()
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // 一级分类
    { id: 1, name: '服装鞋包', level: 0, parentId: 0, fullPath: '服装鞋包' },
    { id: 7, name: '　外套', level: 1, parentId: 1, fullPath: '服装鞋包 > 外套' },
    { id: 43, name: '　　羽绒服', level: 2, parentId: 7, fullPath: '服装鞋包 > 外套 > 羽绒服' },
    { id: 44, name: '　　风衣', level: 2, parentId: 7, fullPath: '服装鞋包 > 外套 > 风衣' },
    { id: 8, name: '　鞋靴', level: 1, parentId: 1, fullPath: '服装鞋包 > 鞋靴' },
    { id: 45, name: '　　运动鞋', level: 2, parentId: 8, fullPath: '服装鞋包 > 鞋靴 > 运动鞋' },

    { id: 2, name: '手机数码', level: 0, parentId: 0, fullPath: '手机数码' },
    { id: 9, name: '　手机通讯', level: 1, parentId: 2, fullPath: '手机数码 > 手机通讯' },
    { id: 10, name: '　数码配件', level: 1, parentId: 2, fullPath: '手机数码 > 数码配件' },

    { id: 3, name: '电脑办公', level: 0, parentId: 0, fullPath: '电脑办公' },
    { id: 11, name: '　笔记本电脑', level: 1, parentId: 3, fullPath: '电脑办公 > 笔记本电脑' },
    { id: 12, name: '　台式机', level: 1, parentId: 3, fullPath: '电脑办公 > 台式机' },
    { id: 13, name: '　办公设备', level: 1, parentId: 3, fullPath: '电脑办公 > 办公设备' },

    { id: 4, name: '家用电器', level: 0, parentId: 0, fullPath: '家用电器' },
    { id: 14, name: '　大家电', level: 1, parentId: 4, fullPath: '家用电器 > 大家电' },
    { id: 15, name: '　小家电', level: 1, parentId: 4, fullPath: '家用电器 > 小家电' },

    { id: 5, name: '家居生活', level: 0, parentId: 0, fullPath: '家居生活' },
    { id: 16, name: '　家具', level: 1, parentId: 5, fullPath: '家居生活 > 家具' },
    { id: 17, name: '　家纺', level: 1, parentId: 5, fullPath: '家居生活 > 家纺' },

    { id: 6, name: '图书音像', level: 0, parentId: 0, fullPath: '图书音像' },
    { id: 18, name: '　图书', level: 1, parentId: 6, fullPath: '图书音像 > 图书' },
    { id: 19, name: '　音像制品', level: 1, parentId: 6, fullPath: '图书音像 > 音像制品' }
  ]
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
            pic: item.pic || item.image || item.pictureUrl || '/img/products/default.jpg',
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
  console.log('使用默认商品数据')
  const mockProducts: Product[] = [
    // 手机数码类
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      subTitle: '钛金属材质，A17 Pro芯片，专业级摄影系统',
      price: 9999,
      originalPrice: 10999,
      pic: '/img/products/iphone15.jpg',
      sale: 1200,
      stock: 50,
      promotionType: 1
    },
    {
      id: 2,
      name: '华为Mate 60 Pro',
      subTitle: '卫星通话，鸿蒙4.0系统',
      price: 6999,
      originalPrice: 7999,
      pic: '/img/products/huawei-mate60.jpg',
      sale: 800,
      stock: 30,
      promotionType: 2
    },
    {
      id: 3,
      name: 'AirPods Pro 2',
      subTitle: '主动降噪，空间音频，无线充电盒',
      price: 1899,
      pic: '/img/products/airpods.jpg',
      sale: 2500,
      stock: 100,
      promotionType: 3
    },
    // 电脑办公类
    {
      id: 4,
      name: 'MacBook Pro 14英寸',
      subTitle: 'M3芯片，性能强劲，专业创作首选',
      price: 14999,
      originalPrice: 16999,
      pic: '/img/products/macbook.jpg',
      sale: 400,
      stock: 20,
      promotionType: 2
    },
    {
      id: 5,
      name: 'ThinkPad X1 Carbon',
      subTitle: '商务轻薄本，Intel第13代处理器',
      price: 12999,
      originalPrice: 14999,
      pic: '/img/products/thinkpad.jpg',
      sale: 300,
      stock: 25,
    },
    {
      id: 6,
      name: 'Magic Keyboard',
      subTitle: '无线键盘，背光设计，支持多设备',
      price: 799,
      pic: '/img/products/keyboard.jpg',
      sale: 600,
      stock: 120
    },
    // 家用电器类
    {
      id: 7,
      name: '海尔冰箱 BCD-452',
      subTitle: '452升大容量，变频节能，干湿分储',
      price: 3999,
      originalPrice: 4999,
      pic: '/img/products/refrigerator.jpg',
      sale: 150,
      stock: 15,
      promotionType: 1
    },
    {
      id: 8,
      name: '美的空调 KFR-35GW',
      subTitle: '1.5匹变频空调，静音节能，智能控制',
      price: 2699,
      originalPrice: 3199,
      pic: '/img/products/air-conditioner.jpg',
      sale: 200,
      stock: 30,
    },
    {
      id: 9,
      name: '戴森吸尘器 V15',
      subTitle: '激光显尘技术，强力除螨，无绳便携',
      price: 4199,
      pic: '/img/products/dyson-v15.jpg',
      sale: 80,
      stock: 40,
      promotionType: 4
    },
    // 服装鞋帽类
    {
      id: 10,
      name: 'Nike Air Jordan 1',
      subTitle: '经典篮球鞋，复古设计，舒适透气',
      price: 1299,
      originalPrice: 1599,
      pic: '/img/products/jordan1.jpg',
      sale: 500,
      stock: 60,
      promotionType: 3
    },
    {
      id: 11,
      name: 'Uniqlo羽绒服',
      subTitle: '轻薄保暖，防风防水，多色可选',
      price: 399,
      originalPrice: 599,
      pic: '/img/products/uniqlo-down.jpg',
      sale: 800,
      stock: 100,
    },
    {
      id: 12,
      name: 'Levi\'s 501牛仔裤',
      subTitle: '经典直筒版型，优质棉质面料',
      price: 599,
      pic: '/img/products/levis-501.jpg',
      sale: 300,
      stock: 80,
    },
    // 家居生活类
    {
      id: 13,
      name: 'IKEA书桌 BEKANT',
      subTitle: '简约现代设计，环保材质，易于组装',
      price: 799,
      originalPrice: 999,
      pic: '/img/products/ikea-desk.jpg',
      sale: 200,
      stock: 50,
    },
    {
      id: 14,
      name: '小米扫地机器人',
      subTitle: '激光导航，智能规划，自动回充',
      price: 1699,
      pic: '/img/products/mi-robot.jpg',
      sale: 400,
      stock: 35,
      promotionType: 2
    },
    // 图书音像类
    {
      id: 15,
      name: '《三体》全集',
      subTitle: '刘慈欣科幻巨作，雨果奖获奖作品',
      price: 89,
      originalPrice: 120,
      pic: '/img/products/three-body.jpg',
      sale: 1000,
      stock: 200,
    },
    {
      id: 16,
      name: 'Sony WH-1000XM5',
      subTitle: '无线降噪耳机，30小时续航，高音质',
      price: 2399,
      pic: '/img/products/sony-headphones.jpg',
      sale: 300,
      stock: 45,
      promotionType: 4
    }
  ]

  // 应用筛选条件到默认数据
  let filteredProducts = [...mockProducts]

  // 分类筛选
  if (selectedCategory.value && selectedCategory.value !== '0') {
    const categoryId = Number(selectedCategory.value)
    // 根据新的分类ID进行筛选逻辑

    // 使用分类结构进行筛选，支持父子分类
    const findAllCategoryIds = (targetId: number): number[] => {
      const result = [targetId]
      const findChildren = (parentId: number) => {
        categoryList.value.forEach(cat => {
          if (cat.parentId === parentId) {
            result.push(cat.id)
            findChildren(cat.id) // 递归查找子分类
          }
        })
      }
      findChildren(targetId)
      return result
    }

    const validCategoryIds = findAllCategoryIds(categoryId)

    // 根据分类进行商品筛选（这里使用简化的映射关系）
    if (validCategoryIds.includes(1) || validCategoryIds.includes(7) || validCategoryIds.includes(8) ||
      validCategoryIds.includes(43) || validCategoryIds.includes(44) || validCategoryIds.includes(45)) {
      // 服装鞋包类
      filteredProducts = filteredProducts.filter(p => p.id >= 10 && p.id <= 12)
    } else if (validCategoryIds.includes(2) || validCategoryIds.includes(9) || validCategoryIds.includes(10)) {
      // 手机数码类
      filteredProducts = filteredProducts.filter(p => p.id <= 3)
    } else if (validCategoryIds.includes(3) || validCategoryIds.includes(11) || validCategoryIds.includes(12) || validCategoryIds.includes(13)) {
      // 电脑办公类
      filteredProducts = filteredProducts.filter(p => p.id >= 4 && p.id <= 6)
    } else if (validCategoryIds.includes(4) || validCategoryIds.includes(14) || validCategoryIds.includes(15)) {
      // 家用电器类
      filteredProducts = filteredProducts.filter(p => p.id >= 7 && p.id <= 9)
    } else if (validCategoryIds.includes(5) || validCategoryIds.includes(16) || validCategoryIds.includes(17)) {
      // 家居生活类
      filteredProducts = filteredProducts.filter(p => p.id >= 13 && p.id <= 14)
    } else if (validCategoryIds.includes(6) || validCategoryIds.includes(18) || validCategoryIds.includes(19)) {
      // 图书音像类
      filteredProducts = filteredProducts.filter(p => p.id >= 15 && p.id <= 16)
    }
  }

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

  // 分页处理
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  productList.value = paginatedProducts
  total.value = filteredProducts.length

  console.log(`筛选后商品数量: ${filteredProducts.length}, 当前页显示: ${paginatedProducts.length}`)
}

// 搜索处理
const handleSearch = () => {
  currentPage.value = 1
  loadProductList()
}

// 分类变化
const handleCategoryChange = () => {
  currentPage.value = 1

  // 更新URL参数，保持其他查询参数
  const query = { ...route.query }
  if (selectedCategory.value && selectedCategory.value !== '0') {
    query.categoryId = selectedCategory.value
  } else {
    delete query.categoryId
  }

  // 导航到新的URL（不会触发页面刷新，只更新URL）
  router.replace({
    path: route.path,
    query
  })
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
  img.src = '/img/products/default.jpg' // 使用默认图片
}

// 监听路由参数变化
watch(
  () => route.query,
  (newQuery) => {
    // 重置页码
    currentPage.value = 1

    if (newQuery.categoryId) {
      selectedCategory.value = String(newQuery.categoryId)
    } else {
      selectedCategory.value = '0'
    }

    if (newQuery.keyword) {
      searchKeyword.value = newQuery.keyword as string
    } else {
      searchKeyword.value = ''
    }

    loadProductList()
  }
  // 移除 immediate: true，因为我们在 onMounted 中手动处理初始状态
)

onMounted(async () => {
  console.log('onMounted: 开始加载')

  // 先加载分类列表，再处理路由参数
  await loadCategoryList()
  console.log('onMounted: 分类列表加载完成')

  // 等待下一个 tick 确保 DOM 已更新
  await nextTick()

  // 重新同步路由参数到组件状态
  if (route.query.categoryId) {
    selectedCategory.value = String(route.query.categoryId)
    console.log('onMounted: 设置分类ID为', selectedCategory.value)
  } else {
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
    const foundCategory = categoryList.value.find(cat => String(cat.id) === selectedCategory.value)
    console.log('onMounted: 选中分类验证', {
      selectedCategory: selectedCategory.value,
      found: !!foundCategory,
      categoryName: foundCategory?.name,
      totalCategories: categoryList.value.length
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
        min-width: 200px;

        .el-select-dropdown__item {

          // 层级分类的字体大小调整
          &.level-1 {
            padding-left: 20px;
            font-size: 13px;
          }

          &.level-2 {
            padding-left: 40px;
            font-size: 12px;
            color: #666;
          }
        }
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
