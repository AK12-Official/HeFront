# MallLite电商系统后台管理系统接口文档

## 目录

- [概述](#概述)
- [通用说明](#通用说明)
- [认证授权接口](#认证授权接口)
- [用户管理接口](#用户管理接口)
- [商品管理接口](#商品管理接口)
- [商品分类管理接口](#商品分类管理接口)
- [订单管理接口](#订单管理接口)
- [角色管理接口](#角色管理接口)
- [资源管理接口](#资源管理接口)
- [文件上传接口](#文件上传接口)
- [错误码说明](#错误码说明)

## 概述

MallLite电商系统后台管理系统提供了完整的电商后台管理功能，包括用户管理、商品管理、订单管理、权限管理等核心功能。

### 基础信息

- **系统名称**: MallLite电商系统后台管理系统
- **版本**: 1.0
- **基础URL**: `http://localhost:8080/admin`
- **API格式**: RESTful API
- **数据格式**: JSON

## 通用说明

### 请求头

```http
Content-Type: application/json
Authorization: Bearer {token}
```

### 通用响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 状态码说明

- `200`: 操作成功
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器内部错误

### 分页参数

- `pageNum`: 页码，默认值：1
- `pageSize`: 每页数量，默认值：5

### 分页响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 10,
    "total": 50,
    "list": []
  }
}
```

## 认证授权接口

### 1. 用户注册

**接口地址**: `POST /admin/register`

**请求参数**:

```json
{
  "username": "admin",
  "password": "123456",
  "email": "admin@example.com",
  "nickName": "管理员"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "nickName": "管理员",
    "status": 1,
    "createTime": "2023-01-01 10:00:00"
  }
}
```

### 2. 用户登录

**接口地址**: `POST /admin/login`

**请求参数**:

```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImNyZWF0ZWQiOjE2NzMzMzA0MDA5MDgsImV4cCI6MTY3MzkzNTIwMH0.abc123",
    "tokenHead": "Bearer "
  }
}
```

### 3. 刷新Token

**接口地址**: `GET /admin/refreshToken`

**请求头**:

```http
Authorization: Bearer {old_token}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "new_token_here",
    "tokenHead": "Bearer "
  }
}
```

### 4. 获取当前用户信息

**接口地址**: `GET /admin/info`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "username": "admin",
    "icon": "http://example.com/avatar.jpg",
    "roles": ["超级管理员"],
    "menus": [
      {
        "id": 1,
        "title": "商品管理",
        "name": "product",
        "level": 0,
        "children": []
      }
    ]
  }
}
```

### 5. 用户登出

**接口地址**: `POST /admin/logout`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

## 用户管理接口

### 1. 分页查询用户列表

**接口地址**: `GET /admin/list`

**请求参数**:

- `keyword` (可选): 用户名或姓名关键字
- `pageNum` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认5

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 2,
    "total": 10,
    "list": [
      {
        "id": 1,
        "username": "admin",
        "email": "admin@example.com",
        "nickName": "管理员",
        "status": 1,
        "createTime": "2023-01-01 10:00:00"
      }
    ]
  }
}
```

### 2. 获取指定用户信息

**接口地址**: `GET /admin/{id}`

**路径参数**:

- `id`: 用户ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "nickName": "管理员",
    "status": 1,
    "createTime": "2023-01-01 10:00:00"
  }
}
```

### 3. 修改指定用户信息

**接口地址**: `POST /admin/update/{id}`

**路径参数**:

- `id`: 用户ID

**请求参数**:

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "nickName": "管理员",
  "note": "超级管理员"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 4. 修改用户密码

**接口地址**: `POST /admin/updatePassword`

**请求参数**:

```json
{
  "username": "admin",
  "oldPassword": "123456",
  "newPassword": "654321"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 5. 删除用户

**接口地址**: `POST /admin/delete/{id}`

**路径参数**:

- `id`: 用户ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 6. 修改用户状态

**接口地址**: `POST /admin/updateStatus/{id}`

**路径参数**:

- `id`: 用户ID

**请求参数**:

- `status`: 状态值 (0:禁用, 1:启用)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 7. 给用户分配角色

**接口地址**: `POST /admin/role/update`

**请求参数**:

- `adminId`: 用户ID
- `roleIds`: 角色ID列表

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 2
}
```

### 8. 获取用户角色列表

**接口地址**: `GET /admin/role/{adminId}`

**路径参数**:

- `adminId`: 用户ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "超级管理员",
      "description": "拥有所有权限"
    }
  ]
}
```

## 商品管理接口

### 1. 创建商品

**接口地址**: `POST /product/create`

**请求参数**:

```json
{
  "brandId": 1,
  "productCategoryId": 1,
  "feightTemplateId": 1,
  "productAttributeCategoryId": 1,
  "name": "苹果iPhone 14",
  "pic": "http://example.com/iphone14.jpg",
  "productSn": "IP14001",
  "deleteStatus": 0,
  "publishStatus": 1,
  "newStatus": 1,
  "recommandStatus": 1,
  "verifyStatus": 1,
  "sort": 100,
  "price": 6999.00,
  "promotionPrice": 6699.00,
  "giftGrowth": 100,
  "giftPoint": 100,
  "usePointLimit": 1000,
  "subTitle": "新一代iPhone",
  "description": "苹果最新款手机",
  "originalPrice": 7299.00,
  "stock": 1000,
  "lowStock": 10,
  "unit": "部",
  "weight": 0.5,
  "previewStatus": 1,
  "serviceIds": "1,2,3",
  "keywords": "苹果,手机,iPhone",
  "note": "热销商品"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 2. 查询商品列表

**接口地址**: `GET /product/list`

**请求参数**:

- `publishStatus` (可选): 上架状态
- `verifyStatus` (可选): 审核状态
- `keyword` (可选): 商品名称关键字
- `productSn` (可选): 商品货号
- `productCategoryId` (可选): 商品分类ID
- `brandId` (可选): 品牌ID
- `pageNum` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认5

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 20,
    "total": 100,
    "list": [
      {
        "id": 1,
        "brandId": 1,
        "productCategoryId": 1,
        "name": "苹果iPhone 14",
        "pic": "http://example.com/iphone14.jpg",
        "productSn": "IP14001",
        "price": 6999.00,
        "promotionPrice": 6699.00,
        "stock": 1000,
        "publishStatus": 1,
        "verifyStatus": 1,
        "newStatus": 1,
        "recommandStatus": 1,
        "sort": 100,
        "createTime": "2023-01-01 10:00:00"
      }
    ]
  }
}
```

### 3. 获取商品编辑信息

**接口地址**: `GET /product/updateInfo/{id}`

**路径参数**:

- `id`: 商品ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "product": {
      "id": 1,
      "name": "苹果iPhone 14",
      "price": 6999.00
    },
    "memberPriceList": [],
    "skuStockList": [],
    "productLadderList": [],
    "productFullReductionList": [],
    "subjectProductRelationList": [],
    "prefrenceAreaProductRelationList": [],
    "productAttributeValueList": []
  }
}
```

