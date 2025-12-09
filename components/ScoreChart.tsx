import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  score: number;
}

const ScoreChart: React.FC<ScoreChartProps> = ({ score }) => {
  const data = [{ name: 'Score', value: score, fill: score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }];

  const getGrade = (s: number) => {
    if (s >= 90) return { label: 'Excellent', color: 'text-emerald-600' };
    if (s >= 75) return { label: 'Good', color: 'text-emerald-500' };
    if (s >= 50) return { label: 'Average', color: 'text-amber-500' };
    return { label: 'Needs Work', color: 'text-red-500' };
  };

  const grade = getGrade(score);

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            label={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
        <div className="text-6xl font-bold text-slate-800">{score}%</div>
        <div className={`text-lg font-medium ${grade.color} mt-2`}>
          {grade.label}
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;
