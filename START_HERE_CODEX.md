# Start Here — SHUSH Codex Setup

## 1. Use Git first

```bash
git init
git add .
git commit -m "baseline before SHUSH redesign"
```

## 2. Start local server

```bash
python -m http.server 5173
```

Open:
```text
http://localhost:5173
```

## 3. First Codex task

Paste the contents of `CODEX_MASTER_PROMPT.md`.

Do not let Codex edit files in the first task. First get the audit and staged plan.

## 4. Then run stages

Use `docs/CODEX_STAGE_PROMPTS.md` stage by stage.

Recommended order:
1. Stage 1 — Call Room → About
2. Stage 2 — Remove Troll Mode and avatar dependency
3. Stage 3 — Header/Nav Liquid Glass
4. Stage 4 — Home Hero + Jersey Showcase
5. Stage 5 — Roster Redesign
6. Stage 6 — Drop 01
7. Stage 7 — About Page
8. Stage 8 — Performance, Accessibility and Cleanup

## 5. Validate often

Run after each meaningful stage:

```bash
python scripts/validate_shush_static.py
```

Run the server and manually inspect the site:

```bash
python -m http.server 5173
```

## 6. Avatar note

`assets/avatars/` is intentionally empty for now.

The redesign must support missing avatar images with clean initials/placeholders.
Real photos will be added later.
