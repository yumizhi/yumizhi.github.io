# Yihan Meng — Academic Homepage

Personal research homepage, publications, projects, writing, and bilingual CV.

- Website: https://yumizhi.github.io/
- CV: https://yumizhi.github.io/cv/
- Stack: Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui / Radix, Motion, and GSAP.

## Local development

Requires Node 22+.

```sh
npm ci
npm run dev
```

## Publishing

`main` is the production branch. GitHub Pages uses **GitHub Actions** as its source. Pushing to `main` runs `.github/workflows/pages.yml`, builds the static site, checks local file links, and deploys `out/`.

```sh
npm run build
npm run test:links
npm run preview
```

The build includes the PDFs in `public/files/`. Generated build output, local screenshots, and review recordings stay outside Git.

## Content

| Path | Content |
| --- | --- |
| `src/lib/content.ts` | Profile, publications, projects, education, honors, and resources |
| `src/lib/cv.ts` | Chinese and English CV project descriptions |
| `src/lib/posts.ts` | Published writing links |
| `src/app/cv/` | CV layout and print styles |
| `src/components/article/` | Shared research-article layout: masthead, contents rail, figures, equations |
| `src/components/{tide,sasbo,sam}/` | The three research articles with their banners and interactive figures |
| `src/styles/` | Site, homepage, article, figure and index-page styles; tokens are in `src/app/globals.css` |
| `docs/design/` | Design direction, asset provenance and known content gaps |
| `public/files/` | Paper PDFs and downloadable CVs |
| `public/images/` | Images, logos, and PDF previews |

Paper PDFs:

- [TIDE — NeurIPS 2026](https://yumizhi.github.io/files/tide-neurips-2026.pdf)
- [SASBO — PAKDD 2024](https://yumizhi.github.io/files/sasbo-pakdd-2024.pdf)
- [Sparse Attack with Meta-Learning — IJCNN 2024](https://yumizhi.github.io/files/sparse-meta-learning-ijcnn-2024.pdf)

## Research artwork

The TIDE banner, sprite sheets, chart data and Open Graph cards are derived from the stored sampling run in `public/media/tide/sampling/`:

```sh
npm run art
```

Set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` if Playwright's bundled Chromium is not installed.

## Export the CV

With the local development server running:

```sh
node scripts/generate-cv.mjs
```

This exports English and Chinese PDFs to `public/files/` and editable HTML to `output/cv/`. Set `CV_ORIGIN` to use another server. The editable HTML uses the MIT-licensed ASu editor in `scripts/vendor/asu-resume/`. Refresh the first-page images in `public/images/cv-page*.webp` after changing the CV.

Attribution and licenses for reused assets and components are recorded in `THIRD_PARTY_NOTICES.md`.
