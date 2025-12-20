# App Router vs Pages Router

> 📋 **目录**
>
> - [4.1 为什么使用 App Router？](#41-为什么使用-app-router)
> - [4.2 App Router vs Pages Router 对比](#42-app-router-vs-pages-router-对比)
> - [4.3 文件系统路由工作原理](#43-文件系统路由工作原理)
> - [4.4 动态路由的实际使用场景](#44-动态路由的实际使用场景)
> - [4.5 动态路由语法总结](#45-动态路由语法总结)
> - [4.6 重要提示和最佳实践](#46-重要提示和最佳实践)

---

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

在 App Router 中，**文件夹结构 = 实际的 URL 路由路径**。这意味着你在 `app/` 目录下创建的文件夹结构，会直接映射到浏览器访问的 URL 路径。

### 核心规则

- **文件夹名称** = URL 路径段
- **`page.tsx` 文件** = 该路由的页面内容
- **目录结构** = 完整的 URL 路径

### 基础示例

```text
app/
├── page.tsx              → URL: http://localhost:3000/
├── about/
│   └── page.tsx          → URL: http://localhost:3000/about
├── blog/
│   ├── page.tsx          → URL: http://localhost:3000/blog
│   └── [id]/
│       └── page.tsx      → URL: http://localhost:3000/blog/123
└── contact/
    └── page.tsx          → URL: http://localhost:3000/contact
```

---

### 实际案例

#### 案例 1：静态路由

**目录结构：**

```text
app/
├── page.tsx                    # 首页
├── about/
│   └── page.tsx                # 关于页面
├── products/
│   └── page.tsx                # 产品列表页
└── contact/
    └── page.tsx                # 联系我们页面
```

**实际访问的 URL：**

- `http://localhost:3000/` → 显示 `app/page.tsx` 的内容
- `http://localhost:3000/about` → 显示 `app/about/page.tsx` 的内容
- `http://localhost:3000/products` → 显示 `app/products/page.tsx` 的内容
- `http://localhost:3000/contact` → 显示 `app/contact/page.tsx` 的内容

#### 案例 2：动态路由

**目录结构：**

```text
app/
├── blog/
│   ├── page.tsx                # 博客列表页
│   └── [slug]/                 # 动态路由：slug 是参数名
│       └── page.tsx            # 博客详情页
└── user/
    └── [id]/
        └── page.tsx            # 用户详情页
```

**实际访问的 URL：**

- `http://localhost:3000/blog` → 显示博客列表
- `http://localhost:3000/blog/getting-started` → `slug = "getting-started"`
- `http://localhost:3000/blog/nextjs-tutorial` → `slug = "nextjs-tutorial"`
- `http://localhost:3000/user/123` → `id = "123"`
- `http://localhost:3000/user/456` → `id = "456"`

**在组件中获取动态参数：**

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // params.slug 就是 URL 中的动态部分
  // 访问 /blog/hello-world 时，params.slug = "hello-world"
  return <h1>博客文章: {params.slug}</h1>
}
```

**`slug` 值的来源说明：**

`hello-world` 这个值来自 **URL 路径本身**。当你访问 `/blog/hello-world` 时，Next.js 会自动从 URL 中提取 `hello-world` 并传递给组件。

**实际使用场景：**

1. **从博客列表页跳转**（最常见的方式）：

```typescript
// app/blog/page.tsx - 博客列表页
export default async function BlogListPage() {
  // 从数据库或 API 获取博客文章列表
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  
  return (
    <div>
      <h1>博客列表</h1>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          {/* 点击链接跳转到 /blog/hello-world */}
          <Link href={`/blog/${post.slug}`}>
            阅读更多
          </Link>
        </div>
      ))}
    </div>
  )
}
```

2. **用户直接在浏览器输入 URL**：

用户可以在浏览器地址栏输入：`http://localhost:3000/blog/hello-world`

3. **编程式导航**：

```typescript
'use client'

import { useRouter } from 'next/navigation'

export default function SomeComponent() {
  const router = useRouter()
  
  const handleClick = () => {
    // 跳转到 /blog/hello-world
    router.push('/blog/hello-world')
  }
  
  return <button onClick={handleClick}>查看文章</button>
}
```

**完整示例：从列表到详情**

```typescript
// 1. 博客列表页：app/blog/page.tsx
import Link from 'next/link'

export default async function BlogListPage() {
  // 假设从数据库获取文章列表
  const posts = [
    { id: 1, title: 'Next.js 入门', slug: 'getting-started' },
    { id: 2, title: 'React 基础', slug: 'react-basics' },
    { id: 3, title: 'TypeScript 教程', slug: 'typescript-tutorial' }
  ]
  
  return (
    <div>
      <h1>博客文章列表</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          {/* 点击链接会跳转到 /blog/getting-started */}
          {/* Next.js 会自动提取 "getting-started" 作为 slug */}
          <Link href={`/blog/${post.slug}`}>
            阅读全文
          </Link>
        </article>
      ))}
    </div>
  )
}

// 2. 博客详情页：app/blog/[slug]/page.tsx
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // params.slug 的值来自 URL
  // 如果访问 /blog/getting-started，则 params.slug = "getting-started"
  // 如果访问 /blog/react-basics，则 params.slug = "react-basics"
  
  // 使用 slug 从数据库获取对应的文章
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json())
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

**关键理解：**

- `[slug]` 文件夹名表示这是一个**动态路由段**
- URL 中的实际值（如 `hello-world`）会**自动**传递给 `params.slug`
- 这个值通常来自：
  - 数据库中的文章 slug 字段
  - API 返回的数据
  - 用户输入的 URL
  - 通过 `<Link>` 或 `router.push()` 传递

#### 案例 3：嵌套路由

**目录结构：**

```text
app/
├── dashboard/
│   ├── page.tsx                # /dashboard
│   ├── settings/
│   │   └── page.tsx            # /dashboard/settings
│   └── profile/
│       └── page.tsx            # /dashboard/profile
└── shop/
    ├── page.tsx                # /shop
    ├── products/
    │   └── page.tsx            # /shop/products
    └── cart/
        └── page.tsx            # /shop/cart
```

**实际访问的 URL：**

- `http://localhost:3000/dashboard` → 仪表板首页
- `http://localhost:3000/dashboard/settings` → 设置页面
- `http://localhost:3000/dashboard/profile` → 个人资料页面
- `http://localhost:3000/shop` → 商店首页
- `http://localhost:3000/shop/products` → 产品页面
- `http://localhost:3000/shop/cart` → 购物车页面

#### 案例 4：多段动态路由

**目录结构：**

```text
app/
└── blog/
    └── [year]/
        └── [month]/
            └── [slug]/
                └── page.tsx    # /blog/2024/01/my-post
```

**实际访问的 URL：**

- `http://localhost:3000/blog/2024/01/my-post`
  - `year = "2024"`
  - `month = "01"`
  - `slug = "my-post"`

**在组件中获取多个参数：**

```typescript
// app/blog/[year]/[month]/[slug]/page.tsx
export default function BlogPostPage({ 
  params 
}: { 
  params: { year: string; month: string; slug: string } 
}) {
  return (
    <div>
      <h1>文章: {params.slug}</h1>
      <p>发布时间: {params.year}年{params.month}月</p>
    </div>
  )
}
```

#### 案例 5：捕获所有路由段（Catch-all Routes）

使用 `[...slug]` 可以捕获所有后续的路由段。

**目录结构：**

```text
app/
└── docs/
    └── [...slug]/
        └── page.tsx          # 捕获所有路径
```

**实际访问的 URL：**

- `http://localhost:3000/docs` - ❌ 不会匹配（需要至少一个段）
- `http://localhost:3000/docs/getting-started` - `slug = ["getting-started"]`
- `http://localhost:3000/docs/getting-started/installation` - `slug = ["getting-started", "installation"]`
- `http://localhost:3000/docs/api/rest/users` - `slug = ["api", "rest", "users"]`

**在组件中使用：**

```typescript
// app/docs/[...slug]/page.tsx
export default async function DocsPage({ 
  params 
}: { 
  params: { slug: string[] }  // 注意：是数组
}) {
  // params.slug 是一个字符串数组
  // 访问 /docs/getting-started/installation
  // params.slug = ["getting-started", "installation"]
  
  const path = params.slug.join('/')
  const doc = await fetch(`https://api.example.com/docs/${path}`)
    .then(r => r.json())
  
  return (
    <div>
      <h1>{doc.title}</h1>
      <div>{doc.content}</div>
    </div>
  )
}
```

**使用场景：**

- 文档系统（多层级文档结构）
- 文件浏览器
- 嵌套的分类系统

---

#### 案例 6：可选捕获所有路由段（Optional Catch-all Routes）

使用 `[[...slug]]` 表示可选，可以匹配 0 个或多个路由段。

**目录结构：**

```text
app/
└── shop/
    └── [[...slug]]/
        └── page.tsx          # 可选捕获所有路径
```

**实际访问的 URL：**

- `http://localhost:3000/shop` - ✅ 会匹配！`slug = undefined` 或 `[]`
- `http://localhost:3000/shop/electronics` - `slug = ["electronics"]`
- `http://localhost:3000/shop/electronics/phones` - `slug = ["electronics", "phones"]`
- `http://localhost:3000/shop/electronics/phones/iphone` - `slug = ["electronics", "phones", "iphone"]`

**在组件中使用：**

```typescript
// app/shop/[[...slug]]/page.tsx
export default async function ShopPage({ 
  params 
}: { 
  params: { slug?: string[] }  // 注意：是可选的数组
}) {
  // 如果没有路径段，params.slug 可能是 undefined 或 []
  // 访问 /shop → params.slug = undefined 或 []
  // 访问 /shop/electronics → params.slug = ["electronics"]
  
  if (!params.slug || params.slug.length === 0) {
    // 显示所有分类
    const categories = await fetch('https://api.example.com/categories')
      .then(r => r.json())
    return (
      <div>
        <h1>商店首页 - 所有分类</h1>
        {categories.map(cat => (
          <div key={cat.id}>{cat.name}</div>
        ))}
      </div>
    )
  }
  
  // 显示特定分类的商品
  const categoryPath = params.slug.join('/')
  const products = await fetch(
    `https://api.example.com/products?category=${categoryPath}`
  ).then(r => r.json())
  
  return (
    <div>
      <h1>分类: {categoryPath}</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  )
}
```

**使用场景：**

- 电商分类页面（可以显示所有分类，也可以显示特定分类）
- 多层级导航系统
- 需要同时支持根路径和子路径的场景

---

#### 案例 7：动态路由语法对比

**三种方括号语法的对比：**

| 类型 | 语法 | 匹配路径 | 参数类型 | 示例 URL | 参数值 |
|------|------|---------|---------|---------|--------|
| **单个动态参数** | `[param]` | 必须匹配 1 个段 | `string` | `/blog/hello` | `params.param = "hello"` |
| **捕获所有** | `[...slug]` | 必须匹配 1 个或多个段 | `string[]` | `/docs/a/b/c` | `params.slug = ["a", "b", "c"]` |
| **可选捕获所有** | `[[...slug]]` | 可以匹配 0 个或多个段 | `string[] \| undefined` | `/shop` 或 `/shop/a/b` | `params.slug = undefined` 或 `["a", "b"]` |

**实际对比示例：**

```text
# 单个动态参数
app/blog/[slug]/page.tsx
- ✅ /blog/hello          → params.slug = "hello"
- ❌ /blog               → 不匹配（需要至少一个段）
- ❌ /blog/hello/world    → 不匹配（只能匹配一个段）

