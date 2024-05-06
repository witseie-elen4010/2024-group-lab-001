import { test, expect } from '@playwright/test';

test('Signup fields can be filled', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    // Click the signup link
    await page.getByRole('link', { name: 'Signup Now' }).click();
    
    // Fill the signup fields with test data
    await page.fill('input[placeholder="Enter your email address"]', 'alex@minecraft.test');
    await page.fill('input[placeholder="Create a username"]', 'alex');
    await page.fill('input[placeholder="Create a password"]', 'alexalex');
    await page.fill('input[placeholder="Confirm a password"]', 'alexalex');
});

test('Login redirects user to lobby', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    await page.fill('input[placeholder="Enter your email"]', 'alex@minecraft.test');
    await page.fill('input[placeholder="Enter your password"]', 'alexalex');
    await page.getByRole('button', { name: 'Login' }).click();

    expect(page.url()).toContain('/lobby');
});

test('Guest username field can be filled', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    // Click the signup link
    await page.getByRole('link', { name: 'Continue as a Guest' }).click();
    
    // Fill the signup fields with test data
    await page.fill('input[placeholder="Enter temporary username"]', 'alex');
});

test('Login as guest redirects player to lobby', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    // Click the signup link
    await page.getByRole('link', { name: 'Continue as a Guest' }).click();
    
    // Fill the signup fields with test data
    await page.fill('input[placeholder="Enter temporary username"]', 'alex');

    await page.getByRole('button', { name: 'Continue as Guest' }).click();
    expect(page.url()).toContain('/lobby');
});