export function CodeDemo() {
  return (
    <div className="rounded-lg bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-6 text-white shadow-xl border border-gray-800">
      <pre className="font-mono text-sm">
        <code>{`# Record a Google Meet
curl -X POST https://api.meetrecorder.com/v1/record \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url": "https://meet.google.com/abc-defg-hij"}'

# Response
{
  "id": "rec_123xyz",
  "status": "recording",
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "created_at": "2024-01-01T00:00:00Z"
}`}</code>
      </pre>
    </div>
  )
}

