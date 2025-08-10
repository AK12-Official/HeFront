<template>
    <div class="admin-users">
        <!-- 搜索和操作栏 -->
        <div class="search-bar">
            <div class="search-left">
                <el-input v-model="searchForm.keyword" placeholder="请输入用户名或姓名" clearable style="width: 300px"
                    @clear="handleSearch" @keyup.enter="handleSearch">
                    <template #prefix>
                        <el-icon>
                            <Search />
                        </el-icon>
                    </template>
                </el-input>
                <el-button type="primary" @click="handleSearch" :loading="loading">
                    <el-icon>
                        <Search />
                    </el-icon>
                    搜索
                </el-button>
            </div>

            <div class="search-right">
                <el-button type="success" @click="showAddDialog = true">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加管理员
                </el-button>
            </div>
        </div>

        <!-- 用户列表表格 -->
        <div class="table-container">
            <el-table :data="tableData" :loading="loading" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="id" label="ID" width="80" />

                <el-table-column prop="username" label="用户名" min-width="120">
                    <template #default="{ row }">
                        <el-tag>{{ row.username }}</el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="nickName" label="昵称" min-width="120" />

                <el-table-column prop="email" label="邮箱" min-width="180" />

                <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                            {{ row.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" width="180">
                    <template #default="{ row }">
                        {{ formatTime(row.createTime) }}
                    </template>
                </el-table-column>

                <el-table-column prop="loginTime" label="最后登录" width="180">
                    <template #default="{ row }">
                        {{ row.loginTime ? formatTime(row.loginTime) : '从未登录' }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button :type="row.status === 1 ? 'warning' : 'success'" size="small"
                            @click="handleStatusChange(row)">
                            {{ row.status === 1 ? '禁用' : '启用' }}
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

        <!-- 添加/编辑用户对话框 -->
        <el-dialog v-model="showEditDialog" :title="editForm.id ? '编辑管理员' : '添加管理员'" width="500px"
            :close-on-click-modal="false">
            <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" placeholder="请输入用户名" :disabled="!!editForm.id" />
                </el-form-item>

                <el-form-item label="密码" prop="password" v-if="!editForm.id">
                    <el-input v-model="editForm.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="editForm.nickName" placeholder="请输入昵称" />
                </el-form-item>

                <el-form-item label="备注" prop="note">
                    <el-input v-model="editForm.note" type="textarea" placeholder="请输入备注" :rows="3" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleEditCancel">取消</el-button>
                <el-button type="primary" @click="handleEditConfirm" :loading="editLoading">
                    确定
                </el-button>
            </template>
        </el-dialog>

        <!-- 批量操作 -->
        <div class="batch-actions" v-if="selectedRows.length > 0">
            <el-alert :title="`已选择 ${selectedRows.length} 项`" type="info" :closable="false"
                style="margin-bottom: 10px;" />
            <el-button type="danger" @click="handleBatchDelete">
                批量删除
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { Admin, AdminListParams, AdminUpdateParams, AdminRegisterParams } from '@/api/malladmin/types';

// 响应式数据
const loading = ref(false);
const editLoading = ref(false);
const showEditDialog = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<Admin[]>([]);
const selectedRows = ref<Admin[]>([]);

// 表单引用
const editFormRef = ref();

// 搜索表单
const searchForm = reactive({
    keyword: ''
});

// 编辑表单
const editForm = reactive<Partial<Admin & AdminRegisterParams>>({
    id: undefined,
    username: '',
    password: '',
    email: '',
    nickName: '',
    note: ''
});

// 计算属性
const showAddDialog = computed({
    get: () => showEditDialog.value && !editForm.id,
    set: (val: boolean) => {
        if (val) {
            resetEditForm();
            showEditDialog.value = true;
        }
    }
});

// 编辑表单验证规则
const editRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    nickName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
    ]
};

// 方法
const loadData = async () => {
    loading.value = true;
    try {
        const params: AdminListParams = {
            pageNum: currentPage.value,
            pageSize: pageSize.value
        };

        if (searchForm.keyword) {
            params.keyword = searchForm.keyword;
        }

        const result = await malladmin.getAdminList(params);

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

const handleSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    loadData();
};

const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    loadData();
};

const handleSelectionChange = (rows: Admin[]) => {
    selectedRows.value = rows;
};

const resetEditForm = () => {
    editForm.id = undefined;
    editForm.username = '';
    editForm.password = '';
    editForm.email = '';
    editForm.nickName = '';
    editForm.note = '';
};

const handleEdit = (row: Admin) => {
    editForm.id = row.id;
    editForm.username = row.username;
    editForm.email = row.email;
    editForm.nickName = row.nickName;
    editForm.note = row.note || '';
    showEditDialog.value = true;
};

const handleEditCancel = () => {
    showEditDialog.value = false;
    if (editFormRef.value) {
        editFormRef.value.resetFields();
    }
};

const handleEditConfirm = async () => {
    if (!editFormRef.value) return;

    try {
        await editFormRef.value.validate();
        editLoading.value = true;

        if (editForm.id) {
            // 编辑用户
            const params: AdminUpdateParams = {
                username: editForm.username!,
                email: editForm.email!,
                nickName: editForm.nickName!,
                note: editForm.note
            };

            const result = await malladmin.updateAdmin(editForm.id, params);

            if (result.code === 200) {
                ElMessage.success('编辑成功');
                showEditDialog.value = false;
                loadData();
            } else {
                ElMessage.error(result.message || '编辑失败');
            }
        } else {
            // 添加用户
            const params: AdminRegisterParams = {
                username: editForm.username!,
                password: editForm.password!,
                email: editForm.email!,
                nickName: editForm.nickName!
            };

            const result = await malladmin.register(params);

            if (result.code === 200) {
                ElMessage.success('添加成功');
                showEditDialog.value = false;
                loadData();
            } else {
                ElMessage.error(result.message || '添加失败');
            }
        }
    } catch (error: unknown) {
        console.error('操作失败:', error);
        ElMessage.error('操作失败');
    } finally {
        editLoading.value = false;
    }
};

const handleStatusChange = async (row: Admin) => {
    try {
        const newStatus = row.status === 1 ? 0 : 1;
        const action = newStatus === 1 ? '启用' : '禁用';

        await ElMessageBox.confirm(`确定要${action}用户 "${row.username}" 吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const result = await malladmin.updateAdminStatus(row.id, { status: newStatus });

        if (result.code === 200) {
            ElMessage.success(`${action}成功`);
            loadData();
        } else {
            ElMessage.error(result.message || `${action}失败`);
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('状态修改失败:', error);
            ElMessage.error('状态修改失败');
        }
    }
};

const handleDelete = async (row: Admin) => {
    try {
        await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const result = await malladmin.deleteAdmin(row.id);

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
        const usernames = selectedRows.value.map(row => row.username).join('、');
        await ElMessageBox.confirm(`确定要删除选中的 ${selectedRows.value.length} 个用户吗？用户名：${usernames}`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        // 批量删除（这里假设后端支持批量删除，如果不支持可以循环调用单个删除接口）
        const promises = selectedRows.value.map(row => malladmin.deleteAdmin(row.id));
        await Promise.all(promises);

        ElMessage.success('批量删除成功');
        selectedRows.value = [];
        loadData();
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error);
            ElMessage.error('批量删除失败');
        }
    }
};

const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(time).toLocaleString('zh-CN');
};

onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
.admin-users {
    .search-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        .search-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }
    }

    .table-container {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;
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
    }
}

// 响应式设计
@media (max-width: 768px) {
    .admin-users .search-bar {
        flex-direction: column;
        gap: 15px;

        .search-left {
            width: 100%;
            justify-content: center;
        }

        .search-right {
            width: 100%;
            display: flex;
            justify-content: center;
        }
    }
}
</style>
