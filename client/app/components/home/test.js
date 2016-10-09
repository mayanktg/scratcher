var renderer = null;
var stage = null;

var canvas = null;
var ctx = null;
var canvasHeight = 0;
var canvasWidth = 0;

var isMouseDown = false;
var mousePrevX;
var mousePrevY;
var mouseCurrX;
var mouseCurrY;

var STROKE_COLOUR = "white";
var STROKE_WIDTH = 20;

var underlaySprite = null;
var overlaySprite = null;
var alphaSprite = null;
var alphaMask = null;

function init() {
  renderer = PIXI.autoDetectRenderer(1120, 600, {
    background: "#333333"
  });
  document.body.appendChild(renderer.view);

  canvas = renderer.view;

  canvasHeight = canvas.width;
  canvasWidth = canvas.height;

  stage = new PIXI.Stage(0x333333, true);
  stage.interactive = true;

  canvas.addEventListener("mousemove", function(e) {
    getMouseXY('MOVE', e)
  }, false);
  canvas.addEventListener("mousedown", function(e) {
    getMouseXY('DOWN', e)
  }, false);
  canvas.addEventListener("mouseup", function(e) {
    getMouseXY('UP', e)
  }, false);
  canvas.addEventListener("mouseout", function(e) {
    getMouseXY('PUT', e)
  }, false);

 
  underlaySprite = new PIXI.Sprite.fromImage("https://i.imgur.com/2O6RiMs.jpg");  
  overlaySprite = new PIXI.Sprite.fromImage("https://i.imgur.com/4RcGJBT.jpg");

  stage.addChild(overlaySprite);
  stage.addChild(underlaySprite);
  

  alphaSprite = new PIXI.Graphics();
  underlaySprite.mask = alphaSprite;
  
  ctx = alphaSprite;
  ctx.beginFill();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 1);
  ctx.lineColor = STROKE_COLOUR;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.endFill();

  render();
}

function render() { 
  renderer.render(stage);
  window.requestAnimationFrame(render.bind(this)); 
}

function drawMouseLine() {
  ctx.beginFill();
  ctx.moveTo(mousePrevX, mousePrevY);
  ctx.lineTo(mouseCurrX, mouseCurrY);
  ctx.lineColor = STROKE_COLOUR;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.endFill();
}

function eraseCanvas() {
  alphaSprite = new PIXI.Graphics();
  underlaySprite.mask = alphaSprite;
  
  ctx = alphaSprite;
  ctx.beginFill();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 1);
  ctx.lineColor = STROKE_COLOUR;
  ctx.lineWidth = STROKE_WIDTH;
  ctx.endFill();
}

function getMouseXY(inputType, e) {
  if (inputType === 'UP' || inputType === "OUT") {
    isMouseDown = false;
    return;
  }

  if (inputType === 'DOWN') {
    mousePrevX = mouseCurrX;
    mousePrevY = mouseCurrY;
    mouseCurrX = e.clientX - canvas.offsetLeft;
    mouseCurrY = e.clientY - canvas.offsetTop;

    isMouseDown = true;
  }

  if (inputType === 'MOVE') {
    if (isMouseDown) {
      mousePrevX = mouseCurrX;
      mousePrevY = mouseCurrY;

      mouseCurrX = e.clientX - canvas.offsetLeft;
      mouseCurrY = e.clientY - canvas.offsetTop;

      drawMouseLine();
    }
  }
}