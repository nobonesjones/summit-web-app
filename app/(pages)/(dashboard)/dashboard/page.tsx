"use client";

import { useEffect, useState, Suspense } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

// Sample data for business plans
const sampleBusinessPlans = [
  {
    id: "plan-1",
    name: "Coffee Subscription Service",
    type: "Business Plan",
    createdAt: "2024-03-01",
    status: "completed",
    category: "New Company"
  },
  {
    id: "plan-2",
    name: "Luxury Car Rental Dubai",
    type: "Business Plan",
    createdAt: "2024-03-05",
    status: "completed",
    category: "Scale-Up"
  },
  {
    id: "plan-3",
    name: "Tech Startup SaaS Platform",
    type: "Business Plan",
    createdAt: "2024-03-10",
    status: "completed",
    category: "New Company"
  },
];

// Create a client component for the content that uses useSearchParams
function DashboardContent() {
  const { user, loading } = useAuth();
  const [greeting, setGreeting] = useState("Good day");
  const [businessPlans, setBusinessPlans] = useState(sampleBusinessPlans);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successType, setSuccessType] = useState('');
  const searchParams = useSearchParams();
  const success = searchParams.get('success');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (success === 'signup' || success === 'signin') {
      setShowSuccessMessage(true);
      setSuccessType(success);
      
      // Show toast notification
      if (success === 'signup') {
        toast({
          title: "Welcome to Summit!",
          description: "Your account has been created successfully.",
          variant: "default",
        });
      } else if (success === 'signin') {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
          variant: "default",
        });
      }
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Function to get category badge color
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "New Company":
        return <Badge className="bg-green-500">New Company</Badge>;
      case "Scale-Up":
        return <Badge className="bg-blue-500">Scale-Up</Badge>;
      case "Established":
        return <Badge className="bg-purple-500">Established</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading your dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {showSuccessMessage && (
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 p-4 rounded-lg shadow-md flex items-center space-x-3 animate-in fade-in">
          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          <div>
            <h3 className="font-medium">Success!</h3>
            <p className="text-sm">
              {successType === 'signup' 
                ? "Your account has been created successfully." 
                : "You have successfully signed in."}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {greeting}, {user?.email?.split("@")[0] || "there"}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your business plans and documents.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Your Business Plans</h2>
        <Link href="/mini-apps/business-plan">
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Create New Plan
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>A list of your business plans.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businessPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.name}</TableCell>
                  <TableCell>{getCategoryBadge(plan.category)}</TableCell>
                  <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      View <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {businessPlans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">No business plans yet</p>
                        <p className="text-muted-foreground">Create your first business plan to get started.</p>
                      </div>
                      <Link href="/mini-apps/business-plan">
                        <Button>Create Business Plan</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading component for Suspense fallback
function DashboardLoading() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Loading dashboard...</h2>
        <p className="text-muted-foreground">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  );
}

// Main dashboard page component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
} 