### 4. 更新商品

**接口地址**: `POST /product/update/{id}`

**路径参数**:

- `id`: 商品ID

**请求参数**: 同创建商品接口

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 5. 商品简单查询

**接口地址**: `GET /product/simpleList`

**请求参数**:

- `keyword`: 商品名称或货号关键字

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "苹果iPhone 14",
      "productSn": "IP14001",
      "price": 6999.00
    }
  ]
}
```

### 6. 批量修改审核状态

**接口地址**: `POST /product/update/verifyStatus`

**请求参数**:

- `ids`: 商品ID列表
- `verifyStatus`: 审核状态 (0:未审核, 1:审核通过, 2:审核拒绝)
- `detail`: 审核详情

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 5
}
```

### 7. 批量上下架商品

**接口地址**: `POST /product/update/publishStatus`

**请求参数**:

- `ids`: 商品ID列表
- `publishStatus`: 上架状态 (0:下架, 1:上架)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 3
}
```

### 8. 批量推荐商品

**接口地址**: `POST /product/update/recommendStatus`

**请求参数**:

- `ids`: 商品ID列表
- `recommendStatus`: 推荐状态 (0:不推荐, 1:推荐)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 2
}
```

### 9. 批量设为新品

**接口地址**: `POST /product/update/newStatus`

**请求参数**:

