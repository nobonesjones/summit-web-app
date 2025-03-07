"use client";

import PageWrapper from "@/components/wrapper/page-wrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function UserProfilePage() {
  const { user, isSignedIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in?redirectTo=/user-profile");
      return;
    }

    if (user) {
      setEmail(user.email || "");
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
    }
  }, [user, isSignedIn, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('avatar_url', avatarUrl);
      
      const response = await fetch('/api/auth/profile', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }
      
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!fullName) return '?';
    
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    } else if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    
    // Fallback to email
    return email ? email[0].toUpperCase() : '?';
  };

  return (
    <PageWrapper>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">User Profile</h1>
        
        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your profile picture will be shown across the platform</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-2xl bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-200">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <Input
                type="text"
                placeholder="Avatar URL"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>
          
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed. Contact support if you need to update your email.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
} 