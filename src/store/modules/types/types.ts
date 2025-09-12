
//定义小仓库数据state类型
export interface UserState {
  accessToken: string | null, // 用户登录成功后返回的token
  refreshToken: string | null, // 用户登录成功后返回的refreshToken
  expiresIn: number | null, // token的过期时间
  score: number | null, // 用户积分

  userId?: number, // 用户ID
  phone?: string, // 手机号
  nickname?: string, // 昵称
  desc?: string, // 描述
}

