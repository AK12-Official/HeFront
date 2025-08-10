<template>
  <div class="upload-page">
    <Background />
    <div class="back-button">
      <el-button @click="goBack" :icon="ArrowLeft" round>返回视频列表</el-button>
    </div>
    <div class="video-upload-container">
    <div class="upload-card">
      <h2 class="upload-title">视频上传</h2>
      
      <div class="upload-area" @click="triggerFileInput" @dragover.prevent="onDragOver" @dragleave.prevent="onDragLeave" @drop.prevent="onDrop" :class="{ 'drag-over': isDragOver }">
        <input type="file" ref="fileInput" @change="handleFileChange" accept="video/*" style="display: none" />
        <div v-if="!selectedFile" class="upload-placeholder">
          <el-icon class="upload-icon"><Upload /></el-icon>
          <p>点击或拖拽文件到此处上传</p>
          <p class="upload-tip">支持MP4、AVI、MOV等视频格式</p>
        </div>
        <div v-else class="file-info">
          <el-icon class="file-icon"><VideoCamera /></el-icon>
          <div class="file-details">
            <p class="file-name">{{ selectedFile.name }}</p>
            <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
          </div>
          <el-button type="danger" icon="Delete" circle @click.stop="removeFile"></el-button>
        </div>
      </div>
      
      <div class="form-section" v-if="selectedFile">
        <el-form :model="videoForm" label-position="top">
          <el-form-item label="视频标题" required>
            <el-input v-model="videoForm.title" placeholder="请输入视频标题" maxlength="50" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="视频描述">
            <el-input v-model="videoForm.description" type="textarea" placeholder="请输入视频描述" maxlength="200" show-word-limit rows="3"></el-input>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="upload-progress" v-if="isUploading">
        <el-progress :percentage="uploadProgress" :format="progressFormat" :status="uploadStatus"></el-progress>
        <p class="progress-text">{{ progressText }}</p>
        <!-- 分块上传详细信息 -->
        <div v-if="uploadId && totalChunks > 0" class="chunk-info">
          <span>分块进度: {{ currentChunk }}/{{ totalChunks }}</span>
          <span class="chunk-size">分块大小: {{ (CHUNK_SIZE / 1024 / 1024).toFixed(1) }}MB</span>
        </div>
      </div>
      
      <div class="action-buttons">
        <el-button @click="goBack">取消</el-button>
        <el-button 
          v-if="isUploading && uploadId"
          type="danger"
          @click="handleCancelUpload"
          :icon="Delete"
        >
          取消上传
        </el-button>
        <el-button type="primary" @click="uploadVideo" :disabled="!canUpload" :loading="isUploading">上传</el-button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { Upload, VideoCamera, Delete, ArrowLeft } from '@element-plus/icons-vue';
import { 
  checkDuplicate, 
  uploadPersonVideo, 
  initChunkUpload, 
  uploadChunk, 
  mergeChunks, 
  getUploadProgress, 
  cancelUpload 
} from '@/api/Video';
import Background from '@/components/Background.vue';

const router = useRouter();
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const isUploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref('');
const progressText = ref('');

// 分块上传相关状态
const uploadId = ref('');
const currentChunk = ref(0);
const totalChunks = ref(0);
const uploadedChunks = ref<string[]>([]);
const progressInterval = ref<number | null>(null);

// 分块大小常量（5MB）
const CHUNK_SIZE = 5 * 1024 * 1024;

const videoForm = reactive({
  title: '',
  description: ''
});

// 计算属性：是否可以上传
const canUpload = computed(() => {
  return selectedFile.value && videoForm.title.trim() !== '';
});

// 触发文件选择框
const triggerFileInput = () => {
  if (!isUploading.value) {
    fileInput.value?.click();
  }
};

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    selectedFile.value = input.files[0];
    // 自动填充标题（去除扩展名）
    const fileName = selectedFile.value.name;
    videoForm.title = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  }
};

// 拖拽相关处理
const onDragOver = () => {
  if (!isUploading.value) {
    isDragOver.value = true;
  }
};

const onDragLeave = () => {
  isDragOver.value = false;
};

const onDrop = (event: DragEvent) => {
  if (isUploading.value) return;
  
  isDragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    // 检查是否为视频文件
    if (files[0].type.startsWith('video/')) {
      selectedFile.value = files[0];
      // 自动填充标题（去除扩展名）
      const fileName = selectedFile.value.name;
      videoForm.title = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    } else {
      ElMessage.warning('请上传视频文件');
    }
  }
};

// 移除已选择的文件
const removeFile = () => {
  if (!isUploading.value) {
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

// 格式化文件大小
const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + ' KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  } else {
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  }
};

