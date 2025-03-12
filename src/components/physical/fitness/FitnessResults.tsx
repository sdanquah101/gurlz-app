// FitnessResults.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFitnessAssessment } from '../../../hooks/useFitnessAssessment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export default function FitnessResults() {
  const location = useLocation();
  const { getProgressAnalytics } = useFitnessAssessment();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      const data = await getProgressAnalytics();
      setAnalytics(data);
    };
    
    loadAnalytics();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Overall Progress</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500">Total Assessments</p>
            <p className="text-2xl font-bold">{analytics.totalAssessments}</p>
          </div>
          <div>
            <p className="text-gray-500">Latest Score</p>
            <p className="text-2xl font-bold">{Math.round(analytics.latestScore)}%</p>
          </div>
          <div>
            <p className="text-gray-500">Overall Improvement</p>
            <p className="text-2xl font-bold text-green-600">
              {analytics.improvement > 0 ? '+' : ''}{Math.round(analytics.improvement)}%
            </p>
          </div>
        </div>
      </div>

      {/* Category Progress Charts */}
      {Object.entries(analytics.categoryProgress).map(([category, data]) => (
        <div key={category} className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 capitalize">{category} Progress</h3>
          <div className="h-64">
            <LineChart data={data} width={800} height={250}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#0EA5E9" 
                name={`${category} Score`}
              />
            </LineChart>
          </div>
        </div>
      ))}
    </div>
  );
}