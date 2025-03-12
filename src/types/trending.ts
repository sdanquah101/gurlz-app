export interface TrendingTopic {
  id: string;
  topic: string;
  score: number;
  analysis_timestamp: string;
  valid_until: string;
}

export interface TopicAnalysis {
  id: string;
  analysis_timestamp: string;
  messages_analyzed: number;
  model_version: string;
}