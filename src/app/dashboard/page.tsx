'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useRouter } from 'next/navigation';

const pipelineData = [
  { name: 'Jenkins', status: 'healthy', buildTime: 120, errorRate: 2 },
  { name: 'CircleCI', status: 'warning', buildTime: 150, errorRate: 5 },
  { name: 'GitLab CI', status: 'failure', buildTime: 90, errorRate: 10 },
  { name: 'GitHub Actions', status: 'healthy', buildTime: 100, errorRate: 1 },
];

const historicalData = [
  { name: 'Week 1', buildTime: 100, errorRate: 5 },
  { name: 'Week 2', buildTime: 110, errorRate: 4 },
  { name: 'Week 3', buildTime: 95, errorRate: 6 },
  { name: 'Week 4', buildTime: 105, errorRate: 3 },
];

const insights = [
  'Optimize Docker image caching to reduce build times by up to 25%',
  'Implement parallel testing to speed up the test suite execution',
  'Consider upgrading to a higher-tier CI/CD plan for faster concurrent builds',
];

const recentAlerts = [
  {
    id: 1,
    message: 'Build failure in production pipeline',
    timestamp: '2023-09-26 14:30:00',
  },
  {
    id: 2,
    message: 'High error rate detected in staging environment',
    timestamp: '2023-09-26 13:15:00',
  },
  {
    id: 3,
    message: 'Deployment to production successful',
    timestamp: '2023-09-26 12:00:00',
  },
];

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">DevOps Monitor</h1>
        </div>
        <nav className="mt-4">
          <a
            onClick={() => router.push('/dashboard')}
            className="block py-2 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300">
            Dashboard
          </a>
          <a
            onClick={() => router.push('/overview')}
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Pipeline Overview
          </a>
          <a
            onClick={() => router.push('/insights')}
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Insights
          </a>
          <a
            onClick={() => router.push('/logs')}
            className="block py-2 px-4 text-gray-700 hover:bg-gray-200">
            Logs
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

        {/* Pipeline Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {pipelineData.map((pipeline) => (
            <Card key={pipeline.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {pipeline.name}
                </CardTitle>
                {pipeline.status === 'healthy' && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                {pipeline.status === 'warning' && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
                {pipeline.status === 'failure' && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pipeline.buildTime}s</div>
                <p className="text-xs text-muted-foreground">Avg. Build Time</p>
                <Progress value={100 - pipeline.errorRate} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  Success Rate: {100 - pipeline.errorRate}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Build Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI-Powered Build Insights</CardTitle>
            <CardDescription>
              Optimization suggestions to improve your CI/CD pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {insight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Error Alerts and Log Viewer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500">{alert.timestamp}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Log
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Trends</CardTitle>
            <CardDescription>
              Build time and error frequency over the past 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="buildTime"
                  fill="#8884d8"
                  name="Build Time (s)"
                />
                <Bar
                  yAxisId="right"
                  dataKey="errorRate"
                  fill="#82ca9d"
                  name="Error Rate (%)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
