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
  
  // 图片优化配置
  images: {
    unoptimized: true,
  },
  
  // 严格模式
  reactStrictMode: true,
  
  // 静态导出时忽略动态路由错误
  trailingSlash: true,
};

export default withMDX(nextConfig);
