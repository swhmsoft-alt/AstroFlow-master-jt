---
title: "ASME SB348 vs ASTM B348: Titanium Bar Standards for Pressure Vessels"
slug: asme-sb348-vs-astm-b348-titanium-bar-standards-pressure-vessels
description: "A specification comparison of ASME SB348 and ASTM B348 for titanium bar stock. Covers BPVC adoption mechanics, ASME QSC requirements, code-stamp implications, and procurement rules for pressure vessel, heat exchanger, and nuclear applications."
pubDate: 2026-08-29
author: Boze Titanium Manufacturing Center
category: Titanium Standards
tags: [ASME SB348, ASTM B348, Pressure Vessel Titanium, ASME BPVC, ASME QSC, Code Stamping, Bar Specification]
featured: false
---

# ASME SB348 vs ASTM B348: Titanium Bar Standards for Pressure Vessels

**Executive summary:** ASME SB348 and ASTM B348 share an identical technical scope — the chemical, mechanical, and dimensional requirements for titanium and titanium alloy bars and billets — but they exist for entirely different procurement contexts. ASTM B348 is the materials specification, written and maintained by ASTM Committee B02. ASME SB348 is the ASME Boiler and Pressure Vessel Code adoption of that specification, with identical text but additional governance: when a pressure vessel, heat exchanger, or pressure-containing component is built to ASME BPVC Section VIII or Section III, the material must comply with the SB- version of the standard, not the B- version. The two are not in competition; they are the same specification on parallel tracks. The procurement question is therefore which one the design code requires, and how to call it out cleanly on the purchase order and the mill test report.

## When ASTM B348 is sufficient and when SB348 is mandatory

The ASTM B348 / ASME SB348 distinction follows the structure of the ASME Boiler and Pressure Vessel Code. The BPVC is divided into sections (Section II for materials, Section VIII for unfired pressure vessels, Section III for nuclear components, Section XII for transport tanks). Each section that mandates materials compliance references Section II, and Section II in turn references the SB- versions of the relevant material standards. The structure is hierarchical: Section II adopts SB- standards by specific revision, and that adoption is what makes the standard legally applicable inside the BPVC framework.

For a non-pressure-vessel application — a structural aerospace bracket, a medical implant, an automotive valve body, a chemical tank that is not code-stamped — ASTM B348 alone is sufficient. The buyer specifies "titanium bar to ASTM B348, Grade 5, annealed condition, EN 10204 Type 3.1 mill test report." No code reference is needed. The material will be accepted by ASTM-compliant commercial supply chains without further qualification. See the [ASTM B348 explained](/blog/astm-b348-explained/) guide for the general industrial interpretation.

For a pressure vessel, a heat exchanger pressure shell, a nuclear component, or any component that carries the ASME U, UM, S, or N stamp, the specification must read "ASME SB-348, latest revision adopted by the BPVC at the time of order, Grade 5, annealed, ASME Section II Part B." The wording matters because the BPVC adopts SB- standards by specific revision, and the revision in force at the time of order is the legally applicable one. Material certified to ASTM B348 but not cross-referenced to the SB- version cannot be used in a code-stamped vessel.

## What the SB- designation actually changes

In practical terms, very little. The technical content of SB348 is identical to ASTM B348. The ASME Committee on Materials adopts each revision of ASTM B348, often with no change, occasionally with an editorial correction. The SB- designation signals that the standard is now part of the ASME Code framework and that any code-stamped component using it is subject to ASME's quality system, traceability, and audit requirements. The ASME Code is a legal framework, not a technical overlay — adopting a standard into the Code makes compliance auditable.

The visible differences are procedural. An SB348 order requires:

- Certification to the SB- revision in force per the BPVC at the time of order placement.

- A mill test report that references both the SB- designation and the BPVC edition (for example, "SB-348-2023, ASME BPVC Section II Part B, 2023 Edition").

- A Certificate of Conformance signed under the rules of the BPVC quality system, not the manufacturer's commercial quality system.

- Traceability that flows from the heat number through the final component in a way that supports the ASME data report (the U-1, U-2, or U-3 form).

In addition, the manufacturer's quality system must be certified to ASME QSC (Quality System Certificate) or hold an accredited material organization certification. A titanium bar mill that ships to ASTM B348 but does not hold ASME QSC cannot ship SB348-certified material — the material must be re-tested or re-certified by an organization that does hold QSC. The QSC status of the mill is therefore the gating constraint at the RFQ stage, not the technical capability of the mill to meet the chemistry or mechanical properties. The broader bar specification context is covered in the [ASTM B348 general guide](/blog/astm-b348-explained/), and the plate variant is in the [ASTM B348 vs B265 comparison](/blog/astm-b348-vs-astm-b265-titanium-bar-plate-standards/).

**Table 1: ASTM B348 vs ASME SB348 procurement comparison**

