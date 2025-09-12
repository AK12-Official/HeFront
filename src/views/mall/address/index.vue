<template>
  <div class="address-container">
    <div class="address-header">
      <h2>收货地址</h2>
      <el-button type="primary" @click="showAddAddress">
        <el-icon>
          <Plus />
        </el-icon>
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
              <div class="default-tag" v-if="address.defaultStatus === 1">默认</div>
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
            <el-button v-if="address.defaultStatus !== 1" size="small" type="primary" @click="setDefault(address.id)">
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
            <el-select v-model="addressForm.province" placeholder="省份" @change="onProvinceChange" title="选择省份" clearable
              :key="`province-${selectKey}`" class="custom-width" style="width: 110px;">
              <el-option v-for="province in provinceList" :key="province.value" :label="province.label"
                :value="province.value" />
            </el-select>

            <el-select v-model="addressForm.city" placeholder="城市" @change="onCityChange" title="选择城市" clearable
              :key="`city-${selectKey}`" class="custom-width" style="width: 110px;">
              <el-option v-for="city in cityList" :key="city.value" :label="city.label" :value="city.value" />
            </el-select>

            <el-select v-model="addressForm.region" placeholder="区县" title="选择区县" clearable :key="`region-${selectKey}`"
              class="custom-width" style="width: 110px;">
              <el-option v-for="region in regionList" :key="region.value" :label="region.label" :value="region.value" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="addressForm.detailAddress" type="textarea" :rows="3" placeholder="请输入详细地址"
            title="详细收货地址" />
        </el-form-item>

        <el-form-item>
          <el-checkbox :model-value="addressForm.defaultStatus === 1"
            @update:model-value="addressForm.defaultStatus = $event ? 1 : 0" title="设置此地址为默认收货地址">
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
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { memberAddressList } from '@/api/mall'
import { getProvinces, getCitiesByProvince, getDistrictsByCity, type DistrictItem } from '@/api/tencent'

interface Address {
  id: number
  name: string
  phoneNumber: string
  province: string
  city: string
  region: string
  detailAddress: string
  defaultStatus: number  // Changed from boolean to number to match API response
}

interface RegionOption {
  value: string
  label: string
  id?: string  // 行政区划ID（adcode）
  children?: RegionOption[]
}

// 数据
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const addressList = ref<Address[]>([])
const selectKey = ref(0)  // 用于强制重新渲染选择框

// 表单数据
const addressForm = reactive({
  id: 0,
  name: '',
  phoneNumber: '',
  province: '',
  city: '',
  region: '',
  detailAddress: '',
  defaultStatus: 0  // Changed from false to 0 to match API
})

// 地区数据
const provinceList = ref<RegionOption[]>([])
const cityList = ref<RegionOption[]>([])
const regionList = ref<RegionOption[]>([])

// 加载省份数据
const loadProvinces = async () => {
  try {
    const provinces = await getProvinces()

    provinceList.value = provinces.map(province => ({
      value: province.name,
      label: province.name,
      id: province.id
    }))
  } catch (error) {
    ElMessage.error('加载省份数据失败，使用备用数据')
    // 如果API失败，使用备用数据
    provinceList.value = [
      { value: '北京市', label: '北京市', id: '110000' },
      { value: '上海市', label: '上海市', id: '310000' },
      { value: '广东省', label: '广东省', id: '440000' },
      { value: '浙江省', label: '浙江省', id: '330000' },
      { value: '江苏省', label: '江苏省', id: '320000' },
      { value: '湖南省', label: '湖南省', id: '430000' }
    ]
  }
}

// 城市数据映射（备用数据，API失败时使用）
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
const loadAddressList = async () => {
  loading.value = true

  try {
    const response = await memberAddressList()
    if (response.code === 200) {
      addressList.value = response.data
    } else {
      ElMessage.error(response.message || '获取地址列表失败')
      addressList.value = []
    }
  } catch (error) {
    console.error('获取地址列表失败:', error)
    ElMessage.error('获取地址列表失败')
    addressList.value = []
  } finally {
    loading.value = false
  }
}

// 省份变化
const onProvinceChange = async (province: string) => {
  try {
    // 清空城市和区县列表
    cityList.value = []
    regionList.value = []

    // 只有在添加模式下才清空城市和区县
    if (!isEdit.value) {
      addressForm.city = ''
      addressForm.region = ''
    }

    // 根据省份名称查找对应的ID
    const provinceItem = provinceList.value.find(p => p.value === province)

    if (provinceItem && provinceItem.id) {
      // 使用API获取城市数据
      const cities = await getCitiesByProvince(provinceItem.id)
      cityList.value = cities.map(city => ({
        value: city.name,
        label: city.name,
        id: city.id
      }))
    } else {
      // 如果找不到省份ID，使用备用数据
      cityList.value = cityMap[province] || []
    }
  } catch (error) {
    ElMessage.error('加载城市数据失败，使用备用数据')
    // 使用备用数据
    cityList.value = cityMap[province] || []
  }
}

