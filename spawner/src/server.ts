// src/api/server.ts
import express from "express";
import main from "./index";
import cors from "cors";
import { uploadVideoToS3 } from "./uploadFile";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["POST", "GET"],
  })
);

interface RecordingRequest {
  meetLink: string;
  duration: number; // in minutes
  botname: string;
  caption: boolean;
}

interface RecordingStatus {
  id: string;
  status:
    | "uploading"
    | "recording"
    | "recorded"
    | "failed"
    | "completed"
    | "starting";
  startTime: Date;
  meetLink: string;
  outputPath?: string;
  error?: string;
}

const recordings = new Map<string, RecordingStatus>();
let isBusy = false;
app.post("/api/start-recording", async (req: any, res: any) => {
  try {
    const { meetLink, duration, botname, caption }: RecordingRequest = req.body;
    if (isBusy) {
      return res
        .status(400)
        .json({ error: "Another recording is in progress" });
    }
    const recordingId = Date.now().toString();
    isBusy = true;
    // Store initial status
    recordings.set(recordingId, {
      id: recordingId,
      status: "starting",
      startTime: new Date(),
      meetLink,
    });

    // Start recording process asynchronously

    main(meetLink, duration, botname, recordingId, caption);

    res.json({
      recordingId,
      status: "starting",
      message: "Recording started successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to start recording",
      details: error.message,
    });
  }
});

app.get("/api/recording-status/:id", (req: any, res: any) => {
  const recordingStatus = recordings.get(req.params.id);
  const refactoredStatus = {
    ...recordingStatus,
    outputPath: null,
  };
  if (!recordingStatus) {
    return res.status(404).json({ error: "Recording not found" });
  }
  res.json(recordingStatus.status==="completed"?recordingStatus:refactoredStatus);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const UpdateStatus = async (
  id: string,
  status:
    | "recording"
    | "completed"
    | "failed"
    | "recorded"
    | "uploading"
    | "starting"
) => {
  console.log("Updating status", id, status);
  if (status === "completed" || status === "failed") {
    isBusy = false;
  }

  if (status === "recorded") {
    console.log("Recording completed");
    recordings.set(id, {
      ...recordings.get(id)!,
      status: "uploading",
    });
    const S3URL = await uploadVideoToS3(
      recordings.get(id)!.outputPath!,
      `${id}.mp4`
    );
    console.log("S3 URL", S3URL);
    isBusy = false;
    if (S3URL !== "Upload failed") {
      recordings.set(id, {
        ...recordings.get(id)!,
        status: "completed",
        outputPath: S3URL,
      });
    } else {
      recordings.set(id, {
        ...recordings.get(id)!,
        status: "failed",
        error: "Failed to upload to S3",
      });
    }
  } else {
    recordings.set(id, {
      ...recordings.get(id)!,
      status,
    });
  }
};
export const UpdateStatusWithOutputDIR = (
  id: string,
  status: "recording" | "completed" | "failed",
  output: string
) => {
  console.log("Updating status", id, status);
  if (status === "completed" || status === "failed") {
    isBusy = false;
  }
  recordings.set(id, {
    ...recordings.get(id)!,
    status,
    outputPath: output,
  });
};
