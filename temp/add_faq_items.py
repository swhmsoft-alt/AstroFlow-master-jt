import json, os, urllib.request

td = 'src/i18n/translations'
api_key = 'sk-b187f5cf84c74f9aac8bd04b7fd0d2f8'

qa = [
    ("What are your typical lead times for rapid prototyping in titanium?", "Our standard rapid prototyping lead time is <strong>3\u20137 business days</strong> from CAD approval. For SLM/DMLS additive prototypes, we can achieve as fast as 48-hour turnaround on select geometries using our pre-qualified parameter sets. CNC machined prototypes typically ship within 5\u20137 days. All rapid prototype orders include a preliminary dimensional inspection report."),
    ("Do you provide EN 10204 3.1 Material Test Reports (MTR) with every shipment?", "Yes \u2014 EN 10204 3.1 MTRs are included as standard for all production orders. Our material traceability pipeline links each batch from mill certificate to finished component via a unique heat/lot number. 3.2 inspection certificates (third-party verified) are available upon request with a 48-hour processing window. We also provide ASTM E8/E8M tensile verification and chemical analysis upon request."),
    ("What dimensional tolerances can you guarantee on 5-axis titanium parts?", "Our standard machining tolerance is <strong>\u00b10.05 mm</strong> (ISO 2768-m). For precision-class work, we routinely hold <strong>\u00b10.005 mm</strong> on critical features using thermal-compensated 5-axis machining centers. Surface finish capabilities range from Ra 3.2 \u00b5m (standard) down to Ra 0.4 \u00b5m (precision burnish). All tolerances are certified via our CMM inspection lab (Zeiss CONTURA, calibrated to ISO 10360)."),
    ("Can you manufacture components under AS9100D or ISO 13485 compliance?", "Absolutely. Our facility operates under <strong>AS9100D</strong> (aerospace) and <strong>ISO 13485:2016</strong> (medical devices) quality management systems. We maintain NADCAP accreditation for NDT, heat treatment, and chemical processing. Documentation packages include first article inspection reports (FAIR) per AS9102, process control plans, and full material traceability chains."),
    ("What file formats do you accept for engineering review and quoting?", "We accept STEP (AP203/AP242), IGES, STL, Parasolid (X_T/X_B), SolidWorks (SLDPRT), AutoCAD (DWG/DXF), and native CATIA or NX files. For DFM analysis we prefer STEP or native CAD. For additive quoting, STL with a minimum 0.1 mm chord tolerance is recommended. All files can be uploaded via our secure RFQ portal with IP protection (NDA-backed)."),
    ("Do you offer NDA-protected design review before production?", "Yes \u2014 all design reviews are conducted under executed <strong>mutual NDA</strong> as a standard procedure. Our engineering team provides a confidential DFM analysis report within 1\u20132 business days of file receipt, identifying potential manufacturing risks, cost-saving geometry adjustments, and lead time estimates \u2014 at no charge for qualified production inquiries."),
]

keys = {}
for i, (q, a) in enumerate(qa):
    keys[f'resources.technicalfaqaccordion.faq{i}.question'] = q
    keys[f'resources.technicalfaqaccordion.faq{i}.answer'] = a

for lang in ['en','de','ja','fr','es','pt','it','ko','nl','pl']:
    fp = os.path.join(td, lang + '.json')
    data = json.load(open(fp, 'r', encoding='utf-8'))
    for k, v in keys.items():
        if k not in data:
            data[k] = v
    json.dump(data, open(fp, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
print(f'{len(keys)} keys added to all files')

# Translate ja
data = json.load(open(td + '/ja.json', 'r', encoding='utf-8'))
en = json.load(open(td + '/en.json', 'r', encoding='utf-8'))
source = {k: en[k] for k in keys if data.get(k) == en[k]}
print(f'ja: {len(source)} keys to translate...')
if source:
    body = json.dumps({
        'model': 'deepseek-chat',
        'messages': [
            {'role': 'system', 'content': 'Translate JSON values from English to Japanese. These are FAQ Q&A for a titanium CNC manufacturing website. Keep HTML tags like <strong>. Keep keys. Valid JSON only.'},
            {'role': 'user', 'content': json.dumps(source, indent=2, ensure_ascii=False)},
        ],
        'temperature': 0.1,
    }).encode('utf-8')
    req = urllib.request.Request('https://api.deepseek.com/v1/chat/completions', data=body,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'})
    resp = urllib.request.urlopen(req, timeout=120)
    txt = resp.read().decode('utf-8')
    result = json.loads(txt)
    content = result['choices'][0]['message']['content']
    if '```' in content: content = content.split('```')[1].replace('json','')
    translated = json.loads(content.strip())
    for k, v in translated.items():
        if k in data and v: data[k] = v
    json.dump(data, open(td + '/ja.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
    print(f'  OK: {len(translated)} keys')
print('Done')
