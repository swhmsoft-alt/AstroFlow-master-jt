import { useState } from 'react';
import { Weight, ArrowLeftRight, Calculator, RotateCcw } from 'lucide-react';

interface Alloy {
  name: string;
  density: number;
}

const alloys: Alloy[] = [
  { name: 'Grade 1 CP-Ti (99.5%)', density: 4.51 },
  { name: 'Grade 2 CP-Ti (99.8%)', density: 4.51 },
  { name: 'Grade 3 CP-Ti (99.8%)', density: 4.51 },
  { name: 'Grade 4 CP-Ti (99.6%)', density: 4.51 },
  { name: 'Grade 5 Ti-6Al-4V', density: 4.43 },
  { name: 'Grade 6 Ti-5Al-2.5Sn', density: 4.48 },
  { name: 'Grade 7 Ti-0.15Pd', density: 4.51 },
  { name: 'Grade 9 Ti-3Al-2.5V', density: 4.48 },
  { name: 'Grade 12 Ti-0.3Mo-0.8Ni', density: 4.51 },
  { name: 'Grade 19 Beta (Ti-10V-2Fe-3Al)', density: 4.65 },
  { name: 'Grade 21 Beta (Ti-15V-3Cr-3Sn-3Al)', density: 4.78 },
  { name: 'Grade 23 Ti-6Al-4V ELI', density: 4.43 },
  { name: 'Grade 6242 (Ti-6Al-2Sn-4Zr-2Mo)', density: 4.54 },
  { name: 'Ti-5Al-5V-5Mo-3Cr', density: 4.65 },
  { name: 'Ti-6Al-2Nb-1Ta-0.8Mo', density: 4.49 },
];

type Shape = 'round' | 'plate' | 'tube' | 'rect';

interface ShapeConfig {
  id: Shape;
  label: string;
  params: { key: string; label: string; default: number }[];
}

const shapes: ShapeConfig[] = [
  { id: 'round', label: 'Round Bar', params: [
    { key: 'diameter', label: 'Diameter', default: 25 },
    { key: 'length', label: 'Length', default: 100 },
  ]},
  { id: 'plate', label: 'Flat Plate', params: [
    { key: 'width', label: 'Width', default: 100 },
    { key: 'length', label: 'Length', default: 100 },
    { key: 'thickness', label: 'Thickness', default: 10 },
  ]},
  { id: 'tube', label: 'Tube / Pipe', params: [
    { key: 'od', label: 'Outer Diameter', default: 50 },
    { key: 'wall', label: 'Wall Thickness', default: 5 },
    { key: 'length', label: 'Length', default: 100 },
  ]},
  { id: 'rect', label: 'Rectangular Bar', params: [
    { key: 'width', label: 'Width', default: 50 },
    { key: 'height', label: 'Height', default: 25 },
    { key: 'length', label: 'Length', default: 100 },
  ]},
];

function calculateVolume(shape: Shape, dims: Record<string, number>): number {
  switch (shape) {
    case 'round': {
      const r = (dims.diameter || 0) / 2;
      return Math.PI * r * r * (dims.length || 0);
    }
    case 'plate':
      return (dims.width || 0) * (dims.length || 0) * (dims.thickness || 0);
    case 'tube': {
      const ro = (dims.od || 0) / 2;
      const ri = ro - (dims.wall || 0);
      return Math.PI * (ro * ro - ri * ri) * (dims.length || 0);
    }
    case 'rect':
      return (dims.width || 0) * (dims.height || 0) * (dims.length || 0);
  }
}

