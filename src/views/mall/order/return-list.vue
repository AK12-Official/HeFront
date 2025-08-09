<!-- 退货申请列表页面 -->
<template>
    <div class="return-list-container">
        <div class="page-header">
            <h2>我的退货申请</h2>
        </div>

        <div v-if="loading" class="loading-section">
            <el-text>正在加载退货申请...</el-text>
        </div>

        <div v-else-if="returnList.length === 0" class="empty-section">
            <el-empty description="暂无退货申请">
                <el-button type="primary" @click="goShopping">去购物</el-button>
            </el-empty>
        </div>

        <div v-else class="return-content">
            <div class="return-list">
                <div v-for="item in returnList" :key="item.id" class="return-item">
                    <div class="return-header">
                        <div class="return-info">
                            <span class="return-id">申请编号：{{ item.id }}</span>
                            <span class="return-time">申请时间：{{ formatTime(item.createTime) }}</span>
                        </div>
                        <div class="return-status" :class="getStatusClass(item.status)">
                            {{ getStatusText(item.status) }}
                        </div>
                    </div>

                    <div class="return-product">
                        <img :src="item.productPic" :alt="item.productName" class="product-image" />
                        <div class="product-info">
                            <h4 class="product-name">{{ item.productName }}</h4>
                            <p class="return-reason">退货原因：{{ item.reason }}</p>
                            <div class="return-amount">
                                <span class="label">退货金额：</span>
                                <span class="amount">¥{{ item.returnAmount }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="return-footer">
                        <div class="contact-info">
                            <span>联系人：{{ item.returnName }}</span>
                            <span>联系电话：{{ item.returnPhone }}</span>
                        </div>
                        <div class="return-actions">
                            <el-button size="small" @click="viewReturnDetail(item.id)">
                                查看详情
                            </el-button>
                            <el-button v-if="item.status === 0" size="small" type="danger"
                                @click="cancelReturn(item.id)">
                                撤销申请
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
// import { returnApplyList, returnApplyCancel } from '@/api/mall'

const router = useRouter()

// 数据
const loading = ref(true)
const returnList = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 模拟数据 - 实际使用时应该从API获取
const mockReturnList = [
    {
        id: 1,
        orderSn: '202403010001',
        createTime: '2024-03-05 10:30:00',
        returnAmount: 299.00,
        returnName: '张三',
        returnPhone: '13888888888',
        status: 0,
        productPic: '/images/product/demo.jpg',
        productName: '测试商品',
        reason: '质量问题'
    }
]

// 状态文本映射
const getStatusText = (status: number): string => {
    const statusMap: Record<number, string> = {
        0: '待审核',
        1: '已同意',
        2: '已拒绝',
        3: '已退货',
        4: '已完成',
        5: '已取消'
    }
    return statusMap[status] || '未知状态'
}

// 状态样式类映射
const getStatusClass = (status: number): string => {
    const classMap: Record<number, string> = {
        0: 'status-pending',
        1: 'status-approved',
        2: 'status-rejected',
        3: 'status-returned',
        4: 'status-completed',
        5: 'status-cancelled'
    }
    return classMap[status] || ''
}

// 加载退货申请列表
const loadReturnList = async () => {
    try {
        loading.value = true

        // 实际使用时应该调用API
        // const response = await returnApplyList({
        //   page: currentPage.value,
        //   size: pageSize.value
        // })
        // returnList.value = response.data.list
        // total.value = response.data.total

        // 模拟数据
        setTimeout(() => {
            returnList.value = mockReturnList
            total.value = mockReturnList.length
            loading.value = false
        }, 1000)
    } catch (error) {
        console.error('加载退货申请列表失败:', error)
        ElMessage.error('加载退货申请列表失败')
        loading.value = false
    }
}

// 查看退货详情
const viewReturnDetail = (returnId: number) => {
    // 这里可以跳转到退货详情页面或显示详情弹窗
    ElMessage.info(`查看退货详情：${returnId}`)
}

// 撤销退货申请
const cancelReturn = async (returnId: number) => {
    try {
        if (!confirm('确定要撤销此退货申请吗？')) {
            return
        }

        // 实际使用时应该调用API
        // await returnApplyCancel(returnId)

        ElMessage.success('退货申请已撤销')
        loadReturnList()
    } catch (error) {
        console.error('撤销退货申请失败:', error)
        ElMessage.error('撤销退货申请失败')
    }
}

// 分页处理
const handlePageChange = (page: number) => {
    currentPage.value = page
    loadReturnList()
}

// 格式化时间
const formatTime = (time: string): string => {
    return new Date(time).toLocaleString('zh-CN')
}

// 去购物
const goShopping = () => {
    router.push('/mall/home')
}

onMounted(() => {
    loadReturnList()
})
</script>

<style scoped lang="scss">
.return-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 30px;

    h2 {
        color: #333;
        font-size: 24px;
        margin: 0;
    }
}

.loading-section,
.empty-section {
    text-align: center;
    padding: 60px 20px;
}

.return-content {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
}

.return-list {
    .return-item {
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 16px;
        overflow: hidden;

        .return-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #eee;

            .return-info {
                display: flex;
                gap: 20px;

                .return-id {
                    font-weight: 500;
                    color: #333;
                }

                .return-time {
                    color: #666;
                    font-size: 14px;
                }
            }

            .return-status {
                padding: 4px 12px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 500;

                &.status-pending {
                    background: #fff7e6;
                    color: #fa8c16;
                }

                &.status-approved {
                    background: #f6ffed;
                    color: #52c41a;
                }

                &.status-rejected {
                    background: #fff2f0;
                    color: #ff4d4f;
                }

                &.status-returned {
                    background: #e6f7ff;
                    color: #1890ff;
                }

                &.status-completed {
                    background: #f6ffed;
                    color: #52c41a;
                }

                &.status-cancelled {
                    background: #f5f5f5;
                    color: #999;
                }
            }
        }

        .return-product {
            display: flex;
            padding: 20px;
            gap: 16px;

            .product-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
                border: 1px solid #eee;
            }

            .product-info {
                flex: 1;

                .product-name {
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0 0 8px 0;
                    color: #333;
                }

                .return-reason {
                    font-size: 14px;
                    color: #666;
                    margin: 0 0 8px 0;
                }

                .return-amount {
                    .label {
                        color: #666;
                    }

                    .amount {
                        color: #f56c6c;
                        font-weight: 500;
                        font-size: 16px;
                    }
                }
            }
        }

        .return-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 20px;
            background: #fafafa;
            border-top: 1px solid #eee;

            .contact-info {
                display: flex;
                gap: 20px;
                font-size: 14px;
                color: #666;
            }

            .return-actions {
                display: flex;
                gap: 8px;
            }
        }
    }
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}
</style>
