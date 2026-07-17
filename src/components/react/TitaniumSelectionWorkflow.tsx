import { useState, useMemo } from 'react';

/* ── Types ── */

type Step = 'env' | 'prop' | 'standard' | 'geometry' | 'form' | 'allowance' | 'machinability' | 'utilization' | 'summary';

interface StepInfo { id: Step; label: string; phase: string; }

const STEPS: StepInfo[] = [
  { id: 'env', label: 'Working Environment', phase: 'Material Selection' },
  { id: 'prop', label: 'Property Matching', phase: 'Material Selection' },
  { id: 'standard', label: 'Standard & Grade', phase: 'Material Selection' },
  { id: 'geometry', label: 'Part Geometry', phase: 'Form Selection' },
  { id: 'form', label: 'Raw Material Form', phase: 'Form Selection' },
  { id: 'allowance', label: 'Allowance & Spec', phase: 'Form Selection' },
  { id: 'machinability', label: 'Machinability Check', phase: 'Evaluation' },
  { id: 'utilization', label: 'Utilization & Supply', phase: 'Evaluation' },
  { id: 'summary', label: 'Procurement Spec', phase: 'Final Output' },
];

/* ── Knowledge Base ── */

interface Alloy {
  id: string;
  name: string;
  grades: string[];
  tempRange: string;
  corrosionResistance: string[];
  stressCapability: string[];
  machinability: 'excellent' | 'good' | 'fair' | 'poor';
  weldability: 'excellent' | 'good' | 'fair' | 'poor';
  density: number;
  costFactor: number; // 1 = baseline
  description: string;
}

const ALLOYS: Alloy[] = [
  { id: 'cp1', name: 'Grade 1 CP-Ti (TA1)', grades: ['ASTM B348 Gr1', 'AMS 4901', 'GB/T 3621 TA1'], tempRange: 'cryogenic~300°C', corrosionResistance: ['seawater', 'mild acid', 'body fluid'], stressCapability: ['static low'], machinability: 'good', weldability: 'excellent', density: 4.51, costFactor: 1.0, description: 'Lowest strength, highest ductility. Ideal for deep drawing, heat exchangers, and chemical processing equipment requiring maximum formability.' },
  { id: 'cp2', name: 'Grade 2 CP-Ti (TA2)', grades: ['ASTM B348 Gr2', 'AMS 4902', 'GB/T 3621 TA2'], tempRange: 'cryogenic~300°C', corrosionResistance: ['seawater', 'mild acid', 'body fluid'], stressCapability: ['static moderate'], machinability: 'good', weldability: 'excellent', density: 4.51, costFactor: 1.0, description: 'Workhorse grade for general corrosion-resistant applications. Seawater piping, valves, and structural components.' },
  { id: 'cp3', name: 'Grade 3 CP-Ti (TA3)', grades: ['ASTM B348 Gr3', 'AMS 4903'], tempRange: 'cryogenic~300°C', corrosionResistance: ['seawater', 'mild acid', 'body fluid'], stressCapability: ['static moderate', 'cyclic low'], machinability: 'good', weldability: 'excellent', density: 4.51, costFactor: 1.05, description: 'Intermediate strength CP grade. Used where slightly higher strength than Gr2 is needed without moving to alloyed grades.' },
  { id: 'tc4', name: 'Grade 5 Ti-6Al-4V (TC4)', grades: ['ASTM B348 Gr5', 'AMS 4928', 'GB/T 3621 TC4'], tempRange: '-200~400°C', corrosionResistance: ['seawater', 'body fluid', 'mild acid'], stressCapability: ['static high', 'cyclic high'], machinability: 'fair', weldability: 'good', density: 4.43, costFactor: 1.3, description: 'The most widely used titanium alloy. Exceptional strength-to-weight ratio. Aerospace structures, medical implants, high-performance automotive.' },
  { id: 'tc4eli', name: 'Grade 23 Ti-6Al-4V ELI (TC4 ELI)', grades: ['ASTM F136', 'ASTM B348 Gr23', 'AMS 4930'], tempRange: '-200~400°C', corrosionResistance: ['body fluid', 'seawater'], stressCapability: ['static high', 'cyclic high'], machinability: 'fair', weldability: 'good', density: 4.43, costFactor: 1.6, description: 'Extra Low Interstitial variant of Gr5. Improved fracture toughness and ductility. Standard for surgical implants (ASTM F136).' },
  { id: 'ta9', name: 'Grade 7 Ti-0.15Pd (TA9)', grades: ['ASTM B348 Gr7', 'AMS 4908'], tempRange: 'cryogenic~300°C', corrosionResistance: ['strong acid', 'seawater', 'chloride'], stressCapability: ['static moderate'], machinability: 'good', weldability: 'excellent', density: 4.51, costFactor: 2.5, description: 'Best corrosion resistance in reducing acid environments. Pd addition provides exceptional resistance to crevice corrosion in hot chlorides.' },
  { id: 'ta10', name: 'Grade 12 Ti-0.3Mo-0.8Ni (TA10)', grades: ['ASTM B348 Gr12'], tempRange: 'cryogenic~300°C', corrosionResistance: ['strong acid', 'seawater', 'chloride'], stressCapability: ['static moderate'], machinability: 'good', weldability: 'good', density: 4.51, costFactor: 1.8, description: 'Cost-effective alternative to Gr7. Mo and Ni additions improve corrosion resistance in reducing environments. Excellent for chemical processing.' },
  { id: 'ta18', name: 'Grade 9 Ti-3Al-2.5V (TA18)', grades: ['ASTM B348 Gr9', 'AMS 4934'], tempRange: '-200~300°C', corrosionResistance: ['seawater', 'body fluid'], stressCapability: ['static moderate', 'cyclic moderate'], machinability: 'good', weldability: 'excellent', density: 4.48, costFactor: 1.2, description: 'Good strength with excellent cold formability and weldability. Preferred for hydraulic tubing, aerospace ducting, and sports equipment.' },
];

