// 视频相关的Mock接口

// 生成随机视频数据的函数
function createVideoList(count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({
    videoId: `video_${i + 1}`,
    title: `这是一个非常有趣的短视频标题 ${i + 1}`,
    description: `这是视频${i + 1}的详细描述，包含了丰富的内容和有趣的故事情节。`,
    coverUrl: '',
    playUrl: '/src/assets/videos/demo.mp4',
    duration: Math.floor(Math.random() * 300) + 60, // 60-360秒
    uploadTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // 最近30天内
    status: 'published',
    userPhone: `138${String(i).padStart(8, '0')}`,
    viewCount: Math.floor(Math.random() * 1000000),
    likeCount: Math.floor(Math.random() * 50000),
    commentCount: Math.floor(Math.random() * 10000),
    shareCount: Math.floor(Math.random() * 5000),
    author: {
      id: i + 1,
      name: `用户${i + 1}`,
      avatar: '',
    }
  }));
}

// 存储视频数据
let videoDatabase = createVideoList(20);

// 格式化时长显示
function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default [
  // 获取视频列表
  {
    url: '/api/videos/get-video-list',
    method: 'get',
    response: (req) => {
      const { pageIndex = 1, pageSize = 20, userPhone, title, status } = req.query || {};

      let filteredVideos = [...videoDatabase];

      // 根据查询条件过滤
      if (userPhone) {
        filteredVideos = filteredVideos.filter(video => video.userPhone.includes(userPhone));
      }
      if (title) {
        filteredVideos = filteredVideos.filter(video => video.title.includes(title));
      }
      if (status) {
        filteredVideos = filteredVideos.filter(video => video.status === status);
      }

      // 分页处理
      const startIndex = (pageIndex - 1) * pageSize;
      const endIndex = startIndex + parseInt(pageSize);
      const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

      // 格式化返回数据，添加格式化的时长
      const formattedVideos = paginatedVideos.map(video => ({
        ...video,
        duration: formatDuration(video.duration),
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        cover: video.coverUrl
      }));

      return {
        code: 10000,
        message: '获取视频列表成功',
        data: {
          pageIndex: parseInt(pageIndex),
          pageSize: parseInt(pageSize),
          total: filteredVideos.length,
          pages: Math.ceil(filteredVideos.length / pageSize),
          list: formattedVideos
        }
      };
    }
  },

  // 获取视频详情
  {
    url: '/api/videos/get-video-info',
    method: 'get',
    response: (req) => {
      const { videoId } = req.query || {};

      if (!videoId) {
        return {
          code: 40001,
          message: '视频ID不能为空',
          data: null
        };
      }

      const video = videoDatabase.find(v => v.videoId === videoId);

      if (!video) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      // 格式化返回数据
      const formattedVideo = {
        ...video,
        duration: formatDuration(video.duration),
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        cover: video.coverUrl
      };

      return {
        code: 10000,
        message: '获取视频详情成功',
        data: formattedVideo
      };
    }
  },

  // 更新视频信息
  {
    url: '/api/videos/update-video-info',
    method: 'put',
    response: (req) => {
      const { videoId, title, description } = req.query || {};

      if (!videoId) {
        return {
          code: 40001,
          message: '视频ID不能为空',
          data: null
        };
      }

      const videoIndex = videoDatabase.findIndex(v => v.videoId === videoId);

      if (videoIndex === -1) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      // 更新视频信息
      if (title) {
        videoDatabase[videoIndex].title = title;
      }
      if (description) {
        videoDatabase[videoIndex].description = description;
      }

      return {
        code: 10000,
        message: '更新视频信息成功',
        data: {
          videoId: videoId,
          title: videoDatabase[videoIndex].title,
          description: videoDatabase[videoIndex].description
        }
      };
    }
  },

  // 获取播放信息
  {
    url: '/api/videos/get-play-info',
    method: 'get',
    response: (req) => {
      const { videoId } = req.query || {};

      if (!videoId) {
        return {
          code: 40001,
          message: '视频ID不能为空',
          data: null
        };
      }

      const video = videoDatabase.find(v => v.videoId === videoId);

      if (!video) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      return {
        code: 10000,
        message: '获取播放信息成功',
        data: {
          videoId: video.videoId,
          playUrl: video.playUrl,
          duration: video.duration,
          resolution: '1080p',
          subtitleUrl: `https://example.com/subtitles/${videoId}.vtt`,
          qualities: [
            { quality: '480p', url: '/src/assets/videos/demo.mp4' },
            { quality: '720p', url: '/src/assets/videos/demo.mp4' },
            { quality: '1080p', url: '/src/assets/videos/demo.mp4' }
          ]
        }
      };
    }
  },

  // 获取推荐列表
  {
    url: '/api/videos/get-recommend-list',
    method: 'get',
    response: (req) => {
      const { currentVideoId, recommendCount = 10, excludeVideoIds } = req.query || {};

      if (!currentVideoId) {
        return {
          code: 40001,
          message: '当前视频ID不能为空',
          data: null
        };
      }

      let recommendVideos = [...videoDatabase];

      // 排除当前视频
      recommendVideos = recommendVideos.filter(v => v.videoId !== currentVideoId);

      // 排除指定的视频ID
      if (excludeVideoIds) {
        const excludeIds = Array.isArray(excludeVideoIds) ? excludeVideoIds : [excludeVideoIds];
        recommendVideos = recommendVideos.filter(v => !excludeIds.includes(v.videoId));
      }

      // 随机排序并取指定数量
      recommendVideos = recommendVideos
        .sort(() => Math.random() - 0.5)
        .slice(0, parseInt(recommendCount));

      // 格式化返回数据
      const formattedVideos = recommendVideos.map(video => ({
        ...video,
        duration: formatDuration(video.duration),
        views: video.viewCount,
        likes: video.likeCount,
        comments: video.commentCount,
        cover: video.coverUrl
      }));

      return {
        code: 10000,
        message: '获取推荐列表成功',
        data: formattedVideos
      };
    }
  },

  // 记录播放
  {
    url: '/api/videos/record-play',
    method: 'post',
    response: (req) => {
      const { videoId, playDuration, playProgress } = req.query || {};

      if (!videoId) {
        return {
          code: 40001,
          message: '视频ID不能为空',
          data: null
        };
      }

      const videoIndex = videoDatabase.findIndex(v => v.videoId === videoId);

      if (videoIndex === -1) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      // 更新播放次数
      videoDatabase[videoIndex].viewCount += 1;

      return {
        code: 10000,
        message: '播放记录成功',
        data: {
          videoId: videoId,
          playDuration: playDuration || 0,
          playProgress: playProgress || 0,
          totalViews: videoDatabase[videoIndex].viewCount
        }
      };
    }
  },

  // 获取统计信息
  {
    url: '/api/videos/get-stats',
    method: 'get',
    response: (req) => {
      const { videoId } = req.query || {};

      if (!videoId) {
        return {
          code: 40001,
          message: '视频ID不能为空',
          data: null
        };
      }

      const video = videoDatabase.find(v => v.videoId === videoId);

      if (!video) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      return {
        code: 10000,
        message: '获取统计信息成功',
        data: {
          videoId: video.videoId,
          viewCount: video.viewCount,
          likeCount: video.likeCount,
          commentCount: video.commentCount,
          shareCount: video.shareCount,
          avgWatchTime: Math.floor(Math.random() * 180) + 30, // 30-210秒
          completionRate: (Math.random() * 0.4 + 0.6).toFixed(2), // 60%-100%
          dailyViews: Math.floor(Math.random() * 1000) + 100,
          weeklyViews: Math.floor(Math.random() * 5000) + 500
        }
      };
    }
  },

  // 更新统计数据
  {
    url: '/api/videos/update-stats',
    method: 'post',
    response: (req) => {
      const { videoId, actionType, actionValue = 1 } = req.query || {};

      if (!videoId || !actionType) {
        return {
          code: 40001,
          message: '视频ID和操作类型不能为空',
          data: null
        };
      }

      const videoIndex = videoDatabase.findIndex(v => v.videoId === videoId);

      if (videoIndex === -1) {
        return {
          code: 40404,
          message: '视频不存在',
          data: null
        };
      }

      // 根据操作类型更新统计数据
      switch (actionType) {
        case 'like':
          videoDatabase[videoIndex].likeCount += parseInt(actionValue);
          break;
        case 'comment':
          videoDatabase[videoIndex].commentCount += parseInt(actionValue);
          break;
        case 'share':
          videoDatabase[videoIndex].shareCount += parseInt(actionValue);
          break;
        case 'view':
          videoDatabase[videoIndex].viewCount += parseInt(actionValue);
          break;
        default:
          return {
            code: 40002,
            message: '不支持的操作类型',
            data: null
          };
      }

      return {
        code: 10000,
        message: '更新统计数据成功',
        data: {
          videoId: videoId,
          actionType: actionType,
          actionValue: parseInt(actionValue),
          newCount: videoDatabase[videoIndex][actionType === 'like' ? 'likeCount' :
            actionType === 'comment' ? 'commentCount' :
              actionType === 'share' ? 'shareCount' : 'viewCount']
        }
      };
    }
  },

  // 秒传检测
  {
    url: '/api/videos/check-duplicate',
    method: 'post',
    response: (req) => {
      const { sha256, fileSize } = req.body || {};

      if (!sha256 || !fileSize) {
        return {
          code: 40000,
          message: '参数错误：sha256和fileSize不能为空',
          data: null
        };
      }

      // 模拟10%的概率文件已存在（秒传成功）
      const isDuplicate = Math.random() < 0.1;

      if (isDuplicate) {
        return {
          code: 10000,
          message: '文件已存在，秒传成功',
          data: {
            status: 'COMPLETED',
            videoId: `video_${Date.now()}`,
            uploadUrl: null,
            chunkSize: null
          }
        };
      } else {
        return {
          code: 10000,
          message: '文件不存在，需要上传',
          data: {
            status: 'NOT_FOUND',
            videoId: null,
            uploadUrl: `http://localhost:8090/upload/${sha256}`,
            chunkSize: 1024 * 1024 * 5 // 5MB分块大小
          }
        };
      }
    }
  },

  // 小文件上传
  {
    url: '/api/videos/upload-person-video',
    method: 'post',
    response: (req) => {
      const { title, description, sha256 } = req.body || {};

      if (!title || !sha256) {
        return {
          code: 40000,
          message: '参数错误：title和sha256不能为空',
          data: null
        };
      }

      // 模拟上传处理时间
      setTimeout(() => { }, 1000);

      const newVideoId = `video_${Date.now()}`;
      const newVideo = {
        videoId: newVideoId,
        title: title,
        description: description || '',
        coverUrl: `${Date.now()}`,
        playUrl: '/src/assets/videos/demo.mp4',
        duration: Math.floor(Math.random() * 300) + 60,
        uploadTime: new Date().toISOString(),
        status: 'published',
        userPhone: '13800000000', // 模拟当前用户
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        author: {
          id: 999,
          name: '当前用户',
          avatar: '999',
        }
      };

      // 添加到视频数据库
      videoDatabase.unshift(newVideo);

      return {
        code: 10000,
        message: '视频上传成功',
        data: {
          videoId: newVideoId,
          status: 'SUCCESS',
          playUrl: newVideo.playUrl,
          coverUrl: newVideo.coverUrl
        }
      };
    }
  },

  // 初始化分块上传
  {
    url: '/api/videos/init-chunk-upload',
    method: 'post',
    response: (req) => {
      const { sha256, fileSize, fileName, chunkSize } = req.body || {};

      if (!sha256 || !fileSize || !fileName) {
        return {
          code: 40000,
          message: '参数错误：sha256、fileSize和fileName不能为空',
          data: null
        };
      }

      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const totalChunks = Math.ceil(fileSize / (chunkSize || 1024 * 1024 * 5));

      return {
        code: 10000,
        message: '初始化分块上传成功',
        data: {
          uploadId: uploadId,
          chunkSize: chunkSize || 1024 * 1024 * 5,
          totalChunks: totalChunks,
          uploadUrls: Array.from({ length: totalChunks }, (_, i) =>
            `http://localhost:8090/upload/chunk/${uploadId}/${i + 1}`
          )
        }
      };
    }
  },

  // 分块上传
  {
    url: '/api/videos/upload-chunk',
    method: 'post',
    response: (req) => {
      const { uploadId, chunkNumber } = req.body || {};

      if (!uploadId || !chunkNumber) {
        return {
          code: 40000,
          message: '参数错误：uploadId和chunkNumber不能为空',
          data: null
        };
      }

      // 模拟上传处理时间
      setTimeout(() => { }, 500);

      return {
        code: 10000,
        message: '分块上传成功',
        data: {
          uploadId: uploadId,
          chunkNumber: parseInt(chunkNumber),
          status: 'SUCCESS',
          etag: `etag_${uploadId}_${chunkNumber}_${Date.now()}`
        }
      };
    }
  },

  // 合并分块
  {
    url: '/api/videos/merge-chunks',
    method: 'post',
    response: (req) => {
      const { uploadId, sha256, title, description } = req.body || {};

      if (!uploadId || !sha256) {
        return {
          code: 40000,
          message: '参数错误：uploadId和sha256不能为空',
          data: null
        };
      }

      // 模拟合并处理时间
      setTimeout(() => { }, 2000);

      const newVideoId = `video_${Date.now()}`;
      const newVideo = {
        videoId: newVideoId,
        title: title || '未命名视频',
        description: description || '',
        coverUrl: `${Date.now()}`,
        playUrl: '/src/assets/videos/demo.mp4',
        duration: Math.floor(Math.random() * 300) + 60,
        uploadTime: new Date().toISOString(),
        status: 'published',
        userPhone: '13800000000',
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        author: {
          id: 999,
          name: '当前用户',
          avatar: '999',
        }
      };

      // 添加到视频数据库
      videoDatabase.unshift(newVideo);

      return {
        code: 10000,
        message: '视频合并成功',
        data: {
          videoId: newVideoId,
          status: 'SUCCESS',
          playUrl: newVideo.playUrl,
          coverUrl: newVideo.coverUrl
        }
      };
    }
  },

  // 删除视频
  {
    url: '/api/videos/delete-video',
    method: 'delete',
    response: (req) => {
      const { videoId } = req.query || {};

      if (!videoId) {
        return {
          code: 40000,
          message: '参数错误：videoId不能为空',
          data: null
        };
      }

      const videoIndex = videoDatabase.findIndex(video => video.videoId === videoId);

      if (videoIndex === -1) {
        return {
          code: 40400,
          message: '视频不存在',
          data: null
        };
      }

      // 从数据库中删除视频
      videoDatabase.splice(videoIndex, 1);

      return {
        code: 10000,
        message: '视频删除成功',
        data: {
          videoId: videoId,
          status: 'DELETED'
        }
      };
    }
  },

  // 查询上传进度
  {
    url: '/api/videos/get-upload-progress',
    method: 'get',
    response: (req) => {
      const { uploadId } = req.query || {};

      if (!uploadId) {
        return {
          code: 40000,
          message: '参数错误：uploadId不能为空',
          data: null
        };
      }

      // 模拟上传进度
      const progress = Math.floor(Math.random() * 100);
      const status = progress === 100 ? 'COMPLETED' : 'UPLOADING';

      return {
        code: 10000,
        message: '获取上传进度成功',
        data: {
          uploadId: uploadId,
          status: status,
          progress: progress,
          uploadedChunks: Math.floor(progress / 10),
          totalChunks: 10,
          uploadSpeed: Math.floor(Math.random() * 1000) + 500, // KB/s
          remainingTime: status === 'COMPLETED' ? 0 : Math.floor(Math.random() * 300) + 60 // 秒
        }
      };
    }
  },

  // 取消上传
  {
    url: '/api/videos/cancel-upload',
    method: 'post',
    response: (req) => {
      const { uploadId } = req.body || {};

      if (!uploadId) {
        return {
          code: 40000,
          message: '参数错误：uploadId不能为空',
          data: null
        };
      }

      return {
        code: 10000,
        message: '上传已取消',
        data: {
          uploadId: uploadId,
          status: 'CANCELLED',
          cancelTime: new Date().toISOString()
        }
      };
    }
  }
];