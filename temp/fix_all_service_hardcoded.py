import os
import re

# Find all hardcoded title prefixes in service components
base = 'src/components/services'
fixes = {
    'CncProcessSpectrum.astro': [
        ('Our <span style="color: var(--theme-primary);">{t(\'services.cncprocessspectrum.cnc_process_spectrum\')}</span>',
         '{t(\'services.cncprocessspectrum.titlePrefix\')} <span style="color: var(--theme-primary);">{t(\'services.cncprocessspectrum.titleHighlight\')}</span>'),
        ('<p class="text-xl max-w-3xl mx-auto leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 65%, transparent);">\n        {t(\'services.cncprocessspectrum.subtitle\')}\n      </p>',
         '<p class="text-xl max-w-3xl mx-auto leading-relaxed" style="color: color-mix(in srgb, var(--theme-text) 65%, transparent);">\n        {t(\'services.cncprocessspectrum.description\')}\n      </p>'),
    ],
}

print('Checking files...')
for fname in os.listdir(base):
    if not fname.endswith('.astro'):
        continue
    fp = os.path.join(base, fname)
    with open(fp, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Find h2 with hardcoded English prefix before <span
    for m in re.finditer(r'<h2[^>]*>([A-Za-z][A-Za-z /]+(?:Your|Our|Engineering|Machining|Technical|Mastering|Precision|Advanced|Complete)[A-Za-z /]*)<span', c):
        prefix = m.group(1).strip()
        if not prefix.startswith('{'):
            print(f'{fname}: "{prefix}" might be hardcoded before <span>')
print('Done')
