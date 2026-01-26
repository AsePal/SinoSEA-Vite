# SinoSEA-Vite 项目结构说明

## 📐 架构设计

本项目采用 **功能导向 (Feature-Based)** 的架构设计，按业务功能模块组织代码，而非按技术类型分类。

### 核心理念

- ✅ **高内聚低耦合** - 每个功能模块包含该功能的所有资源
- ✅ **清晰的分层** - app层（应用）、features层（业务）、shared层（共享）
- ✅ **统一导出** - 每个模块提供index.ts统一导出接口
- ✅ **便于维护** - 功能内聚，改动不影响其他模块
- ✅ **易于扩展** - 新增功能只需添加新feature目录

---

## 📂 目录结构

```
src/
├── 📱 app/                         # 应用核心层
│   ├── App.tsx                    # 路由配置
│   ├── main.tsx                   # 应用入口
│   ├── tailwind.config.js         # Tailwind配置
│   └── styles/                    # 全局样式
│       ├── index.css
│       └── App.css
│
├── 🎯 features/                    # 功能模块层（业务特性）
│   │
│   ├── auth/                      # 🔐 认证模块
│   │   ├── pages/                 # 页面组件
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ForgotPassword.tsx
│   │   ├── components/            # 私有组件
│   │   │   ├── LoginErrorModal.tsx
│   │   │   └── LoginBackground.tsx
│   │   ├── layouts/
│   │   │   └── AuthLayout.tsx
│   │   └── index.ts              # 统一导出
│   │
│   ├── chat/                      # 💬 聊天模块
│   │   ├── pages/
│   │   │   └── Chat.tsx
│   │   ├── components/
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopNav.tsx
│   │   ├── types/
│   │   │   └── chat.types.ts     # 聊天相关类型定义
│   │   └── index.ts
│   │
│   ├── landing/                   # 🏠 首页模块
│   │   ├── pages/
│   │   │   └── Landing.tsx
│   │   ├── components/
│   │   │   └── HomeBackground.tsx
│   │   └── index.ts
│   │
│   ├── about/                     # 👥 关于我们模块
│   │   ├── pages/
│   │   │   └── AboutUs.tsx
│   │   ├── components/
│   │   │   ├── AboutHeader.tsx
│   │   │   ├── AboutContent.tsx
│   │   │   └── AboutFooter.tsx
│   │   └── index.ts
│   │
│   ├── complaint/                 # 📬 投诉模块
│   │   ├── pages/
│   │   │   └── ComplaintPage.tsx
│   │   ├── components/
│   │   │   ├── ComplaintHeader.tsx
│   │   │   ├── ComplaintForm.tsx
│   │   │   └── ComplaintTopNav.tsx
│   │   ├── types/
│   │   │   └── complaint.types.ts
│   │   └── index.ts
│   │
│   ├── privacy/                   # 🔒 隐私政策模块
│   │   ├── pages/
│   │   │   └── PrivacyPolicy.tsx
│   │   ├── components/
│   │   │   ├── PolicyHeader.tsx
│   │   │   ├── PolicySection.tsx
│   │   │   ├── PolicyTable.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── BackSection.tsx
│   │   ├── data/
│   │   │   └── policyContent.tsx
│   │   └── index.ts
│   │
│   └── terms/                     # ⚖️ 使用条款模块
│       ├── pages/
│       │   └── TermsOfUse.tsx
│       └── index.ts
│
├── 🔧 shared/                      # 共享资源层
│   ├── components/                # 通用UI组件
│   │   ├── modals/               # 弹窗组件
│   │   │   ├── LogoutConfirmModal.tsx
│   │   │   ├── SuccessToastModal.tsx
│   │   │   └── AvatarEditorModal.tsx
│   │   ├── menus/                # 菜单组件
│   │   │   └── UserAvatarMenu.tsx
│   │   └── index.ts              # 统一导出
│   │
│   ├── api/                       # API层
│   │   ├── config.ts             # API端点配置
│   │   ├── chatSSE.ts            # SSE流处理
│   │   └── index.ts
│   │
│   ├── utils/                     # 工具函数
│   │   ├── jwt.ts                # JWT处理
│   │   ├── env.ts                # 环境变量
│   │   └── index.ts
│   │
│   ├── types/                     # 通用类型
│   │   ├── user.types.ts
│   │   └── index.ts
│   │
│   ├── hooks/                     # 自定义Hooks
│   │   └── index.ts
│   │
│   ├── constants/                 # 常量配置
│   │   └── index.ts
│   │
│   └── data/                      # 静态数据
│       └── projectIntro.ts
│
└── 📦 assets/                      # 静态资源
    └── images/
```

