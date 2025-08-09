/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Mock 服务入口文件
 * 配置电商平台的模拟接口
 */
import { MockMethod } from 'vite-plugin-mock'
import { mallMockApi } from './mall'

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

// 为每个电商API创建GET和POST两个版本的mock
const mallMocks: MockMethod[] = []

Object.entries(mallMockApi).forEach(([url, handler]) => {
  // 处理带参数的URL路径，将 :id 转换为正则表达式格式
  const viteUrl = url.replace(/:(\w+)/g, ':$1')

  // 创建POST版本
  mallMocks.push({
    url: `/api${viteUrl}`,
    method: 'post',
    response: (opts: { query: Record<string, any>; body: Record<string, any>; url: string }) => {
      try {
        const { query, body, url: requestUrl } = opts
        const params = { ...query, ...body }

        // 处理路径参数
        const urlPattern = url.replace(/:(\w+)/g, '([^/]+)')
        const regex = new RegExp(`^${urlPattern}$`)
        const actualPath = requestUrl.replace('/api', '')
        const matches = actualPath.match(regex)

        if (matches && url.includes(':')) {
          const paramNames = url.match(/:(\w+)/g)?.map(param => param.slice(1)) || []
          paramNames.forEach((paramName, index) => {
            params[paramName] = matches[index + 1]
          })
        }

        return handler(params as any)
      } catch (error) {
        console.error('Mock API Error:', error)
        return {
          code: 500,
          message: '服务器内部错误',
          data: null
        }
      }
    }
  })

  // 创建GET版本
  mallMocks.push({
    url: `/api${viteUrl}`,
    method: 'get',
    response: (opts: { query: Record<string, any>; url: string }) => {
      try {
        const { query, url: requestUrl } = opts
        const params = { ...query }

        // 处理路径参数
        const urlPattern = url.replace(/:(\w+)/g, '([^/]+)')
        const regex = new RegExp(`^${urlPattern}$`)
        const actualPath = requestUrl.replace('/api', '')
        const matches = actualPath.match(regex)

        if (matches && url.includes(':')) {
          const paramNames = url.match(/:(\w+)/g)?.map(param => param.slice(1)) || []
          paramNames.forEach((paramName, index) => {
            params[paramName] = matches[index + 1]
          })
        }

        return handler(params as any)
      } catch (error) {
        console.error('Mock API Error:', error)
        return {
          code: 500,
          message: '服务器内部错误',
          data: null
        }
      }
    }
  })
})

export default [
  ...userMocks,
  ...mallMocks
]
