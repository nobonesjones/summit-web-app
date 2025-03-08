import { Button } from '@/components/ui/button';
import NavBar from '@/components/wrapper/navbar';
import { api } from '@/convex/_generated/api';
import { getAuthToken } from '@/lib/auth';
import { fetchQuery } from 'convex/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function SuccessPage() {
  const token = await getAuthToken();
  
  // If no token is available, redirect to sign-in
  if (!token) {
    redirect('/sign-in?redirectTo=/success');
  }

  // Fetch subscription status
  let hasActiveSubscription = false;
  try {
    const result = await fetchQuery(api.subscriptions.getUserSubscriptionStatus, {}, {
      token,
    });
    hasActiveSubscription = result.hasActiveSubscription;
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    // Continue with hasActiveSubscription as false
  }

  return (
    <main className="flex min-w-screen flex-col items-center justify-between">
      <NavBar />
      {hasActiveSubscription ? (
        <h1 className="mt-[35vh] mb-3 scroll-m-20 text-5xl font-semibold tracking-tight transition-colors first:mt-0">
          Subscription Successful 🎉
        </h1>
      ) : (
        <h1 className="mt-[35vh] mb-3 scroll-m-20 text-5xl font-semibold tracking-tight transition-colors first:mt-0">
          You Can Subscribe Now
        </h1>
      )}
      <Link href={hasActiveSubscription ? "/dashboard" : "/pricing"} className='mt-4'>
        <Button>{hasActiveSubscription ? "Access Dashboard" : "View Pricing"}</Button>
      </Link>
    </main>
  )
}
