import { test, expect } from '@playwright/test';

test('Navigate to HOME and then to ACCOUNT', async ({ page }) => {
    // Navigate to the homepage
    await page.goto('http://localhost:3000/');
    // Click on the HOME link
    await page.click('text=HOME');
    // Check if the URL contains '/'
    expect(page.url()).toContain('/');
    
    // Click on the ACCOUNT link
    await page.click('text=ACCOUNT');
    // Check if the URL contains '/account'
    expect(page.url()).toContain('/account');
});

test('Cookie Bar and Accepting Cookies Warning', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.waitForSelector('text=This website uses cookies to');
    await page.click('text=This website uses cookies to');
    await page.waitForSelector('button:has-text("Accept")');
    await page.click('button:has-text("Accept")');
});
