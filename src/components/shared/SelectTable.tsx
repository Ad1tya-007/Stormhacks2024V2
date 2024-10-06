/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SelectTable({ data }: { data: any }) {
  const [filter, setFilter] = useState<string>('');

  const filteredItems = data.filter(
    (item: any) =>
      item.owner.toLowerCase().includes(filter.toLowerCase()) ||
      item.link.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="flex-1 p-8 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Select a Repository or Organization
          </CardTitle>
          <CardDescription>
            Choose a repository or organization to monitor with the AI-Powered
            DevOps Health Monitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="text-gray-400" />
            <Input
              type="text"
              placeholder="Filter repositories and organizations..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.owner}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell className="text-md truncate">
                    {item.link}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
