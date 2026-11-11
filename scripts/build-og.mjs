// Renders the Open Graph cards (1200 × 630) with the site's own fonts and artwork.
// Usage: node scripts/build-og.mjs   (set PLAYWRIGHT_CHROMIUM_EXECUTABLE to use a system Chrome)
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const dataUrl = async (file, type) => `data:${type};base64,${(await fs.readFile(path.join(root, file))).toString('base64')}`;
const font = (family, file, style = 'normal') =>
  dataUrl(`node_modules/@fontsource-variable/${file}`, 'font/woff2').then(
    url => `@font-face{font-family:'${family}';font-style:${style};font-weight:200 800;src:url(${url}) format('woff2');}`,
  );

const fonts = (
  await Promise.all([
    font('Newsreader', 'newsreader/files/newsreader-latin-wght-normal.woff2'),
    font('Newsreader', 'newsreader/files/newsreader-latin-wght-italic.woff2', 'italic'),
    font('JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'),
  ])
).join('');
const banner = await dataUrl('public/images/art/tide-banner.webp', 'image/webp');

const cards = [
  {
    file: 'public/images/og.png',
    label: 'Ph.D. candidate · Nanjing University',
    title: 'Yihan Meng',
    deck: 'Watermarks that <em>survive</em> inside diffusion models, and how few pixels it takes to fool a classifier.',
  },
  {
    file: 'public/images/og-tide.png',
    label: 'NeurIPS 2026 · Diffusion watermarking',
    title: 'TIDE',
    deck: 'Trajectory-aware watermark propagation for text-to-image diffusion models.',
  },
];

const page = ({ label, title, deck }) => `<!doctype html><meta charset="utf-8"><style>${fonts}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;display:grid;grid-template-rows:1fr 236px;background:#faf8f4;color:#1b1a1f}
header{padding:60px 72px 0}
p.label{font:500 17px 'JetBrains Mono';letter-spacing:.1em;text-transform:uppercase;color:#6d6973}
h1{margin-top:14px;font:400 92px/1 'Newsreader';letter-spacing:-.02em}
p.deck{max-width:880px;margin-top:22px;font:400 33px/1.25 'Newsreader';color:#4a4750}
em{color:#0f6f7c}
div{position:relative;margin:0 72px 60px;border-radius:14px;overflow:hidden;background:#1a2238}
img{width:100%;height:100%;object-fit:cover;object-position:50% 38%}
i{position:absolute;top:0;bottom:0;left:70%;border-left:2px dashed rgb(255 255 255 / .85)}
</style><header><p class="label">${label}</p><h1>${title}</h1><p class="deck">${deck}</p></header><div><img src="${banner}"><i></i></div>`;

const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined });
const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const card of cards) {
  await tab.setContent(page(card));
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: path.join(root, card.file) });
  console.log('wrote', card.file);
}
await browser.close();
