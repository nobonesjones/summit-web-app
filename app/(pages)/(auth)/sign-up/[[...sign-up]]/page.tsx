"use client"

import PageWrapper from "@/components/wrapper/page-wrapper"
import { supabase } from "@/lib/supabase/client"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignUpPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isClient, setIsClient] = useState(false)
    
    useEffect(() => {
        setIsClient(true)
        
        // Check if user is already signed in
        const checkUser = async () => {
            const { data } = await supabase.auth.getSession()
            if (data.session) {
                // User is signed in, redirect to the intended page or dashboard
                const redirectTo = searchParams.get("redirectTo") || "/dashboard"
                router.push(redirectTo)
            }
        }
        
        checkUser()
    }, [router, searchParams])
    
    if (!isClient) return null
    
    return (
        <PageWrapper>
            <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
                <div className="w-full max-w-md space-y-8 px-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Create an Account</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Sign up to get started with Summit
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
                                        inputText: 'white',
                                    },
                                    radii: {
                                        borderRadiusButton: '0.5rem',
                                        inputBorderRadius: '0.5rem',
                                    }
                                }
                            },
                            style: {
                                input: {
                                    color: 'white',
                                },
                                label: {
                                    color: 'white',
                                },
                                anchor: {
                                    color: 'white',
                                }
                            }
                        }}
                        providers={["google", "github"]}
                        magicLink={true}
                        view="sign_up"
                        redirectTo={`${window.location.origin}/auth/callback`}
                    />
                </div>
            </div>
        </PageWrapper>
    )
}