# 捕获所有
app/docs/[...slug]/page.tsx
- ❌ /docs               → 不匹配（需要至少一个段）
- ✅ /docs/hello         → params.slug = ["hello"]
- ✅ /docs/hello/world   → params.slug = ["hello", "world"]

# 可选捕获所有
app/shop/[[...slug]]/page.tsx
- ✅ /shop               → params.slug = undefined
- ✅ /shop/electronics  → params.slug = ["electronics"]
- ✅ /shop/electronics/phones → params.slug = ["electronics", "phones"]
```

---

#### 案例 8：实际项目结构示例

**一个完整的博客网站结构：**

```text
app/
├── page.tsx                    # 首页：http://localhost:3000/
├── about/
│   └── page.tsx                # 关于：http://localhost:3000/about
├── blog/
│   ├── page.tsx                # 博客列表：http://localhost:3000/blog
│   └── [slug]/
│       └── page.tsx            # 文章详情：http://localhost:3000/blog/hello-world
├── contact/
│   └── page.tsx                # 联系：http://localhost:3000/contact
└── admin/
    ├── page.tsx                # 管理后台：http://localhost:3000/admin
    ├── posts/
    │   ├── page.tsx            # 文章管理：http://localhost:3000/admin/posts
    │   └── [id]/
    │       └── page.tsx        # 编辑文章：http://localhost:3000/admin/posts/123
    └── users/
        └── page.tsx            # 用户管理：http://localhost:3000/admin/users
