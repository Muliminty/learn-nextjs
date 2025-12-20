# Layout 和 Page 详细讲解

## 📋 目录

1. [Layout（布局）详解](#1-layout布局详解)
2. [Page（页面）详解](#2-page页面详解)
3. [Layout 和 Page 的区别](#3-layout-和-page-的区别)
4. [嵌套布局的工作原理](#4-嵌套布局的工作原理)
5. [每个路由文件夹的 Layout 和 Page](#5-每个路由文件夹的-layout-和-page)
6. [实际应用示例](#6-实际应用示例)
7. [Layout 和 Page 之间的通信](#7-layout-和-page-之间的通信)
8. [最佳实践](#8-最佳实践)

---

## 1. Layout（布局）详解

### 1.1 什么是 Layout？

**`layout.tsx`** 是 Next.js App Router 中的特殊文件，用于定义页面的共享布局结构。它会在多个页面之间共享，并且在路由切换时**不会重新渲染**。

### 1.2 Layout 的基本结构

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header>导航栏</header>
        <main>{children}</main>
        <footer>页脚</footer>
      </body>
    </html>
  )
}
```

### 1.3 Layout 的关键特点

#### ✅ 特点 1：不会重新渲染

- 当用户在页面间导航时，Layout 组件**不会重新渲染**
- 这意味着 Layout 中的状态会保留
- 适合放置导航栏、侧边栏等需要保持状态的组件

```typescript
// app/layout.tsx
'use client'  // 如果需要使用状态

import { useState } from 'react'

export default function RootLayout({ children }) {
  const [count, setCount] = useState(0)
  
  // 这个 count 在路由切换时不会重置
  return (
    <html>
      <body>
        <nav>导航栏 - 计数: {count}</nav>
        <main>{children}</main>
      </body>
    </html>
  )
}
```

#### ✅ 特点 2：可以嵌套

- 每个路由段都可以有自己的 `layout.tsx`
- 子路由的 Layout 会嵌套在父路由的 Layout 内
- 可以创建多层嵌套的布局结构

#### ✅ 特点 3：必须包含 `children`

- Layout 组件**必须**接收并渲染 `children` prop
- `children` 是当前路由的 Page 组件内容

#### ✅ 特点 4：可以共享状态和样式

- Layout 中的样式会影响所有子页面
- 可以在 Layout 中设置全局样式、字体、主题等

### 1.4 根 Layout 的特殊要求

**`app/layout.tsx`** 是根布局，有特殊要求：

1. **必须存在**：每个 Next.js App Router 应用都必须有根 Layout
2. **必须包含 `<html>` 和 `<body>` 标签**
3. **不能使用路由组**：根 Layout 必须在 `app/` 目录下，不能在路由组内

```typescript
// app/layout.tsx - 根布局
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
      </body>
    </html>
  )
}
```

---

## 2. Page（页面）详解

### 2.1 什么是 Page？

**`page.tsx`** 是 Next.js App Router 中的特殊文件，用于定义页面的具体内容。每个路由必须有一个 `page.tsx` 文件。

### 2.2 Page 的基本结构

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>首页</h1>
      <p>这是首页内容</p>
    </div>
  )
}
```

### 2.3 Page 的关键特点

#### ✅ 特点 1：每个路由必须有一个 Page

- 没有 `page.tsx` 的文件夹不会创建路由
- 每个路由段只能有一个 `page.tsx`

```text
app/
├── page.tsx              ✅ 路由：/
├── about/
│   └── page.tsx          ✅ 路由：/about
└── blog/
    └── page.tsx          ✅ 路由：/blog
```

#### ✅ 特点 2：可以获取数据

- Page 组件可以是 `async` 函数
- 可以直接在组件中使用 `await` 获取数据

```typescript
// app/blog/page.tsx
export default async function BlogPage() {
  // 在服务端获取数据
  const res = await fetch('https://api.example.com/posts')
  const posts = await res.json()
  
  return (
    <div>
      <h1>博客列表</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

#### ✅ 特点 3：路由切换时会重新渲染

- 当用户导航到新页面时，Page 组件会重新渲染
- 适合放置页面特定的内容和数据

#### ✅ 特点 4：不需要包含 `<html>` 和 `<body>`

- Page 组件只需要返回页面内容
- HTML 结构由 Layout 提供

### 2.4 Page 的数据获取

Page 组件可以直接使用 `async/await` 获取数据：

```typescript
// app/blog/[id]/page.tsx
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

---

## 3. Layout 和 Page 的区别

### 3.1 核心区别对比表

| 特性 | Layout | Page |
|------|--------|------|
| **文件命名** | `layout.tsx` | `page.tsx` |
| **是否必须** | 根 Layout 必须 | 每个路由必须 |
| **重新渲染** | ❌ 路由切换时不重新渲染 | ✅ 路由切换时重新渲染 |
| **嵌套行为** | ✅ 会嵌套（子 Layout 在父 Layout 内） | ❌ 不会嵌套 |
| **children prop** | ✅ 必须接收 `children` | ❌ 不需要 |
| **HTML 结构** | 根 Layout 需要 `<html><body>` | 只需要内容 |
| **数据获取** | ✅ 可以（async） | ✅ 可以（async） |
| **用途** | 共享的布局结构 | 页面的具体内容 |

### 3.2 渲染时机对比

```typescript
// 用户从 /about 导航到 /contact

// Layout：不会重新渲染
// - 导航栏保持原样
// - 侧边栏保持原样
// - 状态不会丢失

// Page：会重新渲染
// - /about 的 Page 组件卸载
// - /contact 的 Page 组件挂载
// - 重新获取数据（如果需要）
```

### 3.3 使用场景对比

**使用 Layout 的场景：**
- 导航栏、页脚
- 侧边栏
- 主题切换器
- 用户信息显示
- 需要保持状态的组件

**使用 Page 的场景：**
- 页面特定的内容
- 需要根据路由变化的内容
- 数据获取和显示
- 表单、列表等页面内容

---

## 4. 嵌套布局的工作原理

### 4.1 嵌套布局的概念

在 Next.js App Router 中，每个路由段都可以有自己的 `layout.tsx`，这些 Layout 会**嵌套**在一起，形成多层布局结构。

### 4.2 嵌套布局的文件结构

```text
app/
├── layout.tsx              # 根布局（Level 1）
├── page.tsx                # 首页
├── about/
│   ├── layout.tsx          # About 布局（Level 2）
│   ├── page.tsx            # /about
│   └── team/
│       ├── layout.tsx      # Team 布局（Level 3）
│       └── page.tsx        # /about/team
└── dashboard/
    ├── layout.tsx          # Dashboard 布局（Level 2）
    ├── page.tsx            # /dashboard
    └── settings/
        └── page.tsx        # /dashboard/settings
```

### 4.3 嵌套布局的渲染顺序

当访问 `/about/team` 时，Layout 的嵌套顺序是：

```typescript
// 渲染顺序（从外到内）：
<RootLayout>              // app/layout.tsx
  <AboutLayout>           // app/about/layout.tsx
    <TeamLayout>          // app/about/team/layout.tsx
      <TeamPage />        // app/about/team/page.tsx
    </TeamLayout>
  </AboutLayout>
</RootLayout>
```

### 4.4 嵌套布局的代码示例

#### 根布局

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="site-header">
          <nav>网站导航栏</nav>
        </header>
        <main className="site-main">
          {children}
        </main>
        <footer className="site-footer">
          <p>网站页脚</p>
        </footer>
      </body>
    </html>
  )
}
```

#### About 布局

```typescript
// app/about/layout.tsx
export default function AboutLayout({ children }) {
  return (
    <div className="about-layout">
      <aside className="about-sidebar">
        <nav>
          <a href="/about">关于我们</a>
          <a href="/about/team">团队</a>
          <a href="/about/history">历史</a>
        </nav>
      </aside>
      <div className="about-content">
        {children}
      </div>
    </div>
  )
}
```

#### Team 布局

```typescript
// app/about/team/layout.tsx
export default function TeamLayout({ children }) {
  return (
    <div className="team-layout">
      <h2>团队页面</h2>
      <div className="team-content">
        {children}
      </div>
    </div>
  )
}
```

#### Team 页面

```typescript
// app/about/team/page.tsx
export default function TeamPage() {
  return (
    <div>
      <h3>团队成员</h3>
      <ul>
        <li>张三</li>
        <li>李四</li>
        <li>王五</li>
      </ul>
    </div>
  )
}
```

### 4.5 最终渲染的 HTML 结构

访问 `/about/team` 时，最终渲染的 HTML：

```html
<html lang="zh-CN">
  <body>
    <header class="site-header">
      <nav>网站导航栏</nav>
    </header>
    <main class="site-main">
      <div class="about-layout">
        <aside class="about-sidebar">
          <nav>
            <a href="/about">关于我们</a>
            <a href="/about/team">团队</a>
            <a href="/about/history">历史</a>
          </nav>
        </aside>
        <div class="about-content">
          <div class="team-layout">
            <h2>团队页面</h2>
            <div class="team-content">
              <div>
                <h3>团队成员</h3>
                <ul>
                  <li>张三</li>
                  <li>李四</li>
                  <li>王五</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="site-footer">
      <p>网站页脚</p>
    </footer>
  </body>
</html>
```

---

## 5. 每个路由文件夹的 Layout 和 Page

### 5.1 核心规则

**是的，每个路由文件夹都可以有自己的 `page.tsx` 和 `layout.tsx`！**

### 5.2 规则说明

#### ✅ Page 规则

- 每个路由文件夹**可以**有自己的 `page.tsx`
- 有 `page.tsx` 的文件夹会创建对应的路由
- 没有 `page.tsx` 的文件夹不会创建路由（但可以有 layout）

```text
app/
├── page.tsx              ✅ 路由：/
├── about/
│   └── page.tsx          ✅ 路由：/about
├── blog/
│   ├── page.tsx          ✅ 路由：/blog
│   └── [id]/
│       └── page.tsx      ✅ 路由：/blog/[id]
└── admin/                ❌ 没有 page.tsx，不创建路由
    └── layout.tsx        ✅ 但可以有 layout（用于子路由）
```

#### ✅ Layout 规则

- 每个路由文件夹**可以**有自己的 `layout.tsx`
- Layout 是可选的，如果没有就使用父级的 Layout
- Layout 会嵌套：子路由的 Layout 包裹在父路由的 Layout 内

```text
app/
├── layout.tsx            ✅ 根布局（必须）
├── about/
│   ├── layout.tsx        ✅ About 布局（可选）
│   └── page.tsx
└── dashboard/
    ├── layout.tsx        ✅ Dashboard 布局（可选）
    └── settings/
        └── page.tsx      ✅ 使用 Dashboard 的 layout
```

### 5.3 实际示例

#### 示例 1：简单的嵌套

```text
app/
├── layout.tsx                    # 根布局
├── page.tsx                      # 首页 /
└── dashboard/
    ├── layout.tsx                # Dashboard 布局
    ├── page.tsx                  # /dashboard
    └── settings/
        └── page.tsx              # /dashboard/settings
```

**访问 `/dashboard/settings` 时的布局嵌套：**

```typescript
<RootLayout>              // app/layout.tsx
  <DashboardLayout>       // app/dashboard/layout.tsx
    <SettingsPage />      // app/dashboard/settings/page.tsx
  </DashboardLayout>
</RootLayout>
```

#### 示例 2：多层嵌套

```text
app/
├── layout.tsx
├── about/
│   ├── layout.tsx
│   ├── page.tsx
│   └── team/
│       ├── layout.tsx
│       └── page.tsx
```

**访问 `/about/team` 时的布局嵌套：**

```typescript
<RootLayout>              // app/layout.tsx
  <AboutLayout>           // app/about/layout.tsx
    <TeamLayout>          // app/about/team/layout.tsx
      <TeamPage />        // app/about/team/page.tsx
    </TeamLayout>
  </AboutLayout>
</RootLayout>
```

#### 示例 3：部分路由有 Layout

```text
app/
├── layout.tsx
├── page.tsx
├── about/
│   └── page.tsx          # 没有自己的 layout，使用根 layout
└── dashboard/
    ├── layout.tsx        # 有自己的 layout
    └── page.tsx
```

**访问 `/about` 时：**

```typescript
<RootLayout>              // app/layout.tsx
  <AboutPage />          // app/about/page.tsx
</RootLayout>
```

**访问 `/dashboard` 时：**

```typescript
<RootLayout>              // app/layout.tsx
  <DashboardLayout>       // app/dashboard/layout.tsx
    <DashboardPage />     // app/dashboard/page.tsx
  </DashboardLayout>
</RootLayout>
```

---

## 6. 实际应用示例

### 6.1 示例：博客网站

```text
app/
├── layout.tsx                    # 根布局：网站导航、页脚
├── page.tsx                      # 首页：博客列表
├── blog/
│   ├── layout.tsx                # 博客布局：博客侧边栏
│   ├── page.tsx                  # 博客列表页
│   └── [slug]/
│       └── page.tsx              # 博客详情页
└── admin/
    ├── layout.tsx                # 管理后台布局：管理导航
    ├── page.tsx                  # 管理后台首页
    └── posts/
        └── page.tsx              # 文章管理页
```

### 6.2 示例：电商网站

```text
app/
├── layout.tsx                    # 根布局：顶部导航、购物车
├── page.tsx                      # 首页
├── (shop)/                       # 路由组：商店页面
│   ├── layout.tsx                # 商店布局：分类导航
│   ├── products/
│   │   └── page.tsx
│   └── cart/
│       └── page.tsx
└── (dashboard)/                  # 路由组：用户中心
    ├── layout.tsx                # 用户中心布局：用户菜单
    ├── orders/
    │   └── page.tsx
    └── profile/
        └── page.tsx
```

### 6.3 完整代码示例

#### 根布局

```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '我的网站',
  description: '这是一个 Next.js 学习项目',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="bg-blue-500 text-white p-4">
          <nav>
            <a href="/" className="mr-4">首页</a>
            <a href="/about" className="mr-4">关于</a>
            <a href="/dashboard">仪表板</a>
          </nav>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 text-center">
          <p>&copy; 2024 我的网站</p>
        </footer>
      </body>
    </html>
  )
}
```

#### Dashboard 布局

```typescript
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 p-4">
        <h2 className="font-bold mb-4">仪表板</h2>
        <nav className="space-y-2">
          <a href="/dashboard" className="block">概览</a>
          <a href="/dashboard/settings" className="block">设置</a>
          <a href="/dashboard/profile" className="block">个人资料</a>
        </nav>
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  )
}
```

#### Dashboard 页面

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">仪表板概览</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3>总用户数</h3>
          <p className="text-2xl">1,234</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>总订单数</h3>
          <p className="text-2xl">5,678</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3>总收入</h3>
          <p className="text-2xl">¥12,345</p>
        </div>
      </div>
    </div>
  )
}
```

