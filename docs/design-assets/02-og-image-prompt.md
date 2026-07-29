# Open Graph Image — AI Generation Prompt

## Brand: Boze Titanium Manufacturing Center (cnc.bozemetal.com)

## Output File Requirements

| File | Size | Format | Max Size |
|------|------|--------|----------|
| `boze-tmc-og-en.png` | 1200×630 px | PNG (sRGB) | < 200KB |
| `boze-tmc-og-en.webp` | 1200×630 px | WebP | < 100KB |

## Layout Blueprint

```
┌────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│ ▓                     ▓  ╔══════════════╗  ▓  ▓  ▓  ▓  ▓  │
│ ▓  BOZE               ▓  ║ Hexagonal    ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓  Titanium           ▓  ║ titanium     ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓  Manufacturing      ▓  ║ lattice/HCP  ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓  Center             ▓  ║ crystal      ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓                     ▓  ║ structure    ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓  Precision Titanium ▓  ║ wireframe    ║  ▓  ▓  ▓  ▓  ▓  │
│ ▓  CNC Machining &    ▓  ╚══════════════╝  ▓  ▓  ▓  ▓  ▓  │
│ ▓  Manufacturing      ▓                    ▓  ▓  ▓  ▓  ▓  │
│ ▓                     ▓     AS9100D  ISO 13485             │
│ ▓  cnc.bozemetal.com  ▓                    ▓  ▓  ▓  ▓  ▓  │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│ ═════════════════════════════ ═══════ ════════════════════  │
└────────────────────────────────────────────────────────────┘
```

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0F172A` → `#1E293B` | Left-to-right gradient |
| Main text | `#F8FAFC` | "Boze Titanium Manufacturing Center" |
| Subtitle | `#94A3B8` | "Precision Titanium CNC Machining & Manufacturing" |
| Accent | `#3B82F6` | Bottom bar, decorative elements |
| URL text | `#64748B` | "cnc.bozemetal.com" |

## Typography

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| **Main Title** | Inter | 52px | ExtraBold (800) | `#F8FAFC` |
| **Subtitle** | Inter | 22px | Medium (500) | `#94A3B8` |
| **URL** | Inter | 14px | Regular (400) | `#64748B` |
| **Cert Badges** | Inter | 11px | Bold (700) | `#F8FAFC` on `#1E293B` |

## Element Positioning

```
Safe zone: 60px padding on all sides (keep text within 1080×510)
Title:   x=60, y=220 (baseline)
Subtitle: x=60, y=280 (baseline)
URL:      x=60, y=520 (baseline)
Cert badges: x=920, y=480 (top-right area, small pill badges)
Right ornament: x=780-1140, y=100-530 (decorative pattern)
Bottom bar: y=626, height=4px, width=80%, centered, color=#3B82F6
```

## AI Prompt

### Midjourney 6 (Best for this style)
```
An official Open Graph share image for "Boze Titanium Manufacturing Center",
a B2B precision titanium CNC machining company.
Dark navy gradient background from #0F172A (left) to #1E293B (right).
Left side text layout (60px padding):
- "Boze Titanium Manufacturing Center" in bold white sans-serif 52px
- "Precision Titanium CNC Machining & Manufacturing" in metallic grey 22px
- "cnc.bozemetal.com" URL in muted blue-grey 14px at bottom-left

Right side: Subtle 3D hexagonal titanium crystal lattice (HCP structure) 
wireframe in aerospace blue #3B82F6 with glassmorphism/frosted glass effect.
Small certification badges "AS9100D" and "ISO 13485" in pill shapes 
at bottom-right.

Bottom: Thin bright aerospace blue horizontal accent bar.
Professional, high-end B2B manufacturing aesthetic, aerospace quality feel.
No people, no cartoon elements. Photorealistic metallic textures.
1200x630 pixels, perfect for social media sharing.
--ar 19:6 --v 6
```

### DALL·E 3
```
Create a professional Open Graph image (1200x630 pixels) for 
"Boze Titanium Manufacturing Center", a precision titanium 
CNC machining manufacturing company.

Design requirements:
- Dark navy gradient background (#0F172A to #1E293B, left to right)
- Left-aligned white text "Boze Titanium Manufacturing Center" 
  in bold modern sans-serif font
- Below it in smaller grey text: "Precision Titanium CNC Machining 
  & Manufacturing"
- URL "cnc.bozemetal.com" at bottom-left in muted blue-grey
- Right side: abstract geometric hexagonal pattern resembling 
  titanium crystal lattice structure in translucent aerospace blue
- Small certification pills "AS9100D | ISO 13485" at bottom-right
- Thin bright blue accent bar at the very bottom

Style: B2B industrial, aerospace quality, photorealistic metal textures, 
dark theme, no people, no cartoon elements.
```

### Leonardo.ai
```
open graph image, 1200x630, B2B titanium manufacturing company,
dark navy gradient background #0F172A to #1E293B,
left aligned text "Boze Titanium Manufacturing Center" white bold,
subtitle "Precision Titanium CNC Machining & Manufacturing" grey,
url "cnc.bozemetal.com" bottom left,
right side hexagonal titanium crystal wireframe in blue #3B82F6,
glassmorphism effect, AS9100D ISO 13485 certification badges,
thin blue accent bar at bottom,
industrial aerospace aesthetic, photorealistic metallic
--ar 19:6
```

---

## After Generation: Upload & Configure

1. Place `boze-tmc-og-en.png` in `public/uploads/`
2. Generate WebP version for performance
3. Update code reference in `src/layouts/BaseLayout.astro`:
   ```js
   // Line 89 - Change from:
   const defaultOgImage = `${siteUrl}/uploads/boze-1-en.png`;
   // To:
   const defaultOgImage = `${siteUrl}/uploads/boze-tmc-og-en.png`;
   ```
