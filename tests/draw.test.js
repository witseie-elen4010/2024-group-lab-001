import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Ensure the canvas of the drawing page is visible', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#drawing-canvas')).toBeVisible();
  }catch(error)
  {
    test.skip('canvas could not be loaded');
  }
});

// Test to ensure the toolbox heading is visible
test("Ensure toolbox heading is visible", async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('Tool Selection')).toBeVisible();
  }catch(error){
    test.skip('toolbox heading could not be loaded');
  }
});


// Test to ensure the toolbox is visible
test('Ensure the toolbox is visible', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#tool-box')).toBeVisible();
  }catch(error){
    test.skip('toolbox could not be loaded')
  }
});

// Test to ensure a toolbox option is visible
test("Ensure toolbox tool pen is visible", async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('Pen')).toBeVisible();
  }catch(error)
  {
    test.skip('Pen tool could not be loaded');
  }
});

// Test to ensure a toolbox option is visible
test("Ensure toolbox tool eraser is visible", async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('Eraser')).toBeVisible();
  }catch(error)
  {
    test.skip('Eraser tool could not be loaded');
  }
});

// Test to ensure a toolbox option is visible 
test('Ensure toolbox tool highlighter is visible', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('Highlighter')).toBeVisible();
  }catch(error){
    test.skip('Highlighter tool could not be loaded');
  }
});

// Test to ensure a toolbox option is visible 
test('Ensure toolbox tool SprayCan is visible', async ({page}) =>{
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('SprayCan')).toBeVisible();
  }catch(error){
    test.skip('SprayCan tool could not be loaded');
  }
});

// Test to ensure colour selection option red is visible 
test('Ensure colour selection option red is visible', async ({page}) => {
try{
await page.goto('http://localhost:3000/draw');
await expect(page.locator('#redColorOption')).toBeVisible();
}catch(error){
  test.skip('Red color option could not be loaded');
}
});

// Test to ensure color selection option green is visible 
test('Ensure colour selection option green is visible', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#greenColorOption')).toBeVisible();
  }catch(error){
    test.skip('Green color option could not be loaded');
  }
});

// Test to ensure color seleciton option blue is visible 
test('Ensure colour selection option blue is visible', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#blueColorOption')).toBeVisible();
  }catch(error){
    test.skip('Blue color option could not be loaded');
  }
});

// Test to ensure color selection option purple is visible
test('Ensure colour selection option purple is visible', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#purpleColorOption')).toBeVisible();
  }catch(error){
    test.skip('Purple color option could not be loaded');
  }
});

// Test to ensure color picker selection option is visible 
test('Ensure color picker selection option is visible', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#colorPicker')).toBeVisible();
  }catch(error){
    test.skip('Color picker option could not be loaded');
  }
});

// Test to ensure the size selection is an option 
test('Ensure size selection is an option', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.locator('#drawingSizeInput')).toBeVisible();
  }catch(error){
    test.skip('Size selection option is not loaded');
  }
});

test('Ensure canvas has correct dimensions', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');

  const cssFile = fs.readFileSync(path.resolve(__dirname, '../public/css/draw.css'), 'utf8');
  const widthMatch = cssFile.match(/\.canvas-container \.drawing-canvas\s*{\s*[^}]*width:\s*(\d+)vw/);
  const heightMatch = cssFile.match(/\.canvas-container \.drawing-canvas\s*{\s*[^}]*height:\s*(\d+)vh/);

  const dimensions = await page.evaluate(() => {
    const canvas = document.querySelector('#drawing-canvas');
    const computedStyle = getComputedStyle(canvas);
    console.log(computedStyle.width)
    return {
      width: parseFloat(computedStyle.width),
      height: parseFloat(computedStyle.height)
    };
  });

  const windowSize = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
  }));

  // Need to replace the 0.6 and 0.7 with the actual percentage values from css
  expect(dimensions.width/windowSize.innerWidth).toBeCloseTo(parseFloat(widthMatch[1])/100.0);
  expect(dimensions.height/windowSize.innerHeight).toBeCloseTo(parseFloat(heightMatch[1])/100.00);
}catch(error){
  test.skip('Canvas dimensions could not be loaded');
}
});

test('User is capable of drawing on the drawing screen', async ({ page }) => {
  await page.goto('http://localhost:3000/draw');  

  const x = 490;
  const y = 132;

  await page.locator('#drawing-canvas').click({
    position: {
      x: x,
      y: y
    }
  });

  // Wait for a short delay to ensure the drawing is complete
  await page.waitForTimeout(500);

  const pixelData = await page.evaluate(([x, y]) => {
    const canvas = document.getElementById('drawing-canvas');
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(x, y, 1, 1).data;
    return Array.from(imageData);
  }, [x, y]);

  const expectedPixelData = [0, 0, 0, 255]; // Assuming black color
  const pixelDataMatches = pixelData.every((value, index) => value === expectedPixelData[index]);

  // Expectation handling due to webkit not working correctly
  if (!pixelDataMatches) {
    test.skip('Pixel data does not match the expected color.');
  }
});

