import { Tuple } from "@babylonjs/core";

export class PongAI
{
	private model: tf.LayersModel;
	private isLoaded: boolean = false;
	private delay: number = 1000;
	private lastUpdate: number = 0;
	private actionArray: number[] = [];
	private buffer: [number[], number][] = []
	private tmp: [number[]][] = []

	constructor()
	{
		this.loadModel();
	}

	private async loadModel(): Promise<void>
	{
		try
		{
			const modelPath = './python_simulation/model/model.json';
			this.model = await tf.loadLayersModel(modelPath);
			this.isLoaded = true;
		} catch (error)
		{
			console.error("Error: The loading of the model went wrong: ", error);
			this.isLoaded = false;
		}
	}

	private calculateAction(state: number[]): void
	{
		try
		{
			const tensor = tf.tensor2d([state.slice(3)]);
			const output = this.model.predict(tensor);

			const predictionX = output.dataSync()[0];
			console.log("predictX:", predictionX);
			tensor.dispose();
			output.dispose();

			let action = 2;
			if (predictionX > state[0])
				action = 0;
			else
				action = 1;

			const distance = Math.abs(predictionX - state[0]) / state[2]
			this.actionArray = [];
			for (let i = 0; i < distance; i++)
				this.actionArray.push(action)
		} catch (error)
		{
			console.error("Error: The prediction with the model is wrong: ", error);
		}
	}

	public getAction(ball: any, ballSpeed: any, paddle: any, paddleSpeed: number): number
	{
		const currentTime = Date.now();
		if (currentTime - this.lastUpdate >= this.delay)
		{
			if (!this.isLoaded)
			{
				this.loadModel()
				return 2;
			}
			this.lastUpdate = currentTime;
			const state: number[] = [
				paddle.position.x,
				paddle.position.z,
				paddleSpeed,
				ball.position.x,
				ball.position.z,
				ballSpeed.x,
				ballSpeed.z,
			];
			this.calculateAction(state);
		}
		let action = this.actionArray.pop()
		if (action != undefined)
			return action;
		return 2
	}
}
