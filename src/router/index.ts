import { createRouter, createWebHistory } from 'vue-router'
import { Routes } from '@/router/routes';
import { ElMessage } from 'element-plus';
import useMallUserStore from '@/store/modules/mallUser';
import useUserStore from '@/store/modules/user';
import { clearAllUserData } from '@/utils/logout';
import { generateDynamicRoutes } from '@/utils/dynamicRouter';
import { usePermission } from '@/composables/usePermission';

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

// 动态路由是否已添加
let dynamicRoutesAdded = false

// 添加动态路由
export async function addDynamicRoutes() {
  if (dynamicRoutesAdded) {
    return
  }

  try {
    // 由于所有路由都已经在routes.ts中预定义，这里只需要标记为已添加
    dynamicRoutesAdded = true
    console.log('所有路由已在routes.ts中预定义，无需动态添加')
  } catch (error) {
    console.error('添加动态路由失败:', error)
  }
}

// 路由守卫：检查管理员登录状态和商城用户登录状态
router.beforeEach((to, from, next) => {
  console.log('路由守卫 - 从:', from.path, '到:', to.path)

  // 处理根路径，直接通过
  if (to.path === '/') {
    next();
    return;
  }

  // 如果访问后台管理相关路由
  if (to.path.startsWith('/mall/admin')) {
    console.log('访问后台管理路由:', to.path)
    // 如果访问登录页，检查是否已登录
    if (to.path === '/mall/admin/login') {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        // 已登录，重定向到后台首页
        next('/mall/admin/dashboard');
        return;
      }
      // 未登录，清除前台用户信息后允许访问登录页
      const mallUserStore = useMallUserStore();
      const userStore = useUserStore();

      // 重置store状态
      mallUserStore.mallLogout();
      userStore.userLogout();

      // 使用统一的清理函数清除所有用户数据
      clearAllUserData();

      next();
      return;
    }

    // 访问其他后台管理路由，检查是否已登录
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      // 未登录，清除前台用户信息后重定向到登录页
      const mallUserStore = useMallUserStore();
      const userStore = useUserStore();

      // 重置store状态
      mallUserStore.mallLogout();
      userStore.userLogout();

      // 使用统一的清理函数清除所有用户数据
      clearAllUserData();

      ElMessage.warning('请先登录');
      next('/mall/admin/login');
      return;
    }

    // 确保动态路由已添加
    if (!dynamicRoutesAdded) {
      console.log('动态路由未添加，开始添加...')
      addDynamicRoutes().then(() => {
        console.log('动态路由添加完成，重新导航到:', to.path)
        // 动态路由添加完成后，重新导航到目标路由
        next({ ...to, replace: true })
      }).catch((error) => {
        console.error('动态路由添加失败:', error)
        next('/mall/admin/dashboard')
      })
      return
    }

    // 检查权限 - 跳过dashboard路由和商品管理相关页面的权限检查
    if (to.path !== '/mall/admin/dashboard' &&
      to.name !== 'AdminDashboard' &&
      to.name !== 'pms' &&
      to.name !== 'product-create' &&
      to.name !== 'product-edit' &&
      to.name !== 'categories' &&
      to.name !== 'product-attribute-categories' &&
      to.name !== 'oms' &&
      to.name !== 'return-applies' &&
      to.name !== 'ums' &&
      to.name !== 'roles') {
      const { checkPermission } = usePermission()
      if (to.name && !checkPermission(to.name as string)) {
        // 没有权限，重定向到仪表盘
        next('/mall/admin/dashboard')
        return
      }
    }
  }

  // 如果访问商城相关路由（除了后台管理），检查商城用户登录状态
  if (to.path.startsWith('/mall') && !to.path.startsWith('/mall/admin')) {
    console.log('访问商城路由:', to.path)

    // 商城公开页面，不需要登录检查
    const publicMallRoutes = [
      '/mall/home',
      '/mall/login',
      '/mall/register',
      '/mall/product/detail',
      '/mall/product/list'
    ];

    const isPublicRoute = publicMallRoutes.some(route =>
      to.path === route || to.path.startsWith(route + '/')
    );

    if (isPublicRoute) {
      console.log('访问商城公开页面，允许通过:', to.path)
      next();
      return;
    }

    // 需要登录的商城页面
    const mallUserStore = useMallUserStore();
    if (!mallUserStore.isLoggedIn) {
      ElMessage.warning('请先登录');
      next('/mall/login');
      return;
    }
  }

  console.log('路由守卫 - 允许通过:', to.path)
  next();
});

export default router;