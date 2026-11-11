import { test, expect } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const sizes = [
  { width: 1440, height: 900 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];
const routes = [
  '/',
  '/research/',
  '/research/tide/',
  '/research/sasbo/',
  '/research/sparse-meta-learning/',
  '/projects/',
  '/projects/epub-toolkit/',
  '/writing/',
  '/resources/',
  '/cv/',
];
const wcag = ['wcag2a', 'wcag2aa', 'wcag21aa'];

for (const viewport of sizes) {
  test(`pages fit the viewport and load their images at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize(viewport);
    await fs.mkdir('docs/qa/screenshots', { recursive: true });
    for (const route of routes) {
      await page.goto(route);
      await page.locator('h1').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflows`).toBeTruthy();
      const broken = await page.locator('img').evaluateAll(images =>
        images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0 && image.loading !== 'lazy').map(image => image.getAttribute('src')),
      );
      expect(broken, `${route} has broken images`).toEqual([]);
      const slug = route === '/' ? 'home' : route.split('/').filter(Boolean).join('-');
      await page.screenshot({ path: `docs/qa/screenshots/${slug}-${viewport.width}x${viewport.height}.png`, fullPage: true });
    }
  });
}

test('home states identity, field and profile links in the first desktop viewport', async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Yihan Meng');
  await expect(page.locator('.hero-statement')).toContainText('diffusion models');
  const plate = await page.locator('.hero-plate-art').boundingBox();
  expect(plate!.y).toBeLessThan(900);
  await expect(page.getByRole('link', { name: 'Scholar', exact: true })).toHaveAttribute('href', /sMZ0X6sAAAAJ/);
  await expect(page.getByRole('link', { name: 'GitHub', exact: true }).first()).toHaveAttribute('href', 'https://github.com/yumizhi');
});

test('home trajectory plate shows the pointed-at denoising step', async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await page.goto('/');
  const plate = page.locator('.hero-plate-art');
  const box = (await plate.boundingBox())!;
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height / 2);
  await expect(page.locator('.hero-lens-label')).toContainText('Step 11 / 50');
  await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2);
  await expect(page.locator('.hero-lens-label')).toContainText('Step 46 / 50');
  await expect(page.locator('.hero-lens')).toHaveAttribute('data-marked', 'true');
  await page.mouse.move(1, 1);
  await expect(page.locator('.hero-lens')).toHaveCount(0);
});

test('home links to all three research articles and the project', async ({ page }) => {
  await page.goto('/');
  for (const slug of ['tide', 'sasbo', 'sparse-meta-learning']) {
    await expect(page.locator(`h3 a[href$="/research/${slug}/"]`)).toBeVisible();
  }
  await page.locator('h3 a[href$="/projects/epub-toolkit/"]').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('EPUB Toolkit');
});

