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
