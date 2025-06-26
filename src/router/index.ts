import { createRouter, createWebHistory } from 'vue-router'
import { Routes } from '@/router/routes';


const router = createRouter({
  //路由模式
  history: createWebHistory(),
  //路由配置
  routes: Routes,
  //路由滚动行为
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
