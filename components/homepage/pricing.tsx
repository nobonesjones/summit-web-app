"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const { isSignedIn } = useAuth();

  const plans = [
    {
      name: "Free",
      description: "Essential tools for business planning",
      price: annual ? "$0" : "$0",
      duration: "forever",
      features: [
        "Access to Business Plan Generator",
        "Up to 3 saved plans",
        "Basic AI suggestions",
        "Standard export options",
        "Community support",
      ],
      cta: "Get Started",
      href: isSignedIn ? "/dashboard" : "/sign-up",
      popular: false,
    },
    {
      name: "Pro",
      description: "Advanced tools for serious entrepreneurs",
      price: annual ? "$69" : "$9",
      duration: annual ? "/year" : "/month",
      features: [
        "All Free features",
        "Unlimited saved plans",
        "Advanced AI suggestions",
        "Priority support",
        "Premium export options",
        "Collaboration features",
        "Custom branding",
      ],
      cta: "Upgrade Now",
      href: isSignedIn ? "/dashboard/settings" : "/sign-up",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Choose the plan that's right for your business
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={annual ? "default" : "outline"}
              size="sm"
              onClick={() => setAnnual(true)}
            >
              Annual
            </Button>
            <Button
              variant={!annual ? "default" : "outline"}
              size="sm"
              onClick={() => setAnnual(false)}
            >
              Monthly
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 pt-12 md:grid-cols-2 md:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col ${
                plan.popular
                  ? "border-primary shadow-md dark:border-primary"
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Popular
                </div>
              )}
              <CardHeader className="flex-1">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  {plan.price}
                  <span className="ml-1 text-sm font-medium text-muted-foreground">
                    {plan.duration}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button className="w-full">{plan.cta}</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
