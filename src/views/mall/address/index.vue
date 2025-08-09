<template>
  <div class="address-container">
    <div class="address-header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="showAddAddress">
        <i class="el-icon-plus"></i>
        添加地址
      </el-button>
    </div>

    <div class="address-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>

      <div v-else-if="addressList.length === 0" class="empty-container">
        <div class="empty-text">暂无收货地址</div>
        <el-button type="primary" @click="showAddAddress">添加地址</el-button>
      </div>

      <div v-else class="address-list">
        <div v-for="address in addressList" :key="address.id" class="address-item">
          <div class="address-info">
            <div class="address-header-info">
              <div class="contact-info">
                <span class="name">{{ address.name }}</span>
                <span class="phone">{{ address.phoneNumber }}</span>
              </div>
              <div class="default-tag" v-if="address.defaultStatus">默认</div>
            </div>

            <div class="address-detail">
              <span class="province-city">{{ address.province }} {{ address.city }} {{ address.region }}</span>
              <span class="detail-address">{{ address.detailAddress }}</span>
            </div>
          </div>

          <div class="address-actions">
            <el-button size="small" @click="editAddress(address)">
              编辑
            </el-button>
            <el-button v-if="!address.defaultStatus" size="small" type="primary" @click="setDefault(address.id)">
              设为默认
            </el-button>
            <el-button size="small" type="danger" @click="deleteAddress(address.id)">
              删除
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加/编辑地址对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑地址' : '添加地址'" width="500px">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" title="收货人姓名" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input v-model="addressForm.phoneNumber" placeholder="请输入手机号码" title="收货人手机号码" />
        </el-form-item>

        <el-form-item label="所在地区" prop="region">
          <div class="region-selector">
            <el-select v-model="addressForm.province" placeholder="省份" @change="onProvinceChange" title="选择省份">
              <el-option v-for="province in provinceList" :key="province.value" :label="province.label"
                :value="province.value" />
            </el-select>

            <el-select v-model="addressForm.city" placeholder="城市" @change="onCityChange" title="选择城市">
              <el-option v-for="city in cityList" :key="city.value" :label="city.label" :value="city.value" />
            </el-select>

            <el-select v-model="addressForm.region" placeholder="区县" title="选择区县">
              <el-option v-for="region in regionList" :key="region.value" :label="region.label" :value="region.value" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="addressForm.detailAddress" type="textarea" :rows="3" placeholder="请输入详细地址"
            title="详细收货地址" />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="addressForm.defaultStatus" title="设置此地址为默认收货地址">
            设为默认地址
          </el-checkbox>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

interface Address {
  id: number
  name: string
  phoneNumber: string
  province: string
  city: string
  region: string
  detailAddress: string
  defaultStatus: boolean
}

interface RegionOption {
  value: string
  label: string
  children?: RegionOption[]
}

// 数据
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const addressList = ref<Address[]>([])

