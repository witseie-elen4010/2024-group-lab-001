import { test, expect } from '@playwright/test';

test('Test Login and Signup flows', async ({ page }) => {
  await page.goto('http://localhost:3000/account');
  
  // Test login flow
  await page.getByPlaceholder('Enter your email', { exact: true }).click();
  await page.getByPlaceholder('Enter your email', { exact: true }).fill('email');
  await page.getByPlaceholder('Enter your password').fill('12345678');
  await page.locator('form').filter({ hasText: 'Login' }).locator('i').nth(2).click();
  await page.locator('form').filter({ hasText: 'Login' }).locator('i').nth(2).click();
  
  // Test guest login flow
  await page.getByRole('link', { name: 'Continue as a Guest' }).click();
  await page.getByText('Guest Login Continue as').click();
  
  // Test signup flow
  await page.getByRole('link', { name: 'Login Now' }).click();
  await page.getByText('Login Login Don\'t want to').click();
  await page.getByRole('link', { name: 'Signup Now' }).click();
  await page.getByPlaceholder('Enter your email address').click();
  await page.getByPlaceholder('Create a username').click();
  await page.getByPlaceholder('Create a password').click();
  await page.getByPlaceholder('Confirm a password').click();
  await page.getByPlaceholder('Create a password').fill('12345');
  await page.getByPlaceholder('Confirm a password').fill('12345');
  await page.locator('form').filter({ hasText: 'Signup' }).locator('i').nth(4).click();
  await page.locator('form').filter({ hasText: 'Signup' }).locator('i').nth(4).click();
});


test('Test Admin Login Flows', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  expect(page.url()).toBe('http://localhost:3000/');

  await page.getByRole('link', { name: 'ACCOUNT' }).click();
  await page.getByText('Are you an administrator? ').click();
  await page.getByRole('link', { name: 'Login as an Administrator' }).click();

  expect(page.url()).toBe('http://localhost:3000/account#');

  await page.getByPlaceholder('Enter your administrator email').click();
  await page.fill('input[placeholder="Enter your administrator email"]', 'admin@example.com');
  await page.getByRole('textbox', { name: 'Enter your administrator password' }).click();
  await page.locator('div').filter({ hasText: 'Administrator Login' }).locator('i').nth(2).click();

  expect(await page.locator('input[placeholder="Enter your administrator email"]').inputValue()).toBe('admin@example.com');

  await page.getByRole('button', { name: 'Login' }).click();
});
