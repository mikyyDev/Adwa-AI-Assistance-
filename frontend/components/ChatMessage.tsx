"use client";

import { useEffect, useState } from "react";
import type { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  shouldType?: boolean;
  theme: "dark" | "light";
}

const THINKING_DELAY_MS = 650;

const hasHtmlTags = (value: string) => /<[^>]+>/.test(value);

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const toStyledHtml = (raw: string) => {
  if (hasHtmlTags(raw)) return raw;

  const lines = raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.trim());

  const html: string[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (!listType || !listBuffer.length) return;
    html.push(
      `<${listType} style=\"margin-left:20px; margin-top:8px; margin-bottom:12px;\">${listBuffer.join("")}</${listType}>`,
    );
    listBuffer = [];
    listType = null;
  };

  for (const line of lines) {
    if (!line) {
      flushList();
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (bulletMatch) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(
        `<li style=\"margin-bottom:6px;\">${escapeHtml(bulletMatch[1])}</li>`,
      );
      continue;
    }

    if (orderedMatch) {
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      listBuffer.push(
        `<li style=\"margin-bottom:6px;\">${escapeHtml(orderedMatch[1])}</li>`,
      );
      continue;
    }

    flushList();

    if (line.endsWith(":")) {
      html.push(
        `<h3 style=\"margin-top:20px; margin-bottom:8px;\">${escapeHtml(line)}</h3>`,
      );
      continue;
    }

    html.push(`<p style=\"margin-bottom:10px;\">${escapeHtml(line)}</p>`);
  }

  flushList();

  return `<div style=\"font-family: Arial, sans-serif; line-height:1.6;\">${html.join("")}</div>`;
};

export default function ChatMessage({
  message,
  shouldType = false,
  theme,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  const [displayedText, setDisplayedText] = useState(
    isUser || !shouldType ? message.content : "",
  );

  const [isTypingFinished, setIsTypingFinished] = useState(
    isUser || !shouldType,
  );

  useEffect(() => {
    if (isUser || !shouldType) {
      setDisplayedText(message.content);
      setIsTypingFinished(true);
      return;
    }

    setDisplayedText("");
    setIsTypingFinished(false);

    const timeout = window.setTimeout(() => {
      setDisplayedText(message.content);
      setIsTypingFinished(true);
    }, THINKING_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [message.content, isUser, shouldType]);

  const content = isTypingFinished ? message.content : displayedText;
  const styledBotContent =
    !isUser && isTypingFinished ? toStyledHtml(content) : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`
          max-w-[78%] px-5 py-4 rounded-3xl leading-relaxed shadow-sm
          transition-all text-[16.5px] md:text-[17px]
          ${
            isUser
              ? theme === "dark"
                ? "bg-white/10 text-zinc-200 rounded-tr-none font-mono"
                : "bg-slate-200/80 text-slate-900 rounded-tr-none font-mono"
              : theme === "dark"
                ? "text-zinc-100 rounded-tl-none bg-zinc-900/45 border border-white/10 font-sans"
                : "text-slate-900 rounded-tl-none bg-white/70 border border-slate-300 font-sans"
          }
        `}
      >
        {isUser ? (
          <span>{displayedText}</span>
        ) : isTypingFinished ? (
          <span
            className="block [&_p]:mb-3 [&_p]:leading-7 [&_ul]:my-3 [&_ul]:space-y-1.5 [&_ol]:my-3 [&_ol]:space-y-1.5 [&_li]:leading-7 [&_h3]:text-[1.06rem] [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2"
            dangerouslySetInnerHTML={{ __html: styledBotContent }}
          />
        ) : (
          <span className="inline-flex items-center gap-1.5 text-sm opacity-80">
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:240ms]" />
          </span>
        )}
      </div>
    </div>
  );
}
