export interface RatingDistribution {
  [star: string]: number;
}

export interface OptionCount {
  label: string;
  count: number;
}

export interface RatingAnalytics {
  average: number;
  distribution: RatingDistribution;
}

export interface ChoiceAnalytics {
  options: OptionCount[];
}

export interface TextAnalytics {
  responseCount: number;
}

export type BlockAnalyticsData = RatingAnalytics | ChoiceAnalytics | TextAnalytics;

export interface BlockAnalyticsItem {
  blockIndex: number;
  type: string;
  title: string;
  analytics: BlockAnalyticsData;
  responseRate: number; // % of submissions that answered this block
}

export interface SubmissionTimePoint {
  date: string;
  count: number;
}

export interface FormAnalyticsResponse {
  totalSubmissions: number;
  lastSubmissionAt: string | null;
  thisWeekSubmissions: number;
  lastWeekSubmissions: number;
  completionRate: number; // % of submissions where every block was answered
  submissionsOverTime: SubmissionTimePoint[];
  blockAnalytics: BlockAnalyticsItem[];
}
