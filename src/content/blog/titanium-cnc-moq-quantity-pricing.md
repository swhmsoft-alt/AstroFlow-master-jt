---
title: "Titanium CNC MOQ and Quantity Pricing: Prototype to Production"
description: "Procurement guide to MOQ and quantity-based pricing for titanium CNC parts — why minimum order quantities exist, how unit price scales from prototype (1–5) through low-volume (10–50) and production (100+), the cost drivers behind the price break points, and how to negotiate quantity pricing on titanium orders."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Procurement & Services
tags: [MOQ, Minimum Order Quantity, Quantity Pricing, Prototype Pricing, Production Pricing, Cost Drivers, Titanium CNC, RFQ, Volume Discount, Tooling Amortization]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-moq-quantity-pricing-cover.jpg
coverImageAlt: PLACEHOLDER — quantity-based pricing curve for titanium CNC parts from prototype to production. To be replaced with the final image.
featured: false
---

Titanium CNC quantity pricing does not scale linearly. The unit price for a 10-part prototype run is typically 2–3× the unit price for a 100-part production run, and 4–6× the unit price for a 1,000-part production run. The non-linearity comes from how the fixed cost of setup, tooling, and qualification is amortized across the lot size, and from how the supplier allocates machine time when the lot is small versus when it is large. A buyer who treats the supplier's per-part price as a linear function of quantity misses the actual cost structure, and either overpays on small lots or underestimates the price of a production run.

This article works through the cost structure that drives titanium CNC quantity pricing, the typical price-break points from prototype to production, the MOQ logic that suppliers apply, and the negotiation levers that move the per-part price. It assumes the [cost factors article](/blog/titanium-cnc-machining-cost-factors/) and the [quote comparison article](/blog/how-to-compare-titanium-cnc-quotes/) as background — those cover the line-item cost and the per-quote comparison; here we focus on the quantity-vs-price curve. For the prototype-to-production transition and the validation work that goes with it, the [prototype to production article](/blog/titanium-cnc-prototype-to-production/) is the cross-reference.

