/**
 * MallLite后台管理系统API类型定义
 * 基于后台管理系统接口文档
 */

// 通用响应格式
export interface AdminCommonResult<T = unknown> {
  code: number;
  message: string;
  data: T;
}

// 分页参数
export interface AdminPageParams {
  pageNum?: number;
  pageSize?: number;
}

// 分页响应数据
export interface AdminPageResult<T> {
  pageNum: number;
  pageSize: number;
  totalPage: number;
  total: number;
  list: T[];
}

// ==================== 认证授权相关 ====================

// 管理员注册参数
export interface AdminRegisterParams {
  username: string;
  password: string;
  email: string;
  nickName: string;
}

// 管理员登录参数
export interface AdminLoginParams {
  username: string;
  password: string;
}

// 登录响应
export interface AdminLoginResponse {
  token: string;
  tokenHead: string;
}

// 修改密码参数
export interface AdminUpdatePasswordParams {
  username: string;
  oldPassword: string;
  newPassword: string;
}

// 管理员信息
export interface AdminInfo {
  username: string;
  icon?: string;
  roles: string[];
  menus: AdminMenu[];
}

// 管理员菜单
export interface AdminMenu {
  id: number;
  parentId: number;
  title: string;
  level: number;
  sort: number;
  name: string;
  icon?: string;
  hidden: number;
  children?: AdminMenu[];
}

// ==================== 用户管理相关 ====================

// 管理员基本信息
export interface Admin {
  id: number;
  username: string;
  password?: string;
  icon?: string;
  email: string;
  nickName: string;
  note?: string;
  createTime: string;
  loginTime?: string;
  status: number;
}

// 用户查询参数
export interface AdminListParams extends AdminPageParams {
  keyword?: string;
}

// 用户更新参数
export interface AdminUpdateParams {
  username: string;
  email: string;
  nickName: string;
  note?: string;
}

// 用户状态更新参数
export interface AdminStatusUpdateParams {
  status: number;
}

// 用户角色分配参数
export interface AdminRoleUpdateParams {
  adminId: number;
  roleIds: number[];
}

// ==================== 商品管理相关 ====================

// 商品创建/更新参数
export interface ProductCreateParams {
  brandId?: number;
  productCategoryId?: number;
  feightTemplateId?: number;
  productAttributeCategoryId?: number;
  name: string;
  pic?: string;
  productSn?: string;
  deleteStatus?: number;
  publishStatus?: number;
  newStatus?: number;
  recommandStatus?: number;
  verifyStatus?: number;
  sort?: number;
  price: number;
  promotionPrice?: number;
  giftGrowth?: number;
  giftPoint?: number;
  usePointLimit?: number;
  subTitle?: string;
  description?: string;
  originalPrice?: number;
  stock: number;
  lowStock?: number;
  unit?: string;
  weight?: number;
  previewStatus?: number;
  serviceIds?: string;
  keywords?: string;
  note?: string;
}

// 商品查询参数
export interface ProductListParams extends AdminPageParams {
  publishStatus?: number;
  verifyStatus?: number;
  keyword?: string;
  productSn?: string;
  productCategoryId?: number;
  brandId?: number;
}

// 商品详细信息（用于编辑）
export interface ProductUpdateInfo {
  product: AdminProduct;
  memberPriceList: unknown[];
  skuStockList: unknown[];
  productLadderList: unknown[];
  productFullReductionList: unknown[];
  subjectProductRelationList: unknown[];
  prefrenceAreaProductRelationList: unknown[];
  productAttributeValueList: unknown[];
}

// 后台商品信息
export interface AdminProduct {
  id: number;
  brandId?: number;
  productCategoryId?: number;
  feightTemplateId?: number;
  productAttributeCategoryId?: number;
  name: string;
  pic?: string;
  productSn?: string;
  deleteStatus: number;
  publishStatus: number;
  newStatus: number;
  recommandStatus: number;
  verifyStatus: number;
  sort: number;
  price: number;
  promotionPrice?: number;
  giftGrowth: number;
  giftPoint: number;
  usePointLimit?: number;
  subTitle?: string;
  description?: string;
  originalPrice?: number;
  stock: number;
  lowStock?: number;
  unit?: string;
  weight?: number;
  previewStatus?: number;
  serviceIds?: string;
  keywords?: string;
  note?: string;
  createTime?: string;
  updateTime?: string;
}

// 商品简单信息
export interface ProductSimple {
  id: number;
  name: string;
  price: number;
  pic?: string;
  productSn?: string;
}

// 商品状态批量更新参数
export interface ProductBatchStatusParams {
  ids: number[];
  verifyStatus?: number;
  publishStatus?: number;
  recommendStatus?: number;
  newStatus?: number;
  deleteStatus?: number;
  detail?: string;
}

// ==================== 商品分类管理相关 ====================

// 商品分类
export interface ProductCategory {
  id: number;
  parentId: number;
  name: string;
  level: number;
  productCount: number;
  productUnit: string;
  navStatus: number;
  showStatus: number;
  sort: number;
  icon?: string;
  keywords?: string;
  description?: string;
  createTime?: string;
  updateTime?: string;
}

