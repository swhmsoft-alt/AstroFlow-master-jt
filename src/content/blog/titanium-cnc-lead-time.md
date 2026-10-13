---
title: "Titanium CNC Lead Time: What Determines the Production Schedule?"
description: "Engineering guide to titanium CNC lead time — material sourcing, queue position, machining cycle, in-process inspection, surface treatment, documentation, and shipping. Covers prototype, low-volume, and production lead times with the bottlenecks that compress or extend each segment of the schedule."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Procurement & Services
tags: [Lead Time, Production Schedule, CNC Machining Lead Time, Titanium Sourcing, Surface Treatment, Heat Treatment, Documentation, RFQ, Titanium Procurement]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-lead-time-cover.jpg
coverImageAlt: PLACEHOLDER — production schedule board with titanium CNC lead time milestones. To be replaced with the final image.
featured: false
---

Lead time on a titanium CNC order is determined less by the machining cycle than by everything that surrounds it. The actual spindle time for a typical aerospace bracket might be 4–8 hours; the order-to-delivery time for the same bracket is typically 4–8 weeks. The gap is material sourcing, queue position, in-process inspection, surface treatment, heat treatment, documentation, and shipping — and on titanium, each of those segments is longer than on the equivalent steel or aluminum part. A buyer who asks "what is your lead time?" without specifying the lot size, the material, and the surface-treatment scope is going to receive a number that misses the actual constraint on the schedule.

This article works through the seven segments of a titanium CNC lead time, the bottlenecks that compress or extend each segment, and the procurement levers that move the schedule. It assumes the [supplier selection guide](/blog/how-to-choose-titanium-cnc-machining-supplier/) and the [RFQ checklist](/blog/titanium-cnc-machining-rfq-checklist/) as background — those cover the supplier qualification and RFQ preparation; here we focus on the production-schedule side of lead time. For the cost-side decision (how quantity affects unit price), the [MOQ and quantity pricing article](/blog/titanium-cnc-moq-quantity-pricing/) and the [prototype-to-production guide](/blog/titanium-cnc-prototype-to-production/) are the cross-references.

