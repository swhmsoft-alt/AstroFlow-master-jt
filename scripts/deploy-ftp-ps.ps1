# PowerShell FTP deploy script
# Uses .NET FtpWebRequest with active mode
param(
    [switch]$SkipConfirmation
)

$ErrorActionPreference = "Stop"

# Load env file
$envPath = Join-Path $PSScriptRoot "..\.env.production"
$env = @{}
Get-Content $envPath | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $idx = $line.IndexOf('=')
        if ($idx -gt 0) {
            $env[$line.Substring(0, $idx).Trim()] = $line.Substring($idx + 1).Trim()
        }
    }
}

$hostname = $env['PRODUCTION_FTP_HOST']
$user = $env['PRODUCTION_FTP_USER']
$pass = $env['PRODUCTION_FTP_PASSWORD']
$remoteRoot = $env['PRODUCTION_SERVER_PATH'].TrimEnd('/')
$localRoot = Join-Path $PSScriptRoot "..\dist"

if (-not (Test-Path $localRoot)) {
    Write-Host "❌ dist/ not found. Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

if (-not $SkipConfirmation) {
    $answer = Read-Host "⚠️  Upload to $hostname`? (y/N)"
    if ($answer -ne 'y') {
        Write-Host "❌ Cancelled." -ForegroundColor Red
        exit 0
    }
}

Write-Host "🚀 Deploying to $hostname$remoteRoot" -ForegroundColor Cyan
Write-Host "   User: $user" -ForegroundColor Gray

# Helper function for FTP request
function Invoke-FtpRequest {
    param($uri, $method, $content)
    try {
        $request = [System.Net.FtpWebRequest]::Create($uri)
        $request.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $request.Method = $method
        $request.UsePassive = $false  # Active mode!
        $request.UseBinary = $true
        $request.EnableSsl = $false
        $request.Timeout = 30000
        $request.ReadWriteTimeout = 60000
        $request.KeepAlive = $false
        
        if ($content) {
            $request.ContentLength = $content.Length
            $stream = $request.GetRequestStream()
            $stream.Write($content, 0, $content.Length)
            $stream.Close()
        }
        
        $response = $request.GetResponse()
        $response.Close()
        return $true
    }
    catch {
        Write-Host "`n   ⚠ FTP error: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

# Collect all files
$allFiles = Get-ChildItem -Path $localRoot -Recurse -File
$total = $allFiles.Count
Write-Host "📦 $total files to upload" -ForegroundColor Cyan
Write-Host ""

# Create directory structure first
Write-Host "📁 Creating directories..." -ForegroundColor Yellow
$dirsCreated = @{}
$successCount = 0
$failCount = 0

# Simple test first - just list root
Write-Host "`n📋 Testing connection (list root directory)..." -ForegroundColor Yellow
try {
    $listReq = [System.Net.FtpWebRequest]::Create("ftp://$hostname/")
    $listReq.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
    $listReq.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
    $listReq.UsePassive = $false
    $listReq.Timeout = 15000
    $listResp = $listReq.GetResponse()
    $reader = New-Object System.IO.StreamReader($listResp.GetResponseStream())
    $listing = $reader.ReadToEnd()
    $reader.Close()
    $listResp.Close()
    Write-Host "✅ Connection OK - found $($listing.Split("`n").Count) items" -ForegroundColor Green
}
catch {
    Write-Host "❌ Connection test failed: $_" -ForegroundColor Red
    exit 1
}

# Upload files one by one using active mode FTP
Write-Host "`n📤 Uploading files..." -ForegroundColor Yellow

foreach ($file in $allFiles) {
    $relativePath = $file.FullName.Substring($localRoot.Length + 1).Replace('\', '/')
    $remotePath = "$remoteRoot/$relativePath"
    $remoteUri = "ftp://$hostname$remotePath"
    
    # Try to create directory first
    $dirPath = [System.IO.Path]::GetDirectoryName("$remoteRoot/$relativePath").Replace('\', '/')
    if (-not $dirsCreated.ContainsKey($dirPath)) {
        $dirReq = [System.Net.FtpWebRequest]::Create("ftp://$hostname$dirPath/")
        $dirReq.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $dirReq.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
        $dirReq.UsePassive = $false
        try {
            $dirResp = $dirReq.GetResponse()
            $dirResp.Close()
        }
        catch {
            # Directory likely exists - ignore
        }
        $dirsCreated[$dirPath] = $true
    }
    
    # Upload
    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($file.FullName)
        $uploadReq = [System.Net.FtpWebRequest]::Create($remoteUri)
        $uploadReq.Credentials = New-Object System.Net.NetworkCredential($user, $pass)
        $uploadReq.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $uploadReq.UsePassive = $false
        $uploadReq.UseBinary = $true
        $uploadReq.Timeout = 30000
        $uploadReq.ReadWriteTimeout = 60000
        $uploadReq.ContentLength = $fileBytes.Length
        
        $stream = $uploadReq.GetRequestStream()
        $stream.Write($fileBytes, 0, $fileBytes.Length)
        $stream.Close()
        
        $resp = $uploadReq.GetResponse()
        $resp.Close()
        
        $successCount++
        Write-Host "." -NoNewline -ForegroundColor Green
    }
    catch {
        $failCount++
        Write-Host "x" -NoNewline -ForegroundColor Red
    }
}

Write-Host ""
Write-Host ""
Write-Host "=" * 40 -ForegroundColor Cyan
Write-Host "✅ Uploaded: $successCount files" -ForegroundColor Green
if ($failCount -gt 0) {
    Write-Host "❌ Failed: $failCount files" -ForegroundColor Red
}
Write-Host "=" * 40 -ForegroundColor Cyan