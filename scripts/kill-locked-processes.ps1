Write-Host "Killing locked cmd and powershell processes (excluding current)..."
$currentId = $PID

# Get cmd.exe processes
$cmdProcesses = Get-Process -Name "cmd" -ErrorAction SilentlyContinue
foreach ($p in $cmdProcesses) {
    try {
        $p.Kill()
        Write-Host "  Killed cmd.exe PID: $($p.Id)"
    } catch {
        Write-Host "  Failed to kill cmd.exe PID: $($p.Id) - $($_.Exception.Message)"
    }
}

# Get other powershell processes (not this one)
$psProcesses = Get-Process -Name "powershell" -ErrorAction SilentlyContinue
foreach ($p in $psProcesses) {
    if ($p.Id -ne $currentId) {
        try {
            $p.Kill()
            Write-Host "  Killed powershell.exe PID: $($p.Id)"
        } catch {
            Write-Host "  Failed to kill powershell.exe PID: $($p.Id) - $($_.Exception.Message)"
        }
    }
}

Write-Host "`nWaiting 2 seconds for locks to release..."
Start-Sleep -Seconds 2
Write-Host "Done"