```

## 4.4 动态路由的实际使用场景

动态路由在实际项目中有非常广泛的应用，以下是常见的实际使用场景：

### 场景 1：博客/文章系统

**需求**：显示多篇博客文章，每篇文章有唯一的 URL。

**实现**：

```text
app/
└── blog/
    ├── page.tsx              # 博客列表页
    └── [slug]/
        └── page.tsx          # 文章详情页
```

**使用示例**：

```typescript
// app/blog/page.tsx - 列表页
import Link from 'next/link'

export default async function BlogListPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  
  return (
    <div>
      <h1>博客文章</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          {/* 动态生成链接：/blog/getting-started, /blog/react-basics 等 */}
          <Link href={`/blog/${post.slug}`}>阅读全文</Link>
        </article>
      ))}
    </div>
  )
}

// app/blog/[slug]/page.tsx - 详情页
export default async function BlogPostPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  // 根据 slug 获取对应的文章
  const post = await fetch(`https://api.example.com/posts/${params.slug}`)
    .then(r => r.json())
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

**访问示例**：

- `/blog` - 显示所有文章列表
- `/blog/getting-started` - 显示"getting-started"这篇文章
- `/blog/react-tutorial` - 显示"react-tutorial"这篇文章

---

### 场景 2：电商产品详情页

