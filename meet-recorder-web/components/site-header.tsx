import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/50 dark:bg-gray-950/50 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-gray-950/50">
      <div className="container flex h-14 items-center px-5">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">MeetRecorder</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/docs" className="transition-colors hover:text-foreground/80">
            Docs
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-foreground/80">
            Pricing
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              Try Demo
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

