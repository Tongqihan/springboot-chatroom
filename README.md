# SpringBoot Chatroom (Skeleton)

这是一个**前后端分离聊天室**项目的首个可维护骨架版本，当前仅完成目录结构、基础配置和占位代码，便于后续渐进式开发。

## 1. 技术栈

- Backend: Spring Boot 3 + Maven + Java 17
- Frontend: React 18 + Vite 5

## 2. 仓库结构

```text
.
├── backend
│   ├── pom.xml
│   └── src/main
│       ├── java/com/example/chatroom
│       │   ├── ChatroomBackendApplication.java
│       │   ├── common
│       │   ├── config
│       │   ├── controller
│       │   ├── dto
│       │   ├── entity
│       │   ├── exception
│       │   ├── repository
│       │   ├── service
│       │   │   └── impl
│       │   └── websocket
│       └── resources
│           └── application.yml
└── frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src
        ├── api
        ├── components
        ├── hooks
        ├── pages
        ├── store
        ├── styles
        ├── utils
        ├── App.jsx
        └── main.jsx
```

## 3. 当前已完成内容（仅骨架）

### Backend

- Maven 工程初始化（含 web/websocket/validation/jpa/h2/test 依赖）
- 启动类 `ChatroomBackendApplication`
- 分层目录及占位类：
  - `config`: `CorsConfig`
  - `controller`: `HealthController`
  - `service` / `service/impl`: `ChatService`, `ChatServiceImpl`
  - `repository`: `ChatMessageRepository`
  - `entity`: `ChatMessage`
  - `dto`: `ChatMessageDto`
  - `websocket`: `WebSocketConfig`
  - `exception`: `GlobalExceptionHandler`
  - `common`: `ApiResponse`

### Frontend

- Vite + React 基础工程
- 目录分层及占位文件：
  - `api`: `chatApi.js`
  - `components`: `ChatLayout.jsx`
  - `pages`: `ChatPage.jsx`
  - `hooks`: `useChat.js`
  - `store`: `chatStore.js`
  - `utils`: `constants.js`
  - `styles`: `index.css`
- `App.jsx` 挂载基础页面，确保启动后可见占位内容

## 4. 后续开发计划（建议迭代）

### 阶段 A：基础能力完善

1. 后端：补充统一返回码、业务异常体系、日志规范
2. 前端：引入路由（React Router）、HTTP 客户端（axios）封装
3. 前后端：统一环境变量与配置（端口、API 前缀）

### 阶段 B：聊天室核心功能

1. 用户进入房间（昵称 + 房间号）
2. 历史消息拉取（REST）
3. 实时消息收发（WebSocket/STOMP）
4. 在线用户列表同步

### 阶段 C：工程化与质量

1. 后端单元测试/集成测试
2. 前端组件测试与 E2E 测试
3. Docker 化与 CI/CD

## 5. 本地启动思路

### 启动 Backend

```bash
cd backend
mvn spring-boot:run
```

默认端口：`8080`，可用健康检查接口：`GET /api/health`

### 启动 Frontend

```bash
cd frontend
npm install
npm run dev
```

默认端口：`5173`，通过浏览器访问 Vite 本地地址即可。

## 6. 约定与维护建议

- 先保留清晰分层，不在初期把业务逻辑耦合到 controller 或页面组件。
- DTO / Entity / API 类型分离，避免后续重构成本过高。
- 每次迭代只实现一个子目标，保证可测试、可回滚、可评审。

---

> 当前提交目标是“打好骨架，不一次性实现所有功能”。下一步建议从“进入房间 + 消息列表”最小闭环开始。
