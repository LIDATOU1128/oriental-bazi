import { Lunar, Solar } from "lunar-javascript";
import type { BirthInfo, BirthPeriod, Shichen } from "@/types/birth";
import type { BaziChart, ElementKey, Pillar } from "@/types/bazi";
import { SHICHEN } from "@/lib/constants";

const STEM_ELEMENT: Record<string, ElementKey> = { 甲: "wood", 乙: "wood", 丙: "fire", 丁: "fire", 戊: "earth", 己: "earth", 庚: "metal", 辛: "metal", 壬: "water", 癸: "water" };
const BRANCH_ELEMENT: Record<string, ElementKey> = { 寅: "wood", 卯: "wood", 巳: "fire", 午: "fire", 辰: "earth", 戌: "earth", 丑: "earth", 未: "earth", 申: "metal", 酉: "metal", 亥: "water", 子: "water" };
const ELEMENT_CN: Record<ElementKey, string> = { wood: "木", fire: "火", earth: "土", metal: "金", water: "水" };
const YANG_STEMS = new Set(["甲", "丙", "戊", "庚", "壬"]);
const PERIOD_HOURS: Record<BirthPeriod, number[]> = { lateNight: [0, 2, 4], earlyMorning: [6, 8], morning: [10], noon: [12], afternoon: [14, 16], evening: [18, 20, 22] };

function pillar(display: string): Pillar { return { heavenlyStem: display[0], earthlyBranch: display[1], display }; }
function shichenHour(value: Shichen) { return (SHICHEN.find(([key]) => key === value)?.[3] ?? 0) as number; }
function toSolar(input: BirthInfo, hour: number, minute: number) {
  if (input.calendarType === "lunar") {
    const month = input.isLeapMonth ? -input.birthMonth : input.birthMonth;
    return Lunar.fromYmdHms(input.birthYear, month, input.birthDay, hour, minute, 0).getSolar();
  }
  return Solar.fromYmdHms(input.birthYear, input.birthMonth, input.birthDay, hour, minute, 0);
}
function resolvedHours(input: BirthInfo): number[] {
  if (input.timeAccuracy === "exact") return [input.birthHour!];
  if (input.timeAccuracy === "shichen") return [shichenHour(input.birthShichen!)];
  if (input.timeAccuracy === "period") return PERIOD_HOURS[input.birthPeriod!];
  return [];
}

export function calculateBazi(input: BirthInfo): BaziChart {
  if (input.timezone !== "Asia/Shanghai" && !input.timezone.includes("/")) throw new Error("INVALID_TIMEZONE");
  if (input.useTrueSolarTime && input.longitude === undefined) throw new Error("SOLAR_TIME_LOCATION_REQUIRED");
  // 采用当地标准时间；未知时辰仅借用正午读取与时间无关的年月日柱，最终不返回时柱。
  const hours = resolvedHours(input);
  const baseHour = hours[0] ?? 12;
  const minute = input.timeAccuracy === "exact" ? input.birthMinute! : 0;
  const solar = toSolar(input, baseHour, minute);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  ec.setSect(2); // 晚子时不换日（00:00 换日），明确采用 sect 2 口径。
  const year = pillar(ec.getYear()); const month = pillar(ec.getMonth()); const day = pillar(ec.getDay());
  const hourCandidates = hours.map((h) => { const candidate = toSolar(input, h, 0).getLunar().getEightChar(); candidate.setSect(2); return pillar(candidate.getTime()); });
  const uniqueCandidates = Array.from(new Map(hourCandidates.map((p) => [p.display, p])).values());
  const hour = input.timeAccuracy === "exact" || input.timeAccuracy === "shichen" ? uniqueCandidates[0] : null;
  const pillarsForCount = [year, month, day, ...(hour ? [hour] : [])];
  const counts: Record<ElementKey, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  pillarsForCount.forEach((p) => { counts[STEM_ELEMENT[p.heavenlyStem]] += 1; counts[BRANCH_ELEMENT[p.earthlyBranch]] += 1; });
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  (Object.keys(counts) as ElementKey[]).forEach((k) => { counts[k] = Math.round((counts[k] / total) * 100); });
  const labels = ["year", "month", "day", "hour"];
  const ecMethods = ["getYear", "getMonth", "getDay", "getTime"];
  const hiddenMethods = ["getYearHideGan", "getMonthHideGan", "getDayHideGan", "getTimeHideGan"];
  const godMethods = ["getYearShiShenGan", "getMonthShiShenGan", "getDayShiShenGan", "getTimeShiShenGan"];
  const included = hour ? 4 : 3;
  const tenGods = labels.slice(0, included).map((name, i) => ({ pillar: name, stem: ec[ecMethods[i]]()[0], relation: ec[godMethods[i]]() }));
  const hiddenStems = labels.slice(0, included).map((name, i) => ({ pillar: name, stems: [...ec[hiddenMethods[i]]()] }));
  let luckCycles: BaziChart["luckCycles"] = null;
  if (hour && input.timeAccuracy !== "period") {
    const yun = ec.getYun(input.gender === "male" ? 1 : 0);
    luckCycles = yun.getDaYun().slice(1, 7).map((d: {getStartAge():number;getGanZhi():string}) => ({ startAge: d.getStartAge(), ganZhi: d.getGanZhi() }));
  }
  const confidence = input.timeAccuracy === "exact"
    ? { level: "high" as const, score: 0.92, reasons: ["出生时间精确到分钟", "采用当地标准时间排盘"] }
    : input.timeAccuracy === "shichen"
      ? { level: "medium" as const, score: 0.72, reasons: ["出生时间为大概时辰", "时辰交界附近可能出现时柱变化"] }
      : { level: "low" as const, score: input.timeAccuracy === "period" ? 0.5 : 0.38, reasons: input.timeAccuracy === "period" ? ["时间段跨越多个时辰", "仅保留候选结构的共同部分"] : ["出生时间未知", "时柱与起运信息未计算"] };
  const originalTime = input.timeAccuracy === "unknown" ? "未知" : input.timeAccuracy === "period" ? `时间段：${input.birthPeriod}` : input.timeAccuracy === "shichen" ? `时辰：${input.birthShichen}` : `${String(input.birthHour).padStart(2, "0")}:${String(input.birthMinute).padStart(2, "0")}`;
  return {
    inputSummary: { calendarType: input.calendarType, originalDate: `${input.birthYear}-${String(input.birthMonth).padStart(2,"0")}-${String(input.birthDay).padStart(2,"0")}`, originalTime, timezone: input.timezone, timeAccuracy: input.timeAccuracy },
    pillars: { year, month, day, hour, ...(input.timeAccuracy === "period" ? { hourCandidates: uniqueCandidates } : {}) },
    dayMaster: { stem: day.heavenlyStem, element: ELEMENT_CN[STEM_ELEMENT[day.heavenlyStem]], yinYang: YANG_STEMS.has(day.heavenlyStem) ? "阳" : "阴" },
    fiveElements: counts, tenGods, hiddenStems,
    solarTerm: { previous: lunar.getPrevJieQi()?.getName?.() ?? null, next: lunar.getNextJieQi()?.getName?.() ?? null },
    luckCycles, confidence, ruleVersion: "1.0.0-local-standard-sect2",
  };
}
