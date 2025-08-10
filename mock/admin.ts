/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * MallLite后台管理系统Mock数据
 * 基于接口文档和Postman集合创建
 */
import { MockMethod } from 'vite-plugin-mock'

// 模拟管理员数据
const mockAdmins = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    email: 'admin@malllite.com',
    nickName: '超级管理员',
    note: '系统默认管理员',
    icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
    status: 1,
    createTime: '2023-01-01 10:00:00',
    loginTime: '2025-08-10 16:30:00'
  },
  {
    id: 2,
    username: 'manager',
    password: '123456',
    email: 'manager@malllite.com',
    nickName: '商品管理员',
    note: '负责商品管理',
    icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
    status: 1,
    createTime: '2023-02-01 10:00:00',
    loginTime: '2025-08-10 15:20:00'
  },
  {
    id: 3,
    username: 'service',
    password: '123456',
    email: 'service@malllite.com',
    nickName: '客服管理员',
    note: '负责订单处理',
    icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
    status: 0,
    createTime: '2023-03-01 10:00:00',
    loginTime: '2025-08-10 14:10:00'
  }
]

// 模拟商品分类数据
const mockProductCategories = [
  {
    id: 1,
    parentId: 0,
    name: '数码电器',
    level: 0,
    productCount: 120,
    productUnit: '件',
    navStatus: 1,
    showStatus: 1,
    sort: 100,
    icon: 'category-digital.png',
    keywords: '数码,电器,手机,电脑',
    description: '数码电器分类',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    parentId: 0,
    name: '服装配饰',
    level: 0,
    productCount: 85,
    productUnit: '件',
    navStatus: 1,
    showStatus: 1,
    sort: 90,
    icon: 'category-clothing.png',
    keywords: '服装,配饰,鞋帽',
    description: '服装配饰分类',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 3,
    parentId: 1,
    name: '智能手机',
    level: 1,
    productCount: 45,
    productUnit: '台',
    navStatus: 1,
    showStatus: 1,
    sort: 100,
    icon: '',
    keywords: '手机,智能手机',
    description: '智能手机子分类',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 4,
    parentId: 1,
    name: '笔记本电脑',
    level: 1,
    productCount: 32,
    productUnit: '台',
    navStatus: 1,
    showStatus: 1,
    sort: 90,
    icon: '',
    keywords: '笔记本,电脑,MacBook',
    description: '笔记本电脑子分类',
    createTime: '2023-01-01 10:00:00'
  }
]

// 模拟资源数据
const mockResources = [
  {
    id: 1,
    categoryId: 1,
    name: '后台用户管理',
    url: '/admin/**',
    description: '后台用户管理相关资源',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    categoryId: 2,
    name: '商品查看',
    url: '/product/list',
    description: '商品查看权限',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 3,
    categoryId: 2,
    name: '商品编辑',
    url: '/product/create',
    description: '商品创建和编辑权限',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 4,
    categoryId: 3,
    name: '订单管理',
    url: '/order/**',
    description: '订单管理相关权限',
    createTime: '2023-01-01 10:00:00'
  }
]

// 模拟商品数据（后台管理）
const mockAdminProducts = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    pic: 'https://picsum.photos/300/300?random=1',
    productSn: 'IP15PM256TB',
    price: 9999.00,
    promotionPrice: 9499.00,
    stock: 150,
    lowStock: 20,
    publishStatus: 1,
    verifyStatus: 1,
    newStatus: 1,
    recommandStatus: 1,
    deleteStatus: 0,
    sort: 100,
    brandId: 1,
    productCategoryId: 1,
    note: '热销商品',
    createTime: '2025-08-01 10:00:00',
    updateTime: '2025-08-10 15:30:00'
  },
  {
    id: 2,
    name: '小米14 Ultra',
    pic: 'https://picsum.photos/300/300?random=2',
    productSn: 'MI14U512WH',
    price: 6499.00,
    promotionPrice: 6199.00,
    stock: 88,
    lowStock: 15,
    publishStatus: 1,
    verifyStatus: 1,
    newStatus: 1,
    recommandStatus: 0,
    deleteStatus: 0,
    sort: 95,
    brandId: 2,
    productCategoryId: 1,
    note: '新款推荐',
    createTime: '2025-08-02 10:00:00',
    updateTime: '2025-08-10 14:20:00'
  },
  {
    id: 3,
    name: 'MacBook Pro 16英寸',
    pic: 'https://picsum.photos/300/300?random=3',
    productSn: 'MBP16M3P1TB',
    price: 18999.00,
    promotionPrice: null,
    stock: 25,
    lowStock: 5,
    publishStatus: 0,
    verifyStatus: 0,
    newStatus: 0,
    recommandStatus: 1,
    deleteStatus: 0,
    sort: 90,
    brandId: 1,
    productCategoryId: 2,
    note: '审核中商品',
    createTime: '2025-08-03 10:00:00',
    updateTime: '2025-08-10 13:15:00'
  }
]

