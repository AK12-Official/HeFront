<template>
    <div class="admin-orders">
        <!-- 搜索和操作栏 -->
        <div class="search-bar">
            <el-form :model="searchForm" inline>
                <el-form-item label="订单编号">
                    <el-input v-model="searchForm.orderSn" placeholder="请输入订单编号" clearable style="width: 200px" />
                </el-form-item>

                <el-form-item label="订单状态">
                    <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
                        <el-option label="待付款" :value="0" />
                        <el-option label="待发货" :value="1" />
                        <el-option label="已发货" :value="2" />
                        <el-option label="已完成" :value="3" />
                        <el-option label="已关闭" :value="4" />
                        <el-option label="无效订单" :value="5" />
                    </el-select>
                </el-form-item>

                <el-form-item label="收货人">
                    <el-input v-model="searchForm.receiverKeyword" placeholder="姓名/手机号" clearable
                        style="width: 150px" />
                </el-form-item>

                <el-form-item label="创建时间">
                    <el-date-picker v-model="searchForm.createTime" type="date" placeholder="选择日期"
                        style="width: 150px" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleSearch" :loading="loading">
                        <el-icon>
                            <Search />
                        </el-icon>
                        搜索
                    </el-button>
                    <el-button @click="handleReset">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 订单列表表格 -->
        <div class="table-container">
            <el-table :data="tableData" :loading="loading" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="id" label="订单ID" width="80" />

                <el-table-column label="订单信息" min-width="200">
                    <template #default="{ row }">
                        <div class="order-info">
                            <div class="order-sn">订单号：{{ row.orderSn || row.id }}</div>
                            <div class="member-info">会员：{{ row.memberUsername }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="金额信息" width="150">
                    <template #default="{ row }">
                        <div class="amount-info">
                            <div class="total-amount">总额：¥{{ row.totalAmount }}</div>
                            <div class="pay-amount">实付：¥{{ row.payAmount }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="收货人信息" min-width="180">
                    <template #default="{ row }">
                        <div class="receiver-info">
                            <div class="receiver-name">{{ row.receiverName }}</div>
                            <div class="receiver-phone">{{ row.receiverPhone }}</div>
                            <div class="receiver-address" :title="getFullAddress(row)">
                                {{ getShortAddress(row) }}
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="订单状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">
                            {{ getStatusText(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="物流信息" width="150">
                    <template #default="{ row }">
                        <div v-if="row.deliveryCompany || row.deliverySn" class="delivery-info">
                            <div v-if="row.deliveryCompany">{{ row.deliveryCompany }}</div>
                            <div v-if="row.deliverySn" class="delivery-sn">{{ row.deliverySn }}</div>
                        </div>
                        <span v-else class="no-delivery">未发货</span>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="创建时间" width="180">
                    <template #default="{ row }">
                        {{ formatTime(row.createTime) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleViewDetail(row)">
                            详情
                        </el-button>
                        <el-button v-if="row.status === 1" type="success" size="small" @click="handleDelivery(row)">
                            发货
                        </el-button>
                        <el-button v-if="[0, 1].includes(row.status)" type="warning" size="small"
                            @click="handleClose(row)">
                            关闭
                        </el-button>
                        <el-button type="danger" size="small" @click="handleDelete(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-container">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 50]"
                :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

        <!-- 批量操作 -->
        <div class="batch-actions" v-if="selectedRows.length > 0">
            <el-alert :title="`已选择 ${selectedRows.length} 项`" type="info" :closable="false"
                style="margin-bottom: 10px;" />
            <div class="batch-buttons">
                <el-button type="warning" @click="handleBatchClose">批量关闭</el-button>
                <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
            </div>
        </div>

        <!-- 发货对话框 -->
        <el-dialog v-model="deliveryDialogVisible" title="订单发货" width="500px">
            <el-form :model="deliveryForm" label-width="100px">
                <el-form-item label="物流公司">
                    <el-input v-model="deliveryForm.deliveryCompany" placeholder="请输入物流公司" />
                </el-form-item>
                <el-form-item label="物流单号">
                    <el-input v-model="deliveryForm.deliverySn" placeholder="请输入物流单号" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="deliveryDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleDeliveryConfirm" :loading="deliveryLoading">
                    确定发货
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { AdminOrder, AdminOrderListParams, OrderCloseParams } from '@/api/malladmin/types';

const router = useRouter();

// 响应式数据
const loading = ref(false);
const deliveryLoading = ref(false);
const deliveryDialogVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<AdminOrder[]>([]);
const selectedRows = ref<AdminOrder[]>([]);

// 搜索表单
const searchForm = reactive<AdminOrderListParams>({
    orderSn: '',
    status: undefined,
    receiverKeyword: '',
    createTime: ''
});

// 发货表单
const deliveryForm = reactive({
    orderId: 0,
    deliveryCompany: '',
    deliverySn: ''
});

// 方法
const loadData = async () => {
    loading.value = true;
    try {
        const params: AdminOrderListParams = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            ...searchForm
        };

        // 格式化日期参数
        if (searchForm.createTime) {
            params.createTime = searchForm.createTime;
        }

        const result = await malladmin.getOrderList(params);

        if (result.code === 200) {
            tableData.value = result.data.list;
            total.value = result.data.total;
        } else {
            ElMessage.error(result.message || '加载数据失败');
        }
    } catch (error: unknown) {
        console.error('加载数据失败:', error);
        ElMessage.error('加载数据失败');
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    currentPage.value = 1;
    loadData();
};

const handleReset = () => {
    searchForm.orderSn = '';
    searchForm.status = undefined;
    searchForm.receiverKeyword = '';
    searchForm.createTime = '';
    currentPage.value = 1;
    loadData();
};

const handleSizeChange = (size: number) => {
    pageSize.value = size;
    currentPage.value = 1;
    loadData();
};

const handleCurrentChange = (page: number) => {
    currentPage.value = page;
    loadData();
};

const handleSelectionChange = (rows: AdminOrder[]) => {
    selectedRows.value = rows;
};

const handleViewDetail = (row: AdminOrder) => {
    router.push(`/mall/admin/orders/${row.id}`);
};

const handleDelivery = (row: AdminOrder) => {
    deliveryForm.orderId = row.id;
    deliveryForm.deliveryCompany = row.deliveryCompany || '';
    deliveryForm.deliverySn = row.deliverySn || '';
    deliveryDialogVisible.value = true;
};

const handleDeliveryConfirm = async () => {
    try {
        deliveryLoading.value = true;

        const params = {
            deliveryParamList: [{
                orderId: deliveryForm.orderId,
                deliveryCompany: deliveryForm.deliveryCompany,
                deliverySn: deliveryForm.deliverySn
            }]
        };

        const result = await malladmin.batchDeliveryOrder(params);

        if (result.code === 200) {
            ElMessage.success('发货成功');
            deliveryDialogVisible.value = false;
            loadData();
        } else {
            ElMessage.error(result.message || '发货失败');
        }
    } catch (error: unknown) {
        console.error('发货失败:', error);
        ElMessage.error('发货失败');
    } finally {
        deliveryLoading.value = false;
    }
};

const handleClose = async (row: AdminOrder) => {
    try {
        await ElMessageBox.confirm(`确定要关闭订单 "${row.orderSn || row.id}" 吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const params: OrderCloseParams = {
            ids: [row.id],
            note: '管理员手动关闭订单'
        };

        const result = await malladmin.batchCloseOrder(params);

        if (result.code === 200) {
            ElMessage.success('关闭成功');
            loadData();
        } else {
            ElMessage.error(result.message || '关闭失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('关闭失败:', error);
            ElMessage.error('关闭失败');
        }
    }
};

const handleDelete = async (row: AdminOrder) => {
    try {
        await ElMessageBox.confirm(`确定要删除订单 "${row.orderSn || row.id}" 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const result = await malladmin.batchDeleteOrder([row.id]);

        if (result.code === 200) {
            ElMessage.success('删除成功');
            loadData();
        } else {
            ElMessage.error(result.message || '删除失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('删除失败:', error);
            ElMessage.error('删除失败');
        }
    }
};

const handleBatchClose = async () => {
    try {
        const orderIds = selectedRows.value.map(row => row.orderSn || row.id).join('、');
        await ElMessageBox.confirm(`确定要批量关闭选中的 ${selectedRows.value.length} 个订单吗？订单：${orderIds}`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const params: OrderCloseParams = {
            ids: selectedRows.value.map(row => row.id),
            note: '批量关闭订单'
        };

        const result = await malladmin.batchCloseOrder(params);

        if (result.code === 200) {
            ElMessage.success('批量关闭成功');
            selectedRows.value = [];
            loadData();
        } else {
            ElMessage.error(result.message || '批量关闭失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量关闭失败:', error);
            ElMessage.error('批量关闭失败');
        }
    }
};

const handleBatchDelete = async () => {
    try {
        const orderIds = selectedRows.value.map(row => row.orderSn || row.id).join('、');
        await ElMessageBox.confirm(`确定要批量删除选中的 ${selectedRows.value.length} 个订单吗？订单：${orderIds}`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const ids = selectedRows.value.map(row => row.id);
        const result = await malladmin.batchDeleteOrder(ids);

        if (result.code === 200) {
            ElMessage.success('批量删除成功');
            selectedRows.value = [];
            loadData();
        } else {
            ElMessage.error(result.message || '批量删除失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量删除失败:', error);
            ElMessage.error('批量删除失败');
        }
    }
};

const getStatusType = (status: number) => {
    const typeMap: Record<number, string> = {
        0: 'warning',  // 待付款
        1: 'primary',  // 待发货
        2: 'success',  // 已发货
        3: 'success',  // 已完成
        4: 'info',     // 已关闭
        5: 'danger'    // 无效订单
    };
    return typeMap[status] || 'info';
};

const getStatusText = (status: number) => {
    const textMap: Record<number, string> = {
        0: '待付款',
        1: '待发货',
        2: '已发货',
        3: '已完成',
        4: '已关闭',
        5: '无效订单'
    };
    return textMap[status] || '未知';
};

const getFullAddress = (row: AdminOrder) => {
    return `${row.receiverProvince || ''}${row.receiverCity || ''}${row.receiverRegion || ''}${row.receiverDetailAddress || ''}`;
};

const getShortAddress = (row: AdminOrder) => {
    const fullAddress = getFullAddress(row);
    return fullAddress.length > 20 ? fullAddress.substring(0, 20) + '...' : fullAddress;
};

const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(time).toLocaleString('zh-CN');
};

onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
.admin-orders {
    .search-bar {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .table-container {
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        margin-bottom: 20px;

        .order-info {
            .order-sn {
                font-weight: 500;
                color: #303133;
                margin-bottom: 4px;
            }

            .member-info {
                font-size: 12px;
                color: #909399;
            }
        }

        .amount-info {
            .total-amount {
                font-weight: 500;
                color: #303133;
                margin-bottom: 4px;
            }

            .pay-amount {
                font-size: 12px;
                color: #e6a23c;
                font-weight: 600;
            }
        }

        .receiver-info {
            .receiver-name {
                font-weight: 500;
                color: #303133;
                margin-bottom: 2px;
            }

            .receiver-phone {
                font-size: 12px;
                color: #606266;
                margin-bottom: 2px;
            }

            .receiver-address {
                font-size: 12px;
                color: #909399;
                line-height: 1.4;
            }
        }

        .delivery-info {
            .delivery-sn {
                font-size: 12px;
                color: #909399;
                margin-top: 2px;
            }
        }

        .no-delivery {
            color: #c0c4cc;
            font-size: 12px;
        }
    }

    .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .batch-actions {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        z-index: 1000;

        .batch-buttons {
            display: flex;
            gap: 10px;
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .admin-orders {
        .search-bar {
            :deep(.el-form-item) {
                width: 100%;
                margin-bottom: 15px;

                .el-form-item__content {
                    width: 100%;
                }
            }
        }

        .batch-actions {
            left: 10px;
            right: 10px;
            transform: none;

            .batch-buttons {
                justify-content: center;
            }
        }
    }
}
</style>
