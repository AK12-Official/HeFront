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
- **响应示例**:

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null
}
```

### 1.6 刷新Token

- **接口路径**: `GET /sso/refreshToken`
- **请求头**: 需要携带当前token
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

---

## 2. 首页相关接口

### 2.1 获取首页内容

- **接口路径**: `GET /home/content`
- **接口描述**: 获取首页轮播图、活动信息等
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "advertiseList": [
      {
        "id": 1,
        "name": "春季新品发布",
        "type": 1,
        "pic": "/images/banner/spring-banner.jpg",
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-05-31 23:59:59",
        "status": 1,
        "clickCount": 1580,
        "orderCount": 0,
        "url": "http://www.mall.com/subject/1",
        "note": "春季新品促销活动",
        "sort": 1
      },
      {
        "id": 2,
        "name": "手机专场",
        "type": 1,
        "pic": "/images/banner/phone-banner.jpg",
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-04-30 23:59:59",
        "status": 1,
        "clickCount": 2350,
        "orderCount": 0,
        "url": "http://www.mall.com/category/1",
        "note": "手机数码专场活动",
        "sort": 2
      }
    ],
    "brandList": [
      {
        "id": 1,
        "name": "华为",
        "firstLetter": "H",
        "sort": 1,
        "factoryStatus": 1,
        "showStatus": 1,
        "productCount": 25,
        "productCommentCount": 156,
        "logo": "/images/brand/huawei-logo.png",
        "bigPic": "/images/brand/huawei-big.jpg",
        "brandStory": "华为是全球领先的ICT解决方案提供商"
      },
      {
        "id": 2,
        "name": "苹果",
        "firstLetter": "A",
        "sort": 2,
        "factoryStatus": 1,
        "showStatus": 1,
        "productCount": 18,
        "productCommentCount": 289,
        "logo": "/images/brand/apple-logo.png",
        "bigPic": "/images/brand/apple-big.jpg",
        "brandStory": "苹果公司，美国一家高科技公司"
      }
    ],
    "homeFlashPromotion": {
      "startTime": "2024-03-01 10:00:00",
      "endTime": "2024-03-01 22:00:00",
      "nextStartTime": "2024-03-02 10:00:00",
      "nextEndTime": "2024-03-02 22:00:00",
      "productList": [
        {
          "id": 1,
          "flashPromotionId": 1,
          "flashPromotionSessionId": 1,
          "productId": 1,
          "flashPromotionPrice": 4999.00,
          "flashPromotionCount": 100,
          "flashPromotionLimit": 2,
          "sort": 1,
          "product": {
            "id": 1,
            "name": "华为P50 Pro",
            "pic": "/images/product/huawei-p50-pro.jpg",
            "subTitle": "影像旗舰，超感知徕卡影像",
            "price": 5988.00
          }
        }
      ]
    },
    "newProductList": [
      {
        "id": 4,
        "name": "OPPO Find X6 Pro",
        "subTitle": "影像之美，由我定义",
        "pic": "/images/product/oppo-findx6-pro.jpg",
        "price": 5999.00,
        "originalPrice": 6299.00,
        "sale": 45,
        "unit": "台",
        "sort": 97,
        "giftPoint": 100,
        "giftGrowth": 100
      }
    ],
    "hotProductList": [
      {
        "id": 3,
        "name": "小米13 Ultra",
        "subTitle": "专业影像旗舰",
        "pic": "/images/product/mi13-ultra.jpg",
        "price": 5999.00,
        "originalPrice": 6499.00,
        "sale": 289,
        "unit": "台",
        "sort": 98,
        "giftPoint": 100,
        "giftGrowth": 100
      }
    ],
    "subjectList": [
      {
        "id": 1,
        "categoryId": 1,
        "title": "春季新品发布",
        "subTitle": "春暖花开，新品来袭",
        "pic": "/images/subject/spring-new.jpg",
        "productCount": 25,
        "recommendStatus": 1,
        "createTime": "2024-03-01 10:00:00",
        "collectCount": 156,
        "readCount": 2580,
        "commentCount": 45,
        "albumPics": "/images/subject/spring-new-1.jpg,/images/subject/spring-new-2.jpg",
        "description": "春季新品专题介绍",
        "showStatus": 1,
        "forwardCount": 89
      }
    ]
  }
}
```

### 2.2 推荐商品列表

- **接口路径**: `GET /home/recommendProductList`
- **请求参数**:
  - `pageSize` (int, optional): 每页数量，默认4
  - `pageNum` (int, optional): 页码，默认1
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 4,
    "totalPage": 5,
    "total": 20,
    "list": [
      {
        "id": 1,
        "name": "华为P50 Pro",
        "subTitle": "影像旗舰，超感知徕卡影像",
        "pic": "/images/product/huawei-p50-pro.jpg",
        "price": 5988.00,
        "originalPrice": 6488.00,
        "sale": 158,
        "unit": "台",
        "sort": 100
      },
      {
        "id": 2,
        "name": "Apple iPhone 14",
        "subTitle": "iPhone 14，大有不同",
        "pic": "/images/product/iphone14.jpg",
        "price": 5999.00,
        "originalPrice": 6299.00,
        "sale": 256,
        "unit": "台",
        "sort": 99
      }
    ]
  }
}
```

### 2.3 人气商品列表

- **接口路径**: `GET /home/hotProductList`
- **请求参数**: 同上（默认每页6个）
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 6,
    "totalPage": 3,
    "total": 15,
    "list": [
      {
        "id": 3,
        "name": "小米13 Ultra",
        "subTitle": "专业影像旗舰",
        "pic": "/images/product/mi13-ultra.jpg",
        "price": 5999.00,
        "originalPrice": 6499.00,
        "sale": 289,
        "unit": "台",
        "sort": 98
      }
    ]
  }
}
```

