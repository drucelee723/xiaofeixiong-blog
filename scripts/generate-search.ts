// 生成搜索索引数据
// 在构建时运行，生成静态搜索数据

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

interface SearchIndex {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
}

function getAllPostFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) return files;
  
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

function generateSearchIndex(): SearchIndex[] {
  const files = getAllPostFiles(POSTS_DIR);
  
  return files.map((filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);
    
    const relativePath = path.relative(POSTS_DIR, filePath);
    const slug = relativePath
      .replace(/\.(md|mdx)$/, "")
      .split(path.sep)
      .join("/");
    
    // 提取纯文本内容（移除代码块和标记语法）
    const plainContent = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`]+`/g, "")
      .replace(/#{1,6}\s+/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 1000);
    
    return {
      slug,
      title: data.title || "Untitled",
      description: data.description || "",
      category: data.category || "uncategorized",
      tags: data.tags || [],
      content: plainContent,
    };
  }).filter((post) => !post.title.includes("Draft"));
}

// 主函数
const searchIndex = generateSearchIndex();
const outputPath = path.join(process.cwd(), "public/search-index.json");
fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2));

console.log(`Generated search index with ${searchIndex.length} posts`);
console.log(`Output: ${outputPath}`);
