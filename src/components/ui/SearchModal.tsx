"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

interface SearchIndexItem extends SearchResult {
  content: string;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<SearchIndexItem> | null>(null);

  // 加载搜索索引
  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: SearchIndexItem[]) => {
        const fuseInstance = new Fuse(data, {
          keys: [
            { name: "title", weight: 0.4 },
            { name: "description", weight: 0.3 },
            { name: "tags", weight: 0.2 },
            { name: "content", weight: 0.1 },
          ],
          threshold: 0.4,
          includeScore: true,
        });
        setFuse(fuseInstance);
      })
      .catch((error) => {
        console.error("Failed to load search index:", error);
      });
  }, []);

  const search = useCallback(
    (q: string) => {
      if (!q.trim() || !fuse) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const searchResults = fuse.search(q, { limit: 10 });
        setResults(
          searchResults.map((result) => ({
            slug: result.item.slug,
            title: result.item.title,
            description: result.item.description,
            category: result.item.category,
            tags: result.item.tags,
          }))
        );
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [fuse]
  );

  useEffect(() => {
    const debounce = setTimeout(() => {
      search(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="fixed left-1/2 top-[20%] w-full max-w-xl -translate-x-1/2 border rounded-xl shadow-2xl overflow-hidden"
        style={{ 
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-border)"
        }}
      >
        {/* Search Input */}
        <div 
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent outline-none placeholder:opacity-60"
            style={{ color: "var(--color-foreground)" }}
            autoFocus
          />
          <kbd 
            className="px-2 py-0.5 text-xs rounded"
            style={{ 
              backgroundColor: "var(--color-muted)",
              border: "1px solid var(--color-border)"
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto">
          {!fuse && (
            <div 
              className="flex items-center justify-center py-8"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              加载搜索索引...
            </div>
          )}

          {loading && (
            <div 
              className="flex items-center justify-center py-8"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              搜索中...
            </div>
          )}

          {fuse && !loading && query && results.length === 0 && (
            <div 
              className="flex flex-col items-center justify-center py-8"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              <p>没有找到相关文章</p>
              <p className="text-sm mt-1">试试其他关键词？</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="py-2">
              {results.map((result) => (
                <li key={result.slug}>
                  <Link
                    href={`/blog/${result.slug}/`}
                    onClick={onClose}
                    className="flex flex-col gap-1 px-4 py-2.5 cursor-pointer transition-colors"
                    style={{ color: "var(--color-foreground)" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-muted)"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <span className="font-medium">{result.title}</span>
                    <span 
                      className="text-sm line-clamp-1"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {result.description}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: "var(--color-primary-100)",
                          color: "var(--color-primary-700)"
                        }}
                      >
                        {result.category}
                      </span>
                      {result.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="text-xs"
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
