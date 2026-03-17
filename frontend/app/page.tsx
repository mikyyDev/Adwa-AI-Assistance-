"use client";

import { useEffect, useState } from "react";
import BackgroundEffects from "@/components/BackgroundEffects";
import ChatContainer from "@/components/ChatContainer";

type ThemeMode = "dark" | "light";

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    queueMicrotask(() => {
      const savedTheme = localStorage.getItem("chatTheme");
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        return;
      }

      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("chatTheme", theme);
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-zinc-950 text-zinc-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <BackgroundEffects theme={theme} />
      <ChatContainer theme={theme} onToggleTheme={toggleTheme} />
    </div>
  );
}
