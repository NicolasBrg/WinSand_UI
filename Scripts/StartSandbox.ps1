###############################################################################
#                               WinSand*UI v1.1                               #
#                         Windows Sandbox Init Script                         #
#                                                                             #
#   Author: NicolasBrg                                                        #
#   License: Everyone can use and modify it for non-commercial purposes       #
#            unless explicitly authorized by the owner. Source citation is    #
#            mandatory.                                                       #
#                                                                             #
#   Disclaimer: This script is provided as-is without any warranty. Use at    #
#               your own risk. The author holds no responsibility for any     #
#               damages or loss caused by the use of this script.             #
#                                                                             #
#   For more information and updates, visit:                                  #
#   https://github.com/NicolasBrg/WinSand_UI                                  #
###############################################################################

# Object declaration
$outputObject = @{}
$Config = @{}
$NeedToSaveConfig = $false
$ConfigFilePath = "./Config/SecureEnvironnement.config"

# Loading configuration
if (Test-Path $ConfigFilePath) {
    $Config = Get-Content $ConfigFilePath | ConvertFrom-Json
} 

# Check if API Key for VirusTotal is available
if ($null -eq $Config.VirusTotal) {
    [void][Reflection.Assembly]::LoadWithPartialName('Microsoft.VisualBasic')

    $title = 'Virus Total'
    $msg   = "Please enter the API key:"

    $text = [Microsoft.VisualBasic.Interaction]::InputBox($msg, $title)
    if($null -eq $text) {
        Write-Error "Unable to get API Key."
        exit 1
    }

    $Config.VirusTotal = $text
    $NeedToSaveConfig = $true
}

# Save the configuration file if fields have been updated.
if($NeedToSaveConfig -eq $true) {
    $Config | ConvertTo-Json -Depth 5 | Out-File -FilePath $ConfigFilePath -Encoding UTF8
}

# Archive selection
Add-Type -AssemblyName System.Windows.Forms

$fileDialog = New-Object System.Windows.Forms.OpenFileDialog
$fileDialog.Filter = "File ZIP, RAR, TAR (*.zip, *.rar, *.tar, *.7z)|*.zip;*.rar;*.tar;*.7z"
$fileDialog.Title = "Select ZIP, RAR or TAR file"
$result = $fileDialog.ShowDialog()

if ($result -ne [System.Windows.Forms.DialogResult]::OK) {
    Write-Host "No files have been selected."
    exit 1
}

# The hash is calculated 
$HashResult = Get-FileHash $fileDialog.FileName

$outputObject.HashResult = $HashResult.Hash
$outputObject.HashAlgorithm = $HashResult.Algorithm
$outputObject.HashPath = $HashResult.Path

# Starting VirusTotal Script
$VirusTotal = $Config.VirusTotal
$VirusTotalOutput = .\Scripts\VirusTotalScan.ps1 $VirusTotal $outputObject.HashResult

if($VirusTotalOutput -eq $false) {
    if ([System.Windows.Forms.MessageBox]::Show("The file doesn't seem to have been scanned on VirusTotal, are you sure you want to continue anyway?", 'Confirmation', 'YesNo', 'Question') -eq 'No') {
        Write-Host "The user did not wish to continue, as the file did not have an available scan."

        if ([System.Windows.Forms.MessageBox]::Show('Would you like to open the site to run an analysis?', 'Confirmation', 'YesNo', 'Question') -eq 'Yes') {
            Start-Process "https://www.virustotal.com/gui/home/upload"
        }

        exit 1
    }
}

$archivePath = ".\Desktop\Archives"

if (-not (Test-Path $archivePath)) {
    New-Item -ItemType Directory -Path $archivePath -Force
}

Copy-Item -Path $fileDialog.FileName -Destination $archivePath -Force

# Display result
Write-Host "Result:"
Write-Output $outputObject

# WSB Configuration Selection
$WSB = New-Object System.Windows.Forms.OpenFileDialog
$WSB.Filter = "Files WSB (*.wsb)|*.wsb"
$WSB.Title = "Select a WSB file"
$resultWSB = $WSB.ShowDialog()

if ($resultWSB -ne [System.Windows.Forms.DialogResult]::OK) {
    Write-Host "No files selected."
    exit 1
}

# Starting Sandbox
&$WSB.FileName