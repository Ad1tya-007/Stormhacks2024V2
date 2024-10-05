import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import GithubButton from '@/components/shared/GithubButton';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) {
    redirect('/dashboard');
  }

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
          <GithubButton />

          <Link href="/" className="text-sm text-gray-500 mt-2 hover:underline">
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
