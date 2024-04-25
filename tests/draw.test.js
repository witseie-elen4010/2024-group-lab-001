import { test, expect } from '@playwright/test';


test('Ensure the title of the drawing page is visible', async ({ page }) => {
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByRole('heading', { name: 'Miscommunication Mayhem' })).toBeVisible();
});

test('Ensure the canvas of the drawing page is visible', async ({ page }) => {
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#drawing-canvas')).toBeVisible();
});