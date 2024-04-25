const canvas = document.getElementById('drawing-canvas');

// Allow for different screen size scaling
canvas.width = canvas.offsetWidth;  
canvas.height = canvas.offsetHeight; 

// Require setting the context of canvas and frequent storage of users drawings 
let ctx = canvas.getContext('2d', { willReadFrequently: true });

// Initialization of canvas 
ctx.fillStyle = 'white';
ctx.fillRect(0,0,canvas.width,canvas.height);