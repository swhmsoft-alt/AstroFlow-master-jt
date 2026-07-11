"""Add ALL certification page translation keys to en.json"""
import json

with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# ===== S1: Core Certification Directory =====
data['cap.certificationspage.s1.subtitle'] = 'Our production infrastructure operates under a highly audited, internationally recognized quality management system. Validated by world-leading registrars, every certification guarantees uncompromising regulatory and safety compliance.'
data['cap.certificationspage.s1.as9100_status'] = 'Active / Fully Audited'
data['cap.certificationspage.s1.as9100_subtitle'] = 'Aerospace structural brackets, engine components, landing gear, hydraulic manifolds, propulsion hardware and flight-critical titanium parts.'
data['cap.certificationspage.s1.iso13485_scope'] = 'Medical Devices & Bio-tech'
data['cap.certificationspage.s1.iso13485_status'] = 'Active / Fully Audited'
data['cap.certificationspage.s1.iso13485_subtitle'] = 'Sterile surgical instrument trays, implant components, bone screw fixation systems, precision orthopedic devices, and Class II medical hardware.'
data['cap.certificationspage.s1.iso9001_status'] = 'Active / Fully Audited'
data['cap.certificationspage.s1.iso9001_subtitle'] = 'General industrial components, automotive performance parts, oil & gas valve assemblies, automation equipment, and custom-engineered hardware across all commercial sectors.'

# ===== S2: Certification Validation Matrix =====
data['cap.certificationspage.s2.subtitle'] = 'Detailed breakdown of each certification\u2019s scope, applicable standards, and our current verification status \u2014 as documented by our accredited registrars.'
data['cap.certificationspage.s2.col1'] = 'Certification Standard'
data['cap.certificationspage.s2.col2'] = 'Primary Industry Focus'
data['cap.certificationspage.s2.col3'] = 'Audit Scope & Boundary'
data['cap.certificationspage.s2.col4'] = 'Verification Status'
data['cap.certificationspage.s2.row1_col3'] = 'Multi-axis titanium machining for high-stress structural parts, propulsion components, and critical flight hardware.'
data['cap.certificationspage.s2.row2_col2'] = 'Medical Implants & Instruments'

# ===== S3: Annual Audit Lifecycle =====
data['cap.certificationspage.s3.subtitle'] = 'Our certifications are not static documents \u2014 each standard undergoes rigorous annual surveillance audits and triennial re-certification cycles to maintain active, unexpired status.'
data['cap.certificationspage.s3.phase1_desc'] = 'Each registered facility undergoes a comprehensive internal audit against all applicable standard clauses. Led by our cross-departmental internal audit team, this review examines documentation, process adherence, equipment calibration, training records, and corrective action closure. Non-conformities identified during this phase are remediated before the external registrar visit.'
data['cap.certificationspage.s3.phase2_desc'] = 'Our accredited registrar conducts on-site surveillance audits for each certification on a rotating annual schedule. The registrar reviews the management system for continuous improvement, operational control, and compliance with standard requirements. Surveillance audits are typically shorter in scope than full re-certification but cover the most critical quality and compliance processes.'
data['cap.certificationspage.s3.phase3_desc'] = 'Every three years, each standard undergoes a complete re-certification audit covering the full scope of the standard. This includes comprehensive documentation review, observation of manufacturing and inspection processes across all shifts, operator competency verification, and supplier management assessment. Successful completion of the re-certification audit renews the certificate for an additional three-year cycle.'

# ===== S4: FAQ =====
data['cap.certificationspage.s4.subtitle'] = 'Answers to the most frequently asked questions about our manufacturing certifications, audit scope, and quality documentation from procurement and supplier quality engineers.'
data['cap.certificationspage.s4.a1'] = 'Yes. Certified copies of our current AS9100D, ISO 13485:2016, and ISO 9001:2015 certificates are available upon request. Each certificate includes the official scope statement, registrar accreditation details, issue and expiry dates, and the unique certificate number. We can provide these as part of your supplier qualification package or directly to your procurement portal. Contact our quality management team via our RFQ page to request current certificates.'
data['cap.certificationspage.s4.a2'] = 'Our quality management system is audited by internationally recognized registrars including SGS, DNV GL, and BSI. We undergo annual surveillance audits for each certification, with full re-certification audits every three years. In addition, our internal audit team conducts comprehensive cross-departmental reviews on a quarterly basis, ensuring continuous compliance between registrar visits. All audit findings \u2014 including observations, non-conformities, and corrective actions \u2014 are documented and traceable.'
data['cap.certificationspage.s4.a3'] = 'Yes. AS9100 Rev D is the aerospace, space, and defense industry-specific quality management standard. Our certification scope explicitly covers the manufacture of precision machined components for aerospace structural assemblies, propulsion systems, and defense hardware. The standard incorporates all ISO 9001:2015 requirements plus additional aerospace-specific provisions including configuration management, counterfeit part prevention (AS6174/AS5553), first-article inspection (AS9102), and special process control. For defense contracts requiring DFARS compliance, we can additionally provide certified material sourcing from qualifying countries.'
data['cap.certificationspage.s4.a4'] = 'At minimum, AS9100 Rev D requires an annual surveillance audit by the accredited registrar, with a full re-certification audit every 36 months. Between registrar visits, our internal audit team conducts quarterly internal audits across all departments. Additional audits may be triggered by major process changes, new facility additions, or customer-specific requirements. This multi-layer audit cadence ensures continuous compliance and immediate identification of any system gaps.'
data['cap.certificationspage.s4.cta'] = 'Request our current certification documents for your supplier qualification process.'
data['cap.certificationspage.s4.cta_btn'] = 'Request Certification Documents'

# Section badges/title prefixes
data['cap.certificationspage.s1.badge'] = 'Verified Quality Management Systems'
data['cap.certificationspage.s1.title_prefix'] = 'Verified Quality'
data['cap.certificationspage.s2.badge'] = 'Certification Validation'
data['cap.certificationspage.s2.title_prefix'] = 'Certification'
data['cap.certificationspage.s3.badge'] = 'Compliance Sustainability'
data['cap.certificationspage.s3.title_prefix'] = 'The Annual Audit'
data['cap.certificationspage.s4.badge'] = 'Certification & Compliance FAQ'
data['cap.certificationspage.s4.title_prefix'] = 'Certification Compliance'

with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

sk = [k for k in data if k.startswith('cap.certificationspage.s') and not k.startswith('cap.certificationspage.sa')]
print(f'Done! Total cert s-keys: {len(sk)}')
