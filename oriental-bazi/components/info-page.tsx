import Link from "next/link";
export function InfoPage({title,kicker,children}:{title:string;kicker:string;children:React.ReactNode}){return <main className="app-shell paper-grain"><header className="page-header"><Link href="/" className="info-back">返回</Link><b>{kicker}</b><span className="seal-mini">东</span></header><article className="content info-page"><p className="section-kicker">东方命盘</p><h1>{title}</h1>{children}<Link href="/" className="primary-button">返回首页</Link></article></main>}

