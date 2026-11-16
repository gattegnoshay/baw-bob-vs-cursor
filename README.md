# BAW BOB vs Cursor

Comparison workspace for IBM BAW authoring with **IBM Bob skills** and **Cursor**, plus two **Copilot Studio** guidance agents ready for Git.

## Copilot Studio agents (git-ready)

See [`copilot-agents/`](copilot-agents/README.md):

- **IBM BAW Author** — design-time guidance
- **IBM BAW Admin** — operations/governance guidance

All `.mcs.yml` files (except `settings.mcs.yml`, which has no root `kind` by Microsoft fixture design) validate cleanly with the Copilot Studio schema validator.

## BAW skills (synced)

- Source: [ibmbpm/ibm-baw-skills-and-bob-modes](https://github.com/ibmbpm/ibm-baw-skills-and-bob-modes)
- Cursor install: `Cursor/.cursor/skills/` and `Cursor/.cursor/agents/`
- Knowledge packs: `knowledge-content/`

## Other folders

- `Cursor/` — Cursor-side process samples and skills
- `BOB/` — Bob-side process samples

## Credentials

Copy `Cursor/.env.example` to `.env` for live BAW skill scripts. Never commit `.env`.
