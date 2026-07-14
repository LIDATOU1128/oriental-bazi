import { NextResponse } from "next/server";
import { birthInfoSchema } from "@/lib/validation/birth-info";
import { calculateBazi } from "@/lib/bazi";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 16_000) return NextResponse.json({success:false,error:"请求内容过大。"},{status:413});
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!checkRateLimit(`bazi:${ip}`,20)) return NextResponse.json({success:false,error:"操作有些频繁，请稍后再试。"},{status:429});
  try { const parsed = birthInfoSchema.safeParse(await request.json()); if(!parsed.success) return NextResponse.json({success:false,error:parsed.error.issues[0]?.message || "出生信息似乎不完整。"},{status:400}); return NextResponse.json({success:true,data:calculateBazi(parsed.data)}); }
  catch { return NextResponse.json({success:false,error:"排盘暂时遇到问题，请检查日期、时间和地点后重试。"},{status:400}); }
}