### 2.4 新品推荐列表

- **接口路径**: `GET /home/newProductList`
- **请求参数**: 同上（默认每页6个）
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 6,
    "totalPage": 2,
    "total": 8,
    "list": [
      {
        "id": 4,
        "name": "OPPO Find X6 Pro",
        "subTitle": "影像之美，由我定义",
        "pic": "/images/product/oppo-findx6-pro.jpg",
        "price": 5999.00,
        "originalPrice": 6299.00,
        "sale": 45,
        "unit": "台",
        "sort": 97
      }
    ]
  }
}
```

### 2.5 获取商品分类

- **接口路径**: `GET /home/productCateList/{parentId}`
- **路径参数**:
  - `parentId` (long, required): 父分类ID，0获取一级分类
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "手机数码",
      "level": 0,
      "parentId": 0,
      "sort": 1,
      "icon": "/images/category/phone.png",
      "productCount": 156,
      "showStatus": 1
    },
    {
      "id": 2,
      "name": "电脑办公",
      "level": 0,
      "parentId": 0,
      "sort": 2,
      "icon": "/images/category/computer.png",
      "productCount": 89,
      "showStatus": 1
    }
  ]
}
```

### 2.6 获取专题列表

- **接口路径**: `GET /home/subjectList`
- **请求参数**:
  - `cateId` (long, optional): 分类ID
  - `pageSize` (int, optional): 每页数量，默认4
  - `pageNum` (int, optional): 页码，默认1
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 4,
    "totalPage": 3,
    "total": 10,
    "list": [
      {
        "id": 1,
        "categoryId": 1,
        "title": "春季新品发布",
        "subTitle": "春暖花开，新品来袭",
        "pic": "/images/subject/spring-new.jpg",
        "productCount": 25,
        "recommendStatus": 1,
        "createTime": "2024-03-01 10:00:00",
        "collectCount": 156,
        "readCount": 2580,
        "commentCount": 45,
        "albumPics": "/images/subject/spring-new-1.jpg,/images/subject/spring-new-2.jpg",
        "description": "春季新品专题介绍",
        "showStatus": 1,
        "forwardCount": 89
      }
    ]
  }
}
```

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
  "message": "操作成功",
  "data": {
    "product": {
      "id": 1,
      "brandId": 1,
      "productCategoryId": 1,
      "name": "华为P50 Pro",
      "pic": "/images/product/huawei-p50-pro.jpg",
      "productSn": "HW-P50-PRO-001",
      "deleteStatus": 0,
      "publishStatus": 1,
      "newStatus": 1,
      "recommendStatus": 1,
      "verifyStatus": 1,
      "sort": 100,
      "sale": 158,
      "price": 5988.00,
      "promotionPrice": 5688.00,
      "giftGrowth": 100,
      "giftPoint": 100,
      "usePointLimit": 1000,
      "subTitle": "影像旗舰，超感知徕卡影像",
      "originalPrice": 6488.00,
      "stock": 500,
      "lowStock": 50,
      "unit": "台",
      "weight": 195.00,
      "previewStatus": 1,
      "serviceIds": "1,2,3",
      "keywords": "华为,手机,拍照",
      "note": "华为P50 Pro官方正品",
      "albumPics": "/images/product/huawei-p50-pro-1.jpg,/images/product/huawei-p50-pro-2.jpg",
      "detailTitle": "华为P50 Pro 详细介绍",
      "promotionStartTime": "2024-03-01 00:00:00",
      "promotionEndTime": "2024-03-31 23:59:59",
      "promotionPerLimit": 2,
      "promotionType": 1,
      "brandName": "华为",
      "productCategoryName": "智能手机"
    },
    "productAttributeList": [
      {
        "id": 1,
        "productAttributeCategoryId": 1,
        "name": "颜色",
        "selectType": 1,
        "inputType": 1,
        "inputList": "曜金黑,雪域白,可可茶金,拂晓粉",
        "sort": 1,
        "filterType": 1,
        "searchType": 1,
        "relatedStatus": 1,
        "handAddStatus": 0,
        "type": 0
      },
      {
        "id": 2,
        "productAttributeCategoryId": 1,
        "name": "存储容量",
        "selectType": 1,
        "inputType": 1,
        "inputList": "128GB,256GB,512GB",
        "sort": 2,
        "filterType": 1,
        "searchType": 1,
        "relatedStatus": 1,
        "handAddStatus": 0,
        "type": 0
      }
    ],
    "productSkuList": [
      {
        "id": 1,
        "productId": 1,
        "skuCode": "HW-P50-PRO-001-BLACK-128",
        "price": 5988.00,
        "stock": 100,
        "lowStock": 20,
        "pic": "/images/product/huawei-p50-pro-black.jpg",
        "sale": 58,
        "promotionPrice": 5688.00,
        "lockStock": 0,
        "spData": "曜金黑,128GB"
      },
      {
        "id": 2,
        "productId": 1,
        "skuCode": "HW-P50-PRO-001-WHITE-256",
        "price": 6488.00,
        "stock": 80,
        "lowStock": 15,
        "pic": "/images/product/huawei-p50-pro-white.jpg",
        "sale": 42,
        "promotionPrice": 6188.00,
        "lockStock": 0,
        "spData": "雪域白,256GB"
      }
    ],
    "couponList": [
      {
        "id": 1,
        "type": 1,
        "name": "手机专用优惠券",
        "platform": 0,
        "count": 100,
        "amount": 200.00,
        "perLimit": 1,
        "minPoint": 5000.00,
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-03-31 23:59:59",
        "useType": 1,
        "note": "购买手机类商品满5000元可用",
        "publishCount": 1000,
        "useCount": 156,
        "receiveCount": 568,
        "enableTime": "2024-03-01 00:00:00",
        "code": "PHONE200",
        "memberLevel": 0
      }
    ]
  }
}
```

