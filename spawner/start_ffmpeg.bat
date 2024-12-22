@echo off
REM Setting the input file path
set INPUT=rtsp://localhost:8554/mystream

REM Checking if OUTPUT_DIR is provided as an environment variable
if "%OUTPUT_DIR%"=="" (
    REM If not provided, use the default directory
    set OUTPUT_DIR=C:\\Users\\rindu\\Desktop\\ffmpeg\\temp
)
if "%DURATION%"=="" (
    REM If not provided, use the default directory
    set DURATION=40
)

REM Setting the output file path
set OUTPUT="%OUTPUT_DIR%\output.mp4"

REM Display the input and output paths
echo Input: %INPUT%
echo Output Directory: %OUTPUT_DIR%

REM Running the ffmpeg command with a 20-second duration
ffmpeg -rtsp_transport tcp -i %INPUT% -c copy -t %DURATION% %OUTPUT%

REM Inform the user the process is complete
echo Conversion complete. Output saved to %OUTPUT%.
pause
