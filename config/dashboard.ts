export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  children?: NavItem[];
}

export interface DashboardConfig {
  mainNav: NavItem[];
  sidebarNav: NavItem[];
  actionButtons: NavItem[];
}

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Home",
      href: "/dashboard/home",
      icon: "home",
    },
    {
      title: "Business Plans",
      href: "/dashboard/business-plans",
      icon: "fileText",
    },
    {
      title: "One Page Plans",
      href: "/dashboard/one-page-plans",
    },
    {
      title: "90 Day Sprints",
      href: "/dashboard/sprints",
    },
    {
      title: "KPIs",
      href: "/dashboard/kpis",
    },
    {
      title: "OKRs",
      href: "/dashboard/okrs",
    },
    {
      title: "AI Consultants",
      href: "/dashboard/ai-consultants",
    },
    {
      title: "Market Research",
      href: "/dashboard/market-research",
    },
  ],
  sidebarNav: [
    {
      title: "Home",
      href: "/dashboard/home",
      icon: "Home",
    },
    {
      title: "Business Plans",
      href: "/dashboard/business-plans",
      icon: "FileText",
      children: []
    },
    {
      title: "One Page Plans",
      href: "/dashboard/one-page-plans",
      icon: "FileText",
    },
    {
      title: "90 Day Sprints",
      href: "/dashboard/sprints",
      icon: "Calendar",
    },
    {
      title: "KPIs",
      href: "/dashboard/kpis",
      icon: "BarChart",
    },
    {
      title: "OKRs",
      href: "/dashboard/okrs",
      icon: "Target",
    },
    {
      title: "AI Consultants",
      href: "/dashboard/ai-consultants",
      icon: "Bot",
    },
    {
      title: "Market Research",
      href: "/dashboard/market-research",
      icon: "Search",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "Settings",
    },
  ],
  actionButtons: [
    {
      title: "Upgrade",
      href: "/dashboard/upgrade",
      icon: "Crown",
    },
    {
      title: "Help",
      href: "/dashboard/help",
      icon: "HelpCircle",
    },
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "User",
    },
  ],
}; 