#### Settings 页面

```typescript
// app/dashboard/settings/page.tsx
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">设置</h1>
      <form className="space-y-4">
        <div>
          <label>用户名</label>
          <input type="text" className="border p-2 w-full" />
        </div>
        <div>
          <label>邮箱</label>
          <input type="email" className="border p-2 w-full" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          保存
        </button>
      </form>
    </div>
  )
}
```

---

## 7. Layout 和 Page 之间的通信

### 7.1 通信的核心概念

在 Next.js App Router 中，Layout 和 Page 之间的通信是一个重要话题，特别是当同一个 Layout 下的多个 Page 需要共享状态时。

**核心特点**：
- Layout 在路由切换时**不会重新渲染**，可以保持状态
- Page 在路由切换时会**重新渲染**
- 同一 Layout 下的多个 Page 可以通过 Layout 作为中间层共享状态

### 7.2 方法 1：通过 Context API（推荐）

这是最常用的方法，Layout 作为状态容器，通过 Context 向下传递状态和更新函数。

#### 完整示例

```typescript
// app/dashboard/layout.tsx
'use client'

import { useState, createContext, useContext } from 'react'

// 定义 Context 类型
interface DashboardContextType {
  count: number
  setCount: (count: number) => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

// 创建 Context
const DashboardContext = createContext<DashboardContextType | null>(null)

// 导出 Hook 供 Page 使用
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardLayout')
  }
  return context
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  return (
    <DashboardContext.Provider value={{ count, setCount, theme, setTheme }}>
      <div className={`flex ${theme === 'dark' ? 'dark' : ''}`}>
        <aside className="w-64 bg-gray-100 p-4">
          <h2>Dashboard</h2>
          <p>共享计数: {count}</p>
          <p>主题: {theme}</p>
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </DashboardContext.Provider>
  )
}
```

