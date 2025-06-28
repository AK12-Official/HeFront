
//定义小仓库数据state类型
export interface UserState {
  accessToken: string | null, // 用户登录成功后返回的token
  refreshToken: string | null, // 用户登录成功后返回的refreshToken
  expiresIn: number | null, // token的过期时间
  score: number, // 用户积分
}

