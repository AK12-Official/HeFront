/**
 * 动态路由工具
 * 根据后端返回的菜单数据动态生成路由
 */
import type { RouteRecordRaw } from 'vue-router';
import type { AdminMenu } from '@/api/malladmin/types';

// 路由组件映射
const componentMap: Record<string, () => Promise<any>> = {
    // Dashboard
    'dashboard': () => import('@/views/MallAdmin/index.vue'),

    // 用户管理
    'users': () => import('@/views/MallAdmin/users.vue'),
    'ums': () => import('@/views/MallAdmin/users.vue'), // 用户管理系统的别名

    // 商品管理
    'products': () => import('@/views/MallAdmin/products.vue'),
    'product-create': () => import('@/views/MallAdmin/ProductCreate.vue'),
    'product-edit': () => import('@/views/MallAdmin/ProductEdit.vue'),
    'categories': () => import('@/views/MallAdmin/Categories.vue'),
    'pms': () => import('@/views/MallAdmin/products.vue'), // 商品管理系统的别名

    // 订单管理
    'orders': () => import('@/views/MallAdmin/orders.vue'),
    'oms': () => import('@/views/MallAdmin/orders.vue'), // 订单管理系统的别名

    // 系统管理
    'roles': () => import('@/views/MallAdmin/Roles.vue'),
    'resources': () => import('@/views/MallAdmin/Resources.vue'),


    // 文件管理
    'upload': () => import('@/views/MallAdmin/Upload.vue'),
};

// 默认路由
const defaultRoutes: RouteRecordRaw[] = [
    {
        path: '/mall/admin/dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/MallAdmin/index.vue'),
        meta: {
            title: '仪表盘',
            requiresAuth: true
        }
    }
];

/**
 * 将菜单转换为路由
 */
export function menuToRoute(menu: AdminMenu): RouteRecordRaw | null {
    // 跳过隐藏的菜单
    if (menu.hidden === 1) {
        return null;
    }

    // 构建路由路径 - 对于子路由，使用相对路径
    const path = menu.name ? menu.name : '';

    // 获取组件
    const component = componentMap[menu.name || ''] || null;

    // 如果是父级菜单（有子菜单），不设置组件
    if (menu.children && menu.children.length > 0) {
        return {
            path: path || `/${menu.id}`,
            name: menu.name || `Menu${menu.id}`,
            meta: {
                title: menu.title,
                icon: menu.icon,
                requiresAuth: true,
                level: menu.level
            },
            children: menu.children
                .map(child => menuToRoute(child))
                .filter((route): route is RouteRecordRaw => route !== null)
        };
    }

    // 叶子节点菜单
    if (!component) {
        console.warn(`未找到菜单 "${menu.title}" 对应的组件: ${menu.name}`);
        return null;
    }

    return {
        path,
        name: menu.name || `Menu${menu.id}`,
        component,
        meta: {
            title: menu.title,
            icon: menu.icon,
            requiresAuth: true,
            level: menu.level
        }
    };
}

/**
 * 根据菜单数据生成动态路由
 */
export function generateDynamicRoutes(menus: AdminMenu[]): RouteRecordRaw[] {
    const routes: RouteRecordRaw[] = [];

    // 按层级排序菜单
    const sortedMenus = menus.sort((a, b) => a.sort - b.sort);

    // 构建一级菜单路由
    const topLevelMenus = sortedMenus.filter(menu => menu.level === 0);

    for (const menu of topLevelMenus) {
        const route = menuToRoute(menu);
        if (route) {
            routes.push(route);
        }
    }

    return routes;
}

/**
 * 检查用户是否有权限访问某个路由
 */
export function hasPermission(routeName: string, userMenus: AdminMenu[]): boolean {
    // 递归检查菜单权限
    function checkMenuPermission(menus: AdminMenu[], targetName: string): boolean {
        for (const menu of menus) {
            if (menu.name === targetName) {
                return true;
            }
            if (menu.children && checkMenuPermission(menu.children, targetName)) {
                return true;
            }
        }
        return false;
    }

    return checkMenuPermission(userMenus, routeName);
}

/**
 * 获取用户可访问的菜单树
 */
export function getUserMenuTree(menus: AdminMenu[]): AdminMenu[] {
    // 过滤掉隐藏的菜单
    function filterHiddenMenus(menuList: AdminMenu[]): AdminMenu[] {
        return menuList
            .filter(menu => menu.hidden !== 1)
            .map(menu => ({
                ...menu,
                children: menu.children ? filterHiddenMenus(menu.children) : undefined
            }))
            .sort((a, b) => a.sort - b.sort);
    }

    return filterHiddenMenus(menus);
}
