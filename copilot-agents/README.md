# IBM BAW Copilot Studio Agents (guidance)

Two standalone **Microsoft Copilot Studio** standard agents, built from [IBM BAW Skills and Bob Modes](https://github.com/ibmbpm/ibm-baw-skills-and-bob-modes).

| Folder | Agent | Role |
|--------|--------|------|
| `ibm-baw-author/` | IBM BAW Author | Design-time guidance (BPMN, BOs, portals, widgets, tests, compliance, docs) |
| `ibm-baw-admin/` | IBM BAW Admin | Runtime/ops guidance (instances, logs, snapshots, deployments, audit) |

These are **guidance** agents: instructions, topics, public knowledge scopes, and full skill asset packs. They do **not** call live BAW REST APIs.

## Layout (each agent)

```
agent.mcs.yml          # Display name, instructions, starters, model
settings.mcs.yml       # schemaName, GenerativeActionsEnabled: true
topics/                # Greeting, Fallback, OnError + skill topics
knowledge/             # PublicSiteSearchSource entries (IBM docs)
assets/                # AUTHOR_KNOWLEDGE.md / ADMIN_KNOWLEDGE.md + per-skill packs
```

## Validate locally

```powershell
node "$env:USERPROFILE\.cursor\skills-for-copilot-studio\scripts\schema-lookup.bundle.js" validate .\ibm-baw-author\agent.mcs.yml
# Repeat for each *.mcs.yml except settings.mcs.yml (no root kind by design)
```

## Dedicated public repos (one per agent)

Each agent is published at **repo root** (required for Copilot knowledge sources):

| Agent | Repository (use as knowledge source) |
|-------|--------------------------------------|
| IBM BAW Author | https://github.com/gattegnoshay/ibm-baw-author-copilot |
| IBM BAW Admin | https://github.com/gattegnoshay/ibm-baw-admin-copilot |

Do **not** use nested `/tree/...` paths.

## Import into Copilot Studio

1. Create two empty agents in Copilot Studio (or clone shells).
2. Copy or sync these YAML trees into the cloned agent workspaces (or use Copilot Studio / VS Code extension authoring against this folder).
3. Attach file knowledge from `assets/` in the Copilot Studio UI if you want the markdown packs indexed beyond instructions.
4. For web/GitHub knowledge, add `https://github.com/gattegnoshay/baw-bob-vs-cursor` (root).
5. Push/publish from the Copilot Studio extension when connected to your environment.

## Source skills

Canonical skill content also lives under `../Cursor/.cursor/skills/` and `../knowledge-content/`, synced from the IBM public repository.
