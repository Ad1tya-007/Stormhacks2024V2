// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

const pipelineData = [
  {
    name: 'Jenkins',
    status: 'healthy',
    buildTime: 120,
    errorRate: 2,
    lastRun: '2023-09-26 15:30:00',
    branch: 'main',
  },
  {
    name: 'CircleCI',
    status: 'warning',
    buildTime: 150,
    errorRate: 5,
    lastRun: '2023-09-26 14:45:00',
    branch: 'feature/new-ui',
  },
  {
    name: 'GitLab CI',
    status: 'failure',
    buildTime: 90,
    errorRate: 10,
    lastRun: '2023-09-26 13:15:00',
    branch: 'hotfix/critical-bug',
  },
  {
    name: 'GitHub Actions',
    status: 'healthy',
    buildTime: 100,
    errorRate: 1,
    lastRun: '2023-09-26 12:00:00',
    branch: 'develop',
  },
];

export default async function PipelineOverview() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data.user} />

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Pipeline Overview
        </h2>

        {/* Pipeline Status Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>CI/CD Pipeline Status</CardTitle>
            <CardDescription>
              Detailed view of all pipeline statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Build Time</TableHead>
                  <TableHead>Error Rate</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pipelineData.map((pipeline) => (
                  <TableRow key={pipeline.name}>
                    <TableCell className="font-medium">
                      {pipeline.name}
                    </TableCell>
                    <TableCell>
                      {pipeline.status === 'healthy' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {pipeline.status === 'warning' && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      {pipeline.status === 'failure' && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>{pipeline.buildTime}s</TableCell>
                    <TableCell>{pipeline.errorRate}%</TableCell>
                    <TableCell>{pipeline.lastRun}</TableCell>
                    <TableCell>{pipeline.branch}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pipeline Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Performance Comparison</CardTitle>
            <CardDescription>
              Build time and error rate across different pipelines
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pipelineData}>
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
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
