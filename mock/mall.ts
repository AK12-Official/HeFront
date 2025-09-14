/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 电商平台Mock数据
 * 注意：已清空默认数据，仅用于API接口结构参考
 * 实际数据将从后端API获取
 */

// 商品数据 - 从真实API获取
const mockProducts: any[] = []

// 订单数据 - 从真实API获取
const mockOrders: any[] = []

// 购物车数据 - 从真实API获取
const mockCartItems: any[] = []

// 优惠券数据 - 从真实API获取
const mockCoupons: any[] = []

// 用户数据 - 从真实API获取
const mockUsers: any[] = []

// 地址数据 - 从真实API获取
const mockAddresses: any[] = []

export default [
    // 商品相关接口
    {
        url: '/api/products',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockProducts
            }
        }
    },

    // 订单相关接口
    {
        url: '/api/orders',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockOrders
            }
        }
    },

    // 购物车相关接口
    {
        url: '/api/cart',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockCartItems
            }
        }
    },

    // 优惠券相关接口
    {
        url: '/api/coupons',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockCoupons
            }
        }
    },

    // 用户相关接口
    {
        url: '/api/user/profile',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockUsers[0] || null
            }
        }
    },

    // 地址相关接口
    {
        url: '/api/addresses',
        method: 'get',
        response: () => {
            return {
                code: 200,
                message: '获取成功',
                data: mockAddresses
            }
        }
    },

    // 退货申请相关接口
    {
        url: '/api/admin/returnApply/list',
        method: 'get',
        response: (req: any) => {
            const { pageNum = 1, pageSize = 10, id, orderSn, status, handleMan, createTime } = req.query;

            // 模拟退货申请数据
            const mockReturnApplies = [
                {
                    id: 1,
                    orderId: 1,
                    orderSn: '202312010001',
                    memberId: 1,
                    memberUsername: 'testuser',
                    productId: 1,
                    productName: '测试商品1',
                    productPic: '/img/products/product1.jpg',
                    productBrand: '测试品牌',
                    productAttr: '颜色:红色,尺寸:M',
                    productCount: 1,
                    productPrice: 99.00,
                    productRealPrice: 99.00,
                    returnAmount: 99.00,
                    returnName: '张三',
                    returnPhone: '13800138000',
                    status: 0, // 待处理
                    reason: '商品质量问题',
                    description: '收到的商品有瑕疵，要求退货',
                    proofPics: '/img/proof1.jpg,/img/proof2.jpg',
                    handleNote: '',
                    handleMan: '',
                    handleTime: '',
                    receiveMan: '',
                    receiveTime: '',
                    receiveNote: '',
                    createTime: '2023-12-01 10:00:00',
                    modifyTime: '2023-12-01 10:00:00'
                },
                {
                    id: 2,
                    orderId: 2,
                    orderSn: '202312010002',
                    memberId: 2,
                    memberUsername: 'testuser2',
                    productId: 2,
                    productName: '测试商品2',
                    productPic: '/img/products/product2.jpg',
                    productBrand: '测试品牌2',
                    productAttr: '颜色:蓝色,尺寸:L',
                    productCount: 2,
                    productPrice: 199.00,
                    productRealPrice: 199.00,
                    returnAmount: 398.00,
                    returnName: '李四',
                    returnPhone: '13800138001',
                    status: 1, // 退货中
                    reason: '不喜欢',
                    description: '商品与描述不符',
                    proofPics: '/img/proof3.jpg',
                    handleNote: '已联系客户，安排退货',
                    handleMan: 'admin',
                    handleTime: '2023-12-01 14:00:00',
                    receiveMan: 'admin',
                    receiveTime: '',
                    receiveNote: '',
                    createTime: '2023-12-01 11:00:00',
                    modifyTime: '2023-12-01 14:00:00'
                },
                {
                    id: 3,
                    orderId: 3,
                    orderSn: '202312010003',
                    memberId: 3,
                    memberUsername: 'testuser3',
                    productId: 3,
                    productName: '测试商品3',
                    productPic: '/img/products/product3.jpg',
                    productBrand: '测试品牌3',
                    productAttr: '颜色:绿色,尺寸:XL',
                    productCount: 1,
                    productPrice: 299.00,
                    productRealPrice: 299.00,
                    returnAmount: 299.00,
                    returnName: '王五',
                    returnPhone: '13800138002',
                    status: 2, // 已完成
                    reason: '商品损坏',
                    description: '商品在运输过程中损坏',
                    proofPics: '/img/proof4.jpg,/img/proof5.jpg',
                    handleNote: '已确认商品损坏，同意退货',
                    handleMan: 'admin',
                    handleTime: '2023-12-01 16:00:00',
                    receiveMan: 'admin',
                    receiveTime: '2023-12-02 10:00:00',
                    receiveNote: '已收到退货商品',
                    createTime: '2023-12-01 12:00:00',
                    modifyTime: '2023-12-02 10:00:00'
                }
            ];

            // 简单的过滤逻辑
            let filteredData = mockReturnApplies;

            if (id) {
                filteredData = filteredData.filter(item => item.id === parseInt(id));
            }
            if (orderSn) {
                filteredData = filteredData.filter(item => item.orderSn.includes(orderSn));
            }
            if (status !== undefined && status !== '') {
                filteredData = filteredData.filter(item => item.status === parseInt(status));
            }
            if (handleMan) {
                filteredData = filteredData.filter(item => item.handleMan && item.handleMan.includes(handleMan));
            }

            // 分页
            const start = (pageNum - 1) * pageSize;
            const end = start + pageSize;
            const list = filteredData.slice(start, end);

            return {
                code: 200,
                message: '获取成功',
                data: {
                    pageNum: parseInt(pageNum),
                    pageSize: parseInt(pageSize),
                    totalPage: Math.ceil(filteredData.length / pageSize),
                    total: filteredData.length,
                    list
                }
            };
        }
    },
    {
        url: '/api/admin/returnApply/:id',
        method: 'get',
        response: (req: any) => {
            const id = parseInt(req.params.id);
            // 这里应该根据ID返回具体的退货申请详情
            return {
                code: 200,
                message: '获取成功',
                data: {
                    id,
                    orderId: 1,
                    orderSn: '202312010001',
                    memberId: 1,
                    memberUsername: 'testuser',
                    productId: 1,
                    productName: '测试商品1',
                    productPic: '/img/products/product1.jpg',
                    productBrand: '测试品牌',
                    productAttr: '颜色:红色,尺寸:M',
                    productCount: 1,
                    productPrice: 99.00,
                    productRealPrice: 99.00,
                    returnAmount: 99.00,
                    returnName: '张三',
                    returnPhone: '13800138000',
                    status: 0,
                    reason: '商品质量问题',
                    description: '收到的商品有瑕疵，要求退货',
                    proofPics: '/img/proof1.jpg,/img/proof2.jpg',
                    handleNote: '',
                    handleMan: '',
                    handleTime: '',
                    receiveMan: '',
                    receiveTime: '',
                    receiveNote: '',
                    createTime: '2023-12-01 10:00:00',
                    modifyTime: '2023-12-01 10:00:00'
                }
            };
        }
    },
    {
        url: '/api/admin/returnApply/update/status',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: '处理成功'
            };
        }
    },
    {
        url: '/api/admin/returnApply/delete/:id',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: '删除成功'
            };
        }
    },
    {
        url: '/api/admin/returnApply/delete',
        method: 'post',
        response: () => {
            return {
                code: 200,
                message: '批量删除成功'
            };
        }
    }
]