'use client';

import React from 'react';
import SuccessMessage from './success-message';

export default function DashboardClient({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SuccessMessage />
      {children}
    </>
  );
} 