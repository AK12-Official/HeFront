<template>
  <div class="admin-products">
    <!-- 搜索和操作栏 -->
    <div class="search-bar">
      <div class="search-form">
        <el-form :model="searchForm" inline>
          <el-form-item label="商品名称">
            <el-input v-model="searchForm.keyword" placeholder="请输入商品名称" clearable style="width: 200px" />
          </el-form-item>

          <el-form-item label="商品货号">
            <el-input v-model="searchForm.productSn" placeholder="请输入商品货号" clearable style="width: 200px" />
          </el-form-item>

          <el-form-item label="上架状态">
            <el-select v-model="searchForm.publishStatus" placeholder="全部" clearable style="width: 120px">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>

          <el-form-item label="审核状态">
            <el-select v-model="searchForm.verifyStatus" placeholder="全部" clearable style="width: 120px">
              <el-option label="审核通过" :value="1" />
              <el-option label="未审核" :value="0" />
              <el-option label="审核拒绝" :value="2" />
            </el-select>
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

      <div class="action-buttons">
        <el-button type="success" @click="$router.push('/mall/admin/products/create')">
          <el-icon>
            <Plus />
          </el-icon>
          添加商品
        </el-button>
      </div>
    </div>

    <!-- 商品列表表格 -->
    <div class="table-container">
      <el-table :data="tableData" :loading="loading" stripe style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />

        <el-table-column label="商品图片" width="100">
          <template #default="{ row }">
            <el-image v-if="row.pic" :src="row.pic" :preview-src-list="[row.pic]" fit="cover"
              style="width: 60px; height: 60px; border-radius: 4px;" />
            <div v-else class="no-image">暂无图片</div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="商品名称" min-width="200">
          <template #default="{ row }">
            <div class="product-info">
              <div class="product-name">{{ row.name }}</div>
              <div class="product-sn">货号：{{ row.productSn || '无' }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="stock" label="库存" width="100">
          <template #default="{ row }">
            <el-tag :type="row.stock <= (row.lowStock || 10) ? 'danger' : 'success'">
              {{ row.stock }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="publishStatus" label="上架状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.publishStatus === 1 ? 'success' : 'info'">
              {{ row.publishStatus === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="verifyStatus" label="审核状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.verifyStatus === 1 ? 'success' : row.verifyStatus === 2 ? 'danger' : 'warning'">
              {{ getVerifyStatusText(row.verifyStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="推荐" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.recommandStatus === 1" type="warning" size="small">推荐</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="新品" width="80">
          <template #default="{ row }">
            <el-tag v-if="row.newStatus === 1" type="danger" size="small">新品</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="{ row }">
            {{ row.createTime ? formatTime(row.createTime) : '' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button :type="row.publishStatus === 1 ? 'warning' : 'success'" size="small"
              @click="handlePublishStatusChange(row)">
              {{ row.publishStatus === 1 ? '下架' : '上架' }}
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
      <el-alert :title="`已选择 ${selectedRows.length} 项`" type="info" :closable="false" style="margin-bottom: 10px;" />
      <div class="batch-buttons">
        <el-button type="success" @click="handleBatchPublish">批量上架</el-button>
        <el-button type="warning" @click="handleBatchUnpublish">批量下架</el-button>
        <el-button type="info" @click="handleBatchRecommend">批量推荐</el-button>
        <el-button type="danger" @click="handleBatchDelete">批量删除</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Refresh, Plus } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { AdminProduct, ProductListParams, ProductBatchStatusParams } from '@/api/malladmin/types';

const router = useRouter();

// 响应式数据
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref<AdminProduct[]>([]);
const selectedRows = ref<AdminProduct[]>([]);

// 搜索表单
const searchForm = reactive<ProductListParams>({
  keyword: '',
  productSn: '',
  publishStatus: undefined,
  verifyStatus: undefined
});

// 方法
const loadData = async () => {
  loading.value = true;
  try {
    const params: ProductListParams = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm
    };

    const result = await malladmin.getProductList(params);

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
  searchForm.keyword = '';
  searchForm.productSn = '';
  searchForm.publishStatus = undefined;
  searchForm.verifyStatus = undefined;
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

const handleSelectionChange = (rows: AdminProduct[]) => {
  selectedRows.value = rows;
};

const handleEdit = (row: AdminProduct) => {
  router.push(`/mall/admin/products/edit/${row.id}`);
};

const handlePublishStatusChange = async (row: AdminProduct) => {
  try {
    const newStatus = row.publishStatus === 1 ? 0 : 1;
    const action = newStatus === 1 ? '上架' : '下架';

    await ElMessageBox.confirm(`确定要${action}商品 "${row.name}" 吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    const params: ProductBatchStatusParams = {
      ids: [row.id],
      publishStatus: newStatus
    };

    const result = await malladmin.updateProductPublishStatus(params);

    if (result.code === 200) {
      ElMessage.success(`${action}成功`);
      loadData();
    } else {
      ElMessage.error(result.message || `${action}失败`);
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error('状态修改失败:', error);
      ElMessage.error('状态修改失败');
    }
  }
};

const handleDelete = async (row: AdminProduct) => {
  try {
    await ElMessageBox.confirm(`确定要删除商品 "${row.name}" 吗？此操作不可恢复！`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    });

    const params: ProductBatchStatusParams = {
      ids: [row.id],
      deleteStatus: 1
    };

    const result = await malladmin.updateProductDeleteStatus(params);

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

const handleBatchPublish = async () => {
  await handleBatchStatusUpdate('publishStatus', 1, '上架');
};

const handleBatchUnpublish = async () => {
  await handleBatchStatusUpdate('publishStatus', 0, '下架');
};

const handleBatchRecommend = async () => {
  await handleBatchStatusUpdate('recommendStatus', 1, '推荐');
};

const handleBatchDelete = async () => {
  await handleBatchStatusUpdate('deleteStatus', 1, '删除');
};

const handleBatchStatusUpdate = async (
  statusType: keyof ProductBatchStatusParams,
  status: number,
  actionName: string
) => {
  try {
    const productNames = selectedRows.value.map(row => row.name).join('、');
    await ElMessageBox.confirm(
      `确定要批量${actionName}选中的 ${selectedRows.value.length} 个商品吗？商品名：${productNames}`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const params: ProductBatchStatusParams = {
      ids: selectedRows.value.map(row => row.id),
      [statusType]: status
    };

    let result;
    switch (statusType) {
      case 'publishStatus':
        result = await malladmin.updateProductPublishStatus(params);
        break;
      case 'recommendStatus':
        result = await malladmin.updateProductRecommendStatus(params);
        break;
      case 'deleteStatus':
        result = await malladmin.updateProductDeleteStatus(params);
        break;
      default:
        throw new Error('不支持的操作类型');
    }

    if (result.code === 200) {
      ElMessage.success(`批量${actionName}成功`);
      selectedRows.value = [];
      loadData();
    } else {
      ElMessage.error(result.message || `批量${actionName}失败`);
    }
  } catch (error: unknown) {
    if (error !== 'cancel') {
      console.error(`批量${actionName}失败:`, error);
      ElMessage.error(`批量${actionName}失败`);
    }
  }
};

const getVerifyStatusText = (status: number) => {
  switch (status) {
    case 0:
      return '未审核';
    case 1:
      return '审核通过';
    case 2:
      return '审核拒绝';
    default:
      return '未知';
  }
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
.admin-products {
  .search-bar {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .search-form {
      margin-bottom: 10px;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
    }
  }

  .table-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    .no-image {
      width: 60px;
      height: 60px;
      border: 1px dashed #dcdfe6;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #909399;
      background-color: #f5f7fa;
    }

    .product-info {
      .product-name {
        font-weight: 500;
        color: #303133;
        margin-bottom: 4px;
        line-height: 1.4;
      }

      .product-sn {
        font-size: 12px;
        color: #909399;
      }
    }

    .price {
      font-weight: 600;
      color: #e6a23c;
      font-size: 14px;
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
      flex-wrap: wrap;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .admin-products {
    .search-bar {
      .search-form {
        :deep(.el-form-item) {
          width: 100%;
          margin-bottom: 15px;

          .el-form-item__content {
            width: 100%;
          }
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
