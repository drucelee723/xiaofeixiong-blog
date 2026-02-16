# 小肥熊博客 - 完整部署流程文档

## 项目概述

- **项目名称**: 小肥熊博客 (xiaofeixiong-blog)
- **技术栈**: Next.js 16 + TypeScript + Tailwind CSS 4
- **部署平台**: GitHub Pages
- **访问地址**: https://drucelee723.github.io/xiaofeixiong-blog

---

## 一、项目初始化

### 1.1 创建Next.js项目

```bash
npx create-next-app@latest xiaofeixiong-blog --typescript --tailwind --eslint --app --src-dir
```

### 1.2 安装依赖

```bash
cd xiaofeixiong-blog

# 核心依赖
npm install gray-matter reading-time fuse.js next-themes @giscus/react

# Markdown渲染
npm install marked

# MDX支持（可选）
npm install @mdx-js/loader @mdx-js/react @next/mdx remark-gfm rehype-slug rehype-pretty-code shiki
```

---

## 二、项目结构

```
xiaofeixiong-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions自动部署
├── public/
│   └── search-index.json       # 搜索索引（自动生成）
├── scripts/
│   └── generate-search.ts      # 搜索索引生成脚本
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页
│   │   ├── globals.css         # 全局样式
│   │   ├── about/              # 关于页面
│   │   ├── projects/           # 项目展示
│   │   └── blog/
│   │       ├── page.tsx        # 博客列表（服务端组件）
│   │       ├── BlogClient.tsx  # 博客列表（客户端组件）
│   │       └── [...slug]/      # 博客文章详情
│   ├── components/
│   │   ├── layout/             # 布局组件（Sidebar, Navbar）
│   │   ├── blog/               # 博客组件（PostCard, TOC, Share等）
│   │   └── ui/                 # UI组件（SearchModal, ReadingProgress）
│   ├── content/
│   │   └── posts/              # Markdown博客文章
│   │       ├── embedded-linux/
│   │       └── ros/
│   └── lib/
│       ├── posts.ts            # 文章数据处理
│       └── toc.ts              # 目录提取
├── next.config.ts              # Next.js配置
├── package.json
└── tsconfig.json
```

---

## 三、核心配置文件

### 3.1 next.config.ts

```typescript
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  // 支持MDX
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  
  // 静态导出配置
  output: "export",
  
  // GitHub Pages basePath (仓库名)
  basePath: "/xiaofeixiong-blog",
  
  // 图片优化配置（静态导出必须关闭）
  images: {
    unoptimized: true,
  },
  
  // 严格模式
  reactStrictMode: true,
  
  // URL尾部斜杠（静态导出推荐）
  trailingSlash: true,
};

export default withMDX(nextConfig);
```

### 3.2 .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    permissions:
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 四、博客功能实现

### 4.1 Markdown渲染 (src/lib/posts.ts)

使用 `marked` 库将Markdown转换为HTML：

```typescript
import { Marked } from "marked";

const marked = new Marked({
  gfm: true,
  breaks: true,
});

// 自定义代码块渲染（带语言标签和复制按钮）
const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    const language = lang || "plaintext";
    const escapedCode = escapeHtml(text);
    return `<div class="code-block">
      <div class="code-header">
        <span class="code-lang">${language}</span>
        <button class="code-copy" onclick="...">复制</button>
      </div>
      <pre class="shiki github-dark">
        <code class="language-${language}">${escapedCode}</code>
      </pre>
    </div>`;
  },
};

marked.use({ renderer });

function parseMarkdown(content: string): string {
  return marked.parse(content) as string;
}
```

### 4.2 静态筛选实现

将筛选逻辑从服务端移到客户端：

```typescript
// src/app/blog/page.tsx (服务端组件)
export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  return <BlogClient posts={allPosts} categories={categories} tags={tags} />;
}

// src/app/blog/BlogClient.tsx (客户端组件)
"use client";
import { useState } from "react";

export function BlogClient({ posts, categories, tags }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedTag && !post.tags.includes(selectedTag)) return false;
    return true;
  });
  
  // ...渲染UI
}
```

### 4.3 Notion风格文章排版 (src/app/globals.css)

```css
/* Prose Styles - Notion-like Reading Experience */
.prose {
  color: var(--color-foreground);
  line-height: 1.8;
  max-width: 820px;
  font-size: 1rem;
}

.prose h2 {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  padding-left: 1rem;
}

/* 渐变色左边框 */
.prose h2::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.25rem;
  bottom: 0.25rem;
  width: 4px;
  background: linear-gradient(180deg, var(--color-primary-500), var(--color-accent-500));
  border-radius: 2px;
}

/* 代码块样式 */
.code-block {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background-color: #1e1e1e;
}

.code-header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}
```

