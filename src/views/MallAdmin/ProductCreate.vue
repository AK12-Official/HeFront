<template>
    <div class="product-create">
        <el-card class="page-card">
            <template #header>
                <div class="card-header">
                    <span>添加商品</span>
                    <div class="card-actions">
                        <el-button @click="handleBack">返回</el-button>
                        <el-button type="primary" @click="handleSubmit" :loading="submitting">保存</el-button>
                    </div>
                </div>
            </template>

            <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="product-form">
                <!-- 基本信息 -->
                <el-card class="form-section" shadow="never">
                    <template #header>基本信息</template>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="商品名称" prop="name">
                                <el-input v-model="form.name" placeholder="请输入商品名称" maxlength="100" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品货号" prop="productSn">
                                <el-input v-model="form.productSn" placeholder="请输入商品货号" maxlength="50" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="商品分类" prop="productCategoryId">
                                <el-cascader v-model="form.productCategoryId" :options="categoryOptions"
                                    :props="{ value: 'id', label: 'name', children: 'children' }" placeholder="请选择商品分类"
                                    clearable style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品品牌" prop="brandId">
                                <el-select v-model="form.brandId" placeholder="请选择商品品牌" clearable style="width: 100%">
                                    <el-option v-for="brand in brandOptions" :key="brand.id" :label="brand.name"
                                        :value="brand.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="商品副标题" prop="subTitle">
                        <el-input v-model="form.subTitle" placeholder="请输入商品副标题" maxlength="200" />
                    </el-form-item>

                    <el-form-item label="商品描述" prop="description">
                        <el-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商品描述"
                            maxlength="500" />
                    </el-form-item>
                </el-card>

                <!-- 商品图片 -->
                <el-card class="form-section" shadow="never">
                    <template #header>商品图片</template>

                    <el-form-item label="商品主图" prop="pic">
                        <div class="image-upload">
                            <el-upload class="main-pic-uploader" action="/api/minio/upload" :show-file-list="false"
                                :on-success="handleMainPicSuccess" :before-upload="beforeUpload">
                                <img v-if="form.pic" :src="form.pic" class="main-pic" />
                                <el-icon v-else class="main-pic-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <div class="upload-tip">建议尺寸：800*800px，格式：jpg、png</div>
                        </div>
                    </el-form-item>

                    <el-form-item label="商品相册">
                        <el-upload v-model:file-list="albumPicList" action="/api/minio/upload" list-type="picture-card"
                            :on-success="handleAlbumPicSuccess" :before-upload="beforeUpload" :limit="5">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                        <div class="upload-tip">最多上传5张图片，建议尺寸：800*800px</div>
                    </el-form-item>
                </el-card>

                <!-- 价格库存 -->
                <el-card class="form-section" shadow="never">
                    <template #header>价格库存</template>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品价格" prop="price">
                                <el-input-number v-model="form.price" :min="0" :precision="2" placeholder="0.00"
                                    style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="促销价格" prop="promotionPrice">
                                <el-input-number v-model="form.promotionPrice" :min="0" :precision="2"
                                    placeholder="0.00" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="原价" prop="originalPrice">
                                <el-input-number v-model="form.originalPrice" :min="0" :precision="2" placeholder="0.00"
                                    style="width: 100%" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品库存" prop="stock">
                                <el-input-number v-model="form.stock" :min="0" placeholder="0" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存预警值" prop="lowStock">
                                <el-input-number v-model="form.lowStock" :min="0" placeholder="0" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位" prop="unit">
                                <el-input v-model="form.unit" placeholder="件/个/台" maxlength="10" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="商品重量" prop="weight">
                                <el-input-number v-model="form.weight" :min="0" :precision="2" placeholder="0.00"
                                    style="width: 100%" />
                                <span style="margin-left: 8px;">kg</span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="排序" prop="sort">
                                <el-input-number v-model="form.sort" :min="0" placeholder="0" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <!-- 商品状态 -->
                <el-card class="form-section" shadow="never">
                    <template #header>商品状态</template>

                    <el-row :gutter="20">
                        <el-col :span="6">
                            <el-form-item label="上架状态">
                                <el-switch v-model="form.publishStatus" :active-value="1" :inactive-value="0"
                                    active-text="上架" inactive-text="下架" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="新品状态">
                                <el-switch v-model="form.newStatus" :active-value="1" :inactive-value="0"
                                    active-text="新品" inactive-text="普通" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="推荐状态">
                                <el-switch v-model="form.recommandStatus" :active-value="1" :inactive-value="0"
                                    active-text="推荐" inactive-text="普通" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="预览状态">
                                <el-switch v-model="form.previewStatus" :active-value="1" :inactive-value="0"
                                    active-text="启用" inactive-text="禁用" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>

                <!-- 其他信息 -->
                <el-card class="form-section" shadow="never">
                    <template #header>其他信息</template>

                    <el-form-item label="商品关键词" prop="keywords">
                        <el-input v-model="form.keywords" placeholder="用逗号分隔关键词" maxlength="200" />
                    </el-form-item>

                    <el-form-item label="商品备注" prop="note">
                        <el-input v-model="form.note" type="textarea" :rows="3" placeholder="请输入商品备注" maxlength="200" />
                    </el-form-item>
                </el-card>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