// 城市变化
const onCityChange = async (city: string) => {
  try {
    // 清空区县列表
    regionList.value = []

    // 只有在添加模式下才清空区县
    if (!isEdit.value) {
      addressForm.region = ''
    }

    // 根据城市名称查找对应的ID
    const cityItem = cityList.value.find(c => c.value === city)

    if (cityItem && cityItem.id) {
      // 对于直辖市（北京、上海、天津、重庆），区县数据在省级数据中
      // 对于其他城市，区县数据在市级数据中
      const isMunicipality = ['北京市', '上海市', '天津市', '重庆市'].includes(addressForm.province)

      if (isMunicipality) {
        // 直辖市：获取省级数据中的区县
        const provinceItem = provinceList.value.find(p => p.value === addressForm.province)
        if (provinceItem && provinceItem.id) {
          const districts = await getDistrictsByCity(provinceItem.id)
          regionList.value = districts.map(district => ({
            value: district.name || district.fullname,
            label: district.name || district.fullname,
            id: district.id
          }))
        }
      } else {
        // 普通城市：获取市级数据中的区县
        const districts = await getDistrictsByCity(cityItem.id)
        regionList.value = districts.map(district => ({
          value: district.name || district.fullname,
          label: district.name || district.fullname,
          id: district.id
        }))
      }
    } else {
      // 如果找不到城市ID，使用备用数据
      regionList.value = regionMap[city] || []
    }
  } catch (error) {
    ElMessage.error('加载区县数据失败，使用备用数据')
    // 使用备用数据
    regionList.value = regionMap[city] || []
  }
}

// 显示添加地址对话框
const showAddAddress = () => {
  isEdit.value = false
  resetForm()
  selectKey.value++  // 强制重新渲染选择框
  dialogVisible.value = true
}

// 编辑地址
const editAddress = async (address: Address) => {
  isEdit.value = true

  // 先打开对话框
  dialogVisible.value = true

  // 等待DOM更新
  await nextTick()

  // 设置表单数据
  Object.assign(addressForm, address)

  // 加载对应的城市和区县数据
  try {
    // 根据省份名称查找对应的ID并加载城市数据
    const provinceItem = provinceList.value.find(p => p.value === address.province)
    if (provinceItem && provinceItem.id) {
      const cities = await getCitiesByProvince(provinceItem.id)
      cityList.value = cities.map(city => ({
        value: city.name,
        label: city.name,
        id: city.id
      }))

      // 等待城市数据加载完成后再加载区县数据
      await nextTick()

      // 根据城市名称查找对应的ID并加载区县数据
      const cityItem = cityList.value.find(c => c.value === address.city)
      if (cityItem && cityItem.id) {
        const districts = await getDistrictsByCity(cityItem.id)
        regionList.value = districts.map(district => ({
          value: district.name,
          label: district.name,
          id: district.id
        }))
      } else {
        regionList.value = regionMap[address.city] || []
      }
    } else {
      // 使用备用数据
      cityList.value = cityMap[address.province] || []
      regionList.value = regionMap[address.city] || []
    }
  } catch (error) {
    console.error('加载地区数据失败:', error)
    // 使用备用数据
    cityList.value = cityMap[address.province] || []
    regionList.value = regionMap[address.city] || []
  }

  // 强制重新渲染选择框
  selectKey.value++
  await nextTick()

  // 调试信息
  console.log('编辑地址:', {
    address,
    cityList: cityList.value,
    regionList: regionList.value,
    addressForm: { ...addressForm },
    selectKey: selectKey.value
  })
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
  addressForm.defaultStatus = 0  // Changed from false to 0

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
      if (newAddress.defaultStatus === 1) {
        addressList.value.forEach(item => {
          item.defaultStatus = 0
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
      item.defaultStatus = item.id === addressId ? 1 : 0
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

// 监听对话框打开状态，确保数据正确加载
watch(dialogVisible, (newVal) => {
  if (newVal && isEdit.value) {
    // 对话框打开时，确保数据正确加载
    nextTick(() => {
      console.log('对话框打开，当前表单数据:', { ...addressForm })
      console.log('城市列表:', cityList.value)
      console.log('区县列表:', regionList.value)
    })
  }
})

onMounted(async () => {
  // 先加载省份数据
  await loadProvinces()
  // 然后加载地址列表
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
  align-items: center;

  .el-select {
    flex: 1;
    min-width: 0;
    /* 确保flex项目可以收缩 */

    /* 确保手动设置的宽度能够生效 */
    &.custom-width {
      flex: none !important;
      width: 110px !important;
      min-width: 110px !important;
      max-width: 110px !important;
    }
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

    .el-select.custom-width {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
    }
  }
}
</style>
