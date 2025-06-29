/* eslint-disable @typescript-eslint/no-unused-vars */
//createUserList:此函数执行后返回一个数组，数组包含两个用户信息
function createUserList() {
  return [
    {
      userId: 1,
      phone: '13800138000',
      password: '123456',
      desc: '平台管理员',
      roles: ['平台管理员'],
      accessToken: 'mock_access_token_admin',
      refreshToken: 'mock_refresh_token_admin',
      expiresIn: Math.floor(Date.now() / 1000) + 7200, // 当前时间 + 2小时
      score: 610,
    },
    {
      userId: 2,
      phone: '13900139000',
      password: '123456',
      desc: '系统管理员',
      roles: ['系统管理员'],
      accessToken: 'mock_access_token_system',
      refreshToken: 'mock_refresh_token_system',
      expiresIn: Math.floor(Date.now() / 1000) + 7200, // 当前时间 + 2小时
      score: 520,
    },
  ]
}

// 存储验证码的对象（模拟数据库）
const verificationCodes = new Map();

// 对外暴露一个数组：数组里面包含接口模拟定义
export default [
  // 密码登录接口
  {
    url: '/api/auth/login-password',
    method: 'post',
    response: ({ body }) => {
      // 获取请求体携带过来的用户名与密码
      const { phone, password } = body;

      // 调用获取用户信息函数，用于判断是否有此用户
      const user = createUserList().find(
        (item) => item.phone === phone && item.password === password,
      );

      // 没有用户返回失败信息
      if (!user) {
        return {
          code: 20001,
          message: '账号或密码不正确',
          data: null
        };
      }

      // 找到用户，返回成功信息和token
      return {
        code: 10000,
        message: '登录成功',
        data: {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresIn: user.expiresIn,
          userId: user.userId
        }
      };
    },
  },

  // 验证码登录接口
  {
    url: '/api/auth/login-code',
    method: 'post',
    response: ({ body }) => {
      const { phone, code } = body;

      // 检查用户是否存在
      const user = createUserList().find(item => item.phone === phone);
      if (!user) {
        return {
          code: 20001,
          message: '用户不存在',
          data: null
        };
      }

      // 检查验证码是否正确
      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode !== code) {
        return {
          code: 20002,
          message: '验证码错误或已过期',
          data: null
        };
      }

      // 验证码正确，清除验证码并返回登录成功
      verificationCodes.delete(phone);
      return {
        code: 10000,
        message: '登录成功',
        data: {
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          expiresIn: user.expiresIn,
          userId: user.userId
        }
      };
    },
  },

  // 发送验证码接口
  {
    url: '/api/auth/send-code',
    method: 'post',
    response: ({ query }) => {
      const { phone, codeType, ipAddress } = query;

      // 检查手机号是否存在（仅REGISTER不检查）
      if (codeType !== 'REGISTER') {
        const userExists = createUserList().some(item => item.phone === phone);
        if (!userExists) {
          return {
            code: 20001,
            message: '用户不存在',
            data: null
          };
        }
      }

      // 生成随机6位数字验证码
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 保存验证码，实际项目中会设置过期时间
      verificationCodes.set(phone, verificationCode);

      console.log(`手机号 ${phone} 的验证码是: ${verificationCode}`);
      console.log(`IP地址: ${ipAddress}`);

      return {
        code: 10000,
        message: '验证码发送成功',
        data: {
          // 在mock环境直接返回验证码，方便测试
          code: verificationCode
        }
      };
    }
  },

  // 注册接口
  {
    url: '/api/auth/register',
    method: 'post',
    response: ({ body }) => {
      const { phone, code, password } = body;

      // 检查用户是否已存在
      const userExists = createUserList().find(item => item.phone === phone);
      if (userExists) {
        return {
          code: 20003,
          message: '该手机号已被注册',
          data: null
        };
      }

      // 检查验证码
      const storedCode = verificationCodes.get(phone);
      if (!storedCode || storedCode !== code) {
        return {
          code: 20002,
          message: '验证码错误或已过期',
          data: null
        };
      }

      // 注册成功，清除验证码
      verificationCodes.delete(phone);

      // 注：实际项目中这里会将新用户保存到数据库
      return {
        code: 10000,
        message: '注册成功',
        data: {
          userId: Date.now() // 模拟生成用户ID
        }
      };
    }
  },

  // 登出接口
  {
    url: '/api/user/logout',
    method: 'post',
    response: () => {
      return {
        code: 10000,
        message: '退出登录成功',
        data: null
      };
    }
  }
]