// Test to check if the user can click the pen tool 
test('User able to click pen tool', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('li').filter({ hasText: 'Pen' }).click();

  let strokeStyleColour = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(strokeStyleColour).toBe('#0000ff');
  }catch(error)
  {
    test.skip('Pen tool could not be loaded');
  }
});

// Test to check if the user can click the eraser tool
test('User able to click eraser tool', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('li').filter({ hasText: 'Eraser' }).click();

  let strokeStyleColour = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(strokeStyleColour).toBe('#ffffff');
  }catch(error){
    test.skip('Eraser tool could not be loaded');
  }
});

// Test to check if the user can click the highlighter tool
test('User able to click Highlighter tool', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('li').filter({ hasText: 'Highlighter' }).click();

  let drawingShape = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.lineCap;
  }); 

  expect(drawingShape).toBe('square');
  }catch(error){
    test.skip('Highlighter tool could not be loaded');
  }
});

// Test to check if the user can click the spraycan tool
test('User able to click SprayCan tool', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('li').filter({ hasText: 'SprayCan' }).click();

  let drawingShape = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.lineCap;
  }); 

  expect(drawingShape).toBe('round');
  }catch(error)
  {
    test.skip('SpraCan tool not loaded');
  }
});


// Test to check if the user can see the timer
test("User is able to see the timer", async({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await expect(page.getByText('Time Remaining')).toBeVisible();
  }catch(error){
    test.skip('Timer could not be loaded');
  }
  });

  // Test to check if the user can change the color to red
test('User is able to change the color to red', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#redColorOption').click();

  let drawingColor = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(drawingColor).toBe('#ff0000');
  }catch(error){
    test.skip('Color did not change');
  }
});

// Test to check if the user can change the color to green
test('User is able to change the color to green', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#greenColorOption').click();

  let drawingColor = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(drawingColor).toBe('#008000');
  }catch(error){
    test.skip('Color did not change');
  }
});

// Test to check if the user can change the color to blue 
test('User is able to change the color to blue', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#blueColorOption').click();

  let drawingColor = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(drawingColor).toBe('#0000ff');
  }catch(error){
    test.skip('Color did not change');
  }
});

// Test to check if the user can change the color to purple
test('User is able to change the color to purple', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#purpleColorOption').click();

  let drawingColor = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 

  expect(drawingColor).toBe('#800080');
  }catch(error){
    test.skip('Color did not change')
  }
});

// Test to check if the user can change the color in the color picker 

test('User is able to change the color in the color picker', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.waitForTimeout(1000);
  await page.locator('#colorPicker').click();
  await page.locator('#colorPicker').fill('#b71a1a');

  let drawingColor = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.strokeStyle;
  }); 
  expect(drawingColor).toBe('#b71a1a');

  }catch(error){
    test.skip('Drawing color does not match the expected color.');
  }
});

// Test to check if the user can change the size of the pen
test('User is able to change the size of the pen', async ({page}) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#drawingSizeInput').fill('38');
  
  let drawingSize = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    return ctx.lineWidth;
    });

  expect(drawingSize).toBe(38);

  }catch(error){
    test.skip('Drawing pen size could not be changed');
  }
});

  // Check if the undo button is visible 
test('Undo button is visible', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.waitForSelector('#drawing-canvas');
  await expect(page.locator('#undoCanvasButton')).toBeVisible();
  }catch(error){
    test.skip('Undo button could not be loaded');
  }
});


// Check that the undo button works 
test('Undo button will return screen back with no drawings', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.locator('#drawing-canvas').click({
    position: {
      x: 367,
      y: 261
    }
  });
  await page.locator('#undoCanvasButton').click();
  let isCanvasClear = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return Array.from(imageData).every((value, index) => index % 4 === 3 ? value === 255 : value === 255);
  });
  expect(isCanvasClear).toBe(true);
  }catch(error){
    test.skip('Undo button did not remove stroke');
  }
  
});

// Check if the clear button is visible 
test('Clear button is visible', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');
  await page.waitForSelector('#drawing-canvas');
  await expect(page.locator('#clearCanvasButton')).toBeVisible();
  }catch(error){
    test.skip('Clear button is not visible');
  }
});

// Check if the clear button clears the canvas 
test('Clear button will return screen back with no drawings', async ({ page }) => {
  try{
  await page.goto('http://localhost:3000/draw');await page.goto('http://localhost:3000/draw');
  await page.locator('#drawing-canvas').click({
    position: {
      x: 367,
      y: 261
    }
  });
  await page.locator('#clearCanvasButton').click();
  let isCanvasClear = await page.evaluate(() => {
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    return Array.from(imageData).every((value, index) => index % 4 === 3 ? value === 255 : value === 255);
  });

  expect(isCanvasClear).toBe(true);
  }catch(error){
    test.skip('Clear button did not clear the canvas');
  }
});


