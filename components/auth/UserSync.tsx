'use client';

import { useEffect } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';

/**
 * UserSync component
 * 
 * This component syncs the user's authentication state with the application.
 * It doesn't render anything visible, but performs side effects when auth state changes.
 */
export default function UserSync() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    // Only run this effect when authentication is loaded and the user is signed in
    if (!loading) {
      console.log('Auth state changed:', user ? 'Signed in' : 'Signed out');
      
      // You can add additional logic here, such as:
      // - Syncing user data with a backend service
      // - Setting up analytics
      // - Initializing user-specific features
    }
  }, [user, loading]);
  
  // This component doesn't render anything visible
  return null;
} 