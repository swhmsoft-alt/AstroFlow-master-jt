---
title: "AS9100 Certified Titanium Machining: Quality Auditing and Traceability Standards"
slug: as9100-certified-titanium-machining-quality-auditing-traceability-standards
description: "A quality engineering guide to AS9100 certification as it applies to titanium machining suppliers. Covers the AS9100D revision structure, audit findings common to machining shops, traceability chain requirements, and procurement rules for qualifying an AS9100 titanium supplier."
pubDate: 2026-08-29
author: Boze Titanium Manufacturing Center
category: Quality Systems
tags: [AS9100D, AS9100, Aerospace Quality, Titanium Machining, Supplier Qualification, Audit, Traceability]
featured: false
---

# AS9100 Certified Titanium Machining: Quality Auditing and Traceability Standards

**Executive summary:** AS9100 is the aerospace sector's quality management system standard, built on ISO 9001 with additional requirements for configuration management, risk management, configuration status accounting, and product safety. For a titanium machining supplier, AS9100D certification is the entry ticket to most prime-contractor supply chains — but the certification is a baseline, not a guarantee. The certification audit confirms that the documented quality system exists and is being followed; it does not confirm that the system is mature, that the technical staff can execute it consistently, or that the supply chain is robust. Procurement organizations that treat AS9100D as a binary qualification (certified or not) routinely receive parts from certified suppliers that fail their own first-article inspection or that cannot be traced back to the mill heat. The right approach is to treat AS9100D as a precondition and to layer additional technical and process audits on top of it.

## The AS9100D structure and what it actually requires

AS9100D (the D revision, current as of 2026) is organized in the ISO 9001 high-level structure with ten clauses. The aerospace-specific additions appear primarily in clauses 7 (support), 8 (operation), and 9 (performance evaluation). The most-cited additions are:

- Configuration management (clause 8.5.2): every design change must be formally reviewed, approved, and propagated to all affected documentation before the changed part is released.

- Risk management (clause 6.1): the supplier must maintain a risk register covering product realization, supply chain, and product safety, with mitigation actions documented.

- Configuration status accounting (clause 8.5.2): the supplier must be able to identify the current revision of any part at any point in the production flow.

- Product safety (clause 8.5.1): the supplier must identify and control safety-critical features, with separate documentation and segregation where applicable.

- First article verification (clause 8.5.1): the supplier must perform and document first-article inspection to AS9102 or equivalent for every new part.

- Nonconforming product control (clause 8.7): the supplier must have a documented system for identifying, segregating, and disposing of nonconforming product, including corrective action.

The certification audit, conducted by an accredited certification body (CB) such as ANAB, UKAS, or equivalent, verifies that the documented system covers these requirements and that the supplier can demonstrate implementation. The audit is typically a three to five day on-site exercise for a machining supplier, with the initial certification audit followed by annual surveillance audits and a full re-certification audit every three years. See the [AS9100D titanium CNC manufacturing quality guide](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/) for the implementation perspective, and the [AS9100 supplier qualification guide](/blog/how-to-qualify-as9100-titanium-supplier/) for the procurement perspective.

## Common audit findings at titanium machining suppliers

The most frequent audit findings at titanium machining suppliers fall into three categories. Each is fixable but requires ongoing discipline; the certification audit catches the system gap but not always the day-to-day execution gap.

**Configuration management findings.** The most common finding is outdated drawings at the work station. A part being run to revision B while the released documentation is at revision A is a configuration management nonconformance. The remedy is a documented drawing-distribution system with a master list and a controlled distribution list; every operator station has the current revision and obsolete copies are pulled. In a busy machine shop, this discipline erodes quickly without an assigned owner.

**Traceability findings.** The second most common finding is a broken traceability chain from the raw material heat number to the finished part. The mill test report cites a heat, the receiving inspection records the heat, but the traveler that follows the part through machining does not always reference the heat, or the heat is recorded on a paper traveler that is not retained with the part documentation. The remedy is a digital traveler that captures the heat number at receipt and carries it through every operation to final inspection.

**Calibration findings.** The third most common finding is calibration of inspection equipment — gages, micrometers, calipers, hardness testers — past the calibration due date. The remedy is a calibration management system with automated alerts and a backup gage strategy so that a gage out for calibration does not stop production.

## Traceability chain requirements for titanium aerospace parts

The traceability chain for a titanium aerospace part flows from the raw material mill heat number through every manufacturing step to the final inspection record and the shipping documentation. The chain must be unbroken and auditable; every link must be supported by a documented record. For a deeper discussion of the documentation side, see the [titanium material certification traceability guide](/blog/titanium-material-certification-traceability-guide/).

**Table 1: Traceability chain elements for titanium aerospace parts**