### 3.3 商品分类树

- **接口路径**: `GET /product/categoryTreeList`
- **响应**: 树形结构的商品分类列表
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "name": "服装鞋包",
      "level": 0,
      "parentId": 0,
      "sort": 1,
      "icon": "/images/category/category-icon-1.png",
      "keywords": "服装,鞋子,包包",
      "description": "服装鞋包分类",
      "showStatus": 1,
      "children": [
        {
          "id": 7,
          "name": "外套",
          "level": 1,
          "parentId": 1,
          "sort": 1,
          "icon": "/images/category/jacket-icon.png",
          "keywords": "外套,夹克,大衣",
          "description": "外套分类",
          "showStatus": 1,
          "children": [
            {
              "id": 43,
              "name": "羽绒服",
              "level": 2,
              "parentId": 7,
              "sort": 1,
              "icon": "/images/category/down-jacket-icon.png",
              "keywords": "羽绒服,冬装",
              "description": "羽绒服分类",
              "showStatus": 1,
              "children": []
            },
            {
              "id": 44,
              "name": "风衣",
              "level": 2,
              "parentId": 7,
              "sort": 2,
              "icon": "/images/category/windbreaker-icon.png",
              "keywords": "风衣,外套",
              "description": "风衣分类",
              "showStatus": 1,
              "children": []
            }
          ]
        },
        {
          "id": 8,
          "name": "鞋靴",
          "level": 1,
          "parentId": 1,
          "sort": 2,
          "icon": "/images/category/shoes-icon.png",
          "keywords": "鞋子,靴子",
          "description": "鞋靴分类",
          "showStatus": 1,
          "children": [
            {
              "id": 45,
              "name": "运动鞋",
              "level": 2,
              "parentId": 8,
              "sort": 1,
              "icon": "/images/category/sports-shoes-icon.png",
              "keywords": "运动鞋,跑步鞋",
              "description": "运动鞋分类",
              "showStatus": 1,
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "手机数码",
      "level": 0,
      "parentId": 0,
      "sort": 2,
      "icon": "/images/category/digital-icon.png",
      "keywords": "手机,数码,电子",
      "description": "手机数码分类",
      "showStatus": 1,
      "children": [
        {
          "id": 9,
          "name": "手机通讯",
          "level": 1,
          "parentId": 2,
          "sort": 1,
          "icon": "/images/category/phone-icon.png",
          "keywords": "手机,通讯",
          "description": "手机通讯分类",
          "showStatus": 1,
          "children": []
        }
      ]
    }
  ]
}
```

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

- **响应示例**:

```json
{
  "code": 200,
  "message": "添加成功",
  "data": null
}
```

### 4.2 获取购物车列表

- **接口路径**: `GET /cart/list`
- **需要认证**: 是
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productSkuId": 1,
      "memberId": 1,
      "quantity": 2,
      "price": 5988.00,
      "productPic": "/images/product/huawei-p50-pro.jpg",
      "productName": "华为P50 Pro",
      "productSubTitle": "影像旗舰，超感知徕卡影像",
      "productSkuCode": "HW-P50-PRO-001-BLACK-128",
      "memberNickname": "test",
      "createDate": "2024-03-01 10:30:00",
      "modifyDate": "2024-03-01 10:30:00",
      "deleteStatus": 0,
      "productCategoryId": 1,
      "productBrand": "华为",
      "productSn": "HW-P50-PRO-001",
      "productAttr": "颜色:曜金黑;存储容量:128GB"
    }
  ]
}
```

### 4.3 获取购物车促销信息

- **接口路径**: `GET /cart/list/promotion`
- **需要认证**: 是
- **请求参数**:
  - `cartIds` (List`<Long>`, optional): 购物车项ID列表
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "cartPromotionItemList": [
        {
          "id": 1,
          "productId": 1,
          "productSkuId": 1,
          "memberId": 1,
          "quantity": 2,
          "price": 5988.00,
          "promotionMessage": "满减活动：满5000减200",
          "reduceAmount": 200.00,
          "realStock": 100,
          "integration": 100,
          "growth": 100
        }
      ],
      "promotionMessage": "满减活动：满5000减200"
    }
  ]
}
```

### 4.4 修改商品数量

- **接口路径**: `GET /cart/update/quantity`
- **需要认证**: 是
- **请求参数**:
  - `id` (long, required): 购物车项ID
  - `quantity` (int, required): 新数量
- **响应示例**:

```json
{
  "code": 200,
  "message": "修改成功",
  "data": null
}
```

### 4.5 获取商品规格信息

- **接口路径**: `GET /cart/getProduct/{productId}`
- **路径参数**:
  - `productId` (long, required): 商品ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "name": "华为P50 Pro",
    "pic": "/images/product/huawei-p50-pro.jpg",
    "price": 5988.00,
    "stock": 500,
    "productAttributeValueList": [
      {
        "id": 1,
        "productAttributeId": 1,
        "value": "曜金黑",
        "type": 0
      },
      {
        "id": 2,
        "productAttributeId": 2,
        "value": "128GB",
        "type": 0
      }
    ],
    "skuStockList": [
      {
        "id": 1,
        "productId": 1,
        "skuCode": "HW-P50-PRO-001-BLACK-128",
        "price": 5988.00,
        "stock": 100,
        "lowStock": 20,
        "pic": "/images/product/huawei-p50-pro-black.jpg",
        "sale": 58,
        "promotionPrice": 5688.00,
        "lockStock": 0,
        "spData": "曜金黑,128GB"
      }
    ]
  }
}
```

