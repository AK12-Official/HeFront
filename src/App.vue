<script setup lang="ts">

import { RouterView } from 'vue-router';

import FooterInfo from './components/FooterInfo.vue';
import HeaderNav from './components/HeaderNav.vue';

</script>

<template>
  <div class="layout">
    <HeaderNav class="header-nav" />
    <main class="main-content">
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
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
