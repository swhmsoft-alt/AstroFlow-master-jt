---
title: "Titanium Bar vs. Plate vs. Forging: Choosing the Right Stock Form"
description: "Engineering guide to selecting the right titanium stock form — bar, plate, sheet, forging, casting, or near-net shape — based on part geometry, material utilisation, machining time, mechanical properties (grain flow, directionality), lead time, cost, and procurement specifications."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Materials & Grades
tags: [Titanium Bar, Titanium Plate, Titanium Forging, Titanium Casting, Near-Net Shape, Material Utilisation, Grain Flow, Stock Form Selection, Buy-to-Fly Ratio, Machining Allowance]
coverImage: /uploads/PLACEHOLDER-blog-titanium-bar-plate-forging-selection-cover.jpg
coverImageAlt: PLACEHOLDER — various titanium stock forms (bar, plate, forging) laid out for comparison. To be replaced with the final image.
featured: false
---

The choice of titanium stock form — bar, plate, sheet, forging, casting, or near-net shape — drives the cost, the lead time, the machining cycle, and the mechanical properties of every titanium part. The "right" stock form is not universal; it depends on the part's geometry, the loading direction, the lot size, and the buyer's tolerance for material utilisation. A buyer who specifies "titanium" without specifying the form accepts whatever the supplier has in stock, and the result is typically 30–60% excess machining time, 2–5× the buy-to-fly ratio, and a part that may not have the grain flow the design requires. The procurement decision is to specify the form by ASTM or AMS designation, by grain-flow direction (where the part is fatigue-loaded), and by the buy-to-fly ratio that the part can afford.

This article works through the four decision dimensions that drive the stock form choice: part geometry and machining time, mechanical properties and grain flow, lead time and lot size, and cost and material utilisation. It assumes the [general grade selection guide](/blog/how-to-choose-titanium-grade/), the [chemical processing parts article](/blog/titanium-chemical-processing-components/), and the [cost factors article](/blog/titanium-cnc-machining-cost-factors/) as background — those cover the broader material and cost landscape; here we focus on the stock form selection specifically. For the bar form itself, the [machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/) and the [tolerance cost article](/blog/titanium-cnc-tolerance-cost/) are the cross-references.

