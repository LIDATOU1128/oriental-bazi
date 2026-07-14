import type { Metadata, Viewport } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"东方命盘｜AI八字文化分析", description:"输入出生信息，从传统八字文化角度认识性格、优势与成长方向。结果仅供文化体验和自我探索参考。", openGraph:{title:"东方命盘",description:"遇见藏在出生时间里的东方性格密码",type:"website"}, icons:{icon:"/favicon.svg"}, other:{"codex-preview":"development"} };
export const viewport: Viewport = { width:"device-width",initialScale:1,maximumScale:1,themeColor:"#F7F0E3" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="zh-CN"><body>{children}</body></html>}
