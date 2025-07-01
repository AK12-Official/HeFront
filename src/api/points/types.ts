// 积分响应通用接口
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface PointsResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 增加积分请求参数
export interface AddPointsParams {
  phone: string;
  points: number;
}

// 更新积分请求参数
export interface UpdatePointsParams {
  phone: string;
  pointsChange: number;
}

// 删除积分请求参数
export interface DeletePointsParams {
  phone: string;
}

// 获取积分请求参数
export interface GetPointsParams {
  phone: string;
}

// 用户积分信息
export interface UserPoints {
  phone: string;
  points: number;
  createTime: string;
  updateTime: string;
}

// 分页查询积分请求参数
export interface QueryPointsParams {
  pageIndex: number;
  pageSize: number;
  minPoints?: number;  // 最小积分，可选
  maxPoints?: number;  // 最大积分，可选
}

// 分页查询积分响应数据
export interface QueryPointsResult {
  pageIndex: number;
  pageSize: number;
  total: number;
  pages: number;
  list?: UserPoints[];
}

// 排行榜请求参数
export interface RankingParams {
  limit?: number;  // 最大数量，可选
}
