# Note App - 笔记管理软件

一款基于 Next.js + Flask 的全栈笔记管理应用，支持笔记的增删改查、搜索和标签筛选。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 16、React、Ant Design、Tailwind CSS |
| 后端 | Python Flask 3、SQLite |
| 版本控制 | Git + GitHub |

## 安装与运行

### 后端

cd backend
py -m venv venv
venv\Scriptsctivate
pip install -r requirements.txt
py app.py

后端运行在 http://localhost:5000

### 前端

cd frontend
npm install
npm run dev

前端运行在 http://localhost:3000

### 环境变量

创建 frontend/.env.local：
NEXT_PUBLIC_API_URL=http://localhost:5000

## 功能说明

### 前端页面（3 个独立路由）

/ - 笔记列表：展示所有笔记、搜索标题/内容、按标签筛选、删除笔记
/notes/new - 新建笔记：填写标题、内容、标签，创建新笔记
/notes/[id] - 笔记详情：查看笔记、切换编辑模式、保存修改、删除笔记

### 后端 API（5 个接口）

GET /api/notes - 获取笔记列表（支持 search、tag 参数）
POST /api/notes - 创建笔记
GET /api/notes/:id - 获取单条笔记
PUT /api/notes/:id - 更新笔记
DELETE /api/notes/:id - 删除笔记

### 笔记字段

id (int)、title (string)、content (string)、tags (string)、created_at (string)、updated_at (string)

### 异常处理

- 标题为空时 API 返回 400 错误
- 笔记不存在时 API 返回 404 错误
- 删除操作有二次确认弹窗

## 部署

前端（Vercel）：导入 frontend/ 目录，设定 NEXT_PUBLIC_API_URL
后端（Railway）：上传 backend/，启动命令 py app.py

## License

MIT
