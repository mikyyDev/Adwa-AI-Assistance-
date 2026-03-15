"use client";

import type { EvidenceSource } from "@/types/chat";

interface EvidencePanelProps {
  theme: "dark" | "light";
  language: "en" | "am";
  confidence?: "high" | "medium" | "low";
  sources?: EvidenceSource[];
}

const confidenceStyleMap = {
  high: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30",
  medium: "bg-amber-500/20 text-amber-200 border border-amber-400/30",
  low: "bg-rose-500/20 text-rose-200 border border-rose-400/30",
};

export default function EvidencePanel({
  theme,
  language,
  confidence,
  sources,
}: EvidencePanelProps) {
  const isAmharic = language === "am";
  const visibleSources = (sources || []).slice(0, 3);

  if (!visibleSources.length && !confidence) {
    return null;
  }

  return (
    <div
      className={`mt-2 mb-1 ml-1 rounded-2xl p-3 max-w-[78%] ${
        theme === "dark"
          ? "bg-black/35 border border-white/10"
          : "bg-white/80 border border-slate-300"
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="text-xs uppercase tracking-[0.12em]">
          {isAmharic ? "ማስረጃ" : "Evidence"}
        </p>
        {confidence && (
          <span
            className={`text-[10px] px-2 py-1 rounded-full font-semibold uppercase ${
              theme === "dark"
                ? confidenceStyleMap[confidence]
                : "bg-slate-200 text-slate-700 border border-slate-300"
            }`}
          >
            {isAmharic ? `${confidence} እምነት` : `${confidence} confidence`}
          </span>
        )}
      </div>

      {visibleSources.length > 0 && (
        <div className="space-y-2">
          {visibleSources.map((source, index) => (
            <div
              key={`${source.title}-${index}`}
              className="text-xs leading-relaxed"
            >
              <p className="font-semibold">{source.title}</p>
              <p
                className={
                  theme === "dark" ? "text-zinc-300" : "text-slate-600"
                }
              >
                {source.snippet}
              </p>
              {source.reference && (
                <p
                  className={
                    theme === "dark" ? "text-zinc-500" : "text-slate-500"
                  }
                >
                  {source.reference}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
