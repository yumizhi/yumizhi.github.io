import {test,expect} from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
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
test('paper abstract is readable and BibTeX copies',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/research/tide/');await expect(page.locator('#abstract')).toContainText('Watermarking text-to-image diffusion models');
 await page.getByRole('button',{name:'Copy BibTeX'}).first().click();await expect(page.getByRole('button',{name:'Copied',exact:true}).first()).toBeVisible();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('meng2026tide');
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
 await page.goto('/projects/epub-toolkit/');await page.getByRole('tab',{name:'Inspect',exact:true}).click();await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-inspect/);
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

test('project showcases work on mobile and only public software links to source', async ({ page }) => {
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
  await expect(detail.locator('a[href*="github.com"]')).toHaveCount(0);
  if (project.slug === 'personal-agent') {
   await expect(detail.getByRole('tab', { name: 'Chat', exact: true })).toHaveAttribute('aria-selected', 'true');
   await detail.getByRole('tab', { name: 'Assistants', exact: true }).click();
   await expect(detail.locator('.stage-capture[aria-hidden="false"] img')).toHaveAttribute('src', /personal-agent-assistants/);
  }
  await detail.getByRole('tablist', { name: `${project.title} screenshots` }).getByRole('tab', { name: project.tab, exact: true }).click();
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
 await sections.getByRole('link', { name: 'Design' }).click();
 await expect(page).toHaveURL(/#design$/);
 await expect(page.locator('#design').getByRole('heading', { level: 2 })).toBeInViewport();
 await sections.getByRole('link', { name: 'Implementation' }).click();
 await expect(page).toHaveURL(/#implementation$/);
 await expect(sections.getByRole('link', { name: 'Implementation' })).toHaveAttribute('aria-current', 'location');
 const flow = page.getByRole('tablist', { name: 'The scheduled inspection example' });
 const plan = flow.getByRole('tab', { name: 'Plan', exact: true });
 await expect(plan).toHaveAttribute('aria-selected', 'true');
 await plan.focus();
 await page.keyboard.press('ArrowRight');
 const execute = flow.getByRole('tab', { name: 'Execute', exact: true });
 await expect(execute).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.getByRole('tabpanel', { name: 'Execute', exact: true })).toContainText('Application run, steps and approval state');
 await sections.getByRole('link', { name: 'Validation' }).click();
 await expect(page.locator('#verification')).toContainText('web-inbox receipt');
 await expect(sections.getByRole('link', { name: 'Validation' })).toHaveAttribute('aria-current', 'location');
 await page.getByRole('navigation', { name: 'Other projects' }).getByRole('link', { name: 'OriginMark' }).click();
 await expect(page.locator('#implementation').getByRole('link', { name: /TIDE/ })).toHaveAttribute('href', '/research/tide/');
 await page.goto('/projects/epub-toolkit/#implementation');
 await expect(page.locator('.epub-merge-record')).toBeVisible();
 expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('project architecture figures preserve their evidence on desktop and mobile', async ({ page }) => {
 for (const { slug, evidence } of [
  { slug: 'epub-toolkit', evidence: 'Merge record' },
  { slug: 'originmark', evidence: 'Commit output under the current lease' },
  { slug: 'personal-agent', evidence: 'Delivery receipt' },
 ]) {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/projects/${slug}/#architecture`);
  const nav = page.getByRole('navigation', { name: 'Project sections' });
  await expect(nav.getByRole('link', { name: 'Architecture', exact: true })).toHaveAttribute('aria-current', 'location');
  const figure = page.locator('#architecture figure');
  await expect(figure.getByText(evidence, { exact: true })).toBeVisible();
  await expect(figure.locator('figcaption')).not.toBeEmpty();
  await page.setViewportSize({ width: 320, height: 740 });
  await expect(figure.getByText(evidence, { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await nav.getByRole('link', { name: 'Trade-offs' }).click();
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

 await page.goto('/projects/personal-agent/#implementation');
 await flow.getByRole('tab', { name: 'Execute', exact: true }).click();
 await expect(flow.getByRole('tabpanel', { name: 'Execute' }).getByText('Generate the report', { exact: true })).toBeVisible();
});

test('project detail switches real screens and expands the selected view',async({page})=>{
 await page.goto('/projects/epub-toolkit/');
 await page.getByRole('tab',{name:'Inspect',exact:true}).click();await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-inspect/);await page.getByRole('button',{name:'Expand EPUB Toolkit inspect screenshot'}).click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog').getByRole('img')).toHaveAttribute('src',/epub-panel-inspect/);await page.keyboard.press('Escape');
 await page.getByRole('tab',{name:'Output',exact:true}).click();await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-output/);
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
 await page.getByRole('link', { name: 'Discussion', exact: true }).click();
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
 const nav=page.getByRole('navigation',{name:'Main navigation'});const before=(await page.locator('.nav-active').boundingBox())!;
 await nav.getByRole('link',{name:'Resources',exact:true}).evaluate(link=>{
  link.addEventListener('click',()=>{
   const frames:{t:number;x:number}[]=[];Object.assign(window,{navigationFrames:frames});const start=performance.now();
   function sample(){frames.push({t:performance.now()-start,x:document.querySelector('.nav-active')!.getBoundingClientRect().x});if(performance.now()-start<450)requestAnimationFrame(sample);}
   requestAnimationFrame(sample);
  },{once:true});
 });
 await nav.getByRole('link',{name:'Resources',exact:true}).click();await page.waitForTimeout(460);
 await expect(page.getByRole('heading',{level:1,name:'Research',exact:true})).toBeVisible();await expect(nav.getByRole('link',{name:'Resources',exact:true})).toHaveAttribute('data-selected','true');
 const after=(await page.locator('.nav-active').boundingBox())!;const frames=await page.evaluate(()=>(window as unknown as {navigationFrames:{t:number;x:number}[]}).navigationFrames);
 expect(frames.filter(f=>f.x>before.x+3&&f.x<after.x-3).length).toBeGreaterThan(2);expect(frames.find(f=>f.x>before.x+3)!.t).toBeLessThan(150);
 release();await expect(page).toHaveURL(/\/resources\/$/);await page.unroute(/\/resources(?:[/.?]|$)/);
 for(const name of ['Projects','Writing','CV'])await nav.getByRole('link',{name,exact:true}).click();
 await expect(page).toHaveURL(/\/cv\/$/);await expect(nav.getByRole('link',{name:'CV',exact:true})).toHaveAttribute('aria-current','page');
 await page.goBack();await expect(page).not.toHaveURL(/\/cv\/$/);await expect(nav.locator('[data-selected=true]')).toHaveAttribute('aria-current','page');
});


test('project window and tab indicator move continuously and accept rapid changes',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/projects/epub-toolkit/');await page.locator('.project-demo').scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(300);
 const preview=page.getByRole('tablist',{name:'EPUB Toolkit screenshots'});
 const window=page.locator('.stage-window');const before=await window.boundingBox();
 await page.evaluate(()=>{const samples:number[]=[];(globalThis as unknown as {windowWidths:number[]}).windowWidths=samples;const end=performance.now()+800;function sample(){samples.push(document.querySelector('.stage-window')!.getBoundingClientRect().width);if(performance.now()<end)requestAnimationFrame(sample);}requestAnimationFrame(sample);});
 await preview.getByRole('tab',{name:'Output',exact:true}).click();await page.waitForTimeout(650);const after=await window.boundingBox();const widths=await page.evaluate(()=>(globalThis as unknown as {windowWidths:number[]}).windowWidths);
 expect(before!.width-after!.width).toBeGreaterThan(100);expect(widths.some(w=>w<before!.width-5&&w>after!.width+5)).toBeTruthy();await expect(page.locator('.preview-tab-highlight')).toHaveCount(1);
 for(const name of ['Split','Inspect','Merge']){await preview.getByRole('tab',{name,exact:true}).click();await page.waitForTimeout(60);}
 await expect(preview.getByRole('tab',{name:'Merge',exact:true})).toHaveAttribute('data-state','active');await expect(page.locator('.stage-capture[aria-hidden=false] img')).toHaveAttribute('src',/epub-panel-merge/);await expect(page.locator('.stage-window')).toHaveCount(1);
});
test('continuous viewport resize preserves all preview states and inner margins',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/projects/epub-toolkit/');await page.getByRole('tab',{name:'Output',exact:true}).click();await page.waitForTimeout(600);
 for(const width of [1100,820,801,800,700,621,620,600,480,390,375,620,800,1280]){
  await page.setViewportSize({width,height:900});await page.waitForTimeout(45);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await expect(page.getByRole('tab',{name:'Output',exact:true})).toHaveAttribute('data-state','active');
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
