"use client";

import { Moon, Plus, Sun, Trash2 } from "lucide-react";
import type { ChatSession, TimelineItem } from "@/types/chat";

interface SidebarProps {
  theme: "dark" | "light";
  language: "en" | "am";
  recentChats: ChatSession[];
  hasRecentChats: boolean;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  onStartNewChat: () => void;
  onOpenRecentChat: (sessionId: string) => void;
  onDeleteRecentChat: (sessionId: string) => void;
  timelineItems: TimelineItem[];
  onSelectTimeline: (item: TimelineItem) => void;
  onStartQuiz: () => void;
}

export default function Sidebar({
  theme,
  language,
  recentChats,
  hasRecentChats,
  onToggleTheme,
  onToggleLanguage,
  onStartNewChat,
  onOpenRecentChat,
  onDeleteRecentChat,
  timelineItems,
  onSelectTimeline,
  onStartQuiz,
}: SidebarProps) {
  const isAmharic = language === "am";

  return (
    <aside
      className={`h-full w-full md:w-72 border-r flex flex-col ${
        theme === "dark"
          ? "border-white/10 bg-black/30 backdrop-blur-xl"
          : "border-slate-300/80 bg-white/80 backdrop-blur-xl"
      }`}
    >
      <div className="p-4 space-y-3 border-b border-inherit">
        <button
          onClick={onToggleTheme}
          className={`w-full rounded-xl px-3 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
            theme === "dark"
              ? "bg-white/5 hover:bg-white/10"
              : "bg-slate-200/70 hover:bg-slate-200"
          }`}
        >
          <span>
            {theme === "dark"
              ? isAmharic
                ? "ጨለማ ሁኔታ"
                : "Dark mode"
              : isAmharic
                ? "ብርሃን ሁኔታ"
                : "Light mode"}
          </span>
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onToggleLanguage}
          className={`w-full rounded-xl px-3 py-2 text-sm font-medium flex items-center justify-between transition-colors ${
            theme === "dark"
              ? "bg-white/5 hover:bg-white/10"
              : "bg-slate-200/70 hover:bg-slate-200"
          }`}
        >
          <span>{isAmharic ? "ቋንቋ: አማርኛ" : "Language: English"}</span>
          <span className="text-xs">{isAmharic ? "AM" : "EN"}</span>
        </button>

        <button
          onClick={onStartNewChat}
          className={`w-full rounded-xl px-3 py-2 text-sm font-semibold flex items-center justify-between transition-colors ${
            theme === "dark"
              ? "bg-sky-500/25 hover:bg-sky-500/35"
              : "bg-sky-200 hover:bg-sky-300"
          }`}
        >
          <span>{isAmharic ? "አዲስ ውይይት" : "New chat"}</span>
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={onStartQuiz}
          className={`w-full rounded-xl px-3 py-2 text-sm font-semibold flex items-center justify-between transition-colors ${
            theme === "dark"
              ? "bg-amber-500/20 hover:bg-amber-500/30"
              : "bg-amber-200 hover:bg-amber-300"
          }`}
        >
          <span>{isAmharic ? "የአድዋ ፈተና" : "Quiz challenge"}</span>
          <span className="text-xs">5Q</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        <p
          className={`text-xs uppercase tracking-[0.12em] ${
            theme === "dark" ? "text-zinc-500" : "text-slate-500"
          }`}
        >
          {isAmharic ? "የጊዜ መስመር" : "Timeline mode"}
        </p>

        <div className="space-y-2">
          {timelineItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectTimeline(item)}
              className={`w-full rounded-xl px-3 py-2 text-left transition-colors ${
                theme === "dark"
                  ? "bg-white/5 hover:bg-white/10"
                  : "bg-slate-200/70 hover:bg-slate-200"
              }`}
            >
              <p className="text-xs font-semibold tracking-wide">{item.year}</p>
              <p className="text-sm">{item.label}</p>
            </button>
          ))}
        </div>

        <p
          className={`pt-2 text-xs uppercase tracking-[0.12em] ${
            theme === "dark" ? "text-zinc-500" : "text-slate-500"
          }`}
        >
          {isAmharic ? "የቅርብ ውይይቶች" : "Recent chats"}
        </p>

        {hasRecentChats ? (
          recentChats.map((chat) => (
            <div
              key={chat.id}
              className={`rounded-2xl border p-3 transition-colors ${
                theme === "dark"
                  ? "border-white/10 bg-black/35 hover:bg-black/50"
                  : "border-slate-300 bg-white/70 hover:bg-white"
              }`}
            >
              <button
                onClick={() => onOpenRecentChat(chat.id)}
                className="w-full text-left"
              >
                <p className="text-sm font-semibold truncate">{chat.title}</p>
                <p
                  className={`text-xs mt-1 line-clamp-1 ${
                    theme === "dark" ? "text-zinc-400" : "text-slate-500"
                  }`}
                >
                  {chat.preview}
                </p>
              </button>

              <button
                onClick={() => onDeleteRecentChat(chat.id)}
                className={`mt-2 inline-flex items-center gap-1 text-[11px] transition-colors ${
                  theme === "dark"
                    ? "text-zinc-500 hover:text-zinc-300"
                    : "text-slate-500 hover:text-slate-700"
                }`}
                title="Delete recent chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isAmharic ? "አስወግድ" : "Remove"}
              </button>
            </div>
          ))
        ) : (
          <p
            className={`text-sm ${
              theme === "dark" ? "text-zinc-400" : "text-slate-500"
            }`}
          >
            {isAmharic ? "እስካሁን የቅርብ ውይይት የለም።" : "No recent chats yet."}
          </p>
        )}
      </div>
    </aside>
  );
}
