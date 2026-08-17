import type { AdminCaseEvidenceDetail, ChatMessageDraft, ForumPostDraft } from "../types/admin-case";

function line(label: string, value: unknown) {
  if (value === undefined || value === null || value === "") return "";
  return `- ${label}: ${value}`;
}

function lines(...parts: string[]) {
  return parts.filter(Boolean).join("\n");
}

function participantNames(participants?: Array<string | { name: string }>) {
  if (!Array.isArray(participants)) return undefined;
  return participants.map((participant) => (typeof participant === "string" ? participant : participant.name)).join(", ");
}

/**
 * Mengubah detail evidence (dari Get Evidence Details) menjadi teks ringkas
 * yang bisa dikirim ke AI agar pertanyaan yang dihasilkan cocok dengan bukti.
 */
export function formatEvidenceDetail(evidence: AdminCaseEvidenceDetail): string {
  const common = lines(
    line("Label", evidence.label),
    line("Tipe", evidence.template_type),
    line("Critical", evidence.is_critical ? "ya" : "tidak"),
    line("Credibility tags", Array.isArray(evidence.credibility_tags) ? evidence.credibility_tags.join(", ") : undefined),
  );

  let body = "";
  switch (evidence.template_type) {
    case "social_post":
      body = lines(
        line("Penulis", evidence.author_name ? `${evidence.author_name}${evidence.author_handle ? ` (${evidence.author_handle})` : ""}` : undefined),
        line("Platform", evidence.platform),
        line("Isi postingan", evidence.post_text),
        line("Waktu", evidence.timestamp),
        line("Likes", evidence.likes_count),
        line("Shares", evidence.shares_count),
        line("Comments", evidence.comments_count),
        line("Akun terverifikasi", typeof evidence.is_verified_account === "boolean" ? String(evidence.is_verified_account) : undefined),
      );
      break;
    case "article":
      body = lines(
        line("Headline", evidence.headline),
        line("Sumber", evidence.source_name),
        line("Penulis", evidence.author_name),
        line("Tanggal terbit", evidence.publish_date),
        line("URL", evidence.url),
        line("Isi artikel", evidence.body_text),
      );
      break;
    case "blog":
      body = lines(
        line("Judul", evidence.title),
        line("Penulis", evidence.author_name),
        line("Nama blog", evidence.blog_name),
        line("Tanggal terbit", evidence.publish_date),
        line("Isi blog", evidence.body_text),
      );
      break;
    case "forum_thread":
      body = lines(
        line("Judul thread", evidence.thread_title),
        line("Forum", evidence.forum_name),
        ...(Array.isArray(evidence.posts)
          ? evidence.posts.map((post, index) => {
              const item = post as ForumPostDraft;
              return lines(
                `  [Post ${index + 1}]`,
                line("  Penulis", item.author_name),
                line("  Waktu", item.timestamp),
                line("  Upvote", item.upvote_count),
                line("  Isi", item.text),
              );
            })
          : []),
      );
      break;
    case "chat_transcript":
      body = lines(
        line("Partisipan", participantNames(evidence.participants)),
        ...(Array.isArray(evidence.messages)
          ? evidence.messages.map((message, index) => {
              const item = message as ChatMessageDraft;
              return lines(
                `  [Pesan ${index + 1}]`,
                line("  Pengirim", item.sender),
                line("  Waktu", item.timestamp),
                line("  Isi", item.text),
              );
            })
          : []),
      );
      break;
    case "public_announcement":
      body = lines(
        line("Lembaga penerbit", evidence.issuing_body),
        line("Judul", evidence.title),
        line("Tanggal", evidence.date),
        line("Isi pengumuman", evidence.body_text),
      );
      break;
    default:
      break;
  }

  return lines(common, body);
}
