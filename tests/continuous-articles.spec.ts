import { test, expect } from './fixtures';
import { papers, projects } from '../src/lib/content';

for (const language of ['en', 'zh'] as const) {
  test(`all six articles read continuously in ${language}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const renderErrors: string[] = [];
    page.on('pageerror', error => renderErrors.push(error.message));
    await page.addInitScript(lang => localStorage.setItem('homepage-language', lang), language);
    for (const entry of [...papers, ...projects]) {
      const paper = 'abstract' in entry;
      await page.goto(`/${paper ? 'research' : 'projects'}/${entry.slug}/`);
      await expect(page.locator('html')).toHaveAttribute('lang', language);
      const article = page.locator(paper ? '.editorial-paper' : '.project-detail');
      await expect(article.locator('details, [data-slot="accordion"], [data-slot="collapsible"]')).toHaveCount(0);

      if (paper) {
        const order = ['h1', '.tide-byline', '.tide-affiliations', '.tide-venue', '.tide-paper-actions', '#abstract', '#overview', '#method', '#examples', '#discussion', '#citation'];
        let previous = -1;
        for (const selector of order) {
          const node = article.locator(selector);
          await expect(node).toBeVisible();
          const position = await node.evaluate(el => Array.from(el.closest('article')!.querySelectorAll('*')).indexOf(el));
          expect(position, entry.shortTitle + ' ' + selector).toBeGreaterThan(previous);
          previous = position;
        }
        await expect(article.locator('#abstract p[lang="en"]')).toHaveText(entry.abstract);
      } else {
        const sections = article.locator('.case-section');
        expect(await sections.count()).toBeGreaterThan(2);
        for (const section of await sections.all()) {
          await expect(section.getByRole('heading', { level: 2 })).toBeVisible();
        }
      }
    }
    expect(renderErrors).toEqual([]);
  });
}

test('SASBO distinguishes coordinate counts from attack success rates', async ({ page }) => {
  await page.goto('/research/sasbo/');
  const chart = page.locator('.comparison-chart').filter({ hasText: 'Coordinate cost at equal success' });
  await expect(chart.locator('.comparison-axis')).not.toContainText('%');
  await expect(chart.locator('.comparison-value').first()).toBeVisible();
  for (const value of await chart.locator('.comparison-value').all()) {
    await expect(value).not.toContainText('%');
  }
  const table = page.getByRole('table', { name: /Tables 1 and 3/ });
  await expect(table.getByRole('row', { name: /SASBO/ })).toContainText('14.88');
});
