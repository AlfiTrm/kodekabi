export type CaseCardTone = "blue" | "purple" | "red" | "green" | "orange";

export type CaseCard = {
  id: string;
  eyebrow: string;
  title: string;
  tone: CaseCardTone;
  thumbnail: string;
  backgroundColor?: string;
  score: string;
  body: string;
  position: "far-left" | "left" | "center" | "right" | "far-right";
};

export const homeCaseCards: CaseCard[] = [
  {
    id: "forum-warga",
    eyebrow: "Kasus - Forum",
    title: "Forum Warga",
    tone: "blue",
    thumbnail: "/thumbnail/thumbnail-blue.webp",
    score: "4.8",
    body: "Suara warga mulai saling bertabrakan.",
    position: "far-left",
  },
  {
    id: "chatbot-nakal",
    eyebrow: "Kasus - Chatbot",
    title: "Chatbot Nakal",
    tone: "purple",
    thumbnail: "/thumbnail/thumbnail-purple.webp",
    score: "4.7",
    body: "Jawaban otomatis menyimpan lebih banyak rahasia.",
    position: "left",
  },
  {
    id: "hoaks-viral",
    eyebrow: "Kasus Utama - Social",
    title: "Hoaks Viral",
    tone: "red",
    thumbnail: "/thumbnail/thumbnail-red.webp",
    score: "4.9",
    body: "Sembuh 27 penyakit?!",
    position: "center",
  },
  {
    id: "artikel-ulakan",
    eyebrow: "Kasus - Artikel",
    title: "Betul atau Ulakan",
    tone: "green",
    thumbnail: "/thumbnail/thumbnail-green.webp",
    score: "4.6",
    body: "Satu judul mengubah cara kota membaca berita.",
    position: "right",
  },
  {
    id: "statistik-rasa",
    eyebrow: "Kasus - Statistik",
    title: "Angka Palsu",
    tone: "orange",
    thumbnail: "/thumbnail/thumbnail-orange.webp",
    score: "4.4",
    body: "Data yang terlihat rapi belum tentu benar.",
    position: "far-right",
  },
];
