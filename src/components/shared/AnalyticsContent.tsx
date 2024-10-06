/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-async-client-component */
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
// import {
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from 'recharts';

const logEntries = [
  {
    id: 1,
    timestamp: '2023-09-26 15:30:00',
    level: 'INFO',
    message: 'Build #1234 started for project XYZ',
    pipeline: 'Jenkins',
  },
  {
    id: 2,
    timestamp: '2023-09-26 15:31:15',
    level: 'WARNING',
    message: 'Test coverage below threshold',
    pipeline: 'CircleCI',
  },
  {
    id: 3,
    timestamp: '2023-09-26 15:32:30',
    level: 'ERROR',
    message: 'Deployment failed: Unable to connect to server',
    pipeline: 'GitLab CI',
  },
  {
    id: 4,
    timestamp: '2023-09-26 15:33:45',
    level: 'INFO',
    message: 'Pull request #567 merged successfully',
    pipeline: 'GitHub Actions',
  },
  {
    id: 5,
    timestamp: '2023-09-26 15:34:00',
    level: 'ERROR',
    message: 'Build #1235 failed: Compilation error',
    pipeline: 'Jenkins',
  },
];

// const performanceData = [
//   { date: '2023-09-20', buildTime: 100, successRate: 95 },
//   { date: '2023-09-21', buildTime: 110, successRate: 93 },
//   { date: '2023-09-22', buildTime: 95, successRate: 97 },
//   { date: '2023-09-23', buildTime: 105, successRate: 94 },
//   { date: '2023-09-24', buildTime: 98, successRate: 96 },
//   { date: '2023-09-25', buildTime: 92, successRate: 98 },
//   { date: '2023-09-26', buildTime: 88, successRate: 99 },
// ];

export default function AnalyticsContent() {
  const [selectedOrg, setSelectedOrg] = useState<any>(() =>
    JSON.parse(window.localStorage.getItem('org') ?? 'null')
  );
  const [data, setData] = useState<any>([]);

  // useEffect to call the POST request once the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      if (selectedOrg) {
        try {
          // Make the POST request to '/build/allBuilds' with the organization data
          const response = await fetch('/build/allBuilds', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ org: selectedOrg.owner }),
          });

          // Parse the response from the POST request
          const allBuilds = await response.json();
          console.log('🚀 ~ AnalyticsContent ~ allBuilds:', allBuilds);

          // Set the data state with the fetched builds
          setData(allBuilds);
        } catch (error) {
          console.error('Error fetching builds:', error);
        }
      }
    };

    fetchData(); // Call the function to fetch data
  }, [selectedOrg]);

  console.log(data);

  return (
    <Tabs defaultValue="logs" className="w-full">
      <TabsList>
        <TabsTrigger value="logs">Logs</TabsTrigger>
        <TabsTrigger value="trends">Trends</TabsTrigger>
      </TabsList>
      <TabsContent value="trends">
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
      </TabsContent>
      <TabsContent value="logs">
        <div className="flex-1 overflow-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Log Filters</CardTitle>
              <CardDescription>
                Filter and search through log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Input type="text" placeholder="Search logs..." />
                </div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Log Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Pipelines</SelectItem>
                    <SelectItem value="jenkins">Jenkins</SelectItem>
                    <SelectItem value="circleci">CircleCI</SelectItem>
                    <SelectItem value="gitlab">GitLab CI</SelectItem>
                    <SelectItem value="github">GitHub Actions</SelectItem>
                  </SelectContent>
                </Select>
                <Button>Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Log Entries</CardTitle>
              <CardDescription>
                Recent log entries from all pipelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Pipeline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.timestamp}</TableCell>
                      <TableCell>
                        {entry.level === 'INFO' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {entry.level === 'WARNING' && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                        {entry.level === 'ERROR' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="ml-2">{entry.level}</span>
                      </TableCell>
                      <TableCell>{entry.message}</TableCell>
                      <TableCell>{entry.pipeline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Load More Logs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
