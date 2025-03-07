'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

// Dynamically import the map component with no SSR
const MapComponent = dynamic(
  () => import('./map-component'),
  { 
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-md flex items-center justify-center">Loading map...</div>
  }
);

export default function MapWrapper(props: MapComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center">Loading map...</div>;
  }

  return <MapComponent {...props} />;
} 