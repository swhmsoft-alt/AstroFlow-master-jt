"""Add ALL 32 traceability S1-S4 translation keys to en.json"""
import json

with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# S1: Chain of Custody
data['cap.traceabilitypage.s1.subtitle'] = 'From raw titanium ingot heat lots to permanently marked finished components \u2014 every transfer, test, and transformation is digitally recorded and cross-referenced for complete forward and backward traceability.'
data['cap.traceabilitypage.s1.step1.desc'] = 'Every incoming titanium bar, plate, or sheet is placed under quarantine upon arrival. The certified EN 10204 Type 3.1 Mill Test Report (MTR) is digitally cross-checked against the physical material heat number stamped on each piece. A unique internal batch number is generated in our ERP system and permanently linked to the mill\u2019s native heat number \u2014 creating the first link in the chain of custody.'
data['cap.traceabilitypage.s1.step2.desc'] = 'Once released from quarantine, raw stock is physically laser-marked with grade identification and color-coded by titanium grade (Grade 5 Ti-6Al-4V, Grade 23 ELI, Grade 2 CP) in dedicated inventory zones. Handheld XRF spectrometers perform Positive Material Identification (PMI) to confirm chemical composition before any stock is released to the production floor. Material lots are physically segregated to prevent any cross-contamination between grades.'
data['cap.traceabilitypage.s1.step3.desc'] = 'As material moves to multi-axis CNC machining cells, the internal batch ID is digitally bound to the ERP production traveler job routing. Each operation \u2014 milling, turning, wire EDM, surface treatment \u2014 records the machine ID, operator, and timestamp against the same batch number. Scrap and raw metal turnings are segregated by grade in dedicated containers to prevent cross-contamination. The system supports full forward traceability (from heat to finished part) and backward traceability (from finished part back to heat).'
data['cap.traceabilitypage.s1.step4.desc'] = 'Finished parts undergo permanent micro-laser-marking per blueprint requirements \u2014 serial numbers, heat IDs, date codes, or QR codes (Data Matrix per MIL-STD-130 / UDI compliance). The complete quality dossier \u2014 including MTR, CMM report, FAIR, surface roughness certificate, and CoC \u2014 is digitally archived under the part serial number and heat lot identifier. All records are retained for a minimum of 10 years and retrievable within 24 hours for customer or regulatory audit support.'

# S2: Compliance Matrix
data['cap.traceabilitypage.s2.subtitle'] = 'Every titanium component is manufactured in full alignment with international defense, aerospace, medical, and environmental compliance frameworks.'
data['cap.traceabilitypage.s2.col1_head'] = 'Compliance Framework'
data['cap.traceabilitypage.s2.col2_head'] = 'Strict Operational Requirement'
data['cap.traceabilitypage.s2.col3_head'] = 'BOZE Implementation Status'
data['cap.traceabilitypage.s2.row2.req'] = 'Material certificate issued by the mill showing actual chemical composition and physical tensile test results \u2014 not generic compliance statements.'
data['cap.traceabilitypage.s2.row2.status'] = 'Mandatory Standard'
data['cap.traceabilitypage.s2.row3.req'] = 'Maintains explicit identification and status indicators throughout total production cycles \u2014 identification, status, traceability per AS9100D risk management.'

# S3: Audit Support
data['cap.traceabilitypage.s3.subtitle'] = 'Your quality documentation doesn\u2019t expire after shipment. We maintain comprehensive digital archives to support regulatory audits, downstream investigations, and procurement compliance reviews \u2014 often years after project completion.'
data['cap.traceabilitypage.s3.card1.desc'] = 'All quality dossiers \u2014 including Mill Test Reports (MTRs), CMM dimensional reports, First Article Inspection Reports (FAIR), surface roughness certificates, and Certificates of Conformance (CoC) \u2014 are digitally archived on redundant servers with off-site backup for a minimum of 10 years. Records are indexed by part number, heat number, customer PO, and date range for rapid retrieval.'
data['cap.traceabilitypage.s3.card2.desc'] = 'When your quality or procurement team faces an audit, customer investigation, or downstream supplier investigation, we can retrieve and deliver the complete quality dossier for any historical order within 24 hours. Our document control team is trained to support auditor requests, providing certified copies of original MTRs, inspection reports, and process certifications.'
data['cap.traceabilitypage.s3.badge35_label'] = 'Minimum quality record retention'

# S4: FAQ
data['cap.traceabilitypage.s4.subtitle'] = 'Answers to the most critical material traceability and compliance questions from procurement and regulatory teams.'
data['cap.traceabilitypage.s4.a1'] = 'Every shipment includes a comprehensive quality dossier containing: (1) Certified Mill Test Report (MTR) per EN 10204 Type 3.1 documenting chemical composition, mechanical properties, and heat treatment parameters; (2) Certificate of Conformance (CoC) confirming all manufacturing and inspection processes meet specifications; (3) Heat number and batch lot traceability linking the finished component back to the original mill ingot; and (4) CMM dimensional inspection reports with GD&T verification. Additional documentation \u2014 including DFARS compliance certificates, RoHS/REACH declarations, and AS9102 FAIR \u2014 is available upon request.'
data['cap.traceabilitypage.s4.a2'] = 'Yes. BOZE CNC is fully capable of supporting DFARS 252.225-7014 compliant production. Upon procurement request, we can source titanium that is melted in the United States or other qualifying countries (Australia, Canada, Japan, Sweden, Belgium, United Kingdom). The DFARS compliance certificate and corresponding mill origin documentation are provided as part of the quality dossier. We recommend specifying DFARS requirements at the time of RFQ to ensure appropriate material sourcing and segregation.'
data['cap.traceabilitypage.s4.a3'] = 'We employ micro-laser-marking for permanent part identification \u2014 including serial numbers, heat lot IDs, date codes, and Data Matrix (QR) codes. Laser marking is preferred over inkjet or chemical etching for its permanence, readability through surface treatments (anodizing, passivation), and compliance with MIL-STD-130 (DoD item identification) and UDI (Unique Device Identification for medical devices). Marking parameters are validated for each titanium grade to ensure legibility without compromising fatigue performance or corrosion resistance.'
data['cap.traceabilitypage.s4.a4'] = 'All quality records are retained for a minimum of 10 years from the date of shipment. Records are stored on redundant digital servers with off-site backup and are indexed by part number, heat number, customer purchase order, and date range. In the event of an audit, recall, or customer quality investigation, our document control team can retrieve and deliver the complete quality dossier within 24 hours. Certified copies of original MTRs and inspection reports are available upon request.'
data['cap.traceabilitypage.s4.cta'] = 'Have specific compliance requirements for your titanium program?'
data['cap.traceabilitypage.s4.cta_btn'] = 'Submit Compliance Requirements'

with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Count new keys
new_keys = [k for k in data if k.startswith('cap.traceabilitypage.s') and not k.startswith('cap.traceabilitypage.sa')]
print(f'Done! en.json has {len(data)} total keys')
print(f'Traceability s-keys: {len(new_keys)}')
