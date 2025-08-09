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
          disabled: !coupon.available
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
                  领取后{{ coupon.enableTime }}天内有效
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

interface Coupon {
  id: number
  name: string
  amount: number
  minPoint?: number
  note?: string
  startTime?: string
  endTime?: string
  enableTime?: number
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
const loadCouponList = () => {
  loading.value = true

  // 模拟数据
  setTimeout(() => {
    const mockData: Coupon[] = [
      {
        id: 1,
        name: '新用户专享券',
        amount: 20,
        minPoint: 100,
        note: '仅限首次购买使用',
        startTime: '2024-01-01',
        endTime: '2024-12-31',
        useStatus: 0,
        available: true
      },
      {
        id: 2,
        name: '满减优惠券',
        amount: 50,
        minPoint: 300,
        note: '适用于全场商品',
        startTime: '2024-01-01',
        endTime: '2024-06-30',
        useStatus: 1,
        available: false
      },
      {
        id: 3,
        name: '生日特惠券',
        amount: 30,
        minPoint: 200,
        note: '生日月专享',
        startTime: '2024-01-01',
        endTime: '2024-01-31',
        useStatus: 2,
        available: false
      },
      {
        id: 4,
        name: '无门槛券',
        amount: 10,
        note: '无最低消费限制',
        enableTime: 30,
        useStatus: 0,
        available: true
      }
    ]

    // 根据activeTab过滤数据
    let filteredData = mockData
    if (activeTab.value !== -1) {
      filteredData = mockData.filter(item => item.useStatus === activeTab.value)
    }

    couponList.value = filteredData
    total.value = filteredData.length
    loading.value = false
  }, 500)
}

// 格式化时间
const formatTime = (time: string): string => {
  if (!time) return ''
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN')
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

      &.expired,
      &.used {
        opacity: 0.6;
      }

      &.disabled {
        .coupon-left {
          background: #f5f5f5;
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
          }

          .amount {
            font-size: 24px;
            font-weight: 600;
          }
        }

        .coupon-condition {
          font-size: 12px;
          opacity: 0.9;
          text-align: center;
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

            .status-unused {
              color: #67c23a;
              font-weight: 600;
            }

            .status-used {
              color: #909399;
            }

            .status-expired {
              color: #f56c6c;
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
