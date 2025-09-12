# 腾讯位置服务API配置说明

## 概述

本项目已集成腾讯位置服务的行政区划API，用于获取中国各省市区的真实数据。

## 配置步骤

### 1. 获取API密钥

1. 访问 [腾讯位置服务控制台](https://lbs.qq.com/console/mykey.html)
2. 注册并登录账号
3. 创建应用并获取API密钥（Key）

### 2. 配置环境变量

在项目根目录创建 `.env.development` 文件：

```bash
# 腾讯位置服务API密钥
VITE_TX_WEBSERVICE_APIK=your_actual_api_key_here
```

在项目根目录创建 `.env.production` 文件：

```bash
# 腾讯位置服务API密钥
VITE_TX_WEBSERVICE_APIK=your_actual_api_key_here
```

### 3. API功能

- **获取省份列表**：自动加载全国所有省份
- **获取城市列表**：根据选择的省份动态加载城市
- **获取区县列表**：根据选择的城市动态加载区县
- **备用数据**：API失败时自动使用本地备用数据

### 4. 使用说明

1. 页面加载时自动获取省份数据
2. 选择省份后自动加载对应城市
3. 选择城市后自动加载对应区县
4. 支持编辑地址时正确显示已选择的地区

### 5. API限制

- 免费版每日调用次数有限制
- 建议在生产环境中配置合适的配额
- 详细限制请参考 [腾讯位置服务配额说明](https://lbs.qq.com/service/webService/webServiceGuide/quota)

### 6. 故障处理

如果API调用失败，系统会自动：
1. 显示错误提示
2. 使用本地备用数据
3. 确保功能正常运行

## 相关文档

- [腾讯位置服务行政区划API文档](https://lbs.qq.com/service/webService/webServiceGuide/search/webServiceDistrict)
- [API配额限制说明](https://lbs.qq.com/service/webService/webServiceGuide/quota)
