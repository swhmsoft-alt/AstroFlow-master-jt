# Favicon — AI Image Generation Prompt

## Brand: Boze Titanium Manufacturing Center (cnc.bozemetal.com)

## Output File Requirements

| File | Size | Format | Max Size |
|------|------|--------|----------|
| `boze-tmc-favicon-16.png` | 16×16 px | PNG-24 w/ alpha | < 2KB |
| `boze-tmc-favicon-32.png` | 32×32 px | PNG-24 w/ alpha | < 5KB |
| `boze-tmc-favicon-180.png` | 180×180 px | PNG-24 w/ alpha | < 15KB |
| `boze-tmc-favicon-192.png` | 192×192 px | PNG-24 w/ alpha | < 20KB |

## Design Spec

```
┌──────────────┐
│  ┌──────┐     │
│  │ Ti   │     │  ← Titanium chemical symbol
│  │      │     │     Font: Inter Bold / sharp sans-serif
│  └──────┘     │     Color: #F8FAFC (white) on #0F172A (navy)
│               │
│  ═══════      │  ← Thin horizontal accent line (#3B82F6 aerospace blue)
│               │
│  ─ ─ ─ ─      │  ← Subtle CNC toolpath hint (very faint, ~5% opacity)
│               │
└──────────────┘
```

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| --theme-bg | `#0F172A` | Background circle/badge |
| --theme-text | `#F8FAFC` | "Ti" lettering |
| --theme-primary | `#3B82F6` | Accent bar at bottom |
| Titanium Silver | `#94A3B8` | Optional secondary accent |

## AI Prompt

### DALL·E 3 / Midjourney
```
A modern tech/favicon icon for "Boze Titanium Manufacturing Center",
a precision titanium CNC machining company.
Minimalist design on a circular dark navy badge (#0F172A).
The chemical element symbol "Ti" in center, bold sharp sans-serif font,
color white (#F8FAFC).
A thin horizontal line in aerospace blue (#3B82F6) below the "Ti".
Faint hexagonal crystal lattice hint in background (very subtle).
Overall aesthetic: industrial, precision, aerospace-grade manufacturing.
Flat vector style, transparent background outside the circle.
Designed to be recognizable at 32x32 pixels.
No text other than "Ti".
```

### Stable Diffusion / Leonardo.ai
```
favicon icon, 32x32 pixel art vector style, titanium manufacturing brand,
circle badge dark navy background #0F172A, center symbol "Ti" white bold sharp font,
thin aerospace blue #3B82F6 accent line below, precision industrial aesthetic,
transparent background, no additional text, clean minimal flat design
--ar 1:1 --style raw --v 6
```

---

## After Generation: Placement

Copy generated files to: `public/uploads/`

Then update references:
- `public/uploads/boze-tmc-favicon-32.png` — primary favicon
- `public/uploads/boze-tmc-favicon-180.png` — iOS bookmark
- `public/uploads/boze-tmc-favicon-192.png` — Android/Chrome
