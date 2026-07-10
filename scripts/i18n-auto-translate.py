#!/usr/bin/env python3
"""
i18n-auto-translate.py
Comprehensive i18n automation for 7 capabilities components.
Phase 1: Extract & refactor (this script)
Phase 2: Translate (separate script)
"""
import json, os, re, sys, shutil

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANS_DIR = os.path.join(BASE, 'src', 'i18n', 'translations')
COMP_DIR = os.path.join(BASE, 'src', 'components', 'capabilities')
BACKUP_DIR = os.path.join(BASE, 'backup_capabilities')

TARGET_LANGS = ['de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl']

# ── All translation keys and their English values for all 7 components ──
# Structured as { 'key': 'english text' }

ALL_KEYS = {}

def add(key, text):
    ALL_KEYS[key] = text

# ===========================================
# ManufacturingPage.astro KEYS
# ===========================================
P = 'cap.mfg'
add(f'{P}.s1.badge', 'Titanium CNC Machining Processes')
add(f'{P}.s1.title', 'High-Precision')
add(f'{P}.s1.highlight', 'Titanium Machining Processes')
add(f'{P}.s1.sub', 'Three-axis, five-axis, Swiss turning, and wire EDM \u2014 every subtractive manufacturing discipline engineered specifically for titanium\u2019s unique metallurgical challenges.')

add(f'{P}.p1.title', '5-Axis CNC Milling')
add(f'{P}.p1.desc', 'Full 5-axis simultaneous contouring for complex aerospace monolithic bulkheads, medical orthopedic implants, and thin-wall structural components. Zero-interruption machining reduces setup errors and shortens lead times.')
add(f'{P}.p1.m1', '5-Axis Linkage')
add(f'{P}.p1.v1', 'Full Simultaneous')
add(f'{P}.p1.m2', 'Max Workspace')
add(f'{P}.p1.v2', '1,200 \u00d7 800 \u00d7 600 mm')
add(f'{P}.p1.m3', 'Positional Accuracy')
add(f'{P}.p1.v3', '\u00b10.003 mm')

add(f'{P}.p2.title', 'Precision Swiss Lathe Turning')
add(f'{P}.p2.desc', 'Sliding-headstock Swiss-type turning for micro-scale titanium fasteners, bone screws, dental abutments, and long-shaft components. High-volume production maintains micron-level repeatability across millions of parts.')
add(f'{P}.p2.m1', 'Diameter Range')
add(f'{P}.p2.v1', '\u00f8 1.0 \u2013 32 mm')
add(f'{P}.p2.m2', 'Micro-machining')
add(f'{P}.p2.v2', 'Down to \u00f8 0.5 mm')
add(f'{P}.p2.m3', 'Repeatability')
add(f'{P}.p2.v3', 'Cpk \u2265 1.67')

add(f'{P}.p3.title', 'Wire EDM & EDM Sinking')
add(f'{P}.p3.desc', 'Thermal erosion with zero mechanical stress for ultra-hard titanium alloys. Produces sharp internal corners (wire \u00f8 0.1 mm), micro-slots, and delicate thin-wall features impossible with conventional tooling.')
add(f'{P}.p3.m1', 'Zero Thermal Stress')
add(f'{P}.p3.v1', 'No HAZ / Stress-free')
add(f'{P}.p3.m2', 'Sharp Corners')
add(f'{P}.p3.v2', 'Internal R \u2264 0.05 mm')
add(f'{P}.p3.m3', 'Thin-Wall Features')
add(f'{P}.p3.v3', 'Down to 0.3 mm')

add(f'{P}.spec.badge', 'Technical Data Sheet')
add(f'{P}.spec.title', 'Technical')
add(f'{P}.spec.highlight', 'Specifications')
add(f'{P}.spec.sub', 'Certified precision metrics for procurement engineers \u2014 every tolerance range verified through in-house CMM metrology per ASME Y14.5 and ISO 2768 standards.')
add(f'{P}.spec.h1', 'Capability Metric')
add(f'{P}.spec.h2', 'Technical Limits / Specifications')
add(f'{P}.spec.h3', 'Supported Materials (Entities)')
add(f'{P}.spec.note', 'All listed tolerances reflect achievable production-level capabilities on qualified titanium grades. Tighter tolerances available on engineering review. Support for Hi-Ni, Hi-Cr, Co-Cr alloys also available.')

