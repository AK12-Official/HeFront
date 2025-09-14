/**
 * 权限指令
 * 用于控制页面元素的显示/隐藏
 */
import type { Directive } from 'vue';

// 简单的权限检查函数，避免在指令中使用composable
const checkPermission = (permission: string): boolean => {
    // 暂时返回true，避免指令导致页面空白
    // 在实际使用中，这里应该检查用户权限
    return true;
};

export const permission: Directive = {
    mounted(el, binding) {
        const permission = binding.value;

        if (permission && !checkPermission(permission)) {
            el.style.display = 'none';
        }
    },

    updated(el, binding) {
        const permission = binding.value;

        if (permission && !checkPermission(permission)) {
            el.style.display = 'none';
        } else {
            el.style.display = '';
        }
    }
};
