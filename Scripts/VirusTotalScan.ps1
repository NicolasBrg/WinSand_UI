###############################################################################
#                               WinSand*UI v1.1                               #
#                    Windows Sandbox VirusTotal Script                        #
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

param(
    [string]$apiKey,
    [string]$fileHash
)

# Check if apiKey and fileHash are available
if (-not $apiKey -or -not $fileHash) {
    Write-Host "Error : Missing apiKey and/or file hash!"
    Write-Output $false
    exit 1
}

# Preparing request header with apiKey
$headers = @{
    "x-apikey" = $apiKey
}

$url = "https://www.virustotal.com/api/v3/files/$fileHash"

try {
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    $resultat = $response.data
} catch {
    Write-Host "No searches have been conducted on this hash previously on this platform."
    Write-Output $false
    exit 1
}

# Check if the analysis was successfully done.
if ($resultat.id) {
    Write-Host "Analysis ID : $($resultat.id)"
    Write-Host "Link : https://www.virustotal.com/gui/file/$($resultat.id)/detection"

    Write-Output $true
    exit 0
} else {
    Write-Host "No results available for this file hash."
    Write-Output $false
    exit 1
}