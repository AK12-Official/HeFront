<script setup lang="ts">

import { RouterView } from 'vue-router';

import FooterInfo from './components/FooterInfo.vue';
import HeaderNav from './components/HeaderNav.vue';

</script>

<template>
  <HeaderNav />
  <RouterView />
  <FooterInfo />
</template>

<style scoped>
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  /* 其他样式 */
}
</style>


