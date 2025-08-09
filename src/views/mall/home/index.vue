<template>
  <div class="mall-home">
    <!-- 头部搜索栏 -->
    <div class="header-section">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索商品" size="large" :prefix-icon="Search"
          @keyup.enter="handleSearch">
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="carousel-section">
      <el-carousel height="240px" :interval="4000" indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" @click="handleBannerClick(banner)">
            <img :src="banner.pic" :alt="banner.name" @error="handleImageError" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 功能分类 -->
    <div class="category-section">
      <div class="category-grid">
        <div v-for="category in categories" :key="category.id" class="category-item" @click="goToCategory(category.id)">
          <div class="category-icon">
            <img :src="category.icon" :alt="category.name" @error="handleImageError" />
          </div>
          <span class="category-name">{{ category.name }}</span>
        </div>
      </div>
    </div>

    <!-- 新鲜好物 -->
    <div class="new-section">
      <div class="section-header">
        <el-icon>
          <Star />
        </el-icon>
        <span class="section-title">新鲜好物</span>
        <span class="section-subtitle">为你寻觅世间好物</span>
        <el-button text type="primary" @click="goToNewProducts">
          查看更多 <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>

      <div class="product-scroll">
        <div v-for="product in newProducts" :key="product.id" class="product-item" @click="goToProduct(product.id)">
          <img :src="product.pic" :alt="product.name" @error="handleImageError" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-subtitle">{{ product.subTitle }}</div>
          <div class="product-price">¥{{ product.price }}</div>
        </div>
      </div>
    </div>

    <!-- 人气推荐 -->
    <div class="hot-section">
      <div class="section-header">
        <el-icon>
          <TrendCharts />
        </el-icon>
        <span class="section-title">人气推荐</span>
        <span class="section-subtitle">大家都赞不绝口的</span>
        <el-button text type="primary" @click="goToHotProducts">
          查看更多 <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>

      <div class="hot-products">
        <div v-for="product in hotProducts" :key="product.id" class="hot-product-item" @click="goToProduct(product.id)">
          <img :src="product.pic" :alt="product.name" @error="handleImageError" />
          <div class="product-info">
            <div class="product-name">{{ product.name }}</div>
            <div class="product-subtitle">{{ product.subTitle }}</div>
            <div class="product-price">¥{{ product.price }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 猜你喜欢 -->
    <div class="recommend-section">
      <div class="section-header">
        <el-icon>
          <MagicStick />
        </el-icon>
        <span class="section-title">猜你喜欢</span>
        <span class="section-subtitle">你喜欢的都在这里了</span>
      </div>

      <div class="recommend-products" ref="recommendContainer">
        <div v-for="product in recommendProducts" :key="product.id" class="recommend-item"
          @click="goToProduct(product.id)">
          <img :src="product.pic" :alt="product.name" @error="handleImageError" />
          <div class="product-name">{{ product.name }}</div>
          <div class="product-subtitle">{{ product.subTitle }}</div>
          <div class="product-price">¥{{ product.price }}</div>
          <div v-if="product.recommendReason" class="recommend-tag">{{ product.recommendReason }}</div>
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination-section" v-if="recommendProducts.length > 0">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="totalRecommendCount"
          :pager-count="5" layout="prev, pager, next" @current-change="handlePageChange" :hide-on-single-page="false"
          small />
      </div>

      <!-- 加载状态 -->
      <div class="loading-section" v-if="isLoadingMore">
        <el-loading element-loading-text="正在加载商品..." element-loading-background="rgba(255, 255, 255, 0.8)" />
        <div class="loading-text">
          <el-icon class="is-loading">
            <Loading />
          </el-icon>
          <span>正在为您推荐商品...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Search,
  Star,
  TrendCharts,
  MagicStick,
  ArrowRight,
  Loading
} from '@element-plus/icons-vue'
import {
  homeContent,
  homeRecommendProductList
} from '@/api/mall'

const router = useRouter()
const searchKeyword = ref('')
const loading = ref(true)

// 首页数据
interface Banner {
  id: number
  name: string
  pic: string
  url?: string
}

interface Category {
  id: number
  name: string
  icon: string
}

interface Product {
  id: number
  name: string
  subTitle?: string
  pic: string
  price: number
  recommendReason?: string
}

const banners = ref<Banner[]>([])
const categories = ref<Category[]>([])
const newProducts = ref<Product[]>([])
const hotProducts = ref<Product[]>([])
const recommendProducts = ref<Product[]>([])

