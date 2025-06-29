// 发送验证码参数
export interface SendCodeParams {
  phone: string;
  codeType: 'LOGIN' | 'REGISTER' | 'RESET_PASSWORD';
  ipAddress: string;
}

// 注册参数
export interface RegisterParams {
  phone: string;
  code: string;
  password: string;
  confirmPassword: string;
}

// 验证码登录参数
export interface LoginCodeParams {
  phone: string;
  code: string;
}

// 密码登录参数
export interface LoginPasswordParams {
  phone: string; // 或 username: string;
  password: string;
}

// 重置密码参数
export interface ResetPasswordParams {
  phone: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

// 响应数据类型
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}
