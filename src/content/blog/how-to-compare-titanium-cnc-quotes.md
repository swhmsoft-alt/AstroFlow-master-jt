---
title: "How to Compare Titanium CNC Machining Quotes"
description: "Procurement guide to comparing titanium CNC machining quotes from multiple suppliers — normalizing for material, quantity, tolerance, inspection, surface treatment, and Incoterms; the hidden cost lines that change a quote ranking; and the standard 7-step comparison process that surfaces the real cost difference between suppliers."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Procurement & Services
tags: [RFQ Comparison, Quote Comparison, Procurement, Titanium CNC, Cost Analysis, Supplier Evaluation, MOQ, Incoterms, RFQ Checklist, Vendor Selection]
coverImage: /uploads/PLACEHOLDER-blog-how-to-compare-titanium-cnc-quotes-cover.jpg
coverImageAlt: PLACEHOLDER — procurement desk with multiple titanium CNC quotes laid out for comparison. To be replaced with the final image.
featured: false
---

Comparing titanium CNC quotes from multiple suppliers is a discipline most procurement teams approach casually and pay for later. The quotes arrive with different formats, different line items, different assumptions about material and surface treatment, and different terms — and the procurement engineer is asked to pick the lowest number. The result is a supplier selected on the wrong basis, a quote that did not actually include the work the buyer assumed it included, and a final invoice that is 15–40% higher than the quoted number. The fix is a structured comparison process that normalizes the quotes for the work scope, the material spec, the inspection scope, the surface treatment, and the Incoterms, and that surfaces the hidden cost lines before the PO is committed.

This article works through the 7-step comparison process that consistently produces an apples-to-apples titanium CNC quote comparison, and the 6 hidden cost lines that change a quote ranking when they are surfaced. It assumes the [general RFQ checklist](/blog/titanium-cnc-machining-rfq-checklist/) and the [supplier selection guide](/blog/how-to-choose-titanium-cnc-machining-supplier/) as background — those cover the supplier qualification and RFQ preparation; here we focus on the quote-to-quote comparison side. For the cost side beyond unit price, the [cost factors article](/blog/titanium-cnc-machining-cost-factors/) and the [MOQ and quantity pricing article](/blog/titanium-cnc-moq-quantity-pricing/) are the cross-references.

