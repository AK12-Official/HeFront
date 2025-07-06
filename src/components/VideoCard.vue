<template>
  <div class="video-card" :class="{ 'card-clicked': isClicked }" @click="handleVideoClick">
    <!-- 视频封面 -->
    <div class="video-cover">
      <el-image :src="video.cover" fit="cover" loading="lazy">
        <template #placeholder>
          <div class="image-placeholder">
            <el-icon>
              <VideoPlay />
            </el-icon>
          </div>
        </template>
      </el-image>
      <div class="duration">{{ formatDuration(video.duration) }}</div>
      <div class="play-icon">
        <el-icon>
          <VideoPlay />
        </el-icon>
      </div>
    </div>

    <!-- 视频内容 -->
    <div class="content">
      <div class="author">
        <el-avatar :size="32" :src="video.author.avatar" />
        <span class="name">{{ video.author.name }}</span>
      </div>
      <h3 class="title">{{ video.title }}</h3>
      <div class="stats">
        <span class="views">
          <el-icon>
            <View />
          </el-icon>
          {{ formatNumber(video.views) }}
        </span>
        <span class="likes">
          <el-icon>
            <Star />
          </el-icon>
          {{ formatNumber(video.likes) }}
        </span>
        <span class="comments">
          <el-icon>
            <ChatDotRound />
          </el-icon>
          {{ formatNumber(video.comments) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { VideoPlay, View, Star, ChatDotRound } from '@element-plus/icons-vue';

interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface Video {
  id: number;
  title: string;
  cover: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  author: Author;
}

const props = defineProps<{
  video: Video;
}>();

const router = useRouter();
const isClicked = ref(false);

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  }
  return num.toString();
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const handleVideoClick = () => {
  setTimeout(() => {
    router.push(`/video/${props.video.id}`);
  }, 500);
};
</script>

<style scoped lang="scss">
.video-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
  will-change: transform;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);

    .video-cover {
      .el-image {
        transform: scale(1.05);
      }

      .play-icon {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  &.card-clicked {
    position: fixed;
    z-index: 1000;
    animation: card-click 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .video-cover {
    position: relative;
    padding-top: 56.25%;
    overflow: hidden;

    .el-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease;
    }

    .image-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
      color: #007bff;
      font-size: 24px;
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
    }

    .play-icon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      width: 64px;
      height: 64px;
      background: rgba(0, 123, 255, 0.9);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 32px;
      opacity: 0;
      transition: all 0.3s ease;
      backdrop-filter: blur(4px);
    }
  }

  .content {
    padding: 16px;

    .author {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .name {
        font-size: 14px;
        color: #333;
      }
    }

    .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      line-height: 1.4;
      display: -webkit-box;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .stats {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: #666;

      span {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

@keyframes card-click {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.9);
  }

  100% {
    transform: scale(0) translate(var(--translate-x, 0), var(--translate-y, 0));
  }
}
</style>
