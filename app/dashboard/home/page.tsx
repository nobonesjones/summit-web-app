import HomeContent from "@/components/dashboard/home/home-content";

export const metadata = {
  title: "Dashboard - Summit",
  description: "Manage your business plans and growth strategies",
};

export default function DashboardHomePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      <HomeContent />
    </div>
  );
} 