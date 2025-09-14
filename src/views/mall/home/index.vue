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

      <!-- 登录状态显示 -->
      <div class="auth-status">
        <div v-if="mallUserStore.isLoggedIn" class="logged-in">
          <div class="user-info">
            <img v-if="mallUserStore.state.userInfo?.icon" :src="mallUserStore.state.userInfo.icon" alt="头像"
              class="user-avatar" />
            <div class="user-details">
              <div class="username">
                欢迎，{{
                  mallUserStore.state.userInfo?.nickname ||
                  mallUserStore.state.username ||
                  '访客'
                }}
              </div>
              <div v-if="mallUserStore.state.userInfo" class="user-stats">
                <span class="stat-item">积分: {{ mallUserStore.state.userInfo.integration || 0 }}</span>
                <span class="stat-item">成长值: {{ mallUserStore.state.userInfo.growth || 0 }}</span>
              </div>
              <div v-else class="loading-user-info">
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
                <span>加载用户信息中...</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="not-logged-in">
          <div class="login-prompt">
            <el-icon class="login-icon">
              <User />
            </el-icon>
            <span class="login-text">请先登录</span>
            <el-button type="primary" size="small" @click="goToLogin">
              立即登录
            </el-button>
          </div>
        </div>
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

    <!-- 品牌推荐 -->
    <div class="brand-section" v-if="brands.length > 0">
      <div class="section-header">
        <el-icon>
          <Star />
        </el-icon>
        <span class="section-title">品牌推荐</span>
        <span class="section-subtitle">精选优质品牌</span>
      </div>
      <div class="brand-grid">
        <div v-for="brand in brands" :key="brand.id" class="brand-item" @click="goToBrand(brand.id)">
          <div class="brand-logo">
            <img :src="brand.logo" :alt="brand.name" @error="handleImageError" />
          </div>
          <span class="brand-name">{{ brand.name }}</span>
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
          <div class="product-brand" v-if="product.brandName">{{ product.brandName }}</div>
          <div class="product-price-section">
            <div class="product-price">¥{{ product.promotionPrice || product.price }}</div>
            <div v-if="product.promotionPrice && product.promotionPrice !== product.price"
              class="product-original-price">
              ¥{{ product.price }}
            </div>
          </div>
          <div v-if="product.promotionType" class="promotion-tag">
            <span v-if="product.promotionType === 1">限时抢购</span>
            <span v-else-if="product.promotionType === 2">新品首发</span>
            <span v-else-if="product.promotionType === 3">热销</span>
            <span v-else-if="product.promotionType === 4">推荐</span>
          </div>
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
            <div class="product-brand" v-if="product.brandName">{{ product.brandName }}</div>
            <div class="product-price-section">
              <div class="product-price">¥{{ product.promotionPrice || product.price }}</div>
              <div v-if="product.promotionPrice && product.promotionPrice !== product.price"
                class="product-original-price">
                ¥{{ product.price }}
              </div>
            </div>
            <div v-if="product.promotionType" class="promotion-tag">
              <span v-if="product.promotionType === 1">限时抢购</span>
              <span v-else-if="product.promotionType === 2">新品首发</span>
              <span v-else-if="product.promotionType === 3">热销</span>
              <span v-else-if="product.promotionType === 4">推荐</span>
            </div>
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
          <div class="product-brand" v-if="product.brandName">{{ product.brandName }}</div>
          <div class="product-price-section">
            <div class="product-price">¥{{ product.promotionPrice || product.price }}</div>
            <div v-if="product.promotionPrice && product.promotionPrice !== product.price"
              class="product-original-price">
              ¥{{ product.price }}
            </div>
          </div>
          <div v-if="product.promotionType" class="promotion-tag">
            <span v-if="product.promotionType === 1">限时抢购</span>
            <span v-else-if="product.promotionType === 2">新品首发</span>
            <span v-else-if="product.promotionType === 3">热销</span>
            <span v-else-if="product.promotionType === 4">推荐</span>
          </div>
        </div>
      </div>

      <!-- 分页器 - 显示分页控制 -->
      <div class="pagination-section" v-if="recommendProducts.length > 0">
        <!-- 调试信息 -->
        <div style="text-align: center; margin-bottom: 10px; font-size: 12px; color: #666;">
          当前页: {{ currentPage }} | 每页: {{ pageSize }} | 总数: {{ totalRecommendCount }} | 当前商品数: {{
            recommendProducts.length
          }}
        </div>
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
  Loading,
  User
} from '@element-plus/icons-vue'
import {
  homeContent,
  homeRecommendProductList,
  homeHotProductList,
  homeNewProductList
} from '@/api/mall'
import type { Brand, Product, PageResult } from '@/api/mall/types'
import useMallUserStore from '@/store/modules/mallUser'

