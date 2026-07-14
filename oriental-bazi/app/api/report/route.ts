import { NextResponse } from "next/server";
import { z } from "zod";
import { generateReport } from "@/lib/ai/client";
import { checkRateLimit } from "@/lib/rate-limit";
import type { BaziChart } from "@/types/bazi";

const requestSchema=z.object({chart:z.object({ruleVersion:z.string().max(80),confidence:z.object({level:z.enum(["high","medium","low"]),score:z.number().min(0).max(1),reasons:z.array(z.string().max(120)).max(5)}),pillars:z.any(),dayMaster:z.any(),fiveElements:z.any(),tenGods:z.any(),hiddenStems:z.any(),solarTerm:z.any(),luckCycles:z.any().nullable(),inputSummary:z.any()}),focusAreas:z.array(z.enum(["性格特点","优势能力","事业发展","学习成长","财富观念","情感关系","人际沟通","当前人生阶段"])).max(3),requestId:z.string().uuid()});
const pending=new Map<string,Promise<unknown>>();
export async function POST(request:Request){
  if(Number(request.headers.get("content-length")||0)>40_000)return NextResponse.json({success:false,error:"请求内容过大。"},{status:413});
  const ip=request.headers.get("x-forwarded-for")?.split(",")[0]||"local";
  if(!checkRateLimit(`report:${ip}`,5,60_000))return NextResponse.json({success:false,error:"生成有些频繁，请稍后再试。"},{status:429});
  if(!checkRateLimit(`report-daily:${ip}:${new Date().toISOString().slice(0,10)}`,30,86_400_000))return NextResponse.json({success:false,error:"今天的体验次数已达上限，请明天再来。"},{status:429});
  try{const parsed=requestSchema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({success:false,error:"报告所需信息不完整，请返回修改。"},{status:400});
    const existing=pending.get(parsed.data.requestId);if(existing)return NextResponse.json({success:true,data:await existing});
    const task=generateReport(parsed.data.chart as BaziChart,parsed.data.focusAreas);pending.set(parsed.data.requestId,task);
    try{return NextResponse.json({success:true,data:await task,mode:process.env.NEXT_PUBLIC_DEMO_MODE==="true"||!process.env.OPENAI_API_KEY?"demo":"ai"});}finally{setTimeout(()=>pending.delete(parsed.data.requestId),30_000)}
  }catch{return NextResponse.json({success:false,error:"报告生成暂时遇到问题，你填写的信息仍然保留，可以重新尝试。"},{status:500})}
}