### 4.6 修改商品规格

- **接口路径**: `POST /cart/update/attr`
- **需要认证**: 是
- **请求体**: 购物车项对象
- **响应示例**:

```json
{
  "code": 200,
  "message": "修改成功",
  "data": null
}
```

### 4.7 删除购物车商品

- **接口路径**: `POST /cart/delete`
- **需要认证**: 是
- **请求参数**:
  - `ids` (List`<Long>`, required): 购物车项ID列表
- **响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 4.8 清空购物车

- **接口路径**: `POST /cart/clear`
- **需要认证**: 是
- **响应示例**:

```json
{
  "code": 200,
  "message": "清空成功",
  "data": null
}
```

---

## 5. 订单相关接口

### 5.1 生成确认订单

- **接口路径**: `POST /order/generateConfirmOrder`
- **需要认证**: 是
- **请求体**: 购物车项ID列表

```json
[1, 2, 3]
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "cartPromotionItemList": [
      {
        "id": 1,
        "productId": 1,
        "productSkuId": 1,
        "memberId": 1,
        "quantity": 2,
        "price": 5988.00,
        "promotionMessage": "满减活动：满5000减200",
        "reduceAmount": 200.00,
        "realStock": 100,
        "integration": 100,
        "growth": 100,
        "productName": "华为P50 Pro",
        "productPic": "/images/product/huawei-p50-pro.jpg",
        "productAttr": "颜色:曜金黑;存储容量:128GB"
      }
    ],
    "memberReceiveAddressList": [
      {
        "id": 1,
        "memberId": 1,
        "name": "张三",
        "phoneNumber": "18888888888",
        "defaultStatus": 1,
        "postCode": "518000",
        "province": "广东省",
        "city": "深圳市",
        "region": "南山区",
        "detailAddress": "科技园南区"
      }
    ],
    "couponHistoryDetailList": [
      {
        "id": 1,
        "couponId": 1,
        "couponCode": "PHONE200",
        "memberNickname": "test",
        "couponName": "手机专用优惠券",
        "amount": 200.00,
        "minPoint": 5000.00,
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-03-31 23:59:59",
        "useStatus": 0
      }
    ],
    "integrationConsumeSetting": {
      "id": 1,
      "deductionPerAmount": 100,
      "maxPercentPerOrder": 50,
      "useUnit": 100,
      "couponStatus": 1
    },
    "memberIntegration": 1000,
    "calcAmount": {
      "totalAmount": 11976.00,
      "freightAmount": 0.00,
      "promotionAmount": 200.00,
      "payAmount": 11776.00
    }
  }
}
```

### 5.2 提交订单

- **接口路径**: `POST /order/generateOrder`
- **需要认证**: 是
- **请求体**:

