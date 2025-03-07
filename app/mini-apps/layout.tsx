import React from 'react';
import Link from 'next/link';
import { APP_NAME, MAIN_NAVIGATION } from '@/lib/constants';

export default function MiniAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-purple-600">{APP_NAME}</span>
            </Link>
            <span className="text-gray-300">|</span>
            <h2 className="text-lg font-medium text-gray-800">Mini-Apps</h2>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              {MAIN_NAVIGATION.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className={`text-gray-600 hover:text-purple-600 transition-colors ${
                      item.href.startsWith('/mini-apps') ? 'text-purple-600 font-medium' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/mini-apps"
              className="bg-purple-100 text-purple-700 hover:bg-purple-200 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            >
              All Mini-Apps
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow py-6">
        {children}
      </main>
      
      <footer className="bg-white border-t py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link href="/" className="flex items-center">
                <span className="text-lg font-bold text-purple-600">{APP_NAME}</span>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                AI-powered tools for entrepreneurs and business leaders
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 items-center">
              <Link href="/mini-apps" className="text-sm text-gray-600 hover:text-purple-600">
                All Mini-Apps
              </Link>
              <Link href="/about" className="text-sm text-gray-600 hover:text-purple-600">
                About
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-purple-600">
                Contact
              </Link>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-6 pt-6 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 