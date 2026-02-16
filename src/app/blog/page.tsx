import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";
import { BlogClient } from "./BlogClient";

// Server component - static data fetching at build time
export default function BlogPage() {
  const allPosts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <BlogClient 
      posts={allPosts} 
      categories={categories} 
      tags={tags} 
    />
  );
}
