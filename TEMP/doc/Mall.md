# MallLite 项目API接口文档

## 目录

- [1. 后台管理系统接口](#1-后台管理系统接口)
  - [1.1 用户管理](#11-用户管理)
  - [1.2 商品管理](#12-商品管理)
  - [1.3 内容管理](#13-内容管理)
  - [1.4 订单管理](#14-订单管理)
  - [1.5 权限管理](#15-权限管理)
  - [1.6 对象存储管理](#16-对象存储管理)
- [2. 前台门户系统接口](#2-前台门户系统接口)
  - [2.1 首页内容管理](#21-首页内容管理)
  - [2.2 商品管理](#22-商品管理)
  - [2.3 会员管理](#23-会员管理)
  - [2.4 订单管理](#24-订单管理)
  - [2.5 购物车管理](#25-购物车管理)
  - [2.6 支付管理](#26-支付管理)
- [3. 搜索系统接口](#3-搜索系统接口)

## 1. 后台管理系统接口

基础URL: `http://localhost:8080`

### 1.1 用户管理

#### 1.1.1 用户登录

- URL: `http://localhost:8080/admin/login`
- 方法: POST
- 描述: 后台用户登录
- 参数:
  - username: 用户名
  - password: 密码
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenHead": "Bearer "
    }
  }
  ```

#### 1.1.2 获取当前登录用户信息

- URL: `http://localhost:8080/admin/info`
- 方法: GET
- 描述: 获取当前登录用户信息
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "username": "admin",
      "menus": [...],
      "icon": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/images/20180607/timg.jpg",
      "roles": [...]
    }
  }
  ```

#### 1.1.3 用户登出

- URL: `http://localhost:8080/admin/logout`
- 方法: POST
- 描述: 用户登出功能
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": null
  }
  ```

#### 1.1.4 刷新token

- URL: `http://localhost:8080/admin/refreshToken`
- 方法: GET
- 描述: 刷新token
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiJ9...",
      "tokenHead": "Bearer "
    }
  }
  ```

#### 1.1.5 获取用户列表

- URL: `http://localhost:8080/admin/list`
- 方法: GET
- 描述: 根据用户名或姓名分页获取用户列表
- 参数:
  - keyword: 关键词(可选)
  - pageSize: 每页条数(默认5)
  - pageNum: 页码(默认1)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "pageNum": 1,
      "pageSize": 5,
      "total": 8,
      "list": [...]
    }
  }
  ```

#### 1.1.6 获取指定用户信息

- URL: `http://localhost:8080/admin/{id}`
- 方法: GET
- 描述: 获取指定用户信息
- 参数:
  - id: 用户ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "id": 1,
      "username": "admin",
      ...
    }
  }
  ```

### 1.2 商品管理

#### 1.2.1 商品搜索

- URL: `http://localhost:8080/product/list`
- 方法: GET
- 描述: 查询商品
- 参数:
  - keyword: 关键词
  - pageSize: 每页条数
  - pageNum: 页码
  - publishStatus: 上架状态
  - verifyStatus: 审核状态
  - productSn: 商品货号
  - productCategoryId: 商品分类编号
  - brandId: 品牌编号

### 1.3 内容管理

#### 1.3.1 获取所有商品优选

- URL: `http://localhost:8080/prefrenceArea/listAll`
- 方法: GET
- 描述: 获取所有商品优选
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

#### 1.3.2 获取所有主题

- URL: `http://localhost:8080/subject/listAll`
- 方法: GET
- 描述: 获取所有主题
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

### 1.4 订单管理

#### 1.4.1 获取所有收货地址

- URL: `http://localhost:8080/companyAddress/list`
- 方法: GET
- 描述: 获取所有收货地址
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

### 1.5 权限管理

#### 1.5.1 添加后台资源

- URL: `http://localhost:8080/resource/create`
- 方法: POST
- 描述: 添加后台资源
- 参数: UmsResource对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 1.5.2 修改后台资源

- URL: `http://localhost:8080/resource/update/{id}`
- 方法: POST
- 描述: 修改后台资源
- 参数:
  - id: 资源ID
  - UmsResource对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 1.5.3 根据ID删除后台资源

- URL: `http://localhost:8080/resource/delete/{id}`
- 方法: POST
- 描述: 根据ID删除后台资源
- 参数:
  - id: 资源ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 1.5.4 分页模糊查询后台资源

- URL: `http://localhost:8080/resource/list`
- 方法: GET
- 描述: 分页模糊查询后台资源
- 参数:
  - categoryId: 资源分类ID(可选)
  - nameKeyword: 名称关键字(可选)
  - urlKeyword: URL关键字(可选)
  - pageSize: 每页条数(默认5)
  - pageNum: 页码(默认1)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "pageNum": 1,
      "pageSize": 5,
      "total": 8,
      "list": [...]
    }
  }
  ```

#### 1.5.5 查询所有后台资源

- URL: `http://localhost:8080/resource/listAll`
- 方法: GET
- 描述: 查询所有后台资源
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

#### 1.5.6 给角色分配资源

- URL: `http://localhost:8080/role/allocResource`
- 方法: POST
- 描述: 给角色分配资源
- 参数:
  - roleId: 角色ID
  - resourceIds: 资源ID列表
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

### 1.6 对象存储管理

#### 1.6.1 MinIO文件上传

- URL: `http://localhost:8080/minio/upload`
- 方法: POST
- 描述: 文件上传
- 参数:
  - file: 文件
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "url": "http://localhost:9000/mall/20220428/file.jpg",
      "name": "file.jpg"
    }
  }
  ```

#### 1.6.2 MinIO文件删除

- URL: `http://localhost:8080/minio/delete`
- 方法: POST
- 描述: 文件删除
- 参数:
  - objectName: 对象名称
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": null
  }
  ```

#### 1.6.3 Oss上传签名生成

- URL: `http://localhost:8080/aliyun/oss/policy`
- 方法: GET
- 描述: Oss上传签名生成
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "accessKeyId": "test",
      "policy": "eyJleHBpcmF0aW9uIjoiMjAyMi0wNS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF0sWyJzdGFydHMtd2l0aCIsIiRrZXkiLCJtYWxsL2ltYWdlcy8iXV19",
      "signature": "VsxOgSwSEyCmGyzUDMbJLkZUYaQ=",
      "dir": "mall/images/",
      "host": "http://macro-oss.oss-cn-shenzhen.aliyuncs.com",
      "callback": "eyJjYWxsYmFja1VybCI6Imh0dHA6Ly9tYWNyby1vc3Mub3NzLWNuLXNoZW56aGVuLmFsaXl1bmNzLmNvbS9jYWxsYmFjayIsImNhbGxiYWNrQm9keSI6ImZpbGVuYW1lPSR7b2JqZWN0fSZzaXplPSR7c2l6ZX0mbWltZVR5cGU9JHttaW1lVHlwZX0maGVpZ2h0PSR7aW1hZ2VJbmZvLmhlaWdodH0md2lkdGg9JHtpbWFnZUluZm8ud2lkdGh9IiwiY2FsbGJhY2tCb2R5VHlwZSI6ImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCJ9"
    }
  }
  ```

#### 1.6.4 Oss上传成功回调

- URL: `http://localhost:8080/aliyun/oss/callback`
- 方法: POST
- 描述: Oss上传成功回调
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "filename": "file.jpg",
      "size": 1024,
      "mimeType": "image/jpeg",
      "width": 1024,
      "height": 768
    }
  }
  ```

## 2. 前台门户系统接口

基础URL: `http://localhost:8085`

