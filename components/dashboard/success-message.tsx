'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function SuccessMessage() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (success === 'signup') {
      setShowMessage(true);
      
      // Show toast notification
      toast({
        title: "Welcome to Summit!",
        description: "Your account has been created successfully.",
        variant: "default",
      });
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!showMessage) return null;

  return (
    <div className="fixed top-20 right-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg shadow-md z-50 flex items-center space-x-3 animate-in slide-in-from-right">
      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
      <div>
        <h3 className="font-medium">Success!</h3>
        <p className="text-sm">Your account has been created successfully.</p>
      </div>
    </div>
  );
} 