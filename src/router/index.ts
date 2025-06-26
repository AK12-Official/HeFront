import { createRouter, createWebHistory } from 'vue-router'
import { Routes } from '@/router/routes';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: Routes,
  scrollBehavior() {
    //返回到顶部
    return {
      top: 0,
      left: 0,
      // behavior: 'smooth'
    }
  }
});

export default router;
