import request from "@/utils/request";
import type {
  AddPointsParams,
  UpdatePointsParams,
  DeletePointsParams,
  GetPointsParams,
  QueryPointsParams,
  RankingParams,
  PointsResponse,
  UserPoints,
  QueryPointsResult
} from "./types";

enum API {
  ADD_POINTS_URL = '/points/add',                       //增加积分
  UPDATE_POINTS_URL = '/points/update',                 //更新积分
  DELETE_POINTS_URL = '/points/delete',                 //删除积分
  GET_POINTS_URL = '/points/get-points',                //获取积分
  QUERY_POINTS_URL = '/points/query-points',            //查询积分
  RANKING_URL = '/points/ranking',                      //积分排行
}

/**
 * 增加积分
 * @param params 增加积分参数
 * @returns 积分操作结果
 */
export const addPoints = (params: AddPointsParams) => {
  return request.post<PointsResponse<string>, PointsResponse<string>>(
    API.ADD_POINTS_URL,
    null,
    { params }
  );
};

/**
 * 更新积分
 * @param params 更新积分参数
 * @returns 积分操作结果
 */
export const updatePoints = (params: UpdatePointsParams) => {
  return request.put<PointsResponse<string>, PointsResponse<string>>(
    API.UPDATE_POINTS_URL,
    null,
    { params }
  );
};

/**
 * 删除积分记录
 * @param params 删除积分参数
 * @returns 积分操作结果
 */
export const deletePoints = (params: DeletePointsParams) => {
  return request.delete<PointsResponse<string>, PointsResponse<string>>(
    API.DELETE_POINTS_URL,
    { params }
  );
};

/**
 * 获取指定用户的积分信息
 * @param params 获取积分参数
 * @returns 用户积分信息
 */
export const getPoints = (params: GetPointsParams) => {
  return request.get<PointsResponse<UserPoints>, PointsResponse<UserPoints>>(
    API.GET_POINTS_URL,
    { params }
  );
};

/**
 * 分页查询积分信息
 * @param params 查询参数
 * @returns 分页积分信息
 */
export const queryPoints = (params: QueryPointsParams) => {
  return request.get<PointsResponse<QueryPointsResult>, PointsResponse<QueryPointsResult>>(
    API.QUERY_POINTS_URL,
    { params }
  );
};

/**
 * 获取积分排行榜
 * @param params 排行榜参数
 * @returns 积分排行列表
 */
export const getRanking = (params?: RankingParams) => {
  return request.get<PointsResponse<UserPoints[]>, PointsResponse<UserPoints[]>>(
    API.RANKING_URL,
    { params }
  );
};