interface FormOption {
  id: string;
  label: string;
  description: string;
  suitableFor: string[];
  typicalGrades: string[];
  sizeRange: string;
  leadTime: string;
}

const FORMS: FormOption[] = [
  { id: 'bar', label: 'Round Bar / Rod', description: 'Best for rotational parts, shafts, fasteners, and general machining from solid.', suitableFor: ['shaft', 'rotational', 'fastener', 'pin'], typicalGrades: ['cp2', 'tc4', 'tc4eli', 'ta18'], sizeRange: '∅3–350mm', leadTime: '2–4 weeks' },
  { id: 'plate', label: 'Plate / Sheet', description: 'Ideal for housings, brackets, flanges, and weldments. Available in cut-to-size.', suitableFor: ['housing', 'bracket', 'flange', 'panel'], typicalGrades: ['cp2', 'tc4', 'cp1'], sizeRange: '0.5–100mm thick', leadTime: '2–6 weeks' },
  { id: 'tube', label: 'Tube / Pipe', description: 'Seamless or welded. Used for fluid systems, heat exchangers, and structural members.', suitableFor: ['fluid line', 'heat exchanger', 'structural tube'], typicalGrades: ['cp2', 'ta18', 'tc4'], sizeRange: '∅6–300mm', leadTime: '4–8 weeks' },
  { id: 'forging', label: 'Forging / Ring', description: 'Optimized grain flow for critical high-stress components. Near-net shape.', suitableFor: ['critical stress', 'high load', 'rotating disk', 'ring'], typicalGrades: ['tc4', 'tc4eli', 'ta18'], sizeRange: 'up to 500mm diameter', leadTime: '8–16 weeks' },
  { id: 'wire', label: 'Wire / Small Bar', description: 'For fasteners, springs, medical wire, and small turned parts.', suitableFor: ['fastener', 'spring', 'medical screw', 'wire'], typicalGrades: ['tc4', 'cp2', 'tc4eli'], sizeRange: '∅0.5–12mm', leadTime: '3–6 weeks' },
];

interface GeometryOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const GEOMETRIES: GeometryOption[] = [
  { id: 'shaft', label: 'Shaft / Rotational', icon: '⚙️', description: 'Cylindrical parts with rotational symmetry: shafts, rollers, pins, bushings.' },
  { id: 'housing', label: 'Housing / Shell / Box', icon: '📦', description: 'Enclosures, brackets, structural boxes, pressure vessels, flanges.' },
  { id: 'fluid', label: 'Fluid Channel / Tube', icon: '🔧', description: 'Pipes, tubes, manifolds, heat exchanger tubes, fluid lines.' },
  { id: 'complex', label: 'Complex 3D Structural', icon: '🔩', description: 'High-stress brackets, aircraft fittings, engine mounts, implants.' },
  { id: 'flat', label: 'Flat / Thin Profile', icon: '📋', description: 'Panels, covers, shims, gaskets, thin-walled enclosures.' },
];

