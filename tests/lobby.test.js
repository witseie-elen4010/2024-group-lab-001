import { test, expect } from '@playwright/test';

test('When creating a lobby, the contents of the pagers should dynamically change ', async ({ page }) => {
    
  await page.goto('http://localhost:3000/lobby');

  await page.getByRole('button', { name: 'Create Lobby' }).click();

  // Check if the lobby container is hidden and the post lobby creation screen is displayed
  const lobbyContainerDisplay = await page.evaluate(() => {
      return document.getElementById('lobbyContainer').style.display;
  });
  expect(lobbyContainerDisplay).toBe('none');

  // Check if the post lobby creation screen is displayed
  const postLobbyCreationScreenDisplay = await page.evaluate(() => {
      return document.getElementById('postLobbyCreationScreen').style.display;
  });
  expect(postLobbyCreationScreenDisplay).toBe('flex');

  // Check if the post lobby creation screen has the correct class name
  const postLobbyCreationScreenClassName = await page.evaluate(() => {
      return document.getElementById('postLobbyCreationScreen').className;
  });
  expect(postLobbyCreationScreenClassName).toBe('container lobby-container');

  // Check if the room code is displayed
  const roomCodeContainer = await page.evaluate(() => {
      return document.querySelector('.room-code-container');
  });
  expect(roomCodeContainer).not.toBeNull();
});

test('When creating a lobby, the room code should be displayed', async ({ page }) => {
    
  await page.goto('http://localhost:3000/lobby');
  await page.getByRole('button', { name: 'Create Lobby' }).click();

  // The room code should be displayed correctly
  const roomCode = await page.evaluate(() => {
      return document.querySelector('.room-code-container').textContent;
  });
  expect(roomCode).toContain('Room Code:');
});


test('When lobby screen, copy button should be dynamically added', async ({ page }) => {
  // Load the lobby page
  await page.goto('http://localhost:3000/lobby');
  await page.getByRole('button', { name: 'Create Lobby' }).click();

  const copyButtonTextContent = await page.$eval('.copy-button', el => el.textContent);
  expect(copyButtonTextContent).toBe('Copy');
});

test('When entering a lobby, the Start Button is visible', async ({ page }) => {
  await page.goto('http://localhost:3000/lobby');
  await page.getByRole('button', { name: 'Create Lobby' }).click();
  await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
});

test('When starting a game with less than 3 players, "Start Game" button should be disabled', async ({ page }) => {
  // Load the lobby page
  await page.goto('http://localhost:3000/lobby');
  await page.getByRole('button', { name: 'Create Lobby' }).click();

  const startGameButton = await page.$('.start-button');
  expect(await startGameButton.isEnabled()).toBe(false);
});

