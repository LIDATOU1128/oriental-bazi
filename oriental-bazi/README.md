# 东方命盘

一个可直接运行、无需注册的移动端八字文化体验 H5。用户填写出生信息后，程序先用确定性历法规则排盘，再把结构化命盘提交给服务端 AI 生成克制、现代的文化分析报告。

> 本产品仅用于传统文化体验、娱乐参考和自我探索，不属于科学预测，也不应作为医疗、心理、法律、投资、婚姻、教育、就业等重大决定依据。

## 已实现

- 新中式移动端首页与轻量五行动效
- 五步出生信息表单，支持公历、农历、闰月
- 精确时间、大概时辰、大概时间段、完全未知四种模式
- 中国省市选择与海外城市 / IANA 时区手动输入
- 确定性四柱、藏干、十神、五行、节气、大运计算
- `/api/bazi` 与 `/api/report` 服务端接口
- OpenAI Responses API 结构化 JSON 输出、超时、一次重试、Schema 校验及二次安全过滤
- 完整报告、五行互动图、生成动画和 3:4 隐私分享卡
- sessionStorage 临时保存、隐私页、免责声明页、算法口径说明
- 无 API Key 演示模式与虚构示例报告
- 请求限流、每日上限、请求去重和前端防重复点击
- 适配 375–430px 手机、平板、桌面和减少动态效果设置

## 1. 安装依赖

要求 Node.js 22 或更高版本。

```bash
npm install
```

## 2. 配置环境变量

复制示例文件：

```bash
cp .env.example .env.local
```

变量说明：

| 变量 | 用途 | 是否暴露给前端 |
| --- | --- | --- |
| `OPENAI_API_KEY` | OpenAI 服务端密钥 | 否 |
| `OPENAI_MODEL` | Responses API 模型名 | 否 |
| `NEXT_PUBLIC_DEMO_MODE` | 是否启用本地演示报告 | 是，不包含秘密 |
| `NEXT_PUBLIC_APP_URL` | 公开访问地址，用于分享 | 是 |

不要把 `.env.local` 提交到 Git。正式环境的 Key 只配置在部署平台的环境变量中，前端代码不会读取或返回它。

## 3. 启动开发环境

```bash
npm run dev
```

打开命令行显示的本地地址即可体验。

## 4. 使用演示模式

在 `.env.local` 中设置：

```env
NEXT_PUBLIC_DEMO_MODE=true
```

演示模式会运行真实的确定性排盘，但使用本地 Mock 报告，不产生 AI 调用费用。首页的“先看看示例报告”始终使用虚构信息。

## 5. 配置 AI 接口

设置：

```env
NEXT_PUBLIC_DEMO_MODE=false
OPENAI_API_KEY=你的服务端密钥
OPENAI_MODEL=gpt-5-mini
```

调用只发生在 `app/api/report/route.ts`。系统提示词、JSON Schema、输出安全检查分别位于 `lib/ai/prompt.ts`、`lib/ai/schema.ts` 和 `lib/ai/safety.ts`。更换兼容服务商时，只需替换 `lib/ai/client.ts` 的服务端适配层，前端与排盘模块无需改变。

## 排盘算法与口径

排盘使用 `lunar-javascript` 的确定性历法实现，AI 不参与日期转换或四柱计算。

- 节气定月，不按农历月份直接映射月柱。
- 采用用户填写的当地标准钟表时间。
- 当前日界口径为 00:00 换日，即晚子时不提前换日（sect 2）。
- 真太阳时为实验选项；缺少可靠经度时接口会拒绝启用，不伪装修正。
- 精确时间返回完整四柱和较高置信度。
- 大概时辰返回一个时柱并标记边界误差。
- 大概时间段计算覆盖范围内的多个候选时柱，不擅自选中间值；报告仅使用共同结构。
- 完全未知时间只返回年、月、日柱，`hour` 与 `luckCycles` 为 `null`。
- 五行百分比为可计算天干、地支主元素的展示性占比，不等于旺衰结论，也不用于“缺什么补什么”。
- 年界、节气、子时换日、真太阳时和起运存在流派差异，本项目选择一套一致规则，不声称唯一正确。

规则版本通过 API 返回为 `1.0.0-local-standard-sect2`。

## API

### `POST /api/bazi`

校验出生信息后返回结构化命盘。请求体限制 16 KB；日期、时间模式、地点、时区和真太阳时条件均会校验。

### `POST /api/report`

只接收结构化命盘、时间准确度、最多三个关注方向和请求 ID。接口包含：

- 40 KB 请求体限制；
- 每分钟与每日调用上限；
- 同请求 ID 去重；
- 30 秒超时与最多一次自动重试；
- JSON Schema 校验；
- 疾病、死亡、恐吓、确定性财富与投资措辞二次过滤；
- 脱敏友好错误，不返回模型原文、堆栈或环境变量。

生产环境如运行在多实例平台，建议把内存限流替换为 Vercel KV / Upstash Redis，以获得跨实例的统一计数。

## 测试

```bash
npm run test:unit
npm test
npx tsc --noEmit
```

核心测试覆盖表单模式、公历闰日、农历闰月、海外时区、真太阳时保护、立春前后、23 点口径、未知时柱、跨时辰候选、Mock Schema 和危险输出过滤。

## 6. 部署到 Vercel

1. 把项目推送到 GitHub / GitLab / Bitbucket。
2. 在 Vercel 点击 **Add New → Project** 并导入仓库。
3. Framework Preset 选择 **Next.js**。项目内 `vercel.json` 会执行 `npm run build:next`。
4. 在 Project Settings → Environment Variables 添加生产变量。
5. 将 `NEXT_PUBLIC_DEMO_MODE` 设为 `false`，并填写 `OPENAI_API_KEY`、`OPENAI_MODEL` 和最终 `NEXT_PUBLIC_APP_URL`。
6. 点击 Deploy。成功后会得到 `https://你的项目.vercel.app` 公共链接。

本项目同时保留当前托管环境使用的 `npm run build` 验证流程；Vercel 使用标准 Next.js 的 `npm run build:next`。

## 7. 绑定自定义域名

进入 Vercel 项目的 **Settings → Domains**，添加例如 `mingpan.example.com`，按提示配置 DNS。绑定完成后，把 `NEXT_PUBLIC_APP_URL` 更新为正式域名并重新部署。

## 8. 常见问题

**没有 API Key 能运行吗？**  可以。开启演示模式即可完整体验表单、排盘、动画、报告和分享卡。

**为什么未知出生时间没有时柱？**  产品不会拿中午 12 点伪造时柱。内部仅借安全时刻读取与时间无关的年月日柱，返回结果明确将时柱设为 `null`。

**为什么真太阳时开关提示经度？**  没有可靠经纬度就不能完成可信修正，因此产品会要求经度，不会假装已修正。

**分享卡是否泄露生日？**  默认不展示生日、时间、地点、性别和完整命盘，只包含关键词、文化总结和简短免责声明。

**构建时需要 AI Key 吗？**  不需要。环境变量只在运行时的报告接口中读取。

## 项目结构

```text
app/                 页面与服务端接口
components/          五行盘、白泽角色、通用页面组件
lib/bazi/            确定性排盘模块
lib/ai/              AI 客户端、提示词、Schema、Mock 与安全过滤
lib/validation/      Zod 出生信息校验
types/               Birth / Bazi / Report 类型
tests/               表单、排盘边界与 AI 安全测试
```
