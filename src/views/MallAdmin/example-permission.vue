<template>
    <div class="permission-example">
        <h2>权限控制示例</h2>

        <!-- 使用权限指令控制元素显示 -->
        <div v-permission="'users'" class="permission-block">
            <h3>用户管理权限</h3>
            <p>只有拥有用户管理权限的用户才能看到这个内容</p>
        </div>

        <div v-permission="'products'" class="permission-block">
            <h3>商品管理权限</h3>
            <p>只有拥有商品管理权限的用户才能看到这个内容</p>
        </div>

        <div v-permission="'orders'" class="permission-block">
            <h3>订单管理权限</h3>
            <p>只有拥有订单管理权限的用户才能看到这个内容</p>
        </div>

        <!-- 使用composable控制逻辑 -->
        <div class="permission-info">
            <h3>权限信息</h3>
            <p>是否为超级管理员: {{ isSuperAdmin ? '是' : '否' }}</p>
            <p>是否有商品管理权限: {{ canManageProducts ? '是' : '否' }}</p>
            <p>是否有订单管理权限: {{ canManageOrders ? '是' : '否' }}</p>
            <p>是否有用户管理权限: {{ canManageUsers ? '是' : '否' }}</p>
        </div>

        <!-- 条件渲染 -->
        <div v-if="canAccess('users')" class="conditional-block">
            <h3>条件渲染示例</h3>
            <p>这个内容只有拥有用户管理权限的用户才能看到</p>
        </div>

        <!-- 按钮权限控制 -->
        <div class="button-permissions">
            <el-button v-if="canAccess('users')" type="primary">管理用户</el-button>
            <el-button v-if="canAccess('products')" type="success">管理商品</el-button>
            <el-button v-if="canAccess('orders')" type="warning">管理订单</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';

// 使用权限控制
const {
    canAccess,
    isSuperAdmin,
    canManageProducts,
    canManageOrders,
    canManageUsers
} = useAuth();
</script>

<style scoped>
.permission-example {
    padding: 20px;
}

.permission-block {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #f5f7fa;
}

.permission-info {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #409eff;
    border-radius: 4px;
    background-color: #ecf5ff;
}

.conditional-block {
    margin: 20px 0;
    padding: 15px;
    border: 1px solid #67c23a;
    border-radius: 4px;
    background-color: #f0f9ff;
}

.button-permissions {
    margin: 20px 0;
}

.button-permissions .el-button {
    margin-right: 10px;
}
</style>
