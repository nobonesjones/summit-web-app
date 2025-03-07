"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NavItem } from "@/config/dashboard";

interface DashboardNavProps {
  items: NavItem[];
}

export function DashboardNav({ items }: DashboardNavProps) {
  const pathname = usePathname();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-muted hover:bg-muted"
                : "hover:bg-transparent hover:underline",
              "justify-start"
            )}
          >
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 