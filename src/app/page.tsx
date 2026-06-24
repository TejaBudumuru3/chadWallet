import { Navbar } from '@/components/layout/Navbar'
import { TokenBanner } from '@/components/landing/TokenBanner'
import { HomeClient } from '@/components/landing/HomeClient'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Top Token Banner */}
      <TokenBanner />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Client-side Hero and Content */}
      <HomeClient />
    </div>
  )
}
