<!-- 地址选择弹窗组件 - 基于MallLite接口 -->
<template>
  <el-dialog v-model="visible" title="选择收货地址" width="500px" @close="onClose">
    <div class="address-list">
      <div v-if="addresses.length === 0" class="empty-address">
        <p>暂无收货地址</p>
        <el-button type="primary" @click="$emit('add')">添加新地址</el-button>
      </div>

      <div v-else>
        <div v-for="address in addresses" :key="address.id" class="address-item"
          :class="{ active: selectedId === address.id }" @click="selectAddress(address)">
          <div class="address-info">
            <div class="contact">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phoneNumber }}</span>
              <span v-if="address.defaultStatus" class="default-tag">默认</span>
            </div>
            <div class="address">
              {{ address.province }} {{ address.city }} {{ address.region }} {{ address.detailAddress }}
            </div>
          </div>
          <el-radio :model-value="selectedId" :label="address.id" @change="selectAddress(address)" />
        </div>

        <div class="add-address">
          <el-button type="primary" plain @click="$emit('add')">
            <el-icon>
              <Plus />
            </el-icon>
            添加新地址
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import type { MemberReceiveAddress } from '@/api/mall/types'

interface Props {
  modelValue: boolean
  addresses: MemberReceiveAddress[]
  selectedId?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', address: MemberReceiveAddress): void
  (e: 'add'): void
}

const props = withDefaults(defineProps<Props>(), {
  addresses: () => [],
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectAddress = (address: MemberReceiveAddress) => {
  emit('select', address)
}

const onClose = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
.address-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty-address {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.address-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #409eff;
  }

  &.active {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  .address-info {
    flex: 1;

    .contact {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .name {
        font-weight: 500;
        color: #333;
      }

      .phone {
        color: #666;
      }

      .default-tag {
        background: #f56c6c;
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
    }

    .address {
      color: #666;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}

.add-address {
  text-align: center;
  padding: 20px;
}
</style>
