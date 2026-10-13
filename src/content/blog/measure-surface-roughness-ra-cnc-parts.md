---
title: "How to Measure Surface Roughness Ra on CNC Machined Parts"
description: "Engineering guide to surface roughness measurement on titanium CNC parts — Ra parameter and other roughness parameters, sampling length and cut-off, trace direction, measurement instruments (contact profilometer, optical profilometer, SEM), calibration, traceability, and the procurement specification for aerospace, medical, and chemical processing applications."
pubDate: 2026-10-13
author: Boze Titanium Manufacturing Center
category: Quality & Standards
tags: [Surface Roughness, Ra, Rz, Roughness Measurement, Contact Profilometer, Optical Profilometer, ISO 4287, ISO 4288, ASME Y14.36, Surface Finish]
coverImage: /uploads/PLACEHOLDER-blog-measure-surface-roughness-ra-cnc-parts-cover.jpg
coverImageAlt: PLACEHOLDER — surface roughness measurement on a titanium CNC machined part with a profilometer. To be replaced with the final image.
featured: false
---

Surface roughness measurement is the inspection method that verifies the surface finish of a titanium CNC part against the print specification, and the inspection is the gate between a part that meets the functional requirement (a sealing surface, a fatigue-critical surface, a medical implant surface) and a part that does not. The measurement is typically 1–2 minutes per feature with a contact profilometer, and the result is a single number (Ra) that the inspector records against the print. The cost of the inspection is small; the cost of an undetected out-of-specification surface is a sealing failure, a fatigue crack, a medical implant rejection, or a chemical processing leak, and the procurement decision is to specify the right measurement method, at the right sample, with the right traceability.

This article works through the four procurement decisions that determine whether a surface roughness spec is correctly specified and correctly measured: the Ra parameter and its variants, the sampling length and cut-off, the measurement instrument and its calibration, and the integration with the print and the FAI. It assumes the [AS9102 FAI article](/blog/as9102-fai-titanium-parts/), the [tolerance cost article](/blog/titanium-cnc-tolerance-cost/), and the [general machining processes guide](/blog/titanium-machining-processes-milling-turning-drilling-edm/) as background — those cover the broader quality and tolerance landscape; here we focus on the surface roughness measurement specifically. For the burr side, the [burrs and deburring article](/blog/titanium-cnc-burrs-deburring/) is the cross-reference.