| Chain link | Record type | Retention period |
| --- | --- | --- |
| Mill heat number | Mill test report (MTR), heat analysis | Life of part + 7 years typical |
| Receiving inspection | Receiving inspection record, material verification | Life of part + 7 years typical |
| Raw material allocation | Traveler, heat-to-part allocation record | Life of part + 7 years typical |
| Manufacturing operations | Router, operation traveler, operator sign-off | Life of part + 7 years typical |
| In-process inspection | In-process inspection record, gage readings | Life of part + 7 years typical |
| Final inspection / AS9102 | First article inspection report, dimensional report | Life of part + 7 years typical |
| Nonconformance records | NCR, corrective action, scrap or rework record | Life of part + 7 years typical |
| Calibration records | Calibration certificates for gages and inspection equipment | 7 years typical |
| Shipping documentation | Packaging list, shipper, COC | Life of part + 7 years typical |

The retention period follows the aerospace convention of "life of part plus 7 years minimum." For military programs, the retention may extend to the life of the airframe, which can be 30 to 50 years. The records must be stored in a medium that remains readable for that period — paper records in fire-resistant cabinets, or digital records in a system with migration paths. The records that disappear after five years because the document management system changed formats are not retained records.

## Beyond AS9100: the technical audits that matter

A procurement organization that relies solely on the AS9100D certificate is missing the technical layer that determines whether a supplier can consistently produce titanium aerospace parts. The technical audits that complement AS9100 are:

- **Process audit — titanium machining.** A day on the shop floor with a titanium machining expert watching the cutting parameters, tool wear management, coolant practice, and chip handling. The audit confirms that the supplier runs titanium as a primary material, not as a one-off.

- **Process audit — heat treatment and finishing.** If the supplier runs heat treatment or surface finishing in-house, audit the furnace calibration, the atmosphere control, and the post-heat-treat cleaning. If outsourced, audit the subcontractor with the same rigor as a direct supplier.

- **Supply chain audit — titanium mill.** The titanium mill is the source of the MTR. The procurement organization should know which mills the supplier sources from and whether those mills are themselves approved (typically through the supplier's own qualification, which the customer can audit).

- **Calibration audit — metrology.** A separate audit of the CMM and supporting inspection equipment, separate from the AS9100 calibration records. The audit confirms that the metrology system is sized to the work and that the operators are proficient. See the [5-year CMM TCO guide](/blog/5-year-cmm-total-cost-of-ownership-aerospace-startup/) for the metrology system sizing framework.

These technical audits are not part of AS9100, but they are the layer that determines whether the supplier will deliver conforming parts on a sustained basis. A supplier with a perfect AS9100 audit history and a weak metrology system will fail at first article; a supplier with a strong metrology system and a weak configuration management discipline will fail at the next design revision.

**Table 2: AS9100 document control levels by drawing revision status**

| Revision status | Required controls | Retention period | Audit focus |
| --- | --- | --- | --- |
| Released (production) | Revision number, effective date, distribution list, change log | 7 years minimum (aerospace) | Distribution control, change history |
| Change in process (heat treat, plating) | Process spec revision, customer approval if required | 7 years + part life | Customer notification discipline |
| First article (AS9102) | FAI report, dimensional layout, material certs, process certs | Part life + 7 years | FAI completeness, traceability chain |
| Obsolete | Retention per record retention policy, marked obsolete | Per policy, minimum 7 years | Prevention of inadvertent use |
| Customer proprietary | Locked storage, access control, ITAR or EAR marking if applicable | Per contract + regulatory | Access log, marking compliance |

## Procurement rules for AS9100 titanium suppliers

**Rule 1 — Verify the AS9100D certificate scope.** A certificate for "machining of aerospace components" is not the same as a certificate for "machining of titanium aerospace structural components." The scope statement should match the buyer's program scope.

**Rule 2 — Request the audit history, not just the certificate.** A supplier with three open major findings is a higher risk than a supplier with no open findings. The audit history is available from the supplier or from the certification body (with supplier permission).

**Rule 3 — Layer technical audits on top of AS9100.** The process, heat treatment, supply chain, and metrology audits are the buyer's responsibility. They are not part of AS9100, but they are the layer that determines part quality.

**Rule 4 — Verify the traceability chain end-to-end.** Pick a recent part number, request the full documentation package (MTR, receiving inspection, traveler, in-process inspection, AS9102, shipping record), and trace the heat number from the mill to the finished part. The exercise takes a few hours and reveals whether the chain is real or aspirational.

**Rule 5 — Engineer contradiction — AS9100D is necessary, not sufficient.** A buyer who treats AS9100D as the sole qualification criterion will receive parts from suppliers who have a perfect certificate and a weak shop floor. The certificate is the baseline; the technical audit is the reality check. Both are required.

For the AS9100D implementation perspective, see the [AS9100D titanium CNC manufacturing quality guide](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/). For the supplier qualification workflow, see the [AS9100 supplier qualification guide](/blog/how-to-qualify-as9100-titanium-supplier/). To request a technical audit of a titanium machining supplier, [contact the engineering team](/rfq/) through the RFQ channel.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)

Fig 1 — AS9100D clause map. Hierarchical diagram of the 10 clauses with aerospace-specific additions highlighted.

Fig 2 — Traceability chain flow diagram. Vertical flowchart from mill heat number through receiving inspection, traveler, operations, final inspection, shipping record.

Fig 3 — Audit finding frequency chart. Bar chart of common audit findings at titanium machining suppliers, ranked by frequency.

-->
