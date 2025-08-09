<template>
  <div class="mall-container">
    <!-- 头部导航 -->
    <div class="mall-header">
      <div class="header-content">
        <h1 class="mall-title">爱心商城</h1>
        <nav class="nav-menu">
          <router-link to="/mall/home" class="nav-item">首页</router-link>
          <router-link to="/mall/product/list" class="nav-item">分类</router-link>
          <router-link to="/mall/cart" class="nav-item">购物车</router-link>
          <router-link to="/mall/order" class="nav-item">订单</router-link>
          <router-link to="/mall/user" class="nav-item">个人中心</router-link>
        </nav>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="mall-content">
      <router-view />
    </div>

    <!-- 底部信息 -->
    <!-- <div class="mall-footer">
            <div class="footer-content">
                <p>&copy; 2024 MallLite 商城系统. All rights reserved.</p>
                <p>基于Vue3 + TypeScript + Element Plus开发</p>
            </div>
        </div> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  // 如果访问的是根路径，重定向到首页
  if (route.path === '/mall' || route.path === '/mall/') {
    router.replace('/mall/home')
  }
})
</script>

<style lang="scss" scoped>
.mall-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.mall-header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
  }

  .mall-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
    background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-menu {
    display: flex;
    gap: 30px;

    .nav-item {
      color: #666;
      text-decoration: none;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
      transition: all 0.3s ease;

      &:hover,
      &.router-link-active {
        color: #667eea;
        background: rgba(102, 126, 234, 0.1);
      }
    }
  }
}

.mall-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.mall-footer {
  background: #333;
  color: #ccc;
  padding: 20px 0;
  margin-top: auto;

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
    padding: 0 20px;

    p {
      margin: 5px 0;
      font-size: 14px;
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mall-header {
    .header-content {
      flex-direction: column;
      height: auto;
      padding: 15px 20px;
    }

    .nav-menu {
      margin-top: 10px;
      gap: 15px;
      flex-wrap: wrap;
      justify-content: center;

      .nav-item {
        font-size: 14px;
        padding: 6px 12px;
      }
    }
  }

  .mall-content {
    padding: 10px;
  }
}
</style>
