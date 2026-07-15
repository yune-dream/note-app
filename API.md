# API 接口文档

基础地址：`http://localhost:5000/api`（本地）或 `https://note-app-production-1abc.up.railway.app/api`（线上）

所有接口返回 JSON，无需认证。

---

## 笔记 CRUD

### 获取笔记列表

```
GET /api/notes
```

查询参数：

| 参数 | 类型 | 默认值 | 说明 |
|-------|------|---------|-------------|
| search | string | - | 搜索标题和内容 |
| tag | string | - | 按标签筛选 |
| page | int | 1 | 页码 |
| per_page | int | 10 | 每页条数 |
| sort_by | string | updated_at | 排序字段（title/created_at/updated_at）|
| sort_order | string | desc | 排序方向（asc/desc）|

响应：
```json
{
  "notes": [
    {
      "id": 1,
      "title": "Getting Started with Python",
      "content": "Python is a **versatile** programming language.",
      "tags": "python,programming",
      "created_at": "2026-07-15 10:00:00",
      "updated_at": "2026-07-15 10:00:00"
    }
  ],
  "total": 1,
  "page": 1,
  "per_page": 10
}
```

### 创建笔记

```
POST /api/notes
Content-Type: application/json
```

请求体：
| 字段 | 类型 | 必填 | 说明 |
|-------|------|----------|-------------|
| title | string | 是 | 笔记标题 |
| content | string | 是 | 笔记内容（支持 Markdown）|
| tags | string | 否 | 标签（逗号分隔）|

响应（201 Created）：
```json
{
  "id": 2,
  "title": "My Note",
  "content": "Hello world",
  "tags": "test",
  "created_at": "2026-07-15 10:00:00",
  "updated_at": "2026-07-15 10:00:00"
}
```

### 获取单条笔记

```
GET /api/notes/:id
```

响应：
```json
{
  "id": 1,
  "title": "Getting Started with Python",
  "content": "Python is a **versatile** programming language.",
  "tags": "python,programming",
  "created_at": "2026-07-15 10:00:00",
  "updated_at": "2026-07-15 10:00:00"
}
```

### 更新笔记

```
PUT /api/notes/:id
Content-Type: application/json
```

请求体： Same as Create (title, content, tags)

响应： Updated note object

### 删除笔记

```
DELETE /api/notes/:id
```

响应：
```json
{ "message": "Note deleted" }
```

---

## 批量操作

### 批量删除

```
POST /api/notes/batch-delete
Content-Type: application/json
```

请求体： Array of note IDs
```json
[1, 2, 3]
```

响应：
```json
{ "deleted": 3 }
```

### 导出全部笔记

```
GET /api/notes/export
```

响应： Array of all note objects

### 导入笔记

```
POST /api/notes/import
Content-Type: application/json
```

请求体： Array of note objects
```json
[
  { "title": "Note 1", "content": "Content 1", "tags": "tag1" },
  { "title": "Note 2", "content": "Content 2", "tags": "tag2" }
]
```

响应：
```json
{ "imported": 2, "total": 2 }
```

### 获取所有标签

```
GET /api/notes/tags
```

响应：
```json
["backend","flask","javascript","programming","python","react"]
```

---

## 错误处理

| 状态码 | 含义 |
|--------|---------|
| 400 | 缺少标题或请求体无效 |
| 404 | 笔记不存在 |

Error 响应：
```json
{ "error": "Title is required" }
```

---

## 笔记字段说明

| 字段 | 类型 | 说明 |
|-------|------|-------------|
| id | int | 自增 ID |
| title | string | 笔记标题 |
| content | string | Markdown 内容 |
| tags | string | 逗号分隔的标签 |
| created_at | string | 创建时间 |
| updated_at | string | 最后更新时间 |

## 快速测试

```bash
# List notes
curl https://note-app-production-1abc.up.railway.app/api/notes

# Create a note
curl -X POST https://note-app-production-1abc.up.railway.app/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","content":"Hello","tags":"test"}'

# Get tags
curl https://note-app-production-1abc.up.railway.app/api/notes/tags
```