/* ── Scoring Logic ── */

function recommendAlloys(env: EnvData): string[] {
  let scores: Record<string, number> = {};
  ALLOYS.forEach(a => scores[a.id] = 0);

  // Temperature
  ALLOYS.forEach(a => {
    if (env.temp === 'cryogenic') {
      if (a.id === 'cp1' || a.id === 'cp2' || a.id === 'tc4' || a.id === 'tc4eli') scores[a.id] += 2;
    } else if (env.temp === 'high') {
      if (a.id === 'tc4' || a.id === 'tc4eli') scores[a.id] += 2;
      else if (a.id === 'cp3') scores[a.id] += 1;
    } else {
      scores[a.id] += 1; // room temp: all OK
    }
  });

  // Corrosion
  ALLOYS.forEach(a => {
    env.corrosion.forEach(c => {
      if (a.corrosionResistance.includes(c)) scores[a.id] += 2;
    });
  });

  // Stress
  ALLOYS.forEach(a => {
    env.stress.forEach(s => {
      if (a.stressCapability.includes(s)) scores[a.id] += 2;
    });
  });

  // Sort by score, return top 3
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([id]) => id);
}

interface EnvData {
  temp: string;
  corrosion: string[];
  stress: string[];
}

function recommendForms(geometry: string, alloyId: string): string[] {
  const scores: Record<string, number> = {};
  FORMS.forEach(f => scores[f.id] = 0);

  FORMS.forEach(f => {
    if (f.suitableFor.includes(geometry)) scores[f.id] += 3;
    if (f.typicalGrades.includes(alloyId)) scores[f.id] += 2;
  });

  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .filter(([, s]) => s > 0)
    .slice(0, 2)
    .map(([id]) => id);
}

function calcMachinability(alloyId: string, formId: string): { rating: string; color: string; notes: string } {
  const alloy = ALLOYS.find(a => a.id === alloyId);
  if (!alloy) return { rating: 'Unknown', color: '#888', notes: '' };

  let difficulty = 0;
  if (alloy.machinability === 'fair') difficulty += 2;
  else if (alloy.machinability === 'poor') difficulty += 3;

  if (formId === 'forging') difficulty += 1; // forgings harder to machine

  if (difficulty <= 1) return { rating: 'Good', color: '#22c55e', notes: 'Standard feeds and speeds. Carbide tooling recommended.' };
  if (difficulty === 2) return { rating: 'Moderate', color: '#eab308', notes: 'Requires rigid setup, sharp tools, and adequate coolant pressure. Reduce speeds by 30%.' };
  return { rating: 'Challenging', color: '#ef4444', notes: 'Specialized tooling and experienced machinists required. Consider EDM for complex features.' };
}

/* ── Main Component ── */

