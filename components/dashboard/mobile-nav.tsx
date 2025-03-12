"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavItem } from "@/config/dashboard";

interface MobileNavProps {
  mainNavItems?: NavItem[];
  sidebarNavItems: NavItem[];
  actionButtons?: NavItem[];
}

export function MobileNav({ mainNavItems, sidebarNavItems, actionButtons }: MobileNavProps) {
  const pathname = usePathname();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-6 py-4">
          <Link 
            href="/" 
            className="block transition-transform hover:scale-105"
            aria-label="Go to home page"
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Summit
            </h2>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {mainNavItems?.map(
              (item) =>
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    pathname={pathname}
                    className="text-muted-foreground"
                  >
                    {item.title}
                  </MobileLink>
                )
            )}
          </div>
          <div className="flex flex-col space-y-2 mt-8">
            {sidebarNavItems.map((item, index) => {
              return (
                <div key={index} className="flex flex-col space-y-3 pt-6">
                  <MobileLink
                    href={item.href}
                    pathname={pathname}
                    className="text-sm font-medium"
                  >
                    {item.title}
                  </MobileLink>
                </div>
              );
            })}
          </div>
          
          {/* Action Buttons */}
          {actionButtons && actionButtons.length > 0 && (
            <div className="flex flex-col space-y-2 mt-8 pt-4 border-t">
              <h3 className="text-sm font-medium text-muted-foreground">Actions</h3>
              {actionButtons.map((item, index) => (
                <MobileLink
                  key={index}
                  href={item.href}
                  pathname={pathname}
                  className="text-sm font-medium"
                >
                  {item.title}
                </MobileLink>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps {
  href: string;
  pathname: string;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  pathname,
  children,
  className,
}: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        pathname === href && "text-foreground",
        className
      )}
    >
      {children}
    </Link>
  );
} 