export const Routes = [
  { //登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',   //命名路由
  },
  { //首页
    path: '/',
    component: () => import('@/views/home/index.vue'),
    name: 'home',
  },
  { //404
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/error/404.vue'),
    name: '404',
  },
  { //商城
    path: '/shop',
    component: () => import('@/views/shop/index.vue'),
    name: 'shop',
  },
  { //广场
    path: '/square',
    component: () => import('@/views/square/index.vue'),
    name: 'square',
  },
  { //视频
    path: '/video',
    component: () => import('@/views/video/index.vue'),
    name: 'video',
  },
  { //我的
    path: '/me',
    component: () => import('@/views/me/index.vue'),
    name: 'me',
  }
]
