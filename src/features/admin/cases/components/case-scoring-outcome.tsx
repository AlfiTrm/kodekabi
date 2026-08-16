import { cookies } from "next/headers";
import { ADMIN_ACCESS_COOKIE } from "../../auth/constants/admin-auth";
import { getAdminCaseScoringOutcomeConfig } from "../services/admin-cases-service";
import type { AdminCase } from "../types/admin-case";
import { ScoringOutcomeForm } from "./scoring-outcome-form";

type CaseScoringOutcomeProps = {
  caseItem: AdminCase;
};

export async function CaseScoringOutcome({ caseItem }: CaseScoringOutcomeProps) {
  const accessToken = (await cookies()).get(ADMIN_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  let initialData = null;
  try {
    initialData = await getAdminCaseScoringOutcomeConfig(caseItem.case_id, caseItem.current_case_version_id, accessToken);
  } catch {
    // API returns 404 or fails if not configured yet
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-border-strong pb-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-lg font-bold">Scoring &amp; Outcome</h2>
          <p className="mt-1 text-xs text-foreground/60">
            Konfigurasi pembobotan skor dan outcome untuk studi kasus &ldquo;{caseItem.title}&rdquo;.
          </p>
        </div>
      </div>
      
      <ScoringOutcomeForm caseItem={caseItem} initialData={initialData} />
    </div>
  );
}
