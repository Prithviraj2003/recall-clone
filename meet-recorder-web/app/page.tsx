import { Button } from "@/components/ui/button"
import { CodeDemo } from "@/components/code-demo"
import { Features } from "@/components/features"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="relative container grid justify-center gap-6 pb-8 pt-24 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 -z-10" />
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
              Record, Transcribe, and Summarize
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Your Google Meet Meetings
              </span>
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Join your meetings automatically, get high-quality recordings, smart transcriptions, and AI-powered summaries.
              All with a simple API.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/demo">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg">
                View Documentation
              </Button>
            </Link>
          </div>
          <div className="mx-auto w-full max-w-3xl pt-8">
            <CodeDemo />
          </div>
        </section>
        <Features />
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with ❤️ by the MeetRecorder team. © 2024 MeetRecorder. All rights reserved.
          </p>
          {/* <div className="flex items-center space-x-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
          </div> */}
        </div>
      </footer>
    </div>
  )
}

