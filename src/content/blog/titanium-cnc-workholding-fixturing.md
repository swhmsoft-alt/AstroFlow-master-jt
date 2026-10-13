---
title: "Titanium CNC Workholding and Fixturing: Stability and Distortion Control"
description: "Engineering guide to workholding and fixturing titanium CNC parts — vise, fixture plate, vacuum, soft jaw vs hard jaw selection, locating and clamping principles, distortion control for thin-wall features, and how workholding interacts with stress relief, springback, and final tolerance."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Machining Processes
tags: [Workholding, Fixturing, CNC Vise, Vacuum Chuck, Soft Jaws, Thin Wall Machining, Distortion Control, Stress Relief, Titanium Machining, Fixture Design]
coverImage: /uploads/PLACEHOLDER-blog-titanium-cnc-workholding-fixturing-cover.jpg
coverImageAlt: PLACEHOLDER — a titanium aerospace bracket clamped in a CNC vise with custom soft jaws. To be replaced with the final image.
featured: false
---

Workholding on titanium is the most underestimated contributor to scrap in a CNC cell. A shop that has the right spindle, the right cutting tool, the right parameters, and the wrong workholding will still produce parts that fail final inspection — usually because the part deflects under the clamping force, distorts when the clamp is released, or moves mid-cycle because the locating scheme did not account for titanium's low modulus. The fix is not a better spindle or a sharper tool. The fix is a fixturing decision that the buyer or designer makes before the print is released, and that the shop validates in the first-article run.

This article works through the four workholding decisions that determine whether a titanium part is buildable: locating scheme, clamping force and direction, fixture body (vise, plate, vacuum, custom), and distortion control across operations. It assumes the [general DFM guide](/blog/dfm-guide-titanium-parts-design-for-manufacturability/) and the [deformation causes and prevention article](/blog/titanium-cnc-machining-deformation-causes-and-prevention/) as background — those cover the part-design side of fixturing; here we focus on the shop-floor workholding decisions and the trade-off between rigidity, repeatability, and residual stress. For the thin-wall-specific fixturing problem, the [thin-wall titanium machining article](/blog/cnc-machining-thin-wall-titanium/) and the [springback compensation article](/blog/titanium-springback-compensation-strategies-cnc-machining/) are the cross-references.