**需求**：展示商品列表，每个商品有独立的详情页。

**实现**：

```text
app/
└── products/
    ├── page.tsx              # 产品列表页
    └── [id]/
        └── page.tsx          # 产品详情页
```

**使用示例**：

```typescript
// app/products/page.tsx
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await fetch('https://api.example.com/products').then(r => r.json())
  
  return (
    <div>
      <h1>商品列表</h1>
      <div className="grid">
        {products.map(product => (
          <div key={product.id}>
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>¥{product.price}</p>
            {/* 动态链接：/products/123, /products/456 等 */}
            <Link href={`/products/${product.id}`}>查看详情</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

// app/products/[id]/page.tsx
export default async function ProductDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const product = await fetch(`https://api.example.com/products/${params.id}`)
    .then(r => r.json())
  
  return (
    <div>
      <img src={product.image} alt={product.name} />
      <h1>{product.name}</h1>
      <p>价格：¥{product.price}</p>
      <p>{product.description}</p>
      <button>加入购物车</button>
    </div>
  )
}
```

**访问示例**：

- `/products` - 显示所有商品
- `/products/123` - 显示 ID 为 123 的商品
- `/products/456` - 显示 ID 为 456 的商品

---

### 场景 3：用户个人资料页

**需求**：查看不同用户的个人资料。

**实现**：

```text
app/
└── user/
    └── [username]/
        └── page.tsx          # 用户资料页
```

**使用示例**：

```typescript
// app/user/[username]/page.tsx
export default async function UserProfilePage({ 
  params 
}: { 
  params: { username: string } 
}) {
  const user = await fetch(`https://api.example.com/users/${params.username}`)
    .then(r => r.json())
  
  return (
    <div>
      <img src={user.avatar} alt={user.name} />
      <h1>{user.name}</h1>
      <p>@{params.username}</p>
      <p>{user.bio}</p>
      <div>
        <span>关注者: {user.followers}</span>
        <span>关注: {user.following}</span>
      </div>
    </div>
  )
}
```

**访问示例**：

- `/user/john` - 显示用户 john 的资料
- `/user/jane` - 显示用户 jane 的资料

---

### 场景 4：管理后台的编辑页面

**需求**：在管理后台编辑不同的资源（文章、用户、订单等）。

**实现**：

```text
app/
└── admin/
    ├── posts/
    │   ├── page.tsx          # 文章列表
    │   └── [id]/
    │       └── page.tsx      # 编辑文章
    ├── users/
    │   ├── page.tsx          # 用户列表
    │   └── [id]/
    │       └── page.tsx      # 编辑用户
    └── orders/
        ├── page.tsx          # 订单列表
        └── [id]/
            └── page.tsx      # 订单详情
