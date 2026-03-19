# EDS Project (Author Kit Baseline)

Edge Delivery Services project built on the [Author Kit](https://github.com/aemsites/author-kit) template with Document Authoring (DA).

## Getting Started

### 1. GitHub
1. Install [AEM Code Sync](https://da.live/bot).

### 2. DA Content
1. Browse to https://da.live/start.
2. Follow the steps.

### 3. Local Development
1. Clone the repo.
2. Install the AEM CLI: `sudo npm install -g @adobe/aem-cli`
3. Start local dev: `aem up`
4. Install dev dependencies: `npm i`

## Author Kit Block Library

| Block | Purpose |
|-------|---------|
| `hero` | Full-width hero with background image/video, foreground text, variants: small, large, full, light, dark, stack, center |
| `card` | Content card with image, text, and CTA |
| `columns` | Multi-column layout with optional image-cover variant |
| `advanced-tabs` | Tabbed content across sections |
| `table` | Structured data table |
| `youtube` | Embedded YouTube video (auto-block from link) |
| `section-metadata` | Section styling: background, grid, gap, spacing, layout |
| `fragment` | Load and inject content fragments |
| `header` | Site header with brand, nav, mega menu, actions |
| `footer` | Site footer with legal and copyright sections |
| `schedule` | Time-based content scheduling |

## Architecture

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for migration rules and block conventions.
See [CONTENT_PLAN.md](./CONTENT_PLAN.md) for content structure after baseline cleanup.

## Author Kit Features

- Localization (en, de, es, fr, hi, ja, zh)
- Section metadata: grid, gap, spacing, background, layout
- Button styles: accent, primary, secondary, negative (w/ outline)
- Color tokens: blue, gray, green, magenta, orange, red, purple, yellow (100-900)
- Light/dark color scheme support
- Scheduled content via spreadsheets
- Sidekick plugins: Quick Edit, Schedule Simulator
- Cloudflare Worker reference implementation
