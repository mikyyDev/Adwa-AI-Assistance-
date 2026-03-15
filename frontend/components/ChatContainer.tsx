"use client";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useLocalStorageChat } from "@/hooks/useLocalStorageChats";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import EvidencePanel from "./EvidencePanel";
import QuizChallenge from "./QuizChallenge";
import type { QuizQuestion, TimelineItem } from "@/types/chat";
import { Loader2, Menu, X } from "lucide-react";

interface ChatContainerProps {
  theme: "dark" | "light";
  onToggleTheme: () => void;
}

type LanguageMode = "en" | "am";

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    id: "adwa-before",
    year: "1889-1895",
    label: "Build-up to Adwa",
    prompt:
      "Explain the political and military events that led to the Battle of Adwa in a concise timeline.",
  },
  {
    id: "adwa-day",
    year: "March 1, 1896",
    label: "The day of the battle",
    prompt:
      "Describe what happened on the day of the Battle of Adwa, including key decisions and outcomes.",
  },
  {
    id: "adwa-legacy",
    year: "Post-1896",
    label: "የአድዋ ትሩፋት እና ዓለም አቀፍ ተፅዕኖ",
    prompt: "የአድዋ ትሩፋት ለኢትዮጵያ፣ ለአፍሪካ እና ለዓለም አቀፍ ፀረ-ቅኝ እንቅስቃሴዎች ምን ነበር?",
  },
];

const QUIZ_BANK: QuizQuestion[] = [
  {
    id: "q1",
    question: "In what year was the Battle of Adwa fought?",
    options: ["1885", "1896", "1901", "1912"],
    correctIndex: 1,
    explanation: "The Battle of Adwa was fought on March 1, 1896.",
  },
  {
    id: "q2",
    question:
      "Which treaty dispute significantly contributed to the conflict before Adwa?",
    options: [
      "Treaty of Versailles",
      "Treaty of Wuchale",
      "Treaty of Paris",
      "Treaty of Addis Ababa",
    ],
    correctIndex: 1,
    explanation:
      "Different interpretations of the Treaty of Wuchale were a major trigger.",
  },
  {
    id: "q3",
    question: "Who led Ethiopia during the Battle of Adwa?",
    options: [
      "Emperor Menelik II",
      "Emperor Haile Selassie",
      "Emperor Yohannes IV",
      "Ras Tafari",
    ],
    correctIndex: 0,
    explanation:
      "Emperor Menelik II led Ethiopia during the campaign and battle.",
  },
  {
    id: "q4",
    question: "Adwa is globally remembered primarily as what kind of event?",
    options: [
      "A naval victory",
      "A failed uprising",
      "An anti-colonial victory",
      "A civil war battle",
    ],
    correctIndex: 2,
    explanation:
      "Adwa became a symbol of anti-colonial resistance and sovereignty.",
  },
  {
    id: "q5",
    question: "What date is widely associated with Adwa commemoration?",
    options: ["January 7", "February 14", "March 1", "May 5"],
    correctIndex: 2,
    explanation: "March 1 is the historical date of the Battle of Adwa.",
  },
];

const COMPETITION_STARTERS = [
  {
    id: "starter-1",
    titleEn: "60-second Adwa pitch",
    titleAm: "60 ሰከንድ የአድዋ ማብራሪያ",
    prompt:
      "Give me a 60-second, judge-ready summary of the Battle of Adwa with 3 key points.",
  },
  {
    id: "starter-2",
    titleEn: "Evidence-first answer",
    titleAm: "በማስረጃ የተጀመረ ምላሽ",
    prompt:
      "Explain the legacy of Adwa and highlight the strongest evidence from the documents.",
  },
  {
    id: "starter-3",
    titleEn: "Bilingual showcase",
    titleAm: "የሁለት ቋንቋ ማሳያ",
    prompt:
      "Answer what is Adwa in Amharic first, then provide a concise English version about why Adwa mattered globally.",
  },
];

