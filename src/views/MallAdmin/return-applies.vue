<template>
    <div class="admin-return-applies">
        <!-- 搜索和操作栏 -->
        <div class="search-bar">
            <el-form :model="searchForm" inline>
                <el-form-item label="申请编号">
                    <el-input v-model="searchForm.id" placeholder="请输入申请编号" clearable style="width: 150px" />
                </el-form-item>

                <el-form-item label="订单编号">
                    <el-input v-model="searchForm.orderSn" placeholder="请输入订单编号" clearable style="width: 200px" />
                </el-form-item>

                <el-form-item label="处理状态">
                    <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
                        <el-option label="待处理" :value="0" />
                        <el-option label="退货中" :value="1" />
                        <el-option label="已完成" :value="2" />
                        <el-option label="已拒绝" :value="3" />
                    </el-select>
                </el-form-item>

                <el-form-item label="处理人">
                    <el-input v-model="searchForm.handleMan" placeholder="请输入处理人" clearable style="width: 120px" />
                </el-form-item>

                <el-form-item label="申请时间">
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

        <!-- 退货申请列表表格 -->
        <div class="table-container">
            <el-table :data="tableData" :loading="loading" stripe style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" />

                <el-table-column prop="id" label="申请ID" width="80" />

                <el-table-column label="订单信息" min-width="200">
                    <template #default="{ row }">
                        <div class="order-info">
                            <div class="order-sn">订单号：{{ row.orderSn }}</div>
                            <div class="member-info">会员：{{ row.memberUsername }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="商品信息" min-width="250">
                    <template #default="{ row }">
                        <div class="product-info">
                            <!-- 如果后端返回商品图片且不为空，则显示图片 -->
                            <div v-if="row.productPic && row.productPic !== null && row.productPic !== ''"
                                class="product-image">
                                <img :src="getProductImage(row.productPic)" :alt="row.productName"
                                    @error="handleImageError" @load="handleImageLoad" loading="lazy" />
                            </div>
                            <!-- 如果没有商品图片，显示占位符 -->
                            <div v-else class="product-image-placeholder">
                                <el-icon size="24" color="#c0c4cc">
                                    <Picture />
                                </el-icon>
                            </div>
                            <div class="product-details">
                                <div class="product-name">{{ row.productName }}</div>
                                <div class="product-brand" v-if="row.productBrand">{{ row.productBrand }}</div>
                                <div class="product-attr" v-if="row.productAttr">{{ row.productAttr }}</div>
                                <div class="product-count">数量：{{ row.productCount }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="金额信息" width="150">
                    <template #default="{ row }">
                        <div class="amount-info">
                            <div class="product-price">单价：¥{{ row.productPrice }}</div>
                            <div class="return-amount">退货金额：¥{{ row.returnAmount }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="退货原因" min-width="200">
                    <template #default="{ row }">
                        <div class="reason-info">
                            <div class="reason">{{ row.reason }}</div>
                            <div class="description" v-if="row.description">{{ row.description }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="处理状态" width="100">
                    <template #default="{ row }">
                        <el-tag :type="getStatusType(row.status)">
                            {{ getStatusText(row.status) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column label="处理信息" width="150">
                    <template #default="{ row }">
                        <div class="handle-info">
                            <div v-if="row.handleMan" class="handle-man">处理人：{{ row.handleMan }}</div>
                            <div v-if="row.handleTime" class="handle-time">{{ formatTime(row.handleTime) }}</div>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column prop="createTime" label="申请时间" width="180">
                    <template #default="{ row }">
                        {{ formatTime(row.createTime) }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" size="small" @click="handleViewDetail(row)">
                            详情
                        </el-button>
                        <el-button v-if="row.status === 0" type="success" size="small" @click="handleApprove(row)">
                            通过
                        </el-button>
                        <el-button v-if="row.status === 0" type="warning" size="small" @click="handleReject(row)">
                            拒绝
                        </el-button>
                        <el-button v-if="row.status === 1" type="info" size="small" @click="handleComplete(row)">
                            完成
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
                <el-button type="success" @click="handleBatchApprove">批量通过</el-button>
                <el-button type="warning" @click="handleBatchReject">批量拒绝</el-button>
                <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
            </div>
        </div>

        <!-- 处理对话框 -->
        <el-dialog v-model="handleDialogVisible" :title="handleDialogTitle" width="500px">
            <el-form :model="handleForm" label-width="100px">
                <el-form-item label="处理备注">
                    <el-input v-model="handleForm.handleNote" type="textarea" :rows="3" placeholder="请输入处理备注" />
                </el-form-item>
                <el-form-item v-if="handleForm.status === 1" label="收货人">
                    <el-input v-model="handleForm.receiveMan" placeholder="请输入收货人" />
                </el-form-item>
                <el-form-item v-if="handleForm.status === 1" label="收货备注">
                    <el-input v-model="handleForm.receiveNote" type="textarea" :rows="2" placeholder="请输入收货备注" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleConfirm" :loading="handleLoading">
                    确定
                </el-button>
            </template>
        </el-dialog>

        <!-- 详情对话框 -->
        <el-dialog v-model="detailDialogVisible" title="退货申请详情" width="800px">
            <div v-if="currentDetail" class="detail-content">
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="申请编号">{{ currentDetail.id }}</el-descriptions-item>
                    <el-descriptions-item label="订单编号">{{ currentDetail.orderSn }}</el-descriptions-item>
                    <el-descriptions-item label="会员账号">{{ currentDetail.memberUsername }}</el-descriptions-item>
                    <el-descriptions-item label="申请时间">{{ formatTime(currentDetail.createTime) }}</el-descriptions-item>
                    <el-descriptions-item label="商品名称">{{ currentDetail.productName }}</el-descriptions-item>
                    <el-descriptions-item label="商品品牌">{{ currentDetail.productBrand || '无' }}</el-descriptions-item>
                    <el-descriptions-item label="商品属性">{{ currentDetail.productAttr || '无' }}</el-descriptions-item>
                    <el-descriptions-item label="商品数量">{{ currentDetail.productCount }}</el-descriptions-item>
                    <el-descriptions-item label="商品单价">¥{{ currentDetail.productPrice }}</el-descriptions-item>
                    <el-descriptions-item label="退货金额">¥{{ currentDetail.returnAmount }}</el-descriptions-item>
                    <el-descriptions-item label="退货原因">{{ currentDetail.reason }}</el-descriptions-item>
                    <el-descriptions-item label="处理状态">
                        <el-tag :type="getStatusType(currentDetail.status)">
                            {{ getStatusText(currentDetail.status) }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="详细描述" :span="2">{{ currentDetail.description || '无'
                    }}</el-descriptions-item>
                    <el-descriptions-item label="处理人">{{ currentDetail.handleMan || '未处理' }}</el-descriptions-item>
                    <el-descriptions-item label="处理时间">{{ currentDetail.handleTime ?
                        formatTime(currentDetail.handleTime) :
                        '未处理' }}</el-descriptions-item>
                    <el-descriptions-item label="处理备注" :span="2">{{ currentDetail.handleNote || '无'
                    }}</el-descriptions-item>
                    <el-descriptions-item v-if="currentDetail.proofPics" label="凭证图片" :span="2">
                        <div class="proof-images">
                            <img v-for="(pic, index) in currentDetail.proofPics.split(',')" :key="index" :src="pic"
                                :alt="`凭证图片${index + 1}`" @click="previewImage(pic)" class="proof-image" />
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>

        <!-- 图片预览对话框 -->
        <el-dialog v-model="imagePreviewVisible" title="图片预览" width="auto">
            <img :src="previewImageUrl" alt="预览图片" style="max-width: 100%; max-height: 80vh;" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Picture } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { AdminReturnApply, ReturnApplyListParams, ReturnApplyHandleParams, ReturnApplyBatchHandleParams } from '@/api/malladmin/types';

// 响应式数据
const loading = ref(false);
const handleLoading = ref(false);
const handleDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const imagePreviewVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<AdminReturnApply[]>([]);
const selectedRows = ref<AdminReturnApply[]>([]);
const currentDetail = ref<AdminReturnApply | null>(null);
const previewImageUrl = ref('');

// 搜索表单
const searchForm = reactive<ReturnApplyListParams>({
    id: undefined,
    orderSn: '',
    status: undefined,
    handleMan: '',
    createTime: ''
});

// 处理表单
const handleForm = reactive<ReturnApplyHandleParams>({
    id: 0,
    status: 0,
    handleNote: '',
    receiveMan: '',
    receiveNote: ''
});

// 对话框标题
const handleDialogTitle = ref('');

// 方法
const loadData = async () => {
    loading.value = true;
    try {
        const params: ReturnApplyListParams = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            ...searchForm
        };

        // 格式化日期参数
        if (searchForm.createTime) {
            params.createTime = searchForm.createTime;
        }

        const result = await malladmin.getReturnApplyList(params);

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
    searchForm.id = undefined;
    searchForm.orderSn = '';
    searchForm.status = undefined;
    searchForm.handleMan = '';
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

const handleSelectionChange = (rows: AdminReturnApply[]) => {
    selectedRows.value = rows;
};

const handleViewDetail = async (row: AdminReturnApply) => {
    try {
        const result = await malladmin.getReturnApplyDetail(row.id);
        if (result.code === 200) {
            currentDetail.value = result.data;
            detailDialogVisible.value = true;
        } else {
            ElMessage.error(result.message || '获取详情失败');
        }
    } catch (error: unknown) {
        console.error('获取详情失败:', error);
        ElMessage.error('获取详情失败');
    }
};

const handleApprove = (row: AdminReturnApply) => {
    handleForm.id = row.id;
    handleForm.status = 1; // 退货中
    handleForm.handleNote = '';
    handleForm.receiveMan = '';
    handleForm.receiveNote = '';
    handleDialogTitle.value = '通过退货申请';
    handleDialogVisible.value = true;
};

const handleReject = (row: AdminReturnApply) => {
    handleForm.id = row.id;
    handleForm.status = 3; // 已拒绝
    handleForm.handleNote = '';
    handleForm.receiveMan = '';
    handleForm.receiveNote = '';
    handleDialogTitle.value = '拒绝退货申请';
    handleDialogVisible.value = true;
};

const handleComplete = (row: AdminReturnApply) => {
    handleForm.id = row.id;
    handleForm.status = 2; // 已完成
    handleForm.handleNote = '';
    handleForm.receiveMan = '';
    handleForm.receiveNote = '';
    handleDialogTitle.value = '完成退货申请';
    handleDialogVisible.value = true;
};

const handleConfirm = async () => {
    try {
        handleLoading.value = true;

        const result = await malladmin.handleReturnApply(handleForm);

        if (result.code === 200) {
            ElMessage.success('处理成功');
            handleDialogVisible.value = false;
            loadData();
        } else {
            ElMessage.error(result.message || '处理失败');
        }
    } catch (error: unknown) {
        console.error('处理失败:', error);
        ElMessage.error('处理失败');
    } finally {
        handleLoading.value = false;
    }
};

const handleDelete = async (row: AdminReturnApply) => {
    try {
        await ElMessageBox.confirm(`确定要删除退货申请 "${row.id}" 吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const result = await malladmin.deleteReturnApply(row.id);

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

const handleBatchApprove = async () => {
    try {
        const ids = selectedRows.value.map(row => row.id);
        await ElMessageBox.confirm(`确定要批量通过选中的 ${selectedRows.value.length} 个退货申请吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const params: ReturnApplyBatchHandleParams = {
            ids,
            status: 1, // 退货中
            handleNote: '批量通过'
        };

        const result = await malladmin.batchHandleReturnApply(params);

        if (result.code === 200) {
            ElMessage.success('批量通过成功');
            selectedRows.value = [];
            loadData();
        } else {
            ElMessage.error(result.message || '批量通过失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量通过失败:', error);
            ElMessage.error('批量通过失败');
        }
    }
};

const handleBatchReject = async () => {
    try {
        const ids = selectedRows.value.map(row => row.id);
        await ElMessageBox.confirm(`确定要批量拒绝选中的 ${selectedRows.value.length} 个退货申请吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        });

        const params: ReturnApplyBatchHandleParams = {
            ids,
            status: 3, // 已拒绝
            handleNote: '批量拒绝'
        };

        const result = await malladmin.batchHandleReturnApply(params);

        if (result.code === 200) {
            ElMessage.success('批量拒绝成功');
            selectedRows.value = [];
            loadData();
        } else {
            ElMessage.error(result.message || '批量拒绝失败');
        }
    } catch (error: unknown) {
        if (error !== 'cancel') {
            console.error('批量拒绝失败:', error);
            ElMessage.error('批量拒绝失败');
        }
    }
};

const handleBatchDelete = async () => {
    try {
        const ids = selectedRows.value.map(row => row.id);
        await ElMessageBox.confirm(`确定要批量删除选中的 ${selectedRows.value.length} 个退货申请吗？此操作不可恢复！`, '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'error'
        });

        const result = await malladmin.batchDeleteReturnApply(ids);

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
        0: 'warning',  // 待处理
        1: 'primary',  // 退货中
        2: 'success',  // 已完成
        3: 'danger'    // 已拒绝
    };
    return typeMap[status] || 'info';
};

const getStatusText = (status: number) => {
    const textMap: Record<number, string> = {
        0: '待处理',
        1: '退货中',
        2: '已完成',
        3: '已拒绝'
    };
    return textMap[status] || '未知';
};

const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(time).toLocaleString('zh-CN');
};

// 获取商品图片URL
const getProductImage = (productPic: string | undefined) => {
    if (!productPic) {
        // 使用一个通用的默认图片占位符
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTI1IDI1SDM1VjM1SDI1VjI1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
    }
    // 如果图片URL是相对路径，添加完整路径
    if (productPic.startsWith('/')) {
        return productPic;
    }
    // 如果是完整URL，直接返回
    if (productPic.startsWith('http')) {
        return productPic;
    }
    // 其他情况，添加默认路径
    return `/img/products/${productPic}`;
};

const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement;
    // 避免无限循环，如果已经是默认图片就不再设置
    if (!target.src.includes('data:image/svg+xml')) {
        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMCAyMEg0MFY0MEgyMFYyMFoiIGZpbGw9IiNEOUQ5RDkiLz4KPHBhdGggZD0iTTI1IDI1SDM1VjM1SDI1VjI1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8L3N2Zz4K';
    }
};

const handleImageLoad = (event: Event) => {
    // 图片加载成功，可以在这里添加一些处理逻辑
    console.log('图片加载成功:', (event.target as HTMLImageElement).src);
};

const previewImage = (url: string) => {
    previewImageUrl.value = url;
    imagePreviewVisible.value = true;
};

onMounted(() => {
    loadData();
});
</script>

<style scoped lang="scss">
.admin-return-applies {
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

        .product-info {
            display: flex;
            align-items: center;
            gap: 10px;

            .product-image {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                overflow: hidden;
                flex-shrink: 0;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: opacity 0.3s ease;
                    background-color: #f5f5f5;
                }
            }

            .product-image-placeholder {
                width: 60px;
                height: 60px;
                border-radius: 4px;
                background-color: #f5f5f5;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px dashed #d9d9d9;
            }

            .product-details {
                flex: 1;
                min-width: 0;

                .product-name {
                    font-weight: 500;
                    color: #303133;
                    margin-bottom: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .product-brand,
                .product-attr {
                    font-size: 12px;
                    color: #909399;
                    margin-bottom: 2px;
                }

                .product-count {
                    font-size: 12px;
                    color: #606266;
                }
            }
        }

        .amount-info {
            .product-price {
                font-size: 12px;
                color: #606266;
                margin-bottom: 4px;
            }

            .return-amount {
                font-weight: 500;
                color: #e6a23c;
                font-size: 14px;
            }
        }

        .reason-info {
            .reason {
                font-weight: 500;
                color: #303133;
                margin-bottom: 4px;
            }

            .description {
                font-size: 12px;
                color: #909399;
                line-height: 1.4;
            }
        }

        .handle-info {
            .handle-man {
                font-size: 12px;
                color: #606266;
                margin-bottom: 2px;
            }

            .handle-time {
                font-size: 12px;
                color: #909399;
            }
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

    .detail-content {
        .proof-images {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;

            .proof-image {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 4px;
                cursor: pointer;
                border: 1px solid #dcdfe6;

                &:hover {
                    border-color: #409eff;
                }
            }
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .admin-return-applies {
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
