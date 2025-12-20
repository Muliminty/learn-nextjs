# App Router vs Pages Router

## 4.1 为什么使用 App Router？

Next.js 13+ 引入了 **App Router**，这是推荐的新架构：

- ✅ **更好的性能**：支持 React Server Components
- ✅ **更灵活的路由**：支持嵌套布局、并行路由等
- ✅ **更好的数据获取**：支持流式渲染、Suspense
- ✅ **更简洁的 API**：使用 `async/await` 在组件中获取数据

## 4.2 App Router vs Pages Router 对比

| 特性 | App Router | Pages Router |
|------|-----------|--------------|
| 文件位置 | `app/` 目录 | `pages/` 目录 |
| 路由文件 | `page.tsx` | `index.tsx` 或文件名 |
| 布局文件 | `layout.tsx` | `_app.tsx` |
| 数据获取 | 组件中直接 `async` | `getServerSideProps` 等 |
| 默认组件类型 | 服务端组件 | 客户端组件 |

## 4.3 文件系统路由工作原理

在 App Router 中，**文件夹结构 = 路由路径**：

```text
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── blog/
│   ├── page.tsx          → /blog
│   └── [id]/
│       └── page.tsx      → /blog/[id]
└── contact/
    └── page.tsx          → /contact
```