### 2.1 首页内容管理

#### 2.1.1 首页内容信息展示

- URL: `http://localhost:8085/home/content`
- 方法: GET
- 描述: 首页内容信息展示
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "advertiseList": [...],
      "brandList": [...],
      "homeFlashPromotion": {...},
      "newProductList": [...],
      "hotProductList": [...],
      "subjectList": [...]
    }
  }
  ```

#### 2.1.2 获取推荐品牌

- URL: `http://localhost:8085/home/recommendBrand`
- 方法: GET
- 描述: 获取推荐品牌
- 参数:
  - pageNum: 页码
  - pageSize: 每页条数
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

#### 2.1.3 获取首页商品分类

- URL: `http://localhost:8085/home/productCateList/{parentId}`
- 方法: GET
- 描述: 获取首页商品分类
- 参数:
  - parentId: 父级ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

#### 2.1.4 分页获取人气推荐商品

- URL: `http://localhost:8085/home/hotProductList`
- 方法: GET
- 描述: 分页获取人气推荐商品
- 参数:
  - pageNum: 页码(默认1)
  - pageSize: 每页条数(默认6)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

#### 2.1.5 分页获取新品推荐商品

- URL: `http://localhost:8085/home/newProductList`
- 方法: GET
- 描述: 分页获取新品推荐商品
- 参数:
  - pageNum: 页码(默认1)
  - pageSize: 每页条数(默认6)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": [...]
  }
  ```

### 2.2 商品管理

#### 2.2.1 获取前台商品详情

- URL: `http://localhost:8085/product/detail/{id}`
- 方法: GET
- 描述: 获取前台商品详情
- 参数:
  - id: 商品ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "product": {...},
      "productAttributeList": [...],
      "productAttributeValueList": [...]
    }
  }
  ```

#### 2.2.2 获取品牌详情

- URL: `http://localhost:8085/brand/detail/{brandId}`
- 方法: GET
- 描述: 获取品牌详情
- 参数:
  - brandId: 品牌ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {...}
  }
  ```

### 2.3 会员管理

#### 2.3.1 会员品牌关注

- URL: `http://localhost:8085/member/attention/add`
- 方法: POST
- 描述: 添加品牌关注
- 参数: MemberBrandAttention对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 2.3.2 取消会员品牌关注

