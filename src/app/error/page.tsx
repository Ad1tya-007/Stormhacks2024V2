import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
            Error 404
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p className="text-center text-gray-700 mb-4">
            We apologize for the inconvenience. Please try again or return to
            the home page.
          </p>
        </CardContent>
      </Card>
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>If the problem persists, please contact our support team.</p>
        <p className="mt-2">support@cicdfy.com</p>
      </div>
    </div>
  );
}