```typescript
// app/dashboard/page.tsx
'use client'

import { useDashboard } from '../layout'

export default function DashboardPage() {
  const { count, setCount, theme } = useDashboard()

  return (
    <div>
      <h1>Dashboard 首页</h1>
      <p>当前计数: {count}</p>
      <p>当前主题: {theme}</p>
      <button onClick={() => setCount(count + 1)}>增加计数</button>
    </div>
  )
}
```

```typescript
// app/dashboard/settings/page.tsx
'use client'

import { useDashboard } from '../layout'

export default function SettingsPage() {
  const { count, setCount, theme, setTheme } = useDashboard()

  return (
    <div>
      <h1>设置页面</h1>
      <p>当前计数: {count}</p>
      <p>当前主题: {theme}</p>
      <button onClick={() => setCount(count - 1)}>减少计数</button>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        切换主题
      </button>
    </div>
  )
}
```

**工作原理**：
1. Layout 维护共享状态（`count`、`theme`）
2. 通过 Context.Provider 向下传递状态和更新函数
3. 两个 Page 通过 `useDashboard()` Hook 访问和修改共享状态
4. 当在 Settings 页面修改状态时，Dashboard 页面也会看到更新（因为 Layout 不会重新渲染，状态会保留）

### 7.3 方法 2：使用 URL 参数/查询参数

