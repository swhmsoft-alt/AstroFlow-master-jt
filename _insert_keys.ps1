param($filePath)
$content = Get-Content $filePath -Raw
$insertPoint = $content.IndexOf('"industries.astro.industries.industry"')
if ($insertPoint -eq -1) { Write-Host "ERROR: insertion point not found"; exit 1 }
$newKeys = @'
  "industries.ai.page.title": "AI-infrastructuur en optische communicatie Titanium CNC-bewerking",
  "industries.ai.page.description": "Op maat gemaakte precisie CNC-bewerking voor 800G/1.6T optische transceiverbehuizingen, dunwandige EMI-afschermingscomponenten en lekvrije vloeistofkoelingsverdelers voor datacenters.",
  "industries.ai.page.serviceName": "AI-infrastructuur en optische communicatie Titanium CNC-bewerkingsdiensten",
  "industries.ai.page.serviceCategory": "AI-infrastructuur en optische communicatie",
  "industries.ai.page.productName": "800G/1.6T optische transceiverbehuizingen, vloeistofkoelingsverdelers en koudplaten",
  "industries.ai.page.productCategory": "AI-infrastructuurcomponenten",
  "industries.ai.hero.h1": "Precisie titanium CNC-bewerking voor AI-infrastructuur en optische communicatie",
  "industries.ai.hero.subtitle": "Hoogwaardige productie van op maat gemaakte titanium componenten, ontworpen om thermische drift te elimineren, vloeistofkoelingslekkage te voorkomen en absolute EMI-afscherming te bieden voor dichte computernodes en 800G/1.6T optische transceivers.",
  "industries.ai.hero.badge": "AI en optische communicatie",
  "industries.ai.hero.metric1.value": "≤0.4mm",
  "industries.ai.hero.metric1.label": "Wanddikte",
  "industries.ai.hero.metric2.value": "EMI",
  "industries.ai.hero.metric2.label": "Afscherming",
  "industries.ai.hero.metric3.value": "Nul",
  "industries.ai.hero.metric3.label": "Lekkage",
  "industries.ai.hero.chip0": "800G/1.6T",
  "industries.ai.hero.chip1": "Dunwandige EMI",
  "industries.ai.hero.chip2": "Vloeistofkoeling",
  "industries.ai.hero.chip3": "Thermische drift",
  "industries.ai.hero.chip4": "CMM GD&T",
'@
$newContent = $content.Substring(0, $insertPoint) + $newKeys + "`r`n" + $content.Substring($insertPoint)
Set-Content -Path $filePath -Value $newContent -NoNewline
Write-Host "SUCCESS: Keys inserted"