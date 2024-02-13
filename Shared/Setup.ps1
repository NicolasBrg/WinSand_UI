###############################################################################
#                               WinSand*UI v1.1                               #
#                       Windows Sandbox Setup Script                          #
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

$host.ui.RawUI.WindowTitle = "Data initialization"

$cheminDossierArchives = "C:\Users\WDAGUtilityAccount\Desktop\Data\Archives"
$cheminDossierExtraction = "C:\Users\WDAGUtilityAccount\Desktop\"

if (-not (Test-Path $cheminDossierExtraction)) {
    New-Item -ItemType Directory -Path $cheminDossierExtraction | Out-Null
}

Get-ChildItem -Path $cheminDossierArchives -Filter *.zip | ForEach-Object {
    $cheminArchive = $_.FullName

    $nomDossierExtraction = Join-Path $cheminDossierExtraction $_.BaseName

    if (-not (Test-Path $nomDossierExtraction)) {
        New-Item -ItemType Directory -Path $nomDossierExtraction | Out-Null
    }

    Expand-Archive -Path $cheminArchive -DestinationPath $nomDossierExtraction -Force

    explorer.exe $nomDossierExtraction
}

Write-Host "Extraction complete."

Start-Sleep -Seconds 3