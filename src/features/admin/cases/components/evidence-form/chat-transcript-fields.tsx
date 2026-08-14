import { AdminFilterSelect } from "../../../_shared/components/admin-filter-select";
import { useChatTranscript } from "../../hooks/use-chat-transcript";
import type { AdminCaseEvidenceDetail } from "../../types/admin-case";
import { evidenceDateTimeValue } from "../../utils/evidence-form-values";
import { EvidenceDateTimeField, EvidenceTextarea, evidenceInputClass } from "./evidence-form-controls";

export function ChatTranscriptFields({ disabled, initial }: { disabled: boolean; initial?: AdminCaseEvidenceDetail }) {
  const initialParticipants = (initial?.participants ?? []).map((participant) => typeof participant === "string" ? participant : participant.name);
  const initialMessages = (initial?.messages ?? []).map((message) => ({ ...message, timestamp: evidenceDateTimeValue(message.timestamp) }));
  const {
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
  } = useChatTranscript(initialParticipants, initialMessages);
  const senderOptions = [
    { value: "", label: "Pilih sender" },
    ...participants.map((participant) => ({ value: participant, label: participant })),
  ];

  return (
    <div>
      <input type="hidden" name="participants_json" value={JSON.stringify(participants)} />
      <input type="hidden" name="messages_json" value={JSON.stringify(serializedMessages)} />

      <span className="text-xs font-semibold">Participants List</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {participants.map((participant) => <button key={participant} type="button" disabled={disabled} onClick={() => removeParticipant(participant)} title="Hapus participant" className="cursor-pointer rounded-full border border-border-strong bg-background px-3 py-1.5 font-mono text-[9px] text-foreground/65 transition-colors hover:border-red hover:text-red disabled:cursor-not-allowed">{participant} ×</button>)}
        {participants.length === 0 ? <span className="py-1.5 text-[10px] text-foreground/35">Belum ada participant.</span> : null}
      </div>
      <div className="mt-3 flex max-w-md gap-2">
        <input value={participantDraft} onChange={(event) => setParticipantDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addParticipant(); } }} disabled={disabled} placeholder="Nama participant" className={evidenceInputClass} />
        <button type="button" disabled={disabled || !participantDraft.trim()} onClick={addParticipant} className="shrink-0 cursor-pointer rounded-xl border border-purple/55 px-4 text-[10px] font-semibold text-purple transition-colors hover:bg-purple/10 disabled:cursor-not-allowed disabled:opacity-40">Tambah</button>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4">
        <h3 className="text-xs font-semibold">Message Entries ({messages.length})</h3>
        <button type="button" disabled={disabled || participants.length === 0} onClick={addMessage} className="h-8 cursor-pointer rounded-full border border-purple/55 px-4 text-[10px] font-semibold text-purple transition-colors hover:bg-purple/10 disabled:cursor-not-allowed disabled:opacity-50">+ Tambah Message</button>
      </div>

      <div className="mt-3 space-y-3">
        {messages.map((message, index) => (
          <article ref={index === messages.length - 1 ? latestMessageRef : undefined} key={message.id} className="rounded-xl border border-border-strong bg-background p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-mono text-[9px] text-foreground/40">MESSAGE {String(index + 1).padStart(2, "0")}</span>
              {messages.length > 1 ? <button type="button" disabled={disabled} onClick={() => removeMessage(message.id)} className="cursor-pointer text-[10px] text-red hover:underline disabled:cursor-not-allowed">Hapus</button> : null}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <span className="mb-2 block text-xs font-semibold">Sender</span>
                <AdminFilterSelect label="Sender" value={message.sender} options={senderOptions} onChange={(value) => updateMessage(message.id, { sender: value })} disabled={disabled || participants.length === 0} showLabel={false} />
              </div>
              <EvidenceDateTimeField label="Timestamp" min="2020-01-01T00:00:00" max="2100-12-31T23:59:59" value={message.timestamp} onValueChange={(timestamp) => updateMessage(message.id, { timestamp })} required disabled={disabled} />
            </div>
            <div className="mt-4"><EvidenceTextarea label="Message Text" value={message.text} onChange={(event) => updateMessage(message.id, { text: event.target.value })} required disabled={disabled} /></div>
          </article>
        ))}
      </div>
    </div>
  );
}
