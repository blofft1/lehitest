# Project Instructions — Migration & Block Rules

## 1. Reuse-First Block Policy

When migrating content or building new pages:

1. **Always check existing blocks first.** Before creating a new block, verify whether an existing Author Kit block (or one of its variants) can handle the content.
2. **Prefer variants over new blocks.** If a block is close but needs a visual twist, add a CSS variant class (e.g., `hero (light)`, `card (horizontal)`) rather than creating an entirely new block.
3. **Only create a new block when no existing block or variant is a reasonable fit.** Document why in a commit message or PR description.

### Available Author Kit Blocks

| Block | Variants / Modifiers |
|-------|---------------------|
| `hero` | `small`, `large`, `full`, `light`, `dark`, `stack`, `center`, `quiet-background` |
| `card` | `hash-aware` |
| `columns` | `image-cover` |
| `advanced-tabs` | — |
| `table` | — |
| `youtube` | — (auto-block) |
| `section-metadata` | `grid-2`–`grid-6`, `gap-*`, `spacing-*`, `container-*`, `layout-bento`, `center`, background |
| `fragment` | — (auto-block) |
| `schedule` | — (auto-block) |
| `header` | — (fragment-based) |
| `footer` | — (fragment-based) |

## 2. Block Naming Conventions

- Use **lowercase, kebab-case** names: `hero`, `card`, `feature-grid` (not `FeatureGrid` or `feature_grid`).
- Variant names should be **descriptive and human-readable**: `hero (light, center)` not `hero (v2)`.
- Avoid one-off or throwaway block names. Every block should be potentially reusable.

## 3. Do Not Touch — Protected Plumbing

The following files and directories are **Author Kit plumbing** and must not be deleted or structurally modified without understanding the downstream impact:

### Core Scripts
- `scripts/ak.js` — Core decoration engine (loadBlock, loadArea, decorateLinks, etc.)
- `scripts/scripts.js` — Project config (hostnames, locales, linkBlocks, components)
- `scripts/postlcp.js` — Post-LCP header loading
- `scripts/lazy.js` — Lazy-loaded utilities (footer, sidekick, scheduler, favicon)
- `scripts/utils/*` — Utility modules (env, error, favicon, footer, icons, lazyhash, observer, picture, script, styles)

### Core Styles
- `styles/styles.css` — Global design tokens, button styles, section layout, typography
- `styles/fonts/` — Bundled Montserrat webfonts

### Structural Blocks
- `blocks/header/` — Fragment-based header with mega menu, brand, actions
- `blocks/footer/` — Fragment-based footer with legal/copyright
- `blocks/fragment/` — Fragment loader (used by header, footer, and content)
- `blocks/section-metadata/` — Section styling engine (grid, gap, spacing, background, color scheme)
- `blocks/schedule/` — Scheduled content block

### Authoring Tools
- `tools/da/da.js` — DA live preview integration
- `tools/quick-edit/quick-edit.js` — Quick Edit plugin
- `tools/scheduler/` — Schedule simulator (Lit-based)
- `tools/sidekick/sidekick.js` — Sidekick plugin loader

### Infrastructure
- `head.html` — Page head with CSS + JS includes
- `helix-query.yaml` — Query index configuration
- `404.html` — Fragment-based 404 page
- `workers/` — Cloudflare Worker for CDN routing
- `deps/` — Vendored dependencies (Lit, RUM)

### Config
- `.editorconfig`, `.stylelintrc.json`, `eslint.config.js` — Code quality
- `.hlxignore` — Files excluded from AEM delivery
- `.vscode/launch.json` — Local debugging
- `package.json` — Dev dependencies and scripts

## 4. Content Fragments

Header and footer are loaded as **fragments** from DA content:
- Header: `/fragments/nav/header` (with optional `/fragments/nav/header/languages`)
- Footer: `/fragments/nav/footer`
- 404: `/fragments/404`

These paths are configurable via page metadata (`header`, `footer` properties).

## 5. Localization

The project supports these locales out of the box:
- `''` (default, `en`)
- `/de`, `/es`, `/fr`, `/hi`, `/ja`, `/zh`

Fragments are automatically localized by prepending the locale prefix. Modify `scripts/scripts.js` `locales` object to change supported locales.

## 6. Migration Workflow

When importing content from an external site:

1. **Analyze** the source page structure.
2. **Map** content sections to Author Kit blocks (reuse-first).
3. **Create variants** only when an existing block needs visual customization.
4. **Import** content into `/content/` as HTML.
5. **Verify** rendering at `localhost:3000`.
6. **Create** header/footer fragments to match the source site navigation.
7. **Update** `scripts/scripts.js` hostnames and locales if needed.

## 7. DA Library Configuration

The DA block library is configured in DA content (not in the code repo). The library uses:
- A **blocks sheet** in DA that lists available blocks with examples
- The sidekick library configuration at the DA org level

When adding new blocks, ensure they are also added to the DA library sheet so authors can discover them.
