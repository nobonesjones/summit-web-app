import ClientWrapper from "@/components/dashboard/business-plans/client-wrapper";

export const metadata = {
  title: "Business Plans - Summit",
  description: "Manage your business plans",
};

export default function BusinessPlansPage() {
  return (
    <div className="flex flex-col gap-8">
      <ClientWrapper />
    </div>
  );
} 