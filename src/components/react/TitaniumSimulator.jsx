/**
 * TitaniumSimulator.jsx
 *
 * Interactive Titanium 5-Axis CNC Machining Simulator.
 *
 * Real-time calculation engine (60 fps) using Taylor's tool-life equation
 * and aerospace-grade cutting-force models. Renders two live Chart.js
 * visualisations: a force-vs-limit telemetry gauge and a tool-wear timeline.
 *
 * Theme awareness:
 *  - Reads --theme-* CSS custom properties at runtime so chart colours
 *    follow the active `data-theme` attribute on <html>.
 *  - A MutationObserver re-reads variables on every theme switch.
 *
 * Pure compute() is intentionally side-effect-free so it can be unit-tested
 * or reused server-side if needed.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import {
  Gauge,
  Settings2,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  Cpu,
  Flame,
  Droplets,
} from 'lucide-react';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

/* ────────────────────────────────────────────────────────────────
 * Domain constants
 * ────────────────────────────────────────────────────────────────*/
const CUTTER_DIA = 10; // mm — assumed 4-flute end mill
const FLUTES = 4;
const FORCE_BASE = 2200; // N·min/mm² reference specific cutting force
const TAYLOR_C = 250; // Taylor tool-life constant for Ti-6Al-4V family
const FORCE_LIMIT = 1500; // N — safe upper limit for a 10mm 4-flute cutter
const VB_LIMIT = 0.4; // mm — ISO 8685-1 flank-wear failure criterion

/* ────────────────────────────────────────────────────────────────
 * Lookup tables
 * ────────────────────────────────────────────────────────────────*/
const ALLOYS = [
  {
    id: 'ti6al4v',
    name: 'Ti-6Al-4V (Grade 5)',
    factor: 1.0,
    note: 'α-β alloy, aerospace baseline — most common 5-axis material.',
  },
  {
    id: 'ti5553',
    name: 'Ti-5553 (β-rich)',
    factor: 1.3,
    note: 'Higher strength β-lean alloy — 30 % higher specific cutting force.',
  },
  {
    id: 'cp2',
    name: 'CP Titanium Grade 2',
    factor: 0.6,
    note: 'Commercially pure — softest, easiest to machine, lowest force.',
  },
];

const COATINGS = [
  {
    id: 'altin',
    name: 'AlTiN',
    forceFactor: 1.0,
    lifeFactor: 1.0,
    note: 'Aluminium titanium nitride — baseline reference for cemented carbide.',
  },
  {
    id: 'dlc',
    name: 'DLC / TiB₂',
    forceFactor: 0.85,
    lifeFactor: 1.5,
    note: 'Diamond-like carbon / titanium diboride — +50 % tool life, −15 % force.',
  },
  {
    id: 'uncoated',
    name: 'Uncoated carbide',
    forceFactor: 1.1,
    lifeFactor: 0.5,
    note: 'No coating — short tool life, 10 % higher force. Only for sticky Ti alloys.',
  },
];

/* ────────────────────────────────────────────────────────────────
 * Pure calculation engine — no React, no DOM
 * ────────────────────────────────────────────────────────────────*/
function compute({ Vc, fz, ap, ae, alloyFactor, coatingForce, coatingLife }) {
  // Spindle speed (RPM) for a Ø10 mm 4-flute cutter
  const RPM = (Vc * 1000) / (Math.PI * CUTTER_DIA);

  // Feed rate (mm/min)
  const Vf = fz * FLUTES * RPM;

  // Material removal rate (mm³/min)
  const MRR = ap * ae * Vf;

  // Cutting force (N) — empirical aerospace model
  const Fc = FORCE_BASE * alloyFactor * coatingForce * ap * (fz * (ae / 10));

  // Taylor tool-life equation: T = (C / Vc)^(1/n) where n = 0.25 for Ti
  const T_min = Math.pow(TAYLOR_C / Vc, 1 / 0.25) * coatingLife;

  return { RPM, Vf, MRR, Fc, T_min };
}

/* ────────────────────────────────────────────────────────────────
 * Theme helpers
 * ────────────────────────────────────────────────────────────────*/
