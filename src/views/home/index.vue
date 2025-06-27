<template>
  <div class="home-container">
    <!-- 左侧介绍区块 -->
    <div class="intro-section">
      <h1>Introduction</h1>
      <p>
        本项目旨在帮助因病致贫、无力治病的患者，搭建一个多功能的互助平台，并通过平台流量实现现金予患者自主
      </p>
      <el-button type="primary" @click="changeDonatVisibility">Donate</el-button>
    </div>
    <!-- 右侧积分区块 -->
    <div class="score-section">
      <div class="score-card">
        <svg class="heart-icon" viewBox="0 0 1024 1024" width="60" height="60">
          <path
            d="M923 283c-54-46-135-38-186 13L512 521 287 296c-51-51-132-59-186-13-62 53-66 149-10 206l376 376c12 12 28 19 45 19s33-7 45-19l376-376c56-57 52-153-10-206z"
            fill="#F56C6C" />
        </svg>
        <div class="score-text">您的爱心积分</div>
        <div class="score-value">610</div>
      </div>
    </div>
  </div>

  <el-dialog v-model="dialogVisible" width="480px" :close-on-click-modal="false">
    <template #header>
      <span>感谢您的奉献与支持！</span>
    </template>
    <div>
      <p>您的捐赠将帮助更多需要帮助的人。</p>
      <img src="../../../public/img/vx_gzh.jpg" alt="捐款二维码">
    </div>
    <template #footer>
      <el-button @click="changeDonatVisibility">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 这里可以后续引入接口获取积分等
import { ref } from 'vue';



const dialogVisible = ref(false);
const changeDonatVisibility = () => {
  dialogVisible.value = !dialogVisible.value;
};
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  background: url('@/assets/your-bg.jpg') no-repeat center/cover;
  position: relative;
}

.intro-section {
  flex: 1;
  background: rgba(0, 123, 255, 0.3);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 80px;
}

.intro-section h1 {
  font-size: 48px;
  margin-bottom: 24px;
}

.intro-section p {
  font-size: 18px;
  margin-bottom: 32px;
  max-width: 400px;
}

.score-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.score-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 16px;
  padding: 48px 64px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.heart-icon {
  margin-bottom: 16px;
}

.score-text {
  font-size: 20px;
  color: #888;
  margin-bottom: 8px;
}

.score-value {
  font-size: 32px;
  color: #F56C6C;
  font-weight: bold;
}
</style>
