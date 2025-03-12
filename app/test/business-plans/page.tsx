import { ProtectedRoute } from '@/components/ProtectedRoute'
import { BusinessPlanTest } from '@/components/BusinessPlanTest'

export default function TestPage() {
  return (
    <ProtectedRoute>
      <div className="container max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Business Plan Test</h1>
        <BusinessPlanTest />
      </div>
    </ProtectedRoute>
  )
} 