- `ids`: 商品ID列表
- `newStatus`: 新品状态 (0:不是新品, 1:新品)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 4
}
```

### 10. 批量修改删除状态

**接口地址**: `POST /product/update/deleteStatus`

**请求参数**:

- `ids`: 商品ID列表
- `deleteStatus`: 删除状态 (0:未删除, 1:已删除)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

## 商品分类管理接口

### 1. 添加商品分类

**接口地址**: `POST /productCategory/create`

**请求参数**:

```json
{
  "parentId": 0,
  "name": "数码电器",
  "level": 0,
  "productCount": 0,
  "productUnit": "件",
  "navStatus": 1,
  "showStatus": 1,
  "sort": 100,
  "icon": "category-icon.png",
  "keywords": "数码,电器",
  "description": "数码电器分类"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 2. 修改商品分类

**接口地址**: `POST /productCategory/update/{id}`

**路径参数**:

- `id`: 分类ID

**请求参数**: 同添加商品分类接口

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 3. 分页查询商品分类

**接口地址**: `GET /productCategory/list/{parentId}`

**路径参数**:

- `parentId`: 父分类ID

**请求参数**:

- `pageNum` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认5

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 3,
    "total": 15,
    "list": [
      {
        "id": 1,
        "parentId": 0,
        "name": "数码电器",
        "level": 0,
        "productCount": 100,
        "productUnit": "件",
        "navStatus": 1,
        "showStatus": 1,
        "sort": 100,
        "icon": "category-icon.png",
        "keywords": "数码,电器",
        "description": "数码电器分类"
      }
    ]
  }
}
```

### 4. 删除商品分类

**接口地址**: `POST /productCategory/delete/{id}`

**路径参数**:

- `id`: 分类ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 5. 根据ID获取商品分类

**接口地址**: `GET /productCategory/{id}`

**路径参数**:

- `id`: 分类ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "parentId": 0,
    "name": "数码电器",
    "level": 0,
    "productCount": 100,
    "productUnit": "件",
    "navStatus": 1,
    "showStatus": 1,
    "sort": 100,
    "icon": "category-icon.png",
    "keywords": "数码,电器",
    "description": "数码电器分类"
  }
}
```

## 订单管理接口

### 1. 查询订单

**接口地址**: `GET /order/list`

**请求参数**:

- `orderSn` (可选): 订单编号
- `status` (可选): 订单状态
- `sourceType` (可选): 订单来源
- `orderType` (可选): 订单类型
- `createTime` (可选): 提交时间
- `receiverKeyword` (可选): 收货人姓名/手机号
- `pageNum` (可选): 页码，默认1
- `pageSize` (可选): 每页数量，默认5

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 10,
    "total": 50,
    "list": [
      {
        "id": 1,
        "memberId": 1,
        "orderSn": "202301010001",
        "totalAmount": 6999.00,
        "payAmount": 6699.00,
        "freightAmount": 10.00,
        "status": 1,
        "orderType": 0,
        "sourceType": 1,
        "deliveryCompany": "顺丰快递",
        "deliverySn": "SF123456789",
        "createTime": "2023-01-01 10:00:00",
        "receiverName": "张三",
        "receiverPhone": "13800138000",
        "receiverProvince": "广东省",
        "receiverCity": "深圳市",
        "receiverRegion": "南山区",
        "receiverDetailAddress": "科技园南区"
      }
    ]
  }
}
```

### 2. 批量发货

**接口地址**: `POST /order/update/delivery`

**请求参数**:

```json
[
  {
    "orderId": 1,
    "deliveryCompany": "顺丰快递",
    "deliverySn": "SF123456789"
  },
  {
    "orderId": 2,
    "deliveryCompany": "圆通快递",
    "deliverySn": "YT987654321"
  }
]
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 2
}
```

### 3. 批量关闭订单

**接口地址**: `POST /order/update/close`

**请求参数**:

- `ids`: 订单ID列表
- `note`: 关闭原因

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 3
}
```

### 4. 批量删除订单

**接口地址**: `POST /order/delete`

**请求参数**:

- `ids`: 订单ID列表

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 2
}
```

### 5. 获取订单详情

**接口地址**: `GET /order/{id}`

**路径参数**:

- `id`: 订单ID

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "order": {
      "id": 1,
      "orderSn": "202301010001",
      "totalAmount": 6999.00,
      "payAmount": 6699.00,
      "status": 1
    },
    "orderItemList": [
      {
        "id": 1,
        "orderId": 1,
        "productId": 1,
        "productName": "苹果iPhone 14",
        "productPic": "http://example.com/iphone14.jpg",
        "productPrice": 6999.00,
        "productQuantity": 1,
        "productSkuId": 1,
        "productSkuCode": "SKU001",
        "productCategoryId": 1
      }
    ],
    "historyList": [
      {
        "id": 1,
        "orderId": 1,
        "operateMan": "系统",
        "orderStatus": 0,
        "note": "订单提交",
        "createTime": "2023-01-01 10:00:00"
      }
    ]
  }
}
```

### 6. 修改收货人信息

**接口地址**: `POST /order/update/receiverInfo`

**请求参数**:

