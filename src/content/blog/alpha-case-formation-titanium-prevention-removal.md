---
title: "Alpha Case Formation in Titanium: Prevention and Removal"
slug: alpha-case-formation-titanium-prevention-removal
description: "An engineering analysis of alpha case formation during titanium heat treatment and machining - the oxygen-enriched surface layer that embrittles titanium above 400 degC, how it affects part performance, and the process controls needed to prevent or remove it."
pubDate: 2026-07-29
author: Boze Titanium Manufacturing Center
category: Manufacturing Problems
tags: [Titanium CNC Machining, Alpha Case, Titanium Metallurgy, Heat Treatment, Surface Integrity]
coverImage: /uploads/titanium-cnc-machining-manufacturing-facility.jpg
coverImageAlt: Metallurgical inspection of titanium surface condition
featured: false
---

Alpha case is a hard, brittle, oxygen-enriched layer that forms on titanium surfaces when the material is exposed to elevated temperatures in an oxygen-containing atmosphere. It is not a defect in the conventional sense - it is a predictable metallurgical response that must be accounted for in any process that heats titanium above approximately 400 degC, including machining, heat treatment, and hot forming. The thermal conditions that drive alpha case formation are related to the same [thermal concentration mechanisms](/blog/why-titanium-is-difficult-to-machine/) that make titanium machining challenging at the cutting interface.

## What alpha case is and why it forms

At temperatures above roughly 400 degC, titanium has a high affinity for oxygen. When the surface of a titanium component is exposed to air at elevated temperatures, oxygen diffuses into the metal lattice and stabilizes the alpha phase, creating a surface layer that is harder, more brittle, and less ductile than the base material. This oxygen-stabilized alpha layer is called alpha case.

The alpha case layer has different mechanical properties from the bulk material. Its hardness can be 50 to 100 HV higher than the underlying metal, and its ductility is significantly reduced. In components subject to cyclic loading, the alpha case layer is a potential fatigue crack initiation site. Cracks that form in the brittle alpha case can propagate into the base material under continued loading.

The depth of alpha case depends on the temperature and the duration of exposure. At 600 degC, a one-hour exposure produces an alpha case depth of approximately 10 to 15 microns. At 800 degC, the same exposure time produces 30 to 50 microns. At typical solution heat treatment temperatures for Ti-6Al-4V, which range from 900 to 980 degC, alpha case can reach depths of 100 to 200 microns within the heat treatment cycle.

## Where alpha case occurs in the manufacturing process

Alpha case formation is most commonly associated with heat treatment operations, but it can also occur during machining under certain conditions. When cutting temperatures at the tool-workpiece interface exceed 400 degC in the presence of air - which they routinely do in titanium machining - there is potential for oxygen diffusion into the freshly machined surface.

In practice, alpha case from machining is limited to a shallow depth because the heated zone at the cutting interface is thin and cools rapidly after the tool passes. Typical machining-induced alpha case depths are 2 to 10 microns, compared to 50 to 200 microns from heat treatment. The machining-induced layer is also less continuous because it forms only in the areas where the cutting temperature exceeds the threshold.

The more significant risk is alpha case from heat treatment operations that precede or follow machining. Components that are solution heat treated or stress relieved in air without protective atmosphere will develop alpha case that must be removed by subsequent machining or chemical processing. For this reason, aerospace heat treatment specifications for titanium almost always require vacuum furnaces or protective atmosphere to prevent oxygen pickup during thermal cycles.

Hot forming operations for titanium - such as hot forging, hot sizing, or hot straightening - also produce alpha case if performed in air. The depth depends on the temperature and duration of the operation. For hot forming at temperatures below the beta transus, alpha case depths of 50 to 200 microns are typical and must be accounted for in the machining allowance.

## Why alpha case matters for part performance

The primary concern with alpha case is fatigue performance. The brittle surface layer cracks under cyclic loading at lower stress levels than the base material, and these surface cracks propagate into the ductile substrate. In high-cycle fatigue applications such as rotating aerospace components, alpha case depths as shallow as 10 to 20 microns have been shown to reduce fatigue life by 30 to 50 percent.

Alpha case also affects surface finish measurements. The hard layer can produce misleading profilometer readings because the stylus skims over the brittle surface differently than it would over ductile material. A surface that measures within roughness specification may still have an alpha case layer that compromises performance.

In thin-wall components, alpha case can represent a significant fraction of the wall thickness. On a 1.0 mm wall, a 50-micron alpha case layer on each side reduces the effective ductile cross-section by 10 percent. The embrittled layer also changes the bending stiffness and can affect the part's response to proof testing or functional loading.

## Prevention methods

The most reliable prevention method is to avoid exposing titanium to oxygen at elevated temperatures. Vacuum heat treatment at pressures below 10 to the minus 4 torr prevents alpha case formation entirely. Argon or nitrogen backfill at positive pressure in the furnace also prevents oxygen diffusion, though nitrogen can form a titanium nitride surface layer that has its own implications for subsequent processing.

For operations where vacuum or protective atmosphere is not available, chemical barrier coatings can be applied to the surface before heat treatment. These coatings form a glassy barrier that prevents oxygen from reaching the titanium surface. The coatings are removed after heat treatment by chemical stripping or mechanical abrasion.

In machining, alpha case prevention focuses on maintaining coolant coverage to keep the cutting zone temperature below the oxygen diffusion threshold. Through-spindle coolant at 50 bar or higher, combined with appropriate cutting speeds that keep the interface temperature below 400 degC as much as possible, limits alpha case formation to negligible depths.

## Removal methods and machining allowances

When alpha case cannot be prevented, it must be removed. The removal method depends on the component geometry and the acceptable depth of removal.

Chemical milling using a nitric-hydrofluoric acid solution removes alpha case uniformly from exposed surfaces. The removal rate is typically 5 to 10 microns per minute per side, depending on solution temperature and concentration. Chemical milling is the preferred method for complex geometries where mechanical removal would be difficult.

Mechanical removal by machining or abrasive blasting is effective for simple geometries. The alpha case layer is removed by taking a machining pass below the affected depth, or by abrasive blasting with a fine media that abrades the embrittled layer. Mechanical removal can leave residual stresses in the surface, so a light chemical etch after mechanical removal is sometimes specified.

The machining allowance for alpha case removal must be established during process planning. For heat-treated components, the allowance should be at least 1.5 times the expected alpha case depth to ensure complete removal. For components with variable section thickness, the allowance should be based on the thickest sections, which take longer to reach temperature and therefore develop deeper alpha case.

Aerospace process specifications typically require verification that alpha case has been completely removed. This is done by metallographic examination of a representative part or coupon, or by hardness profiling through the surface layer. The specification usually requires that the hardness at the surface be within 10 to 20 HV of the bulk hardness, indicating that no oxygen-enriched layer remains.

---

**Table 1: Alpha case depth by process condition**

| Condition | Temperature | Typical depth | Prevention approach |
|-----------|-----------|-------------|-------------------|
| Machining, sharp tool | 400-600 degC at interface | 2-5 microns | Coolant coverage, moderate speed |
| Machining, worn tool | 600-800 degC at interface | 5-10 microns | Tool change discipline |
| Stress relief, air furnace | 500-700 degC | 20-50 microns | Vacuum or Ar atmosphere |
| Solution treatment, air | 900-980 degC | 100-200 microns | Vacuum furnace required |
| Hot forging, air | 800-950 degC | 50-200 microns | Protective coating or atmosphere |