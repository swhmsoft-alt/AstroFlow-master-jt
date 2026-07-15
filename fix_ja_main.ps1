$path = "src/i18n/translations/ja.json"
$utf8 = New-Object System.Text.UTF8Encoding $false

# Read file using .NET to preserve encoding
$content = [System.IO.File]::ReadAllText($path)

$lastBrace = $content.LastIndexOf('}')
$insert = @"

  "industries.marine.subsea.badge": "海底圧力容器",
  "industries.marine.subsea.title.main": "多軸CNCフライス加工"
"@

$newContent = $content.Substring(0, $lastBrace) + $insert + "`r`n}"
[System.IO.File]::WriteAllText($path, $newContent, $utf8)
Write-Host "ja.json: main keys added"