```json
{
  "memberReceiveAddressId": 1,
  "couponId": 1,
  "useIntegration": 100,
  "payType": 1,
  "cartIds": [1, 2, 3]
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "下单成功",
  "data": {
    "order": {
      "id": 1,
      "memberId": 1,
      "couponId": 1,
      "orderSn": "202403010001",
      "createTime": "2024-03-01 14:30:00",
      "memberUsername": "test",
      "totalAmount": 11976.00,
      "payAmount": 11676.00,
      "freightAmount": 0.00,
      "promotionAmount": 200.00,
      "integrationAmount": 100.00,
      "couponAmount": 200.00,
      "discountAmount": 0.00,
      "payType": 1,
      "sourceType": 1,
      "status": 0,
      "orderType": 0,
      "deliveryCompany": null,
      "deliverySn": null,
      "autoConfirmDay": 15,
      "integration": 100,
      "growth": 100,
      "promotionInfo": "单品促销,打折优惠:满减促销[满5000.00元,减200.00元]",
      "billType": 0,
      "billHeader": null,
      "billContent": null,
      "billReceiverPhone": null,
      "billReceiverEmail": null,
      "receiverName": "张三",
      "receiverPhone": "18888888888",
      "receiverPostCode": "518000",
      "receiverProvince": "广东省",
      "receiverCity": "深圳市",
      "receiverRegion": "南山区",
      "receiverDetailAddress": "科技园南区",
      "note": null,
      "confirmStatus": 0,
      "deleteStatus": 0,
      "useIntegration": 100,
      "paymentTime": null,
      "deliveryTime": null,
      "receiveTime": null,
      "commentTime": null,
      "modifyTime": null
    },
    "orderItemList": [
      {
        "id": 1,
        "orderId": 1,
        "orderSn": "202403010001",
        "productId": 1,
        "productPic": "/images/product/huawei-p50-pro.jpg",
        "productName": "华为P50 Pro",
        "productBrand": "华为",
        "productSn": "HW-P50-PRO-001",
        "productPrice": 5988.00,
        "productQuantity": 2,
        "productSkuId": 1,
        "productSkuCode": "HW-P50-PRO-001-BLACK-128",
        "productCategoryId": 1,
        "promotionName": "单品促销",
        "promotionAmount": 200.00,
        "couponAmount": 200.00,
        "integrationAmount": 100.00,
        "realAmount": 11676.00,
        "giftIntegration": 100,
        "giftGrowth": 100,
        "productAttr": "颜色:曜金黑;存储容量:128GB"
      }
    ]
  }
}
```

### 5.3 支付成功回调

- **接口路径**: `POST /order/paySuccess`
- **请求参数**:
  - `orderId` (long, required): 订单ID
  - `payType` (int, required): 支付方式
- **响应示例**:

```json
{
  "code": 200,
  "message": "支付成功",
  "data": null
}
```

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
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 5,
    "totalPage": 3,
    "total": 12,
    "list": [
      {
        "id": 1,
        "orderSn": "202403010001",
        "createTime": "2024-03-01 14:30:00",
        "totalAmount": 11976.00,
        "payAmount": 11676.00,
        "payType": 1,
        "status": 1,
        "orderType": 0,
        "receiverName": "张三",
        "receiverPhone": "18888888888",
        "orderItemList": [
          {
            "id": 1,
            "productId": 1,
            "productPic": "/images/product/huawei-p50-pro.jpg",
            "productName": "华为P50 Pro",
            "productPrice": 5988.00,
            "productQuantity": 2,
            "productSkuCode": "HW-P50-PRO-001-BLACK-128",
            "productAttr": "颜色:曜金黑;存储容量:128GB"
          }
        ]
      }
    ]
  }
}
```

### 5.5 订单详情

- **接口路径**: `GET /order/detail/{orderId}`
- **需要认证**: 是
- **路径参数**:
  - `orderId` (long, required): 订单ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "memberId": 1,
    "couponId": 1,
    "orderSn": "202403010001",
    "createTime": "2024-03-01 14:30:00",
    "memberUsername": "test",
    "totalAmount": 11976.00,
    "payAmount": 11676.00,
    "freightAmount": 0.00,
    "promotionAmount": 200.00,
    "integrationAmount": 100.00,
    "couponAmount": 200.00,
    "discountAmount": 0.00,
    "payType": 1,
    "sourceType": 1,
    "status": 1,
    "orderType": 0,
    "deliveryCompany": "顺丰速运",
    "deliverySn": "SF1234567890",
    "autoConfirmDay": 15,
    "integration": 100,
    "growth": 100,
    "promotionInfo": "单品促销,打折优惠:满减促销[满5000.00元,减200.00元]",
    "receiverName": "张三",
    "receiverPhone": "18888888888",
    "receiverPostCode": "518000",
    "receiverProvince": "广东省",
    "receiverCity": "深圳市",
    "receiverRegion": "南山区",
    "receiverDetailAddress": "科技园南区",
    "note": null,
    "confirmStatus": 0,
    "deleteStatus": 0,
    "useIntegration": 100,
    "paymentTime": "2024-03-01 14:35:00",
    "deliveryTime": "2024-03-02 09:00:00",
    "receiveTime": null,
    "commentTime": null,
    "modifyTime": "2024-03-02 09:00:00",
    "orderItemList": [
      {
        "id": 1,
        "orderId": 1,
        "orderSn": "202403010001",
        "productId": 1,
        "productPic": "/images/product/huawei-p50-pro.jpg",
        "productName": "华为P50 Pro",
        "productBrand": "华为",
        "productSn": "HW-P50-PRO-001",
        "productPrice": 5988.00,
        "productQuantity": 2,
        "productSkuId": 1,
        "productSkuCode": "HW-P50-PRO-001-BLACK-128",
        "productCategoryId": 1,
        "promotionName": "单品促销",
        "promotionAmount": 200.00,
        "couponAmount": 200.00,
        "integrationAmount": 100.00,
        "realAmount": 11676.00,
        "giftIntegration": 100,
        "giftGrowth": 100,
        "productAttr": "颜色:曜金黑;存储容量:128GB"
      }
    ]
  }
}
```