function readTheme() {
  if (typeof window === 'undefined') {
    return {
      primary: '#38BDF8',
      accent: '#34D399',
      surface: '#1E293B',
      bg: '#0F172A',
      text: '#F8FAFC',
    };
  }
  const root = getComputedStyle(document.documentElement);
  const get = (name, fallback) => root.getPropertyValue(name).trim() || fallback;
  return {
    primary: get('--theme-primary', '#38BDF8'),
    accent: get('--theme-accent', '#34D399'),
    surface: get('--theme-surface', '#1E293B'),
    bg: get('--theme-bg', '#0F172A'),
    text: get('--theme-text', '#F8FAFC'),
  };
}

// Append an alpha channel to a hex (#RRGGBB → #RRGGBBAA).
function withAlpha(color, alphaHex = '99') {
  if (!color) return color;
  if (color.startsWith('#') && color.length === 7) return color + alphaHex;
  return color;
}

/* ────────────────────────────────────────────────────────────────
 * Number formatters
 * ────────────────────────────────────────────────────────────────*/
const fmt = {
  rpm: (n) => `${Math.round(n).toLocaleString()} RPM`,
  vf: (n) => `${n.toFixed(0)} mm/min`,
  mrr: (n) => {
    if (n >= 1000) return `${(n / 1000).toFixed(2)} cm³/min`;
    return `${n.toFixed(1)} mm³/min`;
  },
  fc: (n) => `${n.toFixed(0)} N`,
  life: (n) => {
    if (n >= 60) return `${(n / 60).toFixed(1)} h`;
    return `${n.toFixed(1)} min`;
  },
};

/* ────────────────────────────────────────────────────────────────
 * Reusable small components
 * ────────────────────────────────────────────────────────────────*/
function MetricCard({ icon: Icon, label, value, sub, accent = false, warning = false }) {
  const valueColor = warning
    ? '#ef4444'
    : accent
      ? 'var(--theme-primary)'
      : 'var(--theme-text)';
  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--theme-surface) 65%, transparent)',
        border: `1px solid color-mix(in srgb, ${warning ? '#ef4444' : 'var(--theme-primary)'} 18%, transparent)`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon
          className="w-4 h-4 shrink-0"
          style={{ color: warning ? '#ef4444' : 'var(--theme-primary)' }}
        />
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}
        >
          {label}
        </span>
      </div>
      <div className="text-2xl font-bold font-mono" style={{ color: valueColor }}>
        {value}
      </div>
      {sub && (
        <div
          className="text-[11px] mt-1"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function Slider({ id, label, unit, min, max, step, value, onChange, hint }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-xs font-semibold"
          style={{ color: 'color-mix(in srgb, var(--theme-text) 80%, transparent)' }}
        >
          {label}
        </label>
        <span
          className="text-sm font-mono font-bold"
          style={{ color: 'var(--theme-primary)' }}
        >
          {value} <span className="text-[10px] font-normal" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>{unit}</span>
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer tsim-range"
        style={{
          background: `linear-gradient(to right, var(--theme-primary) 0%, var(--theme-primary) ${
            ((value - min) / (max - min)) * 100
          }%, color-mix(in srgb, var(--theme-primary) 12%, transparent) ${
            ((value - min) / (max - min)) * 100
          }%, color-mix(in srgb, var(--theme-primary) 12%, transparent) 100%)`,
        }}
        aria-label={label}
      />
      <div className="flex items-center justify-between text-[10px]" style={{ color: 'color-mix(in srgb, var(--theme-text) 40%, transparent)' }}>
        <span>{min}</span>
        <span>{hint}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function Select({ id, label, options, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 80%, transparent)' }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm font-medium cursor-pointer tsim-select"
        style={{
          backgroundColor: 'var(--theme-bg)',
          color: 'var(--theme-text)',
          border: '1px solid color-mix(in srgb, var(--theme-primary) 25%, transparent)',
        }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id} style={{ backgroundColor: 'var(--theme-surface)' }}>
            {o.name}
          </option>
        ))}
      </select>
      <div
        className="text-[10px] mt-1"
        style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}
      >
        {options.find((o) => o.id === value)?.note}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 * Main component
 * ────────────────────────────────────────────────────────────────*/
