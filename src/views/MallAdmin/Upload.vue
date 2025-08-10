<template>
    <div class="upload-page">
        <!-- 头部信息 -->
        <el-card class="header-card" shadow="never">
            <div class="header-content">
                <div class="header-left">
                    <h3>文件管理</h3>
                    <p class="header-desc">支持图片、文档等文件的上传和管理</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" @click="triggerUpload">
                        <el-icon>
                            <Upload />
                        </el-icon>
                        上传文件
                    </el-button>
                </div>
            </div>
        </el-card>

        <!-- 上传区域 -->
        <el-card class="upload-card" shadow="never">
            <template #header>
                <span>文件上传</span>
            </template>

            <el-upload ref="uploadRef" class="upload-dragger" drag action="/api/minio/upload" multiple
                :auto-upload="false" :on-change="handleFileChange" :on-success="handleUploadSuccess"
                :on-error="handleUploadError" :before-upload="beforeUpload" :file-list="fileList" :limit="10"
                :on-exceed="handleExceed">
                <el-icon class="el-icon--upload">
                    <UploadFilled />
                </el-icon>
                <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                </div>
                <template #tip>
                    <div class="el-upload__tip">
                        支持jpg/png/gif/pdf/doc/docx文件，且不超过5MB，最多同时上传10个文件
                    </div>
                </template>
            </el-upload>

            <div v-if="fileList.length > 0" class="upload-actions">
                <el-button type="primary" @click="submitUpload" :loading="uploading">
                    开始上传
                </el-button>
                <el-button @click="clearFiles">清空列表</el-button>
            </div>
        </el-card>

        <!-- 文件列表 -->
        <el-card class="files-card" shadow="never">
            <template #header>
                <div class="files-header">
                    <span>文件列表</span>
                    <div class="files-actions">
                        <el-input v-model="searchKeyword" placeholder="搜索文件名" style="width: 200px; margin-right: 12px"
                            clearable @input="handleSearch">
                            <template #prefix>
                                <el-icon>
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                        <el-select v-model="filterType" placeholder="文件类型" style="width: 120px" @change="handleFilter">
                            <el-option label="全部" value="" />
                            <el-option label="图片" value="image" />
                            <el-option label="文档" value="document" />
                            <el-option label="其他" value="other" />
                        </el-select>
                    </div>
                </div>
            </template>

            <div v-loading="loading" class="files-grid">
                <div v-for="file in filteredFiles" :key="file.id" class="file-item" @click="handleFileClick(file)">
                    <div class="file-preview">
                        <img v-if="isImage(file.type)" :src="file.url" :alt="file.name" class="file-image" />
                        <div v-else class="file-icon">
                            <el-icon size="48">
                                <Document v-if="isDocument(file.type)" />
                                <Files v-else />
                            </el-icon>
                        </div>
                    </div>

                    <div class="file-info">
                        <div class="file-name" :title="file.name">{{ file.name }}</div>
                        <div class="file-meta">
                            <span class="file-size">{{ formatFileSize(file.size) }}</span>
                            <span class="file-time">{{ formatTime(file.createTime) }}</span>
                        </div>
                    </div>

                    <div class="file-actions">
                        <el-button type="primary" link size="small" @click.stop="handleCopy(file)">
                            复制链接
                        </el-button>
                        <el-button type="primary" link size="small" @click.stop="handleDownload(file)">
                            下载
                        </el-button>
                        <el-button type="danger" link size="small" @click.stop="handleDelete(file)">
                            删除
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[12, 24, 48, 96]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 文件预览对话框 -->
        <el-dialog v-model="previewVisible" title="文件预览" width="800px" :before-close="handlePreviewClose">
            <div v-if="currentFile" class="preview-container">
                <div v-if="isImage(currentFile.type)" class="image-preview">
                    <img :src="currentFile.url" :alt="currentFile.name" class="preview-image" />
                </div>
                <div v-else class="file-preview-info">
                    <el-icon size="64" class="file-preview-icon">
                        <Document v-if="isDocument(currentFile.type)" />
                        <Files v-else />
                    </el-icon>
                    <h3>{{ currentFile.name }}</h3>
                    <p>文件大小：{{ formatFileSize(currentFile.size) }}</p>
                    <p>上传时间：{{ formatTime(currentFile.createTime) }}</p>
                    <p>文件链接：{{ currentFile.url }}</p>
                </div>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="previewVisible = false">关闭</el-button>
                    <el-button v-if="currentFile" type="primary" @click="handleCopy(currentFile)">
                        复制链接
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload, UploadFilled, Search, Document, Files } from '@element-plus/icons-vue'