### 5.6 取消订单

- **接口路径**: `POST /order/cancelUserOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "订单取消成功",
  "data": null
}
```

### 5.7 确认收货

- **接口路径**: `POST /order/confirmReceiveOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "确认收货成功",
  "data": null
}
```

### 5.8 删除订单

- **接口路径**: `POST /order/deleteOrder`
- **需要认证**: 是
- **请求参数**:
  - `orderId` (long, required): 订单ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "订单删除成功",
  "data": null
}
```

---

## 6. 支付相关接口

### 6.1 支付宝电脑网站支付

- **接口路径**: `GET /alipay/pay`
- **请求参数**:
  - `outTradeNo` (string, required): 商户订单号
  - `subject` (string, required): 商品标题
  - `totalAmount` (decimal, required): 支付金额
- **响应示例**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>支付宝支付</title>
</head>
<body>
    <form name="punchout_form" method="post" action="https://openapi.alipay.com/gateway.do">
        <input type="hidden" name="app_id" value="2021000000000000">
        <input type="hidden" name="method" value="alipay.trade.page.pay">
        <input type="hidden" name="charset" value="utf-8">
        <input type="hidden" name="sign_type" value="RSA2">
        <input type="hidden" name="timestamp" value="2024-03-01 14:35:00">
        <input type="hidden" name="version" value="1.0">
        <input type="hidden" name="biz_content" value='{"out_trade_no":"202403010001","total_amount":"11676.00","subject":"华为P50 Pro等商品","product_code":"FAST_INSTANT_TRADE_PAY"}'>
        <input type="hidden" name="sign" value="XXXXX">
        <script>document.forms[0].submit();</script>
    </form>
</body>
</html>
```

### 6.2 支付宝手机网站支付

- **接口路径**: `GET /alipay/webPay`
- **请求参数**: 同上
- **响应示例**:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>支付宝手机支付</title>
</head>
<body>
    <form name="punchout_form" method="post" action="https://openapi.alipay.com/gateway.do">
        <input type="hidden" name="app_id" value="2021000000000000">
        <input type="hidden" name="method" value="alipay.trade.wap.pay">
        <input type="hidden" name="charset" value="utf-8">
        <input type="hidden" name="sign_type" value="RSA2">
        <input type="hidden" name="timestamp" value="2024-03-01 14:35:00">
        <input type="hidden" name="version" value="1.0">
        <input type="hidden" name="biz_content" value='{"out_trade_no":"202403010001","total_amount":"11676.00","subject":"华为P50 Pro等商品","product_code":"QUICK_WAP_WAY"}'>
        <input type="hidden" name="sign" value="XXXXX">
        <script>document.forms[0].submit();</script>
    </form>
</body>
</html>
```

### 6.3 支付宝异步回调

- **接口路径**: `POST /alipay/notify`
- **说明**: 支付宝服务器回调接口，由支付宝系统调用，前端无需关注
- **响应示例**:

```text
success
```

### 6.4 查询支付状态

- **接口路径**: `GET /alipay/query`
- **请求参数**:
  - `outTradeNo` (string, optional): 商户订单号
  - `tradeNo` (string, optional): 支付宝交易号
- **说明**: outTradeNo和tradeNo至少提供一个
- **响应示例**:

```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "code": "10000",
    "msg": "Success",
    "outTradeNo": "202403010001",
    "tradeNo": "2024030122001488881234567890",
    "totalAmount": "11676.00",
    "sellerId": "2088000000000000",
    "merchantOrderNo": "202403010001",
    "tradeStatus": "TRADE_SUCCESS",
    "payDate": "2024-03-01 14:35:25"
  }
}
```

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

- **响应示例**:

```json
{
  "code": 200,
  "message": "添加成功",
  "data": null
}
```

### 7.2 删除收货地址

- **接口路径**: `POST /member/address/delete/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

### 7.3 修改收货地址

- **接口路径**: `POST /member/address/update/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID
- **请求体**: 地址信息对象
- **响应示例**:

```json
{
  "code": 200,
  "message": "修改成功",
  "data": null
}
```

### 7.4 获取地址列表

- **接口路径**: `GET /member/address/list`
- **需要认证**: 是
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "memberId": 1,
      "name": "张三",
      "phoneNumber": "18888888888",
      "defaultStatus": 1,
      "postCode": "518000",
      "province": "广东省",
      "city": "深圳市",
      "region": "南山区",
      "detailAddress": "科技园南区"
    },
    {
      "id": 2,
      "memberId": 1,
      "name": "李四",
      "phoneNumber": "13999999999",
      "defaultStatus": 0,
      "postCode": "100000",
      "province": "北京市",
      "city": "北京市",
      "region": "朝阳区",
      "detailAddress": "三里屯"
    }
  ]
}
```

