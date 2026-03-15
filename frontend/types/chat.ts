export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  metadata?: MessageMetadata;
};

export type MessageMetadata = {
  confidence?: 'high' | 'medium' | 'low';
  sources?: EvidenceSource[];
};

export type EvidenceSource = {
  title: string;
  snippet: string;
  reference?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  messages: Message[];
};

export type TimelineItem = {
  id: string;
  label: string;
  year: string;
  prompt: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};