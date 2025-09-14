<template>
    <div class="test-login">
        <h1>测试登录页面</h1>
        <p>如果您能看到这个页面，说明路由和组件加载正常</p>
        <el-button type="primary" @click="goToRealLogin">前往真实登录页面</el-button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goToRealLogin = () => {
    router.push('/mall/admin/login');
};
</script>

<style scoped>
.test-login {
    padding: 50px;
    text-align: center;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

h1 {
    color: #409eff;
    margin-bottom: 20px;
}

p {
    color: #606266;
    margin-bottom: 30px;
}
</style>