| Aspect | ASTM B348 | ASME SB348 |
| --- | --- | --- |
| Applicable scope | General industrial, aerospace, medical, chemical | ASME BPVC code-stamped pressure vessels and components |
| Issuing body | ASTM Committee B02 | ASME Boiler and Pressure Vessel Code Committee |
| Revision tracking | ASTM revision date | BPVC edition and addenda |
| Mill certification | EN 10204 Type 3.1 or 3.2 | ASME QSC-issued certification, references BPVC edition |
| Manufacturer accreditation | ISO 9001 typical | ISO 9001 plus ASME QSC (Quality System Certificate) |
| Data report linkage | Internal traceability | Tied to ASME U-1 / U-2 / U-3 data reports |

## Failure modes when the wrong standard is specified

The most common procurement error is specifying only ASTM B348 on an order that will end up in a code-stamped pressure vessel. The material arrives with the right chemistry and mechanical properties, but the mill test report cites ASTM B348 rather than SB348. The vessel manufacturer then has two bad options: reject the material and reorder (delaying the project), or accept the material and document a deviation request through the Authorized Inspector — both of which are avoidable with the right specification at order placement.

A less obvious error is specifying SB348 when the component is not actually code-stamped. This happens when an over-cautious buyer copies a clause from a previous code-stamped order into a non-code procurement. The result is a mill that has to route the order through its ASME-accredited production track, raising the price and the lead time with no engineering benefit. The penalty is paid by every project that did not need code-stamped material but received it.

A third failure mode is the "latest revision" trap. ASME BPVC adopts new editions every two years and issues addenda in between. If the buyer writes "SB348 latest revision" on a long lead-time order, the manufacturer has to choose between accepting the order under the revision in force at order placement (which may no longer be the current revision by delivery) or waiting for the next edition (which delays the project). The robust practice is to specify the BPVC edition in force at the time of order placement and lock it in writing. A four-month lead time plus a two-year BPVC cycle is a common combination that creates this failure.

## MTR review for SB348 orders

Reviewing a mill test report for an SB348 order is the same as for ASTM B348, with three additions:

- The SB- designation and the BPVC edition must appear in the header.

- The manufacturer's ASME QSC number must be cited.

- The signature block must include the manufacturer's authorized representative and (for certain components) the Authorized Inspector's verification stamp.

If any of these three elements is missing, the MTR is not acceptable for a code-stamped vessel, regardless of the chemistry and mechanical properties being correct. The MTR is not just a material certificate; in the SB348 context it is part of the legal record that supports the ASME data report. The quality engineer who accepts the MTR is accepting not just material but also the documentary chain that the vessel's U-1 form will rely on.

The supplementary testing provisions of SB348 are identical to ASTM B348 — ultrasonic inspection, fracture toughness, microstructure evaluation, and product analysis are not default requirements and must be specified on the purchase order. For a code-stamped pressure vessel in cyclic service or low-temperature service, the supplementary testing typically expands to include impact testing per ASME Section II Part B, which is not in the base SB348.

## Procurement rules for pressure vessel titanium

**Rule 1 — Match the specification to the design code.** If the component carries an ASME stamp, specify SB-348 with the BPVC edition. If it does not, specify ASTM B348. Never mix.

**Rule 2 — Confirm the manufacturer's QSC status before RFQ.** A mill without current QSC cannot ship SB348 material. Verify the QSC is in date and covers the product form (bar, billet, forging). A QSC for bar does not automatically cover billet; the scope statement of the certificate must be checked.

**Rule 3 — Lock the BPVC edition at order placement.** Do not write "latest revision." Lock the edition by reference and add the addenda if any apply. A long lead-time order that crosses a BPVC cycle needs a contractual clause specifying which edition governs at delivery.

**Rule 4 — Verify the MTR before material acceptance.** The MTR must show SB- designation, BPVC edition, QSC number, and authorized signatures. Any gap is a hold point. Do not release the material to production on a verbal confirmation; the documentation chain is what supports the data report.

**Rule 5 — Maintain the data report linkage.** From heat number to final U-1 / U-2 / U-3, the traceability chain must be unbroken. Audit the chain at receipt, not at final inspection. The cost of rebuilding a broken chain after the vessel is complete is many times the cost of catching the gap at receipt.

**Rule 6 — Engineer contradiction — tighter chemistry is not the same as code compliance.** A buyer who specifies extra-tight chemistry on the MTR (oxygen below the standard limit, nitrogen below the standard limit) but fails to specify SB348 has bought a more refined ASTM B348 material that still cannot be used in a code-stamped vessel. Code compliance is a documentary status, not a material property.

For the broader comparison between ASTM B348 and ASTM B265 (plate), see the [ASTM B348 vs B265 standard comparison](/blog/astm-b348-vs-astm-b265-titanium-bar-plate-standards/). For a general reading of the mill test report itself, see the [ASTM B348 explained](/blog/astm-b348-explained/) guide. To specify a pressure vessel titanium order to ASME BPVC, [request a manufacturing review](/rfq/).

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)

Fig 1 — ASTM B348 vs ASME SB348 governance flowchart. Branch from "Is the component code-stamped?" to ASTM B348 path or SB348 + BPVC + QSC path.

Fig 2 — SB348 mill test report header diagram. Annotated header showing SB- designation, BPVC edition, QSC number, and authorized signature fields.

Fig 3 — BPVC edition adoption timeline. Horizontal timeline of recent BPVC editions and addenda with SB348 revision markers.

-->
