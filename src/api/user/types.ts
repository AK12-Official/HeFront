// 用户API响应通用接口
export interface UserResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 会员信息DTO
export interface MemberInfoDTO {
  userId: string;
  phone: string;
  nickname: string;
  avatarUrl: string;
  registerTime: string;
}

// 通过手机号获取用户信息的请求参数
export interface GetUserInfoByPhoneParams {
  phone: string;
}

// 通过手机号获取用户信息的响应数据
export interface UserInfoByPhoneDTO {
  userId: string;
  phone: string;
  nickname: string;
  avatarUrl: string;
  registerTime: string;
}