<template>
  <div class="categories-page">
    <!-- 头部操作栏 -->
    <el-card class="header-card" shadow="never">
      <div class="header-content">
        <div class="header-left">
          <h3>商品分类管理</h3>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>
            添加分类
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 分类树形表格 -->
    <el-card class="table-card" shadow="never">
      <el-table v-loading="loading" :data="categoryList" row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :default-expand-all="false"
        style="width: 100%">
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <div class="category-name">
              <img v-if="row.icon" :src="row.icon" class="category-icon" />
              <span>{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="级别" width="80">
          <template #default="{ row }">
            <el-tag :type="row.level === 0 ? 'primary' : 'info'" size="small">
              {{ row.level === 0 ? '一级' : '二级' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="productCount" label="商品数量" width="100" />

        <el-table-column prop="productUnit" label="单位" width="80" />

        <el-table-column prop="sort" label="排序" width="80" />

        <el-table-column prop="showStatus" label="显示状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.showStatus" :active-value="1" :inactive-value="0"
              @change="handleStatusChange(row)" />
          </template>
        </el-table-column>

        <el-table-column prop="navStatus" label="导航状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.navStatus" :active-value="1" :inactive-value="0"
              @change="handleNavStatusChange(row)" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.level === 0" type="success" link size="small" @click="handleAddChild(row)">
              添加子级
            </el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px" :before-close="handleDialogClose">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px" class="category-form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="50" />
        </el-form-item>

        <el-form-item label="父级分类" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择父级分类" clearable style="width: 100%">
            <el-option label="顶级分类" :value="0" />
            <el-option v-for="category in parentOptions" :key="category.id" :label="category.name"
              :value="category.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="单位" prop="productUnit">
          <el-input v-model="form.productUnit" placeholder="如：件、个、台" maxlength="10" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="9999" placeholder="数值越大排序越靠前" style="width: 100%" />
        </el-form-item>

        <el-form-item label="分类图标">
          <el-upload class="icon-uploader" action="/api/minio/upload" :show-file-list="false"
            :on-success="handleIconSuccess" :before-upload="beforeUpload">
            <img v-if="form.icon" :src="form.icon" class="icon-preview" />
            <el-icon v-else class="icon-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸：64*64px</div>
        </el-form-item>

        <el-form-item label="关键词" prop="keywords">
          <el-input v-model="form.keywords" placeholder="用逗号分隔关键词" maxlength="200" />
        </el-form-item>

        <el-form-item label="分类描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入分类描述" maxlength="500" />
        </el-form-item>

        <el-row>
          <el-col :span="12">
            <el-form-item label="显示状态">
              <el-switch v-model="form.showStatus" :active-value="1" :inactive-value="0" active-text="显示"
                inactive-text="隐藏" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="导航状态">
              <el-switch v-model="form.navStatus" :active-value="1" :inactive-value="0" active-text="显示"
                inactive-text="隐藏" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            确定
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

interface Category {
  id: number
  parentId: number
  name: string
  level: number
  productCount: number
  productUnit: string
  navStatus: number
  showStatus: number
  sort: number
  icon?: string
  keywords?: string
  description?: string
  children?: Category[]
}

interface UploadResponse {
  code: number
  data: {
    url: string
    name: string
  }
}

const loading = ref(false)
const dialogVisible = ref(false)
const submitting = ref(false)
const formRef = ref()

// 表格数据
const categoryList = ref<Category[]>([])

// 对话框标题
const dialogTitle = ref('')

// 表单数据
const form = reactive({
  id: 0,
  parentId: 0,
  name: '',
  level: 0,
  productCount: 0,
  productUnit: '件',
  navStatus: 1,
  showStatus: 1,
  sort: 0,
  icon: '',
  keywords: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '分类名称长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  productUnit: [
    { required: true, message: '请输入单位', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { type: 'number', min: 0, message: '排序值不能小于0', trigger: 'blur' }
  ]
}

// 父级分类选项
const parentOptions = ref<Category[]>([])

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true
  try {
    // 这里应该调用实际的API
    const mockData: Category[] = [
      {
        id: 1,
        parentId: 0,
        name: '手机通讯',
        level: 0,
        productCount: 150,
        productUnit: '部',
        navStatus: 1,
        showStatus: 1,
        sort: 100,
        icon: 'https://picsum.photos/64/64?random=1',
        children: [
          {
            id: 101,
            parentId: 1,
            name: '智能手机',
            level: 1,
            productCount: 120,
            productUnit: '部',
            navStatus: 1,
            showStatus: 1,
            sort: 100
          },
          {
            id: 102,
            parentId: 1,
            name: '手机配件',
            level: 1,
            productCount: 30,
            productUnit: '个',
            navStatus: 1,
            showStatus: 1,
            sort: 90
          }
        ]
      },
      {
        id: 2,
        parentId: 0,
        name: '电脑办公',
        level: 0,
        productCount: 80,
        productUnit: '台',
        navStatus: 1,
        showStatus: 1,
        sort: 95,
        icon: 'https://picsum.photos/64/64?random=2',
        children: [
          {
            id: 201,
            parentId: 2,
            name: '笔记本电脑',
            level: 1,
            productCount: 50,
            productUnit: '台',
            navStatus: 1,
            showStatus: 1,
            sort: 100
          },
          {
            id: 202,
            parentId: 2,
            name: '台式机',
            level: 1,
            productCount: 30,
            productUnit: '台',
            navStatus: 1,
            showStatus: 1,
            sort: 90
          }
        ]
      }
    ]

    categoryList.value = mockData

    // 获取父级分类选项（只包含一级分类）
    parentOptions.value = mockData.filter(item => item.level === 0)
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  } finally {
    loading.value = false
  }
}

// 添加分类
const handleAdd = () => {
  resetForm()
  dialogTitle.value = '添加分类'
  dialogVisible.value = true
}

// 添加子级分类
const handleAddChild = (row: Category) => {
  resetForm()
  form.parentId = row.id
  form.level = row.level + 1
  dialogTitle.value = `添加子分类 - ${row.name}`
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: Category) => {
  Object.assign(form, {
    id: row.id,
    parentId: row.parentId,
    name: row.name,
    level: row.level,
    productCount: row.productCount,
    productUnit: row.productUnit,
    navStatus: row.navStatus,
    showStatus: row.showStatus,
    sort: row.sort,
    icon: row.icon || '',
    keywords: row.keywords || '',
    description: row.description || ''
  })
  dialogTitle.value = '编辑分类'
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    // 这里应该调用实际的删除API
    console.log('删除分类:', row.id)

    ElMessage.success('删除成功')
    fetchCategories()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // 用户取消操作
  }
}

// 显示状态切换
const handleStatusChange = async (row: Category) => {
  try {
    // 这里应该调用实际的API
    console.log('切换显示状态:', row.id, row.showStatus)
    ElMessage.success('状态更新成功')
  } catch (error) {
    console.error('状态更新失败:', error)
    ElMessage.error('状态更新失败')
    // 回滚状态
    row.showStatus = row.showStatus === 1 ? 0 : 1
  }
}

// 导航状态切换
const handleNavStatusChange = async (row: Category) => {
  try {
    // 这里应该调用实际的API
    console.log('切换导航状态:', row.id, row.navStatus)
    ElMessage.success('导航状态更新成功')
  } catch (error) {
    console.error('导航状态更新失败:', error)
    ElMessage.error('导航状态更新失败')
    // 回滚状态
    row.navStatus = row.navStatus === 1 ? 0 : 1
  }
}

// 图标上传成功回调
const handleIconSuccess = (response: UploadResponse) => {
  if (response.code === 200) {
    form.icon = response.data.url
    ElMessage.success('图标上传成功')
  } else {
    ElMessage.error('图标上传失败')
  }
}

// 上传前校验
const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt1M = file.size / 1024 / 1024 < 1

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt1M) {
    ElMessage.error('上传图片大小不能超过 1MB!')
    return false
  }
  return true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    submitting.value = true

    // 设置级别
    if (form.parentId === 0) {
      form.level = 0
    } else {
      form.level = 1
    }

    // 这里应该调用实际的API
    if (form.id) {
      console.log('更新分类:', form)
    } else {
      console.log('创建分类:', form)
    }

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(form.id ? '更新成功' : '创建成功')
    dialogVisible.value = false
    fetchCategories()
  } catch (error) {
    console.error('操作失败:', error)
  } finally {
    submitting.value = false
  }
}

// 关闭对话框
const handleDialogClose = () => {
  dialogVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: 0,
    parentId: 0,
    name: '',
    level: 0,
    productCount: 0,
    productUnit: '件',
    navStatus: 1,
    showStatus: 1,
    sort: 0,
    icon: '',
    keywords: '',
    description: ''
  })

  if (formRef.value) {
    formRef.value.clearValidate()
  }
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.categories-page {
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
  margin: 0;
  color: #303133;
}

.table-card {
  border-radius: 8px;
}

.category-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  object-fit: cover;
}

.category-form {
  padding: 0 20px;
}

.icon-uploader {
  display: inline-block;
}

.icon-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-uploader :deep(.el-upload:hover) {
  border-color: #409eff;
}

.icon-uploader-icon {
  font-size: 24px;
  color: #8c939d;
}

.icon-preview {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