// 格式化进度条文本
const progressFormat = (percentage: number) => {
  return percentage === 100 && uploadStatus.value === 'success' ? '完成' : `${percentage}%`;
};

// 计算文件的SHA256哈希值（简化版，实际项目中应使用Web Crypto API）
const calculateSHA256 = async (file: File): Promise<string> => {
  // 这里简化处理，实际项目中应该使用Web Crypto API计算真实的SHA256
  // 返回一个基于文件名和大小的模拟哈希值
  return `${file.name}-${file.size}-${Date.now()}`;
};

// 将文件分块
const createFileChunks = (file: File): Blob[] => {
  const chunks: Blob[] = [];
  let start = 0;
  
  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  
  return chunks;
};

// 查询上传进度
const queryUploadProgress = async () => {
  if (!uploadId.value) return;
  
  try {
    const response = await getUploadProgress({ uploadSessionId: uploadId.value });
    if (response.code === 10000) {
      const { progressPercent, status, completedChunks } = response.data;
      uploadProgress.value = progressPercent || 0;
      // 注意：API返回的是completedChunks，不是uploadedChunks
      if (completedChunks !== undefined) {
        currentChunk.value = completedChunks;
      }
      
      if (status === 'COMPLETED') {
        uploadProgress.value = 100;
        uploadStatus.value = 'success';
        progressText.value = '上传完成！';
        clearProgressInterval();
      }
    }
  } catch (error) {
    console.error('查询上传进度失败:', error);
  }
};

// 清除进度查询定时器
const clearProgressInterval = () => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value);
    progressInterval.value = null;
  }
};

// 取消上传
const handleCancelUpload = async () => {
  if (!uploadId.value) {
    isUploading.value = false;
    return;
  }
    try {
    await cancelUpload({ uploadSessionId: uploadId.value });
    ElMessage.success('上传已取消');
  } catch (error) {
    console.error('取消上传失败:', error);
  } finally {
    clearProgressInterval();
    resetUploadState();
  }
};

// 重置上传状态
const resetUploadState = () => {
  isUploading.value = false;
  uploadProgress.value = 0;
  uploadStatus.value = '';
  progressText.value = '';
  uploadId.value = '';
  currentChunk.value = 0;
  totalChunks.value = 0;
  uploadedChunks.value = [];
  clearProgressInterval();
};

// 上传视频
const uploadVideo = async () => {
  if (!selectedFile.value || !canUpload.value) return;
  
  resetUploadState();
  isUploading.value = true;
  progressText.value = '准备上传...';
  
  try {
    // 计算文件哈希值
    const sha256 = await calculateSHA256(selectedFile.value);
    
    // 秒传检测
    progressText.value = '检查文件是否已存在...';
    uploadProgress.value = 10;
    
    const checkResult = await checkDuplicate({
      sha256,
      fileSize: selectedFile.value.size,
      deviceType: 'WEB'
    });
    
    if (checkResult.data.status === 'COMPLETED') {
      // 文件已存在，秒传成功
      uploadProgress.value = 100;
      uploadStatus.value = 'success';
      progressText.value = '秒传成功！';
      
      ElMessage.success('视频秒传成功！');
      setTimeout(() => {
        router.push('/video');
      }, 1500);
      return;
    }
    
    // 判断文件大小，选择上传方式
    const fileSize = selectedFile.value.size;
    const isLargeFile = fileSize > 50 * 1024 * 1024; // 50MB以上使用分块上传
    
    if (isLargeFile) {
      await uploadLargeFile(selectedFile.value, sha256);
    } else {
      await uploadSmallFile(selectedFile.value, sha256);
    }
    
  } catch (error) {
    console.error('上传失败', error);
    uploadStatus.value = 'exception';
    progressText.value = '上传失败，请重试';
    ElMessage.error('上传失败，请重试');
    resetUploadState();
  }
};

// 小文件上传
const uploadSmallFile = async (file: File, sha256: string) => {
  progressText.value = '正在上传视频...';
  uploadProgress.value = 20;
  
  // 模拟上传进度
  const interval = setInterval(() => {
    if (uploadProgress.value < 90) {
      uploadProgress.value += 10;
    }
  }, 1000);
  
  try {
    await uploadPersonVideo({
      title: videoForm.title,
      description: videoForm.description,
      sha256,
      deviceType: 'WEB',
      file
    });
    
    clearInterval(interval);
    
    // 上传成功
    uploadProgress.value = 100;
    uploadStatus.value = 'success';
    progressText.value = '上传成功！';
    
    ElMessage.success('视频上传成功！');
    setTimeout(() => {
      router.push('/video');
    }, 1500);
  } catch (error) {
    clearInterval(interval);
    throw error;
  }
};

