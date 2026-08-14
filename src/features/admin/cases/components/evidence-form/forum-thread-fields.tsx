import { useForumPosts } from "../../hooks/use-forum-posts";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateTimeValue } from "../../utils/evidence-form-values";
import { EvidenceDateTimeField, EvidenceField, EvidenceTextarea } from "./evidence-form-controls";

export function ForumThreadFields({ disabled, initial }: { disabled: boolean; initial?: AdminCaseEvidenceDetail }) {
  const initialPosts = (initial?.posts ?? []).map((post) => ({ ...post, timestamp: evidenceDateTimeValue(post.timestamp) }));
  const { posts, serializedPosts, updatePost, addPost, removePost } = useForumPosts(initialPosts);

  return (
    <div>
      <input type="hidden" name="posts_json" value={JSON.stringify(serializedPosts)} />
      <div className="grid gap-5 md:grid-cols-2">
        <EvidenceField label="Thread Title" name="thread_title" defaultValue={initial?.thread_title} placeholder="Judul diskusi forum" required disabled={disabled} />
        <EvidenceField label="Forum Name" name="forum_name" defaultValue={initial?.forum_name} placeholder="Forum Nusa" required disabled={disabled} />
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <h3 className="text-xs font-semibold">Post Entries ({posts.length})</h3>
        <button type="button" disabled={disabled} onClick={addPost} className="h-8 cursor-pointer rounded-full border border-purple/55 px-4 text-[10px] font-semibold text-purple transition-colors hover:bg-purple/10 disabled:cursor-not-allowed disabled:opacity-50">+ Tambah Post</button>
      </div>

      <div className="mt-3 space-y-3">
        {posts.map((post, index) => (
          <article key={post.id} className="rounded-xl border border-border-strong bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[9px] text-foreground/40">POST {String(index + 1).padStart(2, "0")}</span>
              {posts.length > 1 ? <button type="button" disabled={disabled} onClick={() => removePost(post.id)} className="cursor-pointer text-[10px] text-red hover:underline disabled:cursor-not-allowed">Hapus</button> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_0.65fr]">
              <EvidenceField label="Author Name" value={post.author_name} onChange={(event) => updatePost(post.id, { author_name: event.target.value })} required disabled={disabled} />
              <EvidenceDateTimeField label="Timestamp" min="2020-01-01T00:00:00" max="2100-12-31T23:59:59" value={post.timestamp} onValueChange={(timestamp) => updatePost(post.id, { timestamp })} required disabled={disabled} />
              <EvidenceField label="Upvote Count" type="number" min={0} value={post.upvote_count} onChange={(event) => updatePost(post.id, { upvote_count: Number(event.target.value) })} required disabled={disabled} />
            </div>
            <div className="mt-4"><EvidenceTextarea label="Post Text" value={post.text} onChange={(event) => updatePost(post.id, { text: event.target.value })} required disabled={disabled} /></div>
          </article>
        ))}
      </div>
    </div>
  );
}
