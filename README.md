# SpringBoot Chatroom

前后端分离聊天室项目，当前版本为 `v0.6 - MySQL 消息持久化版`。

## 当前能力

- `backend`：Spring Boot + STOMP WebSocket + Spring Data JPA + MySQL
- `frontend`：React + Vite + `@stomp/stompjs`
- 支持实时聊天室、多房间聊天、在线用户列表、系统提示消息
- 支持消息写入 MySQL，并按房间加载最近 50 条历史消息
- 支持保留原有简约 UI 与实时聊天体验

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
│           ├── application.yml
│           └── schema-mysql.sql
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

## 技术栈

- Backend: Spring Boot 3.3, Java 17, Spring WebSocket(STOMP), Spring Data JPA, MySQL 8
- Frontend: React 18, Vite 5, `@stomp/stompjs`

## 消息结构

后端返回和广播的消息结构如下：

```json
{
  "id": 1,
  "roomName": "room1",
  "username": "alice",
  "content": "hello",
  "createdAt": "2026-04-24T12:00:00",
  "type": "CHAT"
}
```

系统消息 `type` 为 `SYSTEM`，同样会带 `roomName` 与 `createdAt`。

## 后端接口与 WebSocket

### REST

- 健康检查：`GET /api/health`
- 历史消息：`GET /api/rooms/{roomName}/messages?limit=50`

### WebSocket

- 连接地址：`/ws/chat`
- 发送消息：`/app/chat.send`
- 进入房间：`/app/chat.join`
- 离开房间：`/app/chat.leave`
- 消息订阅：`/topic/rooms/{roomName}/messages`
- 在线状态订阅：`/topic/rooms/{roomName}/presence`

## MySQL 配置

默认配置写在 [backend/src/main/resources/application.yml](/D:/PythonProject/mycodex/springboot-chatroom/backend/src/main/resources/application.yml)：

```yaml
spring:
  datasource:
    url: jdbc:mysql://${DB_HOST:localhost}:${DB_PORT:3306}/${DB_NAME:chatroom_db}?useSSL=false&serverTimezone=Asia/Shanghai&characterEncoding=utf8&allowPublicKeyRetrieval=true
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:root}
    driver-class-name: com.mysql.cj.jdbc.Driver
```

你可以通过环境变量覆盖：

```bash
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chatroom_db
DB_USERNAME=root
DB_PASSWORD=你的密码
```

## 建库建表 SQL

项目已提供 SQL 文件：

- [backend/src/main/resources/schema-mysql.sql](/D:/PythonProject/mycodex/springboot-chatroom/backend/src/main/resources/schema-mysql.sql)

内容如下：

```sql
CREATE DATABASE IF NOT EXISTS chatroom_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE chatroom_db;

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  room_name VARCHAR(100) NOT NULL,
  username VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL,
  KEY idx_chat_messages_room_created_at (room_name, created_at)
);
```

说明：

- 项目当前使用 JPA `ddl-auto: update`，即使你不手动建表也会尝试自动建表。
- 仍然建议先执行 SQL，这样你更容易确认表结构是否符合预期。

## 本地启动

### 1. 启动 MySQL 并创建数据库

执行 `schema-mysql.sql`，或者手动在 MySQL 中创建 `chatroom_db`。

### 2. 启动 backend

```bash
cd backend
mvn spring-boot:run
```

默认端口：`8080`

### 3. 启动 frontend

```bash
cd frontend
npm install
npm run dev
```

默认端口：`5173`

访问地址：`http://localhost:5173`

## 联调流程

1. 在进入页输入昵称。
2. 输入房间名，例如 `room1`、`room2`、`lobby`。
3. 前端先请求 `GET /api/rooms/{roomName}/messages?limit=50` 加载历史消息。
4. 然后建立 WebSocket 连接并订阅对应房间的消息与在线状态。
5. 发送消息后，后端先保存到 MySQL，再广播给当前房间。
6. 切换房间后，前端会重新加载该房间最近 50 条历史消息。

## 验证建议

1. 进入 `room1`，发送几条消息。
2. 刷新页面，确认 `room1` 历史消息仍然存在。
3. 切换到 `room2`，确认看不到 `room1` 的历史消息。
4. 在 `room2` 发送消息后刷新，再次确认 `room2` 历史消息可以保留。
5. 用两个浏览器窗口进入同一房间，确认实时消息和在线状态仍正常。

## 已知说明

- 当前持久化的是普通聊天消息 `CHAT`。
- 进入/离开聊天室的系统提示消息仍然是实时广播，不会写入数据库。
- 在线用户状态仍为内存管理，服务重启后会重置。
