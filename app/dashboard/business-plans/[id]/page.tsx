import BusinessPlanView from "@/components/dashboard/business-plans/business-plan-view";

export const metadata = {
  title: "Business Plan Details - Summit",
  description: "View and manage your business plan",
};

export default function BusinessPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <BusinessPlanView id={params.id} />;
} 