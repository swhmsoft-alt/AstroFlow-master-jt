/**
 * Titanium Grade Data — Master content file for all 13 titanium material grade pages.
 *
 * Each grade entry follows a 7-section knowledge-graph ontology:
 *   1. entityDefinition   — 基础实体定义
 *   2. conformsTo         — 关联标准
 *   3. hasProperty        — 材料性能
 *   4. processedBy        — 可加工工艺
 *   5. manufacturedFrom   — 下游成品
 *   6. usedIn             — 适用行业
 *   7. alternativeTo      — 替代材质
 *
 * All values are English. Future i18n can be added via translation keys.
 */

export interface GradeProperty {
  label: string;
  value: string;
}

export interface GradeSection {
  title: string;
  description: string;
  items: string[];
  /** Optional FAQ block (used by some grade sections for AIO content) */
  faqs?: { question: string; answer: string }[];
  /** Optional narrative text (used by some grade sections for AIO content) */
  whyChooseUs?: string;
}

export interface GradePropertiesSection {
  title: string;
  description: string;
  properties: GradeProperty[];
}

export interface GradeData {
  /** Unique slug key, e.g. "grade-5" */
  key: string;
  /** Display name, e.g. "Grade 5 – Ti-6Al-4V" */
  name: string;
  /** Chinese display name */
  nameCn: string;
  /** UNS number, e.g. "UNS R56400" */
  uns: string;
  /** Short one-line description */
  tagline: string;
  /** Hero badge text */
  badge: string;
  /** Hero highlight text */
  highlight: string;
  /** Hero subtitle */
  subtitle: string;
  /** SEO page title template */
  pageTitle: string;
  /** SEO meta description */
  metaDescription: string;
  /** 1. 实体定义 */
  entityDefinition: {
    title: string;
    description: string;
    classification: string;
    commonNames: string[];
    keyCharacteristics: string[];
  };
  /** 2. 关联标准 (conforms_to) */
  conformsTo: GradeSection;
  /** 3. 材料性能 (has_property) */
  hasProperty: GradePropertiesSection;
  /** 4. 可加工工艺 (processed_by) */
  processedBy: GradeSection;
  /** 5. 下游成品 (manufactured_from) */
  manufacturedFrom: GradeSection;
  /** 6. 适用行业 (used_in) */
  usedIn: GradeSection;
  /** 7. 替代材质 (alternative_to) */
  alternativeTo: GradeSection;
  /** Frequently asked questions for AIO */
  faqs: { question: string; answer: string }[];
  /** Why choose us narrative for AIO */
  whyChooseUs: string;
}

export type GradeMap = Record<string, GradeData>;

