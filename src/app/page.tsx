import Link from "next/link";
import { getAllPosts, getFeaturedPosts } from "@/lib/posts";
import { PostCard } from "@/components/blog/PostCard";
import { ReactNode } from "react";

// SVG Icons - Heroicons style
const Icons = {
  BearLogo: () => (
    <svg viewBox="0 0 40 40" fill="none" className="w-16 h-16">
      <circle cx="20" cy="24" r="12" fill="url(#bearGradient)" />
      <circle cx="11" cy="14" r="5" fill="url(#bearGradient)" />
      <circle cx="29" cy="14" r="5" fill="url(#bearGradient)" />
      <circle cx="15" cy="22" r="2.5" fill="#1e293b"/>
      <circle cx="25" cy="22" r="2.5" fill="#1e293b"/>
      <ellipse cx="20" cy="27" rx="3" ry="2.5" fill="#334155"/>
      <defs>
        <linearGradient id="bearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-primary-500)" />
          <stop offset="100%" stopColor="var(--color-accent-500)" />
        </linearGradient>
      </defs>
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  ),
  Document: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  Linux: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2.5 0-4.5 2-4.5 4.5 0 1 .3 2 .8 2.8L7 12c-2 2.5-2.5 5.5-1 7.5 1 1.5 3 2.5 5 2.5h2c2 0 4-1 5-2.5 1.5-2 1-5-1-7.5l-1.3-1.7c.5-.8.8-1.8.8-2.8C16.5 5 14.5 3 12 3z" />
      <circle cx="10" cy="8" r="1" fill="currentColor"/>
      <circle cx="14" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
  Robot: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  Chip: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
    </svg>
  ),
  Wrench: () => (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
};

const categories = [
  {
    title: "嵌入式Linux",
    description: "Linux内核、驱动开发、系统移植、Buildroot",
    Icon: Icons.Linux,
    href: "/blog?category=embedded-linux",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "ROS开发",
    description: "ROS/ROS2、机器人导航、SLAM、感知",
    Icon: Icons.Robot,
    href: "/blog?category=ros",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    title: "硬件开发",
    description: "ARM处理器、嵌入式硬件设计、PCB",
    Icon: Icons.Chip,
    href: "/blog?category=hardware",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "开发工具",
    description: "Git、CMake、交叉编译、调试技巧",
    Icon: Icons.Wrench,
    href: "/blog?category=tools",
    gradient: "from-violet-500 to-purple-500",
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 6);
  const featuredPosts = getFeaturedPosts();

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6" style={{ 
            backgroundColor: "color-mix(in srgb, var(--color-primary-100) 50%, transparent)",
            color: "var(--color-primary-700)"
          }}>
            <Icons.Document />
            <span>嵌入式 & ROS 技术博客</span>
          </div>

          {/* Title with Logo */}
          <div className="flex items-center gap-4 mb-6">
            <div className="shrink-0">
              <Icons.BearLogo />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
                你好，我是{" "}
                <span className="bg-clip-text text-transparent" style={{
                  backgroundImage: "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))"
                }}>
                  小肥熊
                </span>
              </h1>
            </div>
          </div>

          <p className="text-xl mb-8 max-w-2xl leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
            专注于嵌入式 Linux 和 ROS 机器人开发，分享技术学习心得、项目经验与开发技巧
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ 
                background: "linear-gradient(135deg, var(--color-primary-600), var(--color-primary-500))",
                color: "white"
              }}
            >
              <span>浏览文章</span>
              <Icons.ArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
              style={{ 
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)"
              }}
            >
              关于我
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="px-6 py-8" style={{ 
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        backgroundColor: "var(--color-muted)"
      }}>
        <div className="flex flex-wrap gap-12 justify-center lg:justify-start">
          <StatCard number={`${getAllPosts().length}+`} label="篇文章" />
          <StatCard number="4" label="个分类" />
          <StatCard number="ROS2" label="主要技术栈" />
          <StatCard number="24/7" label="持续更新" />
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="px-6 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-1">精选文章</h2>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>精心挑选的优质内容</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors hover:opacity-80"
              style={{ color: "var(--color-primary-600)" }}
            >
              查看全部
              <Icons.ArrowRight />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPosts.slice(0, 2).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">最新文章</h2>
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>最近发布的技术文章</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium cursor-pointer transition-colors"
            style={{ color: "var(--color-primary-600)" }}
          >
            查看全部
            <Icons.ArrowRight />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Categories Overview */}
      <section className="px-6 py-16" style={{ backgroundColor: "var(--color-muted)" }}>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">技术领域</h2>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>探索不同方向的技术内容</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <div className="text-3xl font-bold" style={{ color: "var(--color-primary-600)" }}>
        {number}
      </div>
      <div className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
    </div>
  );
}

function CategoryCard({
  title,
  description,
  Icon,
  href,
  gradient,
}: {
  title: string;
  description: string;
  Icon: () => ReactNode;
  href: string;
  gradient: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 rounded-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      style={{ 
        border: "1px solid var(--color-border)",
        backgroundColor: "var(--color-background)"
      }}
    >
      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon />
      </div>
      <h3 className="font-semibold mb-2 group-hover:translate-x-1 transition-transform" style={{ color: "var(--color-foreground)" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
        {description}
      </p>
    </Link>
  );
}
