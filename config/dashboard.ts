export interface NavItem {
  title: string;
  href: string;
  icon?: string;
}

export const dashboardConfig: {
  mainNav: NavItem[];
  sidebarNav: NavItem[];
} = {
  mainNav: [
    {
      title: "Summit",
      href: "/",
    },
  ],
  sidebarNav: [
    {
      title: "Business Plans",
      href: "/dashboard/plans",
      icon: "FileText",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "Settings",
    },
  ],
}; 