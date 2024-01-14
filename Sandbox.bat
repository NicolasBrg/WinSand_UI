@echo off
setlocal enabledelayedexpansion
set "repertoire=%cd%\Desktop\Archives"
echo %repertoire%
type .\Config\Banner.txt
echo:
:menu
for /f %%i in ('dir /a-d /b "%repertoire%" ^| find /c /v ""') do (
    set "archive_number=%%i"
)

title Windows Sandbox - Management
echo Please choose a number :
echo 1. Start Sandbox
if %archive_number% GTR 0 (
    echo 2. Clear Archive Folder [%archive_number%]
)
echo 3. Exit

set /p choix="> "
echo:

if "%choix%"=="1" (
    powershell ./Scripts/StartSandbox.ps1
) else if "%choix%"=="2" (
    del /q "%repertoire%\*"
    echo %archive_number% have been removed.
    echo:
    goto :menu
) else if "%choix%"=="3" (
    goto :end
) else (
    echo Invalid choice. Please choose a number between 1 and 3.
)

echo:
goto :menu
:end
echo End