// @ts-ignore
const tf = window.tf;


export class PongAI
{
	private model: any;
	private isLoaded: boolean = false;
	private delay: number = 1000;
	private lastUpdate: number = 0;
	private actionArray: number[] = [];

	constructor()
	{
		this.loadModel();
	}

	private async loadModel(): Promise<void>
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
			const paddleX = state[0]
			const paddleSpeed = state[2];
			const opponentX = state[3];
			const ballSpeedX = state[6];
			const ballSpeedY = state[7];

			let tensor = tf.tensor2d([state.slice(4)]);
			let output = this.model.predict(tensor);
			let predictionX = output.dataSync()[0];
			tensor.dispose();
			output.dispose();

			this.actionArray = [];
			if (ballSpeedY > 0)
				predictionX = 0
			else if (Math.abs(ballSpeedX) < 0.02 && Math.abs(predictionX) < 1)
			{
				if (opponentX < predictionX)
					predictionX -= 0.7
				else
					predictionX += 0.7
			}
			let action = 2;
			if (predictionX > paddleX + 0.01)
				action = 0;
			else if (predictionX < paddleX - 0.01)
				action = 1;
			let distance = Math.abs(predictionX - paddleX) / paddleSpeed
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
