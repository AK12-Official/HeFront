/**
 * 电商系统SSO认证相关类型定义
 * 与现有认证系统分离独立
 */

// 通用响应格式
export interface CommonResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// SSO注册参数
export interface SsoRegisterParams {
  username: string;
  password: string;
  telephone: string;
  authCode: string;
  icon?: string;
}

// 登录参数
export interface LoginParams {
  username: string;
  password: string;
}

// 获取验证码参数
export interface GetAuthCodeParams {
  telephone: string;
}

// 登录响应数据
export interface LoginResponse {
  token: string;
  tokenHead: string;
}

// 会员信息响应数据
export interface MemberInfo {
  id: number;
  memberLevelId: number;  // 会员等级ID
  username: string;
  password?: string;      // 密码（通常不返回，但API中有）
  nickname: string;
  phone: string;
  status: number;         // 状态
  createTime: string;     // 创建时间
  icon: string;           // 头像
  gender: number;         // 性别
  birthday: string;       // 生日
  city: string;           // 城市
  job: string;            // 职业
  personalizedSignature: string;  // 个性签名
  integration: number;    // 积分
  growth: number;         // 成长值
}

// 修改密码参数
export interface UpdatePasswordParams {
  telephone: string;
  password: string;
  authCode: string;
}

// 刷新Token响应
export interface RefreshTokenResponse {
  token: string;
  tokenHead: string;
}
