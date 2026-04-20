# SpringBoot Chatroom

前后端分离聊天室项目。当前版本提供：

- backend：Spring Boot + STOMP WebSocket 的群聊后端
- frontend：React + Vite 的最小可用聊天室前端

## 技术栈

- Backend: Spring Boot 3, Maven, Java 17, Spring WebSocket(STOMP), Spring Data JPA, H2
- Frontend: React 18 + Vite 5 + @stomp/stompjs

## 仓库结构

```text
.
├── backend
│   ├── pom.xml
│   └── src/main
│       ├── java/com/example/chatroom
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
    ├── package.json
    └── src
        ├── api
        ├── components
        ├── hooks
        ├── pages
        ├── store
        ├── styles
        └── utils
```

## Backend 能力（MVP）

- STOMP WebSocket 连接：`/ws/chat`
- 客户端发送群聊消息（应用目的地）：`/app/chat.send`
- 服务器广播消息（订阅目的地）：`/topic/messages`
- 消息持久化到 H2 内存数据库
- REST 查询最近聊天记录：`GET /api/messages/recent?limit=50`
- 健康检查接口：`GET /api/health`

### 消息结构

```json
{
  "id": 1,
  "username": "alice",
  "content": "hello",
  "timestamp": "2026-04-20T12:00:00"
}
```

## 本地启动

### 1) 启动 backend

```bash
cd backend
mvn spring-boot:run
```

默认端口：`8080`

### 2) 启动 frontend

```bash
cd frontend
npm install
npm run dev
```

默认端口：`5173`

访问：`http://localhost:5173`

> frontend 默认使用：
>
> - REST：`http://localhost:8080`
> - WebSocket：`ws://localhost:8080/ws/chat`
>
> 如需修改，可在 frontend 目录创建 `.env`：
>
> ```bash
> VITE_API_BASE_URL=http://localhost:8080
> VITE_WS_BASE_URL=ws://localhost:8080/ws/chat
> ```

### 3) 联调说明

1. 在 frontend 输入昵称并进入聊天室。
2. 页面会先请求 `GET /api/messages/recent?limit=50` 加载历史消息。
3. 然后建立 STOMP WebSocket 连接到 `/ws/chat` 并订阅 `/topic/messages`。
4. 点击发送后，前端向 `/app/chat.send` 发布消息。
5. 后端保存消息后广播给所有订阅客户端，前端实时更新列表。

### 4) 验证 REST 接口（可选）

```bash
curl "http://localhost:8080/api/health"
curl "http://localhost:8080/api/messages/recent?limit=20"
```

### 5) H2 控制台（可选）

- 地址：`http://localhost:8080/h2-console`
- JDBC URL：`jdbc:h2:mem:chatroom;MODE=MYSQL;DB_CLOSE_DELAY=-1`
- 用户名：`sa`
- 密码：空

## CORS 说明

backend 已开放本地联调所需 CORS：`http://localhost:5173`。
