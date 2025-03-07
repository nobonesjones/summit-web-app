"use client";

import React, { Suspense } from "react";
import PageWrapper from "@/components/wrapper/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import Link from "next/link";

// Component that uses useSearchParams
function VerificationContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification link to <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Click the link in the email to verify your account and complete the sign-up process.
          If you don't see the email, check your spam folder.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => router.push("/sign-in")}
        >
          Back to Sign In
        </Button>
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Didn't receive an email? </span>
          <Link href="/sign-up" className="text-blue-600 hover:underline dark:text-blue-400">
            Try again
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

// Loading fallback
function VerificationLoading() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          Loading verification details...
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">
          Please wait while we load your verification information.
        </p>
      </CardContent>
    </Card>
  );
}

export default function VerificationPage() {
  return (
    <PageWrapper>
      <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
        <div className="w-full max-w-md space-y-8 px-4">
          <Suspense fallback={<VerificationLoading />}>
            <VerificationContent />
          </Suspense>
        </div>
      </div>
    </PageWrapper>
  );
} 