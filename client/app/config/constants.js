const constants = {
  GRID_X_COUNT: 3,
  GRID_Y_COUNT: 3,
  GRID_RESULT_COUNT: 3,
  GRID_GAP: 10,
  textStyle: {
      fontSize : '25px',
      fontWeight : 'bold',
      fill : 'white'
    },
  configParticle: {
    "alpha": {
      "start": 0.8,
      "end": 0.1
    },
    "scale": {
      "start": 1,
      "end": 0.3,
      "minimumScaleMultiplier": 1
    },
    "color": {
      "start": "#e3f9ff",
      "end": "#0ec8f8"
    },
    "speed": {
      "start": 0,
      "end": 0
    },
    "acceleration": {
      "x": 0,
      "y": 0
    },
    "startRotation": {
      "min": 0,
      "max": 0
    },
    "noRotation": false,
    "rotationSpeed": {
      "min": 0,
      "max": 0
    },
    "lifetime": {
      "min": 0.2,
      "max": 0.2
    },
    "blendMode": "normal",
    "frequency": 0.008,
    "emitterLifetime": -1,
    "maxParticles": 1000,
    "pos": {
      "x": 0,
      "y": 0
    },
    "addAtBack": false,
    "spawnType": "point"
  },
  backgroundColor: 0xFF9800,
  boxColor: 0x304FFE,
  boxOverlayColor: 0x000000,
  brushColor: 0xFFFFFF,
  defaultBoxWidth: 100,
  winnerBackgroundImg: '/../../assets/img/winner.jpg',
  loserBackgroundImg: '/../../assets/img/loser.jpg',
  scratchImg: '/../../assets/img/scratch.jpg',
  particleImg: '/../../assets/img/particle.png',
  brushSize: 50
}

export default constants;