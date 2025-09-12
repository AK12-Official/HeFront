<template>
  <div class="coupon-container">
    <div class="coupon-header">
      <h2>我的优惠券</h2>
      <div class="coupon-tabs">
        <div v-for="tab in couponTabs" :key="tab.value" class="tab-item" :class="{ active: activeTab === tab.value }"
          @click="changeTab(tab.value)">
          {{ tab.label }}
        </div>
      </div>
    </div>

    <div class="coupon-content">
      <div v-if="loading" class="loading-container">
        <div class="loading-text">加载中...</div>
      </div>

      <div v-else-if="couponList.length === 0" class="empty-container">
        <div class="empty-text">暂无优惠券</div>
        <el-button type="primary" @click="goCouponCenter">去领券中心</el-button>
      </div>

      <div v-else class="coupon-list">
        <div v-for="coupon in couponList" :key="coupon.id" class="coupon-item" :class="{
          expired: coupon.useStatus === 2,
          used: coupon.useStatus === 1,
          disabled: !coupon.available,
          [`coupon-type-${coupon.type}`]: true
        }">
          <div class="coupon-left">
            <div class="coupon-amount">
              <span class="currency">¥</span>
              <span class="amount">{{ coupon.amount }}</span>
            </div>
            <div class="coupon-condition">
              {{ coupon.minPoint ? `满${coupon.minPoint}元可用` : '无门槛' }}
            </div>
          </div>

          <div class="coupon-content-area">
            <div class="coupon-info">
              <h3 class="coupon-name">{{ coupon.name }}</h3>
              <p class="coupon-desc" v-if="coupon.note">{{ coupon.note }}</p>
              <div class="coupon-time">
                <span v-if="coupon.startTime && coupon.endTime">
                  {{ formatTime(coupon.startTime) }} ~ {{ formatTime(coupon.endTime) }}
                </span>
                <span v-else-if="coupon.enableTime">
                  领取后{{ getEnableDays(coupon.enableTime) }}天内有效
                </span>
              </div>
            </div>

            <div class="coupon-actions">
              <div class="coupon-status">
                <span v-if="coupon.useStatus === 0" class="status-unused">
                  未使用
                </span>
                <span v-else-if="coupon.useStatus === 1" class="status-used">
                  已使用
                </span>
                <span v-else-if="coupon.useStatus === 2" class="status-expired">
                  已过期
                </span>
              </div>

              <el-button v-if="coupon.useStatus === 0 && coupon.available" size="small" type="primary"
                @click="useCoupon(coupon)">
                立即使用
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" v-if="total > 0">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          layout="prev, pager, next" @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { memberCouponList } from '@/api/mall'
import type { MemberCoupon, CouponListParams } from '@/api/mall/types'

interface Coupon extends MemberCoupon {
  useStatus: number // 0-未使用 1-已使用 2-已过期
  available: boolean
}

const router = useRouter()

// 优惠券状态标签
const couponTabs = [
  { label: '全部', value: -1 },
  { label: '未使用', value: 0 },
  { label: '已使用', value: 1 },
  { label: '已过期', value: 2 }
]

