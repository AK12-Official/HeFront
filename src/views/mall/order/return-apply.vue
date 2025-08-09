<!-- 退货申请页面 -->
<template>
    <div class="return-apply-container">
        <div class="return-header">
            <h2>申请退货</h2>
        </div>

        <div v-if="loading" class="loading-section">
            <el-text>正在加载订单信息...</el-text>
        </div>

        <div v-else-if="!orderInfo" class="error-section">
            <el-text type="danger">订单信息不存在</el-text>
            <el-button @click="goBack">返回</el-button>
        </div>

        <div v-else class="return-content">
            <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
                <!-- 订单信息 -->
                <div class="section-card">
                    <h3 class="section-title">订单信息</h3>
                    <div class="order-info">
                        <div class="info-row">
                            <span class="label">订单号：</span>
                            <span class="value">{{ orderInfo.orderSn }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">下单时间：</span>
                            <span class="value">{{ formatTime(orderInfo.createTime) }}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">订单金额：</span>
                            <span class="value amount">¥{{ orderInfo.totalAmount }}</span>
                        </div>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div class="section-card">
                    <h3 class="section-title">退货商品</h3>
                    <div class="product-info">
                        <img :src="selectedProduct.productPic" :alt="selectedProduct.productName"
                            class="product-image" />
                        <div class="product-details">
                            <h4 class="product-name">{{ selectedProduct.productName }}</h4>
                            <p class="product-attr" v-if="selectedProduct.productAttr">{{ selectedProduct.productAttr }}
                            </p>
                            <div class="product-price">
                                <span class="label">单价：</span>
                                <span class="price">¥{{ selectedProduct.productPrice }}</span>
                                <span class="label">数量：</span>
                                <span class="quantity">{{ selectedProduct.productQuantity }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 退货信息 -->
                <div class="section-card">
                    <h3 class="section-title">退货信息</h3>

                    <el-form-item label="退货金额" prop="returnAmount">
                        <el-input-number v-model="form.returnAmount" :max="maxReturnAmount" :min="0.01" :precision="2"
                            controls-position="right" placeholder="请输入退货金额" />
                        <span class="help-text">最大可退：¥{{ maxReturnAmount }}</span>
                    </el-form-item>

                    <el-form-item label="联系人" prop="returnName">
                        <el-input v-model="form.returnName" placeholder="请输入联系人姓名" />
                    </el-form-item>

                    <el-form-item label="联系电话" prop="returnPhone">
                        <el-input v-model="form.returnPhone" placeholder="请输入联系电话" />
                    </el-form-item>

                    <el-form-item label="退货原因" prop="returnReason">
                        <el-select v-model="form.returnReason" placeholder="请选择退货原因">
                            <el-option v-for="reason in returnReasons" :key="reason.value" :label="reason.label"
                                :value="reason.value" />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="问题描述" prop="description">
                        <el-input v-model="form.description" type="textarea" :rows="4"
                            placeholder="请详细描述退货原因，例如：商品质量问题、尺寸不合适等" maxlength="500" show-word-limit />
                    </el-form-item>

                    <el-form-item label="凭证图片">
                        <div class="upload-section">
                            <el-upload ref="uploadRef" :file-list="fileList" :before-upload="beforeUpload"
                                :on-success="onUploadSuccess" :on-remove="onRemove" :on-exceed="onExceed" :limit="5"
                                list-type="picture-card" action="/api/file/upload">
                                <el-icon>
                                    <Plus />
                                </el-icon>
                            </el-upload>
                            <div class="upload-tip">
                                <p>上传凭证图片，支持jpg、png格式，最多上传5张</p>
                            </div>
                        </div>
                    </el-form-item>
                </div>

                <!-- 提交按钮 -->
                <div class="form-actions">
                    <el-button @click="goBack">取消</el-button>
                    <el-button type="primary" @click="submitReturn" :loading="submitting">
                        提交申请
                    </el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { orderDetail, returnApplyCreate } from '@/api/mall'
import type { Order, OrderItem, ReturnApplyCreateParams } from '@/api/mall/types'

const route = useRoute()
const router = useRouter()

// 表单实例
const formRef = ref()

// 数据
const loading = ref(true)
const submitting = ref(false)
const orderInfo = ref<Order | null>(null)
const selectedProduct = ref<OrderItem>({
    id: 0,
    orderId: 0,
    productId: 0,
    productPic: '',
    productName: '',
    productBrand: '',
    productSn: '',
    productPrice: 0,
    productQuantity: 0,
    productSkuId: 0,
    productSkuCode: '',
    productCategoryId: 0,
    realAmount: 0,
    productAttr: ''
})
interface FileItem {
    url?: string
    response?: { data: { url: string } }
}

const fileList = ref<FileItem[]>([])

// 表单数据
const form = ref<ReturnApplyCreateParams>({
    orderId: 0,
    productId: 0,
    orderSn: '',
    returnAmount: 0,
    returnName: '',
    returnPhone: '',
    returnReason: '',
    description: '',
    proofPics: ''
})// 退货原因选项
const returnReasons = [
    { label: '质量问题', value: '质量问题' },
    { label: '尺寸不合适', value: '尺寸不合适' },
    { label: '颜色/款式不满意', value: '颜色/款式不满意' },
    { label: '商品损坏', value: '商品损坏' },
    { label: '与描述不符', value: '与描述不符' },
    { label: '其他原因', value: '其他原因' }
]

// 表单验证规则
const rules = {
    returnAmount: [
        { required: true, message: '请输入退货金额', trigger: 'blur' },
        { type: 'number', min: 0.01, message: '退货金额必须大于0', trigger: 'blur' }
    ],
    returnName: [
        { required: true, message: '请输入联系人姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '姓名长度在2-20个字符', trigger: 'blur' }
    ],
    returnPhone: [
        { required: true, message: '请输入联系电话', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    returnReason: [
        { required: true, message: '请选择退货原因', trigger: 'change' }
    ],
    description: [
        { required: true, message: '请输入问题描述', trigger: 'blur' },
        { min: 10, max: 500, message: '描述长度在10-500个字符', trigger: 'blur' }
    ]
}

// 计算最大退货金额
const maxReturnAmount = computed(() => {
    if (!selectedProduct.value.productPrice || !selectedProduct.value.productQuantity) {
        return 0
    }
    return selectedProduct.value.productPrice * selectedProduct.value.productQuantity
})

// 加载订单详情
const loadOrderDetail = async () => {
    try {
        loading.value = true
        const orderId = route.params.orderId as string
        const productId = route.params.productId as string

        if (!orderId || !productId) {
            ElMessage.error('缺少必要参数')
            goBack()
            return
        }

        const response = await orderDetail(Number(orderId))
        orderInfo.value = response.data

        if (!orderInfo.value) {
            ElMessage.error('订单不存在')
            goBack()
            return
        }

        // 找到要退货的商品
        const product = orderInfo.value.orderItemList.find((item: OrderItem) => item.productId === Number(productId))
        if (!product) {
            ElMessage.error('商品不存在')
            goBack()
            return
        }

        selectedProduct.value = product

        // 初始化表单数据
        form.value = {
            orderId: orderInfo.value.id,
            productId: product.productId,
            orderSn: orderInfo.value.orderSn,
            returnAmount: maxReturnAmount.value,
            returnName: orderInfo.value.receiverName,
            returnPhone: orderInfo.value.receiverPhone,
            returnReason: '',
            description: '',
            proofPics: ''
        }
    } catch (error) {
        console.error('加载订单详情失败:', error)
        ElMessage.error('加载订单详情失败')
    } finally {
        loading.value = false
    }
}

// 文件上传相关
const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isLt5M = file.size / 1024 / 1024 < 5

    if (!isImage) {
        ElMessage.error('只能上传图片文件!')
        return false
    }
    if (!isLt5M) {
        ElMessage.error('图片大小不能超过 5MB!')
        return false
    }
    return true
}

const onUploadSuccess = (response: { data: { url: string } }, file: FileItem) => {
    file.url = response.data.url
    updateProofPics()
}

const onRemove = () => {
    updateProofPics()
}

const onExceed = () => {
    ElMessage.warning('最多只能上传5张图片')
}

const updateProofPics = () => {
    form.value.proofPics = fileList.value
        .filter((file: FileItem) => file.url)
        .map((file: FileItem) => file.url!)
        .join(',')
}// 提交退货申请
const submitReturn = async () => {
    if (!formRef.value) return

    try {
        const valid = await formRef.value.validate()
        if (!valid) return

        submitting.value = true

        await returnApplyCreate(form.value)
        ElMessage.success('退货申请提交成功')

        // 跳转到订单详情页面或我的订单页面
        router.push('/mall/order')
    } catch (error) {
        console.error('提交退货申请失败:', error)
        ElMessage.error('提交退货申请失败')
    } finally {
        submitting.value = false
    }
}

// 格式化时间
const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleString('zh-CN')
}

// 返回
const goBack = () => {
    router.back()
}

onMounted(() => {
    loadOrderDetail()
})
</script>

<style scoped lang="scss">
.return-apply-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.return-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
        color: #333;
        font-size: 24px;
        margin: 0;
    }
}

.loading-section,
.error-section {
    text-align: center;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    margin: 20px 0;
}

.return-content {
    background: #fff;
    border-radius: 8px;
    padding: 30px;
}

.section-card {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 8px;

    .section-title {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        margin-bottom: 20px;
        border-bottom: 2px solid #f0f0f0;
        padding-bottom: 10px;
    }
}

.order-info {
    .info-row {
        display: flex;
        margin-bottom: 12px;

        .label {
            width: 120px;
            color: #666;
        }

        .value {
            color: #333;

            &.amount {
                color: #f56c6c;
                font-weight: 500;
            }
        }
    }
}

.product-info {
    display: flex;
    gap: 16px;

    .product-image {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        border: 1px solid #eee;
    }

    .product-details {
        flex: 1;

        .product-name {
            font-size: 16px;
            font-weight: 500;
            margin: 0 0 8px 0;
            color: #333;
        }

        .product-attr {
            font-size: 12px;
            color: #999;
            margin: 0 0 8px 0;
        }

        .product-price {
            display: flex;
            align-items: center;
            gap: 16px;

            .label {
                color: #666;
                font-size: 14px;
            }

            .price {
                color: #f56c6c;
                font-weight: 500;
            }

            .quantity {
                color: #333;
            }
        }
    }
}

.help-text {
    font-size: 12px;
    color: #999;
    margin-left: 8px;
}

.upload-section {
    .upload-tip {
        margin-top: 8px;

        p {
            font-size: 12px;
            color: #999;
            margin: 0;
        }
    }
}

.form-actions {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #eee;

    .el-button {
        min-width: 100px;
        margin: 0 10px;
    }
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
}

:deep(.el-upload--picture-card) {
    width: 80px;
    height: 80px;
    border-radius: 6px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
    width: 80px;
    height: 80px;
}
</style>
