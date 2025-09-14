/**
 * 权限管理 Composable
 */
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { malladmin } from '@/api';
import type { AdminMenu } from '@/api/malladmin/types';
import { getUserMenuTree, hasPermission } from '@/utils/dynamicRouter';

// 全局状态
const userMenus = ref<AdminMenu[]>([]);
const loading = ref(false);

export function usePermission() {
    const router = useRouter();

    /**
     * 获取用户菜单权限
     */
    const fetchUserMenus = async () => {
        // 检查是否有token，没有token直接返回空数组
        const token = localStorage.getItem('admin_token');
        if (!token) {
            console.log('未登录，跳过菜单获取');
            return [];
        }

        loading.value = true;
        try {
            const result = await malladmin.getAdminInfo();
            if (result.code === 200) {
                userMenus.value = result.data.menus || [];
                return result.data.menus || [];
            } else {
                console.error('获取用户菜单失败:', result.message);
                return [];
            }
        } catch (error) {
            console.error('获取用户菜单失败:', error);
            return [];
        } finally {
            loading.value = false;
        }
    };

    /**
     * 检查是否有权限访问某个路由
     */
    const checkPermission = (routeName: string): boolean => {
        // 如果是dashboard路由，总是允许访问
        if (routeName === 'AdminDashboard') {
            return true;
        }

        if (!userMenus.value.length) {
            return false;
        }
        return hasPermission(routeName, userMenus.value);
    };

    /**
     * 获取用户可访问的菜单树
     */
    const menuTree = computed(() => {
        return getUserMenuTree(userMenus.value);
    });

    /**
     * 检查是否有菜单权限
     */
    const hasMenuPermission = (menuName: string): boolean => {
        return checkPermission(menuName);
    };

    /**
     * 路由守卫：检查权限
     */
    const routeGuard = (to: any) => {
        // 跳过登录页面
        if (to.path === '/mall/admin/login') {
            return true;
        }

        // 检查权限
        if (to.name && !checkPermission(to.name)) {
            // 没有权限，重定向到403页面或首页
            router.push('/mall/admin/dashboard');
            return false;
        }

        return true;
    };

    /**
     * 清除权限数据
     */
    const clearPermissions = () => {
        userMenus.value = [];
    };

    return {
        userMenus: computed(() => userMenus.value),
        menuTree,
        loading: computed(() => loading.value),
        fetchUserMenus,
        checkPermission,
        hasMenuPermission,
        routeGuard,
        clearPermissions
    };
}