export default function WeightCalculator() {
  const [alloy, setAlloy] = useState<Alloy>(alloys[1]); // Grade 2 default
  const [shape, setShape] = useState<Shape>('round');
  const [unit, setUnit] = useState<'mm' | 'inch'>('mm');
  const [dims, setDims] = useState<Record<string, number>>({
    diameter: 25, length: 100, width: 100, thickness: 10,
    od: 50, wall: 5, height: 25,
  });

  const shapeConfig = shapes.find(s => s.id === shape)!;

  const updateDim = (key: string, val: string) => {
    setDims(prev => ({ ...prev, [key]: parseFloat(val) || 0 }));
  };

  const volumeMM = calculateVolume(shape, dims);
  const volumeCM = volumeMM / 1000;
  const weightG = volumeCM * alloy.density;
  const weightKg = weightG / 1000;
  const weightLb = weightKg * 2.20462;

  const costPerKg = alloy.name.includes('Grade 5') ? 45 :
    alloy.name.includes('Grade 23') ? 65 :
    alloy.name.includes('Beta') || alloy.name.includes('5553') ? 55 :
    alloy.name.includes('Grade 7') ? 80 :
    alloy.name.includes('Grade 6242') ? 70 : 35;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl shadow-lg p-6" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            {/* Unit Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Weight className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                <span className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>Material & Dimensions</span>
              </div>
              <button
                onClick={() => setUnit(unit === 'mm' ? 'inch' : 'mm')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--theme-primary) 10%, transparent)',
                  color: 'var(--theme-primary)',
                  border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                }}
              >
                <ArrowLeftRight className="w-3 h-3" />
                Switch to {unit === 'mm' ? 'inches' : 'mm'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Alloy Select */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                  Titanium Alloy / Grade
                </label>
                <select
                  value={alloy.name}
                  onChange={e => setAlloy(alloys.find(a => a.name === e.target.value) || alloys[1])}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                    color: 'var(--theme-text)',
                    border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                  }}
                >
                  {alloys.map(a => (
                    <option key={a.name} value={a.name}>{a.name} ({a.density} g/cm³)</option>
                  ))}
                </select>
              </div>

              {/* Shape Select */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                  Shape
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {shapes.map(s => (
                    <button
                      key={s.id}
                      onClick={() => setShape(s.id)}
                      className="px-3 py-2 text-xs rounded-xl font-medium transition-all"
                      style={{
                        backgroundColor: shape === s.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                        color: shape === s.id ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                        border: `1px solid ${shape === s.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dimension Inputs */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {shapeConfig.params.map(p => (
                <div key={p.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>
                    {p.label} ({unit})
                  </label>
                  <input
                    type="number"
                    value={dims[p.key] || ''}
                    onChange={e => updateDim(p.key, e.target.value)}
                    min="0.1"
                    step={unit === 'mm' ? '1' : '0.1'}
                    className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                      color: 'var(--theme-text)',
                      border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-lg p-6 h-full" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Calculator className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>Results</span>
            </div>

            <div className="space-y-4">
              {/* Alloy Density */}
              <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
                <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Alloy Density</span>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--theme-text)' }}>{alloy.density} g/cm³</span>
              </div>

              {/* Volume */}
              <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
                <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Volume</span>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--theme-text)' }}>
                  {volumeMM > 1000
                    ? `${(volumeCM / 1000).toFixed(3)} cm³`
                    : `${volumeCM.toFixed(2)} mm³`
                  }
                </span>
              </div>

              {/* Weight - kg */}
              <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
                <div className="text-center">
                  <div className="text-xs mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Weight</div>
                  <div className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                    {weightKg.toFixed(3)}
                    <span className="text-lg ml-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>kg</span>
                  </div>
                  <div className="text-sm mt-1 font-mono" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
                    ≈ {weightLb.toFixed(2)} lb &nbsp;|&nbsp; {weightG.toFixed(0)} g
                  </div>
                </div>
              </div>

              {/* Estimated Material Cost */}
              <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
                <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Est. Material Cost</span>
                <span className="text-sm font-bold font-mono" style={{ color: 'var(--theme-text)' }}>
                  ${(weightKg * costPerKg).toFixed(2)}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'color-mix(in srgb, var(--theme-text) 30%, transparent)' }}>
                * Raw material estimate only. Actual cost varies by qty, sourcing, and certification requirements.
              </div>

              {/* Quick Reference */}
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)' }}>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShape('round');
                      setDims(prev => ({ ...prev, diameter: 25, length: 100 }));
                    }}
                    className="flex-1 px-2 py-1.5 text-[10px] rounded-lg font-medium transition-all text-center"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                      color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)',
                      border: '1px solid color-mix(in srgb, var(--theme-primary) 8%, transparent)',
                    }}
                  >
                    <RotateCcw className="w-3 h-3 mx-auto mb-0.5" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
