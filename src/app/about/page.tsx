import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我",
  description: "了解小肥熊 - 一名热爱嵌入式Linux和ROS开发的工程师",
};

export default function AboutPage() {
  return (
    <div className="px-6 py-12 animate-fade-in max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-6xl">
          🐻
        </div>
        <h1 className="text-3xl font-bold mb-2">小肥熊</h1>
        <p className="text-muted-foreground text-lg">嵌入式工程师 · ROS开发者</p>
      </div>

      {/* Bio */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">关于我</h2>
        <div className="prose max-w-none">
          <p>
            你好！我是小肥熊，一名专注于嵌入式Linux和ROS机器人开发的工程师。
          </p>
          <p>
            我热爱技术，喜欢探索底层系统的奥秘。从Linux内核到驱动开发，从ROS1到ROS2，
            我一直在机器人领域深耕细作。我相信技术分享能够帮助更多人成长，这也是我创建这个博客的初衷。
          </p>
          <p>
            在工作之余，我会在这个博客分享我的学习心得、项目经验和技术探索。希望我的文章能对你有所帮助！
          </p>
        </div>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">技术栈</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <SkillCategory
            title="嵌入式Linux"
            skills={[
              "Linux内核开发",
              "驱动开发 (字符设备, 平台设备)",
              "Buildroot/Yocto",
              "ARM架构",
              "设备树 (Device Tree)",
            ]}
          />
          <SkillCategory
            title="ROS开发"
            skills={[
              "ROS1 / ROS2",
              "导航栈 (Nav2)",
              "SLAM (Cartographer, GMapping)",
              "MoveIt运动规划",
              "传感器融合",
            ]}
          />
          <SkillCategory
            title="编程语言"
            skills={[
              "C/C++",
              "Python",
              "Shell/Bash",
              "CMake",
            ]}
          />
          <SkillCategory
            title="工具和框架"
            skills={[
              "Git版本控制",
              "GDB调试",
              "Docker容器化",
              "Qt界面开发",
              "OpenCV图像处理",
            ]}
          />
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">经历</h2>
        <div className="space-y-6">
          <TimelineItem
            date="2023 - 至今"
            title="高级嵌入式工程师"
            description="负责机器人底层系统开发，包括Linux内核裁剪、驱动开发和ROS2系统集成"
          />
          <TimelineItem
            date="2021 - 2023"
            title="ROS开发工程师"
            description="开发移动机器人导航系统，实现多传感器融合和自主导航"
          />
          <TimelineItem
            date="2019 - 2021"
            title="嵌入式软件工程师"
            description="开发ARM平台嵌入式应用，负责BSP和驱动开发"
          />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-bold mb-4">联系方式</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:your-email@example.com"
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            邮箱
          </a>
          <Link
            href="/api/rss"
            className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5c7.18 0 13 5.82 13 13M6 11a7 7 0 017 7m-6 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
            RSS订阅
          </Link>
        </div>
      </section>
    </div>
  );
}

function SkillCategory({ title, skills }: { title: string; skills: string[] }) {
  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {skills.map((skill) => (
          <li key={skill} className="text-sm text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TimelineItem({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 bg-primary-500 rounded-full" />
        <div className="flex-1 w-0.5 bg-border" />
      </div>
      <div className="pb-6">
        <div className="text-sm text-muted-foreground mb-1">{date}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
