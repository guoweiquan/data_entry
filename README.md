# 报名信息管理系统

基于 Vue3 + Element Plus + TypeScript + Express + SQLite 的报名信息管理系统。

## 功能特性

- ✅ 报名信息录入（姓名、性别、课程、联系方式、备注）
- ✅ 数据查看与分页展示
- ✅ 条件搜索/过滤（按姓名、性别、课程、联系方式）
- ✅ 记录维护（新增、编辑、删除）
- ✅ 数据导出（Excel 格式）
- ✅ 数据校验（前端表单校验 + 后端数据验证）
- ✅ 响应式设计，支持移动端访问

## 技术栈

### 前端
- **框架**: Vue 3 + TypeScript
- **UI 组件库**: Element Plus
- **状态管理**: Pinia
- **构建工具**: Vite
- **HTTP 客户端**: Axios

### 后端
- **框架**: Express + TypeScript
- **数据库**: SQLite + better-sqlite3
- **数据校验**: express-validator
- **Excel 导出**: ExcelJS
- **跨域处理**: CORS
- **日志记录**: Morgan

## 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd frontend
npm install
cd ..

# 或者使用一键安装命令
npm run install:all
```

### 2. 启动开发环境

#### 方式一：分别启动（推荐）

```bash
# 终端1：启动后端服务（端口 3000）
npm run dev

# 终端2：启动前端服务（端口 5173）
npm run frontend:dev
```

#### 方式二：使用 package.json 脚本

```bash
# 启动后端
npm run dev

# 新开终端启动前端
npm run frontend:dev
```

### 3. 访问应用

- 前端应用: http://localhost:5173
- 后端 API: http://localhost:3000

## 项目结构

```
CodeBuddy_demo/
├── src/                    # 后端源码
│   ├── controllers/        # 控制器
│   ├── services/          # 业务逻辑层
│   ├── routes/            # 路由定义
│   ├── db/                # 数据库连接与迁移
│   ├── middlewares/       # 中间件
│   ├── validators/        # 数据验证
│   ├── types/             # TypeScript 类型定义
│   ├── utils/             # 工具函数
│   ├── config/            # 配置文件
│   ├── app.ts             # Express 应用配置
│   └── server.ts          # 服务器启动入口
├── frontend/              # 前端源码
│   ├── src/
│   │   ├── components/    # Vue 组件
│   │   ├── stores/        # Pinia 状态管理
│   │   ├── services/      # API 服务层
│   │   ├── types/         # TypeScript 类型
│   │   ├── utils/         # 工具函数
│   │   ├── styles/        # 样式文件
│   │   ├── App.vue        # 根组件
│   │   └── main.ts        # 应用入口
│   ├── index.html         # HTML 模板
│   ├── vite.config.ts     # Vite 配置
│   └── package.json       # 前端依赖
├── dist/                  # 后端构建输出
├── data/                  # SQLite 数据库文件
├── package.json           # 后端依赖与脚本
├── tsconfig.json          # TypeScript 配置
└── README.md              # 项目说明
```

## API 接口

### 报名信息管理

| 接口 | 方法 | 路径 | 描述 |
|------|------|------|------|
| 获取列表 | GET | `/api/enrollments` | 支持分页和条件过滤 |
| 新增报名 | POST | `/api/enrollments` | 创建新的报名记录 |
| 更新报名 | PUT | `/api/enrollments/{id}` | 更新指定报名记录 |
| 删除报名 | DELETE | `/api/enrollments/{id}` | 删除指定报名记录 |
| 导出数据 | GET | `/api/enrollments/export` | 导出 Excel 文件 |

### 请求参数示例

#### 获取列表
```
GET /api/enrollments?page=1&pageSize=10&name=张三&gender=男&course=数学
```

#### 新增/更新报名
```json
{
  "name": "张三",
  "gender": "男",
  "course": "数学课程",
  "contact": "13800138000",
  "remarks": "备注信息"
}
```

## 生产部署

### 1. 构建项目

```bash
# 构建后端
npm run build

# 构建前端
npm run frontend:build
```

### 2. 部署方式

#### 方式一：传统服务器部署

```bash
# 1. 上传项目文件到服务器
# 2. 安装生产依赖
npm install --production

# 3. 构建项目
npm run build
npm run frontend:build

# 4. 启动服务
npm start

# 5. 配置 Nginx 反向代理（可选）
# 将前端静态文件部署到 Nginx，API 请求代理到后端服务
```

#### 方式二：Docker 部署

创建 `Dockerfile`:

```dockerfile
FROM node:16-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# 安装依赖
RUN npm install --production
RUN cd frontend && npm install

# 复制源码
COPY . .

# 构建项目
RUN npm run build
RUN npm run frontend:build

# 暴露端口
EXPOSE 3000

# 启动服务
CMD ["npm", "start"]
```

### 3. 环境变量配置

创建 `.env` 文件：

```env
NODE_ENV=production
PORT=3000
DB_PATH=./data/enrollment.db
```

### 4. Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 数据库

项目使用 SQLite 数据库，数据文件位于 `data/enrollment.db`。

### 数据表结构

```sql
CREATE TABLE enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('男', '女', '其他')),
    course TEXT NOT NULL,
    contact TEXT NOT NULL,
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 数据备份

```bash
# 备份数据库
cp data/enrollment.db data/enrollment_backup_$(date +%Y%m%d_%H%M%S).db

# 恢复数据库
cp data/enrollment_backup_20231101_120000.db data/enrollment.db
```

## 开发指南

### 添加新功能

1. **后端 API**:
   - 在 `src/controllers/` 添加控制器方法
   - 在 `src/services/` 添加业务逻辑
   - 在 `src/routes/` 注册路由
   - 在 `src/validators/` 添加数据验证

2. **前端功能**:
   - 在 `frontend/src/components/` 添加组件
   - 在 `frontend/src/services/` 添加 API 调用
   - 在 `frontend/src/stores/` 添加状态管理
   - 在 `frontend/src/types/` 添加类型定义

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 组件和函数使用 PascalCase 命名
- 文件名使用 camelCase 命名
- 提交前确保代码通过类型检查

## 常见问题

### Q: 启动时提示端口被占用
A: 检查端口 3000 和 5173 是否被其他程序占用，或修改配置文件中的端口号。

### Q: 数据库连接失败
A: 确保 `data` 目录存在且有写入权限，SQLite 会自动创建数据库文件。

### Q: 前端请求后端 API 失败
A: 检查后端服务是否正常启动，确认 Vite 代理配置正确。

### Q: Excel 导出功能异常
A: 确保后端安装了 `exceljs` 依赖，检查浏览器是否支持文件下载。

## 许可证

MIT License

## 更新日志

### v1.0.0 (2024-11-01)
- ✅ 完成基础功能开发
- ✅ 实现报名信息 CRUD 操作
- ✅ 添加搜索过滤功能
- ✅ 实现 Excel 导出
- ✅ 完善前端 UI 交互
- ✅ 添加数据校验
- ✅ 编写部署文档