<template>
  <header class="header-nav">
    <div class="logo-area">
      <img src="@/assets/Logo/csulogo.svg" alt="logo" class="logo-img">
    </div>
    <nav class="nav-menu">
      <a v-for="item in navs" :key="item.name" :href="item.path" :class="{ active: item.active }" class="nav-link">
        <img v-if="item.icon" :src="item.icon" class="nav-icon" alt="" />
        <span class="nav-text">{{ item.name }}</span>
      </a>
    </nav>
  </header>
</template>

<script setup lang="ts">
import homeIcon from '@/assets/icons/首页.svg'
import videoIcon from '@/assets/icons/视频.svg'
import shopIcon from '@/assets/icons/商城.svg'
import squareIcon from '@/assets/icons/广场.svg'
import meIcon from '@/assets/icons/我的.svg'

const navs = [
  { name: '首页', path: '/', active: true, icon: homeIcon },
  { name: '视频', path: '/video', active: false, icon: videoIcon },
  { name: '商城', path: '/shop', active: false, icon: shopIcon },
  { name: '广场', path: '/square', active: false, icon: squareIcon },
  { name: '我的', path: '/me', active: false, icon: meIcon }
]
</script>

<style scoped>
.logo-img {
  width: 60px;
  height: auto;
}

.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 20px;
  border-radius: 0 0 20px 20px;
  /* 左下角和右下角圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  /* 添加阴影 */
  position: relative;
  z-index: 100;
}

.logo-area {
  display: flex;
  align-items: center;
  font-size: 32px;
  color: #42a5f5;
  font-weight: 500;
  /* padding-top: 10px; */
}

.project-name {
  margin-left: 8px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 48px;
  margin-right: 20px;
}

.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #222;
  font-size: 18px;
  text-decoration: none;
  position: relative;
  transition: color 0.2s;
}

.nav-link.active,
.nav-link:hover {
  color: #42a5f5;
}

.nav-text {
  font-size: 16px;
  color: #000;
}

.nav-icon {
  width: 18px;
  height: 18px;
  margin-bottom: 4px;
  color: #666;
  fill: #666;
}
</style>