```

**使用示例**：

```typescript
// app/admin/posts/[id]/page.tsx
export default async function EditPostPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`)
    .then(r => r.json())
  
  return (
    <form>
      <input defaultValue={post.title} name="title" />
      <textarea defaultValue={post.content} name="content" />
      <button type="submit">保存</button>
    </form>
  )
}
```

**访问示例**：

- `/admin/posts/123` - 编辑 ID 为 123 的文章
- `/admin/users/456` - 编辑 ID 为 456 的用户

---

### 场景 5：分类/标签页面

**需求**：按分类或标签显示内容。

**实现**：

```text
app/
└── category/
    └── [name]/
        └── page.tsx          # 分类页面
```

**使用示例**：

```typescript
// app/category/[name]/page.tsx
export default async function CategoryPage({ 
  params 
}: { 
  params: { name: string } 
}) {
  // 根据分类名称获取该分类下的文章
  const posts = await fetch(`https://api.example.com/posts?category=${params.name}`)
    .then(r => r.json())
  
  return (
    <div>
      <h1>分类：{params.name}</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

**访问示例**：

- `/category/technology` - 显示技术分类的文章
- `/category/lifestyle` - 显示生活方式分类的文章

---

### 场景 6：多层级动态路由（日期归档）

**需求**：按年月日组织博客文章。

**实现**：

```text
app/
└── archive/
    └── [year]/
        └── [month]/
            └── page.tsx      # 某年某月的文章列表
```

**使用示例**：

```typescript
// app/archive/[year]/[month]/page.tsx
export default async function ArchivePage({ 
  params 
}: { 
  params: { year: string; month: string } 
}) {
  const posts = await fetch(
    `https://api.example.com/posts?year=${params.year}&month=${params.month}`
  ).then(r => r.json())
  
  return (
    <div>
      <h1>{params.year}年{params.month}月的文章</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  )
}
```

**访问示例**：

- `/archive/2024/01` - 显示 2024 年 1 月的文章
- `/archive/2024/12` - 显示 2024 年 12 月的文章

---

### 场景 7：搜索和筛选

**需求**：根据搜索关键词或筛选条件显示结果。

**实现**：

```text
app/
└── search/
    └── [keyword]/
        └── page.tsx          # 搜索结果页
