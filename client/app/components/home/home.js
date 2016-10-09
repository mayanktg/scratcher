import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import PIXI from 'pixi.js';
import {particles} from 'pixi-particles';
import uuid from 'uuid';
import lodash from 'lodash';
import constants from '../../config/constants';
import InverseDrawingMask from '../../config/InverseDrawingMask';

let homeModule = angular.module('home', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      component: 'home'
    });
})

.component('home', homeComponent)

.name;

let configParticle = constants.configParticle;
const STROKE_COLOUR = constants.brushColor;
const STROKE_WIDTH = 20;

//setup Pixi renderer
let windowWidth = document.body.scrollWidth;
let windowHeight = document.body.scrollHeight;
console.log(windowWidth, windowHeight);

let resultBoxesOpenedCount = 0;

function uniqueImageGenerator(min, max) {
  // Take first part of the UUID, strip of the string and form a unique random number.
  var number = uuid.v4().split('-')[0].match(/\d/g).join('');
  return ( number % 2 == 0 ) ? constants.loserBackgroundImg : constants.winnerBackgroundImg;
}

let renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight,
                                      {'backgroundColor': constants.backgroundColor});
renderer.interactive = true;
document.body.appendChild(renderer.view);

// Create a PIXI container.
var stage = new PIXI.Container();
stage.interactive = true;
let gap = constants.GRID_GAP;
let xPos = 0;
let yPos = 10;
let xJump = gap;
let yJump = gap;
let boxWidth = ( windowWidth - ( gap * 4 ) ) / 3;
if (windowWidth > windowHeight) {
  boxWidth = constants.defaultBoxWidth;
}

// Main container in which the Image, scratcher and overlay lies.
let mainContainer = [[], [], []];
// Image container
let grids = [[], [], []];
// Scratcher
let gridScratches = [[], [], []];
// Overlay sprite
let drawingMask = [[], [], []];
let alphaSprite = [[], [], []];
let alpha = [[], [], []];
let particleViews = [[], [], []];
// Generator function to set three objects with same values and rest other as same
function generateGrids() {
  for (let indexX = 0; indexX < constants.GRID_X_COUNT; indexX++) {
    xJump = gap;
    for (let indexY = 0; indexY < constants.GRID_Y_COUNT; indexY++) {
      // Create a PIXI container and set image properties to it. Shall review it later.
      mainContainer[indexX][indexY] = new PIXI.Container();
      mainContainer[indexX][indexY].interactive = true;
      mainContainer[indexX][indexY].height = boxWidth;
      mainContainer[indexX][indexY].width = boxWidth;
      mainContainer[indexX][indexY].interactive = true;
      mainContainer[indexX][indexY].x = xPos + xJump;
      mainContainer[indexX][indexY].y = yPos + yJump;
      mainContainer[indexX][indexY].indexX = indexX;
      mainContainer[indexX][indexY].indexY = indexY;

      // Background Image with choice of loser / winner.
      grids[indexX][indexY] = PIXI.Sprite.fromImage(uniqueImageGenerator(indexX, indexY));
      grids[indexX][indexY].cacheAsBitmapboolean = true;
      grids[indexX][indexY].interactive = true;
      grids[indexX][indexY].indexX = indexX;
      grids[indexX][indexY].indexY = indexY;
      grids[indexX][indexY].height = boxWidth;
      grids[indexX][indexY].width = boxWidth;
      grids[indexX][indexY].position.set(0, 0);

      // Scratching area.
      gridScratches[indexX][indexY] = PIXI.Sprite.fromImage(constants.scratchImg);
      gridScratches[indexX][indexY].cacheAsBitmapboolean = true;
      gridScratches[indexX][indexY].interactive = true;
      gridScratches[indexX][indexY].indexX = indexX;
      gridScratches[indexX][indexY].indexY = indexY;
      gridScratches[indexX][indexY].height = boxWidth;
      gridScratches[indexX][indexY].width = boxWidth;
      gridScratches[indexX][indexY].position.set(0, 0);

      mainContainer[indexX][indexY].addChild(gridScratches[indexX][indexY]);
      mainContainer[indexX][indexY].addChild(grids[indexX][indexY]);
      stage.addChild(mainContainer[indexX][indexY]);

      // Srpite overlay for the scratching area.
      drawingMask[indexX][indexY] = new InverseDrawingMask(mainContainer[indexX][indexY]);
      alphaSprite[indexX][indexY] = new PIXI.ParticleContainer();
      particleViews[indexX][indexY] = new PIXI.particles.Emitter(alphaSprite[indexX][indexY],
                                                                 constants.particleImg, configParticle);
      grids[indexX][indexY].mask = drawingMask[indexX][indexY].getMaskSprite();
      particleViews[indexX][indexY].emit = false;
      mainContainer[indexX][indexY].addChild(alphaSprite[indexX][indexY]);

      // Comment the below lines to see only the Pixi graphic eraser.
      // alpha[indexX][indexY] = new PIXI.Graphics();
      // grids[indexX][indexY].mask = alpha[indexX][indexY];

      // let texture = new PIXI.Texture.fromCanvas(renderer.view);
      // let alpha = new PIXI.Sprite(texture);
      // gridScratches[indexX][indexY].mask = alpha;
      // alphaSprite[indexX][indexY] = new PIXI.ParticleContainer();
      // particleViews[indexX][indexY] = new PIXI.particles.Emitter(alphaSprite[indexX][indexY],
      //                                                            constants.particleImg, configParticle);

      // mainContainer[indexX][indexY].addChild(alphaSprite[indexX][indexY]);


      // Add mouse and touch events to the grid boxes
      mainContainer[indexX][indexY].on('mouseover', mouseover);
      mainContainer[indexX][indexY].on('mouseout', mouseout);
      mainContainer[indexX][indexY].on('touchstart', mouseover);
      mainContainer[indexX][indexY].on('touchend', mouseout);

      xJump += boxWidth + gap;
    }

    yJump += boxWidth + gap;
  }

  return grids;
}




