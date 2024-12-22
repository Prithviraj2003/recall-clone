@echo off
REM Set environment variables
set MTX_PROTOCOLS=tcp
set MTX_WEBRTCADDITIONALHOSTS=192.168.x.x

REM Run Docker container
docker run -d --rm ^
  -e MTX_PROTOCOLS=%MTX_PROTOCOLS% ^
  -e MTX_WEBRTCADDITIONALHOSTS=%MTX_WEBRTCADDITIONALHOSTS% ^
  -p 8554:8554 ^
  -p 1935:1935 ^
  -p 9889:8889 ^
  -p 8890:8890/udp ^
  -p 8189:8189/udp ^
  bluenviron/mediamtx

REM Inform the user
echo Docker container started with specified configuration.
pause
