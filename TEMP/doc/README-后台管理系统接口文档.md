# MallLite后台管理系统接口文档

## 文档概述

本文档为MallLite电商系统后台管理系统的接口文档，旨在为前端开发人员提供完整、准确的API接口规范和使用指南。

## 文档列表

### 1. 完整接口文档
**文件**: `MallLite-后台管理系统接口文档.md`

这是最详细的接口文档，包含：
- 完整的接口地址和请求方法
- 详细的请求参数说明
- 完整的响应示例
- 错误码说明
- 状态枚举定义
- 开发注意事项

**适用场景**: 详细开发时查阅具体接口规范

### 2. 快速参考文档
**文件**: `MallLite-API快速参考.md`

这是简化版的接口文档，包含：
- 接口概览表格
- 核心功能模块列表
- 常用状态枚举
- 前端开发建议和代码示例
- 工具函数推荐

**适用场景**: 快速查找接口，获取开发建议

### 3. Postman测试集合
**文件**: `MallLite-后台管理API-Postman集合.json`

包含：
- 所有主要接口的Postman请求配置
- 自动Token管理
- 预设的测试数据
- 环境变量配置

**适用场景**: API测试和调试

## 系统架构

### 技术栈
- **后端框架**: Spring Boot + Spring Security
- **数据库**: MySQL
- **认证方式**: JWT Token
- **API文档**: Swagger/OpenAPI
- **文件存储**: MinIO / 阿里云OSS

### 核心模块

1. **认证授权模块** (`/admin`)
   - 用户注册、登录、登出
   - Token刷新和管理
   - 用户信息获取

2. **用户管理模块** (`/admin`)
   - 用户CRUD操作
   - 用户状态管理
   - 角色分配

3. **商品管理模块** (`/product`)
   - 商品CRUD操作
   - 批量状态更新
   - 商品分类管理

4. **订单管理模块** (`/order`)
   - 订单查询和管理
   - 发货和状态更新
   - 收货信息修改

5. **文件上传模块** (`/minio`, `/aliyun/oss`)
   - 图片上传
   - 文件管理

## 快速开始

### 1. 环境准备
```bash
# 确保后端服务运行在以下地址
http://localhost:8080/admin
```

### 2. 获取访问Token
```javascript
// 1. 登录获取Token
const loginResponse = await fetch('/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: '123456'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// 2. 后续请求携带Token
const apiResponse = await fetch('/admin/info', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### 3. 使用Postman测试
1. 导入 `MallLite-后台管理API-Postman集合.json`
2. 设置环境变量 `baseUrl` 为 `http://localhost:8080/admin`
3. 运行"用户登录"接口获取Token（会自动保存）
4. 测试其他接口

## 接口规范

### 请求格式
- **Content-Type**: `application/json`
- **认证头**: `Authorization: Bearer {token}`
- **分页参数**: `pageNum`（页码），`pageSize`（每页数量）

### 响应格式
```json
{
  "code": 200,
  "message": "操作成功",
  "data": {}
}
```

### 状态码
- `200`: 操作成功
- `401`: 未授权
- `403`: 禁止访问
- `404`: 资源不存在
- `500`: 服务器错误

## 前端开发建议

### 1. API请求封装
建议使用axios进行HTTP请求封装，统一处理：
- Token自动携带
- 响应拦截和错误处理
- 请求重试机制

### 2. 状态管理
推荐使用状态管理工具（Vuex/Redux）管理：
- 用户登录状态
- Token信息
- 用户权限信息

### 3. 错误处理
统一处理API错误：
- 401错误自动跳转登录
- 网络错误重试机制
- 友好的错误提示

### 4. 表单验证
前后端双重验证：
- 前端进行基础验证
- 后端进行业务验证
- 显示具体错误信息

### 5. 分页组件
实现通用分页组件：
- 支持页码跳转
- 显示总数信息
- 每页大小选择

## 常见问题

### Q: Token过期如何处理？
A: 监听401状态码，自动清除本地Token并跳转登录页面，或调用刷新Token接口。

### Q: 文件上传如何选择MinIO还是OSS？
A: 根据部署环境选择，本地开发推荐MinIO，生产环境推荐OSS。

### Q: 批量操作如何优化用户体验？
A: 显示操作进度条，提供取消操作功能，操作完成后显示结果统计。

### Q: 如何处理大量数据的分页？
A: 使用虚拟滚动或无限滚动，避免一次加载过多数据。

## 更新日志

### v1.0 (2025-08-09)
- 初始版本发布
- 完成核心功能接口文档
- 提供Postman测试集合
- 添加前端开发指南

## 联系方式

如有问题或建议，请联系：
- 项目地址: [HeBack](https://github.com/KBchulan/HeBack)
- 问题反馈: 通过项目Issues提交

---

**注意**: 本文档基于当前代码结构生成，如有接口变更请及时更新文档。
