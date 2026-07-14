"use client";
import { useState } from "react";
const items=[{n:"木",c:"wood"},{n:"火",c:"fire"},{n:"土",c:"earth"},{n:"金",c:"metal"},{n:"水",c:"water"}];
export function FiveElementDisk(){const [ripples,setRipples]=useState<number[]>([]);return <button aria-label="互动五行圆盘" className="element-stage" onClick={()=>{const id=Date.now();setRipples(r=>[...r,id]);setTimeout(()=>setRipples(r=>r.filter(x=>x!==id)),900)}}><div className="orbit outer"/><div className="element-disk">{items.map((x,i)=><span key={x.n} className={`element-dot ${x.c}`} style={{"--i":i} as React.CSSProperties}>{x.n}</span>)}<div className="disk-center"><small>五行</small><b>观照</b></div></div>{ripples.map(id=><i key={id} className="ink-ripple"/>)}</button>}