export default function TitaniumSimulator() {
  const [Vc, setVc] = useState(80);
  const [fz, setFz] = useState(0.08);
  const [ap, setAp] = useState(3.0);
  const [ae, setAe] = useState(1.0);
  const [alloy, setAlloy] = useState('ti6al4v');
  const [coating, setCoating] = useState('altin');

  const alloyCfg = ALLOYS.find((a) => a.id === alloy) || ALLOYS[0];
  const coatingCfg = COATINGS.find((c) => c.id === coating) || COATINGS[0];

  const outputs = useMemo(
    () =>
      compute({
        Vc,
        fz,
        ap,
        ae,
        alloyFactor: alloyCfg.factor,
        coatingForce: coatingCfg.forceFactor,
        coatingLife: coatingCfg.lifeFactor,
      }),
    [Vc, fz, ap, ae, alloyCfg.factor, coatingCfg.forceFactor, coatingCfg.lifeFactor],
  );

  /* Chart refs */
  const telemetryCanvasRef = useRef(null);
  const wearCanvasRef = useRef(null);
  const telemetryChartRef = useRef(null);
  const wearChartRef = useRef(null);

  /* ── Chart lifecycle ── */
  useEffect(() => {
    if (!telemetryCanvasRef.current || !wearCanvasRef.current) return;

    const t = readTheme();
    const textSoft = withAlpha(t.text, 'cc');
    const gridSoft = withAlpha(t.primary, '15');

    // Telemetry: current force vs safe limit (horizontal bar)
    telemetryChartRef.current = new Chart(telemetryCanvasRef.current, {
      type: 'bar',
      data: {
        labels: ['Current Force', 'Max Safe Limit'],
        datasets: [
          {
            data: [0, FORCE_LIMIT],
            backgroundColor: [withAlpha(t.primary, 'cc'), 'rgba(239, 68, 68, 0.18)'],
            borderColor: [t.primary, 'rgba(239, 68, 68, 0.85)'],
            borderWidth: [2, 2],
            borderRadius: 6,
            barThickness: 56,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        layout: { padding: { top: 4, bottom: 4, left: 4, right: 12 } },
        scales: {
          x: {
            beginAtZero: true,
            max: FORCE_LIMIT * 1.15,
            ticks: { color: textSoft, callback: (v) => `${v} N` },
            grid: { color: gridSoft },
            title: { display: true, text: 'Cutting Force (N)', color: withAlpha(t.text, '99'), font: { size: 11 } },
          },
          y: {
            ticks: { color: t.text, font: { size: 12, weight: 'bold' } },
            grid: { display: false },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${Math.round(ctx.parsed.x)} N`,
              afterLabel: (ctx) => {
                if (ctx.dataIndex === 0) {
                  const pct = (ctx.parsed.x / FORCE_LIMIT) * 100;
                  return ` ${pct.toFixed(1)} % of safe limit`;
                }
                return ' ISO 8685-1 critical threshold';
              },
            },
          },
        },
      },
    });

    // Tool wear: projected Vb over tool life span
    wearChartRef.current = new Chart(wearCanvasRef.current, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Flank Wear Vb',
            data: [],
            borderColor: t.primary,
            backgroundColor: withAlpha(t.primary, '33'),
            borderWidth: 2.5,
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: t.primary,
          },
          {
            label: 'Failure Limit (0.4 mm)',
            data: [],
            borderColor: 'rgba(239, 68, 68, 0.9)',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [6, 6],
            pointRadius: 0,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 350 },
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            title: { display: true, text: 'Tool Life (minutes)', color: withAlpha(t.text, '99'), font: { size: 11 } },
            ticks: { color: textSoft, maxTicksLimit: 8 },
            grid: { color: withAlpha(t.primary, '0d') },
          },
          y: {
            beginAtZero: true,
            max: VB_LIMIT * 1.1,
            ticks: { color: textSoft, callback: (v) => `${v.toFixed(2)} mm` },
            grid: { color: withAlpha(t.primary, '0d') },
            title: { display: true, text: 'Flank Wear Vb (mm)', color: withAlpha(t.text, '99'), font: { size: 11 } },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: { color: t.text, font: { size: 11 }, boxWidth: 16, boxHeight: 2 },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toFixed(3)} mm`,
              title: (items) => `t = ${items[0].label} min`,
            },
          },
        },
      },
    });

    // Theme observer
    const observer = new MutationObserver(() => {
      const nt = readTheme();
      const ntextSoft = withAlpha(nt.text, 'cc');
      const ngridSoft = withAlpha(nt.primary, '15');

      if (telemetryChartRef.current) {
        const ds = telemetryChartRef.current.data.datasets[0];
        ds.backgroundColor = [withAlpha(nt.primary, 'cc'), 'rgba(239, 68, 68, 0.18)'];
        ds.borderColor = [nt.primary, 'rgba(239, 68, 68, 0.85)'];
        telemetryChartRef.current.options.scales.x.ticks.color = ntextSoft;
        telemetryChartRef.current.options.scales.x.grid.color = ngridSoft;
        telemetryChartRef.current.options.scales.x.title.color = withAlpha(nt.text, '99');
        telemetryChartRef.current.options.scales.y.ticks.color = nt.text;
        telemetryChartRef.current.update('none');
      }
      if (wearChartRef.current) {
        const wds = wearChartRef.current.data.datasets;
        wds[0].borderColor = nt.primary;
        wds[0].backgroundColor = withAlpha(nt.primary, '33');
        wds[0].pointHoverBackgroundColor = nt.primary;
        wearChartRef.current.options.scales.x.ticks.color = ntextSoft;
        wearChartRef.current.options.scales.x.grid.color = withAlpha(nt.primary, '0d');
        wearChartRef.current.options.scales.x.title.color = withAlpha(nt.text, '99');
        wearChartRef.current.options.scales.y.ticks.color = ntextSoft;
        wearChartRef.current.options.scales.y.grid.color = withAlpha(nt.primary, '0d');
        wearChartRef.current.options.scales.y.title.color = withAlpha(nt.text, '99');
        wearChartRef.current.options.plugins.legend.labels.color = nt.text;
        wearChartRef.current.update('none');
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      observer.disconnect();
      telemetryChartRef.current?.destroy();
      wearChartRef.current?.destroy();
      telemetryChartRef.current = null;
      wearChartRef.current = null;
    };
  }, []);

  /* ── React to output changes ── */
  useEffect(() => {
    if (!telemetryChartRef.current || !wearChartRef.current) return;

    // Status colour thresholds
    const overload = outputs.Fc > FORCE_LIMIT;
    const warning = outputs.Fc > FORCE_LIMIT * 0.75;
    let barColor = 'var(--theme-primary)';
    if (overload) barColor = '#ef4444';
    else if (warning) barColor = '#f59e0b';

    // Update telemetry chart
    const telDs = telemetryChartRef.current.data.datasets[0];
    telDs.data = [Math.min(outputs.Fc, FORCE_LIMIT * 1.15), FORCE_LIMIT];
    telDs.backgroundColor = [withAlpha(barColor, 'cc'), 'rgba(239, 68, 68, 0.18)'];
    telDs.borderColor = [barColor, 'rgba(239, 68, 68, 0.85)'];
    telemetryChartRef.current.update('none');

    // Update wear timeline
    const lifeSpan = Math.max(outputs.T_min, 0.5);
    const numPoints = 40;
    const labels = [];
    const wearValues = [];
    const limitValues = [];
    for (let i = 0; i <= numPoints; i++) {
      const tt = (i / numPoints) * lifeSpan;
      labels.push(tt.toFixed(1));
      wearValues.push((VB_LIMIT * i) / numPoints);
      limitValues.push(VB_LIMIT);
    }
    wearChartRef.current.data.labels = labels;
    wearChartRef.current.data.datasets[0].data = wearValues;
    wearChartRef.current.data.datasets[1].data = limitValues;
    wearChartRef.current.options.scales.x.max = lifeSpan;
    wearChartRef.current.update('none');
  }, [outputs]);

  /* ── Derived status ── */
  const forcePct = (outputs.Fc / FORCE_LIMIT) * 100;
  const forceStatus = outputs.Fc > FORCE_LIMIT ? 'overload' : outputs.Fc > FORCE_LIMIT * 0.75 ? 'warning' : 'safe';

  /* ────────────────────────────────────────────────────────────────
   * Render
   * ────────────────────────────────────────────────────────────────*/
  return (
    <div
      className="rounded-2xl overflow-hidden tsim-shell"
      style={{
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid color-mix(in srgb, var(--theme-primary) 18%, transparent)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* ── Header bar ── */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 12%, transparent), color-mix(in srgb, var(--theme-accent) 8%, transparent))',
          borderBottom: '1px solid color-mix(in srgb, var(--theme-primary) 18%, transparent)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-accent))' }}
          >
            <Cpu className="w-5 h-5" style={{ color: '#0F172A' }} />
          </div>
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--theme-text)' }}>
              Titanium 5-Axis Machining Simulator
            </h3>
            <p className="text-[11px]" style={{ color: 'color-mix(in srgb, var(--theme-text) 55%, transparent)' }}>
              Ø10 mm 4-flute carbide · Taylor tool-life model · aerospace reference
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-accent) 18%, transparent)',
              color: 'var(--theme-accent)',
              border: '1px solid color-mix(in srgb, var(--theme-accent) 35%, transparent)',
            }}
          >
            ● LIVE
          </span>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* ════════════ CONTROLS (left) ════════════ */}
        <aside
          className="lg:col-span-5 p-5 space-y-5"
          style={{
            borderRight: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--theme-bg) 50%, var(--theme-surface))',
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Settings2 className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
              Cutting Parameters
            </h4>
          </div>

          <div className="space-y-4">
            <Slider
              id="vc"
              label="Cutting Speed (Vc)"
              unit="m/min"
              min={40}
              max={150}
              step={1}
              value={Vc}
              onChange={setVc}
              hint="sweet spot 60-100"
            />
            <Slider
              id="fz"
              label="Feed per Tooth (fz)"
              unit="mm/tooth"
              min={0.02}
              max={0.2}
              step={0.005}
              value={fz}
              onChange={setFz}
              hint="HEM 0.05-0.12"
            />
            <Slider
              id="ap"
              label="Axial Depth (ap)"
              unit="mm"
              min={0.5}
              max={10}
              step={0.1}
              value={ap}
              onChange={setAp}
              hint="light to heavy"
            />
            <Slider
              id="ae"
              label="Radial Depth (ae)"
              unit="mm"
              min={0.2}
              max={5}
              step={0.1}
              value={ae}
              onChange={setAe}
              hint="HEM: ae = D"
            />
          </div>

          <div
            className="my-4 h-px"
            style={{ backgroundColor: 'color-mix(in srgb, var(--theme-primary) 12%, transparent)' }}
          />

          <div className="flex items-center gap-2 mb-1">
            <Wrench className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
              Material & Tool
            </h4>
          </div>

          <div className="space-y-4">
            <Select
              id="alloy"
              label="Titanium Alloy Grade"
              options={ALLOYS}
              value={alloy}
              onChange={setAlloy}
            />
            <Select
              id="coating"
              label="Tool Coating"
              options={COATINGS}
              value={coating}
              onChange={setCoating}
            />
          </div>
        </aside>

        {/* ════════════ TELEMETRY (right) ════════════ */}
        <section className="lg:col-span-7 p-5 space-y-5">
          {/* ── Headline metric row ── */}
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-primary)' }}>
              Live Telemetry
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetricCard
              icon={Gauge}
              label="Spindle"
              value={fmt.rpm(outputs.RPM)}
              sub={`${Vc} m/min × Ø${CUTTER_DIA}`}
              accent
            />
            <MetricCard
              icon={TrendingUp}
              label="Feed Rate"
              value={fmt.vf(outputs.Vf)}
              sub={`${fz} × ${FLUTES} flutes`}
            />
            <MetricCard
              icon={Cpu}
              label="MRR"
              value={fmt.mrr(outputs.MRR)}
              sub={`${ap} × ${ae} mm`}
            />
            <MetricCard
              icon={Flame}
              label="Cutting Force"
              value={fmt.fc(outputs.Fc)}
              sub={`${forcePct.toFixed(0)}% of 1500 N`}
              warning={forceStatus === 'overload'}
            />
            <MetricCard
              icon={Droplets}
              label="Tool Life"
              value={fmt.life(outputs.T_min)}
              sub={`Taylor C=${TAYLOR_C}`}
            />
          </div>

          {/* ── Status banner ── */}
          <div
            className="rounded-xl px-4 py-3 flex items-start gap-3"
            style={{
              backgroundColor:
                forceStatus === 'overload'
                  ? 'color-mix(in srgb, #ef4444 12%, transparent)'
                  : forceStatus === 'warning'
                    ? 'color-mix(in srgb, #f59e0b 12%, transparent)'
                    : 'color-mix(in srgb, var(--theme-accent) 10%, transparent)',
              border: `1px solid ${
                forceStatus === 'overload'
                  ? 'color-mix(in srgb, #ef4444 35%, transparent)'
                  : forceStatus === 'warning'
                    ? 'color-mix(in srgb, #f59e0b 35%, transparent)'
                    : 'color-mix(in srgb, var(--theme-accent) 30%, transparent)'
              }`,
            }}
            role="status"
            aria-live="polite"
          >
            {forceStatus === 'overload' ? (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
            ) : (
              <CheckCircle2
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{
                  color: forceStatus === 'warning' ? '#f59e0b' : 'var(--theme-accent)',
                }}
              />
            )}
            <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text)' }}>
              {forceStatus === 'overload' && (
                <>
                  <strong style={{ color: '#ef4444' }}>Cutting force exceeds 1500 N safe limit.</strong>{' '}
                  Reduce radial engagement (ae) or axial depth (ap), switch to a smaller-diameter cutter, or
                  apply high-pressure coolant. Recheck deflection on thin-wall sections.
                </>
              )}
              {forceStatus === 'warning' && (
                <>
                  <strong style={{ color: '#f59e0b' }}>Approaching safe force envelope (≥ 75 %).</strong>{' '}
                  Monitor chatter and tool wear closely. Consider a tougher AlTiN-TiN coating or trochoidal
                  milling for thin-wall features.
                </>
              )}
              {forceStatus === 'safe' && (
                <>
                  <strong style={{ color: 'var(--theme-accent)' }}>Operating within safe force envelope.</strong>{' '}
                  Parameters are well-balanced for the selected alloy and coating. Verify chip evacuation
                  and BUE formation on long engagement cycles.
                </>
              )}
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-primary)' }}>
                    Force Telemetry
                  </h5>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
                  vs 1500 N
                </span>
              </div>
              <div style={{ position: 'relative', height: '180px' }}>
                <canvas ref={telemetryCanvasRef} aria-label="Real-time cutting force versus safe limit" />
              </div>
            </div>

            <div
              className="rounded-xl p-4"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--theme-bg) 60%, transparent)',
                border: '1px solid color-mix(in srgb, var(--theme-primary) 12%, transparent)',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                  <h5 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-primary)' }}>
                    Tool Wear Projection
                  </h5>
                </div>
                <span className="text-[10px] font-mono" style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>
                  Vb → 0.4 mm
                </span>
              </div>
              <div style={{ position: 'relative', height: '180px' }}>
                <canvas ref={wearCanvasRef} aria-label="Projected flank wear over calculated tool life" />
              </div>
            </div>
          </div>

          {/* ── Inline equations footer ── */}
          <details
            className="rounded-xl px-4 py-3 text-xs"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--theme-bg) 50%, transparent)',
              border: '1px solid color-mix(in srgb, var(--theme-primary) 10%, transparent)',
              color: 'color-mix(in srgb, var(--theme-text) 70%, transparent)',
            }}
          >
            <summary className="cursor-pointer font-semibold" style={{ color: 'var(--theme-primary)' }}>
              Show calculation formulae
            </summary>
            <div className="mt-2 space-y-1.5 font-mono">
              <div><strong>RPM</strong> = (Vc × 1000) / (π × Ø{CUTTER_DIA})</div>
              <div><strong>Vf</strong> = fz × {FLUTES} × RPM</div>
              <div><strong>MRR</strong> = ap × ae × Vf</div>
              <div><strong>Fc</strong> = 2200 × alloy × coating × ap × (fz × ae / 10)</div>
              <div><strong>T</strong> = (C / Vc)^(1/0.25) × coating-life &nbsp; <span style={{ color: 'color-mix(in srgb, var(--theme-text) 45%, transparent)' }}>(Taylor, n = 0.25 for Ti)</span></div>
            </div>
          </details>
        </section>
      </div>

      {/* ── Inline styles for range / select thumbs ── */}
      <style>{`
        .tsim-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--theme-primary);
          border: 2px solid var(--theme-bg);
          cursor: pointer;
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-primary) 60%, transparent);
        }
        .tsim-range::-moz-range-thumb {
          width: 16px; height: 16px;
          border-radius: 50%;
          background: var(--theme-primary);
          border: 2px solid var(--theme-bg);
          cursor: pointer;
        }
        .tsim-range:focus { outline: none; }
        .tsim-range:focus-visible::-webkit-slider-thumb {
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--theme-primary) 35%, transparent);
        }
        .tsim-select:focus { outline: none; }
        .tsim-select:focus-visible {
          border-color: var(--theme-primary);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--theme-primary) 25%, transparent);
        }
      `}</style>
    </div>
  );
}