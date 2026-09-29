# AI Playground — project notes

Interactive slide deck (VI + EN) that teaches AI fundamentals — LLM, search, vector DB, RAG — to developers and to low-tech readers. Running example: a small clothing shop.

**Read `docs/AGENT-HANDOFF.md` first.** It records the user's requirements, every decision made (with the reason), the current slide order, what is simulated vs computed, and open items. New direct requests from the user override it; update it after meaningful changes.

## Stack & commands

React 19 + TypeScript + Vite SPA (entry `index.html` → `app/main.tsx`). `next`/`vinext` packages are starter leftovers, not the runtime.

```powershell
npm.cmd run dev      # http://127.0.0.1:5173
npm.cmd run build    # tsc --noEmit + vite build
npx.cmd eslint app/  # 3 known errors in app/database-demo.tsx predate current work
node scripts/check-slides.mjs  # slide order VI | EN, flags Vietnamese left in EN text
```

Verify with build + lint + `check-slides`. Do not drive Playwright/screenshots — the user tests the UI.

## Key files

| File | Role |
|---|---|
| `app/content.ts` | Vietnamese lessons, story order (`slidesVi`, `chapter()`), dividers, products, `sources` |
| `app/content-en.ts` | English text, same order as `lessons` (length is checked at load) |
| `app/demos.tsx` | All demos + `Demo` switch; shared `useT`, `Top`, `Hint`, `Range`, 3D helpers, `StoryMap` |
| `app/database-demo.tsx` | Linear search / metadata / inverted index tables |
| `app/page.tsx` | Layout, dividers, footer (contents, VI/EN switch), keyboard, URL hash |
| `app/i18n.tsx` | `useT()` → `t(vi, en)`, `num()` (VI decimal comma) |

## Conventions

- **Add a lesson at the END of `lessons` and `lessonsEn`**, then place it in `slidesVi`, and add a `case` in `Demo`. Never insert mid-array: `demo` indices would shift.
- Every visible string is bilingual (`t(vi, en)` or the EN content file). Computed demos must give the same results in both languages.
- Main text (`t`, `accent`, `p`, `take`, demo hints) is plain language for low-tech readers; AI keywords stay in English. `dev` bullets may be technical; wrap code in backticks.
- Keep "illustrative / simulated" labels on demos that do not run a real model. Real-world numbers (model sizes, context windows) come from official sources, cited in `refs`, with a check date.
- Titles state the question directly — no slogans. No "Chương" label in the UI.
- Git: one logical change per commit; commit only when asked; never commit `.playwright-mcp/`. The deployed site is stale — deploy only when the user asks.
