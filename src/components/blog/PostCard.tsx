import Link from "next/link";
import { PostMeta } from "@/lib/posts";

// SVG Icons
const Icons = {
  Clock: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  ),
  Star: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
  ),
};

interface PostCardProps {
  post: PostMeta;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article 
      className="group rounded-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ 
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-card)"
      }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-lg font-semibold leading-tight group-hover:translate-x-0.5 transition-transform" style={{ color: "var(--color-foreground)" }}>
            {post.title}
          </h3>
          {post.featured && (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full" style={{ 
              backgroundColor: "color-mix(in srgb, var(--color-accent-100) 50%, transparent)",
              color: "var(--color-accent-700)"
            }}>
              <Icons.Star />
              精选
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm mb-4 line-clamp-2 leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
          {post.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          <span className="inline-flex items-center gap-1.5">
            <Icons.Calendar />
            {new Date(post.date).toLocaleDateString("zh-CN")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icons.Clock />
            {post.readingTime}
          </span>
          <span 
            className="px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            {post.category}
          </span>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full transition-colors"
                style={{ 
                  backgroundColor: "color-mix(in srgb, var(--color-primary-100) 50%, transparent)",
                  color: "var(--color-primary-700)"
                }}
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Read More */}
        <div className="flex items-center gap-1 mt-4 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary-600)" }}>
          <span>阅读更多</span>
          <span className="group-hover:translate-x-1 transition-transform">
            <Icons.ArrowRight />
          </span>
        </div>
      </Link>
    </article>
  );
}
