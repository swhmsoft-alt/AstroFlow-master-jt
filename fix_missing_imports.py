import os

pages_dir = 'src/pages'

# Files that need fixing (use t() but missing the import)
files_to_fix = [
    # Top-level pages (import from '../i18n/utils')
    ('branded-custom-packaging-services.astro', 'top'),
    ('laser-marking-custom-logo.astro', 'top'),
    ('titanium-additive-manufacturing.astro', 'top'),
    ('titanium-cnc-machining-services.astro', 'top'),
    ('titanium-fabrication-services.astro', 'top'),
    ('titanium-forming-heavy-manufacturing.astro', 'top'),
    ('titanium-surface-treatment.astro', 'top'),
    ('services.astro', 'top'),
    ('capabilities.astro', 'top'),
    ('industries.astro', 'top'),
    ('documentation.astro', 'top'),
    ('resources.astro', 'top'),
    ('rfq.astro', 'top'),
    ('use-cases.astro', 'top'),
    # Sub-pages (import from '../../i18n/utils')
    ('titanium-additive-manufacturing/rapid-prototyping.astro', 'sub'),
    ('titanium-additive-manufacturing/low-volume-production.astro', 'sub'),
    ('titanium-additive-manufacturing/3d-printing-slm.astro', 'sub'),
    ('titanium-cnc-machining-services/cnc-milling-turning.astro', 'sub'),
    ('titanium-cnc-machining-services/3-5-axis-cnc-machining.astro', 'sub'),
    ('titanium-cnc-machining-services/custom-industrial-components.astro', 'sub'),
    ('titanium-cnc-machining-services/wire-edm-machining.astro', 'sub'),
    ('titanium-fabrication-services/laser-cutting.astro', 'sub'),
    ('titanium-fabrication-services/waterjet-cutting.astro', 'sub'),
    ('titanium-fabrication-services/titanium-welding-assembly.astro', 'sub'),
    ('titanium-surface-treatment/anodizing.astro', 'sub'),
    ('titanium-surface-treatment/polishing-sandblasting.astro', 'sub'),
    ('titanium-surface-treatment/chemical-passivation.astro', 'sub'),
    ('titanium-forming-heavy-manufacturing/titanium-forging.astro', 'sub'),
    ('titanium-forming-heavy-manufacturing/titanium-extrusion.astro', 'sub'),
    ('titanium-forming-heavy-manufacturing/raw-material-preparation-sizing.astro', 'sub'),
]

top_import = "import { getLangFromUrl, useTranslations } from '../i18n/utils';"
sub_import = "import { getLangFromUrl, useTranslations } from '../../i18n/utils';"
var_block = "\nconst lang = getLangFromUrl(Astro.url);\nconst t = useTranslations(lang);"

for filename, level in files_to_fix:
    filepath = os.path.join(pages_dir, filename)
    if not os.path.exists(filepath):
        print(f'NOT FOUND: {filepath}')
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'getLangFromUrl' in content:
        print(f'SKIP (already has i18n): {filename}')
        continue
    
    imp = top_import if level == 'top' else sub_import
    
    # Insert the import after the last import statement (before '---')
    lines = content.split('\n')
    
    # Find position after last import
    last_import_idx = -1
    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('import ') and stripped.endswith(';'):
            last_import_idx = i
    
    if last_import_idx >= 0:
        # Insert blank line, then i18n import, then vars before the closing ---
        # Find the closing ---
        closing_fence_idx = -1
        for i in range(last_import_idx + 1, len(lines)):
            if lines[i].strip() == '---':
                closing_fence_idx = i
                break
        
        if closing_fence_idx >= 0:
            # Insert right before the closing ---
            lines.insert(closing_fence_idx, '')
            lines.insert(closing_fence_idx, var_block.strip())
            lines.insert(closing_fence_idx, imp)
            
            new_content = '\n'.join(lines)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f'FIXED: {filename}')
        else:
            print(f'NO CLOSING FENCE: {filename}')
    else:
        print(f'NO IMPORT FOUND: {filename}')

print('Done!')