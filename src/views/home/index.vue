<template>
  <div class="home-container">
    <!-- 左侧介绍区块 -->
    <div class="intro-section">
      <h1>越分享、越丰盈</h1>
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

        <!-- 已登录状态显示积分 -->
        <div v-if="userStore.isLoggedIn" class="score-value">
          <span v-if="userStore.scoreLoading">加载中...</span>
          <span v-else-if="userStore.state.score !== null">{{ userStore.state.score }}</span>
          <span v-else>获取失败</span>
        </div>

        <!-- 未登录状态显示提示和登录按钮 -->
        <div v-else class="score-not-logged">
          <div class="login-tip">未登录无法显示</div>
          <el-button type="primary" size="small" @click="goToLogin">立即登录</el-button>
        </div>
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
      <el-button @click="logout" type="danger">登出(没地方放先写这里，主要是测试先)</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 这里可以后续引入接口获取积分等
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();
const dialogVisible = ref(false);
const userPoints = ref<number | null>(null);
const loading = ref(false);

// 监听登录状态变化，自动获取积分
import { watch } from 'vue';
watch(
  () => userStore.isLoggedIn,
  (newValue) => {
    if (newValue) {
      // 登录后自动获取积分
      userStore.fetchUserScore();
    }
  },
  { immediate: true }
);

// 组件挂载时，如果已登录则获取积分
onMounted(() => {
  if (userStore.isLoggedIn) {
    userStore.fetchUserScore();
  }
});

// 方法：控制捐赠对话框显示
const changeDonatVisibility = () => {
  dialogVisible.value = !dialogVisible.value;
};

// 方法：跳转到登录页面
const goToLogin = () => {
  router.push('/login');
};

// 方法：登出
const logout = () => {
  userStore.userLogout();
  ElMessage.success('已成功登出');
};
</script>

<style scoped>
.home-container {
  display: flex;
  height: 100vh;
  background: url('@/assets/pictures/BG1.jpg') no-repeat center/cover;
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

/* 未登录状态的样式 */
.score-not-logged {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.login-tip {
  font-size: 16px;
  color: #909399;
  font-style: italic;
}

p,
span {
  letter-spacing: 0.1em;
}
</style>
