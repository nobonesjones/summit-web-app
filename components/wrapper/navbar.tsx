"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/providers/auth-provider";
import UserProfile from "@/components/user-profile";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import { Menu, X } from "lucide-react";

// Define the type for navigation items
interface NavItem {
  name: string;
  href: string;
  show: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Determine if we're on a dashboard page
  const isDashboard = pathname.includes('/dashboard');

  // Navigation items - removed as requested
  const navItems: NavItem[] = [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <Image 
              src="/images/summit-full-logo.png" 
              alt="Summit Logo" 
              width={180} 
              height={40} 
              priority
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop navigation - empty now */}
          <div className="hidden md:flex md:gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <UserProfile />
          ) : (
            <div className="hidden md:block">
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="mr-2">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
          <ModeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="container md:hidden">
          <div className="flex flex-col space-y-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
                onClick={closeMenu}
              >
                {item.name}
              </Link>
            ))}
            {!user && (
              <div className="flex flex-col space-y-2 pt-2">
                <Link href="/sign-in" onClick={closeMenu}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={closeMenu}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
