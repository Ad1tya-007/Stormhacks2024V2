import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitBranch, GitCommit, GitMerge } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-gray-800 mb-2">
            AI-Powered DevOps Health Monitor
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Optimize your CI/CD pipelines with real-time insights and AI-driven
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="flex justify-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <GitBranch className="h-12 w-12 text-blue-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Monitor Pipelines
              </p>
            </div>
            <div className="flex flex-col items-center">
              <GitCommit className="h-12 w-12 text-green-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Analyze Performance
              </p>
            </div>
            <div className="flex flex-col items-center">
              <GitMerge className="h-12 w-12 text-purple-500 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                Optimize Workflows
              </p>
            </div>
          </div>
          <p className="text-center text-gray-700 mb-8 max-w-2xl">
            Our AI-powered platform provides real-time monitoring, intelligent
            insights, and actionable recommendations to help you streamline your
            DevOps processes and boost your team&apos;s productivity.
          </p>
          <Link href="/login" passHref>
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
