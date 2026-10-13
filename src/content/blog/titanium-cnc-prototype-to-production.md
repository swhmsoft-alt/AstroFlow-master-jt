---
title: "From Titanium CNC Prototype to Production: A Buyer's Guide"
description: "Procurement and engineering guide to transitioning a titanium CNC part from prototype to production — phase gates, design freeze, supplier qualification, process validation, change control, PPAP/AS9102 documentation, and the typical timeline from first article to volume order."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Procurement & Services
tags: [Prototype to Production, Phase Gate, Design Freeze, PPAP, AS9102, Change Control, Supplier Qualification, Process Validation, Titanium CNC, Production Ramp]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-prototype-to-production-cover.jpg
coverImageAlt: PLACEHOLDER — a titanium part transitioning from prototype inspection to production line. To be replaced with the final image.
featured: false
---

The transition from titanium CNC prototype to production is the highest-risk phase of a part's lifecycle, and the phase most often under-managed by procurement teams. A prototype run proves the design and the process, but it does not prove that the same design and the same process will deliver 500 or 5,000 parts in volume. The transition to production is where the hidden costs of the prototype phase (loose tolerances, generous scrap reserves, untested cycle time) are paid back as the supplier moves from a per-part prototype price to a per-part production price, and where the un-controlled changes (drawing revisions, material substitutions, supplier switches) compound into scrap, rework, and delivery slippage.

This article works through the four phases of the prototype-to-production transition, the phase gates that mark the transition between phases, the documentation that the supplier must produce at each phase, and the change-control discipline that protects the part's design and the supplier's process. It assumes the [MOQ and quantity pricing article](/blog/titanium-cnc-moq-quantity-pricing/) and the [lead time article](/blog/titanium-cnc-lead-time/) as background — those cover the per-part price curve and the schedule; here we focus on the transition process. For the cost side, the [cost factors article](/blog/titanium-cnc-machining-cost-factors/) is the cross-reference.