# Rows
add(f'{P}.sr1.m', 'Dimensional Tolerance')
add(f'{P}.sr1.v', 'Down to \u00b10.005 mm (Micron-level precision)')
add(f'{P}.sr1.mat', 'Grade 2, Grade 5, Ti-6Al-4V ELI')
add(f'{P}.sr2.m', 'Surface Roughness (Ra)')
add(f'{P}.sr2.v', 'As low as Ra 0.4 \u03bcm (Finishing options available)')
add(f'{P}.sr2.mat', 'All Titanium Alloys')
add(f'{P}.sr3.m', 'Max Machining Size')
add(f'{P}.sr3.v', 'Up to 1,200 mm \u00d7 800 mm \u00d7 600 mm')
add(f'{P}.sr3.mat', 'Grade 5 / Ti-6Al-4V Blocks')
add(f'{P}.sr4.m', 'Wall Thickness (Min)')
add(f'{P}.sr4.v', '0.5 mm (Thin-wall structural components)')
add(f'{P}.sr4.mat', 'Grade 5 (Ti-6Al-4V)')
add(f'{P}.sr5.m', 'Spindle Speed (Milling)')
add(f'{P}.sr5.v', 'Up to 20,000 RPM (HSK-A63 tooling)')
add(f'{P}.sr5.mat', 'Grade 5, Grade 23, Grade 2')
add(f'{P}.sr6.m', 'Threading Capacity')
add(f'{P}.sr6.v', 'M1.6 \u2013 M30 internal/external threading')
add(f'{P}.sr6.mat', 'All Titanium Alloys')

add(f'{P}.q.badge', 'Quality & Compliance Infrastructure')
add(f'{P}.q.title', 'Rigorous Quality Infrastructure &')
add(f'{P}.q.highlight', 'EEAT Alignment')
add(f'{P}.q.sub', 'Every titanium component is backed by certified quality systems, full chain-of-custody material traceability, and multi-stage inspection \u2014 aligning with Google\u2019s Experience, Expertise, Authoritativeness, and Trustworthiness (EEAT) framework.')
add(f'{P}.q.ltitle', 'Quality Management Certifications')
add(f'{P}.q.rtitle', 'Material Traceability & Metrology')

add(f'{P}.as9100', 'AS9100 Rev D')
add(f'{P}.as9100_f', 'Aerospace Quality Management Standard')
add(f'{P}.as9100_d', 'Full-scope AS9100D quality management system covering design, development, production, and distribution of titanium aerospace components. Regular surveillance audits ensure continuous compliance.')
add(f'{P}.iso13485', 'ISO 13485:2016')
add(f'{P}.iso13485_f', 'Medical Device QMS')
add(f'{P}.iso13485_d', 'Process controls aligned with ISO 13485 for the manufacture of medical-grade titanium components, including surgical implants, orthopedic instruments, and dental prosthetics.')
add(f'{P}.iso9001', 'ISO 9001:2015')
add(f'{P}.iso9001_f', 'General Quality Management')
add(f'{P}.iso9001_d', 'Foundational quality management framework with documented processes for continuous improvement, corrective/preventive action, and customer-focused output across all departments.')

add(f'{P}.en10204', 'EN 10204 Type 3.1 Mill Test Reports')
add(f'{P}.en10204_d', 'Every batch of titanium raw material is accompanied by certified MTRs documenting chemical composition, mechanical properties, and heat treatment parameters. Full chain-of-custody documentation from sponge to finished component \u2014 100% material traceability.')
add(f'{P}.cmm', 'CMM, OGP & Surface Profilometry')
add(f'{P}.cmm_d', 'In-house metrology lab equipped with ZEISS CONTURA G2 CMM (1.9 \u03bcm accuracy), OGP SmartScope optical comparators, and Mitutoyo SJ-410 surface roughness testers. All instruments calibrated per ISO 17025 traceable standards.')
add(f'{P}.pmi', 'Positive Material Identification (PMI)')
add(f'{P}.pmi_d', 'On-site SPECTROMAXx Optical Emission Spectrometry (OES) confirms elemental composition within 30 seconds per ASTM E415, ensuring every incoming batch matches the specified grade chemistry before production release.')
add(f'{P}.ndt', 'Non-Destructive Testing (NDT)')
add(f'{P}.ndt_d', 'Fluorescent Penetrant Inspection (FPI) for surface flaw detection and ultrasonic (UT) for subsurface volumetric examination. Nadcap-accredited processes available for critical aerospace and medical applications.')

