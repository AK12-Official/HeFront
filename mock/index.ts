/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mock 服务入口文件
 * 配置电商平台的模拟接口
 */
import { MockMethod } from 'vite-plugin-mock'
import mallMockApi from './mall'
import { adminMockApi } from './admin'
import { userSeparationMockApi } from './user-separation'

// 用户模拟数据（保留原有的）
const userMocks: MockMethod[] = [
  {
    url: '/api/user/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: '登录成功',
          data: {
            token: 'mock-token-admin',
            userInfo: {
              id: 1,
              username: 'admin',
              nickname: '管理员',
              avatar: 'https://img.alicdn.com/avatar.jpg'
            }
          }
        }
      } else {
        return {
          code: 401,
          message: '用户名或密码错误'
        }
      }
    }
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          id: 1,
          username: 'admin',
          nickname: '管理员',
          avatar: 'https://img.alicdn.com/avatar.jpg',
          email: 'admin@example.com',
          phone: '13800138000'
        }
      }
    }
  }
]

// 直接使用 mallMockApi 数组
const mallMocks: MockMethod[] = mallMockApi

export default [
  ...userMocks,
  ...mallMocks,
  ...adminMockApi,  // 后台管理系统mock API
  ...userSeparationMockApi  // 用户系统分离mock API
]
