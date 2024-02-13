###############################################################################
#                               WinSand*UI v1.1                               #
#                       Windows Sandbox Server Script                         #
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

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Web
function OpenFileDialog {
    $fileDialog = New-Object System.Windows.Forms.OpenFileDialog
    $fileDialog.Filter = "Files ZIP, RAR, TAR (*.zip, *.rar, *.tar, *.7z)|*.zip;*.rar;*.tar;*.7z"
    $fileDialog.Title = "Select ZIP, RAR or TAR file"

    $result = $fileDialog.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        $outputText = '{"path": "' + $fileDialog.FileName + '"}'
        $outputText = $outputText -replace '\\', '/'
        Write-Host "Selected File : " $fileDialog.FileName
        return $outputText
    }

    return $null
}

function OpenFolderDialog {
    $folderDialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $folderDialog.Description = "Select folder"

    $result = $folderDialog.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        $outputText = '{"path": "' + $folderDialog.SelectedPath + '"}'
        $outputText = $outputText -replace '\\', '/'
        Write-Host "Selected Folder : " $folderDialog.SelectedPath
        return $outputText
    }

    return $null
}

$host.ui.RawUI.WindowTitle = "Local configuration server for Windows Sandbox"

$repertoireRessources = "$PWD\UI"
$serviceUrl = "http://localhost:12345/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($serviceUrl)

# Start Listener
$listener.Start()

Write-Host "Web server is ready : $serviceUrl"
$ROOT_PATH = [System.Web.HttpUtility]::UrlPathEncode("$PWD")
Start-Process -FilePath msedge -ArgumentList "--new-window $serviceUrl/?root=$ROOT_PATH"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Add CORS header
        $response.Headers.Add("Access-Control-Allow-Origin", "*")
        $response.Headers.Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
        $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")

        $url = $context.Request.Url.LocalPath
        $cheminFichier = Join-Path $repertoireRessources $url.Substring("/".Length)

        # Format console output
        $date = Get-Date -Format "yyyy-MM-dd"
        $time = Get-Date -Format "HH:mm"
        $timestamp = "[{0}] [{1}]" -f $date, $time

        $method = $request.HttpMethod
        $url = $context.Request.Url.LocalPath
        $cheminFichier = Join-Path $repertoireRessources $url.Substring("/".Length)

        Write-Host "$timestamp [WebServer] $method $url"

        # Internal API
        if($url -like "/api") {
            $body = $request.InputStream
            $reader = New-Object System.IO.StreamReader($body, [System.Text.Encoding]::UTF8)
            $postData = $reader.ReadToEnd()
        
            Write-Host "Data received: $postData"
        
            $outputText = $postData
            $needToStop = $false;
        
            switch ($postData) {
                "close" {
                    $needToStop = $true
                }
                "browse" {
                    try {
                        $form = New-Object System.Windows.Forms.Form
                        $form.Icon = [System.Drawing.SystemIcons]::Question
        
                        $form.Add_Load({
                            $form.TopMost = $true
        
                            $outputText = OpenFileDialog
        
                            $form.Close()
        
                            $buffer = [System.Text.Encoding]::UTF8.GetBytes($outputText)
                            $response.ContentLength64 = $buffer.Length
                            $output = $response.OutputStream
                            $output.Write($buffer, 0, $buffer.Length)
                            $output.Close()
                        })
        
                        $form.ShowDialog()
                    } catch {
                        Write-Host "File selection error : $_.Exception.Message"
                    }
                }
                "browseFolder" {
                    try {
                        $outputText = OpenFolderDialog
        
                        $buffer = [System.Text.Encoding]::UTF8.GetBytes($outputText)
                        $response.ContentLength64 = $buffer.Length
                        $output = $response.OutputStream
                        $output.Write($buffer, 0, $buffer.Length)
                        $output.Close()
                    } catch {
                        Write-Host "Folder selection error : $_.Exception.Message"
                    }
                }
                default {
                    $outputText = $postData
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($outputText)
                    $response.ContentLength64 = $buffer.Length
                    $output = $response.OutputStream
                    $output.Write($buffer, 0, $buffer.Length)
                    $output.Close()
                }
            }
        
            if ($needToStop) {
                Write-Host "Server closed."
                
                $outputText = "closed"
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($outputText)
                $response.ContentLength64 = $buffer.Length
                $output = $response.OutputStream
                $output.Write($buffer, 0, $buffer.Length)
                $output.Close()

                $listener.Stop()
                break
            }
        } else {
            # Static web server
            # Define index.html file as root
            if($url -eq "/") {
                $contenuFichier = Get-Content -Path "$cheminFichier/index.html" -Raw
                $response.ContentEncoding = [System.Text.Encoding]::UTF8
                $response.ContentType = [System.Net.Mime.MediaTypeNames]::TextHtml
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($contenuFichier)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } elseif (Test-Path $cheminFichier -PathType Leaf) {
                # Static files server
                $contenuFichier = Get-Content -Path $cheminFichier -Raw -Encoding UTF8
                $response.ContentEncoding = [System.Text.Encoding]::UTF8
                $response.ContentType = [System.Net.Mime.MediaTypeNames]::TextHtml + '; charset=utf-8'
    
                # ContentType selection using extension
                $extension = [System.IO.Path]::GetExtension($cheminFichier).ToLower()
                switch ($extension) {
                    ".html"           { $response.ContentType = [System.Net.Mime.MediaTypeNames]::TextHtml + '; charset=utf-8' }
                    ".svg"            { $response.ContentType = "image/svg+xml" }
                    ".jpg"            { $response.ContentType = "image/jpeg" }
                    ".png"            { $response.ContentType = "image/png" }
                    ".css"            { $response.ContentType = "text/css" }
                    ".json"           { $response.ContentType = "application/json; charset=utf-8" }
                    ".js"             { $response.ContentType = "application/javascript; charset=utf-8" }
                    default           { $response.ContentType = [System.Net.Mime.MediaTypeNames]::ApplicationOctetStream }
                }
    
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($contenuFichier)
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            } else {
                $response.StatusCode = 404
            }
        }

        $response.Close()
    }
} finally {
    $listener.Stop()
}