interface Category {
    id: number
    name: string
    children?: Category[]
}

interface Brand {
    id: number
    name: string
}

interface UploadResponse {
    code: number
    data: {
        url: string
        name: string
    }
}

const router = useRouter()
const formRef = ref()
const submitting = ref(false)

// 表单数据
const form = reactive({
    name: '',
    productSn: '',
    productCategoryId: null,
    brandId: null,
    subTitle: '',
    description: '',
    pic: '',
    albumPics: '',
    price: 0,
    promotionPrice: 0,
    originalPrice: 0,
    stock: 0,
    lowStock: 0,
    unit: '件',
    weight: 0,
    sort: 0,
    publishStatus: 1,
    newStatus: 0,
    recommandStatus: 0,
    previewStatus: 1,
    keywords: '',
    note: '',
    deleteStatus: 0,
    verifyStatus: 0
})

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 100, message: '商品名称长度在 2 到 100 个字符', trigger: 'blur' }
    ],
    productSn: [
        { required: true, message: '请输入商品货号', trigger: 'blur' }
    ],
    productCategoryId: [
        { required: true, message: '请选择商品分类', trigger: 'change' }
    ],
    brandId: [
        { required: true, message: '请选择商品品牌', trigger: 'change' }
    ],
    price: [
        { required: true, message: '请输入商品价格', trigger: 'blur' },
        { type: 'number', min: 0.01, message: '商品价格必须大于0', trigger: 'blur' }
    ],
    stock: [
        { required: true, message: '请输入商品库存', trigger: 'blur' },
        { type: 'number', min: 0, message: '商品库存不能小于0', trigger: 'blur' }
    ]
}

// 分类选项
const categoryOptions = ref<Category[]>([])
// 品牌选项
const brandOptions = ref<Brand[]>([])
// 相册图片列表
const albumPicList = ref([])

// 获取分类列表
const fetchCategories = async () => {
    try {
        // 这里应该调用实际的API
        categoryOptions.value = [
            {
                id: 1,
                name: '手机通讯',
                children: [
                    { id: 101, name: '智能手机' },
                    { id: 102, name: '手机配件' }
                ]
            },
            {
                id: 2,
                name: '电脑办公',
                children: [
                    { id: 201, name: '笔记本电脑' },
                    { id: 202, name: '台式机' }
                ]
            }
        ]
    } catch (error) {
        console.error('获取分类列表失败:', error)
    }
}

// 获取品牌列表
const fetchBrands = async () => {
    try {
        // 这里应该调用实际的API
        brandOptions.value = [
            { id: 1, name: 'Apple' },
            { id: 2, name: '小米' },
            { id: 3, name: 'OPPO' },
            { id: 4, name: 'vivo' }
        ]
    } catch (error) {
        console.error('获取品牌列表失败:', error)
    }
}

// 主图上传成功回调
const handleMainPicSuccess = (response: UploadResponse) => {
    if (response.code === 200) {
        form.pic = response.data.url
        ElMessage.success('主图上传成功')
    } else {
        ElMessage.error('主图上传失败')
    }
}

// 相册图片上传成功回调
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleAlbumPicSuccess = (response: UploadResponse, file: any, fileList: any[]) => {
    if (response.code === 200) {
        // 更新相册图片URL
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const urls = fileList.map((item: any) => {
            if (item.response && item.response.code === 200) {
                return item.response.data.url
            }
            return item.url
        }).filter(Boolean)
        form.albumPics = urls.join(',')
        ElMessage.success('相册图片上传成功')
    } else {
        ElMessage.error('相册图片上传失败')
    }
}

// 上传前校验
const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!')
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

        // 这里应该调用实际的创建商品API
        console.log('创建商品:', form)

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        ElMessage.success('商品创建成功')
        router.push('/mall/admin/products')
    } catch (error) {
        console.error('创建商品失败:', error)
        ElMessage.error('创建商品失败')
    } finally {
        submitting.value = false
    }
}

// 返回列表
const handleBack = () => {
    ElMessageBox.confirm(
        '确定要离开吗？未保存的数据将会丢失。',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(() => {
        router.push('/mall/admin/products')
    }).catch(() => {
        // 取消操作
    })
}

onMounted(() => {
    fetchCategories()
    fetchBrands()
})
</script>

<style scoped>
.product-create {
    padding: 20px;
}

.page-card {
    border-radius: 8px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-actions {
    display: flex;
    gap: 12px;
}

.product-form {
    max-width: 1200px;
}

.form-section {
    margin-bottom: 20px;
    border: 1px solid #e4e7ed;
}

.form-section :deep(.el-card__header) {
    background-color: #f5f7fa;
    font-weight: 600;
}

.image-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.main-pic-uploader {
    margin-bottom: 8px;
}

.main-pic-uploader :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.main-pic-uploader :deep(.el-upload:hover) {
    border-color: #409eff;
}

.main-pic-uploader-icon {
    font-size: 28px;
    color: #8c939d;
}

.main-pic {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border-radius: 6px;
}

.upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
}

:deep(.el-upload-list--picture-card) {
    --el-upload-list-picture-card-size: 120px;
}
</style>
