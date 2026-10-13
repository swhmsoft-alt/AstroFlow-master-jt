---
title: "Titanium CNC Quality Documentation Package: MTR, CoC and Inspection Records"
description: "Engineering guide to the titanium CNC quality documentation package — MTR per EN 10204 3.1/3.2, Certificate of Conformance, AS9102 FAI report, dimensional and NDT inspection records, surface treatment and process documentation, batch/lot/part traceability from VAR ingot to finished part, DFARS/ITAR/RoHS/REACH compliance, and the retention/disposition requirements for AS9100D, medical, and chemical processing programs."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Quality & Standards
tags: [MTR, EN 10204, Certificate of Conformance, AS9102, FAI, Traceability, Material Certification, Quality Documentation, AS9100D, DFARS, ITAR, RoHS, REACH]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-quality-documentation-package-cover.jpg
coverImageAlt: PLACEHOLDER — titanium quality documentation package showing MTR, CoC, and AS9102 FAI report stacked on a desk. To be replaced with the final image.
featured: false
---

The titanium CNC quality documentation package is the set of records that proves, for the lifetime of the part, that the titanium was melted to specification, forged or rolled to specification, machined to specification, inspected to specification, and shipped to specification. The package is the buyer's defence against the three failure modes that are most expensive in titanium: material mix-up (the wrong grade in the part), process deviation (the wrong parameters in the cycle), and traceability loss (the part cannot be matched to the original ingot). The cost of the package is roughly 2–5% of the part cost; the cost of a missing record (a heat-lot mismatch, a missing CMM report, a missing AS9102 FAI) is typically 10–30% of the part cost in rework, plus the program-level cost of an audit finding. The procurement decision is to specify the package contents, the certificate types, the traceability chain, and the retention period at the RFQ stage — not to leave any of these to the supplier's default.

This article works through the five procurement decisions that determine whether a quality documentation package is correctly specified: the package contents, the EN 10204 certificate types, the traceability chain from VAR ingot to finished part, the retention and disposition requirements, and the digital workflow. It assumes the [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/), the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/), the [AS9100D quality management article](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/), and the [material certification and traceability guide](/blog/titanium-material-certification-traceability-guide/) as background — those cover the individual documents in detail; here we focus on the package as a whole and the procurement decisions that hold it together. For the inspection side, the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/), the [NDT article](/blog/ndt-titanium-cnc-parts/), the [surface roughness article](/blog/measure-surface-roughness-ra-cnc-parts/), and the [burrs and deburring article](/blog/titanium-cnc-burrs-deburring/) are the cross-references.

