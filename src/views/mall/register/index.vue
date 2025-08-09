<template>
    <div class="container">
        <div class="register-wrapper">
            <!-- 背景装饰 -->
            <div class="bg-decoration">
                <div class="left-decoration"></div>
                <div class="right-decoration"></div>
            </div>

            <!-- 返回按钮 -->
            <el-button class="back-btn" :icon="ArrowLeft" circle @click="goBack" />

            <!-- 注册表单 -->
            <div class="register-form-container">
                <!-- Logo 区域 -->
                <div class="logo-section">
                    <img src="/img/vx_gzh.jpg" alt="Logo" class="logo">
                    <h1 class="title">创建账号</h1>
                    <p class="subtitle">加入MallLite电商平台</p>
                </div>

                <!-- 表单区域 -->
                <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" class="register-form"
                    @submit.prevent="handleRegister">
                    <el-form-item prop="username">
                        <el-input v-model="registerForm.username" placeholder="请输入用户名" size="large" :prefix-icon="User"
                            clearable />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" size="large"
                            :prefix-icon="Lock" show-password clearable />
                    </el-form-item>

                    <el-form-item prop="confirmPassword">
                        <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请确认密码"
                            size="large" :prefix-icon="Lock" show-password clearable @keyup.enter="handleRegister" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="large" class="register-btn" :loading="registerLoading"
                            @click="handleRegister">
                            {{ registerLoading ? '注册中...' : '立即注册' }}
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 底部链接 -->
                <div class="footer-links">
                    <el-link type="primary" @click="goToLogin">
                        已有账号？立即登录
                    </el-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, ArrowLeft } from '@element-plus/icons-vue'
import { ssoRegister } from '@/api/sso'
import type { SsoRegisterParams } from '@/api/sso/types'

const router = useRouter()
const registerFormRef = ref()
const registerLoading = ref(false)

// 表单数据
const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    icon: ''
})

// 表单验证规则
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (_rule: unknown, value: string, callback: (error?: Error) => void) => {
                if (value !== registerForm.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            },
            trigger: 'blur'
        }
    ]
}

// 注册处理
const handleRegister = async () => {
    if (!registerFormRef.value) return

    await registerFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            registerLoading.value = true
            try {
                const registerParams: SsoRegisterParams = {
                    username: registerForm.username,
                    password: registerForm.password,
                    icon: registerForm.icon
                }

                await ssoRegister(registerParams)

                ElMessage.success('注册成功，请登录')
                router.push('/mall/login')
            } catch (error) {
                console.error('注册失败:', error)
                ElMessage.error('注册失败，请重试')
            } finally {
                registerLoading.value = false
            }
        }
    })
}

// 返回上一页
const goBack = () => {
    router.back()
}

// 跳转登录页
const goToLogin = () => {
    router.push('/mall/login')
}
</script>

<style lang="scss" scoped>
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    position: relative;
    overflow: hidden;
}

.register-wrapper {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 400px;
}

.bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    .left-decoration,
    .right-decoration {
        position: absolute;
        width: 200px;
        height: 200px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
    }

    .left-decoration {
        top: -100px;
        left: -100px;
    }

    .right-decoration {
        bottom: -100px;
        right: -100px;
        width: 300px;
        height: 300px;
    }
}

.back-btn {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 20;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;

    &:hover {
        background: rgba(255, 255, 255, 0.3);
    }
}

.register-form-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    padding: 40px 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

.logo-section {
    text-align: center;
    margin-bottom: 40px;

    .logo {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 16px;
        object-fit: cover;
    }

    .title {
        font-size: 28px;
        font-weight: 700;
        color: #333;
        margin: 0 0 8px 0;
    }

    .subtitle {
        color: #666;
        font-size: 14px;
        margin: 0;
    }
}

.register-form {
    .el-form-item {
        margin-bottom: 24px;
    }

    .register-btn {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 600;
        border-radius: 12px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
    }
}

.footer-links {
    text-align: center;
    margin-top: 24px;
}

/* 响应式设计 */
@media (max-width: 480px) {
    .container {
        padding: 15px;
    }

    .register-form-container {
        padding: 30px 20px;
    }

    .logo-section .title {
        font-size: 24px;
    }
}
</style>
