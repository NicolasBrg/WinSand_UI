@echo off
setlocal enabledelayedexpansion
type .\Config\Banner.txt
echo:
:menu
title Windows Sandbox Configuration Assistant
echo Please choose a number :
echo 1. Host local server (Recommended)
echo 2. Use local file
echo 3. Exit

set /p choix="> "
echo:

if "%choix%"=="1" (
    powershell ./Scripts/CreateConfigurationWithServer.ps1
) else if "%choix%"=="2" (
    powershell ./Scripts/CreateConfigurationLocalFile.ps1
) else if "%choix%"=="3" (
    goto :end
) else (
    echo Invalid choice. Please choose a number between 1 and 3.
)

echo:
goto :menu
:end
echo End