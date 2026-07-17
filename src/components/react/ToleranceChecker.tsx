import { useState } from 'react';
import { Ruler, CheckCircle2, XCircle, AlertTriangle, Info, Gauge, CircleDot, Move3d, Paintbrush, Wrench, Cog, Drill, Rotate3d } from 'lucide-react';

interface ToleranceFeature {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  unit: string;
  standard: { min: number; max: number; label: string };
  precision: { min: number; max: number; label: string };
  ultraPrecision: { min: number; max: number; label: string };
  note?: string;
}

const features: ToleranceFeature[] = [
  {
    id: 'hole',
    name: 'Hole Diameter (Dowel Pins)',
    icon: Drill,
    description: 'Precision hole sizing for dowel pin fit, bearing seats, and alignment features.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.1, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.003, max: 0.01, label: 'Ultra Precision' },
    note: 'Hole location tolerance is separate — see Position.'
  },
  {
    id: 'position',
    name: 'True Position (GD&T)',
    icon: Move3d,
    description: 'Positional tolerance per ASME Y14.5 — datum-referenced feature location.',
    unit: 'mm',
    standard: { min: 0.1, max: 0.25, label: 'Standard' },
    precision: { min: 0.025, max: 0.1, label: 'Precision' },
    ultraPrecision: { min: 0.005, max: 0.025, label: 'Ultra Precision' },
    note: 'CMM-verified with full dimensional report included.'
  },
  {
    id: 'flatness',
    name: 'Flatness',
    icon: Ruler,
    description: 'Surface flatness control for sealing faces and mounting surfaces.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.15, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.003, max: 0.01, label: 'Ultra Precision' },
  },
  {
    id: 'concentricity',
    name: 'Concentricity / Coaxiality',
    icon: CircleDot,
    description: 'Control of median points of two or more features relative to a datum axis.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.15, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.005, max: 0.01, label: 'Ultra Precision' },
    note: 'ISO 1940 G2.5 dynamic balance available on rotating assemblies.'
  },
  {
    id: 'surface-finish',
    name: 'Surface Finish (Ra)',
    icon: Paintbrush,
    description: 'Average surface roughness for sealing, fatigue life, and aesthetic requirements.',
    unit: 'µm',
    standard: { min: 1.6, max: 3.2, label: 'Standard' },
    precision: { min: 0.4, max: 1.6, label: 'Precision' },
    ultraPrecision: { min: 0.1, max: 0.4, label: 'Ultra Precision' },
  },
  {
    id: 'angularity',
    name: 'Angularity',
    icon: Rotate3d,
    description: 'Control of surface orientation at a specified angle to a datum.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.15, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.005, max: 0.01, label: 'Ultra Precision' },
  },
  {
    id: 'parallelism',
    name: 'Parallelism',
    icon: Gauge,
    description: 'Control of surface parallelism relative to a datum plane or axis.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.15, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.003, max: 0.01, label: 'Ultra Precision' },
  },
  {
    id: 'thread',
    name: 'Thread Pitch Diameter',
    icon: Cog,
    description: 'Precision threading for fasteners, sensors, and fluid fittings.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.1, label: 'Standard' },
    precision: { min: 0.02, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.01, max: 0.02, label: 'Ultra Precision' },
    note: 'Unified (UN/UNF), Metric (M), and custom thread forms available.'
  },
  {
    id: 'perpendicularity',
    name: 'Perpendicularity (Squareness)',
    icon: Wrench,
    description: 'Control of surface perpendicularity relative to a datum plane or axis.',
    unit: 'mm',
    standard: { min: 0.05, max: 0.15, label: 'Standard' },
    precision: { min: 0.01, max: 0.05, label: 'Precision' },
    ultraPrecision: { min: 0.005, max: 0.01, label: 'Ultra Precision' },
  },
];

type Grade = 'standard' | 'precision' | 'ultra-precision';

function getGrade(value: number, feature: ToleranceFeature): { grade: Grade; achievable: boolean; description: string } {
  // Check ultra precision first (tighter tolerances)
  if (value <= feature.ultraPrecision.max) {
    return {
      grade: 'ultra-precision',
      achievable: value >= feature.ultraPrecision.min,
      description: value >= feature.ultraPrecision.min
        ? 'Within our ultra-precision envelope. Full CMM verification included. AS9100 standard.'
        : 'Exceeds our standard ultra-precision range. Contact engineering for feasibility review.',
    };
  }
  if (value <= feature.precision.max) {
    return {
      grade: 'precision',
      achievable: true,
      description: 'Within our precision machining envelope. Suitable for most aerospace and medical applications.',
    };
  }
  if (value <= feature.standard.max) {
    return {
      grade: 'standard',
      achievable: true,
      description: 'Standard production tolerance. Readily achievable across all our CNC centers.',
    };
  }
  return {
    grade: 'standard',
    achievable: false,
    description: 'This tolerance is looser than our standard capability — easily achievable. Consider tightening if your design requires better control.',
  };
}

