'use client';

import React from 'react';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    popup?: string;
  }>;
}

export default function MapComponent({
  center = [51.505, -0.09],
  zoom = 13,
  markers = []
}: MapComponentProps) {
  // This is a placeholder component
  // In a real implementation, this would use the leaflet library
  return (
    <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500">Map would display here</p>
        <p className="text-sm text-gray-400">Center: {center[0]}, {center[1]} | Zoom: {zoom}</p>
        <p className="text-sm text-gray-400">Markers: {markers.length}</p>
      </div>
    </div>
  );
} 