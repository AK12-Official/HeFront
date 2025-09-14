<template>
    <div class="roles-page">
        <!-- 头部信息 -->
        <el-card class="header-card" shadow="never">
            <div class="header-content">
                <div class="header-left">
                    <h3>角色管理</h3>
                    <p class="header-desc">管理系统角色及其权限配置</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加角色
                    </el-button>
                </div>
            </div>
        </el-card>

        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="never">
            <el-form inline>
                <el-form-item label="角色名称">
                    <el-input v-model="searchForm.name" placeholder="请输入角色名称" clearable style="width: 200px" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
                        <el-option label="启用" :value="1" />
                        <el-option label="禁用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 表格区域 -->
        <el-card class="table-card" shadow="never">
            <el-table v-loading="loading" :data="tableData" border stripe>
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" width="80" />
                <el-table-column prop="name" label="角色名称" width="200" />
                <el-table-column prop="description" label="描述" min-width="200" />
                <el-table-column prop="adminCount" label="用户数量" width="100" align="center" />
                <el-table-column prop="status" label="状态" width="100" align="center">
                    <template #default="{ row }">
                        <el-switch v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="handleStatusChange(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button type="primary" link size="small" @click="handlePermission(row)">
                            分配权限
                        </el-button>
                        <el-button type="danger" link size="small" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <div class="pagination-wrapper">
                <el-pagination v-model:current-page="pagination.current" v-model:page-size="pagination.size"
                    :page-sizes="[10, 20, 50, 100]" :total="pagination.total"
                    layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>

        <!-- 添加/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '添加角色'" width="600px"
            :before-close="handleDialogClose">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入角色名称" />
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入角色描述" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="formData.status">
                        <el-radio :value="1">启用</el-radio>
                        <el-radio :value="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 权限分配对话框 -->
        <el-dialog v-model="permissionDialogVisible" title="分配权限" width="800px"
            :before-close="handlePermissionDialogClose">
            <div v-if="currentRole" class="permission-content">
                <div class="permission-header">
                    <h4>为角色"{{ currentRole.name }}"分配权限</h4>
                </div>

                <el-tree ref="permissionTreeRef" :data="permissionTree" show-checkbox node-key="id"
                    :default-checked-keys="selectedPermissions" :props="treeProps" class="permission-tree">
                    <template #default="{ data }">
                        <span class="tree-node">
                            <el-icon v-if="data.icon" class="node-icon">
                                <component :is="data.icon" />
                            </el-icon>
                            <span>{{ data.name }}</span>
                        </span>
                    </template>
                </el-tree>
            </div>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="permissionDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handlePermissionSubmit" :loading="permissionSubmitting">
                        保存权限
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { malladmin } from '@/api'
import type { AdminRole, AdminRoleParams, AdminMenu, AdminResource } from '@/api/malladmin/types'

interface SearchForm {
    name: string
    status: number | null
}

interface PermissionNode {
    id: number
    name: string
    icon?: string
    children?: PermissionNode[]
}

const loading = ref(false)
const dialogVisible = ref(false)
const permissionDialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const permissionSubmitting = ref(false)

const formRef = ref()
const permissionTreeRef = ref()

// 搜索表单
const searchForm = reactive<SearchForm>({
    name: '',
    status: null
})

// 表格数据
const tableData = ref<AdminRole[]>([])

// 分页
const pagination = reactive({
    current: 1,
    size: 10,
    total: 0
})

// 表单数据
const formData = reactive<AdminRoleParams>({
    name: '',
    description: '',
    status: 1,
    sort: 0
})

// 当前角色（用于权限分配）
const currentRole = ref<AdminRole | null>(null)

// 已选权限
const selectedPermissions = ref<number[]>([])

// 权限树数据
const permissionTree = ref<PermissionNode[]>([])

// 树形组件配置
const treeProps = {
    children: 'children',
    label: 'name'
}

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入角色名称', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [
        { required: true, message: '请输入角色描述', trigger: 'blur' }
    ]
}

// 获取角色列表
const fetchRoles = async () => {
    loading.value = true
    try {
        const params = {
            pageNum: pagination.current,
            pageSize: pagination.size,
            keyword: searchForm.name || undefined
        }

        const result = await malladmin.getRoleList(params)

        if (result.code === 200) {
            let filteredRoles = result.data.list

            // 根据状态过滤
            if (searchForm.status !== null) {
                filteredRoles = filteredRoles.filter(role => role.status === searchForm.status)
            }

            tableData.value = filteredRoles
            pagination.total = result.data.total
        } else {
            ElMessage.error(result.message || '获取角色列表失败')
        }
    } catch (error) {
        console.error('获取角色列表失败:', error)
        ElMessage.error('获取角色列表失败')
    } finally {
        loading.value = false
    }
}

// 获取权限树
const fetchPermissionTree = async () => {
    try {
        // 调用真实API获取权限树数据
        const result = await malladmin.getAllResourceList()
        if (result.code === 200) {
            // 将资源列表转换为权限树结构
            const resources = result.data
            const treeMap = new Map()
            const tree: PermissionNode[] = []

            // 构建树形结构
            resources.forEach(resource => {
                const node: PermissionNode = {
                    id: resource.id,
                    name: resource.name,
                    icon: resource.icon || 'Setting',
                    children: []
                }
                treeMap.set(resource.id, node)
            })

            // 建立父子关系
            resources.forEach(resource => {
                if (resource.categoryId && treeMap.has(resource.categoryId)) {
                    treeMap.get(resource.categoryId).children.push(treeMap.get(resource.id))
                } else {
                    tree.push(treeMap.get(resource.id))
                }
            })

            permissionTree.value = tree
        } else {
            ElMessage.error(result.message || '获取权限树失败')
        }
    } catch (error) {
        console.error('获取权限树失败:', error)
    }
}

