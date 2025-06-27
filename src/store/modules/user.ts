import { loginWithCode, loginWithPassword, logout, } from "@/api/auth";
import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";
import type { UserState } from "./types/types";
import { setToken, getToken, removeToken, clearAllTokens } from "@/utils/auth";
import type { LoginCodeParams, LoginPasswordParams } from "@/api/auth/types";

const useUserStore = defineStore('User', () => {
  // state
  const state = ref<UserState>({
    accessToken: getToken('ACCESS_TOKEN'), // 从 localStorage 初始化 token
    refreshToken: getToken('REFRESH_TOKEN'), // 用户登录成功后返回的refreshToken
    expiresIn: getToken('expiresIn'), // token的过期时间
  });

  // 监听 localStorage 的变化，确保多标签页之间的状态一致性
  window.addEventListener('storage', (event) => {
    if (event.key === 'ACCESS_TOKEN') {
      state.value.accessToken = event.newValue || null;
    } else if (event.key === 'REFRESH_TOKEN') {
      state.value.refreshToken = event.newValue || null;
    } else if (event.key === 'expiresIn') {
      state.value.expiresIn = event.newValue ? Number(event.newValue) : null;
    }
  });

  // 监听状态变化，自动同步到 localStorage
  watch(
    () => state.value.accessToken,
    (newToken) => {
      if (newToken) {
        setToken('ACCESS_TOKEN', newToken);
      } else {
        removeToken('ACCESS_TOKEN');
      }
    }
  );

  watch(
    () => state.value.refreshToken,
    (newToken) => {
      if (newToken) {
        setToken('REFRESH_TOKEN', newToken);
      } else {
        removeToken('REFRESH_TOKEN');
      }
    }
  );

  watch(
    () => state.value.expiresIn,
    (newValue) => {
      if (newValue !== null) {
        setToken('expiresIn', newValue);
      } else {
        removeToken('expiresIn');
      }
    }
  );

  // actions
  const userLoginCode = async (data: LoginCodeParams) => {
    const result = await loginWithCode(data);

    if (result.code === 10000) {
      state.value.accessToken = result.data.accessToken || null;
      state.value.refreshToken = result.data.refreshToken || null;
      state.value.expiresIn = result.data.expiresIn || null;
      if (state.value.accessToken && state.value.refreshToken && state.value.expiresIn !== null) {
        setToken("ACCESS_TOKEN", state.value.accessToken);
        setToken("REFRESH_TOKEN", state.value.refreshToken);
        setToken("expiresIn", state.value.expiresIn);
      }

      // 登录成功后获取用户信息
      // await userInfo();

      return 'ok';
    } else {
      return Promise.reject(new Error(result.message));
    }
  };

  const userLoginPwd = async (data: LoginPasswordParams) => {
    const result = await loginWithPassword(data);

    if (result.code === 10000) {
      state.value.accessToken = result.data.accessToken || null;
      state.value.refreshToken = result.data.refreshToken || null;
      state.value.expiresIn = result.data.expiresIn || null;
      if (state.value.accessToken && state.value.refreshToken && state.value.expiresIn !== null) {
        setToken("ACCESS_TOKEN", state.value.accessToken);
        setToken("REFRESH_TOKEN", state.value.refreshToken);
        setToken("expiresIn", state.value.expiresIn);
      }

      // 登录成功后获取用户信息
      // await userInfo();

      return 'ok';
    } else {
      return Promise.reject(new Error(result.message));
    }
  };


  // const userInfo = async () => {
  //   const result: userInfoResponseData = await reqUserInfo();
  //   if (result.code === 200) {
  //     // 存储用户信息
  //     state.value.username = result.data.userInf.loginId;
  //     state.value.avatar = result.data.userInf.avatar;

  //     // 过滤动态路由
  //     const userAsyncRoute = filterAsyncRoutes(asyncRoute, result.data.menuList);

  //     // 将动态路由和静态路由合并
  //     state.value.menuRoutes = [...constantRoute, ...userAsyncRoute];

  //     // 动态添加路由
  //     userAsyncRoute.forEach((route) => {
  //       router.addRoute(route);
  //     });

  //     return 'ok';
  //   } else {
  //     return Promise.reject(new Error(result.message));
  //   }
  // };

  const userLogout = async () => {
    try {
      const result = await logout();
      if (result.code == 10000) {
        // console.log('退出登录成功');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.warn('退出登录时发生错误:', error.message);
      } else {
        console.warn('退出登录时发生错误:', error);
      }
    } finally {
      // 无论后端是否返回错误，都清除本地状态
      state.value.accessToken = null;
      state.value.refreshToken = null;
      state.value.expiresIn = null;
      clearAllTokens(); // 删除 token
    }
    return 'ok';
  };

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

      // 计算令牌过期时间
      const tokenExpiry = state.value.expiresIn;

      // 如果当前时间超过过期时间，则令牌已过期
      if (now >= tokenExpiry) {
        return false;
      }
    }

    return true;
  });

  //令牌刷新这部分呢 回头跟后端讨论一下问问后端那边的设计是怎样的，来进行这么一个挑调整
  // // 检查登录状态并处理令牌刷新
  // const isLoggedIn = computed(() => {
  //   // 检查是否有访问令牌
  //   if (!state.value.accessToken) {
  //     return false;
  //   }

  //   // 如果没有过期时间，假设令牌有效
  //   if (!state.value.expiresIn) {
  //     return true;
  //   }

  //   // 获取当前时间戳（秒）
  //   const now = Math.floor(Date.now() / 1000);

  //   // 令牌过期时间
  //   const tokenExpiry = state.value.expiresIn;

  //   // 令牌已过期
  //   if (now >= tokenExpiry) {
  //     return false;
  //   }

  //   // 令牌即将过期（小于5分钟），尝试刷新令牌
  //   if (tokenExpiry - now < 300 && state.value.refreshToken) {
  //     refreshAccessToken();
  //   }

  //   return true;
  // });

  // // 刷新访问令牌的方法
  // const refreshAccessToken = async () => {
  //   if (!state.value.refreshToken) return;

  //   try {
  //     const response = await refreshToken(state.value.refreshToken);

  //     if (response.code === 10000) {
  //       state.value.accessToken = response.data.accessToken;
  //       state.value.refreshToken = response.data.refreshToken || state.value.refreshToken;
  //       state.value.expiresIn = response.data.expiresIn;
  //     } else {
  //       // 刷新失败，可能需要重新登录
  //       userLogout();
  //     }
  //   } catch (error) {
  //     console.error('刷新令牌失败:', error);
  //     userLogout();
  //   }
  // };


  return {
    state,
    userLoginCode,
    userLoginPwd,
    isLoggedIn,
    // userInfo,
    userLogout
  };
});

export default useUserStore;