### 7.5 获取地址详情

- **接口路径**: `GET /member/address/{id}`
- **需要认证**: 是
- **路径参数**:
  - `id` (long, required): 地址ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "id": 1,
    "memberId": 1,
    "name": "张三",
    "phoneNumber": "18888888888",
    "defaultStatus": 1,
    "postCode": "518000",
    "province": "广东省",
    "city": "深圳市",
    "region": "南山区",
    "detailAddress": "科技园南区"
  }
}
```

---

## 8. 会员优惠券接口

### 8.1 领取优惠券

- **接口路径**: `POST /member/coupon/add/{couponId}`
- **需要认证**: 是
- **路径参数**:
  - `couponId` (long, required): 优惠券ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "领取成功",
  "data": null
}
```

### 8.2 会员优惠券历史

- **接口路径**: `GET /member/coupon/listHistory`
- **需要认证**: 是
- **请求参数**:
  - `useStatus` (int, optional): 筛选状态
    - 0: 未使用
    - 1: 已使用
    - 2: 已过期
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "totalPage": 2,
    "total": 15,
    "list": [
      {
        "id": 1,
        "couponId": 1,
        "couponCode": "PHONE200",
        "memberNickname": "test",
        "couponName": "手机专用优惠券",
        "amount": 200.00,
        "minPoint": 5000.00,
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-03-31 23:59:59",
        "useStatus": 1,
        "useTime": "2024-03-01 14:35:00",
        "orderSn": "202403010001",
        "getType": 0,
        "note": "购买手机类商品满5000元可用"
      },
      {
        "id": 2,
        "couponId": 2,
        "couponCode": "WELCOME100",
        "memberNickname": "test",
        "couponName": "新用户优惠券",
        "amount": 100.00,
        "minPoint": 1000.00,
        "startTime": "2024-02-01 00:00:00",
        "endTime": "2024-02-29 23:59:59",
        "useStatus": 2,
        "useTime": null,
        "orderSn": null,
        "getType": 0,
        "note": "新用户专享优惠券"
      }
    ]
  }
}
```

### 8.3 会员优惠券列表

- **接口路径**: `GET /member/coupon/list`
- **需要认证**: 是
- **请求参数**: 同上
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 1,
    "pageSize": 10,
    "totalPage": 1,
    "total": 3,
    "list": [
      {
        "id": 3,
        "couponId": 3,
        "couponCode": "SPRING50",
        "memberNickname": "test",
        "couponName": "春季促销券",
        "amount": 50.00,
        "minPoint": 500.00,
        "startTime": "2024-03-01 00:00:00",
        "endTime": "2024-05-31 23:59:59",
        "useStatus": 0,
        "useTime": null,
        "orderSn": null,
        "getType": 0,
        "note": "春季商品专用优惠券"
      }
    ]
  }
}
```

### 8.4 购物车可用优惠券

- **接口路径**: `GET /member/coupon/list/cart/{type}`
- **需要认证**: 是
- **路径参数**:
  - `type` (int, required): 1-可用，0-不可用
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 3,
      "couponId": 3,
      "couponCode": "SPRING50",
      "memberNickname": "test",
      "couponName": "春季促销券",
      "amount": 50.00,
      "minPoint": 500.00,
      "startTime": "2024-03-01 00:00:00",
      "endTime": "2024-05-31 23:59:59",
      "useStatus": 0,
      "useTime": null,
      "orderSn": null,
      "getType": 0,
      "note": "春季商品专用优惠券"
    }
  ]
}
```

### 8.5 商品相关优惠券

- **接口路径**: `GET /member/coupon/listByProduct/{productId}`
- **路径参数**:
  - `productId` (long, required): 商品ID
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": [
    {
      "id": 1,
      "type": 1,
      "name": "手机专用优惠券",
      "platform": 0,
      "count": 100,
      "amount": 200.00,
      "perLimit": 1,
      "minPoint": 5000.00,
      "startTime": "2024-03-01 00:00:00",
      "endTime": "2024-03-31 23:59:59",
      "useType": 1,
      "note": "购买手机类商品满5000元可用",
      "publishCount": 1000,
      "useCount": 156,
      "receiveCount": 568,
      "enableTime": "2024-03-01 00:00:00",
      "code": "PHONE200",
      "memberLevel": 0
    }
  ]
}
```

---

## 9. 高级搜索接口

### 9.1 简单搜索

