---
title: How to Qualify an AS9100 Titanium Supplier — 5-Step Procurement Procedure
slug: how-to-qualify-as9100-titanium-supplier
description: A procurement-quality engineer's 5-step procedure for qualifying an AS9100D-certified titanium machining supplier. Covers certification scope, material traceability, calibration / MSA, AS9102 first-article, and change-control flow-down (DFARS / ITAR). References real shop-floor evidence from Boze's AS9100D program.
pubDate: 2026-08-25
author: Boze Titanium Manufacturing Center
category: Procurement Guides
tags: [AS9100D, Supplier Qualification, Aerospace Sourcing, Procurement Quality, FAI, AS9102, DFARS]
coverImage: /uploads/blog-how-to-qualify-as9100-titanium-supplier-cover.jpg
coverImageAlt: Quality manager auditing a titanium machining supplier's first-article inspection report
featured: true

# ── AIO — HowTo schema ──
howto:
  name: "How to Qualify an AS9100 Titanium Supplier"
  description: "Five-step procurement-quality procedure to qualify an AS9100D-certified titanium machining supplier for aerospace structural and fracture-critical parts. Covers certification-scope audit, material-traceability audit, calibration / MSA review, AS9102 first-article review, and change-control flow-down (DFARS / ITAR / ASL)."
  totalTime: PT20M
  tool:
    - AS9100D / SAE AS9100D standard text (or summary)
    - Supplier quality questionnaire
    - FAI (First Article Inspection) template per AS9102
    - Material standards reference (AMS 4911 / 4928 / 4930, ASTM F136, B265, B348)
    - EN 10204 certificate type reference
  steps:
    - position: 1
      name: "Verify AS9100D certification scope"
      text: "Request a current AS9100D certificate from an accredited registrar (ANAB, UKAS, DakkS, JAB etc.) and confirm the scope explicitly covers aerospace titanium machining — not generic ISO 9001. The scope statement must list the relevant manufacturing process codes and the titanium grades you intend to order. Confirm the certificate has not been suspended or in \"special status\" within the last 24 months."
      url: https://cnc.bozemetal.com/blog/how-to-qualify-as9100-titanium-supplier/#step-1
    - position: 2
      name: "Audit material traceability chain"
      text: "Require Mill Test Reports (MTR) per ASME Section VIII with full heat-lot and VAR-ingot traceability, plus EN 10204 3.1 (mill-issued) or 3.2 (independent third-party) inspection certificate for the specific titanium grade (Grade 5 AMS 4911, Grade 23 ASTM F136, Grade 2 ASTM B348, etc.). Confirm lot numbers flow from receiving inspection through final shipment with a continuous chain of custody."
      url: https://cnc.bozemetal.com/blog/how-to-qualify-as9100-titanium-supplier/#step-2
    - position: 3
      name: "Inspect calibration and measurement system"
      text: "Verify CMM calibration to NIST-traceable standards under ISO 17025, confirm gage R&R for GD&T features (typically < 10 % for critical aerospace features per AIAG MSA 4th edition), and review the MSA (Measurement System Analysis) package. Hand-calipers, micrometers and pin gages must also be in the calibration program with a unique ID, last-cal date and next-due date."
      url: https://cnc.bozemetal.com/blog/how-to-qualify-as9100-titanium-supplier/#step-3
    - position: 4
      name: "Review AS9102 first-article process"
      text: "Confirm AS9102 First Article Inspection is performed on every new part number, every tooling change, and every engineering change order (ECO), with full dimensional report, material certs, and process records attached. AS9102 has three forms (Form 1 — part-number accountability, Form 2 — raw-material / special-process accountability, Form 3 — characteristic accountability); all three must be present and signed."
      url: https://cnc.bozemetal.com/blog/how-to-qualify-as9100-titanium-supplier/#step-4
    - position: 5
      name: "Establish change-control and flow-down"
      text: "Document configuration management: engineering-change-order (ECO) handling, DFARS flow-down (for US-defense work), ITAR controls (if applicable), approved-supplier-list (ASL) governance, and corrective-action / preventive-action (CAPA) timelines per AS9100D clause 10.2. Confirm the supplier has a documented counterfeit-parts-prevention plan per AS9100D clause 8.1.4 and AS5553."
      url: https://cnc.bozemetal.com/blog/how-to-qualify-as9100-titanium-supplier/#step-5

