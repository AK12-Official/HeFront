---
title: He_BF
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# He_BF

Base URLs:

# Authentication

# Default

<a id="opIdcheckDuplicate"></a>

## POST 秒传检测请求

POST /api/videos/check-duplicate

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|sha256|query|string| 是 |文件256值|
|fileSize|query|integer(int64)| 是 |文件大小|
|deviceType|query|string| 否 |设备类型|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIduploadPersonVideo"></a>

## POST 小文件上传请求

POST /api/videos/upload-person-video

Upload a small video file with metadata. Required fields: title, sha256, file. Optional fields: description, deviceType

> Body 请求参数

```yaml
title: test_video_7-14
description: test_video_desc_7-14
sha256: 123456abcdef
deviceType: WEB
file: ""

```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|Authorization|header|string| 否 |none|
|body|body|object| 否 |none|
|» title|body|string| 是 |none|
|» description|body|string| 是 |none|
|» sha256|body|string| 是 |none|
|» deviceType|body|string| 是 |none|
|» file|body|string(binary)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdinitChunkUpload"></a>

## POST 初始化分块上传请求

POST /api/videos/init-chunk-upload

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|title|query|string| 是 |视频标题|
|description|query|string| 否 |视频描述|
|sha256|query|string| 是 |文件256值|
|fileSize|query|integer(int64)| 是 |文件大小|
|totalChunks|query|integer| 是 |视频分块总数|
|deviceType|query|string| 否 |设备类型|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIduploadChunk"></a>

## POST 分块上传请求

POST /api/videos/upload-chunk

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|uploadSessionId|query|string| 是 |上传会话ID|
|chunkIndex|query|integer| 是 |分块序号|
|chunkSha256|query|string| 是 |分块256值|
|chunkSize|query|integer(int64)| 是 |分块大小|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

<a id="opIdmergeChunks"></a>

## POST 合并分块请求

POST /api/videos/merge-chunks

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|uploadSessionId|query|string| 是 |上传会话ID|
|finalSha256|query|string| 是 |最终文件256值|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdgetVideoInfo"></a>

## GET 获取视频详情请求

GET /api/videos/get-video-info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdgetVideoList"></a>

## GET 获取视频列表请求

GET /api/videos/get-video-list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|pageIndex|query|integer| 是 |查询页码|
|pageSize|query|integer| 是 |查询条数|
|userPhone|query|string| 否 |上传视频的用户手机号|
|title|query|string| 否 |视频标题|
|status|query|string| 否 |视频状态(UPLOADING-上传中，PROCESSING-处理中，PUBLISHED-已发布，DELETED-已删除)|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdupdateVideoInfo"></a>

## PUT 更新视频信息请求

PUT /api/videos/update-video-info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|title|query|string| 是 |视频标题|
|description|query|string| 否 |视频描述|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

<a id="opIddeleteVideo"></a>

## DELETE 删除视频请求

DELETE /api/videos/delete-video

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

<a id="opIdgetPlayInfo"></a>

## GET 获取播放信息请求

GET /api/videos/get-play-info

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdgetRecommendList"></a>

## GET 获取推荐列表请求

GET /api/videos/get-recommend-list

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|currentVideoId|query|string| 是 |当前视频ID|
|recommendCount|query|integer| 否 |推荐视频数量|
|excludeVideoIds|query|string| 否 |排除视频ID列表|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdrecordPlay"></a>

## POST 记录播放请求

POST /api/videos/record-play

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|playDuration|query|integer| 是 |播放时长|
|playProgress|query|number(float)| 否 |播放进度百分比|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

<a id="opIdgetStats"></a>

## GET 获取统计信息请求

GET /api/videos/get-stats

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdupdateStats"></a>

## POST 更新统计数据请求

POST /api/videos/update-stats

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|videoId|query|string| 是 |视频ID|
|actionType|query|string| 是 |操作类型|
|actionValue|query|integer| 是 |操作值（+1，-1）|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

<a id="opIdgetUploadProgress"></a>

## GET 查询上传进度请求

GET /api/videos/get-upload-progress

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|uploadSessionId|query|string| 是 |上传会话ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[JsonVO](#schemajsonvo)|

<a id="opIdcancelUpload"></a>

## POST 取消上传请求

POST /api/videos/cancel-upload

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|uploadSessionId|query|string| 是 |上传会话ID|
|Authorization|header|string| 否 |none|

> 返回示例

> 200 Response

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|OK|[StringJsonVO](#schemastringjsonvo)|

# 数据模型

<h2 id="tocS_StringJsonVO">StringJsonVO</h2>

<a id="schemastringjsonvo"></a>
<a id="schema_StringJsonVO"></a>
<a id="tocSstringjsonvo"></a>
<a id="tocsstringjsonvo"></a>

```json
{
  "code": 10000,
  "message": "success",
  "data": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|true|none||状态码|
|message|string|true|none||提示信息|
|data|string|false|none||数据对象|

<h2 id="tocS_JsonVO">JsonVO</h2>

<a id="schemajsonvo"></a>
<a id="schema_JsonVO"></a>
<a id="tocSjsonvo"></a>
<a id="tocsjsonvo"></a>

```json
{
  "code": 10000,
  "message": "success",
  "data": {
    "uploadSessionId": "string",
    "totalChunks": -2147483648,
    "completedChunks": -2147483648,
    "progressPercent": 0.1,
    "status": "string"
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|code|integer|true|none||状态码|
|message|string|true|none||提示信息|
|data|[UploadProgressDTO](#schemauploadprogressdto)|false|none||数据对象|

<h2 id="tocS_UploadProgressDTO">UploadProgressDTO</h2>

<a id="schemauploadprogressdto"></a>
<a id="schema_UploadProgressDTO"></a>
<a id="tocSuploadprogressdto"></a>
<a id="tocsuploadprogressdto"></a>

```json
{
  "uploadSessionId": "string",
  "totalChunks": -2147483648,
  "completedChunks": -2147483648,
  "progressPercent": 0.1,
  "status": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|uploadSessionId|string|false|none||上传会话ID|
|totalChunks|integer|false|none||视频分块总数|
|completedChunks|integer|false|none||已完成分块数|
|progressPercent|number(float)|false|none||上传进度百分比|
|status|string|false|none||视频状态(UPLOADING-上传中，PROCESSING-处理中，PUBLISHED-已发布，DELETED-已删除)|