test('research index filters, searches and recovers from an empty result', async ({ page }) => {
  await page.goto('/research/');
  await expect(page.locator('.publication')).toHaveCount(3);
  await page.getByRole('radio', { name: 'Watermarking', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('1 publication');
  await page.getByRole('radio', { name: 'All', exact: true }).click();
  await page.getByRole('searchbox', { name: 'Search research' }).fill('unfindable');
  await expect(page.getByText('No matching publications')).toBeVisible();
  await page.getByRole('button', { name: 'Show all publications' }).click();
  await expect(page.locator('.publication')).toHaveCount(3);
});

test('TIDE trajectory explorer scrubs, plays and pauses', async ({ page }) => {
  await page.goto('/research/tide/');
  const figure = page.locator('#figure-1');
  await figure.scrollIntoViewIfNeeded();
  const slider = figure.getByRole('slider', { name: 'Denoising step' });
  await slider.fill('20');
  await expect(slider).toHaveAttribute('aria-valuetext', 'Step 20 of 50');
  await slider.fill('50');
  await figure.getByRole('button', { name: 'Replay sampling' }).click();
  await expect(figure.getByRole('button', { name: 'Pause' })).toBeVisible();
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(1);
  await figure.getByRole('button', { name: 'Pause' }).click();
  const paused = await slider.inputValue();
  await page.waitForTimeout(500);
  expect(await slider.inputValue()).toBe(paused);
});

test('TIDE guidance diagram and injection-step explorer respond to input', async ({ page }) => {
  await page.goto('/research/tide/');
  const lab = page.locator('.guidance-lab');
  await lab.scrollIntoViewIfNeeded();
  const before = await lab.locator('.guidance-output').innerText();
  await lab.getByRole('slider', { name: /Overlap with the text subspace/ }).fill('0.9');
  await expect(lab.locator('.guidance-output')).not.toHaveText(before);
  await lab.getByRole('tab', { name: 'Values from the recorded run' }).click();
  await expect(lab.getByRole('slider', { name: /Denoising step/ })).toBeVisible();

  const steps = page.getByRole('radiogroup', { name: 'Injection step' });
  await steps.scrollIntoViewIfNeeded();
  await expect(steps.getByRole('radio', { name: 'Step 35' })).toBeChecked();
  await steps.getByRole('radio', { name: 'Step 45' }).click();
  await expect(steps.getByRole('radio', { name: 'Step 45' })).toBeChecked();
  await expect(page.locator('.step-explorer')).toContainText('0.645');
});

test('TIDE article has contents navigation, paper link and a working BibTeX copy', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize(sizes[0]);
  await page.goto('/research/tide/');
  await page.getByRole('navigation', { name: 'Table of contents' }).getByRole('link', { name: /Results/ }).click();
  await expect(page).toHaveURL(/#results$/);
  await expect(page.getByRole('link', { name: 'Paper', exact: true })).toHaveAttribute('href', /tide-neurips-2026\.pdf$/);
  await page.getByRole('button', { name: 'Copy BibTeX' }).click();
  await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('meng2026tide');
});

test('SASBO and meta-learning figures are interactive', async ({ page }) => {
  await page.goto('/research/sasbo/');
  await page.getByRole('button', { name: /Blink/ }).click();
  await expect(page.getByRole('button', { name: 'Stop blinking' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Stop blinking' }).click();
  await page.getByRole('tab', { name: 'CIFAR-10 · targeted' }).click();
  await expect(page.locator('.l0-table')).toContainText('14.88');
  await page.getByRole('tab', { name: 'ε = 10', exact: true }).click();
  await expect(page.locator('.l0-table')).toContainText('324.14');
  const budget = page.getByRole('slider', { name: /Pixel budget/ });
  await budget.fill('20');
  await expect(page.locator('.mask-panel').nth(2)).toContainText('20');

  await page.goto('/research/sparse-meta-learning/');
  await expect(page.locator('.task-model[data-role="query"]')).toHaveCount(1);
  const first = await page.locator('.task-model[data-role="query"]').innerText();
  await page.getByRole('button', { name: 'Sample next task' }).click();
  await expect(page.locator('.task-model[data-role="query"]')).not.toHaveText(first);
  await page.getByRole('tab', { name: /300 pixels/ }).click();
  await expect(page.locator('.transfer-chart')).toContainText('48.2');
});

test('language switch translates the page and persists', async ({ page }) => {
  await page.goto('/research/tide/');
  await page.getByRole('button', { name: 'Switch to Chinese' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-site-language', 'zh');
  await expect(page.getByRole('heading', { name: '实验结果' })).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('蒙一涵');
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Yihan Meng');
});

test('command search supports keyboard selection and Escape', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox').fill('TIDE');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/research\/tide\//);
  await page.getByRole('button', { name: 'Search site' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('theme persists and the dark homepage stays accessible', async ({ page }) => {
  await page.setViewportSize(sizes[0]);
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  const results = await new AxeBuilder({ page }).withTags(wcag).analyze();
  expect(results.violations).toEqual([]);
});

test('mobile navigation opens and navigates', async ({ page }) => {
  await page.setViewportSize(sizes[2]);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Research');
});

test('resource preview has open and download actions and a useful empty category', async ({ page }) => {
  await page.goto('/resources/');
  await page.getByRole('button', { name: 'Preview TIDE — NeurIPS 2026', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: /Open PDF/ })).toHaveAttribute('href', /tide-neurips-2026\.pdf$/);
  await expect(dialog.getByRole('link', { name: /Download/ })).toHaveAttribute('download', '');
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await page.getByRole('radio', { name: 'Posters', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'No posters published yet' })).toBeVisible();
});

test('project page switches screenshots and opens the lightbox', async ({ page }) => {
  await page.goto('/projects/epub-toolkit/');
  await page.getByRole('tab', { name: 'Split' }).click();
  await expect(page.locator('.stage-capture img[alt]:not([alt=""])')).toHaveAttribute('src', /split/);
  await page.getByRole('button', { name: /^Expand/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: 'Close screenshot' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('reduced motion stops autoplay and entrance animation but keeps controls', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/research/tide/');
  await expect(page.locator('.tide-banner-art img').first()).toHaveCSS('animation-name', 'none');
  const figure = page.locator('#figure-1');
  await figure.scrollIntoViewIfNeeded();
  const slider = figure.getByRole('slider', { name: 'Denoising step' });
  const start = await slider.inputValue();
  await page.waitForTimeout(700);
  expect(await slider.inputValue()).toBe(start);
  await slider.fill('12');
  await expect(slider).toHaveAttribute('aria-valuetext', 'Step 12 of 50');
});

for (const route of routes) {
  test(`accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    await page.locator('h1').first().waitFor();
    const results = await new AxeBuilder({ page }).withTags(wcag).analyze();
    expect(results.violations.map(violation => `${violation.id}: ${violation.nodes.map(node => node.target).join(' | ')}`)).toEqual([]);
  });
}

test('old links and the static 404 resolve', async ({ page }) => {
  await page.goto('/about.html');
  await expect(page).toHaveURL(/\/cv\//);
  await page.goto('/#/research/tide');
  await expect(page).toHaveURL(/\/research\/tide/);
  const response = await page.goto('/this-page-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByText('This address has no page.')).toBeVisible();
});

test('layout shift on the homepage stays low', async ({ page }) => {
  await page.addInitScript(() => {
    const metrics = { cls: 0 };
    (window as unknown as { labMetrics: typeof metrics }).labMetrics = metrics;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!(entry as PerformanceEntry & { hadRecentInput?: boolean }).hadRecentInput) metrics.cls += (entry as PerformanceEntry & { value: number }).value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.setViewportSize(sizes[0]);
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);
  const metrics = await page.evaluate(() => (window as unknown as { labMetrics: { cls: number } }).labMetrics);
  expect(metrics.cls).toBeLessThan(0.1);
});
