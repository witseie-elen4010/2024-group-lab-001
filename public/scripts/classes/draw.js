// draw.js

const canvas = document.getElementById('drawing-canvas');

// Allow for different screen size scaling
canvas.width = canvas.offsetWidth;  
canvas.height = canvas.offsetHeight; 

// Require setting the context of canvas and frequent storage of users drawings 
let ctx = canvas.getContext('2d', { willReadFrequently: true });

// Initialization of canvas 
ctx.fillStyle = 'white';
ctx.fillRect(0,0,canvas.width,canvas.height);

// Intialization of drawing style and drawing size and methods 
let drawingColor = "black"; 
let lineWidth = 5;      
let drawingShape = 'round';
let isDrawing = false;   
let isSprayCan = false; 

// Initialize canvas with default parameters 
ctx.strokeStyle = drawingColor; 
ctx.lineWidth = lineWidth;  
ctx.lineCap = drawingShape;
ctx.lineJoin = drawingShape;

  
// Start drawing if user clicks M1 key 
canvas.addEventListener('mousedown', (event)=>{
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX,event.offsetY); // Move to current position of users cursor 
    event.preventDefault();      // Reduces offset of drawing and mouse 
    draw(event);
});

// Stop drawing if user releases M1 key
canvas.addEventListener('mouseup', ()=>{
    isDrawing = false; 
    ctx.closePath();
});

// Track movement of user's cursor when moving 
canvas.addEventListener('mousemove',(event)=>{
    if(isDrawing) {
    draw(event);
    }
});

// Check if user is moving inside the canvas 
canvas.addEventListener('mouseleave', ()=>{
    isDrawing = false;
    ctx.closePath();
});

// Draw stroke lines when user has M1 key pressed 
function draw(event)
{
    // If the user isnt drawing dont execute rest of the function 
    if(!isDrawing)
    {
        return;
    }

    // Check if sprayCan or normal pen is selected
    if(isSprayCan)
    {
        sprayCanDrawing(event);
    }
    else
    {
        ctx.lineTo(event.offsetX,event.offsetY);
        ctx.stroke();
    }
};

// Allow for the drawing with a sprayCan rather than a pen or highlighter
function sprayCanDrawing(event)
{
    rect = canvas.getBoundingClientRect();
    // Draw multiple small dots in a random pattern around the cursor position
    const density = 50; // adjust this value to change the density of the spray
    for (let i = 0; i < density; i++) {
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const offsetX = Math.random() * lineWidth*5 - 10; // adjust these values to change the spread of the spray
        const offsetY = Math.random() * lineWidth*5 - 10;
        ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
    }
};

// Update parameters for drawing to allow for future improvements 
function updateDrawingParameters()
{
    ctx.lineWidth = lineWidth;
    ctx.lineCap = drawingShape;
    ctx.strokeStyle = drawingColor;
    ctx.fillStyle = drawingColor;
}

// Set the pen in use
function pen()
{
   console.log("Pen tool selected");
   drawingColor = 'blue';
   drawingShape = 'round';
   isSprayCan = false; 
   updateDrawingParameters();
}

// Set the eraser 
function eraser()
{
    console.log("Eraser tool selected");
    drawingColor = "white";
    drawingShape = 'round';
    isSprayCan = false; 
    updateDrawingParameters();
}

// Set the highlighter 
function highlighter()
{
    drawingColor = 'yellow';
    drawingShape = 'square';
    isSprayCan = false; 
    lineWidth = 25; 
    document.getElementById('drawingSizeInput').value = 25; 
    updateDrawingParameters();
}

// Set the spraycan
function spraycan()
{
    drawingColor = 'black';
    drawingShape = 'round';
    isSprayCan = true; 
    updateDrawingParameters();
}

// Function for changing the color based on predefined set of colors 
function changeColor(element)
{
    drawingColor = element.style.background;
    updateDrawingParameters();
}

// Change color based on the value the user chooses
function changeColorPicker(value)
{
    drawingColor = value;
    updateDrawingParameters();
}

// Allow changes of line size
function changeLineWidth(value)
{
   lineWidth = value; 
   updateDrawingParameters();
}