const BILINGUAL_SHOWCASE_EXACT_ANSWER = `
<div style="font-family: Arial, sans-serif; line-height:1.6;">
  <p style="margin-bottom:10px;">አድዋ በኢትዮጵያ ታሪክ ውስጥ እጅግ ታላቅ ቦታ ያለው ድል ነው። በ1888 ዓ.ም. የኢትዮጵያ ሕዝብ በአንድነት ተነስቶ የቅኝ ግዛትን ሙከራ በመቋቋም ታላቅ ድል አግኝቷል። ይህ ድል የኢትዮጵያን ነፃነት፣ ድፍረትና አንድነት የሚያሳይ ታሪካዊ ምልክት ነው። አድዋ ለአፍሪካ እና ለዓለም የነፃነት ተምሳሌት ሆኖ ይታወቃል።</p>
  <p style="margin-bottom:10px;">English Version: Adwa was a pivotal event in Ethiopian history. In 1888, the Ethiopian people came together in unity and defeated the Italian colonial power, securing their independence, freedom, and unity. This victory serves as a historical testament to Ethiopia's struggle for freedom and unity, and it has become a symbol of liberation for Africa and the world.</p>
</div>
`;

const pickQuizQuestions = () => {
  const copy = [...QUIZ_BANK];
  copy.sort(() => Math.random() - 0.5);
  return copy.slice(0, 5);
};

