/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 身份验证相关的API接口
 * 包含登录、注册、验证码、令牌刷新等功能
 */
import request from "@/utils/request";
import type {
  LoginCodeParams, LoginPasswordParams, RegisterParams, ResetPasswordParams, SendCodeParams, RefreshTokenParams, RefreshTokenResponse,
  ResponseData
} from "./types";

/**
 * API 路径枚举
 * 集中管理所有身份验证相关的API端点
 */
enum API {
  SEND_CODE_URL = '/auth/send-code',   // 发送验证码
  REGISTER_URL = '/auth/register',     // 用户注册
  LOGIN_CODE_URL = '/auth/login-code', // 验证码登录
  LOGIN_PASSWORD_URL = '/auth/login-password', // 密码登录
  LOGOUT_URL = '/api/user/logout',         // 用户登出
  RESET_PASSWORD_URL = '/auth/reset-password', // 重置密码
  REFRESH_TOKEN_URL = '/auth/refresh-token',   // 刷新访问令牌
}


/**
 * 发送验证码
 * 支持登录、注册、重置密码等场景
 *
 * @param params 发送验证码所需参数
 * @param params.phone 手机号码
 * @param params.codeType 验证码类型（LOGIN/REGISTER/RESET_PASSWORD）
 * @param params.ipAddress IP地址
 * @returns 验证码发送结果
 */
export const sendVerificationCode = (params: SendCodeParams) => {
  return request.post<any, any>(API.SEND_CODE_URL, null, { params });
};

/**
 * 用户注册
 *
 * @param params 注册参数
 * @param params.phone 手机号码
 * @param params.code 验证码
 * @param params.password 密码
 * @param params.nickname 用户昵称
 * @returns 注册结果
 */
export const register = (params: RegisterParams) => {
  return request.post<any, any>(API.REGISTER_URL, null, { params });
};

/**
 * 验证码登录
 * 使用手机号和验证码进行登录
 *
 * @param params 验证码登录参数
 * @param params.phone 手机号码
 * @param params.code 验证码
 * @returns 登录结果，包含访问令牌等信息
 */
export const loginWithCode = (params: LoginCodeParams) => {
  return request.post<any, any>(API.LOGIN_CODE_URL, null, { params });
};

/**
 * 密码登录
 * 使用手机号和密码进行登录
 *
 * @param params 密码登录参数
 * @param params.phone 手机号码
 * @param params.password 密码
 * @returns 登录结果，包含访问令牌等信息
 */
export const loginWithPassword = (params: LoginPasswordParams) => {
  return request.post<any, any>(API.LOGIN_PASSWORD_URL, null, { params });
};

/**
 * 用户登出
 * 清除服务器端的会话信息
 *
 * @returns 登出结果
 */
export const logout = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};

/**
 * 重置密码
 * 通过验证码重置用户密码
 *
 * @param params 重置密码参数
 * @param params.phone 手机号码
 * @param params.code 验证码
 * @param params.newPassword 新密码
 * @param params.confirmPassword 确认新密码
 * @returns 重置密码结果
 */
export const resetPassword = (params: ResetPasswordParams) => {
  return request.post<any, any>(API.RESET_PASSWORD_URL, null, { params });
};


/**
 * 刷新访问令牌
 * 使用刷新令牌获取新的访问令牌
 *
 * @param params 刷新令牌参数
 * @returns 新的访问令牌和过期时间
 */
export const refreshToken = (params: RefreshTokenParams) => {
  return request.post<ResponseData<RefreshTokenResponse>, ResponseData<RefreshTokenResponse>>(
    API.REFRESH_TOKEN_URL, 
    params
  );
};