// 商品分类创建/更新参数
export interface ProductCategoryCreateParams {
  parentId: number;
  name: string;
  level: number;
  productCount?: number;
  productUnit?: string;
  navStatus?: number;
  showStatus?: number;
  sort?: number;
  icon?: string;
  keywords?: string;
  description?: string;
}

// ==================== 订单管理相关 ====================

// 订单查询参数
export interface AdminOrderListParams extends AdminPageParams {
  orderSn?: string;
  status?: number;
  sourceType?: number;
  orderType?: number;
  createTime?: string;
  receiverKeyword?: string;
}

// 后台订单信息
export interface AdminOrder {
  id: number;
  orderSn?: string;
  memberId: number;
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
  autoConfirmDay?: number;
  integration?: number;
  growth?: number;
  promotionInfo?: string;
  billType?: number;
  billHeader?: string;
  billContent?: string;
  billReceiverPhone?: string;
  billReceiverEmail?: string;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode?: string;
  receiverProvince?: string;
  receiverCity?: string;
  receiverRegion?: string;
  receiverDetailAddress?: string;
  note?: string;
  confirmStatus: number;
  deleteStatus: number;
  useIntegration?: number;
  paymentTime?: string;
  deliveryTime?: string;
  receiveTime?: string;
  commentTime?: string;
  modifyTime?: string;
  createTime: string;
}

// 订单发货参数
export interface OrderDeliveryParams {
  orderId: number;
  deliveryCompany?: string;
  deliverySn?: string;
}

// 批量发货参数
export interface OrderBatchDeliveryParams {
  deliveryParamList: OrderDeliveryParams[];
}

// 订单关闭参数
export interface OrderCloseParams {
  ids: number[];
  note?: string;
}

// 订单详情
export interface AdminOrderDetail {
  order: AdminOrder;
  orderItemList: AdminOrderItem[];
  historyList: AdminOrderOperateHistory[];
}

// 订单商品项
export interface AdminOrderItem {
  id: number;
  orderId: number;
  orderSn: string;
  productId: number;
  productPic?: string;
  productName: string;
  productBrand?: string;
  productSn?: string;
  productPrice: number;
  productQuantity: number;
  productSkuId?: number;
  productSkuCode?: string;
  productCategoryId?: number;
  promotionName?: string;
  promotionAmount?: number;
  couponAmount?: number;
  integrationAmount?: number;
  realAmount: number;
  giftIntegration: number;
  giftGrowth: number;
  productAttr?: string;
}

// 订单操作历史
export interface AdminOrderOperateHistory {
  id: number;
  orderId: number;
  operateMan: string;
  createTime: string;
  orderStatus: number;
  note?: string;
}

// 收货人信息更新参数
export interface OrderReceiverInfoUpdateParams {
  orderId: number;
  receiverName: string;
  receiverPhone: string;
  receiverPostCode?: string;
  receiverProvince?: string;
  receiverCity?: string;
  receiverRegion?: string;
  receiverDetailAddress?: string;
}

// 订单费用信息更新参数
export interface OrderMoneyInfoUpdateParams {
  orderId: number;
  freightAmount?: number;
  discountAmount?: number;
  status?: number;
}

// 订单备注更新参数
export interface OrderNoteUpdateParams {
  id: number;
  note?: string;
  status?: number;
}

// ==================== 角色管理相关 ====================

// 角色信息
export interface AdminRole {
  id: number;
  name: string;
  description?: string;
  adminCount: number;
  createTime?: string;
  status: number;
  sort: number;
}

// 角色创建/更新参数
export interface AdminRoleCreateParams {
  name: string;
  description?: string;
  adminCount?: number;
  status?: number;
  sort?: number;
}

// 角色状态更新参数
export interface AdminRoleStatusParams {
  status: number;
}

// 角色菜单分配参数
export interface AdminRoleMenuParams {
  roleId: number;
  menuIds: number[];
}

// 角色资源分配参数
export interface AdminRoleResourceParams {
  roleId: number;
  resourceIds: number[];
}

// ==================== 资源管理相关 ====================

// 资源信息
export interface AdminResource {
  id: number;
  createTime?: string;
  name: string;
  url: string;
  description?: string;
  categoryId?: number;
}

// 资源创建/更新参数
export interface AdminResourceCreateParams {
  name: string;
  url: string;
  description?: string;
  categoryId?: number;
}

// 资源查询参数
export interface AdminResourceListParams extends AdminPageParams {
  categoryId?: number;
  nameKeyword?: string;
  urlKeyword?: string;
}

// ==================== 文件上传相关 ====================

// 文件上传响应
export interface FileUploadResponse {
  url: string;
  name: string;
}

// MinIO删除参数
export interface MinioDeleteParams {
  objectName: string;
}

// OSS签名响应
export interface OssSignResponse {
  accessKeyId: string;
  policy: string;
  signature: string;
  dir: string;
  host: string;
  expire: string;
}