export default function ChatContainer({
  theme,
  onToggleTheme,
}: ChatContainerProps) {
  const {
    messages,
    recentChats,
    addMessage,
    clearMessages,
    openRecentChat,
    deleteRecentChat,
    isLoaded,
  } = useLocalStorageChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageMode>("en");
  const [viewMode, setViewMode] = useState<"chat" | "quiz">("chat");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const hasMessages = messages.length > 0;
  const hasRecentChats = recentChats.length > 0;
  const displayedRecentChats = recentChats;
  const isAmharic = language === "am";

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: "end" });
    }
  };

  useEffect(() => {
    if (isLoaded && hasMessages) {
      setTimeout(() => scrollToBottom("auto"), 0);
    }
  }, [isLoaded, hasMessages]);

  useEffect(() => {
    if (hasMessages) {
      setTimeout(() => scrollToBottom("smooth"), 50);
    }
  }, [messages.length, hasMessages]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("chatLanguage");
    if (savedLanguage === "en" || savedLanguage === "am") {
      setLanguage(savedLanguage);
    }
    setIsSidebarOpen(window.innerWidth >= 768);
  }, []);

  useEffect(() => {
    localStorage.setItem("chatLanguage", language);
  }, [language]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    setViewMode("chat");

    addMessage("user", content);
    setLoading(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

      const res = await fetch(`${apiBaseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: content, language }),
      });

      let data: {
        answer?: string;
        confidence?: "high" | "medium" | "low";
        sources?: Array<{ title: string; snippet: string; reference?: string }>;
        detail?: string;
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.detail ||
            (isAmharic
              ? "ሰርቨሩ የተሳሳተ ምላሽ መልሷል።"
              : "Server returned an unexpected response."),
        );
      }

      if (!data?.answer) {
        throw new Error(
          isAmharic
            ? "ከሰርቨሩ የተሟላ ምላሽ አልተገኘም።"
            : "No valid answer was returned by the server.",
        );
      }

      addMessage("bot", data.answer, {
        confidence: data.confidence,
        sources: data.sources,
      });
    } catch (error) {
      const rawErrorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const isConnectionError = /fetch|network|failed|refused|connection/i.test(
        rawErrorMessage,
      );

      addMessage(
        "bot",
        isConnectionError
          ? isAmharic
            ? "ይቅርታ፣ backend ሰርቨሩ አልተገናኘም (127.0.0.1:8000)። backend ለማስነሳት: uvicorn app:app --reload --host 127.0.0.1 --port 8000"
            : "Could not reach the backend server at 127.0.0.1:8000. Start it with: uvicorn app:app --reload --host 127.0.0.1 --port 8000"
          : isAmharic
            ? `ስህተት ተፈጥሯል: ${rawErrorMessage}`
            : `Server error: ${rawErrorMessage}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewChat = () => {
    clearMessages();
    setViewMode("chat");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleOpenRecentChat = (sessionId: string) => {
    openRecentChat(sessionId);
    setViewMode("chat");
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleSelectTimeline = (item: TimelineItem) => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    handleSend(item.prompt);
  };

  const handleStarterPrompt = (
    starter: (typeof COMPETITION_STARTERS)[number],
  ) => {
    if (starter.id === "starter-3") {
      setViewMode("chat");
      addMessage("user", starter.prompt);
      addMessage("bot", BILINGUAL_SHOWCASE_EXACT_ANSWER, {
        confidence: "high",
        sources: [
          {
            title: "Adwa Bilingual Showcase",
            snippet:
              "Curated bilingual competition response for the Adwa overview starter.",
            reference: "Showcase",
          },
        ],
      });

      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
      return;
    }

    handleSend(starter.prompt);
  };

  const handleStartQuiz = () => {
    setViewMode("quiz");
    setQuizQuestions(pickQuizQuestions());
    setQuizAnswers({});
    setQuizSubmitted(false);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleChooseQuizAnswer = (questionId: string, answerIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
  };

  if (!isLoaded) {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50 ${
          theme === "dark" ? "bg-black/80" : "bg-slate-100/80"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-zinc-500 rounded-full animate-pulse [animation-delay:0ms]"></div>
          <div className="w-3 h-3 bg-zinc-400 rounded-full animate-pulse [animation-delay:150ms]"></div>
          <div className="w-3 h-3 bg-zinc-300 rounded-full animate-pulse [animation-delay:300ms]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      {/* Navbar */}
      <header
        className={`
          fixed top-0 inset-x-0 z-50 h-14 flex items-center justify-between
          px-4 sm:px-6 md:px-8
          transition-all duration-300
          ${
            isScrolled
              ? theme === "dark"
                ? "bg-black/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/10"
                : "bg-slate-100/75 backdrop-blur-xl shadow-[0_4px_24px_rgba(15,23,42,0.10)] border-b border-slate-300/80"
              : theme === "dark"
                ? "bg-black/40 backdrop-blur-sm border-b border-white/10"
                : "bg-slate-50/45 backdrop-blur-sm border-b border-slate-300/80"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
              theme === "dark"
                ? "border border-white/10 hover:bg-white/10"
                : "border border-slate-300 hover:bg-slate-200"
            }`}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>

          <div
            className={`relative w-9 h-9 rounded-xl overflow-hidden border ${
              theme === "dark" ? "border-white/20" : "border-slate-300"
            }`}
          >
            <Image
              src="/adwa.jpg"
              alt="Adwa logo"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <span className="font-semibold tracking-tighter text-lg">
            Adwa AI Assistance
          </span>
        </div>

        <p
          className={`hidden sm:block text-xs tracking-[0.12em] uppercase ${
            theme === "dark" ? "text-zinc-400" : "text-slate-500"
          }`}
        >
          {isAmharic ? "AI አገልጋይ" : "AI assistant"}
        </p>
      </header>

      <div
        className={`fixed top-14 bottom-0 left-0 z-40 hidden md:block w-72 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          theme={theme}
          language={language}
          recentChats={displayedRecentChats}
          hasRecentChats={hasRecentChats}
          onToggleTheme={onToggleTheme}
          onToggleLanguage={() =>
            setLanguage((prev) => (prev === "en" ? "am" : "en"))
          }
          onStartNewChat={handleStartNewChat}
          onOpenRecentChat={handleOpenRecentChat}
          onDeleteRecentChat={deleteRecentChat}
          timelineItems={TIMELINE_ITEMS}
          onSelectTimeline={handleSelectTimeline}
          onStartQuiz={handleStartQuiz}
        />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <button
            aria-label="Close sidebar overlay"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-xs">
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 bg-black/70 backdrop-blur-xl">
              <span className="text-sm font-semibold">
                {isAmharic ? "ዝርዝር" : "Menu"}
              </span>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="h-[calc(100%-56px)]">
              <Sidebar
                theme={theme}
                language={language}
                recentChats={displayedRecentChats}
                hasRecentChats={hasRecentChats}
                onToggleTheme={onToggleTheme}
                onToggleLanguage={() =>
                  setLanguage((prev) => (prev === "en" ? "am" : "en"))
                }
                onStartNewChat={handleStartNewChat}
                onOpenRecentChat={handleOpenRecentChat}
                onDeleteRecentChat={deleteRecentChat}
                timelineItems={TIMELINE_ITEMS}
                onSelectTimeline={handleSelectTimeline}
                onStartQuiz={handleStartQuiz}
              />
            </div>
          </div>
        </div>
      )}

      <div
        ref={scrollRef}
        className={`
          flex-1 overflow-y-auto w-full mx-auto
          ${isSidebarOpen ? "md:ml-72 md:max-w-[calc(100%-18rem)]" : "max-w-5xl"}
          px-4 sm:px-6 lg:px-8 pt-20 pb-32 md:pb-40
          scrollbar-thin space-y-8 mb-10
          ${!hasMessages ? "flex items-center justify-center" : ""}
        `}
      >
        {viewMode === "quiz" ? (
          <QuizChallenge
            theme={theme}
            language={language}
            questions={quizQuestions}
            answers={quizAnswers}
            submitted={quizSubmitted}
            onChoose={handleChooseQuizAnswer}
            onSubmit={handleSubmitQuiz}
            onBackToChat={() => setViewMode("chat")}
          />
        ) : hasMessages ? (
          <>
            {messages.map((msg, index) => {
              const isLast = index === messages.length - 1;
              return (
                <div key={msg.id}>
                  <ChatMessage
                    message={msg}
                    theme={theme}
                    shouldType={msg.role === "bot" && isLast && !loading}
                  />
                  {msg.role === "bot" && (
                    <EvidencePanel
                      theme={theme}
                      language={language}
                      confidence={msg.metadata?.confidence}
                      sources={msg.metadata?.sources}
                    />
                  )}
                </div>
              );
            })}

            {/* Show spinner while waiting for server response */}
            {loading && (
              <div className="flex justify-start">
                <div
                  className={`max-w-[78%] px-5 py-4 font-mono flex items-center gap-2 shadow-sm ${
                    theme === "dark" ? "text-zinc-200" : "text-slate-700"
                  }`}
                >
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center max-w-3xl mx-auto mt-8 px-4">
            <div
              className={`mx-auto mb-8 w-20 h-20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-lg relative ${
                theme === "dark"
                  ? "bg-zinc-900/80 border border-zinc-800"
                  : "bg-white/85 border border-slate-300"
              }`}
            >
              <div
                className={`absolute -inset-1 rounded-3xl blur-md ${
                  theme === "dark" ? "bg-orange-400/20" : "bg-orange-400/25"
                }`}
              />
              <div
                className={`relative w-12 h-12 rounded-2xl overflow-hidden border z-10 ${
                  theme === "dark" ? "border-white/20" : "border-slate-300"
                }`}
              >
                <Image
                  src="/adwa.jpg"
                  alt="Adwa logo"
                  fill
                  sizes="48px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <h1
              className={`text-4xl md:text-6xl font-sans font-bold tracking-tighter mb-3 bg-clip-text text-transparent ${
                theme === "dark"
                  ? "bg-linear-to-r from-white via-orange-200 to-zinc-300"
                  : "bg-linear-to-r from-slate-900 via-orange-600 to-slate-700"
              }`}
            >
              Adwa AI Assistance
            </h1>
            <p
              className={`text-lg md:text-2xl font-semibold mb-3 ${
                theme === "dark" ? "text-zinc-400" : "text-slate-600"
              }`}
            >
              የአድዋ ታሪክ በቀላሉ ይጠይቁ • Ask with confidence
            </p>
            <p
              className={`text-sm md:text-base mb-8 ${
                theme === "dark" ? "text-zinc-500" : "text-slate-500"
              }`}
            >
              {isAmharic
                ? "በአማርኛ እና በእንግሊዝኛ የተደገፈ ማስረጃ-መሠረት ምላሽ"
                : "Evidence-backed bilingual answers in English and Amharic"}
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                "Evidence-Backed | በማስረጃ",
                "Bilingual EN/AM | ሁለት ቋንቋ",
                "Timeline + Quiz | ጊዜ መስመር + ፈተና",
              ].map((chip) => (
                <span
                  key={chip}
                  className={`px-3 py-1.5 rounded-full text-xs md:text-sm ${
                    theme === "dark"
                      ? "bg-white/8 text-zinc-300 border border-white/10"
                      : "bg-white text-slate-700 border border-slate-300"
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {COMPETITION_STARTERS.map((starter) => (
                <button
                  key={starter.id}
                  onClick={() => handleStarterPrompt(starter)}
                  className={`rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                    theme === "dark"
                      ? "bg-zinc-900/55 border border-white/10 hover:bg-zinc-900/80"
                      : "bg-white/90 border border-slate-300 hover:bg-white"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {starter.titleEn}
                  </p>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-zinc-400" : "text-slate-500"
                    }`}
                  >
                    {starter.titleAm}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-[left] duration-300 ${
          isSidebarOpen ? "md:left-72" : "md:left-0"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 pt-2">
          <ChatInput onSend={handleSend} theme={theme} language={language} />
          <p
            className={`mt-2 text-center text-[11px] tracking-wide ${
              theme === "dark" ? "text-zinc-500" : "text-slate-500"
            }`}
          >
            System developed by Michael Alula
          </p>
        </div>
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}
