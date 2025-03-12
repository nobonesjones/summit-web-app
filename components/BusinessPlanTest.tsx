'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useBusinessPlans } from '@/lib/hooks/useBusinessPlans'
import { useAuth } from '@/lib/hooks/useAuth'

export function BusinessPlanTest() {
  const { user } = useAuth()
  const { businessPlans, isLoading, error, createPlan, refreshBusinessPlans } = useBusinessPlans()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('')
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('Creating business plan...')
    
    try {
      const newPlan = await createPlan({
        name,
        description
      })
      
      setStatus(`Success! Created plan with ID: ${newPlan?.id}`)
      setName('')
      setDescription('')
      refreshBusinessPlans()
    } catch (err) {
      console.error('Error creating plan:', err)
      setStatus(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Business Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="Business plan name"
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Description"
                rows={3}
              />
            </div>
            
            <Button type="submit" className={!name ? 'opacity-50' : ''}>Create Plan</Button>
            
            {status && (
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                {status}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Business Plans</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshBusinessPlans}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">Error: {error.toString()}</div>
          ) : businessPlans?.length === 0 ? (
            <div>No business plans found</div>
          ) : (
            <div className="space-y-4">
              {businessPlans?.map(plan => (
                <div key={plan.id} className="border p-4 rounded">
                  <h3 className="font-medium">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-gray-600 mt-1">{plan.description}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    ID: {plan.id}<br />
                    Created: {new Date(plan.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Debug Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs font-mono whitespace-pre-wrap">
            <div>User: {user ? JSON.stringify(user, null, 2) : 'Not logged in'}</div>
            <div className="mt-2">BusinessPlans: {JSON.stringify(businessPlans, null, 2)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 