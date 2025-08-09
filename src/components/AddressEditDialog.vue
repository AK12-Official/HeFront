<!-- 地址编辑弹窗组件 -->
<template>
    <el-dialog v-model="visible" :title="isEdit ? '编辑地址' : '添加地址'" width="500px" @close="handleClose">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="收货人" prop="name">
                <el-input v-model="form.name" placeholder="请输入收货人姓名" />
            </el-form-item>

            <el-form-item label="手机号" prop="phoneNumber">
                <el-input v-model="form.phoneNumber" placeholder="请输入手机号" />
            </el-form-item>

            <el-form-item label="省份" prop="province">
                <el-input v-model="form.province" placeholder="请输入省份" />
            </el-form-item>

            <el-form-item label="城市" prop="city">
                <el-input v-model="form.city" placeholder="请输入城市" />
            </el-form-item>

            <el-form-item label="区县" prop="region">
                <el-input v-model="form.region" placeholder="请输入区县" />
            </el-form-item>

            <el-form-item label="详细地址" prop="detailAddress">
                <el-input v-model="form.detailAddress" type="textarea" :rows="3" placeholder="请输入详细地址" />
            </el-form-item>

            <el-form-item>
                <el-checkbox v-model="form.defaultStatus">设为默认地址</el-checkbox>
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="submitting">
                    {{ isEdit ? '更新' : '添加' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { memberAddressAdd, memberAddressUpdate } from '@/api/mall'
import type { CommonResult } from '@/api/mall/types'

interface Address {
    id?: number
    name: string
    phoneNumber: string
    province: string
    city: string
    region: string
    detailAddress: string
    defaultStatus: boolean
}

interface Props {
    modelValue: boolean
    address?: Address | null
}

interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 数据
const visible = ref(false)
const submitting = ref(false)
const formRef = ref()

const form = ref<Address>({
    name: '',
    phoneNumber: '',
    province: '',
    city: '',
    region: '',
    detailAddress: '',
    defaultStatus: false
})

// 计算属性
const isEdit = computed(() => !!props.address?.id)

// 表单验证规则
const rules = {
    name: [
        { required: true, message: '请输入收货人姓名', trigger: 'blur' }
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    province: [
        { required: true, message: '请输入省份', trigger: 'blur' }
    ],
    city: [
        { required: true, message: '请输入城市', trigger: 'blur' }
    ],
    region: [
        { required: true, message: '请输入区县', trigger: 'blur' }
    ],
    detailAddress: [
        { required: true, message: '请输入详细地址', trigger: 'blur' }
    ]
}

// 监听弹窗显示状态
watch(() => props.modelValue, (newVal) => {
    visible.value = newVal
    if (newVal) {
        resetForm()
        // 如果是编辑模式，填充表单数据
        if (props.address) {
            form.value = { ...props.address }
        }
    }
})

watch(visible, (newVal) => {
    emit('update:modelValue', newVal)
})

// 重置表单
const resetForm = () => {
    form.value = {
        name: '',
        phoneNumber: '',
        province: '',
        city: '',
        region: '',
        detailAddress: '',
        defaultStatus: false
    }
    formRef.value?.clearValidate()
}

// 提交表单
const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        submitting.value = true

        const submitData = {
            name: form.value.name,
            phoneNumber: form.value.phoneNumber,
            province: form.value.province,
            city: form.value.city,
            region: form.value.region,
            detailAddress: form.value.detailAddress,
            defaultStatus: form.value.defaultStatus ? 1 : 0
        }

        let response: CommonResult<null>

        if (isEdit.value && props.address?.id) {
            // 编辑地址
            response = await memberAddressUpdate(props.address.id, submitData) as unknown as CommonResult<null>
        } else {
            // 添加地址
            response = await memberAddressAdd(submitData) as unknown as CommonResult<null>
        }

        if (response.code === 200) {
            ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
            emit('success')
        } else {
            ElMessage.error(response.message || '操作失败')
        }
    } catch (error) {
        console.error('提交地址失败:', error)
        ElMessage.error('操作失败')
    } finally {
        submitting.value = false
    }
}

// 关闭弹窗
const handleClose = () => {
    visible.value = false
}
</script>

<style lang="scss" scoped>
.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