add(f'{P}.certified', 'Certified')
add(f'{P}.compliant', 'Compliant')

add(f'{P}.faq.badge', 'Engineering FAQ')
add(f'{P}.faq.title', 'Frequently Asked')
add(f'{P}.faq.highlight', 'Engineering Questions')
add(f'{P}.faq.sub', 'Direct technical answers to the high-intent procurement and engineering questions most frequently searched on Google by titanium component buyers.')

add(f'{P}.faq1.q', 'How does BOZE CNC ensure tool-wear control when machining Grade 5 Titanium?')
add(f'{P}.faq1.a', "We employ high-rigidity 5-axis machines, custom carbide-coated tooling (AlTiN + TiAlN multi-layer PVD coatings), and high-pressure through-spindle coolant (> 70 bar / 1,015 PSI) to actively suppress work-hardening and cutting heat generation during Ti-6Al-4V machining. Tool-path strategies incorporate variable helix angles and trochoidal milling to distribute thermal load evenly, maintaining micron-level dimensional stability across extended production runs.")
add(f'{P}.faq2.q', 'Can Ti-6Al-4V be CNC machined to 5-micron tolerances for medical implants?')
add(f'{P}.faq2.a', 'Yes. Our temperature-controlled production environment (20 \u00b11\u00b0C) combined with high-rigidity 5-axis CNC platforms and real-time thermal compensation systems enables consistent achievement of \u00b10.005 mm (5-micron) dimensional tolerances on Ti-6Al-4V ELI (Grade 23) medical implant components.')
add(f'{P}.faq3.q', 'What is the typical lead time for a custom titanium CNC machined part?')
add(f'{P}.faq3.a', 'Standard lead times range from 2\u20134 weeks for rapid prototyping (1\u201310 pcs) and 4\u20138 weeks for production volumes (100\u20135,000+ pcs), depending on complexity, material certification requirements, and surface finishing specifications.')
add(f'{P}.faq4.q', 'Do you provide full material traceability and certified test reports?')
add(f'{P}.faq4.a', 'Absolutely. Every shipment includes EN 10204 Type 3.1 Mill Test Reports (MTRs) documenting chemical composition, mechanical properties, and heat treatment traceability. We maintain full chain-of-custody documentation from mill to finished component.')
add(f'{P}.faq5.q', 'Which quality certifications does BOZE CNC hold for titanium manufacturing?')
add(f'{P}.faq5.a', 'BOZE CNC operates under a quality framework aligned with AS9100 Rev D (aerospace), ISO 13485:2016 (medical devices), and ISO 9001:2015. Our manufacturing processes and quality management systems meet the stringent requirements of aerospace, medical, defense, and industrial applications.')

add(f'{P}.cta.t', 'Have a specific technical question about your titanium project?')
add(f'{P}.cta.btn', 'Submit Engineering RFQ')

