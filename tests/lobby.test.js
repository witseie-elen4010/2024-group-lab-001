import { test, expect } from '@playwright/test';

test('When creating a lobby, the contents of the pagers should dynamically change ', async ({ page }) => {
    
  await page.goto('http://localhost:3000/lobby');

  await page.getByRole('button', { name: 'Create Lobby' }).click();

  // Assertions
  const lobbyContainerDisplay = await page.evaluate(() => {
      return document.getElementById('lobbyContainer').style.display;
  });
  expect(lobbyContainerDisplay).toBe('none');

  const postLobbyCreationScreenDisplay = await page.evaluate(() => {
      return document.getElementById('postLobbyCreationScreen').style.display;
  });
  expect(postLobbyCreationScreenDisplay).toBe('block');

  const postLobbyCreationScreenClassName = await page.evaluate(() => {
      return document.getElementById('postLobbyCreationScreen').className;
  });
  expect(postLobbyCreationScreenClassName).toBe('container');

  const roomCodeContainer = await page.evaluate(() => {
      return document.querySelector('.room-code-container');
  });
  expect(roomCodeContainer).not.toBeNull();
});

test('When creating a lobby, the room code should be displayed', async ({ page }) => {
    
  await page.goto('http://localhost:3000/lobby');

  await page.getByRole('button', { name: 'Create Lobby' }).click();

  const roomCode = await page.evaluate(() => {
      return document.querySelector('.room-code-container').textContent;
  });
  expect(roomCode).toContain('Room Code:');
});
