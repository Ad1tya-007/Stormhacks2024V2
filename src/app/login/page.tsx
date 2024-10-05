'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Github } from 'lucide-react';

export default function LoginPage() {
  const handleGitHubLogin = () => {
    console.log('Initiating GitHub login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Log in to access your DevOps Health Monitor
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button
            onClick={handleGitHubLogin}
            className="w-full max-w-sm flex items-center justify-center space-x-2 mb-4"
            variant="outline"
            size="lg">
            <Github className="w-5 h-5" />
            <span>Log in with GitHub</span>
          </Button>

          <Link href="/" className="text-sm text-gray-500 mt-2 hover:underline">
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
