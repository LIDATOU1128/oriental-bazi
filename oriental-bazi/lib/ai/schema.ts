import { z } from "zod";
const shortList = z.array(z.string().min(2).max(180)).max(5);
export const reportSchema = z.object({
  title: z.string().max(60), subtitle: z.string().max(100),
  summary: z.object({ opening: z.string().max(500), coreKeywords: shortList, confidenceNotice: z.string().max(300) }),
  chartOverview: z.object({ dayMasterExplanation: z.string().max(500), fiveElementsExplanation: z.string().max(500), structureSummary: z.string().max(500) }),
  personality: z.object({ title: z.string(), summary: z.string().max(500), strengths: shortList, possibleChallenges: shortList, reflectionQuestions: shortList }),
  abilities: z.object({ title: z.string(), summary: z.string().max(500), potentialStrengths: shortList, developmentSuggestions: shortList }),
  career: z.object({ title: z.string(), summary: z.string().max(500), suitableWorkStyles: shortList, possibleDirections: shortList, caution: z.string().max(300) }),
  wealth: z.object({ title: z.string(), summary: z.string().max(500), possiblePatterns: shortList, practicalSuggestions: shortList, caution: z.string().max(300) }),
  relationships: z.object({ title: z.string(), summary: z.string().max(500), communicationPatterns: shortList, relationshipSuggestions: shortList }),
  growth: z.object({ title: z.string(), summary: z.string().max(500), currentFocus: shortList, actionableSuggestions: shortList }),
  focusAreaInsights: z.array(z.object({ area: z.string().max(30), insight: z.string().max(500), suggestions: shortList })).max(3),
  finalMessage: z.object({ easternStyleSentence: z.string().max(150), practicalClosing: z.string().max(400) }), disclaimer: z.string().max(600),
});

export const reportJsonSchema = {
  type: "object", additionalProperties: false,
  required: ["title","subtitle","summary","chartOverview","personality","abilities","career","wealth","relationships","growth","focusAreaInsights","finalMessage","disclaimer"],
  properties: {
    title:{type:"string"}, subtitle:{type:"string"},
    summary: obj(["opening","coreKeywords","confidenceNotice"], {opening:{type:"string"},coreKeywords:arr(),confidenceNotice:{type:"string"}}),
    chartOverview: obj(["dayMasterExplanation","fiveElementsExplanation","structureSummary"], {dayMasterExplanation:{type:"string"},fiveElementsExplanation:{type:"string"},structureSummary:{type:"string"}}),
    personality: section(["title","summary","strengths","possibleChallenges","reflectionQuestions"]),
    abilities: section(["title","summary","potentialStrengths","developmentSuggestions"]),
    career: section(["title","summary","suitableWorkStyles","possibleDirections","caution"]),
    wealth: section(["title","summary","possiblePatterns","practicalSuggestions","caution"]),
    relationships: section(["title","summary","communicationPatterns","relationshipSuggestions"]),
    growth: section(["title","summary","currentFocus","actionableSuggestions"]),
    focusAreaInsights:{type:"array",maxItems:3,items:obj(["area","insight","suggestions"],{area:{type:"string"},insight:{type:"string"},suggestions:arr()})},
    finalMessage:obj(["easternStyleSentence","practicalClosing"],{easternStyleSentence:{type:"string"},practicalClosing:{type:"string"}}), disclaimer:{type:"string"}
  }
};
function arr(){return {type:"array",maxItems:5,items:{type:"string"}}}
function obj(required:string[],properties:Record<string,unknown>){return {type:"object",additionalProperties:false,required,properties}}
function section(keys:string[]){const properties:Record<string,unknown>={};keys.forEach(k=>properties[k]=["strengths","possibleChallenges","reflectionQuestions","potentialStrengths","developmentSuggestions","suitableWorkStyles","possibleDirections","possiblePatterns","practicalSuggestions","communicationPatterns","relationshipSuggestions","currentFocus","actionableSuggestions"].includes(k)?arr():{type:"string"});return obj(keys,properties)}

