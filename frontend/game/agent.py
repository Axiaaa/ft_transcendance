import tensorflow as tf
import random
import keras
import numpy as np
import time

class Agent(keras.Model):
	def __init__(self, input_dim, output_dim):
		super(Agent, self).__init__()
		self.model = keras.models.Sequential([
			keras.layers.Input(shape=(input_dim,)),
			keras.layers.Dense(64, activation='relu'),
			keras.layers.Dense(128, activation='relu'),
			keras.layers.Dense(64, activation='relu'),
			keras.layers.Dense(output_dim)
			])

		self.optimizer = keras.optimizers.Adam(learning_rate=0.001)
		self.loss = keras.losses.MeanSquaredError()

		self.sequence = []
		self.buffer = []
		self.capacity = 100000
		self.batch_size = 64

	def call(self, input, training=False):
		return self.model(input, training=training)

	def normalize_state(self, state):
		paddle1x = state[0]
		paddle1y = state[1]

		paddle2x = state[2]
		paddle2y = state[3]

		ballx = round(state[4]+6.00, 2)
		bally = round(state[5]+6.00, 2)
		norm_state = [paddle1x, paddle1y, paddle2x, paddle2y, ballx, bally, state[6], state[7]]

		return norm_state

	def store(self, state):
		state = self.normalize_state(state)
		state = state[4:8]

		if len(self.sequence) == 0:
			self.sequence.append(state)
			return

		if self.sequence[-1][3] * state[3] > 0 :
			self.sequence.append(state)
		else:
			target = self.sequence[-1][0]
			for i in self.sequence:
				if len(self.buffer) > self.capacity:
					self.buffer.pop(0)
				self.buffer.append((i, target))
			self.sequence.clear()
			self.sequence.append(state)

	def learn(self):
		if len(self.buffer) < self.batch_size:
			return

		batch = random.sample(self.buffer, self.batch_size)
		state, target = [], []
		for i, j in batch:
			state.append(i)
			target.append(j)

		state = tf.convert_to_tensor(state, dtype=tf.float32)
		target = tf.expand_dims(tf.convert_to_tensor(target, dtype=tf.float32), axis=1)

		with tf.GradientTape() as tape:
			prediction = self.call(state, training=True)

			loss = self.loss(prediction, target)

		gradients = tape.gradient(loss, self.trainable_variables)
		self.optimizer.apply_gradients(zip(gradients, self.trainable_variables))

		return loss.numpy()

	def train(self, epoch):
		state = env.get_state()
		total_loss = []
		for frame in range(epoch):
			self.store(state)
			state, done = env.step()
			loss = self.learn()
			if loss:
				total_loss.append(loss)
			if (frame+1) % 100 == 0:
				print(f"Frame: {frame}, Loss: {np.mean(total_loss[-100:]):.4f}")
			if env.visual and (frame+1) % 50 == 0:
				env.root.update()

	def predict(self, state):
		state = self.normalize_state(state)
		state = state[4:8]
		tensor = tf.convert_to_tensor([state], dtype=tf.float32)
		with tf.GradientTape(persistent=False) as tape:
			tape.stop_recording()
			predict = self.model(tensor, training=False)

		return predict.numpy().item()

	def test(self):
		frame = 0
		delay = 60
		count = 0

		state = env.get_state()
		while (1):
			if frame % delay == 0:
				predict = round(self.predict(state), 2)
				print(f"Predict: {predict}")
				if env.ball.vy < 0:
					y = -5
				else:
					y = 5
				env.prediction.tp(predict, y)

			action = 2
			if env.keys_pressed.get("Left", False):
				action = 0
			elif env.keys_pressed.get("Right", False):
				action = 1

			state, done = env.step(bottom_action=action)
			frame += 1

			if env.num_hit != count:
				print(f"In fact it is {env.ball.x + 6.0:.1f}\n")
				count = env.num_hit

			if done:
				frame = 0
				count = env.num_hit

			if env.visual:
				env.root.update()
			time.sleep(0.017)

	def save_model(self, path):
		self.model.save(path + ".keras")
	def load_model(self, path):
		self.model = keras.models.load_model(path + ".keras")

from simple_Pong import Game
if __name__ == "__main__":
	env = Game(600, 600, True)
	agent = Agent(4, 1)
	# agent.train(100000)
	# agent.save_model("saving")
	agent.load_model("saving")
	agent.test()