interface FileItem {
    id: number
    name: string
    url: string
    size: number
    type: string
    createTime: string
}

interface UploadResponse {
    code: number
    data: {
        url: string
        name: string
    }
}

const uploadRef = ref()
const loading = ref(false)
const uploading = ref(false)
const previewVisible = ref(false)

// 文件列表
const fileList = ref([])
const uploadedFiles = ref<FileItem[]>([])

// 搜索和筛选
const searchKeyword = ref('')
const filterType = ref('')

// 分页
const pagination = reactive({
    current: 1,
    size: 12,
    total: 0
})

// 当前预览文件
const currentFile = ref<FileItem | null>(null)

// 过滤后的文件列表（不包含分页）
const filteredFilesAll = computed(() => {
    let files = uploadedFiles.value

    // 按关键词搜索
    if (searchKeyword.value) {
        files = files.filter(file =>
            file.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
        )
    }

    // 按类型筛选
    if (filterType.value) {
        files = files.filter(file => {
            if (filterType.value === 'image') {
                return isImage(file.type)
            } else if (filterType.value === 'document') {
                return isDocument(file.type)
            } else if (filterType.value === 'other') {
                return !isImage(file.type) && !isDocument(file.type)
            }
            return true
        })
    }

    return files
})

// 分页后的文件列表
const filteredFiles = computed(() => {
    const files = filteredFilesAll.value
    const start = (pagination.current - 1) * pagination.size
    const end = start + pagination.size

    return files.slice(start, end)
})

// 监听文件变化更新总数
watch(filteredFilesAll, (files: FileItem[]) => {
    pagination.total = files.length
    // 如果当前页超出范围，重置到第一页
    if (pagination.current > Math.ceil(files.length / pagination.size)) {
        pagination.current = 1
    }
})

// 获取文件列表
const fetchFiles = async () => {
    loading.value = true
    try {
        // 模拟数据
        const mockFiles: FileItem[] = [
            {
                id: 1,
                name: 'product-1.jpg',
                url: 'https://picsum.photos/300/300?random=1',
                size: 245760,
                type: 'image/jpeg',
                createTime: '2025-08-10 10:30:00'
            },
            {
                id: 2,
                name: 'product-2.png',
                url: 'https://picsum.photos/300/300?random=2',
                size: 156890,
                type: 'image/png',
                createTime: '2025-08-10 09:15:00'
            },
            {
                id: 3,
                name: '商品介绍.pdf',
                url: '/files/document.pdf',
                size: 1024000,
                type: 'application/pdf',
                createTime: '2025-08-10 08:45:00'
            },
            {
                id: 4,
                name: '用户手册.docx',
                url: '/files/manual.docx',
                size: 512000,
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                createTime: '2025-08-09 16:20:00'
            }
        ]

        uploadedFiles.value = mockFiles
    } catch (error) {
        console.error('获取文件列表失败:', error)
        ElMessage.error('获取文件列表失败')
    } finally {
        loading.value = false
    }
}

// 判断是否为图片
const isImage = (type: string) => {
    return type.startsWith('image/')
}

// 判断是否为文档
const isDocument = (type: string) => {
    const documentTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    return documentTypes.includes(type)
}

// 格式化文件大小
const formatFileSize = (size: number) => {
    if (size < 1024) {
        return size + ' B'
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB'
    } else {
        return (size / (1024 * 1024)).toFixed(1) + ' MB'
    }
}

// 格式化时间
const formatTime = (time: string) => {
    return new Date(time).toLocaleString()
}

// 触发上传
const triggerUpload = () => {
    uploadRef.value?.el?.querySelector('input')?.click()
}

// 文件变化
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleFileChange = (file: any, fileList: any[]) => {
    console.log('文件变化:', file, fileList)
}