const router = useRouter()
const mallUserStore = useMallUserStore()
const searchKeyword = ref('')
const loading = ref(true)

// 首页数据
interface Banner {
  id: number
  name: string
  pic: string
  url?: string
}

// 使用从API导入的Product类型，不再需要本地定义

const banners = ref<Banner[]>([])
const brands = ref<Brand[]>([])
const newProducts = ref<Product[]>([])
const hotProducts = ref<Product[]>([])
const recommendProducts = ref<Product[]>([])

// 分页相关状态
const isLoadingMore = ref(false)
const currentPage = ref(1)
const pageSize = 24
const totalRecommendCount = ref(0)
const hasMoreRecommend = ref(true)
const recommendContainer = ref<HTMLElement>()

// 加载首页数据
const loadHomeData = async () => {
  try {
    const response = await homeContent()

    // 检查响应结构
    if (!response) {
      ElMessage.error('数据格式错误')
      return
    }

    // response已经是CommonResult<T>格式，包含code、message、data字段
    if (response.code !== 200) {
      // 如果是认证错误，提示用户登录
      if (response.code === 401) {
        ElMessage.warning('请先登录后再访问商城')
        // 延迟跳转到登录页面，让用户看到提示信息
        setTimeout(() => {
          router.push('/mall/login')
        }, 1500)
      } else {
        ElMessage.error(response.message || '数据加载失败')
      }
      return
    }

    const data = response.data

    banners.value = (data.advertiseList || []) as Banner[]
    brands.value = (data.brandList || []) as Brand[]
    // 新品商品和热销商品将通过单独的API加载
  } catch (error) {
    console.error('加载首页数据失败:', error)
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 加载新品商品
const loadNewProducts = async () => {
  try {
    const response = await homeNewProductList(1, 6) // 获取6个新品商品

    // 检查响应结构
    if (!response || response.code !== 200) {
      // 如果是认证错误，提示用户登录
      if (response.code === 401) {
        ElMessage.warning('请先登录后再访问商城')
        // 延迟跳转到登录页面，让用户看到提示信息
        setTimeout(() => {
          router.push('/mall/login')
        }, 1500)
      } else {
        ElMessage.error('加载新品商品失败')
      }
      return
    }

    // API直接返回产品数组，不是分页对象
    const newProductsData = (response.data || []) as unknown as Product[]

    // 设置新品商品数据
    newProducts.value = newProductsData

  } catch (error) {
    console.error('加载新品商品失败:', error)
    ElMessage.error('加载新品商品失败')
  }
}

// 加载热销商品
const loadHotProducts = async () => {
  try {
    const response = await homeHotProductList(1, 6) // 获取6个热销商品

    // 检查响应结构
    if (!response || response.code !== 200) {
      // 如果是认证错误，提示用户登录
      if (response.code === 401) {
        ElMessage.warning('请先登录后再访问商城')
        // 延迟跳转到登录页面，让用户看到提示信息
        setTimeout(() => {
          router.push('/mall/login')
        }, 1500)
      } else {
        ElMessage.error('加载热销商品失败')
      }
      return
    }

    // API直接返回产品数组，不是分页对象
    const newProducts = (response.data || []) as unknown as Product[]

    // 设置热销商品数据
    hotProducts.value = newProducts

  } catch (error) {
    console.error('加载热销商品失败:', error)
    ElMessage.error('加载热销商品失败')
  }
}

// 加载推荐商品
const loadRecommendProducts = async (page = 1) => {
  if (isLoadingMore.value) return

  try {
    isLoadingMore.value = true

    const response = await homeRecommendProductList(page, pageSize)

    // 检查响应结构
    if (!response || response.code !== 200) {
      // 如果是认证错误，提示用户登录
      if (response.code === 401) {
        ElMessage.warning('请先登录后再访问商城')
        // 延迟跳转到登录页面，让用户看到提示信息
        setTimeout(() => {
          router.push('/mall/login')
        }, 1500)
      } else {
        ElMessage.error('加载推荐商品失败')
      }
      return
    }

    // 根据实际API响应，直接处理数组数据
    const products = response.data as Product[]

    recommendProducts.value = products || []

    // 由于API支持分页参数，我们需要模拟分页逻辑
    // 如果当前页返回的数据量等于pageSize，说明可能还有更多数据
    const currentDataLength = products?.length || 0
    totalRecommendCount.value = currentDataLength >= pageSize ? (page * pageSize) + 1 : (page - 1) * pageSize + currentDataLength
    hasMoreRecommend.value = currentDataLength >= pageSize
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

// 跳转品牌
const goToBrand = (brandId: number) => {
  // 根据brandId找到对应的品牌名
  const brand = brands.value.find(b => b.id === brandId)
  if (brand) {
    // 使用品牌名作为搜索关键词
    router.push(`/mall/product/list?keyword=${encodeURIComponent(brand.name)}`)
  } else {
    // 如果找不到品牌，使用默认跳转
    router.push('/mall/product/list')
  }
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

// 跳转到登录页
const goToLogin = () => {
  router.push('/mall/login')
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  // 使用一个简单的灰色占位图
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDODcuMjk3NSA3MCA3NyA4MC4yOTc1IDc3IDkzUzg3LjI5NzUgMTE2IDEwMCAxMTZTMTIzIDEwNS43MDI1IDEyMyA5M1MxMTIuNzAyNSA3MCAxMDAgNzBaTTEwMCAxMDVDOTMuOTI0OSAxMDUgODkgMTAwLjA3NSA4OSA5NFM5My45MjQ5IDgzIDEwMCA4M1MxMTEgODcuOTI0OSAxMTEgOTRTMTA2LjA3NSAxMDUgMTAwIDEwNVoiIGZpbGw9IiNEREREREQiLz4KPHBhdGggZD0iTTE0MS43NSAxMzBIMTI4LjI1QzEyNy4wMSAxMzAgMTI2IDEzMS4wMSAxMjYgMTMyLjI1VjEzN0gxNDRWMTMyLjI1QzE0NCAxMzEuMDEgMTQyLjk5IDEzMCAxNDEuNzUgMTMwWiIgZmlsbD0iI0RERERERCIvPgo8L3N2Zz4K'
}

// 加载用户信息
const loadUserInfo = async () => {
  if (mallUserStore.isLoggedIn && !mallUserStore.state.userInfo) {
    try {
      const { ssoInfo } = await import('@/api/sso')
      const response = await ssoInfo()
      if (response.code === 200) {
        mallUserStore.setUserInfo(response.data)
      }
    } catch (error) {
      console.error('加载用户信息失败:', error)
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    // 先加载用户信息，再加载其他数据
    await loadUserInfo()

    await Promise.all([
      loadHomeData(),
      loadNewProducts(),
      loadHotProducts(),
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

  .auth-status {
    text-align: center;
    margin-top: 8px;
    font-size: 14px;

    .logged-in {
      .user-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #67c23a, #85ce61);
        border-radius: 20px;
        color: white;
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.3);
          object-fit: cover;
        }

        .user-details {
          text-align: left;

          .username {
            font-weight: 600;
            font-size: 14px;
            margin-bottom: 2px;
          }

          .user-stats {
            display: flex;
            gap: 12px;
            font-size: 12px;
            opacity: 0.9;

            .stat-item {
              background: rgba(255, 255, 255, 0.2);
              padding: 2px 6px;
              border-radius: 8px;
            }
          }

          .loading-user-info {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            opacity: 0.8;

            .is-loading {
              animation: rotating 2s linear infinite;
            }
          }
        }
      }
    }

    .not-logged-in {
      .login-prompt {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 16px;
        background: linear-gradient(135deg, #f56c6c, #f78989);
        border-radius: 20px;
        color: white;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
        }

        .login-icon {
          font-size: 16px;
        }

        .login-text {
          font-size: 14px;
          font-weight: 500;
        }

        .el-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 12px;
          padding: 4px 12px;
          height: 28px;
          border-radius: 14px;
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
            transform: scale(1.05);
          }
        }
      }
    }
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

.brand-section {
  background: #fff;
  margin-bottom: 8px;

  .brand-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    padding: 16px;

    .brand-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 12px;
      border-radius: 8px;
      background: #f9f9f9;

      &:hover {
        transform: translateY(-2px);
        background: #f0f0f0;
      }

      .brand-logo {
        width: 60px;
        height: 60px;
        margin-bottom: 8px;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
      }

      .brand-name {
        font-size: 12px;
        color: #333;
        text-align: center;
        font-weight: 500;
      }
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
    position: relative;

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

    .product-brand {
      font-size: 12px;
      color: #666;
      margin-bottom: 6px;
      font-weight: 500;
    }

    .product-price-section {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 4px;
    }

    .product-price {
      font-size: 14px;
      color: #ff4757;
      font-weight: 600;
    }

    .product-original-price {
      font-size: 12px;
      color: #999;
      text-decoration: line-through;
    }

    .promotion-tag {
      position: absolute;
      top: 8px;
      right: 8px;
      background: linear-gradient(45deg, #ff6b35, #ff8e53);
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 500;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
      position: relative;

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
        margin-bottom: 4px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.2;
      }

      .product-brand {
        font-size: 12px;
        color: #666;
        margin-bottom: 6px;
        font-weight: 500;
      }

      .product-price-section {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
      }

      .product-price {
        font-size: 16px;
        color: #ff4757;
        font-weight: 600;
      }

      .product-original-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
      }

      .promotion-tag {
        position: absolute;
        top: 8px;
        right: 8px;
        background: linear-gradient(45deg, #ff6b35, #ff8e53);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
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
      margin: 0 8px 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1.2;
    }

    .product-brand {
      font-size: 10px;
      color: #666;
      margin: 0 8px 4px;
      font-weight: 500;
    }

    .product-price-section {
      margin: 0 8px 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .product-price {
      font-size: 12px;
      color: #ff4757;
      font-weight: 600;
    }

    .product-original-price {
      font-size: 10px;
      color: #999;
      text-decoration: line-through;
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

    .promotion-tag {
      position: absolute;
      top: 4px;
      right: 4px;
      background: linear-gradient(45deg, #ff6b35, #ff8e53);
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
  .brand-section .brand-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 12px;

    .brand-item {
      padding: 8px;

      .brand-logo {
        width: 50px;
        height: 50px;
      }

      .brand-name {
        font-size: 11px;
      }
    }
  }

  .product-scroll .product-item {
    width: 120px;

    img {
      height: 120px;
    }

    .product-name {
      font-size: 12px;
      margin: 6px 0 2px;
    }

    .product-subtitle {
      font-size: 10px;
      margin-bottom: 2px;
    }

    .product-brand {
      font-size: 10px;
      margin-bottom: 4px;
    }

    .product-price-section {
      gap: 2px;
    }

    .product-price {
      font-size: 12px;
    }

    .product-original-price {
      font-size: 10px;
    }

    .promotion-tag {
      top: 4px;
      right: 4px;
      padding: 1px 4px;
      font-size: 8px;
    }
  }

  .hot-products .hot-product-item {
    img {
      width: 80px;
      height: 80px;
    }

    .product-info {
      padding: 8px;

      .product-name {
        font-size: 12px;
        margin-bottom: 2px;
      }

      .product-subtitle {
        font-size: 10px;
        margin-bottom: 2px;
      }

      .product-brand {
        font-size: 10px;
        margin-bottom: 4px;
      }

      .product-price-section {
        gap: 4px;
      }

      .product-price {
        font-size: 14px;
      }

      .product-original-price {
        font-size: 12px;
      }

      .promotion-tag {
        top: 4px;
        right: 4px;
        padding: 1px 4px;
        font-size: 8px;
      }
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
        margin: 0 6px 2px;
      }

      .product-brand {
        font-size: 9px;
        margin: 0 6px 3px;
      }

      .product-price-section {
        margin: 0 6px 6px;
        gap: 2px;
      }

      .product-price {
        font-size: 11px;
      }

      .product-original-price {
        font-size: 9px;
      }

      .recommend-tag {
        top: 2px;
        left: 2px;
        padding: 1px 3px;
        font-size: 7px;
      }

      .promotion-tag {
        top: 2px;
        right: 2px;
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
  .brand-section .brand-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .recommend-products {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
