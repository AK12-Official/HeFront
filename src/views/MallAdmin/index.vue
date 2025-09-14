<template>
    <div class="admin-dashboard">
        <!-- 系统介绍 -->
        <div class="welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <h1>爱心商城 后台管理系统</h1>
                    <p>欢迎使用 爱心商城 电商后台管理系统，您可以通过下方的快捷操作按钮快速访问各个管理模块，进行商品、订单、用户等业务数据的管理。</p>
                </div>
                <div class="welcome-icon">
                    <el-icon size="64" color="#409eff">
                        <DataBoard />
                    </el-icon>
                </div>
            </div>
        </div>

        <!-- 快捷操作 -->
        <div class="quick-actions">
            <h3>快捷操作</h3>
            <div class="action-grid">
                <el-button type="primary" @click="$router.push('/mall/admin/pms')">
                    <el-icon>
                        <Goods />
                    </el-icon>
                    商品管理
                </el-button>

                <el-button type="success" @click="$router.push('/mall/admin/ums')">
                    <el-icon>
                        <User />
                    </el-icon>
                    用户管理
                </el-button>

                <el-button type="warning" @click="$router.push('/mall/admin/oms')">
                    <el-icon>
                        <List />
                    </el-icon>
                    订单管理
                </el-button>

                <el-button type="info" @click="$router.push('/mall/admin/categories')">
                    <el-icon>
                        <Grid />
                    </el-icon>
                    分类管理
                </el-button>

                <el-button type="primary" @click="$router.push('/mall/admin/roles')">
                    <el-icon>
                        <Setting />
                    </el-icon>
                    角色管理
                </el-button>

                <el-button type="success" @click="$router.push('/mall/admin/resources')">
                    <el-icon>
                        <Files />
                    </el-icon>
                    资源管理
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { User, Goods, List, Grid, Setting, Files, DataBoard } from '@element-plus/icons-vue';
</script>

<style scoped lang="scss">
.admin-dashboard {
    padding: 20px;
}

.welcome-section {
    margin-bottom: 30px;

    .welcome-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 12px;
        padding: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: white;
        box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

        .welcome-content {
            flex: 1;

            h1 {
                margin: 0 0 15px 0;
                font-size: 28px;
                font-weight: 600;
            }

            p {
                margin: 0;
                font-size: 16px;
                opacity: 0.9;
                line-height: 1.6;
            }
        }

        .welcome-icon {
            margin-left: 30px;
            opacity: 0.8;
        }
    }
}

.quick-actions {
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    h3 {
        margin: 0 0 25px 0;
        color: #303133;
        font-size: 18px;
        font-weight: 600;
    }

    .action-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }

    .el-button {
        height: 60px;
        font-size: 16px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .el-icon {
            margin-right: 8px;
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .admin-dashboard {
        padding: 10px;
    }

    .welcome-card {
        flex-direction: column;
        text-align: center;
        padding: 30px 20px !important;

        .welcome-icon {
            margin-left: 0 !important;
            margin-top: 20px;
        }

        h1 {
            font-size: 24px !important;
        }

        p {
            font-size: 14px !important;
        }
    }

    .quick-actions {
        padding: 20px !important;
    }

    .action-grid {
        grid-template-columns: 1fr !important;
    }
}
</style>