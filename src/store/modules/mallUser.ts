/**
 * 电商系统专用用户状态管理
 * 与原有用户系统分离，独立管理电商用户状态
 */
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import { setMallToken, getMallToken, removeMallToken, clearAllMallTokens } from "@/utils/mallAuth";
import { ssoRefreshToken } from "@/api/sso";
import { ElMessage } from "element-plus";

// 电商用户状态接口
export interface MallUserState {
    accessToken: string | null;
    refreshToken: string | null;
    expiresIn: number | null;
    username: string | null;
    memberId: number | null;
    // 用户详细信息
    userInfo: {
        id: number | null;
        memberLevelId: number | null;
        nickname: string | null;
        phone: string | null;
        status: number | null;
        createTime: string | null;
        icon: string | null;
        gender: number | null;
        birthday: string | null;
        city: string | null;
        job: string | null;
        personalizedSignature: string | null;
        integration: number | null;
        growth: number | null;
    } | null;
}

const useMallUserStore = defineStore('MallUser', () => {
    // state
    const state = ref<MallUserState>({
        accessToken: getMallToken('MALL_ACCESS_TOKEN'), // 从 localStorage 初始化 token
        refreshToken: getMallToken('MALL_REFRESH_TOKEN'), // 用户登录成功后返回的refreshToken
        expiresIn: getMallToken('MALL_EXPIRES_IN'), // token的过期时间
        username: null,
        memberId: null,
        userInfo: null,
    });

    // 监听 localStorage 的变化，确保多标签页之间的状态一致性
    window.addEventListener('storage', (event) => {
        if (event.key === 'MALL_ACCESS_TOKEN') {
            state.value.accessToken = event.newValue || null;
        } else if (event.key === 'MALL_REFRESH_TOKEN') {
            state.value.refreshToken = event.newValue || null;
        } else if (event.key === 'MALL_EXPIRES_IN') {
            state.value.expiresIn = event.newValue ? Number(event.newValue) : null;
        }
    });

    // 监听状态变化，自动同步到 localStorage
    watch(
        () => state.value.accessToken,
        (newToken) => {
            if (newToken) {
                setMallToken('MALL_ACCESS_TOKEN', newToken);
            } else {
                removeMallToken('MALL_ACCESS_TOKEN');
            }
        }
    );

    watch(
        () => state.value.refreshToken,
        (newToken) => {
            if (newToken) {
                setMallToken('MALL_REFRESH_TOKEN', newToken);
            } else {
                removeMallToken('MALL_REFRESH_TOKEN');
            }
        }
    );

    watch(
        () => state.value.expiresIn,
        (newValue) => {
            if (newValue !== null) {
                setMallToken('MALL_EXPIRES_IN', newValue);
            } else {
                removeMallToken('MALL_EXPIRES_IN');
            }
        }
    );

    // getters
    const isLoggedIn = computed(() => {
        // 检查是否有访问令牌
        if (!state.value.accessToken) {
            return false;
        }

        // 检查令牌是否过期
        if (state.value.expiresIn) {
            // 获取当前时间戳（秒）
            const now = Math.floor(Date.now() / 1000);

            // 如果当前时间超过过期时间，则令牌已过期
            if (now >= state.value.expiresIn) {
                return false;
            }
        }

        return true;
    });

    // actions
    const setLoginInfo = (loginData: {
        accessToken: string;
        refreshToken?: string;
        expiresIn?: number;
        username?: string;
        memberId?: number;
    }) => {
        state.value.accessToken = loginData.accessToken;
        state.value.refreshToken = loginData.refreshToken || null;
        state.value.expiresIn = loginData.expiresIn || null;
        state.value.username = loginData.username || null;
        state.value.memberId = loginData.memberId || null;
    };

    const setUserInfo = (userInfo: {
        id: number;
        memberLevelId: number;
        username: string;
        nickname: string;
        phone: string;
        status: number;
        createTime: string;
        icon: string;
        gender: number;
        birthday: string;
        city: string;
        job: string;
        personalizedSignature: string;
        integration: number;
        growth: number;
    }) => {
        state.value.userInfo = userInfo;
        // 同时更新username和memberId
        state.value.username = userInfo.username;
        state.value.memberId = userInfo.id;
    };

    const mallLogout = () => {
        // 清除所有电商系统token
        clearAllMallTokens();

        // 重置状态
        state.value.accessToken = null;
        state.value.refreshToken = null;
        state.value.expiresIn = null;
        state.value.username = null;
        state.value.memberId = null;
        state.value.userInfo = null;
    };

    // 刷新token
    const refreshAccessToken = async (): Promise<boolean> => {
        try {
            if (!state.value.refreshToken) {
                console.warn('No refresh token available');
                return false;
            }

            const response = await ssoRefreshToken(state.value.refreshToken);

            if (response.code === 200 && response.data) {
                // 更新accessToken
                state.value.accessToken = response.data.tokenHead + response.data.token;

                // 设置新的过期时间（假设token有效期为2小时）
                const expiresIn = Math.floor(Date.now() / 1000) + (2 * 60 * 60);
                state.value.expiresIn = expiresIn;

                console.log('Token refreshed successfully');
                return true;
            } else {
                console.error('Token refresh failed:', response.message);
                return false;
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    // 检查token是否需要刷新（提前5分钟刷新）
    const shouldRefreshToken = (): boolean => {
        if (!state.value.expiresIn) {
            return false;
        }

        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = state.value.expiresIn - now;

        // 如果token在5分钟内过期，则需要刷新
        return timeUntilExpiry < 300;
    };

    return {
        state,
        isLoggedIn,
        setLoginInfo,
        setUserInfo,
        mallLogout,
        refreshAccessToken,
        shouldRefreshToken,
    };
});

export default useMallUserStore;
