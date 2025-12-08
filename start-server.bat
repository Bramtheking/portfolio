@echo off
echo ========================================
echo Starting Local Development Server
echo ========================================
echo.

REM Get the local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Server starting on port 5500...
echo.
echo ========================================
echo Access URLs:
echo ========================================
echo Local:    http://localhost:5500
echo Network:  http://%IP%:5500
echo.
echo Use the Network URL on your Android phone
echo (Make sure phone is on same WiFi)
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

python -m http.server 5500