---

## 五、GitHub Pages部署流程

### 5.1 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名: `xiaofeixiong-blog`
3. 选择 **Public**
4. 点击 **Create repository**

### 5.2 推送代码

```bash
# 初始化Git（如果还没有）
git init

# 添加远程仓库
git remote add origin https://github.com/drucelee723/xiaofeixiong-blog.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 小肥熊博客"

# 推送到GitHub
git branch -M main
git push -u origin main
```

### 5.3 启用GitHub Pages

1. 访问 **https://github.com/drucelee723/xiaofeixiong-blog/settings/pages**
2. 在 **Build and deployment** → **Source** 选择 **GitHub Actions**
3. 保存后GitHub会自动开始部署

### 5.4 访问博客

部署成功后访问：**https://drucelee723.github.io/xiaofeixiong-blog**

---

## 六、日常更新流程

### 6.1 添加新文章

1. 在 `src/content/posts/` 目录下创建新的 `.md` 文件
2. 添加Front Matter：

```markdown
---
title: "文章标题"
description: "文章描述"
date: "2024-01-20"
category: "embedded-linux"
tags: ["Linux", "ARM"]
author: "小肥熊"
featured: false
---

# 文章标题

文章内容...
```

### 6.2 本地预览

```bash
npm run dev
# 访问 http://localhost:3000/xiaofeixiong-blog
```

### 6.3 构建测试

```bash
npm run build
# 静态文件输出到 out/ 目录
```

### 6.4 部署更新

```bash
git add .
git commit -m "新增文章: XXX"
git push
```

GitHub Actions会自动重新部署！

---

## 七、功能清单

### 已实现功能

- [x] 响应式设计（移动端适配）
- [x] 深色/浅色主题切换
- [x] 博客文章列表（分页、筛选）
- [x] 分类筛选
- [x] 标签云
- [x] 文章详情页
- [x] Notion风格排版
- [x] 代码高亮（带语言标签、复制按钮）
- [x] 目录导航（TOC）
- [x] 阅读进度条
- [x] 预计阅读时间
- [x] 全文搜索（Fuse.js）
- [x] Giscus评论系统
- [x] 社交分享按钮
- [x] 系列文章导航
- [x] RSS订阅（待实现）
- [x] SEO优化（Open Graph）

### 待实现功能

- [ ] RSS订阅
- [ ] 文章归档页面
- [ ] 访问统计
- [ ] 更多主题定制

---

## 八、常见问题

### Q1: 为什么本地开发时图片/链接不工作？

本地开发时需要访问 `http://localhost:3000/xiaofeixiong-blog`（包含basePath）。

### Q2: 如何修改博客名称/作者？

修改以下文件：
- `src/app/layout.tsx` - 网站标题
- `src/lib/posts.ts` - 默认作者
- `src/content/posts/*.md` - 文章front matter

### Q3: 如何添加新的分类图标？

在 `src/app/globals.css` 中添加：

```css
.category-icon.your-category {
  background: linear-gradient(135deg, #xxx 0%, #yyy 100%);
}
```

### Q4: 如何启用Giscus评论？

1. 访问 https://giscus.app/zh-CN 配置
2. 获取配置参数
3. 更新 `src/components/blog/Comments.tsx`

---

## 九、技术要点总结

### 9.1 静态导出注意事项

1. **必须关闭图片优化**: `images: { unoptimized: true }`
2. **不能使用API Routes**: 删除 `src/app/api/` 目录
3. **不能使用searchParams**: 改用客户端状态管理
4. **必须设置basePath**: GitHub Pages子路径部署

### 9.2 Markdown渲染优化

1. 使用 `marked` 而非 `remark/rehype`（更简单）
2. 自定义代码块渲染增强体验
3. CSS变量实现主题切换

### 9.3 性能优化

1. 静态生成（SSG）而非服务端渲染
2. 客户端搜索索引（Fuse.js）
3. 图片懒加载
4. 代码分割（Next.js自动）

---

## 十、参考资料

- [Next.js 文档](https://nextjs.org/docs)
- [GitHub Pages 文档](https://docs.github.com/en/pages)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Marked 文档](https://marked.js.org/)
- [Fuse.js 文档](https://www.fusejs.io/)
- [Giscus 文档](https://giscus.app/zh-CN)

---

**文档版本**: 1.0
**最后更新**: 2026-02-16
**作者**: 小肥熊