- [Why the documentation package matters more than the individual documents](#why-the-documentation-package-matters-more-than-the-individual-documents)
- [The four components of a titanium CNC quality package](#the-four-components-of-a-titanium-cnc-quality-package)
- [EN 10204 certificate types: 2.1, 2.2, 3.1, 3.2](#en-10204-certificate-types-21-22-31-32)
- [The traceability chain: from VAR ingot to finished part](#the-traceability-chain-from-var-ingot-to-finished-part)
- [Retention and disposition: how long and where](#retention-and-disposition-how-long-and-where)
- [Digital documents, signatures, and PDF/A](#digital-documents-signatures-and-pdfa)
- [Compliance documents: DFARS, ITAR, RoHS, REACH](#compliance-documents-dfars-itar-rohs-reach)
- [Documentation package checklist](#documentation-package-checklist)

## Why the documentation package matters more than the individual documents

The documentation package is more than the sum of its parts. A buyer who receives a Mill Test Report (MTR), a Certificate of Conformance (CoC), and an AS9102 FAI report as three separate documents, with no traceability chain between them, has three independent records that cannot be cross-verified. A buyer who receives the same three documents as a single package, with the MTR's heat number linked to the CoC's batch number linked to the FAI's part number, has a single chain of evidence that can be verified at every step. The chain of evidence is what protects the buyer against material mix-up, against process deviation, and against traceability loss.

The three failure modes that the package protects against:

- **Material mix-up.** A wrong grade in a part. The MTR is the only record that proves the part was made from the specified grade, and the heat number on the MTR is the only way to verify the grade against the original ingot. A package without the MTR's heat number linked to the FAI's part number is a package that cannot prove the grade, and the buyer cannot prove the grade at the FAI review or at the service failure. The cost of a grade mix-up is typically a recall, a rework, or a service failure, and the cost of the MTR's heat-number link is zero (the link is on the MTR already; the buyer just has to require the link to be in the package).
- **Process deviation.** A wrong parameter in the cycle. The FAI is the only record that proves the part was made on the production tooling with the production parameters, and the FAI's process documentation (the tooling list, the parameter list, the inspection scope) is the only way to verify the cycle against the print. A package without the FAI's process documentation linked to the MTR's heat number is a package that cannot prove the process, and the buyer cannot prove the process at the FAI review or at the service failure. The cost of a process deviation is typically a scrap, a rework, or a service failure, and the cost of the FAI's process-documentation link is zero.
- **Traceability loss.** A part that cannot be matched to the original ingot. The traceability chain (mill heat number → distributor batch number → shop lot number → FAI part number → shipping record) is the only way to match the part to the ingot, and the chain is the buyer's defence in a service failure investigation. A package without the traceability chain is a package that cannot support a service failure investigation, and the buyer cannot identify the scope of a recall or the root cause of a failure. The cost of traceability loss is typically a full recall of the affected ingot's production, and the cost of the traceability chain is zero (the chain is on the documents already; the buyer just has to require the chain to be in the package).

The cost of the documentation package is the sum of the inspection time, the documentation time, and the record-retention cost. The inspection time is 4–40 hours per part (covered in the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/)). The documentation time is 2–8 hours per part for the FAI assembly, plus 1–2 hours per batch for the MTR and CoC assembly. The record-retention cost is the storage cost (digital or physical) for the retention period (typically 7 years for AS9100D, 25 years for medical and defense). The total package cost is typically 2–5% of the part cost, and the cost of a missing record is typically 10–30% of the part cost in rework, plus the program-level cost of an audit finding. The procurement decision is to specify the package contents, the certificate types, the traceability chain, and the retention period at the RFQ stage.


## The four components of a titanium CNC quality package

The standard titanium CNC quality documentation package has four components, each of which is a separate document or record:

**1. Material Test Report (MTR) per EN 10204.** The mill-issued document that records the chemistry and the mechanical properties of the specific heat lot from which the part was made. The MTR is the only record that ties the part to the original VAR ingot. The MTR is issued by the mill (not the shop) and is passed through the supply chain unchanged. The MTR fields are covered in detail in the [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/); the procurement decision is the certificate type (3.1 vs 3.2, covered below) and the field-of-issue (mill vs distributor).

**2. Certificate of Conformance (CoC).** The shop-issued document that records the conformance of the part to the print and the MTR. The CoC references the MTR (by heat number), the part number, the print revision, and the AS9102 FAI report. The CoC is signed by the shop's quality team and is the legal record that the part was made in conformance with the buyer's specification.

**3. AS9102 First Article Inspection (FAI) report.** The detailed dimensional, GD&T, material, and process characteristics of the first article, with the measured values and the inspection methods. The FAI is the buyer's verification that the part was made in conformance with the print, and the FAI is the baseline for the per-lot inspection. The FAI is covered in detail in the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/).

**4. Supplementary inspection and process records.** The dimensional inspection reports (CMM layouts, hand-gauge records), the [NDT reports](/blog/ndt-titanium-cnc-parts/), the [surface roughness reports](/blog/measure-surface-roughness-ra-cnc-parts/), the [burr inspection records](/blog/titanium-cnc-burrs-deburring/), the heat-treatment records, the surface-treatment records, and any special-process certifications (welding, NDT, etc.). The supplementary records are the supporting evidence for the FAI's process characteristics.

The four components are typically combined into a single package per part number (or per lot, for production runs), with the MTR at the front (proving the material), the CoC as the cover page (proving the conformance), the FAI in the middle (proving the dimensions and the process), and the supplementary records as appendices (proving the inspection and the special processes). The package is delivered to the buyer with the parts, and the buyer retains the package for the program's retention period.

The package is the formal record that the part was made to specification, and the package is the buyer's defence in a service failure investigation. A part without a complete package is a part that the buyer's quality team cannot verify, and the part may be rejected at incoming inspection or dispositioned as "use as is" with a concession. The procurement spec that does not require the package contents is the procurement spec that produces parts with missing records, and the missing records are paid at the FAI review, at the audit, or at the service failure.


## EN 10204 certificate types: 2.1, 2.2, 3.1, 3.2

The EN 10204 standard defines four certificate types, with the type determining the level of verification and the issuing authority. The type is the buyer's first decision on the MTR, and the type is set by the application's criticality:

**Type 2.1 — Declaration of compliance with the order.** Issued by the mill, the type 2.1 certificate is a one-line statement that the product complies with the order. No test results are provided. The 2.1 is the lowest level of certification and is typically not accepted for aerospace, medical, or safety-critical parts. A buyer who accepts a 2.1 certificate for a critical application has no test evidence to verify the chemistry or the mechanical properties.

**Type 2.2 — Test report.** Issued by the mill, the type 2.2 certificate includes the test results (chemistry and mechanical properties) from the mill's lot testing, but the test results are not validated by an independent inspection body. The 2.2 is the standard for non-critical industrial applications, and is sometimes accepted for general-purpose titanium parts. The 2.2 is the buyer's "soft" certification — the test results are provided, but the buyer is relying on the mill's self-certification.

**Type 3.1 — Mill-issued test report.** Issued by the mill, the type 3.1 certificate includes the test results (chemistry and mechanical properties) from the mill's lot testing, with the test results validated by the mill's independent inspection department. The 3.1 is the standard for aerospace, medical, and safety-critical parts, and is the minimum acceptable certification for AS9100D programs. The 3.1 is the buyer's "hard" certification — the test results are provided and validated by the mill's own independent inspection, but not by a third party.

**Type 3.2 — Independent test report.** Issued by the mill, the type 3.2 certificate includes the test results (chemistry and mechanical properties) from the mill's lot testing, with the test results validated by an independent inspection body (typically a third-party testing laboratory or the buyer's source quality team). The 3.2 is the standard for high-criticality applications (nuclear, defense, some medical implants, some aerospace primary structure). The 3.2 is the buyer's "third-party" certification — the test results are provided and validated by an independent body.

The procurement decision is the certificate type. The default for AS9100D aerospace programs is 3.1; the default for medical implants is 3.1 or 3.2 depending on the implant class; the default for chemical processing pressure vessels is 3.1. A buyer who accepts a 2.1 or 2.2 for a critical application is paying for a part that cannot be verified at the FAI review or at the audit. The cost difference between 2.2 and 3.1 is typically $10–$50 per MTR, and the cost difference between 3.1 and 3.2 is typically $50–$200 per MTR. The cost is small relative to the value of the verification.

A buyer who requires a 3.1 or 3.2 certificate is asking the supplier to provide test results that are validated by the mill's independent inspection or by a third party. A supplier who provides a 2.1 or 2.2 for a critical application is providing a lower level of certification than the buyer requires, and the buyer's quality team should reject the MTR and request a re-issue at the required certificate type. The [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/) covers the MTR field interpretation in detail; the procurement decision is the certificate type, the field-of-issue (mill vs distributor), and the MTR format (EN 10204 vs AMS 2370 vs customer-specific).


## The traceability chain: from VAR ingot to finished part

The traceability chain is the sequence of records that links the finished part to the original VAR ingot. The chain is the buyer's defence in a service failure investigation, and the chain is the audit point for AS9100D. The standard chain for a titanium CNC part is:

**Step 1 — Mill VAR melt.** The mill produces the VAR ingot, with a unique heat number (typically a 6-digit number) recorded on the MTR. The heat number is the only way to link the part to the original ingot.

**Step 2 — Mill forge or roll.** The mill converts the VAR ingot into bar, plate, sheet, or forging, with the heat number carried through the conversion. The conversion record (typically a Mill Process Record or a Mill Routing Record) ties the heat number to the bar/plate/sheet/forging lot.

**Step 3 — Distributor (if used).** The distributor receives the mill product, with the mill's heat number and the distributor's batch number on the receiving record. The distributor's batch number is the link between the mill's heat number and the shop's lot number.

**Step 4 — Shop receiving.** The shop receives the material from the distributor (or directly from the mill), with the receiving record including the mill's heat number, the distributor's batch number, and the shop's lot number. The receiving record is the link between the distributor's batch number and the shop's lot number.

**Step 5 — Shop machining.** The shop machines the part, with the shop's lot number carried through the machining. The shop's traveler (the per-part record of the operations) ties the lot number to the part number.

**Step 6 — AS9102 FAI.** The FAI records the part number, the print revision, the lot number, and the MTR's heat number. The FAI is the link between the part number and the lot number, and the lot number is the link to the heat number.

**Step 7 — Shipping.** The shop ships the part to the buyer, with the shipping record including the part number, the lot number, the quantity, and the buyer's PO. The shipping record is the link between the shop and the buyer.

The chain is verified at every step, and the verification is documented. A break in the chain at any step is a traceability loss, and the buyer's quality team should reject the part (or the package) until the chain is restored. The verification is typically done at the FAI review, where the buyer's source quality team confirms that the MTR's heat number on the FAI matches the heat number on the receiving record, matches the lot number on the shop's traveler, and matches the lot number on the shipping record.

The traceability chain is the buyer's audit point for AS9100D. The annual AS9100D audit includes a review of the traceability chain for a sample of parts, and the auditor will reject a part (and issue a finding) if the chain is not complete. The procurement decision is to require the traceability chain in the documentation package, and to verify the chain at the FAI review. The [material certification and traceability guide](/blog/titanium-material-certification-traceability-guide/) covers the traceability discipline in detail.


## Retention and disposition: how long and where

The retention period is the time that the documentation package must be kept by the shop and by the buyer. The retention period is application-specific, and the period is set by the relevant standard or regulation:

- **AS9100D (aerospace).** Minimum 7 years retention for the documentation package, per the AS9100D quality management standard. Many aerospace programs require 10–25 years, depending on the program (e.g., 25 years for civil aircraft primary structure, 10 years for non-safety-critical parts). The retention is the buyer's responsibility after the parts are shipped, and the shop's responsibility for the parts in production.
- **ISO 13485 (medical devices).** Minimum retention equal to the lifetime of the medical device, plus 2 years (per ISO 13485:2016 § 7.5.10). For titanium implants, this typically means 15–25 years. The retention is the medical device manufacturer's responsibility, and the retention includes the design history, the manufacturing history, and the traceability records.
- **ASME BPVC Section VIII (pressure vessels).** Retention for the lifetime of the vessel, with the documentation package available for inspection by the authorised inspector. The retention is the vessel owner's responsibility.
- **DFARS / ITAR (US defense).** Retention per the relevant DFARS or ITAR clause, typically 7–10 years for DFARS and indefinite for ITAR (with specific retention rules for classified parts). The retention is the prime contractor's responsibility, with the supplier's documentation as the supporting evidence.
- **Customer-specific.** Some customers (Boeing, Airbus, Lockheed, Safran, Rolls-Royce) have their own retention requirements that exceed the standard. The procurement spec should reference the customer-specific retention if the part is for a customer-specific program.

The retention medium is the medium in which the documentation package is stored. The three options:

- **Paper.** The traditional medium, with the documentation package in a paper folder or binder, stored in a fire-resistant cabinet. Paper is durable (50+ years) but bulky, and the retrieval is manual. Paper is the standard for medical and defense programs where the audit requires a physical record.
- **PDF (digital).** The current standard, with the documentation package scanned or generated as PDF, stored on a network drive or a document management system. PDF is compact and the retrieval is fast, but the long-term durability is dependent on the storage media (a 10-year-old hard drive may not be readable). PDF is the standard for aerospace and commercial programs.
- **PDF/A (digital, archival).** A subset of PDF designed for long-term archival (ISO 19005). PDF/A embeds the fonts and the metadata in the file, so the file is readable in 50+ years without the original software. PDF/A is the standard for medical and defense programs that require long-term retention.

The procurement decision is the retention period and the retention medium. A buyer who specifies "7 years, PDF" for an aerospace program is meeting the AS9100D minimum but not the customer-specific maximum. A buyer who specifies "25 years, PDF/A" for a medical implant is meeting the ISO 13485 requirement.


## Digital documents, signatures, and PDF/A

The digital workflow is the modern standard for the documentation package. The workflow has four components, each of which has its own procurement decision:

**Document format.** The standard is PDF/A (ISO 19005), which is the archival-grade PDF. PDF/A embeds the fonts and the metadata in the file, so the file is readable in 50+ years without the original software. A buyer who accepts plain PDF (not PDF/A) accepts the risk that the file may not be readable in 20+ years (the original software may be obsolete, the fonts may be missing, the metadata may be corrupted). A buyer who requires PDF/A accepts the higher cost of the file generation, but the cost is small and the long-term durability is preserved.

**Digital signatures.** The standard for digital signatures in aerospace and medical is the PKCS#7 signature (the standard used by Adobe Acrobat and Microsoft Office) or the XAdES signature (the standard used in European government and defense). The signature must be supported by a public key infrastructure (PKI) that includes a certificate authority (CA) recognised by the buyer. A buyer who accepts a self-signed signature (a signature without a CA) accepts the risk that the signature may not be verifiable in 20+ years (the signing software may be obsolete, the CA may no longer recognise the certificate). A buyer who requires a CA-recognised signature accepts the higher cost of the certificate, but the verification is preserved.

**Document management system (DMS).** The platform that stores the documentation package and provides the audit trail, the access control, the retention management, and the search and retrieval. The standards are ISO 15489 (records management) and ISO 27001 (information security). A buyer who accepts a custom file-system-based DMS (a network drive with a folder structure) accepts the risk of inconsistent access control, no audit trail, and no retention management. A buyer who requires a certified DMS (e.g., a SharePoint or a Documentum with ISO 27001 certification) accepts the higher cost of the system, but the audit and security are preserved.

**Retention automation.** The system that automatically deletes or archives the documents at the end of the retention period. A buyer who accepts manual retention management (a person reviewing the documents and deleting them at the end of the retention period) accepts the risk of inconsistent retention, accidental deletion, and audit findings. A buyer who requires automated retention (the DMS automatically deletes or archives at the retention date) accepts the higher cost of the system, but the consistency is preserved.

The procurement decision is the document format, the signature standard, the DMS, and the retention automation. A buyer who specifies PDF/A, a CA-recognised signature, a certified DMS, and automated retention has a digital workflow that meets the AS9100D, ISO 13485, and most customer-specific requirements. A buyer who accepts a less rigorous workflow accepts the corresponding audit and security risks.


## Compliance documents: DFARS, ITAR, RoHS, REACH

Beyond the MTR, CoC, and FAI, the documentation package typically includes compliance documents that verify the part meets the buyer's regulatory and customer-specific requirements. The four most common compliance documents:

**DFARS (Defense Federal Acquisition Regulation Supplement).** The US Department of Defense requirement that the material be melted or produced in a qualifying country (typically the US, UK, Canada, Australia, or a NATO ally) for defense contracts. The DFARS compliance document is a mill-issued statement that the material was melted in a qualifying country. The document is typically a one-line statement on the MTR ("Melted in USA" or "Melted in UK"), and the document is required for any titanium part that is destined for a US defense program. A buyer who omits the DFARS statement accepts the risk that the part is rejected at the buyer's DCAA audit.

**ITAR (International Traffic in Arms Regulations).** The US Department of State requirement that defense-related technical data and articles not be transferred to non-US persons without authorisation. The ITAR compliance document is a statement that the part and the technical data are ITAR-controlled, and that the supplier has the export-control procedures in place to prevent unauthorised transfer. The document is typically a one-line statement on the CoC. A buyer who omits the ITAR statement accepts the legal risk of an unauthorised transfer.

**RoHS (Restriction of Hazardous Substances).** The EU Directive 2011/65/EU that restricts the use of lead, mercury, cadmium, hexavalent chromium, and certain flame retardants in electrical and electronic equipment. Titanium is inherently compliant with RoHS (no restricted substances in the alloy), but the surface treatment (some chromate conversion coatings contain hexavalent chromium) and the marking ink (some contain lead chromate) may not be compliant. The RoHS compliance document is a statement that the part and the surface treatment comply with RoHS.

**REACH (Registration, Evaluation, Authorisation and Restriction of Chemicals).** The EU regulation that requires the registration of chemical substances used in the EU market. Titanium is not directly REACH-regulated, but the surface treatment chemicals and the marking inks may be. The REACH compliance document is a statement that the chemicals used in the surface treatment and the marking are REACH-compliant.

The procurement decision is the compliance documents. A buyer who specifies DFARS, ITAR, RoHS, and REACH in the documentation package is asking the supplier to verify the part's compliance with the relevant US defense and EU environmental regulations. A supplier who cannot provide the compliance documents is a supplier who cannot sell to the program. The cost of the compliance documents is small (typically $10–$50 per part for the document preparation) and the cost of a missing document is typically a program-level rejection of the part or the program.


## Documentation package checklist

- Specify the package contents: MTR per EN 1024, CoC, AS9102 FAI, supplementary inspection records, and any customer-specific or program-specific documents.
- Specify the EN 10204 certificate type (3.1 default for aerospace and medical; 3.2 for high-criticality applications; 2.2 is rarely acceptable for critical parts).
- Specify the traceability chain: from the mill heat number to the buyer's PO, with the chain documented at every step.
- Specify the retention period and the retention medium (7 years, PDF for AS9100D; 25 years, PDF/A for medical; lifetime, paper or PDF/A for pressure vessels; customer-specific for defense).
- Specify the digital workflow: PDF/A, CA-recognised signature, certified DMS, automated retention.
- Specify the compliance documents: DFARS, ITAR, RoHS, REACH, and any customer-specific compliance.
- Specify the supplier qualification: AS9100D certification (per the [AS9100D quality management article](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/)), ISO 13485 certification for medical, NORSOK or customer-specific certification for oil and gas.
- Verify the package at the FAI review. The package is part of the [AS9102 FAI process](/blog/as9102-fai-titanium-parts/), and the buyer's source quality team reviews the package as part of the FAI approval.
- Track the package acceptance rate and the time-to-approval, and use the data to drive process improvements.
- For multi-year programs, plan the documentation package workflow in advance, including the DMS, the digital signature infrastructure, and the retention automation.

For a documentation package review against a specific titanium program, send the print, the inspection plan, the MTR format, the certificate type, and the retention requirement to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with package contents, certificate type, traceability chain, and digital workflow recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium documentation package against the checklist above before the buyer's submission, and the typical outcome is a review that surfaces 1–2 package-content gaps per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the documentation package is what determines whether a material mix-up, a process deviation, or a traceability loss is caught at the FAI or at the service failure — and that determination is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Documentation package composition: Stacked bar chart showing the relative content (pages or sections) of each component of the documentation package (MTR, CoC, FAI, supplementary records, compliance documents). The chart shows the typical distribution of the package content by document type. Supports queries about what the documentation package contains.
Fig 2 — Traceability chain diagram: Horizontal flow diagram showing the seven steps of the traceability chain from mill VAR melt to shipping, with the heat number / batch number / lot number / part number / PO labelled at each step. Supports queries about how the traceability chain works.
Fig 3 — EN 10204 certificate type comparison: Comparison chart of the four certificate types (2.1, 2.2, 3.1, 3.2) with the issuing authority, the test result validation, and the typical application. Supports queries about which certificate type to specify for a given application.
-->