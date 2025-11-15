# 报名信息管理网页设计方案

## 1. 目标与 MVP 功能

### 1.1 核心功能（MVP 必备）
1. **信息录入**：提供表单，输入姓名、性别、所报课程、联系方式、备注。
2. **数据查看**：列表展示所有报名记录，支持分页或滚动加载。
3. **条件搜索/过滤**：按姓名、性别、课程、联系方式关键词搜索；可扩展按照时间段或课程分类过滤。
4. **记录维护**：
   - 新增：表单提交创建新报名记录。
   - 修改：从列表进入编辑界面或弹窗修改现有记录。
   - 删除：支持单条删除，也可在后续扩展批量删除。
5. **数据导出**：将当前筛选结果或全部数据导出为 Excel/CSV。可扩展导出 PDF。
6. **数据校验**：前端和后端对必填项及格式（如手机号）做校验。

### 1.2 后续可扩展功能
- **用户系统**：管理员登录、多角色权限控制（只查看 vs. 可编辑）。
- **报名统计**：按课程统计报名人数、性别比等图表展示。
- **通知联动**：报名成功后发送邮件/短信确认。
- **附件上传**：如身份证件、报名表扫描件。
- **多语言支持**。

---

## 2. 系统架构概览

```mermaid
flowchart LR
    subgraph Client[前端 Web 应用]
        Form[报名表单]
        List[报名信息列表]
        Search[搜索/筛选面板]
        ExportButton[导出按钮]
        Modal[新增/编辑弹窗]
    end

    subgraph Backend[后端服务层]
        API[REST API / GraphQL]
        Validation[数据验证]
        Service[业务逻辑/权限控制]
        ExportService[导出处理模块]
        DB[(数据库)]
    end

    Client -->|HTTP(S) JSON| API
    API --> Validation --> Service --> DB
    Service --> ExportService --> Client
```

### 2.1 技术建议
- **前端**：Vue3
- **UI 组件库**：Ant Design（React/Vue）、Element Plus（Vue）、MUI 等，方便快速搭建表单与表格。
- **后端**：Node.js（Express / NestJS）。
- **数据库**：SQLite。
- **导出功能**：
  - Excel：Node.js 可用 `exceljs`，Python 可用 `pandas`。
  - CSV：语言原生或第三方库均易实现。
- **部署**：前端静态资源部署（如 Vercel、Netlify、Nginx），后端部署到云主机或 Serverless 平台。数据库托管在云数据库。

---

## 3. 数据模型设计

### 3.1 表结构示例（SQLite）

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

