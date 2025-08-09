# MallLite电商系统 - 前端API接口文档

## 项目概述
- **项目名称**: MallLite 电商系统
- **技术栈**: Spring Boot + MyBatis + MySQL + Redis
- **接口风格**: RESTful API
- **数据格式**: JSON
- **认证方式**: JWT Token

## 通用信息

### 基础路径
- **开发环境**: `http://localhost:8085`
- **生产环境**: 根据实际部署调整

### 请求头设置
```http
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
```

### 通用响应格式
所有接口统一使用 `CommonResult<T>` 包装返回结果：

```json
{
  "code": 200,           // 状态码：200-成功，其他为失败
  "message": "操作成功",  // 响应消息
  "data": {...}         // 实际数据，可能为对象、数组或null
}
```

---

## 1. 会员认证相关接口

### 1.1 会员注册
- **接口路径**: `POST /sso/register`
- **接口描述**: 用户注册新账号
- **请求参数**:
  - `username` (string, required): 用户名
  - `password` (string, required): 密码
  - `telephone` (string, required): 手机号
  - `authCode` (string, required): 验证码
- **响应示例**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": null
}
```

### 1.2 会员登录
- **接口路径**: `POST /sso/login`
- **接口描述**: 用户登录获取Token
- **请求参数**:
  - `username` (string, required): 用户名
  - `password` (string, required): 密码
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenHead": "Bearer "
  }
}
```

