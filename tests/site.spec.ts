import {test,expect} from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const sizes=[{width:1440,height:900},{width:1280,height:800},{width:768,height:1024},{width:390,height:844},{width:375,height:812}];
for(const viewport of sizes){test(`responsive pages ${viewport.width}x${viewport.height}`,async({page})=>{
 await page.setViewportSize(viewport);
 for(const route of ['/','/research/','/research/tide/','/projects/','/projects/epub-toolkit/','/writing/','/writing/keeping-a-research-homepage/','/resources/','/cv/']){
  await page.goto(route);await page.locator('h1').waitFor();await page.evaluate(()=>document.fonts.ready);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
  const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i instanceof HTMLImageElement&&i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')));expect(broken).toEqual([]);
  const slug=route==='/'?'home':route.split('/').filter(Boolean).join('-');
  await fs.mkdir('docs/qa/screenshots',{recursive:true});await page.screenshot({path:`docs/qa/screenshots/${slug}-${viewport.width}x${viewport.height}.png`,fullPage:true});
 }
});}
test('home conveys identity and research in the first desktop viewport',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/');
 await expect(page.getByRole('heading',{level:1})).toContainText('Yihan Meng');
 const caption=page.getByTestId('research-card-tide').locator('h3');const box=await caption.boundingBox();expect(box!.y+box!.height).toBeLessThan(900);
 await expect(page.getByRole('link',{name:'Scholar',exact:true})).toHaveAttribute('href',/sMZ0X6sAAAAJ/);
});
test('research card reveals locally, reverses, and has keyboard parity',async({page})=>{
 await page.setViewportSize(sizes[0]);await page.goto('/');await page.evaluate(()=>document.fonts.ready);const card=page.getByTestId('research-card-tide');const cover=card.locator('.research-image');await cover.scrollIntoViewIfNeeded();const before=await cover.boundingBox();
 await card.hover();await expect(card.locator('.research-reveal')).toHaveCSS('opacity','1');expect(await cover.boundingBox()).toEqual(before);
 await page.mouse.move(1,1);await expect(card.locator('.research-reveal')).toHaveCSS('opacity','0');
 await card.getByRole('link',{name:'Paper',exact:true}).focus();await expect(card.locator('.research-reveal')).toHaveCSS('opacity','1');
 await card.getByRole('link',{name:'Details',exact:true}).click();await expect(page).toHaveURL(/\/research\/tide\//);await expect(page.getByRole('heading',{level:1})).toContainText('TIDE');
});
test('research filters, search, empty state, and compact list',async({page})=>{
 await page.goto('/research/');await page.getByRole('button',{name:'Watermarking',exact:true}).click();await expect(page.getByRole('status')).toHaveText('1 publication');await expect(page.getByTestId('research-card-sasbo')).toHaveCount(0);
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
test('touch navigation, card summary, and direct details',async({page})=>{
 await page.setViewportSize(sizes[3]);await page.goto('/');await page.getByRole('button',{name:'About TIDE',exact:true}).click();await expect(page.getByTestId('research-card-tide').locator('.research-reveal')).toHaveCSS('opacity','1');
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('navigation',{name:'Mobile navigation'}).getByRole('link',{name:'Research',exact:true}).click();await expect(page).toHaveURL(/\/research\//);await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('paper abstract expands and BibTeX copies',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/research/tide/');await page.getByRole('button',{name:'Abstract',exact:true}).click();await expect(page.locator('#paper-abstract')).toHaveCount(0);await page.getByRole('button',{name:'Abstract',exact:true}).click();await expect(page.locator('#paper-abstract')).toBeVisible();
 await page.getByRole('button',{name:'Copy BibTeX'}).first().click();await expect(page.getByRole('button',{name:'Copied',exact:true}).first()).toBeVisible();
 expect(await page.evaluate(()=>navigator.clipboard.readText())).toContain('meng2026tide');
});
test('resource preview has native open/download and useful empty category',async({page})=>{
 await page.goto('/resources/');await page.getByRole('button',{name:'Preview TIDE — NeurIPS 2026',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();await expect(dialog.getByRole('link',{name:'Open PDF'})).toHaveAttribute('href',/tide-neurips-2026.pdf/);await expect(dialog.getByRole('link',{name:'Download',exact:true})).toHaveAttribute('download','');
 await dialog.getByRole('button',{name:'Close',exact:true}).click();await page.getByRole('button',{name:'Posters',exact:true}).click();await expect(page.getByRole('heading',{name:'No posters published yet'})).toBeVisible();
});
test('MDX reader renders code, math, anchors and progress',async({page})=>{
 await page.goto('/writing/keeping-a-research-homepage/');await expect(page.locator('.katex').first()).toBeVisible();await expect(page.locator('pre code')).toContainText('const work');await page.getByRole('navigation',{name:'Table of contents'}).getByRole('link',{name:'Keep the source close'}).click();await expect(page).toHaveURL(/#keep-the-source-close$/);await page.locator('#make-room-for-revision').scrollIntoViewIfNeeded();expect(await page.locator('.reading-progress').evaluate(el=>getComputedStyle(el).transform)).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
});
test('project gallery changes the actual screenshot',async({page})=>{
 await page.goto('/projects/epub-toolkit/');await page.getByRole('button',{name:'Show empty state screenshot'}).click();await expect(page.locator('.gallery-main img')).toHaveAttribute('src',/epub-empty/);
});
test('reduced motion preserves card and navigation functions',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const card=page.getByTestId('research-card-tide');await card.hover();await expect(card.locator('.research-art')).toHaveCSS('transform','none');await card.getByRole('link',{name:'Details',exact:true}).click();await expect(page).toHaveURL(/\/research\/tide\//);
});
for(const route of ['/','/research/','/research/tide/','/projects/epub-toolkit/','/writing/keeping-a-research-homepage/','/resources/','/cv/'])test(`accessibility ${route}`,async({page})=>{
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
 await fs.writeFile('docs/qa/lab-performance.json',JSON.stringify({environment:'Local static export fixture, desktop, unthrottled. Not a field Core Web Vitals score.',viewport:sizes[0],...metrics},null,2));expect(metrics.cls).toBeLessThan(.1);
});
