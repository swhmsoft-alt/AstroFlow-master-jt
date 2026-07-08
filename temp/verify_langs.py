import os, re

base = 'dist'
langs = ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']
standard = 'materials/astm-b348/index.html'

# Language detection markers
markers = {
    'en': ['<html lang="en"', 'Frequently Asked', 'Technical Specifications'],
    'de': ['Häufig gestellte Fragen', 'Technische Spezifikationen'],
    'ja': ['よくある質問', '技術仕様・特性'],
    'fr': ['Questions fréquemment posées', 'Spécifications techniques'],
    'es': ['Preguntas Frecuentes', 'Especificaciones Técnicas'],
    'pt': ['Perguntas Frequentes', 'Especificações Técnicas'],
    'it': ['Domande Frequenti', 'Specifiche Tecniche'],
    'ko': ['자주 묻는 질문', '기술 사양'],
    'nl': ['Veelgestelde Vragen', 'Technische Specificaties'],
    'pl': ['Często zadawane pytania', 'Specyfikacje techniczne'],
}

for lang in langs:
    path = os.path.join(base, lang, standard)
    if not os.path.exists(path):
        print(f'{lang}: ❌ FILE NOT FOUND')
        continue
    
    size = os.path.getsize(path)
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read(5000)  # Read first 5000 chars
    
    found = [m for m in markers[lang] if m in content]
    if found:
        print(f'{lang}: ✅ Found markers: {found} (size: {size:,} bytes)')
    else:
        print(f'{lang}: ⚠ No language markers found in first 5000 chars')
        # Print first 200 chars for debugging
        print(f'  First 200: {repr(content[:200])}')
