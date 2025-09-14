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
  // 电商相关路由
  {
    path: '/mall',
    component: () => import('@/views/mall/index.vue'),
    redirect: '/mall/home', // 默认重定向到商城首页
    children: [
      {
        path: 'login',
        component: () => import('@/views/mall/login/index.vue'),
        name: 'mall-login',
      },
      {
        path: 'register',
        component: () => import('@/views/mall/register/index.vue'),
        name: 'mall-register',
      },
      {
        path: 'home',
        component: () => import('@/views/mall/home/index.vue'),
        name: 'mall-home',
      },
      {
        path: 'product/detail/:id',
        component: () => import('@/views/mall/product/detail.vue'),
        name: 'mall-product-detail',
      },
      {
        path: 'product/list',
        component: () => import('@/views/mall/product/list.vue'),
        name: 'mall-product-list',
      },
      {
        path: 'cart',
        component: () => import('@/views/mall/cart/index.vue'),
        name: 'mall-cart',
      },
      {
        path: 'order',
        component: () => import('@/views/mall/order/index.vue'),
        name: 'mall-order',
      },
      {
        path: 'order/create',
        component: () => import('@/views/mall/order/create.vue'),
        name: 'mall-order-create',
      },
      {
        path: 'payment/:orderId',
        component: () => import('@/views/mall/payment/index.vue'),
        name: 'mall-payment',
      },
      {
        path: 'payment/result',
        component: () => import('@/views/mall/payment/result.vue'),
        name: 'mall-payment-result',
      },
      {
        path: 'order/:id',
        component: () => import('@/views/mall/order/detail.vue'),
        name: 'mall-order-detail',
      },
      {
        path: 'order/detail/:id',
        component: () => import('@/views/mall/order/detail.vue'),
        name: 'mall-order-detail-alt',
      },
      {
        path: 'order/return-apply/:orderId/:productId',
        component: () => import('@/views/mall/order/return-apply.vue'),
        name: 'mall-order-return-apply',
      },
      {
        path: 'order/return-list',
        component: () => import('@/views/mall/order/return-list.vue'),
        name: 'mall-order-return-list',
      },
      {
        path: 'address',
        component: () => import('@/views/mall/address/index.vue'),
        name: 'mall-address',
      },
      {
        path: 'user',
        component: () => import('@/views/mall/user/index.vue'),
        name: 'mall-user',
      },
      {
        path: 'coupon',
        component: () => import('@/views/mall/coupon/index.vue'),
        name: 'mall-coupon',
      },
    ]
  },
  { //广场
    path: '/square',
    component: () => import('@/views/square/index.vue'),
    name: 'square',
  },
  { //视频
    path: '/video',
    component: () => import('@/views/video/layout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/video/index.vue'),
        name: 'video',
      },
      {
        path: ':id',
        component: () => import('@/views/video/detail.vue'),
        name: 'video-detail',
      }
    ]
  },
  { //视频上传（独立路由，不使用layout）
    path: '/video/upload',
    component: () => import('@/views/video/upload.vue'),
    name: 'video-upload',
  },
  { //我的
    path: '/me',
    component: () => import('@/views/me/index.vue'),
    name: 'me',
  },
  // 后台管理系统路由
  {
    path: '/mall/admin/test',
    component: () => import('@/views/MallAdmin/test-login.vue'),
    name: 'admin-test',
  },
  {
    path: '/mall/admin/login',
    component: () => import('@/views/MallAdmin/login.vue'),
    name: 'admin-login',
  },
  {
    path: '/mall/admin',
    name: 'admin',
    component: () => import('@/views/MallAdmin/layout.vue'),
    redirect: '/mall/admin/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/MallAdmin/index.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true
        }
      },
      {
        path: 'pms',
        name: 'pms',
        component: () => import('@/views/MallAdmin/products.vue'),
        meta: {
          title: '商品列表',
          requiresAuth: true
        }
      },
      {
        path: 'products/create',
        name: 'product-create',
        component: () => import('@/views/MallAdmin/ProductCreate.vue'),
        meta: {
          title: '添加商品',
          requiresAuth: true
        }
      },
      {
        path: 'products/edit/:id',
        name: 'product-edit',
        component: () => import('@/views/MallAdmin/ProductEdit.vue'),
        meta: {
          title: '编辑商品',
          requiresAuth: true
        }
      },
      {
        path: 'product-attribute-categories',
        name: 'product-attribute-categories',
        component: () => import('@/views/MallAdmin/product-attribute-categories.vue'),
        meta: {
          title: '商品属性分类管理',
          requiresAuth: true
        }
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/MallAdmin/Categories.vue'),
        meta: {
          title: '商品分类',
          requiresAuth: true
        }
      },
      {
        path: 'oms',
        name: 'oms',
        component: () => import('@/views/MallAdmin/orders.vue'),
        meta: {
          title: '订单列表',
          requiresAuth: true
        }
      },
      {
        path: 'return-applies',
        name: 'return-applies',
        component: () => import('@/views/MallAdmin/return-applies.vue'),
        meta: {
          title: '退货申请管理',
          requiresAuth: true
        }
      },
      {
        path: 'ums',
        name: 'ums',
        component: () => import('@/views/MallAdmin/users.vue'),
        meta: {
          title: '管理员列表',
          requiresAuth: true
        }
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/views/MallAdmin/Roles.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true
        }
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('@/views/MallAdmin/Upload.vue'),
        meta: {
          title: '文件上传',
          requiresAuth: true
        }
      }
      // 动态路由将在这里添加
    ]
  }
]
