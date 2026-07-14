import type { BirthInfo } from "@/types/birth";
import type { BaziChart } from "@/types/bazi";
import type { BaziReport } from "@/types/report";
export const STORAGE = { birth: "dfmp_birth", chart: "dfmp_chart", report: "dfmp_report", sample: "dfmp_sample", request: "dfmp_request" };
export function saveJson(key: string, value: unknown) { if (typeof window !== "undefined") sessionStorage.setItem(key, JSON.stringify(value)); }
export function loadJson<T>(key: string): T | null { if (typeof window === "undefined") return null; try { const v = sessionStorage.getItem(key); return v ? JSON.parse(v) as T : null; } catch { return null; } }
export const loadBirth = () => loadJson<BirthInfo>(STORAGE.birth);
export const loadChart = () => loadJson<BaziChart>(STORAGE.chart);
export const loadReport = () => loadJson<BaziReport>(STORAGE.report);