// 数据
const activeTab = ref(-1)
const loading = ref(false)
const couponList = ref<Coupon[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载优惠券列表
const loadCouponList = async () => {
  loading.value = true

  try {
    const params: CouponListParams = {
      useStatus: activeTab.value === -1 ? undefined : activeTab.value,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    const response = await memberCouponList(params)

    if (response.code === 200) {
      // 将API返回的数据转换为页面需要的格式
      couponList.value = response.data.map((item: MemberCoupon) => ({
        ...item,
        available: isCouponAvailable(item), // 判断优惠券是否可用
        useStatus: getUseStatus(item) // 根据时间和使用情况判断使用状态
      }))
      total.value = response.data.length
    } else {
      ElMessage.error(response.message || '获取优惠券列表失败')
      couponList.value = []
      total.value = 0
    }
  } catch (error: any) {
    console.error('加载优惠券列表失败:', error)
    ElMessage.error('加载优惠券列表失败')
    couponList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 根据时间和使用情况判断优惠券使用状态
const getUseStatus = (coupon: MemberCoupon): number => {
  const now = new Date()
  const endTime = new Date(coupon.endTime)

  // 如果已过期
  if (now > endTime) {
    return 2 // 已过期
  }

  // 如果已使用（useCount > 0 表示已使用）
  if (coupon.useCount && coupon.useCount > 0) {
    return 1 // 已使用
  }

  // 默认未使用
  return 0 // 未使用
}

// 判断优惠券是否可用
const isCouponAvailable = (coupon: MemberCoupon): boolean => {
  const now = new Date()
  const startTime = new Date(coupon.startTime)
  const endTime = new Date(coupon.endTime)

  // 如果当前时间在有效期内且未使用
  return now >= startTime && now <= endTime && (!coupon.useCount || coupon.useCount === 0)
}

// 格式化时间
const formatTime = (time: string): string => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN')
}

// 获取启用天数
const getEnableDays = (enableTime: string): number => {
  if (!enableTime) return 0
  const enableDate = new Date(enableTime)
  const now = new Date()
  const diffTime = enableDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// 切换标签
const changeTab = (status: number) => {
  activeTab.value = status
  currentPage.value = 1
  loadCouponList()
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  loadCouponList()
}

// 使用优惠券
const useCoupon = (coupon: Coupon) => {
  // 跳转到商城首页或商品列表，携带优惠券信息
  router.push({
    path: '/mall/home',
    query: {
      couponId: coupon.id
    }
  })
}

// 去领券中心
const goCouponCenter = () => {
  ElMessage.info('领券中心功能开发中')
  // router.push('/mall/coupon/center')
}

onMounted(() => {
  loadCouponList()
})
</script>

<style lang="scss" scoped>
.coupon-container {
  background: #f5f5f5;
  min-height: 100vh;
}

.coupon-header {
  background: #fff;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }

  .coupon-tabs {
    display: flex;
    gap: 30px;

    .tab-item {
      padding: 10px 0;
      font-size: 16px;
      color: #666;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s ease;

      &:hover {
        color: #409eff;
      }

      &.active {
        color: #409eff;
        border-bottom-color: #409eff;
        font-weight: 600;
      }
    }
  }
}

.coupon-content {
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

  .coupon-list {
    .coupon-item {
      display: flex;
      background: #fff;
      border-radius: 12px;
      margin-bottom: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      }

      &.expired {
        .coupon-left {
          background: linear-gradient(135deg, #909399 0%, #b1b3b8 100%);
        }
      }

      &.used {
        .coupon-left {
          background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
        }
      }

      &.disabled {
        .coupon-left {
          background: linear-gradient(135deg, #f5f5f5 0%, #e4e7ed 100%);

          .coupon-amount {

            .currency,
            .amount {
              color: #c0c4cc !important;
            }
          }

          .coupon-condition {
            color: #c0c4cc !important;
          }
        }
      }

      .coupon-left {
        width: 120px;
        background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #f5f5f5;
          border-radius: 50%;
        }

        .coupon-amount {
          display: flex;
          align-items: baseline;
          margin-bottom: 8px;

          .currency {
            font-size: 14px;
            margin-right: 2px;
            color: white !important;
            font-weight: 600;
          }

          .amount {
            font-size: 24px;
            font-weight: 700;
            color: white !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
        }

        .coupon-condition {
          font-size: 12px;
          opacity: 0.95;
          text-align: center;
          color: white !important;
          font-weight: 500;
        }
      }

      .coupon-content-area {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;

        .coupon-info {
          flex: 1;

          .coupon-name {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            margin: 0 0 8px 0;
          }

          .coupon-desc {
            font-size: 14px;
            color: #666;
            margin: 0 0 8px 0;
          }

          .coupon-time {
            font-size: 12px;
            color: #999;
          }
        }

        .coupon-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;

          .coupon-status {
            font-size: 12px;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;

            .status-unused {
              color: #67c23a;
              background-color: rgba(103, 194, 58, 0.1);
              border: 1px solid rgba(103, 194, 58, 0.3);
            }

            .status-used {
              color: #67c23a;
              background-color: rgba(103, 194, 58, 0.1);
              border: 1px solid rgba(103, 194, 58, 0.3);
            }

            .status-expired {
              color: #f56c6c;
              background-color: rgba(245, 108, 108, 0.1);
              border: 1px solid rgba(245, 108, 108, 0.3);
            }
          }
        }
      }
    }
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
  }
}

/* 不同类型优惠券的颜色主题 */
.coupon-item {
  &.coupon-type-0 {
    .coupon-left {
      background: linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%);
    }
  }

  &.coupon-type-1 {
    .coupon-left {
      background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
    }
  }

  &.coupon-type-2 {
    .coupon-left {
      background: linear-gradient(135deg, #e6a23c 0%, #f0c78a 100%);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .coupon-header {
    padding: 16px;

    .coupon-tabs {
      gap: 20px;
      overflow-x: auto;
      white-space: nowrap;

      .tab-item {
        flex-shrink: 0;
        font-size: 14px;
      }
    }
  }

  .coupon-content {
    padding: 16px;

    .coupon-list .coupon-item {
      flex-direction: column;

      .coupon-left {
        width: 100%;
        height: 80px;
        flex-direction: row;
        justify-content: center;
        gap: 20px;

        &::after {
          display: none;
        }

        .coupon-amount {
          margin-bottom: 0;
        }
      }

      .coupon-content-area {
        padding: 16px;
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;

        .coupon-info {
          width: 100%;

          .coupon-name {
            font-size: 14px;
          }
        }

        .coupon-actions {
          width: 100%;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }
    }
  }
}
</style>
