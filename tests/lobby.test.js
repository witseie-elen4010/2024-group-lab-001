import { test, expect } from '@playwright/test';

test('Test lobby functionality', async ({ page }) => {
  // Navigate to the homepage
  await page.goto('http://localhost:3000/');

  // Navigate to the lobby page
  await page.goto('http://localhost:3000/lobby');

  // Click the "Create Lobby" button
  await page.click('button#createLobbyButton');

  // Fill the lobby code input field with 'Hello'
  await page.fill('input[placeholder="Enter lobby code"]', 'Hello');

  // Click the "Join" button
  await page.click('button#joinLobbyButton');
});