```json
{
  "orderId": 1,
  "receiverName": "李四",
  "receiverPhone": "13900139000",
  "receiverPostCode": "518000",
  "receiverProvince": "广东省",
  "receiverCity": "深圳市",
  "receiverRegion": "福田区",
  "receiverDetailAddress": "CBD中心区"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 7. 修改订单费用信息

**接口地址**: `POST /order/update/moneyInfo`

**请求参数**:

```json
{
  "orderId": 1,
  "freightAmount": 15.00,
  "discountAmount": 300.00,
  "status": 1
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

### 8. 备注订单

**接口地址**: `POST /order/update/note`

**请求参数**:

- `id`: 订单ID
- `note`: 备注内容
- `status`: 订单状态

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": 1
}
```

## 角色管理接口

### 1. 添加角色

**接口地址**: `POST /role/create`

**请求参数**:

```json
{
  "name": "商品管理员",
  "description": "负责商品管理",
  "adminCount": 0,
  "status": 1,
  "sort": 100
}
```

### 2. 修改角色

**接口地址**: `POST /role/update/{id}`

**请求参数**: 同添加角色接口

### 3. 批量删除角色

**接口地址**: `POST /role/delete`

**请求参数**:

- `ids`: 角色ID列表

### 4. 获取所有角色

**接口地址**: `GET /role/listAll`

### 5. 分页获取角色列表

**接口地址**: `GET /role/list`

### 6. 修改角色状态

**接口地址**: `POST /role/updateStatus/{id}`

### 7. 给角色分配菜单

**接口地址**: `POST /role/allocMenu`

### 8. 给角色分配资源

**接口地址**: `POST /role/allocResource`

## 资源管理接口

### 1. 添加资源

**接口地址**: `POST /resource/create`

### 2. 修改资源

**接口地址**: `POST /resource/update/{id}`

### 3. 根据ID获取资源详情

**接口地址**: `GET /resource/{id}`

### 4. 根据ID删除资源

**接口地址**: `POST /resource/delete/{id}`

### 5. 分页查询资源

**接口地址**: `GET /resource/list`

### 6. 查询所有资源

**接口地址**: `GET /resource/listAll`

## 文件上传接口

### 1. MinIO文件上传

**接口地址**: `POST /minio/upload`

**请求参数**:

- `file`: 文件 (multipart/form-data)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "url": "http://minio.example.com/mall/2023/01/01/file.jpg",
    "name": "file.jpg"
  }
}
```

### 2. MinIO文件删除

**接口地址**: `POST /minio/delete`

**请求参数**:

- `objectName`: 文件对象名称

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": null
}
```

### 3. OSS文件上传

**接口地址**: `POST /aliyun/oss/upload`

**请求参数**:

- `file`: 文件 (multipart/form-data)

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "url": "https://oss.example.com/mall/2023/01/01/file.jpg",
    "name": "file.jpg"
  }
}
```

### 4. OSS签名生成

**接口地址**: `GET /aliyun/oss/policy`

**响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "accessKeyId": "STS.xxx",
    "policy": "eyJleHBpcmF0aW9uIjoiMjAyMy0wMS0wMVQxMDowMDowMFoiLCJjb25kaXRpb25zIjpbWyJjb250ZW50LWxlbmd0aC1yYW5nZSIsMCwxMDQ4NTc2XV19",
    "signature": "signature_string",
    "dir": "mall/",
    "host": "https://oss.example.com",
    "expire": "1672574400"
  }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 操作成功 |
| 400 | 参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 405 | 方法不允许 |
| 500 | 服务器内部错误 |
| 501 | 操作失败 |
| 502 | 参数校验失败 |
| 503 | 警告信息 |

## 附录

### 订单状态说明

- `0`: 待付款
- `1`: 待发货
- `2`: 已发货
- `3`: 已完成
- `4`: 已关闭
- `5`: 无效订单

### 商品状态说明

- `publishStatus`: 上架状态 (0:下架, 1:上架)
- `verifyStatus`: 审核状态 (0:未审核, 1:审核通过, 2:审核拒绝)
- `newStatus`: 新品状态 (0:不是新品, 1:新品)
- `recommandStatus`: 推荐状态 (0:不推荐, 1:推荐)
- `deleteStatus`: 删除状态 (0:未删除, 1:已删除)

### 用户状态说明

- `0`: 禁用
- `1`: 启用

---

**注意事项**:

1. 所有需要认证的接口都需要在请求头中携带有效的JWT Token
2. 分页查询接口的页码从1开始
3. 批量操作接口需要传递ID数组
4. 文件上传接口支持常见的图片格式（jpg、png、gif等）
5. 时间格式统一使用：yyyy-MM-dd HH:mm:ss

**联系信息**:

- 系统版本: MallLite v1.0
- 文档版本: v1.0
- 最后更新: 2025-08-09
