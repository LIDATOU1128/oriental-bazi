export function DemoBadge(){if(process.env.NEXT_PUBLIC_DEMO_MODE==="false")return null;return <span className="demo-badge">演示模式</span>}
