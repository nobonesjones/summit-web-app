"use client"

import { useAuth } from '@/lib/hooks/useAuth';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from './navbar';
import Footer from './footer';

interface PageWrapperProps {
  children: ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
}

export default function PageWrapper({
  children,
  showNavbar = true,
  showFooter = true,
}: PageWrapperProps) {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();
  
  // Determine if we're on a marketing page
  const isMarketingPage = !pathname.includes('/dashboard') && 
                          !pathname.includes('/sign-in') && 
                          !pathname.includes('/sign-up');

  return (
    <div className="flex min-h-screen flex-col">
      {showNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
      {showFooter && isMarketingPage && <Footer />}
    </div>
  );
}