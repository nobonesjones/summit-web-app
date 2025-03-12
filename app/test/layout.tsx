import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Console - Summit',
  description: 'Test and debug application functionality'
}

export default function TestLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {children}
    </div>
  )
} 