- [Why workholding on titanium is its own engineering problem](#why-workholding-on-titanium-is-its-own-engineering-problem)
- [The five workholding categories and where each applies](#the-five-workholding-categories-and-where-each-applies)
- [Locating and clamping principles for titanium](#locating-and-clamping-principles-for-titanium)
- [Soft jaws vs hard jaws vs custom fixtures](#soft-jaws-vs-hard-jaws-vs-custom-fixtures)
- [Vacuum and chuck-based fixturing](#vacuum-and-chuck-based-fixturing)
- [Workholding for thin-wall and large titanium parts](#workholding-for-thin-wall-and-large-titanium-parts)
- [Distortion control: stress-relief between operations](#distortion-control-stress-relief-between-operations)
- [Workholding selection matrix](#workholding-selection-matrix)
- [Workholding checklist](#workholding-checklist)

## Why workholding on titanium is its own engineering problem

Three material properties make titanium workholding different from workholding for steel or aluminum, and all three push the fixture design toward a more careful balance of rigidity, clamping force, and clamp location:

**1. Low elastic modulus produces visible deflection under clamp pressure.** Titanium's modulus of about 110 GPa is roughly half that of steel, and the part deflects visibly under any clamping force that would be considered normal for a steel part. A 50 mm titanium bracket clamped with 8 kN of vise pressure will deflect 0.05–0.10 mm at the clamp point; the same part in steel deflects 0.01–0.03 mm. The deflection disappears when the clamp is released, but the residual stress from the deflection remains — and it is released by the cutting forces in the next operation, which produces the springback and post-machining distortion that the [springback compensation article](/blog/titanium-springback-compensation-strategies-cnc-machining/) covers.

**2. Low thermal conductivity concentrates heat at the clamp interface.** When a cutting tool passes near a clamp point, the heat from the cut cannot dissipate through the part, and the clamp interface sees a temperature rise that the steel or aluminum equivalent would never reach. The thermal expansion of the clamp interface can either tighten (over-clamp) or loosen (under-clamp) the part mid-cycle. The fixture design has to either isolate the clamp from the heat source (with a stand-off or a thermal barrier) or accept the thermal expansion as a known variable and budget for it in the tolerance.

**3. Titanium is not ferromagnetic, so magnetic chucks and magnetic fixtures are not available.** Most aluminum and many steel workholding operations use permanent-magnetic or electromagnetic chucks for fast, low-distortion clamping. Titanium is paramagnetic, which means magnetic workholding has effectively zero holding force. The choice on titanium is between mechanical (vise, clamp, fixture plate), vacuum (for flat parts), or adhesive (for thin or delicate features) — magnetic workholding is off the table.

The combined effect is that a titanium fixture has to be designed for the part's distortion, not just its geometry. A vise that works perfectly for a steel bracket of the same shape can produce a 0.05–0.15 mm distortion on a titanium bracket, which is typically 2–5× the part's dimensional tolerance. The fix is locating scheme and clamp placement, not clamp force.


## The five workholding categories and where each applies

The workholding choices on titanium fall into five categories, in increasing order of cost and setup time. The right category for a given part is set by the part geometry, the lot size, and the tolerance.

**1. Vise (standard or soft jaws).** The workhorse of titanium workholding for prismatic parts. A 6-inch (150 mm) precision vise with hard jaws or soft jaws is the standard for parts up to about 200 mm long and 100 mm tall. The vise provides good rigidity for milling, drilling, and tapping, and the locating scheme is straightforward (fixed jaw datum, movable jaw clamp). The downside is that vise clamping force is concentrated at the jaw line, which is the source of the distortion problem on thin-wall features.

**2. Fixture plate (sub-plate with locators and clamps).** A machined plate with dedicated locators (pins, screws, and sometimes a centre or edge finder) and clamps (strap clamps, toe clamps, or pull-down clamps) is the standard for production runs of the same part. The plate locates the part in the same position and orientation across every part in the lot, which is essential for AS9100D production runs where the [GD&T article](/blog/gdt-titanium-cnc-parts/) and the [tolerance cost article](/blog/titanium-cnc-tolerance-cost/) cover the position-tolerance discipline. The plate is a one-time cost (typically $1,500–$5,000 for a 300 × 400 mm plate) and pays back in setup time and repeatability over the lot.

**3. Custom fixture (dedicated body for a single part).** A dedicated fixture body — typically machined from aluminum for prototype runs or from mild steel for production runs — is the standard for parts that cannot be held in a vise or a fixture plate. The custom fixture is designed around the part's geometry and locating scheme, with clamps integrated into the body. Custom fixtures are the most expensive option ($5,000–$30,000 typical) but the most rigid, and are standard for aerospace structural parts and medical implants.

**4. Vacuum chuck.** For flat parts (plate, sheet, thin-wall) with a flat back face, a vacuum chuck provides low-distortion clamping with uniform pressure across the back face. The vacuum level needed for titanium is typically 0.6–0.8 bar (versus 0.3–0.5 bar for aluminum, because titanium's higher density and rougher back face require more holding force per unit area). Vacuum is incompatible with through-features (holes, slots) that penetrate the back face — a single hole breaks the seal — so vacuum is reserved for parts with a continuous back face. The cycle time of a vacuum chuck is short (1–3 seconds to clamp, similar to release), which makes it the preferred option for short-cycle production.

**5. Adhesive or wax mounting.** For very thin or delicate titanium parts (medical foils, thin diaphragms, optical mounts), adhesive or wax mounting to a carrier plate is the standard. The adhesive provides uniform support across the back face without mechanical clamp pressure, which is essential for parts that would distort under any mechanical clamp. The disadvantage is the time required to apply, cure, and remove the adhesive, and the contamination risk on parts that must be cleaned before downstream processing.

The five categories are not exclusive. A typical titanium aerospace bracket might use a fixture plate (category 2) for rough milling, then move to a soft-jaw vise (category 1) for finish milling, then move to a vacuum chuck (category 4) for back-side machining. The fixture design across the operations is what determines the distortion outcome, not the fixture on any single operation.


## Locating and clamping principles for titanium

Within whichever fixture category is selected, three principles consistently reduce distortion and improve repeatability on titanium:

**1. Locate on functional features, not on raw stock edges.** The locating scheme should reference the features that the assembly uses to position the part — datums, register faces, bolt-hole patterns — not the rough-stock edges that the cutting process will machine away. Locating on the rough edges forces the part to be positioned by features that change as the part is cut, which causes the part to shift mid-cycle. The [GD&T article](/blog/gdt-titanium-cnc-parts/) covers the datum-scheme discipline that the locating features should mirror.

**2. Clamp on a rigid feature, not on a thin wall.** A clamp that bears on a thin-wall feature produces visible distortion at the clamp point. The rule on titanium is to clamp on a ribbed or thickened section of the part, not on a thin-wall web. If no rigid feature is available, the clamp can bear on a "sacrificial rib" — a temporary feature added to the rough stock to provide a clamp bearing surface, then machined away in the finishing operation. The [thin-wall article](/blog/cnc-machining-thin-wall-titanium/) covers the sacrificial-rib approach in more detail.

**3. Use a 3-2-1 locating scheme.** Three locators on the primary datum (a plane), two on the secondary (a line), and one on the tertiary (a point) — the standard 3-2-1 scheme per ISO 5459 — provides a fully constrained part with the minimum number of contact points. The over-constrained locating schemes (4 or more locators on the primary datum, for example) introduce redundant contact that produces random distortion as the part varies lot-to-lot. A 3-2-1 scheme is the standard for AS9100D production runs.

The combination of these three principles — locate on functional features, clamp on rigid features, use 3-2-1 — is what distinguishes a fixture that runs a lot of titanium parts within tolerance from a fixture that produces a 10–20% scrap rate from distortion alone.


## Soft jaws vs hard jaws vs custom fixtures

The vise jaw selection for titanium is more consequential than for any other material, because the jaw contact area is the source of most clamp-induced distortion on prismatic parts. Three jaw categories:

**Hard jaws (standard vise jaws).** The jaws that ship with the vise — typically hardened tool steel, ground to a precise parallel surface. Hard jaws are appropriate for rough stock, for parts where the jaw line is machined away in the finishing operation, and for low-precision production. The disadvantage is that the jaw contact is a line (or a small rectangle), which produces high local contact pressure and visible distortion on thin-wall features. Hard jaws on titanium are typically limited to roughing operations where the jaw line is machined off in the finishing pass.

**Soft jaws (custom-machined jaws that match the part).** The standard for production titanium workholding. Soft jaws are blank jaws (aluminum or mild steel) that are machined to match the part's profile on the first article, then used for the production run. The jaw contact area is a much larger surface — typically 50–80% of the part's feature being clamped — which reduces the local contact pressure by a factor of 3–5× compared to hard jaws. The result is dramatically less clamp-induced distortion, and a more repeatable clamping force across the production lot.

The soft-jaw procedure is straightforward: clamp a piece of soft-jaw stock in the vise, machine the jaw profile using the part as the program reference, and verify the fit with the first part. The soft jaws then become part of the fixture documentation — the profile is recorded on the setup sheet so that a replacement set of soft jaws can be re-machined if the original set is damaged. The time cost of soft jaws is 20–40 minutes per setup, which is recovered within the first 5–10 parts of the production run from the reduced scrap rate and the improved repeatability.

**Custom fixtures (dedicated body for a single part).** Reserved for parts that cannot be held in a vise at all — typically parts with complex locating surfaces, parts that require clamping from multiple directions, or parts where the production volume justifies a dedicated fixture. Custom fixtures are designed around the part's geometry and clamping requirements, with locators and clamps integrated into the body. The cost of a custom fixture is typically $5,000–$30,000, depending on complexity, and the lead time is 2–4 weeks. For titanium production runs of 50+ parts, the custom fixture typically pays back within the first production lot; for prototype runs, soft jaws are usually the better choice.

## Vacuum and chuck-based fixturing

Vacuum and chuck-based fixturing are the alternative to mechanical clamping for parts that are flat, thin, or distortion-sensitive. The two main categories:

**Vacuum chucks (porous or grooved).** A vacuum chuck provides uniform clamping pressure across the back face of a part through a network of grooves or a porous insert connected to a vacuum pump. For titanium, the standard vacuum level is 0.6–0.8 bar, and the part back face must be flat and continuous (no through-features that break the seal). The holding pressure is uniform across the part, which is the main advantage over mechanical clamping — the part is supported everywhere, not just at the clamp points. The disadvantage is the requirement for a continuous back face, and the cycle time cost of pumping the vacuum down (typically 2–5 seconds per clamp, similar for release).

Vacuum chucks on titanium work best for plate-like parts (medical implants, plate-stock cut to shape, thin-wall brackets with a flat back). For parts with a complex back face or with through-features, the vacuum seal is broken and the part cannot be held by vacuum alone. A hybrid approach — vacuum plus mechanical clamp at the part's edge — is sometimes used, but the mechanical clamp reintroduces distortion at the clamp point.

**Magnetic chucks are not available for titanium** (the material is paramagnetic), so this entire category of fixturing is excluded. The shop that has standardized on magnetic chucks for steel and aluminum work must plan for a different fixturing strategy for titanium.

**3-jaw and 4-jaw chucks (lathe workholding).** For turning operations, the standard workholding is a 3-jaw or 4-jaw chuck, covered in the [turning guide](/blog/titanium-cnc-turning-guide/) in the workholding section. The chuck pressure is the main distortion source on turned titanium parts, and the same principles apply: minimum chuck pressure, support the part with a tail stock or mandrel for thin-wall features, and verify that the chuck pressure is uniform across the jaws.

**Collet chucks.** For round or hexagonal bar stock, collet chucks provide uniform pressure around the circumference of the bar with lower local contact pressure than a 3-jaw chuck. Collets are the standard for finishing operations on turned titanium parts, where the surface must not be marked by the chuck jaws.

The right chuck or vacuum selection for a given part depends on the geometry and the tolerance. The standard for AS9100D production runs is to specify the workholding in the process documentation, and to verify the chuck pressure or vacuum level on the setup sheet for every part in the lot. The [5-axis titanium machining article](/blog/5-axis-titanium-machining-best-practices/) covers the multi-op workholding problem for parts that are machined on multiple faces in a single setup.


## Workholding for thin-wall and large titanium parts

Thin-wall and large titanium parts have workholding requirements that go beyond the standard vise, plate, and chuck categories. Two distinct problem classes:

**Thin-wall parts (wall thickness < 1.5 mm, or aspect ratio > 10:1).** A thin-wall part deflects visibly under any clamp pressure, and the deflection is locked in as residual stress when the clamp is released. The workholding strategy has to provide support everywhere the cutting force is applied, not just at discrete clamp points. Three approaches:

- **Sacrificial-rib fixturing**: a temporary rib is added to the rough stock at a location where the clamp will bear. The rib is machined away in the finishing pass, but it provides a rigid bearing surface for the clamp during roughing. The rib is typically 3–5 mm tall and 2–3 mm thick, dimensioned to absorb the clamp force without deflecting.
- **Backing-plate fixturing**: a backing plate (aluminum or steel) is bolted to the back of the thin-wall feature, providing continuous support across the back face. The backing plate is bolted through the part (or through sacrificial holes) and removed after machining. The plate absorbs the cutting force and prevents the thin wall from deflecting.
- **Vacuum chuck (for flat thin-wall parts)**: a vacuum chuck provides uniform support across the back face, and is the preferred option for plate-like thin-wall parts (medical implant blanks, thin diaphragms).

The [thin-wall article](/blog/cnc-machining-thin-wall-titanium/) covers the full set of fixturing strategies for thin-wall features, including the wall-thickness-to-stock-thickness ratio that determines the right approach.

**Large titanium parts (length > 300 mm, or weight > 10 kg).** Large parts have a different workholding problem — the part itself is rigid, but the fixture has to support the part's weight and resist the cutting force across a long lever arm. Two approaches:

- **Multi-locator fixture plate with adjustable supports**: a fixture plate with multiple locators (pins, adjustable posts, or jack screws) that can be positioned to match the part's geometry. The plate provides support at every critical feature, and the locators are adjusted lot-to-lot to match the stock variation. The fixture plate is typically 400–800 mm long for a 500 mm part, and the cost is $5,000–$15,000.
- **Sub-plate with sacrificial soft jaws**: a sub-plate is mounted to the machine table, and the part is clamped to the sub-plate with custom soft jaws that match the part's profile. The soft jaws provide distributed clamping pressure, and the sub-plate provides the overall rigidity. This is the standard for production runs of large parts.

The workholding for large parts is typically designed in parallel with the tooling and the toolpath, because the cutting force on a long lever arm produces chatter and distortion that the workholding has to absorb. A large-part fixture designed after the tooling is fixed is usually over-built and adds cost without benefit. The [5-axis machining best practices article](/blog/5-axis-titanium-machining-best-practices/) covers the multi-face workholding problem for parts that are machined on more than one face in a single setup.


## Distortion control: stress-relief between operations

For titanium parts that show measurable distortion after machining — typically 0.05–0.30 mm on a 100–300 mm part — the fix is a stress-relief operation between roughing and finishing. The stress-relief operation reduces the residual stress in the part, which is the source of the distortion when the clamp is released or the part is cut free from the stock. Three stress-relief approaches:

**1. Thermal stress relief (vacuum or inert atmosphere).** Heat the part to 480–650 °C (depending on the alloy), hold for 1–2 hours per inch of section thickness, then slow-cool. For Grade 5, the standard stress-relief cycle is 540 °C ± 15 °C for 1 hour per inch of thickness, with slow cool under inert atmosphere. For medical-grade Ti-6Al-4V ELI (Grade 23), the cycle is similar but at 480 °C ± 15 °C to avoid sensitization. The cycle removes the residual stress from prior machining without altering the microstructure in a way that affects the final part.

**2. Vibratory stress relief (VSR).** A lower-cost alternative to thermal stress relief, with shorter cycle times. The part is subjected to controlled vibration at a frequency near its resonant frequency, which produces micro-plastic deformation that redistributes the residual stress. VSR works well for parts with thin or complex geometry that are not suited to thermal stress relief, but it is less effective than thermal stress relief for parts with high residual stress from heavy roughing.

**3. Cryogenic treatment.** Cooling the part to liquid-nitrogen temperature (-196 °C) for 24–48 hours, then slow-warming to room temperature. The treatment promotes microstructural changes that reduce residual stress and improve dimensional stability. Cryogenic treatment is more common on tool steels than on titanium, but it is occasionally used on titanium parts that require maximum dimensional stability.

The standard practice for AS9100D production runs is to specify the stress-relief operation in the process documentation, with the cycle parameters (temperature, hold time, atmosphere) recorded on the setup sheet. For parts that show measurable distortion in the first article, the stress-relief operation is added between roughing and finishing; for parts that hold tolerance without stress relief, the operation is omitted. The [stress-relieving heat treatment article](/blog/titanium-stress-relieving-heat-treatment-temperature-control-distortion-prevention/) covers the full thermal cycle options and the metallurgical rationale for the temperature ranges.

The combined strategy — a well-designed workholding scheme for roughing, a stress-relief operation between roughing and finishing, and a low-distortion workholding scheme for finishing — is what reduces a typical 0.10–0.30 mm post-machining distortion on a complex titanium part to a 0.02–0.05 mm distortion, which is within the typical ISO 2768-f tolerance band. The [deformation causes and prevention article](/blog/titanium-cnc-machining-deformation-causes-and-prevention/) covers the full set of distortion-control strategies beyond workholding.


## Workholding selection matrix

The matrix below summarises the workholding selection for the most common titanium part categories. Use it as a starting point; the right choice for a specific part depends on the geometry, the lot size, and the tolerance.

| Part category | Geometry / lot size | Recommended workholding | Clamp force / pressure | Distortion budget |
|---|---|---|---|---|
| Prismatic bracket, prototype | < 50 parts, no thin walls | Standard vise, hard jaws | 6–8 kN total | ±0.05 mm |
| Prismatic bracket, production | > 50 parts, no thin walls | Soft-jaw vise | 4–6 kN total | ±0.02 mm |
| Prismatic bracket, thin wall | Any lot size | Soft-jaw vise with sacrificial rib, or backing plate | 3–5 kN total, distributed | ±0.05 mm |
| Flat plate, prototype | < 20 parts | Vacuum chuck, grooved | 0.6 bar | ±0.02 mm |
| Flat plate, production | > 50 parts, AS9100D | Vacuum chuck, porous insert | 0.7–0.8 bar | ±0.01 mm |
| Aerospace structural part | > 100 parts, complex geometry | Custom fixture with multi-locator sub-plate | Per fixture design, verified by FEA | ±0.02 mm |
| Medical implant (Grade 23 ELI) | Any lot size, bio-clean | Custom fixture, single-use lot for bio-burden control | 2–4 kN, soft-jaw or wax | ±0.01 mm |
| Thin-wall tube, turning | Length > 100 mm, L/D > 4:1 | Hydraulic mandrel, tail stock support | 0.05–0.10 mm wall-to-mandrel clearance | ±0.02 mm |
| Long shaft, turning | Length > 200 mm | Collet + steady rest, tail stock | Per chuck spec | ±0.02 mm |
| Multi-face aerospace bracket | > 50 parts, 3+ setups | 5-axis fixture with one locating datum across all ops | Per fixture design | ±0.03 mm |
| Sheet-metal thin parts | < 0.5 mm thickness | Adhesive or wax mounting to carrier plate | N/A | ±0.01 mm |

The matrix is a starting point, not a fixed recipe. The actual workholding for a specific part depends on the machine, the lot size, the workpiece condition, and the inspection line item budget. The next section's checklist is a more practical decision aid for the day-to-day.

## Workholding checklist

- Locate on functional features (datums, register faces, bolt-hole patterns), not on rough-stock edges.
- Use a 3-2-1 locating scheme per ISO 5459. Avoid over-constrained locating.
- Clamp on rigid features (ribs, thickened sections, sacrificial ribs), not on thin walls.
- Use soft jaws for any titanium part in production; machine the jaw profile to match the part's clamping surface.
- Set vise pressure to the minimum that prevents slippage. Over-pressure is the most common cause of titanium distortion.
- For thin-wall parts, use sacrificial ribs, backing plates, or vacuum chucks to provide distributed support.
- For flat parts, use a vacuum chuck at 0.6–0.8 bar. Verify the back face is continuous (no through-features breaking the seal).
- For large parts (length > 300 mm), use a multi-locator fixture plate with adjustable supports. Design the fixture in parallel with the tooling and the toolpath.
- For turning, use a 3-jaw chuck for rough stock and a collet for finished or thin-wall parts. Add a tail stock for L/D > 3:1 and a steady rest for L/D > 4:1.
- For AS9100D production runs, document the workholding on the setup sheet. Verify clamp pressure or vacuum level at the start of every shift.
- For parts that show measurable distortion (0.05–0.30 mm) after roughing, add a stress-relief operation between roughing and finishing. Use 540 °C ± 15 °C for Grade 5, 480 °C ± 15 °C for Grade 23 ELI.
- For prototype runs, prioritise soft-jaw workholding over custom fixtures — soft jaws cost 20–40 minutes per setup, custom fixtures cost 2–4 weeks of lead time.
- Magnetic chucks are not available for titanium. Plan for mechanical, vacuum, or adhesive fixturing.

For a workholding review against a specific titanium program, send the STEP file and the print to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with locating scheme, clamping force, and distortion-control recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium RFQ against the checklist above before any tooling is ordered, and the typical outcome is a workholding pass that catches 1–2 clamp-on-thin-wall or over-constrained-locating issues per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the workholding decision is what determines whether the part runs on a 3-axis vise, a 5-axis fixture, or a custom vacuum chuck — and that decision drives the rest of the cycle time and the scrap rate.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Soft-jaw vs hard-jaw contact area: Side-by-side cross-section of a hard-jaw line contact vs a soft-jaw distributed contact, with contact-area ratios and clamp-pressure annotations. Supports queries about why soft jaws reduce titanium distortion.
Fig 2 — 3-2-1 locating scheme diagram: Annotated view of a titanium bracket on a fixture plate, showing the three primary locators (plane), two secondary locators (line), and one tertiary locator (point), with the datum letters A, B, C labeled per ASME Y14.5. Supports queries about 3-2-1 locating for titanium.
Fig 3 — Stress-relief cycle chart: Time-temperature graph showing the 540 °C / 1 hour-per-inch stress-relief cycle for Grade 5 titanium, with the slow-cool ramp annotated. Supports queries about thermal stress relief parameters for titanium.
-->