// 无限滚动相关状态改为分页相关状态
const isLoadingMore = ref(false)
const currentPage = ref(1)
const pageSize = 24
const totalRecommendCount = ref(0)
const recommendContainer = ref<HTMLElement>()

// 加载首页数据
const loadHomeData = async () => {
  try {
    const response = await homeContent()
    const data = response.data

    banners.value = (data.advertiseList || []) as Banner[]
    newProducts.value = (data.newProductList || []) as Product[]
    hotProducts.value = (data.hotProductList || []) as Product[]

    // 使用后端返回的分类数据，如果没有则使用默认分类
    if (data.subjectList && data.subjectList.length > 0) {
      categories.value = data.subjectList.slice(0, 8).map((subject: { categoryId: number; title: string; pic: string }) => ({
        id: subject.categoryId,
        name: subject.title,
        icon: subject.pic
      }))
    } else {
      // 默认分类数据
      categories.value = [
        { id: 1, name: '手机通讯', icon: 'https://picsum.photos/50/50?random=301' },
        { id: 2, name: '电脑办公', icon: 'https://picsum.photos/50/50?random=302' },
        { id: 3, name: '数码配件', icon: 'https://picsum.photos/50/50?random=303' },
        { id: 4, name: '家用电器', icon: 'https://picsum.photos/50/50?random=304' },
        { id: 5, name: '服饰鞋帽', icon: 'https://picsum.photos/50/50?random=305' },
        { id: 6, name: '美妆护肤', icon: 'https://picsum.photos/50/50?random=306' },
        { id: 7, name: '食品饮料', icon: 'https://picsum.photos/50/50?random=307' },
        { id: 8, name: '运动户外', icon: 'https://picsum.photos/50/50?random=309' }
      ]
    }
  } catch (error) {
    console.error('加载首页数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载推荐商品
const loadRecommendProducts = async (page = 1) => {
  if (isLoadingMore.value) return

  try {
    isLoadingMore.value = true

    // Mock API使用从1开始的页码，与前端UI保持一致
    const response = await homeRecommendProductList(page, pageSize)
    const newProducts = (response.data?.list || []) as Product[]

    // 替换数据
    recommendProducts.value = newProducts

    // 更新总数和当前页
    totalRecommendCount.value = response.data?.total || 0
    currentPage.value = page

  } catch (error) {
    console.error('加载推荐商品失败:', error)
    ElMessage.error('加载推荐商品失败')
  } finally {
    isLoadingMore.value = false
  }
}

// 分页改变处理
const handlePageChange = async (page: number) => {
  await loadRecommendProducts(page)
  // 滚动到推荐商品区域顶部
  if (recommendContainer.value) {
    recommendContainer.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// 搜索处理
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push(`/mall/product/list?keyword=${encodeURIComponent(searchKeyword.value)}`)
  }
}

// 轮播图点击
const handleBannerClick = (banner: Banner) => {
  if (banner.url) {
    window.open(banner.url, '_blank')
  }
}

// 跳转分类
const goToCategory = (categoryId: number) => {
  router.push(`/mall/product/list?categoryId=${categoryId}`)
}

// 跳转商品详情
const goToProduct = (productId: number) => {
  router.push(`/mall/product/detail/${productId}`)
}

// 跳转新品列表
const goToNewProducts = () => {
  router.push('/mall/product/list?type=new')
}

// 跳转热销列表
const goToHotProducts = () => {
  router.push('/mall/product/list?type=hot')
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // 使用一个简单的灰色占位图
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDODcuMjk3NSA3MCA3NyA4MC4yOTc1IDc3IDkzUzg3LjI5NzUgMTE2IDEwMCAxMTZTMTIzIDEwNS43MDI1IDEyMyA5M1MxMTIuNzAyNSA3MCAxMDAgNzBaTTEwMCAxMDVDOTMuOTI0OSAxMDUgODkgMTAwLjA3NSA4OSA5NFM5My45MjQ5IDgzIDEwMCA4M1MxMTEgODcuOTI0OSAxMTEgOTRTMTA2LjA3NSAxMDUgMTAwIDEwNVoiIGZpbGw9IiNEREREREQiLz4KPHBhdGggZD0iTTE0MS43NSAxMzBIMTI4LjI1QzEyNy4wMSAxMzAgMTI2IDEzMS4wMSAxMjYgMTMyLjI1VjEzN0gxNDRWMTMyLjI1QzE0NCAxMzEuMDEgMTQyLjk5IDEzMCAxNDEuNzUgMTMwWiIgZmlsbD0iI0RERERERCIvPgo8L3N2Zz4K'
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      loadHomeData(),
      loadRecommendProducts(1)
    ])
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  // 清理逻辑已移除，因为不再使用无限滚动
})
</script>

