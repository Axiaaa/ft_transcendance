import tensorflow as tf
import random
import numpy as np
import time

class SumTree:
	def __init__(self, capacity):
		self.capacity = capacity
		self.tree = np.zeros(2 * capacity - 1)
		self.data = np.zeros(capacity, dtype=object)
		self.size = 0
		self.ptr = 0
		self.counter = 0

	def add(self, priority, sample):
		idx = self.ptr + self.capacity - 1
		self.data[self.ptr] = sample
		self.update(idx, priority)

		self.ptr = (self.ptr + 1) % self.capacity
		self.size = min(self.size + 1, self.capacity)
		self.counter += 1

	def update(self, idx, priority):
		if hasattr(priority, "shape") and priority.shape:
			priority = float(priority.item())

		change = priority - self.tree[idx]
		self.tree[idx] = priority

		while idx != 0:
			idx = (idx - 1) // 2
			if hasattr(change, "shape") and change.shape:
				change = float(change.item())
			self.tree[idx] += change

	def get_leaf(self, idx):
		data_idx = idx - self.capacity + 1
		return idx, self.tree[idx], self.data[data_idx]

	def sample(self, s):
		idx = 0
		while idx < self.capacity - 1:
			left, right = 2 * idx + 1, 2 * idx + 2

			if self.tree[left] <= 0:
				idx = right
			elif self.tree[right] <= 0:
				idx = left
			elif s <= self.tree[left]:
				idx = left
			else:
				s -= self.tree[left]
				idx = right
		return self.get_leaf(idx)

	def total_priority(self):
		return self.tree[0]

	def __len__(self):
		return self.size

class PrioritizedReplayBuffer:
	def __init__(self, capacity, batch_size, alpha=0.6, beta=0.4, beta_inc=0.001, epsilon=0.01):
		self.tree = SumTree(capacity)
		self.batch_size = batch_size
		self.alpha = alpha
		self.beta = beta
		self.beta_inc = beta_inc
		self.epsilon = epsilon
		self.max_priority = 1.0
		self.last_indices = None

	def store(self, state, target):
		priority = self.max_priority
		if isinstance(state, tf.Tensor):
			state = state.numpy()
		if isinstance(target, tf.Tensor):
			target = target.numpy()
		self.tree.add(priority, (state, target))

	def sample(self):
		if len(self.tree) < self.batch_size:
			return None

		batch_indices, batch_states, batch_targets, batch_weights = [], [], [], []

		total_priority = self.tree.total_priority()
		if total_priority <= 0:
			return None

		self.beta = min(1.0, self.beta + self.beta_inc)
		segment = total_priority / self.batch_size

		for i in range(self.batch_size):
			a, b = segment * i, segment * (i + 1)
			s = random.uniform(a, b)

			idx, priority, data = self.tree.sample(s)

			sampling_probability = priority / total_priority
			weight = (sampling_probability * len(self.tree)) ** -self.beta

			batch_indices.append(idx)
			state, target = data
			batch_states.append(tf.convert_to_tensor(state, dtype=tf.float32))
			if np.isscalar(target):
				batch_targets.append(tf.convert_to_tensor([target], dtype=tf.float32))
			else:
				batch_targets.append(tf.convert_to_tensor(target, dtype=tf.float32))
			batch_weights.append(weight)

		batch_weights = np.array(batch_weights) / max(batch_weights)

		states = tf.stack(batch_states)
		targets = tf.stack(batch_targets)
		weights = tf.convert_to_tensor(batch_weights, dtype=tf.float32)

		self.last_indices = batch_indices

		return states, targets, weights

	def update_priorities(self, td_errors):
		if self.last_indices is None:
			return

		if isinstance(td_errors, tf.Tensor):
			td_errors = td_errors.numpy()

		for idx, error in zip(self.last_indices, td_errors):
			priority = (abs(error) + self.epsilon) ** self.alpha
			self.tree.update(idx, priority)
			self.max_priority = max(self.max_priority, priority)

		self.last_indices = None

	def __len__(self):
		return len(self.tree)

class Network(tf.keras.Model):
	def __init__(self, input_dim, output_dim):
		super(Network, self).__init__()
		self.model = tf.keras.models.Sequential()
		self.model.add(tf.keras.Input(shape=(input_dim,)))
		self.model.add(tf.keras.layers.Dense(64, activation='relu'))
		self.model.add(tf.keras.layers.Dense(128, activation='relu'))
		self.model.add(tf.keras.layers.Dense(64, activation='relu'))
		self.model.add(tf.keras.layers.Dense(output_dim))

		self.optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
		self.loss = tf.keras.losses.MeanSquaredError(reduction='none')
		self.model.compile(optimizer=self.optimizer, loss=self.loss)

	def call(self, input, training=False):
		return self.model(input, training=training)

	def save_model(self, path):
		self.model.save(path)

	def load_model(self, path):
		self.model = tf.keras.models.load_model(path)

	def train(self, data):
		states, targets, weights = data

		with tf.GradientTape() as tape:
			predictions = self.model(states, training=True)
			loss_values = self.loss(targets, predictions)
			weighted_loss = loss_values * weights
			total_loss = tf.reduce_mean(weighted_loss)

		gradients = tape.gradient(total_loss, self.model.trainable_variables)
		self.optimizer.apply_gradients(zip(gradients, self.model.trainable_variables))
		td_errors = tf.abs(predictions - targets)

		return total_loss, td_errors

	def save_model(self, path):
		self.model.save(path)

	def load_model(self, path):
		self.model = tf.keras.models.load_model(path)

class PredictBall():
	def __init__(self, input_dim, output_dim):
		self.model = Network(input_dim, output_dim)

		self.sequence = []
		self.capacity = 100000
		self.batch_size = 64
		self.buffer = PrioritizedReplayBuffer(self.capacity, self.batch_size)

	def normalize_state(self, state):
		norm_state = []

		norm_state.append(state[0] + 6)
		norm_state.append(state[1] + 6)
		norm_state.append(state[2] + 6)
		norm_state.append(state[3] + 6)

		norm_state.append((state[4] + 6))
		norm_state.append((state[5] + 6))
		norm_state.append(state[6])
		norm_state.append(state[7])

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
			target = state[0]
			for i in self.sequence:
				self.buffer.store(i, target)
			self.sequence.clear()
			self.sequence.append(state)

	def learn(self):
		if len(self.buffer) < self.batch_size:
			return

		batch = self.buffer.sample()
		if batch is None:
			return None

		loss, error = self.model.train(batch)
		self.buffer.update_priorities(error)

		return loss.numpy()

	def training(self, epoch):
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
				count = env.num_hit

			if done:
				frame = 0
				count = env.num_hit

			if env.visual:
				env.root.update()
			time.sleep(0.017)

from simple_Pong import Game

if __name__ == "__main__":
	env = Game(600, 600, False)
	predict = PredictBall(4, 1)

	# predict.model.load_model()
	# predict.test()

	datat = env
	predict.training(100000)
	model = predict.model.model
	model.save('final.h5')
