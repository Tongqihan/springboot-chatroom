# SpringBoot Chatroom

前后端分离聊天室项目。当前已完成 **backend 最小可用群聊能力**，frontend 仍保持骨架不变。

## 技术栈

- Backend: Spring Boot 3, Maven, Java 17, Spring WebSocket(STOMP), Spring Data JPA, H2
- Frontend: React 18 + Vite 5（本次未修改）

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
```

## Backend 已实现功能（MVP）

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

### 2) 验证 REST 接口

```bash
curl "http://localhost:8080/api/health"
curl "http://localhost:8080/api/messages/recent?limit=20"
```

### 3) H2 控制台（可选）

- 地址：`http://localhost:8080/h2-console`
- JDBC URL：`jdbc:h2:mem:chatroom;MODE=MYSQL;DB_CLOSE_DELAY=-1`
- 用户名：`sa`
- 密码：空

## CORS 说明

backend 已开放本地联调所需 CORS：`http://localhost:5173`。
