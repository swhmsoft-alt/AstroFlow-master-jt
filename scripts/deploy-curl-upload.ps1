# PowerShell script to deploy via FTP using curl
# This handles the special characters in password properly

$envPath = Join-Path $PSScriptRoot "..\.env.production"

# Parse env file
$env = @{}
Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $parts = $line.Split('=', 2)
        if ($parts.Count -eq 2) {
            $env[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

$hostname = $env['PRODUCTION_FTP_HOST']
$user = $env['PRODUCTION_FTP_USER']
$password = $env['PRODUCTION_FTP_PASSWORD']
$remoteRoot = $env['PRODUCTION_SERVER_PATH']
$localRoot = Join-Path $PSScriptRoot "..\dist"

Write-Host "🚀 Deploying to $hostname" -ForegroundColor Cyan
Write-Host "   Remote: $remoteRoot" -ForegroundColor Gray

# Build a .net FTP request for uploading (uses active mode by default)
$files = Get-ChildItem -Path $localRoot -Recurse -File
$total = $files.Count
$count = 0

foreach ($file in $files) {
    $relativePath = $file.FullName.Substring($localRoot.Length + 1).Replace('\', '/')
    $remotePath = "$remoteRoot$relativePath"
    $dirPath = [System.IO.Path]::GetDirectoryName($relativePath).Replace('\', '/')
    
    $count++
    Write-Progress -Activity "Uploading to $hostname" -Status "$count / $total : $relativePath" -PercentComplete (($count / $total) * 100)
    
    # Create FTP request for upload
    try {
        $request = [System.Net.FtpWebRequest]::Create("ftp://$hostname$remotePath")
        $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $request.Credentials = New-Object System.Net.NetworkCredential($user, $password)
        $request.UseBinary = $true
        $request.UsePassive = $false  # ACTIVE MODE - key change!
        $request.EnableSsl = $false
        $request.Timeout = 30000
        $request.ReadWriteTimeout = 30000
        
        # Read file content and upload
        $fileContent = [System.IO.File]::ReadAllBytes($file.FullName)
        $request.ContentLength = $fileContent.Length
        
        $requestStream = $request.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $request.GetResponse()
        $response.Close()
        
        Write-Host "." -NoNewline -ForegroundColor Green
    }
    catch {
        Write-Host "`n❌ Failed: $relativePath - $_" -ForegroundColor Red
    }
}

Write-Host "`n✅ Deploy complete! $count files uploaded." -ForegroundColor Green