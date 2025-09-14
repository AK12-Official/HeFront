<template>
    <div class="admin-product-attribute-categories">
        <!-- 搜索和操作栏 -->
        <div class="search-bar">
            <div class="search-form">
                <el-form :model="searchForm" inline>
                    <el-form-item label="分类名称">
                        <el-input v-model="searchForm.name" placeholder="请输入分类名称" clearable style="width: 200px" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleSearch" :loading="loading">
                            <el-icon>
                                <Search />
                            </el-icon>
                            搜索
                        </el-button>
                        <el-button @click="handleReset">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>

            <div class="action-buttons">
                <el-button type="success" @click="handleCreate">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加分类
                </el-button>
            </div>
        </div>

        <!-- 分类列表表格 -->
        <div class="table-container">
            <el-table :data="tableData" :loading="loading" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="id" label="ID" width="80" />

                <el-table-column prop="name" label="分类名称" min-width="200" />

                <el-table-column prop="attributeCount" label="属性数量" width="120">
                    <template #default="{ row }">
                        <el-tag type="primary">{{ row.attributeCount }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="paramCount" label="参数数量" width="120">
                    <template #default="{ row }">
                        <el-tag type="success">{{ row.paramCount }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="info" size="small" @click="handleViewAttributes(row)">
                            查看属性
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
                :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 批量操作 -->
        <div class="batch-actions" v-if="selectedRows.length > 0">
            <el-alert :title="`已选择 ${selectedRows.length} 项`" type="info" :closable="false"
                style="margin-bottom: 10px;" />
            <div class="batch-buttons">
                <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
            </div>
        </div>

        <!-- 创建/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入分类名称" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                    确定
                </el-button>
            </template>
        </el-dialog>

        <!-- 属性查看对话框 -->
        <el-dialog v-model="attributesDialogVisible" title="属性列表" width="800px">
            <div v-if="currentCategory" class="attributes-content">
                <div class="category-info">
                    <h3>{{ currentCategory.name }}</h3>
                    <p>属性数量：{{ currentCategory.attributeCount }} | 参数数量：{{ currentCategory.paramCount }}</p>
                </div>

                <el-table :data="currentCategory.attributeList" stripe style="width: 100%">
                    <el-table-column prop="name" label="属性名称" min-width="150" />
                    <el-table-column prop="type" label="类型" width="100">
                        <template #default="{ row }">
                            <el-tag :type="row.type === 0 ? 'primary' : 'success'">
                                {{ row.type === 0 ? '属性' : '参数' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="selectType" label="选择类型" width="120">
                        <template #default="{ row }">
                            <span>{{ getSelectTypeText(row.selectType) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inputType" label="输入类型" width="120">
                        <template #default="{ row }">
                            <span>{{ getInputTypeText(row.inputType) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="inputList" label="可选值" min-width="200">
                        <template #default="{ row }">
                            <div v-if="row.inputList" class="input-list">
                                <el-tag v-for="(item, index) in row.inputList.split(',')" :key="index" size="small"
                                    style="margin-right: 4px;">
                                    {{ item }}
                                </el-tag>
                            </div>
                            <span v-else class="text-gray">无</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { ProductAttributeCategory, ProductAttributeCategoryItem } from '@/api/malladmin/types';

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const attributesDialogVisible = ref(false);
const dialogTitle = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<ProductAttributeCategory[]>([]);
const selectedRows = ref<ProductAttributeCategory[]>([]);
const currentCategory = ref<ProductAttributeCategoryItem | null>(null);
const formRef = ref();

// 搜索表单
const searchForm = reactive({
    name: ''
});

// 表单数据
const form = reactive({
    name: ''
});

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
    ]
};

// 方法
const loadData = async () => {
    loading.value = true;
    try {
        const result = await malladmin.getProductAttributeCategoryList(currentPage.value, pageSize.value);

        if (result.code === 200) {
            tableData.value = result.data.list;
            total.value = result.data.total;
        } else {
            ElMessage.error(result.message || '加载数据失败');
        }
    } catch (error: unknown) {
        console.error('加载数据失败:', error);
        ElMessage.error('加载数据失败');
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    loadData();
};

const handleReset = () => {
    searchForm.name = '';
    currentPage.value = 1;
    loadData();
};

const handleSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    loadData();
};

const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    loadData();
};

const handleSelectionChange = (rows: ProductAttributeCategory[]) => {
    selectedRows.value = rows;
};

const handleCreate = () => {
    dialogTitle.value = '添加分类';
    resetForm();
    dialogVisible.value = true;
};

const handleEdit = (row: ProductAttributeCategory) => {
    dialogTitle.value = '编辑分类';
    form.name = row.name;
    dialogVisible.value = true;
};

const handleViewAttributes = async (row: ProductAttributeCategory) => {
    try {
        const result = await malladmin.getProductAttributeCategoryListWithAttr();
        if (result.code === 200) {
            currentCategory.value = result.data.find(item => item.id === row.id) || null;
            attributesDialogVisible.value = true;
        } else {
            ElMessage.error(result.message || '获取属性列表失败');
        }
    } catch (error: unknown) {
        console.error('获取属性列表失败:', error);
        ElMessage.error('获取属性列表失败');
    }
};

const handleSubmit = async () => {
    if (!formRef.value) return;

    try {
        await formRef.value.validate();
        submitLoading.value = true;

        if (dialogTitle.value === '添加分类') {
            const result = await malladmin.createProductAttributeCategory(form.name);
            if (result.code === 200) {
                ElMessage.success('添加成功');
                dialogVisible.value = false;
                loadData();
            } else {
                ElMessage.error(result.message || '添加失败');
            }
        } else {
            // 编辑模式需要获取当前行的ID
            const currentRow = tableData.value.find(row => row.name === form.name);
            if (currentRow) {
                const result = await malladmin.updateProductAttributeCategory(currentRow.id, form.name);
                if (result.code === 200) {
                    ElMessage.success('更新成功');
                    dialogVisible.value = false;
                    loadData();
                } else {
                    ElMessage.error(result.message || '更新失败');
                }
            }
        }
    } catch (error: unknown) {
        console.error('提交失败:', error);
        ElMessage.error('提交失败');
    } finally {
        submitLoading.value = false;
    }
};

const handleDelete = async (row: ProductAttributeCategory) => {
    try {
        await ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const result = await malladmin.deleteProductAttributeCategory(row.id);

        if (result.code === 200) {
            ElMessage.success('删除成功');
            loadData();
        } else {
            ElMessage.error(result.message || '删除失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
        }
    }
};

const handleBatchDelete = async () => {
    try {
        const ids = selectedRows.value.map(row => row.id);
        await ElMessageBox.confirm(`确定要批量删除选中的 ${selectedRows.value.length} 个分类吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        // 循环删除每个分类
        let successCount = 0;
        for (const id of ids) {
            try {
                const result = await malladmin.deleteProductAttributeCategory(id);
                if (result.code === 200) {
                    successCount++;
                }
            } catch (error) {
                console.error(`删除分类 ${id} 失败:`, error);
            }
        }

        if (successCount === ids.length) {
            ElMessage.success('批量删除成功');
        } else {
            ElMessage.warning(`批量删除完成，成功 ${successCount}/${ids.length} 个`);
        }

        selectedRows.value = [];
        loadData();
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error);
            ElMessage.error('批量删除失败');
        }
    }
};

const resetForm = () => {
    form.name = '';
};

const getSelectTypeText = (type: number) => {
    const typeMap: Record<number, string> = {
        0: '单选',
        1: '多选'
    };
    return typeMap[type] || '未知';
};

const getInputTypeText = (type: number) => {
    const typeMap: Record<number, string> = {
        0: '手工输入',
        1: '从列表中选择'
    };
    return typeMap[type] || '未知';
};

onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
.admin-product-attribute-categories {
    .search-bar {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: space-between;
        align-items: center;

        .search-form {
            flex: 1;
        }

        .action-buttons {
            margin-left: 20px;
        }
    }

    .table-container {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;

        .input-list {
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .text-gray {
            color: #909399;
        }
    }

    .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .batch-actions {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 1000;

        .batch-buttons {
            display: flex;
            gap: 10px;
        }
    }

    .attributes-content {
        .category-info {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f7fa;
            border-radius: 4px;

            h3 {
                margin: 0 0 8px 0;
                color: #303133;
            }

            p {
                margin: 0;
                color: #606266;
                font-size: 14px;
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .admin-product-attribute-categories {
        .search-bar {
            flex-direction: column;
            align-items: stretch;

            .action-buttons {
                margin-left: 0;
                margin-top: 15px;
            }
        }

        .batch-actions {
            left: 10px;
            right: 10px;
            transform: none;

            .batch-buttons {
                justify-content: center;
            }
        }
    }
}
</style>
