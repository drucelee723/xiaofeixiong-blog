"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

export function Comments() {
  const { theme } = useTheme();

  return (
    <Giscus
      repo="your-username/xiaofeixiong-blog"
      repoId="your-repo-id"
      category="Announcements"
      categoryId="your-category-id"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === "dark" ? "dark" : "light"}
      lang="zh-CN"
      loading="lazy"
    />
  );
}
