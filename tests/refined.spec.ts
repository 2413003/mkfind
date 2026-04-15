import { test } from '@playwright/test';

test('refined desktop view', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/refined_desktop.png' });
});

test('refined mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:5174');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/refined_mobile.png' });

  // Test drawer close
  await page.click('button:has(svg.lucide-x)');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/refined_mobile_map.png' });
});

test('refined form view', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await page.click('button:has(svg.lucide-plus)');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/refined_form.png' });
});
