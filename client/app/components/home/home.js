import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import PIXI from 'pixi.js';
import uuid from 'uuid';
import lodash from 'lodash';

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
const GRID_COUNT = 9;
const GRID_RESULT_COUNT = 3;

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;
console.log(windowWidth, windowHeight);

function uniqueIndexGenerator(min, max) {
  // var list = [];
  // for (var i = min; i < max; i++) {
  //   list.push(i);
  // }
  // list = lodash.shuffle(list);
  // return list[0];
  return Math.floor(Math.random() * (max - min)) + min;
}

// Generator function to set three objects with same values and rest other as same
let grids = [];
function generateGrids() {
  for (let index = 0; index < GRID_COUNT; index++) {
    grids.push({
      'orderIndex': index,
      'id': uuid.v4().split('-')[0],
      'isResult': false,
      'text': 'L'
    });
  }

  // Pick three random elements and change their isResult key to true
  for (let index = 0; index < GRID_RESULT_COUNT; index++) {
    let uniqueIndex = uniqueIndexGenerator(0, GRID_COUNT);
    console.log(uniqueIndex);
    grids[uniqueIndex].isResult = true;
    grids[uniqueIndex].text = 'W';
  }

  console.log(grids);
  return grids;
} 

let renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight, {backgroundColor : 0xf44336});
document.body.appendChild(renderer.view);
generateGrids();

let stage = new PIXI.Container();

let textStyle = {
  fontSize : '25px',
  fontWeight : 'bold',
  fill : 'white'
};

let xPos = 0;
let yPos = 0;
for (let index = 0; index < GRID_COUNT; index++) {
  if (index % 3 == 0) {
    yPos += 80;
  }

  xPos = 100 * (index % 3) + 50
  let gridObj = new PIXI.Text(grids[index].text + index, textStyle);
  gridObj.position.x = xPos;
  gridObj.position.y = yPos;
  stage.addChild(gridObj);
}

console.log(stage);
animate();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(stage);
}

export default homeModule;
