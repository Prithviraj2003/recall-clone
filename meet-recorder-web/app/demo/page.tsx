"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import HLSPlayer from "@/components/video-player";
type RecordingStatus =
  | "uploading"
  | "recording"
  | "recorded"
  | "failed"
  | "completed"
  | "starting";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [rtspUrl, setRtspUrl] = useState("");
  const [recordingId, setRecordingId] = useState("");
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus | "">(
    ""
  );
  const [recordingLink, setRecordingLink] = useState("");

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (
      recordingId &&
      ["uploading", "recording", "starting"].includes(recordingStatus)
    ) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/recording-status/${recordingId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch recording status");
          }
          const data = await response.json();
          setRecordingStatus(data.status);
          if (data.status === "completed") {
            setRecordingLink(data.outputPath);
            clearInterval(intervalId);
          } else if (data.status === "failed") {
            clearInterval(intervalId);
            toast({
              title: "Recording failed",
              description: "There was an error during the recording process.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error checking recording status:", error);
          clearInterval(intervalId);
          toast({
            title: "Error",
            description: "Failed to check recording status.",
            variant: "destructive",
          });
        }
      }, 1000); // Check every 5 seconds
    } else {
      console.log(recordingId, recordingStatus);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [recordingId, recordingStatus]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/start-recording`,
        {
          method: "POST",
          body: JSON.stringify({
            meetLink: formData.get("meetingUrl"),
            botName: formData.get("botName"),
            duration: formData.get("recordingTime"),
            caption: formData.get("wantTranscript") === "yes",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to start recording");
      }

      const data = await response.json();
      setApiResponse(data);
      setRtspUrl(`${process.env.NEXT_PUBLIC_API_URL}/mystream`);
      setRecordingId(data.recordingId);
      setRecordingStatus(data.status);
      toast({
        title: "Meeting recording started",
        description: "Your meeting is now being recorded.",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "An error occurred while starting the recording.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="container max-w-2xl py-24">
        <h1 className="text-3xl font-bold mb-8">Try MeetRecorder</h1>
        <form onSubmit={onSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="meetingUrl">Meeting URL</Label>
            <Input
              id="meetingUrl"
              name="meetingUrl"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="botName">Bot Joining Name</Label>
            <Input
              id="botName"
              name="botName"
              placeholder="MeetRecorder Bot"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recordingTime">
              Recording Time (max 50 seconds)
            </Label>
            <Input
              id="recordingTime"
              name="recordingTime"
              type="number"
              min="1"
              max="50"
              placeholder="20"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Want Transcript?</Label>
            <RadioGroup defaultValue="yes" name="wantTranscript">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" disabled={isLoading || recordingStatus !== ""}>
            {isLoading ? "Starting..." : "Start Recording"}
          </Button>
        </form>
        {apiResponse && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">API Response:</h2>
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}

        {recordingStatus === "recording" && (
          <div className="mt-4">
            <HLSPlayer
              src={`${rtspUrl}/index.m3u8`}
              autoPlay={true}
              controls={true}
              className="aspect-video bg-black rounded-lg"
              onPlay={() => console.log("Video started playing")}
              onPause={() => console.log("Video paused")}
            />
          </div>
        )}
        {recordingStatus && (
          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Recording Status:</h2>
            <p>{recordingStatus}</p>
            {recordingLink && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Recording Link:</h3>
                <Button onClick={() => window.open(recordingLink, "_blank")}>
                  Open Recording
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
