#!/bin/bash

# Setting the input file path
INPUT="rtsp://localhost:8554/mystream"

# Checking if OUTPUT_DIR is provided as an environment variable
if [ -z "$OUTPUT_DIR" ]; then
    # If not provided, use the default directory
    OUTPUT_DIR="/Recordings/output.mp4"
fi

# Checking if DURATION is provided as an environment variable
if [ -z "$DURATION" ]; then
    # If not provided, set a default duration
    DURATION=40
fi

# Displaying the input and output paths
echo "Input: $INPUT"
echo "Output Directory: $OUTPUT_DIR"
echo "Duration: $DURATION"

# Running the ffmpeg command
ffmpeg -rtsp_transport tcp -i "$INPUT" -c copy -t "$DURATION" "$OUTPUT_DIR"

# Inform the user the process is complete
echo "Conversion complete. Output saved to $OUTPUT_DIR."
