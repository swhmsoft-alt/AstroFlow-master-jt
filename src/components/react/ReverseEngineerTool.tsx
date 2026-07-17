import { useState, useMemo } from 'react';

/* ── Knowledge Base ── */

interface PartProfile {
  keywords: string[];            // 匹配关键词
  industries: string[];          // Industries
  category: string;              // Category
  geometry: string;              // Geometry
  painPoints: string[];          // Pain points
  alloyId: string;               // Recommended alloy
  alloyReason: string;           // Selection reason
  formId: string;                // Raw material form
  formReason: string;            // Form selection reason
  process: string[];             // Recommended process
  tollServices: string[];        // Toll processing services
  pitfalls: string[];            // Pitfalls
  specNote: string;              // Procurement spec notes
  servicePage: string;           // Related service page
  image: string;                 // Emoji icon
}

const ALLOYS: Record<string, string> = {
  'cp1': 'Grade 1 CP-Ti (TA1) — Pure Ti, highest ductility',
  'cp2': 'Grade 2 CP-Ti (TA2) — Industrial pure Ti, general corrosion resistance',
  'cp3': 'Grade 3 CP-Ti (TA3) — Medium strength CP Ti',
  'tc4': 'Grade 5 Ti-6Al-4V (TC4) — General alpha-beta alloy, high strength',
  'tc4eli': 'Grade 23 Ti-6Al-4V ELI (TC4 ELI) — Ultra-low interstitial, implant grade',
  'ta9': 'Grade 7 Ti-0.15Pd (TA9) — Pd modified, strong acid resistant',
  'ta10': 'Grade 12 Ti-0.3Mo-0.8Ni (TA10) — Mo-Ni modified, chemical grade',
  'ta18': 'Grade 9 Ti-3Al-2.5V (TA18) — Medium strength, good formability',
};

const FORMS: Record<string, string> = {
  'bar': 'Round Bar / Rod — for turning, fasteners',
  'plate': 'Plate / Sheet — for welding, machined housings',
  'tube': 'Seamless Tube — for fluid systems, heat exchangers',
  'forging': 'Die Forging / Ring — for high-stress critical parts',
  'wire': 'Wire / Small Bar — for fasteners, springs, medical',
};

/* ── Part Knowledge Base ── */

