import { useState } from 'react';
import { Search, Check, FlaskConical, ShieldCheck, HeartPulse, Wrench, Thermometer, Gauge, Weight, DollarSign } from 'lucide-react';

interface Grade {
  id: string;
  name: string;
  description: string;
  strength: 'low' | 'medium' | 'high' | 'very-high';
  corrosionResistance: 'low' | 'medium' | 'high' | 'very-high';
  biocompatibility: boolean;
  weldability: 'poor' | 'fair' | 'good' | 'excellent';
  maxTemp: string;
  density: string;
  relativeCost: 1 | 2 | 3 | 4 | 5;
  applications: string[];
  specs: string[];
}

const grades: Grade[] = [
  {
    id: 'grade-1',
    name: 'Grade 1 CP-Ti (99.5%)',
    description: 'Commercially pure titanium with maximum formability and corrosion resistance. Lowest strength of all CP grades.',
    strength: 'low',
    corrosionResistance: 'very-high',
    biocompatibility: true,
    weldability: 'excellent',
    maxTemp: '316°C',
    density: '4.51 g/cm³',
    relativeCost: 2,
    applications: ['Chemical processing equipment', 'Desalination plants', 'Marine components', 'Heat exchangers', 'Architectural', 'Medical implants (limited load)'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4900', 'AMS 4941']
  },
  {
    id: 'grade-2',
    name: 'Grade 2 CP-Ti (99.8%)',
    description: 'Most widely used CP titanium grade — excellent balance of strength, corrosion resistance, and formability. Workhorse grade for industrial applications.',
    strength: 'medium',
    corrosionResistance: 'very-high',
    biocompatibility: true,
    weldability: 'excellent',
    maxTemp: '316°C',
    density: '4.51 g/cm³',
    relativeCost: 2,
    applications: ['Chemical processing', 'Marine components', 'Power generation', 'Heat exchangers', 'Desalination', 'Medical devices', 'Architecture'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4901', 'AMS 4942']
  },
  {
    id: 'grade-4',
    name: 'Grade 4 CP-Ti (99.6%)',
    description: 'Highest strength CP grade. Used when higher strength than Grade 2 is needed but with similar corrosion resistance.',
    strength: 'high',
    corrosionResistance: 'very-high',
    biocompatibility: true,
    weldability: 'good',
    maxTemp: '316°C',
    density: '4.51 g/cm³',
    relativeCost: 2,
    applications: ['Medical devices', 'Sporting goods', 'Cryogenic vessels', 'Structural components', 'Chemical processing'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4902']
  },
  {
    id: 'grade-5',
    name: 'Grade 5 Ti-6Al-4V',
    description: 'The most widely used titanium alloy — accounts for ~50% of all titanium usage. Exceptional strength-to-weight ratio, heat treatable.',
    strength: 'very-high',
    corrosionResistance: 'high',
    biocompatibility: true,
    weldability: 'fair',
    maxTemp: '400°C',
    density: '4.43 g/cm³',
    relativeCost: 3,
    applications: ['Aerospace structures', 'Aircraft engines', 'Medical implants', 'Marine', 'Automotive racing', 'Oil & gas'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4911', 'AMS 4928', 'MIL-T-9047']
  },
  {
    id: 'grade-23',
    name: 'Grade 23 Ti-6Al-4V ELI',
    description: 'Extra Low Interstitial version of Grade 5. Improved fracture toughness and ductility at cryogenic temperatures. Preferred for medical implants.',
    strength: 'very-high',
    corrosionResistance: 'high',
    biocompatibility: true,
    weldability: 'fair',
    maxTemp: '350°C',
    density: '4.43 g/cm³',
    relativeCost: 4,
    applications: ['Surgical implants', 'Orthopedic devices', 'Dental implants', 'Cryogenic components', 'Aerospace critical parts'],
    specs: ['ASTM F136', 'ASTM F1472', 'ISO 5832-3', 'AMS 4930']
  },
  {
    id: 'grade-7',
    name: 'Grade 7 Ti-0.15Pd',
    description: 'CP titanium with palladium addition for enhanced corrosion resistance in reducing acid environments. Best corrosion resistance of all titanium grades.',
    strength: 'medium',
    corrosionResistance: 'very-high',
    biocompatibility: true,
    weldability: 'good',
    maxTemp: '316°C',
    density: '4.51 g/cm³',
    relativeCost: 5,
    applications: ['Chemical processing severe environments', 'Pickling equipment', 'Hydrochloric acid service', 'Chloride environments'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4903']
  },
  {
    id: 'grade-9',
    name: 'Grade 9 Ti-3Al-2.5V',
    description: 'Medium-strength alloy with excellent formability and weldability. Often used for hydraulic tubing and aerospace applications.',
    strength: 'high',
    corrosionResistance: 'high',
    biocompatibility: false,
    weldability: 'excellent',
    maxTemp: '350°C',
    density: '4.48 g/cm³',
    relativeCost: 3,
    applications: ['Aerospace hydraulic tubing', 'Sporting goods', 'Bicycle frames', 'Chemical processing', 'Marine'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4915', 'AMS 4943']
  },
  {
    id: 'grade-12',
    name: 'Grade 12 Ti-0.3Mo-0.8Ni',
    description: 'CP-type alloy with molybdenum and nickel for improved strength and corrosion resistance at elevated temperatures. Cost-effective alternative to Grade 7.',
    strength: 'medium',
    corrosionResistance: 'very-high',
    biocompatibility: false,
    weldability: 'good',
    maxTemp: '350°C',
    density: '4.51 g/cm³',
    relativeCost: 3,
    applications: ['Chemical processing', 'Heat exchangers', 'Marine', 'Desalination', 'Power generation'],
    specs: ['ASTM B265', 'ASTM B348', 'AMS 4904']
  },
  {
    id: 'grade-19',
    name: 'Grade 19 Beta Ti (Ti-10V-2Fe-3Al)',
    description: 'Beta titanium alloy with very high strength achievable through heat treatment. Excellent forgeability and deep hardenability.',
    strength: 'very-high',
    corrosionResistance: 'medium',
    biocompatibility: false,
    weldability: 'poor',
    maxTemp: '320°C',
    density: '4.65 g/cm³',
    relativeCost: 4,
    applications: ['Aerospace landing gear', 'High-strength structural components', 'Automotive racing', 'Oil & gas tools'],
    specs: ['AMS 4983', 'AMS 4984']
  },
  {
    id: 'grade-21',
    name: 'Grade 21 Beta Alloy (Ti-15V-3Cr-3Sn-3Al)',
    description: 'Beta alloy with exceptional cold formability in solution-treated condition. Age-hardenable to very high strength levels.',
    strength: 'very-high',
    corrosionResistance: 'medium',
    biocompatibility: false,
    weldability: 'poor',
    maxTemp: '300°C',
    density: '4.78 g/cm³',
    relativeCost: 4,
    applications: ['Aerospace sheet metal parts', 'Springs', 'Fasteners', 'Aircraft ducting'],
    specs: ['AMS 4914', 'AMS 4932']
  },
  {
    id: 'grade-6242',
    name: 'Grade 6242 (Ti-6Al-2Sn-4Zr-2Mo)',
    description: 'High-temperature alpha-beta alloy designed for elevated temperature service up to 565°C. Used in jet engine components.',
    strength: 'very-high',
    corrosionResistance: 'high',
    biocompatibility: false,
    weldability: 'fair',
    maxTemp: '565°C',
    density: '4.54 g/cm³',
    relativeCost: 5,
    applications: ['Jet engine components', 'Gas turbine parts', 'High-temperature airframe structures'],
    specs: ['AMS 4919', 'AMS 4975', 'ASTM B265']
  },
  {
    id: 'ti-5553',
    name: 'Ti-5Al-5V-5Mo-3Cr',
    description: 'High-strength beta alloy developed as a cost-effective alternative to Ti-10V-2Fe-3Al. Excellent deep hardenability for large sections.',
    strength: 'very-high',
    corrosionResistance: 'medium',
    biocompatibility: false,
    weldability: 'poor',
    maxTemp: '350°C',
    density: '4.65 g/cm³',
    relativeCost: 4,
    applications: ['Landing gear components', 'Large structural forgings', 'Automotive suspension', 'Aerospace fasteners'],
    specs: ['AMS 4998', 'AMS 4999']
  }
];

type FilterKey = 'strength' | 'corrosionResistance' | 'biocompatibility' | 'weldability' | 'maxTemp' | 'relativeCost';

interface Filters {
  strength: string;
  corrosionResistance: string;
  biocompatibility: boolean | null;
  weldability: string;
  maxCost: number;
  search: string;
}

export default function TitaniumGradeFinder() {
  const [filters, setFilters] = useState<Filters>({
    strength: '',
    corrosionResistance: '',
    biocompatibility: null,
    weldability: '',
    maxCost: 5,
    search: '',
  });
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const toggleBiocompatibility = () => {
    setFilters(prev => ({
      ...prev,
      biocompatibility: prev.biocompatibility === null ? true : prev.biocompatibility === true ? false : null
    }));
  };

  const filteredGrades = grades.filter(grade => {
    if (filters.strength && grade.strength !== filters.strength) return false;
    if (filters.corrosionResistance && grade.corrosionResistance !== filters.corrosionResistance) return false;
    if (filters.biocompatibility !== null && grade.biocompatibility !== filters.biocompatibility) return false;
    if (filters.weldability && grade.weldability !== filters.weldability) return false;
    if (grade.relativeCost > filters.maxCost) return false;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      const match = grade.name.toLowerCase().includes(s) ||
        grade.description.toLowerCase().includes(s) ||
        grade.applications.some(a => a.toLowerCase().includes(s)) ||
        grade.specs.some(sp => sp.toLowerCase().includes(s));
      if (!match) return false;
    }
    return true;
  });

  const activeFilters = [
    filters.strength, filters.corrosionResistance,
    filters.weldability, filters.biocompatibility !== null ? 'bio' : '',
    filters.maxCost < 5 ? `cost≤${filters.maxCost}` : '',
    filters.search
  ].filter(Boolean).length;

  const selectedGradeData = selectedGrade ? grades.find(g => g.id === selectedGrade) : null;

  return (
    <div className="w-full">
      {/* Search + Filter Bar */}
      <div className="rounded-2xl shadow-lg p-6 mb-8" style={{ backgroundColor: 'var(--theme-surface)', border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}>
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }} />
            <input
              type="text"
              placeholder="Search by name, property, application, or spec..."
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                color: 'var(--theme-text)',
                border: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)',
              }}
            />
          </div>
          {activeFilters > 0 && (
            <button
              onClick={() => setFilters({ strength: '', corrosionResistance: '', biocompatibility: null, weldability: '', maxCost: 5, search: '' })}
              className="px-4 py-2 text-sm rounded-xl transition-all whitespace-nowrap"
              style={{ color: 'var(--theme-primary)', border: '1px solid color-mix(in srgb, var(--theme-primary) 20%, transparent)' }}
            >
              Clear ({activeFilters})
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap gap-3">
          {/* Strength */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Strength:</span>
            {['low', 'medium', 'high', 'very-high'].map(s => (
              <button
                key={s}
                onClick={() => setFilters(prev => ({ ...prev, strength: prev.strength === s ? '' : s }))}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${filters.strength === s ? 'shadow-sm' : ''}`}
                style={{
                  backgroundColor: filters.strength === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                  color: filters.strength === s ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                  border: `1px solid ${filters.strength === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                }}
              >
                {s === 'very-high' ? 'Very High' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Corrosion Resistance */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Corrosion:</span>
            {['low', 'medium', 'high', 'very-high'].map(s => (
              <button
                key={s}
                onClick={() => setFilters(prev => ({ ...prev, corrosionResistance: prev.corrosionResistance === s ? '' : s }))}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${filters.corrosionResistance === s ? 'shadow-sm' : ''}`}
                style={{
                  backgroundColor: filters.corrosionResistance === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                  color: filters.corrosionResistance === s ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                  border: `1px solid ${filters.corrosionResistance === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                }}
              >
                {s === 'very-high' ? 'Very High' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Weldability */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Weld:</span>
            {['poor', 'fair', 'good', 'excellent'].map(s => (
              <button
                key={s}
                onClick={() => setFilters(prev => ({ ...prev, weldability: prev.weldability === s ? '' : s }))}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${filters.weldability === s ? 'shadow-sm' : ''}`}
                style={{
                  backgroundColor: filters.weldability === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                  color: filters.weldability === s ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
                  border: `1px solid ${filters.weldability === s ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                }}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Biocompatibility */}
          <button
            onClick={toggleBiocompatibility}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all ${filters.biocompatibility !== null ? 'shadow-sm' : ''}`}
            style={{
              backgroundColor: filters.biocompatibility !== null ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
              color: filters.biocompatibility !== null ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 60%, transparent)',
              border: `1px solid ${filters.biocompatibility !== null ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
            }}
          >
            <HeartPulse className="w-3 h-3" />
            {filters.biocompatibility === null ? 'Medical Grade?' : filters.biocompatibility ? '✓ Medical Grade' : '✗ Non-Medical'}
          </button>

          {/* Cost Range */}
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-3 h-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }} />
            <span className="text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>Max Cost:</span>
            {[1, 2, 3, 4, 5].map(c => (
              <button
                key={c}
                onClick={() => setFilters(prev => ({ ...prev, maxCost: prev.maxCost === c ? 5 : c }))}
                className={`px-2 py-1 text-xs rounded-lg transition-all ${filters.maxCost >= c ? 'shadow-sm' : ''}`}
                style={{
                  backgroundColor: filters.maxCost >= c ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-bg) 70%, transparent)',
                  color: filters.maxCost >= c ? 'var(--theme-text)' : 'color-mix(in srgb, var(--theme-text) 40%, transparent)',
                  border: `1px solid ${filters.maxCost >= c ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 10%, transparent)'}`,
                  opacity: filters.maxCost >= c ? 1 : 0.4 + (c / 10),
                }}
              >
                {'$'.repeat(c)}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-xs font-medium" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
          {filteredGrades.length} of {grades.length} grades match your criteria
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGrades.map(grade => (
          <div
            key={grade.id}
            onClick={() => setSelectedGrade(selectedGrade === grade.id ? null : grade.id)}
            className="rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: 'var(--theme-surface)',
              border: `1px solid ${selectedGrade === grade.id ? 'var(--theme-primary)' : 'color-mix(in srgb, var(--theme-primary) 12%, transparent)'}`,
              boxShadow: selectedGrade === grade.id ? '0 4px 20px color-mix(in srgb, var(--theme-primary) 15%, transparent)' : 'none',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold" style={{ color: 'var(--theme-text)' }}>{grade.name}</h3>
              <div className="flex items-center gap-0.5 shrink-0 ml-2">
                {Array.from({ length: grade.relativeCost }).map((_, i) => (
                  <DollarSign key={i} className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
                ))}
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
              {grade.description}
            </p>
            
            {/* Property Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md font-medium"
                style={{
                  backgroundColor: grade.strength === 'very-high' ? 'color-mix(in srgb, #ef4444 15%, transparent)' :
                    grade.strength === 'high' ? 'color-mix(in srgb, #f97316 15%, transparent)' :
                    'color-mix(in srgb, #22c55e 15%, transparent)',
                  color: grade.strength === 'very-high' ? '#ef4444' :
                    grade.strength === 'high' ? '#f97316' : '#22c55e',
                }}
              >
                <Gauge className="w-2.5 h-2.5" />
                {grade.strength === 'very-high' ? 'Ultra Strong' :
                  grade.strength === 'high' ? 'High Strength' :
                  grade.strength === 'medium' ? 'Medium' : 'Low Strength'}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, #06b6d4 15%, transparent)',
                  color: '#06b6d4',
                }}
              >
                <ShieldCheck className="w-2.5 h-2.5" />
                {grade.corrosionResistance === 'very-high' ? 'Superior Corrosion' : grade.corrosionResistance === 'high' ? 'High Corrosion' : 'Moderate'}
              </span>
              {grade.biocompatibility && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md font-medium"
                  style={{
                    backgroundColor: 'color-mix(in srgb, #ec4899 15%, transparent)',
                    color: '#ec4899',
                  }}
                >
                  <HeartPulse className="w-2.5 h-2.5" />
                  Medical Grade
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-md font-medium"
                style={{
                  backgroundColor: 'color-mix(in srgb, #8b5cf6 15%, transparent)',
                  color: '#8b5cf6',
                }}
              >
                <Thermometer className="w-2.5 h-2.5" />
                {grade.maxTemp}
              </span>
            </div>

            {/* Expandable Detail */}
            {selectedGrade === grade.id && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)' }}>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Density: </span>
                    <span className="font-medium" style={{ color: 'var(--theme-text)' }}>{grade.density}</span>
                  </div>
                  <div>
                    <span style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Max Temp: </span>
                    <span className="font-medium" style={{ color: 'var(--theme-text)' }}>{grade.maxTemp}</span>
                  </div>
                  <div>
                    <span style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Weldability: </span>
                    <span className="font-medium" style={{ color: 'var(--theme-text)' }}>{grade.weldability.charAt(0).toUpperCase() + grade.weldability.slice(1)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Biocompatible: </span>
                    <span className="font-medium" style={{ color: grade.biocompatibility ? '#22c55e' : '#ef4444' }}>{grade.biocompatibility ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Key Applications:</div>
                  <div className="flex flex-wrap gap-1">
                    {grade.applications.map((app, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 8%, transparent)', color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)' }}
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>Specifications:</div>
                  <div className="flex flex-wrap gap-1">
                    {grade.specs.map((sp, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                        style={{ backgroundColor: 'color-mix(in srgb, #8b5cf6 8%, transparent)', color: 'color-mix(in srgb, var(--theme-text) 60%, transparent)' }}
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-16">
          <FlaskConical className="w-12 h-12 mx-auto mb-4" style={{ color: 'color-mix(in srgb, var(--theme-text) 20%, transparent)' }} />
          <p className="text-lg font-medium mb-1" style={{ color: 'color-mix(in srgb, var(--theme-text) 50%, transparent)' }}>No grades match your criteria</p>
          <p className="text-sm" style={{ color: 'color-mix(in srgb, var(--theme-text) 30%, transparent)' }}>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
