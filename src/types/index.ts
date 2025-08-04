export interface BotConfig {
  name: string;
  persona: string;
  model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'mistral-7b';
}

export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  model: string;
  question: string;
  answer: string;
  fullQuestion: string;
  fullAnswer: string;
}