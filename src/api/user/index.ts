/* eslint-disable @typescript-eslint/no-explicit-any */
import request from "@/utils/request";

enum API {
  PROFILE_URL = '/user/profile',         //获取用户信息
}

export const reqProfile = () => request.get<any, any>(API.PROFILE_URL);
