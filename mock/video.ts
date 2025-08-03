// 视频相关的Mock接口

// 生成随机视频数据的函数
function createVideoList(count: number = 20) {
  return Array.from({ length: count }, (_, i) => ({
    videoId: `video_${i + 1}`,
    title: `这是一个非常有趣的短视频标题 ${i + 1}`,
    description: `这是视频${i + 1}的详细描述，包含了丰富的内容和有趣的故事情节。`,
    coverUrl: `https://picsum.photos/300/400?random=${i}`,
    playUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_${i + 1}.mp4`,
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
      avatar: `https://picsum.photos/40/40?random=${i}`,
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
  }
];