#!/bin/bash

# Set environment variables
MTX_PROTOCOLS="tcp"
MTX_WEBRTCADDITIONALHOSTS="192.168.x.x"

# Run Docker container
docker run -d --rm \
  --name mediamtx_container \
  -e MTX_PROTOCOLS=$MTX_PROTOCOLS \
  -e MTX_WEBRTCADDITIONALHOSTS=$MTX_WEBRTCADDITIONALHOSTS \
  -p 8554:8554 \
  -p 1935:1935 \
  -p 9889:8889 \
  -p 9999:8888 \
  -p 8890:8890/udp \
  -p 8189:8189/udp \
  bluenviron/mediamtx
