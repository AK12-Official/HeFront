<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import FooterInfo from './components/FooterInfo.vue';
import HeaderNav from './components/HeaderNav.vue';

const route = useRoute();

// 判断是否是视频页面（排除上传页面）
const isVideoPage = () => {
  return route.path.startsWith('/video') && route.path !== '/video/upload';
};
</script>

<template>
  <div class="layout">
    <HeaderNav class="header-nav" v-if="route.path !== '/login'" />
    <main class="main-content" :class="{ 'video-content': isVideoPage() }">
      <RouterView />
    </main>
    <FooterInfo class="footer-info" />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header-nav {
  height: 70px;
  flex-shrink: 0;
}

.footer-info {
  flex-shrink: 0;
  position: relative;
  z-index: 10; /* 确保footer显示在内容之上 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 20px 20px 0 0;
  background: #fff;
  overflow: hidden;

  &.video-content {
    border-radius: 0;
    background: transparent;
  }
}
</style>
