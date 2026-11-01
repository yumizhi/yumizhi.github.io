# Yihan Meng — Academic Homepage

A real Next.js App Router site, exported as static HTML for GitHub Pages. TypeScript, Tailwind CSS 4, official shadcn/ui source components, Motion, MDX, KaTeX, Shiki, and a local Command search index.

## Develop locally

Requires Node 22+ (see `.nvmrc`).

```sh
npm ci
npm run dev
```

Open the Next.js URL printed in the terminal. To review the exact Pages build:

```sh
npm run typecheck
npm run build
npm run test:links
npm run preview
```

`out/` is the deployment artifact. It is intentionally ignored by Git. Keep `package.json`, `package-lock.json`, `.nvmrc`, `components.json`, and the workflows in Git. Keep generated caches, installed dependencies, environment secrets, and local reports out of Git.

The managed Work preview passes Vite-style flags. `scripts/dev.mjs` translates those for Next.js, and uses the production export for a final managed preview when `out/` exists. Ordinary `npm run dev` starts Next.js. Rebuild the export and refresh to review changes in a final static preview.

## Deploy to GitHub Pages

1. In repository **Settings → Pages → Build and deployment**, select **GitHub Actions**. This account-level repository setting is the only manual migration step.
2. Review and merge the redesign PR into `main`.
3. The **Build, test, and deploy homepage** workflow installs from the lockfile, type-checks, exports, checks links, runs Playwright, and deploys `out/` after all checks pass.

PRs only build and test. They never deploy over the live site. This implementation does not merge or modify the content of `main` during review.

For `yumizhi.github.io`, leave `NEXT_PUBLIC_BASE_PATH` empty. For a project Pages site, set it to `/repository-name` before building. `asset()` prefixes local asset URLs and Next.js prefixes routes. Rebuild when the prefix changes. Avoid hardcoded absolute asset paths in new components.

SEO includes per-page titles/descriptions/canonicals, Open Graph metadata, a local social image, Person structured data, sitemap, robots, and a custom static 404. Routes use trailing slashes. `/about/`, `/about.html`, old root section fragments, V2 hash routes, and original profile-image addresses have compatibility handling in `scripts/postbuild.mjs`.

Google Scholar profile links are retained. The citation-data workflow is manually triggered, uses the public Scholar ID, and exports a downloadable JSON artifact with read-only repository access. Analytics uses the original `G-7YW0Y81D8` ID and runs only on `yumizhi.github.io`, so previews do not send analytics.

## Add a paper

Edit `src/lib/content.ts`, adding a typed `Paper` entry with a unique slug, title, author order, venue/year, summary, abstract, citation and verified resource links. `featured: true` selects homepage works. Keep two or three homepage features.

Place the original or approved figure in `public/images/` and the PDF in `public/files/`. Use WebP derivatives for covers; retain the original full figure on the detail page. Supply alt text and a source caption. Add the source and release status to `docs/design/assets.md`. Omit unavailable links. New detail pages, research filters, and search entries are generated automatically.

The card artwork lives in `src/components/research-card.tsx`. TIDE has two exact paper-image crops. SASBO uses its original figure. A missing image produces a clearly marked typographic cover. Complete author lists, abstract and BibTeX live in details, not on the default homepage card.

## Add a project

Add a record to `projects` in `src/lib/content.ts`. Use a screenshot from the public application or an approved asset. Add gallery images and verified repository/demo/release links. Index and detail routes are generated from the record. Do not import private repositories or their assets to create a fuller-looking list.

## Publish writing

Create `src/content/writing/your-slug.mdx`:

```mdx
---
title: "Your article title"
description: "A short, factual introduction."
date: "2026-11-01"
category: "Research notes"
author: "Yihan Meng"
---

Opening paragraph.

## A section title

The section appears in the contents. Inline math: $x^2$.
```

MDX supports GFM, LaTeX math, highlighted fenced code, figures/captions, contents, reading progress and related notes. Use level-two headings for the automatic contents. Local Markdown images are prefixed automatically by the MDX renderer. Use trusted repository-authored MDX only; it compiles as code at build time. Current posts are clearly attributed site documentation, not migrated mock research posts.

## Add PDF, slides, or a poster

1. Put the approved original in `public/files/` using a URL-safe filename.
2. Add a typed `Resource` to `resources` in `src/lib/content.ts`, with `type` of `Paper`, `CV`, `Slides`, or `Poster`.
3. Create a first-page WebP preview in `public/images/`, using `pdftoppm` or another PDF renderer. Set its path, description and file size.
4. Build and verify preview, original-file tab and native download. Mobile shows the first page and explicit access to the full PDF.

The existing CV PDF is a factual web CV. Replace it with a reviewed CV at the same path or regenerate with `python3 scripts/generate-cv.py` (requires ReportLab and DejaVu Sans). Update the web CV records and PDF together. Refresh its first-page preview after changes.

## Test and inspect

```sh
npx playwright install --with-deps chromium
npm run build
npm run test:e2e
```

The suite checks nine key routes at 1440×900, 1280×800, 768×1024, 390×844 and 375×812, plus hover reversal, keyboard access, mobile navigation, filters, Command search, themes, citations, PDF controls, MDX, reduced motion, old URLs, 404, and axe accessibility. CI uses a real HTTP preview server.

In a network-restricted workspace, `USE_STATIC_FIXTURE=1` serves exported bytes through Playwright route fulfillment at a synthetic secure origin, without changing the app. An optional `PLAYWRIGHT_CHROMIUM_EXECUTABLE` points to an installed Chromium. Local evidence documents this mode explicitly.

`docs/qa/screenshots/` contains captured implementation screens. `docs/qa/animations/` contains actual browser-frame GIFs. `scripts/capture-interactions.cjs` records source frames using the export fixture. `scripts/capture-references.cjs` records public reference pages when external browser networking is available; failures are kept as failures.

See [design references](docs/design/references.md), [tokens](docs/design/tokens.md), [asset register](docs/design/assets.md), and [QA evidence](docs/qa/README.md).

## Main source paths

| Path | Purpose |
| --- | --- |
| `src/app/` | Static routes, server-rendered content and metadata |
| `src/components/ui/` | Official shadcn source components |
| `src/components/` | Gallery, reader, search, PDF and custom content components |
| `src/lib/content.ts` | Profile, publications, projects, education and resources |
| `src/content/writing/` | Trusted MDX articles |
| `src/app/globals.css` | Semantic light/dark tokens and responsive layouts |
| `src/lib/motion.ts` | Shared Motion timing and spring tokens |
| `public/` | Approved files, images and identity assets |
| `.github/workflows/pages.yml` | Validated Pages export and deployment |

Source attribution and licensing are recorded in `THIRD_PARTY_NOTICES.md`. The original Jekyll implementation remains available in Git history; its content snapshot are in `docs/design/` for migration review.
