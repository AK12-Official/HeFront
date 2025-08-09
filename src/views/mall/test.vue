<template>
  <div class="mock-test-page">
    <h1>电商平台Mock API测试页面</h1>

    <!-- 测试按钮组 -->
    <div class="test-buttons">
      <el-button @click="testHomeContent" type="primary">测试首页内容</el-button>
      <el-button @click="testProductSearch" type="success">测试商品搜索</el-button>
      <el-button @click="testCartAdd" type="warning">测试添加购物车</el-button>
      <el-button @click="testCartList" type="info">测试购物车列表</el-button>
      <el-button @click="testAddressList" type="danger">测试地址列表</el-button>
    </div>

    <!-- 测试结果展示 -->
    <div class="test-results">
      <h2>测试结果：</h2>
      <pre v-if="testResult">{{ JSON.stringify(testResult, null, 2) }}</pre>
      <el-empty v-else description="暂无测试结果" />
    </div>

    <!-- Mock数据展示 -->
    <div class="mock-data-display" v-if="mockData">
      <h2>Mock数据展示：</h2>

      <!-- 首页轮播图 -->
      <div v-if="mockData.advertiseList?.length" class="data-section">
        <h3>轮播广告</h3>
        <div class="ad-list">
          <div v-for="ad in mockData.advertiseList" :key="ad.id" class="ad-item">
            <img :src="ad.pic" :alt="ad.name" style="width: 200px; height: 100px; object-fit: cover;" />
            <p>{{ ad.name }}</p>
          </div>
        </div>
      </div>

      <!-- 新品推荐 -->
      <div v-if="mockData.newProductList?.length" class="data-section">
        <h3>新品推荐</h3>
        <div class="product-grid">
          <div v-for="product in mockData.newProductList" :key="product.id" class="product-item">
            <img :src="product.pic" :alt="product.name" style="width: 150px; height: 150px; object-fit: cover;" />
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
            <p class="subtitle">{{ product.subTitle }}</p>
          </div>
        </div>
      </div>

      <!-- 热门商品 -->
      <div v-if="mockData.hotProductList?.length" class="data-section">
        <h3>热门商品</h3>
        <div class="product-grid">
          <div v-for="product in mockData.hotProductList" :key="product.id" class="product-item">
            <img :src="product.pic" :alt="product.name" style="width: 150px; height: 150px; object-fit: cover;" />
            <h4>{{ product.name }}</h4>
            <p class="price">¥{{ product.price }}</p>
            <p class="subtitle">{{ product.subTitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  homeContent,
  productSearch,
  cartAdd,
  cartList,
  memberAddressList
} from '@/api/mall'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testResult = ref<any>(null)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockData = ref<any>(null)

// 测试首页内容
const testHomeContent = async () => {
  try {
    ElMessage.info('正在测试首页内容API...')
    const result = await homeContent()
    testResult.value = result
    mockData.value = result.data
    ElMessage.success('首页内容API测试成功！')
  } catch (error) {
    ElMessage.error('首页内容API测试失败')
    console.error('测试失败:', error)
  }
}

// 测试商品搜索
const testProductSearch = async () => {
  try {
    ElMessage.info('正在测试商品搜索API...')
    const result = await productSearch({
      keyword: 'iPhone',
      pageNum: 1,
      pageSize: 10
    })
    testResult.value = result
    ElMessage.success('商品搜索API测试成功！')
  } catch (error) {
    ElMessage.error('商品搜索API测试失败')
    console.error('测试失败:', error)
  }
}

// 测试添加购物车
const testCartAdd = async () => {
  try {
    ElMessage.info('正在测试添加购物车API...')
    const result = await cartAdd({
      productId: 1,
      productSkuId: 1,
      quantity: 1
    })
    testResult.value = result
    ElMessage.success('添加购物车API测试成功！')
  } catch (error) {
    ElMessage.error('添加购物车API测试失败')
    console.error('测试失败:', error)
  }
}

// 测试购物车列表
const testCartList = async () => {
  try {
    ElMessage.info('正在测试购物车列表API...')
    const result = await cartList()
    testResult.value = result
    ElMessage.success('购物车列表API测试成功！')
  } catch (error) {
    ElMessage.error('购物车列表API测试失败')
    console.error('测试失败:', error)
  }
}

// 测试地址列表
const testAddressList = async () => {
  try {
    ElMessage.info('正在测试地址列表API...')
    const result = await memberAddressList()
    testResult.value = result
    ElMessage.success('地址列表API测试成功！')
  } catch (error) {
    ElMessage.error('地址列表API测试失败')
    console.error('测试失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.mock-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }

  .test-buttons {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .test-results {
    background: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 30px;

    pre {
      background: #333;
      color: #fff;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  }

  .mock-data-display {
    .data-section {
      margin-bottom: 30px;

      h3 {
        color: #666;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
    }

    .ad-list {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;

      .ad-item {
        text-align: center;

        img {
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        p {
          margin-top: 8px;
          font-weight: bold;
        }
      }
    }

    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;

      .product-item {
        background: #fff;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-align: center;

        img {
          border-radius: 8px;
          margin-bottom: 10px;
        }

        h4 {
          margin: 10px 0 5px 0;
          font-size: 16px;
          color: #333;
        }

        .price {
          color: #e4393c;
          font-size: 18px;
          font-weight: bold;
          margin: 5px 0;
        }

        .subtitle {
          color: #666;
          font-size: 12px;
          margin: 5px 0;
        }
      }
    }
  }
}
</style>
