import PIXI from 'pixi.js';
import constants from './constants';

/**
 * InverseDrawinMask
 * Creates a new drawing canvas to be used as mask
 */
export default class InverseDrawingMask {
	
	constructor(stage) {
		this.isDrawing = false;	

		this.stage = stage;
		this.stage.interactive = true;

		//Get stage dimensions
		this.width = this.stage.width;
		this.height = this.stage.height;

		//Create a new canvas
		this.renderer = PIXI.autoDetectRenderer(this.width + constants.GRID_GAP,
											    this.height + constants.GRID_GAP + 10,
												{ backgroundColor: 0x000000 });
		//document.body.appendChild(this.renderer.view);

		this.innerStage = new PIXI.Container();

		//Create a drawing point for the cursor coordinates
		this.drawingPoint = new PIXI.Graphics();
		this.innerStage.addChild(this.drawingPoint);

		//Assign events
		this.stage.on('mouseover', this.onStart.bind(this));
		this.stage.on('mousemove', this.onMove.bind(this));
		this.stage.on('mouseout', this.onEnd.bind(this));
		this.stage.on('touchstart', this.onStart.bind(this));
		this.stage.on('touchmove', this.onMove.bind(this));
		this.stage.on('touchend', this.onEnd.bind(this));

		// Register the canvas as texture, it needs to update on every frame
		this.texture = new PIXI.Texture.from(this.renderer.view);
	}

	onStart() {
		this.isDrawing = true;
	}

	onEnd() {
		this.isDrawing = false;
	}

	onMove(e) {
		if(this.isDrawing) {
			let pos = e.data.getLocalPosition(this.stage);
			this.drawingPoint.beginFill(constants.brushColor);
			this.drawingPoint.drawCircle(pos.x, pos.y, constants.brushSize);				
			this.drawingPoint.endFill();
		}
	}

	/**
	 * update
	 * Updates the canvas renderer and the "canvas texture"
	 */
	update() {
		this.renderer.render(this.innerStage);
		this.texture.update();
	}

	/**
	 * getMaskSprite
	 * @return {Sprite} A new sprite to be used as mask
	 */
	getMaskSprite() {
		return new PIXI.Sprite(this.texture);
	}

	/**
	 * getFilledPercent
	 * Calculates how many black pixels were drawn
	 * in certain portion of the canvas
	 * 
	 * @param  {Number} x      Postion X
	 * @param  {Number} y      Position Y
	 * @param  {Number} width  Width
	 * @param  {Number} height Height
	 * @return {Number}        Percent of black pixels
	 */
	getFilledPercent(x, y, width, height) {
		let data = this.renderer.context.getImageData(x, y, width, height).data;
		let count = 0;
		for(var i=0, len=data.length; i<len; i+=4) 
			if(data[i]<255) 
				count++;

		return (100 * count / (width*height)).toFixed(2);
	}

}