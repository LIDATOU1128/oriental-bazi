import { InfoPage } from "@/components/info-page";
import { DISCLAIMER } from "@/lib/constants";
export default function Disclaimer(){return <InfoPage kicker="免责声明" title="传统文化是一面镜子，不是人生判决书"><p className="lead">{DISCLAIMER}</p><section><h2>我们不会做什么</h2><ul><li>不声称准确预测未来、婚姻、事业、财富、疾病、死亡或灾难。</li><li>不提供医疗、心理、法律、投资、教育、就业等专业结论。</li><li>不通过“缺什么补什么”推销饰品、颜色、方位或所谓转运服务。</li><li>不使用恐吓、羞辱或伤害性命理措辞。</li></ul></section><section><h2>时间不确定时</h2><p>大概时辰会标注中等置信度；跨多个时辰的时间段会保留候选时柱并弱化差异；完全未知时只计算年、月、日柱，不伪造时柱和大运。</p></section><section><h2>怎样阅读报告</h2><p>建议把内容当作提出问题和观察自身的一种传统文化视角。用真实经历验证描述，有共鸣的部分可以留下，不符合的部分可以放下。</p></section></InfoPage>}

