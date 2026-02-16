"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// SVG Icons - Heroicons style
const Icons = {
  // Logo - Bear face
  BearLogo: () => (
    <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
      <circle cx="16" cy="18" r="10" fill="currentColor" opacity="0.9"/>
      <circle cx="10" cy="10" r="4" fill="currentColor"/>
      <circle cx="22" cy="10" r="4" fill="currentColor"/>
      <circle cx="12" cy="16" r="2" fill="#1a1a2e"/>
      <circle cx="20" cy="16" r="2" fill="#1a1a2e"/>
      <ellipse cx="16" cy="20" rx="2.5" ry="2" fill="#2d2d44"/>
    </svg>
  ),
  // Home
  Home: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  // Document/Blog
  Document: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  // Rocket/Projects
  Rocket: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  ),
  // User/About
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  ),
  // Linux/Penguin
  Linux: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-2.5 0-4.5 2-4.5 4.5 0 1 .3 2 .8 2.8L7 12c-2 2.5-2.5 5.5-1 7.5 1 1.5 3 2.5 5 2.5h2c2 0 4-1 5-2.5 1.5-2 1-5-1-7.5l-1.3-1.7c.5-.8.8-1.8.8-2.8C16.5 5 14.5 3 12 3z" />
      <circle cx="10" cy="8" r="1" fill="currentColor"/>
      <circle cx="14" cy="8" r="1" fill="currentColor"/>
    </svg>
  ),
  // Robot/ROS
  Robot: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  ),
  // Hardware/Chip
  Chip: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
    </svg>
  ),
  // Tools/Wrench
  Wrench: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  ),
  // Heart
  Heart: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
    </svg>
  ),
};

const categories = [
  {
    name: "嵌入式Linux",
    href: "/blog?category=embedded-linux",
    Icon: Icons.Linux,
    description: "Linux内核、驱动开发、系统移植",
  },
  {
    name: "ROS开发",
    href: "/blog?category=ros",
    Icon: Icons.Robot,
    description: "ROS/ROS2、机器人应用开发",
  },
  {
    name: "硬件开发",
    href: "/blog?category=hardware",
    Icon: Icons.Chip,
    description: "ARM、嵌入式硬件设计",
  },
  {
    name: "工具使用",
    href: "/blog?category=tools",
    Icon: Icons.Wrench,
    description: "开发工具、调试技巧",
  },
];

const links = [
  { name: "快速开始", href: "/blog/getting-started" },
  { name: "学习路线", href: "/blog/learning-path" },
  { name: "项目实战", href: "/projects" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-[280px] border-r h-screen sticky top-0" style={{ borderColor: "var(--color-sidebar-border)", backgroundColor: "var(--color-sidebar-bg)" }}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-6 h-14 border-b cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: "var(--color-sidebar-border)" }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))" }}>
          <Icons.BearLogo />
        </div>
        <div>
          <h1 className="font-semibold text-sm">小肥熊</h1>
          <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>嵌入式 & ROS</p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {/* Main Links */}
        <div className="px-3 mb-4">
          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
              pathname === "/"
                ? "shadow-sm"
                : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: pathname === "/" ? "var(--color-primary-100)" : "transparent",
              color: pathname === "/" ? "var(--color-primary-700)" : "var(--color-foreground)",
            }}
          >
            <Icons.Home />
            <span className="font-medium">首页</span>
          </Link>
          <Link
            href="/blog"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer mt-1 ${
              pathname.startsWith("/blog") ? "shadow-sm" : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: pathname.startsWith("/blog") ? "var(--color-primary-100)" : "transparent",
              color: pathname.startsWith("/blog") ? "var(--color-primary-700)" : "var(--color-foreground)",
            }}
          >
            <Icons.Document />
            <span className="font-medium">博客文章</span>
          </Link>
          <Link
            href="/projects"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer mt-1 ${
              pathname === "/projects" ? "shadow-sm" : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: pathname === "/projects" ? "var(--color-primary-100)" : "transparent",
              color: pathname === "/projects" ? "var(--color-primary-700)" : "var(--color-foreground)",
            }}
          >
            <Icons.Rocket />
            <span className="font-medium">项目展示</span>
          </Link>
          <Link
            href="/about"
            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer mt-1 ${
              pathname === "/about" ? "shadow-sm" : "hover:shadow-sm"
            }`}
            style={{
              backgroundColor: pathname === "/about" ? "var(--color-primary-100)" : "transparent",
              color: pathname === "/about" ? "var(--color-primary-700)" : "var(--color-foreground)",
            }}
          >
            <Icons.User />
            <span className="font-medium">关于我</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="mx-6 mb-4 h-px" style={{ backgroundColor: "var(--color-border)" }} />

        {/* Categories */}
        <div className="px-3 mb-4">
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            技术分类
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer group hover:shadow-sm"
                style={{ backgroundColor: "transparent" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--color-muted)"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <span className="opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-primary-500)" }}>
                  <category.Icon />
                </span>
                <div className="flex-1">
                  <div className="font-medium group-hover:translate-x-0.5 transition-transform" style={{ color: "var(--color-foreground)" }}>
                    {category.name}
                  </div>
                  <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    {category.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="px-3">
          <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
            快速链接
          </h3>
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-200 hover:translate-x-1"
                style={{ color: "var(--color-muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-muted)";
                  e.currentTarget.style.color = "var(--color-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-muted-foreground)";
                }}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t" style={{ borderColor: "var(--color-sidebar-border)" }}>
        <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          <p>© 2024 小肥熊的博客</p>
          <p className="mt-1 flex items-center gap-1">
            Powered by Next.js 
            <span style={{ color: "var(--color-accent-500)" }}>
              <Icons.Heart />
            </span>
          </p>
        </div>
      </div>
    </aside>
  );
}
