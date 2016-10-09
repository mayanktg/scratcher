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
          "start": 0.49,
          "end": 0.21
      },
      "scale": {
          "start": 0.1,
          "end": 0.04,
          "minimumScaleMultiplier": 1
      },
      "color": {
          "start": "#ffffff",
          "end": "#ffffff"
      },
      "speed": {
          "start": 82,
          "end": 50
      },
      "acceleration": {
          "x": 0,
          "y": 0
      },
      "startRotation": {
          "min": 0,
          "max": 360
      },
      "noRotation": false,
      "rotationSpeed": {
          "min": 0,
          "max": 0
      },
      "lifetime": {
          "min": 0.001,
          "max": 0.24
      },
      "blendMode": "normal",
      "frequency": 0.001,
      "emitterLifetime": -1,
      "maxParticles": 400,
      "pos": {
          "x": 0,
          "y": 0
      },
      "addAtBack": false,
      "spawnType": "ring",
      "spawnCircle": {
          "x": 0,
          "y": 0,
          "r": 17,
          "minR": 15
      }
  },
  backgroundColor: 0xFF9800,
  boxColor: 0x304FFE,
  boxOverlayColor: 0x000000,
  defaultBoxWidth: 100,
  winnerBackgroundImg: '/../../assets/img/winner.jpg',
  loserBackgroundImg: '/../../assets/img/loser.jpg',
  brushImg: '/../../assets/img/rsz_1brush.png',
  scratchImg: '/../../assets/img/shot.png',
  particleImg: '/../../assets/img/particle.png',
  brushSize: 50
}

export default constants;