- **接口路径**: `GET /esProduct/search/simple`
- **接口描述**: 基于ElasticSearch的简单商品搜索
- **请求参数**:
  - `keyword` (string, optional): 搜索关键词
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 0,
    "pageSize": 5,
    "totalPage": 8,
    "total": 38,
    "list": [
      {
        "id": 1,
        "name": "华为P50 Pro",
        "subTitle": "影像旗舰，超感知徕卡影像",
        "keywords": "华为,手机,拍照",
        "pic": "/images/product/huawei-p50-pro.jpg",
        "price": 5988.00,
        "sale": 158,
        "newStatus": 1,
        "recommendStatus": 1,
        "stock": 500,
        "promotionType": 0,
        "sort": 100,
        "brandId": 1,
        "brandName": "华为",
        "productCategoryId": 1,
        "productCategoryName": "智能手机"
      }
    ]
  }
}
```

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
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 0,
    "pageSize": 5,
    "totalPage": 12,
    "total": 58,
    "list": [
      {
        "id": 1,
        "name": "华为P50 Pro",
        "subTitle": "影像旗舰，超感知徕卡影像",
        "keywords": "华为,手机,拍照",
        "pic": "/images/product/huawei-p50-pro.jpg",
        "price": 5988.00,
        "sale": 158,
        "newStatus": 1,
        "recommendStatus": 1,
        "stock": 500,
        "promotionType": 0,
        "sort": 100,
        "brandId": 1,
        "brandName": "华为",
        "productCategoryId": 1,
        "productCategoryName": "智能手机"
      }
    ],
    "pageInfo": {
      "pageNum": 0,
      "pageSize": 5,
      "totalPage": 12,
      "total": 58
    },
    "brandList": [
      {
        "id": 1,
        "name": "华为",
        "productCount": 12
      },
      {
        "id": 2,
        "name": "苹果",
        "productCount": 8
      }
    ],
    "categoryList": [
      {
        "id": 1,
        "name": "智能手机",
        "productCount": 25
      }
    ],
    "attributeList": [
      {
        "name": "颜色",
        "list": [
          {
            "value": "黑色",
            "count": 15
          },
          {
            "value": "白色",
            "count": 12
          }
        ]
      }
    ]
  }
}
```

### 9.3 商品推荐

- **接口路径**: `GET /esProduct/recommend/{id}`
- **接口描述**: 根据商品ID推荐相关商品
- **路径参数**:
  - `id` (long, required): 商品ID
- **请求参数**:
  - `pageNum` (int, optional): 页码，默认0
  - `pageSize` (int, optional): 每页数量，默认5
- **响应示例**:

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "pageNum": 0,
    "pageSize": 5,
    "totalPage": 2,
    "total": 8,
    "list": [
      {
        "id": 2,
        "name": "华为Mate50 Pro",
        "subTitle": "昆仑玻璃版，超光变XMAGE影像",
        "keywords": "华为,手机,拍照",
        "pic": "/images/product/huawei-mate50-pro.jpg",
        "price": 6799.00,
        "sale": 89,
        "newStatus": 1,
        "recommendStatus": 1,
        "stock": 300,
        "promotionType": 0,
        "sort": 99,
        "brandId": 1,
        "brandName": "华为",
        "productCategoryId": 1,
        "productCategoryName": "智能手机"
      }
    ]
  }
}
```

---

## 10. 售后服务接口

### 10.1 申请退货

- **接口路径**: `POST /returnApply/create`
- **需要认证**: 是
- **请求体**:

```json
{
  "orderId": 1,
  "productId": 1,
  "orderSn": "202403010001",
  "returnAmount": 5988.00,
  "returnName": "华为P50 Pro",
  "returnPhone": "18888888888",
  "returnReason": "质量问题",
  "description": "商品存在质量缺陷，无法正常使用",
  "proofPics": "/images/return/proof1.jpg,/images/return/proof2.jpg"
}
```

- **响应示例**:

```json
{
  "code": 200,
  "message": "退货申请提交成功",
  "data": {
    "id": 1,
    "orderId": 1,
    "companyAddressId": 1,
    "productId": 1,
    "orderSn": "202403010001",
    "createTime": "2024-03-05 10:30:00",
    "memberUsername": "test",
    "returnAmount": 5988.00,
    "returnName": "华为P50 Pro",
    "returnPhone": "18888888888",
    "status": 0,
    "handleTime": null,
    "productPic": "/images/product/huawei-p50-pro.jpg",
    "productBrand": "华为",
    "productAttr": "颜色:曜金黑;存储容量:128GB",
    "productCount": 1,
    "productPrice": 5988.00,
    "productRealPrice": 5988.00,
    "reason": "质量问题",
    "description": "商品存在质量缺陷，无法正常使用",
    "proofPics": "/images/return/proof1.jpg,/images/return/proof2.jpg",
    "handleNote": null,
    "handleMan": null,
    "receiveMan": null,
    "receiveTime": null,
    "receiveNote": null
  }
}
```

---

## 11. 错误码说明

| 错误码 | 说明             |
| ------ | ---------------- |
| 200    | 请求成功         |
| 400    | 请求参数错误     |
| 401    | 未授权，需要登录 |
| 403    | 禁止访问         |
| 404    | 请求的资源不存在 |
| 500    | 服务器内部错误   |

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
>
> - v1.0: 初始版本，涵盖所有核心电商功能接口
> - 最后更新时间: 2025-08-07