# ── AIO — Speakable anchors ──
speakableSelectors:
  - "#aio-thesis-1"
  - "#aio-thesis-2"
  - "#aio-thesis-3"
---

Qualifying an AS9100 titanium supplier is one of the highest-risk decisions a procurement-quality team makes. The cost of a missed qualification is not a price negotiation — it is a recurring non-conformance, a frozen first-article inspection (FAIR) at the customer's site, a 6–12 month requalification cycle, or a recall on a fracture-critical aerospace part. The procedure below is the one we recommend to incoming buyers and the one our own customers apply to us during their supplier audits. It is built from real shop-floor evidence — what an AS9100D registrar actually checks, what the prime contractors' supplier-quality teams actually request, and what an AS9102 first-article inspection report actually contains.

## Quick answer

<p id="aio-thesis-1"><strong>An AS9100D-qualified titanium supplier must hold a current, in-scope AS9100D certificate from an accredited registrar, maintain full heat-lot material traceability (MTR + EN 10204 3.1 / 3.2), perform AS9102 First Article Inspection on every new part number (all three forms signed), and operate a documented change-control system with DFARS / ITAR flow-down for defense work.</strong> Use the 5-step procedure below to verify each of those four pillars in sequence — they are non-substitutable.</p>

<p id="aio-thesis-2"><strong>Why AS9100D specifically, not generic ISO 9001:</strong> AS9100D adds aerospace-specific risk management (clause 8.1), configuration management (clause 8.5.1), FAI requirements (clause 8.5.1.2), and counterfeit-parts prevention (clause 8.1.4) that ISO 9001:2015 does not cover. Generic ISO 9001 certification is insufficient for aerospace structural titanium parts and will be rejected by every prime contractor and Tier-1 OEM in the aerospace supply chain.</p>

<p id="aio-thesis-3"><strong>Mandatory documentation per part shipment:</strong> (1) Mill Test Report (MTR) per ASME Section VIII; (2) AS9102 First Article Inspection report (all three forms) for the first article of each lot; (3) CMM dimensional report; (4) material / heat-lot certificate; (5) signed Certificate of Conformance (CofC) referencing the purchase order. Missing any one of these is grounds for rejection at incoming inspection.</p>

## The 5-step qualification procedure

### Step 1 — Verify AS9100D certification scope

The certificate on the wall is necessary but not sufficient. The scope statement must explicitly cover **aerospace titanium machining** as a manufacturing process code (typically 18.x in the AS9100 scope code system) and the **titanium grades** you intend to procure. If the certificate says "general machining of metals" with no aerospace-specific process code, the supplier is not properly certified for your work.

What to verify:

- **Issuing registrar is accredited.** The two principal accreditation bodies for AS9100D are ANAB (ANSI National Accreditation Board, US) and UKAS (United Kingdom Accreditation Service, UK). Other accepted bodies include DaJkkS (Germany), JAB (Japan), CNAS (China). The registrar's logo and accreditation number must be traceable to the accreditation body's own public register.
- **Certificate is current.** AS9100D certificates are valid for three years, with surveillance audits every 12 months. Ask for the most recent surveillance-audit closure letter — if there are open major non-conformances, the supplier is in "special status" and should not be sourced from for fracture-critical work until closure.
- **Scope is in-scope.** The scope statement must list: the manufacturing process(es) covered (CNC milling, CNC turning, EDM, grinding, etc.), the materials covered (titanium alloys), and any exclusions. Common exclusions to watch for: heat treatment, NDT, surface treatment — if your part requires any of these, the supplier must flow-down the requirement to an approved sub-tier supplier.
- **Site address matches.** Multi-site organizations must list each site separately. A certificate issued to the parent company's HQ is not valid for a remote manufacturing site.