export const GRADE_DATA: GradeMap = {
  "grade-1": {
    key: "grade-1",
    name: "Grade 1 – Commercially Pure Titanium",
    nameCn: "工业纯钛 1级",
    uns: "UNS R50250",
    tagline: "The softest and most formable commercially pure titanium grade with exceptional corrosion resistance.",
    badge: "CP Titanium Grade",
    highlight: "Grade 1",
    subtitle: "Commercially Pure Titanium Grade 1 (UNS R50250) — the softest grade in the CP titanium family, offering maximum formability, outstanding corrosion resistance, and excellent weldability for chemical processing, marine, and architectural applications.",
    pageTitle: "Grade 1 Titanium (CP-Ti) | Commercially Pure Titanium Properties & Uses",
    metaDescription: "Explore Grade 1 commercially pure titanium — the most formable CP grade. Learn about its mechanical properties, corrosion resistance, applicable standards, processing methods, and typical applications across chemical, marine, and architectural industries.",
    entityDefinition: {
      title: "What is Grade 1 Titanium?",
      description: "Grade 1 is the lowest-strength, softest, and most ductile grade in the commercially pure (CP) titanium family. It offers the highest formability and corrosion resistance among CP grades, making it ideal for applications requiring severe forming operations and exposure to corrosive environments.",
      classification: "Commercially Pure Titanium (Alpha Phase)",
      commonNames: ["CP-Ti Grade 1", "UNS R50250", "Ti Grade 1", "ASTM B265 Grade 1"],
      keyCharacteristics: [
        "Highest formability and ductility among all CP titanium grades",
        "Exceptional corrosion resistance in oxidizing and mildly reducing environments",
        "Low strength compared to alloyed titanium grades",
        "Excellent weldability with minimal post-weld treatment",
        "Non-magnetic and biocompatible"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 1 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Standard Specification for Titanium and Titanium Alloy Strip, Sheet, and Plate",
        "ASTM B348 — Standard Specification for Titanium and Titanium Alloy Bars and Billets",
        "ASTM B381 — Standard Specification for Titanium and Titanium Alloy Forgings",
        "ASTM B861 — Standard Specification for Titanium and Titanium Alloy Seamless Pipe",
        "ASTM B862 — Standard Specification for Titanium and Titanium Alloy Welded Pipe",
        "AMS 4901 — Sheet, Strip, and Plate (Commercially Pure Titanium)",
        "ISO 5832-2 — Implants for Surgery (Commercially Pure Titanium)",
        "DIN 17850 — Titanium Grade 1 (Ti 1)"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 1 titanium (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "240 MPa (35 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "170 MPa (25 ksi)" },
        { label: "Elongation (min)", value: "24%" },
        { label: "Reduction of Area", value: "30%" },
        { label: "Hardness (HRB)", value: "≤ 70 HRB" },
        { label: "Density", value: "4.51 g/cm³ (0.163 lb/in³)" },
        { label: "Elastic Modulus", value: "103 GPa (14.9 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "17 W/(m·K)" },
        { label: "Electrical Resistivity", value: "55 µΩ·cm" },
        { label: "Max Service Temperature (Oxidizing)", value: "316°C (600°F)" },
        { label: "Max Service Temperature (Reducing)", value: "260°C (500°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 1 titanium can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Excellent; can be severely deformed without intermediate annealing",
        "Hot forming — Readily formable at 260–540°C (500–1,000°F)",
        "CNC machining — Fair to good; requires sharp tools and slow speeds to prevent work hardening",
        "TIG welding — Excellent; no post-weld heat treatment required for most applications",
        "Laser welding — Excellent weld quality with proper shielding gas coverage",
        "Resistance welding — Suitable for spot and seam welding",
        "Chemical etching / pickling — Good response to standard HF/HNO₃ acid baths",
        "Electropolishing — Produces bright, clean surface finish",
        "Anodizing — Supports Type II and Type III anodizing for enhanced wear and corrosion resistance",
        "Hot isostatic pressing (HIP) — Reduces residual porosity in cast or powder forms"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 1 titanium is commonly fabricated into the following downstream products:",
      items: [
        "Chemical processing vessels, tanks, and heat exchangers",
        "Piping systems for corrosive fluid handling",
        "Valve bodies and pump components for chemical and marine service",
        "Architectural cladding panels and roofing",
        "Marine hardware — propeller shafts, rudders, seawater piping",
        "Desalination plant equipment",
        "Food processing equipment",
        "Electrodes for electrochemical processes",
        "Heat exchanger tubing and tube sheets",
        "Ducting and ventilation components"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 1 titanium serves as a material of choice across these industries:",
      items: [
        "Chemical processing — Tanks, reactors, piping for aggressive chemical service",
        "Marine & shipbuilding — Seawater systems, propeller shafts, hull fittings",
        "Desalination — Evaporator shells, brine heaters, tubing",
        "Architecture & construction — Building cladding, roofing, structural facades",
        "Food & beverage — Processing tanks, piping, mixing vessels",
        "Pulp & paper — Bleaching equipment, chemical recovery systems",
        "Power generation — Condenser tubing, scrubber components",
        "Medical (limited) — Non-load-bearing implants per ISO 5832-2"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 1 may be substituted by:",
      items: [
        "Grade 2 (CP-Ti) — Higher strength with similar corrosion resistance; most common CP grade",
        "Grade 3 (CP-Ti) — Higher strength, less formability than Grade 1",
        "304L / 316L Stainless Steel — Lower cost but inferior corrosion resistance in chloride environments",
        "Hastelloy C-276 — Superior corrosion resistance in harsh reducing environments but significantly higher cost",
        "Nickel 200 / 201 — Alternative for caustic service where titanium may be unsuitable"
      ]
    },
    faqs: [
      { question: "What is Grade 1 titanium and what are its key advantages?", answer: "Grade 1 is the lowest-strength, softest, and most ductile grade in the commercially pure titanium family. It offers the highest formability and corrosion resistance among CP grades, making it ideal for applications requiring severe forming operations and exposure to corrosive environments." },
      { question: "Can you machine and form Grade 1 titanium into complex components?", answer: "Yes. Grade 1 offers excellent cold formability and can be deeply drawn without intermediate annealing. We machine Grade 1 on our CNC centers with tolerances up to ±0.005 mm, and our fabrication team performs TIG welding, laser cutting, and forming per AWS D1.6 standards." },
      { question: "What industries commonly use Grade 1 titanium?", answer: "Grade 1 is widely used in chemical processing equipment, desalination plants, heat exchangers, marine components, architectural cladding, and medical devices per ISO 5832-2." }
    ],
    whyChooseUs: "BOZE CNC Ti is a precision manufacturer of Grade 1 commercially pure titanium components for the chemical processing, desalination, marine, and architectural industries. Our facility processes certified CP-Ti Grade 1 stock with full material traceability, EN 10204 Type 3.1 MTRs, and CMM dimensional inspection."
  },

  "grade-2": {
    key: "grade-2",
    name: "Grade 2 – Commercially Pure Titanium",
    nameCn: "工业纯钛 2级",
    uns: "UNS R50400",
    tagline: "The most widely used commercially pure titanium grade, balancing strength, formability, and corrosion resistance.",
    badge: "CP Titanium Grade",
    highlight: "Grade 2",
    subtitle: "Commercially Pure Titanium Grade 2 (UNS R50400) — the workhorse CP titanium grade offering an optimal balance of mechanical strength, ductility, corrosion resistance, and weldability. The most commonly specified CP grade for industrial applications worldwide.",
    pageTitle: "Grade 2 Titanium (CP-Ti) | Commercially Pure Titanium Properties & Uses",
    metaDescription: "Explore Grade 2 commercially pure titanium — the most widely used CP grade. Learn about its mechanical properties, corrosion resistance, applicable standards, processing methods, and industrial applications across chemical, marine, medical, and aerospace sectors.",
    entityDefinition: {
      title: "What is Grade 2 Titanium?",
      description: "Grade 2 is the most commonly specified commercially pure titanium grade, offering a balanced combination of strength, ductility, corrosion resistance, and weldability. It accounts for the majority of CP titanium usage in industrial applications and is often considered the baseline grade for titanium material selection.",
      classification: "Commercially Pure Titanium (Alpha Phase)",
      commonNames: ["CP-Ti Grade 2", "UNS R50400", "Ti Grade 2", "ASTM B265 Grade 2", "Ti-2"],
      keyCharacteristics: [
        "Most widely used CP titanium grade — industry baseline for many applications",
        "Excellent corrosion resistance in seawater, chlorides, and oxidizing acids",
        "Good balance of strength and formability for fabrication",
        "Excellent weldability — no post-weld heat treatment typically required",
        "Biocompatible and non-magnetic"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 2 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "ASTM B861 — Seamless Pipe",
        "ASTM B862 — Welded Pipe",
        "AMS 4902 — Sheet, Strip, and Plate (Commercially Pure Titanium)",
        "AMS 4928 — Bars and Wire",
        "ISO 5832-2 — Implants for Surgery",
        "DIN 17850 — Titanium Grade 2 (Ti 2)",
        "NACE MR0175 / ISO 15156 — Sulfide Stress Cracking Resistant Materials for Oilfield Equipment"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 2 titanium (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "345 MPa (50 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "275 MPa (40 ksi)" },
        { label: "Elongation (min)", value: "20%" },
        { label: "Reduction of Area", value: "30%" },
        { label: "Hardness (HRB)", value: "≤ 80 HRB" },
        { label: "Density", value: "4.51 g/cm³ (0.163 lb/in³)" },
        { label: "Elastic Modulus", value: "105 GPa (15.2 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "17 W/(m·K)" },
        { label: "Electrical Resistivity", value: "55 µΩ·cm" },
        { label: "Max Service Temperature (Oxidizing)", value: "316°C (600°F)" },
        { label: "Max Service Temperature (Reducing)", value: "260°C (500°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 2 titanium can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Good; moderate deformation possible without intermediate annealing",
        "Hot forming — Readily formable at 260–540°C (500–1,000°F)",
        "CNC machining — Fair; requires sharp carbide tools and adequate coolant flow",
        "TIG welding — Excellent; most common joining method for CP titanium",
        "Laser welding — Good weld quality with inert gas shielding on both sides",
        "Resistance welding — Suitable for spot welding with proper process control",
        "Forging — Open and closed-die forging at 870–980°C (1,600–1,800°F)",
        "Extrusion — Hot extrusion at 900–1,050°C using glass lubricants",
        "Chemical etching / pickling — Good response to HF/HNO₃ solutions",
        "Anodizing — Type II and Type III anodizing for corrosion and wear protection"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 2 titanium is commonly fabricated into the following downstream products:",
      items: [
        "Chemical processing equipment — reactors, columns, heat exchangers",
        "Seawater piping systems and marine risers",
        "Desalination plant evaporator shells and tubing",
        "Ball valves, gate valves, and butterfly valve bodies",
        "Pump casings and impellers for corrosive service",
        "Heat exchanger tube sheets and tube bundles",
        "Architectural cladding, roofing panels, and curtain wall systems",
        "Automotive exhaust components",
        "Medical implants (non-load-bearing) per ISO 5832-2",
        "Electrochemical cells and anodes"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 2 titanium serves as a material of choice across these industries:",
      items: [
        "Chemical processing — Process vessels, piping, heat exchangers for corrosive media",
        "Marine & offshore — Seawater cooling systems, ballast piping, fire mains",
        "Desalination — Thermal and membrane-based desalination equipment",
        "Oil & gas — Topside piping, heat exchangers, produced water treatment",
        "Architecture — Building facades, roofing, coastal infrastructure",
        "Medical — Surgical instruments, non-load-bearing implants",
        "Pulp & paper — Bleaching towers, washer drums, chemical mixers",
        "Power generation — Condenser tubing, FGD scrubber internals"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 2 may be substituted by:",
      items: [
        "Grade 1 (CP-Ti) — Higher formability, lower strength than Grade 2",
        "Grade 3 (CP-Ti) — Higher strength, less ductility than Grade 2",
        "Grade 12 (Ti-0.3Mo-0.8Ni) — Superior corrosion resistance in reducing environments",
        "316L Stainless Steel — Lower cost but susceptible to chloride stress corrosion cracking",
        "Super Duplex Stainless Steel (UNS S32750) — Higher strength alternative with good corrosion resistance",
        "Nickel Alloy 625 — Better high-temperature strength and corrosion resistance at higher cost"
      ]
    },
    faqs: [
      { question: "What is Grade 2 titanium and why is it the most widely used commercially pure grade?", answer: "Grade 2 is the most commonly specified commercially pure titanium grade, offering an optimal balance of strength, ductility, corrosion resistance, and weldability. It is the default choice for industrial applications requiring excellent seawater corrosion resistance, good formability, and moderate strength." },
      { question: "Can you machine Grade 2 titanium into custom industrial components?", answer: "Yes. We machine Grade 2 CP-Titanium on our 5-axis CNC centers and precision turning machines. Grade 2 offers good machinability for a titanium alloy. We achieve tolerances up to ±0.005 mm with excellent surface finishes for chemical processing, marine, and industrial components." },
      { question: "What documentation do you provide with Grade 2 titanium parts?", answer: "Every order includes EN 10204 Type 3.1 Material Test Reports (MTRs) documenting chemical composition and mechanical properties per ASTM B265. CMM dimensional inspection reports and NDT (ultrasonic/penetrant) testing are available upon request." }
    ],
    whyChooseUs: "BOZE CNC Ti is a trusted manufacturer of Grade 2 commercially pure titanium components for the chemical processing, marine, oil & gas, and architectural industries. Our facility processes certified CP-Ti stock through 5-axis CNC milling, precision turning, and custom fabrication. Every component is backed by full material traceability, MTR documentation, and CMM inspection. Our engineering team provides 24-hour DFM review and competitive quoting for industrial and marine applications."
  },

  "grade-3": {
    key: "grade-3",
    name: "Grade 3 – Commercially Pure Titanium",
    nameCn: "工业纯钛 3级",
    uns: "UNS R50550",
    tagline: "A higher-strength commercially pure titanium grade for applications requiring increased load capacity.",
    badge: "CP Titanium Grade",
    highlight: "Grade 3",
    subtitle: "Commercially Pure Titanium Grade 3 (UNS R50550) — a medium-strength CP grade offering higher tensile strength than Grade 2 while retaining good fabricability and excellent corrosion resistance for demanding industrial environments.",
    pageTitle: "Grade 3 Titanium (CP-Ti) | Commercially Pure Titanium Properties & Uses",
    metaDescription: "Explore Grade 3 commercially pure titanium — a higher-strength CP grade. Learn about its mechanical properties, corrosion resistance, applicable standards, processing methods, and typical applications across chemical, marine, and aerospace industries.",
    entityDefinition: {
      title: "What is Grade 3 Titanium?",
      description: "Grade 3 is a medium-strength commercially pure titanium grade positioned between Grade 2 and Grade 4 in the CP family. It offers significantly higher tensile strength than Grade 2 while retaining good ductility and the excellent corrosion resistance characteristic of unalloyed titanium.",
      classification: "Commercially Pure Titanium (Alpha Phase)",
      commonNames: ["CP-Ti Grade 3", "UNS R50550", "Ti Grade 3", "ASTM B265 Grade 3"],
      keyCharacteristics: [
        "Higher strength than Grade 2 with moderate formability",
        "Excellent corrosion resistance in oxidizing environments",
        "Good weldability with proper shielding",
        "Suitable for moderately loaded structural applications",
        "Non-magnetic and biocompatible"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 3 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "ASTM B861 — Seamless Pipe",
        "ASTM B862 — Welded Pipe",
        "AMS 4900 — Sheet, Strip, and Plate (Commercially Pure Titanium)",
        "DIN 17850 — Titanium Grade 3 (Ti 3)",
        "NACE MR0175 / ISO 15156 — Oilfield Equipment"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 3 titanium (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "450 MPa (65 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "380 MPa (55 ksi)" },
        { label: "Elongation (min)", value: "18%" },
        { label: "Reduction of Area", value: "30%" },
        { label: "Hardness (HRB)", value: "≤ 90 HRB" },
        { label: "Density", value: "4.51 g/cm³ (0.163 lb/in³)" },
        { label: "Elastic Modulus", value: "105 GPa (15.2 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "17 W/(m·K)" },
        { label: "Electrical Resistivity", value: "55 µΩ·cm" },
        { label: "Max Service Temperature (Oxidizing)", value: "316°C (600°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 3 titanium can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Moderate; requires more force than Grade 2; intermediate annealing may be needed",
        "Hot forming — Readily formable at 260–540°C (500–1,000°F)",
        "CNC machining — Fair; similar to other CP grades with work hardening tendency",
        "TIG welding — Good; post-weld stress relief recommended for highly restrained joints",
        "Laser welding — Good quality with proper gas shielding",
        "Forging — Open and closed-die forging at 870–980°C (1,600–1,800°F)",
        "Extrusion — Hot extrusion with glass lubrication at 900–1,050°C",
        "Rolling — Hot and cold rolling with intermediate annealing",
        "Chemical pickling — Good response to standard HF/HNO₃ solutions"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 3 titanium is commonly fabricated into the following downstream products:",
      items: [
        "Chemical processing columns and reactor vessels requiring higher strength than Grade 2",
        "Heat exchanger shells and tube sheets",
        "Seawater piping and fittings for offshore platforms",
        "Valve bodies and pump components for moderate pressure service",
        "Centrifuge baskets and filter components",
        "Architectural structural supports and fasteners",
        "Marine propeller shafts and rudder assemblies",
        "Electrochemical cell components"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 3 titanium serves as a material of choice across these industries:",
      items: [
        "Chemical processing — Vessels and piping requiring higher pressure ratings",
        "Marine — Structural components, propeller shafts, seawater systems",
        "Oil & gas — Produced water treatment, piping systems",
        "Desalination — Pump casings, high-pressure piping",
        "Aerospace (limited) — Non-critical structural components",
        "Pulp & paper — Chemical handling equipment",
        "Power generation — Heat exchanger and condenser components"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 3 may be substituted by:",
      items: [
        "Grade 2 (CP-Ti) — Lower strength, better formability",
        "Grade 4 (CP-Ti) — Higher strength, lower ductility",
        "Grade 5 (Ti-6Al-4V) — Significantly higher strength at the cost of corrosion resistance in some environments",
        "316L Stainless Steel — Lower cost but inferior chloride resistance",
        "Duplex 2205 Stainless Steel — Higher strength alternative for pressure-containing equipment"
      ]
    },
    faqs: [
      { question: "What is Grade 3 titanium and how does it compare to Grade 2?", answer: "Grade 3 is a medium-strength CP titanium grade between Grade 2 and Grade 4. It offers significantly higher tensile strength than Grade 2 while maintaining good ductility and the excellent corrosion resistance of unalloyed titanium." },
      { question: "What tolerances can you achieve on Grade 3 titanium parts?", answer: "We achieve machining tolerances up to ±0.005 mm on Grade 3 CP-Titanium components using our multi-axis CNC machining centers." },
      { question: "Which industries typically specify Grade 3 titanium?", answer: "Grade 3 is used in chemical processing vessels requiring higher strength than Grade 2, marine components for offshore platforms, oil & gas production water handling, and desalination pump housings." }
    ],
    whyChooseUs: "BOZE CNC Ti manufactures precision Grade 3 CP-Titanium components for industrial applications. Our facility processes certified stock through multi-axis CNC machining and fabrication, backed by full material traceability with EN 10204 Type 3.1 MTRs."
  },

  "grade-4": {
    key: "grade-4",
    name: "Grade 4 – Commercially Pure Titanium",
    nameCn: "工业纯钛 4级",
    uns: "UNS R50700",
    tagline: "The highest-strength commercially pure titanium grade for maximum load-bearing capacity in CP grades.",
    badge: "CP Titanium Grade",
    highlight: "Grade 4",
    subtitle: "Commercially Pure Titanium Grade 4 (UNS R50700) — the highest-strength CP titanium grade with maximum oxygen content for enhanced tensile properties. Provides the best strength-to-cost ratio among commercially pure grades for structural applications.",
    pageTitle: "Grade 4 Titanium (CP-Ti) | Commercially Pure Titanium Properties & Uses",
    metaDescription: "Explore Grade 4 commercially pure titanium — the strongest CP grade. Learn about its mechanical properties, corrosion resistance, applicable standards, processing methods, and typical applications across medical, aerospace, and industrial sectors.",
    entityDefinition: {
      title: "What is Grade 4 Titanium?",
      description: "Grade 4 is the highest-strength grade in the commercially pure titanium family. Its elevated oxygen content (up to 0.40%) provides increased tensile and yield strength compared to Grades 1–3, while retaining the excellent corrosion resistance characteristic of unalloyed titanium. Grade 4 is often specified for applications requiring maximum strength within the CP series.",
      classification: "Commercially Pure Titanium (Alpha Phase)",
      commonNames: ["CP-Ti Grade 4", "UNS R50700", "Ti Grade 4", "ASTM B265 Grade 4"],
      keyCharacteristics: [
        "Highest strength among CP titanium grades",
        "Excellent corrosion resistance in oxidizing and mild reducing environments",
        "Good weldability with appropriate process controls",
        "Moderate formability — less ductile than lower CP grades",
        "Biocompatible — used in medical implant applications"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 4 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "ASTM F67 — Standard Specification for Unalloyed Titanium for Surgical Implant Applications",
        "ISO 5832-2 — Implants for Surgery",
        "AMS 4901 — Sheet, Strip, and Plate (Commercially Pure Titanium)",
        "DIN 17850 — Titanium Grade 4"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 4 titanium (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "550 MPa (80 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "485 MPa (70 ksi)" },
        { label: "Elongation (min)", value: "15%" },
        { label: "Reduction of Area", value: "25%" },
        { label: "Hardness (HRB)", value: "≤ 100 HRB" },
        { label: "Density", value: "4.51 g/cm³ (0.163 lb/in³)" },
        { label: "Elastic Modulus", value: "105 GPa (15.2 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "17 W/(m·K)" },
        { label: "Electrical Resistivity", value: "55 µΩ·cm" },
        { label: "Max Service Temperature (Oxidizing)", value: "316°C (600°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 4 titanium can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Limited; higher springback and tooling forces required",
        "Hot forming — Recommended for complex geometries; form at 260–540°C (500–1,000°F)",
        "CNC machining — Fair; work hardens rapidly — use sharp tools and heavy feed rates",
        "TIG welding — Good; post-weld stress relief recommended",
        "Laser welding — Acceptable with proper shielding gas parameters",
        "Forging — Open and closed-die forging at 870–980°C (1,600–1,800°F)",
        "Extrusion — Hot extrusion at 900–1,050°C with glass lubricants",
        "Rolling — Requires intermediate annealing for significant cold reduction",
        "Chemical etching — Slower etch rate than lower CP grades"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 4 titanium is commonly fabricated into the following downstream products:",
      items: [
        "Medical implants — orthopedic plates, screws, dental implants (per ASTM F67)",
        "Surgical instruments and fixation devices",
        "Heat exchanger tubing requiring higher strength than Grade 2",
        "Chemical processing equipment for higher pressure service",
        "Marine fasteners and hardware",
        "Structural components for coastal and offshore infrastructure",
        "Valve stems and high-pressure fittings",
        "Automotive connecting rods and suspension springs"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 4 titanium serves as a material of choice across these industries:",
      items: [
        "Medical — Orthopedic implants, dental implants, surgical instruments",
        "Chemical processing — High-pressure vessels, heat exchangers, piping",
        "Marine — Fasteners, hardware, structural components",
        "Aerospace (limited) — Non-critical structural fasteners",
        "Automotive — Performance and racing components",
        "Architecture — Load-bearing structural elements",
        "Power generation — Heat exchanger and condenser components"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 4 may be substituted by:",
      items: [
        "Grade 3 (CP-Ti) — Lower strength, better formability",
        "Grade 5 (Ti-6Al-4V) — Significantly higher strength for structural applications",
        "Grade 23 (Ti-6Al-4V ELI) — Medical-grade alternative with improved fracture toughness",
        "316LVM Stainless Steel — Lower-cost medical-grade alternative",
        "CP-Ti Grade 4 ELI — Extra-low interstitial version with improved ductility"
      ]
    },
    faqs: [
      { question: "What is Grade 4 titanium and what makes it the strongest CP grade?", answer: "Grade 4 is the highest-strength grade in the CP titanium family, with increased oxygen content providing higher tensile and yield strengths while retaining excellent corrosion resistance." },
      { question: "What machining capabilities do you offer for Grade 4 titanium?", answer: "We machine Grade 4 on 5-axis CNC centers with tolerances up to ±0.005 mm. Grade 4 work-hardens rapidly, so we use sharp carbide tooling with high-pressure coolant." },
      { question: "What are primary applications for Grade 4 titanium?", answer: "Grade 4 is used in medical implants per ASTM F67, surgical instruments, heat exchanger tubing, chemical processing equipment, marine fasteners, and automotive components." }
    ],
    whyChooseUs: "BOZE CNC Ti delivers precision-machined Grade 4 CP-Titanium components for medical, marine, and industrial applications with full material traceability and CMM verification."
  },

  "grade-4-eli": {
    key: "grade-4-eli",
    name: "ELI Grade 4 – Low Interstitial Titanium",
    nameCn: "4级超低间隙纯钛 (ELI)",
    uns: "UNS R50700 (modified)",
    tagline: "Extra-low interstitial Grade 4 titanium with enhanced ductility and fracture toughness for critical applications.",
    badge: "CP Titanium Grade",
    highlight: "ELI Grade 4",
    subtitle: "Extra-Low Interstitial (ELI) Grade 4 titanium — a modified CP-Ti Grade 4 with controlled low oxygen, nitrogen, and carbon content for improved ductility, fracture toughness, and fatigue resistance in demanding aerospace and medical applications.",
    pageTitle: "ELI Grade 4 Titanium | Extra-Low Interstitial CP-Ti Properties & Uses",
    metaDescription: "Explore ELI Grade 4 titanium — extra-low interstitial commercially pure grade. Learn about its enhanced ductility, fracture toughness, applicable standards, processing methods, and critical applications in aerospace and medical sectors.",
    entityDefinition: {
      title: "What is ELI Grade 4 Titanium?",
      description: "ELI (Extra-Low Interstitial) Grade 4 is a modified version of standard CP-Ti Grade 4 with strictly controlled lower limits of interstitial elements — oxygen, nitrogen, carbon, and hydrogen. This controlled chemistry significantly improves ductility, fracture toughness, and fatigue properties while maintaining strength levels close to standard Grade 4.",
      classification: "Commercially Pure Titanium (Alpha Phase) — ELI Modification",
      commonNames: ["Grade 4 ELI", "CP-Ti Grade 4 ELI", "Extra-Low Interstitial Grade 4", "ASTM F67 ELI Grade 4"],
      keyCharacteristics: [
        "Superior fracture toughness and fatigue resistance compared to standard Grade 4",
        "Controlled low oxygen (≤0.15%) and nitrogen (≤0.03%) content",
        "Enhanced ductility for improved formability and cold working",
        "Excellent corrosion resistance — equivalent to standard CP grades",
        "Preferred for critical implant applications requiring high reliability"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "ELI Grade 4 titanium conforms to the following international material standards:",
      items: [
        "ASTM F67 — Standard Specification for Unalloyed Titanium for Surgical Implant Applications",
        "ISO 5832-2 — Implants for Surgery (ELI Grade)",
        "ASTM B265 — Sheet, Strip, and Plate (when specified as ELI)",
        "ASTM F136 (analogous ELI requirement approach)"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for ELI Grade 4 titanium (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "485 MPa (70 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "380 MPa (55 ksi)" },
        { label: "Elongation (min)", value: "20%" },
        { label: "Reduction of Area", value: "35%" },
        { label: "Fracture Toughness (KIC)", value: "> 80 MPa√m" },
        { label: "Density", value: "4.51 g/cm³ (0.163 lb/in³)" },
        { label: "Elastic Modulus", value: "105 GPa (15.2 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "17 W/(m·K)" },
        { label: "Max Oxygen Content", value: "≤ 0.15%" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "ELI Grade 4 titanium can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Better than standard Grade 4 due to lower interstitial content",
        "Hot forming — Recommended at 260–540°C (500–1,000°F)",
        "CNC machining — Similar to standard Grade 4; requires sharp tools and adequate coolant",
        "TIG welding — Good; ELI chemistry provides better weld ductility",
        "Laser welding — Acceptable with inert gas shielding",
        "Forging — At 870–980°C (1,600–1,800°F) with controlled cooling rate",
        "Surface treatment — Anodizing, passivation, and polishing all applicable"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "ELI Grade 4 titanium is commonly fabricated into the following downstream products:",
      items: [
        "Orthopedic implants — trauma plates, bone screws, spinal fixation hardware",
        "Dental implants and abutments",
        "Surgical instruments requiring high toughness",
        "Cryogenic components where low-temperature toughness is critical",
        "Aerospace structural fittings requiring high reliability",
        "High-performance marine hardware"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "ELI Grade 4 titanium serves as a material of choice across these industries:",
      items: [
        "Medical — Orthopedic implants, dental implants, surgical instruments",
        "Aerospace — Structural components requiring high fracture toughness",
        "Cryogenic — Liquid gas storage and handling equipment",
        "Defense — Military hardware requiring high reliability",
        "Marine — Components subject to high cyclic loading"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, ELI Grade 4 may be substituted by:",
      items: [
        "Standard Grade 4 (CP-Ti) — Lower cost but reduced ductility and toughness",
        "Grade 23 (Ti-6Al-4V ELI) — Higher strength medical-grade alternative",
        "Grade 5 (Ti-6Al-4V) — Higher strength but lower corrosion resistance in some environments",
        "316LVM Stainless Steel — Lower cost but heavier and less biocompatible"
      ]
    },
    faqs: [
      { question: "What is ELI Grade 4 titanium?", answer: "ELI Grade 4 is a modified version of standard CP-Ti Grade 4 with strictly controlled lower limits of interstitial elements, delivering significantly improved ductility and fracture toughness." },
      { question: "What medical applications use ELI Grade 4?", answer: "ELI Grade 4 is preferred for trauma plates, bone screws, spinal fixation hardware, dental implants, and surgical instruments." },
      { question: "What certifications do you provide for ELI Grade 4?", answer: "Each order includes EN 10204 Type 3.1 MTRs per ASTM F67 ELI, CMM inspection, surface finish measurements, and passivation certification per ASTM F86." }
    ],
    whyChooseUs: "BOZE CNC Ti is a medical-grade manufacturer of ELI Grade 4 components. Our ISO 13485 facility processes certified ASTM F67 ELI material with full traceability from certified mill sources."
  },

  "grade-5": {
  key: "grade-5",
    name: "Grade 5 – Ti-6Al-4V Titanium Alloy",
    nameCn: "Ti-6Al-4V 5级钛合金",
    uns: "UNS R56400",
    tagline: "The most widely used titanium alloy — the industry workhorse for aerospace, medical, and high-performance applications.",
    badge: "Alpha-Beta Alloy",
    highlight: "Grade 5",
    subtitle: "Ti-6Al-4V (Grade 5, UNS R56400) — the most widely specified titanium alloy worldwide, accounting for approximately 50% of global titanium consumption. This alpha-beta alloy delivers an exceptional strength-to-weight ratio with excellent corrosion resistance up to 400°C.",
    pageTitle: "Grade 5 Titanium (Ti-6Al-4V) | Properties, Heat Treatment & Applications",
    metaDescription: "Explore Grade 5 Ti-6Al-4V titanium alloy — the most widely used titanium grade. Learn about its mechanical properties, applicable standards, processing methods, heat treatment, and critical applications across aerospace, medical, and industrial sectors.",
    entityDefinition: {
      title: "What is Grade 5 Titanium (Ti-6Al-4V)?",
      description: "Grade 5 (Ti-6Al-4V) is the most widely used titanium alloy, accounting for approximately 50% of all titanium consumption globally. It is an alpha-beta alloy containing 6% aluminum (alpha stabilizer) and 4% vanadium (beta stabilizer), providing an excellent balance of strength, ductility, fracture toughness, and corrosion resistance at temperatures up to 400°C (750°F).",
      classification: "Alpha-Beta Titanium Alloy (α+β)",
      commonNames: ["Ti-6Al-4V", "Grade 5", "UNS R56400", "Ti64", "AMS 4928", "ASTM B265 Grade 5"],
      keyCharacteristics: [
        "Best combination of strength, weight, and corrosion resistance among titanium alloys",
        "Heat treatable — strength can be tailored via solution treatment and aging",
        "Excellent fatigue properties for cyclic loading applications",
        "Good weldability with proper filler metal and shielding",
        "Service temperature up to 400°C (750°F) in oxidizing environments",
        "Industry standard for aerospace structural components"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 5 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "ASTM F136 — Wrought Titanium-6Al-4V ELI for Surgical Implants",
        "ASTM F1472 — Wrought Titanium-6Al-4V for Surgical Implants",
        "AMS 4911 — Sheet, Strip, and Plate",
        "AMS 4928 — Bars, Wire, and Forgings",
        "AMS 4967 — Bars and Forgings (Solution Heat Treated and Aged)",
        "ISO 5832-3 — Implants for Surgery",
        "DIN 17851 — Ti-6Al-4V",
        "NACE MR0175 / ISO 15156 — Oilfield Equipment"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 5 Ti-6Al-4V (annealed condition, unless noted):",
      properties: [
        { label: "Tensile Strength (min, annealed)", value: "895 MPa (130 ksi)" },
        { label: "Tensile Strength (STA condition)", value: "1,070 MPa (155 ksi)" },
        { label: "Yield Strength 0.2% Offset (min, annealed)", value: "828 MPa (120 ksi)" },
        { label: "Yield Strength 0.2% Offset (STA)", value: "1,000 MPa (145 ksi)" },
        { label: "Elongation (min, annealed)", value: "10%" },
        { label: "Elongation (STA)", value: "8%" },
        { label: "Reduction of Area", value: "25%" },
        { label: "Hardness (HRC, annealed)", value: "≤ 36 HRC" },
        { label: "Hardness (HRC, STA)", value: "≤ 41 HRC" },
        { label: "Density", value: "4.43 g/cm³ (0.160 lb/in³)" },
        { label: "Elastic Modulus", value: "114 GPa (16.5 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "7.2 W/(m·K)" },
        { label: "Electrical Resistivity", value: "170 µΩ·cm" },
        { label: "Max Service Temperature", value: "400°C (750°F)" },
        { label: "Fracture Toughness KIC (annealed)", value: "50–65 MPa√m" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 5 Ti-6Al-4V can be processed using the following manufacturing techniques:",
      items: [
        "CNC machining — Fair to good with sharp carbide tools, rigid setups, and heavy coolant flow",
        "5-axis CNC machining — Ideal for complex aerospace structural components and impellers",
        "Wire EDM — Suitable for intricate cutouts and hard-to-machine geometries",
        "TIG welding — Requires matching filler metal (ERTi-5) and strict inert gas shielding",
        "Laser beam welding — Good weld quality with proper joint design and shielding",
        "Electron beam welding — Excellent for deep penetration welds in vacuum",
        "Vacuum annealing — At 700–800°C (1,300–1,475°F) to relieve residual stresses",
        "Solution treatment & aging (STA) — Solution at 920–960°C, water quench, age at 480–590°C",
        "Hot isostatic pressing (HIP) — At 920°C / 100 MPa to eliminate internal porosity",
        "Forging — Alpha-beta forging at 920–980°C or beta forging at 1,040–1,120°C",
        "Hot forming — At 730–815°C (1,350–1,500°F)",
        "Chemical milling — HF/HNO₃ etching for weight reduction"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 5 Ti-6Al-4V is commonly fabricated into the following downstream products:",
      items: [
        "Aerospace structural components — wing boxes, fuselage frames, landing gear",
        "Gas turbine engine components — fan blades, compressor disks, casings",
        "Airframe fasteners — bolts, nuts, rivets (often in STA condition)",
        "Orthopedic implants — hip stems, knee components, bone plates, screws",
        "Dental implants and prostheses",
        "Chemical processing equipment — high-pressure reactors, valves",
        "Marine propellers and propulsion shafts",
        "Automotive connecting rods, valves, and suspension springs",
        "Oil & gas downhole tools and completion equipment",
        "Sports equipment — golf club heads, bicycle frames, tennis rackets"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 5 Ti-6Al-4V serves as a material of choice across these industries:",
      items: [
        "Aerospace — Airframes, engines, fasteners (largest consuming sector)",
        "Medical — Orthopedic and dental implants, surgical instruments",
        "Defense & military — Armor, aircraft components, naval systems",
        "Chemical processing — High-performance process equipment",
        "Oil & gas — Downhole tools, subsea equipment, piping",
        "Marine — Propellers, shafts, seawater systems",
        "Automotive — Performance and racing components",
        "Power generation — Steam turbine blades, heat exchanger components",
        "Sports & recreation — High-end sporting goods"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 5 may be substituted by:",
      items: [
        "Grade 23 (Ti-6Al-4V ELI) — Improved fracture toughness and ductility for medical and cryogenic applications",
        "Grade 6 (Ti-5Al-2.5Sn) — Better elevated-temperature performance for specific aerospace applications",
        "Grade 19 (Ti-10V-2Fe-3Al) — Higher strength beta alloy for forging applications",
        "INCONEL 718 — Higher temperature capability for turbine engine applications at higher weight",
        "17-4PH Stainless Steel — Lower cost alternative for less demanding environments",
        "7075-T6 Aluminum — Lighter but lower strength and temperature capability"
      ]
    },
    faqs: [
      { question: "What is Grade 5 titanium (Ti-6Al-4V) and what makes it the most widely used titanium alloy?", answer: "Grade 5 (Ti-6Al-4V) is an alpha-beta titanium alloy containing 6% aluminum and 4% vanadium. It accounts for approximately 50% of global titanium consumption due to its exceptional strength-to-weight ratio, corrosion resistance, and heat treatability up to 400°C. It is the default choice for aerospace structures, medical implants, and high-performance industrial components." },
      { question: "What machining tolerances can you hold on Grade 5 titanium components?", answer: "We consistently achieve machining tolerances up to ±0.005 mm (±0.0002 in) on Grade 5 Ti-6Al-4V using our 5-axis DMG Mori and Mazak machining centers with high-pressure coolant systems. All critical dimensions are verified by CMM inspection per AS9102 first article requirements." },
      { question: "What certifications do you provide with machined Grade 5 titanium parts?", answer: "Every order includes EN 10204 Type 3.1 Material Test Reports (MTRs) documenting chemical composition and mechanical properties. CMM dimensional inspection reports, surface finish measurements, and material traceability documentation are provided. Aerospace orders include AS9102 first article inspection and NADCAP NDT reports upon request." },
      // G5 — comparison FAQs (added in 2026-08 semantic cluster pass)
      { question: "Grade 5 vs Grade 23 titanium — what is the difference?", answer: "Grade 5 (Ti-6Al-4V) and Grade 23 (Ti-6Al-4V ELI) share the same alpha-beta chemistry, but Grade 23 uses tighter interstitial limits (oxygen ≤0.13% vs 0.20%, plus stricter N/C/H caps). The ELI chemistry of Grade 23 delivers measurably better ductility, fracture toughness, and fatigue life, which is why Grade 23 is the default for medical implants and cryogenic service. Grade 5 remains the higher-strength, lower-cost workhorse for aerospace structures, automotive, and industrial applications where ELI limits are not required." },
      { question: "Can Grade 5 titanium be used for medical implants?", answer: "Grade 5 Ti-6Al-4V is approved for some non-implant surgical instruments and external fracture-fixation hardware under ASTM F136 (when certified to ELI limits). For permanent implantable devices that experience long-term cyclic loading — orthopedic stems, spinal cages, dental implants — Grade 23 (ELI) is strongly preferred because the lower interstitials improve fatigue performance and biocompatibility margin. BOZE supplies both grades with full ASTM F136 / ISO 5832-3 traceability." }
    ],
    whyChooseUs: "BOZE CNC Ti is a leading precision manufacturer of Grade 5 Ti-6Al-4V components, trusted by aerospace OEMs, medical device companies, and industrial equipment manufacturers worldwide. Our fully integrated facility sources 100% certified Ti-6Al-4V stock — bars, forgings, plate, and sheet — and transforms them into complex, high-tolerance components using state-of-the-art 5-axis CNC machining centers, precision turning, and wire EDM. Every component is produced under AS9100D and ISO 9001:2015 quality systems, with full material traceability from mill to finished part. Our engineering team provides 24-hour DFM review and competitive quoting, backed by decades of metallurgical expertise in titanium processing."
  },

  "grade-23": {
    key: "grade-23",
    name: "Grade 23 – Ti-6Al-4V ELI Medical Titanium",
    nameCn: "Ti-6Al-4V ELI 23级医疗级钛合金",
    uns: "UNS R56401",
    tagline: "Extra-low interstitial Ti-6Al-4V with superior fracture toughness for medical implants and cryogenic service.",
    badge: "Alpha-Beta Alloy (Medical)",
    highlight: "Grade 23 ELI",
    subtitle: "Ti-6Al-4V ELI (Grade 23, UNS R56401) — the medical-grade variant of Ti-6Al-4V with extra-low interstitial elements (oxygen ≤0.13%, nitrogen, carbon) for enhanced fracture toughness, ductility, and fatigue resistance in implantable medical devices and cryogenic applications.",
    pageTitle: "Grade 23 Titanium (Ti-6Al-4V ELI) | Medical-Grade Titanium Alloy",
    metaDescription: "Explore Grade 23 Ti-6Al-4V ELI titanium alloy — the premier medical-grade material for orthopedic and dental implants. Learn about its enhanced fracture toughness, applicable standards, processing methods, and critical applications in healthcare.",
    entityDefinition: {
      title: "What is Grade 23 Titanium (Ti-6Al-4V ELI)?",
      description: "Grade 23 (Ti-6Al-4V ELI, Extra Low Interstitial) is a modified version of Grade 5 Ti-6Al-4V with reduced oxygen content (maximum 0.13% vs 0.20% in Grade 5) and tighter control of nitrogen, carbon, and hydrogen. This ELI chemistry significantly improves ductility, fracture toughness, and fatigue performance, making it the preferred material for implantable medical devices and cryogenic applications requiring superior reliability.",
      classification: "Alpha-Beta Titanium Alloy (α+β) — ELI Modification",
      commonNames: ["Ti-6Al-4V ELI", "Grade 23", "UNS R56401", "ASTM F136", "Medical Grade Titanium"],
      keyCharacteristics: [
        "Superior fracture toughness (KIC) compared to standard Grade 5",
        "Enhanced ductility and fatigue resistance for long-term implant reliability",
        "Excellent biocompatibility — ISO 10993 compliant",
        "Reduced notch sensitivity for improved performance in threaded implant designs",
        "Cryogenic-grade toughness — suitable for LNG and liquid hydrogen service",
        "Corrosion resistance equivalent to standard Ti-6Al-4V"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 23 titanium conforms to the following international material standards:",
      items: [
        "ASTM F136 — Wrought Titanium-6Al-4V ELI for Surgical Implant Applications",
        "ASTM B265 — Sheet, Strip, and Plate (when specified as ELI)",
        "ASTM B348 — Bars and Billets (ELI)",
        "ASTM B381 — Forgings (ELI)",
        "ISO 5832-3 — Implants for Surgery",
        "AMS 4930 — Sheet, Strip, and Plate (Ti-6Al-4V ELI)",
        "AMS 4931 — Bars, Wire, and Forgings (Ti-6Al-4V ELI)",
        "NACE MR0175 / ISO 15156 — Oilfield Equipment (ELI)"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 23 Ti-6Al-4V ELI (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "860 MPa (125 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "795 MPa (115 ksi)" },
        { label: "Elongation (min)", value: "10%" },
        { label: "Reduction of Area", value: "25%" },
        { label: "Hardness (HRC)", value: "≤ 36 HRC" },
        { label: "Fracture Toughness KIC", value: "70–85 MPa√m" },
        { label: "Density", value: "4.43 g/cm³ (0.160 lb/in³)" },
        { label: "Elastic Modulus", value: "114 GPa (16.5 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Max Oxygen Content", value: "≤ 0.13%" },
        { label: "Thermal Conductivity", value: "7.2 W/(m·K)" },
        { label: "Cryogenic Operating Temperature", value: "Down to -269°C (-452°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 23 Ti-6Al-4V ELI can be processed using the following manufacturing techniques:",
      items: [
        "CNC machining — Similar to Grade 5; requires carbide tooling and rigid setups",
        "Swiss-type CNC turning — Ideal for small-diameter implant screws and pins",
        "TIG welding — Requires low-interstitial filler metal (ERTi-23) and strict shielding",
        "Laser welding — Suitable for implant assembly with proper parameter control",
        "Electron beam welding — Deep, narrow welds with minimal heat-affected zone",
        "Vacuum annealing — At 700–800°C to relieve stresses and optimize properties",
        "Hot isostatic pressing (HIP) — At 920°C / 100 MPa to ensure full density",
        "Forging — Alpha-beta forging at 920–980°C",
        "Surface treatment — Passivation, anodizing, plasma spraying for osseointegration",
        "Electropolishing — Produces mirror finish for reduced bacterial adhesion"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 23 Ti-6Al-4V ELI is commonly fabricated into the following downstream products:",
      items: [
        "Orthopedic implants — hip stems, acetabular cups, knee components, trauma plates",
        "Spinal implants — pedicle screws, rods, interbody cages",
        "Dental implants — abutments, screw-retained crowns, mini-implants",
        "Cranio-maxillofacial plates and screws",
        "Cardiovascular devices — pacemaker cases, heart valve components",
        "Cryogenic vessels and piping for LNG and liquid hydrogen",
        "Aerospace components requiring high fracture toughness at low temperatures",
        "Subsea oil & gas equipment for deepwater service",
        "High-reliability fasteners for critical applications"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 23 Ti-6Al-4V ELI serves as a material of choice across these industries:",
      items: [
        "Medical — Orthopedic, spinal, dental, and cardiovascular implants",
        "Cryogenic — LNG processing, liquid hydrogen storage and transport",
        "Aerospace — Low-temperature structural components, high-reliability fasteners",
        "Oil & gas — Subsea equipment requiring high toughness",
        "Pharmaceutical — Processing equipment requiring extreme cleanliness",
        "Defense — Naval and aerospace systems requiring cryogenic performance"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 23 may be substituted by:",
      items: [
        "Grade 5 (Ti-6Al-4V) — Lower cost but reduced fracture toughness and ductility",
        "Grade 5 ELI (ASTM F1472) — Alternative medical-grade specification",
        "Ti-6Al-7Nb (Grade 21) — Vanadium-free alternative for medical implants",
        "CP-Ti Grade 4 — Lower strength but higher ductility for non-load-bearing implants",
        "Co-Cr-Mo Alloy (ASTM F75) — Higher wear resistance for bearing surfaces",
        "316LVM Stainless Steel — Lower cost but heavier and less biocompatible"
      ]
    },
    faqs: [
      { question: "What is Grade 23 titanium (Ti-6Al-4V ELI) and how is it different from standard Grade 5?", answer: "Grade 23 (Ti-6Al-4V ELI) is an Extra Low Interstitial variant of Grade 5 with tightly controlled oxygen (≤0.13%), nitrogen, and carbon limits. This ELI chemistry delivers superior fracture toughness, ductility, and fatigue resistance, making it the preferred material for implantable medical devices and cryogenic applications where reliability is critical." },
      { question: "Can you machine Grade 23 ELI titanium for medical implant applications?", answer: "Yes. We machine Grade 23 Ti-6Al-4V ELI in our ISO 13485-compliant facility using Swiss-type CNC turning and 5-axis milling. We achieve tolerances up to ±0.003 mm (±0.00012 in) with surface finishes down to Ra 0.1 µm. All medical components are processed under strict process controls with full batch traceability." },
      { question: "What certifications do you provide with Grade 23 titanium medical components?", answer: "Every medical order includes EN 10204 Type 3.1 MTRs documenting chemical composition per ASTM F136, CMM dimensional inspection reports, surface finish verification, and passivation certification. UDI-compliant laser marking and FDA/ISO 13485 DHR traceability are available." },
      // G5 — comparison FAQs (added in 2026-08 semantic cluster pass)
      { question: "Grade 23 vs Grade 5 titanium — which is better for medical implants?", answer: "For permanent, load-bearing implantable devices (orthopedic stems, spinal cages, dental implants, fracture-fixation plates that remain in the body), Grade 23 (Ti-6Al-4V ELI) is the preferred material because its lower interstitial content yields measurably higher fatigue life and fracture toughness. Grade 5 can be used for non-implant surgical instruments, external fixators, and short-term devices, but the ELI variant is required where long-term biocompatibility and cyclic loading intersect." },
      { question: "Can Grade 23 and Grade 5 titanium be used interchangeably for machining?", answer: "No — not for regulated applications. They share the same nominal chemistry, so machinability, tool selection, and CMM inspection workflow are essentially identical, but the MTR must declare the correct UNS number (R56400 vs R56401) and the applicable standard (ASTM F136 for Grade 23, AMS 4928 / AMS 4911 for Grade 5). Substituting Grade 5 for a Grade 23 callout will fail medical device audits even when dimensional results are equivalent." }
    ],
    whyChooseUs: "BOZE CNC Ti is a trusted medical-grade precision manufacturer specializing in Grade 23 Ti-6Al-4V ELI components for orthopedic, dental, and spinal implant applications. Our ISO 13485-certified facility processes certified ASTM F136 material through Swiss-type CNC turning, 5-axis milling, and advanced surface finishing. Every component is produced with full material traceability from certified mill sources, CMM dimensional verification, and passivation per ASTM F86. Our engineering team provides confidential 24-hour DFM review for medical device drawings, with complete documentation packages for FDA/ISO 13485 compliance."
  },

  "grade-6": {
    key: "grade-6",
    name: "Grade 6 – Ti-5Al-2.5Sn Titanium Alloy",
    nameCn: "Ti-5Al-2.5Sn 6级钛合金",
    uns: "UNS R54520",
    tagline: "A medium-strength alpha titanium alloy with good elevated-temperature stability and weldability.",
    badge: "Alpha Titanium Alloy",
    highlight: "Grade 6",
    subtitle: "Ti-5Al-2.5Sn (Grade 6, UNS R54520) — a near-alpha titanium alloy stabilized with aluminum and tin offering excellent elevated-temperature strength, oxidation resistance, and creep performance up to 480°C (900°F) with superior weldability.",
    pageTitle: "Grade 6 Titanium (Ti-5Al-2.5Sn) | Alpha Titanium Alloy Properties",
    metaDescription: "Explore Grade 6 Ti-5Al-2.5Sn titanium alloy — a medium-strength near-alpha alloy. Learn about its elevated-temperature properties, applicable standards, processing methods, and typical applications in aerospace and industrial sectors.",
    entityDefinition: {
      title: "What is Grade 6 Titanium (Ti-5Al-2.5Sn)?",
      description: "Grade 6 (Ti-5Al-2.5Sn) is a near-alpha titanium alloy stabilized with 5% aluminum and 2.5% tin. It offers an excellent combination of medium strength, oxidation resistance, and creep strength at elevated temperatures up to 480°C (900°F). Its alpha-phase microstructure provides superior weldability and thermal stability compared to alpha-beta alloys.",
      classification: "Near-Alpha Titanium Alloy",
      commonNames: ["Ti-5Al-2.5Sn", "Grade 6", "UNS R54520", "AMS 4926"],
      keyCharacteristics: [
        "Excellent elevated-temperature strength and creep resistance up to 480°C",
        "Good oxidation resistance for continuous high-temperature service",
        "Superior weldability compared to alpha-beta alloys",
        "Medium strength with good ductility and formability",
        "Excellent thermal stability — no significant embrittlement after prolonged thermal exposure",
        "Good corrosion resistance in oxidizing environments"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 6 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "AMS 4926 — Bars, Wire, and Forgings",
        "AMS 4910 — Sheet, Strip, and Plate",
        "DIN 17851 — Ti-5Al-2.5Sn"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature and elevated-temperature properties for Grade 6 Ti-5Al-2.5Sn (annealed condition):",
      properties: [
        { label: "Tensile Strength (min, room temp)", value: "790 MPa (115 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "760 MPa (110 ksi)" },
        { label: "Elongation (min)", value: "10%" },
        { label: "Reduction of Area", value: "25%" },
        { label: "Hardness (HRC)", value: "≤ 36 HRC" },
        { label: "Density", value: "4.48 g/cm³ (0.162 lb/in³)" },
        { label: "Elastic Modulus", value: "110 GPa (15.9 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,600–1,700°C (2,912–3,092°F)" },
        { label: "Max Continuous Service Temperature", value: "480°C (900°F)" },
        { label: "Creep Resistance", value: "Good up to 480°C / 170 MPa" },
        { label: "Thermal Conductivity", value: "7.5 W/(m·K)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 6 Ti-5Al-2.5Sn can be processed using the following manufacturing techniques:",
      items: [
        "CNC machining — Good; machines better than Ti-6Al-4V due to alpha-phase stability",
        "TIG welding — Excellent; lower susceptibility to weld cracking than alpha-beta alloys",
        "Laser welding — Good quality with standard titanium welding practices",
        "Forging — At 950–1,050°C (1,742–1,922°F) with controlled cooling",
        "Hot forming — At 650–760°C (1,200–1,400°F)",
        "Cold forming — Limited; requires annealing between operations",
        "Annealing — At 720–845°C (1,325–1,550°F) with air cooling",
        "Chemical etching — Standard HF/HNO₃ solutions"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 6 Ti-5Al-2.5Sn is commonly fabricated into the following downstream products:",
      items: [
        "Aircraft engine components — compressor cases, vanes, ducts",
        "Airframe structures near engine nacelles and exhaust areas",
        "High-temperature fasteners for hot-section assembly",
        "Missile and rocket components experiencing aerodynamic heating",
        "Chemical processing equipment for high-temperature service",
        "Automotive exhaust system components",
        "Heat-affected zone components in welded assemblies"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 6 Ti-5Al-2.5Sn serves as a material of choice across these industries:",
      items: [
        "Aerospace — Engine components, airframe hot-sections, missile structures",
        "Defense — High-temperature missile and propulsion systems",
        "Chemical processing — High-temperature reactors and heat exchangers",
        "Automotive — Performance exhaust systems and heat shields",
        "Power generation — Gas turbine hot-gas path components",
        "Marine — High-temperature exhaust system components"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 6 may be substituted by:",
      items: [
        "Grade 5 (Ti-6Al-4V) — Higher room-temperature strength but lower elevated-temperature capability",
        "Ti-6Al-2Sn-4Zr-2Mo (Grade 6242) — Superior high-temperature performance for advanced engines",
        "INCONEL 718 — Higher temperature capability at significantly higher weight and cost",
        "Ti-8Al-1Mo-1V — Higher-temperature alpha alloy alternative",
        "Stainless Steel 321 — Lower-cost alternative for moderate temperature service"
      ]
    },
    faqs: [
      { question: "What is Grade 6 titanium (Ti-5Al-2.5Sn)?", answer: "Grade 6 is a near-alpha titanium alloy offering excellent elevated-temperature strength, oxidation resistance, and creep performance up to 480°C." },
      { question: "What aerospace applications use Grade 6?", answer: "Grade 6 is used in gas turbine engine components, airframe structures near engine nacelles, high-temperature fasteners, and rocket components." },
      { question: "Can you machine and weld Grade 6 titanium?", answer: "Yes. We machine Grade 6 on multi-axis CNC centers and perform TIG welding. Post-weld heat treatment is typically required to restore properties." }
    ],
    whyChooseUs: "BOZE CNC Ti manufactures precision Grade 6 components for aerospace and high-temperature applications with AS9100D quality systems and NADCAP NDT."
  },

  "grade-9": {
    key: "grade-9",
    name: "Grade 9 – Ti-3Al-2.5V Titanium Alloy",
    nameCn: "Ti-3Al-2.5V 9级钛合金",
    uns: "UNS R56320",
    tagline: "A medium-strength, highly formable titanium alloy — the preferred material for seamless tubing.",
    badge: "Alpha-Beta Alloy",
    highlight: "Grade 9",
    subtitle: "Ti-3Al-2.5V (Grade 9, UNS R56320) — a medium-strength alpha-beta titanium alloy offering an exceptional combination of formability and strength. Widely used for aerospace hydraulic tubing, sports equipment, and lightweight structural applications.",
    pageTitle: "Grade 9 Titanium (Ti-3Al-2.5V) | Medium-Strength Titanium Alloy",
    metaDescription: "Explore Grade 9 Ti-3Al-2.5V titanium alloy — a medium-strength alpha-beta alloy with excellent formability. Learn about its mechanical properties, applicable standards, processing methods, and typical applications.",
    entityDefinition: {
      title: "What is Grade 9 Titanium (Ti-3Al-2.5V)?",
      description: "Grade 9 (Ti-3Al-2.5V) is a medium-strength alpha-beta titanium alloy that provides a balance of strength and formability superior to CP titanium grades while being more readily formable than Grade 5 (Ti-6Al-4V). It is particularly valued for its excellent cold formability, making it the standard material for aerospace hydraulic and pneumatic tubing systems.",
      classification: "Alpha-Beta Titanium Alloy (α+β)",
      commonNames: ["Ti-3Al-2.5V", "Grade 9", "UNS R56320", "Ti-3-2.5", "Half 6-4"],
      keyCharacteristics: [
        "Excellent cold formability — superior to Grade 5 (Ti-6Al-4V)",
        "Good strength-to-weight ratio between CP grades and Ti-6Al-4V",
        "Outstanding corrosion resistance — equivalent to CP titanium",
        "Good weldability with proper process controls",
        "Preferred material for thin-wall seamless tubing",
        "Excellent fatigue strength in tubular form"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 9 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "ASTM B861 — Seamless Pipe and Tube",
        "AMS 4944 — Seamless Hydraulic Tubing",
        "AMS 4945 — Welded Hydraulic Tubing",
        "DIN 17851 — Ti-3Al-2.5V",
        "MIL-T-9046 — Titanium Alloy Tubing"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Grade 9 Ti-3Al-2.5V (annealed condition):",
      properties: [
        { label: "Tensile Strength (min)", value: "620 MPa (90 ksi)" },
        { label: "Yield Strength 0.2% Offset (min)", value: "520 MPa (75 ksi)" },
        { label: "Elongation (min)", value: "15%" },
        { label: "Reduction of Area", value: "30%" },
        { label: "Hardness (HRC)", value: "≤ 30 HRC" },
        { label: "Density", value: "4.48 g/cm³ (0.162 lb/in³)" },
        { label: "Elastic Modulus", value: "100 GPa (14.5 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,668°C (3,034°F)" },
        { label: "Thermal Conductivity", value: "8.5 W/(m·K)" },
        { label: "Max Service Temperature", value: "316°C (600°F)" },
        { label: "Bend Radius (tube, min)", value: "2D to 3D depending on wall thickness" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 9 Ti-3Al-2.5V can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Excellent; can be bent into tight radii without cracking",
        "Tube bending — Rotary draw bending, press bending, and roll bending all applicable",
        "CNC machining — Good; easier to machine than Grade 5 (Ti-6Al-4V)",
        "TIG welding — Good; requires matching filler metal and inert gas shielding",
        "Laser welding — Acceptable for thin-wall tubing",
        "Orbital TIG welding — Standard method for tube butt joints",
        "Hydroforming — Excellent formability for complex tube shapes",
        "Annealing — At 700–790°C (1,290–1,450°F) followed by air cooling",
        "Chemical pickling — Good response to standard HF/HNO₃ solutions"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 9 Ti-3Al-2.5V is commonly fabricated into the following downstream products:",
      items: [
        "Aerospace hydraulic tubing — fluid power lines, landing gear systems",
        "Aerospace pneumatic ducting and bleed air systems",
        "Instrumentation tubing for chemical and pharmaceutical plants",
        "Bicycle frames and handlebars",
        "Golf club shafts",
        "Automotive exhaust tubing and muffler components",
        "Heat exchanger tubing in corrosive environments",
        "Seawater piping systems requiring lightweight corrosion-resistant tubing",
        "Scuba tank liners and lightweight pressure vessels"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 9 Ti-3Al-2.5V serves as a material of choice across these industries:",
      items: [
        "Aerospace — Hydraulic systems, pneumatic ducting, fuel lines",
        "Chemical processing — Instrumentation tubing, heat exchanger tubing",
        "Sports & recreation — Bicycle frames, golf shafts, tennis rackets",
        "Automotive — Performance exhaust systems, roll cages",
        "Marine — Seawater piping, instrument enclosures",
        "Oil & gas — Control line tubing, chemical injection lines"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 9 may be substituted by:",
      items: [
        "Grade 2 (CP-Ti) — Lower strength but better formability for less demanding applications",
        "Grade 5 (Ti-6Al-4V) — Higher strength but significantly less formable",
        "Grade 21 (Ti-15V-3Cr-3Sn-3Al) — Higher strength alternative for thin-wall applications",
        "304L Stainless Steel — Lower cost tubing material with good formability",
        "AISI 4130 Chromoly Steel — Higher strength-to-cost ratio for bicycle frames"
      ]
    },
    faqs: [
      { question: "What is Grade 9 titanium (Ti-3Al-2.5V)?", answer: "Grade 9 is a medium-strength alpha-beta alloy offering an excellent balance of strength and formability, making it the standard for aerospace hydraulic tubing." },
      { question: "What tube capabilities do you offer for Grade 9?", answer: "We process Grade 9 tubing through CNC bending, orbital TIG welding, and laser cutting with tube diameters from 6 mm to 220 mm." },
      { question: "What industries use Grade 9 titanium?", answer: "Grade 9 is used in aerospace hydraulic systems, chemical processing tubing, bicycle frames, automotive exhaust, and marine piping." }
    ],
    whyChooseUs: "BOZE CNC Ti specializes in Grade 9 titanium tubing assemblies and machined components with full material traceability and AS9100D quality systems."
  },

  "grade-19": {
    key: "grade-19",
    name: "Grade 19 – Ti-10V-2Fe-3Al Beta Titanium",
    nameCn: "Ti-10V-2Fe-3Al 19级贝塔钛合金",
    uns: "UNS R56410",
    tagline: "A high-strength beta titanium alloy designed for forged aerospace structural components.",
    badge: "Beta Titanium Alloy",
    highlight: "Grade 19",
    subtitle: "Ti-10V-2Fe-3Al (Grade 19, UNS R56410) — a deep-hardenable beta titanium alloy developed for high-strength forgings. Offers tensile strength up to 1,240 MPa (180 ksi) with excellent fracture toughness, making it ideal for heavy-section landing gear and airframe components.",
    pageTitle: "Grade 19 Titanium (Ti-10V-2Fe-3Al) | Beta Titanium Alloy Properties",
    metaDescription: "Explore Grade 19 Ti-10V-2Fe-3Al beta titanium alloy — a high-strength forging alloy for aerospace structural applications. Learn about its mechanical properties, heat treatment, standards, and processing methods.",
    entityDefinition: {
      title: "What is Grade 19 Titanium (Ti-10V-2Fe-3Al)?",
      description: "Grade 19 (Ti-10V-2Fe-3Al) is a beta-rich titanium alloy developed specifically for high-strength forged components. Its deep hardenability allows uniform mechanical properties through thick sections — a critical advantage over alpha-beta alloys that exhibit property gradients in heavy cross-sections. It achieves tensile strengths up to 1,240 MPa (180 ksi) with good fracture toughness.",
      classification: "Beta Titanium Alloy (β-rich)",
      commonNames: ["Ti-10V-2Fe-3Al", "Grade 19", "UNS R56410", "Ti-10-2-3"],
      keyCharacteristics: [
        "Very high strength — up to 1,240 MPa (180 ksi) achievable",
        "Deep hardenability — uniform properties through thick sections",
        "Excellent forgeability in the beta phase field",
        "Good fracture toughness at high strength levels",
        "Superior fatigue strength for heavy-section structural components",
        "Heat treatable with solution treatment and aging"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 19 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "AMS 4983 — Forgings (Ti-10V-2Fe-3Al)",
        "AMS 4984 — Bars and Forgings (Solution Heat Treated and Aged)",
        "AMS 4985 — Bars, Wire, and Rings"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical properties for Grade 19 Ti-10V-2Fe-3Al (solution treated and aged condition):",
      properties: [
        { label: "Tensile Strength (min, STA)", value: "1,170–1,240 MPa (170–180 ksi)" },
        { label: "Yield Strength 0.2% Offset (min, STA)", value: "1,100–1,170 MPa (160–170 ksi)" },
        { label: "Elongation (min)", value: "6–10%" },
        { label: "Reduction of Area", value: "15–20%" },
        { label: "Fracture Toughness KIC", value: "35–55 MPa√m" },
        { label: "Density", value: "4.65 g/cm³ (0.168 lb/in³)" },
        { label: "Elastic Modulus", value: "110 GPa (15.9 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,600–1,700°C (2,912–3,092°F)" },
        { label: "Beta Transus", value: "805°C (1,481°F)" },
        { label: "Hardness (HRC)", value: "38–42 HRC" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 19 Ti-10V-2Fe-3Al can be processed using the following manufacturing techniques:",
      items: [
        "Forging — Excellent; primary application; beta forging at 820–900°C followed by controlled cooling",
        "CNC machining — Fair to good in aged condition; machines better in solution-treated condition",
        "Solution treatment — At 760–830°C (1,400–1,525°F) followed by water quenching",
        "Aging — At 480–560°C (900–1,040°F) for 8–16 hours depending on desired strength",
        "Hot forming — At 700–800°C (1,290–1,470°F)",
        "TIG welding — Limited; requires careful post-weld thermal processing to restore properties",
        "Chemical milling — Standard HF/HNO₃ solutions applicable"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 19 Ti-10V-2Fe-3Al is commonly fabricated into the following downstream products:",
      items: [
        "Aircraft landing gear components — beams, links, trunnions, truck beams",
        "Airframe structural forgings — bulkheads, wing attachments",
        "Helicopter rotor components — hubs, grips, yokes",
        "High-strength fasteners and bolts",
        "Engine mount structures and pylon attachments",
        "Heavy-section aerospace structural nodes",
        "High-performance automotive connecting rods and suspension components"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 19 Ti-10V-2Fe-3Al serves as a material of choice across these industries:",
      items: [
        "Aerospace — Landing gear structures, airframe forgings, rotorcraft components",
        "Defense — Military aircraft structural components",
        "Automotive — High-performance and racing components",
        "Motorsports — Suspension components, connecting rods",
        "Oil & gas — High-strength downhole tools and connectors"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 19 may be substituted by:",
      items: [
        "Grade 5 (Ti-6Al-4V) — Lower maximum strength but lower cost and more readily available",
        "Grade 21 (Ti-15V-3Cr-3Sn-3Al) — Higher strength beta strip alloy for thin sections",
        "Ti-5-5-5-3 (Ti-5Al-5V-5Mo-3Cr) — Alternative high-strength beta alloy with improved processing",
        "300M Steel — Higher modulus and lower cost for landing gear, but heavier and corrosion-prone",
        "INCONEL 718 — Higher temperature capability but significantly higher density"
      ]
    },
    faqs: [
      { question: "What is Grade 19 beta titanium (Ti-10V-2Fe-3Al)?", answer: "Grade 19 is a beta-rich titanium alloy designed for high-strength forgings with deep hardenability for thick-section aerospace components." },
      { question: "What strengths can Grade 19 achieve?", answer: "Grade 19 achieves tensile strengths up to 1,240 MPa with good fracture toughness through solution treatment and aging." },
      { question: "What processing for Grade 19?", answer: "We offer precision forging, 5-axis CNC machining, and vacuum heat treatment per AMS 2750F Class 2." }
    ],
    whyChooseUs: "BOZE CNC Ti manufactures Grade 19 beta titanium components for aerospace and defense with AS9100D certification and NADCAP NDT."
  },

  "grade-21": {
    key: "grade-21",
    name: "Grade 21 – Ti-15V-3Cr-3Sn-3Al Beta Alloy",
    nameCn: "Ti-15V-3Cr-3Sn-3Al 21级贝塔合金",
    uns: "UNS R58210",
    tagline: "A high-strength metastable beta titanium alloy with excellent cold formability for thin-gauge sheet applications.",
    badge: "Beta Titanium Alloy",
    highlight: "Grade 21",
    subtitle: "Ti-15V-3Cr-3Sn-3Al (Grade 21, UNS R58210) — a metastable beta titanium alloy offering exceptional cold formability in the solution-treated condition combined with very high strength after aging. The preferred material for complex sheet metal aerospace components and high-strength strip products.",
    pageTitle: "Grade 21 Titanium (Ti-15V-3Cr-3Sn-3Al) | Beta Titanium Alloy Properties",
    metaDescription: "Explore Grade 21 Ti-15V-3Cr-3Sn-3Al metastable beta titanium alloy. Learn about its exceptional cold formability, high strength after aging, applicable standards, processing methods, and aerospace applications.",
    entityDefinition: {
      title: "What is Grade 21 Titanium (Ti-15V-3Cr-3Sn-3Al)?",
      description: "Grade 21 (Ti-15V-3Cr-3Sn-3Al, also known as Ti-15-3) is a metastable beta titanium alloy developed for applications requiring a combination of exceptional room-temperature formability and very high post-aging strength. In the solution-treated condition, it can be cold formed similarly to CP titanium, then aged to achieve tensile strengths exceeding 1,170 MPa (170 ksi).",
      classification: "Metastable Beta Titanium Alloy (β)",
      commonNames: ["Ti-15V-3Cr-3Sn-3Al", "Grade 21", "UNS R58210", "Ti-15-3"],
      keyCharacteristics: [
        "Exceptional cold formability in solution-treated condition — formable like CP titanium",
        "Very high strength after aging — up to 1,240 MPa (180 ksi)",
        "Excellent strip and sheet product formability for complex geometries",
        "Good corrosion resistance — comparable to other titanium alloys",
        "Heat treatable with simple solution treatment and aging cycle",
        "Suitable for thin-gauge aerospace sheet metal and honeycomb structures"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 21 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "AMS 4914 — Sheet, Strip, and Plate (Ti-15V-3Cr-3Sn-3Al)",
        "AMS 4932 — Sheet, Strip, and Plate (Solution Heat Treated and Aged)",
        "AMS 4933 — Bars, Wire, and Forgings"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical properties for Grade 21 Ti-15V-3Cr-3Sn-3Al (solution treated vs. aged):",
      properties: [
        { label: "Tensile Strength (solution treated)", value: "830 MPa (120 ksi)" },
        { label: "Tensile Strength (aged)", value: "1,170–1,310 MPa (170–190 ksi)" },
        { label: "Yield Strength (solution treated)", value: "800 MPa (116 ksi)" },
        { label: "Yield Strength (aged)", value: "1,100–1,240 MPa (160–180 ksi)" },
        { label: "Elongation (solution treated)", value: "15–20%" },
        { label: "Elongation (aged)", value: "6–8%" },
        { label: "Density", value: "4.71 g/cm³ (0.170 lb/in³)" },
        { label: "Elastic Modulus", value: "100 GPa (14.5 × 10⁶ psi)" },
        { label: "Beta Transus", value: "760°C (1,400°F)" },
        { label: "Hardness (aged)", value: "40–44 HRC" },
        { label: "Cold Bend Radius (solution treated)", value: "1.5T to 2T" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 21 Ti-15V-3Cr-3Sn-3Al can be processed using the following manufacturing techniques:",
      items: [
        "Cold forming — Excellent in solution-treated condition; complex shapes can be formed at room temperature",
        "Sheet metal forming — Stamping, deep drawing, brake forming all applicable", 
        "CNC machining — Good in both ST and aged conditions",
        "TIG welding — Acceptable; post-weld aging required to restore parent metal strength",
        "Spot welding — Excellent for thin-gauge assemblies",
        "Laser welding — Suitable for precision sheet metal joining",
        "Solution treatment — At 790–815°C (1,450–1,500°F) followed by rapid air cool",
        "Aging — At 480–540°C (900–1,000°F) for 8–16 hours",
        "Chemical etching — Standard HF/HNO₃ solutions with beta-specific etch rates",
        "Anodizing — Applicable for corrosion protection and wear resistance"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 21 Ti-15V-3Cr-3Sn-3Al is commonly fabricated into the following downstream products:",
      items: [
        "Aerospace sheet metal structures — ducting, fairings, cowlings",
        "Honeycomb sandwich panels for aircraft flooring and control surfaces",
        "Aircraft spring components — landing gear springs, control system springs",
        "High-strength fasteners and rivets (cold headed)",
        "Aircraft seat tracks and interior structures",
        "Missile and rocket skin panels",
        "Lightweight armor panels for military vehicles",
        "Automotive exhaust springs and suspension components"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 21 Ti-15V-3Cr-3Sn-3Al serves as a material of choice across these industries:",
      items: [
        "Aerospace — Sheet metal structures, ducting, springs, honeycomb panels",
        "Defense — Lightweight armor, missile structures",
        "Automotive — Springs, exhaust components, crash structures",
        "Motorsports — Lightweight chassis and body panels",
        "Medical — Spring instruments and orthodontic devices"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 21 may be substituted by:",
      items: [
        "Grade 5 (Ti-6Al-4V) — Lower formability but higher modulus and lower cost for sheet applications",
        "Grade 9 (Ti-3Al-2.5V) — Lower strength but better cold formability for tubing",
        "Grade 19 (Ti-10V-2Fe-3Al) — Better for thick-section forgings but less formable in sheet form",
        "Ti-5-5-5-3 (Ti-5Al-5V-5Mo-3Cr) — Alternative high-strength beta alloy",
        "Spring steel (SAE 5160) — Lower cost for spring applications but heavier"
      ]
    },
    faqs: [
      { question: "What is Grade 21 beta titanium (Ti-15V-3Cr-3Sn-3Al)?", answer: "Grade 21 is a metastable beta alloy offering exceptional cold formability in the solution-treated condition, then aging to over 1,170 MPa." },
      { question: "What applications benefit from Grade 21?", answer: "Grade 21 is ideal for aerospace sheet metal structures, honeycomb panels, aircraft springs, and high-strength fasteners." },
      { question: "Can you form Grade 21 titanium?", answer: "Yes. In solution-treated condition it forms like CP titanium. After forming we perform vacuum aging to achieve full strength." }
    ],
    whyChooseUs: "BOZE CNC Ti manufactures Grade 21 beta titanium components for aerospace with precision forming, vacuum heat treatment, and AS9100D quality systems."
  },

  "grade-6242": {
    key: "grade-6242",
    name: "Grade 6242 – Ti-6Al-2Sn-4Zr-2Mo Aerospace Ti",
    nameCn: "Ti-6Al-2Sn-4Zr-2Mo 6242航空级钛合金",
    uns: "UNS R54620",
    tagline: "A high-temperature near-alpha titanium alloy for advanced aerospace engine and airframe applications.",
    badge: "Near-Alpha Alloy",
    highlight: "Grade 6242",
    subtitle: "Ti-6Al-2Sn-4Zr-2Mo (Grade 6242, UNS R54620) — a high-temperature near-alpha titanium alloy offering exceptional creep resistance and elevated-temperature strength up to 540°C (1,000°F). Developed for advanced gas turbine engine components and high-speed airframe structures.",
    pageTitle: "Grade 6242 Titanium (Ti-6Al-2Sn-4Zr-2Mo) | High-Temp Aerospace Alloy",
    metaDescription: "Explore Grade 6242 Ti-6Al-2Sn-4Zr-2Mo — a high-temperature near-alpha titanium alloy for aerospace. Learn about its creep resistance, mechanical properties, applicable standards, processing methods, and gas turbine engine applications.",
    entityDefinition: {
      title: "What is Grade 6242 Titanium (Ti-6Al-2Sn-4Zr-2Mo)?",
      description: "Grade 6242 (Ti-6Al-2Sn-4Zr-2Mo) is a near-alpha titanium alloy designed for high-temperature service in gas turbine engines and advanced airframes. It combines alpha-phase strength and creep resistance from aluminum and tin with solid-solution strengthening from zirconium and molybdenum. It is capable of continuous service at temperatures up to 540°C (1,000°F), significantly higher than Ti-6Al-4V.",
      classification: "Near-Alpha Titanium Alloy",
      commonNames: ["Ti-6Al-2Sn-4Zr-2Mo", "Ti-6242", "Grade 6242", "UNS R54620"],
      keyCharacteristics: [
        "Excellent high-temperature strength up to 540°C (1,000°F)",
        "Superior creep resistance for long-duration elevated-temperature service",
        "Good thermal stability — minimal microstructural degradation over service life",
        "Good oxidation resistance for continuous high-temperature operation",
        "Weldable with proper process controls and post-weld heat treatment",
        "Commonly used in the silicide-bearing variant (Ti-6242S) with 0.1% Si"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Grade 6242 titanium conforms to the following international material standards:",
      items: [
        "ASTM B265 — Sheet, Strip, and Plate",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "AMS 4919 — Sheet, Strip, and Plate",
        "AMS 4975 — Bars, Wire, and Forgings",
        "AMS 4976 — Bars, Wire, and Rings (Ti-6242S, Silicide Bearing)"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical properties for Grade 6242 Ti-6Al-2Sn-4Zr-2Mo (annealed and stabilized condition):",
      properties: [
        { label: "Tensile Strength (room temp, min)", value: "930 MPa (135 ksi)" },
        { label: "Yield Strength 0.2% Offset (room temp, min)", value: "860 MPa (125 ksi)" },
        { label: "Elongation (min)", value: "10%" },
        { label: "Tensile Strength (540°C)", value: "620 MPa (90 ksi)" },
        { label: "Yield Strength (540°C)", value: "520 MPa (75 ksi)" },
        { label: "Creep Rupture Life (540°C / 240 MPa)", value: "> 100 hours" },
        { label: "Density", value: "4.54 g/cm³ (0.164 lb/in³)" },
        { label: "Elastic Modulus", value: "114 GPa (16.5 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,630–1,720°C (2,966–3,128°F)" },
        { label: "Max Continuous Service Temperature", value: "540°C (1,000°F)" },
        { label: "Beta Transus", value: "985°C (1,805°F)" },
        { label: "Thermal Conductivity", value: "7.5 W/(m·K)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Grade 6242 Ti-6Al-2Sn-4Zr-2Mo can be processed using the following manufacturing techniques:",
      items: [
        "Forging — Alpha-beta forging at 950–1,010°C or beta forging at 1,050–1,120°C",
        "CNC machining — Fair; higher strength and hardness require carbide tooling",
        "TIG welding — Acceptable with matching filler; post-weld stress relief required",
        "Electron beam welding — Suitable for engine component fabrication",
        "Vacuum annealing — At 980°C (1,800°F) followed by controlled cooling",
        "Stabilization heat treatment — At 595°C (1,100°F) for 8 hours to optimize creep resistance",
        "Hot isostatic pressing (HIP) — At 950°C / 100 MPa for cast components",
        "Hot forming — At 730–815°C (1,350–1,500°F)",
        "Chemical etching — HF/HNO₃ solutions with temperature control"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Grade 6242 Ti-6Al-2Sn-4Zr-2Mo is commonly fabricated into the following downstream products:",
      items: [
        "Gas turbine engine components — compressor disks, blades, stators, casings",
        "High-pressure compressor drums and spools",
        "Engine rear frame and exhaust case structures",
        "Afterburner components for military engines",
        "Airframe structures in high-speed aircraft (skin panels, leading edges)",
        "Supersonic and hypersonic vehicle structures",
        "Rocket engine turbopump components",
        "High-temperature fastener systems"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Grade 6242 Ti-6Al-2Sn-4Zr-2Mo serves as a material of choice across these industries:",
      items: [
        "Aerospace — Gas turbine engines (compressor section), advanced airframes",
        "Defense — Military aircraft engines, missile structures",
        "Power generation — Industrial gas turbine components",
        "Space — Rocket engines, hypersonic vehicle structures",
        "Chemical processing — High-temperature reactors and heat exchangers"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Grade 6242 may be substituted by:",
      items: [
        "Ti-6Al-4V (Grade 5) — Lower temperature capability (<400°C) but more cost-effective for cooler sections",
        "Ti-6Al-2Sn-4Zr-2Mo-0.1Si (Ti-6242S) — Silicide-bearing variant with improved creep resistance",
        "Ti-6Al-2Sn-4Zr-6Mo — Higher strength variant for deeper section hardenability",
        "INCONEL 718 — Higher temperature capability (>650°C) at significantly higher weight and cost",
        "Waspaloy — Higher temperature capability for turbine disk applications at higher weight",
        "Ti-5.8Al-4Sn-3.5Zr-0.7Nb (IMI 834) — Higher-temperature near-alpha alloy for advanced engines"
      ]
    },
    faqs: [
      { question: "What is Grade 6242 titanium (Ti-6Al-2Sn-4Zr-2Mo)?", answer: "Grade 6242 is a near-alpha titanium alloy designed for service up to 540°C with exceptional creep resistance for gas turbine engines." },
      { question: "What engine components use Grade 6242?", answer: "Grade 6242 is used for compressor disks, blades, stators, and casings in gas turbine engines." },
      { question: "What processing for Grade 6242?", answer: "We offer precision forging, 5-axis CNC machining, and vacuum heat treatment per AMS 2750F Class 2." }
    ],
    whyChooseUs: "BOZE CNC Ti delivers Grade 6242 components for gas turbine engines with AS9100D quality systems and NADCAP NDT inspection."
  },

  "ti-5553": {
    key: "ti-5553",
    name: "Ti-5Al-5V-5Mo-3Cr High Strength Titanium",
    nameCn: "Ti-5-5-5-3高强钛合金",
    uns: "UNS R58640",
    tagline: "A next-generation high-strength beta titanium alloy replacing Ti-10V-2Fe-3Al in heavy-section forgings.",
    badge: "Beta Titanium Alloy",
    highlight: "Ti-5-5-5-3",
    subtitle: "Ti-5Al-5Mo-5V-3Cr (Ti-5-5-5-3) — a high-strength metastable beta titanium alloy offering superior hardenability, strength, and toughness compared to earlier beta alloys. Increasingly specified for large-section landing gear forgings and advanced aerospace structural components.",
    pageTitle: "Ti-5Al-5V-5Mo-3Cr (Ti-5553) | High-Strength Beta Titanium Alloy",
    metaDescription: "Explore Ti-5Al-5V-5Mo-3Cr (Ti-5553) — a next-generation high-strength beta titanium alloy. Learn about its superior hardenability, mechanical properties, heat treatment, processing methods, and landing gear applications.",
    entityDefinition: {
      title: "What is Ti-5Al-5V-5Mo-3Cr (Ti-5553)?",
      description: "Ti-5Al-5V-5Mo-3Cr (commonly known as Ti-5553) is a metastable beta titanium alloy developed as a successor to Ti-10V-2Fe-3Al (Grade 19). It offers superior deep-section hardenability — enabling uniform mechanical properties in cross-sections up to 150 mm (6 inches) — combined with an excellent balance of high strength, fracture toughness, and fatigue resistance.",
      classification: "Metastable Beta Titanium Alloy (β)",
      commonNames: ["Ti-5Al-5Mo-5V-3Cr", "Ti-5553", "UNS R58640", "High-Strength Beta Ti"],
      keyCharacteristics: [
        "Exceptional deep hardenability — uniform properties through thick sections (up to 150 mm)",
        "Very high strength — up to 1,310 MPa (190 ksi) achievable",
        "Excellent fracture toughness at high strength levels",
        "Superior fatigue crack growth resistance compared to Ti-6Al-4V",
        "Good forgeability with wide processing window",
        "Reduced processing cost vs. Ti-10V-2Fe-3Al due to wider composition tolerance",
        "Increasingly preferred for next-generation landing gear and airframe structures"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Ti-5553 titanium conforms to the following material standards:",
      items: [
        "AMS 6940 — Forgings (Ti-5Al-5V-5Mo-3Cr)",
        "AMS 6941 — Bars, Wire, and Rings",
        "ASTM B348 — Bars and Billets",
        "ASTM B381 — Forgings",
        "Various OEM specifications (Boeing, Airbus, Lockheed Martin)"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical properties for Ti-5553 (solution treated and aged condition):",
      properties: [
        { label: "Tensile Strength (min, STA)", value: "1,240–1,310 MPa (180–190 ksi)" },
        { label: "Yield Strength 0.2% Offset (min, STA)", value: "1,170–1,240 MPa (170–180 ksi)" },
        { label: "Elongation (min)", value: "6–10%" },
        { label: "Reduction of Area", value: "15–25%" },
        { label: "Fracture Toughness KIC", value: "35–55 MPa√m" },
        { label: "Density", value: "4.67 g/cm³ (0.169 lb/in³)" },
        { label: "Elastic Modulus", value: "115 GPa (16.7 × 10⁶ psi)" },
        { label: "Beta Transus", value: "845°C (1,553°F)" },
        { label: "Hardness (aged)", value: "40–45 HRC" },
        { label: "Max Section Thickness (uniform properties)", value: "150 mm (6 in)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Ti-5553 can be processed using the following manufacturing techniques:",
      items: [
        "Forging — Primary processing method; beta/sub-transus forging at 830–950°C",
        "CNC machining — Fair to good in aged condition; machines better than equivalent-strength steels",
        "Solution treatment — At 830–860°C (1,525–1,580°F) followed by water or oil quench",
        "Aging — At 580–650°C (1,075–1,200°F) for 4–8 hours depending on strength-toughness balance",
        "Hot isostatic pressing (HIP) — For cast or powder forms to eliminate porosity",
        "TIG welding — Limited; requires post-weld heat treatment to restore mechanical properties",
        "Electron beam welding — Applicable with proper process development",
        "Chemical milling — Standard HF/HNO₃ with beta alloy etching parameters"
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Ti-5553 is commonly fabricated into the following downstream products:",
      items: [
        "Large-section landing gear components — main landing gear beams, truck beams, drag braces",
        "Airframe structural forgings — wing box fittings, fuselage frames",
        "Helicopter dynamic components — rotor hubs, swashplates",
        "High-strength structural fasteners and tie rods",
        "Missile airframe structures",
        "Engine pylon and nacelle attachment structures",
        "High-performance automotive suspension and chassis components",
        "Motorsports uprights and suspension arms"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Ti-5553 serves as a material of choice across these industries:",
      items: [
        "Aerospace — Landing gear structures (increasingly preferred over Ti-10-2-3), airframe forgings",
        "Defense — Military aircraft, missile structures, armored vehicle components",
        "Automotive — High-performance suspension and chassis components",
        "Motorsports — Formula 1 and endurance racing components",
        "Oil & gas — Heavy-section high-strength downhole components"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Ti-5553 may be substituted by:",
      items: [
        "Grade 19 (Ti-10V-2Fe-3Al) — Earlier generation beta alloy with shallower hardenability",
        "Grade 5 (Ti-6Al-4V) — Lower strength but more cost-effective for smaller sections",
        "Ti-6Al-2Sn-4Zr-6Mo — Higher-temperature beta-rich alternative",
        "300M Steel — Traditional landing gear material with higher modulus but heavier",
        "INCONEL 718 — Higher temperature capability but significantly higher density"
      ]
    },
    faqs: [
      { question: "What is Ti-5Al-5V-5Mo-3Cr (Ti-5553) high-strength titanium?", answer: "Ti-5Al-5V-5Mo-3Cr, commonly known as Ti-5553, is a metastable beta titanium alloy developed as a successor to Ti-10V-2Fe-3Al (Grade 19). It offers excellent through-hardenability in thick sections up to 150 mm, combined with strengths up to 1,310 MPa (190 ksi) and superior fracture toughness." },
      { question: "What aerospace applications use Ti-5553?", answer: "Ti-5553 is increasingly specified for large landing gear forgings, airframe structural components, helicopter rotor components, and high-strength fasteners in next-generation aircraft programs. Its deep hardenability makes it ideal for heavy-section structural forgings." },
      { question: "What processing capabilities do you have for Ti-5553?", answer: "We offer precision forging, 5-axis CNC machining, and vacuum heat treatment (solution treat and age) for Ti-5553 components. Our AS9100D-compliant facility provides full material traceability, CMM dimensional verification, and NADCAP NDT inspection." }
    ],
    whyChooseUs: "BOZE CNC Ti is a precision manufacturer of Ti-5Al-5V-5Mo-3Cr (Ti-5553) high-strength beta titanium components for aerospace landing gear and structural applications. Our AS9100D-certified facility offers precision forging, 5-axis CNC machining, and vacuum heat treatment with full material traceability and NADCAP NDT inspection."
  },


  "ti-6211": {
    key: "ti-6211",
    name: "Ti-6211 – Ti-6Al-2Nb-1Ta-0.8Mo Marine Grade Titanium",
    nameCn: "Ti-6Al-2Nb-1Ta-0.8Mo 深海工程钛合金",
    uns: "UNS R56210",
    tagline: "A near-alpha titanium alloy with exceptional marine environment stress corrosion cracking resistance, developed by the U.S. Navy for deep-sea submersible hulls and naval structural applications.",
    badge: "Near-Alpha Alloy",
    highlight: "Ti-6211",
    subtitle: "Ti-6Al-2Nb-1Ta-0.8Mo (Ti-6211, UNS R56210), also known as Ti-621/0.8 — a near-alpha titanium alloy originally developed by the U.S. Navy for deep-submergence pressure hulls. Its unique Nb+Ta stabilizer system delivers exceptional stress corrosion cracking (SCC) resistance in seawater, superior fracture toughness, and excellent weldability for thick-section marine structures.",
    pageTitle: "Ti-6211 Titanium (Ti-6Al-2Nb-1Ta-0.8Mo) | Marine & Deep-Sea Alloy Properties",
    metaDescription: "Explore Ti-6211 (Ti-6Al-2Nb-1Ta-0.8Mo) near-alpha titanium alloy — the U.S. Navy-developed marine grade. Learn about its SCC resistance, fracture toughness, mechanical properties, applicable standards, welding, and deep-sea submersible applications.",
    entityDefinition: {
      title: "What is Ti-6211 Titanium (Ti-6Al-2Nb-1Ta-0.8Mo)?",
      description: "Ti-6Al-2Nb-1Ta-0.8Mo, commonly referred to as Ti-6211 or Ti-621/0.8, is a near-alpha titanium alloy originally developed by the U.S. Navy in the 1950s–1960s for deep-submergence pressure hull applications. Its distinctive composition combines 6% aluminum (alpha stabilizer) with niobium (2%), tantalum (1%), and molybdenum (0.8%) — the Nb+Ta combination providing exceptional resistance to stress corrosion cracking (SCC) in marine environments. This alloy is renowned for its outstanding fracture toughness, excellent weldability for heavy sections, and robust performance under high hydrostatic pressure at ocean depths.",
      classification: "Near-Alpha Titanium Alloy (α-rich)",
      commonNames: ["Ti-6Al-2Nb-1Ta-0.8Mo", "Ti-6211", "Ti-621/0.8", "UNS R56210"],
      keyCharacteristics: [
        "Exceptional stress corrosion cracking (SCC) resistance in seawater and saline environments",
        "Superior fracture toughness with high safety margins for pressure-critical applications",
        "Excellent weldability — low crack sensitivity in heat-affected zones for thick-section welding",
        "Good elevated-temperature strength and creep resistance",
        "Excellent formability and machinability compared to beta-rich titanium alloys",
        "Designed specifically for high-pressure deep-sea service conditions"
      ]
    },
    conformsTo: {
      title: "Applicable Standards",
      description: "Ti-6211 titanium conforms to the following international material standards:",
      items: [
        "MIL-T-9047 — Titanium and Titanium Alloy Plate, Sheet, and Strip",
        "AMS 4904 — Titanium Alloy Plate, Sheet, and Strip, Ti-6Al-2Nb-1Ta-0.8Mo",
        "ASTM B265 — Sheet, Strip, and Plate (cross-reference)",
        "ASTM B348 — Bars and Billets (cross-reference)",
        "ASTM B381 — Forgings (cross-reference)",
        "NACE MR0175 / ISO 15156 — Oilfield Equipment (marine service)",
        "ABS (American Bureau of Shipping) — Marine Vessel and Submersible Rules",
        "Naval Sea Systems Command (NAVSEA) — Submarine Pressure Hull Specifications"
      ]
    },
    hasProperty: {
      title: "Mechanical & Physical Properties",
      description: "Typical room-temperature properties for Ti-6211 (annealed condition, unless noted):",
      properties: [
        { label: "Tensile Strength (min, annealed)", value: "895 MPa (130 ksi)" },
        { label: "Yield Strength 0.2% Offset (min, annealed)", value: "828 MPa (120 ksi)" },
        { label: "Elongation (min, annealed)", value: "10%" },
        { label: "Reduction of Area", value: "25%" },
        { label: "Density", value: "4.48 g/cm³ (0.162 lb/in³)" },
        { label: "Elastic Modulus", value: "110 GPa (16.0 × 10⁶ psi)" },
        { label: "Melting Point", value: "1,660°C (3,020°F)" },
        { label: "Thermal Conductivity", value: "7.0 W/(m·K)" },
        { label: "Fracture Toughness KIC (annealed)", value: "85–110 MPa√m" },
        { label: "Stress Corrosion Cracking Threshold KISCC (seawater)", value: "≥ 60 MPa√m" },
        { label: "Fatigue Strength (10⁷ cycles, R=0.1)", value: "450–520 MPa" },
        { label: "Hardness", value: "≤ 36 HRC" },
        { label: "Max Service Temperature", value: "400°C (750°F)" }
      ]
    },
    processedBy: {
      title: "Available Processing Methods",
      description: "Ti-6211 can be processed using the following manufacturing techniques:",
      items: [
        "CNC machining — Good with sharp carbide tools, rigid setups, and adequate coolant flow",
        "5-axis CNC machining — Suitable for complex pressure vessel components and submersible structures",
        "Wire EDM — Ideal for precision cutouts and thick-section profiling",
        "TIG welding — Excellent with matching filler metal; low HAZ crack sensitivity enables heavy-section welding",
        "Laser beam welding — Good weld quality with proper joint design and inert gas shielding",
        "Electron beam welding — Excellent for deep-penetration, narrow-HAZ welds in vacuum",
        "Submerged arc welding — Applicable for very heavy plate sections in pressure hull fabrication",
        "Vacuum annealing — At 700–800°C (1,300–1,475°F) to relieve residual stresses",
        "Hot forming — At 800–900°C (1,475–1,650°F) for complex shapes",
        "Forging — Alpha-beta forging at 950–1,050°C (1,740–1,920°F)",
        "Hot isostatic pressing (HIP) — At 920°C / 100 MPa to eliminate internal porosity",
      ]
    },
    manufacturedFrom: {
      title: "Typical Products & Components",
      description: "Ti-6211 is commonly fabricated into the following downstream products:",
      items: [
        "Deep-submergence pressure hulls — manned and unmanned submersible shells",
        "Marine pressure vessels — hyperbaric chambers, deep-sea storage tanks, hydraulic cylinders",
        "Naval ship structures — waterjet propulsion components, sonar domes, rudder assemblies",
        "Submarine ballast and trim system components",
        "Oceanographic instrument housings and sensor pods",
        "Undersea pipeline connectors and riser systems",
        "Offshore oil & gas subsea tree equipment",
        "Thick-plate welded assemblies for critical marine structural applications",
        "High-performance marine fastener systems — bolts, studs, and connectors",
        "Additive manufacturing (3D printing) — spherical powder for complex deep-sea components"
      ]
    },
    usedIn: {
      title: "Primary Industries",
      description: "Ti-6211 serves as a material of choice across these industries:",
      items: [
        "Defense & naval — Submarine structures, deep-submergence vehicles, naval ship components",
        "Deep-sea exploration — Manned and ROV/AUV submersible hulls and pressure vessels",
        "Ocean engineering — Offshore platforms, riser systems, subsea manifolds",
        "Oil & gas — Subsea production trees, manifolds, high-pressure piping",
        "Additive manufacturing — 3D printed deep-sea and aerospace components",
        "Marine renewable energy — Tidal turbine structures, subsea power generation housings"
      ]
    },
    alternativeTo: {
      title: "Alternative Materials",
      description: "Depending on application requirements, Ti-6211 may be substituted by:",
      items: [
        "Grade 5 (Ti-6Al-4V) — Higher strength but lower SCC resistance in seawater and reduced weldability for thick sections",
        "Grade 23 (Ti-6Al-4V ELI) — Better low-temperature toughness but inferior seawater SCC resistance",
        "Grade 9 (Ti-3Al-2.5V) — Better formability but lower strength and fracture toughness",
        "Ti-6Al-2Sn-4Zr-2Mo (Grade 6242) — Higher-temperature creep resistance but not optimized for marine SCC performance",
        "HY-80 / HY-100 Steel — Lower cost for pressure hulls but significantly heavier and susceptible to corrosion",
        "Stainless Steel 316L — Lower cost for marine service but lower strength and fatigue life"
      ]
    },
    faqs: [
      { question: "What is Ti-6211 (Ti-6Al-2Nb-1Ta-0.8Mo) titanium alloy?", answer: "Ti-6211, also known as Ti-621/0.8, is a near-alpha titanium alloy developed by the U.S. Navy for deep-submergence pressure hulls. Its unique niobium + tantalum stabilizer system provides exceptional resistance to stress corrosion cracking in seawater, combined with outstanding fracture toughness and excellent weldability for thick-section marine structures." },
      { question: "What makes Ti-6211 different from Grade 5 (Ti-6Al-4V) for marine applications?", answer: "While Grade 5 offers excellent general corrosion resistance, Ti-6211 is specifically formulated for the demanding conditions of deep-sea service. The Nb+Ta additions dramatically improve resistance to stress corrosion cracking (SCC) under sustained load in seawater — a critical failure risk for pressure vessels. Ti-6211 also exhibits superior fracture toughness (85–110 MPa√m) and significantly better weldability for thick-section welding." },
      { question: "What welding processes are suitable for Ti-6211? Can you weld thick plates?", answer: "Ti-6211 is one of the most weldable high-strength titanium alloys. TIG, laser beam, and electron beam welding are all applicable. Its low crack sensitivity in the heat-affected zone makes it particularly suitable for heavy-section (50 mm+) plate welding required for pressure hull fabrication. Matching filler metal with strict inert gas shielding is essential for all welding operations." },
      { question: "What machining capabilities do you have for Ti-6211 components?", answer: "We offer precision 5-axis CNC machining, CNC turning, and wire EDM for Ti-6211 components. Our DMG Mori and Mazak machining centers with high-pressure coolant systems can handle complex pressure vessel components and structural parts. CMM dimensional verification per AS9102 is available for all critical features." }
    ],
    whyChooseUs: "BOZE CNC Ti is a precision manufacturer of Ti-6211 (Ti-6Al-2Nb-1Ta-0.8Mo) near-alpha titanium components for defense, deep-sea exploration, and marine engineering applications. Our AS9100D-certified facility sources 100% certified Ti-6211 plate, bars, and forgings, and transforms them into complex pressure vessel components, structural assemblies, and subsea hardware using state-of-the-art 5-axis CNC machining centers, precision turning, advanced TIG/laser welding, and wire EDM. Every component is produced under AS9100D and ISO 9001:2015 quality systems with full material traceability from mill to finished part. Our engineering team provides 24-hour DFM review and competitive quoting, backed by decades of metallurgical expertise in near-alpha titanium processing for critical marine service."
  }
};
