'use server'

import { revalidatePath } from 'next/cache'

export async function recordMeeting(formData: FormData) {
  const meetingUrl = formData.get('meetingUrl')
  const botName = formData.get('botName')
  const recordingTime = formData.get('recordingTime')
  const wantTranscript = formData.get('wantTranscript')

  // Here you would normally call your actual API
  // This is a mock response for demonstration purposes
  const mockResponse = {
    id: `rec_${Math.random().toString(36).substr(2, 9)}`,
    status: "recording",
    meeting_url: meetingUrl,
    bot_name: botName,
    recording_time: `${recordingTime} minutes`,
    transcript: wantTranscript === 'yes',
    created_at: new Date().toISOString(),
    rtsp_url: "http://localhost:9999/mystream" // Replace with your actual local RTSP stream URL
  }

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  revalidatePath('/demo')
  return mockResponse
}

export async function checkRecordingStatus(recordingId: string) {
  // This is a mock implementation. Replace with actual API call in production.
  await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay

  // Randomly decide if the recording is still processing or saved
  const isProcessing = Math.random() > 0.5

  if (isProcessing) {
    return { status: 'processing' }
  } else {
    return {
      status: 'saved',
      recording_link: `https://meetrecorder.com/recordings/${recordingId}`
    }
  }
}