// 搜索
const handleSearch = () => {
    pagination.current = 1
    fetchRoles()
}

// 重置
const handleReset = () => {
    Object.assign(searchForm, {
        name: '',
        status: null
    })
    handleSearch()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
    pagination.size = size
    fetchRoles()
}

// 当前页变化
const handleCurrentChange = (page: number) => {
    pagination.current = page
    fetchRoles()
}

// 状态变化
const handleStatusChange = async (row: AdminRole) => {
    try {
        const result = await malladmin.updateRoleStatus(row.id, row.status)

        if (result.code === 200) {
            ElMessage.success('状态修改成功')
        } else {
            ElMessage.error(result.message || '状态修改失败')
            // 恢复原状态
            row.status = row.status === 1 ? 0 : 1
        }
    } catch (error) {
        console.error('状态修改失败:', error)
        ElMessage.error('状态修改失败')
        // 恢复原状态
        row.status = row.status === 1 ? 0 : 1
    }
}

// 添加角色
const handleAdd = () => {
    isEdit.value = false
    Object.assign(formData, {
        name: '',
        description: '',
        status: 1,
        sort: 0
    })
    dialogVisible.value = true
}

// 编辑角色
const handleEdit = (row: AdminRole) => {
    isEdit.value = true
    Object.assign(formData, {
        name: row.name,
        description: row.description || '',
        status: row.status,
        sort: row.sort || 0
    })
    dialogVisible.value = true
}

// 删除角色
const handleDelete = async (row: AdminRole) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除角色"${row.name}"吗？`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        const result = await malladmin.batchDeleteRole([row.id])
        if (result.code === 200) {
            ElMessage.success('删除成功')
            fetchRoles()
        } else {
            ElMessage.error(result.message || '删除失败')
        }
    } catch {
        // 用户取消操作
    }
}

// 分配权限
const handlePermission = async (row: AdminRole) => {
    currentRole.value = row

    // 获取角色已有权限
    try {
        const result = await malladmin.getRoleMenus(row.id)
        if (result.code === 200) {
            selectedPermissions.value = result.data.map(menu => menu.id)
        } else {
            selectedPermissions.value = []
        }
    } catch (error) {
        console.error('获取角色权限失败:', error)
        selectedPermissions.value = []
    }

    permissionDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()

        submitting.value = true

        // 调用真实API保存角色
        let result
        if (isEdit.value) {
            // 编辑角色 - 需要获取当前编辑的角色ID
            const currentRoleId = tableData.value.find(role =>
                role.name === formData.name && role.description === formData.description
            )?.id

            if (currentRoleId) {
                result = await malladmin.updateRole(currentRoleId, formData)
            } else {
                ElMessage.error('无法找到要编辑的角色')
                return
            }
        } else {
            result = await malladmin.createRole(formData)
        }

        if (result.code === 200) {
            ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
            dialogVisible.value = false
            fetchRoles()
        } else {
            ElMessage.error(result.message || '操作失败')
        }

    } catch (error) {
        console.error('操作失败:', error)
    } finally {
        submitting.value = false
    }
}

// 提交权限分配
const handlePermissionSubmit = async () => {
    try {
        permissionSubmitting.value = true

        // 获取选中的权限ID
        const checkedKeys = permissionTreeRef.value?.getCheckedKeys() || []
        const halfCheckedKeys = permissionTreeRef.value?.getHalfCheckedKeys() || []
        const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys]

        // 调用真实API分配权限
        const result = await malladmin.allocRoleMenus(currentRole.value!.id, allCheckedKeys)

        if (result.code === 200) {
            ElMessage.success('权限分配成功')
            permissionDialogVisible.value = false
        } else {
            ElMessage.error(result.message || '权限分配失败')
        }

    } catch (error) {
        console.error('权限分配失败:', error)
        ElMessage.error('权限分配失败')
    } finally {
        permissionSubmitting.value = false
    }
}

// 关闭对话框
const handleDialogClose = () => {
    formRef.value?.resetFields()
    dialogVisible.value = false
}

// 关闭权限对话框
const handlePermissionDialogClose = () => {
    currentRole.value = null
    selectedPermissions.value = []
    permissionDialogVisible.value = false
}

onMounted(() => {
    fetchRoles()
    fetchPermissionTree()
})
</script>

<style scoped>
.roles-page {
    padding: 20px;
}

.header-card,
.search-card,
.table-card {
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

.pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.permission-content {
    max-height: 500px;
    overflow-y: auto;
}

.permission-header {
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e4e7ed;
}

.permission-header h4 {
    margin: 0;
    color: #303133;
}

.permission-tree {
    background-color: #fafafa;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    padding: 12px;
}

.tree-node {
    display: flex;
    align-items: center;
    gap: 6px;
}

.node-icon {
    color: #409eff;
}

:deep(.el-tree-node__content) {
    height: 32px;
}

:deep(.el-tree-node__label) {
    font-size: 14px;
}
</style>