- [Why titanium CNC pricing is non-linear across quantity](#why-titanium-cnc-pricing-is-non-linear-across-quantity)
- [The five cost components that scale differently with quantity](#the-five-cost-components-that-scale-differently-with-quantity)
- [Typical quantity vs unit price curve for titanium](#typical-quantity-vs-unit-price-curve-for-titanium)
- [The MOQ logic: when suppliers set minimums](#the-moq-logic-when-suppliers-set-minimums)
- [Quantity break points and where they fall](#quantity-break-points-and-where-they-fall)
- [How to negotiate quantity pricing on small lots](#how-to-negotiate-quantity-pricing-on-small-lots)
- [The cost penalty for sub-MOQ orders](#the-cost-penalty-for-sub-moq-orders)
- [MOQ and quantity pricing checklist](#moq-and-quantity-pricing-checklist)

## Why titanium CNC pricing is non-linear across quantity

Three structural reasons make titanium CNC pricing non-linear across the quantity range:

**1. Fixed costs are amortized over a small denominator on prototype runs.** A typical titanium production order has $2,000–$10,000 of fixed costs — programming, setup, fixture build (if any), first-article inspection, AS9102 documentation, supplier qualification. On a 5-part prototype run, the fixed cost is $400–$2,000 per part. On a 100-part production run, the fixed cost is $20–$100 per part. The same fixed cost, amortized over 20× more parts, drops the per-part contribution by 95%.

**2. Material cost has a different scaling profile from machining cost.** Material cost scales linearly with quantity (5 parts = 5× the material cost of 1 part, plus setup scrap). Machining cost has a fixed component (setup) and a variable component (cycle time) — and the variable component has a learning-curve discount on production runs. A shop that runs the same part 100 times learns where the cycle time can be tightened, and the second 100-part lot is typically 5–10% cheaper per part than the first.

**3. Material yield and scrap rate differ between small and large lots.** A prototype run on a new part has a 10–20% scrap rate at the first article, dropping to 3–5% by the fifth part as the process stabilises. A production run on a proven part has a 1–3% scrap rate from the first part. The scrap reserve that the supplier builds into the unit price is therefore higher on a prototype run than on a production run, and the per-part cost of the scrap reserve is higher on a small lot.

The non-linearity is steeper on titanium than on most other materials because the fixed cost component is larger. A typical steel CNC order has a $500–$2,000 fixed cost; a titanium CNC order has a $2,000–$10,000 fixed cost. The 4–5× higher fixed cost on titanium is what makes the per-part price drop so sharply between the prototype and the production lot size. The buyer's procurement question is not "what is the per-part price?" but "what is the per-part price at the lot size I am running, and how does the per-part price scale as the lot size changes?"

## The five cost components that scale differently with quantity

The titanium CNC per-part cost decomposes into five components, each with a different scaling profile. A buyer who understands the decomposition can predict the per-part price at any lot size, and can identify the procurement levers that move each component.

| Cost component | Scaling profile | Typical range | Procurement lever |
|---|---|---|---|
| **Material** | Linear with quantity (5 parts = 5× the material of 1 part) + setup scrap (typically 1 part) | 15–35% of per-part cost on production runs | Standardise on stocked grades and forms; specify near-net-shape stock where possible |
| **Setup (programming + fixturing + first-article)** | Fixed, amortized over lot | 5–15% of per-part cost on production runs, 30–50% on prototype runs | Combine multiple parts in one setup; reuse fixtures across part numbers |
| **Cycle time (machining)** | Variable, with learning-curve discount (typically 5–10% from lot 1 to lot 5) | 30–50% of per-part cost | Standardise parameters; use proven toolpaths; accept the supplier's parameter recommendations |
| **Tooling (consumable + custom)** | Fixed for custom tooling; variable for consumable | 5–10% of per-part cost on production runs, 10–20% on prototype runs | Specify the tooling class; reuse tooling across part numbers |
| **Inspection + documentation** | Fixed for FAI; variable for per-part inspection | 5–15% of per-part cost on production runs, 15–30% on prototype runs | Specify the FAI scope (first article only, by default); use sampling for production inspection where the spec allows |

The five components sum to 100% of the per-part cost on a production run, and to a different distribution on a prototype run. The shift between the two distributions is the source of the non-linearity. On a 5-part prototype run, the fixed components (setup, tooling, inspection, documentation) are 60–80% of the per-part cost, and the variable components (material, cycle time) are 20–40%. On a 100-part production run, the fixed components are 10–20% of the per-part cost, and the variable components are 80–90%. The per-part price therefore drops by 50–70% between the prototype and the production run, even though the variable cost per part is roughly constant.

The procurement lever on each component is the lever that moves the per-part price the most. For prototype runs, the lever is on the fixed components — combine multiple parts in one setup, reuse fixtures, standardise on first-article-only FAI. For production runs, the lever is on the variable components — material yield, cycle time, consumable tooling cost. The [cost factors article](/blog/titanium-cnc-machining-cost-factors/) covers each component in detail.


## Typical quantity vs unit price curve for titanium

The table below shows a typical per-part price curve for a representative titanium aerospace bracket (Grade 5, 50–100 mm, ISO 2768-f tolerance, passivation, AS9102 FAI, MTR + CoC). The reference price (1.0×) is the 100-part production run price, which is the benchmark for the supplier's "production quantity" pricing. The other lot sizes are indexed to this benchmark.

| Lot size | Per-part price index | Cycle time per part | Total order cost | Notes |
|---|---|---|---|---|
| 1 part | 4.0–6.0× | 100% | $X | Single-part prototype; no setup amortization |
| 5 parts | 2.5–3.5× | 95% | $X | 5-part prototype; setup amortized over 5 |
| 10 parts | 2.0–2.5× | 90% | $X | 10-part prototype; setup amortized over 10 |
| 25 parts | 1.5–1.8× | 90% | $X | Low-volume production; supplier adds safety margin |
| 50 parts | 1.2–1.4× | 90% | $X | Low-volume production; closer to production pricing |
| 100 parts | 1.0× (benchmark) | 90% | $X | Production quantity; supplier's reference price |
| 200 parts | 0.90–0.95× | 88% | $X | Production run with learning-curve discount |
| 500 parts | 0.80–0.90× | 85% | $X | Larger production run; further cycle-time optimisation |
| 1,000+ parts | 0.70–0.85× | 82% | $X | Volume discount and dedicated capacity |

The per-part price index is a guide, not a contract. The actual per-part price depends on the part's complexity, the tolerance, the material grade, the surface treatment scope, and the supplier's capacity. A simple cylindrical part (turned from bar) has a flatter curve (1.0× at 25 parts instead of 100 parts). A complex 5-axis structural part has a steeper curve (1.0× at 200 parts instead of 100 parts). The buyer should ask the supplier for the curve specific to the part, rather than applying a generic index.

The cycle time per part column shows the learning-curve effect. A shop that runs the same part 100 times learns where the cycle time can be tightened, and the second 100-part lot is typically 5–10% cheaper per part than the first. The learning-curve discount is larger on parts with multiple setups and complex toolpaths, and smaller on simple parts with a single setup.

The total order cost column is the lot size multiplied by the per-part price. The total cost grows with quantity, but the per-part cost drops. The buyer's procurement question is at which lot size the per-part price plateaus — beyond which additional quantity does not produce additional per-part savings. For most titanium aerospace parts, the plateau is at 200–500 parts; for production parts with dedicated capacity, the plateau is at 1,000+ parts.

## The MOQ logic: when suppliers set minimums

Suppliers set minimum order quantities (MOQ) for titanium CNC parts to recover the fixed cost of setup, qualification, and documentation. The MOQ is not a sales tactic — it is a cost-recovery floor. Below the MOQ, the supplier is paying for fixed work that the per-part price does not recover, and the order is a loss for the supplier. The supplier's options are (a) refuse the sub-MOQ order, (b) accept the sub-MOQ order at a price premium that recovers the fixed cost, or (c) batch the sub-MOQ order with other production runs to share the fixed cost.

The MOQ for a typical titanium aerospace or medical part is set by the supplier's fixed cost structure:

- **Material sourcing**: if the part requires a stocked material, the MOQ is 1 part. If the part requires a non-standard material (mill run, large bar, custom forging), the MOQ is the mill's minimum order quantity, which can be 50–500 kg or 1–10 parts.
- **Programming and setup**: the MOQ is 1 part, but the per-part price on a 1-part order is 4–6× the production quantity price.
- **Fixture build (if any)**: the MOQ is the lot size that amortizes the fixture cost over $50–$100 per part. A $5,000 fixture amortized over 50 parts is $100 per part; over 10 parts is $500 per part. The supplier's MOQ is typically the lot size at which the fixture amortization is below $100 per part.
- **AS9102 documentation**: the MOQ is 1 part (the FAI is on the first article), but the documentation cost is $300–$800 per part number. The supplier's MOQ is the lot size at which the documentation cost is below 5% of the per-part price.
- **Supplier qualification**: the MOQ is 1 part, but the qualification cost is $1,000–$5,000 per supplier per program. The supplier's MOQ is the lot size that amortizes the qualification cost over 1–2% of the per-part price.

The combination of these factors produces a typical titanium CNC MOQ of 5–10 parts for a simple part on a stocked material, and 25–100 parts for a complex part on a non-standard material. The buyer who orders below the MOQ pays a price premium that reflects the supplier's fixed cost recovery; the buyer who orders above the MOQ pays the per-part price that reflects the supplier's standard amortization.


## Quantity break points and where they fall

The per-part price curve has three break points that divide the quantity range into four pricing regimes. The break points are not standardised across suppliers, but the typical pattern is:

**Break point 1: prototype to low-volume (5–10 parts).** Below 5 parts, the per-part price is dominated by setup and fixed cost. Above 10 parts, the per-part price starts to amortize the fixed cost over a meaningful denominator. The break point is typically at 5–10 parts, and the price drop across the break point is 30–50%.

**Break point 2: low-volume to production (50–100 parts).** Below 50 parts, the supplier is treating the order as a low-volume run with a safety margin and a per-part premium. Above 100 parts, the supplier is treating the order as a production run with the supplier's reference pricing. The break point is typically at 50–100 parts, and the price drop across the break point is 20–30%.

**Break point 3: production to volume (500–1,000 parts).** Below 500 parts, the supplier is running the order on a standard production cell with shared capacity. Above 1,000 parts, the supplier may dedicate a cell or a shift to the order, which produces a step-change in cycle time and per-part price. The break point is typically at 500–1,000 parts, and the price drop across the break point is 10–15%.

The break points are sharper on titanium than on most other materials because the fixed cost is larger. A typical steel CNC order has break points at 10, 100, and 1,000 parts; a typical titanium CNC order has break points at 5–10, 50–100, and 500–1,000 parts. The buyer who is planning a multi-year program should think about which break point the program will reach, and should negotiate the pricing at each break point as a separate line item in the master supply agreement.

## How to negotiate quantity pricing on small lots

The procurement levers for moving the per-part price on a small lot are concentrated in the fixed-cost components. The buyer who understands the decomposition can negotiate the per-part price by attacking the fixed cost directly, rather than by negotiating the per-part price itself. Five levers:

**1. Combine multiple parts in one setup.** A 5-part prototype run of part A plus a 5-part prototype run of part B in the same setup produces a 10-part setup with the fixed cost amortized over 10 parts. The per-part price on each part drops by 30–40% relative to two separate 5-part runs.

**2. Reuse fixtures across part numbers.** A custom fixture built for part A can be reused for part B if the parts share a feature or a locating scheme. The fixture cost is amortized over two part numbers instead of one, which drops the per-part fixture cost by 50%.

**3. Standardise on first-article-only FAI.** A buyer who requires AS9102 FAI on every part of a small lot multiplies the documentation cost by the lot size. A buyer who requires FAI on the first article only (and statistical sampling on the rest) keeps the documentation cost to a single instance.

**4. Pre-order material against a forecast.** A buyer who places a material order with the supplier 4–6 weeks before the production PO compresses the material sourcing segment from 1–2 weeks to 3–5 days, which can shorten the lead time enough to allow an additional lot in the same calendar window. The per-part price may not drop, but the total program cost drops.

**5. Negotiate the per-part price at each break point separately.** A buyer who commits to a 200-part order can negotiate the per-part price at 50, 100, and 200 parts as separate line items. The supplier quotes the per-part price at each break point based on the amortization at that lot size, and the buyer has a clear picture of the cost at each step of the program.


## The cost penalty for sub-MOQ orders

A sub-MOQ order (a lot size below the supplier's MOQ) typically carries a price premium of 30–100% over the supplier's reference pricing, depending on the part and the lot size. The premium reflects the supplier's fixed cost recovery, and is not negotiable in most cases — the supplier's cost structure does not change because the lot is small.

The cost penalty is largest on the 1-part prototype order (4–6× the production quantity price, as the table in Section 3 shows), and drops to 30–50% premium at the MOQ. The buyer who needs a 1-part prototype and a 10-part low-volume run should negotiate both as a single order (to share the fixed cost) rather than as two separate orders. The savings are typically 20–30% on the combined order versus two separate orders.

The sub-MOQ premium is the price of flexibility. A buyer who needs the flexibility of small-lot orders pays the premium; a buyer who can commit to a production run pays the per-part price without the premium. The procurement decision is whether the flexibility is worth the cost — and that decision depends on the program's design maturity, the schedule pressure, and the buyer's confidence in the per-part design.

## MOQ and quantity pricing checklist

- Before sending the RFQ, identify the lot size you expect to order at each break point (prototype, low-volume, production). The supplier can quote the per-part price at each break point as separate line items.
- Ask the supplier for the cost decomposition (material, setup, cycle time, tooling, inspection/documentation) at each break point. The decomposition shows where the per-part price is sensitive to lot size, and where the procurement levers are concentrated.
- Combine multiple parts in one setup where the parts share a feature or a locating scheme. The per-part fixed cost drops by 30–50%.
- Reuse fixtures across part numbers. A custom fixture for one part is typically reusable for a related part.
- Standardise on first-article-only FAI for small lots. Full FAI is a separate decision that should be tied to the program requirements, not to the per-part cost.
- Pre-order material against a forecast to compress the material sourcing segment. The per-part price may not drop, but the total program cost drops.
- Negotiate the per-part price at each break point separately. The supplier's cost structure changes at each break point, and a single per-part price hides the actual cost at the lot size you are running.
- Plan for the sub-MOQ premium. A 1-part prototype is 4–6× the production quantity price, and the premium is not negotiable. Budget for it in the prototype phase.
- For multi-year programs, commit to a quantity range (50–200, 200–500, 500+) at the master agreement stage, and negotiate the per-part price for each range. The supplier's volume discount is real, and the buyer's commitment is the lever that unlocks it.

For a quantity pricing review against a specific titanium program, send the STEP file, the expected lot size at each break point, and the program schedule to the [RFQ intake](/rfq/); the engineering team returns a quantity-vs-price curve and a recommendation. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium quantity-pricing RFQ against the checklist above, and the typical outcome is a curve that surfaces 1–2 procurement levers per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the quantity-vs-price curve is what determines whether the program should commit to a single production run or split into prototype + production phases — and that decision is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Quantity vs unit price curve: Line chart with lot size (1 to 1,000 parts) on X axis and per-part price index (4.0× to 0.7×) on Y axis, showing the three break points (5–10, 50–100, 500–1,000 parts) and the per-part price drop across each. Supports queries about titanium quantity pricing.
Fig 2 — Cost component breakdown by lot size: Stacked bar chart showing the five cost components (material, setup, cycle, tooling, inspection/documentation) for lot sizes 1, 5, 10, 50, 100, 500, 1,000. The shift from fixed-dominated to variable-dominated is visible across the quantity range. Supports queries about why titanium CNC pricing is non-linear.
Fig 3 — Sub-MOQ premium curve: Bar chart showing the per-part price premium for sub-MOQ orders at 1, 3, 5, 8, 10 parts relative to the supplier's MOQ. Supports queries about the cost penalty for ordering below the supplier's MOQ.
-->