# Design references and observed limits

Reviewed 2026-11-01. The current public repository and V2 source informed content migration. Brand reference: the existing Nanjing University seal and the user-specified purple. Screens, flows, animations, and UI elements were treated separately.

## What was actually viewed

The cloud browser was used for the pages below. Desktop screenshots were inspected in the working session. Some sites returned incomplete assets. Local Playwright could run this project's exported pages, but external HTTPS reference capture encountered the workspace proxy's certificate error. Certificate validation was kept enabled. External mobile captures and third-party hover timings therefore remain **unverified**. No timing below is claimed to have been measured on a reference site.

| Source | Actual observation | Application in this site | Limits |
| --- | --- | --- | --- |
| https://www.apple.com/newsroom/ | Stable, compact global and Newsroom navigation; separate search treatment; muted page background. | Persistent 76px navigation, restrained background, separate global search. | News feed images/content failed to populate; no card-motion conclusions drawn. |
| https://www.apple.com/newsroom/2026/10/apple-unveils-groundbreaking-macbook-pro-with-proled-xdr-display/ | Separate release/date metadata and a centered reading column; sharing controls below the lead region. | Article date/byline separated from the heading, 720px reading body, original-resource actions beside paper metadata. | The title/hero area rendered incompletely. It was rejected as image/crop evidence. |
| https://developer.apple.com/design/human-interface-guidelines/motion | Three-column documentation screen: topic navigation, central article, local contents. Intro describes status, feedback, and accessibility as purposes for motion. | Article contents remains outside prose; reduced-motion behavior, short feedback, reversible reveals. | Guidance is a rationale, not a measured demonstration of our card animation. |
| https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/ | Large left-aligned article title, small date/read-time row, substantial gap before rounded hero media. | Paper detail heading/metadata separated from full figure; MDX header has a distinct standfirst and byline. | Image only partly rendered; article typography was usable. |
| https://ai.meta.com/research/ | Prominent research heading; asymmetric feature with text/actions on one side and a project visual on the other; subsequent resource links use lighter treatment. | Homepage identity and university/update column have unequal widths; project showcase uses text beside a real screenshot; resource rows remain compact. | Only visible static composition accepted as evidence. |
| https://ai.meta.com/results/?content_types%5B0%5D=publication | The requested publications page returned navigation/footer content without a usable results index. | No publication filtering behavior attributed to this page. Compact list is independently implemented and tested. | Results flow unverified. |
| https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-carbon/ | Clear breadcrumb; large, readable two-line heading; date and lead summary; author/share row with horizontal rules; wide rounded hero below. | Detail breadcrumb, 49px title, metadata/actions before imagery; article reading hierarchy and related-note links. | Exact typeface and mobile breakpoints were not copied. |
| https://blog.google/innovation-and-ai/models-and-research/ | Large section heading and clearly separated content categories. | Research topic filters and distinct page headings; small category metadata above content titles. | Cards/images failed to populate. Gallery details use DeepMind instead. |
| https://deepmind.google/blog/ | Fully visible primary image-led story on the left; three smaller stories on the right, separated by rules. Titles have hierarchy; dates and categories remain quiet; media uses restrained rounded corners. | Two selected image-led papers; larger TIDE column; titles and publication metadata outside the image. Writing/experience uses rules instead of repeated cards. | Shared-element behavior was not inferred from the screenshot. |
| https://mobbin.com/ | Public page text communicated a reference library and distinct discovery surfaces. CSS was incomplete in this browser. | The requested four-axis research framework is retained; work gallery has a stable image boundary. | No visual proportions or motion parameters taken from broken styling. |
| https://mobbin.com/explore/sites | Returned a site-served “This request was blocked / 403 FORBIDDEN” page. | Supplemented with the accessible DeepMind index and shadcn component reference. | No gallery, filter, or hover observations available. |
| https://mobbin.com/explore/web | Returned the same blocked response during the planned reference pass. | No app-screen measurements claimed. | Unavailable in this browser. |
| https://mobbin.com/changelog | Returned the same blocked response. | Recent writing uses its own editorial rows. | No changelog animation or navigation claims. |
| https://ui.shadcn.com/docs/components/command (redirects to /docs/components/base/command) | Search input, grouped suggestions, subtle separators, icons and shortcut hints were visible in the live component example. Typing “Calendar” reduced the suggestion list to the selected Calendar entry. | Official Command/CommandDialog, grouped static index, keyboard navigation, empty result state, Escape. | This is the actual component system, recolored with semantic tokens. |

## Screens

The homepage presents identity before content, with both selected papers visible in a desktop viewport. Research has a gallery for browsing and a compact list for scanning authors. Projects uses a real screenshot beside its description. Writing uses chronological editorial rows. Resources uses file rows, with preview controls placed next to each file. These modules intentionally use different compositions.

The paper detail page keeps the cover crop for visual continuity, then shows the original scientific figure without cropping. No experimental information is hidden in a decorative reconstruction.

## Flows

1. Home → selected work → authors/abstract → original PDF or publisher → citation.
2. Research → topic/search → gallery/list → detail. Filters update locally and retain focus.
3. Project → screenshot gallery → public app/repository/releases.
4. Writing → category → MDX reader → local contents → related note.
5. Resource → type/search → preview dialog → native PDF tab or download. Mobile displays a first-page preview and explicit original-file access.
6. Command search → query → keyboard selection → destination. Every result refers to an actual route.

## Animations

Reference access did not support reliable third-party hover measurement. The following are implemented project decisions, then verified in browser tests and the captured GIFs:

- The image clip is stationary. Inner media scales 1.035× and shifts 3px; the caption/actions reveal within it. Exit reverses from the current state.
- The navigation's active background uses Motion `layoutId`; it travels between links while the header remains mounted.
- Filtered results use Motion layout measurement and `AnimatePresence` with `popLayout`; surviving items move into vacant positions.
- Named cover/title elements use the browser View Transition API across App Router navigation. Unsupported browsers use direct navigation. The whole page has no primary fade animation.
- Abstract height animates between zero and measured content height. It supports interruption.
- Theme colors transition for 220ms. Reduced motion removes translation/scale and uses immediate feedback; content remains available.

See `tokens.md`, `../qa/README.md`, and `../qa/animations/` for final parameters and evidence.

## UI elements and engineering grounding

The 1200px shell, 76px desktop header, 64px mobile header, 720px prose column, subtle dividers, fixed media boxes, and compact metadata are actual code decisions. They are not claimed as exact measurements of a brand's private design system.

The shadcn CLI was invoked with the official `new-york` setup. The registry request was blocked by the environment proxy. Components were then sourced from the official `shadcn-ui/ui` repository, commit `c0d63c339d6cd2fc26135590a54cf1f362269451`, `apps/v4/registry/new-york-v4/ui/`. Import aliases were adapted to this repository. The CommandDialog's hidden title/description were moved inside its dialog content. Button, Command, Dialog, Sheet, Input, Tabs, Separator, Collapsible, and Tooltip remain maintainable source components in `src/components/ui`.

Official engineering references consulted:

- https://ui.shadcn.com/docs/installation/next
- https://nextjs.org/docs/app/guides/static-exports
- https://motion.dev/docs/react-layout-animations

The automatic external capture attempt is preserved in `reference-captures/observations.json`, including its failures. It is not presented as visual QA. Final-site screenshots and interactions are captured from the generated static export, with an additional live cloud-browser review.