通过 URL 传递数据，适合简单的状态共享，并且状态需要可分享。

```typescript
// app/dashboard/layout.tsx
'use client'

import { useSearchParams, useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const theme = searchParams.get('theme') || 'light'

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <nav>
        <button onClick={() => router.push('/dashboard?theme=light')}>
          浅色主题
        </button>
        <button onClick={() => router.push('/dashboard?theme=dark')}>
          深色主题
        </button>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

```typescript
// app/dashboard/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const theme = searchParams.get('theme') || 'light'

  return (
    <div>
      <h1>Dashboard 首页</h1>
      <p>当前主题: {theme}</p>
    </div>
  )
}
```

```typescript
// app/dashboard/settings/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const theme = searchParams.get('theme') || 'light'

  return (
    <div>
      <h1>设置页面</h1>
      <p>当前主题: {theme}</p>
    </div>
  )
}
```

**优点**：
- 状态可以分享（通过 URL）
- SEO 友好
- 简单直接

**缺点**：
- 状态暴露在 URL 中
- 只适合简单的字符串状态
- 需要手动管理 URL 参数

### 7.4 方法 3：使用全局状态管理库（Zustand）

适合复杂的状态管理，多个 Layout 和 Page 都需要访问的状态。

#### 安装 Zustand

```bash
npm install zustand
```

#### 创建 Store

```typescript
// app/lib/store.ts
'use client'

