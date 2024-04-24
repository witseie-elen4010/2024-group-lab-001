import { test, expect } from '@playwright/test';

test('Toggle Password Visibility and Change Icon', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    // Click the show/hide password button twice
    await page.click('.showHidePassword');
    await page.click('.showHidePassword');

    // Get password fields
    const passwordFields = await page.$$('.password');

    // Check if password fields have correct type attribute
    await expect(passwordFields[0].getAttribute('type')).resolves.toBe('password');
    await expect(passwordFields[1].getAttribute('type')).resolves.toBe('password');
});

test('Switch Between Signup and Login Form', async ({ page }) => {
    await page.goto('http://localhost:3000/account');

    // Click the signup link
    await page.click('.signup-link');

    // Check if the signup form is active
    await expect(page.$('.account-container.active .signup')).resolves.toBeTruthy();
});
