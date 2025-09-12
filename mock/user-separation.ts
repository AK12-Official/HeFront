/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 用户系统分离Mock数据
 * 确保后台管理系统和前台商城系统的用户数据完全分离
 */
import { MockMethod } from 'vite-plugin-mock'

// 刷新Token Mock数据
const mockRefreshTokenResponse = {
    code: 200,
    message: 'Token刷新成功',
    data: {
        token: 'new-refreshed-token-12345',
        tokenHead: 'Bearer '
    }
};

// 前台商城用户数据（与后台管理员完全分离）
const mockMallUsers = [
    {
        id: 1,
        username: 'customer01',
        password: '123456',
        nickname: '张三',
        phone: '13800138001',
        email: 'customer01@example.com',
        icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
        gender: 1, // 1:男 0:女
        birthday: '1990-01-01',
        city: '深圳市',
        job: '软件工程师',
        personalizedSignature: '代码改变世界',
        sourceType: 1, // 1:PC 2:app
        integration: 1000,
        growth: 500,
        luckyCount: 10,
        historyIntegration: 2000,
        status: 1, // 1:启用 0:禁用
        createTime: '2024-01-01 10:00:00',
        memberLevelId: 2
    },
    {
        id: 2,
        username: 'customer02',
        password: '123456',
        nickname: '李四',
        phone: '13800138002',
        email: 'customer02@example.com',
        icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
        gender: 0,
        birthday: '1992-05-15',
        city: '北京市',
        job: '产品经理',
        personalizedSignature: '用户体验至上',
        sourceType: 2,
        integration: 1500,
        growth: 750,
        luckyCount: 5,
        historyIntegration: 3000,
        status: 1,
        createTime: '2024-02-01 10:00:00',
        memberLevelId: 3
    },
    {
        id: 3,
        username: 'customer03',
        password: '123456',
        nickname: '王五',
        phone: '13800138003',
        email: 'customer03@example.com',
        icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
        gender: 1,
        birthday: '1988-12-20',
        city: '上海市',
        job: '设计师',
        personalizedSignature: '设计让生活更美好',
        sourceType: 1,
        integration: 2000,
        growth: 1000,
        luckyCount: 15,
        historyIntegration: 5000,
        status: 1,
        createTime: '2024-03-01 10:00:00',
        memberLevelId: 4
    }
]

// 会员等级数据
const mockMemberLevels = [
    {
        id: 1,
        name: '铜牌会员',
        growthPoint: 0,
        defaultStatus: 1,
        freeFreightPoint: 0,
        commentGrowthPoint: 5,
        priviledgeFreeFreight: 0,
        priviledgeSignIn: 0,
        priviledgeComment: 1,
        priviledgePromotion: 0,
        priviledgeMemberPrice: 0,
        priviledgeBirthday: 0,
        note: '新注册用户默认等级'
    },
    {
        id: 2,
        name: '银牌会员',
        growthPoint: 1000,
        defaultStatus: 0,
        freeFreightPoint: 99,
        commentGrowthPoint: 10,
        priviledgeFreeFreight: 1,
        priviledgeSignIn: 1,
        priviledgeComment: 1,
        priviledgePromotion: 1,
        priviledgeMemberPrice: 0,
        priviledgeBirthday: 0,
        note: '成长值达到1000可升级'
    },
    {
        id: 3,
        name: '金牌会员',
        growthPoint: 5000,
        defaultStatus: 0,
        freeFreightPoint: 199,
        commentGrowthPoint: 15,
        priviledgeFreeFreight: 1,
        priviledgeSignIn: 1,
        priviledgeComment: 1,
        priviledgePromotion: 1,
        priviledgeMemberPrice: 1,
        priviledgeBirthday: 1,
        note: '成长值达到5000可升级'
    },
    {
        id: 4,
        name: '钻石会员',
        growthPoint: 15000,
        defaultStatus: 0,
        freeFreightPoint: 299,
        commentGrowthPoint: 20,
        priviledgeFreeFreight: 1,
        priviledgeSignIn: 1,
        priviledgeComment: 1,
        priviledgePromotion: 1,
        priviledgeMemberPrice: 1,
        priviledgeBirthday: 1,
        note: '成长值达到15000可升级'
    }
]

// 生成JWT Token的函数
const generateMallToken = (username: string, userId: number) => {
    const payload = {
        sub: username,
        userId: userId,
        type: 'mall_user', // 标识这是商城用户token
        created: Date.now(),
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天过期
    }
    return `mall.${btoa(JSON.stringify(payload))}.signature`
}

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

