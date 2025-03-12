export interface DailyQuote {
  id: string;
  quote: string;
  author: string | null;
  category: string | null;
  display_date: string;
}