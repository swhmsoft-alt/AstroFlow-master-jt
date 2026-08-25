// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import normalizeTrailingSlash from '@reunmedia/astro-normalize-trailing-slash';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeAutoInternalLinksI18n } from './src/lib/rehype-auto-internal-links-i18n';
import devDashboardApi from './astro/integrations/dev-dashboard-vite-plugin.mjs';

// https://astro.build
export default defineConfig({
  site: 'https://cnc.bozemetal.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    react(),
    normalizeTrailingSlash(),
    sitemap({
      filter: (page) => !page.includes('/theme-demo') && !page.includes('/admin') && !page.includes('/thank-you'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          de: 'de-DE',
          ja: 'ja-JP',
          fr: 'fr-FR',
          es: 'es-ES',
          pt: 'pt-PT',
          it: 'it-IT',
          ko: 'ko-KR',
          nl: 'nl-NL',
          pl: 'pl-PL',
          ru: 'ru-RU',
          ar: 'ar-SA',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de', 'ja', 'fr', 'es', 'pt', 'it', 'ko', 'nl', 'pl', 'ru', 'ar'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  // F4 — Industry page slug reconciliation.
  // Maps content-collection-derived slugs (aerospace-defense, etc.) and
  // entity-registry canonical slugs to the actual /pages/industries/*.astro
  // filenames, so F1 internal-link mesh and JSON-LD @id refs don't 404.
  // 2026-08-25: 6 industry entities still have no dedicated page yet → fall
  // back to the canonical /products/industries/ hub.
  redirects: {
    '/industries/aerospace-defense/':           '/industries/aerospace/',
    '/industries/chemical-processing/':         '/industries/chemical/',
    '/industries/marine-offshore/':             '/industries/marine/',
    '/industries/medical-device/':              '/industries/medical/',
    '/industries/automotive-motorsports/':      '/products/industries/',
    '/industries/consumer-electronics/':        '/products/industries/',
    '/industries/cycling---bicycle/':           '/products/industries/',
    '/industries/electroplating-surface-finishing/': '/products/industries/',
    '/industries/environmental-engineering/':   '/products/industries/',
    '/industries/general-industrial/':          '/products/industries/',
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [rehypeAutoInternalLinksI18n, {
        keywordMap: {
          "3.1 MTC with VAR ingot traceability per ASME Section VIII": {
            "href": "/capabilities/31-mtc-with-var-ingot-traceability-per-asme-section-viii/"
          },
          "3/5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3/5-Axis CNC Milling": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D CMM inspection": {
            "href": "/products/capabilities/3d-cmm-inspection/"
          },
          "3D CMM inspection of spherical bearing housing bores": {
            "href": "/capabilities/3d-cmm-inspection-of-spherical-bearing-housing-bores/"
          },
          "3D Printing SLM/DMLS": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D Printing SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "4/5-axis CNC milling": {
            "href": "/capabilities/4-5-axis-cnc-milling/"
          },
          "5-axis CNC contour milling": {
            "href": "/capabilities/5-axis-cnc-contour-milling/"
          },
          "5-Axis CNC Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-axis CNC machining of blades": {
            "href": "/capabilities/5-axis-cnc-machining-of-blades/"
          },
          "5-axis CNC milling of aerofoils": {
            "href": "/capabilities/5-axis-cnc-milling-of-aerofoils/"
          },
          "5-axis CNC milling of clevis brackets": {
            "href": "/capabilities/5-axis-cnc-milling-of-clevis-brackets/"
          },
          "5-axis CNC milling of manipulator knuckles and swivel joints": {
            "href": "/capabilities/5-axis-cnc-milling-of-manipulator-knuckles-and-swivel-joints/"
          },
          "5-axis machining center": {
            "href": "/capabilities/5-axis-machining-center/"
          },
          "5-Axis Machining": {
            "href": "/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "5-axis milling of faces": {
            "href": "/capabilities/5-axis-milling-of-faces/"
          },
          "5-axis simultaneous CNC milling": {
            "href": "/capabilities/5-axis-simultaneous-cnc-milling/"
          },
          "7-stage UHP cleanroom wash for hydrogen fuel cell components": {
            "href": "/capabilities/7-stage-uhp-cleanroom-wash-for-hydrogen-fuel-cell-components/"
          },
          "Accelerated aging test (1000h)": {
            "href": "/capabilities/accelerated-aging-test-1000h/"
          },
          "Adaptive machining": {
            "href": "/capabilities/adaptive-machining/"
          },
          "Additive Manufacturing (AM) Builds": {
            "href": "/systems/additive-manufacturing-am-builds/"
          },
          "Aero Engine Compressor Blisks & Blades": {
            "href": "/systems/aero-engine-compressor-blisks-blades/"
          },
          "Aerospace & Defense": {
            "href": "/industries/aerospace/"
          },
          "Aerospace Ducting & Pneumatic Systems": {
            "href": "/systems/aerospace-ducting-pneumatic-systems/"
          },
          "aerospace titanium": {
            "href": "/industries/aerospace/"
          },
          "AF temperature measurement (DSC)": {
            "href": "/capabilities/af-temperature-measurement-dsc/"
          },
          "AMS 2488": {
            "href": "/titanium-standards/ams-2488/"
          },
          "AMS 4911": {
            "href": "/titanium-standards/ams-4911/"
          },
          "AMS 4928": {
            "href": "/titanium-standards/ams-4928/"
          },
          "AMS 4928T": {
            "href": "/materials/grade-5/"
          },
          "AMS 4943": {
            "href": "/titanium-standards/ams-4943/"
          },
          "AMS 4944": {
            "href": "/titanium-standards/ams-4944/"
          },
          "Anodizing (AMS 2488)": {
            "href": "/capabilities/anodizing-ams-2488/"
          },
          "Anodizing (colors)": {
            "href": "/capabilities/anodizing-colors/"
          },
          "Anodizing/DLC coating": {
            "href": "/capabilities/anodizing-dlc-coating/"
          },
          "Anodizing": {
            "href": "/capabilities/anodizing/"
          },
          "anodizing of titanium": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing / Surface Treatment Line": {
            "href": "/equipment/anodizing-surface-treatment/"
          },
          "Anodizing (Type II": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "Anodizing (Type II & Type III)": {
            "href": "/titanium-surface-treatment/anodizing/"
          },
          "AS9100": {
            "href": "/capabilities/"
          },
          "AS9100D": {
            "href": "/capabilities/"
          },
          "Assembly & riveting": {
            "href": "/capabilities/assembly--riveting/"
          },
          "ASTM B265": {
            "href": "/titanium-standards/astm-b265/"
          },
          "ASTM B338": {
            "href": "/titanium-standards/astm-b338/"
          },
          "ASTM B348": {
            "href": "/materials/grade-5/"
          },
          "ASTM B381": {
            "href": "/titanium-standards/astm-b381/"
          },
          "ASTM B861": {
            "href": "/titanium-standards/astm-b861/"
          },
          "ASTM F136": {
            "href": "/titanium-standards/astm-f136/"
          },
          "ASTM F2924": {
            "href": "/titanium-standards/astm-f2924/"
          },
          "ASTM F3001": {
            "href": "/titanium-standards/astm-f3001/"
          },
          "ASTM F67": {
            "href": "/titanium-standards/astm-f67/"
          },
          "ASTM F86": {
            "href": "/titanium-standards/astm-f86/"
          },
          "Automatic Bar Feeder": {
            "href": "/equipment/automatic-bar-feeder/"
          },
          "Automatic spring coiling": {
            "href": "/capabilities/automatic-spring-coiling/"
          },
          "Automatic Swiss turning": {
            "href": "/capabilities/automatic-swiss-turning/"
          },
          "Automatic TIG welding (tube end)": {
            "href": "/capabilities/automatic-tig-welding-tube-end/"
          },
          "Automatic Tool Magazine": {
            "href": "/equipment/automatic-tool-magazine/"
          },
          "Automatic Tool Presetter": {
            "href": "/equipment/tool-presetter/"
          },
          "Automotive & Motorsports": {
            "href": "/industries/automotive-motorsports/"
          },
          "Ballistic Armor & Protection": {
            "href": "/systems/ballistic-armor-protection/"
          },
          "Ballistic testing (per NIJ/MIL-STD)": {
            "href": "/capabilities/ballistic-testing-per-nij-mil-std/"
          },
          "Batch testing (mechanical + metallographic)": {
            "href": "/capabilities/batch-testing-mechanical--metallographic/"
          },
          "Bead blasting / anodizing / PVD": {
            "href": "/capabilities/bead-blasting-anodizing-pvd/"
          },
          "bead blasting": {
            "href": "/products/capabilities/bead-blasting-anodizing-pvd/"
          },
          "Bead blasting of plasma-facing surfaces": {
            "href": "/capabilities/bead-blasting-of-plasma-facing-surfaces/"
          },
          "Bend forming of stiffener ribs and gussets": {
            "href": "/capabilities/bend-forming-of-stiffener-ribs-and-gussets/"
          },
          "Beta-C (Ti-3Al-8V-6Cr-4Mo-4Zr)": {
            "href": "/materials/beta-c-ti-3al-8v-6cr-4mo-4zr/"
          },
          "Beta-C wire cold coiling + shot peening + preset for shock springs": {
            "href": "/capabilities/beta-c-wire-cold-coiling--shot-peening--preset-for-shock-springs/"
          },
          "Bicycle Braking System Components": {
            "href": "/systems/bicycle-braking-system-components/"
          },
          "Bicycle Cockpit, Steering & Control Hardware": {
            "href": "/systems/bicycle-cockpit-steering-control-hardware/"
          },
          "Bicycle Drivetrain & Drivetrain Hardware": {
            "href": "/systems/bicycle-drivetrain-drivetrain-hardware/"
          },
          "Bicycle Suspension, Frame Hardware & Linkage": {
            "href": "/systems/bicycle-suspension-frame-hardware-linkage/"
          },
          "Bicycle Wheels, Saddle, Pedals & Accessories": {
            "href": "/systems/bicycle-wheels-saddle-pedals-accessories/"
          },
          "Brackets / Fittings / Connectors": {
            "href": "/systems/brackets--fittings--connectors/"
          },
          "Cardiovascular Stent & TAVI Frames": {
            "href": "/systems/cardiovascular-stent-tavi-frames/"
          },
          "Caseback threading": {
            "href": "/capabilities/caseback-threading/"
          },
          "CBN tool finishing": {
            "href": "/capabilities/cbn-tool-finishing/"
          },
          "Center-boring of vented vacuum screws": {
            "href": "/capabilities/center-boring-of-vented-vacuum-screws/"
          },
          "Centerless grinding + DLC coating of actuator piston rods": {
            "href": "/capabilities/centerless-grinding--dlc-coating-of-actuator-piston-rods/"
          },
          "Centerless grinding of core taper": {
            "href": "/capabilities/centerless-grinding-of-core-taper/"
          },
          "Charpy impact at -20C": {
            "href": "/capabilities/charpy-impact-at-20c/"
          },
          "Charpy impact testing at -253C": {
            "href": "/capabilities/charpy-impact-testing-at-253c/"
          },
          "Charpy impact testing at -253C for LH2 cryogenic hardware": {
            "href": "/capabilities/charpy-impact-testing-at-253c-for-lh2-cryogenic-hardware/"
          },
          "Chemical etching of diaphragm profiles": {
            "href": "/capabilities/chemical-etching-of-diaphragm-profiles/"
          },
          "Chemical Passivation": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "chemical passivation treatment": {
            "href": "/titanium-surface-treatment/chemical-passivation/"
          },
          "Chemical Pipe Fittings & Flow Control Components": {
            "href": "/systems/chemical-pipe-fittings-flow-control-components/"
          },
          "Chemical Processing": {
            "href": "/industries/chemical/"
          },
          "Chemical Reactor Internals & Agitators": {
            "href": "/systems/chemical-reactor-internals-agitators/"
          },
          "Chip Management & Fire Suppression System": {
            "href": "/equipment/chip-management-fire-suppression/"
          },
          "Class 10 cleanroom packaging": {
            "href": "/capabilities/class-10-cleanroom-packaging/"
          },
          "Cleaning & packaging (Class 8 cleanroom)": {
            "href": "/capabilities/cleaning--packaging-class-8-cleanroom/"
          },
          "Cleaning & passivation": {
            "href": "/capabilities/cleaning--passivation/"
          },
          "Cleanroom packaging (Class 100)": {
            "href": "/capabilities/cleanroom-packaging-class-100/"
          },
          "Closed-die forging": {
            "href": "/capabilities/closed-die-forging/"
          },
          "CMM alignment of hanger interface": {
            "href": "/capabilities/cmm-alignment-of-hanger-interface/"
          },
          "CMM blade profiling": {
            "href": "/capabilities/cmm-blade-profiling/"
          },
          "CMM contour inspection (+-0.2mm)": {
            "href": "/capabilities/cmm-contour-inspection--02mm/"
          },
          "CMM dimensional inspection (+-0.01mm)": {
            "href": "/capabilities/cmm-dimensional-inspection--001mm/"
          },
          "CMM dimensional inspection": {
            "href": "/capabilities/cmm-dimensional-inspection/"
          },
          "CMM dimensional inspection of contact spacing": {
            "href": "/capabilities/cmm-dimensional-inspection-of-contact-spacing/"
          },
          "CMM": {
            "href": "/equipment/cmm/"
          },
          "CMM inspection (+-0.001mm for critical features)": {
            "href": "/capabilities/cmm-inspection--0001mm-for-critical-features/"
          },
          "CMM inspection": {
            "href": "/capabilities/cmm-inspection/"
          },
          "CMM tooth profile inspection": {
            "href": "/capabilities/cmm-tooth-profile-inspection/"
          },
          "CMM / vision inspection": {
            "href": "/capabilities/cmm-vision-inspection/"
          },
          "CNC cutting / profile cutting": {
            "href": "/capabilities/cnc-cutting-profile-cutting/"
          },
          "CNC gun drilling + centerless grinding of pivot axles": {
            "href": "/capabilities/cnc-gun-drilling--centerless-grinding-of-pivot-axles/"
          },
          "CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC machining of bores and attachment holes": {
            "href": "/capabilities/cnc-machining-of-bores-and-attachment-holes/"
          },
          "CNC machining of clamping plates and brackets": {
            "href": "/capabilities/cnc-machining-of-clamping-plates-and-brackets/"
          },
          "CNC machining of critical surfaces": {
            "href": "/capabilities/cnc-machining-of-critical-surfaces/"
          },
          "CNC Machining of Fittings & Flanges": {
            "href": "/titanium-cnc-machining-services/"
          },
          "CNC machining of flange faces and bolt holes": {
            "href": "/capabilities/cnc-machining-of-flange-faces-and-bolt-holes/"
          },
          "CNC machining of impeller profiles (5-axis)": {
            "href": "/capabilities/cnc-machining-of-impeller-profiles-5-axis/"
          },
          "CNC machining of mating flanges": {
            "href": "/capabilities/cnc-machining-of-mating-flanges/"
          },
          "CNC machining of ring and frame components": {
            "href": "/capabilities/cnc-machining-of-ring-and-frame-components/"
          },
          "CNC machining of rotor profile/brake track": {
            "href": "/capabilities/cnc-machining-of-rotor-profile-brake-track/"
          },
          "CNC machining of threaded couplings": {
            "href": "/capabilities/cnc-machining-of-threaded-couplings/"
          },
          "CNC machining of thumb-screw clamps and brackets": {
            "href": "/capabilities/cnc-machining-of-thumb-screw-clamps-and-brackets/"
          },
          "CNC machining of tooth profiles": {
            "href": "/capabilities/cnc-machining-of-tooth-profiles/"
          },
          "CNC machining of venturi nozzle profiles": {
            "href": "/capabilities/cnc-machining-of-venturi-nozzle-profiles/"
          },
          "CNC milling + diamond-cut beveling of watch bezels": {
            "href": "/capabilities/cnc-milling--diamond-cut-beveling-of-watch-bezels/"
          },
          "CNC Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC milling from plate (or near-net forging)": {
            "href": "/capabilities/cnc-milling-from-plate-or-near-net-forging/"
          },
          "CNC milling of ergonomic contours": {
            "href": "/capabilities/cnc-milling-of-ergonomic-contours/"
          },
          "CNC milling of face/sole": {
            "href": "/capabilities/cnc-milling-of-face-sole/"
          },
          "CNC milling of lugs and crown guards": {
            "href": "/capabilities/cnc-milling-of-lugs-and-crown-guards/"
          },
          "CNC Milling & Turning": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC milling/turning of brackets and alignment blocks": {
            "href": "/capabilities/cnc-milling-turning-of-brackets-and-alignment-blocks/"
          },
          "CNC milling / turning of susceptor and arms": {
            "href": "/capabilities/cnc-milling-turning-of-susceptor-and-arms/"
          },
          "CNC multi-spindle turning": {
            "href": "/capabilities/cnc-multi-spindle-turning/"
          },
          "CNC pocket milling for weight reduction": {
            "href": "/capabilities/cnc-pocket-milling-for-weight-reduction/"
          },
          "CNC profiling + frame lock milling for folding knives": {
            "href": "/capabilities/cnc-profiling--frame-lock-milling-for-folding-knives/"
          },
          "CNC profiling of impeller blades": {
            "href": "/capabilities/cnc-profiling-of-impeller-blades/"
          },
          "CNC swaging/j-bend forming of spoke ends": {
            "href": "/capabilities/cnc-swaging-j-bend-forming-of-spoke-ends/"
          },
          "CNC tube bending": {
            "href": "/capabilities/cnc-tube-bending/"
          },
          "CNC turning & boring of ID/OD": {
            "href": "/capabilities/cnc-turning--boring-of-id-od/"
          },
          "CNC turning/boring of rings": {
            "href": "/capabilities/cnc-turning-boring-of-rings/"
          },
          "CNC Turning & Mill-Turn": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC Turning & Milling": {
            "href": "/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "CNC turning & milling of housing": {
            "href": "/capabilities/cnc-turning--milling-of-housing/"
          },
          "CNC turning + nodal profile milling of sonotrode": {
            "href": "/capabilities/cnc-turning--nodal-profile-milling-of-sonotrode/"
          },
          "CNC turning of axle/spindle profiles": {
            "href": "/capabilities/cnc-turning-of-axle-spindle-profiles/"
          },
          "CNC turning of bolt heads and threads": {
            "href": "/capabilities/cnc-turning-of-bolt-heads-and-threads/"
          },
          "CNC turning of case profile": {
            "href": "/capabilities/cnc-turning-of-case-profile/"
          },
          "CNC turning of pushrods and droplinks": {
            "href": "/capabilities/cnc-turning-of-pushrods-and-droplinks/"
          },
          "CNC turning of ring profiles and knife-edges": {
            "href": "/capabilities/cnc-turning-of-ring-profiles-and-knife-edges/"
          },
          "CNC turning of valve stems": {
            "href": "/capabilities/cnc-turning-of-valve-stems/"
          },
          "CNC turning of VCR male/female components": {
            "href": "/capabilities/cnc-turning-of-vcr-male-female-components/"
          },
          "Coating (if required)": {
            "href": "/capabilities/coating-if-required/"
          },
          "Cold heading of hex nuts + CNC tapping": {
            "href": "/capabilities/cold-heading-of-hex-nuts--cnc-tapping/"
          },
          "Cold / hot heading forming": {
            "href": "/capabilities/cold-hot-heading-forming/"
          },
          "Collaborative Robot (Cobot) Actuator Housings": {
            "href": "/systems/collaborative-robot-cobot-actuator-housings/"
          },
          "Comprehensive Titanium Manufacturing": {
            "href": "/"
          },
          "Comprehensive Titanium Manufacturing & Processing Services": {
            "href": "/"
          },
          "Concentricity measurement": {
            "href": "/capabilities/concentricity-measurement/"
          },
          "Consumer Electronics": {
            "href": "/industries/consumer-electronics/"
          },
          "Contact resistance measurement (CNT method)": {
            "href": "/capabilities/contact-resistance-measurement-cnt-method/"
          },
          "Contact resistance testing": {
            "href": "/capabilities/contact-resistance-testing/"
          },
          "Continuous cold tube pilgering for condenser tubes": {
            "href": "/capabilities/continuous-cold-tube-pilgering-for-condenser-tubes/"
          },
          "Contour inspection (CMM/bluelight)": {
            "href": "/capabilities/contour-inspection-cmm-bluelight/"
          },
          "Coordinate accuracy verification (+-0.1mm)": {
            "href": "/capabilities/coordinate-accuracy-verification--01mm/"
          },
          "Coordinate measurement of fiducial markers": {
            "href": "/capabilities/coordinate-measurement-of-fiducial-markers/"
          },
          "Coordinate Measuring Machine (CMM)": {
            "href": "/equipment/cmm/"
          },
          "Corrosion testing": {
            "href": "/capabilities/corrosion-testing/"
          },
          "Corrosion testing (potentiodynamic)": {
            "href": "/capabilities/corrosion-testing-potentiodynamic/"
          },
          "Creep testing": {
            "href": "/capabilities/creep-testing/"
          },
          "Crimping & loading into delivery system": {
            "href": "/capabilities/crimping--loading-into-delivery-system/"
          },
          "Cryogenic dimensional inspection": {
            "href": "/capabilities/cryogenic-dimensional-inspection/"
          },
          "Cryogenic & LNG Components": {
            "href": "/systems/cryogenic-lng-components/"
          },
          "Cryogenic polishing for medical sonotrodes": {
            "href": "/capabilities/cryogenic-polishing-for-medical-sonotrodes/"
          },
          "Cryogenic proof testing": {
            "href": "/capabilities/cryogenic-proof-testing/"
          },
          "Cryogenic Propellant Tank Hardware": {
            "href": "/systems/cryogenic-propellant-tank-hardware/"
          },
          "Cryogenic testing (-196C)": {
            "href": "/capabilities/cryogenic-testing-196c/"
          },
          "CT scanning (internal defect detection)": {
            "href": "/capabilities/ct-scanning-internal-defect-detection/"
          },
          "Custom fabrication to drawing": {
            "href": "/capabilities/custom-fabrication-to-drawing/"
          },
          "Custom Industrial Components": {
            "href": "/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Cycle testing (200,000 cycles)": {
            "href": "/capabilities/cycle-testing-200000-cycles/"
          },
          "Cycling / Bicycle": {
            "href": "/industries/cycling---bicycle/"
          },
          "Cylindrical / centerless grinding": {
            "href": "/capabilities/cylindrical-centerless-grinding/"
          },
          "Debinding & sintering": {
            "href": "/capabilities/debinding--sintering/"
          },
          "Deburring / edge rounding": {
            "href": "/capabilities/deburring-edge-rounding/"
          },
          "deburring of components": {
            "href": "/products/capabilities/deburring-edge-rounding/"
          },
          "Deep drawing of vacuum flask liners (Grade 1 Ti)": {
            "href": "/capabilities/deep-drawing-of-vacuum-flask-liners-grade-1-ti/"
          },
          "Deep-hole boring of multi-port manifolds": {
            "href": "/capabilities/deep-hole-boring-of-multi-port-manifolds/"
          },
          "Deep hole drilling (tube sheet)": {
            "href": "/capabilities/deep-hole-drilling-tube-sheet/"
          },
          "Deep-hole gun drilling of gas manifold blocks": {
            "href": "/capabilities/deep-hole-gun-drilling-of-gas-manifold-blocks/"
          },
          "Deep-hole gun drilling of pressure housings": {
            "href": "/capabilities/deep-hole-gun-drilling-of-pressure-housings/"
          },
          "Deep-Sea Exploration & ROV/AUV Hardware": {
            "href": "/systems/deep-sea-exploration-rov-auv-hardware/"
          },
          "Deepwater Drilling Risers & Components": {
            "href": "/systems/deepwater-drilling-risers-components/"
          },
          "Dental Implants & Prosthetics": {
            "href": "/systems/dental-implants-prosthetics/"
          },
          "Digital frequency analysis (DFA) tuning to +-50Hz target": {
            "href": "/capabilities/digital-frequency-analysis-dfa-tuning-to--50hz-target/"
          },
          "Dimensional certification": {
            "href": "/capabilities/dimensional-certification/"
          },
          "Dimensional certification of bolt circle patterns": {
            "href": "/capabilities/dimensional-certification-of-bolt-circle-patterns/"
          },
          "Dimensional certification with full traceability": {
            "href": "/capabilities/dimensional-certification-with-full-traceability/"
          },
          "dimensional inspection": {
            "href": "/products/capabilities/100-dimensional-inspection-cmm/"
          },
          "Dimensional inspection of mating surfaces": {
            "href": "/capabilities/dimensional-inspection-of-mating-surfaces/"
          },
          "Dimensional inspection of mounting interfaces": {
            "href": "/capabilities/dimensional-inspection-of-mounting-interfaces/"
          },
          "Dimensional inspection per ASME B16.5/B16.9": {
            "href": "/capabilities/dimensional-inspection-per-asme-b165-b169/"
          },
          "Dimensional inspection per ASME B16.5 / DIN standards": {
            "href": "/capabilities/dimensional-inspection-per-asme-b165-din-standards/"
          },
          "Dimensional sorting": {
            "href": "/capabilities/dimensional-sorting/"
          },
          "DLC coating for wear resistance": {
            "href": "/capabilities/dlc-coating-for-wear-resistance/"
          },
          "DLC coating (wear resistance)": {
            "href": "/capabilities/dlc-coating-wear-resistance/"
          },
          "Drilling of bolt holes with jig": {
            "href": "/capabilities/drilling-of-bolt-holes-with-jig/"
          },
          "Drilling of mounting holes": {
            "href": "/capabilities/drilling-of-mounting-holes/"
          },
          "Drilling / tapping": {
            "href": "/capabilities/drilling-tapping/"
          },
          "Drop impact testing (1.5m onto concrete)": {
            "href": "/capabilities/drop-impact-testing-15m-onto-concrete/"
          },
          "Drop/impact testing of knife lock-up": {
            "href": "/capabilities/drop-impact-testing-of-knife-lock-up/"
          },
          "Drop testing (MIL-STD-810)": {
            "href": "/capabilities/drop-testing-mil-std-810/"
          },
          "Dust ingress testing": {
            "href": "/capabilities/dust-ingress-testing/"
          },
          "Dynamic balancing": {
            "href": "/capabilities/dynamic-balancing/"
          },
          "Dynamic balancing for rotary horns": {
            "href": "/capabilities/dynamic-balancing-for-rotary-horns/"
          },
          "Dynamic balancing test": {
            "href": "/capabilities/dynamic-balancing-test/"
          },
          "EB / laser welding of rib-skin assembly": {
            "href": "/capabilities/eb-laser-welding-of-rib-skin-assembly/"
          },
          "EB welding of hull seams under vacuum": {
            "href": "/capabilities/eb-welding-of-hull-seams-under-vacuum/"
          },
          "Eddy current inspection": {
            "href": "/capabilities/eddy-current-inspection/"
          },
          "Electrical continuity testing": {
            "href": "/capabilities/electrical-continuity-testing/"
          },
          "Electrochemical polishing": {
            "href": "/capabilities/electrochemical-polishing/"
          },
          "Electroplating Anode Baskets & Current Delivery Systems": {
            "href": "/systems/electroplating-anode-baskets-current-delivery-systems/"
          },
          "Electroplating Racks, Jigs & PCB Fixtures": {
            "href": "/systems/electroplating-racks-jigs-pcb-fixtures/"
          },
          "Electroplating & Surface Finishing": {
            "href": "/industries/electroplating-surface-finishing/"
          },
          "Electropolishing + Class 100 ultrasonic cleaning": {
            "href": "/capabilities/electropolishing--class-100-ultrasonic-cleaning/"
          },
          "electropolishing": {
            "href": "/products/capabilities/electropolishing/"
          },
          "Electropolishing of all vacuum-facing surfaces": {
            "href": "/capabilities/electropolishing-of-all-vacuum-facing-surfaces/"
          },
          "Electropolishing of all wetted surfaces": {
            "href": "/capabilities/electropolishing-of-all-wetted-surfaces/"
          },
          "ELI Grade 4 – Low Interstitial Titanium": {
            "href": "/materials/grade-4-eli/"
          },
          "Gas chromatography for hydrogen embrittlement certification (H<125ppm)": {
            "href": "/capabilities/gas-chromatography-for-hydrogen-embrittlement-certification-h125ppm/"
          },
          "PVD color spectrophotometer audit (Delta-E <=1.0)": {
            "href": "/capabilities/pvd-color-spectrophotometer-audit-delta-e-10/"
          },
          "100% dimensional inspection (CMM)": {
            "href": "/capabilities/100-dimensional-inspection-cmm/"
          },
          "Manufacturing Example: UHV Gas Showerhead — 2,400 Micro-Drilled Holes": {
            "href": "/case-studies/semiconductor-uhv-showerhead/"
          },
          "Coaxiality measurement of pivot axles <0.02mm": {
            "href": "/capabilities/coaxiality-measurement-of-pivot-axles-002mm/"
          },
          "Grade 4 – Commercially Pure Titanium": {
            "href": "/materials/grade-4/"
          },
          "Magnetic permeability testing (mu <1.01)": {
            "href": "/capabilities/magnetic-permeability-testing-mu-101/"
          },
          "Fatigue testing (10^6 cycles at 10Nm)": {
            "href": "/capabilities/fatigue-testing-106-cycles-at-10nm/"
          },
          "100% eddy current testing (ECT) of condenser tubes": {
            "href": "/capabilities/100-eddy-current-testing-ect-of-condenser-tubes/"
          },
          "Grade 9 – Ti-3Al-2.5V Titanium Alloy": {
            "href": "/materials/grade-9/"
          },
          "Grade 21 – Ti-15V-3Cr-3Sn-3Al Beta Alloy": {
            "href": "/materials/grade-21/"
          },
          "Grade 19 – Ti-10V-2Fe-3Al Beta Titanium": {
            "href": "/materials/grade-19/"
          },
          "Manufacturing Example: Grade 23 ELI Bone Screws — Zero-Contamination": {
            "href": "/case-studies/medical-bone-screws/"
          },
          "Grade 1 – Commercially Pure Titanium": {
            "href": "/materials/grade-1/"
          },
          "Fatigue testing 10^5 cycles": {
            "href": "/capabilities/fatigue-testing-105-cycles/"
          },
          "Helium leak testing (1x10^-10 mbar.L/s)": {
            "href": "/capabilities/helium-leak-testing-1x10-10-mbarl-s/"
          },
          "Helium leak testing of hydrogen components (1x10^-9 mbar.L/s)": {
            "href": "/capabilities/helium-leak-testing-of-hydrogen-components-1x10-9-mbarl-s/"
          },
          "100% crack detection": {
            "href": "/capabilities/100-crack-detection/"
          },
          "Grade 3 – Commercially Pure Titanium": {
            "href": "/materials/grade-3/"
          },
          "Grade 6242 – Ti-6Al-2Sn-4Zr-2Mo Aerospace Ti": {
            "href": "/materials/grade-6242/"
          },
          "PVD coating with closed-loop gas mass-flow (Delta-E <=1.0)": {
            "href": "/capabilities/pvd-coating-with-closed-loop-gas-mass-flow-delta-e-10/"
          },
          "Helium leak testing (1x10^-9 mbar.L/s)": {
            "href": "/capabilities/helium-leak-testing-1x10-9-mbarl-s/"
          },
          "Grade 6 – Ti-5Al-2.5Sn Titanium Alloy": {
            "href": "/materials/grade-6/"
          },
          "Axle bending fatigue testing 10^6 cycles": {
            "href": "/capabilities/axle-bending-fatigue-testing-106-cycles/"
          },
          "Surface roughness measurement (Ra<0.05um on knife-edge)": {
            "href": "/capabilities/surface-roughness-measurement-ra005um-on-knife-edge/"
          },
          "Surface roughness inspection (Ra<0.2um)": {
            "href": "/capabilities/surface-roughness-inspection-ra02um/"
          },
          "Weld color inspection (silver/gold acceptable; blue/purple = contamination)": {
            "href": "/capabilities/weld-color-inspection-silver-gold-acceptable-blue-purple--contamination/"
          },
          "Surface roughness measurement (Ra<0.4um)": {
            "href": "/capabilities/surface-roughness-measurement-ra04um/"
          },
          "Surface roughness measurement (Ra<0.8um)": {
            "href": "/capabilities/surface-roughness-measurement-ra08um/"
          },
          "Grade 5 – Ti-6Al-4V Titanium Alloy": {
            "href": "/materials/grade-5/"
          },
          "Water contact angle measurement (>110 deg)": {
            "href": "/capabilities/water-contact-angle-measurement-110-deg/"
          },
          "Grade 23 – Ti-6Al-4V ELI Medical Titanium": {
            "href": "/materials/grade-23/"
          },
          "Manufacturing Example: Thin-Wall Titanium Aerospace Housing": {
            "href": "/case-studies/aerospace-thin-wall-housing/"
          },
          "Ti-6211 – Ti-6Al-2Nb-1Ta-0.8Mo Marine Grade Titanium": {
            "href": "/materials/ti-6211/"
          },
          "Magnetic permeability test (mu <1.00001)": {
            "href": "/capabilities/magnetic-permeability-test-mu-100001/"
          },
          "Grade 2 – Commercially Pure Titanium": {
            "href": "/materials/grade-2/"
          },
          "End forming / flaring": {
            "href": "/capabilities/end-forming-flaring/"
          },
          "Energy": {
            "href": "/industries/energy/"
          },
          "Engine Valve Train Components (Spring Retainers & Keepers)": {
            "href": "/systems/engine-valve-train-components-spring-retainers-keepers/"
          },
          "Environmental Engineering": {
            "href": "/industries/environmental-engineering/"
          },
          "Expanded metal mesh production": {
            "href": "/capabilities/expanded-metal-mesh-production/"
          },
          "Fasteners": {
            "href": "/systems/fasteners/"
          },
          "Fatigue testing (accelerated 400M cycles)": {
            "href": "/capabilities/fatigue-testing-accelerated-400m-cycles/"
          },
          "Fatigue testing": {
            "href": "/capabilities/fatigue-testing/"
          },
          "Fatigue testing of release mechanisms (1000+ cycles)": {
            "href": "/capabilities/fatigue-testing-of-release-mechanisms-1000-cycles/"
          },
          "Fatigue testing (sprint load simulation)": {
            "href": "/capabilities/fatigue-testing-sprint-load-simulation/"
          },
          "Field durability testing (customer-specified)": {
            "href": "/capabilities/field-durability-testing-customer-specified/"
          },
          "Flavor leaching test (ISO 10304 for metal ions)": {
            "href": "/capabilities/flavor-leaching-test-iso-10304-for-metal-ions/"
          },
          "Flow rate testing of eductors": {
            "href": "/capabilities/flow-rate-testing-of-eductors/"
          },
          "Flow testing (cooled blades)": {
            "href": "/capabilities/flow-testing-cooled-blades/"
          },
          "Flow testing": {
            "href": "/capabilities/flow-testing/"
          },
          "Fluorescent penetrant inspection (FPI)": {
            "href": "/capabilities/fluorescent-penetrant-inspection-fpi/"
          },
          "Foldable Phone Hinge & Fold Mechanisms": {
            "href": "/systems/foldable-phone-hinge-fold-mechanisms/"
          },
          "Folding cycle test (200k+ cycles for hinges)": {
            "href": "/capabilities/folding-cycle-test-200k-cycles-for-hinges/"
          },
          "Forged rod tapering + tip forming for tent stakes": {
            "href": "/capabilities/forged-rod-tapering--tip-forming-for-tent-stakes/"
          },
          "Forming & Bending": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "FPI (fluorescent penetrant inspection)": {
            "href": "/capabilities/fpi-fluorescent-penetrant-inspection/"
          },
          "Full-length UT inspection": {
            "href": "/capabilities/full-length-ut-inspection/"
          },
          "Full-scale tension testing": {
            "href": "/capabilities/full-scale-tension-testing/"
          },
          "Full UT wall thickness verification": {
            "href": "/capabilities/full-ut-wall-thickness-verification/"
          },
          "Function testing": {
            "href": "/capabilities/function-testing/"
          },
          "Gamma-TiAl (Ti-48Al-2Cr-2Nb)": {
            "href": "/materials/gamma-tial-ti-48al-2cr-2nb/"
          },
          "General Industrial": {
            "href": "/industries/general-industrial/"
          },
          "Grade 1 CP-Ti": {
            "href": "/materials/grade-1-cp-ti/"
          },
          "Grade 1 Titanium": {
            "href": "/materials/grade-1/"
          },
          "Grade 12 Ti-0.3Mo-0.8Ni": {
            "href": "/materials/grade-12-ti-03mo-08ni/"
          },
          "Grade 2 CP-Ti": {
            "href": "/materials/grade-2-cp-ti/"
          },
          "Grade 2 Titanium": {
            "href": "/materials/grade-2/"
          },
          "Grade 23 Ti-6Al-4V ELI": {
            "href": "/materials/grade-23-ti-6al-4v-eli/"
          },
          "Grade 23 Titanium": {
            "href": "/materials/grade-23/"
          },
          "Grade 3 CP-Ti": {
            "href": "/materials/grade-3-cp-ti/"
          },
          "Grade 4 CP-Ti": {
            "href": "/materials/grade-4-cp-ti/"
          },
          "Grade 5 Ti-6Al-4V": {
            "href": "/materials/grade-5-ti-6al-4v/"
          },
          "Grade 5 Titanium": {
            "href": "/materials/grade-5/"
          },
          "Grade 7 Ti-0.15Pd": {
            "href": "/materials/grade-7-ti-015pd/"
          },
          "Grade 9 Ti-3Al-2.5V": {
            "href": "/materials/grade-9-ti-3al-25v/"
          },
          "Grade 9 Titanium": {
            "href": "/materials/grade-9/"
          },
          "Gun-drilling of intramedullary nails + cannulated screws": {
            "href": "/capabilities/gun-drilling-of-intramedullary-nails--cannulated-screws/"
          },
          "Hardness testing": {
            "href": "/capabilities/hardness-testing/"
          },
          "Hardness testing (HRB/HRC) of washers": {
            "href": "/capabilities/hardness-testing-hrb-hrc-of-washers/"
          },
          "Hardness testing (HRC)": {
            "href": "/capabilities/hardness-testing-hrc/"
          },
          "Heat Exchangers / Piping Systems": {
            "href": "/systems/heat-exchangers--piping-systems/"
          },
          "Heat transfer verification": {
            "href": "/capabilities/heat-transfer-verification/"
          },
          "Heat treatment": {
            "href": "/capabilities/heat-treatment/"
          },
          "Heat Treatment Fixtures & Racks": {
            "href": "/systems/heat-treatment-fixtures-racks/"
          },
          "Heat treatment (STA)": {
            "href": "/capabilities/heat-treatment-sta/"
          },
          "Heat treatment to optimize hardness": {
            "href": "/capabilities/heat-treatment-to-optimize-hardness/"
          },
          "Helium leak detection": {
            "href": "/capabilities/helium-leak-detection/"
          },
          "Helium leak testing": {
            "href": "/capabilities/helium-leak-testing/"
          },
          "Helium leak testing of electronic canisters": {
            "href": "/capabilities/helium-leak-testing-of-electronic-canisters/"
          },
          "Helium mass spectrometer leak test": {
            "href": "/capabilities/helium-mass-spectrometer-leak-test/"
          },
          "High-End Outdoor & Adventure Gear": {
            "href": "/systems/high-end-outdoor-adventure-gear/"
          },
          "High-precision grinding": {
            "href": "/capabilities/high-precision-grinding/"
          },
          "High-temperature Oxidation Protective Coating": {
            "href": "/capabilities/high-temperature/"
          },
          "High-temperature wind tunnel testing": {
            "href": "/capabilities/high-temperature-wind-tunnel-testing/"
          },
          "HIP densification": {
            "href": "/capabilities/hip-densification/"
          },
          "Hot forging + thread rolling of all rotor & caliper bolts": {
            "href": "/capabilities/hot-forging--thread-rolling-of-all-rotor--caliper-bolts/"
          },
          "Hot forging + thread rolling of linkage bolts": {
            "href": "/capabilities/hot-forging--thread-rolling-of-linkage-bolts/"
          },
          "Hot forging + vacuum annealing of valve stems and bolts": {
            "href": "/capabilities/hot-forging--vacuum-annealing-of-valve-stems-and-bolts/"
          },
          "Hot forming of curved panels": {
            "href": "/capabilities/hot-forming-of-curved-panels/"
          },
          "Hot forming of seamless tube into elbows/tees": {
            "href": "/capabilities/hot-forming-of-seamless-tube-into-elbows-tees/"
          },
          "Hot forming of skin panels": {
            "href": "/capabilities/hot-forming-of-skin-panels/"
          },
          "Hot heading + vacuum aging of beta hub bolts": {
            "href": "/capabilities/hot-heading--vacuum-aging-of-beta-hub-bolts/"
          },
          "Hot isostatic pressing (HIP)": {
            "href": "/capabilities/hot-isostatic-pressing-hip/"
          },
          "Housings / Chambers / Enclosures": {
            "href": "/systems/housings--chambers--enclosures/"
          },
          "Hydraulic pressure testing of tie rods": {
            "href": "/capabilities/hydraulic-pressure-testing-of-tie-rods/"
          },
          "Hydrostatic burst testing": {
            "href": "/capabilities/hydrostatic-burst-testing/"
          },
          "Hydrostatic pressure testing": {
            "href": "/capabilities/hydrostatic-pressure-testing/"
          },
          "Hydrostatic pressure testing of coils": {
            "href": "/capabilities/hydrostatic-pressure-testing-of-coils/"
          },
          "Hydrostatic pressure testing of flanged assemblies": {
            "href": "/capabilities/hydrostatic-pressure-testing-of-flanged-assemblies/"
          },
          "Hydrostatic pressure testing to 1.25x rated depth": {
            "href": "/capabilities/hydrostatic-pressure-testing-to-125x-rated-depth/"
          },
          "Hydrostatic pressure testing to 1.5x rated pressure": {
            "href": "/capabilities/hydrostatic-pressure-testing-to-15x-rated-pressure/"
          },
          "Hydrostatic proof testing": {
            "href": "/capabilities/hydrostatic-proof-testing/"
          },
          "Hydrostatic test": {
            "href": "/capabilities/hydrostatic-test/"
          },
          "Hydrostatic testing": {
            "href": "/capabilities/hydrostatic-testing/"
          },
          "Hypersonic Vehicle Control Surfaces": {
            "href": "/systems/hypersonic-vehicle-control-surfaces/"
          },
          "Impact testing at cryogenic temperature": {
            "href": "/capabilities/impact-testing-at-cryogenic-temperature/"
          },
          "Impedance / frequency analysis": {
            "href": "/capabilities/impedance-frequency-analysis/"
          },
          "Impeller dynamic balancing": {
            "href": "/capabilities/impeller-dynamic-balancing/"
          },
          "Impellers / Blades (Rotational)": {
            "href": "/systems/impellers--blades-rotational/"
          },
          "Industrial Standard Fasteners, Flanges & Hardware": {
            "href": "/systems/industrial-standard-fasteners-flanges-hardware/"
          },
          "Investment casting (alternative)": {
            "href": "/capabilities/investment-casting-alternative/"
          },
          "Investment casting": {
            "href": "/capabilities/investment-casting/"
          },
          "ISO 13485": {
            "href": "/capabilities/"
          },
          "ISO 5832-11": {
            "href": "/titanium-standards/iso-5832-11/"
          },
          "ISO 5832-3": {
            "href": "/titanium-standards/iso-5832-3/"
          },
          "ISO 9001": {
            "href": "/capabilities/"
          },
          "Isothermal die forging": {
            "href": "/capabilities/isothermal-die-forging/"
          },
          "ITAR": {
            "href": "/capabilities/"
          },
          "Keyway broaching": {
            "href": "/capabilities/keyway-broaching/"
          },
          "Kink resistance testing": {
            "href": "/capabilities/kink-resistance-testing/"
          },
          "Knife-edge profile inspection (optical microscopy)": {
            "href": "/capabilities/knife-edge-profile-inspection-optical-microscopy/"
          },
          "Landing Gear Structural Components": {
            "href": "/systems/landing-gear-structural-components/"
          },
          "Laser cutting + die stamping of crampon spikes": {
            "href": "/capabilities/laser-cutting--die-stamping-of-crampon-spikes/"
          },
          "Laser Cutting": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser cutting of port holes": {
            "href": "/capabilities/laser-cutting-of-port-holes/"
          },
          "Laser Cutting (Sheet": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser Cutting (Sheet & Tube)": {
            "href": "/titanium-fabrication-services/laser-cutting/"
          },
          "Laser engraving (marking)": {
            "href": "/capabilities/laser-engraving-marking/"
          },
          "Laser marking": {
            "href": "/capabilities/laser-marking/"
          },
          "Laser marking (traceability code)": {
            "href": "/capabilities/laser-marking-traceability-code/"
          },
          "Laser marking (UDI code)": {
            "href": "/capabilities/laser-marking-udi-code/"
          },
          "Laser micro-cutting of tube": {
            "href": "/capabilities/laser-micro-cutting-of-tube/"
          },
          "Laser micro-drilling of orifice disks": {
            "href": "/capabilities/laser-micro-drilling-of-orifice-disks/"
          },
          "Laser or waterjet cutting of perforated bottom plates": {
            "href": "/capabilities/laser-or-waterjet-cutting-of-perforated-bottom-plates/"
          },
          "Laser/perforation drilling of sparger pipes": {
            "href": "/capabilities/laser-perforation-drilling-of-sparger-pipes/"
          },
          "Laser / plasma cutting of plate": {
            "href": "/capabilities/laser-plasma-cutting-of-plate/"
          },
          "Laser Tracker / 3D Scanner": {
            "href": "/equipment/laser-tracker-3d-scanner/"
          },
          "Laser / waterjet cutting": {
            "href": "/capabilities/laser-waterjet-cutting/"
          },
          "laser welding titanium": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Left/right hand thread rolling on multi-axis roller": {
            "href": "/capabilities/left-right-hand-thread-rolling-on-multi-axis-roller/"
          },
          "Load testing of hooks and welds": {
            "href": "/capabilities/load-testing-of-hooks-and-welds/"
          },
          "Low-Pressure Turbine Blades (Gamma-TiAl)": {
            "href": "/systems/low-pressure-turbine-blades-gamma-tial/"
          },
          "Low-Volume Production": {
            "href": "/titanium-additive-manufacturing/low-volume-production/"
          },
          "LPBF 3D printing of porous fusion cages": {
            "href": "/capabilities/lpbf-3d-printing-of-porous-fusion-cages/"
          },
          "Magnetic field testing": {
            "href": "/capabilities/magnetic-field-testing/"
          },
          "Magnetic particle inspection (MPI)": {
            "href": "/capabilities/magnetic-particle-inspection-mpi/"
          },
          "Magnetic particle inspection (MPI) of all threaded parts": {
            "href": "/capabilities/magnetic-particle-inspection-mpi-of-all-threaded-parts/"
          },
          "Magnetic permeability testing": {
            "href": "/capabilities/magnetic-permeability-testing/"
          },
          "Marine & Offshore": {
            "href": "/industries/marine/"
          },
          "Marine Propellers & Shafting": {
            "href": "/systems/marine-propellers-shafting/"
          },
          "marine titanium components": {
            "href": "/industries/marine/"
          },
          "Material certification": {
            "href": "/capabilities/material-certification/"
          },
          "Material certification (EN 10204 3.1)": {
            "href": "/capabilities/material-certification-en-10204-31/"
          },
          "Material certification (EN 10204 3.1 / MTR)": {
            "href": "/capabilities/material-certification-en-10204-31-mtr/"
          },
          "Material traceability per NASA SP-R-0022": {
            "href": "/capabilities/material-traceability-per-nasa-sp-r-0022/"
          },
          "Mechanical testing per ASTM F543 (screw torque)": {
            "href": "/capabilities/mechanical-testing-per-astm-f543-screw-torque/"
          },
          "Medical Device": {
            "href": "/industries/medical/"
          },
          "medical implants": {
            "href": "/industries/medical/"
          },
          "Metal injection molding (MIM)": {
            "href": "/capabilities/metal-injection-molding-mim/"
          },
          "Metal injection molding (MIM) of foldable hinges": {
            "href": "/capabilities/metal-injection-molding-mim-of-foldable-hinges/"
          },
          "Metallographic evaluation": {
            "href": "/capabilities/metallographic-evaluation/"
          },
          "Micro-CT of flame arrestor pore structure": {
            "href": "/capabilities/micro-ct-of-flame-arrestor-pore-structure/"
          },
          "MIL-T-9047": {
            "href": "/titanium-standards/mil-t-9047/"
          },
          "Mirror polishing of piston thermal barrier faces": {
            "href": "/capabilities/mirror-polishing-of-piston-thermal-barrier-faces/"
          },
          "Missile & Rocket Motor Hardware": {
            "href": "/systems/missile-rocket-motor-hardware/"
          },
          "MOCVD Wafer Susceptor & Support Hardware": {
            "href": "/systems/mocvd-wafer-susceptor-support-hardware/"
          },
          "MPI of threads": {
            "href": "/capabilities/mpi-of-threads/"
          },
          "MRI artifact testing (3T phantom)": {
            "href": "/capabilities/mri-artifact-testing-3t-phantom/"
          },
          "MRI-Compatible Cranial Fixation & Stereotactic Frames": {
            "href": "/systems/mri-compatible-cranial-fixation-stereotactic-frames/"
          },
          "NADCAP": {
            "href": "/capabilities/"
          },
          "Neuro-Interventional Guidewires & Catheters": {
            "href": "/systems/neuro-interventional-guidewires-catheters/"
          },
          "Nitinol (Ni-Ti Shape Memory Alloy)": {
            "href": "/materials/nitinol-ni-ti-shape-memory-alloy/"
          },
          "Nuclear Power & Hydrogen Energy Infrastructure": {
            "href": "/systems/nuclear-power-hydrogen-energy-infrastructure/"
          },
          "Oleophobic nano-coating via electron beam evaporation": {
            "href": "/capabilities/oleophobic-nano-coating-via-electron-beam-evaporation/"
          },
          "Outgassing rate measurement (ASTM E595)": {
            "href": "/capabilities/outgassing-rate-measurement-astm-e595/"
          },
          "Outgassing test (ASTM E595)": {
            "href": "/capabilities/outgassing-test-astm-e595/"
          },
          "Oxidation testing": {
            "href": "/capabilities/oxidation-testing/"
          },
          "Particle count certification": {
            "href": "/capabilities/particle-count-certification/"
          },
          "Particle count testing": {
            "href": "/capabilities/particle-count-testing/"
          },
          "Passivation (ASTM F86)": {
            "href": "/capabilities/passivation-astm-f86/"
          },
          "Passivation + Class 10,000 cleanroom ultrasonic wash": {
            "href": "/capabilities/passivation--class-10000-cleanroom-ultrasonic-wash/"
          },
          "Passivation + Class 10 cleanroom assembly": {
            "href": "/capabilities/passivation--class-10-cleanroom-assembly/"
          },
          "Passivation & cleaning": {
            "href": "/capabilities/passivation--cleaning/"
          },
          "Passivation": {
            "href": "/capabilities/passivation/"
          },
          "PEM Electrolyzer Bipolar Plates": {
            "href": "/systems/pem-electrolyzer-bipolar-plates/"
          },
          "Pickling & passivation": {
            "href": "/capabilities/pickling--passivation/"
          },
          "Pickling to remove oxide scale": {
            "href": "/capabilities/pickling-to-remove-oxide-scale/"
          },
          "Pipe Spool Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Plasma Chamber Liners, Shields & Thermal Hardware": {
            "href": "/systems/plasma-chamber-liners-shields-thermal-hardware/"
          },
          "Plasma erosion testing (customer-specified recipe)": {
            "href": "/capabilities/plasma-erosion-testing-customer-specified-recipe/"
          },
          "Plate laser cutting + CNC drilling of flange bolt holes": {
            "href": "/capabilities/plate-laser-cutting--cnc-drilling-of-flange-bolt-holes/"
          },
          "PMI (positive material identification) verification": {
            "href": "/capabilities/pmi-positive-material-identification-verification/"
          },
          "PMI verification of all material": {
            "href": "/capabilities/pmi-verification-of-all-material/"
          },
          "Polishing": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polishing & Sandblasting": {
            "href": "/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Porosity testing of sintered filters (bubble point test)": {
            "href": "/capabilities/porosity-testing-of-sintered-filters-bubble-point-test/"
          },
          "Powder characterization": {
            "href": "/capabilities/powder-characterization/"
          },
          "Powder compaction + sintering for porous filter elements": {
            "href": "/capabilities/powder-compaction--sintering-for-porous-filter-elements/"
          },
          "Powder sintering of flame arrestor porous disks": {
            "href": "/capabilities/powder-sintering-of-flame-arrestor-porous-disks/"
          },
          "Precision boring of bearing journals": {
            "href": "/capabilities/precision-boring-of-bearing-journals/"
          },
          "Precision boring of wafer pockets": {
            "href": "/capabilities/precision-boring-of-wafer-pockets/"
          },
          "Precision chemical micro-etching of earbud grilles": {
            "href": "/capabilities/precision-chemical-micro-etching-of-earbud-grilles/"
          },
          "Precision CNC Machining": {
            "href": "/titanium-cnc-machining-services/"
          },
          "Precision drilling of gas holes": {
            "href": "/capabilities/precision-drilling-of-gas-holes/"
          },
          "Precision drilling of pin guides": {
            "href": "/capabilities/precision-drilling-of-pin-guides/"
          },
          "Precision end grinding": {
            "href": "/capabilities/precision-end-grinding/"
          },
          "Precision forging": {
            "href": "/capabilities/precision-forging/"
          },
          "Precision grinding of root form": {
            "href": "/capabilities/precision-grinding-of-root-form/"
          },
          "Precision honing of bearing surface": {
            "href": "/capabilities/precision-honing-of-bearing-surface/"
          },
          "Precision Instrumentation & Optical Metrology Components": {
            "href": "/systems/precision-instrumentation-optical-metrology-components/"
          },
          "Precision stamping + vibratory deburring of flat/lock washers": {
            "href": "/capabilities/precision-stamping--vibratory-deburring-of-flat-lock-washers/"
          },
          "Precision turning of caliper piston Ti-inserts": {
            "href": "/capabilities/precision-turning-of-caliper-piston-ti-inserts/"
          },
          "Premium Consumer Electronics & Wearables": {
            "href": "/systems/premium-consumer-electronics-wearables/"
          },
          "Pressure test": {
            "href": "/capabilities/pressure-test/"
          },
          "Pressure testing": {
            "href": "/capabilities/pressure-testing/"
          },
          "Pressure testing of banjo bolt assemblies": {
            "href": "/capabilities/pressure-testing-of-banjo-bolt-assemblies/"
          },
          "Pressure testing (seal integrity)": {
            "href": "/capabilities/pressure-testing-seal-integrity/"
          },
          "Professional Dive Watch Cases & Components": {
            "href": "/systems/professional-dive-watch-cases-components/"
          },
          "PT/UT inspection": {
            "href": "/capabilities/pt-ut-inspection/"
          },
          "PTFE bonding / insert molding": {
            "href": "/capabilities/ptfe-bonding-insert-molding/"
          },
          "PTFE / hydrophilic coating application": {
            "href": "/capabilities/ptfe-hydrophilic-coating-application/"
          },
          "PVD coating (Pt or Au)": {
            "href": "/capabilities/pvd-coating-pt-or-au/"
          },
          "PVD / DLC coating": {
            "href": "/capabilities/pvd-dlc-coating/"
          },
          "Racing Suspension Rods, Linkages & Hardware": {
            "href": "/systems/racing-suspension-rods-linkages-hardware/"
          },
          "Radial force testing": {
            "href": "/capabilities/radial-force-testing/"
          },
          "Rapid Prototyping": {
            "href": "/nl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Raw Material Preparation": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Raw Material Preparation & Sizing": {
            "href": "/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "RFQ": {
            "href": "/rfq/"
          },
          "Ring rolling / forging": {
            "href": "/capabilities/ring-rolling-forging/"
          },
          "Robotic Loading / Pallet System": {
            "href": "/equipment/robotic-pallet-system/"
          },
          "Saddle rail compression testing 200kg": {
            "href": "/capabilities/saddle-rail-compression-testing-200kg/"
          },
          "Salt spray corrosion testing (1000h ASTM B117)": {
            "href": "/capabilities/salt-spray-corrosion-testing-1000h-astm-b117/"
          },
          "Salt spray corrosion testing 100h ASTM B117": {
            "href": "/capabilities/salt-spray-corrosion-testing-100h-astm-b117/"
          },
          "Salt spray corrosion testing ASTM B117": {
            "href": "/capabilities/salt-spray-corrosion-testing-astm-b117/"
          },
          "Salt spray corrosion testing": {
            "href": "/capabilities/salt-spray-corrosion-testing/"
          },
          "Seal face grinding/lapping": {
            "href": "/capabilities/seal-face-grinding-lapping/"
          },
          "Seamless tube bending for backpack frames": {
            "href": "/capabilities/seamless-tube-bending-for-backpack-frames/"
          },
          "Semiconductor": {
            "href": "/industries/semiconductor/"
          },
          "Semiconductor Process Chamber Components": {
            "href": "/systems/semiconductor-process-chamber-components/"
          },
          "semiconductor titanium components": {
            "href": "/industries/semiconductor/"
          },
          "Semiconductor Vacuum Chamber Structural Hardware": {
            "href": "/systems/semiconductor-vacuum-chamber-structural-hardware/"
          },
          "Shape-setting heat treatment": {
            "href": "/capabilities/shape-setting-heat-treatment/"
          },
          "Shape-setting of distal tip": {
            "href": "/capabilities/shape-setting-of-distal-tip/"
          },
          "Shear strength testing of rotor bolts": {
            "href": "/capabilities/shear-strength-testing-of-rotor-bolts/"
          },
          "Sheet metal fabrication of demister frame grids": {
            "href": "/capabilities/sheet-metal-fabrication-of-demister-frame-grids/"
          },
          "Sheet metal stamp-bending + spot TIG welding of rain cap flappers": {
            "href": "/capabilities/sheet-metal-stamp-bending--spot-tig-welding-of-rain-cap-flappers/"
          },
          "Sheet stamping / chemical etching of flow fields": {
            "href": "/capabilities/sheet-stamping-chemical-etching-of-flow-fields/"
          },
          "Shell and channel welding": {
            "href": "/capabilities/shell-and-channel-welding/"
          },
          "Shot peening": {
            "href": "/capabilities/shot-peening/"
          },
          "Single-point diamond turning of sealing surfaces": {
            "href": "/capabilities/single-point-diamond-turning-of-sealing-surfaces/"
          },
          "SLM 3D printing of complex pod geometries": {
            "href": "/capabilities/slm-3d-printing-of-complex-pod-geometries/"
          },
          "SLM 3D printing of custom stem/adapter bodies": {
            "href": "/capabilities/slm-3d-printing-of-custom-stem-adapter-bodies/"
          },
          "SLM 3D printing of flat-mount brake adapters": {
            "href": "/capabilities/slm-3d-printing-of-flat-mount-brake-adapters/"
          },
          "SLM 3D printing of flex-stay plates with argon shielding": {
            "href": "/capabilities/slm-3d-printing-of-flex-stay-plates-with-argon-shielding/"
          },
          "SLM/DMLS printing": {
            "href": "/capabilities/slm-dmls-printing/"
          },
          "SLM": {
            "href": "/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Smartphone Mid-Frame & Structural Chassis": {
            "href": "/systems/smartphone-mid-frame-structural-chassis/"
          },
          "Solution + aging heat treatment": {
            "href": "/capabilities/solution--aging-heat-treatment/"
          },
          "Solution treatment + aging": {
            "href": "/capabilities/solution-treatment--aging/"
          },
          "Spoke tensile testing each to 1200N": {
            "href": "/capabilities/spoke-tensile-testing-each-to-1200n/"
          },
          "Sports & Recreation Equipment": {
            "href": "/systems/sports-recreation-equipment/"
          },
          "Spring-back testing (1000+ cycle test)": {
            "href": "/capabilities/spring-back-testing-1000-cycle-test/"
          },
          "Spring rate testing of shock coils": {
            "href": "/capabilities/spring-rate-testing-of-shock-coils/"
          },
          "Springs / Elastic Elements": {
            "href": "/systems/springs--elastic-elements/"
          },
          "Static & dynamic balancing": {
            "href": "/capabilities/static--dynamic-balancing/"
          },
          "Steel wool abrasion test (5000 cycles)": {
            "href": "/capabilities/steel-wool-abrasion-test-5000-cycles/"
          },
          "Sterile packaging": {
            "href": "/capabilities/sterile-packaging/"
          },
          "Sterilization (EtO)": {
            "href": "/capabilities/sterilization-eto/"
          },
          "Sterilization validation": {
            "href": "/capabilities/sterilization-validation/"
          },
          "Sterilization validation (gamma/EtO)": {
            "href": "/capabilities/sterilization-validation-gamma-eto/"
          },
          "Stiffness sorting": {
            "href": "/capabilities/stiffness-sorting/"
          },
          "Straightening": {
            "href": "/capabilities/straightening/"
          },
          "Stress relief annealing": {
            "href": "/capabilities/stress-relief-annealing/"
          },
          "Stress-relief annealing of spring contacts": {
            "href": "/capabilities/stress-relief-annealing-of-spring-contacts/"
          },
          "Stress relief heat treatment": {
            "href": "/capabilities/stress-relief-heat-treatment/"
          },
          "Sub-zero impact testing (-40C Charpy)": {
            "href": "/capabilities/sub-zero-impact-testing-40c-charpy/"
          },
          "Submarine & Naval Propulsion Components": {
            "href": "/systems/submarine-naval-propulsion-components/"
          },
          "Superplastic forming of spherical hull segments": {
            "href": "/capabilities/superplastic-forming-of-spherical-hull-segments/"
          },
          "Support removal (EDM/machining)": {
            "href": "/capabilities/support-removal-edm-machining/"
          },
          "Surface analysis (SEM)": {
            "href": "/capabilities/surface-analysis-sem/"
          },
          "Surface anodizing (optional)": {
            "href": "/capabilities/surface-anodizing-optional/"
          },
          "Surface anodizing / painting": {
            "href": "/capabilities/surface-anodizing-painting/"
          },
          "Surface anodizing / PVD coating": {
            "href": "/capabilities/surface-anodizing-pvd-coating/"
          },
          "Surface blasting / passivation": {
            "href": "/capabilities/surface-blasting-passivation/"
          },
          "Surface coating": {
            "href": "/capabilities/surface-coating/"
          },
          "Surface coating (if required)": {
            "href": "/capabilities/surface-coating-if-required/"
          },
          "Surface enhancement (shot peening)": {
            "href": "/capabilities/surface-enhancement-shot-peening/"
          },
          "Surface finish measurement": {
            "href": "/capabilities/surface-finish-measurement/"
          },
          "Surface finishing": {
            "href": "/capabilities/surface-finishing/"
          },
          "Surface hardness / scratch testing": {
            "href": "/capabilities/surface-hardness-scratch-testing/"
          },
          "Surface polishing": {
            "href": "/capabilities/surface-polishing/"
          },
          "Surface preparation & painting": {
            "href": "/capabilities/surface-preparation--painting/"
          },
          "Surface roughening / coating": {
            "href": "/capabilities/surface-roughening-coating/"
          },
          "Surface roughness measurement": {
            "href": "/capabilities/surface-roughness-measurement/"
          },
          "Surface roughness measurement of bead-blasted surface (Ra 3-6um)": {
            "href": "/capabilities/surface-roughness-measurement-of-bead-blasted-surface-ra-3-6um/"
          },
          "Surface roughness measurement (Ra 1.0-3.0um for osseointegration)": {
            "href": "/capabilities/surface-roughness-measurement-ra-10-30um-for-osseointegration/"
          },
          "Surface shot peening": {
            "href": "/capabilities/surface-shot-peening/"
          },
          "Surface texturing (SLA/TPS coating)": {
            "href": "/capabilities/surface-texturing-sla-tps-coating/"
          },
          "Surface treatment (anodizing)": {
            "href": "/capabilities/surface-treatment-anodizing/"
          },
          "Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Surgical Instruments": {
            "href": "/systems/surgical-instruments/"
          },
          "Swiss-type automatic turning": {
            "href": "/capabilities/swiss-type-automatic-turning/"
          },
          "Swiss-type precision turning": {
            "href": "/capabilities/swiss-type-precision-turning/"
          },
          "Swiss-type turning of spindles/pins": {
            "href": "/capabilities/swiss-type-turning-of-spindles-pins/"
          },
          "Tank Internals, Heating & Agitation Systems": {
            "href": "/systems/tank-internals-heating-agitation-systems/"
          },
          "Tensile/fracture toughness testing": {
            "href": "/capabilities/tensile-fracture-toughness-testing/"
          },
          "Tensile testing at cryogenic temperature": {
            "href": "/capabilities/tensile-testing-at-cryogenic-temperature/"
          },
          "Tensile testing": {
            "href": "/capabilities/tensile-testing/"
          },
          "Tensile testing per lot": {
            "href": "/capabilities/tensile-testing-per-lot/"
          },
          "Thermal cycling test (-20C to +150C)": {
            "href": "/capabilities/thermal-cycling-test-20c-to-150c/"
          },
          "Thermal imaging (bond line integrity)": {
            "href": "/capabilities/thermal-imaging-bond-line-integrity/"
          },
          "Thermal imaging of brake track": {
            "href": "/capabilities/thermal-imaging-of-brake-track/"
          },
          "Thread cutting/rolling for NPT connections": {
            "href": "/capabilities/thread-cutting-rolling-for-npt-connections/"
          },
          "Thread gauge inspection": {
            "href": "/capabilities/thread-gauge-inspection/"
          },
          "Thread insert installation": {
            "href": "/capabilities/thread-insert-installation/"
          },
          "Thread milling of connector ports": {
            "href": "/capabilities/thread-milling-of-connector-ports/"
          },
          "Thread rolling (all safety-critical bolts)": {
            "href": "/capabilities/thread-rolling-all-safety-critical-bolts/"
          },
          "Thread rolling": {
            "href": "/capabilities/thread-rolling/"
          },
          "Thread rolling / forming": {
            "href": "/capabilities/thread-rolling-forming/"
          },
          "Thread rolling of all fasteners": {
            "href": "/capabilities/thread-rolling-of-all-fasteners/"
          },
          "Thread rolling of pedicle screws (never cut threads)": {
            "href": "/capabilities/thread-rolling-of-pedicle-screws-never-cut-threads/"
          },
          "Thread rolling of stud bolts from STA rod stock": {
            "href": "/capabilities/thread-rolling-of-stud-bolts-from-sta-rod-stock/"
          },
          "Thread rolling of tie rods": {
            "href": "/capabilities/thread-rolling-of-tie-rods/"
          },
          "thread rolling of titanium": {
            "href": "/products/capabilities/thread-rolling/"
          },
          "Thread rolling / whirling": {
            "href": "/capabilities/thread-rolling-whirling/"
          },
          "Through-Spindle High-Pressure Coolant System": {
            "href": "/equipment/high-pressure-coolant/"
          },
          "Ti-1023 (Ti-10V-2Fe-3Al)": {
            "href": "/materials/ti-1023-ti-10v-2fe-3al/"
          },
          "Ti-1100": {
            "href": "/materials/ti-1100/"
          },
          "Ti-15V-3Cr-3Sn-3Al": {
            "href": "/materials/ti-15v-3cr-3sn-3al/"
          },
          "Ti-5Al-2.5Sn ELI": {
            "href": "/materials/ti-5al-25sn-eli/"
          },
          "Ti-5Al-5V-5Mo-3Cr High Strength Titanium": {
            "href": "/materials/ti-5553/"
          },
          "Ti-6242 (Ti-6Al-2Sn-4Zr-2Mo)": {
            "href": "/materials/ti-6242-ti-6al-2sn-4zr-2mo/"
          },
          "Ti-6246 (Ti-6Al-2Sn-4Zr-6Mo)": {
            "href": "/materials/ti-6246-ti-6al-2sn-4zr-6mo/"
          },
          "Ti-65 (Ti-6Al-4Sn-9Zr-1Mo-1W-0.3Si)": {
            "href": "/materials/ti-65-ti-6al-4sn-9zr-1mo-1w-03si/"
          },
          "Ti-6Al-4V ELI": {
            "href": "/materials/grade-23/"
          },
          "Ti-6Al-4V": {
            "href": "/materials/grade-5/"
          },
          "Ti-6Al-7Nb (ASTM F1295)": {
            "href": "/materials/ti-6al-7nb-astm-f1295/"
          },
          "Ti tube bending + welding for bottle cages": {
            "href": "/capabilities/ti-tube-bending--welding-for-bottle-cages/"
          },
          "TIG / EB welding of case sections": {
            "href": "/capabilities/tig-eb-welding-of-case-sections/"
          },
          "TIG (GTAW) Pipe Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "TIG/MIG welding": {
            "href": "/capabilities/tig-mig-welding/"
          },
          "TIG orbital welding": {
            "href": "/capabilities/tig-orbital-welding/"
          },
          "TIG Welding & Fabrication": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "TIG welding of assemblies": {
            "href": "/capabilities/tig-welding-of-assemblies/"
          },
          "TIG welding of basket seams and hooks": {
            "href": "/capabilities/tig-welding-of-basket-seams-and-hooks/"
          },
          "TIG welding of built-up propellers": {
            "href": "/capabilities/tig-welding-of-built-up-propellers/"
          },
          "TIG welding of frame assemblies": {
            "href": "/capabilities/tig-welding-of-frame-assemblies/"
          },
          "TIG welding of shield assemblies (back-side only to avoid weld spatter on plasma face)": {
            "href": "/capabilities/tig-welding-of-shield-assemblies-back-side-only-to-avoid-weld-spatter-on-plasma-face/"
          },
          "TIG welding of tank mounting brackets": {
            "href": "/capabilities/tig-welding-of-tank-mounting-brackets/"
          },
          "Titanium 3D-Printed Ergonomic Mouse": {
            "href": "/products/titanium-3d-printed-ergonomic-mouse/"
          },
          "titanium 3D printing parts": {
            "href": "/titanium-additive-manufacturing/"
          },
          "Titanium Acetabular Cup": {
            "href": "/products/titanium-acetabular-cup/"
          },
          "Titanium Acoustic Waveguide Extension": {
            "href": "/products/titanium-acoustic-waveguide-extension/"
          },
          "Titanium Action Camera Lens Bezel": {
            "href": "/products/titanium-action-camera-lens-bezel/"
          },
          "Titanium Additive Manufacturing": {
            "href": "/titanium-additive-manufacturing/"
          },
          "titanium AI infrastructure components": {
            "href": "/industries/ai-infrastructure/"
          },
          "Titanium Air Sparger Pipe": {
            "href": "/products/titanium-air-sparger-pipe/"
          },
          "Titanium Anode Basket Bottom Plate": {
            "href": "/products/titanium-anode-basket-bottom-plate/"
          },
          "Titanium Anode Basket (Expanded Mesh)": {
            "href": "/products/titanium-anode-basket-expanded-mesh/"
          },
          "Titanium Anode Basket Hook": {
            "href": "/products/titanium-anode-basket-hook/"
          },
          "Titanium Anode Basket Stiffener Rib": {
            "href": "/products/titanium-anode-basket-stiffener-rib/"
          },
          "Titanium Anti-Roll Bar Droplink": {
            "href": "/products/titanium-anti-roll-bar-droplink/"
          },
          "Titanium AUV Propeller Shaft": {
            "href": "/products/titanium-auv-propeller-shaft/"
          },
          "Titanium Ball Valve Stem": {
            "href": "/products/titanium-ball-valve-stem/"
          },
          "Titanium Ballistic Armor Plate": {
            "href": "/products/titanium-ballistic-armor-plate/"
          },
          "Titanium Bell Crank Rocker Arm": {
            "href": "/products/titanium-bell-crank-rocker-arm/"
          },
          "Titanium Bleed Air Duct": {
            "href": "/products/titanium-bleed-air-duct/"
          },
          "Titanium Blind Flange (ASME B16.5)": {
            "href": "/products/titanium-blind-flange-asme-b165/"
          },
          "Titanium Bone Plate": {
            "href": "/products/titanium-bone-plate/"
          },
          "Titanium Bone Screw": {
            "href": "/products/titanium-bone-screw/"
          },
          "Titanium Bottom Bracket Shell": {
            "href": "/products/titanium-bottom-bracket-shell/"
          },
          "Titanium Bottom Bracket Spindle": {
            "href": "/products/titanium-bottom-bracket-spindle/"
          },
          "Titanium Brake Bleed Port Screw": {
            "href": "/products/titanium-brake-bleed-port-screw/"
          },
          "Titanium Brake Caliper Mounting Bolt": {
            "href": "/products/titanium-brake-caliper-mounting-bolt/"
          },
          "Titanium Brake Caliper Piston Insert": {
            "href": "/products/titanium-brake-caliper-piston-insert/"
          },
          "Titanium Brake Lever Pivot Pin": {
            "href": "/products/titanium-brake-lever-pivot-pin/"
          },
          "Titanium Brake Pad Retaining Pin": {
            "href": "/products/titanium-brake-pad-retaining-pin/"
          },
          "Titanium Brake Rotor (Disc)": {
            "href": "/products/titanium-brake-rotor-disc/"
          },
          "Titanium Camber Adjustment Shim": {
            "href": "/products/titanium-camber-adjustment-shim/"
          },
          "Titanium Camera Hot Shoe Mount": {
            "href": "/products/titanium-camera-hot-shoe-mount/"
          },
          "Titanium Camera Lens Filter Ring": {
            "href": "/products/titanium-camera-lens-filter-ring/"
          },
          "Titanium Cardiovascular Stent": {
            "href": "/products/titanium-cardiovascular-stent/"
          },
          "Titanium Cassette Cog": {
            "href": "/products/titanium-cassette-cog/"
          },
          "Titanium Catalyst Basket Mesh Liner": {
            "href": "/products/titanium-catalyst-basket-mesh-liner/"
          },
          "Titanium Centering Ring (KF/ISO)": {
            "href": "/products/titanium-centering-ring-kf-iso/"
          },
          "Titanium Ceramic Heater Clamp Plate": {
            "href": "/products/titanium-ceramic-heater-clamp-plate/"
          },
          "Titanium Chainring Bolt": {
            "href": "/products/titanium-chainring-bolt/"
          },
          "Titanium Chainring": {
            "href": "/products/titanium-chainring/"
          },
          "Titanium Chamber Liner (Upper)": {
            "href": "/products/titanium-chamber-liner-upper/"
          },
          "titanium chemical processing equipment": {
            "href": "/industries/chemical/"
          },
          "Titanium Chlorine Compressor Impeller": {
            "href": "/products/titanium-chlorine-compressor-impeller/"
          },
          "Titanium CNC Machining Services": {
            "href": "/titanium-cnc-machining-services/"
          },
          "titanium CNC parts": {
            "href": "/parts/titanium-cnc-parts/"
          },
          "Titanium Coilover Spring": {
            "href": "/products/titanium-coilover-spring/"
          },
          "titanium components for the energy industry": {
            "href": "/industries/energy/"
          },
          "titanium components for UAVs and drones": {
            "href": "/industries/uav-drones/"
          },
          "Titanium Compressor Blade": {
            "href": "/products/titanium-compressor-blade/"
          },
          "Titanium Compressor Blisk": {
            "href": "/products/titanium-compressor-blisk/"
          },
          "Titanium Compressor Casing Segment": {
            "href": "/products/titanium-compressor-casing-segment/"
          },
          "Titanium Concentric Reducer": {
            "href": "/products/titanium-concentric-reducer/"
          },
          "Titanium Conflat Knife-Edge Ring": {
            "href": "/products/titanium-conflat-knife-edge-ring/"
          },
          "Titanium Connecting Rod": {
            "href": "/products/titanium-connecting-rod/"
          },
          "Titanium Control Rod Seal Housing": {
            "href": "/products/titanium-control-rod-seal-housing/"
          },
          "Titanium Copper-Cored Busbar": {
            "href": "/products/titanium-copper-cored-busbar/"
          },
          "Titanium Cotter Pin (DIN 94)": {
            "href": "/products/titanium-cotter-pin-din-94/"
          },
          "Titanium Countersunk Screw (ISO 10642)": {
            "href": "/products/titanium-countersunk-screw-iso-10642/"
          },
          "Titanium Craniofacial Mesh": {
            "href": "/products/titanium-craniofacial-mesh/"
          },
          "Titanium Cryogenic H2 Flange Bolt": {
            "href": "/products/titanium-cryogenic-h2-flange-bolt/"
          },
          "Titanium Cryogenic Tank Clamp Band": {
            "href": "/products/titanium-cryogenic-tank-clamp-band/"
          },
          "Titanium Deep-Sea Release Hook Pin": {
            "href": "/products/titanium-deep-sea-release-hook-pin/"
          },
          "Titanium Dental Abutment (Angled)": {
            "href": "/products/titanium-dental-abutment-angled/"
          },
          "Titanium Dental Abutment": {
            "href": "/products/titanium-dental-abutment/"
          },
          "Titanium Dental Implant Fixture": {
            "href": "/products/titanium-dental-implant-fixture/"
          },
          "Titanium Derailleur Hanger": {
            "href": "/products/titanium-derailleur-hanger/"
          },
          "Titanium Derailleur Limit Screw": {
            "href": "/products/titanium-derailleur-limit-screw/"
          },
          "Titanium Derailleur Pivot Pin": {
            "href": "/products/titanium-derailleur-pivot-pin/"
          },
          "Titanium Derailleur Pulley": {
            "href": "/products/titanium-derailleur-pulley/"
          },
          "Titanium Disc Brake Rotor Bolt": {
            "href": "/products/titanium-disc-brake-rotor-bolt/"
          },
          "Titanium Dive Watch Case": {
            "href": "/products/titanium-dive-watch-case/"
          },
          "Titanium Dive Watch Crown": {
            "href": "/products/titanium-dive-watch-crown/"
          },
          "Titanium Dosing Pump Impeller": {
            "href": "/products/titanium-dosing-pump-impeller/"
          },
          "Titanium Double Ferrule Back Ring": {
            "href": "/products/titanium-double-ferrule-back-ring/"
          },
          "Titanium Double Ferrule Front Sleeve": {
            "href": "/products/titanium-double-ferrule-front-sleeve/"
          },
          "Titanium Downhole Production Tubing": {
            "href": "/products/titanium-downhole-production-tubing/"
          },
          "Titanium Downhole Wireline Barrel": {
            "href": "/products/titanium-downhole-wireline-barrel/"
          },
          "Titanium ECCS Valve Stem": {
            "href": "/products/titanium-eccs-valve-stem/"
          },
          "Titanium EDC Pen Body": {
            "href": "/products/titanium-edc-pen-body/"
          },
          "Titanium EDC Utility Knife Handle": {
            "href": "/products/titanium-edc-utility-knife-handle/"
          },
          "Titanium Eductor Nozzle": {
            "href": "/products/titanium-eductor-nozzle/"
          },
          "Titanium Embolization Coil Mandrel": {
            "href": "/products/titanium-embolization-coil-mandrel/"
          },
          "Titanium Endoscope Sheath": {
            "href": "/products/titanium-endoscope-sheath/"
          },
          "Titanium Engine Pylon Bracket": {
            "href": "/products/titanium-engine-pylon-bracket/"
          },
          "Titanium Environmental Control Duct": {
            "href": "/products/titanium-environmental-control-duct/"
          },
          "Titanium Equal Tee (ASME B16.9)": {
            "href": "/products/titanium-equal-tee-asme-b169/"
          },
          "Titanium Exhaust Baffle Plate": {
            "href": "/products/titanium-exhaust-baffle-plate/"
          },
          "Titanium Extrusion": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "titanium fabricated parts": {
            "href": "/parts/titanium-fabricated-parts/"
          },
          "Titanium Fabrication Services": {
            "href": "/titanium-fabrication-services/"
          },
          "titanium fasteners": {
            "href": "/products/capabilities/cnc-turning-of-bolt-heads-and-threads/"
          },
          "Titanium Femoral Condyle": {
            "href": "/products/titanium-femoral-condyle/"
          },
          "Titanium Fender Mounting Bolt": {
            "href": "/products/titanium-fender-mounting-bolt/"
          },
          "Titanium Filter Press Tie Rod": {
            "href": "/products/titanium-filter-press-tie-rod/"
          },
          "titanium flanges": {
            "href": "/products/capabilities/cnc-machining-of-mating-flanges/"
          },
          "Titanium Flashlight Body": {
            "href": "/products/titanium-flashlight-body/"
          },
          "Titanium Flat-Mount Brake Adapter": {
            "href": "/products/titanium-flat-mount-brake-adapter/"
          },
          "Titanium Flat Washer (ISO 7089)": {
            "href": "/products/titanium-flat-washer-iso-7089/"
          },
          "Titanium Foldable Phone Hinge": {
            "href": "/products/titanium-foldable-phone-hinge/"
          },
          "Titanium Forging": {
            "href": "/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Fork Air Chamber Top Cap": {
            "href": "/products/titanium-fork-air-chamber-top-cap/"
          },
          "Titanium Forming": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Forming & Heavy Manufacturing": {
            "href": "/titanium-forming-heavy-manufacturing/"
          },
          "Titanium Frame Flip Chip": {
            "href": "/products/titanium-frame-flip-chip/"
          },
          "Titanium Fuel Cell End Plate": {
            "href": "/products/titanium-fuel-cell-end-plate/"
          },
          "Titanium Fuel Pool Rack Spacer": {
            "href": "/products/titanium-fuel-pool-rack-spacer/"
          },
          "Titanium Gas Check Valve Plunger": {
            "href": "/products/titanium-gas-check-valve-plunger/"
          },
          "Titanium Gas Quick-Disconnect Coupler": {
            "href": "/products/titanium-gas-quick-disconnect-coupler/"
          },
          "Titanium Gas Y-Splitter Connector": {
            "href": "/products/titanium-gas-y-splitter-connector/"
          },
          "Titanium Gate Valve Seal Retainer": {
            "href": "/products/titanium-gate-valve-seal-retainer/"
          },
          "Titanium GPS Mount Bolt": {
            "href": "/products/titanium-gps-mount-bolt/"
          },
          "Titanium Handlebar End Plug": {
            "href": "/products/titanium-handlebar-end-plug/"
          },
          "Titanium Handlebar Grip Lock Ring": {
            "href": "/products/titanium-handlebar-grip-lock-ring/"
          },
          "Titanium Headphone Driver Enclosure": {
            "href": "/products/titanium-headphone-driver-enclosure/"
          },
          "Titanium Headset Compression Plug": {
            "href": "/products/titanium-headset-compression-plug/"
          },
          "Titanium Headset Crown Race": {
            "href": "/products/titanium-headset-crown-race/"
          },
          "Titanium Headset Spacer": {
            "href": "/products/titanium-headset-spacer/"
          },
          "Titanium Headset Top Cap Screw": {
            "href": "/products/titanium-headset-top-cap-screw/"
          },
          "Titanium Heat Exchanger Tube Bundle": {
            "href": "/products/titanium-heat-exchanger-tube-bundle/"
          },
          "Titanium Heat Exchanger Tube Sheet": {
            "href": "/products/titanium-heat-exchanger-tube-sheet/"
          },
          "Titanium Helicopter Rotor Hub": {
            "href": "/products/titanium-helicopter-rotor-hub/"
          },
          "Titanium Hex Bolt (ISO 4014)": {
            "href": "/products/titanium-hex-bolt-iso-4014/"
          },
          "Titanium Hex Nut (ISO 4032)": {
            "href": "/products/titanium-hex-nut-iso-4032/"
          },
          "Titanium High-Load Flange Washer": {
            "href": "/products/titanium-high-load-flange-washer/"
          },
          "Titanium Hip Stem": {
            "href": "/products/titanium-hip-stem/"
          },
          "Titanium Hub Bolt (M12)": {
            "href": "/products/titanium-hub-bolt-m12/"
          },
          "Titanium Hub Freehub Body Spline": {
            "href": "/products/titanium-hub-freehub-body-spline/"
          },
          "Titanium Hydraulic Brake Banjo Bolt": {
            "href": "/products/titanium-hydraulic-brake-banjo-bolt/"
          },
          "Titanium Hydrogen Flame Arrestor": {
            "href": "/products/titanium-hydrogen-flame-arrestor/"
          },
          "Titanium Hydrogen Storage Valve Stem": {
            "href": "/products/titanium-hydrogen-storage-valve-stem/"
          },
          "Titanium Hypersonic Control Surface": {
            "href": "/products/titanium-hypersonic-control-surface/"
          },
          "Titanium Immersion Heater Sheath": {
            "href": "/products/titanium-immersion-heater-sheath/"
          },
          "titanium industrial equipment components": {
            "href": "/industries/industrial-equipment/"
          },
          "Titanium Intramedullary Nail": {
            "href": "/products/titanium-intramedullary-nail/"
          },
          "Titanium Ion Implantation Electrode": {
            "href": "/products/titanium-ion-implantation-electrode/"
          },
          "Titanium Key Organizer Screw": {
            "href": "/products/titanium-key-organizer-screw/"
          },
          "Titanium Landing Gear Side Brace": {
            "href": "/products/titanium-landing-gear-side-brace/"
          },
          "Titanium Landing Gear Strut": {
            "href": "/products/titanium-landing-gear-strut/"
          },
          "Titanium Landing Gear Truck Beam": {
            "href": "/products/titanium-landing-gear-truck-beam/"
          },
          "Titanium Laparoscopic Stapler Anvil": {
            "href": "/products/titanium-laparoscopic-stapler-anvil/"
          },
          "Titanium Laptop Hinge Bracket": {
            "href": "/products/titanium-laptop-hinge-bracket/"
          },
          "Titanium Laptop Hinge Shaft": {
            "href": "/products/titanium-laptop-hinge-shaft/"
          },
          "Titanium Launch Canister Rail": {
            "href": "/products/titanium-launch-canister-rail/"
          },
          "Titanium Lens Retaining Ring (Metrology)": {
            "href": "/products/titanium-lens-retaining-ring-metrology/"
          },
          "Titanium Linkage Pivot Bolt": {
            "href": "/products/titanium-linkage-pivot-bolt/"
          },
          "Titanium Liquid Level Float": {
            "href": "/products/titanium-liquid-level-float/"
          },
          "Titanium Lithography Stage Flexure": {
            "href": "/products/titanium-lithography-stage-flexure/"
          },
          "Titanium Long Radius Elbow (ASME B16.9)": {
            "href": "/products/titanium-long-radius-elbow-asme-b169/"
          },
          "Titanium LPT Blade (Gamma-TiAl)": {
            "href": "/products/titanium-lpt-blade-gamma-tial/"
          },
          "Titanium Main Condenser Tube": {
            "href": "/products/titanium-main-condenser-tube/"
          },
          "Titanium Main Pivot Axle": {
            "href": "/products/titanium-main-pivot-axle/"
          },
          "titanium marine parts": {
            "href": "/parts/titanium-marine-parts/"
          },
          "Titanium Mechanical Keyboard Keycap": {
            "href": "/products/titanium-mechanical-keyboard-keycap/"
          },
          "titanium medical components": {
            "href": "/parts/titanium-medical-components/"
          },
          "Titanium Micro-Orifice Restrictor": {
            "href": "/products/titanium-micro-orifice-restrictor/"
          },
          "Titanium Missile Airframe Skin": {
            "href": "/products/titanium-missile-airframe-skin/"
          },
          "Titanium Mist Eliminator Frame": {
            "href": "/products/titanium-mist-eliminator-frame/"
          },
          "Titanium MMO-Coated Substrate Plate": {
            "href": "/products/titanium-mmo-coated-substrate-plate/"
          },
          "Titanium MOCVD Susceptor Support Arm": {
            "href": "/products/titanium-mocvd-susceptor-support-arm/"
          },
          "titanium motorsport parts": {
            "href": "/parts/titanium-motorsport-parts/"
          },
          "Titanium Multi-Port Gas Manifold": {
            "href": "/products/titanium-multi-port-gas-manifold/"
          },
          "Titanium Neuro Guidewire": {
            "href": "/products/titanium-neuro-guidewire/"
          },
          "Titanium Offshore Firewater Nozzle": {
            "href": "/products/titanium-offshore-firewater-nozzle/"
          },
          "Titanium Orifice Plate (Flow Meter)": {
            "href": "/products/titanium-orifice-plate-flow-meter/"
          },
          "Titanium Orthodontic Archwire": {
            "href": "/products/titanium-orthodontic-archwire/"
          },
          "Titanium Pacemaker Enclosure": {
            "href": "/products/titanium-pacemaker-enclosure/"
          },
          "titanium parts": {
            "href": "/parts/"
          },
          "Titanium PCB Edge Grip": {
            "href": "/products/titanium-pcb-edge-grip/"
          },
          "Titanium Pedal Cleat Screw": {
            "href": "/products/titanium-pedal-cleat-screw/"
          },
          "Titanium Pedal Spindle": {
            "href": "/products/titanium-pedal-spindle/"
          },
          "Titanium Pedal Traction Pin": {
            "href": "/products/titanium-pedal-traction-pin/"
          },
          "Titanium PEEK-Insulated Hybrid Bolt": {
            "href": "/products/titanium-peek-insulated-hybrid-bolt/"
          },
          "Titanium PEM Bipolar Plate": {
            "href": "/products/titanium-pem-bipolar-plate/"
          },
          "Titanium PEM Gas Diffusion Layer": {
            "href": "/products/titanium-pem-gas-diffusion-layer/"
          },
          "Titanium Pen Clip": {
            "href": "/products/titanium-pen-clip/"
          },
          "titanium pipe components": {
            "href": "/parts/titanium-pipe-components/"
          },
          "Titanium Pipe U-Bolt": {
            "href": "/products/titanium-pipe-u-bolt/"
          },
          "Titanium Pipeline Repair Sleeve": {
            "href": "/products/titanium-pipeline-repair-sleeve/"
          },
          "Titanium Pivot Bearing Retainer Circlip": {
            "href": "/products/titanium-pivot-bearing-retainer-circlip/"
          },
          "Titanium Pivot Bearing Spacer Sleeve": {
            "href": "/products/titanium-pivot-bearing-spacer-sleeve/"
          },
          "Titanium Plating Crane Lifting Eye": {
            "href": "/products/titanium-plating-crane-lifting-eye/"
          },
          "Titanium Plating Rack Cross Bar": {
            "href": "/products/titanium-plating-rack-cross-bar/"
          },
          "Titanium Plating Rack Spline": {
            "href": "/products/titanium-plating-rack-spline/"
          },
          "Titanium Plating Rack Thumb Screw": {
            "href": "/products/titanium-plating-rack-thumb-screw/"
          },
          "Titanium Pocket Comb": {
            "href": "/products/titanium-pocket-comb/"
          },
          "Titanium Propeller Hub Cap": {
            "href": "/products/titanium-propeller-hub-cap/"
          },
          "Titanium Propeller Pitch Linkage": {
            "href": "/products/titanium-propeller-pitch-linkage/"
          },
          "Titanium Propeller Shaft": {
            "href": "/products/titanium-propeller-shaft/"
          },
          "Titanium Pump Shaft Sleeve": {
            "href": "/products/titanium-pump-shaft-sleeve/"
          },
          "Titanium Quartz Window Retainer": {
            "href": "/products/titanium-quartz-window-retainer/"
          },
          "Titanium Rapid Prototyping": {
            "href": "/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Titanium Reactor Agitator Shaft": {
            "href": "/products/titanium-reactor-agitator-shaft/"
          },
          "Titanium Reactor Impeller Blade": {
            "href": "/products/titanium-reactor-impeller-blade/"
          },
          "Titanium Reactor Lining Plate": {
            "href": "/products/titanium-reactor-lining-plate/"
          },
          "Titanium Rear Shock Coil Spring": {
            "href": "/products/titanium-rear-shock-coil-spring/"
          },
          "Titanium Rear Shock Mounting Bolt": {
            "href": "/products/titanium-rear-shock-mounting-bolt/"
          },
          "Titanium RF Grounding Spring Finger": {
            "href": "/products/titanium-rf-grounding-spring-finger/"
          },
          "Titanium Rocket Motor Case": {
            "href": "/products/titanium-rocket-motor-case/"
          },
          "Titanium ROV Manipulator Knuckle": {
            "href": "/products/titanium-rov-manipulator-knuckle/"
          },
          "Titanium ROV Tether Swivel Joint": {
            "href": "/products/titanium-rov-tether-swivel-joint/"
          },
          "Titanium Saddle Clamp Washer": {
            "href": "/products/titanium-saddle-clamp-washer/"
          },
          "Titanium Saddle Rail Clamp Bolt": {
            "href": "/products/titanium-saddle-rail-clamp-bolt/"
          },
          "Titanium Satellite Deployment Shaft": {
            "href": "/products/titanium-satellite-deployment-shaft/"
          },
          "Titanium Seatpost Collar Bolt": {
            "href": "/products/titanium-seatpost-collar-bolt/"
          },
          "Titanium Seawater Strainer Housing": {
            "href": "/products/titanium-seawater-strainer-housing/"
          },
          "Titanium Segmented Clamping Ring": {
            "href": "/products/titanium-segmented-clamping-ring/"
          },
          "Titanium Serrated Lock Washer": {
            "href": "/products/titanium-serrated-lock-washer/"
          },
          "Titanium Shadow Ring Bracket": {
            "href": "/products/titanium-shadow-ring-bracket/"
          },
          "Titanium Shield Stand-off Bushing": {
            "href": "/products/titanium-shield-stand-off-bushing/"
          },
          "Titanium Shift Lever Clamp Band": {
            "href": "/products/titanium-shift-lever-clamp-band/"
          },
          "Titanium SIM Tray Eject Pin": {
            "href": "/products/titanium-sim-tray-eject-pin/"
          },
          "Titanium Sintered Filter Element": {
            "href": "/products/titanium-sintered-filter-element/"
          },
          "Titanium Slip-On Flange": {
            "href": "/products/titanium-slip-on-flange/"
          },
          "Titanium Slit-Valve Oval Bezel": {
            "href": "/products/titanium-slit-valve-oval-bezel/"
          },
          "Titanium Slit-Valve Protection Shunt": {
            "href": "/products/titanium-slit-valve-protection-shunt/"
          },
          "Titanium Sludge Scraper Blade": {
            "href": "/products/titanium-sludge-scraper-blade/"
          },
          "Titanium Smart Glasses Temple Arm": {
            "href": "/products/titanium-smart-glasses-temple-arm/"
          },
          "Titanium Smartphone Mid-Frame": {
            "href": "/products/titanium-smartphone-mid-frame/"
          },
          "Titanium Smartphone SIM Tray": {
            "href": "/products/titanium-smartphone-sim-tray/"
          },
          "Titanium Smartphone Volume Button": {
            "href": "/products/titanium-smartphone-volume-button/"
          },
          "Titanium Smartwatch Bezel": {
            "href": "/products/titanium-smartwatch-bezel/"
          },
          "Titanium Socket Head Cap Screw (ISO 4762)": {
            "href": "/products/titanium-socket-head-cap-screw-iso-4762/"
          },
          "Titanium Spent Fuel Cask Bolt": {
            "href": "/products/titanium-spent-fuel-cask-bolt/"
          },
          "Titanium Spinal Fixation Rod": {
            "href": "/products/titanium-spinal-fixation-rod/"
          },
          "Titanium Spinal Interbody Cage": {
            "href": "/products/titanium-spinal-interbody-cage/"
          },
          "Titanium Spinal Pedicle Screw": {
            "href": "/products/titanium-spinal-pedicle-screw/"
          },
          "Titanium Split-Ring Quick Flange": {
            "href": "/products/titanium-split-ring-quick-flange/"
          },
          "Titanium Spoke Nipple": {
            "href": "/products/titanium-spoke-nipple/"
          },
          "Titanium Spring Lock Washer (DIN 127)": {
            "href": "/products/titanium-spring-lock-washer-din-127/"
          },
          "Titanium SSD Armor Enclosure": {
            "href": "/products/titanium-ssd-armor-enclosure/"
          },
          "Titanium Steam Generator Nozzle": {
            "href": "/products/titanium-steam-generator-nozzle/"
          },
          "Titanium Steam Heating Coil": {
            "href": "/products/titanium-steam-heating-coil/"
          },
          "Titanium Stem Faceplate Bolt": {
            "href": "/products/titanium-stem-faceplate-bolt/"
          },
          "Titanium Stem Steerer Clamp Bolt": {
            "href": "/products/titanium-stem-steerer-clamp-bolt/"
          },
          "Titanium Stub End (Lap Joint)": {
            "href": "/products/titanium-stub-end-lap-joint/"
          },
          "Titanium Stud Bolt (ASTM A193)": {
            "href": "/products/titanium-stud-bolt-astm-a193/"
          },
          "Titanium Stylus Pen Core Rod": {
            "href": "/products/titanium-stylus-pen-core-rod/"
          },
          "Titanium Submarine Engine Mount Stud": {
            "href": "/products/titanium-submarine-engine-mount-stud/"
          },
          "Titanium Submarine Steering Rudder Pin": {
            "href": "/products/titanium-submarine-steering-rudder-pin/"
          },
          "Titanium Submersible Pressure Hull": {
            "href": "/products/titanium-submersible-pressure-hull/"
          },
          "Titanium Subsea Battery Clamp Ring": {
            "href": "/products/titanium-subsea-battery-clamp-ring/"
          },
          "Titanium Subsea Chemical Injection Mandrel": {
            "href": "/products/titanium-subsea-chemical-injection-mandrel/"
          },
          "Titanium Subsea Manifold Swivel Flange": {
            "href": "/products/titanium-subsea-manifold-swivel-flange/"
          },
          "Titanium Subsea Wellhead Valve Block": {
            "href": "/products/titanium-subsea-wellhead-valve-block/"
          },
          "Titanium Sulfuric Acid Injection Quill": {
            "href": "/products/titanium-sulfuric-acid-injection-quill/"
          },
          "Titanium Surface Treatment": {
            "href": "/titanium-surface-treatment/"
          },
          "Titanium Surgical Forceps": {
            "href": "/products/titanium-surgical-forceps/"
          },
          "Titanium Surgical Retractor Blade": {
            "href": "/products/titanium-surgical-retractor-blade/"
          },
          "Titanium Surgical Scissors Pivot Pin": {
            "href": "/products/titanium-surgical-scissors-pivot-pin/"
          },
          "Titanium Suspension Tie Rod": {
            "href": "/products/titanium-suspension-tie-rod/"
          },
          "Titanium Tank Rim Mounting Bracket": {
            "href": "/products/titanium-tank-rim-mounting-bracket/"
          },
          "Titanium TAVI Frame": {
            "href": "/products/titanium-tavi-frame/"
          },
          "Titanium Thermowell": {
            "href": "/products/titanium-thermowell/"
          },
          "Titanium Threaded Blind Stud (Interior)": {
            "href": "/products/titanium-threaded-blind-stud-interior/"
          },
          "Titanium Threaded NPT Nipple": {
            "href": "/products/titanium-threaded-npt-nipple/"
          },
          "Titanium Threaded Rod (1m)": {
            "href": "/products/titanium-threaded-rod-1m/"
          },
          "Titanium Thru-Axle": {
            "href": "/products/titanium-thru-axle/"
          },
          "Titanium TIG (GTAW) Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Trim Tab Hydraulic Ram End": {
            "href": "/products/titanium-trim-tab-hydraulic-ram-end/"
          },
          "Titanium TWS Earbud Grille": {
            "href": "/products/titanium-tws-earbud-grille/"
          },
          "Titanium U-Bolt": {
            "href": "/products/titanium-u-bolt/"
          },
          "titanium UAV components": {
            "href": "/parts/titanium-uav-components/"
          },
          "Titanium UHP Hydrogen Tube Fitting": {
            "href": "/products/titanium-uhp-hydrogen-tube-fitting/"
          },
          "Titanium Ultrasonic Booster 35kHz": {
            "href": "/products/titanium-ultrasonic-booster-35khz/"
          },
          "Titanium Ultrasonic Connecting Stud": {
            "href": "/products/titanium-ultrasonic-connecting-stud/"
          },
          "Titanium Ultrasonic Food Cutting Blade": {
            "href": "/products/titanium-ultrasonic-food-cutting-blade/"
          },
          "Titanium Ultrasonic Horn 20kHz": {
            "href": "/products/titanium-ultrasonic-horn-20khz/"
          },
          "Titanium Ultrasonic Knurled Insert": {
            "href": "/products/titanium-ultrasonic-knurled-insert/"
          },
          "Titanium Ultrasonic Medical Sonotrode 40kHz": {
            "href": "/products/titanium-ultrasonic-medical-sonotrode-40khz/"
          },
          "Titanium Ultrasonic Nodal Clamp Ring": {
            "href": "/products/titanium-ultrasonic-nodal-clamp-ring/"
          },
          "Titanium Ultrasonic Rotary Horn": {
            "href": "/products/titanium-ultrasonic-rotary-horn/"
          },
          "Titanium Ultrasonic Slot-Patterned Horn": {
            "href": "/products/titanium-ultrasonic-slot-patterned-horn/"
          },
          "Titanium Underwater Camera Housing": {
            "href": "/products/titanium-underwater-camera-housing/"
          },
          "Titanium Upper Wishbone Clevis": {
            "href": "/products/titanium-upper-wishbone-clevis/"
          },
          "Titanium Valve Strainer Basket": {
            "href": "/products/titanium-valve-strainer-basket/"
          },
          "Titanium VCR Female Nut": {
            "href": "/products/titanium-vcr-female-nut/"
          },
          "Titanium VCR Male Gland": {
            "href": "/products/titanium-vcr-male-gland/"
          },
          "Titanium VCR Micro-Gasket": {
            "href": "/products/titanium-vcr-micro-gasket/"
          },
          "Titanium Vented Vacuum Screw": {
            "href": "/products/titanium-vented-vacuum-screw/"
          },
          "Titanium Wafer Handling End-Effector": {
            "href": "/products/titanium-wafer-handling-end-effector/"
          },
          "Titanium Wallet Card Case": {
            "href": "/products/titanium-wallet-card-case/"
          },
          "Titanium Water Bottle Cage Bolt": {
            "href": "/products/titanium-water-bottle-cage-bolt/"
          },
          "Titanium Water Bottle Cage": {
            "href": "/products/titanium-water-bottle-cage/"
          },
          "Titanium Waterjet Impeller": {
            "href": "/products/titanium-waterjet-impeller/"
          },
          "Titanium Weld Neck Flange": {
            "href": "/products/titanium-weld-neck-flange/"
          },
          "Titanium Welding & Assembly": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Welding": {
            "href": "/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Titanium Wheel Hub Pawl Spring": {
            "href": "/products/titanium-wheel-hub-pawl-spring/"
          },
          "Titanium Wheel Spoke": {
            "href": "/products/titanium-wheel-spoke/"
          },
          "Torque response testing": {
            "href": "/capabilities/torque-response-testing/"
          },
          "Torque-to-tension verification": {
            "href": "/capabilities/torque-to-tension-verification/"
          },
          "Torsion testing": {
            "href": "/capabilities/torsion-testing/"
          },
          "Torsional rigidity testing": {
            "href": "/capabilities/torsional-rigidity-testing/"
          },
          "Trauma & Spine Fixation Hardware": {
            "href": "/systems/trauma-spine-fixation-hardware/"
          },
          "Triaxial forging of billet for isotropic grain structure": {
            "href": "/capabilities/triaxial-forging-of-billet-for-isotropic-grain-structure/"
          },
          "Tube bending of steam coils (mandrel bending to prevent collapse)": {
            "href": "/capabilities/tube-bending-of-steam-coils-mandrel-bending-to-prevent-collapse/"
          },
          "Tube end expansion / seal welding": {
            "href": "/capabilities/tube-end-expansion-seal-welding/"
          },
          "Tube rolling & longitudinal seam welding (for large diameters)": {
            "href": "/capabilities/tube-rolling--longitudinal-seam-welding-for-large-diameters/"
          },
          "Tube sheet drilling": {
            "href": "/capabilities/tube-sheet-drilling/"
          },
          "Turn-Mill CNC (Multi-Tasking Machine)": {
            "href": "/equipment/turn-mill-cnc/"
          },
          "UHV Gas Delivery Fittings & Manifolds": {
            "href": "/systems/uhv-gas-delivery-fittings-manifolds/"
          },
          "UHV Sealing Rings & Chamber Compression Hardware": {
            "href": "/systems/uhv-sealing-rings-chamber-compression-hardware/"
          },
          "Ultra-precision CNC turning/milling (micron tolerance)": {
            "href": "/capabilities/ultra-precision-cnc-turning-milling-micron-tolerance/"
          },
          "Ultra-sonic cleaning": {
            "href": "/capabilities/ultra-sonic-cleaning/"
          },
          "Ultra-sonic cleaning in Class 10": {
            "href": "/capabilities/ultra-sonic-cleaning-in-class-10/"
          },
          "ultrasonic cleaning": {
            "href": "/products/capabilities/ultrasonic-cleaning/"
          },
          "Ultrasonic inspection of clevis brackets": {
            "href": "/capabilities/ultrasonic-inspection-of-clevis-brackets/"
          },
          "Ultrasonic inspection (UT)": {
            "href": "/capabilities/ultrasonic-inspection-ut/"
          },
          "Ultrasonic thickness mapping of pressure hulls": {
            "href": "/capabilities/ultrasonic-thickness-mapping-of-pressure-hulls/"
          },
          "Ultrasonic Welding Components": {
            "href": "/systems/ultrasonic-welding-components/"
          },
          "Vacuum annealing": {
            "href": "/capabilities/vacuum-annealing/"
          },
          "Vacuum arc remelting (VAR) of ELI-grade ingot": {
            "href": "/capabilities/vacuum-arc-remelting-var-of-eli-grade-ingot/"
          },
          "Vacuum-arc remelting (VAR) of ELI-grade ingots": {
            "href": "/capabilities/vacuum-arc-remelting-var-of-eli-grade-ingots/"
          },
          "Vacuum brazing": {
            "href": "/capabilities/vacuum-brazing/"
          },
          "Vacuum brazing (if required)": {
            "href": "/capabilities/vacuum-brazing-if-required/"
          },
          "Vacuum heat treatment": {
            "href": "/capabilities/vacuum-heat-treatment/"
          },
          "Vacuum/Nitrogen Heat-Treat Furnace": {
            "href": "/equipment/vacuum-heat-treat-furnace/"
          },
          "Valves / Fluid Control Components": {
            "href": "/systems/valves--fluid-control-components/"
          },
          "Vibratory finishing": {
            "href": "/capabilities/vibratory-finishing/"
          },
          "VIV fatigue analysis": {
            "href": "/capabilities/viv-fatigue-analysis/"
          },
          "Wastewater Treatment & Environmental Engineering Hardware": {
            "href": "/systems/wastewater-treatment-environmental-engineering-hardware/"
          },
          "Water pressure testing (to rated depth x 1.25 safety factor)": {
            "href": "/capabilities/water-pressure-testing-to-rated-depth-x-125-safety-factor/"
          },
          "Waterjet / abrasive cutting": {
            "href": "/capabilities/waterjet-abrasive-cutting/"
          },
          "Waterjet Cutting": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "waterjet cutting of titanium": {
            "href": "/titanium-fabrication-services/waterjet-cutting/"
          },
          "Waterjet / laser cutting of band profiles": {
            "href": "/capabilities/waterjet-laser-cutting-of-band-profiles/"
          },
          "Waterjet/laser cutting of liner profiles": {
            "href": "/capabilities/waterjet-laser-cutting-of-liner-profiles/"
          },
          "Waterjet / Laser Cutting of Profiles": {
            "href": "/capabilities/waterjet-laser-cutting-of-profiles/"
          },
          "Wear measurement": {
            "href": "/capabilities/wear-measurement/"
          },
          "Weight sorting": {
            "href": "/capabilities/weight-sorting/"
          },
          "Weld integrity inspection": {
            "href": "/capabilities/weld-integrity-inspection/"
          },
          "Weld map documentation": {
            "href": "/capabilities/weld-map-documentation/"
          },
          "Wire drawing & straightening": {
            "href": "/capabilities/wire-drawing--straightening/"
          },
          "Wire drawing to precise diameter +-0.02mm": {
            "href": "/capabilities/wire-drawing-to-precise-diameter--002mm/"
          },
          "Wire EDM": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM Machine": {
            "href": "/equipment/wire-edm/"
          },
          "Wire EDM Machining": {
            "href": "/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Wire EDM of bearing retainer rings from cold-rolled beta strip": {
            "href": "/capabilities/wire-edm-of-bearing-retainer-rings-from-cold-rolled-beta-strip/"
          },
          "Wire EDM of thin shutter blades and aperture disks": {
            "href": "/capabilities/wire-edm-of-thin-shutter-blades-and-aperture-disks/"
          },
          "Wire forming of V-prong spring contacts": {
            "href": "/capabilities/wire-forming-of-v-prong-spring-contacts/"
          },
          "X-ray / CT inspection": {
            "href": "/capabilities/x-ray-ct-inspection/"
          },
          "X-ray inspection": {
            "href": "/capabilities/x-ray-inspection/"
          },
          "X-ray inspection (for welds)": {
            "href": "/capabilities/x-ray-inspection-for-welds/"
          },
          "X-ray of weld joints": {
            "href": "/capabilities/x-ray-of-weld-joints/"
          },
          "3/5-Achsen-CNC-Bearbeitung": {
            "href": "/de/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-Druck SLM": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-Druck SLM/DMLS": {
            "href": "/de/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additive Fertigung von Titan": {
            "href": "/de/titanium-additive-manufacturing/"
          },
          "Chemische Passivierung": {
            "href": "/de/titanium-surface-treatment/chemical-passivation/"
          },
          "Titan-Oberflächenbehandlung": {
            "href": "/de/titanium-surface-treatment/"
          },
          "Titanschweißen": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fräsen & Drehen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Titanschweißen & Montage": {
            "href": "/de/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "CNC-Fräsen": {
            "href": "/de/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Drahterodieren (Wire EDM)": {
            "href": "/de/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Eloxieren (Typ II": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Eloxieren (Typ II & Typ III)": {
            "href": "/de/titanium-surface-treatment/anodizing/"
          },
          "Kleinserienproduktion": {
            "href": "/de/titanium-additive-manufacturing/low-volume-production/"
          },
          "Kundenspezifische Industriekomponenten": {
            "href": "/de/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Laserschneiden (Blech": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Laserschneiden (Blech & Rohr)": {
            "href": "/de/titanium-fabrication-services/laser-cutting/"
          },
          "Polieren": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Polieren & Sandstrahlen": {
            "href": "/de/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Rohmaterialvorbereitung": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Rohmaterialvorbereitung & Zuschnitt": {
            "href": "/de/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Titan-Blechverarbeitungsdienste": {
            "href": "/de/titanium-fabrication-services/"
          },
          "Titan-CNC-Bearbeitungsdienste": {
            "href": "/de/titanium-cnc-machining-services/"
          },
          "Titan-Strangpressen": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titan-Umformung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titan-Umformung & Schwerindustriefertigung": {
            "href": "/de/titanium-forming-heavy-manufacturing/"
          },
          "Titanschmieden": {
            "href": "/de/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Umfassende Titanverarbeitungs- und Fertigungsdienstleistungen": {
            "href": "/de/"
          },
          "Wasserstrahlschneiden": {
            "href": "/de/titanium-fabrication-services/waterjet-cutting/"
          },
          "化学的不動態化処理": {
            "href": "/ja/titanium-surface-treatment/chemical-passivation/"
          },
          "カスタム産業用部品": {
            "href": "/ja/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "CNCフライス・旋盤加工": {
            "href": "/ja/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "チタン増材製造（3Dプリンティング）": {
            "href": "/ja/titanium-additive-manufacturing/"
          },
          "チタン押出加工": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "ワイヤー放電加工": {
            "href": "/ja/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "総合チタン加工・製造サービス": {
            "href": "/ja/"
          },
          "3Dプリンティング SLM/DMLS": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "チタン製缶板金サービス": {
            "href": "/ja/titanium-fabrication-services/"
          },
          "チタン表面処理": {
            "href": "/ja/titanium-surface-treatment/"
          },
          "研磨・サンドブラスト": {
            "href": "/ja/titanium-surface-treatment/polishing-sandblasting/"
          },
          "ラピッドプロトタイピング": {
            "href": "/ja/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "チタン溶接・組立": {
            "href": "/ja/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "チタン鍛造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "陽極酸化処理（タイプIIおよびIII）": {
            "href": "/ja/titanium-surface-treatment/anodizing/"
          },
          "チタンCNC加工サービス": {
            "href": "/ja/titanium-cnc-machining-services/"
          },
          "少量生産": {
            "href": "/ja/titanium-additive-manufacturing/low-volume-production/"
          },
          "原材料準備・サイジング": {
            "href": "/ja/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "3Dプリンティング SLM": {
            "href": "/ja/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "レーザー切断（シート＆チューブ）": {
            "href": "/ja/titanium-fabrication-services/laser-cutting/"
          },
          "ウォータージェット切断": {
            "href": "/ja/titanium-fabrication-services/waterjet-cutting/"
          },
          "チタン成形・重型製造": {
            "href": "/ja/titanium-forming-heavy-manufacturing/"
          },
          "3/5軸CNC加工": {
            "href": "/ja/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodisation (Type II et Type III)": {
            "href": "/fr/titanium-surface-treatment/anodizing/"
          },
          "Extrusion du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Fabrication Additive de Titane": {
            "href": "/fr/titanium-additive-manufacturing/"
          },
          "Forgeage du Titane": {
            "href": "/fr/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formage du Titane et Fabrication Lourde": {
            "href": "/fr/titanium-forming-heavy-manufacturing/"
          },
          "Découpe Laser (Tôle et Tube)": {
            "href": "/fr/titanium-fabrication-services/laser-cutting/"
          },
          "Usinage par Électroérosion au Fil": {
            "href": "/fr/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Services de Fabrication de Tôlerie Titane": {
            "href": "/fr/titanium-fabrication-services/"
          },
          "Composants Industriels Personnalisés": {
            "href": "/fr/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Préparation et Dimensionnement des Matières Premières": {
            "href": "/fr/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Découpe au Jet d'Eau": {
            "href": "/fr/titanium-fabrication-services/waterjet-cutting/"
          },
          "Fraisage et Tournage CNC": {
            "href": "/fr/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Impression 3D SLM/DMLS": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Impression 3D SLM": {
            "href": "/fr/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Passivation Chimique": {
            "href": "/fr/titanium-surface-treatment/chemical-passivation/"
          },
          "Polissage et Sablage": {
            "href": "/fr/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Production en Faible Volume": {
            "href": "/fr/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototypage Rapide": {
            "href": "/fr/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Services Complets de Fabrication et de Traitement du Titane": {
            "href": "/fr/"
          },
          "Services d'Usinage CNC du Titane": {
            "href": "/fr/titanium-cnc-machining-services/"
          },
          "Soudage et Assemblage du Titane": {
            "href": "/fr/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Traitement de Surface du Titane": {
            "href": "/fr/titanium-surface-treatment/"
          },
          "Usinage CNC 3/5 Axes": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinage CNC 3": {
            "href": "/fr/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizado (Tipo II y Tipo III)": {
            "href": "/es/titanium-surface-treatment/anodizing/"
          },
          "Componentes Industriales Personalizados": {
            "href": "/es/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte por Chorro de Agua": {
            "href": "/es/titanium-fabrication-services/waterjet-cutting/"
          },
          "Impresión 3D SLM/DMLS": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Preparación y Dimensionamiento de Materias Primas": {
            "href": "/es/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Impresión 3D SLM": {
            "href": "/es/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conformado de Titanio y Fabricación Pesada": {
            "href": "/es/titanium-forming-heavy-manufacturing/"
          },
          "Producción de Bajo Volumen": {
            "href": "/es/titanium-additive-manufacturing/low-volume-production/"
          },
          "Prototipado Rápido": {
            "href": "/es/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Extrusión de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Mecanizado por Electroerosión por Hilo": {
            "href": "/es/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Fabricación Aditiva de Titanio": {
            "href": "/es/titanium-additive-manufacturing/"
          },
          "Servicios de Fabricación de Titanio": {
            "href": "/es/titanium-fabrication-services/"
          },
          "Pasivación Química": {
            "href": "/es/titanium-surface-treatment/chemical-passivation/"
          },
          "Servicios Integrales de Fabricación y Procesamiento de Titanio": {
            "href": "/es/"
          },
          "Corte Láser (Chapa y Tubo)": {
            "href": "/es/titanium-fabrication-services/laser-cutting/"
          },
          "Forja de Titanio": {
            "href": "/es/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Fresado y Torneado CNC": {
            "href": "/es/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Mecanizado CNC de 3/5 Ejes": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Mecanizado CNC de 3": {
            "href": "/es/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Pulido y Chorreado de Arena": {
            "href": "/es/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Servicios de Mecanizado CNC de Titanio": {
            "href": "/es/titanium-cnc-machining-services/"
          },
          "Soldadura y Ensamblaje de Titanio": {
            "href": "/es/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Tratamiento de Superficie de Titanio": {
            "href": "/es/titanium-surface-treatment/"
          },
          "Componentes Industriais Personalizados": {
            "href": "/pt/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Corte a Laser (Chapa e Tubo)": {
            "href": "/pt/titanium-fabrication-services/laser-cutting/"
          },
          "Fresamento e Torneamento CNC": {
            "href": "/pt/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Polimento e Jateamento de Areia": {
            "href": "/pt/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Impressão 3D SLM/DMLS": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Preparação e Dimensionamento de Matéria-Prima": {
            "href": "/pt/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Serviços de Usinagem CNC de Titânio": {
            "href": "/pt/titanium-cnc-machining-services/"
          },
          "Usinagem por Eletroerosão a Fio": {
            "href": "/pt/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Produção de Baixo Volume": {
            "href": "/pt/titanium-additive-manufacturing/low-volume-production/"
          },
          "Passivação Química": {
            "href": "/pt/titanium-surface-treatment/chemical-passivation/"
          },
          "Soldagem e Montagem de Titânio": {
            "href": "/pt/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Manufatura Aditiva de Titânio": {
            "href": "/pt/titanium-additive-manufacturing/"
          },
          "Extrusão de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forjamento de Titânio": {
            "href": "/pt/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Tratamento de Superfície de Titânio": {
            "href": "/pt/titanium-surface-treatment/"
          },
          "Prototipagem Rápida": {
            "href": "/pt/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Anodização (Tipo II e Tipo III)": {
            "href": "/pt/titanium-surface-treatment/anodizing/"
          },
          "Corte a Jato de Água": {
            "href": "/pt/titanium-fabrication-services/waterjet-cutting/"
          },
          "Serviços Abrangentes de Fabricação e Processamento de Titânio": {
            "href": "/pt/"
          },
          "Serviços de Fabricação de Titânio": {
            "href": "/pt/titanium-fabrication-services/"
          },
          "Impressão 3D SLM": {
            "href": "/pt/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Conformação de Titânio e Fabricação Pesada": {
            "href": "/pt/titanium-forming-heavy-manufacturing/"
          },
          "Usinagem CNC de 3/5 Eixos": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Usinagem CNC de 3": {
            "href": "/pt/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Anodizzazione (Tipo II e Tipo III)": {
            "href": "/it/titanium-surface-treatment/anodizing/"
          },
          "Componenti Industriali Personalizzati": {
            "href": "/it/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Estrusione del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Forgiatura del Titanio": {
            "href": "/it/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Formatura del Titanio e Produzione Pesante": {
            "href": "/it/titanium-forming-heavy-manufacturing/"
          },
          "Fresatura e Tornitura CNC": {
            "href": "/it/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Lavorazione CNC a 3/5 Assi": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione CNC a 3": {
            "href": "/it/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Lavorazione per Elettroerosione a Filo": {
            "href": "/it/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Lucidatura e Sabbiatura": {
            "href": "/it/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Passivazione Chimica": {
            "href": "/it/titanium-surface-treatment/chemical-passivation/"
          },
          "Preparazione e Dimensionamento delle Materie Prime": {
            "href": "/it/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Produzione a Basso Volume": {
            "href": "/it/titanium-additive-manufacturing/low-volume-production/"
          },
          "Produzione Additiva di Titanio": {
            "href": "/it/titanium-additive-manufacturing/"
          },
          "Prototipazione Rapida": {
            "href": "/it/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Saldatura e Assemblaggio del Titanio": {
            "href": "/it/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Servizi Complete di Produzione e Lavorazione del Titanio": {
            "href": "/it/"
          },
          "Servizi di Fabbricazione del Titanio": {
            "href": "/it/titanium-fabrication-services/"
          },
          "Servizi di Lavorazione CNC del Titanio": {
            "href": "/it/titanium-cnc-machining-services/"
          },
          "Stampa 3D SLM/DMLS": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Stampa 3D SLM": {
            "href": "/it/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Taglio a Getto d'Acqua": {
            "href": "/it/titanium-fabrication-services/waterjet-cutting/"
          },
          "Taglio Laser (Lamiera e Tubo)": {
            "href": "/it/titanium-fabrication-services/laser-cutting/"
          },
          "Trattamento Superficiale del Titanio": {
            "href": "/it/titanium-surface-treatment/"
          },
          "소량 생산": {
            "href": "/ko/titanium-additive-manufacturing/low-volume-production/"
          },
          "티타늄 용접 및 조립": {
            "href": "/ko/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "티타늄 단조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "티타늄 압출": {
            "href": "/ko/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "아노다이징 (타입 II 및 III)": {
            "href": "/ko/titanium-surface-treatment/anodizing/"
          },
          "3D 프린팅 SLM/DMLS": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "와이어 방전 가공": {
            "href": "/ko/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "티타늄 표면 처리": {
            "href": "/ko/titanium-surface-treatment/"
          },
          "래피드 프로토타이핑": {
            "href": "/ko/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "원자재 준비 및 사이징": {
            "href": "/ko/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "연마 및 샌드블라스팅": {
            "href": "/ko/titanium-surface-treatment/polishing-sandblasting/"
          },
          "종합 티타늄 가공 및 제조 서비스": {
            "href": "/ko/"
          },
          "티타늄 적층 제조": {
            "href": "/ko/titanium-additive-manufacturing/"
          },
          "티타늄 판금 제작 서비스": {
            "href": "/ko/titanium-fabrication-services/"
          },
          "맞춤형 산업용 부품": {
            "href": "/ko/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "티타늄 CNC 가공 서비스": {
            "href": "/ko/titanium-cnc-machining-services/"
          },
          "티타늄 성형 및 중공업 제조": {
            "href": "/ko/titanium-forming-heavy-manufacturing/"
          },
          "레이저 절단 (시트 및 튜브)": {
            "href": "/ko/titanium-fabrication-services/laser-cutting/"
          },
          "3/5축 CNC 가공": {
            "href": "/ko/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "CNC 밀링 및 선반 가공": {
            "href": "/ko/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "3D 프린팅 SLM": {
            "href": "/ko/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "화학적 부동태화": {
            "href": "/ko/titanium-surface-treatment/chemical-passivation/"
          },
          "워터젯 절단": {
            "href": "/ko/titanium-fabrication-services/waterjet-cutting/"
          },
          "3/5-Assige CNC-bewerking": {
            "href": "/nl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "3D-printen SLM/DMLS": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "3D-printen SLM": {
            "href": "/nl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Additieve Productie van Titanium": {
            "href": "/nl/titanium-additive-manufacturing/"
          },
          "Anodiseren (Type II": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Anodiseren (Type II & Type III)": {
            "href": "/nl/titanium-surface-treatment/anodizing/"
          },
          "Chemische Passivering": {
            "href": "/nl/titanium-surface-treatment/chemical-passivation/"
          },
          "CNC Frezen en Draaien": {
            "href": "/nl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Draadvonken (Wire EDM)": {
            "href": "/nl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Grondstofvoorbereiding en -bepaling": {
            "href": "/nl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Lasersnijden (Plaat & Buis)": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Lasersnijden (Plaat": {
            "href": "/nl/titanium-fabrication-services/laser-cutting/"
          },
          "Op maat gemaakte industriële componenten": {
            "href": "/nl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Oppervlaktebehandeling van Titanium": {
            "href": "/nl/titanium-surface-treatment/"
          },
          "Polijsten en Zandstralen": {
            "href": "/nl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Productie in kleine oplage": {
            "href": "/nl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Titanium CNC-bewerkingsdiensten": {
            "href": "/nl/titanium-cnc-machining-services/"
          },
          "Titanium Extrusie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Titanium Fabricagediensten": {
            "href": "/nl/titanium-fabrication-services/"
          },
          "Titanium Smeden": {
            "href": "/nl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Titanium Vormen en Zware Productie": {
            "href": "/nl/titanium-forming-heavy-manufacturing/"
          },
          "Titaniumlassen en Assemblage": {
            "href": "/nl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Uitgebreide Titanium Productie- en Verwerkingsdiensten": {
            "href": "/nl/"
          },
          "Waterjetsnijden": {
            "href": "/nl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Anodowanie (Typ II i Typ III)": {
            "href": "/pl/titanium-surface-treatment/anodizing/"
          },
          "Druk 3D SLM/DMLS": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Druk 3D SLM": {
            "href": "/pl/titanium-additive-manufacturing/3d-printing-slm/"
          },
          "Frezowanie i Toczenie CNC": {
            "href": "/pl/titanium-cnc-machining-services/cnc-milling-turning/"
          },
          "Kucie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-forging/"
          },
          "Pasywacja Chemiczna": {
            "href": "/pl/titanium-surface-treatment/chemical-passivation/"
          },
          "Usługi Obróbki CNC Tytanu": {
            "href": "/pl/titanium-cnc-machining-services/"
          },
          "Cięcie Laserowe (Blacha i Rura)": {
            "href": "/pl/titanium-fabrication-services/laser-cutting/"
          },
          "Obróbka Powierzchniowa Tytanu": {
            "href": "/pl/titanium-surface-treatment/"
          },
          "Obróbka Elektroerozyjna Drutowa (EDM)": {
            "href": "/pl/titanium-cnc-machining-services/wire-edm-machining/"
          },
          "Niestandardowe Komponenty Przemysłowe": {
            "href": "/pl/titanium-cnc-machining-services/custom-industrial-components/"
          },
          "Spawanie i Montaż Tytanu": {
            "href": "/pl/titanium-fabrication-services/titanium-welding-assembly/"
          },
          "Produkcja Niskonakładowa": {
            "href": "/pl/titanium-additive-manufacturing/low-volume-production/"
          },
          "Usługi Obróbki Plastycznej Tytanu": {
            "href": "/pl/titanium-fabrication-services/"
          },
          "Obróbka CNC 3": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Formowanie Tytanu i Produkcja Ciężka": {
            "href": "/pl/titanium-forming-heavy-manufacturing/"
          },
          "Obróbka CNC 3/5-osiowa": {
            "href": "/pl/titanium-cnc-machining-services/3-5-axis-cnc-machining/"
          },
          "Cięcie Wodne": {
            "href": "/pl/titanium-fabrication-services/waterjet-cutting/"
          },
          "Kompleksowe Usługi Produkcji i Obróbki Tytanu": {
            "href": "/pl/"
          },
          "Polerowanie i Piaskowanie": {
            "href": "/pl/titanium-surface-treatment/polishing-sandblasting/"
          },
          "Przygotowanie i Wymiarowanie Surowca": {
            "href": "/pl/titanium-forming-heavy-manufacturing/raw-material-preparation-sizing/"
          },
          "Szybkie Prototypowanie": {
            "href": "/pl/titanium-additive-manufacturing/rapid-prototyping/"
          },
          "Wyciskanie Tytanu": {
            "href": "/pl/titanium-forming-heavy-manufacturing/titanium-extrusion/"
          },
          "Wytwarzanie Addytywne Tytanu": {
            "href": "/pl/titanium-additive-manufacturing/"
          }
      }
      }]
    ]
  },
  vite: {
    plugins: [tailwindcss(), devDashboardApi()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-remove-scroll') ||
                id.includes('node_modules/@radix-ui/react-dialog') ||
                id.includes('node_modules/react-style-singleton') ||
                id.includes('node_modules/use-callback-ref') ||
                id.includes('node_modules/use-sidecar') ||
                id.includes('node_modules/@radix-ui/react-dismissable-layer') ||
                id.includes('node_modules/@radix-ui/react-focus-scope') ||
                id.includes('node_modules/@radix-ui/react-focus-guards') ||
                id.includes('node_modules/@radix-ui/react-presence') ||
                id.includes('node_modules/@radix-ui/react-primitive') ||
                id.includes('node_modules/@radix-ui/react-portal') ||
                id.includes('node_modules/@radix-ui/react-use-escape-keydown') ||
                id.includes('node_modules/@radix-ui/react-use-callback-ref') ||
                id.includes('node_modules/@radix-ui/react-use-controllable-state') ||
                id.includes('node_modules/@radix-ui/react-use-layout-effect') ||
                id.includes('node_modules/@radix-ui/react-compose-refs') ||
                id.includes('node_modules/@radix-ui/react-context') ||
                id.includes('node_modules/@radix-ui/react-slot') ||
                id.includes('node_modules/detect-node-es') ||
                id.includes('node_modules/tslib')) {
              return 'vendor-dialog';
            }
            if (id.includes('node_modules/motion') ||
                id.includes('node_modules/framer-motion') ||
                id.includes('node_modules/motion-dom') ||
                id.includes('node_modules/motion-utils')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/react-dom') ||
                id.includes('node_modules/scheduler')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
});