export default function ToleranceChecker() {
  const [selectedFeature, setSelectedFeature] = useState<ToleranceFeature>(features[0]);
  const [inputValue, setInputValue] = useState('0.01');
  const value = parseFloat(inputValue);

  const result = !isNaN(value) && value > 0 ? getGrade(value, selectedFeature) : null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleQuickSelect = (v: number) => {
    setInputValue(v.toString());
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feature Selector */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl shadow-lg p-5" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--theme-text)' }}>Feature Type</h3>
            <div className="space-y-1.5">
              {features.map(f => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedFeature(f); setInputValue('0.01'); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                    style={{
                      backgroundColor: selectedFeature.id === f.id ? 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' : 'transparent',
                      color: selectedFeature.id === f.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
                      border: `1px solid ${selectedFeature.id === f.id ? 'color-mix(in srgb, var(--theme-primary) 20%, transparent)' : 'transparent'}`,
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{f.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tolerance Input & Result */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl shadow-lg p-5 mb-4" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
            <p className="text-sm mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>
              {selectedFeature.description}
            </p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>
                {selectedFeature.name}
              </span>
              <span className="text-xs" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
                (Unit: {selectedFeature.unit})
              </span>
            </div>

            {/* Tolerance Value Input */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="range"
                  min="0.001"
                  max="0.5"
                  step="0.001"
                  value={value}
                  onChange={handleSliderChange}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--theme-primary) ${Math.min((value / 0.5) * 100, 100)}%, color-mix(in srgb, var(--theme-bg) 70%, transparent) ${Math.min((value / 0.5) * 100, 100)}%)`,
                  }}
                />
                <div className="flex justify-between text-[10px] mt-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 30%, transparent)' }}>
                  <span>0.001</span>
                  <span>0.5</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  step="0.001"
                  min="0.001"
                  max="1"
                  className="w-24 px-3 py-2 rounded-xl text-sm font-mono text-center outline-none"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                    color: 'var(--theme-text)',
                    border: '1px solid color-mix(in srgb, var(--theme-primary) 15%, transparent)',
                  }}
                />
                <span className="text-sm font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
                  {selectedFeature.unit === 'µm' ? 'µm' : 'mm'}
                </span>
              </div>
            </div>

            {/* Quick Select Presets */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Quick values:</span>
              {[0.005, 0.01, 0.025, 0.05, 0.1].map(v => (
                <button
                  key={v}
                  onClick={() => handleQuickSelect(v)}
                  className="px-2.5 py-1 text-xs rounded-lg transition-all font-mono"
                  style={{
                    backgroundColor: Math.abs(value - v) < 0.0001 ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                    color: Math.abs(value - v) < 0.0001 ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                    border: `1px solid ${Math.abs(value - v) < 0.0001 ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                  }}
                >
                  ±{v} mm
                </button>
              ))}
            </div>

            {/* Capability Bands */}
            <div className="rounded-xl p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--theme-bg) 50%, transparent)' }}>
              <div className="text-xs font-medium mb-2" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Capability Bands for {selectedFeature.name}:</div>
              {[
                { ...selectedFeature.ultraPrecision, key: 'ultra', color: '#22c55e', labelColor: '#22c55e' },
                { ...selectedFeature.precision, key: 'precision', color: '#06b6d4', labelColor: '#06b6d4' },
                { ...selectedFeature.standard, key: 'standard', color: '#f59e0b', labelColor: '#f59e0b' },
              ].map(band => {
                const isActive = value >= band.min && value <= band.max;
                return (
                  <div key={band.key} className="flex items-center gap-2 py-1">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: band.color, opacity: isActive ? 1 : 0.4 }} />
                    <span className="text-xs font-medium" style={{ color: band.labelColor, opacity: isActive ? 1 : 0.5 }}>
                      {band.label}
                    </span>
                    <span className="text-xs font-mono" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
                      (±{band.min} – {band.max} {selectedFeature.unit})
                    </span>
                    {isActive && (
                      <span className="text-xs font-bold ml-auto" style={{ color: band.color }}>← Your Value</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div
              className="rounded-2xl p-5 shadow-lg"
              style={{
                backgroundColor: 'var(--theme-surface)',
                border: `1px solid ${
                  !result.achievable ? '#ef4444' :
                  result.grade === 'ultra-precision' ? '#22c55e' :
                  result.grade === 'precision' ? '#06b6d4' : '#f59e0b'
                }40`,
              }}
            >
              <div className="flex items-start gap-3">
                {!result.achievable ? (
                  <XCircle className="w-8 h-8 shrink-0" style={{ color: '#ef4444' }} />
                ) : result.grade === 'ultra-precision' ? (
                  <CheckCircle2 className="w-8 h-8 shrink-0" style={{ color: '#22c55e' }} />
                ) : (
                  <CheckCircle2 className="w-8 h-8 shrink-0" style={{ color: '#06b6d4' }} />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>
                      ±{value} {selectedFeature.unit}
                    </span>
                    <span
                      className="px-2 py-0.5 text-xs font-bold rounded-md"
                      style={{
                        backgroundColor: !result.achievable ? 'color-mix(in srgb, #ef4444 15%, transparent)' :
                          result.grade === 'ultra-precision' ? 'color-mix(in srgb, #22c55e 15%, transparent)' :
                          'color-mix(in srgb, #06b6d4 15%, transparent)',
                        color: !result.achievable ? '#ef4444' :
                          result.grade === 'ultra-precision' ? '#22c55e' : '#06b6d4',
                      }}
                    >
                      {!result.achievable ? 'Review Required' :
                        result.grade === 'ultra-precision' ? 'FEASIBLE ✓' :
                        'FEASIBLE'}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}>
                    {result.description}
                  </p>
                  {selectedFeature.note && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: 'color-mix(in srgb, var(--theme-primary) 60%, transparent)' }}>
                      <Info className="w-3 h-3" />
                      {selectedFeature.note}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
