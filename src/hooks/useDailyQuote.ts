import { useState, useEffect } from 'react';
import { DailyQuote } from '../types/quotes';
import { localQuotes } from '../lib/local/quotes';

export function useDailyQuote() {
  const [quote, setQuote] = useState<DailyQuote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dailyQuote = localQuotes.getDailyQuote();
    setQuote(dailyQuote);
    setLoading(false);
  }, []);

  return { quote, loading };
}