<style lang="scss" scoped>
.mall-home {
  background: #f5f5f5;
  min-height: 100vh;
}

.header-section {
  background: #fff;
  padding: 16px;
  border-bottom: 1px solid #eee;

  .search-bar {
    max-width: 600px;
    margin: 0 auto;
  }
}

.carousel-section {
  background: #fff;

  .banner-item {
    cursor: pointer;

    img {
      width: 100%;
      height: 240px;
      object-fit: cover;
    }
  }
}

.category-section {
  background: #fff;
  padding: 20px 16px;
  border-bottom: 8px solid #f5f5f5;

  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    max-width: 400px;
    margin: 0 auto;
  }

  .category-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }

    .category-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 8px;
      border-radius: 12px;
      overflow: hidden;
      background: #f8f9fa;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }

    .category-name {
      font-size: 14px;
      color: #666;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .section-subtitle {
    font-size: 14px;
    color: #999;
    margin-right: auto;
  }

  .next-time {
    font-size: 12px;
    color: #999;
  }
}

.new-section,
.hot-section,
.recommend-section {
  background: #fff;
  margin-bottom: 8px;
}

.product-scroll {
  display: flex;
  overflow-x: auto;
  padding: 16px;
  gap: 12px;

  .product-item {
    flex-shrink: 0;
    width: 140px;
    cursor: pointer;

    img {
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 8px;
    }

    .product-name {
      font-size: 14px;
      color: #333;
      margin: 8px 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-subtitle {
      font-size: 12px;
      color: #999;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .product-price {
      font-size: 14px;
      color: #ff4757;
      font-weight: 600;
    }
  }
}

.hot-products {
  padding: 16px;

  .hot-product-item {
    display: flex;
    margin-bottom: 16px;
    cursor: pointer;
    border-radius: 8px;
    overflow: hidden;
    background: #f9f9f9;

    &:last-child {
      margin-bottom: 0;
    }

    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
    }

    .product-info {
      flex: 1;
      padding: 12px;

      .product-name {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-subtitle {
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .product-price {
        font-size: 16px;
        color: #ff4757;
        font-weight: 600;
      }
    }
  }
}

.recommend-products {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  padding: 16px;

  .recommend-item {
    background: #f9f9f9;
    border-radius: 6px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.2s ease;
    position: relative;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      background: #f5f5f5;
    }

    .product-name {
      font-size: 12px;
      color: #333;
      margin: 6px 8px 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.2;
    }

    .product-subtitle {
      font-size: 10px;
      color: #999;
      margin: 0 8px 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.2;
    }

    .product-price {
      font-size: 12px;
      color: #ff4757;
      font-weight: 600;
      margin: 0 8px 8px;
    }

    .recommend-tag {
      position: absolute;
      top: 4px;
      left: 4px;
      background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
      color: white;
      padding: 1px 4px;
      border-radius: 2px;
      font-size: 8px;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
  }
}

.pagination-section {
  padding: 20px;
  display: flex;
  justify-content: center;
  background: #fff;
  border-top: 1px solid #eee;
}

.loading-section {
  padding: 20px;
  text-align: center;
  position: relative;
  min-height: 60px;

  .loading-text {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #666;
    font-size: 14px;

    .is-loading {
      animation: rotating 2s linear infinite;
    }
  }
}

.no-more-section {
  padding: 20px;
  text-align: center;

  .no-more-text {
    color: #999;
    font-size: 12px;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .recommend-products {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .category-grid {
    max-width: 100% !important;
  }

  .hot-products .hot-product-item {
    img {
      width: 80px;
      height: 80px;
    }
  }

  .recommend-products {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 12px;

    .recommend-item {
      img {
        height: 80px;
      }

      .product-name {
        font-size: 11px;
        margin: 4px 6px 2px;
      }

      .product-subtitle {
        font-size: 9px;
        margin: 0 6px 3px;
      }

      .product-price {
        font-size: 11px;
        margin: 0 6px 6px;
      }

      .recommend-tag {
        top: 2px;
        left: 2px;
        padding: 1px 3px;
        font-size: 7px;
      }
    }
  }

  .pagination-section {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .recommend-products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