import { create } from 'zustand'

interface DashboardStore {
  count: number
  theme: 'light' | 'dark'
  increment: () => void
  decrement: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  count: 0,
  theme: 'light',
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  setTheme: (theme) => set({ theme }),
}))
```

#### 在 Layout 中使用

```typescript
// app/dashboard/layout.tsx
'use client'

import { useDashboardStore } from '@/app/lib/store'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { theme } = useDashboardStore()

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <aside>
        <p>主题: {theme}</p>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

#### 在 Page 中使用

```typescript
// app/dashboard/page.tsx
'use client'

import { useDashboardStore } from '@/app/lib/store'

export default function DashboardPage() {
  const { count, increment } = useDashboardStore()

  return (
    <div>
      <h1>Dashboard 首页</h1>
      <p>计数: {count}</p>
      <button onClick={increment}>增加</button>
    </div>
  )
}
```

```typescript
// app/dashboard/settings/page.tsx
'use client'

import { useDashboardStore } from '@/app/lib/store'

export default function SettingsPage() {
  const { count, decrement, setTheme } = useDashboardStore()

  return (
    <div>
      <h1>设置页面</h1>
      <p>计数: {count}</p>
      <button onClick={decrement}>减少</button>
      <button onClick={() => setTheme('dark')}>深色主题</button>
    </div>
  )
}
```

**优点**：
- 功能强大，易于扩展
- 可以在任何组件中使用
- 支持中间件、持久化等高级功能

**缺点**：
- 需要额外依赖
- 对于简单场景可能过于复杂

### 7.5 方法 4：通过 Props 传递（服务端组件）