// 大文件分块上传
const uploadLargeFile = async (file: File, sha256: string) => {
  try {
    // 1. 初始化分块上传
    progressText.value = '初始化分块上传...';
    uploadProgress.value = 5;
    
    const chunks = createFileChunks(file);
    totalChunks.value = chunks.length;
    
    const initResult = await initChunkUpload({
      title: videoForm.title,
      description: videoForm.description,
      sha256,
      fileSize: file.size,
      totalChunks: chunks.length,
      deviceType: 'WEB'
    });
    
    uploadId.value = initResult.data.uploadSessionId || '';
    
    // 2. 开始分块上传
    progressText.value = `开始分块上传 (共${chunks.length}块)...`;
    
    // 启动进度查询定时器
    progressInterval.value = setInterval(queryUploadProgress, 2000);
    
    for (let i = 0; i < chunks.length; i++) {
      currentChunk.value = i + 1;
      progressText.value = `上传分块 ${i + 1}/${chunks.length}...`;
      
      // 将Blob转换为File类型
      const chunkFile = new File([chunks[i]], `${file.name}.chunk${i}`, {
        type: file.type,
        lastModified: file.lastModified
      });
      
      const chunkResult = await uploadChunk({
        uploadSessionId: uploadId.value,
        chunkIndex: i,
        chunkSha256: `chunk-${i}-${Date.now()}`, 
        chunkSize: chunks[i].size,
        file: chunkFile
      });
      
      // 注意：根据API返回结构调整
      if (chunkResult.data) {
        uploadedChunks.value.push(`chunk-${i}`);
      }
      
      // 更新进度
      const progress = Math.floor(((i + 1) / chunks.length) * 80) + 10; // 10-90%
      uploadProgress.value = progress;
    }
    
    // 3. 合并分块
    progressText.value = '正在合并文件...';
    uploadProgress.value = 95;
    
    await mergeChunks({
      uploadSessionId: uploadId.value,
      finalSha256: sha256
    });
    
    // 上传完成
    clearProgressInterval();
    uploadProgress.value = 100;
    uploadStatus.value = 'success';
    progressText.value = '上传成功！';
    
    ElMessage.success('视频上传成功！');
    setTimeout(() => {
      router.push('/video');
    }, 1500);
    
  } catch (error) {
    clearProgressInterval();
    throw error;
  }
};

// 返回视频列表页面
const goBack = () => {
  if (isUploading.value) {
    ElMessage.warning('上传过程中无法取消，请等待上传完成');
    return;
  }
  router.push('/video');
};
</script>

<style scoped lang="scss">
.upload-page {
  position: relative;
  width: 100%;
  min-height: calc(100vh - 180px); 
  overflow: visible; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 70px; 
  z-index: 1; 
  padding-top: 60px; 
}

.video-upload-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
  width: 100%;
  max-width: 100%;
  position: relative;
  z-index: 1; /* 确保内容在背景之上，但低于footer */
  /* min-height property removed to prevent pushing FooterInfo out of view */
}

/* 确保Background组件的样式不被scoped影响 */
:deep(.background-wrapper) {
  z-index: 0;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 40px;
  z-index: 10;
}

.upload-card {
  width: 800px;
  max-width: 90%;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 0 auto 20px;
}

.upload-title {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #333;
}

.upload-area {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 24px;
  
  &:hover, &.drag-over {
    border-color: #409eff;
    background-color: rgba(64, 158, 255, 0.05);
  }
}

.upload-placeholder {
  .upload-icon {
    font-size: 48px;
    color: #909399;
    margin-bottom: 16px;
  }
  
  p {
    margin: 8px 0;
    color: #606266;
  }
  
  .upload-tip {
    font-size: 12px;
    color: #909399;
  }
}

.file-info {
  display: flex;
  align-items: center;
  padding: 10px;
  
  .file-icon {
    font-size: 36px;
    color: #409eff;
    margin-right: 16px;
  }
  
  .file-details {
    flex: 1;
    text-align: left;
    
    .file-name {
      margin: 0 0 4px;
      font-weight: 500;
      color: #303133;
      word-break: break-all;
    }
    
    .file-size {
      margin: 0;
      font-size: 12px;
      color: #909399;
    }
  }
}

.form-section {
  margin-bottom: 24px;
}

.upload-progress {
  margin-bottom: 24px;
  
  .progress-text {
    margin-top: 8px;
    text-align: center;
    color: #606266;
  }

  .chunk-info {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #999;
    padding: 0 4px;
  }

  .chunk-size {
    color: #666;
  }
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>