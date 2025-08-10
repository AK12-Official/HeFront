<template>
    <div class="resources-page">
        <!-- 头部信息 -->
        <el-card class="header-card" shadow="never">
            <div class="header-content">
                <div class="header-left">
                    <h3>资源管理</h3>
                    <p class="header-desc">管理系统菜单、按钮等权限资源</p>
                </div>
                <div class="header-right">
                    <el-button type="primary" @click="handleAdd">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        添加资源
                    </el-button>
                </div>
            </div>
        </el-card>

        <!-- 搜索区域 -->
        <el-card class="search-card" shadow="never">
            <el-form inline>
                <el-form-item label="资源名称">
                    <el-input v-model="searchForm.name" placeholder="请输入资源名称" clearable style="width: 200px" />
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select v-model="searchForm.categoryId" placeholder="请选择类型" clearable style="width: 150px">
                        <el-option label="菜单" :value="1" />
                        <el-option label="按钮" :value="2" />
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
            <el-table v-loading="loading" :data="tableData" border stripe row-key="id"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="name" label="资源名称" width="200" />
                <el-table-column prop="url" label="资源路径" min-width="250" />
                <el-table-column prop="categoryId" label="资源类型" width="100" align="center">
                    <template #default="{ row }">
                        <el-tag :type="row.categoryId === 1 ? 'primary' : 'success'">
                            {{ row.categoryId === 1 ? '菜单' : '按钮' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="description" label="描述" min-width="200" />
                <el-table-column prop="sort" label="排序" width="80" align="center" />
                <el-table-column prop="createTime" label="创建时间" width="180" />
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link size="small" @click="handleEdit(row)">
                            编辑
                        </el-button>
                        <el-button v-if="row.categoryId === 1" type="primary" link size="small"
                            @click="handleAddChild(row)">
                            添加子资源
                        </el-button>
                        <el-button type="danger" link size="small" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加/编辑对话框 -->
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :before-close="handleDialogClose">
            <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px">
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model="formData.name" placeholder="请输入资源名称" />
                </el-form-item>

                <el-form-item label="资源类型" prop="categoryId">
                    <el-radio-group v-model="formData.categoryId">
                        <el-radio :value="1">菜单</el-radio>
                        <el-radio :value="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item v-if="!isEdit || formData.parentId === 0" label="父级资源" prop="parentId">
                    <el-cascader v-model="parentPath" :options="parentOptions" :props="{
                        value: 'id',
                        label: 'name',
                        children: 'children',
                        checkStrictly: true,
                        emitPath: false
                    }" placeholder="请选择父级资源（可为空）" clearable style="width: 100%" @change="handleParentChange" />
                </el-form-item>

                <el-form-item label="资源路径" prop="url">
                    <el-input v-model="formData.url" placeholder="请输入资源路径，如：/mall/product" />
                </el-form-item>

                <el-form-item label="描述">
                    <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入资源描述" />
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
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface Resource {
    id: number
    name: string
    url: string
    categoryId: number
    description: string
    sort: number
    parentId: number
    createTime: string
    children?: Resource[]
}

interface ResourceForm {
    id?: number
    name: string
    url: string
    categoryId: number
    description: string
    sort: number
    parentId: number
}

interface SearchForm {
    name: string
    categoryId: number | null
}

interface ParentOption {
    id: number
    name: string
    children?: ParentOption[]
}

const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const parentAddMode = ref(false)
const parentResource = ref<Resource | null>(null)

const formRef = ref()

// 搜索表单
const searchForm = reactive<SearchForm>({
    name: '',
    categoryId: null
})

// 表格数据
const tableData = ref<Resource[]>([])

// 所有资源数据（用于构建父级选项）
const allResources = ref<Resource[]>([])

// 表单数据
const formData = reactive<ResourceForm>({
    name: '',
    url: '',
    categoryId: 1,
    description: '',
    sort: 0,
    parentId: 0
})

// 父级路径（用于级联选择器）
const parentPath = ref<number[]>([])

// 对话框标题
const dialogTitle = computed(() => {
    if (parentAddMode.value) {
        return `为"${parentResource.value?.name}"添加子资源`
    }
    return isEdit.value ? '编辑资源' : '添加资源'
})

// 父级资源选项
const parentOptions = computed(() => {
    const buildOptions = (resources: Resource[]): ParentOption[] => {
        return resources
            .filter(item => item.categoryId === 1) // 只有菜单可以作为父级
            .map(item => ({
                id: item.id,
                name: item.name,
                children: item.children ? buildOptions(item.children) : undefined
            }))
    }

    return buildOptions(allResources.value)
})

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入资源名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择资源类型', trigger: 'change' }
    ],
    url: [
        { required: true, message: '请输入资源路径', trigger: 'blur' }
    ]
}

