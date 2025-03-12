'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useBusinessPlans } from '@/lib/hooks/useBusinessPlans'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/components/ui/use-toast'

export function BusinessPlanDebugger() {
  const { user } = useAuth()
  const {
    businessPlans,
    isLoading,
    error,
    createPlan,
    refreshBusinessPlans,
    isRefreshing
  } = useBusinessPlans({
    orderBy: 'created_at',
    orderDirection: 'desc',
    autoFetch: true
  })

  const [formData, setFormData] = useState({
    title: '',
    business_idea: '',
    location: 'Dubai',
    category: 'Technology'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    try {
      // Create a basic business plan structure
      const newPlan = await createPlan({
        name: formData.title,
        business_idea: formData.business_idea,
        location: formData.location,
        is_public: false,
        sections: {
          executiveSummary: {
            title: 'Executive Summary',
            content: formData.business_idea,
            order: 1
          },
          businessDescription: {
            title: 'Business Description',
            content: 'Debug plan - business description',
            order: 2
          },
          marketAnalysis: {
            title: 'Market Analysis',
            content: 'Debug plan - market analysis',
            order: 3
          },
          competitiveAnalysis: {
            title: 'Competitive Analysis',
            content: 'Debug plan - competitive analysis',
            order: 4
          },
          productsAndServices: {
            title: 'Products and Services',
            content: 'Debug plan - products and services',
            order: 5
          },
          marketingStrategy: {
            title: 'Marketing Strategy',
            content: 'Debug plan - marketing strategy',
            order: 6
          },
          financialProjections: {
            title: 'Financial Projections',
            content: 'Debug plan - financial projections',
            order: 7
          },
          implementationTimeline: {
            title: 'Implementation Timeline',
            content: 'Debug plan - implementation timeline',
            order: 8
          },
          riskAssessment: {
            title: 'Risk Assessment',
            content: 'Debug plan - risk assessment',
            order: 9
          }
        },
        details: {
          mission: 'Debug plan mission',
          vision: 'Debug plan vision',
          objectives: ['Test objective 1', 'Test objective 2'],
          targetMarket: {
            demographics: 'Test demographics',
            psychographics: 'Test psychographics',
            location: formData.location,
            size: 'Test market size'
          }
        },
        metadata: {
          industry: 'Technology',
          stage: 'idea',
          teamSize: 1,
          location: formData.location,
          fundingStatus: 'bootstrapped',
          lastResearchUpdate: new Date().toISOString()
        }
      })

      // Reset form after successful creation
      setFormData({
        title: '',
        business_idea: '',
        location: 'Dubai',
        category: 'Technology'
      })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create business plan')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <Alert className="max-w-2xl mx-auto my-4">
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>
          Please sign in to use the business plan debugger.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Business Plan Debugger</CardTitle>
          <CardDescription>
            Test business plan creation and management functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Plan Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter plan title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_idea">Business Idea</Label>
              <Textarea
                id="business_idea"
                value={formData.business_idea}
                onChange={(e) => setFormData(prev => ({ ...prev, business_idea: e.target.value }))}
                placeholder="Describe your business idea"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Business location"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Business category"
                required
              />
            </div>

            {formError && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className={isSubmitting ? 'opacity-50' : ''}>
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Creating Plan...
                </>
              ) : (
                'Create Test Plan'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Existing Business Plans</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshBusinessPlans()}
              className={isRefreshing ? 'opacity-50' : ''}
            >
              {isRefreshing ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh List'
              )}
            </Button>
          </div>
          <CardDescription>
            View and manage your existing business plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-[250px] mb-2" />
                    <Skeleton className="h-4 w-[200px]" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : businessPlans.length === 0 ? (
            <Alert>
              <AlertTitle>No Business Plans</AlertTitle>
              <AlertDescription>
                You haven't created any business plans yet.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {businessPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{plan.title}</h3>
                      <Badge variant={plan.status === 'completed' ? 'default' : 'secondary'}>
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{plan.business_idea}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{plan.location}</span>
                      <span>•</span>
                      <span>{plan.category}</span>
                      <span>•</span>
                      <span>Version {plan.version}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 