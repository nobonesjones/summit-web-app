import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Debug Console - Summit',
  description: 'Debug and test business plan functionality',
}

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 overflow-y-auto">
      {children}
    </div>
  )
} 