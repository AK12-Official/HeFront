import request from "@/utils/request";

enum API {
  LOGIN_URL = 'user/login',
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const reqLogin = (data: any) => request.post<any, any>(API.LOGIN_URL, data);
