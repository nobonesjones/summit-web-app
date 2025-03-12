'use client';

import dynamic from 'next/dynamic';

// Dynamically import the UserSync component to ensure it only runs on the client
const UserSync = dynamic(() => import('./UserSync'), { ssr: false });

/**
 * This wrapper component ensures that the UserSync component is only rendered on the client.
 * It's needed because the UserSync component uses hooks that require client-side rendering.
 */
export default function UserSyncWrapper() {
  return <UserSync />;
} 