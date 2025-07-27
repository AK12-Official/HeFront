import request from "@/utils/request";
import type {
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
} from "./types";


enum API {
  CHECK_DUPLICATE_URL = '/api/videos/check-duplicate',          // 秒传检测请求
  UPLOAD_PERSON_VIDEO_URL = '/api/videos/upload-person-video',  // 小文件上传请求
  INIT_CHUNK_UPLOAD_URL = '/api/videos/init-chunk-upload',      // 初始化分块上传请求
  UPLOAD_CHUNK_URL = '/api/videos/upload-chunk',                // 分块上传请求
  MERGE_CHUNKS_URL = '/api/videos/merge-chunks',                // 合并分块请求
  GET_VIDEO_INFO_URL = '/api/videos/get-video-info',            // 获取视频详情请求
  GET_VIDEO_LIST_URL = '/api/videos/get-video-list',            // 获取视频列表请求
  UPDATE_VIDEO_INFO_URL = '/api/videos/update-video-info',      // 更新视频信息请求
  DELETE_VIDEO_URL = '/api/videos/delete-video',                // 删除视频请求
  GET_PLAY_INFO_URL = '/api/videos/get-play-info',              // 获取播放信息请求
  GET_RECOMMEND_LIST_URL = '/api/videos/get-recommend-list',    // 获取推荐列表请求
  RECORD_PLAY_URL = '/api/videos/record-play',                  // 记录播放请求
  GET_STATS_URL = '/api/videos/get-stats',                      // 获取统计信息请求
  UPDATE_STATS_URL = '/api/videos/update-stats',                // 更新统计数据请求
  GET_UPLOAD_PROGRESS_URL = '/api/videos/get-upload-progress',  // 查询上传进度请求
  CANCEL_UPLOAD_URL = '/api/videos/cancel-upload',              // 取消上传请求
}

/**
 * 秒传检测请求
 * @param params 检测参数，包含sha256、fileSize和可选的deviceType
 * @returns 上传进度信息
 */
export const checkDuplicate = (params: CheckDuplicateParams) => {
  return request.post<VideoResponse<UploadProgressDTO>, VideoResponse<UploadProgressDTO>>(
    API.CHECK_DUPLICATE_URL,
    null,
    { params }
  );
};

/**
 * 小文件上传请求
 * @param params 上传参数，包含title、description、sha256、deviceType和file
 * @returns 上传进度信息
 */
