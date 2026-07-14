export interface BaziReport {
  title: string; subtitle: string;
  summary: { opening: string; coreKeywords: string[]; confidenceNotice: string };
  chartOverview: { dayMasterExplanation: string; fiveElementsExplanation: string; structureSummary: string };
  personality: { title: string; summary: string; strengths: string[]; possibleChallenges: string[]; reflectionQuestions: string[] };
  abilities: { title: string; summary: string; potentialStrengths: string[]; developmentSuggestions: string[] };
  career: { title: string; summary: string; suitableWorkStyles: string[]; possibleDirections: string[]; caution: string };
  wealth: { title: string; summary: string; possiblePatterns: string[]; practicalSuggestions: string[]; caution: string };
  relationships: { title: string; summary: string; communicationPatterns: string[]; relationshipSuggestions: string[] };
  growth: { title: string; summary: string; currentFocus: string[]; actionableSuggestions: string[] };
  focusAreaInsights: Array<{ area: string; insight: string; suggestions: string[] }>;
  finalMessage: { easternStyleSentence: string; practicalClosing: string };
  disclaimer: string;
}

