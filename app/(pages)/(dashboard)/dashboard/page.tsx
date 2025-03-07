"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, ArrowRight } from "lucide-react";
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

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [greeting, setGreeting] = useState("Good day");
  const [businessPlans, setBusinessPlans] = useState(sampleBusinessPlans);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

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