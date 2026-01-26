# 🌊 SinoSEA-Vite

> 基于 React + TypeScript + Vite 构建的现代化 AI 聊天应用

[![React](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.18-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## 📖 项目简介

SinoSEA-Vite 是一个功能完整的 AI 聊天应用前端项目，采用最新的 Web 技术栈构建。项目基于**功能导向架构 (Feature-Based Architecture)**，提供清晰的代码组织和优秀的开发体验。

### ✨ 核心特性

- 🤖 **AI 聊天** - 实时对话，支持 SSE 流式传输
- 🔐 **用户认证** - 完整的注册/登录/密码重置流程
- 👤 **个人中心** - 头像编辑、用户信息管理
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎨 **精美动画** - Framer Motion 驱动的流畅交互
- 📝 **Markdown 支持** - 消息内容支持富文本渲染
- 🌐 **多页面应用** - 关于我们、隐私政策、投诉反馈等
- ⚡ **快速构建** - Vite + SWC 提供极速开发体验

## 🏗️ 技术栈

### 核心框架

- **React 19.2.0** - 用户界面库
- **TypeScript 5.9.3** - 类型安全的 JavaScript 超集
- **Vite 7.2.4** - 下一代前端构建工具

### UI & 样式

- **Tailwind CSS 4.1.18** - 实用优先的 CSS 框架
- **Framer Motion 12.29.0** - 生产级动画库
- **Heroicons 2.2.0** - 精美的 SVG 图标集

### 路由 & 状态

- **React Router DOM 7.12.0** - 声明式路由管理

### 网络请求

- **Axios 1.13.2** - Promise 基础的 HTTP 客户端
- **SSE (Server-Sent Events)** - 实时消息流传输

### 内容渲染

- **React Markdown 10.1.0** - Markdown 渲染组件
- **remark-gfm 4.0.1** - GitHub Flavored Markdown 支持

### 开发工具

- **ESLint 9.39.1** - 代码质量检查
- **Prettier 3.7.4** - 代码格式化工具
- **TypeScript ESLint** - TypeScript 语法检查

## 📂 项目结构

采用**功能导向架构**，代码按业务功能组织：

```
src/
├── app/                    # 应用核心层
│   ├── App.tsx            # 路由配置
│   ├── main.tsx           # 应用入口
│   └── styles/            # 全局样式
│
├── features/               # 功能模块层
│   ├── auth/              # 🔐 认证模块
│   ├── chat/              # 💬 聊天模块
│   ├── landing/           # 🏠 首页模块
│   ├── about/             # 👥 关于我们
│   ├── complaint/         # 📬 投诉反馈
│   ├── privacy/           # 🔒 隐私政策
│   └── terms/             # ⚖️ 使用条款
│
└── shared/                 # 共享资源层
    ├── api/               # API 配置
    ├── components/        # 通用组件
    ├── utils/             # 工具函数
    ├── types/             # 类型定义
    └── hooks/             # 自定义 Hooks
```

> 📘 详细的项目结构说明请查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## 🚀 快速开始

### 环境要求

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
# 类型检查 + 构建
pnpm build

# 预览构建产物
pnpm preview
```

### 代码质量

```bash
# 运行 ESLint 检查
pnpm lint

# 自动格式化代码
pnpm format
```

## 📱 功能模块

### 🔐 认证系统

- 用户登录 (`/login`)
- 用户注册 (`/register`)
- 密码重置 (`/forgot-password`)
- JWT Token 认证
- 记住登录状态

### 💬 AI 聊天

- 实时对话交互
- SSE 流式消息推送
- Markdown 消息渲染
- 代码高亮显示
- 消息复制功能
- 对话历史管理

### 👤 个人中心

- 用户信息展示
- 头像上传编辑
- 昵称修改
- 退出登录确认

### 📄 信息页面

- 关于我们 (`/about`)
- 隐私政策 (`/privacy`)
- 使用条款 (`/terms`)
- 投诉反馈 (`/complaint`)

## 🔧 环境变量

创建 `.env` 文件配置环境变量：

```env
# API 基础地址
VITE_API_BASE=https://api.sionsea-ai.cn
```

## 📦 构建配置

### Vite 配置

项目使用 Vite 作为构建工具，配置文件位于 `vite.config.ts`：

- ⚡ SWC 编译器 - 更快的开发体验
- 🎨 Tailwind CSS 集成
- 🔄 热模块替换 (HMR)

### TypeScript 配置

- `tsconfig.json` - 项目配置
- `tsconfig.app.json` - 应用代码配置
- `tsconfig.node.json` - Node 环境配置

## 🎨 样式系统

使用 **Tailwind CSS 4.x** 实用优先的 CSS 框架：

- 📱 响应式设计系统
- 🎨 自定义设计令牌
- 🌙 暗色模式支持（可扩展）
- ⚡ JIT 编译模式

## 🔌 API 集成

### API 端点配置

位于 `src/shared/api/config.ts`：

```typescript
const API = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
  },
  user: {
    info: '/user/info',
    update: '/user/update',
  },
  chat: {
    send: '/chat/send',
    history: '/chat/history',
    stream: '/chat/stream',
  },
};
```

### SSE 流式传输

支持实时消息推送，配置位于 `src/shared/api/chatSSE.ts`。

## 🧪 开发指南

### 添加新功能模块

```bash
# 1. 创建目录结构
mkdir -p src/features/new-feature/{pages,components,types}

# 2. 创建页面组件
touch src/features/new-feature/pages/NewFeature.tsx

# 3. 创建导出文件
echo "export { default as NewFeature } from './pages/NewFeature';" > src/features/new-feature/index.ts

# 4. 在 App.tsx 中添加路由
```

### 添加共享组件

```typescript
// 1. 创建组件
// src/shared/components/NewComponent.tsx

// 2. 导出组件
// src/shared/components/index.ts
export { default as NewComponent } from './NewComponent';

// 3. 使用组件
import { NewComponent } from '@/shared/components';
```

### 代码规范

项目使用 ESLint + Prettier 保证代码质量：

- 提交前自动格式化
- 遵循 React Hooks 规则
- TypeScript 严格模式
- 统一的代码风格

## 📊 性能优化

- ⚡ **代码分割** - 按路由自动分割
- 🎯 **懒加载** - 组件按需加载
- 🗜️ **资源压缩** - Gzip 压缩
- 📦 **Tree Shaking** - 移除未使用代码
- 🖼️ **图片优化** - AVIF/WebP 格式

## 🐛 故障排除

### 常见问题

**1. 端口已被占用**

```bash
# 修改 vite.config.ts 中的端口
server: {
  port: 3000
}
```

**2. 依赖安装失败**

```bash
# 清理缓存重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**3. 构建错误**

```bash
# 检查 TypeScript 类型错误
pnpm tsc --noEmit
```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 提交规范

使用语义化提交信息：

- `feat:` 新功能
- `fix:` 修复 Bug
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具链更新

## 📄 许可证

本项目为私有项目

## 📮 联系方式

- 项目主页: [GitHub Repository](https://github.com/your-org/sinosea-vite)
- 问题反馈: [Issues](https://github.com/your-org/sinosea-vite/issues)
- 官方网站: [https://www.sionsea-ai.cn](https://www.sionsea-ai.cn)

## 🙏 致谢

感谢以下开源项目：

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Heroicons](https://heroicons.com/)

---

<div align="center">
Made with ❤️ by SinoSEA Team
</div>
