# Git Hooks (AstroFlow)

Auto-generated dev log + commit message hints. **No npm dependency** required.

## Install (one-time)

    npm run hooks:install

This sets `git config core.hooksPath .githooks` so git picks up our scripts.

## What hooks do

| Hook | Behaviour |
|---|---|
| `post-commit` | Appends one line to `memory-bank/dev-log.md`: `- [ISO_DATE] HASH \| subject \| Phase/Type/Scope or (pending-Phase) \| files:N (+X/-Y)` |
| `commit-msg` (soft) | If commit message lacks `Phase:` / `Type:` / `Scope:` markers AND subject is short, append a hint block to the message. Never blocks commit. |

## Recommended commit message format

    <one-line subject>

    Phase: H-A2 / Type: feature / Scope: standard-parts Hub body

## Check what is pending

    npm run dev:pending

## Uninstall

    npm run hooks:uninstall