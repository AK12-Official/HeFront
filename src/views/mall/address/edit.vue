<template>
    <div class="address-edit-container">
        <div class="address-header">
            <h2>{{ isEdit ? '编辑地址' : '添加地址' }}</h2>
        </div>

        <div class="address-content">
            <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px"
                class="address-form">
                <el-form-item label="收货人" prop="name">
                    <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" maxlength="20" />
                </el-form-item>

                <el-form-item label="手机号码" prop="phoneNumber">
                    <el-input v-model="addressForm.phoneNumber" placeholder="请输入手机号码" maxlength="11" />
                </el-form-item>

                <el-form-item label="所在地区" prop="region">
                    <div class="region-selector">
                        <el-select v-model="addressForm.province" placeholder="省份" @change="onProvinceChange"
                            class="region-select">
                            <el-option v-for="province in provinceList" :key="province.value" :label="province.label"
                                :value="province.value" />
                        </el-select>

                        <el-select v-model="addressForm.city" placeholder="城市" @change="onCityChange"
                            class="region-select">
                            <el-option v-for="city in cityList" :key="city.value" :label="city.label"
                                :value="city.value" />
                        </el-select>

                        <el-select v-model="addressForm.region" placeholder="区县" class="region-select">
                            <el-option v-for="region in regionList" :key="region.value" :label="region.label"
                                :value="region.value" />
                        </el-select>
                    </div>
                </el-form-item>

                <el-form-item label="详细地址" prop="detailAddress">
                    <el-input v-model="addressForm.detailAddress" type="textarea" :rows="3"
                        placeholder="请输入详细地址，如道路、门牌号、小区、楼栋号、单元等信息" maxlength="200" show-word-limit />
                </el-form-item>

                <el-form-item label="地址标签" prop="tag">
                    <div class="address-tags">
                        <div v-for="tag in addressTags" :key="tag.value" class="tag-item"
                            :class="{ active: addressForm.tag === tag.value }" @click="addressForm.tag = tag.value">
                            {{ tag.label }}
                        </div>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-checkbox v-model="addressForm.defaultStatus">设为默认地址</el-checkbox>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="action-section">
            <el-button size="large" @click="goBack">取消</el-button>
            <el-button type="primary" size="large" :loading="saving" @click="saveAddress">
                保存
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

interface RegionOption {
    value: string
    label: string
}

interface AddressTag {
    value: string
    label: string
}

const route = useRoute()
const router = useRouter()

// 数据
const isEdit = ref(false)
const saving = ref(false)
const addressFormRef = ref()

// 表单数据
const addressForm = reactive({
    id: 0,
    name: '',
    phoneNumber: '',
    province: '',
    city: '',
    region: '',
    detailAddress: '',
    tag: '家',
    defaultStatus: false
})

// 地区数据
const provinceList = ref<RegionOption[]>([
    { value: '北京市', label: '北京市' },
    { value: '上海市', label: '上海市' },
    { value: '广东省', label: '广东省' },
    { value: '浙江省', label: '浙江省' },
    { value: '江苏省', label: '江苏省' },
    { value: '湖南省', label: '湖南省' }
])

const cityList = ref<RegionOption[]>([])
const regionList = ref<RegionOption[]>([])

// 地址标签
const addressTags: AddressTag[] = [
    { value: '家', label: '家' },
    { value: '公司', label: '公司' },
    { value: '学校', label: '学校' },
    { value: '其他', label: '其他' }
]

// 城市数据映射
const cityMap: Record<string, RegionOption[]> = {
    '北京市': [{ value: '北京市', label: '北京市' }],
    '上海市': [{ value: '上海市', label: '上海市' }],
    '广东省': [
        { value: '广州市', label: '广州市' },
        { value: '深圳市', label: '深圳市' },
        { value: '东莞市', label: '东莞市' },
        { value: '佛山市', label: '佛山市' }
    ],
    '浙江省': [
        { value: '杭州市', label: '杭州市' },
        { value: '宁波市', label: '宁波市' },
        { value: '温州市', label: '温州市' },
        { value: '嘉兴市', label: '嘉兴市' }
    ],
    '江苏省': [
        { value: '南京市', label: '南京市' },
        { value: '苏州市', label: '苏州市' },
        { value: '无锡市', label: '无锡市' },
        { value: '常州市', label: '常州市' }
    ],
    '湖南省': [
        { value: '长沙市', label: '长沙市' },
        { value: '株洲市', label: '株洲市' },
        { value: '湘潭市', label: '湘潭市' },
        { value: '衡阳市', label: '衡阳市' }
    ]
}

