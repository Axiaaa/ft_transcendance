import * as tf from '@tensorflow/tfjs'

// This model take the state of the Balle and return the X where the ball will hit the paddle
const model = await tf.loadGraphModel('./network/model.json')

function normalize_state(state: Array<number>): Array<number>
{
	let norm_state = []

	for (let i = 0; i < 4; i++)
		norm_state.push(state[i]+6)
	norm_state.push(state[4])
	norm_state.push(state[5])
	norm_state.push(state[6])

	return norm_state;
}

function getActions(state: Array<number>): Array<number>
/*
	Returns an array of action (0, 1, 2 => Left, Right, Nothing)
	Can be modified to send a single action

	@param state - (PaddleX, PaddleZ, BallX, BallZ, BallVX, BallVZ, PaddleSpeed)
*/
{
	let norm_state = normalize_state(state);
	let tensor: tf.Tensor = tf.tensor(norm_state.slice(2));
	let prediction: tf.Tensor = model.predict(tensor);

	let action = 2;
	let direction = prediction.data() - norm_state[0];

	if (direction > 0)
		action = 1;
	else if (direction < 0)
		action = 0;

	let distance = Math.abs(direction) / norm_state[60];

	let actions: Array<number> = [];
	for (let i = 0; i < distance; i++)
		actions.push(action)
	return actions
}