如果 Layout 和 Page 都是服务端组件，可以通过 props 传递数据，但这种方式主要用于服务端数据传递。

```typescript
// app/dashboard/layout.tsx
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 在 Layout 中获取共享数据
  const user = await getUser()
  const stats = await getStats()

  return (
    <div>
      <aside>
        <p>用户: {user.name}</p>
        <p>总统计: {stats.total}</p>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Page 也可以获取自己的数据
  const pageStats = await getPageStats()

  return (
    <div>
      <h1>Dashboard</h1>
      <p>页面统计: {pageStats.total}</p>
    </div>
  )
}
```

**注意**：服务端组件之间不能直接传递客户端状态，需要通过 Context 或状态管理库。

### 7.6 方法对比表

| 方法 | 适用场景 | 优点 | 缺点 |
|------|---------|------|------|
| **Context API** | 中等复杂度状态，同一 Layout 下的 Page 共享 | 原生支持，无需额外依赖，类型安全 | 需要手动管理 Context，可能产生 Provider 嵌套 |
| **URL 参数** | 简单状态，需要可分享 | 可分享链接，SEO 友好，浏览器前进后退支持 | 状态暴露在 URL，类型限制，只适合简单数据 |
| **状态管理库** | 复杂状态，多个 Layout 和 Page 共享 | 功能强大，易于扩展，支持中间件 | 需要额外依赖，学习曲线，可能过度设计 |
| **Props 传递** | 服务端数据传递 | 简单直接，类型安全 | 只适用于服务端组件，不能传递客户端状态 |

### 7.7 实际应用示例：购物车状态共享

这是一个完整的购物车示例，展示如何在多个页面之间共享购物车状态。

```typescript
// app/shop/layout.tsx
'use client'

import { createContext, useContext, useState } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within ShopLayout')
  }
  return context
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        )
      }
      return [...prev, item]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      <div>
        <header className="bg-blue-500 text-white p-4">
          <nav className="flex justify-between items-center">
            <a href="/shop" className="text-xl font-bold">
              商店
            </a>
            <a href="/shop/cart" className="relative">
              购物车
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </a>
          </nav>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </CartContext.Provider>
  )
}
```

```typescript
// app/shop/page.tsx
'use client'

import { useCart } from '../layout'

export default function ShopPage() {
  const { addItem } = useCart()

  const products = [
    { id: '1', name: '商品 1', price: 100 },
    { id: '2', name: '商品 2', price: 200 },
    { id: '3', name: '商品 3', price: 300 },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">商品列表</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded">
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-gray-600">¥{product.price}</p>
            <button
              onClick={() =>
                addItem({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                })
              }
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              添加到购物车
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
```

```typescript
// app/shop/cart/page.tsx
'use client'

import { useCart } from '../layout'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">购物车</h1>
      {items.length === 0 ? (
        <p>购物车是空的</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border p-4 rounded">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-gray-600">¥{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-gray-200 px-2 py-1 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded ml-4"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-bold">总计: ¥{total}</span>
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                清空购物车
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
```

### 7.8 选择通信方法的建议

#### 简单状态（1-2 个状态值）

- ✅ 使用 Context API
- ✅ 或使用 URL 参数（如果需要可分享）

#### 中等复杂度状态（3-5 个状态值，需要类型安全）

- ✅ 使用 Context API（推荐）
- ✅ 或使用 Zustand（如果需要持久化）

#### 复杂状态（多个状态，需要中间件、持久化等）

- ✅ 使用 Zustand 或 Redux
- ✅ 考虑使用 React Query（如果是服务端状态）

#### 服务端数据传递

- ✅ 在 Layout 和 Page 中分别获取
- ✅ 使用 Server Components

### 7.9 注意事项

1. **Layout 必须是客户端组件**：如果要在 Layout 中使用状态，必须添加 `'use client'`
2. **Context 的作用域**：Context 只对 Layout 下的子组件有效
3. **性能考虑**：避免在 Layout 中存储大量状态，可能导致不必要的重渲染
4. **类型安全**：使用 TypeScript 确保类型安全

---

## 8. 最佳实践

### 8.1 何时使用嵌套 Layout

#### ✅ 推荐使用嵌套 Layout 的场景