### 1.3 获取会员信息
- **接口路径**: `GET /sso/info`
- **接口描述**: 获取当前登录会员信息
- **需要认证**: 是
- **响应示例**:
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "test",
    "nickname": "测试用户",
    "phone": "18888888888",
    "integration": 1000,
    "growth": 500
  }
}
```

### 1.4 获取验证码
- **接口路径**: `GET /sso/getAuthCode`
- **接口描述**: 获取手机验证码
- **请求参数**:
  - `telephone` (string, required): 手机号
- **响应示例**:
```json
{
  "code": 200,
  "message": "获取验证码成功",
  "data": "123456"
}
```

### 1.5 修改密码
- **接口路径**: `POST /sso/updatePassword`
- **请求参数**:
  - `telephone` (string, required): 手机号
  - `password` (string, required): 新密码
  - `authCode` (string, required): 验证码

### 1.6 刷新Token
- **接口路径**: `GET /sso/refreshToken`
- **请求头**: 需要携带当前token

---

## 2. 首页相关接口

### 2.1 获取首页内容
- **接口路径**: `GET /home/content`
- **接口描述**: 获取首页轮播图、活动信息等
- **响应示例**:
```json
{
  "code": 200,
  "data": {
    "advertiseList": [...],      // 轮播广告
    "brandList": [...],          // 推荐品牌
    "homeFlashPromotion": {...}, // 秒杀活动
    "newProductList": [...],     // 新品推荐
    "hotProductList": [...],     // 人气推荐
    "subjectList": [...]         // 专题推荐
  }
}
```

### 2.2 推荐商品列表
- **接口路径**: `GET /home/recommendProductList`
- **请求参数**:
  - `pageSize` (int, optional): 每页数量，默认4
  - `pageNum` (int, optional): 页码，默认1
- **响应**: 商品列表

### 2.3 人气商品列表
- **接口路径**: `GET /home/hotProductList`
- **请求参数**: 同上（默认每页6个）

### 2.4 新品推荐列表
- **接口路径**: `GET /home/newProductList`
- **请求参数**: 同上（默认每页6个）

### 2.5 获取商品分类
- **接口路径**: `GET /home/productCateList/{parentId}`
- **路径参数**:
  - `parentId` (long, required): 父分类ID，0获取一级分类
- **响应**: 分类列表

### 2.6 获取专题列表
- **接口路径**: `GET /home/subjectList`
- **请求参数**:
  - `cateId` (long, optional): 分类ID
  - `pageSize` (int, optional): 每页数量，默认4
  - `pageNum` (int, optional): 页码，默认1

---

## 3. 商品相关接口

### 3.1 商品搜索
- **接口路径**: `GET /product/search`
- **请求参数**:
  - `keyword` (string, optional): 搜索关键词
  - `brandId` (long, optional): 品牌ID
  - `productCategoryId` (long, optional): 商品分类ID
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5
  - `sort` (int, optional): 排序方式
    - 0: 按相关度（默认）
    - 1: 按新品
    - 2: 按销量
    - 3: 价格从低到高
    - 4: 价格从高到低
- **响应示例**:
```json
{
  "code": 200,
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 10,
    "total": 50,
    "list": [
      {
        "id": 1,
        "name": "商品名称",
        "pic": "商品图片",
        "price": 199.00,
        "originalPrice": 299.00,
        "sale": 100
      }
    ]
  }
}
```

### 3.2 商品详情
- **接口路径**: `GET /product/detail/{id}`
- **路径参数**:
  - `id` (long, required): 商品ID
- **响应示例**:
```json
{
  "code": 200,
  "data": {
    "product": {...},           // 商品基本信息
    "productAttributeList": [...], // 商品属性
    "productSkuList": [...],    // 商品SKU列表
    "couponList": [...]         // 可用优惠券
  }
}
```

### 3.3 商品分类树
- **接口路径**: `GET /product/categoryTreeList`
- **响应**: 树形结构的商品分类列表

---

## 4. 购物车相关接口

### 4.1 添加商品到购物车
- **接口路径**: `POST /cart/add`
- **需要认证**: 是
- **请求体**:
```json
{
  "productId": 1,
  "productSkuId": 1,
  "quantity": 2
}
```

### 4.2 获取购物车列表
- **接口路径**: `GET /cart/list`
- **需要认证**: 是
- **响应**: 购物车商品列表

### 4.3 获取购物车促销信息
- **接口路径**: `GET /cart/list/promotion`
- **需要认证**: 是
- **请求参数**:
  - `cartIds` (List<Long>, optional): 购物车项ID列表
- **响应**: 包含促销信息的购物车列表

### 4.4 修改商品数量
- **接口路径**: `GET /cart/update/quantity`
- **需要认证**: 是
- **请求参数**:
  - `id` (long, required): 购物车项ID
  - `quantity` (int, required): 新数量

### 4.5 获取商品规格信息
- **接口路径**: `GET /cart/getProduct/{productId}`
- **路径参数**:
  - `productId` (long, required): 商品ID
- **响应**: 用于重选规格的商品信息

### 4.6 修改商品规格
- **接口路径**: `POST /cart/update/attr`
- **需要认证**: 是
- **请求体**: 购物车项对象

### 4.7 删除购物车商品
- **接口路径**: `POST /cart/delete`
- **需要认证**: 是
- **请求参数**:
  - `ids` (List<Long>, required): 购物车项ID列表

### 4.8 清空购物车
- **接口路径**: `POST /cart/clear`
- **需要认证**: 是

---

## 5. 订单相关接口

### 5.1 生成确认订单
- **接口路径**: `POST /order/generateConfirmOrder`
- **需要认证**: 是
- **请求体**: 购物车项ID列表
```json
[1, 2, 3]
```
- **响应**: 确认订单信息，包含商品清单、地址、优惠券等

### 5.2 提交订单
- **接口路径**: `POST /order/generateOrder`
- **需要认证**: 是
- **请求体**:
```json
{
  "memberReceiveAddressId": 1,  // 收货地址ID
  "couponId": 1,                // 优惠券ID
  "useIntegration": 100,        // 使用积分数
  "payType": 1,                 // 支付方式：1-支付宝，2-微信
  "cartIds": [1, 2, 3]          // 购物车项ID列表
}
```
- **响应**: 订单信息和支付相关数据

### 5.3 支付成功回调
- **接口路径**: `POST /order/paySuccess`
- **请求参数**:
  - `orderId` (long, required): 订单ID
  - `payType` (int, required): 支付方式

### 5.4 订单列表
- **接口路径**: `GET /order/list`
- **需要认证**: 是
- **请求参数**:
  - `status` (int, required): 订单状态
    - -1: 全部
    - 0: 待付款
    - 1: 待发货
    - 2: 已发货
    - 3: 已完成
    - 4: 已关闭
  - `pageNum` (int, optional): 页码，默认1
  - `pageSize` (int, optional): 每页数量，默认5

### 5.5 订单详情
- **接口路径**: `GET /order/detail/{orderId}`
- **需要认证**: 是
- **路径参数**:
  - `orderId` (long, required): 订单ID
- **响应**: 订单详细信息

### 5.6 取消订单
- **接口路径**: `POST /order/cancelUserOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID

### 5.7 确认收货
- **接口路径**: `POST /order/confirmReceiveOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID

### 5.8 删除订单
- **接口路径**: `POST /order/deleteOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID

---

## 6. 支付相关接口

### 6.1 支付宝电脑网站支付
- **接口路径**: `GET /alipay/pay`
- **请求参数**:
  - `outTradeNo` (string, required): 商户订单号
  - `subject` (string, required): 商品标题
  - `totalAmount` (decimal, required): 支付金额
- **响应**: HTML支付页面

### 6.2 支付宝手机网站支付
- **接口路径**: `GET /alipay/webPay`
- **请求参数**: 同上
- **响应**: 手机版HTML支付页面

### 6.3 支付宝异步回调
- **接口路径**: `POST /alipay/notify`
- **说明**: 支付宝服务器回调接口，由支付宝系统调用，前端无需关注

### 6.4 查询支付状态
- **接口路径**: `GET /alipay/query`
- **请求参数**:
  - `outTradeNo` (string, optional): 商户订单号
  - `tradeNo` (string, optional): 支付宝交易号
