<template>
    <div class="product-edit-page">
        <!-- 头部信息 -->
        <el-card class="header-card" shadow="never">
            <div class="header-content">
                <div class="header-left">
                    <h3>编辑商品</h3>
                    <p class="header-desc">修改商品的基本信息、价格、库存等</p>
                </div>
                <div class="header-right">
                    <el-button @click="goBack">返回</el-button>
                    <el-button type="primary" @click="handleSave" :loading="saving">
                        保存修改
                    </el-button>
                </div>
            </div>
        </el-card>

        <div v-loading="loading" class="form-container">
            <!-- 基本信息 -->
            <el-card class="form-card" shadow="never">
                <template #header>
                    <span>基本信息</span>
                </template>

                <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="商品名称" prop="name">
                                <el-input v-model="formData.name" placeholder="请输入商品名称" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品副标题" prop="subTitle">
                                <el-input v-model="formData.subTitle" placeholder="请输入商品副标题" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="商品分类" prop="productCategoryId">
                                <el-cascader v-model="formData.productCategoryId" :options="categoryOptions" :props="{
                                    value: 'id',
                                    label: 'name',
                                    children: 'children',
                                    checkStrictly: true
                                }" placeholder="请选择商品分类" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品品牌" prop="brandId">
                                <el-select v-model="formData.brandId" placeholder="请选择商品品牌" style="width: 100%">
                                    <el-option v-for="brand in brandOptions" :key="brand.id" :label="brand.name"
                                        :value="brand.id" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="商品描述" prop="description">
                        <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
                    </el-form-item>
                </el-form>
            </el-card>

            <!-- 商品图片 -->
            <el-card class="form-card" shadow="never">
                <template #header>
                    <span>商品图片</span>
                </template>

                <div class="image-section">
                    <div class="image-item">
                        <label>主图片：</label>
                        <el-upload class="avatar-uploader" action="/api/minio/upload" :show-file-list="false"
                            :on-success="handleMainImageSuccess" :before-upload="beforeImageUpload">
                            <img v-if="formData.pic" :src="formData.pic" class="avatar" alt="主图片" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </div>

                    <div class="image-item">
                        <label>相册图片：</label>
                        <el-upload class="gallery-uploader" action="/api/minio/upload" list-type="picture-card"
                            v-model:file-list="galleryFileList" :on-success="handleGallerySuccess"
                            :before-upload="beforeImageUpload" :on-remove="handleGalleryRemove" multiple>
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </div>
                </div>
            </el-card>

            <!-- 价格库存 -->
            <el-card class="form-card" shadow="never">
                <template #header>
                    <span>价格库存</span>
                </template>

                <el-form :model="formData" label-width="120px">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="销售价格" prop="price">
                                <el-input-number v-model="formData.price" :precision="2" :min="0" style="width: 100%"
                                    placeholder="0.00" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="市场价格" prop="originalPrice">
                                <el-input-number v-model="formData.originalPrice" :precision="2" :min="0"
                                    style="width: 100%" placeholder="0.00" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="库存数量" prop="stock">
                                <el-input-number v-model="formData.stock" :min="0" style="width: 100%"
                                    placeholder="0" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="库存预警值" prop="lowStock">
                                <el-input-number v-model="formData.lowStock" :min="0" style="width: 100%"
                                    placeholder="0" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="单位" prop="unit">
                                <el-input v-model="formData.unit" placeholder="如：件、个、套" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="重量" prop="weight">
                                <el-input-number v-model="formData.weight" :precision="2" :min="0" style="width: 100%"
                                    placeholder="0.00" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <!-- 商品属性 -->
            <el-card class="form-card" shadow="never">
                <template #header>
                    <div class="card-header">
                        <span>商品属性</span>
                        <el-button type="primary" size="small" @click="addAttribute">
                            添加属性
                        </el-button>
                    </div>
                </template>

                <div class="attributes-list">
                    <div v-for="(attr, index) in formData.productAttributeValueList" :key="index"
                        class="attribute-item">
                        <el-input v-model="attr.productAttributeId" placeholder="属性名"
                            style="width: 200px; margin-right: 12px" />
                        <el-input v-model="attr.value" placeholder="属性值" style="width: 200px; margin-right: 12px" />
                        <el-button type="danger" size="small" @click="removeAttribute(index)">
                            删除
                        </el-button>
                    </div>
                </div>
            </el-card>

            <!-- 商品状态 -->
            <el-card class="form-card" shadow="never">
                <template #header>
                    <span>商品状态</span>
                </template>

                <el-form :model="formData" label-width="120px">
                    <el-row :gutter="24">
                        <el-col :span="8">
                            <el-form-item label="商品状态">
                                <el-radio-group v-model="formData.publishStatus">
                                    <el-radio :value="1">上架</el-radio>
                                    <el-radio :value="0">下架</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="新品状态">
                                <el-switch v-model="formData.newStatus" :active-value="1" :inactive-value="0" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="推荐状态">
                                <el-switch v-model="formData.recommendStatus" :active-value="1" :inactive-value="0" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="24">
                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="formData.sort" :min="0" style="width: 100%" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="商品服务">
                                <el-input v-model="formData.serviceIds" placeholder="请输入服务ID，多个用逗号分隔" />
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-form-item label="详情描述">
                        <el-input v-model="formData.detailDesc" type="textarea" :rows="6" placeholder="请输入商品详情描述" />
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

