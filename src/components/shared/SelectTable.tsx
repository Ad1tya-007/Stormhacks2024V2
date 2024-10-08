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
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function SelectTable({ data }: { data: any }) {
  const { toast } = useToast();

  const [filter, setFilter] = useState<string>('');
  const [selectedOrg, setSelectedOrg] = useState<any>(() =>
    JSON.parse(window.localStorage.getItem('org') ?? 'null')
  );

  // Filter data based on user input
  const filteredItems = data.filter(
    (item: any) =>
      item.owner.toLowerCase().includes(filter.toLowerCase()) ||
      item.link.toLowerCase().includes(filter.toLowerCase())
  );

  const handleSelect = (item: any) => {
    try {
      setSelectedOrg(item);
      window.localStorage.setItem('org', JSON.stringify(item));
      toast({
        title: 'Success',
        description: 'Organization selected successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `${error.message}`,
      });
    }
  };

  useEffect(() => {
    const storedOrg = JSON.parse(window.localStorage.getItem('org') ?? 'null');
    if (storedOrg) {
      setSelectedOrg(storedOrg);
    }
  }, []);

  return (
    <div className="flex-1 p-8 overflow-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Select an Organization
          </CardTitle>
          <CardDescription>
            Choose an organization to monitor with the AI-Powered DevOps Health
            Monitor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              type="text"
              placeholder="Filter organizations..."
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
                    {selectedOrg?.id === item.id ? (
                      <Button variant="outline" size="sm" disabled>
                        Selected
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelect(item)}>
                        Select
                      </Button>
                    )}
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
