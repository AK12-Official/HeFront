<template>
    <div class="container">
        <div class="login-wrapper">
            <!-- 背景装饰 -->
            <div class="bg-decoration">
                <div class="left-decoration"></div>
                <div class="right-decoration"></div>
            </div>

            <!-- 返回按钮 -->
            <el-button class="back-btn" :icon="ArrowLeft" circle @click="goBack" />

            <!-- 登录表单 -->
            <div class="login-form-container">
                <!-- Logo 区域 -->
                <div class="logo-section">
                    <img src="/img/vx_gzh.jpg" alt="Logo" class="logo">
                    <h1 class="title">MallLite</h1>
                    <p class="subtitle">登录体验爱心商城</p>
                </div>

                <!-- 表单区域 -->
                <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form"
                    @submit.prevent="handleLogin">
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名" size="large" :prefix-icon="User"
                            clearable />
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" size="large"
                            :prefix-icon="Lock" show-password clearable @keyup.enter="handleLogin" />
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="large" class="login-btn" :loading="loginLoading"
                            @click="handleLogin">
                            {{ loginLoading ? '登录中...' : '登录' }}
                        </el-button>
                    </el-form-item>
                </el-form>

                <!-- 底部链接 -->
                <div class="footer-links">
                    <el-link type="primary" @click="goToRegister">
                        还没有账号？立即注册
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
import { ssoLogin, ssoInfo } from '@/api/sso'
import type { LoginParams } from '@/api/sso/types'
import useMallUserStore from '@/store/modules/mallUser'

const router = useRouter()
const mallUserStore = useMallUserStore()
const loginFormRef = ref()
const loginLoading = ref(false)

// 表单数据
const loginForm = reactive<LoginParams>({
    username: '',
    password: ''
})

// 表单验证规则
const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ]
}

// 登录处理
const handleLogin = async () => {
    if (!loginFormRef.value) return

    await loginFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            loginLoading.value = true
            try {
                const response = await ssoLogin(loginForm)

                // 检查响应状态
                if (response.code === 200) {
                    // 使用电商专用store存储token
                    const token = response.data.tokenHead + response.data.token

                    // 从JWT token中解析过期时间
                    let expiresIn = null
                    try {
                        // JWT token的payload部分（第二部分）
                        const payload = JSON.parse(atob(response.data.token.split('.')[1]))
                        expiresIn = payload.exp // JWT中的exp字段是过期时间戳（秒）
                    } catch (error) {
                        console.warn('无法解析JWT token过期时间，使用默认24小时')
                        // 如果解析失败，使用默认24小时
                        expiresIn = Math.floor(Date.now() / 1000) + (24 * 60 * 60)
                    }

                    // 使用电商专用的登录信息设置方法
                    mallUserStore.setLoginInfo({
                        accessToken: token,
                        expiresIn: expiresIn || undefined,
                        username: loginForm.username,
                        memberId: undefined // SSO API没有返回memberId
                    })

                    // 登录成功后获取用户详细信息
                    try {
                        const userInfoResponse = await ssoInfo() as any
                        if (userInfoResponse.code === 200) {
                            // 存储用户详细信息
                            mallUserStore.setUserInfo(userInfoResponse.data)
                            console.log('用户信息已获取并存储:', userInfoResponse.data)
                        } else {
                            console.warn('获取用户信息失败:', userInfoResponse.message)
                        }
                    } catch (error) {
                        console.error('获取用户信息失败:', error)
                        // 即使获取用户信息失败，也不影响登录流程
                    }

                    ElMessage.success('登录成功')
                    router.push('/mall/home')
                } else {
                    ElMessage.error(response.message || '登录失败')
                }
            } catch (error) {
                console.error('登录失败:', error)
                ElMessage.error('登录失败，请检查用户名和密码')
            } finally {
                loginLoading.value = false
            }
        }
    })
}

// 返回上一页
const goBack = () => {
    router.back()
}

// 跳转注册页
const goToRegister = () => {
    router.push('/mall/register')
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

.login-wrapper {
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

.login-form-container {
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

.login-form {
    .el-form-item {
        margin-bottom: 24px;
    }

    .login-btn {
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

    .login-form-container {
        padding: 30px 20px;
    }

    .logo-section .title {
        font-size: 24px;
    }
}
</style>
