/**
 * MallLite电商系统API类型定义
 * 基于Postman集合和接口文档
 *
 * 注意：认证相关类型已分离至 /api/sso/types.ts
 * 仅保留实际使用的类型定义
 */

// 通用响应格式
export interface CommonResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 分页参数
export interface PageParams {
  pageNum: number;
  pageSize: number;
}

// 分页响应数据
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPage: number;
}

// ==================== 商品相关 ====================

// 商品搜索参数
export interface ProductSearchParams extends PageParams {
  keyword?: string;
  brandId?: number;
  productCategoryId?: number;
  sort?: number; // 0:按相关度 1:按新品 2:按销量 3:价格从低到高 4:价格从高到低
}

// ==================== 购物车相关 ====================

// 购物车项数据类型
export interface CartItem {
  id: number;
  productId: number;
  productSkuId: number;
  memberId: number;
  memberUsername: string;
  quantity: number;
  price: number;
  productPic: string;
  productName: string;
  productSubTitle: string;
  productSkuCode: string;
  productAttr: string;
  productBrand: string;
  productSn: string;
  productCategoryId: number;
  promotionMessage: string;
  reduceAmount: number;
  realStock: number;
  checked?: boolean; // 前端用于勾选状态
}

// 添加到购物车参数
export interface CartAddParams {
  productId: number;
  productSkuId: number;
  quantity: number;
}

// 修改购物车商品数量参数
export interface CartUpdateQuantityParams {
  id: number;
  quantity: number;
}

// 删除购物车商品参数
export interface CartDeleteParams {
  ids: string; // 逗号分隔的ID字符串
}

// ==================== 订单相关 ====================

// 提交订单参数
export interface OrderParam {
  memberReceiveAddressId: number;
  couponId?: number;
  useIntegration?: number;
  payType: number; // 1:支付宝 2:微信支付
  cartIds: number[];
}

// 订单查询参数
export interface OrderListParams extends PageParams {
  status: number; // -1:全部 0:待付款 1:待发货 2:已发货 3:已完成 4:已关闭
}

// ==================== 支付相关 ====================

// 支付宝支付参数
export interface AlipayParams {
  outTradeNo: string;
  subject: string;
  totalAmount: string;
}

// 支付状态查询参数
export interface PaymentQueryParams {
  outTradeNo: string;
}

// ==================== 收货地址相关 ====================

// 添加收货地址参数
export interface AddressAddParams {
  name: string;
  phoneNumber: string;
  province: string;
  city: string;
  region: string;
  detailAddress: string;
  defaultStatus: number;
}

// ==================== 优惠券相关 ====================

// 优惠券查询参数
export interface CouponListParams {
  useStatus: number; // 0:未使用 1:已使用 2:已过期
}
