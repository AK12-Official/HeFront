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
  CouponListParams,
  AlipayParams,
  PaymentQueryParams,
} from "./types";

// ==================== 1. 首页内容 ====================

export const homeContent = () => {
  return request.get('/home/content');
};

export const homeRecommendProductList = (pageNum: number = 1, pageSize: number = 4) => {
  return request.get('/home/recommendProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeHotProductList = (pageNum: number = 1, pageSize: number = 6) => {
  return request.get('/home/hotProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeNewProductList = (pageNum: number = 1, pageSize: number = 6) => {
  return request.get('/home/newProductList', {
    params: { pageNum, pageSize }
  });
};

export const homeProductCateList = (parentId: number = 0) => {
  return request.get(`/home/productCateList/${parentId}`);
};

export const homeSubjectList = (cateId?: number, pageNum: number = 1, pageSize: number = 4) => {
  return request.get('/home/subjectList', {
    params: { cateId, pageNum, pageSize }
  });
};

// ==================== 2. 商品管理 ====================

export const productSearch = (params: ProductSearchParams) => {
  return request.get('/product/search', { params });
};

export const productDetail = (id: number) => {
  return request.get(`/product/detail/${id}`);
};

export const productCategoryTreeList = () => {
  return request.get('/product/categoryTreeList');
};

// ==================== 3. 购物车 ====================

export const cartAdd = (data: CartAddParams) => {
  return request.post('/cart/add', data);
};

export const cartList = () => {
  return request.get('/cart/list');
};

// 兼容不同的命名方式
export const cartListGet = () => {
  return request.get('/cart/list');
};

export const cartListPromotion = (cartIds?: number[]) => {
  return request.get('/cart/list/promotion', {
    params: cartIds ? { cartIds: cartIds.join(',') } : {}
  });
};

export const cartUpdateQuantity = (params: CartUpdateQuantityParams) => {
  return request.get('/cart/update/quantity', { params });
};

export const cartGetProduct = (productId: number) => {
  return request.get(`/cart/getProduct/${productId}`);
};

export const cartUpdateAttr = (data: { id: number; productAttr: string }) => {
  return request.post('/cart/update/attr', data);
};

export const cartDelete = (params: CartDeleteParams) => {
  return request.post('/cart/delete', params);
};

export const cartClear = () => {
  return request.post('/cart/clear');
};

// ==================== 4. 订单管理 ====================

export const orderGenerateConfirmOrder = (cartIds: number[]) => {
  return request.post('/order/generateConfirmOrder', cartIds);
};

export const orderGenerateOrder = (data: OrderParam) => {
  return request.post('/order/generateOrder', data);
};

export const orderPaySuccess = (orderId: number, payType: number) => {
  return request.post('/order/paySuccess', null, {
    params: { orderId, payType }
  });
};

export const orderList = (params: OrderListParams) => {
  return request.get('/order/list', { params });
};

export const orderDetail = (orderId: number) => {
  return request.get(`/order/detail/${orderId}`);
};

export const orderCancelUserOrder = (orderId: number) => {
  return request.post('/order/cancelUserOrder', null, {
    params: { orderId }
  });
};

export const orderConfirmReceiveOrder = (orderId: number) => {
  return request.post('/order/confirmReceiveOrder', null, {
    params: { orderId }
  });
};

export const orderDeleteOrder = (orderId: number) => {
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

export const memberAddressAdd = (data: AddressAddParams) => {
  return request.post('/member/address/add', data);
};

export const memberAddressDelete = (id: number) => {
  return request.post(`/member/address/delete/${id}`);
};

export const memberAddressUpdate = (id: number, data: AddressAddParams) => {
  return request.post(`/member/address/update/${id}`, data);
};

export const memberAddressList = () => {
  return request.get('/member/address/list');
};

export const memberAddressDetail = (id: number) => {
  return request.get(`/member/address/${id}`);
};

// ==================== 7. 会员优惠券 ====================

export const memberCouponAdd = (couponId: number) => {
  return request.post(`/member/coupon/add/${couponId}`);
};

export const memberCouponListHistory = () => {
  return request.get('/member/coupon/listHistory');
};

export const memberCouponList = (params?: CouponListParams) => {
  return request.get('/member/coupon/list', { params });
};

export const memberCouponListCart = (type: number) => {
  return request.get(`/member/coupon/list/cart/${type}`);
};

export const memberCouponListByProduct = (productId: number) => {
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

export const returnApplyCreate = (data: {
  orderId: number;
  productId: number;
  orderSn: string;
  memberUsername: string;
  returnName: string;
  returnPhone: string;
  productPic: string;
  productName: string;
  productBrand: string;
  productAttr?: string;
  productCount: number;
  productPrice: number;
  productRealPrice: number;
  reason: string;
  description?: string;
  proofPics?: string;
}) => {
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