- URL: `http://localhost:8085/member/attention/delete`
- 方法: POST
- 描述: 取消品牌关注
- 参数:
  - brandId: 品牌ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 2.3.3 显示关注品牌详情

- URL: `http://localhost:8085/member/attention/detail`
- 方法: GET
- 描述: 显示关注品牌详情
- 参数:
  - brandId: 品牌ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {...}
  }
  ```

#### 2.3.4 清空关注列表

- URL: `http://localhost:8085/member/attention/clear`
- 方法: POST
- 描述: 清空关注列表
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 2.3.5 分页查询当前用户品牌关注列表

- URL: `http://localhost:8085/member/attention/list`
- 方法: GET
- 描述: 分页查询当前用户品牌关注列表
- 参数:
  - pageNum: 页码(默认1)
  - pageSize: 每页条数(默认5)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "pageNum": 1,
      "pageSize": 5,
      "total": 8,
      "list": [...]
    }
  }
  ```

### 2.4 订单管理

#### 2.4.1 根据购物车信息生成确认单

- URL: `http://localhost:8085/order/generateConfirmOrder`
- 方法: POST
- 描述: 根据购物车信息生成确认单
- 参数:
  - cartIds: 购物车ID列表
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {...}
  }
  ```

#### 2.4.2 根据购物车信息生成订单

- URL: `http://localhost:8085/order/generateOrder`
- 方法: POST
- 描述: 根据购物车信息生成订单
- 参数: OrderParam对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {...}
  }
  ```

#### 2.4.3 支付成功的回调

- URL: `http://localhost:8085/order/paySuccess`
- 方法: POST
- 描述: 支付成功的回调
- 参数:
  - orderId: 订单ID
  - payType: 支付类型
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

#### 2.4.4 自动取消超时订单

- URL: `http://localhost:8085/order/cancelTimeOutOrder`
- 方法: POST
- 描述: 自动取消超时订单
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": null
  }
  ```

#### 2.4.5 取消单个超时订单

- URL: `http://localhost:8085/order/cancelOrder`
- 方法: POST
- 描述: 取消单个超时订单
- 参数:
  - orderId: 订单ID
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": null
  }
  ```

#### 2.4.6 申请退货

- URL: `http://localhost:8085/returnApply/create`
- 方法: POST
- 描述: 申请退货
- 参数: OmsOrderReturnApplyParam对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

### 2.5 购物车管理

#### 2.5.1 添加商品到购物车

- URL: `http://localhost:8085/cart/add`
- 方法: POST
- 描述: 添加商品到购物车
- 参数: CartParam对象
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1
  }
  ```

### 2.6 支付管理

#### 2.6.1 支付宝支付

- URL: `http://localhost:8085/alipay/pay`
- 方法: GET
- 描述: 支付宝支付
- 参数: AliPayParam对象
- 返回示例: 返回支付宝支付页面

#### 2.6.2 支付宝异步回调

- URL: `http://localhost:8085/alipay/notify`
- 方法: POST
- 描述: 支付宝异步回调
- 返回: 执行成功返回success，执行失败返回failure

#### 2.6.3 支付宝统一收单线下交易查询

- URL: `http://localhost:8085/alipay/query`
- 方法: GET
- 描述: 支付宝统一收单线下交易查询
- 参数:
  - outTradeNo: 商户订单号
  - tradeNo: 支付宝交易号
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": "TRADE_SUCCESS"
  }
  ```

## 3. 搜索系统接口

基础URL: `http://localhost:8081`

### 3.1 商品搜索管理

#### 3.1.1 导入所有数据库中商品到ES

- URL: `http://localhost:8081/esProduct/importAll`
- 方法: POST
- 描述: 导入所有数据库中商品到ES
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": 1000
  }
  ```

#### 3.1.2 简单搜索

- URL: `http://localhost:8081/esProduct/search/simple`
- 方法: GET
- 描述: 简单搜索
- 参数:
  - keyword: 关键词(可选)
  - pageNum: 页码(默认0)
  - pageSize: 每页条数(默认5)
- 返回示例:
  ```json
  {
    "code": 200,
    "message": "操作成功",
    "data": {
      "pageNum": 0,
      "pageSize": 5,
      "total": 20,
      "list": [...]
    }
  }
  ```
