"use client";

import { useState } from "react";
import { PostCard } from "@/components/blog/PostCard";
import type { PostMeta } from "@/lib/posts";

// SVG Icons
const Icons = {
  Document: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  Funnel: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    </svg>
  ),
  Close: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ),
  Inbox: () => (
    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
  ),
};

interface BlogClientProps {
  posts: PostMeta[];
  categories: string[];
  tags: string[];
}

export function BlogClient({ posts, categories, tags }: BlogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter posts based on selected category and tag
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) {
      return false;
    }
    if (selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  return (
    <div className="px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span style={{ color: "var(--color-primary-500)" }}><Icons.Document /></span>
          <h1 className="text-3xl font-bold">博客文章</h1>
        </div>
        <p style={{ color: "var(--color-muted-foreground)" }}>
          共 <span className="font-semibold" style={{ color: "var(--color-primary-600)" }}>{filteredPosts.length}</span> 篇文章
          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-sm" style={{ backgroundColor: "var(--color-primary-100)", color: "var(--color-primary-700)" }}>
              分类: {selectedCategory}
              <button onClick={() => setSelectedCategory(null)} className="cursor-pointer hover:opacity-70 transition-opacity"><Icons.Close /></button>
            </span>
          )}
          {selectedTag && (
            <span className="inline-flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full text-sm" style={{ backgroundColor: "var(--color-accent-100)", color: "var(--color-accent-700)" }}>
              标签: {selectedTag}
              <button onClick={() => setSelectedTag(null)} className="cursor-pointer hover:opacity-70 transition-opacity"><Icons.Close /></button>
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8 pb-6" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ color: "var(--color-muted-foreground)" }}><Icons.Funnel /></span>
            <h3 className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>分类筛选</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-1.5 text-sm rounded-full cursor-pointer transition-all duration-200 font-medium"
              style={{
                backgroundColor: !selectedCategory ? "var(--color-primary-600)" : "var(--color-muted)",
                color: !selectedCategory ? "white" : "var(--color-foreground)"
              }}
            >
              全部
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className="px-4 py-1.5 text-sm rounded-full cursor-pointer transition-all duration-200 hover:shadow-sm"
                style={{
                  backgroundColor: selectedCategory === category ? "var(--color-primary-600)" : "var(--color-muted)",
                  color: selectedCategory === category ? "white" : "var(--color-foreground)"
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl" style={{ backgroundColor: "var(--color-muted)" }}>
          <div className="flex justify-center mb-4" style={{ color: "var(--color-muted-foreground)" }}><Icons.Inbox /></div>
          <p className="text-lg font-medium mb-2" style={{ color: "var(--color-foreground)" }}>暂无相关文章</p>
          <p className="text-sm mb-4" style={{ color: "var(--color-muted-foreground)" }}>尝试其他筛选条件或浏览全部文章</p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 hover:shadow-md"
            style={{ backgroundColor: "var(--color-primary-600)", color: "white" }}
          >
            查看全部文章
          </button>
        </div>
      )}

      {/* Tags Cloud */}
      {tags.length > 0 && (
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: "var(--color-muted-foreground)" }}><Icons.Tag /></span>
            <h3 className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>标签云</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className="px-3 py-1.5 text-sm rounded-full cursor-pointer transition-all duration-200 hover:shadow-sm"
                style={{
                  backgroundColor: selectedTag === tag ? "var(--color-primary-100)" : "var(--color-muted)",
                  color: selectedTag === tag ? "var(--color-primary-700)" : "var(--color-foreground)"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
