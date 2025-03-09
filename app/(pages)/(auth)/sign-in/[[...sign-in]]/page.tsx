'use client'

import PageWrapper from "@/components/wrapper/page-wrapper"
import { supabase } from "@/lib/supabase/client"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

// Define the form data interface
interface SignInFormData {
    email?: string;
    password?: string;
    [key: string]: any;
}

export default function SignInPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isClient, setIsClient] = useState(false)
    const [isRedirecting, setIsRedirecting] = useState(false)
    
    // Centralized function to handle redirects after authentication
    const redirectAfterAuth = (redirectPath?: string) => {
        // Prevent multiple redirects
        if (isRedirecting) return
        setIsRedirecting(true)
        
        // Get the redirect path from URL params or use dashboard as default
        const finalPath = redirectPath || searchParams.get("redirectTo") || "/dashboard"
        
        console.log(`Redirecting to: ${finalPath}`)
        
        // Use direct browser navigation for more immediate effect
        window.location.href = finalPath
    }
    
    useEffect(() => {
        setIsClient(true)
        
        // Check if user is already signed in
        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getSession()
                
                if (error) {
                    console.error('Error checking session:', error)
                    return
                }
                
                if (data.session) {
                    console.log('User already signed in, redirecting to dashboard')
                    // User is signed in, redirect to the intended page or dashboard
                    redirectAfterAuth()
                }
            } catch (err) {
                console.error('Exception checking user session:', err)
            }
        }
        
        checkUser()
    }, [searchParams])
    
    // Handle auth state change to redirect immediately after successful sign-in
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            console.log(`Auth state changed: ${event}`)
            
            if (event === 'SIGNED_IN' && session) {
                // User has signed in, redirect to dashboard immediately
                toast({
                    title: "Sign in successful",
                    description: "Redirecting to dashboard...",
                })
                
                // Use the centralized redirect function
                redirectAfterAuth()
            }
        })
        
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])
    
    if (!isClient) return null
    
    return (
        <PageWrapper>
            <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
                <div className="w-full max-w-md space-y-8 px-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Sign In</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign in to your account to continue
                        </p>
                    </div>
                    
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            theme: ThemeSupa,
                            variables: {
                                default: {
                                    colors: {
                                        brand: '#2563eb',
                                        brandAccent: '#1d4ed8',
                                    },
                                    radii: {
                                        borderRadiusButton: '0.5rem',
                                        inputBorderRadius: '0.5rem',
                                    }
                                }
                            },
                            style: {
                                button: {
                                    fontWeight: 'bold',
                                }
                            }
                        }}
                        providers={["google"]}
                        magicLink={true}
                        redirectTo={`${window.location.origin}/dashboard`}
                    />
                </div>
            </div>
        </PageWrapper>
    )
}