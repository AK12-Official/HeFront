/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 电商平台Mock数据
 * 注意：已清空默认数据，仅用于API接口结构参考
 * 实际数据将从后端API获取
 */

// 模拟商品数据（已清空，仅用于API结构参考）
const mockProducts: any[] = []

// 模拟分类数据（已清空，仅用于API结构参考）
const mockCategories: any[] = []

// 模拟订单数据（已清空，仅用于API结构参考）
const mockOrders: any[] = []

// 模拟购物车数据（已清空，仅用于API结构参考）
const mockCartItems: any[] = []

// 模拟优惠券数据
const mockCoupons: any[] = [
    // 未使用的优惠券
    {
        id: 30,
        type: 0,
        name: "小米手机专用券",
        platform: 0,
        count: 998,
        amount: 200,
        perLimit: 1,
        minPoint: 2000,
        startTime: "2022-11-07T16:00:00.000+00:00",
        endTime: "2025-11-29T16:00:00.000+00:00", // 未来日期，未过期
        useType: 2,
        publishCount: 1000,
        useCount: 0, // 未使用
        receiveCount: 2,
        enableTime: "2022-11-07T16:00:00.000+00:00"
    },
    {
        id: 27,
        type: 0,
        name: "全品类通用券",
        platform: 0,
        count: 93,
        amount: 10,
        perLimit: 10,
        minPoint: 100,
        startTime: "2022-11-07T16:00:00.000+00:00",
        endTime: "2025-11-29T16:00:00.000+00:00", // 未来日期，未过期
        useType: 0,
        publishCount: 100,
        useCount: 0, // 未使用
        receiveCount: 7,
        enableTime: "2022-11-07T16:00:00.000+00:00"
    },
    // 已使用的优惠券
    {
        id: 29,
        type: 0,
        name: "苹果手机专用券",
        platform: 0,
        count: 998,
        amount: 600,
        perLimit: 1,
        minPoint: 4000,
        startTime: "2022-11-07T16:00:00.000+00:00",
        endTime: "2025-11-29T16:00:00.000+00:00", // 未来日期，未过期
        useType: 2,
        publishCount: 1000,
        useCount: 1, // 已使用
        receiveCount: 2,
        enableTime: "2022-11-07T16:00:00.000+00:00"
    },
    {
        id: 28,
        type: 0,
        name: "手机分类专用券",
        platform: 0,
        count: 995,
        amount: 100,
        perLimit: 5,
        minPoint: 1000,
        startTime: "2022-11-07T16:00:00.000+00:00",
        endTime: "2025-11-29T16:00:00.000+00:00", // 未来日期，未过期
        useType: 1,
        publishCount: 1000,
        useCount: 1, // 已使用
        receiveCount: 5,
        enableTime: "2022-11-07T16:00:00.000+00:00"
    },
    // 已过期的优惠券
    {
        id: 31,
        type: 0,
        name: "限时优惠券",
        platform: 0,
        count: 999,
        amount: 20,
        perLimit: 5,
        minPoint: 500,
        startTime: "2022-11-30T16:00:00.000+00:00",
        endTime: "2022-12-21T16:00:00.000+00:00", // 过去日期，已过期
        useType: 0,
        publishCount: 1000,
        useCount: 0,
        receiveCount: 1,
        enableTime: "2022-12-22T16:00:00.000+00:00"
    },
    {
        id: 32,
        type: 0,
        name: "过期测试券",
        platform: 0,
        count: 100,
        amount: 50,
        perLimit: 1,
        minPoint: 200,
        startTime: "2023-01-01T00:00:00.000+00:00",
        endTime: "2023-12-31T23:59:59.000+00:00", // 过去日期，已过期
        useType: 0,
        publishCount: 100,
        useCount: 0,
        receiveCount: 10,
        enableTime: "2023-01-01T00:00:00.000+00:00"
    }
]

// 模拟地址数据（已清空，仅用于API结构参考）
const mockAddresses: any[] = []

// 模拟首页数据（已清空，仅用于API结构参考）
const mockHomeContent = {
    advertiseList: [],
    brandList: [],
    homeFlashPromotion: {
        startTime: '',
        endTime: '',
        productList: []
    },
    newProductList: [],
    hotProductList: [],
    subjectList: []
}

// Mock API 配置
const mallMockApi = [
    // 首页内容
    {
        url: '/api/home/content',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '操作成功',
                data: mockHomeContent
            }
        }
    },
    // 商品搜索
    {
        url: '/api/product/search',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '操作成功',
                data: {
                    list: mockProducts,
                    total: mockProducts.length,
                    pageNum: 1,
                    pageSize: 10,
                    totalPage: 1
                }
            }
        }
    },
    // 购物车列表
    {
        url: '/api/cart/list',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '操作成功',
                data: mockCartItems
            }
        }
    },
    // 订单列表
    {
        url: '/api/order/list',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '操作成功',
                data: {
                    list: mockOrders,
                    total: mockOrders.length,
                    pageNum: 1,
                    pageSize: 10,
                    totalPage: 1
                }
            }
        }
    },
    // 优惠券列表
    {
        url: '/api/member/coupon/list',
        method: 'get',
        response: ({ query }) => {
            let filteredCoupons = [...mockCoupons]

            // 根据useStatus参数筛选
            if (query.useStatus !== undefined && query.useStatus !== '-1') {
                const useStatus = parseInt(query.useStatus)
                filteredCoupons = mockCoupons.filter(coupon => {
                    const now = new Date()
                    const endTime = new Date(coupon.endTime)

                    // 判断优惠券状态
                    let couponStatus = 0 // 默认未使用
                    if (now > endTime) {
                        couponStatus = 2 // 已过期
                    } else if (coupon.useCount && coupon.useCount > 0) {
                        couponStatus = 1 // 已使用
                    }

                    return couponStatus === useStatus
                })
            }

            return {
                code: 200,
                message: '操作成功',
                data: filteredCoupons
            }
        }
    },
    // 地址列表
    {
        url: '/api/member/address/list',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '操作成功',
                data: mockAddresses
            }
        }
    }
]

export default mallMockApi