```

**使用示例**：

```typescript
// app/search/[keyword]/page.tsx
export default async function SearchPage({ 
  params 
}: { 
  params: { keyword: string } 
}) {
  const results = await fetch(
    `https://api.example.com/search?q=${params.keyword}`
  ).then(r => r.json())
  
  return (
    <div>
      <h1>搜索结果：{params.keyword}</h1>
      {results.map(result => (
        <div key={result.id}>
          <h2>{result.title}</h2>
        </div>
      ))}
    </div>
  )
}
```

**访问示例**：

- `/search/nextjs` - 搜索"nextjs"相关的内容
- `/search/react` - 搜索"react"相关的内容

---

### 总结：何时使用动态路由？

**使用动态路由的场景：**

1. ✅ **内容数量不固定**：文章、商品、用户等数量会变化
2. ✅ **需要唯一标识**：每个内容有唯一的 ID 或 slug
3. ✅ **需要 SEO 友好的 URL**：`/blog/my-article` 比 `/blog?id=123` 更好
4. ✅ **需要可分享的链接**：每个内容有独立的 URL
5. ✅ **需要按条件筛选**：分类、标签、日期等

**不使用动态路由的场景：**

1. ❌ **固定数量的页面**：关于我们、联系我们等固定页面
2. ❌ **不需要唯一标识**：简单的静态页面

**动态路由的优势：**

- 🚀 **代码复用**：一个组件处理所有相似的内容
- 🚀 **易于维护**：添加新内容不需要创建新文件
- 🚀 **SEO 友好**：每个内容有独立的 URL
- 🚀 **用户体验好**：URL 清晰易读

---

## 4.5 动态路由语法总结

### 方括号语法类型

Next.js App Router 支持三种使用方括号的动态路由语法：

#### 1. 单个动态参数：`[param]`

- **语法**：`[参数名]`
- **匹配**：必须匹配 1 个路由段
- **参数类型**：`string`
- **示例**：`[id]`、`[slug]`、`[username]`

```typescript
// app/blog/[slug]/page.tsx
params: { slug: string }  // 访问 /blog/hello → slug = "hello"
```

#### 2. 捕获所有路由段：`[...slug]`（Catch-all）

- **语法**：`[...参数名]`（三个点）
- **匹配**：必须匹配 1 个或多个路由段
- **参数类型**：`string[]`（数组）
- **示例**：`[...slug]`、`[...path]`

```typescript
// app/docs/[...slug]/page.tsx
params: { slug: string[] }  // 访问 /docs/a/b → slug = ["a", "b"]
```

#### 3. 可选捕获所有路由段：`[[...slug]]`（Optional Catch-all）

- **语法**：`[[...参数名]]`（双括号 + 三个点）
- **匹配**：可以匹配 0 个或多个路由段
- **参数类型**：`string[] | undefined`（可选数组）
- **示例**：`[[...slug]]`、`[[...path]]`

```typescript
// app/shop/[[...slug]]/page.tsx
params: { slug?: string[] }  // 访问 /shop → slug = undefined，访问 /shop/a → slug = ["a"]
```

### 语法对比表

| 类型 | 语法 | 匹配路径 | 参数类型 | 示例 |
|------|------|---------|---------|------|
| **单个动态参数** | `[param]` | 必须 1 个段 | `string` | `/blog/[slug]` → `/blog/hello` |
| **捕获所有** | `[...slug]` | 必须 1+ 个段 | `string[]` | `/docs/[...slug]` → `/docs/a/b/c` |
| **可选捕获所有** | `[[...slug]]` | 可以 0+ 个段 | `string[] \| undefined` | `/shop/[[...slug]]` → `/shop` 或 `/shop/a/b` |

---

## 4.6 重要提示和最佳实践

### 核心规则

1. **文件夹名称就是 URL 路径**：`app/about/page.tsx` → `/about`
2. **`page.tsx` 是必需的**：没有 `page.tsx` 的文件夹不会创建路由
3. **动态路由使用方括号**：
   - `[param]` - 单个动态参数
   - `[...slug]` - 捕获所有路由段（必须至少 1 个）
   - `[[...slug]]` - 可选捕获所有路由段（可以 0 个）
4. **嵌套文件夹 = 嵌套 URL**：`app/dashboard/settings/page.tsx` → `/dashboard/settings`
5. **路由组不影响 URL**：`(marketing)` 这样的文件夹不会出现在 URL 中

### 选择动态路由语法的建议

#### 使用 `[param]` - 单个动态参数

**适用场景**：当你知道确切的路由段数量时

**案例 1：博客文章详情页**

```text
app/blog/[slug]/page.tsx
```

- ✅ `/blog/getting-started` - 匹配
- ✅ `/blog/react-tutorial` - 匹配
- ❌ `/blog` - 不匹配（需要至少一个段）
- ❌ `/blog/getting-started/part1` - 不匹配（只能匹配一个段）

**案例 2：用户资料页**

```text
app/user/[username]/page.tsx
```

- ✅ `/user/john` - 匹配
- ✅ `/user/jane` - 匹配
- ❌ `/user` - 不匹配

**案例 3：产品详情页**

```text
app/products/[id]/page.tsx
```

- ✅ `/products/123` - 匹配
- ✅ `/products/456` - 匹配

---

#### 使用 `[...slug]` - 捕获所有路由段

**适用场景**：当你需要捕获多个不确定的路由段，但至少需要 1 个时

**案例 1：文档系统（多层级文档）**

```text
app/docs/[...slug]/page.tsx
```

- ❌ `/docs` - 不匹配（需要至少一个段）
- ✅ `/docs/getting-started` - `slug = ["getting-started"]`
- ✅ `/docs/getting-started/installation` - `slug = ["getting-started", "installation"]`
- ✅ `/docs/api/rest/users` - `slug = ["api", "rest", "users"]`

**实际应用**：

```typescript
// 访问 /docs/api/rest/users
// params.slug = ["api", "rest", "users"]
// 可以根据这个路径获取对应的文档内容
```

**案例 2：文件浏览器**

```text
app/files/[...path]/page.tsx
```

- ✅ `/files/folder1/file.txt` - `path = ["folder1", "file.txt"]`
- ✅ `/files/images/2024/photo.jpg` - `path = ["images", "2024", "photo.jpg"]`

**案例 3：嵌套分类系统**

```text
app/category/[...path]/page.tsx
```

- ✅ `/category/electronics/phones/smartphones` - `path = ["electronics", "phones", "smartphones"]`

---

#### 使用 `[[...slug]]` - 可选捕获所有路由段

**适用场景**：当你需要同时支持根路径和子路径时

**案例 1：电商分类页面（支持根路径和子路径）**

```text
app/shop/[[...category]]/page.tsx
```

- ✅ `/shop` - `category = undefined`（显示所有商品）
- ✅ `/shop/electronics` - `category = ["electronics"]`（显示电子产品）
- ✅ `/shop/electronics/phones` - `category = ["electronics", "phones"]`（显示手机）

**实际应用**：

```typescript
// app/shop/[[...category]]/page.tsx
export default async function ShopPage({ 
  params 
}: { 
  params: { category?: string[] } 
}) {
  if (!params.category || params.category.length === 0) {
    // 显示所有商品（根路径）
    return <AllProducts />
  }
  
  // 显示特定分类的商品（子路径）
  const categoryPath = params.category.join('/')
  return <CategoryProducts path={categoryPath} />
}
```

**案例 2：多层级导航系统**

```text
app/nav/[[...path]]/page.tsx
```

- ✅ `/nav` - 显示主导航
- ✅ `/nav/products` - 显示产品导航
- ✅ `/nav/products/electronics` - 显示电子产品导航

**案例 3：博客归档（支持按年份和月份）**

```text
app/archive/[[...date]]/page.tsx
```

- ✅ `/archive` - 显示所有文章
- ✅ `/archive/2024` - 显示 2024 年的文章
- ✅ `/archive/2024/01` - 显示 2024 年 1 月的文章

---

### 快速决策指南

**问自己这些问题：**

1. **路由段数量是否固定？**
   - ✅ 固定 → 使用 `[param]`
   - ❌ 不固定 → 继续第 2 题

2. **是否需要支持根路径（0 个段）？**
   - ✅ 需要 → 使用 `[[...slug]]`
   - ❌ 不需要 → 使用 `[...slug]`

**决策流程图：**

```
路由段数量是否固定？
├─ 是 → 使用 [param]
└─ 否 → 是否需要支持根路径？
    ├─ 是 → 使用 [[...slug]]
    └─ 否 → 使用 [...slug]