# ===========================================
# EngineeringPage.astro KEYS (shorter form)
# ===========================================
E = 'cap.eng'
# Section 1
add(f'{E}.s1.badge', 'Engineering Core Competencies')
add(f'{E}.s1.title', 'Core Engineering')
add(f'{E}.s1.highlight', 'Service Pillars')
add(f'{E}.s1.sub', 'Three specialized engineering disciplines that transform complex titanium designs into manufacturable, cost-optimized production programs.')
add(f'{E}.p1.title', 'Titanium-Specific DFM Review')
add(f'{E}.p1.desc', "Design for Manufacturing audits tailored to titanium's unique metallurgical behavior \u2014 low thermal conductivity, high work-hardening rate, and elastic springback.")
add(f'{E}.p1.i1', "Corner Radii Optimization \u2014 Avoid sharp internal corners (< R 0.5 mm) to prevent tool chipping and stress risers in Ti-6Al-4V")
add(f'{E}.p1.i2', 'Wall Thickness Verification \u2014 Maintain minimum 0.5 mm wall to avoid resonant chatter and thermal warpage')
add(f'{E}.p1.i3', 'Thread Engagement Depth \u2014 Optimize internal thread depth in Grade 5 to prevent tap breakage; thread milling recommended for M1.6\u2013M6')
add(f'{E}.p2.title', 'Advanced CAD/CAM & Multi-Axis Simulation')
add(f'{E}.p2.desc', 'Full in-house CAD/CAM capability using Mastercam and HyperMILL for simultaneous 5-axis toolpath programming. Every program is validated through full-machine digital twin simulation.')
add(f'{E}.p2.i1', 'Simultaneous 5-Axis Programming \u2014 Full synchronous machining of complex organic geometries and undercuts')
add(f'{E}.p2.i2', 'Collision Avoidance Verification \u2014 Full-machine digital twin with holder, spindle, and fixture collision detection')
add(f'{E}.p2.i3', 'Adaptive Clearing Toolpaths \u2014 High-frequency micro-engagement cuts that reduce heat accumulation by up to 40% vs conventional toolpaths')
add(f'{E}.p3.title', 'Value Engineering & Cost-Out Collaboration')
add(f'{E}.p3.desc', 'Systematic cost optimization without compromising functional performance. From raw material form selection (plate vs near-net forgings) to process consolidation.')
add(f'{E}.p3.i1', 'Raw Material Yield Optimization \u2014 Nesting analysis and form selection to minimize buy-to-fly ratio (target < 3:1 for Ti-6Al-4V)')
add(f'{E}.p3.i2', 'Process Consolidation \u2014 Multi-operation merging on mill-turn platforms; eliminate secondary EDM by wire-cut pre-form strategy')
add(f'{E}.p3.i3', 'Cycle Time Analysis \u2014 Per-operation time study with bottleneck identification; average 15\u201325% cycle time reduction on first-pass programs')

# Workflow
add(f'{E}.wf.badge', 'Engineering Workflow')
add(f'{E}.wf.title', 'From Blueprint to')
add(f'{E}.wf.highlight', 'Production-Ready Code')
add(f'{E}.wf.sub', 'A deterministic 4-stage engineering sequence that eliminates uncertainty before production begins.')
add(f'{E}.st1.t', 'Secure Blueprint & CAD Ingest')
add(f'{E}.st1.b', 'Within 24 Hours')
add(f'{E}.st1.d', 'Accepting native CAD files (.STEP, .IGES, .SolidWorks, .AutoCAD) and GD&T-annotated 2D drawings. All data is received and processed in a secure, NDA-compliant digital environment.')
add(f'{E}.st2.t', 'Titanium Feasibility & DFM Review')
add(f'{E}.st2.b', 'Technical Audit')
add(f'{E}.st2.d', "Evaluating the selected material grade against every geometric feature in the design. Identifying localized thermal stress risks, hard-to-reach tool access zones, and potential fixturing challenges.")
add(f'{E}.st3.t', 'Collaborative Cost-Out Proposal')
add(f'{E}.st3.b', 'Engineering Feedback')
add(f'{E}.st3.d', 'Issuing a detailed DFM report with annotated drawings \u2014 recommending modifications to corner radii, wall thickness distributions, tolerance callouts, and thread specifications.')
add(f'{E}.st4.t', 'CAM Programming & Virtual Prototyping')
add(f'{E}.st4.b', 'Digital Verification')
add(f'{E}.st4.d', 'Generating multi-axis G-code and running full-machine digital twin simulations to verify tool interference, spindle load profiles, and surface finish predictions.')
add(f'{E}.wf.note', 'Average DFM review turnaround: 24\u201348 hours from CAD submission to engineering feedback report.')

