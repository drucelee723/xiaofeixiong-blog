import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, getPostsBySeries } from "@/lib/posts";
import { extractHeadings } from "@/lib/toc";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { Comments } from "@/components/blog/Comments";
import { ShareButtons } from "@/components/blog/ShareButtons";

interface BlogPostPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));

  if (!post) {
    return {
      title: "文章未找到",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: ["小肥熊"],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug.join("/"));

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const seriesPosts = post.series ? getPostsBySeries(post.series) : [];

  return (
    <>
      <ReadingProgress />
      
      <article className="px-6 py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto lg:max-w-none lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
          {/* Main Content */}
          <div>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
              <Link href="/" className="hover:opacity-80 transition-opacity">
                首页
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:opacity-80 transition-opacity">
                博客
              </Link>
              <span>/</span>
              <span style={{ color: "var(--color-foreground)" }}>{post.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: "var(--color-primary-100)", color: "var(--color-primary-700)" }}>
                  {post.category}
                </span>
                {post.featured && (
                  <span className="px-3 py-1 text-sm rounded-full" style={{ backgroundColor: "var(--color-accent-100)", color: "var(--color-accent-700)" }}>
                    精选
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{post.title}</h1>
              
              <p className="text-lg mb-4" style={{ color: "var(--color-muted-foreground)" }}>{post.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(post.date).toLocaleDateString("zh-CN")}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {post.readingTime}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {post.author}
                </span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="px-2 py-1 text-xs rounded transition-colors"
                      style={{ backgroundColor: "var(--color-muted)" }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Series Navigation */}
            {seriesPosts.length > 1 && (
              <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: "var(--color-muted)" }}>
                <h3 className="font-semibold mb-3">📚 系列文章: {post.series}</h3>
                <div className="flex flex-wrap gap-2">
                  {seriesPosts.map((sp, index) => (
                    <Link
                      key={sp.slug}
                      href={`/blog/${sp.slug}`}
                      className="px-3 py-1 text-sm rounded transition-colors"
                      style={{
                        backgroundColor: sp.slug === post.slug ? "var(--color-primary-600)" : "var(--color-background)",
                        color: sp.slug === post.slug ? "white" : "inherit",
                      }}
                    >
                      {index + 1}. {sp.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.html }} 
            />

            {/* Footer */}
            <footer className="mt-12 pt-8" style={{ borderTop: "1px solid var(--color-border)" }}>
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div>
                  <h4 className="font-semibold mb-2">分享这篇文章</h4>
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </footer>

            {/* Comments */}
            <section className="mt-12">
              <h3 className="text-xl font-semibold mb-6">评论区</h3>
              <Comments />
            </section>
          </div>

          {/* Sidebar - TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <TableOfContents items={headings} />
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