export const uploadPersonVideo = (params: UploadPersonVideoParams) => {
  // 创建FormData对象用于文件上传
  const formData = new FormData();
  formData.append('title', params.title);
  formData.append('description', params.description);
  formData.append('sha256', params.sha256);
  formData.append('deviceType', params.deviceType);
  formData.append('file', params.file);

  return request.post<VideoResponse<UploadProgressDTO>, VideoResponse<UploadProgressDTO>>(
    API.UPLOAD_PERSON_VIDEO_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

/**
 * 初始化分块上传请求
 * @param params 初始化参数，包含title、description、sha256、fileSize、totalChunks和可选的deviceType
 * @returns 上传进度信息
 */
export const initChunkUpload = (params: InitChunkUploadParams) => {
  return request.post<VideoResponse<UploadProgressDTO>, VideoResponse<UploadProgressDTO>>(
    API.INIT_CHUNK_UPLOAD_URL,
    null,
    { params }
  );
};

/**
 * 分块上传请求
 * @param params 分块上传参数，包含uploadSessionId、chunkIndex、chunkSha256、chunkSize和file
 * @returns 上传结果
 */
export const uploadChunk = (params: UploadChunkParams) => {
  // 创建FormData对象用于文件上传
  const formData = new FormData();
  formData.append('uploadSessionId', params.uploadSessionId);
  formData.append('chunkIndex', params.chunkIndex.toString());
  formData.append('chunkSha256', params.chunkSha256);
  formData.append('chunkSize', params.chunkSize.toString());
  formData.append('file', params.file);

  return request.post<StringResponse, StringResponse>(
    API.UPLOAD_CHUNK_URL,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

/**
 * 合并分块请求
 * @param params 合并参数，包含uploadSessionId和finalSha256
 * @returns 上传进度信息
 */
export const mergeChunks = (params: MergeChunksParams) => {
  return request.post<VideoResponse<UploadProgressDTO>, VideoResponse<UploadProgressDTO>>(
    API.MERGE_CHUNKS_URL,
    null,
    { params }
  );
};

/**
 * 获取视频详情请求
 * @param params 视频详情参数，包含videoId
 * @returns 视频详情信息
 */
export const getVideoInfo = (params: GetVideoInfoParams) => {
  return request.get<VideoResponse<VideoInfoDTO>, VideoResponse<VideoInfoDTO>>(
    API.GET_VIDEO_INFO_URL,
    { params }
  );
};

/**
 * 获取视频列表请求
 * @param params 列表查询参数，包含pageIndex、pageSize和可选的userPhone、title、status
 * @returns 视频列表分页结果
 */
export const getVideoList = (params: GetVideoListParams) => {
  return request.get<VideoResponse<VideoListResult>, VideoResponse<VideoListResult>>(
    API.GET_VIDEO_LIST_URL,
    { params }
  );
};

/**
 * 更新视频信息请求
 * @param params 更新参数，包含videoId、title和可选的description
 * @returns 更新结果
 */
export const updateVideoInfo = (params: UpdateVideoInfoParams) => {
  return request.put<StringResponse, StringResponse>(
    API.UPDATE_VIDEO_INFO_URL,
    null,
    { params }
  );
};

/**
 * 删除视频请求
 * @param params 删除参数，包含videoId
 * @returns 删除结果
 */
export const deleteVideo = (params: DeleteVideoParams) => {
  return request.delete<StringResponse, StringResponse>(
    API.DELETE_VIDEO_URL,
    { params }
  );
};

/**
 * 获取播放信息请求
 * @param params 播放信息参数，包含videoId
 * @returns 播放信息
 */
export const getPlayInfo = (params: GetPlayInfoParams) => {
  return request.get<VideoResponse<PlayInfoDTO>, VideoResponse<PlayInfoDTO>>(
    API.GET_PLAY_INFO_URL,
    { params }
  );
};

/**
 * 获取推荐列表请求
 * @param params 推荐参数，包含currentVideoId和可选的recommendCount、excludeVideoIds
 * @returns 推荐视频列表
 */
export const getRecommendList = (params: GetRecommendListParams) => {
  return request.get<VideoResponse<VideoInfoDTO[]>, VideoResponse<VideoInfoDTO[]>>(
    API.GET_RECOMMEND_LIST_URL,
    { params }
  );
};

/**
 * 记录播放请求
 * @param params 记录参数，包含videoId、playDuration和可选的playProgress
 * @returns 记录结果
 */
export const recordPlay = (params: RecordPlayParams) => {
  return request.post<StringResponse, StringResponse>(
    API.RECORD_PLAY_URL,
    null,
    { params }
  );
};

/**
 * 获取统计信息请求
 * @param params 统计参数，包含videoId
 * @returns 视频统计信息
 */
export const getStats = (params: GetStatsParams) => {
  return request.get<VideoResponse<VideoStatsDTO>, VideoResponse<VideoStatsDTO>>(
    API.GET_STATS_URL,
    { params }
  );
};

/**
 * 更新统计数据请求
 * @param params 更新统计参数，包含videoId、actionType和actionValue
 * @returns 更新结果
 */
export const updateStats = (params: UpdateStatsParams) => {
  return request.post<StringResponse, StringResponse>(
    API.UPDATE_STATS_URL,
    null,
    { params }
  );
};

/**
 * 查询上传进度请求
 * @param params 查询参数，包含uploadSessionId
 * @returns 上传进度信息
 */
export const getUploadProgress = (params: GetUploadProgressParams) => {
  return request.get<VideoResponse<UploadProgressDTO>, VideoResponse<UploadProgressDTO>>(
    API.GET_UPLOAD_PROGRESS_URL,
    { params }
  );
};

/**
 * 取消上传请求
 * @param params 取消参数，包含uploadSessionId
 * @returns 取消结果
 */
export const cancelUpload = (params: CancelUploadParams) => {
  return request.post<StringResponse, StringResponse>(
    API.CANCEL_UPLOAD_URL,
    null,
    { params }
  );
};