export const userSeparationMockApi: MockMethod[] = [
    // ==================== 商城用户注册登录（与管理员完全分离）====================

    // 商城用户注册
    {
        url: '/api/sso/register',
        method: 'post',
        response: ({ body }) => {
            const { username, password, telephone, authCode } = body

            // 验证验证码（模拟）
            if (authCode !== '123456') {
                return {
                    code: 400,
                    message: '验证码错误',
                    data: null
                }
            }

            // 检查用户名是否已存在
            const existingUser = mockMallUsers.find(user => user.username === username)
            if (existingUser) {
                return {
                    code: 400,
                    message: '用户名已存在',
                    data: null
                }
            }

            // 检查手机号是否已存在
            const existingPhone = mockMallUsers.find(user => user.phone === telephone)
            if (existingPhone) {
                return {
                    code: 400,
                    message: '手机号已被注册',
                    data: null
                }
            }

            const newUser = {
                id: mockMallUsers.length + 1,
                username,
                password,
                nickname: username,
                phone: telephone,
                email: '',
                icon: 'https://img.alicdn.com/tfs/TB1QS.4l4z1gK0jSZSgXXavwpXa-200-200.png',
                gender: 1,
                birthday: '',
                city: '',
                job: '',
                personalizedSignature: '',
                sourceType: 1,
                integration: 0,
                growth: 0,
                luckyCount: 0,
                historyIntegration: 0,
                status: 1,
                createTime: new Date().toLocaleString('zh-CN'),
                memberLevelId: 1 // 新用户默认铜牌会员
            }

            mockMallUsers.push(newUser)

            return {
                code: 200,
                message: '注册成功',
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    nickname: newUser.nickname,
                    memberLevelId: newUser.memberLevelId
                }
            }
        }
    },

    // 商城用户登录
    {
        url: '/api/sso/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body

            const user = mockMallUsers.find(u => u.username === username && u.password === password)

            if (!user) {
                return {
                    code: 401,
                    message: '用户名或密码错误',
                    data: null
                }
            }

            if (user.status === 0) {
                return {
                    code: 403,
                    message: '账号已被禁用',
                    data: null
                }
            }

            return {
                code: 200,
                message: '登录成功',
                data: {
                    token: generateMallToken(username, user.id),
                    tokenHead: 'Bearer ',
                    userInfo: {
                        id: user.id,
                        username: user.username,
                        nickname: user.nickname,
                        icon: user.icon,
                        memberLevelId: user.memberLevelId,
                        integration: user.integration,
                        growth: user.growth
                    }
                }
            }
        }
    },

    // 发送验证码
    {
        url: '/api/sso/getAuthCode',
        method: 'get',
        response: ({ query }) => {
            const { telephone } = query

            if (!telephone) {
                return {
                    code: 400,
                    message: '手机号不能为空',
                    data: null
                }
            }

            // 模拟发送验证码
            return {
                code: 200,
                message: '验证码发送成功',
                data: {
                    authCode: '123456' // 开发环境直接返回验证码，生产环境不应返回
                }
            }
        }
    },

    // 刷新Token
    {
        url: '/api/sso/refreshToken',
        method: 'post',
        response: ({ body }) => {
            const { refreshToken } = body

            if (!refreshToken || !refreshToken.includes('refresh')) {
                return {
                    code: 401,
                    message: 'RefreshToken无效或已过期',
                    data: null
                }
            }

            // 模拟验证refreshToken并生成新的accessToken
            return {
                code: 200,
                message: 'Token刷新成功',
                data: {
                    token: 'new-refreshed-token-' + Date.now(),
                    tokenHead: 'Bearer '
                }
            }
        }
    },

    // 获取当前登录用户信息
    {
        url: '/api/sso/info',
        method: 'get',
        response: ({ headers }) => {
            const token = headers.authorization?.replace('Bearer ', '')

            if (!token || !token.startsWith('mall.')) {
                return {
                    code: 401,
                    message: '请先登录',
                    data: null
                }
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const user = mockMallUsers.find(u => u.id === payload.userId)

                if (!user) {
                    return {
                        code: 401,
                        message: '用户不存在',
                        data: null
                    }
                }

                const memberLevel = mockMemberLevels.find(l => l.id === user.memberLevelId)

                return {
                    code: 200,
                    message: '获取成功',
                    data: {
                        id: user.id,
                        username: user.username,
                        nickname: user.nickname,
                        phone: user.phone,
                        email: user.email,
                        icon: user.icon,
                        gender: user.gender,
                        birthday: user.birthday,
                        city: user.city,
                        job: user.job,
                        personalizedSignature: user.personalizedSignature,
                        integration: user.integration,
                        growth: user.growth,
                        memberLevel: memberLevel,
                        luckyCount: user.luckyCount,
                        historyIntegration: user.historyIntegration
                    }
                }
            } catch {
                return {
                    code: 401,
                    message: 'Token无效',
                    data: null
                }
            }
        }
    },

    // 更新用户信息
    {
        url: '/api/sso/updateInfo',
        method: 'post',
        response: ({ headers, body }) => {
            const token = headers.authorization?.replace('Bearer ', '')

            if (!token || !token.startsWith('mall.')) {
                return {
                    code: 401,
                    message: '请先登录',
                    data: null
                }
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const userIndex = mockMallUsers.findIndex(u => u.id === payload.userId)

                if (userIndex === -1) {
                    return {
                        code: 401,
                        message: '用户不存在',
                        data: null
                    }
                }

                // 更新用户信息（排除敏感字段）
                const allowedFields = ['nickname', 'icon', 'gender', 'birthday', 'city', 'job', 'personalizedSignature']
                allowedFields.forEach(field => {
                    if (body[field] !== undefined) {
                        mockMallUsers[userIndex][field] = body[field]
                    }
                })

                return {
                    code: 200,
                    message: '更新成功',
                    data: 1
                }
            } catch {
                return {
                    code: 401,
                    message: 'Token无效',
                    data: null
                }
            }
        }
    },

    // 修改密码
    {
        url: '/api/sso/updatePassword',
        method: 'post',
        response: ({ headers, body }) => {
            const token = headers.authorization?.replace('Bearer ', '')

            if (!token || !token.startsWith('mall.')) {
                return {
                    code: 401,
                    message: '请先登录',
                    data: null
                }
            }

            const { oldPassword, newPassword } = body

            if (!oldPassword || !newPassword) {
                return {
                    code: 400,
                    message: '密码不能为空',
                    data: null
                }
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]))
                const user = mockMallUsers.find(u => u.id === payload.userId)

                if (!user) {
                    return {
                        code: 401,
                        message: '用户不存在',
                        data: null
                    }
                }

                if (user.password !== oldPassword) {
                    return {
                        code: 400,
                        message: '原密码错误',
                        data: null
                    }
                }

                user.password = newPassword

                return {
                    code: 200,
                    message: '密码修改成功',
                    data: 1
                }
            } catch {
                return {
                    code: 401,
                    message: 'Token无效',
                    data: null
                }
            }
        }
    },

    // 用户登出
    {
        url: '/api/sso/logout',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: '登出成功',
                data: null
            }
        }
    },

    // ==================== 后台管理查看商城用户（不能登录管理系统）====================

    // 后台查看商城用户列表（仅查看，不能用于管理员登录）
    {
        url: '/api/member/list',
        method: 'get',
        response: ({ query }) => {
            const { pageNum = 1, pageSize = 5, keyword = '' } = query

            let filteredUsers = mockMallUsers

            if (keyword) {
                filteredUsers = mockMallUsers.filter(user =>
                    user.username.includes(keyword) ||
                    user.nickname.includes(keyword) ||
                    user.phone.includes(keyword)
                )
            }

            const pageData = generatePageData(filteredUsers, parseInt(pageNum), parseInt(pageSize))

            // 过滤掉敏感信息
            pageData.list = pageData.list.map(user => ({
                ...user,
                password: undefined // 不返回密码
            }))

            return {
                code: 200,
                message: '查询成功',
                data: pageData
            }
        }
    },

    // 后台获取商城用户详情
    {
        url: '/api/member/:id',
        method: 'get',
        response: ({ query }) => {
            const id = parseInt(query.id as string)
            const user = mockMallUsers.find(u => u.id === id)

            if (!user) {
                return {
                    code: 404,
                    message: '用户不存在',
                    data: null
                }
            }

            const memberLevel = mockMemberLevels.find(l => l.id === user.memberLevelId)

            return {
                code: 200,
                message: '获取成功',
                data: {
                    ...user,
                    password: undefined, // 不返回密码
                    memberLevel
                }
            }
        }
    },

    // 后台修改商城用户状态
    {
        url: '/api/member/updateStatus/:id',
        method: 'post',
        response: ({ query }) => {
            const id = parseInt(query.id as string)
            const { status } = query

            const user = mockMallUsers.find(u => u.id === id)

            if (!user) {
                return {
                    code: 404,
                    message: '用户不存在',
                    data: null
                }
            }

            user.status = parseInt(status)

            return {
                code: 200,
                message: '状态修改成功',
                data: 1
            }
        }
    },

    // 获取会员等级列表
    {
        url: '/api/memberLevel/list',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '查询成功',
                data: mockMemberLevels
            }
        }
    }
]
