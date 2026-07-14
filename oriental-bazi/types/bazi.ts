export type ElementKey = "wood" | "fire" | "earth" | "metal" | "water";
export interface Pillar { heavenlyStem: string; earthlyBranch: string; display: string }
export interface BaziChart {
  inputSummary: { calendarType: string; originalDate: string; originalTime: string; timezone: string; timeAccuracy: string };
  pillars: { year: Pillar; month: Pillar; day: Pillar; hour: Pillar | null; hourCandidates?: Pillar[] };
  dayMaster: { stem: string; element: string; yinYang: string };
  fiveElements: Record<ElementKey, number>;
  tenGods: Array<{ pillar: string; stem: string; relation: string }>;
  hiddenStems: Array<{ pillar: string; stems: string[] }>;
  solarTerm: { previous: string | null; next: string | null };
  luckCycles: Array<{ startAge: number; ganZhi: string }> | null;
  confidence: { level: "high" | "medium" | "low"; score: number; reasons: string[] };
  ruleVersion: string;
}

