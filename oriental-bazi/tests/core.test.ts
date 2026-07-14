import assert from "node:assert/strict";
import test from "node:test";
import { birthInfoSchema } from "../lib/validation/birth-info";
import { calculateBazi } from "../lib/bazi";
import { createMockReport } from "../lib/ai/mock";
import { reportSchema } from "../lib/ai/schema";
import { hasUnsafeContent, sanitizeReport } from "../lib/ai/safety";
import type { BirthInfo } from "../types/birth";

const base: BirthInfo={gender:"female",calendarType:"solar",birthYear:1998,birthMonth:5,birthDay:20,isLeapMonth:false,timeAccuracy:"exact",birthHour:15,birthMinute:30,birthCountry:"中国",birthProvince:"浙江省",birthCity:"宁波市",timezone:"Asia/Shanghai",useTrueSolarTime:false,focusAreas:["性格特点"],disclaimerAccepted:true};

test("表单：缺少性别会被拒绝",()=>assert.equal(birthInfoSchema.safeParse({...base,gender:""}).success,false));
test("表单：公历闰日合法，普通年份 2 月 29 日非法",()=>{assert.equal(birthInfoSchema.safeParse({...base,birthYear:2024,birthMonth:2,birthDay:29}).success,true);assert.equal(birthInfoSchema.safeParse({...base,birthYear:2023,birthMonth:2,birthDay:29}).success,false)});
test("表单：农历日期与闰月字段合法",()=>assert.equal(birthInfoSchema.safeParse({...base,calendarType:"lunar",birthYear:2023,birthMonth:2,birthDay:12,isLeapMonth:true}).success,true));
test("表单：精确、时辰、时间段与未知四种模式",()=>{assert.equal(birthInfoSchema.safeParse(base).success,true);assert.equal(birthInfoSchema.safeParse({...base,timeAccuracy:"shichen",birthShichen:"zi"}).success,true);assert.equal(birthInfoSchema.safeParse({...base,timeAccuracy:"period",birthPeriod:"evening"}).success,true);assert.equal(birthInfoSchema.safeParse({...base,timeAccuracy:"unknown",birthHour:undefined,birthMinute:undefined}).success,true)});
test("表单：海外城市与 IANA 时区",()=>assert.equal(birthInfoSchema.safeParse({...base,birthCountry:"美国",birthProvince:"California",birthCity:"Los Angeles",timezone:"America/Los_Angeles"}).success,true));
test("表单：真太阳时缺少经度时拒绝",()=>assert.equal(birthInfoSchema.safeParse({...base,useTrueSolarTime:true}).success,false));

test("排盘：示例日期四柱由确定性程序生成",()=>{const chart=calculateBazi(base);assert.equal(chart.pillars.year.display,"戊寅");assert.equal(chart.pillars.month.display,"丁巳");assert.equal(chart.pillars.day.display,"丁卯");assert.equal(chart.pillars.hour?.display,"戊申");assert.equal(chart.confidence.level,"high")});
test("排盘：完全未知时间不产生时柱与大运",()=>{const chart=calculateBazi({...base,timeAccuracy:"unknown",birthHour:undefined,birthMinute:undefined});assert.equal(chart.pillars.hour,null);assert.equal(chart.luckCycles,null);assert.equal(chart.confidence.level,"low")});
test("排盘：跨时辰时间段返回多个候选而不擅自选取",()=>{const chart=calculateBazi({...base,timeAccuracy:"period",birthPeriod:"evening"});assert.equal(chart.pillars.hour,null);assert.ok((chart.pillars.hourCandidates?.length||0)>=2);assert.equal(chart.confidence.level,"low")});
test("排盘：立春前后年柱发生规则切换",()=>{const before=calculateBazi({...base,birthYear:2024,birthMonth:2,birthDay:3,birthHour:12});const after=calculateBazi({...base,birthYear:2024,birthMonth:2,birthDay:5,birthHour:12});assert.notEqual(before.pillars.year.display,after.pillars.year.display)});
test("排盘：23 点附近采用明确的晚子时不换日口径",()=>{const late=calculateBazi({...base,birthYear:1988,birthMonth:2,birthDay:15,birthHour:23,birthMinute:30});const next=calculateBazi({...base,birthYear:1988,birthMonth:2,birthDay:16,birthHour:0,birthMinute:30});assert.notEqual(late.pillars.day.display,next.pillars.day.display)});
test("排盘：夏令时地区按用户填写的当地钟表时间处理",()=>{const chart=calculateBazi({...base,birthCountry:"美国",birthProvince:"New York",birthCity:"New York",timezone:"America/New_York"});assert.equal(chart.inputSummary.timezone,"America/New_York")});

test("AI：演示报告满足完整结构 Schema",()=>{const chart=calculateBazi(base);assert.equal(reportSchema.safeParse(createMockReport(chart,["事业发展"])).success,true)});
test("AI：危险预测词可识别并替换",()=>{const report=createMockReport(calculateBazi(base),[]);report.finalMessage.practicalClosing="你有血光之灾";assert.equal(hasUnsafeContent(report),true);assert.equal(hasUnsafeContent(sanitizeReport(report)),false)});

