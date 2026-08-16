import Image from "next/image";
import { useState } from "react";

type DecisionPayload = {
  final_decision: string;
  final_confidence: number;
  reason: string;
};

type GameplayDecisionPageProps = {
  caseTitle: string;
  assessment: string;
  classification: string;
  openedEvidenceCount: number;
  totalEvidenceCount: number;
  pending: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (payload: DecisionPayload) => void;
};

export function GameplayDecisionPage({
  caseTitle,
  assessment,
  classification,
  openedEvidenceCount,
  totalEvidenceCount,
  pending,
  error,
  onBack,
  onSubmit,
}: GameplayDecisionPageProps) {
  const [decision, setDecision] = useState("mark_misleading");
  const [confidence, setConfidence] = useState(85);
  const [reason, setReason] = useState("");

  return (
    <main className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8">
      <div className="mx-auto max-w-[720px]">
        <div className="text-center">
          <Image
            src="/raw/mascot-jacket-think.webp"
            alt="Maskot KODEKABI sedang berpikir"
            width={72}
            height={84}
            className="mx-auto h-20 w-auto object-contain"
          />
          <h1 className="mt-4 font-display text-4xl font-bold uppercase sm:text-5xl">
            Waktunya memutuskan<span className="text-red">.</span>
          </h1>
          <p className="mt-2 text-xs text-foreground/45">
            Setelah dikirim, tidak bisa diubah. Kota menunggu.
          </p>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-foreground/35">
            {caseTitle}
          </p>
        </div>
        <div className="mt-7 space-y-2">
          <SummaryRow label="Sinyal mencurigakan" value={assessment} />
          <SummaryRow label="Klasifikasi klaim" value={classification} />
          <SummaryRow
            label="Papan bukti"
            value={`${openedEvidenceCount}/${totalEvidenceCount} dibuka`}
          />
        </div>
        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red/30 bg-red/8 px-4 py-3 text-xs text-red"
          >
            {error}
          </p>
        ) : null}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit({
              final_decision: decision,
              final_confidence: confidence,
              reason,
            });
          }}
          className="mt-5 rounded-3xl border border-border bg-surface p-5 sm:p-6"
        >
          <p className="text-xs font-semibold">Vonismu untuk kasus ini</p>
          <button
            type="button"
            disabled={pending}
            onClick={() => setDecision("mark_misleading")}
            className={`mt-4 w-full rounded-xl border px-4 py-3 text-left text-xs disabled:cursor-not-allowed disabled:opacity-60 ${decision === "mark_misleading" ? "border-red bg-red/10" : "border-border"}`}
          >
            Tandai menyesatkan & kirim klarifikasi publik
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => setDecision("abstain")}
            className={`mt-2 w-full rounded-xl border px-4 py-3 text-left text-xs disabled:cursor-not-allowed disabled:opacity-60 ${decision === "abstain" ? "border-border-strong bg-background" : "border-border"}`}
          >
            Abaikan - biarkan komunitas menilai
          </button>
          <label className="mt-6 block text-xs font-semibold">
            Keyakinan final{" "}
            <output className="float-right text-purple">{confidence}%</output>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={confidence}
              disabled={pending}
              onChange={(event) => setConfidence(Number(event.target.value))}
              className="mt-3 w-full accent-purple disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>
          <label className="mt-5 block text-xs font-semibold">
            Alasanmu{" "}
            <span className="font-normal text-foreground/40">
              (singkat saja)
            </span>
            <textarea
              value={reason}
              disabled={pending}
              onChange={(event) => setReason(event.target.value)}
              required
              className="mt-2 min-h-28 w-full resize-y rounded-xl border border-border bg-background p-3 text-xs outline-none focus:border-purple"
              placeholder="Tulis alasan berdasarkan bukti yang kamu buka..."
            />
          </label>
          <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              disabled={pending}
              onClick={onBack}
              className="rounded-full border border-border-strong px-6 py-3 text-xs font-semibold text-foreground/60 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={pending || !reason.trim()}
              className="rounded-full bg-white px-7 py-3 text-xs font-bold text-button-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? "Mengirim..." : "Kunci keputusan"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-[10px] text-foreground/35">
          Sekali kirim - tidak ada kiriman ganda.
        </p>
      </div>
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
      <div>
        <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-foreground/35">
          {label}
        </p>
        <p className="mt-1 text-xs font-semibold">{value}</p>
      </div>
      <span className="grid size-5 place-items-center rounded-full bg-green/15 text-[10px] text-green">
        ✓
      </span>
    </div>
  );
}
