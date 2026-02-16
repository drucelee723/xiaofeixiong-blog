const fs = require('fs');
const content = `@import "tailwindcss";

/* ============================================
   小肥熊博客 - 设计系统 v2.0
   工业技术风格，专注嵌入式Linux & ROS
   ============================================ */

@theme inline {
  /* Primary Colors - 深邃蓝 */
  --color-primary-50: oklch(0.97 0.01 250);
  --color-primary-100: oklch(0.94 0.02 250);
  --color-primary-200: oklch(0.88 0.04 250);
  --color-primary-300: oklch(0.80 0.08 250);
  --color-primary-400: oklch(0.70 0.12 250);
  --color-primary-500: oklch(0.55 0.18 250);
  --color-primary-600: oklch(0.45 0.20 250);
  --color-primary-700: oklch(0.38 0.18 250);
  --color-primary-800: oklch(0.32 0.14 250);
  --color-primary-900: oklch(0.28 0.10 250);
  --color-primary-950: oklch(0.20 0.06 250);

  /* Accent - ROS活力橙 */
  --color-accent-50: oklch(0.97 0.02 40);
  --color-accent-100: oklch(0.94 0.04 40);
  --color-accent-200: oklch(0.88 0.08 40);
  --color-accent-300: oklch(0.80 0.14 40);
  --color-accent-400: oklch(0.70 0.20 40);
  --color-accent-500: oklch(0.65 0.22 40);
  --color-accent-600: oklch(0.55 0.20 40);
  --color-accent-700: oklch(0.45 0.16 40);
  --color-accent-800: oklch(0.38 0.12 40);
  --color-accent-900: oklch(0.32 0.08 40);

  /* Success - Linux绿色 */
  --color-success-500: oklch(0.65 0.18 145);
  --color-success-600: oklch(0.55 0.16 145);

  /* Semantic Colors - Light Mode */
  --color-background: oklch(0.995 0 0);
  --color-foreground: oklch(0.18 0.02 250);
  --color-card: oklch(0.99 0 0);
  --color-card-foreground: oklch(0.18 0.02 250);
  --color-muted: oklch(0.96 0.01 250);
  --color-muted-foreground: oklch(0.48 0.02 250);
  --color-border: oklch(0.91 0.01 250);
  --color-ring: oklch(0.55 0.18 250);
  --color-code-bg: oklch(0.97 0.01 250);
  --color-sidebar-bg: oklch(0.98 0.005 250);
  --color-sidebar-border: oklch(0.92 0.01 250);

  /* Fonts */
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), ui-monospace, monospace;
}

/* Dark Mode Theme Override */
.dark {
  --color-background: oklch(0.12 0.02 250);
  --color-foreground: oklch(0.94 0.01 250);
  --color-card: oklch(0.15 0.02 250);
  --color-card-foreground: oklch(0.94 0.01 250);
  --color-muted: oklch(0.20 0.02 250);
  --color-muted-foreground: oklch(0.62 0.01 250);
  --color-border: oklch(0.26 0.02 250);
  --color-ring: oklch(0.60 0.18 250);
  --color-code-bg: oklch(0.16 0.02 250);
  --color-sidebar-bg: oklch(0.10 0.02 250);
  --color-sidebar-border: oklch(0.22 0.02 250);
}

/* Base Styles */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  letter-spacing: -0.02em;
}

h1 { font-size: 1.875rem; line-height: 2.25rem; }
h2 { font-size: 1.5rem; line-height: 2rem; }
h3 { font-size: 1.25rem; line-height: 1.75rem; }
h4 { font-size: 1.125rem; line-height: 1.75rem; }

@media (min-width: 768px) {
  h1 { font-size: 2.25rem; line-height: 2.5rem; }
  h2 { font-size: 1.875rem; line-height: 2.25rem; }
  h3 { font-size: 1.5rem; line-height: 2rem; }
  h4 { font-size: 1.25rem; line-height: 1.75rem; }
}

/* Animations */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes gradientFlow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-fade-in { animation: fadeInUp 0.4s ease-out forwards; }
.animate-fade-in-delay-1 { animation: fadeInUp 0.4s ease-out 0.1s forwards; opacity: 0; }
.animate-fade-in-delay-2 { animation: fadeInUp 0.4s ease-out 0.2s forwards; opacity: 0; }
.animate-fade-in-delay-3 { animation: fadeInUp 0.4s ease-out 0.3s forwards; opacity: 0; }
.animate-gradient { background-size: 200% 200%; animation: gradientFlow 6s ease infinite; }
.animate-float { animation: float 3s ease-in-out infinite; }

/* Interactive Components */
.card-hover {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  border-color: var(--color-primary-400);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08), 0 0 0 1px var(--color-primary-200);
}

.dark .card-hover:hover {
  border-color: var(--color-primary-600);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--color-primary-800);
}

.btn-primary {
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.4s ease;
}

.btn-primary:hover::before { left: 100%; }

.nav-link-indicator { position: relative; }

.nav-link-indicator::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary-500), var(--color-accent-500));
  transition: all 0.25s ease;
  transform: translateX(-50%);
}

.nav-link-indicator:hover::after,
.nav-link-indicator.active::after { width: 100%; }

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500));
  color: white;
  transition: all 0.2s ease;
}

.icon-wrapper:hover {
  transform: rotate(-3deg) scale(1.05);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Category Icons */
.category-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.category-icon.linux { background: linear-gradient(135deg, #f9a825 0%, #ff6f00 100%); }
.category-icon.ros { background: linear-gradient(135deg, #223262 0%, #1a237e 100%); }
.category-icon.hardware { background: linear-gradient(135deg, #00796b 0%, #004d40 100%); }
.category-icon.tools { background: linear-gradient(135deg, #7b1fa2 0%, #4a148c 100%); }

/* Prose Styles */
.prose {
  color: var(--color-foreground);
  line-height: 1.75;
  max-width: 820px;
}

.prose h1 { margin-top: 2rem; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--color-border); }
.prose h2 { margin-top: 2.5rem; margin-bottom: 1rem; }
.prose h3 { margin-top: 2rem; margin-bottom: 0.75rem; }
.prose p { margin-top: 1rem; margin-bottom: 1rem; }

.prose a {
  color: var(--color-primary-600);
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: color 0.15s ease;
}

.prose a:hover { color: var(--color-primary-700); }
.dark .prose a { color: var(--color-primary-400); }
.dark .prose a:hover { color: var(--color-primary-300); }

.prose ul, .prose ol { margin-top: 1rem; margin-bottom: 1rem; padding-left: 1.5rem; }
.prose ul { list-style-type: disc; }
.prose ol { list-style-type: decimal; }
.prose li { margin-top: 0.5rem; margin-bottom: 0.5rem; }

.prose blockquote {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--color-primary-500);
  background-color: var(--color-muted);
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: var(--color-muted-foreground);
}

.prose hr { margin-top: 2rem; margin-bottom: 2rem; border-color: var(--color-border); }

.prose img {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08);
}

.prose table { margin-top: 1.5rem; margin-bottom: 1.5rem; width: 100%; border-collapse: collapse; }
.prose th, .prose td { border: 1px solid var(--color-border); padding: 0.75rem 1rem; }
.prose th { background-color: var(--color-muted); font-weight: 600; }

.prose pre {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  padding: 1rem;
  background-color: var(--color-code-bg);
