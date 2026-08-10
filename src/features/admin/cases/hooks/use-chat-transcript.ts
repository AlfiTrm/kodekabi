"use client";

import { useEffect, useRef, useState } from "react";

import type { ChatMessageDraft } from "../types/admin-case";

export type ChatMessageRow = ChatMessageDraft & { id: string };

function emptyMessage(id: string): ChatMessageRow {
  return { id, sender: "", timestamp: "", text: "" };
}

export function useChatTranscript(initialParticipants: string[] = [], initialMessages: ChatMessageDraft[] = []) {
  const [participants, setParticipants] = useState<string[]>(initialParticipants);
  const [participantDraft, setParticipantDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessageRow[]>(() => initialMessages.length
    ? initialMessages.map((message, index) => ({ ...message, id: `message-${index + 1}` }))
    : [emptyMessage("message-1")]);
  const latestMessageRef = useRef<HTMLElement>(null);
  const previousMessageCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > previousMessageCountRef.current) {
      latestMessageRef.current?.scrollIntoView({ behavior: "auto", block: "center" });
    }
    previousMessageCountRef.current = messages.length;
  }, [messages.length]);

  function addParticipant() {
    const name = participantDraft.trim();
    if (!name || participants.includes(name)) return;
    setParticipants((current) => [...current, name]);
    setParticipantDraft("");
  }

  function removeParticipant(name: string) {
    setParticipants((current) => current.filter((participant) => participant !== name));
    setMessages((current) => current.map((message) => message.sender === name ? { ...message, sender: "" } : message));
  }

  function updateMessage(id: string, patch: Partial<ChatMessageDraft>) {
    setMessages((current) => current.map((message) => message.id === id ? { ...message, ...patch } : message));
  }

  function addMessage() {
    setMessages((current) => [...current, emptyMessage(crypto.randomUUID())]);
  }

  function removeMessage(id: string) {
    setMessages((current) => current.length > 1 ? current.filter((message) => message.id !== id) : current);
  }

  const serializedMessages = messages.map(({ sender, timestamp, text }) => ({ sender, timestamp, text }));

  return {
    participants,
    participantDraft,
    setParticipantDraft,
    messages,
    latestMessageRef,
    serializedMessages,
    addParticipant,
    removeParticipant,
    updateMessage,
    addMessage,
    removeMessage,
  };
}
