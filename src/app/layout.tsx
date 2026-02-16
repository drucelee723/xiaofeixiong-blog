import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "小肥熊的博客 | 嵌入式Linux & ROS开发",
    template: "%s | 小肥熊的博客",
  },
  description: "小肥熊的技术博客，专注于嵌入式Linux开发、ROS机器人操作系统、以及相关技术分享",
  keywords: ["嵌入式Linux", "ROS", "机器人", "嵌入式开发", "Linux内核", "驱动开发"],
  authors: [{ name: "小肥熊" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://xiaofeixiong.blog",
    siteName: "小肥熊的博客",
    description: "专注于嵌入式Linux和ROS开发的技术博客",
  },
  twitter: {
    card: "summary_large_image",
    title: "小肥熊的博客",
    description: "专注于嵌入式Linux和ROS开发的技术博客",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
