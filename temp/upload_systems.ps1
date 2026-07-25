$envData = @{}
Get-Content ".env.production" | ForEach-Object { $line = $_.Trim(); if ($line -and -not $line.StartsWith("#")) { $parts = $line.Split("=",2); if ($parts.Count -eq 2) { $envData[$parts[0].Trim()] = $parts[1].Trim() } } }
$H = $envData["PRODUCTION_FTP_HOST"]; $U = $envData["PRODUCTION_FTP_USER"]; $P = $envData["PRODUCTION_FTP_PASSWORD"]; $R = $envData["PRODUCTION_SERVER_PATH"] -replace "/$",""
$files = Get-ChildItem "dist\products\systems" -Recurse -File
$ok = 0; $fail = 0
foreach ($f in $files) {
    $rel = $f.FullName.Substring((Get-Location).Path.Length + 5).Replace("\","/")
    $url = "ftp://${H}${R}/${rel}" -replace "([^:])//+",'$1/'
    try {
        $req = [System.Net.FtpWebRequest]::Create($url)
        $req.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $req.Credentials = New-Object System.Net.NetworkCredential($U, $P)
        $req.UseBinary = $true; $req.UsePassive = $false; $req.EnableSsl = $false; $req.Timeout = 30000
        $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
        $req.ContentLength = $bytes.Length
        $stream = $req.GetRequestStream(); $stream.Write($bytes,0,$bytes.Length); $stream.Close()
        $resp = $req.GetResponse(); $resp.Close()
        $ok++
    } catch { $fail++ }
    if ($ok % 10 -eq 0) { Write-Host "  $ok/$($files.Count)" }
}
Write-Host "Uploaded: $ok/$($files.Count), Failed: $fail"