CREATE INDEX idx_enrollments_name ON enrollments (name);
CREATE INDEX idx_enrollments_course ON enrollments (course);
```

#### 说明
- `gender` 使用 `CHECK` 约束限制取值，若需扩展可调整条件。
- `contact` 字段可存手机号、邮箱或微信号；如需区分可进一步拆分。
- `updated_at` 需要在应用层或通过触发器更新为当前时间，以反映最新修改。
- 根据搜索需要对 `name`、`course` 等字段建立索引。

### 3.2 数据校验规则

| 字段 | 必填 | 校验规则 |
| --- | --- | --- |
| 姓名 | 是 | 长度 1~50；可设置仅中文或允许中英文 |
| 性别 | 是 | 选项：男/女/其他 |
| 课程 | 是 | 长度 1~100；可预置课程列表供下拉选择 |
| 联系方式 | 是 | 根据格式（手机号/邮箱）校验；可提供多个选项 |
| 备注 | 否 | 长度限制，如 1000 字内 |

---

## 4. 前端设计

### 4.1 页面与组件
1. **首页（报名列表页）**
   - 顶部：搜索栏（输入框 + 课程筛选 + 性别筛选 + 重置按钮）。
   - 中部：表格展示报名信息，列包含：姓名、性别、课程、联系方式、备注、创建时间、操作（编辑/删除）。
   - 底部：分页控件。
   - 右上角：按钮「新增报名」、「导出数据」。
2. **新增/编辑弹窗（Modal）**
   - 统一表单组件，新增与编辑共用。
   - 包含数据校验与提交反馈。
3. **删除确认对话框**：防止误删。
4. **导出功能**：点击导出按钮后调用后端导出接口，返回文件下载链接或直接下载。

### 4.2 状态管理与数据请求
- 小规模应用可使用 React 的 `useState` / `useReducer` 或 Vue 的组合式 API。
- 数据请求采用 Axios/Fetch，抽象 API Service 层统一管理。
- 若未来多页面共享状态，推荐引入 Redux、MobX、Pinia 等。

### 4.3 UI/UX 细节
- 表格列宽自适应，联系方式加复制按钮。
- 长备注使用 Tooltip 或折叠展开显示。
- 可扩展批量选中、批量删除/导出。
- 搜索条件与分页状态可存储在 URL 中，方便分享链接或刷新回显。

---

## 5. 后端设计

### 5.1 REST API 设计示例

| 接口 | 方法 | 路径 | 描述 |
| --- | --- | --- | --- |
| 获取列表 | GET | `/api/enrollments` | 支持分页 (`page`, `pageSize`) 和条件过滤（`name`, `course`, `gender`, `contact`） |
| 新增报名 | POST | `/api/enrollments` | Request Body 包含报名字段 |
| 更新报名 | PUT | `/api/enrollments/{id}` | 更新指定 ID 的记录 |
| 删除报名 | DELETE | `/api/enrollments/{id}` | 删除单条数据 |
| 批量删除（可选） | DELETE | `/api/enrollments` | 请求体传 ID 数组 |
| 导出数据 | GET | `/api/enrollments/export` | 接受同列表的筛选参数，生成 Excel/CSV 文件下载 |

### 5.2 导出功能实现建议
- **后端**：
  - 采用 Excel/CSV 库，将查询结果写入临时文件或直接输出二进制流。
  - Excel 推荐 `exceljs`（Node.js）或 `pandas`（Python）。
- **前端**：
  - 发起请求后处理文件流，触发浏览器下载。
  - 提供导出状态提示（Loading、成功/失败提示）。

### 5.3 安全与权限
- 若公开部署，应添加鉴权机制，确保只有授权用户可操作。
- 防止 SQL 注入：使用 ORM 或参数化查询。
- 防止 XSS：对输入/输出进行编码或过滤。
- 对含敏感信息的字段可使用加密存储或脱敏展示。

---

## 6. 部署与运维

### 6.1 环境与部署
- **开发环境**：本地或私有 Dev 环境，启用详细日志。
- **测试环境**：尽量与正式环境配置一致，用于联调与 QA。
- **生产环境**：
  - 前端：构建后部署到 Nginx/OSS/CDN。
  - 后端：部署在云服务器、容器集群或 Serverless 平台。
  - 数据库：使用云数据库（RDS、Aurora、Mongo Atlas）或自建实例。

### 6.2 运维要点
- HTTPS 访问，保护用户提交的信息。
- 对数据库进行定期备份与恢复演练。
- 日志与监控：收集访问日志、错误日志；接入监控平台（如 Prometheus、Grafana、Sentry 等）。
- 资源伸缩：为高峰期预留扩展能力。

---

## 7. 迭代路线示例

| 阶段 | 重点工作 | 产出物 |
| --- | --- | --- |
| 第 1 阶段 | 需求确认、原型设计、技术选型 | 交互原型、技术栈计划 |
| 第 2 阶段 | 后端基础搭建（数据库、API） | 可运行的 REST API |
| 第 3 阶段 | 前端开发（列表、表单、搜索） | MVP UI 与交互 |
| 第 4 阶段 | 导出功能、异常处理、UI 打磨 | 完整的业务流程 |
| 第 5 阶段 | 测试、上线部署、文档整理 | 上线版本与维护指南 |

---

## 8. 下一步建议

1. **确认技术栈**：如已有前后端框架偏好请提前确定。
2. **导出格式与模板**：明确是否需要 Excel 模板、特定列顺序或多表导出。
3. **用户与权限需求**：是否需要管理员登录、权限细分。
4. **课程信息管理**：课程是固定列表还是动态维护？是否需要课程管理模块。
5. **实施阶段**：准备就绪后，可让我切换到 CRAFT 模式，帮助创建项目结构、生成示例代码、配置 API 接口等。
