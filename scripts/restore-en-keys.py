import json

with open('src/i18n/translations/en.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# badge43
data['cap.inspectionpage.badge43'] = 'Q&A'

# S2 keys
data['cap.inspectionpage.s2.subtitle'] = 'Beyond dimensional inspection, we offer a full suite of specialized testing services to validate material integrity, mechanical properties, and long-term reliability of titanium components.'
data['cap.inspectionpage.s2.card1.desc'] = 'Surface flaw detection for titanium components using high-sensitivity fluorescent penetrants. Capable of detecting cracks, porosity, laps, and seams as fine as 1 \u00b5m wide. Performed in dedicated clean-room conditions with UV inspection booths. Nadcap-accredited processes available for aerospace and medical applications.'
data['cap.inspectionpage.s2.card1.label1'] = 'Sensitivity'
data['cap.inspectionpage.s2.card1.val1'] = 'Crack detection down to 1 \u00b5m width'
data['cap.inspectionpage.s2.card1.val2'] = 'ASTM E1417 / AMS 2644'
data['cap.inspectionpage.s2.card2.desc'] = 'Volumetric examination for subsurface discontinuities in titanium \u2014 including inclusions, voids, and delaminations. Immersion and contact UT methods available for complex geometries. Full C-scan imaging provides permanent record of internal material integrity.'
data['cap.inspectionpage.s2.card2.label1'] = 'Detection'
data['cap.inspectionpage.s2.card2.val1'] = 'Inclusions & voids > 0.5 mm diameter'
data['cap.inspectionpage.s2.card2.val2'] = 'ASTM E2375 / AMS 2631'
data['cap.inspectionpage.s2.card3.desc'] = 'Comprehensive 3D dimensional analysis using programmatic CMM cycles. Every GD&T callout per ASME Y14.5 \u2014 including flatness, concentricity, true position, profile of a surface, and runout \u2014 is verified against engineering specifications. Detailed color-coded deviation plots provided.'
data['cap.inspectionpage.s2.card3.label1'] = 'Accuracy'
data['cap.inspectionpage.s2.card3.val1'] = '\u00b10.0015 mm volumetric'
data['cap.inspectionpage.s2.card3.val2'] = 'ASME Y14.5-2009 / ISO 1101'
data['cap.inspectionpage.s2.card4.title'] = 'Mechanical Properties & Tensile Testing'
data['cap.inspectionpage.s2.card4.desc'] = 'Verification of tensile strength, yield strength, elongation, and hardness for titanium material verification. Hardness testing per Rockwell C and Brinell scales. Tensile testing per ASTM E8/E8M on qualified sub-contract partner equipment with full accreditation.'
data['cap.inspectionpage.s2.card4.label1'] = 'Hardness'
data['cap.inspectionpage.s2.card4.val1'] = 'Rockwell C, Brinell'
data['cap.inspectionpage.s2.card4.val2'] = 'ASTM E8/E8M, ASTM E18, ASTM E10'
data['cap.inspectionpage.s2.label_std'] = 'Standard'

# S3 keys
data['cap.inspectionpage.s3.subtitle'] = 'Systematic inspection sequence ensuring every titanium component meets or exceeds specified requirements before shipment.'
data['cap.inspectionpage.s3.step1.title'] = 'Material Verification & PMI'
data['cap.inspectionpage.s3.step1.desc'] = 'Every incoming titanium lot is tested using OES spectrometry for positive material identification. Chemical composition is verified against the certified mill test report (EN 10204 3.1 MTR). Only material matching specified grade chemistry is released to production.'
data['cap.inspectionpage.s3.step2.desc'] = 'First machined part from each production run undergoes 100% layout inspection on CMM. Full AS9102-compliant FAIR with ballooned drawings, actual vs. nominal measurements, and GD&T verification. Review and sign-off by senior quality inspector before production release.'
data['cap.inspectionpage.s3.step3.desc'] = 'On-machine probing and statistical process control (SPC) for real-time dimensional monitoring. Control charts track critical features. Surface roughness verification at defined intervals. Tool wear monitoring through spindle load analysis.'
data['cap.inspectionpage.s3.step4.desc'] = 'Final dimensional gating using programmatic CMM cycles on sampled or 100% of parts. Surface finish certification. NDT (FPI/UT) where specified. Comprehensive quality dossier compiled \u2014 including MTRs, CMM reports, CoC, and inspection certificates.'

# S4 keys
data['cap.inspectionpage.s4.subtitle'] = 'Detailed specifications of our inspection and metrology equipment \u2014 all maintained under strict ISO 17025 calibration schedules.'
data['cap.inspectionpage.s4.col2'] = 'Measurement Range'

# S5 keys
data['cap.inspectionpage.s5.badge'] = 'Inspection & Testing FAQ'
data['cap.inspectionpage.s5.title'] = 'Procurement'
data['cap.inspectionpage.s5.subtitle'] = 'Answers to the most common inspection and testing questions from procurement engineers.'
data['cap.inspectionpage.s5.a1'] = 'Our in-house metrology lab is equipped with a ZEISS CONTURA G2 CMM (bridge-type, 1.9 \u00b5m volumetric accuracy), OGP SmartScope optical comparators, and Mitutoyo SJ-410 surface roughness testers. For material verification, we use a SPECTROMAXx Optical Emission Spectrometer for rapid PMI analysis. All equipment is calibrated per ISO 17025 traceable standards with full calibration certificates on file.'
data['cap.inspectionpage.s5.a2'] = 'Inspection scope is determined by customer specification and part criticality. High-volume production typically follows AQL-based sampling (ANSI/ASQ Z1.4) with CMM verification at defined intervals. Critical aerospace and medical components receive 100% dimensional inspection with full CMM reports. First-article inspection (FAI) per AS9102 is standard for all new programs. Surface roughness, NDT, and material certification are added per engineering requirements.'
data['cap.inspectionpage.s5.a3'] = 'We offer Fluorescent Penetrant Inspection (FPI) per ASTM E1417 for surface crack detection down to 1 \u00b5m width, and Ultrasonic Testing (UT) per ASTM E2375 for subsurface volumetric examination. Our NDT processes are Nadcap-accredited for aerospace applications. Additional capabilities include eddy current testing for surface conductivity verification and leak testing for sealed assemblies.'
data['cap.inspectionpage.s5.a4'] = 'Yes. Every shipment includes a comprehensive quality dossier containing: (1) Certified Mill Test Reports (MTRs) per EN 10204 Type 3.1; (2) Certificate of Conformance (CoC); (3) CMM dimensional inspection reports with GD&T verification; (4) Surface roughness certification; and (5) NDT reports where specified. AS9102 FAIR documentation is provided for aerospace programs. All records are archived and retrievable.'
data['cap.inspectionpage.s5.cta'] = 'Have specific inspection requirements? Contact our quality engineering team.'
data['cap.inspectionpage.s5.cta_btn'] = 'Submit Inspection Requirements'

with open('src/i18n/translations/en.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f'Done! {len(data)} keys total')