```

**实际项目示例对比：**

| 需求 | 推荐语法 | 示例 URL | 说明 |
|------|---------|---------|------|
| 博客文章详情 | `[slug]` | `/blog/my-article` | 固定 1 个段 |
| 文档系统 | `[...slug]` | `/docs/getting-started/install` | 不固定，但至少 1 个段 |
| 电商分类 | `[[...slug]]` | `/shop` 或 `/shop/electronics` | 需要支持根路径和子路径 |

### 常见错误

#### 1. ❌ 忘记 `page.tsx`

**错误**：没有 `page.tsx` 的文件夹不会创建路由

**示例**：
```text
app/
└── about/          # ❌ 没有 page.tsx，不会创建路由
    └── info.tsx
```

**正确做法**：
```text
app/
└── about/
    └── page.tsx   # ✅ 必须有 page.tsx
```

---

#### 2. ❌ 混淆 `[...slug]` 和 `[[...slug]]`

**错误说明**：注意双括号表示可选

这是最容易混淆的错误，因为两者语法非常相似，只差一个方括号，但功能有重要区别。

##### 核心区别

| 语法 | 括号数量 | 是否支持空路径 | 参数类型 |
|------|---------|--------------|---------|
| `[...slug]` | 单括号 | ❌ 不支持（必须至少 1 个段） | `string[]`（必需） |
| `[[...slug]]` | 双括号 | ✅ 支持（可以 0 个段） | `string[] \| undefined`（可选） |

##### 为什么会混淆？

1. **语法相似**：只差一个方括号，容易看错
2. **功能相似**：都能捕获多个路由段
3. **区别细微**：主要在于是否支持根路径（空路径）

##### 实际对比示例

**场景：电商分类页面**

```text
# ❌ 错误：使用 [...slug]（单括号）
app/shop/[...slug]/page.tsx
```

**问题**：
- `/shop` → ❌ 不匹配（无法显示商店首页）
- `/shop/electronics` → ✅ 匹配

**结果**：用户访问 `/shop` 会看到 404 错误！

```text
# ✅ 正确：使用 [[...slug]]（双括号）
app/shop/[[...slug]]/page.tsx
```

**正确**：
- `/shop` → ✅ 匹配（可以显示所有商品）
- `/shop/electronics` → ✅ 匹配（显示电子产品）

##### 代码中的区别

```typescript
// [...slug] - 单括号
// app/docs/[...slug]/page.tsx
export default function DocsPage({ 
  params 
}: { 
  params: { slug: string[] }  // ❌ 不能是 undefined，必须是数组
}) {
  // params.slug 总是存在，至少有一个元素
  const path = params.slug.join('/')
  // ...
}

