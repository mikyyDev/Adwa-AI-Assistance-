'use client';

import { useState, useEffect } from 'react';
import type { Message, ChatSession, MessageMetadata } from '@/types/chat';

const ACTIVE_CHAT_KEY = 'chatMessages';
const RECENT_CHATS_KEY = 'recentChats';
const MAX_RECENT_CHATS = 8;

export function useLocalStorageChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const createSessionFromMessages = (items: Message[]): ChatSession | null => {
    if (!items.length) return null;

    const firstUserMessage = items.find((message) => message.role === 'user');
    const titleSource = firstUserMessage?.content || 'Untitled chat';
    const title = titleSource.slice(0, 42);
    const preview = titleSource.slice(0, 72);

    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title,
      preview,
      updatedAt: new Date().toISOString(),
      messages: items,
    };
  };

  const archiveCurrentChat = (items: Message[]) => {
    const session = createSessionFromMessages(items);
    if (!session) return;

    setRecentChats((prev) => {
      const next = [session, ...prev].slice(0, MAX_RECENT_CHATS);
      localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    let parsedMessages: Message[] | null = null;
    let parsedRecentChats: ChatSession[] | null = null;

    const saved = localStorage.getItem(ACTIVE_CHAT_KEY);
    if (saved) {
      try {
        parsedMessages = JSON.parse(saved);
      } catch {
        console.error('Failed to parse saved messages');
      }
    }

    const savedRecentChats = localStorage.getItem(RECENT_CHATS_KEY);
    if (savedRecentChats) {
      try {
        parsedRecentChats = JSON.parse(savedRecentChats);
      } catch {
        console.error('Failed to parse saved recent chats');
      }
    }

    queueMicrotask(() => {
      if (parsedMessages) {
        setMessages(parsedMessages);
      }
      if (parsedRecentChats) {
        setRecentChats(parsedRecentChats);
      }
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(ACTIVE_CHAT_KEY, JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(RECENT_CHATS_KEY, JSON.stringify(recentChats));
    }
  }, [recentChats, isLoaded]);

  const addMessage = (
    role: 'user' | 'bot',
    content: string,
    metadata?: MessageMetadata,
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      role,
      content: content.trim(),
      metadata,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const clearMessages = () => {
    archiveCurrentChat(messages);
    setMessages([]);
    localStorage.removeItem(ACTIVE_CHAT_KEY);
  };

  const openRecentChat = (sessionId: string) => {
    const selectedChat = recentChats.find((chat) => chat.id === sessionId);
    if (!selectedChat) return;

    setMessages(selectedChat.messages);

    setRecentChats((prev) => {
      const reordered = [
        {
          ...selectedChat,
          updatedAt: new Date().toISOString(),
        },
        ...prev.filter((chat) => chat.id !== sessionId),
      ];
      return reordered;
    });
  };

  const deleteRecentChat = (sessionId: string) => {
    setRecentChats((prev) => prev.filter((chat) => chat.id !== sessionId));
  };

  return {
    messages,
    recentChats,
    addMessage,
    clearMessages,
    openRecentChat,
    deleteRecentChat,
    isLoaded,
  };
}