# SpringBoot Chatroom

前后端分离聊天室项目。当前版本提供：

- backend：Spring Boot + STOMP WebSocket 的群聊后端
- frontend：React + Vite 的最小可用聊天室前端

## v0.2 聊天体验优化

本次版本聚焦于前端交互体验，未改动 backend 接口与消息协议，主要增强如下：

- 支持输入框按 `Enter` 直接发送消息（空消息不会发送）。
- 输入为空或仅空格时，发送按钮自动禁用，点击和按 Enter 都不会触发发送。
- 区分“自己发送的消息”和“他人发送的消息”视觉样式（对齐与配色不同）。
- 首次进入聊天室及收到新消息时，消息列表自动滚动到底部。
- WebSocket 断开时显示更明显的提示文案；前端保持轻量自动重连（每 3 秒）。

### v0.2 手动验证步骤

1. 启动 backend 与 frontend 后，使用两个浏览器窗口（或隐私窗口）分别进入聊天室。
2. 在输入框中输入文本后按 `Enter`，确认消息可发送。
3. 输入空字符串或多个空格，确认“发送”按钮不可点，按 `Enter` 不发送。
4. 对比两个窗口中的消息样式，确认自己消息靠右、他人消息靠左，视觉有明显区分。
5. 连续发送多条消息，确认列表会自动滚动到最新消息。
6. 停止 backend 或断开网络后，确认页面显示“连接异常/已断开，自动重连”提示；恢复 backend 后观察连接状态恢复。

## v0.4 系统提示消息版

本次版本在 v0.3 基础上聚焦“系统提示消息”体验，保持现有 WebSocket 架构不变，新增/强化如下：

- 用户进入聊天室时，后端实时广播 `SYSTEM` 类型消息（例如：`test2 加入了聊天室`）。
- 用户主动退出或连接断开时，后端实时广播 `SYSTEM` 类型消息（例如：`test2 离开了聊天室`）。
- 消息结构中通过 `type` 字段区分普通消息与系统消息（`CHAT` / `SYSTEM`）。
- 前端渲染中系统消息采用独立样式：居中、浅灰背景、弱化字体、非用户气泡样式。
- 在线人数、在线用户列表、聊天消息与系统消息继续通过 WebSocket 实时同步，无轮询。

### v0.4 手动验证步骤

1. 启动 backend 与 frontend，打开两个浏览器窗口并输入不同昵称。
2. 第 2 个用户进入后，观察两个窗口消息流都出现“xxx 加入了聊天室”的系统提示。
3. 在任一窗口发送普通聊天消息，确认仍保持左右气泡样式并正常送达。
4. 点击“退出”按钮离开聊天室，观察另一窗口收到“xxx 离开了聊天室”的系统提示。
5. 直接关闭一个标签页，确认另一窗口仍会实时收到“离开聊天室”系统提示。
6. 全过程确认在线人数、在线用户列表、Enter 发送、自动滚动到底部都保持可用。

## v0.5 多房间聊天室（最小可用版）

本次版本在 v0.4 基础上扩展“固定房间”能力，保持 WebSocket / STOMP 架构不大改，重点实现：

- 内置固定房间：`lobby`、`tech`、`casual`。
- 进入聊天室时可选择房间，进入后可随时切换房间。
- 消息按房间隔离广播：只会发送到 `/topic/rooms/{room}/messages`。
- 在线状态按房间隔离广播：只会发送到 `/topic/rooms/{room}/presence`。
- 历史消息按房间查询：`GET /api/messages/recent?room=lobby&limit=50`。

### v0.5 手动验证步骤

