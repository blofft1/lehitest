# Content Plan — Post-Cleanup Baseline

## What Was Removed

### Sample Brand Assets (deleted)
- `img/icons/helix.svg` — Author Kit helix logo
- `img/icons/helix-color.svg` — Author Kit helix logo (color)
- `img/logos/discord.svg` — Discord social logo (sample)
- `img/logos/docket-site.svg` — Docket site logo (sample)
- `img/logos/github.svg` — GitHub social logo (sample)

### Sample Configuration (reset)
- `helix-query.yaml` — Blog/author query indexes cleared (were demo-only)
- `robots.txt` — `docs.da.live` sitemap reference removed
- `scripts/scripts.js` — `authorkit.dev` hostname cleared
- `workers/website/wrangler.toml` — TODO comment added (org/site values need updating)

## What Remains

### Content Directory (`/content/`)
**Empty.** No sample content was present. Ready for migration imports.

### Preserved Assets

| Path | Purpose | Action Needed |
|------|---------|---------------|
| `img/favicons/*` | Placeholder favicons (Author Kit branded) | Replace with project favicons |
| `img/icons/logo.svg` | Generic logo placeholder | Replace with project logo |
| `img/icons/globe.svg` | Language switcher icon | Keep (used by header) |
| `img/icons/toggle.svg` | Mobile nav toggle icon | Keep (used by header) |
| `img/icons/more.svg` | Menu overflow icon | Keep (used by header) |
| `img/logos/site.svg` | Site logo placeholder | Replace with project logo |
| `img/logos/color.svg` | Color logo placeholder | Replace with project logo |
| `styles/fonts/montserrat*.woff2` | Default webfont | Replace if project uses different fonts |

### Preserved Plumbing
All items listed in [INSTRUCTIONS.md](./INSTRUCTIONS.md) Section 3 ("Do Not Touch") are intact.

## Target Information Architecture

After migration, the expected structure will be:

```
/content/
├── index.html              # Homepage
├── [migrated pages...]     # Imported from source site
└── fragments/
    ├── nav/
    │   ├── header.html     # Site header (DA-authored)
    │   └── footer.html     # Site footer (DA-authored)
    └── 404.html            # 404 page content
```

### Required DA Content (authored in DA, not in repo)
- `/fragments/nav/header` — Header fragment with brand, navigation, actions
- `/fragments/nav/footer` — Footer fragment with links, legal, copyright
- `/fragments/404` — 404 error page content
- Library sheet — Block library for DA authors (blocks + examples)

## TODOs Before First Migration

- [ ] Update `scripts/scripts.js` — Set production hostname(s)
- [ ] Update `scripts/scripts.js` — Adjust locales if needed
- [ ] Update `workers/website/wrangler.toml` — Set `AEM_ORG` and `AEM_SITE`
- [ ] Replace `img/favicons/*` with project favicons
- [ ] Replace `img/icons/logo.svg` and `img/logos/*` with project logos
- [ ] Replace `styles/fonts/*` if using different typography
- [ ] Update `styles/styles.css` color tokens and font-family for project brand
- [ ] Create header/footer fragments in DA
- [ ] Configure DA library sheet with block examples
- [ ] Add `robots.txt` sitemap URL after deployment
