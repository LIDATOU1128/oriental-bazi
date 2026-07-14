"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw, ScrollText } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { DEFAULT_BIRTH_INFO } from "@/lib/constants";
import { loadBirth, saveJson, STORAGE } from "@/lib/storage";
import type { BaziChart } from "@/types/bazi";
import type { BaziReport } from "@/types/report";

const messages=["正在校对出生信息……","正在排列四柱结构……","正在梳理五行分布……","正在生成东方性格画像……","正在整理成长建议……"];
type ApiResult<T>={success:boolean;data?:T;error?:string};
export default function GeneratingPage(){const router=useRouter();const [index,setIndex]=useState(0);const [error,setError]=useState("");const [running,setRunning]=useState(false);
  const generate=useCallback(async()=>{if(running)return;setRunning(true);setError("");const started=Date.now();try{const sample=new URLSearchParams(location.search).get("sample")==="1"||sessionStorage.getItem(STORAGE.sample)==="true";const birth=sample?{...DEFAULT_BIRTH_INFO,gender:"female",disclaimerAccepted:true}:loadBirth();if(!birth)throw new Error("NO_INPUT");const baziRes=await fetch("/api/bazi",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(birth)});const bazi=await baziRes.json() as ApiResult<BaziChart>;if(!baziRes.ok||!bazi.success||!bazi.data)throw new Error(bazi.error||"BAZI_FAILED");saveJson(STORAGE.chart,bazi.data);let requestId=sessionStorage.getItem(STORAGE.request);if(!requestId){requestId=crypto.randomUUID();sessionStorage.setItem(STORAGE.request,requestId)}const reportRes=await fetch("/api/report",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({chart:bazi.data,focusAreas:birth.focusAreas,requestId})});const report=await reportRes.json() as ApiResult<BaziReport>;if(!reportRes.ok||!report.success||!report.data)throw new Error(report.error||"REPORT_FAILED");saveJson(STORAGE.report,report.data);await new Promise(r=>setTimeout(r,Math.max(0,3800-(Date.now()-started))));router.replace(sample?"/report?sample=1":"/report")}catch(e){setError(e instanceof Error&&e.message.startsWith("报告")?e.message:"报告暂时没有生成成功，请检查网络后再试一次。你的填写内容仍然保留。");setRunning(false)}},[router,running]);
  useEffect(()=>{const timer=setInterval(()=>setIndex(i=>(i+1)%messages.length),1100);const starter=setTimeout(()=>void generate(),0);return()=>{clearInterval(timer);clearTimeout(starter)}} // 初次挂载只生成一次
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ,[]);
  return <main className="app-shell paper-grain generating"><div className="generate-center"><p className="section-kicker">命盘正在整理</p><h1>{error?"纸卷暂未展开":"静候片刻，墨意成章"}</h1>{!error?<><div className="scroll-animation"><div className="scroll-paper"><div className="ganzhi"><span>甲</span><span>辰</span><span>辛</span><span>未</span></div><i className="seal-drop">东</i></div><div className="spark s1"/><div className="spark s2"/><div className="spark s3"/></div><p className="generating-message" aria-live="polite">{messages[index]}</p><Mascot text="命盘正在整理，请稍候片刻。"/></>:<><div className="error-illustration"><ScrollText size={56}/></div><p className="section-copy">{error}</p><div className="generate-actions"><button className="primary-button" onClick={generate}><RefreshCcw size={17}/>重新生成</button><button className="secondary-button" onClick={()=>router.push("/input")}>返回修改信息</button></div></>}</div></main>}