// 模拟订单数据（后台管理）
const mockAdminOrders = [
  {
    id: 1,
    orderSn: 'ORD202508100001',
    memberId: 1,
    memberUsername: 'customer01',
    totalAmount: 9999.00,
    payAmount: 9499.00,
    freightAmount: 0.00,
    promotionAmount: 500.00,
    integrationAmount: 0.00,
    couponAmount: 0.00,
    discountAmount: 0.00,
    payType: 1,
    sourceType: 1,
    status: 2,
    orderType: 0,
    deliveryCompany: '顺丰速运',
    deliverySn: 'SF1234567890123',
    receiverName: '张三',
    receiverPhone: '13800138000',
    receiverProvince: '广东省',
    receiverCity: '深圳市',
    receiverRegion: '南山区',
    receiverDetailAddress: '科技园南区深南大道10000号',
    note: '请尽快发货',
    confirmStatus: 1,
    deleteStatus: 0,
    paymentTime: '2025-08-10 10:30:00',
    deliveryTime: '2025-08-10 14:00:00',
    createTime: '2025-08-10 10:00:00'
  },
  {
    id: 2,
    orderSn: 'ORD202508100002',
    memberId: 2,
    memberUsername: 'customer02',
    totalAmount: 6499.00,
    payAmount: 6199.00,
    freightAmount: 0.00,
    promotionAmount: 300.00,
    integrationAmount: 0.00,
    couponAmount: 0.00,
    discountAmount: 0.00,
    payType: 2,
    sourceType: 1,
    status: 1,
    orderType: 0,
    deliveryCompany: null,
    deliverySn: null,
    receiverName: '李四',
    receiverPhone: '13900139000',
    receiverProvince: '北京市',
    receiverCity: '北京市',
    receiverRegion: '海淀区',
    receiverDetailAddress: '中关村软件园二期',
    note: '',
    confirmStatus: 1,
    deleteStatus: 0,
    paymentTime: '2025-08-10 11:15:00',
    deliveryTime: null,
    createTime: '2025-08-10 11:00:00'
  },
  {
    id: 3,
    orderSn: 'ORD202508100003',
    memberId: 3,
    memberUsername: 'customer03',
    totalAmount: 18999.00,
    payAmount: 18999.00,
    freightAmount: 0.00,
    promotionAmount: 0.00,
    integrationAmount: 0.00,
    couponAmount: 0.00,
    discountAmount: 0.00,
    payType: 1,
    sourceType: 2,
    status: 0,
    orderType: 0,
    deliveryCompany: null,
    deliverySn: null,
    receiverName: '王五',
    receiverPhone: '13700137000',
    receiverProvince: '上海市',
    receiverCity: '上海市',
    receiverRegion: '浦东新区',
    receiverDetailAddress: '陆家嘴金融贸易区',
    note: '需要开具发票',
    confirmStatus: 0,
    deleteStatus: 0,
    paymentTime: null,
    deliveryTime: null,
    createTime: '2025-08-10 12:00:00'
  }
]

// 模拟角色数据
const mockRoles = [
  {
    id: 1,
    name: '超级管理员',
    description: '拥有所有权限',
    adminCount: 1,
    status: 1,
    sort: 100,
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 2,
    name: '商品管理员',
    description: '负责商品管理',
    adminCount: 5,
    status: 1,
    sort: 90,
    createTime: '2023-01-01 10:00:00'
  },
  {
    id: 3,
    name: '订单管理员',
    description: '负责订单处理',
    adminCount: 3,
    status: 1,
    sort: 80,
    createTime: '2023-01-01 10:00:00'
  }
]

