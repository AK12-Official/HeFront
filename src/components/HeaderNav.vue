<template>
  <header class="header-nav">
    <div class="logo-area">
      <span class="logo">Logo</span>
      <span class="project-name">&ProjectName</span>
    </div>
    <nav class="nav-menu">
      <a v-for="item in navs" :key="item.name" :href="item.path" :class="{ active: item.active }" class="nav-link">
        <span>{{ item.name }}</span>
        <!-- 图标可以用img或iconfont，这里先用img -->
        <img v-if="item.icon" :src="item.icon" class="nav-icon" alt="" />
      </a>
    </nav>
  </header>
</template>

<script setup lang="ts">
const navs = [
  { name: '首页', path: '/', active: true, icon: '/icons/home.svg' },
  { name: '视频', path: '/video', active: false, icon: '/icons/video.svg' },
  { name: '商城', path: '/shop', active: false, icon: '/icons/shop.svg' },
  { name: '广场', path: '/square', active: false, icon: '/icons/square.svg' },
  { name: '我的', path: '/me', active: false, icon: '/icons/user.svg' }
]
</script>

<style scoped>
.header-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  background: #fff;
  border-bottom: 1px solid #eaeaea;
  padding: 0 40px;
}

.logo-area {
  display: flex;
  align-items: center;
  font-size: 32px;
  color: #42a5f5;
  font-weight: 500;
}

.project-name {
  margin-left: 8px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 48px;
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

.nav-icon {
  width: 18px;
  height: 18px;
  margin-top: 2px;
}
</style>