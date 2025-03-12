import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import Button from '../../common/Button';

interface MoodEntry {
  mood: string;
  energy: string;
  triggers?: string[];
  timestamp: Date;
  note?: string;
}

interface AnalysisResponse {
  title: string;
  overview: string;
  patterns: string[];
  recommendations: string[];
}

export default function MoodAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAIInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. First fetch mood entries from Supabase
      const { data: moodEntries, error: supabaseError } = await supabase
        .from('mood_entries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (supabaseError) throw supabaseError;

      if (!moodEntries || moodEntries.length === 0) {
        setError('No mood entries found to analyze.');
        return;
      }

      // 2. Format the data for GPT analysis
      const formattedEntries = moodEntries.map(entry => ({
        mood: entry.mood,
        energy: entry.energy,
        triggers: entry.triggers,
        date: new Date(entry.timestamp).toLocaleDateString(),
        note: entry.note
      }));

      // 3. Make the OpenAI API call
      const response = await fetch('/api/analyze-mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entries: formattedEntries,
          prompt: `Analyze these mood entries and provide insights. Consider:
            1. Overall mood patterns and trends
            2. Energy level fluctuations
            3. Common triggers
            4. Time-based patterns
            5. Areas for improvement
            
            Format your response as a JSON object with:
            {
              "title": "An encouraging title based on the patterns",
              "overview": "2-3 sentences summarizing key findings",
              "patterns": ["3-4 key observations about patterns"],
              "recommendations": ["4-5 actionable, specific suggestions"]
            }`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI analysis');
      }

      const analysisData = await response.json();
      setAnalysis(analysisData);

    } catch (err) {
      console.error('Analysis error:', err);
      setError('Unable to generate analysis. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Mood Analysis</h3>
        </div>
      </div>

      {!analysis && !loading && !error && (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Get personalized insights about your mood patterns and helpful recommendations.
          </p>
          <Button
            onClick={getAIInsights}
            className="w-full sm:w-auto"
          >
            Get AI Insights
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <p className="text-gray-600">Analyzing your mood patterns...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
          <Button
            onClick={getAIInsights}
            variant="secondary"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {analysis && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div>
            <h4 className="font-medium text-gray-900 text-lg mb-2">
              {analysis.title}
            </h4>
            <p className="text-gray-600">
              {analysis.overview}
            </p>
          </div>

          {/* Patterns */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Key Patterns:</h5>
            <ul className="space-y-2">
              {analysis.patterns.map((pattern, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 text-gray-600"
                >
                  <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0 text-blue-500" />
                  <span>{pattern}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Recommendations:</h5>
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-2 text-gray-600"
                >
                  <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
                  <span>{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={getAIInsights}
              variant="secondary"
              className="mt-4"
            >
              Refresh Analysis
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}