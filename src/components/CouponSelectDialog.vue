<!-- 优惠券选择弹窗组件 - 基于MallLite接口 -->
<template>
  <el-dialog v-model="visible" title="选择优惠券" width="500px" @close="onClose">
    <div class="coupon-list">
      <div v-if="coupons.length === 0" class="empty-coupon">
        <p>暂无可用优惠券</p>
      </div>

      <div v-else>
        <!-- 不使用优惠券选项 -->
        <div class="coupon-item no-coupon" :class="{ active: selectedId === null }" @click="selectCoupon(null)">
          <div class="coupon-info">
            <span class="coupon-text">不使用优惠券</span>
          </div>
          <el-radio :model-value="selectedId" :label="null" @change="selectCoupon(null)" />
        </div>

        <!-- 优惠券列表 -->
        <div v-for="coupon in coupons" :key="coupon.id" class="coupon-item" :class="{
          active: selectedId === coupon.id,
          disabled: !isCouponAvailable(coupon)
        }" @click="selectCoupon(coupon)">
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">
              {{ coupon.minPoint ? `满${coupon.minPoint}元可用` : '无门槛' }}
            </div>
          </div>

          <div class="coupon-content">
            <div class="coupon-info">
              <h3 class="coupon-name">{{ coupon.name }}</h3>
              <p class="coupon-desc" v-if="coupon.note">{{ coupon.note }}</p>
              <div class="coupon-time">
                <span v-if="coupon.startTime && coupon.endTime">
                  {{ formatTime(coupon.startTime) }} ~ {{ formatTime(coupon.endTime) }}
                </span>
                <span v-else-if="coupon.enableTime">
                  领取后{{ coupon.enableTime }}天内有效
                </span>
              </div>
            </div>
          </div>

          <div class="coupon-radio">
            <el-radio :model-value="selectedId" :label="coupon.id" :disabled="!isCouponAvailable(coupon)"
              @change="selectCoupon(coupon)" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MemberCoupon } from '@/api/mall/types'

interface Props {
  modelValue: boolean
  coupons: MemberCoupon[]
  selectedId?: number | null
  totalAmount?: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', coupon: MemberCoupon | null): void
}

const props = withDefaults(defineProps<Props>(), {
  coupons: () => [],
  totalAmount: 0
})

const emit = defineEmits<Emits>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const selectCoupon = (coupon: MemberCoupon | null) => {
  if (coupon && !isCouponAvailable(coupon)) {
    return
  }
  emit('select', coupon)
}

const onClose = () => {
  emit('update:modelValue', false)
}

const isCouponAvailable = (coupon: MemberCoupon) => {
  // 检查使用状态
  if (coupon.useStatus !== 0) {
    return false
  }

  // 检查是否满足使用门槛
  if (coupon.minPoint && props.totalAmount < coupon.minPoint) {
    return false
  }

  // 检查有效期
  if (coupon.endTime) {
    const endTime = new Date(coupon.endTime)
    const now = new Date()
    if (now > endTime) {
      return false
    }
  }

  return true
}

const formatTime = (timeStr: string) => {
  const date = new Date(timeStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped lang="scss">
.coupon-list {
  max-height: 400px;
  overflow-y: auto;
}

.empty-coupon {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover:not(.disabled) {
    border-color: #409eff;
  }

  &.active {
    border-color: #409eff;
    background-color: #f0f9ff;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9f9f9;
  }

  &.no-coupon {
    .coupon-info {
      flex: 1;
      text-align: center;

      .coupon-text {
        font-size: 16px;
        color: #666;
      }
    }
  }

  .coupon-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 60px;
    background: linear-gradient(135deg, #f56c6c, #ff8a80);
    border-radius: 8px;
    color: white;
    margin-right: 16px;

    .coupon-amount {
      display: flex;
      align-items: baseline;

      .currency {
        font-size: 12px;
      }

      .amount {
        font-size: 20px;
        font-weight: bold;
      }
    }

    .coupon-condition {
      font-size: 10px;
      opacity: 0.9;
      margin-top: 2px;
    }
  }

  .coupon-content {
    flex: 1;

    .coupon-info {
      .coupon-name {
        font-size: 14px;
        font-weight: 500;
        margin: 0 0 4px 0;
        color: #333;
      }

      .coupon-desc {
        font-size: 12px;
        color: #999;
        margin: 0 0 4px 0;
      }

      .coupon-time {
        font-size: 12px;
        color: #666;
      }
    }
  }

  .coupon-radio {
    margin-left: 16px;
  }
}
</style>
