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
  userPhone: string;
  title: string;
  description?: string;
  duration: number;           // 视频时长（秒）
  width: number;              // 视频宽度
  height: number;             // 视频高度
  fileSize: number;           // 文件大小（字节）
  fastdfsFileId: string;      // FastDFS文件ID
  coverFileId: string;        // 封面文件ID
  cdnVideoUrl: string;        // CDN视频URL
  cdnCoverUrl: string;        // CDN封面URL
  status: string;             // 视频状态
  createTime: string;         // 创建时间
  uploadTime?: string;        // 兼容旧字段
  coverUrl?: string;          // 兼容旧字段
  playUrl?: string;           // 兼容旧字段
  viewCount?: number;         // 播放量
  likeCount?: number;         // 点赞数
  commentCount?: number;      // 评论数
  shareCount?: number;        // 分享数
}

// 视频列表分页结果
export interface VideoListResult {
  pageIndex: number;
  pageSize: number;
  total: number;
  pages: number;
  rows: VideoInfoDTO[];  
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
  pageIndex: number;        // 查询页码 (必需)
  pageSize: number;         // 查询条数 (必需)
  userPhone?: string;       // 上传视频的用户手机号 (可选)
  title?: string;           // 视频标题 (可选)
  status?: string;          // 视频状态 (可选) UPLOADING|PROCESSING|PUBLISHED|DELETED
  minDuration?: number;     // 最小视频时长 (可选)
  maxDuration?: number;     // 最大视频时长 (可选)
  startTime?: string;       // 视频开始时间 (可选)
  endTime?: string;         // 视频结束时间 (可选)
  orderBy?: string;         // 排序字段 (可选) CREATE_TIME|PLAY_COUNT|LIKE_COUNT
  orderDirection?: string;  // 排序方向 (可选) ASC|DESC
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