# Matrix table
add(f'{E}.mat.badge', 'Engineering Value Matrix')
add(f'{E}.mat.title', 'Standard vs.')
add(f'{E}.mat.highlight', 'BOZE Engineered Approach')
add(f'{E}.mat.sub', 'Quantifiable evidence of how our front-end engineering transforms conventional machining into precision-optimized, cost-efficient production.')
add(f'{E}.mat.h1', 'Engineering Dimension')
add(f'{E}.mat.h2', 'Standard Machining Approach')
add(f'{E}.mat.h3', 'BOZE Engineered & Simulated Approach')
add(f'{E}.mat.note', 'Performance data based on actual production runs of Ti-6Al-4V (Grade 5) aerospace and medical components. Results may vary.')
# Rows
add(f'{E}.mr1.d', 'Toolpath Strategy')
add(f'{E}.mr1.s', 'Conventional linear cutting (High heat concentration)')
add(f'{E}.mr1.b', 'Trochoidal & Adaptive toolpaths (Low heat generation)')
add(f'{E}.mr2.d', 'Thin-Wall Geometry Control')
add(f'{E}.mr2.s', 'High deflection risk (\u00b10.05 mm typical)')
add(f'{E}.mr2.b', 'Balanced dynamic milling (Holds up to \u00b10.01 mm)')
add(f'{E}.mr3.d', 'Thread Tapping in Ti-6Al-4V')
add(f'{E}.mr3.s', 'High tap breakage rates (frequent tool changes)')
add(f'{E}.mr3.b', 'Thread milling via specialized rigid CNC cycles (zero breakage)')
add(f'{E}.mr4.d', 'Yield Rate / First-Pass Quality')
add(f'{E}.mr4.s', 'Variable based on operator skill (85\u201392% typical)')
add(f'{E}.mr4.b', 'Controlled via 100% digital twin simulation (> 98% first-pass)')
add(f'{E}.mr5.d', 'Surface Finish Consistency')
add(f'{E}.mr5.s', 'Ra 1.6\u20133.2 \u03bcm (tool-path dependent)')
add(f'{E}.mr5.b', 'Ra 0.4\u20130.8 \u03bcm (predicted and verified via CAM)')
add(f'{E}.mr6.d', 'Material Buy-to-Fly Ratio')
add(f'{E}.mr6.s', '4:1 \u2013 6:1 (standard nesting)')
add(f'{E}.mr6.b', '< 3:1 (optimized nesting + form selection)')

# FAQ
add(f'{E}.faq.badge', 'Engineering FAQ')
add(f'{E}.faq.title', 'Engineer-to-Engineer')
add(f'{E}.faq.highlight', 'Technical Q&A')
add(f'{E}.faq.sub', 'Direct answers to the most frequent DFM and engineering questions from procurement engineers.')
add(f'{E}.faq1.q', 'How to reduce stress concentration in thin-walled Grade 5 titanium aerospace components?')
add(f'{E}.faq1.a', 'Stress concentration in thin-walled Ti-6Al-4V geometries is addressed through three coordinated engineering strategies: Corner Radii Optimization, Balanced Dynamic Milling, and Sequential Roughing Strategy.')
add(f'{E}.faq2.q', 'What is included in a standard DFM review for titanium CNC parts?')
add(f'{E}.faq2.a', 'Our DFM review covers six mandatory checkpoints: titanium-specific machinability assessment, feature-based tool access analysis, tolerance stack-up evaluation, thin-wall deflection prediction, surface finish validation, and raw material utilization optimization.')
add(f'{E}.faq3.q', 'How can BOZE engineering reduce cycle times for existing titanium production programs?')
add(f'{E}.faq3.a', 'Our value engineering team conducts a systematic cycle time analysis across four dimensions: Toolpath Optimization, Process Consolidation, Tooling Strategy, and Fixture Optimization.')
add(f'{E}.faq4.q', 'Which CAD/CAM software platforms does BOZE engineering support?')
add(f'{E}.faq4.a', 'We accept native files from SolidWorks, Autodesk Inventor, AutoCAD, and neutral formats including STEP, IGES, and Parasolid. CAM programming uses Mastercam and HyperMILL.')
add(f'{E}.cta.t', 'Submit your design for a complimentary DFM feasibility assessment.')
add(f'{E}.cta.btn', 'Submit CAD for DFM Review')

