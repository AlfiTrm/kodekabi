"use client";

import { useState } from "react";

import type { ForumPostDraft } from "../types/admin-case";

export type ForumPostRow = ForumPostDraft & { id: string };

function emptyPost(id: string): ForumPostRow {
  return { id, author_name: "", timestamp: "", upvote_count: 0, text: "" };
}

export function useForumPosts(initialPosts: ForumPostDraft[] = []) {
  const [posts, setPosts] = useState<ForumPostRow[]>(() => initialPosts.length
    ? initialPosts.map((post, index) => ({ ...post, id: `post-${index + 1}` }))
    : [emptyPost("post-1")]);

  function updatePost(id: string, patch: Partial<ForumPostDraft>) {
    setPosts((current) => current.map((post) => post.id === id ? { ...post, ...patch } : post));
  }

  function addPost() {
    setPosts((current) => [...current, emptyPost(crypto.randomUUID())]);
  }

  function removePost(id: string) {
    setPosts((current) => current.length > 1 ? current.filter((post) => post.id !== id) : current);
  }

  const serializedPosts = posts.map(({ author_name, timestamp, upvote_count, text }) => ({ author_name, timestamp, upvote_count, text }));
  return { posts, serializedPosts, updatePost, addPost, removePost };
}
