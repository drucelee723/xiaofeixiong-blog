import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { Marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

// Configure marked with GFM support
const marked = new Marked({
  gfm: true,
  breaks: true,
});

// Simple HTML escape for code blocks
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Custom renderer for code blocks with language label
const renderer = {
  code({ text, lang }: { text: string; lang?: string }) {
    const language = lang || "plaintext";
    const escapedCode = escapeHtml(text);
    const rawCode = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
    return `<div class="code-block"><div class="code-header"><span class="code-lang">${language}</span><button class="code-copy" onclick="navigator.clipboard.writeText(\`${rawCode}\`);this.textContent='已复制!';setTimeout(()=>this.textContent='复制',2000)">复制</button></div><pre class="shiki github-dark"><code class="language-${language}">${escapedCode}</code></pre></div>`;
  },
};

marked.use({ renderer });

// Convert markdown to HTML synchronously
function parseMarkdown(content: string): string {
  return marked.parse(content) as string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  author: string;
  featured?: boolean;
  draft?: boolean;
  readingTime: string;
  content: string;  // Raw markdown
  html: string;     // Rendered HTML
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  series?: string;
  seriesOrder?: number;
  author: string;
  featured?: boolean;
  readingTime: string;
}

function getAllPostFiles(dir: string): string[] {
  const files: string[] = [];
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...getAllPostFiles(fullPath));
    } else if (item.name.endsWith(".md") || item.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }
  
  return files;
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  
  const files = getAllPostFiles(POSTS_DIR);
  
  const posts = files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    const stats = readingTime(content);
    
    // Generate slug from file path
    const relativePath = path.relative(POSTS_DIR, filePath);
    const slug = relativePath
      .replace(/\.(md|mdx)$/, "")
      .split(path.sep)
      .join("/");
    
    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      category: data.category || "uncategorized",
      tags: data.tags || [],
      series: data.series,
      seriesOrder: data.seriesOrder,
      author: data.author || "小肥熊",
      featured: data.featured || false,
      draft: data.draft || false,
      readingTime: stats.text,
      content,
      html: parseMarkdown(content),
    };
  });
  
  // Filter out drafts and sort by date
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((post) => post.slug === slug) || null;
}

export function getPostsByCategory(category: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export function getPostsBySeries(series: string): Post[] {
  const posts = getAllPosts();
  return posts
    .filter((post) => post.series === series)
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories);
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap((post) => post.tags));
  return Array.from(tags);
}

export function getAllSeries(): string[] {
  const posts = getAllPosts();
  const series = new Set(posts.map((post) => post.series).filter(Boolean));
  return Array.from(series) as string[];
}

export function getRecentPosts(limit: number = 5): PostMeta[] {
  const posts = getAllPosts();
  return posts.slice(0, limit).map(({ content, ...meta }) => meta);
}

export function getFeaturedPosts(): PostMeta[] {
  const posts = getAllPosts();
  return posts
    .filter((post) => post.featured)
    .map(({ content, ...meta }) => meta);
}

export function searchPosts(query: string): PostMeta[] {
  const posts = getAllPosts();
  const lowerQuery = query.toLowerCase();
  
  return posts
    .filter((post) => {
      return (
        post.title.toLowerCase().includes(lowerQuery) ||
        post.description.toLowerCase().includes(lowerQuery) ||
        post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        post.content.toLowerCase().includes(lowerQuery)
      );
    })
    .map(({ content, ...meta }) => meta);
}
