/**
 * API模块统一导出
 * 整合所有API模块，方便统一管理和使用
 */

// 现有认证系统 (原有系统)
export * as auth from './auth';

// 电商SSO认证系统 (独立的电商认证)
export * as sso from './sso';

// 电商系统主要功能
export * as mall from './mall';

// 用户相关
export * as user from './user';

// 积分相关
export * as points from './points';

// 默认导出便于整体导入
export { default as ssoAPI } from './sso';
export { default as mallAPI } from './mall';

// 导出常用类型
export type { CommonResult, PageResult, PageParams } from './mall/types';
export type {
  LoginResponse as SSOLoginResponse,
  MemberInfo as SSOMemberInfo,
  SsoRegisterParams as SSORegisterParams,
  LoginParams as SSOLoginParams
} from './sso/types';

// 导出mall模块的实际使用类型
export type {
  ProductSearchParams,
  CartAddParams,
  CartUpdateQuantityParams,
  CartDeleteParams,
  OrderParam,
  OrderListParams,
  AddressAddParams,
  CouponListParams,
  AlipayParams,
  PaymentQueryParams
} from './mall/types';
