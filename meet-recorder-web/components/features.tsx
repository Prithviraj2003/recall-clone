import { Bot, FileText, Video, Wand2 } from 'lucide-react'

export function Features() {
  return (
    <div className="container py-24">
      <div className="grid gap-12 lg:grid-cols-2 justify-items-center">
        <div className="grid gap-4 md:gap-10">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-2">
              <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Automated Recording</h3>
            <p className="text-muted-foreground">
              Our bot joins your meetings automatically and records them with crystal clear quality.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 p-2">
              <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold">Smart Transcription</h3>
            <p className="text-muted-foreground">
              Get accurate transcripts of your meetings with speaker identification and timestamps.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 p-2">
              <Video className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold">Secure Storage</h3>
            <p className="text-muted-foreground">
              All recordings are securely stored in S3 with enterprise-grade encryption.
            </p>
          </div>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900 dark:to-orange-900 p-2">
              <Wand2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="text-xl font-bold">AI Summary</h3>
            <p className="text-muted-foreground">
              Get AI-powered summaries of your meetings with key points and action items.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