What red flags to watch for:

- "ISO 9001:2015 certified, working toward AS9100D" — not qualified, period.
- "AS9100D-compliant" without a third-party certificate — meaningless marketing claim.
- "AS9100D certified" but the certificate scope is "distributor of metal products" — the supplier is a broker, not a manufacturer.

For a deeper dive into what AS9100D actually requires, the [AS9100D aerospace quality guide](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/) walks through the clause-by-clause implementation.

### Step 2 — Audit the material-traceability chain

Material traceability is where most supplier failures actually originate. The chain must be continuous from the original vacuum-arc-remelt (VAR) batch at the mill to the finished part on the customer's receiving dock. Ask for:

- **Heat number, lot number, VAR-ingot number, and producer** on the MTR header.
- **Chemistry values** — actual measured values for C, N, H, Fe, O, plus alloying elements — compared against the specification limits for the cited grade.
- **Mechanical properties** — UTS, YS, elongation, reduction of area — measured per ASTM E8 / E8M on a test bar from the same heat.
- **EN 10204 inspection-certificate type.** Type 3.1 = mill-issued (acceptable for most programs). Type 3.2 = independent third-party witnessed (required for some prime-contractor / nuclear programs). Type 2.1 / 2.2 are NOT acceptable for aerospace or medical.
- **Receiving-inspection record** — the supplier must record the heat number against the internal lot number on receipt, and that lot number must flow through every machining, inspection and shipping step.

Verify traceability in practice by picking a recent shipment and asking the supplier to trace one part-number from the CofC back to the raw-stock heat number in their ERP / job-traveler system. If the chain breaks at any step, the supplier is not in control of traceability.

The detailed field-by-field MTR walkthrough is in [How to Read a Titanium Mill Test Report](/blog/how-to-read-titanium-mill-test-report/).

### Step 3 — Inspect calibration and measurement-system capability

The CMM is the heart of dimensional verification for aerospace titanium parts. A CMM that is not calibrated, or a measurement system that has not been characterized, will produce inspection data that looks valid but is statistically meaningless. Verify:

- **CMM calibration per ISO 10360-2:2009** (or the more stringent ISO 10360-5:2010 for multi-feature systems). The supplier's most recent calibration certificate must be traceable to NIST or an equivalent national metrology institute. Calibration interval is typically 12 months.
- **Gage R&R study per AIAG MSA 4th edition** for the GD&T features the part requires. Acceptable results: %R&R < 10 % for critical aerospace features, < 30 % for marginal features. If the supplier cannot produce a Gage R&R study, they have not characterized their measurement system.
- **Hand-tool calibration** — calipers, micrometers, pin gages, thread gages, surface-roughness comparators — must be in the calibration program with a unique ID, last-cal date and next-due date. Each tool must carry a calibration sticker.
- **Calibration standards** — gage blocks, ring gages, step gages — must themselves be traceable to NIST. ISO 17025 accreditation of the calibration lab is preferred.
- **Environmental controls** — CMM rooms are typically held at 20 ± 1 °C to keep thermal expansion below 1 µm on critical features. A shop without an environmentally controlled CMM room cannot reliably hold ±0.005 mm on titanium.

Our [calibration and inspection infrastructure](/capabilities/quality/) at Boze is built around a Zeiss Contura CMM calibrated to ISO 10360-2:2009 in a 20 ± 0.5 °C controlled environment, with full MSA / Gage R&R studies on every active GD&T feature.

### Step 4 — Review the AS9102 first-article process

AS9102 First Article Inspection is the single most important deliverable in the supplier qualification cycle. It is the only inspection event that proves the supplier can produce a part that meets every drawing requirement on a single repeatable process. The supplier must produce AS9102 on:

- The first production part of a new part number.
- The first part after every tooling change.
- The first part after every engineering change order (ECO).
- The first part after a process change (machine, fixturing, NC program).

AS9102 has three forms, all three must be present and signed:

