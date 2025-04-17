export class PongAI
{
	private model: tf.LayersModel;
	private isLoaded: boolean = false;
	private delay: number = 1000;
	private lastUpdate: number = 0;
	private actionArray: number[] = [];

	constructor()
	{
		this.loadModel();
	}

	private async loadModel(): promise<void>
	{
		try
		{
			let modelPath = './model/model.json';
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
			let tensor = tf.tensor2d([state.slice(4)]);
			let output = this.model.predict(tensor);

			let predictionX = output.dataSync()[0];
			tensor.dispose();
			output.dispose();

			this.actionArray = [];
			if (state[7] > 0)
				predictionX = 0
			else if (state[6] < 0.03 && state[6] > -0.03)
			{
				console.log(predictionX)
				if (state[3] < predictionX)
					predictionX -= 1
				else
					predictionX += 1
			}
			let action = 2;
			let distance = 0
			if (predictionX > state[0])
				action = 0;
			else
				action = 1;
			distance = Math.abs(predictionX - state[0]) / state[2]
			for (let i = 0; i < distance; i++)
				this.actionArray.push(action)
		} catch (error)
		{
			console.error("Error: The model prediction went wrong:", error);
		}
	}

	public getAction(ball: any, ballSpeed: any, paddle: any, paddleSpeed: number, opponent: number): number
	{
		let currentTime = Date.now();
		if (currentTime - this.lastUpdate >= this.delay)
		{
			if (!this.isLoaded)
			{
				this.loadModel()
				return 2;
			}
			this.lastUpdate = currentTime;
			let state: number[] = [
				paddle.position.x,
				paddle.position.z,
				paddleSpeed,
				opponent,
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