// [[...slug]] - 双括号
// app/shop/[[...slug]]/page.tsx
export default function ShopPage({ 
  params 
}: { 
  params: { slug?: string[] }  // ✅ 可以是 undefined
}) {
  // 需要检查 params.slug 是否存在
  if (!params.slug || params.slug.length === 0) {
    // 显示所有商品（根路径）
    return <AllProducts />
  }
  
  // 显示特定分类的商品
  const categoryPath = params.slug.join('/')
  return <CategoryProducts path={categoryPath} />
}
```

##### 如何避免混淆？

**记忆方法**：
- **单括号** `[...slug]` = **必须**至少 1 个段（不能为空）
- **双括号** `[[...slug]]` = **可选**（可以为空）

**决策流程**：
1. 问自己：是否需要支持根路径（空路径）？
   - ✅ 需要 → 使用 `[[...slug]]`（双括号）
   - ❌ 不需要 → 使用 `[...slug]`（单括号）

**实际应用场景**：

| 场景 | 推荐语法 | 原因 |
|------|---------|------|
| 文档系统 | `[...slug]` | `/docs` 本身不应该匹配，必须有具体路径 |
| 电商分类 | `[[...slug]]` | 需要同时支持 `/shop` 和 `/shop/electronics` |
| 文件浏览器 | `[...slug]` | 必须有文件路径 |
| 博客归档 | `[[...slug]]` | 需要支持 `/archive` 和 `/archive/2024` |

##### 常见错误示例

**错误 1：应该用双括号却用了单括号**

```text
# ❌ 错误
app/shop/[...slug]/page.tsx

# 访问 /shop 时会出现 404
```

```text
# ✅ 正确
app/shop/[[...slug]]/page.tsx

# 访问 /shop 可以正常显示
```

**错误 2：应该用单括号却用了双括号**

```text
# ❌ 错误（虽然不会报错，但不必要）
app/docs/[[...slug]]/page.tsx

# 如果 /docs 不应该匹配，用单括号更合适
```

```text
# ✅ 正确
app/docs/[...slug]/page.tsx

# /docs 不会匹配，必须有具体路径
```

---

#### 3. ❌ 参数类型错误

**错误**：`[...slug]` 返回数组，不是字符串

**常见错误**：

```typescript
// ❌ 错误：以为 slug 是字符串
export default function Page({ params }: { params: { slug: string } }) {
  // 这样会报错！
}

// ✅ 正确：slug 是数组
export default function Page({ params }: { params: { slug: string[] } }) {
  const path = params.slug.join('/')
  // ...
}
```

**参数类型对照表**：

| 语法 | 参数类型 | 示例值 |
|------|---------|--------|
| `[slug]` | `string` | `"hello"` |
| `[...slug]` | `string[]` | `["hello", "world"]` |
| `[[...slug]]` | `string[] \| undefined` | `undefined` 或 `["hello", "world"]` |

---

#### 4. ❌ 在路由组中使用动态路由

**说明**：路由组 `(folder)` 不影响 URL，但可以在其中使用动态路由

**路由组的作用**：
- 路由组用于组织路由，但不影响 URL
- 可以在路由组内使用动态路由

**示例**：

```text
app/
└── (marketing)/          # 路由组，不影响 URL
    ├── about/
    │   └── page.tsx     # URL: /about（不是 /(marketing)/about）
    └── blog/
        └── [slug]/
            └── page.tsx # URL: /blog/[slug]（可以正常使用动态路由）
```

**注意**：
- 路由组本身不影响 URL
- 动态路由在路由组内正常工作
- 但不要混淆路由组 `(folder)` 和可选捕获 `[[...slug]]` 的语法
