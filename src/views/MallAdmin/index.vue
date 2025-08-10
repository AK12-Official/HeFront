<template>
    <div class="admin-dashboard">
        <!-- 统计卡片 -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon user">
                    <el-icon size="24">
                        <User />
                    </el-icon>
                </div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.userCount }}</div>
                    <div class="stat-label">管理员数量</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon product">
                    <el-icon size="24">
                        <Goods />
                    </el-icon>
                </div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.productCount }}</div>
                    <div class="stat-label">商品数量</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon order">
                    <el-icon size="24">
                        <List />
                    </el-icon>
                </div>
                <div class="stat-content">
                    <div class="stat-number">{{ stats.orderCount }}</div>
                    <div class="stat-label">订单数量</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon revenue">
                    <el-icon size="24">
                        <Money />
                    </el-icon>
                </div>
                <div class="stat-content">
                    <div class="stat-number">¥{{ stats.revenue }}</div>
                    <div class="stat-label">总收入</div>
                </div>
            </div>
        </div>

        <!-- 图表区域 -->
        <div class="charts-container">
            <div class="chart-card">
                <div class="card-header">
                    <h3>最近订单趋势</h3>
                </div>
                <div class="chart-content">
                    <!-- 这里可以集成图表库，如 ECharts -->
                    <div class="chart-placeholder">
                        订单趋势图表区域
                    </div>
                </div>
            </div>

            <div class="chart-card">
                <div class="card-header">
                    <h3>商品分类统计</h3>
                </div>
                <div class="chart-content">
                    <div class="chart-placeholder">
                        商品分类统计图表区域
                    </div>
                </div>
            </div>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
            <h3>快捷操作</h3>
            <div class="action-grid">
                <el-button type="primary" @click="$router.push('/mall/admin/products/create')">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    添加商品
                </el-button>

                <el-button type="success" @click="$router.push('/mall/admin/users')">
                    <el-icon>
                        <User />
                    </el-icon>
                    用户管理
                </el-button>

                <el-button type="warning" @click="$router.push('/mall/admin/orders')">
                    <el-icon>
                        <ShoppingBag />
                    </el-icon>
                    订单管理
                </el-button>

                <el-button type="info" @click="$router.push('/mall/admin/categories')">
                    <el-icon>
                        <Grid />
                    </el-icon>
                    分类管理
                </el-button>
            </div>
        </div>

        <!-- 系统信息 -->
        <div class="system-info">
            <h3>系统信息</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">系统版本：</span>
                    <span class="info-value">MallLite v1.0</span>
                </div>
                <div class="info-item">
                    <span class="info-label">运行时间：</span>
                    <span class="info-value">{{ uptime }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">最后登录：</span>
                    <span class="info-value">{{ lastLoginTime }}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">服务器状态：</span>
                    <span class="info-value status-online">正常</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { User, Goods, List, Money, Plus, Grid } from '@element-plus/icons-vue';

// 统计数据
const stats = ref({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    revenue: '0.00'
});

// 系统信息
const uptime = ref('1天 3小时 25分钟');
const lastLoginTime = ref('2025-08-10 09:30:00');

// 模拟获取统计数据
const loadStats = () => {
    // 这里应该调用真实的API获取统计数据
    stats.value = {
        userCount: 15,
        productCount: 128,
        orderCount: 523,
        revenue: '158,920.50'
    };
};

// 格式化时间
const formatTime = () => {
    const now = new Date();
    lastLoginTime.value = now.toLocaleString('zh-CN');
};

onMounted(() => {
    loadStats();
    formatTime();
});
</script>

<style scoped lang="scss">
.admin-dashboard {
    padding: 20px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: white;

        &.user {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        &.product {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        &.order {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        &.revenue {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
    }

    .stat-content {
        .stat-number {
            font-size: 28px;
            font-weight: bold;
            color: #303133;
            margin-bottom: 5px;
        }

        .stat-label {
            font-size: 14px;
            color: #909399;
        }
    }
}

.charts-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .card-header {
        border-bottom: 1px solid #e4e7ed;
        padding-bottom: 15px;
        margin-bottom: 20px;

        h3 {
            margin: 0;
            color: #303133;
            font-size: 18px;
            font-weight: 600;
        }
    }

    .chart-content {
        height: 300px;

        .chart-placeholder {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f5f7fa;
            border-radius: 4px;
            color: #909399;
            font-size: 16px;
        }
    }
}

.quick-actions {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
        margin: 0 0 20px 0;
        color: #303133;
        font-size: 18px;
        font-weight: 600;
    }

    .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 15px;

        .el-button {
            height: 50px;
            font-size: 14px;
        }
    }
}

.system-info {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    h3 {
        margin: 0 0 20px 0;
        color: #303133;
        font-size: 18px;
        font-weight: 600;
    }

    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
    }

    .info-item {
        display: flex;
        align-items: center;

        .info-label {
            color: #606266;
            margin-right: 10px;
            min-width: 80px;
        }

        .info-value {
            color: #303133;
            font-weight: 500;

            &.status-online {
                color: #67c23a;
            }
        }
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .charts-container {
        grid-template-columns: 1fr;
    }
}
</style>
