import { test, expect } from '@playwright/test';

test('Signup fields can be filled', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    // Click the signup link
    await page.click('.signup-link')
    // Check if the signup form is active
    await expect(page.$('.account-container.active .signup')).resolves.toBeTruthy();
    // Fill the signup fields with test data
    await page.fill('input[placeholder="Enter your email address"]', 'alex@minecraft.test');
    await page.fill('input[placeholder="Create a username"]', 'alex');
    await page.fill('input[placeholder="Create a password"]', 'alexalex');
    await page.fill('input[placeholder="Confirm a password"]', 'alexalex');
});

test('Login redirects user to lobby', async ({ page }) => {
    await page.goto('http://localhost:3000/account');
    // Check if the signup form is active
    //await expect(page.$('.account-container.active .login')).resolves.toBeTruthy();
    // Fill the signup fields with test data
    await page.fill('input[placeholder="Enter your username"]', 'alex@minecraft.test');
    await page.fill('input[placeholder="Enter your password"]', 'alexalex');
    await page.getByRole('button', { name: 'Login' }).click();

    expect(page.url()).toContain('/lobby');
});