import type { BaziChart } from "@/types/bazi";
import type { BaziReport } from "@/types/report";
import { SYSTEM_PROMPT } from "./prompt";
import { reportJsonSchema, reportSchema } from "./schema";
import { createMockReport } from "./mock";
import { hasUnsafeContent, sanitizeReport } from "./safety";

export async function generateReport(chart: BaziChart, focusAreas: string[]): Promise<BaziReport> {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !process.env.OPENAI_API_KEY) return createMockReport(chart, focusAreas);
  const payload = JSON.stringify({ chart, focusAreas: focusAreas.slice(0,3) });
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController(); const timer = setTimeout(()=>controller.abort(), 30000);
    try {
      const response = await fetch("https://api.openai.com/v1/responses", { method:"POST", signal:controller.signal,
        headers:{"content-type":"application/json",authorization:`Bearer ${process.env.OPENAI_API_KEY}`},
        body:JSON.stringify({model:process.env.OPENAI_MODEL || "gpt-5-mini", instructions:SYSTEM_PROMPT, input:`请根据以下已计算命盘生成报告：${payload}`, max_output_tokens:7000, text:{format:{type:"json_schema",name:"bazi_report",strict:true,schema:reportJsonSchema}}}) });
      if (!response.ok) throw new Error(`AI_${response.status}`);
      type OutputContent={type?:string;text?:string};
      type ResponsesPayload={output_text?:string;output?:Array<{content?:OutputContent[]}>};
      const data = await response.json() as ResponsesPayload;
      const output = data.output_text ?? data.output?.flatMap(o=>o.content??[]).find(c=>c.type==="output_text")?.text;
      if(!output)throw new Error("EMPTY_OUTPUT");
      const parsed = reportSchema.parse(JSON.parse(output));
      if (hasUnsafeContent(parsed)) { if (attempt === 0) throw new Error("UNSAFE_OUTPUT"); return sanitizeReport(parsed); }
      return parsed;
    } catch (error) { lastError = error; } finally { clearTimeout(timer); }
  }
  throw lastError instanceof Error ? lastError : new Error("REPORT_FAILED");
}
