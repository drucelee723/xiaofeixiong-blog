"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SearchModal } from "@/components/ui/SearchModal";

// SVG Icons
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  ),
  Sun: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  Moon: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  ),
  GitHub: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2c5.523 0 10 4.477 10 10 0 4.42-2.865 8.17-6.839 9.49-.5.092-.682-.217-.682-.482 0-.237.008-.866.013-1.703 2.782.604 3.369-1.34 3.369-1.34.454-1.156 1.11-1.464 1.11-1.464.908-.62-.069-.608-.069-.608-1.003.07-1.531 1.03-1.531 1.03-.892 1.528-2.341 1.087-2.91.831-.092-.646-.35-1.086-.636-1.335 2.22-.253 4.555-1.11 4.555-4.943 0-1.091-.39-1.984-1.029-2.683.103-.252.446-1.267-.098-2.643 0 0-.84-.269-2.75 1.025A9.578 9.578 0 0 0 12 6.836c-.85.004-1.705.114-2.504.336-1.909-1.294-2.75-1.025-2.75-1.025-.546 1.376-.203 2.391-.1 2.643-.64.699-1.029 1.592-1.029 2.683 0 3.833 2.332 4.69 4.551 4.943-.285.249-.543.728-.636 1.335-.572.264-1.965.308-2.91-1.093-.394-.685-1.176-1.178-1.176-1.178-.683-.008-.075.433-.075.433.454.313.769 1.017.769 1.017.407 1.24 2.337.833 2.922.648.09-.647.355-1.086.646-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.252-.446-1.267.098-2.643 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.75-1.025 2.75-1.025.546 1.376.203 2.391.1 2.643.64.699 1.029 1.592 1.029 2.683 0 3.833-2.332 4.69-4.551 4.943.357.307.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.135 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  ),
};

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <header 
        className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-all duration-300"
        style={{ 
          borderColor: "var(--color-border)",
          backgroundColor: "color-mix(in srgb, var(--color-background) 85%, transparent)"
        }}
      >
        <div className="flex h-14 items-center px-4 lg:px-6">
          {/* Mobile menu button placeholder */}
          <div className="lg:hidden w-10" />

          {/* Search */}
          <div className="flex-1 flex justify-center lg:justify-start">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2.5 px-4 py-2 text-sm rounded-full cursor-pointer transition-all duration-200 w-full max-w-md group"
              style={{ 
                color: "var(--color-muted-foreground)",
                backgroundColor: "var(--color-muted)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--color-muted) 80%, transparent)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-muted)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span className="opacity-60 group-hover:opacity-100 transition-opacity">
                <Icons.Search />
              </span>
              <span className="flex-1 text-left">搜索文章...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-md font-mono" style={{ 
                backgroundColor: "var(--color-background)",
                border: "1px solid var(--color-border)"
              }}>
                <span className="opacity-60">⌘</span>
                <span className="opacity-60">K</span>
              </kbd>
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative p-2.5 rounded-xl cursor-pointer transition-all duration-200 group"
                style={{ color: "var(--color-muted-foreground)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-muted)";
                  e.currentTarget.style.color = "var(--color-foreground)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-muted-foreground)";
                }}
                aria-label="切换主题"
              >
                <span className="relative z-10">
                  {theme === "dark" ? <Icons.Sun /> : <Icons.Moon />}
                </span>
              </button>
            )}

            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl cursor-pointer transition-all duration-200"
              style={{ color: "var(--color-muted-foreground)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-muted)";
                e.currentTarget.style.color = "var(--color-foreground)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-muted-foreground)";
              }}
              aria-label="GitHub"
            >
              <Icons.GitHub />
            </a>
          </div>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