interface ProductAttributeValue {
    productAttributeId: string
    value: string
}

interface ProductForm {
    id?: number
    name: string
    subTitle: string
    productCategoryId: number | null
    brandId: number | null
    description: string
    pic: string
    albumPics: string
    price: number
    originalPrice: number
    stock: number
    lowStock: number
    unit: string
    weight: number
    publishStatus: number
    newStatus: number
    recommendStatus: number
    sort: number
    serviceIds: string
    detailDesc: string
    productAttributeValueList: ProductAttributeValue[]
}

interface CategoryOption {
    id: number
    name: string
    children?: CategoryOption[]
}

interface BrandOption {
    id: number
    name: string
}

interface UploadResponse {
    code: number
    data: {
        url: string
    }
}

interface FileItem {
    url: string
}

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const saving = ref(false)
const formRef = ref()

// 表单数据
const formData = reactive<ProductForm>({
    name: '',
    subTitle: '',
    productCategoryId: null,
    brandId: null,
    description: '',
    pic: '',
    albumPics: '',
    price: 0,
    originalPrice: 0,
    stock: 0,
    lowStock: 0,
    unit: '件',
    weight: 0,
    publishStatus: 1,
    newStatus: 0,
    recommendStatus: 0,
    sort: 0,
    serviceIds: '',
    detailDesc: '',
    productAttributeValueList: []
})

// 图片相册文件列表
const galleryFileList = ref<FileItem[]>([])

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    productCategoryId: [
        { required: true, message: '请选择商品分类', trigger: 'change' }
    ],
    brandId: [
        { required: true, message: '请选择商品品牌', trigger: 'change' }
    ],
    price: [
        { required: true, message: '请输入销售价格', trigger: 'blur' }
    ],
    stock: [
        { required: true, message: '请输入库存数量', trigger: 'blur' }
    ]
}

// 分类选项
const categoryOptions = ref<CategoryOption[]>([])

// 品牌选项
const brandOptions = ref<BrandOption[]>([])

// 获取商品详情
const fetchProductDetail = async () => {
    const productId = route.params.id
    if (!productId) {
        ElMessage.error('商品ID不能为空')
        goBack()
        return
    }

    try {
        // 模拟数据
        const mockProduct = {
            id: 1,
            name: 'iPhone 14 Pro',
            subTitle: '灵动岛，是个好创意',
            productCategoryId: 19,
            brandId: 1,
            description: 'Apple iPhone 14 Pro，搭载A16仿生芯片',
            pic: 'https://picsum.photos/300/300?random=1',
            albumPics: 'https://picsum.photos/300/300?random=2,https://picsum.photos/300/300?random=3',
            price: 7999.00,
            originalPrice: 8999.00,
            stock: 100,
            lowStock: 10,
            unit: '台',
            weight: 0.5,
            publishStatus: 1,
            newStatus: 1,
            recommendStatus: 1,
            sort: 1,
            serviceIds: '1,2,3',
            detailDesc: '详细的商品描述信息...',
            productAttributeValueList: [
                { productAttributeId: '颜色', value: '深空黑色' },
                { productAttributeId: '容量', value: '128GB' }
            ]
        }

        // 填充表单数据
        Object.assign(formData, mockProduct)

        // 处理相册图片
        if (mockProduct.albumPics) {
            galleryFileList.value = mockProduct.albumPics.split(',').map(url => ({ url }))
        }

    } catch (error) {
        console.error('获取商品详情失败:', error)
        ElMessage.error('获取商品详情失败')
    } finally {
        loading.value = false
    }
}

