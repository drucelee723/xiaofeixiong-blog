import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "项目展示",
  description: "小肥熊的开源项目和实战项目展示",
};

const projects = [
  {
    title: "移动机器人导航系统",
    description: "基于ROS2的自主移动机器人导航系统，支持SLAM建图、路径规划和避障功能。",
    tags: ["ROS2", "Nav2", "SLAM", "C++"],
    category: "ROS开发",
    status: "进行中",
    github: "https://github.com",
    demo: null,
    featured: true,
  },
  {
    title: "Linux驱动框架",
    description: "通用的Linux字符设备驱动框架，支持设备树配置和中断处理。",
    tags: ["Linux", "驱动开发", "C", "设备树"],
    category: "嵌入式Linux",
    status: "已完成",
    github: "https://github.com",
    demo: null,
    featured: true,
  },
  {
    title: "机器人仿真平台",
    description: "基于Gazebo的机器人仿真环境，用于算法验证和功能测试。",
    tags: ["Gazebo", "ROS2", "Python"],
    category: "ROS开发",
    status: "已完成",
    github: "https://github.com",
    demo: null,
    featured: false,
  },
  {
    title: "嵌入式图像处理模块",
    description: "ARM平台上的实时图像处理模块，支持目标检测和跟踪。",
    tags: ["OpenCV", "ARM", "C++", "YOLO"],
    category: "硬件开发",
    status: "已完成",
    github: "https://github.com",
    demo: null,
    featured: false,
  },
];

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <div className="px-6 py-12 animate-fade-in">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">项目展示</h1>
        <p className="text-muted-foreground text-lg">
          我参与开发的一些开源项目和实战项目
        </p>
      </div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">精选项目</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {/* Other Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-6">其他项目</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {otherProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 p-6 bg-muted rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-2">想了解更多？</h3>
        <p className="text-muted-foreground mb-4">
          欢迎查看我的GitHub获取更多项目详情
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          访问 GitHub
        </a>
      </section>
    </div>
  );
}

function ProjectCard({
  project,
  featured = false,
}: {
  project: (typeof projects)[0];
  featured?: boolean;
}) {
  return (
    <div
      className={`group border border-border rounded-lg p-6 hover:border-primary-500/50 transition-all bg-card ${
        featured ? "bg-gradient-to-br from-card to-muted/50" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>
        <span
          className={`px-2 py-0.5 text-xs rounded ${
            project.status === "进行中"
              ? "bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300"
              : "bg-success-500/20 text-success-600"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 text-xs bg-muted rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-3">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            源码
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            演示
          </a>
        )}
      </div>
    </div>
  );
}
