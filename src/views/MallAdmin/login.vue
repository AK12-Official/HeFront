<template>
    <div class="admin-login">
        <div class="login-container">
            <div class="login-header">
                <div class="logo">
                    <el-icon class="logo-icon" size="32">
                        <ShoppingCart />
                    </el-icon>
                    <h1 class="title">爱心商城 后台管理</h1>
                </div>
                <p class="subtitle">管理员登录</p>
            </div>

            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form" size="large">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" clearable />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock"
                        show-password @keyup.enter="handleLogin" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="login-btn" :loading="loginLoading" @click="handleLogin">
                        {{ loginLoading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>

            <div class="login-footer">
                <el-divider>
                    <span class="divider-text">其他操作</span>
                </el-divider>

                <div class="footer-links">
                    <el-button type="text" @click="showRegisterDialog = true">
                        注册账号
                    </el-button>
                    <el-button type="text" @click="showForgotDialog = true">
                        忘记密码
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 注册对话框 -->
        <el-dialog v-model="showRegisterDialog" title="注册管理员账号" width="450px" :close-on-click-modal="false">
            <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱" />
                </el-form-item>

                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="registerForm.nickName" placeholder="请输入昵称" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="showRegisterDialog = false">取消</el-button>
                <el-button type="primary" @click="handleRegister" :loading="registerLoading">
                    注册
                </el-button>
            </template>
        </el-dialog>

        <!-- 忘记密码对话框 -->
        <el-dialog v-model="showForgotDialog" title="忘记密码" width="400px" :close-on-click-modal="false">
            <el-alert title="联系系统管理员" description="如果您忘记了密码，请联系系统管理员重置密码。" type="info" :closable="false" />

            <template #footer>
                <el-button @click="showForgotDialog = false">知道了</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ShoppingCart } from '@element-plus/icons-vue';
import { malladmin } from '@/api';
import type { AdminLoginParams, AdminRegisterParams } from '@/api/malladmin/types';
import useMallUserStore from '@/store/modules/mallUser';
import useUserStore from '@/store/modules/user';
import { clearAllUserData } from '@/utils/logout';

const router = useRouter();
const mallUserStore = useMallUserStore();
const userStore = useUserStore();

// 响应式数据
const loginLoading = ref(false);
const registerLoading = ref(false);
const showRegisterDialog = ref(false);
const showForgotDialog = ref(false);

// 表单引用
const loginFormRef = ref();
const registerFormRef = ref();

// 登录表单
const loginForm = reactive<AdminLoginParams>({
    username: '',
    password: ''
});

// 注册表单
const registerForm = reactive<AdminRegisterParams>({
    username: '',
    password: '',
    email: '',
    nickName: ''
});

// 登录表单验证规则
const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ]
};

// 注册表单验证规则
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
    ],
    nickName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' }
    ]
};

// 登录处理
const handleLogin = async () => {
    if (!loginFormRef.value) return;

    try {
        await loginFormRef.value.validate();
        loginLoading.value = true;

        // 在登录前清除前台用户信息
        mallUserStore.mallLogout();
        userStore.userLogout();
        clearAllUserData();

        const result = await malladmin.login(loginForm);

        if (result.code === 200) {
            // 保存管理员token
            localStorage.setItem('admin_token', result.data.token);

            ElMessage.success('登录成功');
            // 使用replace避免返回登录页
            router.replace('/mall/admin');
        } else {
            ElMessage.error(result.message || '登录失败');
        }
    } catch (error: unknown) {
        console.error('登录失败:', error);
        ElMessage.error('登录失败，请检查用户名和密码');
    } finally {
        loginLoading.value = false;
    }
};

// 注册处理
const handleRegister = async () => {
    if (!registerFormRef.value) return;

    try {
        await registerFormRef.value.validate();
        registerLoading.value = true;

        const result = await malladmin.register(registerForm);

        if (result.code === 200) {
            ElMessage.success('注册成功，请登录');
            showRegisterDialog.value = false;

            // 清空注册表单
            registerFormRef.value.resetFields();

            // 将注册的用户名填入登录表单
            loginForm.username = registerForm.username;
        } else {
            ElMessage.error(result.message || '注册失败');
        }
    } catch (error: unknown) {
        console.error('注册失败:', error);
        ElMessage.error('注册失败，请重试');
    } finally {
        registerLoading.value = false;
    }
};

// 登录页面不需要检查登录状态，路由守卫已经处理了
onMounted(() => {
    // 页面加载完成
});
</script>

<style scoped lang="scss">
.admin-login {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.login-container {
    width: 100%;
    max-width: 400px;
    background: white;
    border-radius: 12px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.login-header {
    text-align: center;
    margin-bottom: 40px;

    .logo {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 15px;

        .logo-icon {
            color: #409eff;
            margin-right: 10px;
        }

        .title {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #303133;
        }
    }

    .subtitle {
        margin: 0;
        color: #909399;
        font-size: 16px;
    }
}

.login-form {
    .el-form-item {
        margin-bottom: 25px;

        :deep(.el-input__wrapper) {
            border-radius: 8px;
            box-shadow: 0 0 0 1px #dcdfe6 inset;
            transition: all 0.3s;

            &:hover {
                box-shadow: 0 0 0 1px #c0c4cc inset;
            }

            &.is-focus {
                box-shadow: 0 0 0 1px #409eff inset;
            }
        }
    }

    .login-btn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 8px;
        background: linear-gradient(135deg, #409eff 0%, #6bb8ff 100%);
        border: none;
        transition: all 0.3s;

        &:hover {
            background: linear-gradient(135deg, #66b1ff 0%, #8cc8ff 100%);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }

        &:active {
            transform: translateY(0);
        }
    }
}

.login-footer {
    margin-top: 30px;

    .divider-text {
        color: #909399;
        font-size: 12px;
    }

    .footer-links {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;

        .el-button {
            color: #409eff;
            font-size: 14px;

            &:hover {
                color: #66b1ff;
            }
        }
    }
}

// 响应式设计
@media (max-width: 480px) {
    .login-container {
        padding: 30px 20px;
    }

    .login-header .logo .title {
        font-size: 20px;
    }
}
</style>