- [Why surface roughness is a critical inspection on titanium parts](#why-surface-roughness-is-a-critical-inspection-on-titanium-parts)
- [The Ra parameter and its variants](#the-ra-parameter-and-its-variants)
- [Sampling length, cut-off, and trace direction](#sampling-length-cut-off-and-trace-direction)
- [Measurement instruments: contact, optical, SEM](#measurement-instruments-contact-optical-sem)
- [Calibration, traceability, and uncertainty](#calibration-traceability-and-uncertainty)
- [Integration with the print and the FAI](#integration-with-the-print-and-the-fai)
- [Surface roughness checklist](#surface-roughness-checklist)

## Why surface roughness is a critical inspection on titanium parts

Surface roughness is a critical inspection on titanium parts for three functional reasons:

**1. Sealing performance.** A sealing surface (a flange face, an O-ring groove, a hydraulic fitting) must have a surface roughness below a critical threshold to maintain the seal. For an elastomer O-ring (NBR, FKM, EPDM), the typical surface roughness requirement is Ra 0.4–0.8 µm. For a metal gasket (a soft aluminium, a soft copper), the requirement is Ra 0.8–1.6 µm. A surface roughness above the threshold produces a leak path, and the leak path produces a pressure drop or a fluid loss that can fail the assembly.

**2. Fatigue performance.** A fatigue-critical surface (a fillet, a notch, a thread root) has a fatigue life that is highly sensitive to the surface roughness. A rough surface produces stress concentrators at the peaks of the roughness profile, and the stress concentrators reduce the fatigue life by 30–60% relative to a polished surface. For aerospace structural parts, the fatigue-critical surface is typically specified at Ra ≤ 0.8 µm, with the surface produced by a finish-pass machining or a post-machining polishing operation.

**3. Medical implant biocompatibility.** A medical implant surface (the surface that contacts tissue or bone) has a surface roughness requirement that is set by the tissue response, not by the functional fit. A smooth surface (Ra 0.05–0.2 µm) promotes a fibrous tissue encapsulation. A rough surface (Ra 1.0–2.0 µm) promotes bone ingrowth.

The three functional categories — sealing, fatigue, and medical — cover most of the surface roughness requirements on titanium parts. The procurement spec that does not specify the Ra value, the measurement method, and the sampling rate produces a part that the supplier and the buyer interpret differently, and the disagreement is paid as a sealing failure, a fatigue failure, or a medical rejection. The cost of specifying the right Ra value is 1–2 minutes per feature in the inspection; the cost of not specifying is the cost of the failure.

## The Ra parameter and its variants

The Ra parameter is the arithmetic average of the absolute deviations of the roughness profile from the mean line, measured over a defined sampling length. Ra is the most commonly specified surface roughness parameter, and it is the right parameter for most titanium CNC parts. The full set of roughness parameters per ISO 4287 and ISO 13565 includes:

- **Ra (arithmetic average roughness).** The arithmetic average of the absolute deviations of the roughness profile from the mean line, in micrometers or microinches. Ra is the most commonly specified parameter, and it is the right parameter for surfaces that are not direction-sensitive (most machined surfaces). The typical Ra range for titanium CNC parts is Ra 0.4–3.2 µm.
- **Rz (mean peak-to-valley height).** The average of the five largest peak-to-valley measurements over the sampling length, in micrometers or microinches. Rz is roughly 4–7× the Ra value for a typical machined surface. Rz is sometimes specified for surfaces that are direction-sensitive.
- **Rmax (maximum peak-to-valley height).** The single largest peak-to-valley measurement over the sampling length, in micrometers. Rmax is sensitive to single defects and is sometimes specified for surfaces that must be free of single defects.
- **Rt (total profile height).** The peak-to-valley height over the entire evaluation length. Rt is the total roughness, including the waviness and the form errors, and is rarely specified for individual features.
- **Rq (root-mean-square roughness).** The root-mean-square of the absolute deviations. Rq is roughly 1.1× the Ra value for a typical machined surface.
- **Rsk (skewness) and Rku (kurtosis)** — statistical parameters that are rarely specified for individual features.

The procurement spec for a typical titanium CNC part uses Ra only, with Rz specified for sealing surfaces and Rmax specified for fatigue-critical surfaces. The multiple-parameter specs (Ra + Rz + Rmax) are over-specified and should be reserved for safety-critical parts.

The surface roughness value is typically specified in micrometers (Ra 0.8, Ra 1.6, Ra 3.2, etc.) per ISO 1302, or in microinches (Ra 32 µin, Ra 63 µin, Ra 125 µin, etc.) per ASME Y14.36. The ISO 1302 grade numbers (N5, N6, N7) and the ASME Y14.36 grade numbers (1, 2, 3) are also accepted. The grade number is a logarithmic range, with each grade covering a roughly 2× range in Ra.


## Sampling length, cut-off, and trace direction

The sampling length is the length of the surface profile over which the Ra value is calculated. The cut-off is the filter wavelength below which the roughness is included in the calculation and above which the waviness is excluded. The trace direction is the direction along which the stylus is moved to measure the profile. The three parameters are specified per ISO 4288 and ASME B46.1:

- **Sampling length.** For Ra 0.006–0.02 µm (Grade 0–1), the sampling length is 0.08 mm. For Ra 0.02–0.1 µm (Grade 1–2), the sampling length is 0.25 mm. For Ra 0.1–2.0 µm (Grade 2–5), the sampling length is 0.8 mm. For Ra 2.0–10.0 µm (Grade 5–7), the sampling length is 2.5 mm. For Ra 10.0–80.0 µm (Grade 7–9), the sampling length is 8.0 mm. The sampling length is typically 5× the cut-off.
- **Cut-off (filter wavelength).** The cut-off is typically 0.08 mm, 0.25 mm, 0.8 mm, 2.5 mm, or 8.0 mm, and is selected based on the expected roughness of the surface. The cut-off is typically 1/3 to 1/30 of the evaluation length, and is selected to exclude the waviness and the form error from the roughness calculation.
- **Trace direction.** The trace direction should be perpendicular to the lay of the surface (the lay is the predominant direction of the surface texture). For a milled surface (perpendicular lay), the trace is parallel to the milling direction. For a turned surface (circumferential lay), the trace is parallel to the turning axis. For a ground surface (cross-hatched lay), the trace is perpendicular to the grinding direction. The trace direction should be specified in the inspection plan, with the same direction used for every part in the production run.

The procurement spec for surface roughness must specify all three parameters: the Ra value, the sampling length, and the cut-off. A spec that says "Ra 0.8" without the sampling length and the cut-off is incomplete, and the inspector must make assumptions that the supplier and the buyer may interpret differently. The standard specification is "Ra 0.8 µm, sampling length 0.8 mm, cut-off 0.8 mm, trace perpendicular to the lay" or equivalent.

## Measurement instruments: contact, optical, SEM

The three measurement instruments applicable to titanium parts, with the principle, the resolution, the application, and the cost:

**Contact profilometer (stylus profilometer).** A diamond-tipped stylus is drawn across the surface at a constant speed, and the vertical displacement of the stylus is recorded as a function of the horizontal position. The Ra value is calculated from the displacement profile. Contact profilometers are the most common instrument for surface roughness measurement, with a vertical resolution of 1–5 nm and a horizontal resolution of 0.5–1 µm. The contact force is typically 0.5–1.0 mN, which is low enough not to damage the titanium surface. The cost is $5,000–$50,000 per instrument, and the cost per measurement is negligible (the instrument is in-house at the supplier). Contact profilometers are the standard for Ra 0.1–10 µm, which covers the typical titanium CNC surface range.

**Optical profilometer (white light interferometry or confocal microscopy).** A non-contact optical measurement, where the surface is illuminated with white light (or a focused laser), and the reflected light is analysed to determine the surface height. Optical profilometers have a vertical resolution of 0.1–1 nm and a horizontal resolution of 0.2–1 µm. The instrument is non-contact, which is the advantage for soft or delicate surfaces, but the measurement area is typically smaller than the contact profilometer (0.1–10 mm² vs 0.5–25 mm² for contact). The cost is $50,000–$500,000 per instrument, and the cost per measurement is negligible for in-house instruments. Optical profilometers are the standard for Ra 0.005–1.0 µm, and for surfaces where contact measurement is not practical (very soft or very delicate surfaces).

**Scanning Electron Microscope (SEM).** A high-magnification image of the surface, with the surface roughness measured from the image. SEM has a vertical resolution of 1–10 nm and a horizontal resolution of 1–10 nm (the highest of the three instruments). The measurement area is typically 0.001–1 mm², which is much smaller than the contact or optical profilometer. The cost is $200,000–$1,000,000 per instrument, and the cost per measurement is $50–$500 (the operator time). SEM is the standard for surface roughness measurement at the nanometre scale, and for surfaces where the highest resolution is required (medical implant surfaces, fracture-critical aerospace surfaces). SEM is not the standard for typical titanium CNC surfaces, where the contact or optical profilometer is the right instrument.

The instrument selection is driven by the surface roughness range, the required resolution, and the cost. For a typical titanium CNC part with Ra 0.4–3.2 µm, the contact profilometer is the right instrument, and the cost is amortised over the production run. For a medical implant with Ra 0.05–0.2 µm, the optical profilometer is the right instrument, and the cost is justified by the higher inspection value. For a fracture-critical aerospace surface with Ra 0.1–0.4 µm, the optical profilometer or SEM is the right instrument, depending on the resolution required.


## Calibration, traceability, and uncertainty

The measurement instrument must be calibrated against a traceable standard, and the calibration record must be part of the inspection documentation. The standard for surface roughness calibration is ISO 5436-1 (calibration specimens for contact and optical profilometers), and the traceable standards are maintained by national metrology institutes (NIST in the US, NPL in the UK, PTB in Germany, NIM in China). The calibration cycle is typically 12 months, with the instrument verified at the start of every shift against a working standard.

The measurement uncertainty is the range of values that the measurement could reasonably attribute to the surface. The uncertainty is typically expressed as U(k=2), which is the expanded uncertainty at 95% confidence. The typical uncertainty for a contact profilometer is U(k=2) = 0.005–0.020 µm, depending on the instrument and the calibration. The uncertainty is added to the measurement result as a tolerance band, and the procurement spec must account for the uncertainty when setting the acceptance threshold.

A buyer who specifies "Ra 0.8 µm maximum" without accounting for the measurement uncertainty accepts parts with a true Ra up to 0.8 + 0.02 = 0.82 µm. The procurement spec typically does not need to specify the measurement uncertainty separately, but the supplier's measurement uncertainty should be documented in the inspection plan.


## Integration with the print and the FAI

The surface roughness spec is integrated with the print (the surface finish symbol and the Ra value) and with the FAI (the surface roughness measurement record). The print specifies the surface finish symbol per ISO 1302 or ASME Y14.36, with the Ra value and the lay symbol (the lay symbol indicates the predominant direction of the surface texture). The FAI records the surface roughness measurement for every surface on the print that has a finish specification.

The integration is the buyer's verification that the supplier has measured every surface on the print that has a finish specification, and that the measurement is documented per the inspection plan. A buyer who specifies the surface finish on the print but does not specify the measurement in the FAI accepts parts with unmeasured surface roughness. A buyer who specifies both the print finish and the FAI measurement catches the surface roughness at the FAI, before the production run is released.

The [AS9102 FAI article](/blog/as9102-fai-titanium-parts/) covers the FAI integration in detail. The surface roughness measurement is one of the process characteristics on the FAI, with the measurement value, the inspection method, the inspector, the date, and the surface identification (per the print's surface finish symbol) recorded for every surface on the print.

## Surface roughness checklist

- Specify the Ra value on the print, in micrometers (per ISO 1302) or in microinches (per ASME Y14.36). Specify the grade number if the standard grade range is acceptable.
- Specify the sampling length and the cut-off per ISO 4288. The default is 0.8 mm sampling length and 0.8 mm cut-off for Ra 0.1–2.0 µm.
- Specify the trace direction per the lay of the surface. The default is perpendicular to the lay.
- Specify the inspection method (contact profilometer, optical profilometer, or SEM) at the RFQ stage. The method is typically contact profilometer for Ra 0.1–10 µm.
- Specify the inspection scope (FAI only, FAI + per-lot sampling, 100% on every part) and the sampling rate.
- Document the instrument calibration records and the measurement uncertainty in the inspection plan.
- Verify the surface roughness measurement on the FAI before the production run is released.
- For medical implant surfaces, specify the surface treatment that produces the roughness (machining, etching, blasting) and the inspection scope per ASTM F3091.
- For sealing surfaces, specify the Ra value and the surface treatment that produces the seal.
- For fatigue-critical surfaces, specify the Ra value, the surface treatment, and the inspection scope (typically 100% inspection).

For a surface roughness review against a specific titanium program, send the print, the inspection plan, and the application to the [RFQ intake](/rfq/); the engineering team returns a manufacturability feedback with surface roughness spec, measurement method, and inspection scope recommendations. The [5-axis titanium machining services](/titanium-cnc-machining-services/) and [engineering review capability](/capabilities/) at Boze review every titanium surface roughness program against the checklist above before the buyer's submission, and the typical outcome is a review that surfaces 1–2 surface-roughness-spec gaps per program. For [Ti-6Al-4V Grade 5](/materials/grade-5/) parts in particular, the surface roughness spec and the measurement method are what determine whether a sealing failure, a fatigue failure, or a medical rejection is caught at the FAI or at the service failure — and that determination is what drives the buyer's total cost of ownership over the program.

<!-- VISUAL CONTENT BRIEF (for content planning only — NOT rendered on page)
Fig 1 — Surface roughness grade chart: Bar chart with ISO 1302 grade number (N1 to N12) on X axis and Ra range (µm) on Y axis (logarithmic scale), with the typical titanium CNC surface roughness range (Ra 0.4–3.2 µm) highlighted. Supports queries about surface roughness grade selection.
Fig 2 — Surface roughness parameters: Comparison chart of Ra, Rz, Rmax, Rt, Rq, Rsk, Rku with their definitions, formulas, and typical applications. Supports queries about which roughness parameter to specify for a given application.
Fig 3 — Instrument comparison: Bar chart with measurement instrument (contact, optical, SEM) on X axis and key parameters (vertical resolution, horizontal resolution, measurement area, cost) on the Y axis. Supports queries about which surface roughness instrument to use for a given application.
-->