<template>
  <div class="video-home">

    <!-- 视频瀑布流 -->
    <div class="video-container">
      <div class="waterfall">
        <VideoCard v-for="item in videoList" :key="item.id" :video="item" class="video-card" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VideoCard from '@/components/VideoCard.vue';
import Sidebar from '@/components/Sidebar.vue';

const currentCategory = ref('推荐');

// 模拟视频数据
const videoList = ref(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `这是一个非常有趣的短视频标题 ${i + 1}`,
    cover: `https://picsum.photos/300/400?random=${i}`,
    duration: Math.floor(Math.random() * 300) + 60, // 1-6分钟
    views: Math.floor(Math.random() * 1000000),
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 10000),
    author: {
      id: i + 1,
      name: `用户${i + 1}`,
      avatar: `https://picsum.photos/40/40?random=${i}`,
    },
  }))
);
</script>

<style scoped lang="scss">
.video-home {
  min-height: 100vh;
  padding: 0;
  position: relative;
  // background: url('@/assets/pictures/BG1.jpg') no-repeat center/cover;
}

.video-container {
  padding: 20px 20px 20px 20px;
}

.waterfall {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;

  .video-card {
    flex: 0 0 calc(20% - 16px);
    min-width: 220px;
    margin-bottom: 10px;

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
  }
}
</style>
