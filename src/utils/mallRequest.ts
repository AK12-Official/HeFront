//对 axios 进行二次封装：为电商系统创建专用的请求实例
import useMallUserStore from "@/store/modules/mallUser";
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 创建电商管理后台请求实例
export const adminRequest = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL + '/admin', // 使用/api/admin前缀
    timeout: 5000
});

// 创建电商搜索功能请求实例
export const searchRequest = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // 使用/api前缀
    timeout: 5000
});

// 创建电商前台门户请求实例
export const mallRequest = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL, // 使用/api前缀
    timeout: 10000 // 增加超时时间
});

// 为所有实例添加请求拦截器
const requestInstances = [adminRequest, searchRequest, mallRequest];

requestInstances.forEach(instance => {
    instance.interceptors.request.use((config) => {
        const mallUserStore = useMallUserStore();

        if (mallUserStore.isLoggedIn && mallUserStore.state.accessToken) {
            // accessToken已经包含了Bearer前缀，直接使用
            config.headers.Authorization = mallUserStore.state.accessToken;
        }
        return config;
    });

    instance.interceptors.response.use((response) => {
        // 成功回调
        return response.data;
    }, async (error) => {
        // 失败回调:处理http网络错误
        const originalRequest = error.config;
        const status = error.response?.status;

        // 处理401错误（token过期）
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const mallUserStore = useMallUserStore();

            // 尝试刷新token
            const refreshSuccess = await mallUserStore.refreshAccessToken();

            if (refreshSuccess) {
                // 刷新成功，重新发送原请求
                originalRequest.headers.Authorization = mallUserStore.state.accessToken;
                return instance(originalRequest);
            } else {
                // 刷新失败，跳转到登录页
                mallUserStore.mallLogout();
                ElMessage.warning('登录已过期，请重新登录');
                router.push('/mall/login');
                return Promise.reject(error);
            }
        }

        // 处理其他错误
        let message = '';
        switch (status) {
            case 400:
                message = 'Request Param Wrong'; break;
            case 401:
                message = 'Token Expired'; break;
            case 403:
                message = 'Permission Denied'; break;
            case 404:
                message = 'RequestUrl Error'; break;
            case 500:
                message = 'Server Error'; break;
            case 503:
                message = 'Service Unavailable'; break;
            default:
                message = 'Network Error';
        }

        // 提示错误信息
        ElMessage.error(message);

        return Promise.reject(error);
    });
});

export default mallRequest; // 导出前台门户请求实例作为默认导出
