export const APP_CONFIG = {
  appName: "东方命盘",
  subtitle: "遇见藏在出生时间里的东方性格密码",
  reportName: "个人八字文化分析报告",
} as const;

export const DISCLAIMER = "本产品基于中国传统八字文化体系生成相关内容，仅用于文化体验、娱乐参考和自我探索。八字命理不属于经过现代科学验证的预测方法，报告内容不能证明或决定个人未来。请勿依据本报告作出医疗、心理、法律、投资、婚姻、教育、就业或其他重大决定。出生信息特别是出生时间不准确时，分析结果可能出现偏差，请理性阅读，请勿盲目信任。";
export const SHORT_DISCLAIMER = "基于传统文化生成，仅供娱乐和自我探索参考。";

export const FOCUS_AREAS = ["性格特点", "优势能力", "事业发展", "学习成长", "财富观念", "情感关系", "人际沟通", "当前人生阶段"];

export const SHICHEN = [
  ["zi", "子时", "23:00—00:59", 23], ["chou", "丑时", "01:00—02:59", 1], ["yin", "寅时", "03:00—04:59", 3],
  ["mao", "卯时", "05:00—06:59", 5], ["chen", "辰时", "07:00—08:59", 7], ["si", "巳时", "09:00—10:59", 9],
  ["wu", "午时", "11:00—12:59", 11], ["wei", "未时", "13:00—14:59", 13], ["shen", "申时", "15:00—16:59", 15],
  ["you", "酉时", "17:00—18:59", 17], ["xu", "戌时", "19:00—20:59", 19], ["hai", "亥时", "21:00—22:59", 21],
] as const;

export const PERIODS = [
  ["lateNight", "凌晨", "00:00—05:59"], ["earlyMorning", "早上", "06:00—08:59"], ["morning", "上午", "09:00—11:59"],
  ["noon", "中午", "12:00—13:59"], ["afternoon", "下午", "14:00—17:59"], ["evening", "晚上", "18:00—23:59"],
] as const;

export const DEFAULT_BIRTH_INFO = {
  gender: "", calendarType: "solar", birthYear: 1998, birthMonth: 5, birthDay: 20, isLeapMonth: false,
  timeAccuracy: "exact", birthHour: 15, birthMinute: 30, birthCountry: "中国", birthProvince: "浙江省", birthCity: "宁波市",
  timezone: "Asia/Shanghai", useTrueSolarTime: false, focusAreas: ["性格特点", "优势能力"], disclaimerAccepted: false,
};

export const CN_LOCATIONS: Record<string, string[]> = {
  "北京市": ["北京市"], "上海市": ["上海市"], "广东省": ["广州市", "深圳市", "珠海市", "佛山市"],
  "浙江省": ["杭州市", "宁波市", "温州市", "嘉兴市"], "江苏省": ["南京市", "苏州市", "无锡市"],
  "四川省": ["成都市", "绵阳市"], "湖北省": ["武汉市", "宜昌市"], "福建省": ["福州市", "厦门市"],
  "山东省": ["济南市", "青岛市"], "河南省": ["郑州市", "洛阳市"], "湖南省": ["长沙市"], "陕西省": ["西安市"],
};