- [Why stock form selection matters more than grade selection](#why-stock-form-selection-matters-more-than-grade-selection)
- [The stock form options: bar, plate, sheet, forging, casting, near-net shape](#the-stock-form-options-bar-plate-sheet-forging-casting-near-net-shape)
- [Decision 1: part geometry and machining time](#decision-1-part-geometry-and-machining-time)
- [Decision 2: mechanical properties and grain flow](#decision-2-mechanical-properties-and-grain-flow)
- [Decision 3: lead time and lot size](#decision-3-lead-time-and-lot-size)
- [Decision 4: cost and material utilisation (buy-to-fly)](#decision-4-cost-and-material-utilisation-buy-to-fly)
- [Selection matrix by part category](#selection-matrix-by-part-category)
- [Stock form selection checklist](#stock-form-selection-checklist)

## Why stock form selection matters more than grade selection

The procurement decision on titanium is typically framed as a grade decision — "which grade should I specify?" — but the stock form decision is often more consequential. The grade determines the corrosion resistance, the strength, and the heat-treatment response; the stock form determines the cost, the machining time, the grain flow, and the buy-to-fly ratio. A buyer who specifies the right grade in the wrong stock form pays 2–3× the material cost and 1.5–2× the machining cost of a buyer who specifies the right grade in the right stock form. The grade can be changed in a procurement change order with little disruption; the stock form change typically requires re-machining the CAM program and may require re-tooling the setup.

The stock form selection is the procurement decision that most directly determines the part's "buy-to-fly ratio" — the ratio of the starting material weight to the final part weight. A buy-to-fly ratio of 1.0 means the entire stock becomes the part (impossible in practice); a buy-to-fly ratio of 5.0 means 5 kg of stock is machined to produce 1 kg of part, with 4 kg of chips. The buy-to-fly ratio determines the material cost (the cost of the chips is paid by the buyer), the machining time (the time to remove the excess material is paid by the buyer), and the environmental impact (the chips are titanium scrap that must be recycled or disposed of). The buy-to-fly ratio is the most under-managed metric in titanium procurement, and it is the metric that the stock form selection most directly controls.

A part machined from bar stock typically has a buy-to-fly ratio of 3–8 (depending on the part geometry), a part machined from plate has a buy-to-fly ratio of 2–5, a part machined from a forging has a buy-to-fly ratio of 1.3–2.5, and a casting or near-net-shape part has a buy-to-fly ratio of 1.1–1.8. The difference between a buy-to-fly of 5 (bar) and a buy-to-fly of 1.5 (forging) on a 5 kg part is the difference between 25 kg and 7.5 kg of starting material — a 17.5 kg difference that is paid in the material cost and the machining time.

The grade selection and the stock form selection interact, but they are independent decisions. A buyer who specifies "Ti-6Al-4V" without specifying the form is asking the supplier to choose the form, and the supplier will choose the form that is in stock or that is cheapest — not the form that gives the best part cost or the best part performance. A buyer who specifies "Ti-6Al-4V bar, AMS 4928, condition annealed" is making a complete procurement decision, and the supplier can quote on a specific stock form with a specific lead time and a specific cost. The complete specification is what the supplier needs to deliver the right part at the right cost.


## The stock form options: bar, plate, sheet, forging, casting, near-net shape

The titanium stock form options in production use are listed below, with the typical procurement specification, the typical application, and the typical buy-to-fly ratio for each:

**Bar (round, square, hexagonal).** The most common stock form for rotational parts (shafts, fittings, fasteners, medical implants) and for small prismatic parts that fit within the bar's cross-section. Procurement spec: ASTM B348 (bar), AMS 4928 (bar, Grade 5), AMS 4930 (bar, Grade 23 ELI), or customer-specific. The bar is hot-rolled or forged, with a typical diameter range of 5–300 mm and a typical length of 2–4 m. The buy-to-fly ratio is 3–8 for typical parts.

**Plate.** The standard stock form for flat parts (flanges, covers, plates, structural panels) and for parts that are milled from the plate's thickness. Procurement spec: ASTM B265 (plate), AMS 4911 (plate, Grade 5), or customer-specific. The plate is hot-rolled or cold-rolled, with a typical thickness range of 0.5–100 mm and a typical width of 1–2 m. The buy-to-fly ratio is 2–5 for typical parts.

**Sheet.** The standard stock form for thin-gauge parts (enclosures, covers, formed components) and for parts that are laser-cut, waterjet-cut, or chemically milled from the sheet. Procurement spec: ASTM B265 (sheet, same spec as plate), AMS 4900 (sheet, Grade 1), or customer-specific. The sheet is cold-rolled, with a typical thickness range of 0.1–6 mm and a typical width of 1 m. The buy-to-fly ratio is 1.5–4 for typical parts.

**Forging (open-die or closed-die).** The standard stock form for high-strength parts (landing gear, structural fittings, fasteners) and for parts that require a specific grain-flow direction. Procurement spec: ASTM B381 (forging), AMS 4928 (forging, Grade 5), AMS 4980 (forging, Ti-10V-2Fe-3Al), or customer-specific. The forging is hot-formed in a die, with a typical weight range of 0.1–500 kg per forging. The buy-to-fly ratio is 1.3–2.5 for typical parts, and the forging typically includes the grain-flow direction and the mechanical property documentation required for AS9100D programs.

**Casting (investment casting or sand casting).** The standard stock form for complex 3D shapes that are impractical to machine (pump casings, valve bodies, complex medical implants). Procurement spec: ASTM B367 (casting), AMS 4990 (investment casting, Grade 5), or customer-specific. The casting is poured in a mould, with a typical weight range of 0.05–50 kg per casting. The buy-to-fly ratio is 1.1–1.8 for typical parts.

**Near-net shape (powder metallurgy, additive manufacturing, hot-isostatic pressing).** The standard stock form for parts that are too complex to cast or too expensive to machine from bar. The buy-to-fly ratio is 1.05–1.5 for typical parts.

The selection of the stock form is driven by the part geometry, the lot size, the mechanical property requirements, and the cost target.


## Decision 1: part geometry and machining time

The part geometry is the first decision dimension. Three geometry categories drive the stock form choice:

**Rotational parts** (shafts, fittings, fasteners, valves, pump impellers, medical implants). The standard stock form is bar (round bar for cylindrical parts, hex bar for hex-head fasteners, square bar for prismatic rotational parts). The bar is turned on a lathe or mill-turn cell, with the spindle axis aligned with the bar axis. The buy-to-fly ratio is typically 3–6 for parts that fit within the bar's cross-section, and 5–8 for parts that require a bar larger than the part's largest diameter (because the excess material is removed in the turning operation).

**Flat or prismatic parts** (flanges, covers, brackets, structural panels, housings). The standard stock form is plate (for parts that are milled from the plate's thickness) or sheet (for parts that are stamped or formed). The plate is cut to a near-net blank by saw or waterjet, then milled to the final shape. The buy-to-fly ratio is typically 2–4 for parts that fit within the plate's thickness, and 3–6 for parts that are milled from a thicker plate (with the excess material removed in the facing operation).

**Complex 3D parts** (pump casings, valve bodies, brackets with intersecting features, medical implants with internal channels). The standard stock forms are forging (for high-strength applications), casting (for general applications), or near-net shape (for the most complex applications). The forging is hot-formed in a die, with the machining limited to the final tolerance features. The casting is poured in a mould, with the machining limited to the final tolerance features and any internal passages. The buy-to-fly ratio is typically 1.3–2.5 for forgings and 1.1–1.8 for castings, significantly lower than the bar or plate equivalents.

The geometry decision is the first to make, because the geometry drives the stock form options that are practical. A buyer who specifies a complex 3D part in bar stock accepts a 6–10× buy-to-fly ratio; a buyer who specifies the same part in a forging or casting accepts a 1.5–2.5× buy-to-fly ratio. The machining time follows the buy-to-fly ratio: a 6× buy-to-fly on a 5 kg part means 25 kg of material to remove, with a corresponding machining cycle of 8–16 hours; a 1.5× buy-to-fly on the same part means 7.5 kg of material to remove, with a machining cycle of 2–4 hours.

## Decision 2: mechanical properties and grain flow

The mechanical property requirements are the second decision dimension, and the dimension where the forging is most clearly distinguished from bar and plate. Three mechanical property categories drive the stock form choice:

**Static strength (tensile, yield, elongation).** Static strength is set by the grade and the heat-treatment condition, and is largely independent of the stock form. A Grade 5 bar, a Grade 5 plate, and a Grade 5 forging all have the same minimum tensile strength (895 MPa per ASTM B348, B265, B381) when tested in the same direction. The exception is the test direction: a forging is typically tested in the forging flow direction, which is the strongest direction; a bar is typically tested in the longitudinal direction, which is the strongest direction for the bar; a plate is typically tested in the rolling direction. The mechanical property documentation should specify the test direction and the minimum properties in that direction.

**Fatigue and fracture toughness.** Fatigue and fracture toughness are the properties that most depend on the grain flow, and the grain flow is determined by the stock form. A forging has a continuous grain flow that follows the contour of the forging, with the highest mechanical properties in the direction of the grain flow. A bar has a longitudinal grain flow, with the highest properties along the bar axis. A plate has a rolling-direction grain flow, with the highest properties in the rolling direction. The fatigue life of a forging in the grain-flow direction is typically 2–3× the fatigue life of a bar or plate in the same direction, because the forging's continuous grain flow has fewer inclusions and fewer grain-boundary interruptions.

**Directionality.** Some parts require specific mechanical properties in specific directions. A landing gear fitting, for example, requires high fatigue life in the radial direction (perpendicular to the forging flow) and in the longitudinal direction (along the forging flow). The forging's grain flow is designed to put the highest properties in the directions the part is loaded; a bar or plate cannot match this directional optimisation.

The mechanical property decision is the most important for fatigue-critical parts. A buyer who specifies a bar or plate for a fatigue-critical part accepts 50–70% lower fatigue life than a forging, and the part may fail in service. A buyer who specifies a forging for a fatigue-critical part accepts the higher forging cost (typically 2–3× the bar cost per kg) in exchange for the higher fatigue life. The [beta titanium article](/blog/beta-titanium-cnc-machining/) covers the related fatigue considerations for the highest-strength titanium grades.


## Decision 3: lead time and lot size

The lead time and the lot size are the third decision dimension, and the dimension where the bar and plate are most clearly distinguished from the forging and casting.

**Bar and plate lead time.** Stocked bar and plate in common grades (CP Grade 1, 2, 4; Grade 5; Grade 23 ELI) and common sizes is available from most mill distributors with a 1–2 week lead time for standard sizes and a 4–8 week lead time for non-standard sizes. The buyer's lead time is 1–2 weeks for a typical RFQ on a stocked material, with the shop queue and the cycle time adding 1–3 weeks. The total lead time is typically 2–5 weeks for a typical order.

**Forging lead time.** A new forging requires a forging die, which is designed and machined in 8–16 weeks. The forging die cost is typically $5,000–$50,000, depending on the size and complexity. For a production run, the die cost is amortised over the lot, and the per-part die cost is typically $5–$50 per part for a typical lot. The forging lead time for a new forging is 12–24 weeks, dominated by the die manufacturing time. For a repeat forging (the same die, the same part), the lead time is 2–4 weeks.

**Casting lead time.** A new casting requires a pattern, which is designed and machined in 4–8 weeks. The pattern cost is typically $1,000–$10,000. The casting lead time for a new pattern is 8–12 weeks, and for a repeat pattern is 2–4 weeks.

**Lead time and lot size decision.** The lead time decision is a trade-off between the bar/plate short lead time (1–2 weeks) and the forging/casting long lead time (12–24 weeks for the first run). For a prototype run of 1–5 parts, the bar/plate is the right choice regardless of the buy-to-fly ratio, because the forging die cost is not justified by the lot size. For a production run of 50+ parts, the forging or casting is the right choice if the buy-to-fly ratio justifies the die cost. The crossover lot size is typically 20–50 parts, depending on the die cost and the buy-to-fly ratio improvement.

The lead time decision is also influenced by the buyer's inventory strategy. A buyer who pre-orders a forging die for a forecast production run reduces the per-order lead time to 2–4 weeks, and the per-part die cost is amortised over a larger lot. A buyer who orders forging on a per-PO basis accepts the 12–24 week lead time and the per-PO die cost, which is typically higher per part than the amortised cost. The procurement decision is to plan the forging die in advance, not on a per-PO basis, if the production run is large enough to justify the pre-investment.

## Decision 4: cost and material utilisation (buy-to-fly)

The cost and material utilisation are the fourth decision dimension, and the dimension that determines the financial case for the forging or casting. The buy-to-fly ratio is the most under-managed metric in titanium procurement, and it is the metric that the stock form selection most directly controls.

**Buy-to-fly ratio by stock form.** The typical buy-to-fly ratios by stock form are:

| Stock form | Typical buy-to-fly | Material cost premium vs bar | Machining time reduction vs bar |
|---|---|---|---|
| Bar | 3–8 | 1.0× (reference) | 0% (reference) |
| Plate | 2–5 | 1.0–1.2× | 20–40% |
| Sheet | 1.5–4 | 1.0–1.5× | 30–50% |
| Forging | 1.3–2.5 | 2.0–4.0× | 50–70% |
| Casting | 1.1–1.8 | 1.5–3.0× | 60–80% |
| Near-net shape (AM) | 1.05–1.5 | 3.0–10.0× | 70–90% |

The table tells the procurement story. A bar at 5× buy-to-fly on a 5 kg part means 25 kg of starting material at $50/kg = $1,250 in material cost. A forging at 1.5× buy-to-fly on the same part means 7.5 kg of starting material at $200/kg (typical forging price for a small aerospace forging) = $1,500 in material cost. The forging has a 20% higher material cost, but the machining time is 50–70% lower, which at $100/hour on a 10-hour cycle is $500–$700 lower per part. The forging is the lower-cost option at a production lot size of 50+ parts, even with the higher material cost.

The buy-to-fly ratio is the metric that the supplier should be reporting to the buyer, and the metric that the buyer should be tracking. A supplier who quotes a 5× buy-to-fly on a 1 kg part and a 1.5× buy-to-fly on the same part in a forging is providing the buyer with the information needed to make the stock form decision. A supplier who quotes only the finished part cost, without the buy-to-fly, is hiding the information that would let the buyer make an informed decision.


## Selection matrix by part category

The selection matrix below summarises the recommended stock form by part category. The matrix is a starting point; the final selection requires engineering judgment for the specific part.

| Part category | Lot size | Geometry | Recommended stock form | Rationale |
|---|---|---|---|---|
| Shaft, fitting, fastener | Any | Rotational, < 100 mm diameter | Bar (round or hex) | Standard, lowest cost, fast lead time |
| Shaft, fitting, fastener | Production | Rotational, fatigue-critical | Bar (forged, AMS 4928) | Higher fatigue life than rolled bar |
| Flange, cover, bracket | Any | Flat, < 50 mm thick | Plate (AMS 4911) | Standard, lowest cost, fast lead time |
| Structural fitting | Production | Complex 3D, fatigue-critical | Closed-die forging (AMS 4980) | Grain flow matches load direction |
| Pump casing, valve body | Any | Complex 3D, hollow | Sand casting (ASTM B367) or investment casting (AMS 4990) | Casting is the only practical stock form |
| Medical implant | Any | Complex 3D, small | Bar or near-net shape (AM) | Bar for prototype, AM for production |
| Landing gear component | Production | High-stress, fatigue-critical | Closed-die forging (AMS 4980) | Standard for landing gear, grain flow critical |
| Heat-exchanger tubesheet | Any | Flat, hundreds of holes | Plate (ASTM B265) | Standard, precision drilling |
| BPP (PEM electrolyzer) | Production | Thin, complex flow field | Sheet or plate (CP Grade 2) | Standard for BPP, photo-chemical etching |
| Tube, pipe | Any | Hollow cylindrical | Tube (ASTM B338) | Standard, lowest cost for tubes |

The matrix is a starting point. The final selection requires engineering judgment, including the design's mechanical property requirements, the buyer's lead time, the buyer's inventory strategy, and the buyer's tolerance for the higher forging or casting cost.

## Stock form selection checklist

- Specify the stock form by ASTM or AMS designation (B348 bar, B265 plate, B381 forging, B367 casting, etc.), with the condition (annealed, solution-treated, etc.) on the print.
- Specify the buy-to-fly ratio target in the RFQ. A target of 3× or less is reasonable for most production parts; a target above 5× indicates that the stock form selection should be reviewed.
- Specify the grain-flow direction for fatigue-critical parts. The forging's grain flow should be aligned with the principal load direction.
- Specify the MTR format (EN 10204 3.1, per the [MTR field-by-field guide](/blog/how-to-read-titanium-mill-test-report/)) with the test direction and the minimum mechanical properties in that direction.
- For prototype runs, prioritise bar or plate for fast lead time, even if the buy-to-fly ratio is high. For production runs of 50+ parts, consider forging or casting for the lower buy-to-fly ratio.
- For fatigue-critical parts (landing gear, structural fittings, medical implants), specify a forging with grain-flow documentation, even if the unit cost is higher than a bar.
- For complex 3D parts (pump casings, valve bodies), specify a casting or forging to avoid the high buy-to-fly ratio of bar or plate.
- For thin parts (heat-exchanger tubesheets, BPP, sheet metal), specify sheet or plate, with the buy-to-fly ratio minimised by selecting the thinnest stock that meets the part's structural requirements.
- For procurement on a per-PO basis, accept the bar/plate lead time and the higher buy-to-fly ratio. For procurement on a forecast basis, pre-order the forging die or casting pattern to reduce the per-PO lead time and the per-PO cost.
- Track the actual buy-to-fly ratio on every order, and use the data to refine the stock form selection on the next order.

For a stock form selection review against a specific titanium program, send the print, the lot size, the lead time requirement, and the mechanical property requirements to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with stock form, machining, and cost recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium RFQ against the checklist above before any tooling is ordered, and the typical outcome is a review that surfaces 1–2 stock-form-selection questions per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the stock form and the buy-to-fly ratio are what determine whether the part meets the cost and the lead time targets — and that determination is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Stock form comparison: Bar chart with stock form on X axis and typical buy-to-fly ratio on Y axis (1.0× to 8.0×), with separate bars for bar, plate, sheet, forging, casting, and near-net shape. Supports queries about the material utilisation of each stock form.
Fig 2 — Grain flow diagrams: Side-by-side diagrams of grain flow in a bar (longitudinal), a plate (rolling direction), and a forging (contour-following), with the principal load direction indicated. Supports queries about grain flow and directionality.
Fig 3 — Stock form decision tree: Decision flowchart from part geometry → mechanical property requirement → lot size → recommended stock form, with the decision criteria labelled. Supports queries about how to choose the right stock form for a given part.
-->