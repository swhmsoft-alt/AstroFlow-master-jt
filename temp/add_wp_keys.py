import json, os

td = 'src/i18n/translations'
keys = {
    'resources.featuredinsights.whitepaper0.title': 'Cost-Saving DFM Rules: Reducing Titanium Waste by 23%',
    'resources.featuredinsights.whitepaper0.abstract': 'A data-driven analysis of design-for-manufacturability parameters that directly reduce buy-to-fly ratios. Covers near-net shape nesting, toolpath optimization, and strategic stock allowance reduction across 5-axis and mill-turn platforms.',
    'resources.featuredinsights.whitepaper1.title': 'Grade 5 vs Grade 23 ELI: Medical-Grade Comparative Analysis',
    'resources.featuredinsights.whitepaper1.abstract': 'Side-by-side metallurgical evaluation of Ti-6Al-4V (Grade 5) versus Ti-6Al-4V ELI (Grade 23) for implantable and surgical instrument applications. Fatigue life, notch sensitivity, and biocompatibility data from certified test batches.',
    'resources.featuredinsights.whitepaper2.title': '5-Axis Thermal Mitigation: Real-Time Heat Control Logs',
    'resources.featuredinsights.whitepaper2.abstract': 'Instrumented spindle load and coolant temperature logs from production-grade 5-axis machining of Grade 5 titanium blocks. Presents validated parameters for thermal distortion prevention, chatter suppression, and surface integrity retention.',
}
for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print('Keys added')
