<template>
  <div class="login-center">
    <el-card class="centered-card">
      <!-- 标题和切换按钮 -->
      <div class="login-header">
        <h2>{{ currentMode === 'login' ? '用户登录' : '用户注册' }}</h2>
        <div class="mode-switch">
          <el-button :type="currentMode === 'login' ? 'primary' : 'default'" @click="switchMode('login')" size="small"
            class="switch-btn">
            登录
          </el-button>
          <el-button :type="currentMode === 'register' ? 'primary' : 'default'" @click="switchMode('register')"
            size="small" class="switch-btn">
            注册
          </el-button>
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form v-if="currentMode === 'login'" class="login_form" :model="loginForm" :rules="loginRules"
        ref="loginForms">
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>

        <!-- 登录方式切换 -->
        <div style="text-align:center;margin-bottom:10px;">
          <el-radio-group v-model="loginType" size="small">
            <el-radio-button label="password">密码登录</el-radio-button>
            <el-radio-button label="code">验证码登录</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 密码登录 -->
        <el-form-item v-if="loginType === 'password'" prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <!-- 验证码登录 -->
        <el-form-item v-if="loginType === 'code'" prop="code">
          <div style="display: flex; gap: 8px;">
            <el-input v-model="loginForm.code" placeholder="请输入验证码"></el-input>
            <el-button type="primary" @click="sendCode" :disabled="countdown > 0" style="min-width: 100px;">
              {{ countdown > 0 ? countdown + 's' : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button class="login_btn" type="primary" size="default" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>

      <!-- 注册表单 -->
      <el-form v-if="currentMode === 'register'" class="login_form" :model="registerForm" :rules="registerRules"
        ref="registerForms">
        <el-form-item prop="phone">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div style="display: flex; gap: 8px;">
            <el-input v-model="registerForm.code" placeholder="请输入验证码"></el-input>
            <el-button type="primary" @click="sendCode" :disabled="countdown > 0" style="min-width: 100px;">
              {{ countdown > 0 ? countdown + 's' : '发送验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input type="text" v-model="registerForm.nickname" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login_btn" type="primary" size="default" @click="register()">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { register as registerAPI, sendVerificationCode } from '@/api/auth';
import useUserStore from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import { ElNotification } from 'element-plus';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const ip = ref('127.0.0.1');

fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(data => {
    ip.value = data.ip;
  })
  .catch(() => {
    ip.value = '127.0.0.1';
  });


const currentMode = ref<'login' | 'register'>('login');
const loginType = ref<'password' | 'code'>('password');

const loginForms = ref();
const registerForms = ref();

const loginForm = reactive({
  phone: '',
  password: '',
  code: ''
});

const registerForm = reactive({
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  nickname: ''
});

const countdown = ref(0);
let timer: number | null = null;

const validatePhone = (_: unknown, value: string, callback: (error?: Error) => void) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!value) {
    callback(new Error('请输入手机号'));
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};

const validatorPassword = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (value.length >= 6 && value.length <= 15) {
    callback();
  } else {
    callback(new Error('密码长度在6到15位'));
  }
};

const validatorConfirmPassword = (_: unknown, value: string, callback: (error?: Error) => void) => {
  if (value === registerForm.password) {
    callback();
  } else {
    callback(new Error('两次输入的密码不一致'));
  }
};

const loginRules = {
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  password: [
    { validator: validatorPassword, trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ]
};

const registerRules = {
  phone: [
    { validator: validatePhone, trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' }
  ],
  password: [
    { validator: validatorPassword, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatorConfirmPassword, trigger: 'blur' }
  ]
};

const switchMode = (mode: 'login' | 'register') => {
  currentMode.value = mode;
  if (mode === 'login') {
    Object.assign(loginForm, { phone: '', password: '' });
  } else {
    Object.assign(registerForm, { phone: '', code: '', password: '', confirmPassword: '' });
  }
};

const login = async () => {
  if (!loginForms.value) return;

  await loginForms.value.validate();

  try {
    if (loginType.value === 'password') {
      await userStore.userLoginPwd({
        phone: loginForm.phone,
        password: loginForm.password
      });
    } else {
      await userStore.userLoginCode({
        phone: loginForm.phone,
        code: loginForm.code
      });
      // 你可以根据实际情况决定是否要存token等
    }

    ElNotification.success({
      message: "登录成功",
      title: "欢迎回来",
    });

    router.push('/');
  } catch (error) {
    ElNotification.error({
      message: error instanceof Error ? error.message : '登录失败'
    });
  }
};

const register = async () => {
  if (!registerForms.value) return;

  await registerForms.value.validate();

  try {
    await registerAPI(registerForm);

    ElNotification.success({
      message: "注册成功，请登录",
      title: "注册成功",
    });

    switchMode('login');
    loginForm.phone = registerForm.phone;
  } catch (error) {
    ElNotification.error({
      message: error instanceof Error ? error.message : '注册失败'
    });
  }
};

const sendCode = async () => {
  if (!registerForm.phone) {
    ElMessage.warning('请先输入手机号');
    return;
  }
  try {
    await sendVerificationCode({ phone: registerForm.phone, codeType: 'REGISTER', ipAddress: ip.value });
    ElMessage.success('验证码已发送');
    countdown.value = 60;
    timer = window.setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0 && timer) {
        clearInterval(timer);
        timer = null;
      }
    }, 1000);
  } catch {
    ElMessage.error('验证码发送失败');
  }
};
</script>

<style scoped>
/* 设置页面背景颜色 */
body {
  background-color: #f0f2f5;
  /* 浅灰色背景 */
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

.login-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('@/assets/pictures/BG2.jpg') center center/cover no-repeat;
}

.centered-card {
  width: 400px;
  padding: 20px;
  border: 1px solid #dcdfe6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  text-align: center;
}

.login-header {
  text-align: center;
  margin-bottom: 20px;
}

.login-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
  font-weight: bold;
}

.mode-switch {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.switch-btn {
  border-radius: 5px;
  transition: all 0.3s ease;
}

.login_form {
  margin-top: 20px;
}

.el-input {
  width: 100%;
}

.login_btn {
  width: 100%;
  background-color: #409eff;
  color: #fff;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.login_btn:hover {
  background-color: #66b1ff;
  color: #fff;
}

.centered-card h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
</style>