# ===========================================
# CapacityPage.astro KEYS (abbreviated)
# ===========================================
C = 'cap.cap'
add(f'{C}.s1.badge', 'Production Capacity Dashboard')
add(f'{C}.s1.title', 'Capacity & Throughput')
add(f'{C}.s1.highlight', 'Metrics')
add(f'{C}.s1.sub', 'Quantitative production capacity indicators \u2014 verified through ERP-driven data collection and presented for procurement engineering evaluation.')
add(f'{C}.m1.val', '45,000+')
add(f'{C}.m1.lbl', 'Parts / Year')
add(f'{C}.m1.desc', 'Total precision titanium component throughput across all production tiers \u2014 from prototype to high-volume serial production.')
add(f'{C}.m2.val', '8,500+')
add(f'{C}.m2.lbl', 'Spindle Hours / Month')
add(f'{C}.m2.desc', 'Aggregated multi-axis CNC machining operational capacity per month.')
add(f'{C}.m3.val', '35+')
add(f'{C}.m3.lbl', 'Advanced CNC Units')
add(f'{C}.m3.desc', 'Fleet specialized exclusively in reactive and hard metal machining \u2014 Ti-6Al-4V, Grade 2, Grade 23, and nickel-cobalt superalloys.')
add(f'{C}.m4.val', '24/7')
add(f'{C}.m4.lbl', '\u201cLights-Out\u201d Shift')
add(f'{C}.m4.desc', 'Continuous automated pallet-changing operation with robotic workpiece loading, minimizing human downtime and maximizing OEE.')

add(f'{C}.mat.badge', 'Production Scaling Matrix')
add(f'{C}.mat.title', 'From Prototype to')
add(f'{C}.mat.highlight', 'Mass Production')
add(f'{C}.mat.sub', 'Three distinct production tiers engineered to match your program maturity.')
add(f'{C}.mat.h1', 'Production Tier')
add(f'{C}.mat.h2', 'Typical Volume (Units)')
add(f'{C}.mat.h3', 'Primary Technical Focus')
add(f'{C}.mat.h4', 'Standard Lead Time')
add(f'{C}.mat.note', 'Production tiers are not fixed boundaries. Programs can seamlessly transition from prototype to mass production under a single quality plan.')
add(f'{C}.mr1.t', 'Prototyping & R&D')
add(f'{C}.mr1.v', '1 \u2013 10 pieces')
add(f'{C}.mr1.f', 'Rapid CAD/CAM deployment, toolpath validation, geometric feasibility, material grade confirmation.')
add(f'{C}.mr1.l', '3 \u2013 7 Working Days')
add(f'{C}.mr2.t', 'Low-Volume High-Mix (LVHM)')
add(f'{C}.mr2.v', '11 \u2013 500 pieces')
add(f'{C}.mr2.f', 'Fixture optimization, cycle-time stabilization, early-stage CMM reporting, process qualification.')
add(f'{C}.mr2.l', '2 \u2013 3 Weeks')
add(f'{C}.mr3.t', 'High-Volume Mass Production')
add(f'{C}.mr3.v', '500 \u2013 5,000+ pieces')
add(f'{C}.mr3.f', 'Automated Swiss turning, multi-pallet continuous milling, rigid SPC control, milestone delivery.')
add(f'{C}.mr3.l', '4 \u2013 6 Weeks (Milestone Delivery Available)')

add(f'{C}.res.badge', 'Supply Chain Resilience')
add(f'{C}.res.title', 'Production Resilience &')
add(f'{C}.res.highlight', 'Inventory Redundancy')
add(f'{C}.res.sub', 'Multi-layered risk mitigation strategies designed to guarantee on-time delivery.')
add(f'{C}.res.mat_t', 'Raw Material Security & Strategic Stock')
add(f'{C}.res.mat_d', 'Maintained through long-term strategic partnerships with tier-1 titanium mills. Our warehouse carries strategic safety stock of Grade 5, Grade 23, and Grade 2.')
add(f'{C}.res.mach_t', 'Machinery Redundancy & Zero-Downtime Switchover')
add(f'{C}.res.mach_d', 'Every critical machine specification is backed by redundant sister machines within our fleet. Production programs can be transferred within 2 hours with zero impact to the critical delivery path.')
add(f'{C}.cta.t', 'Ready to discuss your production volume requirements?')
add(f'{C}.cta.btn', 'Request Capacity Assessment')

