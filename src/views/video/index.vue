<template>
  <div class="home">
    <div class="page-header">
      <h2 class="page-title">视频广场</h2>
      <el-button type="primary" @click="goToUpload" class="upload-btn">
        <el-icon>
          <Upload />
        </el-icon>
        上传视频
      </el-button>
    </div>
    <div v-loading="loading" class="waterfall">
      <div v-for="item in videoList" :key="item.videoId" class="video-card" :data-video-id="item.videoId">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="flip-container">
          <!-- 正面 -->
          <div class="flip-card front">
            <div class="video-cover" @click="playVideo(item)">
              <el-image :src="item.cover || item.coverUrl" fit="cover">
                <template #placeholder>
                  <div class="image-placeholder">
                    <el-icon>
                      <Picture />
                    </el-icon>
                  </div>
                </template>
              </el-image>
              <div class="play-icon">
                <el-icon>
                  <VideoPlay />
                </el-icon>
              </div>
              <div class="duration">{{ item.duration }}</div>
            </div>

            <div class="content">
              <h3 class="title" :title="item.title">{{ item.title }}</h3>
              <div class="author">
                <el-avatar :size="24" :src="item.author.avatar" />
                <span class="name">{{ item.author.name }}</span>
              </div>
              <div class="stats">
                <span class="stat-item">
                  <el-icon>
                    <View />
                  </el-icon>
                  {{ formatNumber(item.views || item.viewCount || 0) }}
                </span>
                <span class="stat-item">
                  <el-icon>
                    <Star />
                  </el-icon>
                  {{ formatNumber(item.likes || item.likeCount || 0) }}
                </span>
                <span class="stat-item">
                  <el-icon>
                    <ChatDotRound />
                  </el-icon>
                  {{ formatNumber(item.comments || item.commentCount || 0) }}
                </span>
              </div>
            </div>
          </div>

          <!-- 背面
					<div class="flip-card back">
						<h3>视频详情</h3>
						<p>{{ item.title }}</p>
						<p>作者: {{ item.author.name }}</p>
					</div> -->
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoDetail } from '@/composables/useVideoDetail'
import { useRouter } from 'vue-router'
// import { ElCard, ElImage, ElAvatar } from 'element-plus'
import {
  View,
  Star,
  ChatDotRound,
  Picture,
  VideoPlay,
  Upload,
} from '@element-plus/icons-vue'
import { getVideoList, getStats } from '@/api/Video'
import type { VideoInfoDTO } from '@/api/Video/types'
import useUserStore from '@/store/modules/user'
import { ElMessage } from 'element-plus'
import { getUserInfoByPhone } from '@/api/user';
import { updateStats } from '@/api/Video';

interface Author {
  id: number
  name: string
  avatar: string
}

interface Video {
  videoId: string
  title: string
  cover: string
  duration: string
  views: number
  likes: number
  comments: number
  author: Author
  description?: string
  uploadTime?: string
  status?: string
  userPhone?: string
  // API返回的原始字段
  coverUrl?: string
  viewCount?: number
  likeCount?: number
  commentCount?: number
}

const router = useRouter()

const { fetchVideoDetail, videoInfo } = useVideoDetail()

// 从路由参数获取视频ID
const videoId = router.currentRoute.value.params.id as string

// 获取视频信息
onMounted(async () => {
  if (videoId) {
    await fetchVideoDetail(videoId)
  }
})

