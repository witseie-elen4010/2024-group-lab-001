const canvas = document.getElementById('drawing-canvas');

// Allow for different screen size scaling
canvas.width = canvas.offsetWidth;  
canvas.height = canvas.offsetHeight; 

// Require setting the context of canvas and frequent storage of users drawings 
let ctx = canvas.getContext('2d', { willReadFrequently: true });

// Initialization of canvas 
ctx.fillStyle = 'white';
ctx.fillRect(0,0,canvas.width,canvas.height);

//Intialization of drawing style and drawing size and methods 
let drawingColor = "black"; 
let lineWidth = 5;      
let drawingShape = 'round';
let isDrawing = false;   

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
canvas.addEventListener('mousemove',draw);

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
    updateDrawingParameters();
    ctx.lineTo(event.offsetX,event.offsetY);
    ctx.stroke();
};

// Update parameters for drawing to allow for future improvements 
function updateDrawingParameters()
{
    ctx.lineWidth = lineWidth;
    ctx.lineCap = drawingShape;
    ctx.strokeStyle = drawingColor;
    ctx.fillStyle = drawingColor;
}
