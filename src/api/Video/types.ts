// 视频API响应通用接口
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface VideoResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 字符串响应接口
export interface StringResponse {
  code: number;
  message: string;
  data: string;
}

// 上传进度DTO
export interface UploadProgressDTO {
  uploadSessionId?: string;
  totalChunks?: number;
  completedChunks?: number;
  progressPercent?: number;
  status?: string;
}

// 视频信息DTO
export interface VideoInfoDTO {
  videoId: string;
  title: string;
  description?: string;
  uploadTime: string;
  duration?: number;
  coverUrl?: string;
  playUrl?: string;
  status: string;
  userPhone?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shareCount?: number;
}

// 视频列表分页结果
export interface VideoListResult {
  pageIndex: number;
  pageSize: number;
  total: number;
  pages: number;
  list: VideoInfoDTO[];
}

// 播放信息DTO
export interface PlayInfoDTO {
  videoId: string;
  title: string;
  description?: string;
  playUrl: string;
  coverUrl?: string;
  duration: number;
  resolution?: string;
  format?: string;
}

// 视频统计信息DTO
export interface VideoStatsDTO {
  videoId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  updateTime: string;
}

// 秒传检测请求参数
export interface CheckDuplicateParams {
  sha256: string;
  fileSize: number;
  deviceType?: string;
}

// 小文件上传请求参数
export interface UploadPersonVideoParams {
  title: string;
  description: string;
  sha256: string;
  deviceType: string;
  file: File;
}

// 初始化分块上传请求参数
export interface InitChunkUploadParams {
  title: string;
  description?: string;
  sha256: string;
  fileSize: number;
  totalChunks: number;
  deviceType?: string;
}

// 分块上传请求参数
export interface UploadChunkParams {
  uploadSessionId: string;
  chunkIndex: number;
  chunkSha256: string;
  chunkSize: number;
  file: File;
}

// 合并分块请求参数
export interface MergeChunksParams {
  uploadSessionId: string;
  finalSha256: string;
}

// 获取视频详情请求参数
export interface GetVideoInfoParams {
  videoId: string;
}

// 获取视频列表请求参数
export interface GetVideoListParams {
  pageIndex: number;
  pageSize: number;
  userPhone?: string;
  title?: string;
  status?: string;
}

// 更新视频信息请求参数
export interface UpdateVideoInfoParams {
  videoId: string;
  title: string;
  description?: string;
}

// 删除视频请求参数
export interface DeleteVideoParams {
  videoId: string;
}

// 获取播放信息请求参数
export interface GetPlayInfoParams {
  videoId: string;
}

// 获取推荐列表请求参数
export interface GetRecommendListParams {
  currentVideoId: string;
  recommendCount?: number;
  excludeVideoIds?: string;
}

// 记录播放请求参数
export interface RecordPlayParams {
  videoId: string;
  playDuration: number;
  playProgress?: number;
}

// 获取统计信息请求参数
export interface GetStatsParams {
  videoId: string;
}

// 更新统计数据请求参数
export interface UpdateStatsParams {
  videoId: string;
  actionType: string;
  actionValue: number;
}

// 查询上传进度请求参数
export interface GetUploadProgressParams {
  uploadSessionId: string;
}

// 取消上传请求参数
export interface CancelUploadParams {
  uploadSessionId: string;
}