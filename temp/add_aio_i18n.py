import json, os

lang_files = ['de.json', 'es.json', 'fr.json', 'it.json', 'ja.json', 'ko.json', 'nl.json', 'pl.json', 'pt.json']
translations_dir = 'src/i18n/translations'

keys = {
    'materials.titaniumstandards.techSpecsTitle': 'Technical Specifications & Properties',
    'materials.titaniumstandards.techSpecsDesc': 'Key technical parameters for this standard specification. Values are grade-dependent and represent minimum requirements per the latest applicable revision.',
    'materials.titaniumstandards.techSpecParam': 'Parameter',
    'materials.titaniumstandards.techSpecValue': 'Specification / Value',
    'materials.titaniumstandards.cncNarrative': "Don't just buy raw material \u2014 get precision-engineered parts. Our fully integrated facility transforms ",
    'materials.titaniumstandards.cncNarrative2': ' titanium stock into complex, custom components using state-of-the-art multi-axis CNC machining centers, precision turning, and advanced quality control systems. From prototype to production, every component is machined with certified material, verified by CMM inspection, and backed by full material traceability.',
    'materials.titaniumstandards.whyChooseBadge': 'Why BOZE CNC Ti',
    'materials.titaniumstandards.whyChooseTitle': 'Why Choose Us for This Standard',
    'materials.titaniumstandards.faqTitle': 'Frequently Asked Questions',
    'materials.titaniumstandards.faqSubtitle': 'Common questions from procurement engineers about this standard specification and our machining capabilities.',
}

for fname in lang_files:
    fpath = os.path.join(translations_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(keys)
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{fname}: OK ({len(data)} keys)')

print('All done!')