# ===========================================
# QualityPage.astro KEYS (abbreviated)
# ===========================================
Q = 'cap.qual'
add(f'{Q}.s1.badge', 'Quality Management Framework')
add(f'{Q}.s1.title', 'Industry Certifications &')
add(f'{Q}.s1.highlight', 'Compliance Standards')
add(f'{Q}.s1.sub', 'Every titanium component is manufactured under a multi-standard quality management framework audited by international registrars.')
add(f'{Q}.s2.badge', 'Metrology & Inspection Infrastructure')
add(f'{Q}.s2.title', 'Advanced Metrology &')
add(f'{Q}.s2.highlight', 'Inspection Equipment Fleet')
add(f'{Q}.s2.sub', 'In-house metrology laboratory equipped with industrial-grade inspection instruments \u2014 all calibrated per ISO 17025 traceable standards.')
add(f'{Q}.wf.badge', 'Closed-Loop Quality Control')
add(f'{Q}.wf.title', 'IQC to OQC:')
add(f'{Q}.wf.highlight', 'Closed-Loop Quality Workflow')
add(f'{Q}.wf.sub', 'Four-stage quality control chain from raw material ingest through final pre-shipment metrology audit.')
add(f'{Q}.doc.badge', 'Quality Deliverables')
add(f'{Q}.doc.title', 'Deliverable')
add(f'{Q}.doc.highlight', 'Documentation Matrix')
add(f'{Q}.doc.sub', 'Every shipment includes a comprehensive quality dossier.')
add(f'{Q}.doc.h1', 'Compliance Document')
add(f'{Q}.doc.h2', 'What It Verifies')
add(f'{Q}.doc.h3', 'Applicable Standard / Regulation')
add(f'{Q}.doc.note', 'Additional documentation such as surface roughness certificates, NDT reports, and material traceability matrices are available upon request.')
add(f'{Q}.faq.badge', 'Quality Assurance FAQ')
add(f'{Q}.faq.title', 'Compliance & Inspection')
add(f'{Q}.faq.highlight', 'Q&A')
add(f'{Q}.faq.sub', 'Answers to the most frequent quality assurance questions from procurement engineers.')
add(f'{Q}.cta.t', 'Request our quality management brochure or schedule a facility audit.')
add(f'{Q}.cta.btn', 'Request Quality Documentation')


# ===========================================
# InspectionPage.astro KEYS (abbreviated)
# ===========================================
I = 'cap.insp'
add(f'{I}.s1.badge', 'Metrology & Inspection Laboratory')
add(f'{I}.s1.title', 'In-House Metrology &')
add(f'{I}.s1.highlight', 'Inspection Laboratory')
add(f'{I}.s1.sub', 'Fully equipped metrology laboratory with industrial-grade inspection instruments for full dimensional, chemical, mechanical, and surface integrity validation.')
add(f'{I}.s2.badge', 'Specialized Testing')
add(f'{I}.s2.title', 'Non-Destructive &')
add(f'{I}.s2.highlight', 'Specialized Testing')
add(f'{I}.s2.sub', 'Beyond dimensional inspection, we offer a full suite of specialized testing services.')
add(f'{I}.wf.badge', 'Inspection Workflow')
add(f'{I}.wf.title', 'Inspection & Testing')
add(f'{I}.wf.highlight', 'Workflow')
add(f'{I}.wf.sub', 'Systematic inspection sequence ensuring every component meets specified requirements.')
add(f'{I}.eq.badge', 'Equipment Specifications')
add(f'{I}.eq.title', 'Inspection Equipment')
add(f'{I}.eq.highlight', 'Technical Specs')
add(f'{I}.eq.sub', 'Detailed specifications of our inspection and metrology equipment \u2014 all maintained under strict ISO 17025 calibration schedules.')
add(f'{I}.faq.badge', 'Inspection & Testing FAQ')
add(f'{I}.faq.title', 'Procurement')
add(f'{I}.faq.highlight', 'Q&A')
add(f'{I}.faq.sub', 'Answers to the most common inspection and testing questions from procurement engineers.')
add(f'{I}.cta.t', 'Have specific inspection requirements? Contact our quality engineering team.')
add(f'{I}.cta.btn', 'Submit Inspection Requirements')

