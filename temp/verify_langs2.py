import os

base = 'dist'
langs = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']

# English uses non-prefixed path
paths = {
    'en': 'materials/astm-b348/index.html',
    'de': 'de/materials/astm-b348/index.html',
    'ja': 'ja/materials/astm-b348/index.html',
    'fr': 'fr/materials/astm-b348/index.html',
    'es': 'es/materials/astm-b348/index.html',
    'pt': 'pt/materials/astm-b348/index.html',
    'it': 'it/materials/astm-b348/index.html',
    'ko': 'ko/materials/astm-b348/index.html',
    'nl': 'nl/materials/astm-b348/index.html',
    'pl': 'pl/materials/astm-b348/index.html',
}

# Search for translated strings deeper in the file using a streaming approach
for lang, rel_path in paths.items():
    full_path = os.path.join(base, rel_path)
    if not os.path.exists(full_path):
        print(f'{lang}: ❌ FILE NOT FOUND at {os.path.join(base, rel_path)}')
        continue
    
    size = os.path.getsize(full_path)
    
    # Search in the 2nd half of the file where page content should be
    with open(full_path, 'r', encoding='utf-8') as f:
        f.seek(size // 2)  # Start from middle
        content = f.read(100000)  # Read ~100KB
    
    # Check for key markers
    en_markers = ['Frequently Asked Questions', 'Technical Specifications']
    de_markers = ['Häufig gestellte Fragen', 'Technische Spezifikationen']
    ja_markers = ['よくある質問', '技術仕様']
    fr_markers = ['Questions fréquemment posées']
    es_markers = ['Preguntas Frecuentes']
    
    markers = {
        'en': en_markers, 'de': de_markers, 'ja': ja_markers,
        'fr': fr_markers, 'es': es_markers,
        'pt': ['Perguntas Frequentes'], 'it': ['Domande Frequenti'],
        'ko': ['자주 묻는 질문'], 'nl': ['Veelgestelde Vragen'], 'pl': ['Często zadawane pytania']
    }
    
    found = [m for m in markers[lang] if m in content]
    if found:
        print(f'{lang}: ✅ {found} (file size: {size:,} bytes)')
    else:
        print(f'{lang}: ⚠ No markers found')
