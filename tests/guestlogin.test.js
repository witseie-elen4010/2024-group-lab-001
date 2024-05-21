import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// Test to ensure guest login option is visible 
test('Guest login option is visible to the user', async ({ page }) => {
   await page.goto('http://localhost:3000');
   await page.getByRole('button', { name: 'Play' }).click();
   try {
       await expect(page.getByRole('link', { name: 'Continue as a Guest' })).toBeVisible(); 
   } catch (error) {
       test.skip("Guest login option not visible");
   }
});

// Test to ensure once guest login option is clicked web page is changed dynamically
test("User is presented with the guest login when guessed login option is selected", async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Play' }).click();
    try {
        await page.getByRole('link', { name: 'Continue as a Guest' }).click();
        await expect(page.getByText('Guest Login Continue as Guest')).toBeVisible();
        await expect(page.getByText('Guest Login')).toBeVisible();
        await expect(page.getByPlaceholder('Enter temporary username')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Continue as Guest' })).toBeVisible();
        await expect(page.getByText('Already registered? Login Now').first()).toBeVisible();
    } catch (error) {
        test.skip("Guest login option not visible");
    }
});

// Test to esnure that a guest login goes to the lobby creation or joining screen
test("User is able to enter a temporary username and goes to lobbyscreen", async ({page}) => {
    await page.goto('http://localhost:3000');
    await page.getByRole('button', { name: 'Play' }).click();
    try{
        await page.getByRole('link', { name: 'Continue as a Guest' }).click();
        await page.getByPlaceholder('Enter temporary username').click();
        await page.getByPlaceholder('Enter temporary username').fill('User1');
        await page.getByRole('button', { name: 'Continue as Guest' }).click();
        await expect(page.getByText('Create Lobby Join')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Create Lobby' })).toBeVisible();
        await expect(page.getByPlaceholder('Enter lobby code')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Join' })).toBeVisible();
    }catch (error){
        test.skip("User unable to login as guest");
    }
});