import type { BaziReport } from "@/types/report";
const BLOCKED = ["血光之灾","命中有劫","克夫","克妻","孤寡命","短命","绝命","破财命","灾星","凶命","必定发财","一定发财","一定离婚","必然离婚","一定患","必然患","注定富贵","预测死亡","寿命较短","必有灾祸","必然失业","投资稳赚","稳赚","股票代码","彩票号码","考试必败"];
export function sanitizeReport(report: BaziReport): BaziReport {
  let raw = JSON.stringify(report);
  for (const word of BLOCKED) raw = raw.replaceAll(word, "不适合做确定性解读");
  return JSON.parse(raw) as BaziReport;
}
export function hasUnsafeContent(value: unknown) { const raw = JSON.stringify(value); return BLOCKED.some((w) => raw.includes(w)); }