---

## 🎯 模块说明

### App 层 (应用核心)

- **职责**: 应用入口、路由配置、全局样式
- **文件**: `main.tsx`, `App.tsx`, `styles/`

### Features 层 (功能模块)

每个 feature 是一个独立的业务功能模块，包含：

- `pages/` - 页面级组件
- `components/` - 该功能的私有组件
- `types/` - 该功能的类型定义
- `data/` - 该功能的静态数据
- `index.ts` - 统一导出

| 模块      | 说明                           | 路由                                      |
| --------- | ------------------------------ | ----------------------------------------- |
| auth      | 用户认证（登录/注册/密码重置） | `/login`, `/register`, `/forgot-password` |
| chat      | AI聊天主功能                   | `/chat`                                   |
| landing   | 首页引导                       | `/`                                       |
| about     | 关于我们                       | `/about`                                  |
| complaint | 投诉反馈                       | `/complaint`                              |
| privacy   | 隐私政策                       | `/privacy`                                |
| terms     | 使用条款                       | `/terms`                                  |

### Shared 层 (共享资源)

- **components** - 跨模块复用的UI组件（模态框、菜单等）
- **api** - API配置和网络请求封装
- **utils** - 通用工具函数
- **types** - 通用TypeScript类型
- **hooks** - 自定义React Hooks
- **constants** - 全局常量
- **data** - 共享静态数据

---

## 📝 使用规范

### 1. 导入规范

#### ✅ 推荐：使用统一导出

```typescript
// 从feature导入
import { Login, Register, AuthLayout } from '@/features/auth';

// 从shared导入
import { LogoutConfirmModal, UserAvatarMenu } from '@/shared/components';
import { parseJwt } from '@/shared/utils';
import type { UserInfo } from '@/shared/types';
```

#### ❌ 避免：直接导入内部文件

```typescript
// 不推荐
import Login from '@/features/auth/pages/Login';
```

### 2. 添加新功能

创建新功能模块时：

```bash
# 1. 创建目录结构
mkdir -p src/features/new-feature/{pages,components,types}

# 2. 创建index.ts导出文件
echo "export { default as NewFeature } from './pages/NewFeature';" > src/features/new-feature/index.ts

# 3. 在App.tsx中添加路由
# 4. 在相应页面导入使用
```

### 3. 添加共享组件

```bash
# 1. 创建组件
src/shared/components/[category]/NewComponent.tsx

# 2. 在shared/components/index.ts中导出
export { default as NewComponent } from './[category]/NewComponent';
```

---

## 🔍 技术栈

| 类别     | 技术           | 版本    |
| -------- | -------------- | ------- |
| 框架     | React          | 19.2.0  |
| 语言     | TypeScript     | 5.9.3   |
| 路由     | React Router   | 7.12.0  |
| 构建     | Vite           | 7.2.4   |
| 样式     | Tailwind CSS   | 4.1.18  |
| 动画     | Framer Motion  | 12.29.0 |
| HTTP     | Axios          | 1.13.2  |
| 图标     | Heroicons      | 2.2.0   |
| Markdown | React Markdown | 10.1.0  |

---

## 🚀 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 类型检查 + 构建
pnpm build

# 预览构建产物
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

---

## 📖 相关链接

- [React 文档](https://react.dev/)
- [Vite 文档](https://vitejs.dev/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [TypeScript 文档](https://www.typescriptlang.org/)

---

## 📋 重构记录

**重构日期**: 2026年1月26日

**主要变更**:

1. ✅ 从技术分类架构迁移到功能导向架构
2. ✅ 统一模块导出接口 (index.ts)
3. ✅ 分离app层、features层、shared层
4. ✅ 重组类型定义到对应模块
5. ✅ 优化导入路径结构

**收益**:

- 代码组织更清晰，易于定位
- 模块职责更明确，降低耦合
- 新功能开发更快速
- 团队协作效率提升
