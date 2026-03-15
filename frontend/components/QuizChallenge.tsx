"use client";

import type { QuizQuestion } from "@/types/chat";

interface QuizChallengeProps {
  theme: "dark" | "light";
  language: "en" | "am";
  questions: QuizQuestion[];
  answers: Record<string, number>;
  submitted: boolean;
  onChoose: (questionId: string, answerIndex: number) => void;
  onSubmit: () => void;
  onBackToChat: () => void;
}

export default function QuizChallenge({
  theme,
  language,
  questions,
  answers,
  submitted,
  onChoose,
  onSubmit,
  onBackToChat,
}: QuizChallengeProps) {
  const isAmharic = language === "am";
  const totalAnswered = Object.keys(answers).length;
  const score = questions.reduce((sum, q) => {
    if (answers[q.id] === q.correctIndex) return sum + 1;
    return sum;
  }, 0);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 sm:px-4 space-y-4">
      <div
        className={`rounded-2xl p-4 border ${
          theme === "dark"
            ? "border-white/10 bg-black/35"
            : "border-slate-300 bg-white/80"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              {isAmharic ? "የአድዋ ፈተና" : "Adwa Quiz Challenge"}
            </h2>
            <p
              className={
                theme === "dark"
                  ? "text-zinc-400 text-sm"
                  : "text-slate-600 text-sm"
              }
            >
              {isAmharic
                ? "የአድዋ ታሪክ እውቀትዎን በ5 የውድድር ጥያቄዎች ይፈትኑ።"
                : "Test your Adwa history knowledge with 5 competition-style questions."}
            </p>
          </div>
          <button
            onClick={onBackToChat}
            className={`px-3 py-2 rounded-xl text-sm ${
              theme === "dark"
                ? "border border-white/10 hover:bg-white/10"
                : "border border-slate-300 hover:bg-slate-200"
            }`}
          >
            {isAmharic ? "ወደ ውይይት ተመለስ" : "Back to chat"}
          </button>
        </div>
      </div>

      {questions.map((question, qIndex) => (
        <div
          key={question.id}
          className={`rounded-2xl p-4 border ${
            theme === "dark"
              ? "border-white/10 bg-black/30"
              : "border-slate-300 bg-white/75"
          }`}
        >
          <p className="font-semibold mb-3">
            {qIndex + 1}. {question.question}
          </p>

          <div className="space-y-2">
            {question.options.map((option, oIndex) => {
              const selected = answers[question.id] === oIndex;
              const isCorrect = question.correctIndex === oIndex;

              const optionStyle = submitted
                ? isCorrect
                  ? "border-emerald-400/70 bg-emerald-500/15"
                  : selected
                    ? "border-rose-400/70 bg-rose-500/10"
                    : ""
                : selected
                  ? theme === "dark"
                    ? "border-sky-400/50 bg-sky-500/15"
                    : "border-sky-400/60 bg-sky-200"
                  : "";

              return (
                <button
                  key={`${question.id}-${oIndex}`}
                  disabled={submitted}
                  onClick={() => onChoose(question.id, oIndex)}
                  className={`w-full text-left rounded-xl px-3 py-2 border transition-colors ${
                    theme === "dark"
                      ? "border-white/10 hover:bg-white/5"
                      : "border-slate-300 hover:bg-slate-100"
                  } ${optionStyle}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {submitted && (
            <p
              className={`mt-3 text-sm ${theme === "dark" ? "text-zinc-300" : "text-slate-700"}`}
            >
              {question.explanation}
            </p>
          )}
        </div>
      ))}

      <div className="pb-4 flex flex-wrap items-center gap-3">
        {!submitted ? (
          <button
            onClick={onSubmit}
            disabled={totalAnswered < questions.length}
            className="px-4 py-2 rounded-xl font-semibold bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {isAmharic
              ? `ፈተና አስገባ (${totalAnswered}/${questions.length})`
              : `Submit Quiz (${totalAnswered}/${questions.length})`}
          </button>
        ) : (
          <div
            className={`px-4 py-2 rounded-xl font-semibold ${theme === "dark" ? "bg-white/10" : "bg-slate-200"}`}
          >
            {isAmharic
              ? `የመጨረሻ ውጤት: ${score}/${questions.length}`
              : `Final Score: ${score}/${questions.length}`}
          </div>
        )}
      </div>
    </div>
  );
}
