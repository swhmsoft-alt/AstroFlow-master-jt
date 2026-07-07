import json, os, sys

translations_dir = 'src/i18n/translations'
lang_files = ['de.json', 'es.json', 'fr.json', 'it.json', 'ja.json', 'ko.json', 'nl.json', 'pl.json', 'pt.json']

new_keys = {
    'materials.titaniumstandards.materialCompliance': 'Material Compliance & Sourcing',
    'materials.titaniumstandards.complianceDesc': 'We strictly source 100% certified ',
    'materials.titaniumstandards.complianceDesc2': ' compliant raw materials to ensure maximum mechanical integrity, uniform chemical composition, and strict dimensional tolerances for your critical components.',
    'materials.titaniumstandards.supportedGrades': 'Supported Titanium Grades',
    'materials.titaniumstandards.availableForms': 'Available Raw Stock Forms',
    'materials.titaniumstandards.cncBadge': 'Precision Manufacturing',
    'materials.titaniumstandards.cncTitle': 'Our CNC Machining Capabilities',
    'materials.titaniumstandards.cncSubtitle': "Don't just buy raw material \u2014 get precision-engineered parts. We transform ",
    'materials.titaniumstandards.cncSubtitle2': ' titanium stock into complex, custom components utilizing state-of-the-art multi-axis CNC machining and turning centers.',
    'materials.titaniumstandards.achievableTolerance': 'Achievable Machining Tolerance',
    'materials.titaniumstandards.achievableFinish': 'Achievable Surface Finish',
    'materials.titaniumstandards.qualityTitle': 'Quality Assurance & Certifications',
    'materials.titaniumstandards.qualityDesc': 'Every batch of titanium components processed in our facility undergoes rigorous inspection to guarantee full industry compliance.',
    'materials.titaniumstandards.traceabilityNote': '100% full traceability with Material Test Reports (MTRs) provided with every order. Dimensional layout inspection reports, CMM reports, and NDT available upon request.',
    'materials.titaniumstandards.industriesTitle': 'Industries We Serve',
    'materials.titaniumstandards.ctaBadge': 'Get Started Today',
    'materials.titaniumstandards.ctaTitle': 'Ready to Start Your Titanium Project?',
    'materials.titaniumstandards.ctaUpload': 'Upload Your Drawings & Get a Quote',
    'materials.titaniumstandards.ctaContact': 'Contact Engineering Team',
    'materials.titaniumstandards.trustNda': 'NDA Protected',
    'materials.titaniumstandards.trustSecure': 'Secure File Upload (TLS 1.3)',
    'materials.titaniumstandards.trustResponse': '24-Hour Engineering Response',
    'materials.titaniumstandards.relatedSpecs': 'Related Specifications',
}

for fname in lang_files:
    fpath = os.path.join(translations_dir, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        data = json.load(f)
    data.update(new_keys)
    with open(fpath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{fname}: OK ({len(data)} keys)')

print('All done!')