- [Why the prototype-to-production transition is the riskiest phase](#why-the-prototype-to-production-transition-is-the-riskiest-phase)
- [Phase 1: Design validation and prototype (1–10 parts)](#phase-1-design-validation-and-prototype-1-10-parts)
- [Phase 2: Process validation and pre-production (10–50 parts)](#phase-2-process-validation-and-pre-production-10-50-parts)
- [Phase 3: Production ramp and qualification (50–500 parts)](#phase-3-production-ramp-and-qualification-50-500-parts)
- [Phase 4: Steady-state production (500+ parts)](#phase-4-steady-state-production-500-parts)
- [Design freeze, change control, and revision discipline](#design-freeze-change-control-and-revision-discipline)
- [The documentation chain from prototype to PPAP](#the-documentation-chain-from-prototype-to-ppap)
- [Prototype-to-production checklist](#prototype-to-production-checklist)

## Why the prototype-to-production transition is the riskiest phase

Three structural risks make the prototype-to-production transition the highest-risk phase of a titanium CNC part's lifecycle:

**1. The prototype price is not the production price.** A 5-part prototype run at 2.5–3.5× the production quantity price includes a generous scrap reserve (10–20% of the unit price), a per-part setup amortization, and a per-part FAI cost. The transition to production removes the scrap reserve, amortizes the setup over the production lot, and amortizes the FAI over the lot — but the per-part price drop (50–70% from prototype to 100 parts) is what the buyer's budget is typically based on, and the transition is where the buyer expects to see the savings. If the supplier cannot deliver the expected production price, the gap is paid out of the buyer's contingency.

**2. The prototype process is not the production process.** A prototype run on a new part uses a single machine, a single operator, and a single setup. The production run uses multiple operators across multiple machines, with the part's cycle time and tool life amortized across the entire production cell. The prototype cycle time is typically 10–20% faster than the production cycle time, and the prototype tool life is typically 20–40% better than the production tool life. The transition exposes the gap between the prototype process and the production process, and the gap is paid as cycle time, scrap, and rework.

**3. The design changes between prototype and production.** Most parts undergo 2–4 design revisions between the first prototype and the production release. Each revision is a potential change in material, tolerance, surface treatment, or inspection scope — and each revision is a potential source of scrap, rework, or delivery slippage. The transition is where the buyer's change-control discipline determines whether the design is stable or whether the production run is rebuilding a moving target.

The buyer's procurement question is not "is the supplier capable?" — that is the [supplier qualification question](/blog/how-to-qualify-as9100-titanium-supplier/). The question is "is the part's design and the supplier's process stable enough to commit to a production run?" The 4-phase transition process below is the answer to that question, and the phase gates are the discipline that protects the buyer from committing to a production run before the design and the process are ready.

## Phase 1: Design validation and prototype (1–10 parts)

The first phase is the prototype run. The goal is to validate the design against the assembly fit, the functional requirements, and the manufacturing process — not to validate the supplier's production capability. The prototype run is run on a single machine, typically a 3-axis mill or a turn-mill cell, with a single operator, and the part is inspected against the drawing with hand gauges and a CMM check on the critical features.

The output of Phase 1 is a design that is "frozen" to the extent that the buyer is willing to commit to a 10–50 part pre-production run. The freeze is rarely absolute — most programs allow 1–2 design revisions between Phase 1 and Phase 2, with the revisions driven by the prototype inspection results. The discipline is to track each revision formally (drawing revision number, MTR with the new revision, AS9102 FAI on the next article) and to ensure that the supplier's process is updated to match the revised drawing.

The Phase 1 deliverables are:

- **5–10 prototype parts** that pass the buyer's incoming inspection against the print.
- **AS9102 first-article inspection report** (per the [FAI article](/blog/as9102-fai-titanium-parts/)) on the first part off the cycle.
- **CMM dimensional layout** on the first part, with all critical features measured.
- **Prototype test report** (mechanical test, fatigue test, functional test) — if the program requires it.
- **Process documentation** that captures the cycle time, the tooling, the parameters, and the inspection scope — the baseline for Phase 2.

The Phase 1 timeline is typically 2–4 weeks: 1 week for material sourcing, 1 week for queue + cycle, and 1–2 weeks for inspection, FAI, and any test report. The [lead time article](/blog/titanium-cnc-lead-time/) covers the timeline breakdown in detail.


## Phase 2: Process validation and pre-production (10–50 parts)

The second phase is the pre-production run. The goal is to validate the supplier's process — the cycle time, the tool life, the scrap rate, the inspection cycle — against the production quantity, not the prototype quantity. The pre-production run is typically 10–50 parts, on the same machine and with the same operator as the production run, and the part is inspected against the same drawing as the prototype.

The output of Phase 2 is a process that is "qualified" to the extent that the buyer is willing to commit to a 50–500 part production ramp. The qualification is documented in a process-capability report (Cpk, Pp/Ppk, control charts on critical features) and a cost-down report (cycle time per part, scrap rate, tool life per part). The Cpk target for AS9100D programs is typically ≥ 1.33 for critical features (per the [AS9100D article](/blog/as9100d-titanium-cnc-manufacturing-aerospace-quality/)). For medical programs, the Cpk target is typically ≥ 1.67 for safety-critical features.

The Phase 2 deliverables are:

- **10–50 pre-production parts** that pass the buyer's incoming inspection against the print, with no concession on critical features.
- **Updated AS9102 FAI report** on the first part of the pre-production run, with the drawing revision locked.
- **Process-capability report** with Cpk, Pp/Ppk on critical features.
- **Cycle time and tool-life report** that confirms the production-quantity cycle time and tool life.
- **Cost-down report** that compares the actual pre-production cost to the target production cost.
- **PPAP** (for automotive programs) or equivalent qualification submission.

The Phase 2 timeline is typically 4–8 weeks: 1–2 weeks for material sourcing, 1–2 weeks for queue, 1–2 weeks for cycle, and 1–2 weeks for inspection, FAI, and qualification. The buyer should plan Phase 2 as a separate purchase order from Phase 1, with the Phase 2 deliverable being the qualification report rather than a part count.

## Phase 3: Production ramp and qualification (50–500 parts)

The third phase is the production ramp. The goal is to qualify the supplier's production process at the buyer's production quantity, and to deliver the first production lot for the buyer's assembly line or downstream operation. The production ramp is typically 50–500 parts, run on the production cell (or a stand-in if the dedicated cell is not yet online), with the part inspected against the same drawing as Phase 1 and Phase 2.

The output of Phase 3 is a supplier that is "qualified for production" and a part that is "released for production" — meaning the supplier's process is documented, the buyer's inspection plan is locked, and the part's design is frozen for the production run. The qualification is documented in a PPAP (for automotive programs, per AIAG PPAP), a First Article Inspection report per AS9102 (for aerospace programs, per the [FAI article](/blog/as9102-fai-titanium-parts/)), or a customer-specific qualification submission (for medical or defense programs).

The Phase 3 deliverables are:

- **50–500 production parts** that pass the buyer's incoming inspection, with documented scrap rate and process-capability data.
- **Locked FAI report** per AS9102 (or PPAP) on the first part of the production run, with the drawing revision frozen.
- **Control plan** that documents the inspection scope, the sampling plan, the FAI frequency, and the change-control procedure for future revisions.
- **Cost-down report** that confirms the production-quantity per-part cost.
- **Supplier qualification record** that the buyer's procurement team can use to add the supplier to the approved-vendor list for the production part.

The Phase 3 timeline is typically 6–12 weeks: 2–4 weeks for material sourcing (typically a larger bar stock order or a pre-stocked material), 2–4 weeks for queue and cycle, and 2–4 weeks for inspection, FAI, and qualification. The buyer should plan Phase 3 with a buffer for the first-article issues that typically surface in the first 20–50 parts of a production run — the issues are not design issues, they are process issues (tool wear, machine drift, operator skill), and they are addressed in the first 2–3 weeks of the production run.


## Phase 4: Steady-state production (500+ parts)

The fourth phase is steady-state production. The goal is to deliver the production quantity at the production-quantity per-part cost, with the supplier's process running on a dedicated cell or a shared production line, and the buyer's inspection plan running on a sampling basis (or 100% CMM where the program requires).

The output of Phase 4 is a part that is "in production" — meaning the supplier's process is stable, the buyer's inspection plan is locking the quality, and the per-part cost is at the buyer's target. The production run is monitored against the control plan established in Phase 3, with the Cpk and scrap rate tracked over the production lot, and any deviation from the control plan triggers a Phase 3–style review.

The Phase 4 deliverables are ongoing:

- **Production parts** delivered to the buyer's schedule at the per-part cost agreed in Phase 3.
- **Periodic FAI** per the control plan (typically every 50–100 parts, or every lot, or every calibration cycle).
- **Cpk and scrap rate reports** at the agreed reporting interval (typically per lot or per quarter).
- **Change-control requests** for any drawing revision, material substitution, or process change — submitted to the buyer for approval before implementation.
- **Cost-down initiatives** that the supplier identifies during the production run (cycle time reduction, tool life extension, scrap reduction) — submitted to the buyer for evaluation.

The Phase 4 timeline is the production program's duration, which can be 6 months to 5+ years for aerospace programs, or 1–3 years for medical programs. The buyer's procurement role in Phase 4 is to monitor the per-part cost, the quality data, and the schedule, and to make the change-control decisions that the supplier requests. The supplier's role is to deliver the parts at the agreed cost and quality, and to surface any process improvements that the buyer should evaluate.

## Design freeze, change control, and revision discipline

The single most important discipline in the prototype-to-production transition is the design freeze. A design that is not frozen will produce a production run that is rebuilding a moving target, with each revision introducing scrap, rework, and delivery slippage. The freeze is a formal commitment from the buyer to the supplier that the drawing is locked for the production run, and that any change requires a formal change-control request.

The change-control process is straightforward in principle but often under-managed in practice. The standard for AS9100D programs is:

1. The buyer submits a change request (ECN — Engineering Change Notice) to the supplier, with the revised drawing and the rationale for the change.
2. The supplier reviews the change for manufacturability and cost impact, and returns a change-cost estimate and a schedule impact.
3. The buyer approves the change-cost estimate, and the change is incorporated into the next production lot.
4. The supplier updates the FAI, the control plan, and the inspection scope to match the revised drawing.
5. The first part of the next production lot is inspected against the revised drawing, with the FAI updated.

The discipline that is often missing is the gate between Phase 1 and Phase 2: the buyer must commit to "this is the design we will produce" before the supplier commits to a 50-part pre-production run. Without the gate, the supplier is running a 50-part lot on a design that may change in the next revision, and the cost of the change is paid in scrapped parts. The gate is a formal document (typically a "design freeze letter" or a "production release" form) that the buyer signs at the end of Phase 1, and that the supplier references in the Phase 2 contract.


## The documentation chain from prototype to PPAP

The documentation chain from prototype to PPAP is the formal record of the transition. The standard for AS9100D programs is:

- **Phase 1 (prototype)**: AS9102 FAI on the first article, CMM layout, material MTR, prototype test report (if any).
- **Phase 2 (pre-production)**: Updated AS9102 FAI on the first pre-production part, process-capability report, cycle time and tool-life report, cost-down report.
- **Phase 3 (production ramp)**: Locked AS9102 FAI on the first production part, control plan, supplier qualification record.
- **Phase 4 (steady-state)**: Periodic FAI per the control plan, Cpk and scrap rate reports, change-control records, cost-down initiatives.

For automotive programs, the PPAP (Production Part Approval Process) per AIAG replaces the AS9102 FAI as the primary qualification document. The PPAP levels (1 through 5) determine the scope of the submission, with Level 3 (the most common) requiring the FAI, the material certification, the dimensional layout, the appearance approval, the test results, and the control plan. The PPAP submission is typically made at the end of Phase 3, with the buyer approving the submission before the Phase 4 production run begins.

For medical programs, the qualification submission is typically a customer-specific document that includes the FAI, the material certification, the biocompatibility data (if applicable), the sterilization validation, and the regulatory references (FDA 21 CFR 820, ISO 13485). The submission is typically reviewed by the buyer's regulatory affairs team, not just the procurement team, and the review cycle is 2–4 weeks longer than the AS9100D or automotive review.

## Prototype-to-production checklist

- Plan the 4-phase transition (prototype, pre-production, production ramp, steady-state) before placing the first PO. Each phase has a deliverable, a timeline, and a phase gate.
- Sign a design freeze letter at the end of Phase 1. The letter commits the buyer to the design for the production run, and the supplier references the letter in the Phase 2 contract.
- Require a process-capability report (Cpk, Pp/Ppk) at the end of Phase 2. The report documents the supplier's process stability and the buyer's risk for the production ramp.
- Require a locked FAI per AS9102 (or PPAP per AIAG, or customer-specific qualification) at the end of Phase 3. The locked FAI is the buyer's reference for the production run.
- Establish a change-control process for Phase 4. Any drawing revision, material substitution, or process change requires a formal change request, a cost estimate, and a buyer approval before implementation.
- Plan Phase 3 with a 2–4 week buffer for first-article process issues. The issues are not design issues, they are process issues, and they are addressed in the first 2–3 weeks of the production run.
- For multi-year programs, commit to a quantity range at the master agreement stage, and negotiate the per-part price for each range. The supplier's volume discount is real, and the buyer's commitment is the lever that unlocks it.
- Track the per-part cost, the Cpk, and the scrap rate at the agreed reporting interval. The data drives the next round of cost-down and process-improvement initiatives.

For a prototype-to-production review against a specific titanium program, send the STEP file, the expected lot size at each phase, and the program schedule to the [RFQ intake](/rfq/); the engineering team returns a phase plan and a recommendation. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium prototype-to-production program against the checklist above, and the typical outcome is a 4-phase plan that surfaces 1–2 phase-gate decisions per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the phase-gate discipline is what determines whether the production ramp runs on a stable process or on a moving target — and that decision is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — 4-phase transition diagram: Horizontal flowchart showing Phase 1 (1–10 parts, 2–4 weeks) → Phase 2 (10–50 parts, 4–8 weeks) → Phase 3 (50–500 parts, 6–12 weeks) → Phase 4 (500+ parts, ongoing), with each phase's deliverable and phase gate labeled. Supports queries about the prototype-to-production transition timeline.
Fig 2 — Per-part price vs phase curve: Line chart with phase number (1 to 4) on X axis and per-part price index on Y axis, showing the 50–70% price drop from Phase 1 to Phase 4 and the relative cost components at each phase. Supports queries about how per-part price changes through the transition.
Fig 3 — Phase gate decision tree: Decision flowchart showing the gate between Phase 1 and Phase 2 (design freeze?), Phase 2 and Phase 3 (Cpk ≥ 1.33?), Phase 3 and Phase 4 (FAI locked + control plan signed?). Supports queries about when to move from one phase to the next.
-->