// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from 'recharts';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

// const performanceData = [
//   { date: '2023-09-20', buildTime: 100, successRate: 95 },
//   { date: '2023-09-21', buildTime: 110, successRate: 93 },
//   { date: '2023-09-22', buildTime: 95, successRate: 97 },
//   { date: '2023-09-23', buildTime: 105, successRate: 94 },
//   { date: '2023-09-24', buildTime: 98, successRate: 96 },
//   { date: '2023-09-25', buildTime: 92, successRate: 98 },
//   { date: '2023-09-26', buildTime: 88, successRate: 99 },
// ];

const insights = [
  {
    type: 'optimization',
    message: 'Implement parallel testing to reduce build times by up to 30%',
    impact: 'High',
  },
  {
    type: 'warning',
    message: "High failure rate detected in the 'test' stage of the pipeline",
    impact: 'Medium',
  },
  {
    type: 'trend',
    message: 'Overall build success rate has improved by 5% over the last week',
    impact: 'Positive',
  },
];

export default async function Insights() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          AI-Powered Insights
        </h2>

        {/* Performance Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>
              Build time and success rate over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="buildTime"
                  stroke="#8884d8"
                  name="Build Time (s)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="successRate"
                  stroke="#82ca9d"
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Insights</CardTitle>
            <CardDescription>
              Actionable insights to improve your CI/CD pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            {insights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 mb-4 last:mb-0">
                {insight.type === 'optimization' && (
                  <Lightbulb className="w-6 h-6 text-yellow-500" />
                )}
                {insight.type === 'warning' && (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
                {insight.type === 'trend' && (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium">{insight.message}</p>
                  <p className="text-xs text-gray-500">
                    Impact: {insight.impact}
                  </p>
                </div>
              </div>
            ))}
            <Button className="mt-4">Generate More Insights</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
