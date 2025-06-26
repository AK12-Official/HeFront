<template>
  <div>
    <h2>环境变量测试</h2>
    <el-card class="env-card">
      <template #header>
        <div class="card-header">
          <span>环境变量</span>
        </div>
      </template>
      <div class="env-item">
        <strong>NODE_ENV:</strong> {{ envVars.NODE_ENV }}
      </div>
      <div class="env-item">
        <strong>APP_TITLE:</strong> {{ envVars.VITE_APP_TITLE }} (全局变量: {{ appTitle }})
      </div>
      <div class="env-item">
        <strong>API_URL:</strong> {{ envVars.VITE_APP_API_URL }}
      </div>
      <div class="env-item">
        <strong>SERVE:</strong> {{ envVars.VITE_SERVE }}
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 收集环境变量
const envVars = ref({
  NODE_ENV: import.meta.env.MODE,
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE,
  VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL,
  VITE_SERVE: import.meta.env.VITE_SERVE
})

// 访问在 vite.config.ts 中定义的全局变量
const appTitle = ref(__APP_TITLE__)
</script>

<style scoped lang="scss">
.env-card {
  max-width: 600px;
  margin: 20px auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.env-item {
  margin: 10px 0;
  padding: 8px;
  border-radius: 4px;
  background-color: #f5f7fa;

  strong {
    font-weight: bold;
    color: #409eff;
    margin-right: 10px;
  }
}
</style>
