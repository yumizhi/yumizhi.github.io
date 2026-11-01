# Implementation verification

On 2026-11-01 the recovered source passed `npm run typecheck`, `npm run build`, and `npm run test:links` (17 exported HTML files). All 26 Playwright tests passed against the static export, using `USE_STATIC_FIXTURE=1` and the installed Chromium headless shell because this workspace restricts browser sockets.

The suite covers five viewport sizes, research filters, hover and keyboard interaction, search, themes, navigation, BibTeX, PDF controls, MDX, reduced motion, legacy URLs, and accessibility. GitHub Actions repeats the suite against an HTTP server.

Existing WebP screenshots are in `screenshots/`; recorded interaction GIFs are in `animations/`. These are implementation review evidence. The open visual findings in `../design/review-2026-11-01.md` still require review.

## Preview locally

Use Node.js 22 or newer. From the repository root:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For the production static export:

```sh
npm run build
npm run preview
```

GitHub Pages publishes the main branch after merge and repository Pages configuration. Pull requests run checks; they do not provide a hosted preview URL.