// 获取分类列表
const fetchCategories = async () => {
    try {
        // 模拟数据
        const mockCategories = [
            {
                id: 1,
                name: '服装',
                children: [
                    { id: 19, name: '外套' },
                    { id: 20, name: 'T恤' }
                ]
            },
            {
                id: 2,
                name: '手机数码',
                children: [
                    { id: 7, name: '手机通讯' },
                    { id: 8, name: '数码配件' }
                ]
            }
        ]
        categoryOptions.value = mockCategories
    } catch (error) {
        console.error('获取分类列表失败:', error)
    }
}

// 获取品牌列表
const fetchBrands = async () => {
    try {
        // 模拟数据
        const mockBrands = [
            { id: 1, name: '苹果' },
            { id: 2, name: '华为' },
            { id: 3, name: '小米' },
            { id: 49, name: '优衣库' },
            { id: 50, name: 'ZARA' }
        ]
        brandOptions.value = mockBrands
    } catch (error) {
        console.error('获取品牌列表失败:', error)
    }
}

// 主图片上传成功
const handleMainImageSuccess = (response: UploadResponse) => {
    if (response.code === 200) {
        formData.pic = response.data.url
        ElMessage.success('主图片上传成功')
    } else {
        ElMessage.error('主图片上传失败')
    }
}

// 相册图片上传成功
const handleGallerySuccess = (response: UploadResponse, file: FileItem) => {
    if (response.code === 200) {
        file.url = response.data.url
        updateAlbumPics()
        ElMessage.success('相册图片上传成功')
    } else {
        ElMessage.error('相册图片上传失败')
    }
}

// 移除相册图片
const handleGalleryRemove = (file: FileItem, fileList: FileItem[]) => {
    galleryFileList.value = fileList
    updateAlbumPics()
}

// 更新相册图片字符串
const updateAlbumPics = () => {
    formData.albumPics = galleryFileList.value.map(item => item.url).join(',')
}

// 图片上传前校验
const beforeImageUpload = (file: File) => {
    const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传图片大小不能超过 2MB!')
        return false
    }
    return true
}

// 添加属性
const addAttribute = () => {
    formData.productAttributeValueList.push({
        productAttributeId: '',
        value: ''
    })
}

// 移除属性
const removeAttribute = (index: number) => {
    formData.productAttributeValueList.splice(index, 1)
}

// 保存商品
const handleSave = async () => {
    try {
        await formRef.value?.validate()

        saving.value = true

        // 这里应该调用实际的保存API
        console.log('保存商品数据:', formData)

        // 模拟请求
        await new Promise(resolve => setTimeout(resolve, 1000))

        ElMessage.success('保存成功')
        goBack()

    } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('保存失败')
    } finally {
        saving.value = false
    }
}

// 返回
const goBack = () => {
    router.push('/mall/admin/products')
}

onMounted(async () => {
    await Promise.all([
        fetchCategories(),
        fetchBrands(),
        fetchProductDetail()
    ])
})
</script>

<style scoped>
.product-edit-page {
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

.form-container {
    min-height: 400px;
}

.form-card {
    margin-bottom: 20px;
    border-radius: 8px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.image-section {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.image-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.image-item label {
    font-weight: 500;
    color: #303133;
}

.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
}

.avatar-uploader:hover {
    border-color: #409eff;
}

.avatar {
    width: 148px;
    height: 148px;
    display: block;
    object-fit: cover;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    text-align: center;
    line-height: 148px;
}

.gallery-uploader {
    display: inline-block;
}

.attributes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.attribute-item {
    display: flex;
    align-items: center;
}

:deep(.el-upload-list--picture-card) {
    display: inline-block;
}

:deep(.el-upload--picture-card) {
    width: 148px;
    height: 148px;
}
</style>
