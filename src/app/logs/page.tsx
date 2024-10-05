import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import Sidebar from '@/components/shared/Sidebar';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

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

export default async function Logs() {
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
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Logs</h2>

        {/* Log Filters */}
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

        {/* Log Entries */}
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
    </div>
  );
}
