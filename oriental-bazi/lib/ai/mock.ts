import type { BaziChart } from "@/types/bazi";
import type { BaziReport } from "@/types/report";
import { DISCLAIMER } from "@/lib/constants";

export function createMockReport(chart: BaziChart, focusAreas: string[] = []): BaziReport {
  const dm = `${chart.dayMaster.yinYang}${chart.dayMaster.element}`;
  const sorted = Object.entries(chart.fiveElements).sort((a,b)=>b[1]-a[1]);
  const elementNames: Record<string,string> = { wood:"木",fire:"火",earth:"土",metal:"金",water:"水" };
  const top = elementNames[sorted[0][0]];
  const notice = chart.confidence.level === "high" ? "出生时间精确，四柱结构可完整呈现；仍请把解读视为文化观察。" : chart.confidence.level === "medium" ? "出生时间为大概时辰，时柱及相关内容存在边界误差。" : "出生时间信息有限，本报告会弱化时柱与起运相关解读，只保留更稳定的共同部分。";
  return {
    title: "你的东方人格文化画像", subtitle: `以${dm}日主为中心的一次传统文化观察`,
    summary: { opening: `这张命盘以${chart.dayMaster.stem}为日主。若把传统命理当作一套观察语言，它呈现的是一种在细腻感受与现实行动之间寻找平衡的倾向。你不必把它当作固定标签，更适合对照真实经历，看看哪些部分能帮助你理解自己的节奏。`, coreKeywords: ["细致有序","内在韧性","持续生长","重视边界"], confidenceNotice: notice },
    chartOverview: { dayMasterExplanation: `${dm}在传统象征中，常被用来描述一种有自身节奏、重视环境反馈的行动方式。它不是人格测评，也不意味着每个场景中都会出现相同表现。`, fiveElementsExplanation: `当前可计算结构中，${top}的呈现相对更明显。五行分布描述的是传统符号之间的比例，不等于能力高低，也不意味着数量较少的元素需要通过物品或颜色来“补”。`, structureSummary: `年、月、日${chart.pillars.hour ? "、时" : ""}柱共同构成这次文化分析的基础。我们更关注其中可用于自我观察的表达、协作、学习与行动线索，不作未来事件预测。` },
    personality: { title:"性格底色", summary:"你可能更习惯先观察情境，再决定投入多少精力。面对熟悉领域时能形成稳定方法，但在信息过多或标准模糊时，也可能反复权衡。把谨慎转化为清晰的检查点，会比追求一次到位更轻松。", strengths:["能留意细节与他人未明说的需求","愿意为长期目标维持稳定投入","在复杂信息中寻找秩序与线索","重视承诺，也愿意修正自己的判断"], possibleChallenges:["容易在准备阶段消耗过多精力","对自己要求较高时，可能忽略已经完成的部分","不确定时倾向独自消化，沟通会稍晚一步"], reflectionQuestions:["最近哪件事值得先完成，再慢慢优化？","哪些标准来自真实需要，哪些只是对自己的额外压力？","你希望别人怎样支持你，是否已经清楚表达？"] },
    abilities: { title:"优势能力", summary:"你的优势更可能通过持续积累而被看见：理解背景、整理信息、发现细节，再把它们转成可执行步骤。相比即时抢答，你可能在拥有思考空间时更能展现质量。", potentialStrengths:["结构化信息与复盘经验","对语境和细节保持敏感","在长期项目中维持耐心","连接抽象想法与实际步骤"], developmentSuggestions:["为重要任务设置“够用即可”的完成线","用简短输出检验理解，而不只在心里推演","主动说明自己的工作节奏与所需支持"] },
    career: { title:"发展方式", summary:"你可能更适合目标清楚、允许深度思考、能看到长期积累价值的工作环境。方向不必由命盘决定，真实兴趣、能力证据、行业条件与生活目标始终更重要。", suitableWorkStyles:["有阶段目标和清晰反馈","既能独立推进，也有稳定协作接口","允许沉淀方法和持续优化","评价标准不只依赖短期声量"], possibleDirections:["内容与研究型工作环境","产品、运营或项目协调场景","需要专业积累的支持与顾问型角色","兼顾审美与逻辑的创造性项目"], caution:"这些只是工作方式的文化联想，不是职业测评或求职结论。请用真实项目、小规模尝试和专业建议验证。" },
    wealth: { title:"资源观念", summary:"在资源管理上，你可能更看重可控感与长期确定性，也愿意为真正重视的体验投入。需要留意的是，过度追求万无一失有时会推迟必要行动。", possiblePatterns:["偏好先理解规则再做决定","更容易接受有明确用途的支出","在不确定环境中倾向保留安全余量"], practicalSuggestions:["建立与现实收入匹配的月度预算","把应急储备与成长投入分开记录","重大财务决定咨询持牌专业人士"], caution:"本报告不构成投资、税务或财务建议，也不预测收益与所谓发财时间。" },
    relationships: { title:"关系与沟通", summary:"你可能重视稳定回应、言行一致与彼此尊重。在关系中，先理解别人是你的善意，但若长期把自己的需求放到后面，也容易累积落差。", communicationPatterns:["倾向先观察对方状态再表达","在安全关系中更愿意展现细腻一面","遇到分歧时需要一点整理时间"], relationshipSuggestions:["用具体请求代替期待对方猜测","区分体谅他人与压缩自己边界","冲突后先确认共同目标，再讨论方案"] },
    growth: { title:"成长提示", summary:"成长并不要求改变你的底色，而是让优势有更健康的使用方式。把敏感变成观察，把谨慎变成步骤，把长期主义变成可见的小进展。", currentFocus:["降低启动门槛","练习及时表达","建立可持续节奏"], actionableSuggestions:["每周做一次十分钟目标复盘","重要沟通前写下一个核心诉求","把长期目标拆成两周内可验证的小步骤","记录与报告相符和不相符的真实经历"] },
    focusAreaInsights: (focusAreas.length ? focusAreas : ["性格特点","优势能力"]).map(area=>({area,insight:`从${area}角度，这份命盘更适合作为提出问题的起点，而非给出单一答案。留意那些在多个真实场景中反复出现的行为模式。`,suggestions:["选择一个近期场景做观察记录","向可信任的人询问具体反馈"]})),
    finalMessage: { easternStyleSentence:"知其纹理，不困于纹理；借一面东方的镜子，看见仍在生长的自己。", practicalClosing:"把有共鸣的部分留下，把不符合你的部分放下。真正重要的方向，仍要在生活经验、持续行动和可靠建议中慢慢确认。" },
    disclaimer: DISCLAIMER,
  };
}

