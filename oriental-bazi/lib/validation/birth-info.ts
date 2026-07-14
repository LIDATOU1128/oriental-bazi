import { z } from "zod";

const currentYear = new Date().getFullYear();
export const birthInfoSchema = z.object({
  gender: z.enum(["male", "female"]), calendarType: z.enum(["solar", "lunar"]),
  birthYear: z.number().int().min(1900).max(currentYear), birthMonth: z.number().int().min(1).max(12), birthDay: z.number().int().min(1).max(31),
  isLeapMonth: z.boolean().default(false), timeAccuracy: z.enum(["exact", "shichen", "period", "unknown"]),
  birthHour: z.number().int().min(0).max(23).optional(), birthMinute: z.number().int().min(0).max(59).optional(),
  birthShichen: z.enum(["zi", "chou", "yin", "mao", "chen", "si", "wu", "wei", "shen", "you", "xu", "hai"]).optional(),
  birthPeriod: z.enum(["lateNight", "earlyMorning", "morning", "noon", "afternoon", "evening"]).optional(),
  birthCountry: z.string().trim().min(1).max(40), birthProvince: z.string().trim().min(1).max(60), birthCity: z.string().trim().min(1).max(60),
  birthDistrict: z.string().trim().max(60).optional(), timezone: z.string().trim().min(1).max(64), longitude: z.number().min(-180).max(180).optional(), latitude: z.number().min(-90).max(90).optional(),
  useTrueSolarTime: z.boolean(), focusAreas: z.array(z.string().max(20)).max(3), disclaimerAccepted: z.boolean().default(false),
}).superRefine((d, ctx) => {
  if (d.calendarType === "solar") { const date = new Date(Date.UTC(d.birthYear, d.birthMonth - 1, d.birthDay)); if (date.getUTCFullYear() !== d.birthYear || date.getUTCMonth() !== d.birthMonth - 1 || date.getUTCDate() !== d.birthDay) ctx.addIssue({ code: "custom", message: "日期似乎不存在，请重新检查。", path: ["birthDay"] }); }
  if (d.calendarType === "lunar" && d.birthDay > 30) ctx.addIssue({ code: "custom", message: "农历日期最多为三十。", path: ["birthDay"] });
  if (d.timeAccuracy === "exact" && (d.birthHour === undefined || d.birthMinute === undefined)) ctx.addIssue({ code: "custom", message: "请选择准确出生时间。", path: ["birthHour"] });
  if (d.timeAccuracy === "shichen" && !d.birthShichen) ctx.addIssue({ code: "custom", message: "请选择大概时辰。", path: ["birthShichen"] });
  if (d.timeAccuracy === "period" && !d.birthPeriod) ctx.addIssue({ code: "custom", message: "请选择大概时间段。", path: ["birthPeriod"] });
  if (d.useTrueSolarTime && d.longitude === undefined) ctx.addIssue({ code: "custom", message: "真太阳时修正需要可靠经度，当前地点尚未配置，建议关闭实验选项。", path: ["useTrueSolarTime"] });
});