- [Why lead time on titanium is dominated by non-machining segments](#why-lead-time-on-titanium-is-dominated-by-non-machining-segments)
- [The seven segments of a titanium CNC lead time](#the-seven-segments-of-a-titanium-cnc-lead-time)
- [Material sourcing: the first and most variable segment](#material-sourcing-the-first-and-most-variable-segment)
- [Queue position and machine availability](#queue-position-and-machine-availability)
- [Machining cycle: the visible but small segment](#machining-cycle-the-visible-but-small-segment)
- [In-process inspection, FAI, and CMM time](#in-process-inspection-fai-and-cmm-time)
- [Surface treatment, heat treatment, and outside services](#surface-treatment-heat-treatment-and-outside-services)
- [Documentation, packaging, and shipping](#documentation-packaging-and-shipping)
- [Lead time benchmarks by order type](#lead-time-benchmarks-by-order-type)
- [Lead time checklist](#lead-time-checklist)

## Why lead time on titanium is dominated by non-machining segments

The spindle time on a typical titanium aerospace or medical part is the smallest segment of the order-to-delivery lead time. A production bracket might run 4–8 hours of spindle time; a small medical implant might run 30–60 minutes; a complex structural part might run 20–40 hours. None of these numbers explain a 4–8 week lead time. The explanation is the six other segments that wrap around the spindle time, and on titanium each of those segments is longer than on the equivalent steel or aluminum part. The buyer who asks "what is the lead time?" without specifying the lot size, the material spec, and the surface-treatment scope is going to receive a number that misses the actual constraint.

The seven segments, in chronological order, are:

1. **Material sourcing** — mill order, mill certificate, receiving inspection.
2. **Queue position and machine availability** — where the order sits in the shop's production schedule, and whether the right machine is available.
3. **Machining cycle** — setup, roughing, finishing, deburring.
4. **In-process inspection and FAI** — first-article inspection, in-process probing, CMM cycle time.
5. **Surface treatment and heat treatment** — anodizing, passivation, painting, plating, stress relief, solution treatment.
6. **Documentation and packaging** — MTR, CoC, AS9102 report, dimensional layout, packaging, shipping prep.
7. **Shipping** — packing, customs (for international orders), freight, last-mile delivery.

On a 4–8 week order, the typical distribution is roughly 1–2 weeks for material sourcing, 1–2 weeks for queue position, 1–3 days for the machining cycle, 1–3 days for inspection and FAI, 1–2 weeks for surface treatment and outside services, 2–5 days for documentation and packaging, and 1–2 weeks for shipping. The machining cycle is roughly 10–20% of the total lead time. The rest is material, queue, and outside services.

The procurement levers that move the schedule are concentrated in the non-machining segments. Pre-ordering material against a forecast, releasing the PO with a clear FAI and documentation scope, and selecting a supplier with in-house surface treatment all compress the schedule more reliably than asking the shop to run the spindle faster. The next sections walk through each segment and the levers that apply.

## The seven segments of a titanium CNC lead time

The segment table below is the working reference for the rest of the article. Each row is sized for a typical production titanium aerospace or medical part (a 50–200 mm bracket or fitting, in CP Grade 2, Grade 5, or Grade 23, with a 4–6 week total lead time). The "fast" column assumes the segment is on the critical path with no waiting; the "typical" column is what a buyer should expect on a new order; the "extended" column is what happens when the segment encounters a bottleneck.

| Segment | Fast | Typical | Extended | Bottleneck trigger |
|---|---|---|---|---|
| Material sourcing | 3–5 days (stock on hand) | 1–2 weeks (mill order + cert + receiving) | 4–8 weeks (mill run, unusual grade, large size) | Non-standard grade, large bar size, AMS spec, MTR not in stock |
| Queue position | 1–3 days (slot available) | 1–2 weeks (queue + setup) | 4–6 weeks (capacity constraint) | Shop at capacity, large setup, complex fixture |
| Machining cycle | 4–8 hours (simple part) | 1–3 days (multi-op) | 1–2 weeks (complex multi-face, 5-axis) | Tight tolerance, 5-axis, multiple setups, exotic alloy |
| Inspection and FAI | 4–8 hours | 1–2 days | 3–5 days (tight tolerance, large CMM cycle) | Tight tolerance, complex datum scheme, AS9102 scope |
| Surface treatment and heat treatment | 1 week | 1–2 weeks | 3–6 weeks (vendor queue) | Outside-vendor queue, multiple processes, certification |
| Documentation and packaging | 1–2 days | 2–5 days | 1–2 weeks (large AS9102 report, full inspection layout) | Large part count, full inspection layout, customer-specific format |
| Shipping (international) | 3–5 days (express) | 1–2 weeks (air freight) | 3–6 weeks (sea freight) | Customer-specified freight mode, customs hold, route disruption |

The table is a starting point, not a contract. The actual lead time on a given order is the sum of the segments, modified by which segment is the bottleneck for the specific part. The rest of the article walks through each segment and the levers that compress it.


## Material sourcing: the first and most variable segment

Material sourcing is the most variable segment of a titanium CNC lead time, and it is the segment where procurement has the most leverage. Three variables determine the segment length:

**1. Material stock on hand at the supplier.** A shop that stocks titanium bar and plate in the common grades (CP Grade 2, Grade 5, Grade 5 ELI / Grade 23) and the common sizes (round bar up to 200 mm diameter, plate up to 25 mm thickness) can deliver a typical order in 3–5 days from PO. A shop that orders material per-PO from a mill distributor adds 1–2 weeks to the segment, and a shop that orders per-PO from a mill adds 4–8 weeks for non-standard sizes or grades. The procurement lever is to specify a stocked grade and size on the print, or to select a supplier that stocks the spec.

**2. Material specification (MTR, CoC, EN 10204 type).** A standard EN 10204 3.1 mill test report is the default for most titanium aerospace and medical orders, and it is available from any major mill distributor with a 1–2 week material lead time. A 3.2 certificate (independent inspection by a third party) adds 1–2 weeks to the cert preparation. A customer-specific MTR format (Boeing, Airbus, Lockheed) typically adds 1–3 weeks. The procurement lever is to specify EN 10204 3.1 unless 3.2 is contractually required, and to flag the MTR format requirement on the PO at the time of order.

**3. Material grade and form.** Common grades (CP Grade 2, Grade 5) in common forms (round bar, plate, sheet) are stocked by every major mill distributor. Less common grades (Grade 23 ELI, Grade 9, beta alloys like Ti-10V-2Fe-3Al) in less common forms (large-diameter bar, thick plate, custom forging) require a mill run that adds 4–8 weeks. The procurement lever is to standardise on the stocked grades and forms where the application allows.

The material sourcing segment is the place where the buyer's "lead time question" most often misses the actual constraint. A shop quoting 4 weeks for a Grade 5 aerospace bracket with standard bar stock is quoting 1 week of material sourcing plus 3 weeks of queue and cycle. The same shop quoting the same bracket in Grade 23 ELI with a 250 mm diameter bar (a non-standard size) is quoting 6–8 weeks of material sourcing plus the same 3 weeks. The buyer's question "what is the lead time?" should be "what is the lead time for this grade, this form, this MTR format, and this lot size?"

The [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/) and the [material certification and traceability article](/blog/titanium-material-certification-traceability-guide/) cover the MTR-side questions in detail. The procurement-side question is which MTR format the program actually needs.


## Queue position and machine availability

Queue position is the segment that varies the most by supplier and by season. A shop at 80% capacity can typically start a new order in 1–3 days; a shop at 100% capacity starts new orders in 1–4 weeks. The procurement levers on the queue segment are supplier selection (choose a shop with capacity buffer) and order timing (place orders outside the supplier's peak season, which for titanium tends to be Q2 and Q4).

Machine availability is the sub-segment of queue. A 3-axis mill can handle most titanium production orders; a 5-axis machine is required for complex multi-face parts and is the constraint on supplier capacity. A shop with 5-axis capacity can run a 5-axis part in the same queue position as a 3-axis part; a shop without 5-axis capacity must either sub-contract the 5-axis work (adding 1–3 weeks) or run the part on a 3-axis mill with multiple setups (adding 2–5 days of cycle time). The procurement lever is to specify the machine requirement on the RFQ and select a supplier that has the right machine in-house.

The queue segment is also where supplier selection and supplier qualification interact. A shop that has been pre-qualified by the buyer's supplier qualification team (per the [AS9100 qualification guide](/blog/how-to-qualify-as9100-titanium-supplier/)) can start a new order with a 1–2 day administrative lead time. A shop that has not been pre-qualified adds 1–3 weeks of qualification paperwork, audit scheduling, and PO approval before the queue position starts.

## Machining cycle: the visible but small segment

The machining cycle is the segment the buyer thinks about most, and the segment that is least consequential to the total lead time on a typical titanium order. A production bracket with 4–8 hours of spindle time can run on a single 3-axis mill in 1–2 shifts, or on a 5-axis mill in a single shift. The cycle is bounded by the spindle time, the tool-change frequency, and the number of setups.

The procurement levers on the machining cycle are limited. The shop can run the spindle faster (shorter cycle, shorter tool life, higher cost), or run the spindle slower (longer cycle, longer tool life, lower cost), but the cycle time variation is typically 20–40% around the recommended parameters. The buyer's procurement lever is to specify the cycle time tolerance on the RFQ (e.g., "1–3 day cycle for this bracket class") rather than to specify the parameters; the shop will pick the parameters that meet the cycle time at the cost target.

The exception is parts with extended cycle times — large structural parts, deep-pocket features, or thin-wall features that require multiple setup changes. For these parts, the machining cycle can extend to 1–2 weeks, and the cycle becomes a meaningful segment of the total lead time. The procurement lever is to flag these parts at the RFQ stage so the shop can plan capacity.

## In-process inspection, FAI, and CMM time

In-process inspection and FAI (first-article inspection) is a small segment in days but a critical segment in quality. The segment includes:

- **In-process probing** during the machining cycle (typically 2–5 minutes per feature, integrated with the cycle).
- **First-article inspection** for the first part off the cycle (CMM cycle plus operator time, typically 1–4 hours for a 20–40 feature part).
- **AS9102 documentation** for AS9100D programs (per the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/)), which adds 1–2 hours of report preparation per part number.
- **CMM cycle time for production parts**, which scales with feature count and tolerance. A 30-feature part at ±0.05 mm has a CMM cycle of 45–90 minutes; a 50-feature part at ±0.025 mm has a cycle of 2–4 hours. For a 10-part production run, the total CMM time is 8–40 hours.

The procurement lever on the inspection segment is the FAI scope. A buyer who requires AS9102 FAI on every part (rather than on the first part only) multiplies the inspection time by the lot size. A buyer who requires 100% CMM inspection on every part (rather than on a sampling basis) multiplies the CMM time by the lot size. Both are valid requirements, but they should be specified at the RFQ stage so the shop can plan the inspection capacity.

The [CMM total cost of ownership article](/blog/5-year-cmm-total-cost-of-ownership-aerospace-startup/) covers the inspection-capacity cost side; the [FAI article](/blog/as9102-fai-titanium-parts/) covers the FAI scope side.


## Surface treatment, heat treatment, and outside services

Surface treatment and heat treatment are the segments that produce the largest single compression or extension of the total lead time. The segment length depends on whether the supplier has the process in-house or sub-contracts it, and on the vendor's queue position at the time of the order.

**Surface treatment options on titanium** (covered in detail in the [surface treatment guide](/blog/ultimate-guide-titanium-surface-treatments-aerospace/)):

- **Passivation** per ASTM F86 (nitric acid pickling + nitric acid passivation) is the most common, with a 3–5 day cycle at a typical outside vendor.
- **Anodizing** (Type II sulfuric, Type III hardcoat) is widely available, with a 5–10 day cycle.
- **Electropolishing** for medical implants is more specialised, with a 1–2 week cycle at a medical-certified vendor.
- **Painting, primer, topcoat** per MIL-spec or customer spec is widely available, with a 1–2 week cycle.
- **Plating** is rare on titanium (the chemistry is unfavourable) and is typically avoided.

**Heat treatment options on titanium**:

- **Stress relief** at 480–650 °C, with a 1–2 day cycle (plus 1–2 days for the vacuum furnace if used).
- **Solution treatment and aging (STA)** for Grade 5 in the high-strength condition, with a 2–4 day cycle.
- **Annealing** for CP grades, with a 1–2 day cycle.

The procurement lever on the surface treatment and heat treatment segment is supplier selection. A supplier with in-house passivation, anodizing, and stress relief can run the segment in 1–2 weeks; a supplier that sub-contracts all outside services adds 1–3 weeks for the vendor queue plus 3–7 days for shipping each way. For orders that require multiple outside services (passivation + anodizing + painting, for example), the queue compounds across vendors, and the segment can extend to 3–6 weeks.

For AS9100D programs, the outside service must be on the supplier's approved-vendor list. A buyer who requires a specific outside service that is not on the supplier's list adds 2–4 weeks of approved-vendor qualification. The procurement lever is to specify the outside service requirement at the RFQ stage so the supplier can confirm the approved-vendor status before the order is placed.

## Documentation, packaging, and shipping

Documentation and packaging is the segment that compresses most reliably with preparation, and extends most reliably with a last-minute scramble. The segment includes:

- **MTR and CoC preparation** (covered in the [MTR article](/blog/how-to-read-titanium-mill-test-report/) and the [documentation package article](/blog/titanium-cnc-quality-documentation-package/)), typically 1–2 days for a standard order.
- **AS9102 first-article report**, typically 1–2 days per part number, including CMM layout preparation and report formatting.
- **Customer-specific documentation** (Boeing D6-82479, Airbus AITM, Lockheed, NASA), typically 2–5 days depending on the format.
- **PPAP (Production Part Approval Process)** for automotive customers, typically 1–2 weeks per part number for the initial submission.
- **Packaging** per customer spec (military pack, individual pack, anti-static, vacuum-sealed), typically 1–2 days.
- **Shipping preparation** including customs documentation for international orders, typically 1–2 days.

The procurement lever on the documentation segment is to specify the documentation scope at the RFQ stage. A buyer who requires AS9102 + customer-specific format + PPAP multiplies the documentation time by 3–5×. A buyer who requires only MTR + CoC keeps the segment to 1–2 days. The standard for AS9100D production runs is MTR + CoC + AS9102 FAI report, which is 2–5 days for a typical part.

**Shipping** for international orders is the final segment, and it varies from 3–5 days (express air freight) to 3–6 weeks (sea freight). The standard for titanium aerospace and medical orders is air freight, with a 1–2 week door-to-door transit time including customs clearance. For large or heavy orders (>100 kg), sea freight may be required, which adds 2–4 weeks.

The procurement lever on shipping is to specify the freight mode at the RFQ stage, and to confirm the Incoterms (EXW, FOB, CIF, DDP) and the destination port. The [logistics article](/capabilities/logistics/) covers the Incoterms and shipping terms in detail; the buyer who specifies DDP at a non-standard destination adds 1–2 weeks to the segment.


## Lead time benchmarks by order type

The benchmarks below are the typical total order-to-delivery lead times for a production titanium CNC order, segmented by order type. The benchmarks assume a stocked material, a 3-axis or 5-axis machine, a standard passivation or anodizing surface treatment, MTR + CoC + AS9102 documentation, and air freight for international shipping.

| Order type | Lot size | Geometry | Total lead time | Bottleneck segment |
|---|---|---|---|---|
| Prototype, 1–5 parts | 1–5 | Simple, no tight tolerance, no surface treatment | 2–3 weeks | Queue + setup, no material bottleneck |
| Prototype, 1–5 parts | 1–5 | Tight tolerance or surface treatment | 3–5 weeks | Inspection + surface treatment |
| Low-volume production | 10–50 | Standard, Grade 5, passivation, AS9102 | 4–6 weeks | Queue + surface treatment |
| Medium-volume production | 50–200 | Standard, Grade 5, passivation, AS9102 | 5–7 weeks | Material + queue + surface treatment |
| High-volume production | 200+ | Standard, Grade 5, passivation, AS9102 | 6–10 weeks | Material + queue + inspection |
| Aerospace structural part | 5–50 | 5-axis, tight tolerance, multiple surface treatments | 6–10 weeks | Surface treatment + inspection |
| Medical implant | 10–100 | Tight tolerance, electropolishing, full documentation | 5–8 weeks | Surface treatment + documentation |
| Custom forging or billet | 1–20 | Special stock form, large bar | 8–14 weeks | Material + surface treatment |

The benchmarks are typical, not contractual. A supplier with in-house surface treatment, pre-stocked material, and pre-qualified queue can compress each segment by 20–40% relative to a supplier that sub-contracts and orders per-PO. The compression compounds across the segments, so a fully-prepared supplier can deliver a typical production order in 3–4 weeks where a typical supplier takes 5–6 weeks.

The procurement-side question is not "what is your lead time?" but "what is your lead time for this grade, this form, this surface treatment, this documentation scope, and this freight mode?" The answer to the second question is the actionable number, and the buyer's specification of the parameters is what makes the answer reliable.

## Lead time checklist

- Specify the material grade, form, and size on the print. Stocked grades and forms compress the material sourcing segment from 4–8 weeks to 3–5 days.
- Specify the MTR format (EN 10204 3.1 default; 3.2 or customer-specific only when required).
- Identify the machine requirement (3-axis vs 5-axis) at the RFQ stage. Selecting a supplier with the right machine in-house eliminates the sub-contract queue.
- Specify the FAI scope (AS9102 on the first part only, by default; full FAI only when contractually required).
- Specify the surface treatment scope at the RFQ stage. Selecting a supplier with in-house passivation, anodizing, and stress relief compresses the segment from 3–6 weeks to 1–2 weeks.
- Specify the documentation scope (MTR + CoC + AS9102 by default; PPAP or customer-specific format only when required).
- Specify the freight mode (air freight for typical aerospace/medical orders; sea freight for large or heavy orders) and the Incoterms.
- Pre-qualify the supplier to avoid the 1–3 week qualification paperwork that adds to a first order.
- Plan orders outside the supplier's peak season (Q2 and Q4 for titanium) to avoid the queue segment extending.
- Ask for the segment-by-segment lead time breakdown on the RFQ response, not just the total. The breakdown identifies which segment is the bottleneck for the specific order.

For a lead time review against a specific titanium program, send the STEP file and the print to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with material, queue, surface treatment, and documentation scope. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium RFQ against the checklist above before any PO is committed, and the typical outcome is a lead time projection that surfaces 1–2 segments where the buyer's specification is forcing a longer schedule than the application requires. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the segment-by-segment lead time review is what determines whether a 4-week schedule is realistic or whether the application actually requires a 6–8 week schedule — and that distinction is what drives the rest of the procurement planning.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Lead time segment waterfall: Horizontal stacked bar chart showing the seven lead time segments for a typical 6-week titanium production order, with each segment labeled and sized in days. Supports queries about which segment dominates titanium lead time.
Fig 2 — Material sourcing lead time vs grade: Bar chart with grade on X axis (CP Grade 2, Grade 5, Grade 23 ELI, Grade 9, beta alloy) and lead time on Y axis (3 days to 8 weeks), showing the compounding effect of grade rarity on the material segment. Supports queries about titanium material lead time.
Fig 3 — Surface treatment vendor queue: Bar chart with surface treatment type on X axis (passivation, anodizing Type II, anodizing Type III, electropolishing, painting) and queue days on Y axis (3 to 21 days), highlighting the queue variability across vendors. Supports queries about surface treatment lead time for titanium.
-->