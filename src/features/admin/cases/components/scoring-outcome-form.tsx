"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { updateAdminScoringAction } from "../actions/update-admin-scoring-action";
import type { AdminCase, ScoringOutcomeConfigResponse, ScoringRule, OutcomeRule } from "../types/admin-case";



const PlusIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const SparkleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4L12 3Z" />
    <path d="m19 15-.7 2.3L16 18l2.3.7L19 21l.7-2.3L19 15Z" />
  </svg>
);

type ScoringOutcomeFormProps = {
  caseItem: AdminCase;
  initialData: ScoringOutcomeConfigResponse | null;
};

const initialState = { error: null, success: null };

export function ScoringOutcomeForm({ caseItem, initialData }: ScoringOutcomeFormProps) {
  const updateActionWithCaseParams = updateAdminScoringAction.bind(null, caseItem.case_id, caseItem.current_case_version_id, caseItem.slug);
  const [state, formAction, pending] = useActionState(updateActionWithCaseParams, initialState);
  
  const [generated, setGenerated] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [scoringRules, setScoringRules] = useState<ScoringRule[]>(
    initialData?.scoring_rules || [
      {
        category_key: "evidence_evaluation",
        category_label: "Evaluasi Bukti",
        weight_basis_points: 3000,
        settings: {
          max_score: 30,
          criteria: [
            "Mengidentifikasi sumber utama",
            "Membedakan bukti kuat dan lemah",
            "Memeriksa konteks bukti"
          ]
        },
        sort_order: 1
      },
      {
        category_key: "claim_analysis",
        category_label: "Analisis Klaim",
        weight_basis_points: 2500,
        settings: {
          max_score: 25,
          criteria: [
            "Menentukan klaim utama",
            "Mengenali klaim yang dilebih-lebihkan"
          ]
        },
        sort_order: 2
      },
      {
        category_key: "confidence_calibration",
        category_label: "Kalibrasi Keyakinan",
        weight_basis_points: 1500,
        settings: {
          max_score: 15,
          requires_confidence_check: true
        },
        sort_order: 3
      },
      {
        category_key: "reasoning",
        category_label: "Penalaran",
        weight_basis_points: 2000,
        settings: {
          max_score: 20,
          criteria: ["Menjelaskan alasan secara runtut"]
        },
        sort_order: 4
      },
      {
        category_key: "safety_judgment",
        category_label: "Penilaian Dampak",
        weight_basis_points: 1000,
        settings: {
          max_score: 10,
          criteria: ["Mempertimbangkan dampak sosial dari keputusan"]
        },
        sort_order: 5
      }
    ]
  );

  const [outcomeRules, setOutcomeRules] = useState<OutcomeRule[]>(
    initialData?.outcome_rules || [
      {
        outcome_key: "expert",
        outcome_label: "Expert",
        score_min: 80,
        score_max: 100,
        outcome_id: "digital-investigator",
        narrative_text: "Kamu mampu mengevaluasi bukti, klaim, dan dampak informasi dengan sangat matang.",
        sort_order: 1,
        city_impact_settings: [
          { impact_key: "health", impact_value: 8, sort_order: 1 },
          { impact_key: "trust", impact_value: 9, sort_order: 2 },
          { impact_key: "stability", impact_value: 7, sort_order: 3 },
          { impact_key: "wellbeing", impact_value: 8, sort_order: 4 }
        ]
      },
      {
        outcome_key: "developing",
        outcome_label: "Developing",
        score_min: 50,
        score_max: 79,
        outcome_id: "careful-learner",
        narrative_text: "Kamu sudah mulai membaca informasi dengan kritis, tapi masih perlu memperkuat evaluasi bukti dan alasan.",
        sort_order: 2,
        city_impact_settings: [
          { impact_key: "health", impact_value: 4, sort_order: 1 },
          { impact_key: "trust", impact_value: 5, sort_order: 2 },
          { impact_key: "stability", impact_value: 4, sort_order: 3 },
          { impact_key: "wellbeing", impact_value: 5, sort_order: 4 }
        ]
      },
      {
        outcome_key: "beginner",
        outcome_label: "Beginner",
        score_min: 0,
        score_max: 49,
        outcome_id: "first-step",
        narrative_text: "Kamu masih perlu latihan mengenali bukti, klaim, dan dampak dari informasi yang kamu temui.",
        sort_order: 3,
        city_impact_settings: [
          { impact_key: "health", impact_value: 1, sort_order: 1 },
          { impact_key: "trust", impact_value: 2, sort_order: 2 },
          { impact_key: "stability", impact_value: 1, sort_order: 3 },
          { impact_key: "wellbeing", impact_value: 2, sort_order: 4 }
        ]
      }
    ]
  );

  useEffect(() => {
    if (state.success) {
      
      const t1 = setTimeout(() => setSuccessMsg(state.success || ""), 0); const t2 = setTimeout(() => setSuccessMsg(""), 3000); return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [state.success]);

  const handleGenerate = () => {
    setGenerated(true);
    setTimeout(() => setGenerated(false), 1800);
  };

  const totalWeight = useMemo(() => {
    return scoringRules.reduce((sum, rule) => sum + (Number(rule.weight_basis_points) || 0), 0);
  }, [scoringRules]);

  const updateScoringWeight = (index: number, value: string) => {
    const val = parseInt(value, 10);
    setScoringRules((current) =>
      current.map((rule, i) => (i === index ? { ...rule, weight_basis_points: isNaN(val) ? 0 : val } : rule))
    );
  };

  const updateScoringCriteriaTag = (ruleIndex: number, tagIndex: number, value: string) => {
    setScoringRules((current) =>
      current.map((rule, i) => {
        if (i !== ruleIndex) return rule;
        const newCriteria = [...((rule.settings?.criteria as string[]) || [])];
        newCriteria[tagIndex] = value;
        return { ...rule, settings: { ...rule.settings, criteria: newCriteria } };
      })
    );
  };

  const addScoringCriteriaTag = (ruleIndex: number) => {
    setScoringRules((current) =>
      current.map((rule, i) => {
        if (i !== ruleIndex) return rule;
        const newCriteria = [...((rule.settings?.criteria as string[]) || []), "NEW-CRITERIA"];
        return { ...rule, settings: { ...rule.settings, criteria: newCriteria } };
      })
    );
  };

  const removeScoringCriteriaTag = (ruleIndex: number, tagIndex: number) => {
    setScoringRules((current) =>
      current.map((rule, i) => {
        if (i !== ruleIndex) return rule;
        const newCriteria = [...((rule.settings?.criteria as string[]) || [])];
        newCriteria.splice(tagIndex, 1);
        return { ...rule, settings: { ...rule.settings, criteria: newCriteria } };
      })
    );
  };

  const updateOutcomeRule = (index: number, key: keyof OutcomeRule, value: string | number) => {
    setOutcomeRules((current) =>
      current.map((outcome, i) => (i === index ? { ...outcome, [key]: value } : outcome))
    );
  };

  const updateOutcomeImpact = (outcomeIndex: number, impactIndex: number, field: string, value: string | number) => {
    setOutcomeRules((current) =>
      current.map((outcome, i) => {
        if (i !== outcomeIndex) return outcome;
        const newImpacts = [...(outcome.city_impact_settings || [])];
        newImpacts[impactIndex] = { ...newImpacts[impactIndex], [field]: value };
        return { ...outcome, city_impact_settings: newImpacts };
      })
    );
  };

  const addOutcomeImpact = (outcomeIndex: number) => {
    setOutcomeRules((current) =>
      current.map((outcome, i) => {
        if (i !== outcomeIndex) return outcome;
        const newImpacts = [
          ...(outcome.city_impact_settings || []),
          { impact_key: "new", impact_value: 0, sort_order: (outcome.city_impact_settings?.length || 0) + 1 }
        ];
        return { ...outcome, city_impact_settings: newImpacts };
      })
    );
  };

  const removeOutcomeImpact = (outcomeIndex: number, impactIndex: number) => {
    setOutcomeRules((current) =>
      current.map((outcome, i) => {
        if (i !== outcomeIndex) return outcome;
        const newImpacts = [...(outcome.city_impact_settings || [])];
        newImpacts.splice(impactIndex, 1);
        return { ...outcome, city_impact_settings: newImpacts };
      })
    );
  };

  const configJson = JSON.stringify({ scoring_rules: scoringRules, outcome_rules: outcomeRules });

  return (
    <form action={formAction}>
      <input type="hidden" name="config_json" value={configJson} />

      {/* =========================================
          AI GENERATOR HEADER
      ========================================== */}
      <section className="mb-5 rounded-[12px] border border-border-strong bg-surface px-3 py-3 sm:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[15px] font-bold tracking-[-0.2px] text-foreground sm:text-[16px]">
              Generate Scoring &amp; Outcome menggunakan AI
            </h1>
            <p className="mt-[3px] text-[11px] text-foreground/50 sm:text-[13px]">
              Generate berdasarkan evidence dan questions yang sudah ada. Requires: Evidence ✓ Questions ✓
            </p>
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={generated}
            className="flex h-[31px] shrink-0 items-center justify-center gap-2 rounded-full bg-purple px-4 text-[11px] font-bold text-white transition hover:bg-purple/90 active:scale-[0.98] disabled:opacity-50"
          >
            <SparkleIcon />
            {generated ? "Generating..." : "Generate AI Scoring"}
          </button>
        </div>
      </section>

      {/* =========================================
          MAIN TWO-COLUMN CONTENT
      ========================================== */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_0.96fr] lg:gap-5">
        {/* =======================================
            LEFT: SCORING CONFIGURATION
        ======================================== */}
        <section>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-foreground sm:text-[18px]">Scoring Configuration</h2>
              <p className="mt-[9px] text-[11px] text-foreground/50">Scoring Rules (5 Kategori)</p>
            </div>
            <div className="rounded-full bg-green/10 px-3 py-[5px] font-mono text-[10px] font-bold text-green">
              TOTAL BOBOT: {(totalWeight / 100).toFixed(2)} / 100.00
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {scoringRules.map((rule, ruleIndex) => (
              <div key={rule.category_key} className="rounded-[13px] border border-border-strong bg-surface px-4 py-4">
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[14px] font-bold text-foreground sm:text-[15px]">
                      {ruleIndex + 1}. {rule.category_label}
                    </h3>
                    <p className="text-[11px] text-foreground/40">{rule.category_key}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <label className="mb-1 block font-mono text-[8px] text-foreground/50">BOBOT (Basis Pts)</label>
                    <input
                      type="number"
                      value={rule.weight_basis_points}
                      onChange={(e) => updateScoringWeight(ruleIndex, e.target.value)}
                      className="h-[25px] w-[60px] rounded-[6px] border border-border-strong bg-background px-2 text-[11px] text-foreground outline-none focus:border-purple"
                    />
                  </div>
                </div>

                {/* Fields */}
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">MAX SCORE</label>
                    <input
                      type="number"
                      value={(rule.settings?.max_score as number) || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setScoringRules((curr) =>
                          curr.map((r, i) => (i === ruleIndex ? { ...r, settings: { ...r.settings, max_score: isNaN(val) ? 0 : val } } : r))
                        );
                      }}
                      className="h-[25px] w-full rounded-[6px] border border-border-strong bg-background px-[10px] text-[11px] text-foreground outline-none focus:border-purple"
                    />
                  </div>

                  {Array.isArray(rule.settings?.criteria) && (
                    <div>
                      <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">CRITERIA TAGS</label>
                      <div className="flex flex-wrap items-center gap-1">
                        {(rule.settings.criteria as string[]).map((tag, tagIndex) => (
                          <div key={tagIndex} className="group flex items-center gap-1 rounded-[5px] border border-purple/30 bg-purple/10 px-[6px] py-[3px] font-mono text-[9px] text-purple">
                            <input
                              value={tag}
                              onChange={(e) => updateScoringCriteriaTag(ruleIndex, tagIndex, e.target.value)}
                              className="w-[100px] bg-transparent text-[9px] text-purple outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeScoringCriteriaTag(ruleIndex, tagIndex)}
                              className="hidden text-purple group-hover:block"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addScoringCriteriaTag(ruleIndex)}
                          className="flex items-center gap-1 rounded-[5px] border border-border-strong bg-background px-[7px] py-[3px] text-[9px] text-foreground/50 hover:border-purple/30 hover:text-purple"
                        >
                          <PlusIcon /> Add
                        </button>
                      </div>
                    </div>
                  )}

                  {rule.settings?.requires_confidence_check !== undefined && (
                    <div>
                      <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">REQUIRES CONFIDENCE CHECK</label>
                      <select
                        value={rule.settings.requires_confidence_check ? "true" : "false"}
                        onChange={(e) => {
                          const val = e.target.value === "true";
                          setScoringRules((curr) =>
                            curr.map((r, i) => (i === ruleIndex ? { ...r, settings: { ...r.settings, requires_confidence_check: val } } : r))
                          );
                        }}
                        className="h-[25px] w-full rounded-[6px] border border-border-strong bg-background px-[10px] text-[11px] text-foreground outline-none focus:border-purple"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =======================================
            RIGHT: OUTCOME RULES
        ======================================== */}
        <section>
          <h2 className="text-[16px] font-bold text-foreground sm:text-[18px]">Outcome Rules</h2>
          <p className="mt-[9px] text-[11px] leading-4 text-foreground/50">
            Tentukan naskah akhir dan dampak kota berdasarkan skor yang dicapai pemain.
          </p>

          <div className="mt-3 space-y-3">
            {outcomeRules.map((outcome, index) => {
              const accent =
                outcome.outcome_key === "expert"
                  ? "border-l-green"
                  : outcome.outcome_key === "developing"
                  ? "border-l-orange"
                  : "border-l-red";

              const titleColor =
                outcome.outcome_key === "expert"
                  ? "text-green"
                  : outcome.outcome_key === "developing"
                  ? "text-orange"
                  : "text-red";

              const scoreBg =
                outcome.outcome_key === "expert"
                  ? "bg-green/10 text-green"
                  : outcome.outcome_key === "developing"
                  ? "bg-orange/10 text-orange"
                  : "bg-red/10 text-red";

              return (
                <div key={index} className={`rounded-[12px] border border-border-strong border-l-[2px] ${accent} bg-surface px-4 py-4`}>
                  {/* Outcome Header */}
                  <div className="flex items-start justify-between gap-3">
                    <input
                      value={outcome.outcome_label}
                      onChange={(e) => updateOutcomeRule(index, "outcome_label", e.target.value)}
                      className={`min-w-0 flex-1 bg-transparent text-[14px] font-bold outline-none ${titleColor}`}
                    />
                    <div className={`flex items-center gap-1 rounded-[5px] px-[7px] py-[4px] font-mono text-[9px] font-bold ${scoreBg}`}>
                      SKOR <input
                        value={outcome.score_min}
                        onChange={(e) => updateOutcomeRule(index, "score_min", parseInt(e.target.value) || 0)}
                        className="w-4 bg-transparent text-center outline-none"
                      /> - <input
                        value={outcome.score_max}
                        onChange={(e) => updateOutcomeRule(index, "score_max", parseInt(e.target.value) || 0)}
                        className="w-4 bg-transparent text-center outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {/* Outcome Key */}
                    <div>
                      <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">OUTCOME KEY & ID</label>
                      <div className="flex gap-2">
                        <input
                          value={outcome.outcome_key}
                          onChange={(e) => updateOutcomeRule(index, "outcome_key", e.target.value)}
                          placeholder="Key"
                          className="h-[26px] flex-1 rounded-[6px] border border-border-strong bg-background px-[10px] text-[11px] text-foreground outline-none focus:border-purple"
                        />
                        <input
                          value={outcome.outcome_id}
                          onChange={(e) => updateOutcomeRule(index, "outcome_id", e.target.value)}
                          placeholder="ID"
                          className="h-[26px] flex-1 rounded-[6px] border border-border-strong bg-background px-[10px] text-[11px] text-foreground outline-none focus:border-purple"
                        />
                      </div>
                    </div>

                    {/* Narrative */}
                    <div>
                      <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">NARRATIVE TEXT</label>
                      <textarea
                        value={outcome.narrative_text}
                        onChange={(e) => updateOutcomeRule(index, "narrative_text", e.target.value)}
                        rows={3}
                        className="min-h-[54px] w-full resize-none rounded-[6px] border border-border-strong bg-background px-[10px] py-[8px] text-[11px] leading-[1.45] text-foreground/80 outline-none focus:border-purple"
                      />
                    </div>

                    {/* City Impact */}
                    <div>
                      <label className="mb-[6px] block font-mono text-[9px] text-foreground/50">CITY IMPACT SETTINGS</label>
                      <div className="flex flex-wrap gap-1">
                        {outcome.city_impact_settings?.map((impact, impactIndex) => (
                          <div key={impactIndex} className="group flex items-center rounded-[5px] border border-purple/30 bg-purple/10 px-[6px] py-[3px]">
                            <input
                              value={impact.impact_key}
                              onChange={(e) => updateOutcomeImpact(index, impactIndex, "impact_key", e.target.value)}
                              className="w-[45px] bg-transparent font-mono text-[9px] text-purple outline-none"
                            />
                            <span className="text-[9px] text-purple">+</span>
                            <input
                              type="number"
                              value={impact.impact_value}
                              onChange={(e) => updateOutcomeImpact(index, impactIndex, "impact_value", parseInt(e.target.value) || 0)}
                              className="w-[15px] bg-transparent font-mono text-[9px] text-purple outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => removeOutcomeImpact(index, impactIndex)}
                              className="ml-1 hidden text-purple group-hover:block"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOutcomeImpact(index)}
                          className="flex items-center rounded-[5px] border border-border-strong bg-background px-[6px] py-[3px] text-[9px] text-foreground/50 hover:border-purple/30 hover:text-purple"
                        >
                          <PlusIcon />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =========================================
          ALERTS
      ========================================== */}
      {state.error && (
        <div className="mt-5 rounded-[12px] border border-red/25 bg-red/8 px-4 py-3 text-[13px] text-red">
          {state.error}
        </div>
      )}
      {successMsg && (
        <div className="mt-5 rounded-[12px] border border-green/25 bg-green/8 px-4 py-3 text-[13px] text-green">
          {successMsg}
        </div>
      )}

      {/* =========================================
          BOTTOM ACTION
      ========================================== */}
      <div className="mt-5 border-t border-border-strong pt-4">
        {caseItem.status !== "draft" && (
          <div className="mb-4 rounded-[12px] border border-orange/25 bg-orange/8 px-4 py-3 text-[10px] text-orange">
            Perhatian: Case ini berstatus <strong>{caseItem.status}</strong>. Kamu tidak dapat mengubah konfigurasi pada versi ini. Silakan buat versi draft baru (New Version) jika ingin mengubah konfigurasi.
          </div>
        )}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] text-foreground/50">
            Perubahan scoring akan langsung diimplementasikan pada sesi permainan berikutnya.
          </p>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              disabled={pending || caseItem.status !== "draft"}
              className="h-[36px] rounded-full bg-purple px-5 text-[11px] font-bold text-white transition hover:bg-purple/90 active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? "Menyimpan..." : (state.success ? "Tersimpan ✓" : "Simpan Scoring")}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


