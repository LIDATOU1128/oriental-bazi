"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
export function PageHeader({title,back=true}:{title:string;back?:boolean}){const r=useRouter();return <header className="page-header">{back?<button aria-label="返回" onClick={()=>r.back()}><ArrowLeft size={20}/></button>:<span/>}<b>{title}</b><span className="seal-mini">东</span></header>}