generateGrids();


let brushSize = constants.brushSize;
let brushImage = new ImageData(brushSize, brushSize);
brushImage.data[0] = 1;
brushImage.data[1] = 1;
brushImage.data[2] = 1;
brushImage.data[3] = 1;

let mousePrevX;
let mousePrevY;
let mouseCurrX;
let mouseCurrY;
function brush(event) {
  // Touch event is stored in touches[0] whereas mouse event in Layer.
  let mouseX = event.data.originalEvent.layerX || event.data.originalEvent.touches[0].pageX;
  let mouseY = event.data.originalEvent.layerY || event.data.originalEvent.touches[0].pageY;
  let indexX = event.target.indexX;
  let indexY = event.target.indexY;

  mousePrevX = mouseCurrX;
  mousePrevY = mouseCurrY;
  mouseCurrX = mouseX - renderer.view.offsetLeft;
  mouseCurrY = mouseY - renderer.view.offsetTop;

  drawMouseLine(indexX, indexY);
}

let isDrawing = false;
function mouseover(mouseData) {
  let indexX = mouseData.target.indexX;
  let indexY = mouseData.target.indexY;
  particleViews[indexX][indexY].emit = true;
  isDrawing = true;
  mainContainer[indexX][indexY].on('mousemove', brush);
  mainContainer[indexX][indexY].on('touchmove', brush);
}

function mouseout(mouseData) {
  let indexX = mouseData.target.indexX;
  let indexY = mouseData.target.indexY;
  particleViews[indexX][indexY].emit = false;
  isDrawing = false;

  // NOTE: Clear mouse events here only so that you don't have to check the events
  // again on mousover events, since mouseomve and touchmove is called every time a
  // mouse or touch geture is made irrespective of container location.
  // mainContainer[indexX][indexY]._events['mousemove'] = null;
  // mainContainer[indexX][indexY]._events['touchmove'] = null;
}

function drawMouseLine(indexX, indexY) {
  if (isDrawing) {
    particleViews[indexX][indexY].updateOwnerPos(mouseCurrX, mouseCurrY);
    
    // Comment the below lines to see only the Pixi graphic eraser.
    // alpha[indexX][indexY].beginFill(STROKE_COLOUR);
    // alpha[indexX][indexY].lineStyle(STROKE_WIDTH, STROKE_COLOUR, 1);
    // alpha[indexX][indexY].moveTo(mousePrevX, mousePrevY);
    // alpha[indexX][indexY].lineTo(mouseCurrX, mouseCurrY);
    // alpha[indexX][indexY].endFill();
  }
}

animate();
function animate() {
  for (let indexX = 0; indexX < constants.GRID_X_COUNT; indexX++) {
    for (let indexY = 0; indexY < constants.GRID_Y_COUNT; indexY++) {
      drawingMask[indexX][indexY].update(indexX, indexY);
    }
  }
  requestAnimationFrame(animate);
  renderer.render(stage);
};

export default homeModule;
