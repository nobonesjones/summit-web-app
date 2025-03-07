import React from 'react';
import Link from 'next/link';
import { miniAppsConfig } from '@/config/mini-apps/config';
import FallbackImage from '@/components/ui/fallback-image';

export default function MiniAppsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Summit Mini-Apps</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Powerful tools to help you build and grow your business with AI-powered insights and guidance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {miniAppsConfig.map((app) => (
          <div 
            key={app.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 relative flex-shrink-0">
                  <FallbackImage 
                    src={app.icon || '/icons/default-app.svg'}
                    alt={app.title}
                    width={48}
                    height={48}
                    className="object-contain"
                    fallbackSrc="/icons/default-app.svg"
                  />
                </div>
                <h3 className="text-xl font-semibold">{app.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-4">{app.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                  {app.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {app.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {app.status === 'active' ? (
                  <Link 
                    href={app.path}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Try Now
                  </Link>
                ) : (
                  <span className="inline-block bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-md">
                    Coming Soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 