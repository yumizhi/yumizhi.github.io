# Design direction: a research notebook on paper

The site reads like a printed research notebook: warm paper, dark ink, hairline rules, a serif for
titles and a sans for reading. Colour is reserved for meaning. Every image is either taken from a
paper, computed from stored experiment output, or labelled as a conceptual illustration.

Source of truth for tokens: `src/app/globals.css`. Layout and components: `src/styles/*.css`.

## Tokens

| Role | Light | Dark | Used for |
| --- | --- | --- | --- |
| `--paper` / `--paper-raised` / `--paper-sunk` | `#FAF8F4` / `#FFFFFF` / `#F2EFE8` | see `globals.css` | page, figure stages, code and inset blocks |
| `--ink`, `--ink-2`, `--ink-3` | `#1B1A1F`, `#4A4750`, `#6D6973` | | text, secondary text, labels |
| `--rule`, `--rule-strong` | `#E2DDD3`, `#C9C2B5` | | hairlines and control borders |
| `--violet` | `#6A005F` | | Nanjing University violet: links on hover, focus, brand dot |
| `--tide`, `--mark`, `--drift` | `#0F6F7C`, `#7D3FA0`, `#B4532A` | | TIDE; the watermark and its guidance; Tree-Ring and drift |
| `--attack` | `#C8381F` | | SASBO: perturbed pixels |
| `--meta` | `#7A5C0C` | | Sparse Attack with Meta-Learning |

Each article sets `--hue` to its paper colour; shared components (kicker, summary, contents rail,
highlighted table rows) read `--hue` and never name a paper.

Type: Newsreader Variable and Noto Serif SC for display (`.display`); Inter Variable and Noto Sans SC
for text; JetBrains Mono Variable for labels, figure numbers and data (`.label`). All fonts are
self-hosted through `@fontsource-variable`.

Layout: a 1200px shell; articles use a sticky numbered contents rail, a 700px reading column, and
figures that may extend to 1040px (`data-width="wide"`).

## Page structure

- **Home** (`src/app/page.tsx`, `src/styles/home.css`): name and one-sentence research statement,
  then the trajectory plate, then research, projects, education and experience, writing.
- **Research article** (`src/components/article/`): title and deck, banner, authors / affiliations /
  publication, summary, numbered sections, citation. Each paper supplies its own banner, figures
  and prose in `src/components/{tide,sasbo,sam}/article.tsx`.
- **Index pages** (`src/styles/pages.css`): research, projects, writing, resources.
- The CV keeps its own print-oriented stylesheet (`src/app/cv/cv.css`).

## Figures

Every figure carries one of three labels, set by the `kind` prop of `<Figure>`:

- `paper`: reproduced from the publication.
- `data`: drawn from numbers in the paper's tables, or from stored output of a real run. The caption
  says which.
- `concept`: an explanatory illustration. Its values are not experimental results.

## Motion

Motion is used where it explains something: scrubbing and playing the sampling trajectory, the
blink comparator, bars that resize when a setting changes, and the one-time reveal of the banner
strips. With `prefers-reduced-motion`, entrance animation and autoplay are off and every control
still works.

## Adding a paper

1. Add the entry to `papers` in `src/lib/content.ts` and the PDF to `public/files/`.
2. Create `src/components/<slug>/article.tsx` using `Article`, `Section`, `P`, `Figure`, `Equation`.
3. Route the slug in `src/app/research/[slug]/page.tsx`.
4. Give it a hue in `globals.css` if it needs a new one.