# ===========================================
# TraceabilityPage.astro KEYS (abbreviated)
# ===========================================
T = 'cap.trc'
add(f'{T}.s1.badge', 'Digital Chain of Custody')
add(f'{T}.s1.title', 'The Unbroken Chain:')
add(f'{T}.s1.highlight', 'End-to-End Tracking Lifecycle')
add(f'{T}.s1.sub', 'From raw titanium ingot heat lots to permanently marked finished components \u2014 every transfer, test, and transformation is digitally recorded.')
add(f'{T}.mat.badge', 'Compliance & Regulatory Alignment')
add(f'{T}.mat.title', 'Global Material')
add(f'{T}.mat.highlight', 'Compliance Matrix')
add(f'{T}.mat.sub', 'Every titanium component is manufactured in full alignment with international compliance frameworks.')
add(f'{T}.arc.badge', 'Long-Term Data Archival')
add(f'{T}.arc.title', 'Post-Project Accountability &')
add(f'{T}.arc.highlight', 'Long-Term Data Archival')
add(f'{T}.arc.sub', 'We maintain comprehensive digital archives to support regulatory audits and procurement compliance reviews.')
add(f'{T}.faq.badge', 'Traceability & Compliance FAQ')
add(f'{T}.faq.title', 'Procurement Compliance')
add(f'{T}.faq.highlight', 'Q&A')
add(f'{T}.faq.sub', 'Answers to the most critical material traceability and compliance questions.')
add(f'{T}.cta.t', 'Have specific compliance requirements for your titanium program?')
add(f'{T}.cta.btn', 'Submit Compliance Requirements')

# ===========================================
# CertificationsPage.astro KEYS (abbreviated)
# ===========================================
CER = 'cap.cert'
add(f'{CER}.s1.badge', 'Verified Quality Management Systems')
add(f'{CER}.s1.title', 'Verified Quality')
add(f'{CER}.s1.highlight', 'Management Systems')
add(f'{CER}.s1.sub', 'Our production infrastructure operates under a highly audited, internationally recognized quality management system.')
add(f'{CER}.mat.badge', 'Certification Validation')
add(f'{CER}.mat.title', 'Certification')
add(f'{CER}.mat.highlight', 'Validation Matrix')
add(f'{CER}.mat.sub', 'A complete overview of BOZE\u2019s active quality management certifications.')
add(f'{CER}.aud.badge', 'Compliance Sustainability')
add(f'{CER}.aud.title', 'The Annual Audit')
add(f'{CER}.aud.highlight', 'Lifecycle')
add(f'{CER}.aud.sub', 'Certification is a dynamic, continuously verified system \u2014 tested quarterly and validated annually by third-party registrars.')
add(f'{CER}.faq.badge', 'Compliance FAQ')
add(f'{CER}.faq.title', 'Procurement Compliance')
add(f'{CER}.faq.highlight', 'Q&A')
add(f'{CER}.faq.sub', 'Answers to the most frequent compliance and certification questions.')
add(f'{CER}.cta.t', 'Request our current certification documents for your supplier qualification process.')
add(f'{CER}.cta.btn', 'Request Certification Documents')

print(f"Total keys defined: {len(ALL_KEYS)}")

# ── Write en.json ──
en_path = os.path.join(TRANS_DIR, 'en.json')
with open(en_path, 'r', encoding='utf-8') as f:
    en_data = json.load(f)

added = 0
for key, text in ALL_KEYS.items():
    if key not in en_data:
        en_data[key] = text
        added += 1

with open(en_path, 'w', encoding='utf-8') as f:
    json.dump(en_data, f, ensure_ascii=False, indent=2)
print(f"Added {added} new keys to en.json")

# ── Write to all 9 other languages (English placeholder) ──
for lang in TARGET_LANGS:
    lang_path = os.path.join(TRANS_DIR, f'{lang}.json')
    with open(lang_path, 'r', encoding='utf-8') as f:
        lang_data = json.load(f)
    added_lang = 0
    for key, text in ALL_KEYS.items():
        if key not in lang_data:
            lang_data[key] = text
            added_lang += 1
    with open(lang_path, 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, ensure_ascii=False, indent=2)
    print(f"{lang}: added {added_lang} keys (English placeholder)")

print("\nDone! Translation keys added to all language files.")
print("Next: Run translate-capabilities.py to translate to 9 languages.")