// 表单数据
const addressForm = reactive({
  id: 0,
  name: '',
  phoneNumber: '',
  province: '',
  city: '',
  region: '',
  detailAddress: '',
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

// 城市数据映射
const cityMap: Record<string, RegionOption[]> = {
  '北京市': [{ value: '北京市', label: '北京市' }],
  '上海市': [{ value: '上海市', label: '上海市' }],
  '广东省': [
    { value: '广州市', label: '广州市' },
    { value: '深圳市', label: '深圳市' },
    { value: '东莞市', label: '东莞市' }
  ],
  '浙江省': [
    { value: '杭州市', label: '杭州市' },
    { value: '宁波市', label: '宁波市' },
    { value: '温州市', label: '温州市' }
  ],
  '江苏省': [
    { value: '南京市', label: '南京市' },
    { value: '苏州市', label: '苏州市' },
    { value: '无锡市', label: '无锡市' }
  ],
  '湖南省': [
    { value: '长沙市', label: '长沙市' },
    { value: '株洲市', label: '株洲市' },
    { value: '湘潭市', label: '湘潭市' }
  ]
}

// 区县数据映射
const regionMap: Record<string, RegionOption[]> = {
  '北京市': [
    { value: '朝阳区', label: '朝阳区' },
    { value: '海淀区', label: '海淀区' },
    { value: '西城区', label: '西城区' }
  ],
  '上海市': [
    { value: '浦东新区', label: '浦东新区' },
    { value: '黄浦区', label: '黄浦区' },
    { value: '静安区', label: '静安区' }
  ],
  '广州市': [
    { value: '天河区', label: '天河区' },
    { value: '越秀区', label: '越秀区' },
    { value: '海珠区', label: '海珠区' }
  ],
  '深圳市': [
    { value: '南山区', label: '南山区' },
    { value: '福田区', label: '福田区' },
    { value: '罗湖区', label: '罗湖区' }
  ],
  '长沙市': [
    { value: '岳麓区', label: '岳麓区' },
    { value: '芙蓉区', label: '芙蓉区' },
    { value: '天心区', label: '天心区' }
  ]
}

// 表单验证规则
const addressRules = {
  name: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
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
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 加载地址列表
const loadAddressList = () => {
  loading.value = true

  // 模拟数据
  setTimeout(() => {
    addressList.value = [
      {
        id: 1,
        name: '张三',
        phoneNumber: '13800138000',
        province: '湖南省',
        city: '长沙市',
        region: '岳麓区',
        detailAddress: '中南大学新校区',
        defaultStatus: true
      },
      {
        id: 2,
        name: '李四',
        phoneNumber: '13900139000',
        province: '广东省',
        city: '深圳市',
        region: '南山区',
        detailAddress: '科技园南区',
        defaultStatus: false
      }
    ]
    loading.value = false
  }, 500)
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

// 显示添加地址对话框
const showAddAddress = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑地址
const editAddress = (address: Address) => {
  isEdit.value = true
  Object.assign(addressForm, address)

  // 加载对应的城市和区县数据
  onProvinceChange(address.province)
  onCityChange(address.city)

  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  addressForm.id = 0
  addressForm.name = ''
  addressForm.phoneNumber = ''
  addressForm.province = ''
  addressForm.city = ''
  addressForm.region = ''
  addressForm.detailAddress = ''
  addressForm.defaultStatus = false

  cityList.value = []
  regionList.value = []
}

// 保存地址
const saveAddress = () => {
  if (!addressForm.name) {
    ElMessage.warning('请输入收货人姓名')
    return
  }
  if (!addressForm.phoneNumber) {
    ElMessage.warning('请输入手机号码')
    return
  }
  if (!addressForm.province || !addressForm.city || !addressForm.region) {
    ElMessage.warning('请选择完整的地区信息')
    return
  }
  if (!addressForm.detailAddress) {
    ElMessage.warning('请输入详细地址')
    return
  }

  try {
    if (isEdit.value) {
      // 编辑地址
      const index = addressList.value.findIndex(item => item.id === addressForm.id)
      if (index !== -1) {
        addressList.value[index] = { ...addressForm }
      }
      ElMessage.success('地址修改成功')
    } else {
      // 添加地址
      const newAddress = {
        ...addressForm,
        id: Date.now() // 使用时间戳作为临时ID
      }

      // 如果设为默认地址，取消其他默认地址
      if (newAddress.defaultStatus) {
        addressList.value.forEach(item => {
          item.defaultStatus = false
        })
      }

      addressList.value.push(newAddress)
      ElMessage.success('地址添加成功')
    }

    dialogVisible.value = false
  } catch (error) {
    console.error('保存地址失败:', error)
    ElMessage.error('保存地址失败')
  }
}

// 设为默认地址
const setDefault = (addressId: number) => {
  try {
    addressList.value.forEach(item => {
      item.defaultStatus = item.id === addressId
    })
    ElMessage.success('设置默认地址成功')
  } catch (error) {
    console.error('设置默认地址失败:', error)
    ElMessage.error('设置默认地址失败')
  }
}

// 删除地址
const deleteAddress = (addressId: number) => {
  if (confirm('确定要删除这个地址吗？')) {
    try {
      const index = addressList.value.findIndex(item => item.id === addressId)
      if (index !== -1) {
        addressList.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    } catch (error) {
      console.error('删除地址失败:', error)
      ElMessage.error('删除地址失败')
    }
  }
}

onMounted(() => {
  loadAddressList()
})
</script>

<style lang="scss" scoped>
.address-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #fff;
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

  .loading-container {
    text-align: center;
    padding: 50px;

    .loading-text {
      font-size: 16px;
      color: #666;
    }
  }

  .empty-container {
    text-align: center;
    padding: 50px;

    .empty-text {
      font-size: 16px;
      color: #666;
      margin-bottom: 20px;
    }
  }

  .address-list {
    .address-item {
      background: #fff;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      .address-info {
        margin-bottom: 16px;

        .address-header-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .contact-info {
            .name {
              font-size: 16px;
              font-weight: 600;
              color: #333;
              margin-right: 16px;
            }

            .phone {
              font-size: 14px;
              color: #666;
            }
          }

          .default-tag {
            background: #409eff;
            color: white;
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
          }
        }

        .address-detail {
          font-size: 14px;
          color: #666;
          line-height: 1.5;

          .province-city {
            margin-right: 8px;
          }
        }
      }

      .address-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

.region-selector {
  display: flex;
  gap: 12px;

  .el-select {
    flex: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;

    h2 {
      font-size: 18px;
    }
  }

  .address-content {
    padding: 16px;

    .address-list .address-item {
      padding: 16px;

      .address-info .address-header-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .address-actions {
        flex-wrap: wrap;
        gap: 8px;

        .el-button {
          flex: 1;
          min-width: 60px;
        }
      }
    }
  }

  .region-selector {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
