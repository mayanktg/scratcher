import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import PIXI from 'pixi.js';
// import {particles} from 'pixi-particles';
// import uuid from 'uuid';
import lodash from 'lodash';
import constants from '../../config/constants';
import InverseDrawingMask from '../../config/inverseDrawingMask';

let configParticle = constants.configParticle;
const STROKE_COLOUR = "black";
const STROKE_WIDTH = 20;

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

//setup Pixi renderer
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
console.log(windowWidth, windowHeight);

let resultBoxesOpenedCount = 0;

function uniqueIndexGenerator(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

let renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight,
                                      {'backgroundColor' : constants.backgroundColor});
renderer.interactive = true;
document.body.appendChild(renderer.view);
console.log(renderer);


// Create a PIXI container.
var stage = new PIXI.Container();
stage.interactive = true;
let gap = constants.GRID_GAP;
let xPos = 0;
let yPos = 0;
let xJump = gap;
let yJump = gap;
let boxWidth = ( windowWidth - ( gap * 4 ) ) / 3;
console.log(boxWidth);
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
let alphaSprite = [[], [], []];
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
      // mainContainer[indexX][indexY].id = uuid.v4().split('-')[0];
      mainContainer[indexX][indexY].isResult = false;
      mainContainer[indexX][indexY].image = constants.loserBackgroundImg;
      mainContainer[indexX][indexY].text = 'L';
      mainContainer[indexX][indexY].x = xPos + xJump;
      mainContainer[indexX][indexY].y = yPos + yJump;
      mainContainer[indexX][indexY].indexX = indexX;
      mainContainer[indexX][indexY].indexY = indexY;
      mainContainer[indexX][indexY].alpha = 1;

      // Background Image with choice of loser / winner.
      grids[indexX][indexY] = PIXI.Sprite.fromImage(constants.loserBackgroundImg);
      grids[indexX][indexY].cacheAsBitmapboolean = true;
      grids[indexX][indexY].interactive = true;
      grids[indexX][indexY].indexX = indexX;
      grids[indexX][indexY].indexY = indexY;
      grids[indexX][indexY].height = boxWidth;
      grids[indexX][indexY].width = boxWidth;
      grids[indexX][indexY].position.set(0, 0);

      // Sfratching area.
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
      alphaSprite[indexX][indexY] = new PIXI.Graphics();
      grids[indexX][indexY].mask = alphaSprite[indexX][indexY];
      alphaSprite[indexX][indexY].beginFill();
      alphaSprite[indexX][indexY].moveTo(0, 0);
      alphaSprite[indexX][indexY].lineTo(0, 1);
      alphaSprite[indexX][indexY].lineColor = STROKE_COLOUR;
      alphaSprite[indexX][indexY].lineWidth = STROKE_WIDTH;
      alphaSprite[indexX][indexY].endFill();


      // alphaSprite[indexX][indexY] = new PIXI.ParticleContainer();
      // gridScratches[indexX][indexY].mask = new InverseDrawingMask(mainContainer[indexX][indexY])..getMaskSprite();
      // particleViews[indexX][indexY] = new PIXI.particles.Emitter(alphaSprite[indexX][indexY],
      //                                                            constants.particelImg, configParticle);
      // particleViews[indexX][indexY].emit = true;
      // particleViews[indexX][indexY].interactive = true;
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

  // Pick three random elements and change their isResult key to true
  for (let index = 0; index < constants.GRID_RESULT_COUNT; index++) {
    let uniqueIndexX = uniqueIndexGenerator(0, constants.GRID_X_COUNT);
    let uniqueIndexY = uniqueIndexGenerator(0, constants.GRID_Y_COUNT);
    mainContainer[uniqueIndexX][uniqueIndexY].isResult = true;
    mainContainer[uniqueIndexX][uniqueIndexY].image = constants.winnerBackgroundImg;
    mainContainer[uniqueIndexX][uniqueIndexY].text = 'W';
  }
  console.log(mainContainer);
  return grids;
}

generateGrids();


let brushSize = constants.brushSize;
let brushImage = new ImageData(brushSize, brushSize);
brushImage.data[0] = 1;
brushImage.data[1] = 1;
brushImage.data[2] = 1;
brushImage.data[3] = 1;

var mousePrevX;
var mousePrevY;
var mouseCurrX;
var mouseCurrY;
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


function mouseover(mouseData) {
  let indexX = mouseData.target.indexX;
  let indexY = mouseData.target.indexY;
  mainContainer[indexX][indexY].on('mousemove', brush);
  mainContainer[indexX][indexY].on('touchmove', brush);
}

function mouseout(mouseData) {
  let indexX = mouseData.target.indexX;
  let indexY = mouseData.target.indexY;
  mainContainer[indexX][indexY]._events['mousemove'] = null;
  mainContainer[indexX][indexY]._events['touchmove'] = null;
}

function drawMouseLine(indexX, indexY) {
  // particleViews[indexX][indexY].emit = true;
  // particleViews[indexX][indexY].updateOwnerPos(mouseCurrX, mouseCurrY);
  alphaSprite[indexX][indexY].beginFill();
  alphaSprite[indexX][indexY].moveTo(mousePrevX, mousePrevY);
  alphaSprite[indexX][indexY].lineTo(mouseCurrX, mouseCurrY);
  alphaSprite[indexX][indexY].lineColor = STROKE_COLOUR;
  alphaSprite[indexX][indexY].lineWidth = STROKE_WIDTH;
  alphaSprite[indexX][indexY].endFill();
}

animate();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
};

export default homeModule;
