/**
 * 电商系统SSO认证API接口
 * 与原有认证系统分离独立
 */
import axios from "axios";
import useMallUserStore from "@/store/modules/mallUser";
import type {
  SsoRegisterParams,
  LoginParams,
  GetAuthCodeParams,
  UpdatePasswordParams,
  CommonResult,
  LoginResponse,
  MemberInfo
} from "./types";

// 创建SSO专用的axios实例
const ssoRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000
});

// 创建需要认证的SSO请求实例
const ssoAuthRequest = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 10000
});

// 添加请求拦截器
ssoRequest.interceptors.request.use(
  (config) => {
    // 添加一些可能需要的请求头
    config.headers['Accept'] = 'application/json';
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return config;
  },
  (error) => {
    console.error('SSO API请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 为需要认证的请求添加拦截器
ssoAuthRequest.interceptors.request.use(
  (config) => {
    const mallUserStore = useMallUserStore();

    if (mallUserStore.isLoggedIn && mallUserStore.state.accessToken) {
      config.headers.Authorization = mallUserStore.state.accessToken;
    }

    config.headers['Accept'] = 'application/json';
    return config;
  },
  (error) => {
    console.error('SSO Auth API请求配置错误:', error);
    return Promise.reject(error);
  }
);

// 添加响应拦截器，处理响应数据
ssoRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('SSO API请求失败:', error);
    return Promise.reject(error);
  }
);

// 为认证请求添加响应拦截器
ssoAuthRequest.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('SSO Auth API请求失败:', error);
    return Promise.reject(error);
  }
);

/**
 * API 路径枚举
 */
enum API {
  REGISTER_URL = '/sso/register',       // 用户注册
  LOGIN_URL = '/sso/login',             // 用户登录
  MEMBER_INFO_URL = '/sso/info',        // 获取会员信息
  GET_AUTH_CODE_URL = '/sso/getAuthCode', // 获取验证码
  UPDATE_PASSWORD_URL = '/sso/updatePassword', // 修改密码
  REFRESH_TOKEN_URL = '/sso/refreshToken',     // 刷新Token
}

/**
 * 用户注册
 */
export const ssoRegister = (params: SsoRegisterParams) => {
  // 使用 URLSearchParams 将参数转换为 x-www-form-urlencoded 格式
  const formData = new URLSearchParams();
  formData.append('username', params.username);
  formData.append('password', params.password);
  formData.append('telephone', params.telephone);
  formData.append('authCode', params.authCode);

  return ssoRequest.post(API.REGISTER_URL, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * 用户登录
 */
export const ssoLogin = (params: LoginParams): Promise<CommonResult<LoginResponse>> => {
  // 使用 URLSearchParams 将参数转换为 x-www-form-urlencoded 格式
  const formData = new URLSearchParams();
  formData.append('username', params.username);
  formData.append('password', params.password);

  return ssoRequest.post(API.LOGIN_URL, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * 获取会员信息
 */
export const ssoInfo = (): Promise<CommonResult<MemberInfo>> => {
  return ssoAuthRequest.get(API.MEMBER_INFO_URL);
};

/**
 * 获取验证码
 */
export const ssoGetAuthCode = (params: GetAuthCodeParams) => {
  return ssoRequest.get(API.GET_AUTH_CODE_URL, { params });
};

/**
 * 修改密码
 */
export const ssoUpdatePassword = (params: UpdatePasswordParams) => {
  // 使用 URLSearchParams 将参数转换为 x-www-form-urlencoded 格式
  const formData = new URLSearchParams();
  formData.append('telephone', params.telephone);
  formData.append('password', params.password);
  formData.append('authCode', params.authCode);

  return ssoRequest.post(API.UPDATE_PASSWORD_URL, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

/**
 * 刷新Token
 */
export const ssoRefreshToken = (refreshToken: string): Promise<CommonResult<LoginResponse>> => {
  return ssoRequest.post(API.REFRESH_TOKEN_URL, { refreshToken });
};

// 导出所有SSO API
export default {
  ssoRegister,
  ssoLogin,
  ssoInfo,
  ssoGetAuthCode,
  ssoUpdatePassword,
  ssoRefreshToken,
};
