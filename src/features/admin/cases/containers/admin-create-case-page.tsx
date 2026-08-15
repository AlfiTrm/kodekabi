"use client";

import { useState } from "react";
import Link from "next/link";

import { AdminPageHeader } from "../../_shared/components/admin-page-header";
import { CreateCaseForm } from "../components/create-case-form";
import { AiAssistedCreateCaseForm } from "../components/ai-assisted-create-case-form";
import type { AdminCaseLookups } from "../types/admin-case";

type CreateCaseTab = "manual" | "ai";

type AdminCreateCasePageProps = {
  lookups: AdminCaseLookups;
};

export function AdminCreateCasePage({ lookups }: AdminCreateCasePageProps) {
  const [activeTab, setActiveTab] = useState<CreateCaseTab>("manual");

  return (
    <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
      <AdminPageHeader
        title="Buat Case Baru"
        description="Susun fondasi kasus sebelum menambahkan bukti dan pertanyaan."
        breadcrumb={
          <>
            <Link href="/admin/cases" className="transition-colors hover:text-purple">Case CMS</Link>
            <span className="mx-2">›</span>
            <span className="text-purple">Buat Case</span>
          </>
        }
      />

      {/* ── Mode Tabs ── */}
      <nav className="mt-7 flex gap-1 rounded-2xl border border-border bg-surface p-1.5" aria-label="Mode pembuatan case">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          aria-current={activeTab === "manual" ? "page" : undefined}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold transition-colors sm:flex-none ${
            activeTab === "manual"
              ? "bg-background text-foreground shadow-sm"
              : "text-foreground/45 hover:text-foreground"
          }`}
        >
          <span aria-hidden="true">✎</span>
          Manual
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          aria-current={activeTab === "ai" ? "page" : undefined}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold transition-colors sm:flex-none ${
            activeTab === "ai"
              ? "bg-purple/15 text-purple shadow-sm border border-purple/30"
              : "text-foreground/45 hover:text-foreground"
          }`}
        >
          <span aria-hidden="true">⚄</span>
          AI-Assisted
          <span className="rounded-full bg-purple/20 px-2 py-0.5 font-mono text-[8px] text-purple">BETA</span>
        </button>
      </nav>

      {activeTab === "manual" ? (
        <CreateCaseForm lookups={lookups} />
      ) : (
        <AiAssistedCreateCaseForm lookups={lookups} />
      )}
    </div>
  );
}
