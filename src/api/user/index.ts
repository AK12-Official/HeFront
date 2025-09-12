/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "@/utils/request";
import type { UserResponse, MemberInfoDTO, GetUserInfoByPhoneParams, UserInfoByPhoneDTO } from './types';

enum API {
  PROFILE_URL = '/user/profile',         //获取用户信息
  MEMBER_INFO_URL = '/sso/info',          //获取会员信息
  GET_OTHER_PROFILE_URL = '/user/get-other-profile',  //通过手机号获取其他用户信息
}

export const reqProfile = () => request.get<any, any>(API.PROFILE_URL);

// 获取会员信息
export const getMemberInfo = () => request.get<UserResponse<MemberInfoDTO>, MemberInfoDTO>(API.MEMBER_INFO_URL);

// 通过手机号获取用户信息
export const getUserInfoByPhone = (params: GetUserInfoByPhoneParams) => 
  request.get<UserResponse<UserInfoByPhoneDTO>, UserResponse<UserInfoByPhoneDTO>>(API.GET_OTHER_PROFILE_URL, { params });