/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

export default function DashboardContent() {
  const [selectedOrg] = useState<any>(() =>
    JSON.parse(window.localStorage.getItem('org') ?? 'null')
  );
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedOrg) {
        try {
          // Make the POST request to '/build/allBuilds' with the organization data
          const response = await fetch('/build/latest2Builds', {
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

  const firstTable = data.filter((d: any) => d.identifier === 1);
  const secondTable = data.filter((d: any) => d.identifier === 2);

  const onSlackClick = (message: any) => {
    fetch('/slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Success');
        } else {
          return response.json().then((error) => {
            console.error('Error:', error);
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const onJiraClick = (title: any, description: any) => {
    fetch('/jira', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title, description: description }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Success');
        } else {
          return response.json().then((error) => {
            console.error('Error:', error);
          });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      {selectedOrg ? (
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
                    <TableHead>Message</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firstTable.map((pipeline: any) => (
                    <TableRow key={pipeline.run_id}>
                      <TableCell className="font-medium">
                        {pipeline.repo}
                      </TableCell>
                      <TableCell className="flex flex-row items-center space-x-2">
                        {pipeline.build_status === 'success' && (
                          <CheckCircle className="h-5 w-5" color="green" />
                        )}
                        {pipeline.build_status === 'failure' && (
                          <AlertTriangle className="h-5 w-5" color="red" />
                        )}
                        {pipeline.build_status === 'cancelled' && (
                          <XCircle className="h-5 w-5" color="red" />
                        )}
                        <span>{pipeline.build_status}</span>
                      </TableCell>
                      <TableCell>{pipeline.time_taken_ms}s</TableCell>
                      <TableCell>{pipeline.last_commit_message}</TableCell>
                      <TableCell>
                        {pipeline.build_status === 'failure' && (
                          <Dialog>
                            <DialogTrigger>
                              <Button variant="outline" size="sm">
                                View Logs
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[800px]">
                              <DialogHeader>
                                <DialogTitle>Logs</DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col space-y-2">
                                <div className="border p-2 text-xs">
                                  {pipeline.log}
                                </div>
                                <div className="border p-2 text-xs">
                                  {pipeline.openairesponse}
                                </div>
                              </div>
                              <DialogFooter className="flex flex-row space-x-2">
                                <Button
                                  onClick={() => onSlackClick(pipeline.log)}>
                                  Send Logs to Slack
                                </Button>
                                <Button
                                  onClick={() =>
                                    onJiraClick(
                                      pipeline.repo,
                                      pipeline.openairesponse
                                    )
                                  }>
                                  Create Task in Jira
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
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
              {secondTable.map((alert: any) => (
                <div key={alert.run_id} className="flex items-center ">
                  <div className="flex flex-row items-center justify-between w-full py-2 border-b">
                    <p className="text-md font-medium">
                      {alert.last_commit_message}
                    </p>
                    <p className="text-sm text-gray-500">{alert.repo}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>Please chose a repository/ organization to view the dashboard</div>
      )}
      ;
    </>
  );
}
