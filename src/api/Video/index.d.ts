import {
  CheckDuplicateParams,
  UploadPersonVideoParams,
  InitChunkUploadParams,
  UploadChunkParams,
  MergeChunksParams,
  GetVideoInfoParams,
  GetVideoListParams,
  UpdateVideoInfoParams,
  DeleteVideoParams,
  GetPlayInfoParams,
  GetRecommendListParams,
  RecordPlayParams,
  GetStatsParams,
  UpdateStatsParams,
  GetUploadProgressParams,
  CancelUploadParams,
  VideoResponse,
  StringResponse,
  UploadProgressDTO,
  VideoInfoDTO,
  VideoListResult,
  PlayInfoDTO,
  VideoStatsDTO
} from './types';

/**
 * 秒传检测请求
 * @param params 检测参数，包含sha256、fileSize和可选的deviceType
 * @returns 上传进度信息
 */
export declare function checkDuplicate(params: CheckDuplicateParams): Promise<VideoResponse<UploadProgressDTO>>;

/**
 * 小文件上传请求
 * @param params 上传参数，包含title、description、sha256、deviceType和file
 * @returns 上传进度信息
 */
export declare function uploadPersonVideo(params: UploadPersonVideoParams): Promise<VideoResponse<UploadProgressDTO>>;

/**
 * 初始化分块上传请求
 * @param params 初始化参数，包含title、description、sha256、fileSize、totalChunks和可选的deviceType
 * @returns 上传进度信息
 */
export declare function initChunkUpload(params: InitChunkUploadParams): Promise<VideoResponse<UploadProgressDTO>>;

/**
 * 分块上传请求
 * @param params 分块上传参数，包含uploadSessionId、chunkIndex、chunkSha256、chunkSize和file
 * @returns 上传结果
 */
export declare function uploadChunk(params: UploadChunkParams): Promise<StringResponse>;

/**
 * 合并分块请求
 * @param params 合并参数，包含uploadSessionId和finalSha256
 * @returns 上传进度信息
 */
export declare function mergeChunks(params: MergeChunksParams): Promise<VideoResponse<UploadProgressDTO>>;

/**
 * 获取视频详情请求
 * @param params 视频详情参数，包含videoId
 * @returns 视频详情信息
 */
export declare function getVideoInfo(params: GetVideoInfoParams): Promise<VideoResponse<VideoInfoDTO>>;

/**
 * 获取视频列表请求
 * @param params 列表查询参数，包含pageIndex、pageSize和可选的userPhone、title、status
 * @returns 视频列表分页结果
 */
export declare function getVideoList(params: GetVideoListParams): Promise<VideoResponse<VideoListResult>>;

/**
 * 更新视频信息请求
 * @param params 更新参数，包含videoId、title和可选的description
 * @returns 更新结果
 */
export declare function updateVideoInfo(params: UpdateVideoInfoParams): Promise<StringResponse>;

/**
 * 删除视频请求
 * @param params 删除参数，包含videoId
 * @returns 删除结果
 */
export declare function deleteVideo(params: DeleteVideoParams): Promise<StringResponse>;

/**
 * 获取播放信息请求
 * @param params 播放信息参数，包含videoId
 * @returns 播放信息
 */
export declare function getPlayInfo(params: GetPlayInfoParams): Promise<VideoResponse<PlayInfoDTO>>;

/**
 * 获取推荐列表请求
 * @param params 推荐参数，包含currentVideoId和可选的recommendCount、excludeVideoIds
 * @returns 推荐视频列表
 */
export declare function getRecommendList(params: GetRecommendListParams): Promise<VideoResponse<VideoInfoDTO[]>>;

/**
 * 记录播放请求
 * @param params 记录参数，包含videoId、playDuration和可选的playProgress
 * @returns 记录结果
 */
export declare function recordPlay(params: RecordPlayParams): Promise<StringResponse>;

/**
 * 获取统计信息请求
 * @param params 统计参数，包含videoId
 * @returns 视频统计信息
 */
export declare function getStats(params: GetStatsParams): Promise<VideoResponse<VideoStatsDTO>>;

/**
 * 更新统计数据请求
 * @param params 更新统计参数，包含videoId、actionType和actionValue
 * @returns 更新结果
 */
export declare function updateStats(params: UpdateStatsParams): Promise<StringResponse>;

/**
 * 查询上传进度请求
 * @param params 查询参数，包含uploadSessionId
 * @returns 上传进度信息
 */
export declare function getUploadProgress(params: GetUploadProgressParams): Promise<VideoResponse<UploadProgressDTO>>;

/**
 * 取消上传请求
 * @param params 取消参数，包含uploadSessionId
 * @returns 取消结果
 */
export declare function cancelUpload(params: CancelUploadParams): Promise<StringResponse>;

export {
  CheckDuplicateParams,
  UploadPersonVideoParams,
  InitChunkUploadParams,
  UploadChunkParams,
  MergeChunksParams,
  GetVideoInfoParams,
  GetVideoListParams,
  UpdateVideoInfoParams,
  DeleteVideoParams,
  GetPlayInfoParams,
  GetRecommendListParams,
  RecordPlayParams,
  GetStatsParams,
  UpdateStatsParams,
  GetUploadProgressParams,
  CancelUploadParams,
  VideoResponse,
  StringResponse,
  UploadProgressDTO,
  VideoInfoDTO,
  VideoListResult,
  PlayInfoDTO,
  VideoStatsDTO
};