export default function TitaniumSelectionWorkflow() {
  const [step, setStep] = useState<Step>('env');
  const [env, setEnv] = useState<EnvData>({ temp: 'room', corrosion: [], stress: [] });
  const [selectedAlloy, setSelectedAlloy] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<string | null>(null);
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [dims, setDims] = useState<Record<string, number>>({ od: 50, length: 200, wall: 5, width: 100, thickness: 10 });
  const [allowance, setAllowance] = useState<number>(3);
  const [standard, setStandard] = useState<string>('');

  const recommendations = useMemo(() => recommendAlloys(env), [env]);
  const alloy = selectedAlloy ? ALLOYS.find(a => a.id === selectedAlloy) : null;
  const formRecs = useMemo(() => geometry && selectedAlloy ? recommendForms(geometry, selectedAlloy) : [], [geometry, selectedAlloy]);
  const form = selectedForm ? FORMS.find(f => f.id === selectedForm) : null;

  const progress = STEPS.findIndex(s => s.id === step) + 1;
  const totalSteps = STEPS.length;

  const stepIdx = STEPS.findIndex(s => s.id === step);

  const phaseName = stepIdx < 3 ? 'Material Selection' : stepIdx < 6 ? 'Form Selection' : stepIdx < 8 ? 'Evaluation' : 'Final Output';

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  const formatGrade = (str: string) => str.replace(/-/g, '‑'); // non-breaking hyphen

  /* ── Renderers ── */

  const renderEnv = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 1: Analyze Working Environment</h3>
      <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Define the operating conditions — this drives the initial alloy filter.</p>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Operating Temperature</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'cryogenic', label: '❄️ Cryogenic (< -50°C)' },
            { id: 'room', label: '🌡️ Room / Moderate (-50~150°C)' },
            { id: 'high', label: '🔥 High (150~400°C)' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setEnv(p => ({ ...p, temp: opt.id }))}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: env.temp === opt.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                color: env.temp === opt.id ? '#fff' : 'var(--theme-text)',
                border: `1px solid ${env.temp === opt.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
              }}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Corrosive Media (select all that apply)</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'seawater', label: '🌊 Seawater / Chloride' },
            { id: 'strong acid', label: '🧪 Strong Acid (H₂SO₄, HCl)' },
            { id: 'mild acid', label: '🧫 Mild Acid / Organic' },
            { id: 'body fluid', label: '🫀 Body Fluid (Medical)' },
            { id: 'none', label: '✅ None / Dry' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setEnv(p => ({ ...p, corrosion: toggleArray(p.corrosion, opt.id) }))}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: env.corrosion.includes(opt.id) ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                color: env.corrosion.includes(opt.id) ? '#fff' : 'var(--theme-text)',
                border: `1px solid ${env.corrosion.includes(opt.id) ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
              }}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Loading / Stress Conditions</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'static high', label: '🏋️ High Static Load' },
            { id: 'static moderate', label: '💪 Moderate Static' },
            { id: 'cyclic high', label: '🔄 High Cycle Fatigue' },
            { id: 'static low', label: '📏 Low / No Load' },
          ].map(opt => (
            <button key={opt.id} onClick={() => setEnv(p => ({ ...p, stress: toggleArray(p.stress, opt.id) }))}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{
                backgroundColor: env.stress.includes(opt.id) ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                color: env.stress.includes(opt.id) ? '#fff' : 'var(--theme-text)',
                border: `1px solid ${env.stress.includes(opt.id) ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
              }}>{opt.label}</button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <button onClick={() => setStep('prop')}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: 'var(--theme-primary)' }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >Continue to Property Matching →</button>
      </div>
    </div>
  );

  const renderProp = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 2: Titanium Alloy Recommendations</h3>
      <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Based on your environment inputs, here are the top recommended alloys:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((id, i) => {
          const a = ALLOYS.find(x => x.id === id)!;
          return (
            <button key={id} onClick={() => setSelectedAlloy(id)}
              className="rounded-xl p-5 text-left transition-all hover:-translate-y-1"
              style={{
                backgroundColor: selectedAlloy === id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                border: `2px solid ${selectedAlloy === id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
                color: selectedAlloy === id ? '#fff' : 'var(--theme-text)',
              }}>
              <div className="text-sm font-bold mb-1">
                {i === 0 ? '🥇 ' : i === 1 ? '🥈 ' : '🥉 '}{a.name}
              </div>
              <div className="text-xs mb-2" style={{ opacity: 0.8 }}>{a.grades[0]}</div>
              <div className="text-xs" style={{ opacity: 0.7 }}>{a.description.slice(0, 80)}…</div>
              <div className="flex gap-2 mt-2 text-xs" style={{ opacity: 0.7 }}>
                <span>💰 {a.costFactor.toFixed(1)}x</span>
                <span>🔧 {a.machinability}</span>
                <span>⚡ {a.density}g/cm³</span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedAlloy && (
        <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
          <p className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
            ✅ Selected: {ALLOYS.find(a => a.id === selectedAlloy)?.name}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button onClick={() => setStep('env')}
          className="px-4 py-3 rounded-xl font-medium transition-all"
          style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}
        >← Back</button>
        <button onClick={() => setStep('standard')}
          disabled={!selectedAlloy}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: selectedAlloy ? 'var(--theme-primary)' : '#888', cursor: selectedAlloy ? 'pointer' : 'not-allowed' }}
        >Continue to Standards →</button>
      </div>
    </div>
  );

  const renderStandard = () => {
    const a = ALLOYS.find(x => x.id === selectedAlloy);
    if (!a) return null;
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 3: Select Material Standard</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Choose the governing specification for your application.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <h4 className="font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Available Standards</h4>
            <div className="space-y-2">
              {a.grades.map(g => (
                <label key={g} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer"
                  style={{ backgroundColor: standard === g ? 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' : 'transparent' }}>
                  <input type="radio" name="standard" checked={standard === g} onChange={() => setStandard(g)}
                    style={{ accentColor: 'var(--theme-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--theme-text)' }}>{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <h4 className="font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Application Guidance</h4>
            <ul className="text-sm space-y-2" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>
              <li><strong>Aerospace:</strong> AMS / ASME standards</li>
              <li><strong>Medical:</strong> ASTM F136 (implants), ASTM F67 (instruments)</li>
              <li><strong>Chemical:</strong> ASTM B348 / ASME SB348</li>
              <li><strong>General:</strong> GB/T, DIN, JIS equivalents available</li>
            </ul>
          </div>
        </div>

        {standard && (
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
            <p className="text-sm" style={{ color: 'var(--theme-text)' }}>
              <strong>✅ Specified:</strong> {a.name} — {standard}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('prop')} className="px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
          <button onClick={() => setStep('geometry')} disabled={!standard}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: standard ? 'var(--theme-primary)' : '#888', cursor: standard ? 'pointer' : 'not-allowed' }}>Continue to Geometry →</button>
        </div>
      </div>
    );
  };

  const renderGeometry = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 4: Define Part Geometry</h3>
      <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>What does your final part look like? This determines the most cost-effective raw material form.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {GEOMETRIES.map(g => (
          <button key={g.id} onClick={() => setGeometry(g.id)}
            className="rounded-xl p-5 text-left transition-all hover:-translate-y-1"
            style={{
              backgroundColor: geometry === g.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
              border: `2px solid ${geometry === g.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
              color: geometry === g.id ? '#fff' : 'var(--theme-text)',
            }}>
            <div className="text-2xl mb-2">{g.icon}</div>
            <div className="font-bold mb-1">{g.label}</div>
            <div className="text-xs" style={{ opacity: 0.7 }}>{g.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button onClick={() => setStep('standard')} className="px-4 py-3 rounded-xl font-medium transition-all"
          style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
        <button onClick={() => setStep('form')} disabled={!geometry}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
          style={{ backgroundColor: geometry ? 'var(--theme-primary)' : '#888', cursor: geometry ? 'pointer' : 'not-allowed' }}>Continue to Raw Material Form →</button>
      </div>
    </div>
  );

  const renderForm = () => {
    const geo = GEOMETRIES.find(g => g.id === geometry);
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 5: Select Raw Material Form</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
          For <strong>{geo?.label || 'your part'}</strong>, recommended forms:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FORMS.filter(f => formRecs.includes(f.id) || !formRecs.length).map(f => (
            <button key={f.id} onClick={() => setSelectedForm(f.id)}
              className="rounded-xl p-5 text-left transition-all hover:-translate-y-1"
              style={{
                backgroundColor: selectedForm === f.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                border: `2px solid ${selectedForm === f.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
                color: selectedForm === f.id ? '#fff' : 'var(--theme-text)',
              }}>
              <div className="font-bold mb-1">{f.label}</div>
              <div className="text-xs mb-2" style={{ opacity: 0.7 }}>{f.description}</div>
              <div className="flex gap-2 text-xs" style={{ opacity: 0.7 }}>
                <span>📏 {f.sizeRange}</span>
                <span>📦 {f.leadTime}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('geometry')} className="px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
          <button onClick={() => setStep('allowance')} disabled={!selectedForm}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: selectedForm ? 'var(--theme-primary)' : '#888', cursor: selectedForm ? 'pointer' : 'not-allowed' }}>Continue to Allowance & Spec →</button>
        </div>
      </div>
    );
  };

  const renderAllowance = () => {
    const f = FORMS.find(x => x.id === selectedForm);
    const a = ALLOYS.find(x => x.id === selectedAlloy);
    const isBarOrTube = selectedForm === 'bar' || selectedForm === 'tube';
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 6: Dimensional Specification & Allowance</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Define the raw material dimensions with machining allowance.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {f && (isBarOrTube) && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Outer Diameter (mm)</label>
                <input type="number" value={dims.od} onChange={e => setDims(p => ({ ...p, od: +e.target.value || 0 }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Length (mm)</label>
                <input type="number" value={dims.length} onChange={e => setDims(p => ({ ...p, length: +e.target.value || 0 }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="1" />
              </div>
              {selectedForm === 'tube' && (
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Wall Thickness (mm)</label>
                  <input type="number" value={dims.wall} onChange={e => setDims(p => ({ ...p, wall: +e.target.value || 0 }))}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="0.5" step="0.5" />
                </div>
              )}
            </>
          )}
          {f && !isBarOrTube && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Width / Diameter (mm)</label>
                <input type="number" value={dims.width} onChange={e => setDims(p => ({ ...p, width: +e.target.value || 0 }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="1" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Thickness (mm)</label>
                <input type="number" value={dims.thickness} onChange={e => setDims(p => ({ ...p, thickness: +e.target.value || 0 }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="0.5" step="0.5" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Length (mm)</label>
                <input type="number" value={dims.length} onChange={e => setDims(p => ({ ...p, length: +e.target.value || 0 }))}
                  className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)', color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }} min="1" />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>Machining Allowance per Side (mm)</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[1, 2, 3, 5].map(v => (
                <button key={v} onClick={() => setAllowance(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    backgroundColor: allowance === v ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-surface) 60%, transparent)',
                    color: allowance === v ? '#fff' : 'var(--theme-text)',
                    border: `1px solid ${allowance === v ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
                  }}>{v}mm</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('form')} className="px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
          <button onClick={() => setStep('machinability')}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--theme-primary)' }}>Continue to Evaluation →</button>
        </div>
      </div>
    );
  };

  const renderMachinability = () => {
    if (!selectedAlloy || !selectedForm) return null;
    const result = calcMachinability(selectedAlloy, selectedForm);
    const a = ALLOYS.find(x => x.id === selectedAlloy);
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 7: Machinability Assessment</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Evaluating manufacturability for {a?.name} in {FORMS.find(f => f.id === selectedForm)?.label} form.</p>

        <div className="p-6 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
          <div className="text-lg font-bold mb-2" style={{ color: result.color }}>{result.rating}</div>
          <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>{result.notes}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Machinability</div>
            <div className="font-bold" style={{ color: 'var(--theme-text)' }}>{a?.machinability}</div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Weldability</div>
            <div className="font-bold" style={{ color: 'var(--theme-text)' }}>{a?.weldability}</div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('allowance')} className="px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
          <button onClick={() => setStep('utilization')}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--theme-primary)' }}>Continue to Cost & Supply →</button>
        </div>
      </div>
    );
  };

  const renderUtilization = () => {
    const a = ALLOYS.find(x => x.id === selectedAlloy);
    const f = FORMS.find(x => x.id === selectedForm);
    const density = a?.density || 4.51;

    // Estimate raw material weight (simplified)
    let rawVolume = 0;
    if (selectedForm === 'bar' || selectedForm === 'tube') {
      const r = (dims.od / 2 + allowance);
      const ri = selectedForm === 'tube' ? (dims.od / 2 - (dims.wall || 0)) : 0;
      rawVolume = Math.PI * (r * r - ri * ri) * (dims.length + allowance * 2);
    } else {
      rawVolume = (dims.width + allowance * 2) * (dims.thickness + allowance * 2) * (dims.length + allowance * 2);
    }
    const rawWeightKg = (rawVolume / 1000) * density / 1000;
    const estCost = rawWeightKg * (a?.costFactor || 1) * 45; // ~$45/kg baseline

    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 8: Material Utilization & Supply</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Estimated cost and supply chain assessment.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Raw Material Weight</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>{rawWeightKg.toFixed(2)} kg</div>
          </div>
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Est. Material Cost</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>${estCost.toFixed(0)}</div>
          </div>
          <div className="p-5 rounded-xl text-center" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Est. Lead Time</div>
            <div className="text-2xl font-bold" style={{ color: 'var(--theme-primary)' }}>{f?.leadTime || 'TBD'}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-surface) 70%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
          <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--theme-text)' }}>Supply Chain Notes</h4>
          <ul className="text-xs space-y-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
            <li>• {a?.name} is widely available in {f?.label || 'standard'} form</li>
            <li>• Minimum order quantity typically 1 piece / 1 bar length</li>
            <li>• Material Certificate (EN 10204 3.1 / MTR) included on request</li>
            <li>• For large quantities, contact our procurement team for volume pricing</li>
          </ul>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => setStep('machinability')} className="px-4 py-3 rounded-xl font-medium transition-all"
            style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>← Back</button>
          <button onClick={() => setStep('summary')}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all"
            style={{ backgroundColor: 'var(--theme-primary)' }}>Generate Procurement Spec →</button>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const a = ALLOYS.find(x => x.id === selectedAlloy);
    const f = FORMS.find(x => x.id === selectedForm);
    const g = GEOMETRIES.find(x => x.id === geometry);
    const alloyName = a?.name || 'TBD';
    const formLabel = f?.label || 'TBD';
    const geoLabel = g?.label || 'TBD';
    const specStd = standard || 'TBD';
    const sizeLabel = (function() {
      if (selectedForm === 'bar') return 'OD ' + (dims.od + allowance * 2) + 'mm x ' + (dims.length + allowance * 2) + 'mm (+' + allowance + 'mm allowance)';
      if (selectedForm === 'tube') return 'OD ' + (dims.od + allowance * 2) + 'mm x ' + (dims.wall || 0) + 'mm wall x ' + (dims.length + allowance * 2) + 'mm';
      const w = (dims.width || 0) + allowance * 2;
      const t = (dims.thickness || 0) + allowance * 2;
      const l = (dims.length || 0) + allowance * 2;
      return w + 'mm x ' + t + 'mm x ' + l + 'mm';
    })();
    const specText = 'MATERIAL: ' + alloyName + String.fromCharCode(10) +
      'STANDARD: ' + specStd + String.fromCharCode(10) +
      'FORM: ' + formLabel + String.fromCharCode(10) +
      'SIZE: ' + sizeLabel + String.fromCharCode(10) +
      'CONDITION: Annealed (A)' + String.fromCharCode(10) +
      'TESTING: UT Class A / MPI per ASTM E2375' + String.fromCharCode(10) +
      'CERTIFICATION: EN 10204 Type 3.1 / MTR' + String.fromCharCode(10) +
      'QUANTITY: As per PO';
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Step 9: Procurement Specification</h3>
        <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Final specification ready for PO issuance.</p>
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', border: '2px solid var(--theme-primary)' }}>
          <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--theme-primary)' }}>MATERIAL PROCUREMENT SPECIFICATION</h4>
          <pre className="text-sm font-mono whitespace-pre-wrap" style={{ color: 'var(--theme-text)' }}>{specText}</pre>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
            <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Grade</div>
            <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{alloyName}</div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
            <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Form</div>
            <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{formLabel}</div>
          </div>
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
            <div className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Geometry</div>
            <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{geoLabel}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setStep('utilization')} className="px-4 py-3 rounded-xl font-medium" style={{ color: 'var(--theme-text)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}>Back</button>
          <button onClick={() => { setStep('env'); setSelectedAlloy(null); setSelectedForm(null); setGeometry(null); setStandard(''); }} className="px-6 py-3 rounded-xl font-semibold" style={{ color: 'var(--theme-primary)', border: '1px solid var(--theme-primary)' }}>Start Over</button>
        </div>
        <div className="mt-8 p-5 rounded-xl text-center" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Need expert confirmation on your material selection?</p>
          <p className="text-xs mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>Send this spec to our engineering team for review and formal quotation.</p>
          <a href="https://www.bozemetal.com/contact" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg text-white transition-all"
            style={{ backgroundColor: 'var(--theme-primary)' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            Submit RFQ with Spec
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'env': return renderEnv();
      case 'prop': return renderProp();
      case 'standard': return renderStandard();
      case 'geometry': return renderGeometry();
      case 'form': return renderForm();
      case 'allowance': return renderAllowance();
      case 'machinability': return renderMachinability();
      case 'utilization': return renderUtilization();
      case 'summary': return renderSummary();
      default: return renderEnv();
    }
  };

  return (
    <div className="w-full">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--theme-primary)' }}>
            Phase {phaseIdx(step) + 1} of 3: {phaseName}
          </span>
          <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
            Step {progress} of {totalSteps}
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(progress / totalSteps) * 100}%`, backgroundColor: 'var(--theme-primary)' }} />
        </div>
        {/* Phase labels */}
        <div className="flex justify-between mt-1">
          {['Material Selection', 'Form Selection', 'Evaluation'].map((p, i) => (
            <span key={p} className="text-xs" style={{ color: phaseIdx(step) >= i ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-text) 30%, transparent)', fontWeight: phaseIdx(step) === i ? 600 : 400 }}>
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
        {renderStep()}
      </div>
    </div>
  );
}

function phaseIdx(step: Step): number {
  if (['env', 'prop', 'standard'].includes(step)) return 0;
  if (['geometry', 'form', 'allowance'].includes(step)) return 1;
  if (['machinability', 'utilization'].includes(step)) return 2;
  return 3;
}
