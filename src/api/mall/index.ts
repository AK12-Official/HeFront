/**
 * MallLite电商系统API接口
 * 基于Postman集合和接口文档
 *
 * 注意：认证相关接口已分离至 /api/sso 模块
 */
import request from "@/utils/request";
import type {
  ProductSearchParams,
  CartAddParams,
  CartUpdateQuantityParams,
  CartDeleteParams,
  OrderParam,
  OrderListParams,
  AddressAddParams,
  AlipayParams,
  PaymentQueryParams,
  ProductCategoryTree,
  CommonResult,
  HomeContent,
  Product,
  ProductDetail,
  CartItem,
  CartListPromotionResponse,
  ConfirmOrderResult,
  Order,
  MemberReceiveAddress,
  MemberCoupon,
  CouponListParams,
  PageResult,
  CmsSubject,
  ReturnApplyCreateParams,
  ReturnApplyResult,
} from "./types";

// ==================== 1. 首页内容 ====================

export const homeContent = (): Promise<CommonResult<HomeContent>> => {
  return request.get('/home/content');
};

export const homeRecommendProductList = (pageNum: number = 1, pageSize: number = 24): Promise<CommonResult<PageResult<Product>>> => {
  return request.get('/home/recommendProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeHotProductList = (pageNum: number = 1, pageSize: number = 6): Promise<CommonResult<PageResult<Product>>> => {
  return request.get('/home/hotProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeNewProductList = (pageNum: number = 1, pageSize: number = 6): Promise<CommonResult<PageResult<Product>>> => {
  return request.get('/home/newProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeProductCateList = (parentId: number = 0): Promise<CommonResult<ProductCategoryTree[]>> => {
  return request.get(`/home/productCateList/${parentId}`);
};

export const homeSubjectList = (cateId?: number, pageNum: number = 1, pageSize: number = 4): Promise<CommonResult<PageResult<CmsSubject>>> => {
  return request.get('/home/subjectList', {
    params: { cateId, pageNum, pageSize }
  });
};

// ==================== 2. 商品管理 ====================

export const productSearch = (params: ProductSearchParams): Promise<CommonResult<PageResult<Product>>> => {
  return request.get('/product/search', { params });
};

export const productDetail = (id: number): Promise<CommonResult<ProductDetail>> => {
  return request.get(`/product/detail/${id}`);
};

export const productCategoryTreeList = (): Promise<CommonResult<ProductCategoryTree[]>> => {
  return request.get('/product/categoryTreeList');
};

// ==================== 3. 购物车 ====================

export const cartAdd = (data: CartAddParams): Promise<CommonResult<null>> => {
  return request.post('/cart/add', data);
};

export const cartList = (): Promise<CommonResult<CartItem[]>> => {
  return request.get('/cart/list');
};

// 兼容不同的命名方式
export const cartListGet = (): Promise<CommonResult<CartItem[]>> => {
  return request.get('/cart/list');
};

export const cartListPromotion = (cartIds?: number[]): Promise<CommonResult<CartListPromotionResponse>> => {
  return request.get('/cart/list/promotion', {
    params: cartIds ? { cartIds: cartIds.join(',') } : {}
  });
};

export const cartUpdateQuantity = (params: CartUpdateQuantityParams): Promise<CommonResult<null>> => {
  return request.get('/cart/update/quantity', { params });
};

export const cartGetProduct = (productId: number): Promise<CommonResult<Product>> => {
  return request.get(`/cart/getProduct/${productId}`);
};

export const cartUpdateAttr = (data: CartItem): Promise<CommonResult<null>> => {
  return request.post('/cart/update/attr', data);
};

export const cartDelete = (params: CartDeleteParams): Promise<CommonResult<null>> => {
  return request.post('/cart/delete', params);
};

export const cartClear = (): Promise<CommonResult<null>> => {
  return request.post('/cart/clear');
};

// ==================== 4. 订单管理 ====================

export const orderGenerateConfirmOrder = (cartIds: number[]): Promise<CommonResult<ConfirmOrderResult>> => {
  return request.post('/order/generateConfirmOrder', cartIds);
};

export const orderGenerateOrder = (data: OrderParam): Promise<CommonResult<Order>> => {
  return request.post('/order/generateOrder', data);
};

export const orderPaySuccess = (orderId: number, payType: number): Promise<CommonResult<null>> => {
  return request.post('/order/paySuccess', null, {
    params: { orderId, payType }
  });
};

export const orderList = (params: OrderListParams): Promise<CommonResult<PageResult<Order>>> => {
  return request.get('/order/list', { params });
};

export const orderDetail = (orderId: number): Promise<CommonResult<Order>> => {
  return request.get(`/order/detail/${orderId}`);
};

export const orderCancelUserOrder = (orderId: number): Promise<CommonResult<null>> => {
  return request.post('/order/cancelUserOrder', null, {
    params: { orderId }
  });
};

export const orderConfirmReceiveOrder = (orderId: number): Promise<CommonResult<null>> => {
  return request.post('/order/confirmReceiveOrder', null, {
    params: { orderId }
  });
};

export const orderDeleteOrder = (orderId: number): Promise<CommonResult<null>> => {
  return request.post('/order/deleteOrder', null, {
    params: { orderId }
  });
};

// ==================== 5. 支付接口 ====================

export const alipayPay = (params: AlipayParams) => {
  return request.get('/alipay/pay', { params });
};

export const alipayWebPay = (params: AlipayParams) => {
  return request.get('/alipay/webPay', { params });
};

export const alipayQuery = (params: PaymentQueryParams) => {
  return request.get('/alipay/query', { params });
};

export const alipayNotify = (data: Record<string, unknown>) => {
  return request.post('/alipay/notify', data);
};

// ==================== 6. 会员地址 ====================

export const memberAddressAdd = (data: AddressAddParams): Promise<CommonResult<null>> => {
  return request.post('/member/address/add', data);
};

export const memberAddressDelete = (id: number): Promise<CommonResult<null>> => {
  return request.post(`/member/address/delete/${id}`);
};

export const memberAddressUpdate = (id: number, data: AddressAddParams): Promise<CommonResult<null>> => {
  return request.post(`/member/address/update/${id}`, data);
};

export const memberAddressList = (): Promise<CommonResult<MemberReceiveAddress[]>> => {
  return request.get('/member/address/list');
};

export const memberAddressDetail = (id: number): Promise<CommonResult<MemberReceiveAddress>> => {
  return request.get(`/member/address/${id}`);
};

// ==================== 7. 会员优惠券 ====================

export const memberCouponAdd = (couponId: number): Promise<CommonResult<null>> => {
  return request.post(`/member/coupon/add/${couponId}`);
};

export const memberCouponListHistory = (params?: CouponListParams): Promise<CommonResult<PageResult<MemberCoupon>>> => {
  return request.get('/member/coupon/listHistory', { params });
};

export const memberCouponList = (params?: CouponListParams): Promise<CommonResult<PageResult<MemberCoupon>>> => {
  return request.get('/member/coupon/list', { params });
};

export const memberCouponListCart = (type: number): Promise<CommonResult<MemberCoupon[]>> => {
  return request.get(`/member/coupon/list/cart/${type}`);
};

export const memberCouponListByProduct = (productId: number): Promise<CommonResult<MemberCoupon[]>> => {
  return request.get(`/member/coupon/listByProduct/${productId}`);
};

// ==================== 8. 高级搜索 ====================

export const esProductSearchSimple = (keyword: string) => {
  return request.get('/esProduct/search/simple', {
    params: { keyword }
  });
};

export const esProductSearch = (params: ProductSearchParams) => {
  return request.get('/esProduct/search', { params });
};

export const esProductRecommend = (id: number) => {
  return request.get(`/esProduct/recommend/${id}`);
};

// ==================== 9. 售后服务 ====================

export const returnApplyCreate = (data: ReturnApplyCreateParams): Promise<CommonResult<ReturnApplyResult>> => {
  return request.post('/returnApply/create', data);
};

// 导出所有API
export default {
  // 首页内容
  homeContent,
  homeRecommendProductList,
  homeHotProductList,
  homeNewProductList,
  homeProductCateList,

  // 商品管理
  productSearch,
  productDetail,
  productCategoryTreeList,

  // 购物车
  cartAdd,
  cartList,
  cartListPromotion,
  cartUpdateQuantity,
  cartGetProduct,
  cartUpdateAttr,
  cartDelete,
  cartClear,

  // 订单管理
  orderGenerateConfirmOrder,
  orderGenerateOrder,
  orderPaySuccess,
  orderList,
  orderDetail,
  orderCancelUserOrder,
  orderConfirmReceiveOrder,
  orderDeleteOrder,

  // 支付接口
  alipayPay,
  alipayWebPay,
  alipayQuery,
  alipayNotify,

  // 会员地址
  memberAddressAdd,
  memberAddressDelete,
  memberAddressUpdate,
  memberAddressList,
  memberAddressDetail,

  // 会员优惠券
  memberCouponAdd,
  memberCouponListHistory,
  memberCouponList,
  memberCouponListCart,
  memberCouponListByProduct,

  // 高级搜索
  esProductSearchSimple,
  esProductSearch,
  esProductRecommend,

  // 售后服务
  returnApplyCreate,
};