1. 启动 backend 与 frontend，打开两个浏览器窗口。
2. 窗口 A 进入 `lobby`，窗口 B 进入 `tech`。
3. A 发送消息，确认 B 看不到；B 发送消息，确认 A 看不到。
4. 将 B 切换到 `lobby`，确认可以看到 `lobby` 的历史并接收 `lobby` 新消息。
5. B 从 `lobby` 切回 `tech`，确认不再接收 `lobby` 新消息，只接收 `tech` 消息流。
6. 分别在 3 个房间验证在线人数/在线用户列表会随房间变化。

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
- 客户端发送上线/离线事件：`/app/chat.join`、`/app/chat.leave`
- 服务器按房间广播聊天与系统提示消息：`/topic/rooms/{room}/messages`
- 服务器按房间广播在线人数与在线用户列表：`/topic/rooms/{room}/presence`
- 消息持久化到 H2 内存数据库
- REST 按房间查询最近聊天记录：`GET /api/messages/recent?room=lobby&limit=50`
- 健康检查接口：`GET /api/health`

### 消息结构

```json
{
  "id": 1,
  "username": "alice",
  "content": "hello",
  "timestamp": "2026-04-20T12:00:00",
  "type": "CHAT",
  "room": "lobby"
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
> - WebSocket：`ws://localhost:8080/ws/chat`（默认会根据 REST 地址自动推导）
>
> 如需修改，可在 frontend 目录创建 `.env`：
>
> ```bash
> VITE_API_BASE_URL=http://localhost:8080
> VITE_WS_BASE_URL=ws://localhost:8080/ws/chat
> ```

### 3) 联调说明

1. 在 frontend 输入昵称并进入聊天室。
2. 页面会先请求 `GET /api/messages/recent?room=<room>&limit=50` 加载该房间历史消息。
3. 然后建立 STOMP WebSocket 连接到 `/ws/chat` 并按房间订阅 `/topic/rooms/<room>/messages` 与 `/topic/rooms/<room>/presence`。
4. 连接成功后前端向 `/app/chat.join` 发送上线事件（包含 `username` 与 `room`）。
5. 点击发送后，前端向 `/app/chat.send` 发布消息（包含 `room`）。
6. 点击退出、切换房间或页面卸载时，前端向 `/app/chat.leave` 发送离线事件（包含 `room`）。
7. 后端广播聊天消息、系统提示、在线用户状态，前端实时更新列表与在线人数。

### 4) 验证 REST 接口（可选）

```bash
curl "http://localhost:8080/api/health"
curl "http://localhost:8080/api/messages/recent?room=lobby&limit=20"
```

### 5) H2 控制台（可选）

- 地址：`http://localhost:8080/h2-console`
- JDBC URL：`jdbc:h2:mem:chatroom;MODE=MYSQL;DB_CLOSE_DELAY=-1`
- 用户名：`sa`
- 密码：空

## CORS 说明

backend 已开放本地联调所需 CORS / WebSocket Origin：

- `http://localhost:5173`
- `http://127.0.0.1:5173`

## 前后端联调检查清单（已对齐）

1. REST 地址：前端默认 `http://localhost:8080`，可通过 `VITE_API_BASE_URL` 覆盖。
2. WebSocket 地址：默认由 REST 地址自动推导为 `ws://<host>:<port>/ws/chat`，也可显式配置 `VITE_WS_BASE_URL`。
3. REST 历史接口：`GET /api/messages/recent?room=<room>&limit=50`，进入聊天室时自动加载对应房间。
4. WebSocket 收发路径：
   - 建连：`/ws/chat`
   - 发送：`/app/chat.send` / `/app/chat.join` / `/app/chat.leave`（均带 `room`）
   - 订阅：`/topic/rooms/<room>/messages` / `/topic/rooms/<room>/presence`
5. 消息字段统一：`id` / `username` / `content` / `timestamp` / `type` / `room`（`CHAT` 或 `SYSTEM`）。
6. 基础错误提示：
   - 后端 REST 不可用时会提示“后端不可用，请确认后端服务已启动”
   - WebSocket 连接失败或断开时有页面提示

## 已知限制

- 当前后端使用 H2 内存库，重启 backend 后历史消息会丢失。
- 当前仅实现最小群聊能力（无登录鉴权、无私聊、无动态建房、无复杂权限控制）。
- 房间是预设固定列表：`lobby` / `tech` / `casual`。
