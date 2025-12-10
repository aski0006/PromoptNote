import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Note } from '../types';
import { Logo } from './Logo';
import { TrendingUp } from 'lucide-react';

interface DashboardProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  isDarkMode: boolean;
  t: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ notes, onNoteSelect, isDarkMode, t }) => {
  // Top 10 High Frequency
  const chartData = [...notes]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 10)
    .map(n => ({
      ...n, // Spread full note object so we can access it on click
      name: n.title.length > 20 ? n.title.substring(0, 20) + '...' : n.title,
      usage: n.usageCount
    }));

  const barColor = isDarkMode ? '#60a5fa' : '#3b82f6';
  const textColor = isDarkMode ? '#9ca3af' : '#4b5563';
  const tooltipBg = isDarkMode ? '#1f2937' : '#ffffff';

  const handleBarClick = (entry: any) => {
    // entry corresponds to the data item for the clicked bar
    if (entry && entry.id) {
        const note = notes.find(n => n.id === entry.id);
        if (note) {
            onNoteSelect(note);
        }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8 animate-fade-in transition-colors duration-500">
      <div className="flex flex-col items-center justify-center space-y-4 py-8 mb-4">
        <Logo className="w-28 h-28 shadow-xl rounded-2xl transition-transform duration-500 hover:scale-105" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white tracking-tight">
          {t.appTitle}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {t.appDesc}
        </p>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto pb-8">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-500 min-h-[500px]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t.top10}</h2>
          </div>
          
          <div className="flex-1 w-full">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                <BarChart
                    layout="vertical"
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    tick={{ fill: textColor, fontSize: 13, fontWeight: 500 }} 
                    axisLine={false}
                    tickLine={false}
                    />
                    <Tooltip 
                    cursor={{ fill: isDarkMode ? '#374151' : '#f3f4f6', radius: 4 }}
                    contentStyle={{ 
                        backgroundColor: tooltipBg, 
                        borderRadius: '12px', 
                        border: 'none',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                    }}
                    itemStyle={{ color: isDarkMode ? '#e5e7eb' : '#1f2937', fontWeight: 600 }}
                    />
                    <Bar 
                        dataKey="usage" 
                        barSize={32} 
                        radius={[0, 8, 8, 0]}
                        onClick={handleBarClick}
                        cursor="pointer"
                    >
                    {chartData.map((_, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={barColor} 
                            opacity={0.8 + (index * 0.02)} 
                            className="transition-all duration-300 hover:opacity-100"
                            cursor="pointer"
                        />
                    ))}
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                    {t.noPrompts}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};