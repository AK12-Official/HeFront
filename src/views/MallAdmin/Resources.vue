<!-- 资源管理页面 -->
<template>
    <div class="resources-container">
        <div class="page-header">
            <h2>资源管理</h2>
            <p>管理系统资源权限</p>
        </div>

        <div class="content">
            <el-card shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>资源列表</span>
                        <el-button type="primary" @click="handleAdd">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            添加资源
                        </el-button>
                    </div>
                </template>

                <div class="table-container">
                    <el-table :data="resources" v-loading="loading" border>
                        <el-table-column prop="id" label="ID" width="80" />
                        <el-table-column prop="name" label="资源名称" />
                        <el-table-column prop="url" label="资源URL" />
                        <el-table-column prop="description" label="描述" />
                        <el-table-column prop="createTime" label="创建时间" width="180" />
                        <el-table-column label="操作" width="200">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" @click="handleEdit(row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="small" @click="handleDelete(row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { AdminResource } from '@/api/malladmin/types'

const loading = ref(false)
const resources = ref<AdminResource[]>([])

// 加载资源列表
const loadResources = async () => {
    try {
        loading.value = true
        // TODO: 调用API获取资源列表
        // const response = await getResourceList()
        // resources.value = response.data || []

        // 临时模拟数据
        resources.value = [
            {
                id: 1,
                name: '用户管理',
                url: '/admin/users',
                description: '用户管理页面',
                categoryId: 1,
                createTime: '2024-01-01 10:00:00'
            }
        ]
    } catch (error) {
        console.error('加载资源列表失败:', error)
        ElMessage.error('加载资源列表失败')
    } finally {
        loading.value = false
    }
}

// 添加资源
const handleAdd = () => {
    ElMessage.info('添加资源功能待实现')
}

// 编辑资源
const handleEdit = (row: AdminResource) => {
    ElMessage.info(`编辑资源: ${row.name}`)
}

// 删除资源
const handleDelete = async (row: AdminResource) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除资源 "${row.name}" 吗？`,
            '确认删除',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        // TODO: 调用API删除资源
        ElMessage.success('删除成功')
        loadResources()
    } catch (error) {
        // 用户取消删除
    }
}

onMounted(() => {
    loadResources()
})
</script>

<style scoped>
.resources-container {
    padding: 20px;
}

.page-header {
    margin-bottom: 20px;
}

.page-header h2 {
    margin: 0 0 8px 0;
    color: #303133;
}

.page-header p {
    margin: 0;
    color: #909399;
    font-size: 14px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-container {
    margin-top: 20px;
}
</style>
