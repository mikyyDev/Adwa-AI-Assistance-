"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (content: string) => void;
  theme: "dark" | "light";
  language: "en" | "am";
}

const MAX_HEIGHT = 192; // ≈ 8 lines

export default function ChatInput({ onSend, theme, language }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isAmharic = language === "am";

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";

    const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT);
    textarea.style.height = `${newHeight}px`;

    // enable scroll after max height
    textarea.style.overflowY =
      textarea.scrollHeight > MAX_HEIGHT ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");

    // reset height after send
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.overflowY = "hidden";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div
        className={`glass-input backdrop-blur-2xl rounded-3xl shadow-2xl p-2 flex items-end gap-3 ${
          theme === "dark"
            ? "bg-zinc-900/90 border border-white/10"
            : "bg-white/85 border border-slate-300/80"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isAmharic
              ? "ለአድዋ AI አገልጋይ መልዕክት ይጻፉ..."
              : "Message Adwa AI Assistance..."
          }
          rows={1}
          className={`flex-1 bg-transparent px-5 py-3.5 text-[15.5px] focus:outline-none resize-none leading-tight max-h-48 overflow-hidden scrollbar-thin ${
            theme === "dark"
              ? "text-zinc-100 placeholder-zinc-400"
              : "text-slate-900 placeholder-slate-500"
          }`}
        />

        <button
          type="button"
          aria-label="Send message"
          title="Send message"
          onClick={handleSubmit}
          disabled={!value.trim()}
          className={`h-10 w-10 flex items-center justify-center rounded-2xl disabled:opacity-40 transition-all active:scale-95 ${
            theme === "dark"
              ? "bg-white text-zinc-950 hover:bg-white/90"
              : "bg-slate-900 text-slate-50 hover:bg-slate-800"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            aria-hidden="true"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.874L5.999 12zm0 0h7.07"
            />
          </svg>
        </button>
      </div>

      <div
        className={`text-center text-[10px] mt-3 tracking-widest ${
          theme === "dark" ? "text-zinc-500" : "text-slate-600"
        }`}
      >
        {isAmharic
          ? "አድዋ AI አገልጋይ ስህተት ሊያደርግ ይችላል • አስፈላጊ መረጃን ያረጋግጡ"
          : "Adwa AI Assistance may make mistakes • Check Important Info"}
      </div>
    </div>
  );
}
