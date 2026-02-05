@REM Maven Wrapper Script - Simplified version for workshop
@REM This wrapper will use the system Maven if available

@echo off
where mvn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Maven is not installed. Please install Maven 3.6+ or use Docker.
    echo Download from: https://maven.apache.org/download.cgi
    exit /b 1
)

mvn %*
