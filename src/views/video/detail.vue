<template>
  <div class="video-detail" :class="{ entering: isEntering }">
    <div class="video-container">
      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 视频播放器 -->
        <div class="video-player">
          <div class="player-wrapper">
            <video ref="videoRef" class="video-element" controls preload="auto" autoplay :src="videoData.videoUrl"
              @ended="handleVideoEnd" @contextmenu="showContextMenu"></video>
          </div>
        </div>
        <!-- 评论区 -->
        <div class="comments-section">
          <div class="comment-input">
            <el-input v-model="commentText" placeholder="发一条友善的评论" :rows="2" type="textarea" />
            <el-button type="primary" :disabled="!commentText.trim()">发布</el-button>
          </div>
        </div>
      </div>

      <!-- 侧边栏 -->
      <div class="side-content">
        <!-- 视频信息卡片 -->
        <div class="video-info">
          <div class="main-info">
            <h1 class="title">{{ videoData.title }}</h1>
            <div class="stats">
              <span class="views">
                <el-icon>
                  <View />
                </el-icon>
                {{ formatNumber(videoData.views) }}
              </span>
              <span class="likes">
                <el-icon>
                  <Star />
                </el-icon>
                {{ formatNumber(videoData.likes) }}
              </span>
              <span class="comments">
                <el-icon>
                  <ChatDotRound />
                </el-icon>
                {{ formatNumber(videoData.comments) }}
              </span>
              <span class="date">{{ formatDate(videoData.createTime) }}</span>
            </div>
          </div>

          <div class="author-info">
            <el-avatar :size="48" :src="videoData.author.avatar" />
            <div class="author-detail">
              <div class="name">{{ videoData.author.name }}</div>
            </div>
            <el-button class="follow-btn" type="primary" :icon="Plus">关注</el-button>
          </div>

          <div class="description">{{ videoData.description }}</div>

          <div class="action-bar">
            <div class="action-group">
              <el-button class="action-btn like" :class="{ liked: videoData.isLiked }"
                :icon="videoData.isLiked ? StarFilled : Star" @click="handleLike">
                {{ formatNumber(videoData.likes) }}
              </el-button>
              <el-button class="action-btn dislike" :icon="StarFilled">
                {{ formatNumber(videoData.dislikes) }}
              </el-button>
            </div>
            <div class="action-group">
              <el-button class="action-btn" :icon="Share">分享</el-button>
              <el-button class="action-btn" :icon="Collection" @click="handleCollect">收藏</el-button>
            </div>
          </div>
        </div>
        <!-- 相关推荐卡片 -->
        <div class="recommended-videos">
          <h3>相关推荐</h3>
          <div class="video-list">
            <div v-for="item in recommendedVideos" :key="item.id" class="video-item" @click="playVideo(item)">
              <div class="video-cover">
                <el-image :src="item.cover" fit="cover" />
                <span class="duration">{{ item.duration }}</span>
              </div>
              <div class="video-content">
                <h4 class="title">{{ item.title }}</h4>
                <div class="meta">
                  <span class="author">{{ item.author.name }}</span>
                  <span class="views">{{ formatNumber(item.views) }} 播放</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右键菜单 -->
    <div v-if="contextMenuVisible" class="context-menu"
      :style="{ left: contextMenuPosition.x + 'px', top: contextMenuPosition.y + 'px' }">
      <div class="menu-item" @click="copyVideoUrl">
        <el-icon>
          <DocumentCopy />
        </el-icon>
        复制视频地址
      </div>
      <div class="menu-item" @click="showDetailDialog">
        <el-icon>
          <InfoFilled />
        </el-icon>
        查看详情
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailDialogVisible" title="视频详情" width="600px">
      <div class="detail-content">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-item">
            <span class="label">视频ID:</span>
            <span class="value">{{ videoData.videoId }}</span>
          </div>
          <div class="detail-item">
            <span class="label">标题:</span>
            <span class="value">{{ videoData.title }}</span>
          </div>
          <div class="detail-item">
            <span class="label">创建时间:</span>
            <span class="value">{{ new Date(videoData.createTime).toLocaleString() }}</span>
          </div>
        </div>

        <div v-if="playInfo" class="detail-section">
          <h4>播放信息</h4>
          <div class="detail-item">
            <span class="label">播放质量:</span>
            <span class="value">{{ playInfo.quality || 'HD' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">播放时长:</span>
            <span class="value">{{ playInfo.duration || '未知' }}</span>
          </div>
          <div class="detail-item" v-if="playInfo.playUrl">
            <span class="label">播放地址:</span>
            <span class="value url">{{ playInfo.playUrl }}</span>
          </div>
        </div>

        <div v-if="statsInfo" class="detail-section">
          <h4>统计信息</h4>
          <div class="detail-item">
            <span class="label">播放次数:</span>
            <span class="value">{{ formatNumber(statsInfo.playCount || 0) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">点赞数:</span>
            <span class="value">{{ formatNumber(statsInfo.likeCount || 0) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">评论数:</span>
            <span class="value">{{ formatNumber(statsInfo.commentCount || 0) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">平均播放时长:</span>
            <span class="value">{{ statsInfo.avgPlayDuration || '0s' }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  View,
  Star,
  StarFilled,
  ChatDotRound,
  Share,
  Collection,
  Plus,
  DocumentCopy,
  InfoFilled,
} from '@element-plus/icons-vue'
import { getPlayInfo, getRecommendList, getStats, updateStats, getVideoInfo } from '@/api/Video'
import { getUserInfoByPhone } from '@/api/user'
import type { VideoInfoDTO, RecommendListResponseDTO } from '@/api/Video/types'
import type { UserResponse, UserInfoByPhoneDTO } from '@/api/user/types'
import { watch } from 'vue'

const route = useRoute()
const router = useRouter()
const videoRef = ref<HTMLVideoElement | null>(null)
const commentText = ref('')
const isEntering = ref(false)


// 视频数据
const videoData = ref({
  videoId: route.params.id as string,
  userPhone: '',
  title: '加载中...',
  description: '',
  duration: 0,
  width: 1920,
  height: 1080,
  fileSize: 0,
  fastdfsFileId: '',
  coverFileId: '',
  cdnVideoUrl: '',
  cdnCoverUrl: '',
  status: 'PUBLISHED',
  createTime: '',
  // 扩展字段
  author: {
    name: '加载中...',
    avatar: 'https://picsum.photos/48/48',
  },
  views: 0,
  likes: 0,
  dislikes: 0,
  comments: 0,
  videoUrl: '',
  isLiked: false,
},
)

// 播放信息
const playInfo = ref<any>(null)
// 统计信息
const statsInfo = ref<any>(null)
// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
// 详情弹窗
const detailDialogVisible = ref(false)

// 视频质量相关
const currentQuality = ref('1080p')
const availableQualities = ref([
  { label: '1080P', value: '1080p' },
  { label: '720P', value: '720p' },
  { label: '480P', value: '480p' },
  { label: '360P', value: '360p' },
  { label: '自动', value: 'auto' }
])

// 推荐视频数据 - 改为空数组，通过API获取
const recommendedVideos = ref<Array<{
  id: string;
  title: string;
  cover: string;
  duration: string;
  views: number;
  author: {
    name: string;
    avatar?: string;
  };
}>>([])

const formatNumber = (num: number | undefined | null): string => {
  // 添加安全检查
  if (num === undefined || num === null || isNaN(num)) {
    return '0'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '未知时间'

  const timestamp = new Date(dateString).getTime()
  const now = new Date().getTime()
  const diff = now - timestamp
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const minutes = Math.floor(diff / (60 * 1000))

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
}

const handleVideoEnd = () => {
  if (videoRef.value) {
    videoRef.value.currentTime = 0
  }
}

const playVideo = async (video: any) => {
  router.push(`/video/${video.id}`)
}

// 获取视频详情
const fetchVideoInfo = async () => {
  try {
    const response = await getVideoInfo({ videoId: route.params.id as string })
    if (response.code === 10000 && response.data) {
      // 更新视频基本信息
      Object.assign(videoData.value, {
        ...response.data,
        videoUrl: response.data.cdnVideoUrl || response.data.fastdfsFileId || '',
      })

      // 获取作者信息
      if (response.data.userPhone) {
        await fetchAuthorInfo(response.data.userPhone)
      }
    }
  } catch (error) {
    console.error('获取视频详情失败:', error)
    ElMessage.error('获取视频详情失败')
  }
}

// 获取作者信息
const fetchAuthorInfo = async (userPhone: string) => {
  try {
    console.log('正在获取作者信息，手机号:', userPhone)

    if (!userPhone) {
      console.warn('手机号为空，使用默认作者信息')
      return
    }

    const response = await getUserInfoByPhone({ phone: userPhone })
    console.log('获取作者信息响应:', response)

    if (response.code === 10000 && response.data) {
      videoData.value.author = {
        name: response.data.nickname || response.data.nickname || '未知用户',
        avatar: response.data.avatarUrl || 'https://picsum.photos/48/48',
      }
      console.log('作者信息更新成功:', videoData.value.author)
    } else {
      console.warn('获取作者信息失败，响应码:', response.code)
    }
  } catch (error) {
    console.error('获取作者信息失败:', error)
    // 确保使用默认值，避免 undefined 错误
    if (!videoData.value.author) {
      videoData.value.author = {
        name: '未知用户',
        avatar: 'https://picsum.photos/48/48',
      }
    }
  }
}

// 获取播放信息
const fetchPlayInfo = async () => {
  try {
    const response = await getPlayInfo({ videoId: route.params.id as string })
    if (response.code === 10000 && response.data) {
      // 使用正确的字段名 videoUrl 而不是 playUrl
      if (response.data.videoUrl && !videoData.value.videoUrl) {
        videoData.value.videoUrl = response.data.videoUrl
      }
      console.log('播放信息获取成功:', response.data)
      console.log('当前视频URL:', videoData.value.videoUrl)
    }
  } catch (error) {
    console.error('获取播放信息失败:', error)
    // 如果获取播放信息失败，可以使用视频详情中的 URL
    if (!videoData.value.videoUrl && videoData.value.cdnVideoUrl) {
      videoData.value.videoUrl = videoData.value.cdnVideoUrl
    }
  }
}

// 获取统计信息
const fetchStats = async () => {
  try {
    const response = await getStats({ videoId: route.params.id as string })
    if (response.code === 10000) {
      statsInfo.value = response.data
      // 更新统计数据
      videoData.value.views = response.data.viewCount
      videoData.value.likes = response.data.likeCount
      videoData.value.comments = response.data.commentCount
    }
  } catch (error) {
    console.error('获取统计信息失败:', error)
  }
}

// 获取推荐列表
const fetchRecommendList = async () => {
  try {
    console.log('开始获取推荐列表，videoId:', route.params.id)

    const response = await getRecommendList({
      currentVideoId: route.params.id as string,
      recommendCount: 10,
      excludeVideoIds: "",
      deviceType: ""
    })

    console.log('推荐列表API响应:', response)

    if (response.code === 10000) {
      if (response.data && response.data.recommendVideos) {
        const recommendVideos = response.data.recommendVideos
        console.log('推荐视频数据:', recommendVideos)

        // 清理URL的函数
        const cleanUrl = (url: string): string => {
          if (!url) return ''
          // 移除前后的反引号、空格和其他特殊字符
          return url.replace(/^[\s`]+|[\s`]+$/g, '').trim()
        }

        recommendedVideos.value = recommendVideos.map((item: any) => {
          // 处理duration - 将秒转换为分:秒格式
          const formatDuration = (seconds: number): string => {
            if (!seconds || seconds === 0) return '0:00'
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
          }

          const processedItem = {
            id: item.videoId,
            title: item.title || '未知标题',
            cover: cleanUrl(item.coverUrl) || `https://picsum.photos/320/180?random=${item.videoId}`,
            duration: typeof item.duration === 'number' ? formatDuration(item.duration) : (item.duration || '0:00'),
            views: item.playCount || 0,
            author: {
              name: `创作者${item.videoId?.slice(-4) || ''}`,
              avatar: 'https://picsum.photos/24/24'
            }
          }

          console.log('处理后的视频项:', processedItem)
          console.log('清理后的封面URL:', processedItem.cover)
          return processedItem
        })

        console.log('推荐列表处理完成，数量:', recommendedVideos.value.length)
      } else {
        console.warn('API返回数据结构异常:', response.data)
        recommendedVideos.value = []
      }
    } else {
      console.error('获取推荐列表失败:', response.message)
      recommendedVideos.value = []
    }
  } catch (error) {
    console.error('获取推荐列表失败:', error)
  }
}

// 处理点赞
const handleLike = async () => {
  console.log('点赞按钮被点击，当前状态:', {
    isLiked: videoData.value.isLiked,
    likes: videoData.value.likes,
    videoId: route.params.id,
    videoIdType: typeof route.params.id
  })

  // 检查videoId是否有效
  if (!route.params.id || typeof route.params.id !== 'string') {
    ElMessage.error('视频ID无效')
    return
  }

  try {
    const actionValue = videoData.value.isLiked ? -1 : 1
    const requestParams = {
      videoId: route.params.id as string,
      actionType: 'LIKE',
      actionValue: actionValue
    }

    console.log('准备发送API请求，参数:', requestParams)

    const response = await updateStats(requestParams)

    console.log('API响应:', response)

    if (response.code === 10000) {
      // 更新点赞状态和数量
      videoData.value.isLiked = !videoData.value.isLiked
      videoData.value.likes += actionValue

      const message = videoData.value.isLiked ? '点赞成功！' : '取消点赞成功！'
      ElMessage.success(message)

      console.log('点赞状态更新成功:', {
        newIsLiked: videoData.value.isLiked,
        newLikes: videoData.value.likes
      })
    } else {
      console.error('API返回错误:', response)
      ElMessage.error('操作失败：' + (response.message || '未知错误'))
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    ElMessage.error('操作失败，请重试')
  }
}

// 处理收藏
const handleCollect = async () => {
  try {
    const response = await updateStats({
      videoId: route.params.id as string,
      actionType: 'favorite',
      actionValue: 1
    })
    if (response.code === 10000) {
      ElMessage.success('收藏成功！')
    }
  } catch (error) {
    console.error('收藏失败:', error)
    ElMessage.error('收藏失败，请重试')
  }
}

// 显示右键菜单
const showContextMenu = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()

  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
  contextMenuVisible.value = true
}

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenuVisible.value = false
}

// 全局点击事件监听
const handleGlobalClick = (event: MouseEvent) => {
  if (contextMenuVisible.value) {
    const target = event.target as HTMLElement
    const contextMenu = document.querySelector('.context-menu')
    if (contextMenu && !contextMenu.contains(target)) {
      hideContextMenu()
    }
  }
}

// 复制视频地址
const copyVideoUrl = async () => {
  try {
    const videoUrl = playInfo.value?.playUrl || videoData.value.videoUrl
    await navigator.clipboard.writeText(videoUrl)
    ElMessage.success('视频地址已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error('复制失败，请重试')
  }
  contextMenuVisible.value = false
}

// 显示详情内容
const showDetailDialog = () => {
  detailDialogVisible.value = true
  contextMenuVisible.value = false
}

// 切换视频质量
const changeVideoQuality = async (quality: string) => {
  if (!playInfo.value || !playInfo.value.qualities) {
    ElMessage.warning('暂无其他画质选项')
    return
  }

  const qualityOption = playInfo.value.qualities.find((q: any) => q.quality === quality)
  if (qualityOption) {
    const currentTime = videoRef.value?.currentTime || 0
    const wasPlaying = !videoRef.value?.paused

    videoData.value.videoUrl = qualityOption.url

    // 等待视频加载后恢复播放位置
    await nextTick()
    if (videoRef.value) {
      videoRef.value.currentTime = currentTime
      if (wasPlaying) {
        videoRef.value.play()
      }
    }

    ElMessage.success(`已切换到${quality}画质`)
  } else {
    ElMessage.error('切换画质失败')
  }
}

watch(
  () => route.params.id,
  async (newId, oldId) => {
    if (newId && newId !== oldId) {
      console.log('路由参数变化，重新加载视频:', newId)
      // 重置视频数据
      videoData.value.videoId = newId as string
      videoData.value.title = '加载中...'
      videoData.value.author.name = '加载中...'

      // 重新获取视频信息
      await fetchVideoInfo()
      await fetchRecommendList()
    }
  },
  { immediate: false }
)

onMounted(async () => {
  // 先设置为true,然后在下一帧设置为false以触发动画
  nextTick(() => {
    isEntering.value = true
  })

  // 添加全局点击事件监听
  document.addEventListener('click', handleGlobalClick)

  try {
    // 首先获取视频基本信息（包含作者信息）
    await fetchVideoInfo()

    // 然后并行获取其他数据
    await Promise.all([
      fetchPlayInfo(),
      fetchStats(),
      fetchRecommendList(),
    ])
  } catch (error) {
    console.error('页面数据加载失败:', error)
    ElMessage.error('页面加载失败，请刷新重试')
  }
})

onUnmounted(() => {
  // 移除全局事件监听器
  document.removeEventListener('click', handleGlobalClick)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use 'sass:color';

.video-detail {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 0;
  background: transparent;
}

.video-container {
  display: flex;
  gap: 32px;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  align-items: flex-start;
}

.main-content {
  flex: 2 1 0%;
  min-width: 0;
  max-width: 1200px;
}

.side-content {
  flex: 1 1 380px;
  min-width: 360px;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.video-info,
.recommended-videos {
  background: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 0;
}

.recommended-videos {
  padding-top: 12px;
  padding-bottom: 12px;
}

.video-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .video-item {
    display: flex;
    gap: 12px;
    cursor: pointer;
    border-radius: 8px;
    transition: background 0.2s;
    background: #fafbfc;
    padding: 6px 8px;

    &:hover {
      background: #f5f7fa;
    }

    .video-cover {
      width: 80px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;

      .duration {
        position: absolute;
        bottom: 4px;
        right: 6px;
        background: rgba(0, 0, 0, 0.7);
        color: #fff;
        font-size: 11px;
        border-radius: 3px;
        padding: 1px 4px;
      }
    }

    .video-content {
      flex: 1;

      .title {
        font-size: 15px;
        font-weight: 500;
        margin-bottom: 2px;
      }

      .meta {
        font-size: 12px;
        color: #888;
        display: flex;
        gap: 8px;
      }
    }
  }
}

.video-player {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba($text-color, 0.1);

  .player-wrapper {
    position: relative;
    padding-top: 56.25%; // 16:9 比例

    .video-element {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }


  }
}

.video-info {
  .main-info {
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      font-weight: 600;
      color: $text-color;
      margin-bottom: 12px;
    }

    .stats {
      display: flex;
      gap: 24px;
      color: $sub-text-color;
      font-size: 14px;

      span {
        display: flex;
        align-items: center;
        gap: 4px;

        .el-icon {
          font-size: 16px;
        }
      }
    }
  }

  .author-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba($border-color, 0.5);

    .author-detail {
      margin-left: 12px;
      flex: 1;

      .name {
        font-size: 16px;
        font-weight: 500;
        color: $text-color;
      }

      .followers {
        font-size: 14px;
        color: $sub-text-color;
        margin-top: 4px;
      }
    }

    .follow-btn {
      background: linear-gradient(135deg, $primary-color, $tertiary-color);
      border: none;
      height: 40px;
      border-radius: 20px;
      padding: 0 24px;

      &:hover {
        background: linear-gradient(135deg,
            color.adjust($primary-color, $lightness: 5%),
            color.adjust($tertiary-color, $lightness: 5%));
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.2);
      }
    }
  }

  .description {
    font-size: 14px;
    line-height: 1.6;
    color: $text-color;
    margin-bottom: 20px;
  }

  .action-bar {
    display: flex;
    justify-content: space-between;

    .action-group {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;

      .action-btn {
        height: 40px;
        border-radius: 20px;
        padding: 0 20px;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba($border-color, 0.5);
        color: $text-color;

        &.like {
          transition: all 0.3s ease;

          &.liked {
            color: #ff6b6b;
            background-color: rgba(255, 107, 107, 0.1);
            border-color: #ff6b6b;

            &:hover {
              background-color: rgba(255, 107, 107, 0.2);
            }
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 1);
          border-color: $tertiary-color;
          color: $tertiary-color;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba($text-color, 0.1);
        }

        &.like {
          background: rgba($primary-color, 0.1);
          border-color: rgba($primary-color, 0.3);
          color: $primary-color;

          &:hover {
            background: rgba($primary-color, 0.2);
            border-color: $primary-color;
          }
        }

        &.dislike {
          background: rgba($quaternary-color, 0.1);
          border-color: rgba($quaternary-color, 0.3);
          color: $text-color;

          &:hover {
            background: rgba($quaternary-color, 0.2);
            border-color: $quaternary-color;
          }
        }
      }
    }
  }
}

// 评论区样式
.comments-section {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .comment-input {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .el-textarea {
      border-radius: 8px;

      :deep(.el-textarea__inner) {
        min-height: 80px;
        padding: 12px;
        font-size: 14px;
        border-radius: 8px;
        resize: none;
        transition: all 0.3s;

        &:focus {
          box-shadow: 0 0 0 2px rgba($primary-color, 0.2);
        }
      }
    }

    .el-button {
      align-self: flex-end;
      padding: 10px 24px;
      font-size: 14px;
      border-radius: 20px;
      background: linear-gradient(135deg, $primary-color, $tertiary-color);
      border: none;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba($primary-color, 0.2);
      }

      &:disabled {
        background: #f0f0f0;
        color: #aaa;
      }
    }
  }
}

// 添加页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable:hover {
  opacity: 0.8;
  transform: scale(1.05);
}

/* 播放信息样式 */
.play-info-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409eff;
}

.play-info-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.play-info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.info-item .label {
  color: #606266;
  font-weight: 500;
}

.info-item .value {
  color: #303133;
  font-weight: 600;
}

.info-item .value.url {
  font-family: monospace;
  font-size: 10px;
  color: #409eff;
}

/* 统计信息样式 */
.stats-info-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #67c23a;
}

.stats-info-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #909399;
  font-weight: 500;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 150px;
  padding: 4px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: #f5f7fa;
}

.menu-item .el-icon {
  font-size: 16px;
  color: #606266;
}

/* 详情弹窗样式 */
.detail-content {
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
  padding-bottom: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail-item .label {
  color: #606266;
  font-weight: 500;
  min-width: 100px;
  flex-shrink: 0;
}

.detail-item .value {
  color: #303133;
  text-align: right;
  word-break: break-all;
}

.detail-item .value.url {
  font-family: monospace;
  font-size: 12px;
  color: #409eff;
  max-width: 300px;
}
</style>