// 上传成功
const handleUploadSuccess = (response: UploadResponse) => {
    if (response.code === 200) {
        ElMessage.success('上传成功')
        // 添加到文件列表
        const newFile: FileItem = {
            id: Date.now(),
            name: response.data.name,
            url: response.data.url,
            size: 0, // 实际应该从上传的文件获取
            type: 'image/jpeg', // 实际应该从上传的文件获取
            createTime: new Date().toISOString()
        }
        uploadedFiles.value.unshift(newFile)
    } else {
        ElMessage.error('上传失败')
    }
}

// 上传失败
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleUploadError = (error: any) => {
    console.error('上传失败:', error)
    ElMessage.error('上传失败')
}

// 上传前校验
const beforeUpload = (file: File) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    const isAllowedType = allowedTypes.includes(file.type)
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isAllowedType) {
        ElMessage.error('不支持的文件类型!')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('文件大小不能超过 5MB!')
        return false
    }
    return true
}

// 文件数量超限
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleExceed = (files: File[], fileList: any[]) => {
    ElMessage.warning(`最多只能上传 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}

// 开始上传
const submitUpload = () => {
    uploading.value = true
    uploadRef.value?.submit()
    setTimeout(() => {
        uploading.value = false
        clearFiles()
    }, 2000)
}

// 清空文件列表
const clearFiles = () => {
    uploadRef.value?.clearFiles()
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
}

// 筛选
const handleFilter = () => {
    pagination.current = 1
}

// 分页大小变化
const handleSizeChange = (size: number) => {
    pagination.size = size
}

// 当前页变化
const handleCurrentChange = (page: number) => {
    pagination.current = page
}

// 点击文件
const handleFileClick = (file: FileItem) => {
    currentFile.value = file
    previewVisible.value = true
}

// 复制链接
const handleCopy = async (file: FileItem) => {
    try {
        await navigator.clipboard.writeText(file.url)
        ElMessage.success('链接已复制到剪贴板')
    } catch (error) {
        console.error('复制失败:', error)
        ElMessage.error('复制失败')
    }
}

// 下载文件
const handleDownload = (file: FileItem) => {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// 删除文件
const handleDelete = async (file: FileItem) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除文件"${file.name}"吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        // 这里应该调用实际的删除API
        console.log('删除文件:', file.id)

        // 从列表中移除
        const index = uploadedFiles.value.findIndex(f => f.id === file.id)
        if (index > -1) {
            uploadedFiles.value.splice(index, 1)
        }

        ElMessage.success('删除成功')
    } catch {
        // 用户取消操作
    }
}

// 关闭预览
const handlePreviewClose = () => {
    previewVisible.value = false
    currentFile.value = null
}

onMounted(() => {
    fetchFiles()
})
</script>

<style scoped>
.upload-page {
    padding: 20px;
}

.header-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left h3 {
    margin: 0 0 4px 0;
    color: #303133;
}

.header-desc {
    margin: 0;
    color: #909399;
    font-size: 14px;
}

.upload-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.upload-dragger {
    width: 100%;
}

.upload-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: center;
}

.files-card {
    border-radius: 8px;
}

.files-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.files-actions {
    display: flex;
    align-items: center;
}

.files-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    min-height: 200px;
}

.file-item {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
}

.file-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.file-preview {
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    background-color: #f5f7fa;
    margin-bottom: 8px;
}

.file-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    border-radius: 6px;
}

.file-icon {
    color: #909399;
}

.file-info {
    flex: 1;
    margin-bottom: 8px;
}

.file-name {
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.file-meta {
    font-size: 12px;
    color: #909399;
    display: flex;
    justify-content: space-between;
}

.file-actions {
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s;
}

.file-item:hover .file-actions {
    opacity: 1;
}

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.preview-container {
    text-align: center;
}

.image-preview {
    max-height: 500px;
    overflow: auto;
}

.preview-image {
    max-width: 100%;
    max-height: 500px;
    object-fit: contain;
}

.file-preview-info {
    padding: 40px;
}

.file-preview-icon {
    color: #909399;
    margin-bottom: 16px;
}

.file-preview-info h3 {
    margin: 16px 0;
    color: #303133;
}

.file-preview-info p {
    margin: 8px 0;
    color: #606266;
    word-break: break-all;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
</style>
