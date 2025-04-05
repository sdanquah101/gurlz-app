import { DailyQuote } from '../../types/quotes';

// Mock daily quotes
const mockQuotes: DailyQuote[] = [
  {
    id: '1',
    quote: 'The journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    category: 'motivation',
    display_date: new Date().toISOString().split('T')[0]
  }
];

export const localQuotes = {
  getDailyQuote: () => ({ ...mockQuotes[0] })
};