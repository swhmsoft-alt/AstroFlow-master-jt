# deploy-incremental.ps1
# 增量部署 - 对比 manifest，仅上传变更文件
$ErrorActionPreference = 'Stop'
$dist = Join-Path $PSScriptRoot '..\dist'
$manifestPath = Join-Path $dist '.deploy-manifest.json'
$envFile = Join-Path $PSScriptRoot '..\.env.production'
Write-Host 'Scanning...'
$localFiles = Get-ChildItem $dist -Recurse -File | Where-Object { $_.Name -ne '.deploy-manifest.json' }
Write-Host ('  ' + $localFiles.Count + ' files')
