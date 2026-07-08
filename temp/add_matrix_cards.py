import json, os

td = 'src/i18n/translations'
keys = {}
titles = [
    'Titanium Knowledge Base',
    'Titanium Grades Guide',
    'Design & Engineering Guides',
    'Manufacturing Insights',
    'Industry Applications',
    'Case Studies',
]
descriptions = [
    'Material physics & chemistry logs — crystallographic structures, thermal conductivity curves, corrosion resistance profiles across all commercially pure and alloyed grades.',
    'Comparative property selection matrix — yield strength, elongation, hardenability, and biocompatibility benchmarks for Grades 1\u201323 with application-specific recommendations.',
    'DFM parameters, minimum wall limits, anti-galling design rules, and GD&T callout standards specific to titanium CNC machining and additive manufacturing.',
    '5-axis CNC advances, SLM 3D printing process parameters, toolpath optimization logs, and surface integrity studies for high-performance titanium components.',
    'Aerospace compliance (AS9100D, NADCAP), medical biological limits (ISO 10993, ASTM F136/F67), and AI infrastructure thermal management engineering data.',
    'Real-world cost reduction & precision project reviews \u2014 documented ROI analyses, cycle-time benchmarks, and metallurgical outcomes from Tier 1 aerospace and medical engagements.',
]
for i in range(6):
    keys[f'resources.resourcehubmatrix.card{i}.title'] = titles[i]
    keys[f'resources.resourcehubmatrix.card{i}.description'] = descriptions[i]

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'Keys added to all files ({len(keys)} keys)')
