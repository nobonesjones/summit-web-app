'use client'

import PageWrapper from "@/components/wrapper/page-wrapper"
import { createClient } from "@/lib/supabase/client"
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
    const [isLoading, setIsLoading] = useState(true)
    const supabase = createClient()
    
    // Centralized function to handle redirects after authentication
    const redirectAfterAuth = (redirectPath?: string) => {
        // Prevent multiple redirects
        if (isRedirecting) return
        setIsRedirecting(true)
        
        // Get the redirect path from URL params or use dashboard as default
        const finalPath = redirectPath || searchParams.get("redirectTo") || "/dashboard"
        
        console.log(`Redirecting to: ${finalPath}`)
        
        // Use router for navigation
        router.push(finalPath)
    }
    
    useEffect(() => {
        setIsClient(true)
        
        // Check if user is already signed in
        const checkUser = async () => {
            try {
                setIsLoading(true)
                const { data, error } = await supabase.auth.getSession()
                
                if (error) {
                    console.error('Error checking session:', error)
                    return
                }
                
                if (data.session) {
                    console.log('User already signed in:', data.session.user.email)
                    redirectAfterAuth()
                }
            } catch (err) {
                console.error('Error in auth check:', err)
            } finally {
                setIsLoading(false)
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
                    title: "Signed in successfully",
                    description: `Welcome back, ${session.user.email}!`
                })
                
                // Use the centralized redirect function
                redirectAfterAuth()
            }
        })
        
        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])
    
    // Handle form submission
    const handleSignIn = async (formData: SignInFormData) => {
        try {
            const { email, password } = formData
            
            if (!email || !password) {
                toast({
                    title: "Missing credentials",
                    description: "Please provide both email and password",
                    variant: "destructive"
                })
                return
            }
            
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (error) {
                console.error('Sign in error:', error)
                toast({
                    title: "Sign in failed",
                    description: error.message,
                    variant: "destructive"
                })
                return
            }
            
            if (data.user) {
                console.log('User signed in successfully:', data.user.email)
                toast({
                    title: "Signed in successfully",
                    description: `Welcome back, ${data.user.email}!`
                })
                redirectAfterAuth()
            }
        } catch (err) {
            console.error('Error during sign in:', err)
            toast({
                title: "Sign in error",
                description: "An unexpected error occurred. Please try again.",
                variant: "destructive"
            })
        }
    }
    
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