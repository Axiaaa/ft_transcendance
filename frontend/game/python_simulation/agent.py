from simple_Pong import *
import tensorflow as tf
import random

class Network(tf.keras.Model):
	def __init__(self, input_dim, output_dim):
		super(Network, self).__init__()
		self.brain = tf.keras.models.Sequential()
		self.brain.add(tf.keras.Input(shape=(input_dim,)))
		self.brain.add(tf.keras.layers.Dense(64, activation='relu'))
		self.brain.add(tf.keras.layers.Dense(128, activation='relu'))
		self.brain.add(tf.keras.layers.Dense(64, activation='relu'))
		self.brain.add(tf.keras.layers.Dense(output_dim))

		self.brain.compile(optimizer='Adam', loss='mse', metrics=['mae'])

	def call(self, input, training=False):
		return self.brain(input, training=training)

class PredictBall():
	def __init__(self, input_dim, output_dim):
		self.model = Network(input_dim, output_dim)
		self.batch_size = 128
		self.sequence = []

	def predict(self, state):
		tensor = tf.convert_to_tensor([state], dtype=tf.float32)
		with tf.GradientTape(persistent=False) as tape:
			tape.stop_recording()
			predict = self.model(tensor, training=False)
		return predict.numpy().item()

	def convert_raw_data(self, states, targets):
		state_tensor = tf.convert_to_tensor(states, dtype=tf.float32)
		target_tensor = tf.convert_to_tensor(targets, dtype=tf.float32)
		dataset = tf.data.Dataset.from_tensor_slices((state_tensor, target_tensor))
		dataset = dataset.shuffle(buffer_size=len(states))
		train_size = int(0.8 * len(states))

		train_dataset = dataset.take(train_size).batch(self.batch_size).prefetch(tf.data.AUTOTUNE)
		eval_dataset = dataset.skip(train_size).batch(self.batch_size).prefetch(tf.data.experimental.AUTOTUNE)
		return train_dataset, eval_dataset

	def create_dataset(self, sample):
		states = []
		targets = []
		env = Game(600, 600, False)

		for _ in range(sample):
			angle = random.uniform(-math.pi/3, math.pi/3)
			speed = random.uniform(0.03, 0.1)
			env.ball.x = random.uniform(-4, 4)
			env.ball.y = random.uniform(-4, 4)
			env.ball.vx = speed * math.sin(angle)
			env.ball.vy = speed * math.cos(angle) * random.choice([-1, 1])

			self.sequence.append(env.get_state())
			while True:
				state, done = env.step()

				if self.sequence[-1][3] * state[3] > 0:
					self.sequence.append(state)
				else:
					target = self.sequence[-1][0]
					for i in self.sequence:
						states.append(i)
						targets.append(target)
					self.sequence.clear()

				if done or len(self.sequence) == 0:
					break

		state_tensor = tf.convert_to_tensor(states, dtype=tf.float32)
		target_tensor = tf.convert_to_tensor(targets, dtype=tf.float32)
		dataset = tf.data.Dataset.from_tensor_slices((state_tensor, target_tensor))
		dataset = dataset.shuffle(buffer_size=len(states))
		train_size = int(0.8 * len(states))
		train_dataset = dataset.take(train_size).batch(self.batch_size).prefetch(tf.data.AUTOTUNE)
		eval_dataset = dataset.skip(train_size).batch(self.batch_size).prefetch(tf.data.experimental.AUTOTUNE)

		return train_dataset, eval_dataset, (states, targets)

	def training(self, dataset, val_dataset, epochs=10):
		callbacks = [
			tf.keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
			tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=3)]

		result = self.model.brain.fit(dataset, validation_data=val_dataset, epochs=epochs, callbacks=callbacks, verbose=1)
		return result

	def create_dataset_balanced(self, sample):
		states = []
		targets = []
		direct, one, two, three, more = 0, 0, 0, 0, 0

		target_direct = int(sample * 0.3)
		target_one = int(sample * 0.3)
		target_two = int(sample * 0.2)
		target_three = int(sample * 0.1)
		target_more = int(sample * 0.1)

		env = Game(600, 800, False)

		while direct < target_direct or one < target_one or two < target_two or three < target_three or more < target_more:
			angle = random.uniform(-math.pi/3, math.pi/3)
			speed = random.uniform(0.03, 0.1)
			env.ball.x = random.uniform(-4, 4)
			env.ball.y = random.uniform(-4, 4)
			env.ball.vx = speed * math.sin(angle)
			env.ball.vy = speed * math.cos(angle) * random.choice([-1, 1])

			if (two < target_two or three < target_three or more < target_more) and random.random() < 0.7:
				env.ball.vx *= random.uniform(1.2, 2.0)

			self.sequence.append(env.get_state())
			rebound = 0

			states_temp = []
			while True:
				state, done = env.step()

				if self.sequence[-1][2] * state[2] < 0:
					rebound += 1

				if self.sequence[-1][3] * state[3] > 0:
					self.sequence.append(state)
				else:
					target = self.sequence[-1][0]
					for i in self.sequence:
						states_temp.append((i, target, rebound))
					self.sequence.clear()

				if done or len(self.sequence) == 0:
					break

			if rebound == 0 and direct < target_direct:
				for state, target_val, _ in states_temp:
					states.append(state)
					targets.append(target_val)
				direct += 1
			elif rebound == 1 and one < target_one:
				for state, target_val, _ in states_temp:
					states.append(state)
					targets.append(target_val)
				one += 1
			elif rebound == 2 and two < target_two:
				for state, target_val, _ in states_temp:
					states.append(state)
					targets.append(target_val)
				two += 1
			elif rebound == 3 and three < target_three:
				for state, target_val, _ in states_temp:
					states.append(state)
					targets.append(target_val)
				three += 1
			elif rebound > 3 and more < target_more:
				for state, target_val, _ in states_temp:
					states.append(state)
					targets.append(target_val)
				more += 1
			print(f"Direct: {direct}, One: {one}, Two: {two}, Three: {three}, More: {more}")

		state_tensor = tf.convert_to_tensor(states, dtype=tf.float32)
		target_tensor = tf.convert_to_tensor(targets, dtype=tf.float32)
		dataset = tf.data.Dataset.from_tensor_slices((state_tensor, target_tensor))
		dataset = dataset.shuffle(buffer_size=len(states))
		train_size = int(0.8 * len(states))
		train_dataset = dataset.take(train_size).batch(self.batch_size).prefetch(tf.data.AUTOTUNE)
		eval_dataset = dataset.skip(train_size).batch(self.batch_size).prefetch(tf.data.experimental.AUTOTUNE)

		return train_dataset, eval_dataset, (states, targets)

def test_model_in_game(model_path, num_games=5):
	predict = PredictBall(4, 1)
	predict.model.brain = tf.keras.models.load_model(model_path)

	game = Game(600, 600, visual=True)
	for _ in range(num_games):
		game.reset()
		game_over = False
		max_steps = 1000
		step_count = 0

		state = game.get_state()
		while not game_over and step_count < max_steps:
			predicted_x = predict.predict(state)
			game.prediction.tp(predicted_x, -5)

			state, game_over = game.step()

			game.root.update()
			time.sleep(0.010)

			step_count += 1
		time.sleep(1)

	game.root.mainloop()

if __name__ == "__main__":
	predict = PredictBall(4, 1)

	train_dataset, val_dataset, result = predict.create_dataset(100000)
	state, target = result
	history = predict.training(train_dataset, val_dataset, epochs=30)
	model_path = 'final.h5'
	predict.model.brain.save(model_path)
	test_model_in_game(model_path)
