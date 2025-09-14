/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MallLite后台管理系统Mock数据
 * 基于接口文档和Postman集合创建
 * 注意：所有硬编码数据已清除，现在返回空数据或从真实API获取
 */
import { MockMethod } from 'vite-plugin-mock'

// 管理员数据 - 从真实API获取
const mockAdmins: any[] = []

// 商品分类数据 - 从真实API获取
const mockProductCategories: any[] = []

// 资源数据 - 从真实API获取
const mockResources: any[] = []

// 角色数据 - 从真实API获取
const mockRoles: any[] = []

// 商品数据 - 从真实API获取
const mockProducts: any[] = []

// 订单数据 - 从真实API获取
const mockOrders: any[] = []

// 菜单数据 - 从真实API获取
const mockMenus: any[] = []

export const adminMockApi: MockMethod[] = [
  // 管理员登录
  {
    url: '/admin/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      // 这里应该调用真实的登录API
      return {
        code: 200,
        message: '登录成功',
        data: {
          token: 'mock-token-' + Date.now(),
          tokenHead: 'Bearer '
        }
      }
    }
  },

  // 获取管理员信息
  {
    url: '/admin/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          username: 'admin',
          icon: '',
          roles: ['admin'],
          menus: mockMenus
        }
      }
    }
  },

  // 管理员登出
  {
    url: '/admin/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null
      }
    }
  },

  // 获取管理员列表
  {
    url: '/admin/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, keyword } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockAdmins.length / Number(pageSize)),
          total: mockAdmins.length,
          list: mockAdmins.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  },

  // 获取商品分类列表
  {
    url: '/productCategory/list/:parentId',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5 } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockProductCategories.length / Number(pageSize)),
          total: mockProductCategories.length,
          list: mockProductCategories.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  },

  // 获取资源列表
  {
    url: '/resource/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, categoryId, nameKeyword, urlKeyword } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockResources.length / Number(pageSize)),
          total: mockResources.length,
          list: mockResources.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  },

  // 获取角色列表
  {
    url: '/role/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, keyword } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockRoles.length / Number(pageSize)),
          total: mockRoles.length,
          list: mockRoles.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  },

  // 获取商品列表
  {
    url: '/product/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5 } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockProducts.length / Number(pageSize)),
          total: mockProducts.length,
          list: mockProducts.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  },

  // 获取订单列表
  {
    url: '/order/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5 } = query
      return {
        code: 200,
        message: '获取成功',
        data: {
          pageNum: Number(pageNum),
          pageSize: Number(pageSize),
          totalPage: Math.ceil(mockOrders.length / Number(pageSize)),
          total: mockOrders.length,
          list: mockOrders.slice((Number(pageNum) - 1) * Number(pageSize), Number(pageNum) * Number(pageSize))
        }
      }
    }
  }
]