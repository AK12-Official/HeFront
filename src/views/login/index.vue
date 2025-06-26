<template>
  <el-card class="centered-card">
    <el-form class="login_form" :model="loginForm" :rules="rules" ref="loginForms">
      <el-form-item prop="username" :rules="rules.username">
        <el-input v-model="loginForm.username" placeholder="UserName"></el-input>
      </el-form-item>
      <el-form-item prop="password" :rules="rules.password">
        <el-input type="password" v-model="loginForm.password" placeholder="Password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login_btn" type="primary" size="default" @click="login()">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">

import { ElNotification } from 'element-plus';
import { ref, reactive } from 'vue';
// import { reqLogin } from '../../api/user';
// import { LoginResponse } from '../../api/types';
// import { useRouter } from 'vue-router';
// const router = useRouter();

const loginForms = ref();
const loginForm = reactive({
  username: '',
  password: ''
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const valadatorUsername = (rule: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback();
  } else {
    callback(new Error('账号长度至少为5位'));
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.length >= 6 && value.length <= 15) {
    callback();
  } else {
    callback(new Error('密码长度在6到15位'));
  }
};

// 定义表单验证规则
const rules = {
  username: [
    { validator: valadatorUsername, trigger: 'change' }
  ],
  password: [
    { validator: validatorPassword, trigger: 'change' }
  ]
};

const login = async () => {
  ElNotification({
    type: 'info',
    message: "Login functionality is not implemented yet.",
    title: `Notice`,
  });

  // await loginForms.value.validate();

  // const result: LoginResponse = await reqLogin(loginForm);

  // if (result.code === 200) {
  //   ElNotification({
  //     type: 'success',
  //     message: "Welcome Home",
  //     title: `Hi`,
  //   })
  //   localStorage.setItem('token', result.data);
  //   router.push('/');
  // } else {
  //   ElNotification({
  //     type: 'error',
  //     message: (error as Error).message
  //   })

  // }
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

/* 卡片样式 */
.centered-card {
  width: 400px;
  margin: 100px auto;
  /* 居中 */
  padding: 20px;
  border: 1px solid #dcdfe6;
  /* 边框颜色 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  /* 阴影效果 */
  border-radius: 10px;
  /* 圆角 */
  background-color: #fff;
  /* 白色背景 */
  text-align: center;
  /* 内容居中 */
}

/* 表单样式 */
.login_form {
  margin-top: 20px;
}

/* 输入框样式 */
.el-input {
  width: 100%;
}

/* 按钮样式 */
.login_btn {
  width: 100%;
  background-color: #409eff;
  /* 按钮主色 */
  color: #fff;
  font-weight: bold;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.login_btn:hover {
  background-color: #66b1ff;
  /* 按钮悬停颜色 */
  color: #fff;
}

/* 卡片标题样式 */
.centered-card h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}
</style>
