/**
 * 电商系统SSO认证API接口
 * 与原有认证系统分离独立
 */
import request from "@/utils/request";
import type {
  SsoRegisterParams,
  LoginParams,
  GetAuthCodeParams,
  UpdatePasswordParams
} from "./types";

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
  return request.post(API.REGISTER_URL, null, { params });
};

/**
 * 用户登录
 */
export const ssoLogin = (params: LoginParams) => {
  return request.post(API.LOGIN_URL, null, { params });
};

/**
 * 获取会员信息
 */
export const ssoInfo = () => {
  return request.get(API.MEMBER_INFO_URL);
};

/**
 * 获取验证码
 */
export const ssoGetAuthCode = (params: GetAuthCodeParams) => {
  return request.get(API.GET_AUTH_CODE_URL, { params });
};

/**
 * 修改密码
 */
export const ssoUpdatePassword = (params: UpdatePasswordParams) => {
  return request.post(API.UPDATE_PASSWORD_URL, null, { params });
};

/**
 * 刷新Token
 */
export const ssoRefreshToken = () => {
  return request.get(API.REFRESH_TOKEN_URL);
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