// 生成分页数据的工具函数
const generatePageData = (list: any[], pageNum: number, pageSize: number) => {
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const pageList = list.slice(start, end)

  return {
    pageNum,
    pageSize,
    totalPage: Math.ceil(list.length / pageSize),
    total: list.length,
    list: pageList
  }
}

// JWT Token生成
const generateToken = (username: string) => {
  return `eyJhbGciOiJIUzUxMiJ9.${btoa(JSON.stringify({ sub: username, created: Date.now(), exp: Date.now() + 86400000 }))}}`
}

export const adminMockApi: MockMethod[] = [
  // ==================== 认证授权接口 ====================

  // 用户注册
  {
    url: '/api/admin/register',
    method: 'post',
    response: ({ body }) => {
      const { username, password, email, nickName } = body

      // 检查用户名是否已存在
      const existingUser = mockAdmins.find(admin => admin.username === username)
      if (existingUser) {
        return {
          code: 500,
          message: '用户名已存在',
          data: null
        }
      }

      const newAdmin = {
        id: mockAdmins.length + 1,
        username,
        password,
        email,
        nickName,
        note: '',
        icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
        status: 1,
        createTime: new Date().toLocaleString('zh-CN'),
        loginTime: new Date().toLocaleString('zh-CN')
      }

      mockAdmins.push(newAdmin)

      return {
        code: 200,
        message: '注册成功',
        data: newAdmin
      }
    }
  },

  // 用户登录
  {
    url: '/api/admin/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      const admin = mockAdmins.find(a => a.username === username && a.password === password)

      if (!admin) {
        return {
          code: 401,
          message: '用户名或密码错误',
          data: null
        }
      }

      if (admin.status === 0) {
        return {
          code: 403,
          message: '账号已被禁用',
          data: null
        }
      }

      // 更新登录时间
      admin.loginTime = new Date().toLocaleString('zh-CN')

      return {
        code: 200,
        message: '登录成功',
        data: {
          token: generateToken(username),
          tokenHead: 'Bearer '
        }
      }
    }
  },

  // 刷新Token
  {
    url: '/api/admin/refreshToken',
    method: 'get',
    response: ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '')

      if (!token) {
        return {
          code: 401,
          message: 'Token不能为空',
          data: null
        }
      }

      return {
        code: 200,
        message: '刷新成功',
        data: {
          token: generateToken('admin'),
          tokenHead: 'Bearer '
        }
      }
    }
  },

  // 获取当前用户信息
  {
    url: '/api/admin/info',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          username: 'admin',
          icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
          roles: ['超级管理员'],
          menus: [
            {
              id: 1,
              parentId: 0,
              title: '用户管理',
              level: 0,
              sort: 100,
              name: 'user',
              icon: 'user',
              hidden: 0,
              children: [
                {
                  id: 2,
                  parentId: 1,
                  title: '管理员列表',
                  level: 1,
                  sort: 100,
                  name: 'adminList',
                  icon: '',
                  hidden: 0
                }
              ]
            },
            {
              id: 3,
              parentId: 0,
              title: '商品管理',
              level: 0,
              sort: 90,
              name: 'product',
              icon: 'goods',
              hidden: 0,
              children: [
                {
                  id: 4,
                  parentId: 3,
                  title: '商品列表',
                  level: 1,
                  sort: 100,
                  name: 'productList',
                  icon: '',
                  hidden: 0
                }
              ]
            }
          ]
        }
      }
    }
  },

  // 用户登出
  {
    url: '/api/admin/logout',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '登出成功',
        data: null
      }
    }
  },

  // ==================== 用户管理接口 ====================

  // 分页查询用户列表
  {
    url: '/api/admin/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, keyword = '' } = query

      let filteredAdmins = mockAdmins

      if (keyword) {
        filteredAdmins = mockAdmins.filter(admin =>
          admin.username.includes(keyword) || admin.nickName.includes(keyword)
        )
      }

      const pageData = generatePageData(filteredAdmins, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // 获取指定用户信息
  {
    url: '/api/admin/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const admin = mockAdmins.find(a => a.id === id)

      if (!admin) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: admin
      }
    }
  },

  // 修改指定用户信息
  {
    url: '/api/admin/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      const id = parseInt(query.id as string)
      const adminIndex = mockAdmins.findIndex(a => a.id === id)

      if (adminIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      Object.assign(mockAdmins[adminIndex], body)

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 修改用户密码
  {
    url: '/api/admin/updatePassword',
    method: 'post',
    response: ({ body }) => {
      const { username, oldPassword, newPassword } = body

      const admin = mockAdmins.find(a => a.username === username)

      if (!admin) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      if (admin.password !== oldPassword) {
        return {
          code: 400,
          message: '原密码错误',
          data: null
        }
      }

      admin.password = newPassword

      return {
        code: 200,
        message: '密码修改成功',
        data: 1
      }
    }
  },

  // 删除用户
  {
    url: '/api/admin/delete/:id',
    method: 'post',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const adminIndex = mockAdmins.findIndex(a => a.id === id)

      if (adminIndex === -1) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      mockAdmins.splice(adminIndex, 1)

      return {
        code: 200,
        message: '删除成功',
        data: 1
      }
    }
  },

  // 修改用户状态
  {
    url: '/api/admin/updateStatus/:id',
    method: 'post',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const { status } = query

      const admin = mockAdmins.find(a => a.id === id)

      if (!admin) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      admin.status = parseInt(status)

      return {
        code: 200,
        message: '状态修改成功',
        data: 1
      }
    }
  },

  // ==================== 商品管理接口 ====================

  // 查询商品列表
  {
    url: '/api/product/list',
    method: 'get',
    response: ({ query }) => {
      const {
        pageNum = 1,
        pageSize = 5,
        keyword = '',
        publishStatus,
        verifyStatus
      } = query

      let filteredProducts = mockAdminProducts

      if (keyword) {
        filteredProducts = filteredProducts.filter(product =>
          product.name.includes(keyword) || product.productSn.includes(keyword)
        )
      }

      if (publishStatus !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.publishStatus === parseInt(publishStatus)
        )
      }

      if (verifyStatus !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.verifyStatus === parseInt(verifyStatus)
        )
      }

      const pageData = generatePageData(filteredProducts, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // 创建商品
  {
    url: '/api/product/create',
    method: 'post',
    response: ({ body }) => {
      const newProduct = {
        id: mockAdminProducts.length + 1,
        ...body,
        createTime: new Date().toLocaleString('zh-CN'),
        updateTime: new Date().toLocaleString('zh-CN')
      }

      mockAdminProducts.push(newProduct)

      return {
        code: 200,
        message: '创建成功',
        data: 1
      }
    }
  },

  // 批量修改商品上架状态
  {
    url: '/api/product/update/publishStatus',
    method: 'post',
    response: ({ query }) => {
      const { ids, publishStatus } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const product = mockAdminProducts.find(p => p.id === id)
        if (product) {
          product.publishStatus = parseInt(publishStatus)
          product.updateTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '更新成功',
        data: updateCount
      }
    }
  },

  // 批量修改商品推荐状态
  {
    url: '/api/product/update/recommendStatus',
    method: 'post',
    response: ({ query }) => {
      const { ids, recommendStatus } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const product = mockAdminProducts.find(p => p.id === id)
        if (product) {
          product.recommandStatus = parseInt(recommendStatus)
          product.updateTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '更新成功',
        data: updateCount
      }
    }
  },

  // 批量修改商品删除状态
  {
    url: '/api/product/update/deleteStatus',
    method: 'post',
    response: ({ query }) => {
      const { ids, deleteStatus } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const product = mockAdminProducts.find(p => p.id === id)
        if (product) {
          product.deleteStatus = parseInt(deleteStatus)
          product.updateTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '更新成功',
        data: updateCount
      }
    }
  },

  // ==================== 订单管理接口 ====================

  // 查询订单列表
  {
    url: '/api/order/list',
    method: 'get',
    response: ({ query }) => {
      const {
        pageNum = 1,
        pageSize = 5,
        orderSn = '',
        status,
        receiverKeyword = ''
      } = query

      let filteredOrders = mockAdminOrders

      if (orderSn) {
        filteredOrders = filteredOrders.filter(order =>
          order.orderSn.includes(orderSn)
        )
      }

      if (status !== undefined) {
        filteredOrders = filteredOrders.filter(order =>
          order.status === parseInt(status)
        )
      }

      if (receiverKeyword) {
        filteredOrders = filteredOrders.filter(order =>
          order.receiverName.includes(receiverKeyword) ||
          order.receiverPhone.includes(receiverKeyword)
        )
      }

      const pageData = generatePageData(filteredOrders, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // 获取订单详情
  {
    url: '/api/order/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const order = mockAdminOrders.find(o => o.id === id)

      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          order,
          orderItemList: [
            {
              id: 1,
              orderId: order.id,
              orderSn: order.orderSn,
              productId: 1,
              productPic: 'https://picsum.photos/300/300?random=1',
              productName: 'iPhone 15 Pro Max',
              productBrand: 'Apple',
              productSn: 'IP15PM256TB',
              productPrice: 9999.00,
              productQuantity: 1,
              realAmount: 9499.00,
              giftIntegration: 100,
              giftGrowth: 50
            }
          ],
          historyList: [
            {
              id: 1,
              orderId: order.id,
              operateMan: 'admin',
              createTime: order.createTime,
              orderStatus: 0,
              note: '订单创建'
            }
          ]
        }
      }
    }
  },

  // 批量发货
  {
    url: '/api/order/update/delivery',
    method: 'post',
    response: ({ body }) => {
      const deliveryList = body

      let updateCount = 0
      deliveryList.forEach((delivery: any) => {
        const order = mockAdminOrders.find(o => o.id === delivery.orderId)
        if (order) {
          order.deliveryCompany = delivery.deliveryCompany
          order.deliverySn = delivery.deliverySn
          order.status = 2 // 已发货
          order.deliveryTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '发货成功',
        data: updateCount
      }
    }
  },

  // 批量关闭订单
  {
    url: '/api/order/update/close',
    method: 'post',
    response: ({ query }) => {
      const { ids, note } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const order = mockAdminOrders.find(o => o.id === id)
        if (order) {
          order.status = 4 // 已关闭
          order.note = note || '管理员关闭订单'
          updateCount++
        }
      })

      return {
        code: 200,
        message: '关闭成功',
        data: updateCount
      }
    }
  },

  // 批量删除订单
  {
    url: '/api/order/delete',
    method: 'post',
    response: ({ query }) => {
      const { ids } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let deleteCount = 0
      idList.forEach((id: number) => {
        const orderIndex = mockAdminOrders.findIndex(o => o.id === id)
        if (orderIndex !== -1) {
          mockAdminOrders.splice(orderIndex, 1)
          deleteCount++
        }
      })

      return {
        code: 200,
        message: '删除成功',
        data: deleteCount
      }
    }
  },

  // ==================== 角色管理接口 ====================

  // 获取所有角色
  {
    url: '/api/role/listAll',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '查询成功',
        data: mockRoles
      }
    }
  },

  // 分页获取角色列表
  {
    url: '/api/role/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, keyword = '' } = query

      let filteredRoles = mockRoles

      if (keyword) {
        filteredRoles = mockRoles.filter(role =>
          role.name.includes(keyword) || role.description.includes(keyword)
        )
      }

      const pageData = generatePageData(filteredRoles, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // ==================== 文件上传接口 ====================

  // MinIO文件上传
  {
    url: '/api/minio/upload',
    method: 'post',
    response: () => {
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substr(2, 9)

      return {
        code: 200,
        message: '上传成功',
        data: {
          url: `https://minio.example.com/mall/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}/file_${timestamp}_${randomId}.jpg`,
          name: `file_${timestamp}_${randomId}.jpg`
        }
      }
    }
  },

  // MinIO文件删除
  {
    url: '/api/minio/delete',
    method: 'post',
    response: () => {
      return {
        code: 200,
        message: '删除成功',
        data: null
      }
    }
  },

  // ==================== 商品分类管理接口 ====================

  // 添加商品分类
  {
    url: '/api/productCategory/create',
    method: 'post',
    response: ({ body }) => {
      const newCategory = {
        id: mockProductCategories.length + 1,
        ...body,
        createTime: new Date().toLocaleString('zh-CN')
      }

      mockProductCategories.push(newCategory)

      return {
        code: 200,
        message: '创建成功',
        data: 1
      }
    }
  },

  // 修改商品分类
  {
    url: '/api/productCategory/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      const id = parseInt(query.id as string)
      const categoryIndex = mockProductCategories.findIndex(c => c.id === id)

      if (categoryIndex === -1) {
        return {
          code: 404,
          message: '分类不存在',
          data: null
        }
      }

      Object.assign(mockProductCategories[categoryIndex], body)

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 分页查询商品分类
  {
    url: '/api/productCategory/list/:parentId',
    method: 'get',
    response: ({ query }) => {
      const parentId = parseInt(query.parentId as string)
      const { pageNum = 1, pageSize = 5 } = query

      const filteredCategories = mockProductCategories.filter(category =>
        category.parentId === parentId
      )

      const pageData = generatePageData(filteredCategories, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // 删除商品分类
  {
    url: '/api/productCategory/delete/:id',
    method: 'post',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const categoryIndex = mockProductCategories.findIndex(c => c.id === id)

      if (categoryIndex === -1) {
        return {
          code: 404,
          message: '分类不存在',
          data: null
        }
      }

      mockProductCategories.splice(categoryIndex, 1)

      return {
        code: 200,
        message: '删除成功',
        data: 1
      }
    }
  },

  // 根据ID获取商品分类
  {
    url: '/api/productCategory/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const category = mockProductCategories.find(c => c.id === id)

      if (!category) {
        return {
          code: 404,
          message: '分类不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: category
      }
    }
  },

  // ==================== 补充缺失的商品管理接口 ====================

  // 获取商品编辑信息
  {
    url: '/api/product/updateInfo/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const product = mockAdminProducts.find(p => p.id === id)

      if (!product) {
        return {
          code: 404,
          message: '商品不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: {
          product,
          memberPriceList: [],
          skuStockList: [],
          productLadderList: [],
          productFullReductionList: [],
          subjectProductRelationList: [],
          prefrenceAreaProductRelationList: [],
          productAttributeValueList: []
        }
      }
    }
  },

  // 更新商品
  {
    url: '/api/product/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      const id = parseInt(query.id as string)
      const productIndex = mockAdminProducts.findIndex(p => p.id === id)

      if (productIndex === -1) {
        return {
          code: 404,
          message: '商品不存在',
          data: null
        }
      }

      Object.assign(mockAdminProducts[productIndex], body, {
        updateTime: new Date().toLocaleString('zh-CN')
      })

      return {
        code: 200,
        message: '更新成功',
        data: 1
      }
    }
  },

  // 商品简单查询
  {
    url: '/api/product/simpleList',
    method: 'get',
    response: ({ query }) => {
      const { keyword = '' } = query

      let filteredProducts = mockAdminProducts

      if (keyword) {
        filteredProducts = mockAdminProducts.filter(product =>
          product.name.includes(keyword) || product.productSn.includes(keyword)
        )
      }

      const simpleList = filteredProducts.map(product => ({
        id: product.id,
        name: product.name,
        productSn: product.productSn,
        price: product.price
      }))

      return {
        code: 200,
        message: '查询成功',
        data: simpleList
      }
    }
  },

  // 批量修改审核状态
  {
    url: '/api/product/update/verifyStatus',
    method: 'post',
    response: ({ query }) => {
      const { ids, verifyStatus, detail } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const product = mockAdminProducts.find(p => p.id === id)
        if (product) {
          product.verifyStatus = parseInt(verifyStatus)
          if (detail) {
            product.note = detail
          }
          product.updateTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '更新成功',
        data: updateCount
      }
    }
  },

  // 批量设为新品
  {
    url: '/api/product/update/newStatus',
    method: 'post',
    response: ({ query }) => {
      const { ids, newStatus } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let updateCount = 0
      idList.forEach((id: number) => {
        const product = mockAdminProducts.find(p => p.id === id)
        if (product) {
          product.newStatus = parseInt(newStatus)
          product.updateTime = new Date().toLocaleString('zh-CN')
          updateCount++
        }
      })

      return {
        code: 200,
        message: '更新成功',
        data: updateCount
      }
    }
  },

  // ==================== 补充缺失的用户管理接口 ====================

  // 给用户分配角色
  {
    url: '/api/admin/role/update',
    method: 'post',
    response: ({ query }) => {
      const { adminId, roleIds } = query

      const admin = mockAdmins.find(a => a.id === parseInt(adminId))
      if (!admin) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      // 模拟分配角色的过程
      const roleIdList = roleIds.split(',').map((id: string) => parseInt(id))

      return {
        code: 200,
        message: '分配成功',
        data: roleIdList.length
      }
    }
  },

  // 获取用户角色列表
  {
    url: '/api/admin/role/:adminId',
    method: 'get',
    response: ({ query }) => {
      const adminId = parseInt(query.adminId as string)

      const admin = mockAdmins.find(a => a.id === adminId)
      if (!admin) {
        return {
          code: 404,
          message: '用户不存在',
          data: null
        }
      }

      // 返回该用户的角色列表（模拟数据）
      const userRoles = adminId === 1 ? [mockRoles[0]] : [mockRoles[1]]

      return {
        code: 200,
        message: '获取成功',
        data: userRoles
      }
    }
  },

  // ==================== 补充缺失的订单管理接口 ====================

  // 修改收货人信息
  {
    url: '/api/order/update/receiverInfo',
    method: 'post',
    response: ({ body }) => {
      const { orderId, receiverName, receiverPhone, receiverProvince, receiverCity, receiverRegion, receiverDetailAddress } = body

      const order = mockAdminOrders.find(o => o.id === orderId)
      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        }
      }

      Object.assign(order, {
        receiverName,
        receiverPhone,
        receiverProvince,
        receiverCity,
        receiverRegion,
        receiverDetailAddress
      })

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 修改订单费用信息
  {
    url: '/api/order/update/moneyInfo',
    method: 'post',
    response: ({ body }) => {
      const { orderId, freightAmount, discountAmount, status } = body

      const order = mockAdminOrders.find(o => o.id === orderId)
      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        }
      }

      Object.assign(order, {
        freightAmount: freightAmount || order.freightAmount,
        discountAmount: discountAmount || order.discountAmount,
        status: status !== undefined ? status : order.status
      })

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 备注订单
  {
    url: '/api/order/update/note',
    method: 'post',
    response: ({ query }) => {
      const { id, note, status } = query

      const order = mockAdminOrders.find(o => o.id === parseInt(id))
      if (!order) {
        return {
          code: 404,
          message: '订单不存在',
          data: null
        }
      }

      order.note = note || order.note
      if (status !== undefined) {
        order.status = parseInt(status)
      }

      return {
        code: 200,
        message: '备注成功',
        data: 1
      }
    }
  },

  // ==================== 补充缺失的角色管理接口 ====================

  // 添加角色
  {
    url: '/api/role/create',
    method: 'post',
    response: ({ body }) => {
      const newRole = {
        id: mockRoles.length + 1,
        ...body,
        createTime: new Date().toLocaleString('zh-CN')
      }

      mockRoles.push(newRole)

      return {
        code: 200,
        message: '创建成功',
        data: 1
      }
    }
  },

  // 修改角色
  {
    url: '/api/role/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      const id = parseInt(query.id as string)
      const roleIndex = mockRoles.findIndex(r => r.id === id)

      if (roleIndex === -1) {
        return {
          code: 404,
          message: '角色不存在',
          data: null
        }
      }

      Object.assign(mockRoles[roleIndex], body)

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 批量删除角色
  {
    url: '/api/role/delete',
    method: 'post',
    response: ({ query }) => {
      const { ids } = query
      const idList = ids.split(',').map((id: string) => parseInt(id))

      let deleteCount = 0
      idList.forEach((id: number) => {
        const roleIndex = mockRoles.findIndex(r => r.id === id)
        if (roleIndex !== -1) {
          mockRoles.splice(roleIndex, 1)
          deleteCount++
        }
      })

      return {
        code: 200,
        message: '删除成功',
        data: deleteCount
      }
    }
  },

  // 修改角色状态
  {
    url: '/api/role/updateStatus/:id',
    method: 'post',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const { status } = query

      const role = mockRoles.find(r => r.id === id)
      if (!role) {
        return {
          code: 404,
          message: '角色不存在',
          data: null
        }
      }

      role.status = parseInt(status)

      return {
        code: 200,
        message: '状态修改成功',
        data: 1
      }
    }
  },

  // 给角色分配菜单
  {
    url: '/api/role/allocMenu',
    method: 'post',
    response: ({ query }) => {
      const { roleId, menuIds } = query

      const role = mockRoles.find(r => r.id === parseInt(roleId))
      if (!role) {
        return {
          code: 404,
          message: '角色不存在',
          data: null
        }
      }

      const menuIdList = menuIds.split(',').map((id: string) => parseInt(id))

      return {
        code: 200,
        message: '分配成功',
        data: menuIdList.length
      }
    }
  },

  // 给角色分配资源
  {
    url: '/api/role/allocResource',
    method: 'post',
    response: ({ query }) => {
      const { roleId, resourceIds } = query

      const role = mockRoles.find(r => r.id === parseInt(roleId))
      if (!role) {
        return {
          code: 404,
          message: '角色不存在',
          data: null
        }
      }

      const resourceIdList = resourceIds.split(',').map((id: string) => parseInt(id))

      return {
        code: 200,
        message: '分配成功',
        data: resourceIdList.length
      }
    }
  },

  // ==================== 资源管理接口 ====================

  // 添加资源
  {
    url: '/api/resource/create',
    method: 'post',
    response: ({ body }) => {
      const newResource = {
        id: mockResources.length + 1,
        ...body,
        createTime: new Date().toLocaleString('zh-CN')
      }

      mockResources.push(newResource)

      return {
        code: 200,
        message: '创建成功',
        data: 1
      }
    }
  },

  // 修改资源
  {
    url: '/api/resource/update/:id',
    method: 'post',
    response: ({ query, body }) => {
      const id = parseInt(query.id as string)
      const resourceIndex = mockResources.findIndex(r => r.id === id)

      if (resourceIndex === -1) {
        return {
          code: 404,
          message: '资源不存在',
          data: null
        }
      }

      Object.assign(mockResources[resourceIndex], body)

      return {
        code: 200,
        message: '修改成功',
        data: 1
      }
    }
  },

  // 根据ID获取资源详情
  {
    url: '/api/resource/:id',
    method: 'get',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const resource = mockResources.find(r => r.id === id)

      if (!resource) {
        return {
          code: 404,
          message: '资源不存在',
          data: null
        }
      }

      return {
        code: 200,
        message: '获取成功',
        data: resource
      }
    }
  },

  // 根据ID删除资源
  {
    url: '/api/resource/delete/:id',
    method: 'post',
    response: ({ query }) => {
      const id = parseInt(query.id as string)
      const resourceIndex = mockResources.findIndex(r => r.id === id)

      if (resourceIndex === -1) {
        return {
          code: 404,
          message: '资源不存在',
          data: null
        }
      }

      mockResources.splice(resourceIndex, 1)

      return {
        code: 200,
        message: '删除成功',
        data: 1
      }
    }
  },

  // 分页查询资源
  {
    url: '/api/resource/list',
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 5, categoryId, nameKeyword, urlKeyword } = query

      let filteredResources = mockResources

      if (categoryId) {
        filteredResources = filteredResources.filter(resource =>
          resource.categoryId === parseInt(categoryId)
        )
      }

      if (nameKeyword) {
        filteredResources = filteredResources.filter(resource =>
          resource.name.includes(nameKeyword)
        )
      }

      if (urlKeyword) {
        filteredResources = filteredResources.filter(resource =>
          resource.url.includes(urlKeyword)
        )
      }

      const pageData = generatePageData(filteredResources, parseInt(pageNum), parseInt(pageSize))

      return {
        code: 200,
        message: '查询成功',
        data: pageData
      }
    }
  },

  // 查询所有资源
  {
    url: '/api/resource/listAll',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '查询成功',
        data: mockResources
      }
    }
  },

  // ==================== OSS文件上传接口 ====================

  // OSS文件上传
  {
    url: '/api/aliyun/oss/upload',
    method: 'post',
    response: () => {
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substr(2, 9)

      return {
        code: 200,
        message: '上传成功',
        data: {
          url: `https://oss.example.com/mall/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${String(new Date().getDate()).padStart(2, '0')}/file_${timestamp}_${randomId}.jpg`,
          name: `file_${timestamp}_${randomId}.jpg`
        }
      }
    }
  },

  // OSS签名生成
  {
    url: '/api/aliyun/oss/policy',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取成功',
        data: {
          accessKeyId: 'STS.NUCeVRdja2jKk6OyacTp4LKTS',
          policy: 'eyJleHBpcmF0aW9uIjoiMjAyNS0wOC0xMVQwODowMDowMFoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2XV19',
          signature: 'mock_signature_string',
          dir: 'mall/',
          host: 'https://oss.example.com',
          expire: String(Math.floor(Date.now() / 1000) + 3600)
        }
      }
    }
  }
]
