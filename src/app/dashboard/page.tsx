import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

export default async function Dashboard() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect('/auth');
  }

  const pipelineData2 = true;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={data.user} />

      {/* Main content */}
      {pipelineData2 ? (
        <div className="flex-1 p-8 overflow-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

          {/* Pipeline Status Grid */}
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
        </div>
      ) : (
        <div>Please chose a repository/ organization to view the dashboard</div>
      )}
    </div>
  );
}
