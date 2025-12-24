# Daily Planning Assistant - Zypher Agent集成项目

一个完整的全栈应用，集成了React前端和基于Zypher Agent的后端，用于生成智能日程计划。

## 🏗️ 项目架构

```
Arrhythmia-classification/
├── server.ts                    # Zypher Agent后端服务器（端口3001）
├── start-server.bat            # 后端启动脚本
├── .env                        # 环境变量配置
├── deckspeed-template/         # React前端应用（端口3000）
│   ├── start.bat              # 前端启动脚本
│   ├── src/
│   │   ├── components/        # React组件
│   │   ├── services/          # API调用服务
│   │   ├── types/             # TypeScript类型定义
│   │   └── App.tsx            # 主应用
│   └── README.md              # 前端详细文档
└── PROJECT_README.md           # 项目总文档（本文件）
```

## 🚀 快速开始

### 前提条件

1. **Deno** - 用于运行后端服务器
   - 安装: https://deno.land/
   
2. **Node.js** - 用于运行React前端
   - 安装: https://nodejs.org/
   
3. **Anthropic API Key** - 用于Claude AI
   - 确保 `.env` 文件中有 `ANTHROPIC_API_KEY`

### 启动步骤

#### 方法1：分别启动（推荐用于开发）

**1. 启动后端服务器（终端1）**
```bash
# 在项目根目录
start-server.bat
```
或者
```bash
deno run --allow-all server.ts
```

**2. 启动前端应用（终端2）**
```bash
cd deckspeed-template
start.bat
```
或者
```bash
cd deckspeed-template
npm install
npm start
```

#### 方法2：手动启动

**后端:**
```bash
deno run --allow-all server.ts
```

**前端:**
```bash
cd deckspeed-template
npm install
npm start
```

### 访问应用

- **前端界面**: http://localhost:3000
- **后端API**: http://localhost:3001
- **健康检查**: http://localhost:3001/health

## 📋 功能说明

### 前端（React + TypeScript + Tailwind CSS）

- **左侧面板**: 显示AI生成的结构化日程计划
  - 时间块卡片
  - 任务优先级显示
  - 分类标签
  - 预计时长
  
- **右侧面板**: 与Claude AI的聊天界面
  - 输入今天要完成的任务
  - 实时生成日程计划
  - 示例提示词

### 后端（Zypher Agent + Deno）

- **ZypherAgent集成**: 使用Zypher框架调用Claude AI
- **RESTful API**: 提供日程计划生成服务
- **智能解析**: 自动提取和格式化AI响应
- **降级处理**: 当AI响应失败时提供基础计划

## 🔧 API端点

### `POST /api/generate-plan`

生成日程计划

**请求体:**
```json
{
  "userInput": "我需要完成一个报告，参加2个会议，去健身房"
}
```

**响应:**
```json
{
  "id": "plan-1234567890",
  "date": "2024-12-22",
  "title": "高效工作日计划",
  "summary": "平衡工作与健康的一天",
  "timeBlocks": [...],
  "totalTasks": 5,
  "estimatedProductiveHours": 6,
  "priorities": ["完成报告", "参加会议"],
  "notes": "建议在会议之间安排短暂休息",
  "createdAt": "2024-12-22T10:30:00Z"
}
```

### `GET /health`

健康检查

**响应:**
```json
{
  "status": "OK",
  "message": "Zypher Daily Planning Assistant is running"
}
```

## 🎯 使用示例

1. 打开浏览器访问 http://localhost:3000
2. 在右侧聊天框输入你的任务，例如：
   ```
   我需要完成一个presentation，参加2个会议，去健身房，还要做晚饭
   ```
3. 点击"Send"按钮
4. Claude AI通过Zypher Agent生成日程计划
5. 左侧面板显示详细的时间安排

## 🛠️ 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Lucide React (图标)
- Axios (HTTP请求)

### 后端
- Deno
- Zypher Agent
- Anthropic Claude AI (Sonnet 4)
- RxJS (事件流处理)

## 📝 开发说明

### 修改提示词

编辑 `server.ts` 中的 `taskPrompt` 变量来自定义AI生成日程的方式。

### 调整前端样式

所有组件都在 `deckspeed-template/src/components/` 目录中，使用Tailwind CSS类进行样式定制。

### 添加新功能

1. **前端**: 在 `deckspeed-template/src/` 添加新组件
2. **后端**: 在 `server.ts` 添加新的API端点
3. **类型**: 在 `deckspeed-template/src/types/Plan.ts` 更新TypeScript类型

## ⚠️ 常见问题

### 后端无法启动
- 检查是否安装了Deno
- 确认.env文件中有ANTHROPIC_API_KEY
- 检查端口3001是否被占用

### 前端无法连接后端
- 确保后端服务器在端口3001运行
- 检查浏览器控制台的CORS错误
- 验证package.json中的proxy配置

### AI生成的计划格式错误
- 查看后端控制台的日志
- 检查ZypherAgent返回的原始响应
- 如果持续失败，会自动使用降级方案

## 📚 相关文档

- [Zypher Agent文档](https://github.com/corespeed/zypher)
- [Deno文档](https://deno.land/manual)
- [React文档](https://react.dev/)
- [Anthropic API](https://docs.anthropic.com/)

## 🔄 工作流程

```
用户输入 → React前端 → POST /api/generate-plan 
    ↓
Zypher Agent → Claude AI → 生成JSON计划
    ↓
解析格式化 → 返回前端 → 显示日程计划
```

## 🎨 自定义配置

### 修改端口

**后端端口** (在 `server.ts`):
```typescript
const port = 3001; // 修改为你想要的端口
```

**前端代理** (在 `deckspeed-template/package.json`):
```json
"proxy": "http://localhost:3001"
```

### 更换AI模型

在 `server.ts` 中修改模型名称:
```typescript
const event$ = agent.runTask(taskPrompt, "claude-sonnet-4-20250514");
//                                        ↑ 修改模型名称
```

## 📄 许可证

MIT

## 👥 贡献

欢迎提交Issues和Pull Requests！

---

**祝你使用愉快！如有问题，请查看各子目录的README文件。**
