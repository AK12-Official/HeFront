/**
 * 权限控制 Composable
 * 用于在组件中检查用户权限
 */
import { computed } from 'vue';
import { usePermission } from './usePermission';

export function useAuth() {
    const { hasMenuPermission, userMenus } = usePermission();

    /**
     * 检查是否有权限访问某个菜单
     */
    const canAccess = (menuName: string): boolean => {
        return hasMenuPermission(menuName);
    };

    /**
     * 检查是否有权限访问多个菜单中的任意一个
     */
    const canAccessAny = (menuNames: string[]): boolean => {
        return menuNames.some(name => hasMenuPermission(name));
    };

    /**
     * 检查是否有权限访问多个菜单中的所有
     */
    const canAccessAll = (menuNames: string[]): boolean => {
        return menuNames.every(name => hasMenuPermission(name));
    };

    /**
     * 获取用户有权限的菜单列表
     */
    const accessibleMenus = computed(() => {
        return userMenus.value;
    });

    /**
     * 检查是否为超级管理员
     */
    const isSuperAdmin = computed(() => {
        return canAccess('admin') || canAccess('super-admin');
    });

    /**
     * 检查是否有商品管理权限
     */
    const canManageProducts = computed(() => {
        return canAccessAny(['products', 'product-create', 'product-edit', 'categories']);
    });

    /**
     * 检查是否有订单管理权限
     */
    const canManageOrders = computed(() => {
        return canAccess('orders');
    });

    /**
     * 检查是否有用户管理权限
     */
    const canManageUsers = computed(() => {
        return canAccessAny(['users', 'roles', 'resources']);
    });

    return {
        canAccess,
        canAccessAny,
        canAccessAll,
        accessibleMenus,
        isSuperAdmin,
        canManageProducts,
        canManageOrders,
        canManageUsers
    };
}
