# AI Image Generation Workflow

> Phase 1 MVP — text-to-image pipeline for the titanium site.
> Primary provider: **Cloudflare Workers AI — FLUX.1 Schnell**. Fallback: **Zhipu CogView-3-Flash**.

---

## 1. Why this exists

`src/content/image-catalog.json` already carries curated `prompt` + `alt` for every
hub image, but only `.svg` placeholders exist on disk — there is no way to turn a
catalog prompt into a real asset today. This pipeline closes that loop: one command,
one prompt, one image on disk, one ledger entry.

Deliberately **not** in scope for Phase 1 (per the approved plan): no standalone MCP
server, no Astro page changes, no edits to `image-catalog.json`, no paid credits.

---

## 2. Architecture

```
npm run generate:ai-images -- --prompt "..." | --catalog-id "<id>"
        |
        v
scripts/generate-ai-images.mjs      CLI · retry · fallback chain · sharp post-process
        |
        +--> src/lib/ai-image-provider.mjs   provider registry + key resolution
        |        +--> Cloudflare Workers AI  (@cf/black-forest-labs/flux-1-schnell)
        |        +--> Zhipu BigModel         (cogview-3-flash)
        |
        +--> public/images/ai/<category>/<file>.{png,webp}
        |
        +--> data/ai-images/manifest.json    ledger (prompt, provider, model, size)
```

### File inventory

| File | Role |
|---|---|
| `src/lib/ai-image-provider.mjs` | Provider registry, key resolution (process.env → .env.production), Zhipu JWT signer. Mirrors `src/lib/ai-provider.mjs`. |
| `scripts/generate-ai-images.mjs` | The CLI. Parses args, resolves the prompt source, calls the provider, post-processes with sharp, writes files and the ledger. |
| `data/ai-images/manifest.json` | Ledger of every generated image. |
| `public/images/ai/` | Default output root. |
| `.env.production` | Secrets (`CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `ZHIPU_API_KEY`). Gitignored. |

---

## 3. Commands

```bash
# Preview the plan — no API call, no file written
npm run generate:ai-images:dry -- --prompt "a CNC machining scene"

# Generate from an explicit prompt (adhoc → public/images/ai/adhoc/<slug>.{png,webp})
npm run generate:ai-images -- --prompt "Photorealistic titanium workshop"

# Generate from the catalog (prompt + alt + 1200x800 read from the SSOT)
npm run generate:ai-images -- --catalog-id titanium-cnc-machining-services.hub

# Primary + fallback chain
npm run generate:ai-images -- --catalog-id <id> --provider cloudflare --fallback zhipu

# List providers and their credential requirements
node scripts/generate-ai-images.mjs --list-providers
```

Useful flags: `--out-dir` · `--usage scene|product` · `--width` / `--height` ·
`--steps` (CF, default 4) · `--seed` · `--alt` · `--force` · `--dry-run`.

---

## 4. Provider facts (verified against official docs)

| | Cloudflare FLUX.1 Schnell | Zhipu CogView-3-Flash |
|---|---|---|
| Model id | `@cf/black-forest-labs/flux-1-schnell` | `cogview-3-flash` |
| Endpoint | `POST /client/v4/accounts/{id}/ai/run/@cf/.../flux-1-schnell` | `POST https://open.bigmodel.cn/api/paas/v4/images/generations` |
| Input | `prompt`, `steps`, `seed` — **no width/height** | `model`, `prompt`, `size` |
| Output | **512×512 always** | multi-resolution (e.g. 1024×1024, 1344×768, 1152×864) |
| Response | envelope `{ result: { image: "<base64>" }, success, errors }` | `data[0].url` (downloaded) or `data[0].b64_json` |
| Free tier | 10,000 Neurons/day, resets 00:00 UTC, ~43 Neurons/image → **~230 images/day** | free model, account-tier concurrency limit |

---

## 5. Visual-quality red lines

AI cannot reliably reproduce **hole positions, gear forms, thread pitches, or
structural details**. On a titanium site this is a credibility risk, not a cosmetic one.

| Image type | Allowed | Notes |
|---|---|---|
| Machining environment / coolant / swarf / shop atmosphere | ✅ | `--usage scene` |
| Anodizing, passivation, heat-treat, QA/CMM atmosphere | ✅ | `--usage scene` |
| Blog covers, industrial application context | ✅ | `--usage scene` |
| Titanium dental disc / threaded fastener / precision bracket **close-ups** | ⚠️ | `--usage product` only, with explicit review |

Rules:
1. Never present an AI image as a **real product photograph**. The ledger stamps
   `usage` and a `note` on every entry.
2. `--usage product` prints a warning in the plan output.
3. `usage: "product"` entries must be reviewed before they ever sit in a Product slot.
4. AI output does **not** satisfy the `hubs/` contract (webp + png + **svg**).
   AI files therefore live under `public/images/ai/`, and `image-catalog.json`
   `status` is **not** flipped to `real` by this pipeline.

---

## 6. Secrets

Resolution order: `process.env` → `.env.production`. The provider module never
embeds a key, and the script never prints key values.

```bash
# .env.production (gitignored)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=
ZHIPU_API_KEY=
```

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Missing CLOUDFLARE_API_TOKEN` | key not set | fill `.env.production` (see §6) |
| `HTTP 429 — daily free Neuron quota exhausted` | 10,000 Neurons/day used | wait for the 00:00 UTC reset, or use `--fallback zhipu` |
| `[catalog] No entry with id` | wrong id | the error lists every available id |
| Image looks soft | 512×512 upscaled to 1200×800 | expected for CF FLUX.1 Schnell; the ledger records `upscaled: true` |
| `文件已存在，跳过` | output present | pass `--force` to overwrite |

---

## 8. Hard rules

1. Prompt text lives **only** in `src/content/image-catalog.json`. Never copy a
   catalog prompt into the script.
2. Never write AI output into `public/images/hubs/` — that directory has a
   webp+png+svg contract the pipeline cannot honour.
3. Never set a catalog entry's `status` to `real` from an AI-generated file.
4. Never inline an API key in tracked source. `.env.production` only.

| Auth | `Authorization: Bearer <CLOUDFLARE_API_TOKEN>` | `Bearer <key>`; `id.secret` keys are signed as a JWT (HS256, `sign_type=SIGN`) |

**Consequence of the 512×512 ceiling:** CF output is square; the catalog target is
1200×800 (3:2). The script does `fit:'cover'` + `position:'centre'` (crop-then-scale,
no stretching) and records `sourceSize` / `upscaled: true` in the ledger so the
interpolation is never hidden.
