/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-async-client-component */
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const colors = [
  '#8884d8', // Soft Purple
  '#82ca9d', // Soft Green
  '#ffc658', // Soft Yellow
  '#ff8042', // Soft Orange
  '#a4de6c', // Light Green
  '#d0ed57', // Lemon Yellow
  '#0088FE', // Bright Blue
  '#FFBB28', // Soft Yellow Orange
  '#FF4444', // Bright Red
  '#00C49F', // Teal
];

export default function AnalyticsContent() {
  const [selectedOrg] = useState<any>(() =>
    JSON.parse(window.localStorage.getItem('org') ?? 'null')
  );
  const [data, setData] = useState<any>([]);
  console.log('🚀 ~ AnalyticsContent ~ data:', data);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Calculate total pages based on logsPerPage
  const totalPages = Math.ceil(data.length / logsPerPage);

  // Get current logs for the page
  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = data.slice(indexOfFirstLog, indexOfLastLog);

  // Function to handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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

          // Set the data state with the fetched builds
          setData(allBuilds);
        } catch (error) {
          console.error('Error fetching builds:', error);
        }
      }
    };

    fetchData(); // Call the function to fetch data
  }, [selectedOrg]);

  let transformedData: { name: string; build_times: number[] }[] = [];

  data.forEach((obj: any) => {
    // Find if the repo name already exists in the transformedData array
    let existingRepo = transformedData.find(
      (item: any) => item.name === obj.repo
    );

    if (existingRepo) {
      // If it exists, just push the new build time into its build_times array
      existingRepo.build_times.push(obj.time_taken_ms / 1000);
    } else {
      // If it doesn't exist, add a new object with name_of_repo and build_times array
      transformedData.push({
        name: obj.repo,
        build_times: [obj.time_taken_ms / 1000],
      });
    }
  });

  // Prepare the data for the chart using index as the x-axis

  const maxBuilds = Math.max(
    ...transformedData.map((repo) => repo.build_times.length)
  ); // Find the maximum number of builds
  const data2 = Array.from({ length: maxBuilds }, (_, index) => {
    const entry: { [key: string]: number } = { index }; // Use index for x-axis
    transformedData.forEach((repo) => {
      entry[`buildTime_${repo.name}`] = repo.build_times[index]; // Add build time for each repo
    });
    return entry;
  });

  // Colors for the lines
  const colors = ['#8884d8', '#82ca9d', '#ffc658'];

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data2}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="index"
                  label={{
                    position: 'insideBottomRight',
                    offset: 0,
                  }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="#8884d8"
                  label={{
                    value: 'Build Time (s)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Legend />

                {/* Dynamically generate lines for each repo */}
                {transformedData.map((d, index) => (
                  <Line
                    key={d.name}
                    yAxisId="left"
                    type="monotone"
                    dataKey={`buildTime_${d.name}`}
                    stroke={colors[index % colors.length]} // Rotate through colors
                    name={`${d.name} Build Time (s)`}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
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
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time(ms)</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentLogs.map((entry: any) => (
                    <TableRow key={entry.run_id}>
                      <TableCell>{entry.repo}</TableCell>
                      <TableCell className="flex flex-row items-center space-x-2">
                        {entry.build_status === 'success' && (
                          <CheckCircle className="h-5 w-5" color="green" />
                        )}
                        {entry.build_status === 'failure' && (
                          <AlertTriangle className="h-5 w-5" color="red" />
                        )}
                        {entry.build_status === 'cancelled' && (
                          <XCircle className="h-5 w-5" color="red" />
                        )}
                        <span>{entry.build_status}</span>
                      </TableCell>
                      <TableCell>{entry.time_taken_ms}</TableCell>
                      <TableCell className="truncate">
                        {entry.last_commit_message}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}>
                  Previous
                </Button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