- **Form 1 — Part Number Accountability.** Lists the part number, part name, serial number, customer, drawing revision, manufacturing process reference, customer PN, and any FAIR-related customer specifications.
- **Form 2 — Raw Material and Special Process Accountability.** Lists every raw material (with heat / lot numbers) and every special process (heat treatment, NDT, surface treatment, passivation, etc.) used to produce the part.
- **Form 3 — Characteristic Accountability.** Lists every characteristic on the drawing (dimensions, GD&T, surface finish, material call-outs) with the measured value, the inspection method, the inspector's signature and the design intent.

A common supplier failure is producing only Form 3 (characteristic accountability) without Forms 1 and 2. This is an automatic AS9102 rejection at the customer's site and grounds for re-quoting the part.

For AS9102 to be meaningful, the part being measured must be a true production-representative part made on the production machine with the production tooling and NC program — not a "show-piece" hand-finished to print. Verify by attending the first production run on-site or via live video.

### Step 5 — Establish change-control and flow-down

A qualified supplier today is not necessarily qualified tomorrow. The change-control system is what keeps the qualification current. Verify:

- **Engineering-change-order (ECO) flow-down.** When the customer's drawing changes, the supplier must receive the new revision, update the NC program, re-cut a first article, and re-issue AS9102 before shipping the next production lot.
- **DFARS flow-down (US-defense work only).** DFARS 252.225-7008 / 7009 restrict specialty-metal sourcing to US-origin or approved-qualifying-country sources. If the supplier sources titanium from China or Russia, DFARS-compliant programs are off-limits unless an individual exception is granted.
- **ITAR controls (US-defense work only).** If the part is ITAR-controlled, the supplier must be ITAR-registered with the US State Department DDTC and the manufacturing must take place in the US. China-based suppliers cannot accept ITAR work.
- **Approved-supplier-list (ASL) governance.** The supplier must maintain an ASL for sub-tier processors (heat treat, NDT, surface finish, plating) and qualify each sub-tier on the same criteria as their own qualification. Sub-tier flow-down is where most counterfeit-parts incidents originate.
- **Counterfeit-parts prevention per AS9100D clause 8.1.4 and AS5553.** The supplier must have a documented counterfeit-parts prevention plan, including independent-chain verification of raw-material authenticity and a quarantine-and-investigate procedure for suspected counterfeit material.
- **Corrective-action / preventive-action (CAPA) timeliness per AS9100D clause 10.2.** Document the supplier's average CAPA closure time for minor and major non-conformances. Acceptable: ≤ 30 days for minor, ≤ 60 days for major. A supplier that cannot demonstrate timely CAPA closure is not in control of its quality system.

For US-prime aerospace work, also confirm the supplier is registered in the **Supplier Performance Risk System (SPRS)** and has a current **Cybersecurity Maturity Model Certification (CMMC)** level appropriate to the program's CUI handling.

---

## Author & manufacturing context

This procedure is maintained by the supplier-quality and engineering team at Boze Titanium Manufacturing Center (Baoji Boze Metal Products Co., Ltd., Shaanxi, China). Boze holds an active AS9100D certificate from an ANAB-accredited registrar, an ISO 9001:2015 certificate, and an ISO 13485:2016 certificate for medical-device manufacture. The site operates 5-axis CNC milling (Hermle C25, DMU 50), Mazak Integrex i-200S turn-mill, Sodick wire EDM, vacuum heat treatment (AMS 2774), Zeiss CMM inspection (ISO 10360-2 calibrated), and full EN 10204 3.1 / 3.2 MTR traceability. We supply AS9102 first-article inspected components to aerospace (commercial, defense, UAV), medical (implants, instruments, surgical robotics), chemical-process (valves, reactors, heat exchangers), subsea (ROVs, manifolds), and semiconductor (vacuum chambers, gas-distribution) customers worldwide. For a sample MTR, AS9102 forms, or a site-audit schedule, [submit an RFQ](/rfq/) and request the supplier-qualification package.