const PART_DB: PartProfile[] = [
  {
    keywords: ['阀针', '阀杆', '阀芯', '阀门', 'valve', 'needle', 'stem', 'nozzle'],
    industries: ['Energy', 'Chemical', 'Hydrogen', 'Oil & Gas'],
    category: 'Valves / Fluid Control Components',
    geometry: 'Slender shaft, small diameter, high aspect ratio, precision conical/spherical sealing surface',
    painPoints: ['High-pressure sealing', 'High-frequency switching impact', 'Media corrosion', 'Hydrogen embrittlement', 'Micro-leakage'],
    alloyId: 'tc4',
    alloyReason: 'TC4 offers high strength (yield>=830MPa) and good toughness with superior hydrogen embrittlement resistance vs CP-Ti. Use TC4 ELI for biocompatibility requirements.',
    formId: 'bar',
    formReason: 'Slender shafts suitable for Swiss-type turning from bar stock, 60-70% material utilization, 50% cost reduction vs plate cutting + welding.',
    process: ['Swiss-type precision turning', 'CBN tool finishing', 'High-precision grinding'],
    tollServices: ['Cylindrical / centerless grinding', 'PVD / DLC coating', 'Laser marking (traceability code)'],
    pitfalls: ['Aspect ratio >10:1 causes tool deflection; use step machining or steady rest', 'Taper sealing surface requires Ra<=0.2um; ultra-precision grinding needed'],
    specNote: 'Annealed (A), UT Class B, Ra<=0.4um, sealing surface Ra<=0.2um',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '🔧',
  },
  {
    keywords: ['叶片', '叶轮', 'impeller', 'blade', 'fan', '涡轮', 'propeller'],
    industries: ['Aerospace', 'Energy', 'Marine'],
    category: 'Impellers / Blades (Rotational)',
    geometry: 'Complex 3D curved surfaces, thin-wall twisted blades, integral hub-blade structure',
    painPoints: ['High-speed centrifugal force', 'Cyclic fatigue', 'High temperature', 'Cavitation erosion', 'Dynamic balancing'],
    alloyId: 'tc4',
    alloyReason: 'TC4 offers excellent specific strength (~230MPa/g·cm-3) and fatigue life (10^7 cycles >=500MPa). Industry standard for aero engine and compressor impellers.',
    formId: 'forging',
    formReason: 'Die forging optimizes grain flow along blade contour, improving fatigue life by 30%+ vs bar milling, reducing waste by 90%.',
    process: ['5-axis simultaneous CNC milling', 'Adaptive machining', 'Vibratory finishing'],
    tollServices: ['5-axis machining center', 'CMM inspection', 'Dynamic balancing test', 'FPI (fluorescent penetrant inspection)'],
    pitfalls: ['Thin blade (<1mm) risks distortion; use high-speed milling with stress-relief toolpath', 'G2.5 balance grade is challenging; requires iterative compensation'],
    specNote: 'Die forging, AMS 4928, Annealed, 100% FPI + UT Class A, Balance G2.5',
    servicePage: '/titanium-cnc-machining-services/3-5-axis-cnc-machining/',
    image: '🌀',
  },
  {
    keywords: ['植入', '骨钉', '骨板', '髋关节', '膝关节', '脊柱', 'implant', 'screw', 'plate', 'hip', 'knee'],
    industries: ['Medical Device'],
    category: 'Medical Implants',
    geometry: 'Small precision part, complex curved surfaces (articular), hex/cross drive, self-tapping thread',
    painPoints: ['Biocompatibility', 'Fatigue fracture', 'Osseointegration', 'Sterile processing', 'Stress shielding'],
    alloyId: 'tc4eli',
    alloyReason: 'TC4 ELI (ASTM F136) is the standard for surgical implants. Extra-low interstitials (O<=0.13%) improve fracture toughness. Do not substitute industrial TC4.',
    formId: 'bar',
    formReason: 'Bar is the standard form for bone screws/plates. Single-setup Swiss turning, good surface quality, batch consistency.',
    process: ['Automatic Swiss turning', 'Thread rolling / forming', 'Electrochemical polishing'],
    tollServices: ['Passivation (ASTM F86)', 'Cleaning & packaging (Class 8 cleanroom)', 'Laser marking (UDI code)'],
    pitfalls: ['Self-tapping threads require no burrs; use thread rolling instead of cutting', 'Implant surface must be free of iron contamination; use dedicated Ti-alloy tooling'],
    specNote: 'ASTM F136, Annealed, 100% dimensional inspection + surface contamination test, sterile packaging',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🏥',
  },
  {
    keywords: ['换热器', '热交换', '管板', '管道', '冷却', '反应釜', 'heat exchanger', 'tube', 'pipe'],
    industries: ['Chemical', 'Energy', 'Marine', 'Desalination'],
    category: 'Heat Exchangers / Piping Systems',
    geometry: 'Tube/plate assembly structure, tube sheet + bundle + shell, extensive drilled holes',
    painPoints: ['Crevice corrosion', 'Fluid erosion', 'Tube sheet sealing', 'Thermal stress', 'Chloride stress corrosion'],
    alloyId: 'cp2',
    alloyReason: 'Grade 2 CP-Ti offers excellent corrosion resistance in seawater and chlorides (potential >+0.8V vs SCE) at moderate cost. Upgrade to Grade 7/12 for strong reducing acids.',
    formId: 'tube',
    formReason: 'Seamless tube is standard for heat exchanger bundles. Mature sizes (OD 6-50mm), short lead time, controlled cost.',
    process: ['Tube sheet drilling', 'Tube end expansion / seal welding', 'Shell and channel welding'],
    tollServices: ['Deep hole drilling (tube sheet)', 'Automatic TIG welding (tube end)', 'Hydrostatic test', 'Pickling & passivation'],
    pitfalls: ['Ti tube-to-sheet weld requires 99.999% argon; back-purge to prevent oxidation', 'Tube sheet hole tolerance H8 or better for expansion joint sealing integrity'],
    specNote: 'ASTM B338 Gr2 seamless tube, Annealed, 100% hydrostatic test + eddy current (ET)',
    servicePage: '/titanium-fabrication-services/titanium-welding-assembly/',
    image: '🔥',
  },
  {
    keywords: ['外壳', '腔体', '容器', '箱体', 'housing', 'chamber', 'enclosure', 'vessel'],
    industries: ['Aerospace', 'Medical', 'Chemical', 'Semiconductor'],
    category: 'Housings / Chambers / Enclosures',
    geometry: 'Box/cylindrical thin-wall structure with mounting lugs, flanges, viewports',
    painPoints: ['Overall stiffness', 'Sealing integrity', 'Welding distortion', 'Weight reduction', 'Internal cleanliness'],
    alloyId: 'tc4',
    alloyReason: 'TC4 offers 45% weight reduction vs stainless steel. For aerospace/medical housings. Use Grade 2 CP-Ti if only corrosion resistance needed.',
    formId: 'plate',
    formReason: 'Plate welding is most economical for housings. CNC cutting + automated welding reduces allowance. Consider investment casting for high volume.',
    process: ['CNC cutting / profile cutting', 'TIG/MIG welding', '5-axis milling of faces', 'Stress relief heat treatment'],
    tollServices: ['Laser / waterjet cutting', 'Vacuum brazing (if required)', 'Pressure test', 'Surface blasting / passivation'],
    pitfalls: ['Ti alloy welding distortion is significant; use fixtures and pre-set compensation', 'Post-weld stress relief annealing required (600-650°C / 2h)'],
    specNote: 'ASTM B265 Gr5 annealed plate, post-weld stress relief, 100% PT',
    servicePage: '/titanium-fabrication-services/',
    image: '📦',
  },
  {
    keywords: ['螺栓', '螺母', 'Fasteners', '螺钉', '螺柱', '垫圈', 'bolt', 'nut', 'fastener', 'screw', 'stud'],
    industries: ['Aerospace', 'Chemical', 'Marine', '医疗'],
    category: 'Fasteners',
    geometry: 'Standard/custom threaded parts, small sizes, various head types (hex/socket/flat)',
    painPoints: ['Thread strength', 'Galling', 'Hydrogen embrittlement', 'Torque control', 'Heat-resistant loosening'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 (Ti-3Al-2.5V) is standard for aerospace fasteners. Lower strength than TC4 but better cold heading formability. TC4 for high-strength bolts.',
    formId: 'wire',
    formReason: 'Wire/small bar is the standard form for fasteners. Direct cold/hot heading, material utilization >95%.',
    process: ['Cold / hot heading forming', 'Thread rolling', 'Heat treatment', 'Surface treatment'],
    tollServices: ['Vacuum annealing', 'Anodizing (AMS 2488)', 'Batch testing (mechanical + metallographic)'],
    pitfalls: ['Ti fasteners require anti-galling coating (Al-bronze plating, MoS2 coating)', 'Thread rolling gives 30% higher strength than cutting; rolling is mandatory'],
    specNote: 'AMS 4934 / ASTM B348 Gr9, solution+aged (STA), 100% thread inspection',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '🔩',
  },
  {
    keywords: ['支架', ' bracket', 'fitting', '连接件', '接头', 'connector', 'adapter'],
    industries: ['Aerospace', 'Automotive', 'General Industry'],
    category: 'Brackets / Fittings / Connectors',
    geometry: 'L/T-shaped or irregular structural parts with mounting holes, weight reduction pockets, ribs',
    painPoints: ['Vibration fatigue', 'Multi-axial stress', 'Weight reduction', 'Installation alignment precision'],
    alloyId: 'tc4',
    alloyReason: 'TC4 offers excellent mechanical properties and weight reduction (4.43g/cm3). Standard for aerospace brackets.',
    formId: 'plate',
    formReason: 'CNC milled from plate is common for brackets. Flexible for small batches. Die forging for high volume.',
    process: ['4/5-axis CNC milling', 'Drilling / tapping', 'Deburring / edge rounding'],
    tollServices: ['Waterjet cutting', 'Vibratory finishing', 'Anodizing', 'Dimensional inspection'],
    pitfalls: ['Thin walls (<2mm) cause chatter; use high speed, light depth strategy', 'Hole position tolerance +-0.05mm requires single-setup machining'],
    specNote: 'AMS 4928 TC4 annealed plate, 100% dimensional inspection, anodized',
    servicePage: '/titanium-cnc-machining-services/cnc-milling-turning/',
    image: '📐',
  },
  {
    keywords: ['弹簧', 'spring', '弹性', '卡箍', 'clip'],
    industries: ['Aerospace', 'Medical', 'Chemical'],
    category: 'Springs / Elastic Elements',
    geometry: 'Fine wire coil/special section, high elastic deflection',
    painPoints: ['Elastic relaxation', 'Fatigue fracture', 'Stress relaxation', 'Operating temperature'],
    alloyId: 'ta18',
    alloyReason: 'Grade 9 has ~110GPa modulus (half of steel) but high elastic limit. Standard for Ti springs. Solution+aging for optimal elastic properties.',
    formId: 'wire',
    formReason: 'Wire is the only raw material form for springs. Direct coiling, high efficiency.',
    process: ['Automatic spring coiling', 'Precision end grinding', 'Solution + aging heat treatment', 'Surface shot peening'],
    tollServices: ['Vacuum heat treatment', 'Shot peening', 'Fatigue testing', 'Stiffness sorting'],
    pitfalls: ['Spring design stress should be 40-50% of shear yield strength; do not use steel spring design rules', 'Post-coiling stress relief annealing mandatory; otherwise severe elastic relaxation'],
    specNote: 'AMS 4934 / ASTM B863 Gr9, solution+aged (STA)',
    servicePage: '/titanium-cnc-machining-services/custom-industrial-components/',
    image: '〰️',
  },
];

/* ── Main Component ── */

export default function ReverseEngineerTool() {
  const [input, setInput] = useState('');
  const [industry, setIndustry] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return [];
    const kw = input.toLowerCase().split(/[\s,，、]+/);
    const matched: { profile: PartProfile; score: number }[] = [];

    for (const p of PART_DB) {
      let score = 0;
      for (const k of kw) {
        for (const pk of p.keywords) {
          if (pk.toLowerCase().includes(kw) || kw.includes(pk.toLowerCase())) {
            score += 10;
          }
        }
        for (const ind of p.industries) {
          if (ind.toLowerCase().includes(kw) || kw.includes(ind.toLowerCase())) {
            score += 5;
          }
        }
      }
      // Industry filter bonus
      if (industry && p.industries.some(i => industry.includes(i))) {
        score += 3;
      }
      if (score > 0) matched.push({ profile: p, score });
    }

    return matched.sort((a, b) => b.score - a.score);
  }, [input, industry]);

  const display = selectedIdx !== null ? [results[selectedIdx]].filter(Boolean) : results;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    setSelectedIdx(null);
  };

  return (
    <div className="w-full">
      {/* Form */}
      <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
        <form onSubmit={handleSearch} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--theme-text)' }}>
              Component / Part Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. hydrogen valve needle, turbine impeller, bone screw, heat exchanger tube sheet..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
            >
              <option value="">All Industries</option>
              <option value="Aerospace">✈️ Aerospace</option>
              <option value="Medical Device">🏥 Medical Device</option>
              <option value="Chemical">🧪 Chemical / Petrochemical</option>
              <option value="Energy">⚡ Energy / Hydrogen</option>
              <option value="Marine">🚢 Marine / Offshore</option>
              <option value="Semiconductor">💻 Semiconductor</option>
            </select>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all text-base whitespace-nowrap"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >🔍 Find Matching Solution</button>
          </div>
        </form>

        {/* Quick entry */}
        {!searched && (
          <div className="mt-6 pt-4 border-t" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <p className="text-xs mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Or browse common titanium parts:</p>
            <div className="flex flex-wrap gap-2">
              {PART_DB.map((p, i) => (
                <button key={i} onClick={() => { setInput(p.keywords[0]); setSearched(true); setSelectedIdx(0); }}
                  className="px-3 py-1.5 text-xs rounded-lg transition-all"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
                >{p.image} {p.category}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Search results */}
      {searched && results.length === 0 && (
        <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
          <div className="text-3xl mb-3">🔍</div>
          <p className="text-sm mb-4" style={{ color: 'var(--theme-text)' }}>No matching solution found.</p>
          <p className="text-xs mb-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Try different keywords or contact our engineering team for a custom solution.</p>
          <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white"
            style={{ backgroundColor: 'var(--theme-primary)' }}>📩 Contact Engineering Team</a>
        </div>
      )}

      {/* Result list */}
      {searched && results.length > 0 && selectedIdx === null && (
        <div className="space-y-4 mb-6">
          <p className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
            Found {results.length} matching result(s). Click to view:
          </p>
          {results.slice(0, 5).map((r, i) => (
            <button key={i} onClick={() => setSelectedIdx(results.indexOf(r))}
              className="w-full text-left rounded-xl p-4 transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.profile.image}</span>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{r.profile.category}</div>
                  <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Match: {Math.min(100, r.score * 10)}% · {r.profile.industries.join(' / ')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Detail view */}
      {display.map((r, i) => {
        const p = r.profile;
        const alloyName = ALLOYS[p.alloyId as keyof typeof ALLOYS] || p.alloyId;
        const formName = FORMS[p.formId as keyof typeof FORMS] || p.formId;
        return (
          <div key={i} className="rounded-2xl p-6 md:p-8 mb-6" style={{ backgroundColor: 'var(--theme-surface)', border: '2px solid var(--theme-primary)' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">{p.image}</span>
              <div>
                <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>{p.category}</h3>
                <p className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>{p.industries.join(' · ')}</p>
              </div>
            </div>

            {/* 1. Part Feature */}
            <Section title="1. Part Feature Analysis" content={p.geometry} />
            <ul className="text-sm space-y-1 mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 75%, transparent)' }}>
              {p.painPoints.map((pt, j) => <li key={j}>⚠️ {pt}</li>)}
            </ul>

            {/* 2. Material */}
            <Section title="2. Material Selection Rationale" content={alloyName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.alloyReason}</p>

            {/* 3. Form */}
            <Section title="3. Form Selection Rationale" content={formName} />
            <p className="text-sm mb-4 ml-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}>{p.formReason}</p>

            {/* 4. Process */}
            <Section title="4. Manufacturing Process & Services" content="" />
            <div className="ml-4 mb-4">
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Core Processes:</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.process.map((pr, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)', color: 'var(--theme-primary)' }}>{pr}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Toll Processing Services:</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {p.tollServices.map((ts, j) => <span key={j} className="px-2.5 py-1 text-xs rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, #22c55e 10%, transparent)', color: '#22c55e' }}>{ts}</span>)}
              </div>
              <p className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Process Pitfalls:</p>
              <ul className="text-xs space-y-1" style={{ color: 'color-mix(in srgb, #ef4444, 70%)' }}>
                {p.pitfalls.map((pf, j) => <li key={j}>⚠️ {pf}</li>)}
              </ul>
            </div>

            {/* 5. Procurement */}
            <Section title="5. Procurement Specifications" content={p.specNote} />

            {/* CTA */}
            <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 items-center justify-center" style={{ borderColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
              <a href={p.servicePage} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg transition-all"
                style={{ color: 'var(--theme-primary)', border: '1px solid var(--theme-primary)' }}>
                View Related Services →
              </a>
              <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all"
                style={{ backgroundColor: 'var(--theme-primary)' }}>
                📩 Get Formal Quote
              </a>
            </div>

            {selectedIdx !== null && (
              <div className="mt-4 text-center">
                <button onClick={() => setSelectedIdx(null)}
                  className="text-xs underline" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                  ← Back to all results
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div className="mb-2">
      <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--theme-text)' }}>{title}</h4>
      {content && <p className="text-sm ml-4" style={{ color: 'var(--theme-primary)', fontWeight: 600 }}>{content}</p>}
    </div>
  );
}
