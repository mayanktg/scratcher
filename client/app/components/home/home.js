import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import PIXI from 'pixi.js';
import uuid from 'uuid';
import lodash from 'lodash';
import constants from '../../config/constants';

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

function uniqueIndexGenerator(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generator function to set three objects with same values and rest other as same
let grids = [];
function generateGrids() {
  for (let index = 0; index < constants.GRID_COUNT; index++) {
    grids.push({
      'orderIndex': index,
      'id': uuid.v4().split('-')[0],
      'isResult': false,
      'image': constants.loserBackgroundImg,
      'text': 'L'
    });
  }

  // Pick three random elements and change their isResult key to true
  for (let index = 0; index < constants.GRID_RESULT_COUNT; index++) {
    let uniqueIndex = uniqueIndexGenerator(0, constants.GRID_COUNT);
    // console.log(uniqueIndex);
    grids[uniqueIndex].isResult = true;
    grids[uniqueIndex].image = constants.winnerBackgroundImg;
    grids[uniqueIndex].text = 'W';
  }

  // console.log(grids);
  return grids;
}





let renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight,
                                      {'backgroundColor' : constants.backgroundColor});
document.body.appendChild(renderer.view);
generateGrids();

let stage = new PIXI.Container();

let xPos = 0;
let yPos = 0;
let boxWidth = ( windowWidth - 40 ) / 3;
if (windowWidth > windowHeight) {
  boxWidth = constants.defaultBoxWidth;
}

let gridBoxes = [];
for (let index = 0; index < constants.GRID_COUNT; index++) {
  if (index === 0) {
    yPos = 50;
  } else if (index % 3 == 0) {
    yPos += boxWidth;
  }

  xPos = boxWidth * (index % 3) + 25;
  // create graphic object called circle then draw a circle on it
  var gridBox = new PIXI.Graphics();
  // gridBox.lineStyle(5, 0xFFFFFF, 1);
  gridBox.beginFill(constants.boxColor, 1);
  gridBox.drawRect(xPos, yPos, (boxWidth - 10), (boxWidth - 10));
  gridBox.endFill();
  gridBox.alpha = 1;
  gridBoxes.push(gridBox);
  stage.addChild(gridBox);

  gridBox.interactive = true;
  gridBox.hitArea = new PIXI.Rectangle(xPos, yPos, (boxWidth - 10), (boxWidth - 10));

  gridBox.mouseover = function(mouseData) {
    // let mouseX = event.data.originalEvent.layerX;
    // let mouseY = event.data.originalEvent.layerY;
    this.alpha = 0.5;
    // console.log(mouseX, mouseY);
  }

  gridBox.mouseout = function(mouseData) {
    this.alpha = 1;
    let row = event.target.row;
    let col = event.target.col;
    console.log(row, col);
  }
}
// start animating
animate();

function animate() {
  requestAnimationFrame(animate);
  // render the root container
  renderer.render(stage);
};

export default homeModule;
