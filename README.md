# Note App - 笔记管理软件

[English](README.en.md) | [中文版](README.zh.md)

基于 Next.js + Flask 的全栈笔记管理应用。

# 线上部署访问 URL；
https://note-app-mu-seven.vercel.app/

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16, React, Ant Design, Tailwind CSS |
| 后端 | Python Flask 3, SQLite |
| 版本控制 | Git + GitHub |

## 项目结构

```
note-app/
frontend/         # Next.js 前端
  src/app/        # 页面路由
  src/lib/        # 工具库 (API, 国际化, 草稿)
backend/          # Flask 后端 API
  app.py          # 7 个 REST 接口
  models.py       # SQLite 数据模型
```

## 安装与运行

### 后端

```
cd backend
py -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
py app.py
```

服务地址: http://localhost:5000

### 前端

```
cd frontend
npm install
npm run dev
```

服务地址: http://localhost:3000

### 环境变量

创建 frontend/.env.local:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 功能特性

| 功能 | 说明 |
|------|------|
| 增删改查 | 创建、查看、编辑、删除笔记 |
| Markdown | 编辑/预览双标签，支持 Markdown 渲染 |
| 搜索 | 实时搜索笔记标题和内容 |
| 标签 | 逗号分隔标签，支持筛选 |
| 分页 | 每页 10 条，页码切换 |
| 排序 | 按更新时间、创建时间、标题排序 |
| 自动保存 | 草稿自动存入 localStorage，可恢复 |
| 语言切换 | 中英文切换，偏好持久化 |
| 导出 | 全部笔记导出为 JSON 文件 |
| 导入 | 从 JSON 文件批量导入笔记 |
| 批量删除 | 多选笔记后一键删除 |
| Markdown 预览 | 笔记卡片中渲染 Markdown 内容 |
| 标签建议 | 新建笔记时点击已有标签快速添加 |

## API 接口

### 笔记 CRUD

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/notes | 列表 (支持 search, tag, page, sort) |
| POST | /api/notes | 创建 (title, content, tags) |
| GET | /api/notes/:id | 获取单条笔记 |
| PUT | /api/notes/:id | 更新笔记 |
| DELETE | /api/notes/:id | 删除笔记 |

### 批量操作

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/notes/export | 导出全部笔记为 JSON |
| POST | /api/notes/import | 从 JSON 批量导入笔记 |
| POST | /api/notes/batch-delete | 按 ID 批量删除笔记 |
| GET | /api/notes/tags | 获取所有唯一标签 |

### 笔记字段

```json
{
  "id": 1,
  "title": "我的笔记",
  "content": "Markdown 内容",
  "tags": "工作,个人",
  "created_at": "2026-07-10 19:30:00",
  "updated_at": "2026-07-10 19:30:00"
}
```

### 错误处理

- 400: 缺少标题或请求体无效
- 404: 笔记不存在
- 前端显示 API 调用失败的错误提示
- 删除操作需二次确认


## 部署地址

| 服务 | 地址 |
|------|------|
| 前端 (Vercel) | https://note-app-mu-seven.vercel.app |
| 后端 (Railway) | https://note-app-production-1abc.up.railway.app |

在 Vercel 环境变量中设置 NEXT_PUBLIC_API_URL 为 Railway 域名。

## License

MIT
