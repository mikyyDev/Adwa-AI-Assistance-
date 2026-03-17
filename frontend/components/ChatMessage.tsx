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
const isEmojiSectionTitle = (value: string) =>
  /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]\s+[^\n]+$/u.test(value);

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatListItem = (value: string) => {
  const trimmed = value.trim();
  if (/^date\s*:/i.test(trimmed)) return `📅 ${trimmed}`;
  if (/^location\s*:/i.test(trimmed)) return `📍 ${trimmed}`;
  if (/^(parties involved|participants?)\s*:/i.test(trimmed)) {
    return `👥 ${trimmed}`;
  }
  if (/^(outcome|result)\s*:/i.test(trimmed)) return `🏆 ${trimmed}`;
  return trimmed;
};

const normalizeRawText = (raw: string) =>
  raw
    .replace(/\r\n?/g, "\n")
    // Convert markdown underlined headings into explicit section lines.
    .replace(/(^|\n)([^\n]+)\n[=-]{3,}(?=\n|$)/g, "$1📌 $2")
    // Convert markdown hash headings.
    .replace(/(^|\n)#{1,6}\s+/g, "$1📌 ")
    // Normalize alternate bullet symbols.
    .replace(/(^|\n)•\s+/g, "$1* ")
    .replace(/\s+\*\s+/g, "\n* ")
    .replace(
      /(\bkey facts[^:\n]*:)/gi,
      (_, phrase: string) => `\n📌 ${phrase.trim()}\n`,
    );

const toStyledHtml = (raw: string) => {
  if (hasHtmlTags(raw)) return raw;

  const lines = normalizeRawText(raw)
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

    if (/^[=-]{3,}$/.test(line)) {
      flushList();
      continue;
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^\d+[.)]\s+(.+)$/);

    if (bulletMatch) {
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      listBuffer.push(
        `<li style=\"margin-bottom:6px;\">${escapeHtml(formatListItem(bulletMatch[1]))}</li>`,
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

    if (line.endsWith(":") || isEmojiSectionTitle(line)) {
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

  const [revealedBotMessageId, setRevealedBotMessageId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isUser || !shouldType) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRevealedBotMessageId(message.id);
    }, THINKING_DELAY_MS);

    return () => window.clearTimeout(timeout);
  }, [message.id, isUser, shouldType]);

  const isTypingFinished =
    isUser || !shouldType || revealedBotMessageId === message.id;
  const content = message.content;
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
          <span>{message.content}</span>
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
