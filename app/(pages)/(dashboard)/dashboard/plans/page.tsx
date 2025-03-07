"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus, ArrowRight, Filter } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  {
    id: "plan-4",
    name: "Retail Fashion Boutique",
    type: "Business Plan",
    createdAt: "2024-03-15",
    status: "completed",
    category: "Established"
  },
];

export default function BusinessPlansPage() {
  const [businessPlans, setBusinessPlans] = useState(sampleBusinessPlans);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  // Filter business plans by category
  const filteredBusinessPlans = categoryFilter === "all"
    ? businessPlans
    : businessPlans.filter(plan => plan.category === categoryFilter);

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Business Plans</h1>
        <p className="text-muted-foreground">
          View and manage all your business plans.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by:</span>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="New Company">New Company</SelectItem>
              <SelectItem value="Scale-Up">Scale-Up</SelectItem>
              <SelectItem value="Established">Established</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              {filteredBusinessPlans.map((plan) => (
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
              {filteredBusinessPlans.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center gap-4">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="font-medium">No business plans found</p>
                        <p className="text-muted-foreground">
                          {categoryFilter === "all"
                            ? "Create your first business plan to get started."
                            : `No business plans found in the "${categoryFilter}" category.`}
                        </p>
                      </div>
                      {categoryFilter === "all" && (
                        <Link href="/mini-apps/business-plan">
                          <Button>Create Business Plan</Button>
                        </Link>
                      )}
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