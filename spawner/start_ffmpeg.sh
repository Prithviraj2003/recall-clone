#!/bin/bash

# Setting the input file path
INPUT="rtsp://localhost:8554/mystream"

# Checking if OUTPUT_DIR is provided as an environment variable
if [ -z "$OUTPUT_DIR" ]; then
    # If not provided, use the default directory
    OUTPUT_DIR="/Recordings"
fi
if [ -z "$DURATION" ]; then
    # If not provided, use the default directory
    DURATION=60
fi

# Setting the output file path
OUTPUT="$OUTPUT_DIR/output.mp4"

# Displaying the input and output paths
echo "Input: $INPUT"
echo "Output Directory: $OUTPUT_DIR"
echo "Output File: $OUTPUT"

# Running the ffmpeg command with a 20-second duration
ffmpeg -rtsp_transport tcp -i "$INPUT" -c copy -t $DURATION "$OUTPUT"

# Inform the user the process is complete
echo "Conversion complete. Output saved to $OUTPUT."
