import {test,expect} from './fixtures';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
async function choosePreview(page: Page, name: string) {
 const control = page.getByRole('combobox', { name: /^Choose preview,/ });
 await control.click();
 await page.getByRole('option', { name, exact: true }).click();
 await expect(control).toHaveAccessibleName(`Choose preview, ${name}`);
 await expect(page.getByRole('listbox')).toHaveCount(0);
}

async function jumpToSection(page: Page, name: string) {
 await page.locator('.article-section-nav').getByRole('button').click();
 await page.getByRole('menuitem', { name, exact: true }).click();
 await expect(page.getByRole('menu')).toHaveCount(0);
}

const sizes=[{width:1440,height:900},{width:1280,height:800},{width:768,height:1024},{width:390,height:844},{width:375,height:812}];
for(const viewport of sizes){test(`responsive pages ${viewport.width}x${viewport.height}`,async({page})=>{
 await page.setViewportSize(viewport);
 for(const route of ['/','/research/','/research/tide/','/projects/','/projects/epub-toolkit/','/writing/','/resources/','/cv/']){
  await page.goto(route);await page.locator('h1').waitFor();await page.waitForTimeout(150);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(img=>{img.loading='eager';return img.decode().catch(()=>{});}));});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i instanceof HTMLImageElement&&i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')));expect(broken).toEqual([]);
  const slug=route==='/'?'home':route.split('/').filter(Boolean).join('-');
  await fs.mkdir('docs/qa/screenshots',{recursive:true});await page.screenshot({path:`docs/qa/screenshots/${slug}-${viewport.width}x${viewport.height}.png`,fullPage:true});
 }
});}
test('home conveys identity and research in the first desktop viewport',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Yihan Meng');
 const study=page.getByTestId('research-card-tide').getByRole('link',{name:'Read the study',exact:true});
 await page.evaluate(()=>document.fonts.ready);
 const box=await study.boundingBox();expect(box!.y+box!.height).toBeLessThan(900);
 await expect(page.getByRole('link',{name:'Scholar',exact:true})).toHaveAttribute('href',/sMZ0X6sAAAAJ/);
});
test('TIDE playback can be interrupted and shows each conceptual stage', async ({ page }) => {
 await page.goto('/');
 const tide = page.getByTestId('research-card-tide');
 const preview = tide.locator('.ph-preview');
 await expect(tide.getByRole('link', { name: 'PDF', exact: true })).toHaveAttribute('href', /tide-neurips-2026\.pdf/);
 await expect(tide.getByRole('img', { name: 'Illustration of the TIDE denoising trajectory' })).toBeVisible();
 await tide.getByRole('button', { name: 'Play trajectory' }).click();
 await expect(preview).toHaveAttribute('data-stage', 'denoise');
 await expect(preview).toHaveAttribute('data-stage', 'inject', { timeout: 4500 });
 await tide.getByRole('button', { name: 'Pause trajectory' }).click();
 await tide.getByRole('button', { name: 'Guide', exact: true }).click();
 await expect(preview).toHaveAttribute('data-stage', 'guide');
 await expect(tide.getByRole('button', { name: 'Guide', exact: true })).toHaveAttribute('aria-pressed', 'true');
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await tide.getByRole('button', { name: 'Next trajectory stage' }).click();
 await expect(preview).toHaveAttribute('data-stage', 'denoise');
});
test('research filters, search, empty state, and compact list',async({page})=>{
 await page.goto('/research/');
 const all = page.getByRole('button', {name: 'All', exact: true});
 const watermarking = page.getByRole('button', {name: 'Watermarking', exact: true});
 await expect(all).toHaveAttribute('aria-pressed', 'true');
 await all.focus();
 await page.keyboard.press('ArrowRight');
 await expect(watermarking).toBeFocused();
 await page.keyboard.press('Space');
 await expect(watermarking).toHaveAttribute('aria-pressed', 'true');await expect(page.getByRole('status')).toContainText('1 publication');await expect(page.getByTestId('research-card-sasbo')).toHaveCount(0);
 await page.getByRole('button',{name:'All',exact:true}).click();await page.getByRole('button',{name:'List view',exact:true}).click();await expect(page.locator('.publication-row')).toHaveCount(3);
 await page.getByRole('textbox',{name:'Search research'}).fill('unfindable');await expect(page.getByText('No matching publications')).toBeVisible();await page.getByRole('button',{name:'Clear filters'}).click();await expect(page.locator('.publication-row')).toHaveCount(3);
});
test('command search supports keyboard selection and Escape',async({page})=>{
 await page.goto('/');await page.keyboard.press('Control+k');const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await dialog.getByRole('combobox').fill('TIDE');await page.keyboard.press('Enter');await expect(page).toHaveURL(/\/research\/tide\//);
 await page.getByRole('button',{name:'Search site'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('theme persists and dark homepage remains accessible',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/');await page.getByRole('button',{name:'Switch to dark theme'}).click();await expect(page.locator('html')).toHaveClass(/dark/);await page.reload();await expect(page.locator('html')).toHaveClass(/dark/);
 await page.screenshot({path:'docs/qa/screenshots/home-dark-1440x900.png',fullPage:true});
 const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
test('touch research links and mobile navigation work directly',async({page})=>{
 await page.setViewportSize(sizes[3]);await page.goto('/');const card=page.getByTestId('research-card-tide');await expect(card.getByRole('heading')).toBeVisible();await card.getByRole('link',{name:'Read the study',exact:true}).click();await expect(page).toHaveURL(/\/research\/tide\//);
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Research',exact:true}).click();await expect(page).toHaveURL(/\/research\//);await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('the paper opens with its overview and keeps the original abstract and citation accessible',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/research/tide/');
 const sections=page.getByRole('navigation',{name:'Paper sections'});
 await expect(sections.getByRole('button')).toHaveAccessibleName(/, Overview$/);
 const comparison=page.locator('#overview + .tide-comparison');
 const method = comparison.getByRole('combobox', { name: 'Watermark method, Tree-Ring' });
 await method.click();
 await page.getByRole('option', { name: 'TIDE', exact: true }).click();
 const selected = comparison.getByRole('combobox', { name: 'Watermark method, TIDE' });
 await expect(page.getByRole('listbox')).toHaveCount(0);
 await expect(selected).toHaveCSS('outline-style', 'none');
 await selected.focus(); await page.keyboard.press('ArrowDown');
 await expect(page.getByRole('listbox')).toBeVisible();
 await page.keyboard.press('Escape'); await expect(selected).toBeFocused();
 await expect(comparison.getByRole('img',{name:'TIDE · Sports car',exact:true})).toBeVisible();
 await jumpToSection(page, 'Abstract');
 await expect(page).toHaveURL(/#abstract$/);
 await expect(page.locator('#abstract')).toContainText('Watermarking text-to-image diffusion models');
 await page.getByRole('button',{name:'Copy BibTeX'}).first().click();await expect(page.getByRole('button',{name:'Copied',exact:true}).first()).toBeVisible();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('meng2026tide');
});
test('paper figures show trajectory, paired masks, and the SAM query update inline', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/research/tide/#trajectory-figure');
 const trajectory = page.locator('#trajectory-figure');
 await expect(trajectory).toHaveAttribute('data-stage', '2');
 await expect(trajectory.locator('.trajectory-guided')).toHaveCSS('opacity', '1');
 await expect(trajectory.getByRole('button')).toHaveCount(0);

 await page.goto('/research/sasbo/#mask-figure');
 const masks = page.locator('#mask-figure');
 for (const tail of ['lower', 'upper']) {
   await expect(masks.locator(`[data-tail="${tail}"] .arm-track[data-selected="true"]`).first()).toBeVisible();
   await expect(masks.locator(`[data-tail="${tail}"] .arm-track[data-selected="false"]`).first()).toBeVisible();
 }
 await expect(page.getByRole('link', { name: 'Complete figure' })).toHaveAttribute('href', '/images/sasbo-original.webp');

 await page.goto('/research/sparse-meta-learning/#handoff-figure');
 const handoff = page.locator('#handoff-figure');
 await expect(handoff.getByText('Support proposal', { exact: true })).toBeVisible();
 await expect(handoff.locator('.sam-query-signal')).toBeVisible();
 await expect(page.locator('#projection-example tbody tr[data-retained="true"] th')).toHaveText('B');
 await expect(page.getByRole('link', { name: 'Table VI in the paper' })).toHaveAttribute('href', '/files/sparse-meta-learning-ijcnn-2024.pdf');
});
test('worked paper equations fit the mobile reading column', async ({ page }) => {
 await page.setViewportSize({ width: 320, height: 800 });
 for (const slug of ['tide', 'sasbo', 'sparse-meta-learning']) {
   await page.goto(`/research/${slug}/`);
   const prose = page.locator('#method .tide-prose').first();
   await expect(prose).toHaveCSS('text-align', 'justify');
   const equations = page.locator('.paper-equation-math');
   expect(await equations.count()).toBeGreaterThan(2);
   for (const equation of await equations.all()) {
     await expect(equation.locator('math')).toHaveCount(1);
     expect(await equation.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
   }
 }
});
test('home and the directories share their outside edges during navigation', async ({ page }) => {
 await page.setViewportSize({ width: 1440, height: 900 });
 await page.goto('/');
 const home = page.getByRole('link', { name: 'Home', exact: true });
 const initialButton = (await home.boundingBox())!;
 const initialPage = (await page.locator('.ph-shell').boundingBox())!;
 const nav = page.getByRole('navigation', { name: 'Main navigation' });

 for (const [path, label] of [['research', 'Research'], ['projects', 'Projects'], ['writing', 'Writing'], ['resources', 'Resources']]) {
   await nav.getByRole('link', { name: label, exact: true }).click();
   await expect(page).toHaveURL(new RegExp('/' + path + '/$'));
   await expect(page.locator('.site-page-enter')).toHaveCSS('animation-name', 'site-page-enter');
   await expect(page.locator('.directory-page .page-heading > p')).toHaveCount(0);
   const button = (await home.boundingBox())!;
   const column = (await page.locator('.directory-page').boundingBox())!;
   expect([button.x, button.y, button.width, button.height]).toEqual([initialButton.x, initialButton.y, initialButton.width, initialButton.height]);
   expect([column.x, column.width]).toEqual([initialPage.x, initialPage.width]);
 }

 await page.emulateMedia({ reducedMotion: 'reduce' });
 await home.click();
 await expect(page).toHaveURL(new URL('/', page.url()).href);
 await expect(page.locator('.site-page-enter')).toHaveCSS('animation-name', 'none');
});
test('resource preview has native open/download and useful empty category',async({page})=>{
 await page.goto('/resources/');await page.getByRole('button',{name:'Preview TIDE — NeurIPS 2026',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('link',{name:'Open PDF'})).toHaveAttribute('href',/tide-neurips-2026.pdf/);await expect(dialog.getByRole('link',{name:'Download',exact:true})).toHaveAttribute('download','');
 await dialog.getByRole('button',{name:'Close',exact:true}).click();await page.getByRole('button',{name:'Posters',exact:true}).click();await expect(page.getByRole('heading',{name:'No posters published yet'})).toBeVisible();
});
test('writing links to the published diffusion article', async ({ page }) => {
 await page.goto('/writing/');
 const article = page.getByRole('heading', { name: /Diffusion Model的直观理解/ }).getByRole('link');
 await expect(article).toHaveAttribute('href', 'https://lappland-saluzzo.notion.site/understand-diffusion-model');
});
test('project detail changes the actual screenshot',async({page})=>{
 await page.goto('/projects/epub-toolkit/');await choosePreview(page, 'Inspect');await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-inspect/);
});
test('reduced motion steps through TIDE without playing the sequence', async ({ page }) => {
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/');
 const tide = page.getByTestId('research-card-tide');
 const preview = tide.getByRole('button', { name: 'Next trajectory stage' });
 await preview.click();
 await expect(tide.locator('.ph-preview')).toHaveAttribute('data-stage', 'denoise');
 await preview.click();
 await expect(tide.locator('.ph-preview')).toHaveAttribute('data-stage', 'inject');
 await expect(tide.getByRole('button', { name: 'Pause trajectory' })).toHaveCount(0);
});
for(const route of ['/','/research/','/research/tide/','/projects/epub-toolkit/','/resources/','/cv/'])test(`accessibility ${route}`,async({page})=>{
 await page.goto(route);const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
test('old links and the static 404 resolve',async({page})=>{
 await page.goto('/about.html');await expect(page).toHaveURL(/\/cv\//);
 await page.goto('/#/research/tide');await expect(page).toHaveURL(/\/research\/tide/);
 const response=await page.goto('/this-page-does-not-exist/');expect(response?.status()).toBe(404);await expect(page.getByText('This address has no page.',{exact:false})).toBeVisible();
});
test('search and PDF dialogs have accessible names and controls',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Search site'}).click();let results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
 await page.keyboard.press('Escape');await page.goto('/resources/');await page.getByRole('button',{name:'Preview Yihan Meng — Curriculum Vitae',exact:true}).click();await expect(page.getByRole('dialog')).toHaveCSS('opacity','1');results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);
});
test('lab layout shift and largest contentful paint are recorded',async({page})=>{
 await page.addInitScript(()=>{const metrics={cls:0,lcp:0};(window as unknown as {labMetrics:typeof metrics}).labMetrics=metrics;new PerformanceObserver(list=>{for(const e of list.getEntries())if(!(e as PerformanceEntry&{hadRecentInput?:boolean}).hadRecentInput)metrics.cls+=(e as PerformanceEntry&{value:number}).value;}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{metrics.lcp=list.getEntries().at(-1)?.startTime??0;}).observe({type:'largest-contentful-paint',buffered:true});});
 await page.setViewportSize(sizes[0]);await page.goto('/');await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(800);const metrics=await page.evaluate(()=>(window as unknown as {labMetrics:{cls:number;lcp:number}}).labMetrics);
 await fs.writeFile('docs/qa/lab-performance.json',JSON.stringify({environment:process.env.USE_STATIC_FIXTURE?'Local static export fixture, desktop, unthrottled. Not a field Core Web Vitals score.':'Local static export served over HTTP, desktop, unthrottled. Not a field Core Web Vitals score.',viewport:sizes[0],...metrics},null,2));expect(metrics.cls).toBeLessThan(.1);
});

test('homepage presents research, the featured project, background and writing', async ({ page }) => {
 await page.goto('/');
 const sections = await page.locator('.ph-shell > section').evaluateAll(nodes => nodes.map(node => node.id));
 expect(sections).toEqual(['about-me', 'publications', 'projects', 'background', 'writing']);
 await expect(page.locator('#publications article')).toHaveCount(2);
 await expect(page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects/');
 await expect(page.locator('#projects').getByRole('link', { name: 'EPUB Toolkit', exact: true })).toHaveAttribute('href', '/projects/epub-toolkit/');
 const epub = page.locator('#projects [data-project="epub-toolkit"]');
 await expect(epub.getByRole('link', { name: 'Open the tool' })).toHaveAttribute('href', /lightweight_epub_merge_tool/);
 await epub.getByRole('button', { name: 'Split', exact: true }).click();
 await expect(epub.locator('img[aria-hidden="false"]')).toHaveAttribute('src', /epub-panel-split/);
 await epub.getByRole('button', { name: 'Merge', exact: true }).click();
 await expect(epub.locator('img[aria-hidden="false"]')).toHaveAttribute('src', /epub-panel-merge/);
 for (const title of ['OriginMark', 'Personal Agent']) {
  await expect(page.locator('#projects').getByRole('link', { name: title, exact: true })).toBeVisible();
 }
 await expect(page.locator('.portfolio-home')).not.toContainText(/scholarship/i);
 await expect(page.locator('#background').getByRole('heading', { name: 'Experience', exact: true })).toBeVisible();
});

test('mobile project showcases keep private repository links out of the page', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 });
 await page.goto('/projects/');
 for (const project of [
  { title: 'OriginMark', slug: 'originmark', tab: 'Verify', asset: 'originmark-verify' },
  { title: 'Personal Agent', slug: 'personal-agent', tab: 'Run history', asset: 'personal-agent-runs' },
 ]) {
  await page.getByRole('link', { name: project.title, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/$`));
  const detail = page.locator('.project-detail');
  await expect(detail).toContainText('Source code is private.');
  await expect(detail.locator('a[href*="github.com"]:not([href^="https://github.com/earendil-works/pi/"])')).toHaveCount(0);
  if (project.slug === 'personal-agent') {
   await expect(detail.getByRole('combobox', { name: 'Choose preview, Chat' })).toBeVisible();
   await choosePreview(page, 'Assistants');
   await expect(detail.locator('.stage-capture[aria-hidden="false"] img')).toHaveAttribute('src', /personal-agent-assistants/);
  }
  await choosePreview(page, project.tab);
  await expect(detail.locator('.stage-capture[aria-hidden="false"] img')).toHaveAttribute('src', new RegExp(project.asset));
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await page.goto('/projects/');
 }
 await page.getByRole('link', { name: 'EPUB Toolkit', exact: true }).click();
 await expect(page.locator('.project-detail').getByRole('link', { name: 'GitHub', exact: true })).toHaveAttribute('href', /lightweight_epub_merge_tool/);
});
test('case studies expose anchored design and implementation with keyboard-operable workflow steps', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 });
 await page.goto('/projects/personal-agent/');
 const sections = page.getByRole('navigation', { name: 'Project sections' });
 await jumpToSection(page, 'Design');
 await expect(page).toHaveURL(/#design$/);
 await expect(page.locator('#design').getByRole('heading', { level: 2 })).toBeInViewport();
 await jumpToSection(page, 'Implementation');
 await expect(page).toHaveURL(/#implementation$/);
 await expect(sections.getByRole('button')).toHaveAccessibleName(/, Implementation$/);
 const flow = page.getByRole('tablist', { name: 'Runtime steps' });
 const context = flow.getByRole('tab', { name: 'Context', exact: true });
 await expect(context).toHaveAttribute('aria-selected', 'true');
 await context.focus();
 await page.keyboard.press('ArrowRight');
 const tool = flow.getByRole('tab', { name: 'Tool call', exact: true });
 await expect(tool).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('tabpanel', { name: 'Tool call', exact: true })).toContainText('validated result');
 await jumpToSection(page, 'Validation');
 await expect(page.locator('#verification')).toContainText('web-inbox receipt');
 await expect(sections.getByRole('button')).toHaveAccessibleName(/, Validation$/);
 await page.getByRole('navigation', { name: 'Other projects' }).getByRole('link', { name: 'OriginMark' }).click();
 await expect(page.locator('#implementation').getByRole('link', { name: /TIDE/ })).toHaveAttribute('href', '/research/tide/');
 await page.goto('/projects/epub-toolkit/#implementation');
 await expect(page.locator('.epub-merge-record')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('project architecture figures preserve their evidence on desktop and mobile', async ({ page }) => {
 for (const { slug, evidence, details } of [
  { slug: 'epub-toolkit', evidence: 'Merge record', details: ['epub-worker-handoff', 'epub-path-roundtrip'] },
  { slug: 'originmark', evidence: 'Commit output under the current lease', details: ['originmark-teapot-report', 'originmark-lease-recovery'] },
  { slug: 'personal-agent', evidence: 'Delivery receipt', details: ['agent-run-link', 'agent-report-evidence', 'agent-runtime-trace', 'agent-workflow-data', 'agent-message-transport'] },
 ]) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/projects/${slug}/#architecture`);
  const nav = page.getByRole('navigation', { name: 'Project sections' });
  await expect(nav.getByRole('button')).toHaveAccessibleName(/, Architecture$/);
  const figure = page.locator(`#${slug}-overview`);
  await expect(figure.getByText(evidence, { exact: true })).toBeVisible();
  await expect(figure.locator('figcaption')).not.toBeEmpty();
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(figure.getByText(evidence, { exact: true })).toBeVisible();
  for (const id of details) {
   const detail = page.locator(`figure#${id}`);
   await expect(detail).toBeVisible();
   await expect(detail.locator('figcaption')).not.toBeEmpty();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await jumpToSection(page, 'Trade-offs');
  await expect(page.locator('#decisions').getByRole('heading', { level: 2 })).toBeInViewport();
 }
});

test('technical walkthroughs reveal paths, evidence, and run stages', async ({ page }) => {
 await page.setViewportSize({ width: 1280, height: 900 });
 await page.goto('/projects/epub-toolkit/#implementation');
 const flow = page.locator('.case-flow');
 await flow.getByRole('button', { name: 'Play walkthrough' }).click();
 await expect(flow.getByText('v2/chapters/01.xhtml', { exact: true })).toBeVisible({ timeout: 3800 });
 await flow.getByRole('button', { name: 'Pause', exact: true }).click();
 await expect(flow.getByRole('tab', { name: 'Merge', exact: true })).toHaveAttribute('aria-selected', 'true');
 await page.setViewportSize({ width: 320, height: 750 });
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
 await flow.getByRole('tab', { name: 'Split', exact: true }).click();
 await expect(flow.getByRole('tabpanel', { name: 'Split' })).toContainText('Two independently readable EPUBs');
 const disclosure = page.locator('.case-checks').getByRole('button', { name: 'The archive boundary stays explicit' });
 await disclosure.focus();
 await page.keyboard.press('Enter');
 await expect(disclosure).toHaveAttribute('aria-expanded', 'true');

 await page.emulateMedia({ reducedMotion: 'reduce' });
 await page.goto('/projects/originmark/#implementation');
 await flow.getByRole('tab', { name: 'Verify', exact: true }).click();
 const panel = flow.getByRole('tabpanel', { name: 'Verify' });
 await expect(panel.getByText('Detected', { exact: true })).toBeVisible();
 await expect(panel.getByText('No credential', { exact: true })).toBeVisible();
 await expect(panel.getByText('Not evaluated', { exact: true })).toBeVisible();

 await page.goto('/projects/personal-agent/#agent-runtime-trace');
 const trace = page.locator('#agent-runtime-trace');
 await trace.getByRole('tab', { name: 'Checkpoint', exact: true }).click();
 await expect(trace.getByRole('tabpanel', { name: 'Checkpoint' })).toContainText('summary · evidence · model · usage');
 await trace.getByRole('tab', { name: 'Resume', exact: true }).click();
 await expect(trace.locator('.agent-runtime-map')).toHaveAttribute('data-step', 'resume');
 await expect(trace.getByRole('tabpanel', { name: 'Resume' })).toContainText('next eligible node');
});

test('project detail switches real screens and expands the selected view',async({page})=>{
 await page.goto('/projects/epub-toolkit/');
 await choosePreview(page, 'Inspect');await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-inspect/);await page.getByRole('button',{name:'Expand EPUB Toolkit inspect screenshot'}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog').getByRole('img')).toHaveAttribute('src',/epub-panel-inspect/);await page.keyboard.press('Escape');
 await choosePreview(page, 'Output');await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-output/);
});


test('publication previews share a size and shift from two columns to a single reading column', async ({ page }) => {
 await page.goto('/');
 for (const width of [1440, 1024, 768, 620, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  const portrait = (await page.locator('.ph-portrait').boundingBox())!;
  const column = (await page.locator('.ph-shell').boundingBox())!;
  const tide = (await page.getByTestId('research-card-tide').locator('.ph-preview').boundingBox())!;
  const sasbo = (await page.getByTestId('research-card-sasbo').locator('.ph-preview').boundingBox())!;
  expect(column.width).toBeLessThanOrEqual(816);
  expect(tide.x).toBeCloseTo(portrait.x, 0);
  expect(tide.width).toBeCloseTo(sasbo.width, 0);
  expect(tide.height).toBeCloseTo(sasbo.height, 0);
  expect(tide.height).toBeCloseTo(tide.width * 220 / 416, 0);
  if (width > 624) {
   expect(tide.y).toBeCloseTo(sasbo.y, 0);
   expect(sasbo.x - tide.x - tide.width).toBeGreaterThan(20);
  } else {
   expect(tide.x).toBeCloseTo(sasbo.x, 0);
   expect(sasbo.y).toBeGreaterThan(tide.y + tide.height);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
 }
});

test('the reader switches papers from a deep section and returns to its entry list', async ({ page }) => {
 await page.goto('/');
 await page.getByTestId('research-card-tide').getByRole('link', { name: 'Read the study' }).click();
 await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/#publications');
 await jumpToSection(page, 'Discussion');
 const picker = page.getByRole('button', { name: /switch publication/i });
 await expect(picker).toBeInViewport();
 await picker.focus();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('menuitem', { name: /TIDE/ })).toHaveAttribute('aria-current', 'page');
 await page.keyboard.press('Escape');
 await expect(picker).toBeFocused();
 await picker.click();
 await page.getByRole('menuitem', { name: /SASBO/ }).click();
 await expect(page).toHaveURL(/research\/sasbo\/\?from=home$/);
 await page.getByRole('link', { name: 'Back to home' }).click();
 await expect(page).toHaveURL(/\/#publications$/);
 await expect(page.getByRole('heading', { name: 'Research', exact: true })).toBeInViewport();
 await page.goto('/research/tide/');
 await expect(page.getByRole('group', { name: 'Publication navigation' }).getByRole('link', { name: 'All publications' })).toHaveAttribute('href', '/research/');
});

test('the mobile paper chooser opens from the bottom and keeps the entry route', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 });
 await page.goto('/research/tide/?from=home#discussion');
 const picker = page.getByRole('button', { name: /switch publication/i });
 await picker.click();
 const sheet = page.getByRole('dialog', { name: 'Papers' });
 await expect(sheet).toBeInViewport();
 await expect(sheet.getByRole('link', { name: /TIDE/ })).toHaveAttribute('aria-current', 'page');
 await expect.poll(async () => {
   const bounds = (await sheet.boundingBox())!;
   return Math.abs(844 - (bounds.y + bounds.height));
 }).toBeLessThan(16);
 await page.keyboard.press('Escape');
 await expect(sheet).toBeHidden();
 await expect(picker).toBeFocused();
 await picker.click();
 await sheet.getByRole('link', { name: /SASBO/ }).click();
 await expect(page).toHaveURL(/research\/sasbo\/\?from=home$/);
 await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/#publications');
});

test('product poster stays composed and its interface has inner framing',async({page})=>{
 for(const width of [1440,820,768,620,504,390,320]){
  await page.setViewportSize({width,height:900});await page.goto('/projects/');await page.locator('.product-story').scrollIntoViewIfNeeded();await page.waitForTimeout(500);
  const room=await page.locator('.product-story').evaluate(stage=>{const s=stage.getBoundingClientRect();const frame=stage.querySelector('.poster-workspace')!;const f=frame.getBoundingClientRect();const r=stage.querySelector('.poster-result')!.getBoundingClientRect();return{left:f.left-s.left,right:s.right-f.right,top:f.top-s.top,bottom:s.bottom-f.bottom,resultBottom:s.bottom-r.bottom,padding:parseFloat(getComputedStyle(frame).paddingLeft)};});
  for(const gap of [room.left,room.right,room.top,room.bottom,room.resultBottom])expect(gap).toBeGreaterThanOrEqual(10);expect(room.padding).toBeGreaterThanOrEqual(14);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
 }
});
test('language switch separates names and persists across pages and reloads', async ({ page }) => {
 await page.goto('/');
 await expect(page.getByRole('heading', { level: 1, name: 'Yihan Meng', exact: true })).toBeVisible();
 await page.getByRole('button', { name: 'Switch to Chinese' }).click();
 await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
 await expect(page.getByRole('heading', { level: 1, name: '蒙一涵', exact: true })).toBeVisible();
 await expect(page.locator('.portfolio-home')).not.toContainText('奖学金');

 await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: '简历', exact: true }).click();
 await expect(page).toHaveURL(/\/cv\//);
 await expect(page.getByRole('heading', { level: 1, name: '蒙一涵', exact: true })).toBeVisible();
 await expect(page.locator('.resume-honors')).toContainText('校长奖学金');
 await page.reload();
 await expect(page.locator('html')).toHaveAttribute('lang', 'zh');
 await expect(page.getByRole('heading', { level: 1, name: '蒙一涵', exact: true })).toBeVisible();
 await page.getByRole('button', { name: 'Switch to English' }).click();
 await expect(page.locator('html')).toHaveAttribute('lang', 'en');
 await expect(page.getByRole('heading', { level: 1, name: 'Yihan Meng', exact: true })).toBeVisible();
});
test('navigation responds during loading and remains interruptible',async({page})=>{
 await page.setViewportSize(sizes[0]);
 let release!:()=>void;const gate=new Promise<void>(resolve=>{release=resolve;});
 await page.route(/\/resources(?:[/.?]|$)/,async route=>{await gate;await route.fallback();});
 await page.goto('/research/');await page.evaluate(()=>document.fonts.ready);
 const nav=page.getByRole('navigation',{name:'Main navigation'});const before=(await page.locator('.site-rail [data-slot=segmented-control-indicator]').boundingBox())!;
 await nav.getByRole('link',{name:'Resources',exact:true}).evaluate(link=>{
  link.addEventListener('click',()=>{
   const frames:{t:number;x:number;y:number}[]=[];Object.assign(window,{navigationFrames:frames});const start=performance.now();
   function sample(){const {x,y,width}=document.querySelector('.site-rail [data-slot=segmented-control-indicator]')!.getBoundingClientRect();frames.push({t:performance.now()-start,x:x+width/2,y});if(performance.now()-start<450)requestAnimationFrame(sample);}
   requestAnimationFrame(sample);
  },{once:true});
 });
 await nav.getByRole('link',{name:'Resources',exact:true}).click();await page.waitForTimeout(460);
 await expect(page.getByRole('heading',{level:1,name:'Research',exact:true})).toBeVisible();await expect(nav.getByRole('link',{name:'Resources',exact:true})).toHaveAttribute('data-selected','true');
 const after=(await page.locator('.site-rail [data-slot=segmented-control-indicator]').boundingBox())!;const frames=await page.evaluate(()=>(window as unknown as {navigationFrames:{t:number;x:number;y:number}[]}).navigationFrames);
 expect(Math.max(...frames.map(f=>Math.abs(f.x-(before.x+before.width/2))))).toBeLessThan(1);expect(after.height).toBeGreaterThan(25);
 expect(frames.filter(f=>f.y>before.y+3&&f.y<after.y-3).length).toBeGreaterThan(2);expect(frames.find(f=>f.y>before.y+3)!.t).toBeLessThan(150);
 release();await expect(page).toHaveURL(/\/resources\/$/);await page.unroute(/\/resources(?:[/.?]|$)/);
 for(const name of ['Projects','Writing','CV'])await nav.getByRole('link',{name,exact:true}).click();
 await expect(page).toHaveURL(/\/cv\/$/);await expect(nav.getByRole('link',{name:'CV',exact:true})).toHaveAttribute('aria-current','page');
 await page.goBack();await expect(page).not.toHaveURL(/\/cv\/$/);await expect(nav.locator('[data-selected=true]')).toHaveAttribute('aria-current','page');
});


test('project window resizes continuously as the glass picker changes views',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/projects/epub-toolkit/');await page.locator('.project-demo').scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const preview=page.getByRole('combobox',{name:/^Choose preview,/});
 await preview.click();
 const window=page.locator('.stage-window');const before=await window.boundingBox();
 await page.evaluate(()=>{const samples:number[]=[];(globalThis as unknown as {windowWidths:number[]}).windowWidths=samples;const end=performance.now()+800;function sample(){samples.push(document.querySelector('.stage-window')!.getBoundingClientRect().width);if(performance.now()<end)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
 await page.getByRole('option',{name:'Output',exact:true}).click();await page.waitForTimeout(650);const after=await window.boundingBox();const widths=await page.evaluate(()=>(globalThis as unknown as {windowWidths:number[]}).windowWidths);
 expect(before!.width-after!.width).toBeGreaterThan(100);expect(widths.some(w=>w<before!.width-5&&w>after!.width+5)).toBeTruthy();await expect(page.getByRole('listbox')).toHaveCount(0);
 for(const name of ['Split','Inspect','Merge']){await choosePreview(page,name);await page.waitForTimeout(60);}
 await expect(preview).toHaveAccessibleName('Choose preview, Merge');await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-merge/);await expect(page.locator('.stage-window')).toHaveCount(1);
});
test('continuous viewport resize preserves all preview states and inner margins',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/projects/epub-toolkit/');await choosePreview(page, 'Output');await page.waitForTimeout(600);
 for(const width of [1100,820,801,800,700,621,620,600,480,390,375,620,800,1280]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(45);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.getByRole('combobox',{name:'Choose preview, Output'})).toBeVisible();
  const room=await page.locator('.stage-window').evaluate(frame=>{const box=frame.getBoundingClientRect();const picture=frame.querySelector('[aria-hidden=false]')!.getBoundingClientRect();return{left:picture.left-box.left,right:box.right-picture.right,top:picture.top-box.top,bottom:box.bottom-picture.bottom};});for(const gap of Object.values(room))expect(gap).toBeGreaterThanOrEqual(17);
 }
});


test('SASBO compares the pixel map with pointer and keyboard in a stable frame', async ({ page }) => {
 await page.goto('/');
 const sasbo = page.getByTestId('research-card-sasbo');
 const slider = sasbo.getByRole('slider', { name: 'Drag to compare the image and pixel map' });
 const frame = sasbo.locator('.ph-preview');
 await page.evaluate(() => document.fonts.ready);
 await slider.scrollIntoViewIfNeeded();
 const before = await frame.boundingBox();
 await slider.focus();
 await page.keyboard.press('ArrowLeft');
 await expect(slider).toHaveAttribute('aria-valuenow', '58');
 const handle = (await sasbo.locator('.ph-compare-handle').boundingBox())!;
 expect((handle.x + handle.width / 2 - before!.x) / before!.width).toBeCloseTo(.58, 2);
 await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
 await page.mouse.down();
 await page.mouse.move(handle.x - 54, handle.y + handle.height / 2, { steps: 8 });
 await page.mouse.up();
 expect(Number(await slider.getAttribute('aria-valuenow'))).toBeLessThan(50);
 expect(await frame.boundingBox()).toEqual(before);
});

test('the open image picker uses the displayed photograph and document text stays untreated', async ({ page }) => {
 await page.goto('/research/tide/');
 const trigger = page.getByRole('combobox', { name: /Watermark method/ });
 await trigger.scrollIntoViewIfNeeded();
 await trigger.click();
 const menu = page.locator('.glass-menu[data-photo-glass]');
 await expect(menu.locator('image')).toHaveAttribute('href', /tree-car\.webp$/);
 await page.getByRole('option', { name: 'ROBIN', exact: true }).click();
 await expect(trigger).toHaveAttribute('aria-expanded', 'false');
 await expect(page.getByRole('listbox')).toHaveCount(0);
 await expect(trigger.locator('image')).toHaveAttribute('href', /robin-car\.webp$/);
 const title = page.locator('#method h2').first();
 await title.evaluate(el => window.scrollBy({top: el.getBoundingClientRect().top - 12, behavior: 'instant'}));
 await expect(title).toHaveCSS('filter', 'none');
 await page.goto('/research/');
 await expect(page.getByRole('group', { name: 'Filter research' })).toHaveClass(/inline-segments/);
});

test('increased contrast keeps the photo menu solid and the document unfiltered', async ({ page }) => {
 await page.emulateMedia({ contrast: 'more' });
 await page.goto('/research/tide/#image-comparison');
 await page.getByRole('combobox', { name: /Watermark method/ }).click();
 const menu = page.locator('.glass-menu[data-photo-glass]');
 await expect(menu).toHaveCSS('backdrop-filter', 'none');
 await expect(menu.locator('.lens-scene')).toBeHidden();
 await page.keyboard.press('Escape');
 await page.locator('#method h2').first().evaluate(el => window.scrollBy({top: el.getBoundingClientRect().top-12, behavior: 'instant'}));
 await expect(page.locator('[data-optical-target]')).toHaveCount(0);
});

test('reading rails clear the article, and small windows keep the sticky wrapper transparent', async ({ page }) => {
 await page.goto('/research/tide/#method');
 for (const width of [1440, 1024, 834, 768, 390, 320]) {
   await page.setViewportSize({ width, height: 800 });
   const equation = page.locator('.paper-equation').first();
   await equation.evaluate(el => scrollBy({ top: el.getBoundingClientRect().top - 50, behavior: 'instant' }));
   const eq = (await equation.boundingBox())!;
   const dock = (await page.locator('.reader-dock').boundingBox())!;
   await expect(equation).toHaveCSS('filter', 'none');
   if (width >= 816) {
     const rail = (await page.locator('.site-rail').boundingBox())!;
     expect(rail.x + rail.width).toBeLessThan(eq.x);
     expect(dock.x).toBeGreaterThan(eq.x + eq.width);
     await expect(page.locator('.reader-contents-label')).toBeVisible();
   } else {
     await expect(page.locator('.paper-reader-sticky')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
     expect(dock.y + dock.height).toBeLessThanOrEqual(eq.y + 1);
   }
 }
});

test('preview lenses affect only their own active artwork', async ({ page }) => {
 await page.goto('/');
 const tide = page.locator('.ph-preview--tide');
 await tide.scrollIntoViewIfNeeded();
 await expect(tide.locator('.ph-tide-map')).toHaveAttribute('data-optical-target', '');
 const epub = page.locator('.project-card-cover--epub');
 await epub.scrollIntoViewIfNeeded();
 await epub.getByRole('button', { name: 'Split', exact: true }).click();
 await expect(epub.locator('img[aria-hidden="false"]')).toHaveAttribute('data-optical-target', '');
 await expect(epub.locator('img[aria-hidden="true"]')).not.toHaveAttribute('data-optical-target', '');
 await expect(page.locator('[data-optical-target]:not([data-lens-source])')).toHaveCount(0);
});

test('scrubbing a glass preview commits on release and dragging away cancels', async ({ page }) => {
 await page.goto('/');
 const group = page.getByRole('group', { name: 'Trajectory stages' });
 const frame = page.locator('.ph-preview--tide');
 await group.scrollIntoViewIfNeeded();
 const denoise = group.getByRole('button', { name: 'Denoise' });
 const guide = group.getByRole('button', { name: 'Guide' });
 const start = (await denoise.boundingBox())!, end = (await guide.boundingBox())!;
 const x = end.x + end.width / 2, y = end.y + end.height / 2;
 await denoise.click();
 for (const outside of [true, false]) {
   await page.mouse.move(start.x + start.width / 2, y);
   await page.mouse.down();
   await page.mouse.move(x, y, { steps: 8 });
   await expect(frame).toHaveAttribute('data-stage', 'denoise');
   if (outside) await page.mouse.move(x, y + 80);
   await page.mouse.up();
   await expect(frame).toHaveAttribute('data-stage', outside ? 'denoise' : 'guide');
 }
 await page.emulateMedia({ reducedMotion: 'reduce' });
 await denoise.click();
 const indicator = group.locator('[data-slot="segmented-control-indicator"]');
 await expect.poll(async () => {
   const b = (await indicator.boundingBox())!;
   return Math.abs(b.x - start.x) + Math.abs(b.width - start.width);
 }).toBeLessThan(1);
 await expect(indicator).not.toHaveAttribute('data-lifted', '');
});

test('the first painted indicator is aligned and an edge grab follows the drag direction', async ({ page }) => {
 await page.addInitScript(() => {
   function observe() {
     const group = document.querySelector('.ph-tide-segments');
     const thumb = group?.querySelector<HTMLElement>('[data-slot="segmented-control-indicator"]');
     const active = group?.querySelector('[aria-pressed=true]');
     if (!thumb || thumb.hidden || !active) { requestAnimationFrame(observe); return; }
     const a = active.getBoundingClientRect(), b = thumb.getBoundingClientRect();
     document.documentElement.dataset.firstIndicatorError = String(Math.abs((a.x + a.width / 2) - (b.x + b.width / 2)));
   }
   requestAnimationFrame(observe);
 });
 await page.goto('/');
 await expect.poll(async () => Number(await page.locator('html').getAttribute('data-first-indicator-error') ?? 'Infinity')).toBeLessThan(1);
 const group = page.locator('.ph-tide-segments'), inject = group.getByRole('button', {name:'Inject'}), thumb = group.locator('[data-slot="segmented-control-indicator"]');
 await inject.click();
 const item = (await inject.boundingBox())!;
 const center = async () => {const box = (await thumb.boundingBox())!; return box.x + box.width / 2;};
 await expect.poll(async () => Math.abs(await center() - item.x - item.width/2)).toBeLessThan(.5);
 await page.mouse.move(item.x + 3, item.y + item.height/2);
 await page.mouse.down();
 await page.mouse.move(item.x + 11, item.y + item.height/2, {steps:2});
 await expect.poll(center).toBeGreaterThan(item.x + item.width/2 + 5);
 await page.mouse.up();
});

test('mobile project navigation keeps its glass within the control and remembers both preferences', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 });
 await page.emulateMedia({ colorScheme: 'dark' });
 await page.goto('/projects/personal-agent/');
 const contents = page.locator('.case-contents');
 const width = (await contents.getByRole('button').boundingBox())!.width;
 await expect(contents).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
 expect((await contents.boundingBox())!.width).toBeCloseTo(width, 0);
 await page.getByRole('button', { name: 'Open navigation' }).click();
 const sheet = page.getByRole('dialog');
 await sheet.getByRole('combobox', { name: 'Language' }).selectOption('zh');
 await sheet.getByRole('combobox', { name: '外观' }).selectOption('light');
 await expect(page.locator('html')).toHaveClass(/light/);
 await sheet.getByRole('combobox', { name: '外观' }).selectOption('system');
 await expect(page.locator('html')).toHaveClass(/dark/);
 await page.reload();
 await page.getByRole('button', { name: '打开导航' }).click();
 await expect(sheet.getByRole('combobox', { name: '语言' })).toHaveValue('zh');
 await expect(sheet.getByRole('combobox', { name: '外观' })).toHaveValue('system');
 await sheet.getByRole('link', { name: '写作' }).click();
 await expect(page).toHaveURL(/\/writing\//);
 await expect(sheet).toHaveCount(0);
});
