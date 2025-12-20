# Next.js 简介与环境搭建

## 1.1 Next.js 是什么？

Next.js 是一个基于 React 的全栈框架，由 Vercel 开发。它提供了：

- **服务端渲染（SSR）**：在服务器上渲染 React 组件
- **静态站点生成（SSG）**：在构建时生成静态页面
- **API 路由**：无需单独的后端服务器，可以在 Next.js 中创建 API
- **文件系统路由**：基于文件结构自动创建路由
- **自动代码分割**：优化性能，只加载需要的代码
- **内置 CSS 支持**：支持 CSS Modules、Tailwind CSS 等

## 1.2 环境搭建

### 前置要求

- Node.js 18+
- npm、yarn 或 pnpm

### 创建 Next.js 项目

```bash
# 使用 create-next-app 创建项目
npx create-next-app@latest learn-nextjs

# 选择配置选项：
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - App Router: Yes
# - src/ directory: No（使用根目录的 app/）
# - import alias: @/*
```

### 启动开发服务器

```bash
cd learn-nextjs
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