1. **不同功能模块需要不同的布局**

   ```text
   app/
   ├── (marketing)/        # 营销页面：导航栏 + 页脚
   │   └── layout.tsx
   └── dashboard/          # 仪表板：侧边栏 + 顶部栏
       └── layout.tsx
   ```

2. **需要为特定路由段添加共享 UI**

   ```text
   app/
   └── blog/
       ├── layout.tsx       # 博客侧边栏、分类导航
       └── [slug]/
           └── page.tsx
   ```

3. **需要保持特定路由段的状态**

   ```typescript
   // app/dashboard/layout.tsx
   'use client'
   
   export default function DashboardLayout({ children }) {
     const [sidebarOpen, setSidebarOpen] = useState(true)
     // 这个状态在 dashboard 路由切换时不会丢失
     return <div>...</div>
   }
   ```

#### ❌ 不推荐使用嵌套 Layout 的场景

1. **过度嵌套**（超过 3-4 层）
2. **布局差异很小**（可以直接在 Page 中处理）

### 8.2 Layout 的最佳实践

#### ✅ 推荐做法：

```typescript
// ✅ 在 Layout 中放置共享 UI
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />        {/* 共享的侧边栏 */}
      <TopBar />         {/* 共享的顶部栏 */}
      <main>{children}</main>
    </div>
  )
}
```

#### ❌ 避免的做法：

```typescript
// ❌ 不要在 Layout 中放置页面特定的内容
export default function DashboardLayout({ children }) {
  return (
    <div>
      <Sidebar />
      <main>
        <h1>这是页面标题</h1>  {/* ❌ 应该在 Page 中 */}
        {children}
      </main>
    </div>
  )
}
```

### 8.3 Page 的最佳实践

#### ✅ 推荐做法：

```typescript
// ✅ 在 Page 中获取数据
export default async function BlogPage() {
  const posts = await fetchPosts()
  
  return (
    <div>
      <h1>博客列表</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

#### ❌ 避免的做法：

```typescript
// ❌ 不要在 Page 中放置应该在 Layout 中的内容
export default function BlogPage() {
  return (
    <div>
      <nav>导航栏</nav>  {/* ❌ 应该在 Layout 中 */}
      <h1>博客列表</h1>
      {/* 页面内容 */}
    </div>
  )
}
```

### 8.4 文件组织最佳实践

#### ✅ 推荐的结构：

```text
app/
├── layout.tsx              # 根布局：网站级别的 UI
├── page.tsx                # 首页
├── (marketing)/            # 路由组：营销页面
│   ├── layout.tsx          # 营销布局：营销导航
│   ├── about/
│   └── contact/
└── dashboard/              # 仪表板
    ├── layout.tsx          # Dashboard 布局：侧边栏
    ├── page.tsx
    └── settings/
        └── page.tsx
```

### 8.5 性能优化建议

1. **在 Layout 中使用客户端组件时要谨慎**
   - Layout 不会重新渲染，但客户端组件会
   - 考虑使用服务端组件 + 客户端组件的组合

2. **合理使用数据获取**
   - 在 Page 中获取页面特定的数据
   - 在 Layout 中获取共享的数据（但要考虑缓存）

3. **避免在 Layout 中进行重计算**
   - Layout 会保留状态，避免不必要的计算

---

## 📝 总结

### 关键要点

1. **Layout**：
   - 用于共享的布局结构
   - 路由切换时不会重新渲染
   - 会嵌套（子 Layout 在父 Layout 内）
   - 必须接收 `children` prop

2. **Page**：
   - 用于页面的具体内容
   - 路由切换时会重新渲染
   - 不会嵌套
   - 可以获取数据（async）

3. **嵌套布局**：
   - 每个路由段都可以有自己的 Layout
   - Layout 会从外到内嵌套
   - 适合为不同功能模块创建不同的布局

4. **每个路由文件夹**：
   - 都可以有自己的 `page.tsx` 和 `layout.tsx`
   - `page.tsx` 决定路由是否存在
   - `layout.tsx` 是可选的，用于创建嵌套布局

### 记忆口诀

- **Layout = 容器**（会嵌套，不重新渲染）
- **Page = 内容**（不嵌套，会重新渲染）
- **每个路由文件夹都可以有 Layout 和 Page**

---

**学习建议**：在实际项目中多实践嵌套布局，理解它们的工作原理和适用场景。
