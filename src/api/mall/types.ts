/**
 * MallLite电商系统API类型定义
 * 基于Postman集合和接口文档
 *
 * 注意：认证相关类型已分离至 /api/sso/types.ts
 * 仅保留实际使用的类型定义
 */

// 通用响应格式（与后端CommonResult对应）
export interface CommonResult<T = unknown> {
  code: number;     // 后端使用long，前端用number
  message: string;  // 提示信息
  data: T;          // 数据封装
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

// ==================== 首页内容相关 ====================

// 首页内容
export interface HomeContent {
  advertiseList: HomeAdvertise[];
  brandList: Brand[];
  homeFlashPromotion: HomeFlashPromotion;
  newProductList: Product[];
  hotProductList: Product[];
  subjectList: CmsSubject[];
}

// 首页广告
export interface HomeAdvertise {
  id: number;
  name: string;
  type: number;
  pic: string;
  startTime: string;
  endTime: string;
  status: number;
  clickCount: number;
  orderCount: number;
  url?: string;
  note?: string;
  sort: number;
}

// 首页秒杀
export interface HomeFlashPromotion {
  startTime: string;
  endTime: string;
  nextStartTime?: string;
  nextEndTime?: string;
  productList: FlashPromotionProduct[];
}

// 秒杀商品
export interface FlashPromotionProduct extends Product {
  flashPromotionPrice: number;
  flashPromotionCount: number;
  flashPromotionLimit: number;
}

// 专题
export interface CmsSubject {
  id: number;
  categoryId: number;
  title: string;
  pic: string;
  productCount: number;
  recommendStatus: number;
  createTime: string;
  collectCount: number;
  readCount: number;
  commentCount: number;
  albumPics?: string;
  description?: string;
  showStatus: number;
  content?: string;
  forwardCount?: number;
  categoryName?: string;
}

// ==================== 商品相关 ====================

// 商品基本信息（用于列表显示）
export interface Product {
  id: number;
  name: string;
  subTitle?: string;        // 副标题
  price: number;           // 现价
  originalPrice?: number;  // 原价
  pic: string;            // 主图
  albumPics?: string[];   // 商品相册
  sale?: number;          // 销量
  stock: number;          // 库存
  brandId?: number;       // 品牌ID
  brandName?: string;     // 品牌名称
  productCategoryId?: number;    // 分类ID
  productCategoryName?: string;  // 分类名称
  promotionType?: number; // 促销类型：1-限时抢购 2-新品首发 3-热销 4-推荐
  newStatus?: number;     // 新品状态：0-非新品 1-新品
  recommandStatus?: number; // 推荐状态：0-非推荐 1-推荐
  detailTitle?: string;    // 详情标题
  detailDesc?: string;     // 详情描述
  detailHtml?: string;     // 详情HTML
}

// 商品详情信息（商品详情页使用）
export interface ProductDetail {
  product: Product;
  productAttributeList: ProductAttributeValue[];
  productSkuList: ProductSku[];
  couponList: MemberCoupon[];
}

// 商品属性值
export interface ProductAttributeValue {
  id: number;
  productAttributeId: number;
  productAttributeName: string;
  value: string;
}

// 商品SKU
export interface ProductSku {
  id: number;
  productId: number;
  skuCode: string;
  price: number;
  stock: number;
  lowStock?: number;
  spData?: string;  // 规格数据JSON字符串
}

// 商品分类（基础信息）
export interface ProductCategory {
  id: number;
  name: string;
  parentId?: number;
  level?: number;
  showStatus?: number;
  sort?: number;
  icon?: string;
  keywords?: string;
  description?: string;
}

// 商品分类树（用于分类树展示，包含子分类）
export interface ProductCategoryTree extends ProductCategory {
  children: ProductCategoryTree[];
}

// 商品品牌
export interface Brand {
  id: number;
  name: string;
  firstLetter?: string;
  logo?: string;
  showStatus?: number;
  productCount?: number;
  brandStory?: string;
}

// 商品搜索参数
export interface ProductSearchParams extends PageParams {
  keyword?: string;
  brandId?: number;
  productCategoryId?: number;
  sort?: number; // 0:按相关度 1:按新品 2:按销量 3:价格从低到高 4:价格从高到低
}

// ==================== 优惠券相关 ====================

// 优惠券查询参数
export interface CouponListParams {
  useStatus?: number;  // 使用状态：0-未使用 1-已使用 2-已过期
  pageNum?: number;
  pageSize?: number;
}

// 会员优惠券
export interface MemberCoupon {
  id: number;
  name: string;
  type: number;        // 优惠券类型：1-满减券 2-折扣券 3-现金券
  amount: number;      // 优惠金额
  minPoint?: number;   // 使用门槛
  startTime: string;
  endTime: string;
  useStatus: number;   // 使用状态：0-未使用 1-已使用 2-已过期
  note?: string;
  publishCount?: number;
  useCount?: number;
  receiveCount?: number;
  enableTime?: string;
  code?: string;
  memberLevel?: number;
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
  promotionMessage?: string;
  reduceAmount?: number;
  realStock?: number;
  integrationAmount?: number;
  growthAmount?: number;
  createDate?: string;
  modifyDate?: string;
  deleteStatus?: number;
  checked?: boolean; // 前端用于勾选状态
}

// 购物车促销信息
export interface CartPromotionItem extends CartItem {
  promotionMessage: string;
  reduceAmount: number;
  realStock: number;
  integrationAmount: number;
  growthAmount: number;
}

// 购物车商品促销信息组
export interface CartPromotionGroup {
  cartPromotionItemList: CartPromotionItem[];
  promotionMessage: string;
}

// 购物车列表促销响应
export interface CartListPromotionResponse {
  cartPromotionItemList: CartPromotionItem[];
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

// 订单项
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productPic: string;
  productName: string;
  productBrand: string;
  productSn: string;
  productPrice: number;
  productQuantity: number;
  productSkuId: number;
  productSkuCode: string;
  productCategoryId: number;
  promotionName?: string;
  promotionAmount?: number;
  couponAmount?: number;
  integrationAmount?: number;
  realAmount: number;
  giftIntegration?: number;
  giftGrowth?: number;
  productAttr?: string;
}

// 订单详情
export interface Order {
  id: number;
  memberId: number;
  couponId?: number;
  orderSn: string;
  createTime: string;
  memberUsername: string;
  totalAmount: number;
  payAmount: number;
  freightAmount: number;
  promotionAmount: number;
  integrationAmount: number;
  couponAmount: number;
  discountAmount: number;
  payType: number;
  sourceType: number;
  status: number;
  orderType: number;
  deliveryCompany?: string;
  deliverySn?: string;
  autoConfirmDay: number;
  integration: number;
  growth: number;
  promotionInfo?: string;
  billType?: number;
  billHeader?: string;
  billContent?: string;
  billReceiverPhone?: string;
  billReceiverEmail?: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode?: string;
  receiverProvince: string;
  receiverCity: string;
  receiverRegion: string;
  receiverDetailAddress: string;
  note?: string;
  confirmStatus: number;
  deleteStatus: number;
  useIntegration?: number;
  paymentTime?: string;
  deliveryTime?: string;
  receiveTime?: string;
  commentTime?: string;
  modifyTime?: string;
  orderItemList: OrderItem[];
}

// 确认订单信息
export interface ConfirmOrderResult {
  cartPromotionItemList: CartPromotionItem[];
  memberReceiveAddressList: MemberReceiveAddress[];
  couponHistoryDetailList: CouponHistoryDetail[];
  integrationConsumeSetting: IntegrationConsumeSetting;
  memberIntegration: number;
  calcAmount: OrderCalcAmount;
}

// 订单计算金额
export interface OrderCalcAmount {
  totalAmount: number;
  freightAmount: number;
  promotionAmount: number;
  payAmount: number;
}

// 积分消费设置
export interface IntegrationConsumeSetting {
  id: number;
  deductionPerAmount: number;
  maxPercentPerOrder: number;
  useUnit: number;
  couponStatus: number;
}

// 优惠券历史详情
export interface CouponHistoryDetail {
  id: number;
  couponId: number;
  couponCode: string;
  memberNickname: string;
  getCouponTime: string;
  useCouponTime?: string;
  orderSn?: string;
  coupon: MemberCoupon;
}

// 收货地址
export interface MemberReceiveAddress {
  id: number;
  memberId: number;
  name: string;
  phoneNumber: string;
  defaultStatus: number;
  postCode?: string;
  province: string;
  city: string;
  region: string;
  detailAddress: string;
}

// 提交订单参数（与后端OrderParam对应）
export interface OrderParam {
  memberReceiveAddressId: number;  // 收货地址ID
  couponId?: number;               // 优惠券ID（可选）
  useIntegration?: number;         // 使用积分数（可选）
  payType: number;                 // 支付方式：1-支付宝 2-微信支付
  cartIds: number[];               // 被选中的购物车商品ID列表
  note?: string;                   // 订单备注（可选）
}

// 订单查询参数
export interface OrderListParams extends PageParams {
  status: number; // -1:全部 0:待付款 1:待发货 2:已发货 3:已完成 4:已关闭
}

// 订单生成响应数据
export interface OrderGenerateResponse {
  order: Order;
  payInfo: {
    orderId: number;
    orderSn: string;
    payAmount: number;
    payType: number;
    payUrl?: string;
  };
}

// ==================== 支付相关 ====================

// 支付宝支付参数（与后端AliPayParam对应）
export interface AlipayParams {
  outTradeNo: string;    // 商户订单号
  subject: string;       // 商品标题
  totalAmount: string;   // 订单总金额（字符串格式）
}

// 支付状态查询参数（outTradeNo和tradeNo至少提供一个）
export interface PaymentQueryParams {
  outTradeNo?: string;  // 商户订单号
  tradeNo?: string;     // 支付宝交易号
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

// ==================== 售后服务相关 ====================

// 退货申请参数
export interface ReturnApplyCreateParams {
  orderId: number;
  productId: number;
  orderSn: string;
  returnAmount: number;
  returnName: string;
  returnPhone: string;
  returnReason: string;
  description?: string;
  proofPics?: string;
}

// 退货申请结果
export interface ReturnApplyResult {
  id: number;
  memberUsername: string;
  orderSn: string;
  createTime: string;
  productName: string;
  returnAmount: number;
  status: number;
  handleTime?: string;
  productPic: string;
  productBrand: string;
  productAttr?: string;
  productCount: number;
  productPrice: number;
  productRealPrice: number;
  reason: string;
  description?: string;
  proofPics?: string;
  handleNote?: string;
  handleMan?: string;
  receiveMan?: string;
  receiveTime?: string;
  receiveNote?: string;
}
