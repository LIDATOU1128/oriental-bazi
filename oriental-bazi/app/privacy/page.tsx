import { InfoPage } from "@/components/info-page";
export default function Privacy(){return <InfoPage kicker="隐私说明" title="你的出生信息，止于本次体验"><p className="lead">我们把克制的数据使用当作产品的一部分。MVP 无需注册，也默认不建立用户档案。</p><Info title="我们如何使用数据"><ul><li>出生数据只用于本次排盘和报告生成。</li><li>默认不永久保存出生信息，不用于广告画像，也不会出售给第三方。</li><li>填写进度仅暂存在当前浏览器的 sessionStorage，关闭页面后可被清除。</li><li>分享卡默认不展示完整生日、时间、地点、性别及原始命盘。</li></ul></Info><Info title="服务端与日志"><ul><li>AI 仅接收已计算命盘、时间准确度、关注方向及必要基础信息。</li><li>接口日志不主动记录完整出生信息，错误信息会脱敏处理。</li><li>不接入与核心体验无关的追踪脚本。</li></ul></Info><Info title="未来变化"><p>如果以后增加账号、历史报告或云端保存功能，我们会另行说明用途，并在启用前重新取得你的明确授权。</p></Info><p className="info-date">更新日期：2026 年 7 月 14 日</p></InfoPage>}
function Info({title,children}:{title:string;children:React.ReactNode}){return <section><h2>{title}</h2>{children}</section>}