// 获取用户信息
const fetchUserInfo = async (phone: string) => {
  try {
    const userInfo = await getUserInfoByPhone({ phone });
    console.log('用户信息:', userInfo);
    // userInfo 包含: userId, phone, nickname, avatarUrl, registerTime
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 视频数据
const videoList = ref<Video[]>([])
const loading = ref(false)

// 获取视频列表
const fetchVideoList = async () => {
  try {
    loading.value = true
    console.log('开始获取视频列表，请求参数：', {
      pageIndex: 1,
      pageSize: 10
    })

    const response = await getVideoList({
      pageIndex: 1,
      pageSize: 10,
      userPhone: '',
      title: '',
      status: '',
      minDuration: 0,
      maxDuration: 0,
      startTime: '',
      endTime: '',
      orderBy: '',
      orderDirection: '',
    })

    if (response.code === 10000) {
      // 创建用户信息缓存
      const userInfoCache = new Map();

      const processedVideos = response.data.rows.map((item: VideoInfoDTO, index) => ({
        videoId: item.videoId,
        title: item.title,
        cover: cleanUrl(item.cdnCoverUrl) || cleanUrl(item.coverUrl) || '',
        duration: formatDuration(item.duration),
        // 先使用基础数据，后续会通过 getStats 更新
        views: item.viewCount || 0,
        likes: item.likeCount || 0,
        comments: item.commentCount || 0,
        author: {
          id: index + 1,
          name: item.userPhone,
          avatar: `https://picsum.photos/40/40?random=${item.videoId}`
        },
        description: item.description,
        uploadTime: item.createTime,
        status: item.status,
        userPhone: item.userPhone,
        coverUrl: cleanUrl(item.cdnCoverUrl),
        viewCount: item.viewCount,
        likeCount: item.likeCount,
        commentCount: item.commentCount
      }))

      // 先设置基本数据
      videoList.value = processedVideos;

      // 异步获取用户信息和统计数据
      const updatePromises = processedVideos.map(async (video, index) => {
        // 获取用户信息的逻辑保持不变
        if (video.userPhone) {
          try {
            console.log(`开始获取用户 ${video.userPhone} 的信息...`);

            if (userInfoCache.has(video.userPhone)) {
              const cachedUserInfo = userInfoCache.get(video.userPhone);
              videoList.value[index].author.name = cachedUserInfo.nickname;
              videoList.value[index].author.avatar = cachedUserInfo.avatarUrl || video.author.avatar;
            } else {
              const userInfo = await getUserInfoByPhone({ phone: video.userPhone });
              if (userInfo?.data?.nickname) {
                userInfoCache.set(video.userPhone, {
                  nickname: userInfo.data.nickname,
                  avatarUrl: userInfo.data.avatarUrl
                });
                videoList.value[index].author.name = userInfo.data.nickname;
                videoList.value[index].author.avatar = userInfo.data.avatarUrl || video.author.avatar;
              }
            }
          } catch (error) {
            console.error(`获取用户 ${video.userPhone} 信息失败:`, error);
          }
        }

        // 获取准确的统计数据
        try {
          console.log(`开始获取视频 ${video.videoId} 的统计数据...`);
          const statsResponse = await getStats({ videoId: video.videoId });

          if (statsResponse.code === 10000 && statsResponse.data) {
            // 更新统计数据
            videoList.value[index].views = statsResponse.data.viewCount || 0;
            videoList.value[index].likes = statsResponse.data.likeCount || 0;
            videoList.value[index].comments = statsResponse.data.commentCount || 0;

            console.log(`✅ 成功更新视频 ${video.videoId} 的统计数据:`, {
              views: statsResponse.data.viewCount,
              likes: statsResponse.data.likeCount,
              comments: statsResponse.data.commentCount
            });
          } else {
            console.warn(`⚠️ 获取视频 ${video.videoId} 统计数据失败:`, statsResponse);
          }
        } catch (error) {
          console.error(`❌ 获取视频 ${video.videoId} 统计数据失败:`, error);
        }
      });

      // 等待所有更新完成
      await Promise.all(updatePromises);
      console.log('✅ 所有视频信息和统计数据更新完成');
    } else {
      console.error('获取视频列表失败:', response.message)
      ElMessage.error('获取视频列表失败: ' + response.message)
    }
  } catch (error) {
    console.error('获取视频列表异常:', error)
    ElMessage.error('获取视频列表异常')
  } finally {
    loading.value = false
  }
}

// 添加URL清理函数
const cleanUrl = (url: string | undefined): string => {
  if (!url) return ''
  // 移除前后空格和反引号
  return url.trim().replace(/^`|`$/g, '')
}

// 添加时长格式化函数
const formatDuration = (seconds: number): string => {
  if (!seconds) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 组件挂载时获取数据
onMounted(() => {
  fetchVideoList()
})

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const playVideo = (video: Video) => {
  // 添加点击动画效果
  const videoCard = document.querySelector(`[data-video-id="${video.videoId}"]`)
  if (videoCard) {
    videoCard.classList.add('clicked')
    setTimeout(() => {
      videoCard.classList.remove('clicked')
    }, 200)
  }

  // 跳转到视频播放页面
  router.push(`/video/${video.videoId}`)
}

// 跳转到上传页面
const goToUpload = () => {
  router.push('/video/upload')
}
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.home {
  padding: 20px 0;
  height: calc(100vh - 180px);
  overflow-y: auto;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 20px;

    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #333;
    }

    .upload-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      background: linear-gradient(135deg, #ffb366, #ff9933);
      border: none;
      color: white;
      border-radius: 8px;
      padding: 10px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(255, 153, 51, 0.3);

      &:hover {
        background: linear-gradient(135deg, #ff9933, #ff8000);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 153, 51, 0.4);
      }

      &:active {
        transform: translateY(0);
        box-shadow: 0 2px 6px rgba(255, 153, 51, 0.3);
      }
    }
  }

  .waterfall {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 0 0px;

    .video-card {
      flex: 0 0 calc(20% - 16px);
      min-width: 220px;
      margin-bottom: 10px;
      position: relative;
      transition: all 0.3s ease;
      transform-origin: center;

      @media (max-width: 1600px) {
        flex: 0 0 calc(25% - 15px);
      }

      @media (max-width: 1200px) {
        flex: 0 0 calc(33.333% - 14px);
      }

      @media (max-width: 900px) {
        flex: 0 0 calc(50% - 10px);
      }

      @media (max-width: 600px) {
        flex: 0 0 100%;
      }

      &:hover {
        transform: translateY(-5px);
      }

      &.card-clicked {
        transform: translateY(20px) rotateX(10deg) rotateY(5deg) rotateZ(-2deg);
        /* 触发时翻转到背面 */
        scale: 0.9;
      }

      // .flip-container {
      // 	perspective: 1000px; /* 创建三维空间 */
      // 	transition: transform 0.6s;
      // }

      // .flip-card {
      // 	position: absolute;
      // 	width: 100%;
      // 	height: 100%;
      // 	backface-visibility: hidden; /* 隐藏背面 */
      // 	transition: transform 0.6s;

      // 	&.front {
      // 		z-index: 2;
      // 		transform: rotateY(0deg); /* 初始状态为正面 */
      // 	}

      // 	&.back {
      // 		transform: rotateY(180deg); /* 初始状态为背面朝内 */
      // 		background-color: #f9f9f9;
      // 		border-radius: 16px;
      // 		padding: 16px;
      // 		box-shadow: 0 8px 30px rgba($text-color, 0.1);
      // 	}
      // }

      :deep(.el-card) {
        background: rgba(255, 255, 255, 0.95);
        border-radius: 16px;
        box-shadow: 0 8px 30px rgba($text-color, 0.1);
        border: 1px solid rgba($border-color, 0.5);
        backdrop-filter: blur(4px);
        overflow: hidden;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 12px 40px rgba($text-color, 0.15);
        }
      }

      .video-cover {
        position: relative;
        height: 300px;
        overflow: hidden;
        cursor: pointer;

        .el-image {
          width: 100%;
          height: 100%;
          transition: transform 0.3s ease;

          &:hover {
            transform: scale(1.05);
          }
        }

        .image-placeholder {
          height: 100%;
          background: linear-gradient(135deg,
              $quaternary-color,
              lighten($quaternary-color, 15%));
          display: flex;
          align-items: center;
          justify-content: center;

          .el-icon {
            font-size: 40px;
            color: rgba(255, 255, 255, 0.8);
          }
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg,
              $primary-color,
              $secondary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba($text-color, 0.2);

          .el-icon {
            font-size: 24px;
            color: #fff;
          }
        }

        .duration {
          position: absolute;
          bottom: 8px;
          right: 8px;
          padding: 4px 8px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          border-radius: 4px;
          font-size: 12px;
          backdrop-filter: blur(4px);
        }
      }

      .content {
        padding: 16px;

        .title {
          margin: 0 0 12px;
          font-size: 15px;
          line-height: 1.4;
          color: $text-color;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .author {
          display: flex;
          align-items: center;
          margin-bottom: 12px;

          :deep(.el-avatar) {
            border: 2px solid #fff;
            box-shadow: 0 2px 8px rgba($text-color, 0.1);
          }

          .name {
            margin-left: 8px;
            font-size: 14px;
            color: $text-color;
            font-weight: 500;
          }
        }

        .stats {
          display: flex;
          gap: 16px;
          color: $sub-text-color;
          font-size: 13px;

          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;




            .el-icon {
              font-size: 16px;
            }
          }



          &.liked {
            color: #ff6b6b;
            background-color: rgba(255, 107, 107, 0.1);
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);

            .el-icon {
              color: #ff6b6b;
              animation: heartbeat 0.6s ease-in-out;
            }


          }
        }
      }
    }
  }
}


@include respond-to('xl') {
  .home .waterfall {
    grid-template-columns: repeat(4, 1fr);
  }
}

@include respond-to('lg') {
  .home .waterfall {
    grid-template-columns: repeat(3, 1fr);
  }
}

@include respond-to('md') {
  .home .waterfall {
    grid-template-columns: repeat(2, 1fr);
    overflow-y: auto;
    /* 确保在较小屏幕下仍然可以滚动 */
  }
}
</style>