// 区县数据映射
const regionMap: Record<string, RegionOption[]> = {
    '北京市': [
        { value: '朝阳区', label: '朝阳区' },
        { value: '海淀区', label: '海淀区' },
        { value: '西城区', label: '西城区' },
        { value: '东城区', label: '东城区' }
    ],
    '上海市': [
        { value: '浦东新区', label: '浦东新区' },
        { value: '黄浦区', label: '黄浦区' },
        { value: '静安区', label: '静安区' },
        { value: '徐汇区', label: '徐汇区' }
    ],
    '广州市': [
        { value: '天河区', label: '天河区' },
        { value: '越秀区', label: '越秀区' },
        { value: '海珠区', label: '海珠区' },
        { value: '荔湾区', label: '荔湾区' }
    ],
    '深圳市': [
        { value: '南山区', label: '南山区' },
        { value: '福田区', label: '福田区' },
        { value: '罗湖区', label: '罗湖区' },
        { value: '宝安区', label: '宝安区' }
    ],
    '长沙市': [
        { value: '岳麓区', label: '岳麓区' },
        { value: '芙蓉区', label: '芙蓉区' },
        { value: '天心区', label: '天心区' },
        { value: '开福区', label: '开福区' }
    ]
}

// 表单验证规则
const addressRules = {
    name: [
        { required: true, message: '请输入收货人姓名', trigger: 'blur' },
        { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    phoneNumber: [
        { required: true, message: '请输入手机号码', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    province: [
        { required: true, message: '请选择省份', trigger: 'change' }
    ],
    city: [
        { required: true, message: '请选择城市', trigger: 'change' }
    ],
    region: [
        { required: true, message: '请选择区县', trigger: 'change' }
    ],
    detailAddress: [
        { required: true, message: '请输入详细地址', trigger: 'blur' },
        { min: 5, max: 200, message: '详细地址长度在 5 到 200 个字符', trigger: 'blur' }
    ]
}

// 省份变化
const onProvinceChange = (province: string) => {
    cityList.value = cityMap[province] || []
    regionList.value = []
    addressForm.city = ''
    addressForm.region = ''
}

// 城市变化
const onCityChange = (city: string) => {
    regionList.value = regionMap[city] || []
    addressForm.region = ''
}

// 加载地址详情（编辑模式）
const loadAddressDetail = async () => {
    const addressId = route.query.id
    if (addressId) {
        isEdit.value = true

        // 模拟地址数据
        const mockAddress = {
            id: Number(addressId),
            name: '张三',
            phoneNumber: '13800138000',
            province: '湖南省',
            city: '长沙市',
            region: '岳麓区',
            detailAddress: '中南大学新校区学生公寓',
            tag: '学校',
            defaultStatus: true
        }

        Object.assign(addressForm, mockAddress)

        // 加载对应的城市和区县数据
        onProvinceChange(addressForm.province)
        onCityChange(addressForm.city)
    }
}

// 保存地址
const saveAddress = async () => {
    try {
        // 表单验证
        await addressFormRef.value?.validate()

        saving.value = true

        // 构建保存数据
        const addressData = {
            ...addressForm,
            fullAddress: `${addressForm.province} ${addressForm.city} ${addressForm.region} ${addressForm.detailAddress}`
        }

        // 这里应该调用保存地址的API
        console.log('保存地址数据:', addressData)

        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000))

        ElMessage.success(isEdit.value ? '地址修改成功' : '地址添加成功')

        // 返回地址列表页面
        router.push('/mall/address')

    } catch (error) {
        if (error !== false) { // 排除表单验证失败的情况
            console.error('保存地址失败:', error)
            ElMessage.error('保存地址失败')
        }
    } finally {
        saving.value = false
    }
}

// 返回
const goBack = () => {
    router.back()
}

onMounted(() => {
    loadAddressDetail()
})
</script>

<style lang="scss" scoped>
.address-edit-container {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 80px;
}

.address-header {
    background: #fff;
    padding: 20px;
    border-bottom: 1px solid #eee;

    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
    }
}

.address-content {
    padding: 20px;

    .address-form {
        background: #fff;
        padding: 20px;
        border-radius: 8px;

        .region-selector {
            display: flex;
            gap: 12px;

            .region-select {
                flex: 1;
            }
        }

        .address-tags {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;

            .tag-item {
                padding: 8px 16px;
                border: 1px solid #ddd;
                border-radius: 20px;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.3s ease;
                background: #fff;

                &:hover {
                    border-color: #409eff;
                    color: #409eff;
                }

                &.active {
                    border-color: #409eff;
                    background: #409eff;
                    color: #fff;
                }
            }
        }
    }
}

.action-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    padding: 16px 20px;
    border-top: 1px solid #eee;
    display: flex;
    gap: 12px;
    z-index: 100;

    .el-button {
        flex: 1;
        height: 50px;
        font-size: 16px;
        font-weight: 600;
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .address-content {
        padding: 16px;

        .address-form {
            padding: 16px;

            .region-selector {
                flex-direction: column;
                gap: 8px;
            }

            .address-tags {
                gap: 8px;

                .tag-item {
                    font-size: 12px;
                    padding: 6px 12px;
                }
            }
        }
    }

    .action-section {
        padding: 12px 16px;
    }
}
</style>
