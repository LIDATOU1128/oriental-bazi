"use client";
import Link from "next/link";
import { ArrowRight, Clock3, Feather, ShieldCheck, Sparkles } from "lucide-react";
import { FiveElementDisk } from "@/components/five-element-disk";
import { Mascot } from "@/components/mascot";
import { DemoBadge } from "@/components/demo-badge";
import { STORAGE } from "@/lib/storage";

export default function Home(){
  function sample(){sessionStorage.setItem(STORAGE.sample,"true");sessionStorage.removeItem(STORAGE.report);sessionStorage.removeItem(STORAGE.chart)}
  return <main className="home-shell paper-grain">
    <DemoBadge/><div className="cloud cloud-a"/><div className="cloud cloud-b"/>
    <nav className="topbar"><Link className="brand" href="/"><span className="seal-mini">东</span><span>东方命盘</span></Link><Link className="text-link" href="/guide">使用说明</Link></nav>
    <section className="hero">
      <div className="eyebrow"><Sparkles size={14}/> 东方文化 · 自我观察</div>
      <h1>遇见藏在出生时间里的<br/><em>东方性格密码</em></h1>
      <p className="hero-copy">输入出生信息，从传统八字文化的角度，认识你的性格、优势与成长方向。</p>
      <FiveElementDisk/>
      <Mascot text="我会从传统文化的角度，陪你认识自己的另一种可能。"/>
      <div className="hero-actions">
        <Link href="/input" className="primary-button">开启我的东方命盘 <ArrowRight size={18}/></Link>
        <Link href="/generating?sample=1" onClick={sample} className="secondary-button">先看看示例报告</Link>
      </div>
      <div className="assurance"><span><ShieldCheck size={15}/>无需注册</span><span><Clock3 size={15}/>约 1 分钟</span><span><Feather size={15}/>仅供文化体验</span></div>
    </section>
    <section className="home-notes">
      <article><span>一</span><div><b>填写出生信息</b><p>支持公历、农历及不确定出生时间</p></div></article>
      <article><span>二</span><div><b>确定性程序排盘</b><p>节气定月，AI 不参与四柱计算</p></div></article>
      <article><span>三</span><div><b>获得文化报告</b><p>用现代语言呈现自我观察角度</p></div></article>
    </section>
    <footer><div><Link href="/guide">使用说明</Link><Link href="/privacy">隐私说明</Link><Link href="/disclaimer">免责声明</Link></div><p>传统文化体验 · 不属于科学预测</p></footer>
  </main>
}

