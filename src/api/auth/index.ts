/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "@/utils/request";
import type { LoginCodeParams, LoginPasswordParams, RegisterParams, ResetPasswordParams, SendCodeParams } from "./types";



enum API {
  LOGIN_URL = '/user/login',         //fake
  SEND_CODE_URL = '/auth/send-code',
  REGISTER_URL = '/auth/register',
  LOGIN_CODE_URL = '/auth/login-code',
  LOGIN_PASSWORD_URL = '/auth/login-password',
  LOGOUT_URL = '/user/logout',
  RESET_PASSWORD_URL = '/auth/reset-password',
  REFRESH_TOKEN_URL = '/auth/refresh-token',
}

//假接口登录
export const reqLogin = (data: any) => request.post<any, any>(API.LOGIN_URL, data);


// 发送验证码
export const sendVerificationCode = (params: SendCodeParams) => {
  return request.post<any, any>(API.SEND_CODE_URL, null, { params });
};

// 注册
export const register = (params: RegisterParams) => {
  return request.post<any, any>(API.REGISTER_URL, null, { params });
};

// 验证码登录
export const loginWithCode = (params: LoginCodeParams) => {
  return request.post<any, any>(API.LOGIN_CODE_URL, null, { params });
};

// 密码登录
export const loginWithPassword = (params: LoginPasswordParams) => {
  return request.post<any, any>(API.LOGIN_PASSWORD_URL, null, { params });
};

// 登出
export const logout = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};

// 重置密码
export const resetPassword = (params: ResetPasswordParams) => {
  return request.post<any, any>(API.RESET_PASSWORD_URL, null, { params });
};

// 刷新令牌
export const refreshToken = (refreshToken: string) => {
  return request.post<any, any>(API.REFRESH_TOKEN_URL, { refreshToken });
};