- [Why titanium CNC quotes are not directly comparable on unit price](#why-titanium-cnc-quotes-are-not-directly-comparable-on-unit-price)
- [Step 1 — Normalize the material scope](#step-1--normalize-the-material-scope)
- [Step 2 — Normalize the machining scope](#step-2--normalize-the-machining-scope)
- [Step 3 — Normalize the inspection and FAI scope](#step-3--normalize-the-inspection-and-fai-scope)
- [Step 4 — Normalize the surface treatment and heat treatment scope](#step-4--normalize-the-surface-treatment-and-heat-treatment-scope)
- [Step 5 — Normalize the documentation and packaging scope](#step-5--normalize-the-documentation-and-packaging-scope)
- [Step 6 — Normalize the Incoterms and shipping terms](#step-6--normalize-the-incoterms-and-shipping-terms)
- [Step 7 — Compare total landed cost on a normalized basis](#step-7--compare-total-landed-cost-on-a-normalized-basis)
- [Six hidden cost lines that change a quote ranking](#six-hidden-cost-lines-that-change-a-quote-ranking)
- [Quote comparison checklist](#quote-comparison-checklist)

## Why titanium CNC quotes are not directly comparable on unit price

Three structural reasons make a unit-price comparison of titanium CNC quotes misleading:

**1. The material spec may differ between quotes.** One supplier may quote CP Grade 2 bar (cost-effective, lower machinability consistency), another may quote Grade 5 (Ti-6Al-4V) bar, and a third may quote Grade 23 ELI (Ti-6Al-4V ELI). The raw material cost difference between CP Grade 2 and Grade 23 ELI is roughly 3–5× per kg, and a 100 g part carries roughly $30–$150 of material cost difference that the unit price does not reveal unless the buyer reads the material line carefully.

**2. The inspection scope may differ.** One supplier may quote 100% CMM inspection on every part, another may quote sampling-based inspection, and a third may quote no CMM at all (relying on the buyer's incoming inspection). The cost difference between 100% CMM and sampling is roughly 5–15% of the unit price for a 20-feature part. The buyer who compares on unit price is not comparing the same work scope.

**3. The surface treatment and documentation scope may differ.** One supplier may include passivation and AS9102 in the unit price, another may list them as separate line items, and a third may exclude them entirely (assuming the buyer will handle the surface treatment separately). The cost difference is typically 5–20% of the unit price, hidden in the line items that the buyer does not normalize.

A buyer who selects the supplier with the lowest unit price on these three un-normalized comparisons will typically end up with the highest landed cost. The unit price was lower because the scope was lower, and the buyer pays the difference as a separate invoice after the parts arrive. The 7-step comparison process below normalizes the scope so the unit price is comparable, and surfaces the hidden cost lines before the PO is committed.

## Step 1 — Normalize the material scope

The first normalization is the material. For each quote, verify:

- **Grade** (CP Grade 1, 2, 3, 4 / Grade 5 / Grade 5 STA / Grade 9 / Grade 23 ELI / beta alloy).
- **Form** (bar, plate, sheet, forging, casting, near-net shape).
- **Size** (diameter for bar, thickness for plate, dimensions for forging).
- **Specification** (ASTM B348, B265, B381, F136, AMS 4911, AMS 4928, etc.).
- **MTR format** (EN 10204 3.1, 3.2, customer-specific).
- **Source** (stocked at supplier, distributor, mill run).

If the material spec differs between quotes, the buyer should either (a) request that all suppliers re-quote on the same spec, or (b) adjust each quote to the same spec by adding or subtracting the material cost difference. The standard is to re-quote on the same spec; the adjustment is the fallback when re-quoting is not feasible.

The material cost difference between a stocked CP Grade 2 bar and a stocked Grade 5 bar is roughly $20–$60 per kg. The material cost difference between a stocked Grade 5 bar and a mill-run Grade 23 ELI bar at 200 mm diameter is roughly $50–$150 per kg plus a 4–8 week lead time. A quote comparison that does not normalize the material spec is comparing different products, not different prices.

## Step 2 — Normalize the machining scope

The second normalization is the machining work. For each quote, verify:

- **Number of setups** (1, 2, 3, multi-op on a single 5-axis machine).
- **Machine class** (3-axis, 4-axis, 5-axis).
- **Tolerance band** (ISO 2768-m, ISO 2768-f, explicit tighter tolerance on functional features).
- **GD&T scope** (basic ±, datum-referenced position/profile, full ASME Y14.5 with MMC/RFS modifiers).
- **Surface finish** (standard machined, fine machined, ground, polished).
- **Special processes** (deep holes, thin-wall features, exotic alloys, large parts).

The cost difference between a 3-axis and a 5-axis setup on the same part is typically 30–80% of the unit price. The cost difference between ISO 2768-f tolerance and explicit ±0.025 mm tolerance on 5 functional features is typically 20–40% of the unit price. A quote comparison that does not normalize the machining scope is comparing different work plans, not different prices.

The buyer should ask each supplier to specify the machine class, the number of setups, the tolerance band, and the GD&T scope on the quote response. A quote that does not specify these is a quote that hides the scope difference, and the buyer should request clarification before comparing.


## Step 3 — Normalize the inspection and FAI scope

The third normalization is the inspection work. For each quote, verify:

- **CMM coverage** (sampling, 100% on every part, 100% on first article only).
- **FAI scope** (AS9102 on first article only, full FAI on every part, customer-specific format).
- **In-process probing** (yes/no, and which features).
- **Surface roughness measurement** (Ra per feature, sampling, none).
- **Hardness testing** (per lot, per part, none).
- **NDT scope** (UT, X-ray, PT, ET — per the [NDT article](/blog/ndt-titanium-cnc-parts/), if any).
- **Inspection report format** (standard AS9102, customer-specific, full layout with all features).

The cost difference between sampling and 100% CMM inspection is roughly 5–15% of the unit price for a 20–30 feature part. The cost difference between AS9102 on the first article only and AS9102 on every part is roughly 3–8% of the unit price. A quote comparison that does not normalize the inspection scope is comparing different quality systems, not different prices.

The buyer should ask each supplier to specify the inspection coverage, the FAI scope, the surface roughness measurement, and the report format. A quote that does not specify these is a quote that hides the inspection scope, and the buyer should request clarification.

## Step 4 — Normalize the surface treatment and heat treatment scope

The fourth normalization is the surface treatment and heat treatment. For each quote, verify:

- **Passivation** (ASTM F86, ASTM A967, customer-specific; nitric or citric; in-house or sub-contract).
- **Anodizing** (Type II sulfuric, Type III hardcoat, customer-specific colour).
- **Electropolishing** (for medical implants; per ASTM B912 or customer spec).
- **Painting / primer / topcoat** (per MIL-spec or customer spec).
- **Stress relief** (480–650 °C, vacuum or inert atmosphere; per the [stress relief article](/blog/titanium-stress-relieving-heat-treatment-temperature-control-distortion-prevention/)).
- **Solution treatment and aging (STA)** for Grade 5 in the high-strength condition.
- **Other heat treatment** (annealing, ageing, custom cycles).

For each process, verify whether it is in-house at the supplier (shorter lead time, no shipping cost) or sub-contracted (longer lead time, adds shipping cost each way). The cost difference between in-house and sub-contracted passivation is typically 10–25% of the surface treatment cost; the lead time difference is typically 1–2 weeks. The [surface treatment guide](/blog/ultimate-guide-titanium-surface-treatments-aerospace/) covers the full set of options and their typical cost.

A quote that lists surface treatment as a separate line item with no scope detail is a quote that hides the cost of the surface treatment. The buyer should ask each supplier to specify the process, the spec, and the in-house/sub-contract status on the quote response.

## Step 5 — Normalize the documentation and packaging scope

The fifth normalization is the documentation and packaging. For each quote, verify:

- **MTR format** (EN 10204 3.1, 3.2, customer-specific; per the [MTR article](/blog/how-to-read-titanium-mill-test-report/) and the [documentation package article](/blog/titanium-cnc-quality-documentation-package/)).
- **CoC scope** (standard CoC, customer-specific CoC, dual-language).
- **AS9102 FAI report** (per the [FAI article](/blog/as9102-fai-titanium-parts/); first article only or per part).
- **PPAP** (for automotive customers; per AIAG PPAP manual).
- **Customer-specific formats** (Boeing D6-82479, Airbus AITM, Lockheed, NASA).
- **Packaging** (standard, military pack, individual pack, anti-static, vacuum-sealed, customer-spec).

The cost difference between MTR + CoC only and MTR + CoC + AS9102 + customer-specific format is typically 2–5% of the unit price. The cost difference between standard packaging and customer-spec military packaging is typically 1–3% of the unit price, but it can be 5–10% for very small or very large parts. A quote that does not specify the documentation and packaging scope is a quote that hides the work the supplier will do after the parts are made.


## Step 6 — Normalize the Incoterms and shipping terms

The sixth normalization is the Incoterms and shipping. The Incoterms determine who pays for shipping, insurance, customs, and last-mile delivery, and the cost difference between EXW and DDP for an international titanium order can be 10–30% of the unit price. The [logistics article](/capabilities/logistics/) covers the Incoterms in detail.

For each quote, verify:

- **Incoterm** (EXW, FOB, CIF, CIP, DAP, DDP — per Incoterms 2020).
- **Origin point** (supplier's plant, supplier's warehouse, named port).
- **Destination point** (buyer's plant, named port, named airport, buyer's warehouse).
- **Freight mode** (air, sea, courier, customer-specified).
- **Insurance** (supplier-provided, buyer-provided, customer-specified).
- **Customs clearance** (supplier-handled, buyer-handled, broker-specified).

If the Incoterms differ between quotes, the buyer should convert all quotes to the same Incoterm (typically DDP at the buyer's plant, or CIP at a named airport) by adding or subtracting the shipping, insurance, and customs cost. The standard is to compare on DDP at the buyer's plant, which is the buyer's total landed cost.

The cost difference between EXW (buyer pays all shipping and customs) and DDP (supplier pays all shipping, insurance, and customs) is typically 8–20% of the unit price for international orders. A quote comparison that does not normalize the Incoterms is comparing different delivery obligations, not different prices.


## Step 7 — Compare total landed cost on a normalized basis

The seventh and final step is the actual comparison, on a normalized basis. For each quote, build a normalized cost table with the following line items:

| Line item | Quote A | Quote B | Quote C |
|---|---|---|---|
| Material (normalized to same spec) | $X | $X | $X |
| Machining (normalized to same scope) | $X | $X | $X |
| Inspection and FAI (normalized to same scope) | $X | $X | $X |
| Surface treatment (normalized to same scope) | $X | $X | $X |
| Heat treatment (normalized to same scope) | $X | $X | $X |
| Documentation (normalized to same scope) | $X | $X | $X |
| Packaging (normalized to same scope) | $X | $X | $X |
| Subtotal (unit price) | $X | $X | $X |
| Freight, insurance, customs (normalized to DDP) | $X | $X | $X |
| **Total landed cost (per part, normalized)** | **$X** | **$X** | **$X** |
| **Total landed cost (lot, normalized)** | **$X** | **$X** | **$X** |
| Lead time (segment-by-segment) | X weeks | X weeks | X weeks |
| Payment terms (net 30, net 60, deposit + balance) | $X | $X | $X |
| Warranty (90 days, 1 year, customer-specified) | $X | $X | $X |

The supplier with the lowest total landed cost is the lowest-cost supplier — not the supplier with the lowest unit price. The cost difference between the un-normalized lowest unit price and the normalized lowest landed cost is typically 10–30%, and the difference between the un-normalized ranking and the normalized ranking is typically 1–3 positions on a 5-supplier comparison.

The lead time, payment terms, and warranty lines are not normalized to cost, but they should be compared in parallel. A supplier with a 5% lower landed cost but a 4-week longer lead time may not be the right choice for a time-sensitive program. The [lead time article](/blog/titanium-cnc-lead-time/) and the [supplier selection guide](/blog/how-to-choose-titanium-cnc-machining-supplier/) cover the non-cost factors in more detail.

## Six hidden cost lines that change a quote ranking

Beyond the seven normalization steps, six cost lines are commonly hidden in titanium CNC quotes. A quote that does not address these is a quote that has a hidden cost the buyer will discover after the PO is committed.

**1. Tooling cost.** Some quotes include tooling (end mills, drills, taps, custom fixtures) in the unit price; others list tooling as a separate one-time line. A $5,000 custom fixture amortized over a 50-part run is $100 per part, which can be the difference between the lowest and the second-lowest unit price. Ask whether tooling is included, and how it is amortized.

**2. Setup cost.** Some quotes include setup time in the unit price; others list setup as a separate one-time line. A 4-hour setup at $200/hour is $800, or $80 per part on a 10-part run. Ask whether setup is included, and whether it is amortized over the lot or charged as a fixed line.

**3. Scrap reserve.** Some quotes include a 3–5% scrap reserve in the unit price; others quote assuming zero scrap and issue a change order if parts fail. The scrap reserve is typically 2–8% of the unit price, depending on the part's tolerance and surface-treatment scope. Ask whether the scrap reserve is included, and at what rate.

**4. NDT and testing.** Some quotes include NDT (UT, X-ray, PT, ET) in the unit price if the print requires it; others list it as a separate line or assume the buyer will handle NDT. The cost is typically $50–$300 per part depending on the method. Ask whether NDT is included, and on what scope.

**5. Rework and concession.** Some quotes include a rework reserve in the unit price; others assume the parts ship as-machined and any non-conformance is handled as a separate charge. The rework reserve is typically 1–3% of the unit price. Ask whether the supplier includes rework, and at what rate.

**6. Currency and payment terms.** International quotes may be priced in USD, EUR, CNY, or the buyer's local currency, and the payment terms may be net 30, net 60, or deposit + balance. A quote priced in a weaker currency may be cheaper on unit price but more expensive on the buyer's total cost after currency conversion and payment timing. Ask for the quote in the buyer's preferred currency, and for payment terms that match the buyer's cash flow.

The six hidden lines are typically 5–15% of the unit price in total. A buyer who normalizes these alongside the seven steps above will produce a quote comparison that is apples-to-apples, and a supplier ranking that reflects the buyer's true total cost.


## Quote comparison checklist

- Before sending the RFQ, list the material spec, the machining scope, the inspection scope, the surface treatment scope, the documentation scope, the Incoterms, and the lead time requirement in writing. A buyer who sends a clear scope receives comparable quotes; a buyer who sends a vague scope receives a range of incompatible quotes.
- For each quote, verify the material grade, form, size, specification, and MTR format match the RFQ scope. If they do not, request a re-quote on the same spec.
- For each quote, verify the machining scope (machine class, number of setups, tolerance band, GD&T scope, surface finish) matches the RFQ scope. If they do not, request a re-quote.
- For each quote, verify the inspection and FAI scope (CMM coverage, FAI scope, surface roughness, hardness, NDT) matches the RFQ scope.
- For each quote, verify the surface treatment and heat treatment scope (process, spec, in-house/sub-contract) matches the RFQ scope.
- For each quote, verify the documentation and packaging scope (MTR format, CoC, AS9102, PPAP, packaging) matches the RFQ scope.
- For each quote, verify the Incoterms and shipping terms are specified, and convert all quotes to the same Incoterm (DDP at the buyer's plant) for the comparison.
- Build a normalized cost table for each quote, with line items for material, machining, inspection, surface treatment, heat treatment, documentation, packaging, freight/insurance/customs, and the total landed cost.
- For each quote, ask whether tooling, setup, scrap reserve, NDT, rework, and currency/payment terms are included in the unit price, and adjust the comparison accordingly.
- Compare quotes on the normalized total landed cost, with the lead time, payment terms, and warranty compared in parallel. The supplier with the lowest normalized landed cost is the lowest-cost supplier.

For a quote comparison review against a specific titanium program, send the STEP file, the print, and the candidate quotes to the [RFQ intake](/rfq/); the engineering team returns a normalized comparison and a recommendation. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review candidate titanium quotes against the checklist above before any PO is committed, and the typical outcome is a normalized comparison that surfaces 1–2 hidden cost lines per quote and reorders the supplier ranking. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the normalized comparison is what determines whether the lowest unit price is actually the lowest landed cost — and that distinction is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Quote normalization waterfall: Stacked bar chart showing how a single quote's unit price decomposes into material, machining, inspection, surface treatment, heat treatment, documentation, packaging, and freight/insurance/customs line items. Supports queries about what is included in a titanium CNC quote.
Fig 2 — Hidden cost impact chart: Bar chart showing the typical percentage impact of the six hidden cost lines (tooling, setup, scrap reserve, NDT, rework, currency/payment terms) on a titanium CNC unit price. Supports queries about what is not included in the unit price.
Fig 3 — Total landed cost comparison: Side-by-side bar chart for three candidate suppliers showing the un-normalized unit price vs the normalized total landed cost, with annotations for the cost lines that drove the reordering. Supports queries about why the lowest unit price is not the lowest landed cost.
-->