- **说明**: outTradeNo和tradeNo至少提供一个
- **响应**: 交易状态信息

---

## 7. 会员地址管理接口

### 7.1 添加收货地址
- **接口路径**: `POST /member/address/add`
- **需要认证**: 是
- **请求体**: 地址信息对象
```json
{
  "name": "张三",
  "phoneNumber": "18888888888",
  "province": "广东省",
  "city": "深圳市",
  "region": "南山区",
  "detailAddress": "科技园南区",
  "defaultStatus": 1
}
```

### 7.2 删除收货地址
- **接口路径**: `POST /member/address/delete/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID

### 7.3 修改收货地址
- **接口路径**: `POST /member/address/update/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID
- **请求体**: 地址信息对象

### 7.4 获取地址列表
- **接口路径**: `GET /member/address/list`
- **需要认证**: 是
- **响应**: 用户的所有收货地址

### 7.5 获取地址详情
- **接口路径**: `GET /member/address/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID

---

## 8. 会员优惠券接口

### 8.1 领取优惠券
- **接口路径**: `POST /member/coupon/add/{couponId}`
- **需要认证**: 是
- **路径参数**:
  - `couponId` (long, required): 优惠券ID

### 8.2 会员优惠券历史
- **接口路径**: `GET /member/coupon/listHistory`
- **需要认证**: 是
- **请求参数**:
  - `useStatus` (int, optional): 筛选状态
    - 0: 未使用
    - 1: 已使用
    - 2: 已过期

### 8.3 会员优惠券列表
- **接口路径**: `GET /member/coupon/list`
- **需要认证**: 是
- **请求参数**: 同上

### 8.4 购物车可用优惠券
- **接口路径**: `GET /member/coupon/list/cart/{type}`
- **需要认证**: 是
- **路径参数**:
  - `type` (int, required): 1-可用，0-不可用
- **响应**: 当前购物车可用的优惠券列表

### 8.5 商品相关优惠券
- **接口路径**: `GET /member/coupon/listByProduct/{productId}`
- **路径参数**:
  - `productId` (long, required): 商品ID
- **响应**: 该商品可用的优惠券列表

---

## 9. 高级搜索接口

### 9.1 简单搜索
- **接口路径**: `GET /esProduct/search/simple`
- **接口描述**: 基于ElasticSearch的简单商品搜索
- **请求参数**:
  - `keyword` (string, optional): 搜索关键词
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5
- **响应**: 搜索结果商品列表

### 9.2 综合搜索
- **接口路径**: `GET /esProduct/search`
- **接口描述**: 支持筛选、排序的综合搜索
- **请求参数**:
  - `keyword` (string, optional): 搜索关键词
  - `brandId` (long, optional): 品牌ID
  - `productCategoryId` (long, optional): 商品分类ID
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5
  - `sort` (int, optional): 排序方式
    - 0: 按相关度（默认）
    - 1: 按新品
    - 2: 按销量
    - 3: 价格从低到高
    - 4: 价格从高到低

### 9.3 商品推荐
- **接口路径**: `GET /esProduct/recommend/{id}`
- **接口描述**: 根据商品ID推荐相关商品
- **路径参数**:
  - `id` (long, required): 商品ID
- **请求参数**:
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5

---

## 10. 售后服务接口

### 9.1 申请退货
- **接口路径**: `POST /returnApply/create`
- **需要认证**: 是
- **请求体**:
```json
{
  "orderId": 1,
  "productId": 1,
  "orderSn": "202301010001",
  "returnAmount": 199.00,
  "returnName": "商品名称",
  "returnPhone": "18888888888",
  "returnReason": "质量问题",
  "description": "商品存在质量缺陷",
  "proofPics": "proof1.jpg,proof2.jpg"
}
```

---

## 11. 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 请求的资源不存在 |
| 500 | 服务器内部错误 |

## 12. 开发注意事项

1. **认证方式**: 需要认证的接口要在请求头中携带JWT Token
2. **分页参数**: 大部分列表接口支持分页，pageNum从1开始
3. **时间格式**: 统一使用 `yyyy-MM-dd HH:mm:ss` 格式
4. **金额格式**: 统一使用BigDecimal，保留两位小数
5. **图片路径**: 接口返回的图片路径为相对路径，需要拼接服务器地址
6. **支付集成**: 支付宝支付需要配置相应的APP ID和密钥

## 13. 联调建议

1. **优先对接**: 建议按以下顺序对接接口
   - 会员认证 → 首页展示 → 商品浏览 → 购物车 → 订单 → 支付
2. **测试账号**: 建议后端提供测试账号和测试商品数据
3. **异常处理**: 前端需要处理网络异常和业务异常
4. **数据校验**: 重要操作建议添加二次确认

---

> 📝 **更新日志**
> - v1.0: 初始版本，涵盖所有核心电商功能接口
> - 最后更新时间: 2025-08-07
