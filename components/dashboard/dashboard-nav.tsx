"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavItem } from "@/config/dashboard";
import { 
  FileText, 
  Calendar, 
  BarChart, 
  Target, 
  Bot, 
  Search, 
  Settings,
  Crown,
  HelpCircle,
  User,
  Home,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";

interface DashboardNavProps {
  items: NavItem[];
  variant?: "horizontal" | "vertical";
  className?: string;
}

// Map of icon names to their components
const iconMap: {[key: string]: React.ElementType} = {
  FileText,
  Calendar,
  BarChart,
  Target,
  Bot,
  Search,
  Settings,
  Crown,
  HelpCircle,
  User,
  Home
};

export function DashboardNav({ items, variant = "vertical", className }: DashboardNavProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [businessPlans, setBusinessPlans] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { user } = useAuth();
  const supabase = createClient();

  // Fetch business plans for the dropdown
  useEffect(() => {
    const fetchBusinessPlans = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("business_plans")
          .select("id, title, business_idea")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching business plans:", error);
          return;
        }

        // Log the raw data to see what we're getting
        console.log("Fetched business plans:", JSON.stringify(data, null, 2));
        setBusinessPlans(data || []);
      } catch (err) {
        console.error("Error in fetchBusinessPlans:", err);
      }
    };

    fetchBusinessPlans();
  }, [user, supabase]);

  // Check if the current path is a business plan detail page
  const isBusinessPlanPage = pathname.startsWith("/dashboard/business-plans/") && 
                            pathname !== "/dashboard/business-plans";

  // Auto-expand the business plans section if we're on a business plan page
  useEffect(() => {
    if (isBusinessPlanPage) {
      setOpenItems(prev => ({ ...prev, "Business Plans": true }));
      setSelectedItem("Business Plans");
    } else {
      // Set the selected item based on the current path
      const currentItem = items.find(item => item.href === pathname);
      if (currentItem) {
        setSelectedItem(currentItem.title);
      } else {
        setSelectedItem(null);
      }
    }
  }, [isBusinessPlanPage, pathname, items]);

  const toggleItem = (title: string) => {
    setOpenItems(prev => ({ ...prev, [title]: !prev[title] }));
    setSelectedItem(title);
  };

  if (!items?.length) {
    return null;
  }

  return (
    <nav className={cn(
      "items-start",
      variant === "horizontal" 
        ? "flex space-x-4" 
        : "grid gap-1 w-72", // Reduced width from 96 (384px) to 72 (288px) - approximately 25% narrower
      className
    )}>
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        const isParentOfActive = item.children && 
          item.children.some(child => pathname === child.href) || 
          (item.title === "Business Plans" && isBusinessPlanPage);
        const Icon = item.icon ? iconMap[item.icon] : null;
        const isOpen = openItems[item.title] || isParentOfActive;
        
        // Check if this specific item is selected
        const isItemSelected = selectedItem === item.title;
        
        // Special handling for Business Plans
        if (item.title === "Business Plans" && variant === "vertical") {
          return (
            <div key={index} className="w-full">
              <button
                onClick={() => toggleItem(item.title)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium",
                  "transition-colors hover:bg-muted/50",
                  "relative truncate",
                  isItemSelected
                    ? "text-black font-semibold border-l-2 border-black pl-[11px]"
                    : "text-muted-foreground border-l-2 border-transparent pl-[11px]"
                )}
              >
                {Icon && <Icon className={cn("h-4 w-4 shrink-0", isItemSelected ? "text-black" : "")} />}
                <span className="truncate">{item.title}</span>
              </button>
              
              {isOpen && (
                <div className="pl-9 space-y-1 mt-1">
                  {businessPlans.map((plan) => {
                    // Check if this specific plan is selected
                    const isPlanSelected = pathname === `/dashboard/business-plans/${plan.id}`;
                    
                    // Use the business_idea field directly instead of trying to parse the title
                    const displayName = plan.business_idea || "Untitled Plan";
                    
                    return (
                      <Link
                        key={plan.id}
                        href={`/dashboard/business-plans/${plan.id}`}
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-1.5 text-sm",
                          "transition-colors hover:bg-muted/50",
                          "relative truncate",
                          isPlanSelected
                            ? "text-black font-semibold border-l-2 border-black pl-[11px]"
                            : "text-muted-foreground border-l-2 border-transparent pl-[11px]"
                        )}
                      >
                        <span className="truncate">{displayName}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }
        
        // Default rendering for other items
        return (
          <Link
            key={index}
            href={item.href}
            onClick={() => setSelectedItem(item.title)}
            className={cn(
              "flex w-full items-center gap-2 px-3 py-2 text-sm font-medium",
              "transition-colors hover:bg-muted/50",
              "relative truncate",
              // Only highlight if this specific item is selected, not based on pathname
              isItemSelected
                ? "text-black font-semibold border-l-2 border-black pl-[11px]"
                : "text-muted-foreground border-l-2 border-transparent pl-[11px]",
              variant === "horizontal" && "px-3"
            )}
          >
            {Icon && <Icon className={cn("h-4 w-4 shrink-0", isItemSelected ? "text-black" : "")} />}
            <span className="truncate">{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
} 