// 获取资源列表
const fetchResources = async () => {
    loading.value = true
    try {
        // 模拟数据
        const mockResources: Resource[] = [
            {
                id: 1,
                name: '商品管理',
                url: '/mall/product',
                categoryId: 1,
                description: '商品相关功能管理',
                sort: 1,
                parentId: 0,
                createTime: '2025-08-10 10:00:00',
                children: [
                    {
                        id: 11,
                        name: '商品列表',
                        url: '/mall/product/list',
                        categoryId: 1,
                        description: '查看商品列表',
                        sort: 1,
                        parentId: 1,
                        createTime: '2025-08-10 10:01:00'
                    },
                    {
                        id: 12,
                        name: '添加商品',
                        url: '/mall/product/create',
                        categoryId: 2,
                        description: '添加新商品',
                        sort: 2,
                        parentId: 1,
                        createTime: '2025-08-10 10:02:00'
                    },
                    {
                        id: 13,
                        name: '编辑商品',
                        url: '/mall/product/edit',
                        categoryId: 2,
                        description: '编辑商品信息',
                        sort: 3,
                        parentId: 1,
                        createTime: '2025-08-10 10:03:00'
                    },
                    {
                        id: 14,
                        name: '删除商品',
                        url: '/mall/product/delete',
                        categoryId: 2,
                        description: '删除商品',
                        sort: 4,
                        parentId: 1,
                        createTime: '2025-08-10 10:04:00'
                    }
                ]
            },
            {
                id: 2,
                name: '订单管理',
                url: '/mall/order',
                categoryId: 1,
                description: '订单相关功能管理',
                sort: 2,
                parentId: 0,
                createTime: '2025-08-10 10:05:00',
                children: [
                    {
                        id: 21,
                        name: '订单列表',
                        url: '/mall/order/list',
                        categoryId: 1,
                        description: '查看订单列表',
                        sort: 1,
                        parentId: 2,
                        createTime: '2025-08-10 10:06:00'
                    },
                    {
                        id: 22,
                        name: '订单详情',
                        url: '/mall/order/detail',
                        categoryId: 2,
                        description: '查看订单详情',
                        sort: 2,
                        parentId: 2,
                        createTime: '2025-08-10 10:07:00'
                    }
                ]
            },
            {
                id: 3,
                name: '用户管理',
                url: '/mall/user',
                categoryId: 1,
                description: '用户相关功能管理',
                sort: 3,
                parentId: 0,
                createTime: '2025-08-10 10:08:00'
            }
        ]

        allResources.value = mockResources

        // 根据搜索条件过滤
        let filteredResources = mockResources
        if (searchForm.name || searchForm.categoryId !== null) {
            // 扁平化所有资源用于搜索
            const flattenResources = (resources: Resource[]): Resource[] => {
                const result: Resource[] = []
                resources.forEach(resource => {
                    result.push(resource)
                    if (resource.children) {
                        result.push(...flattenResources(resource.children))
                    }
                })
                return result
            }

            const flatResources = flattenResources(mockResources)
            filteredResources = flatResources.filter(resource => {
                let match = true
                if (searchForm.name) {
                    match = match && resource.name.includes(searchForm.name)
                }
                if (searchForm.categoryId !== null) {
                    match = match && resource.categoryId === searchForm.categoryId
                }
                return match
            })

            // 如果是搜索结果，显示扁平列表
            tableData.value = filteredResources.map(item => ({ ...item, children: undefined }))
        } else {
            // 否则显示树形结构
            tableData.value = filteredResources
        }

    } catch (error) {
        console.error('获取资源列表失败:', error)
        ElMessage.error('获取资源列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    fetchResources()
}

// 重置
const handleReset = () => {
    Object.assign(searchForm, {
        name: '',
        categoryId: null
    })
    fetchResources()
}

// 添加资源
const handleAdd = () => {
    isEdit.value = false
    parentAddMode.value = false
    parentResource.value = null
    resetForm()
    dialogVisible.value = true
}

// 添加子资源
const handleAddChild = (row: Resource) => {
    isEdit.value = false
    parentAddMode.value = true
    parentResource.value = row
    resetForm()
    formData.parentId = row.id
    formData.categoryId = 2 // 子资源默认为按钮类型
    dialogVisible.value = true
}

// 编辑资源
const handleEdit = (row: Resource) => {
    isEdit.value = true
    parentAddMode.value = false
    parentResource.value = null
    Object.assign(formData, row)

    // 设置父级路径
    if (row.parentId > 0) {
        parentPath.value = [row.parentId]
    } else {
        parentPath.value = []
    }

    dialogVisible.value = true
}

// 删除资源
const handleDelete = async (row: Resource) => {
    try {
        await ElMessageBox.confirm(
            `确定要删除资源"${row.name}"吗？删除后将无法恢复。`,
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        // 这里应该调用实际的删除API
        console.log('删除资源:', row.id)

        ElMessage.success('删除成功')
        fetchResources()
    } catch {
        // 用户取消操作
    }
}

// 父级选择变化
const handleParentChange = (value: number) => {
    formData.parentId = value || 0
}

// 提交表单
const handleSubmit = async () => {
    try {
        await formRef.value?.validate()

        submitting.value = true

        // 这里应该调用实际的API
        console.log('保存资源:', formData)

        // 模拟请求
        await new Promise(resolve => setTimeout(resolve, 1000))

        ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
        dialogVisible.value = false
        fetchResources()

    } catch (error) {
        console.error('操作失败:', error)
    } finally {
        submitting.value = false
    }
}

// 重置表单
const resetForm = () => {
    Object.assign(formData, {
        name: '',
        url: '',
        categoryId: 1,
        description: '',
        sort: 0,
        parentId: 0
    })
    parentPath.value = []
}

// 关闭对话框
const handleDialogClose = () => {
    formRef.value?.resetFields()
    resetForm()
    dialogVisible.value = false
}

onMounted(() => {
    fetchResources()
})
</script>

<style scoped>
.resources-page {
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

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

:deep(.el-table .el-table__cell) {
    padding: 8px 0;
}

:deep(.el-table__expand-icon) {
    color: #409eff;
}
</style>
