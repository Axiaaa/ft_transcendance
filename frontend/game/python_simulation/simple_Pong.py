import tkinter as tk
import math
import random
import time

class Ball:
	def __init__(self, visual, canvas, canvas_width, canvas_height, x, y, vx=0, vy=0.03, radius=0.2, color="yellow"):
		self.start = [x, y]
		self.x = x
		self.y = y
		self.vx = vx
		self.vy = vy
		self.radius = radius
		self.visual = visual
		self.MAX_SPEED = 0.06
		self.canvas_width = canvas_width
		self.canvas_height = canvas_height

		if visual:
			self.canvas = canvas
			scaled_x, scaled_y = self.game_to_canvas(x, y)
			scaled_radius = self.scale_factor() * radius
			self.ball_id = self.canvas.create_oval(scaled_x - scaled_radius, scaled_y - scaled_radius, scaled_x + scaled_radius, scaled_y + scaled_radius, fill=color)

	def tp(self, x, y):
		x, y = self.game_to_canvas(x, y)
		self.canvas.moveto(self.ball_id, x, y)

	def scale_factor(self):
		if self.visual:
			game_width = 12
			return self.canvas_width / game_width
		return 1

	def game_to_canvas(self, game_x, game_y):
		if self.visual:
			scale = self.scale_factor()
			canvas_x = (game_x + 6) * scale
			canvas_y = (6 - game_y) * scale
			return canvas_x, canvas_y
		return game_x, game_y

	def canvas_to_game(self, canvas_x, canvas_y):
		if self.visual:
			scale = self.scale_factor()
			game_x = (canvas_x / scale) - 6
			game_y = 6 - (canvas_y / scale)
			return game_x, game_y
		return canvas_x, canvas_y

	def move(self):
		self.x += self.vx
		self.y += self.vy

		if self.visual:
			dx = self.vx * self.scale_factor()
			dy = -self.vy * self.scale_factor()
			self.canvas.move(self.ball_id, dx, dy)

	def get_center(self):
		return self.x, self.y

	def get_coords(self):
		if self.visual:
			return self.canvas.coords(self.ball_id)
		else:
			return self.x - self.radius, self.y - self.radius, self.x + self.radius, self.y + self.radius

	def reset(self, last_scorer=None):
		self.x = self.start[0]
		self.y = self.start[1]

		angle = random.uniform(-math.pi/4, math.pi/4)
		speed = 0.02

		if last_scorer == 1:
			self.vx = speed * math.sin(angle)
			self.vy = -speed * math.cos(angle)
		else:
			self.vx = speed * math.sin(angle)
			self.vy = speed * math.cos(angle)

		if self.visual:
			scaled_x, scaled_y = self.game_to_canvas(self.x, self.y)
			scaled_radius = self.scale_factor() * self.radius
			self.canvas.coords(
				self.ball_id,
				scaled_x - scaled_radius,
				scaled_y - scaled_radius,
				scaled_x + scaled_radius,
				scaled_y + scaled_radius
			)

class Paddle:
	def __init__(self, visual, canvas, canvas_width, canvas_height, x, y, color, width=1.5, height=0.5):
		self.x = x
		self.y = y
		self.hit = False
		self.start = [x, y]
		self.width = width
		self.height = height
		self.visual = visual
		self.speed = 0.1
		self.MAX_SPEED = 0.15
		self.canvas_width = canvas_width
		self.canvas_height = canvas_height

		if visual:
			self.canvas = canvas
			scaled_x, scaled_y = self.game_to_canvas(x, y)
			scaled_width = self.scale_factor() * width
			scaled_height = self.scale_factor() * height

			self.paddle = self.canvas.create_rectangle(
				scaled_x - scaled_width/2,
				scaled_y - scaled_height/2,
				scaled_x + scaled_width/2,
				scaled_y + scaled_height/2,
				fill=color
			)

	def scale_factor(self):
		if self.visual:
			game_width = 12
			return self.canvas_width / game_width
		return 1

	def game_to_canvas(self, game_x, game_y):
		if self.visual:
			scale = self.scale_factor()
			canvas_x = (game_x + 6) * scale
			canvas_y = (6 - game_y) * scale
			return canvas_x, canvas_y
		return game_x, game_y

	def canvas_to_game(self, canvas_x, canvas_y):
		if self.visual:
			scale = self.scale_factor()
			game_x = (canvas_x / scale) - 6
			game_y = 6 - (canvas_y / scale)
			return game_x, game_y
		return canvas_x, canvas_y

	def move_left(self):
		if self.x > -5:
			self.x -= self.speed
			if self.visual:
				dx = -self.speed * self.scale_factor()
				self.canvas.move(self.paddle, dx, 0)

	def move_right(self):
		if self.x < 5:
			self.x += self.speed
			if self.visual:
				dx = self.speed * self.scale_factor()
				self.canvas.move(self.paddle, dx, 0)

	def reset(self):
		self.hit = False
		self.x = self.start[0]
		self.y = self.start[1]
		self.speed = 0.1

		if self.visual:
			scaled_x, scaled_y = self.game_to_canvas(self.x, self.y)
			scaled_width = self.scale_factor() * self.width
			scaled_height = self.scale_factor() * self.height

			self.canvas.coords(
				self.paddle,
				scaled_x - scaled_width/2,
				scaled_y - scaled_height/2,
				scaled_x + scaled_width/2,
				scaled_y + scaled_height/2
			)

	def get_coords(self):
		if self.visual:
			return self.canvas.coords(self.paddle)
		else:
			return self.x - self.width/2, self.y - self.height/2, self.x + self.width/2, self.y + self.height/2

	def get_center(self):
		return self.x, self.y

class Game:
	def __init__(self, height, width, visual=False):
		self.winner = 0
		self.score1 = 0
		self.score2 = 0
		self.last_scorer = None
		self.num_hit = 0
		self.speed_increment = 0.0025

		self.width = 12
		self.height = 12

		self.canvas = None
		self.canvas_width = width
		self.canvas_height = height
		self.keys_pressed = {}
		self.visual = visual

		if visual:
			self.root = tk.Tk()
			self.root.title("Jeu Pong avec IA")
			self.canvas = tk.Canvas(self.root, width=width, height=height, bg="black")
			self.canvas.pack()
			self.root.bind("<KeyPress>", self.key_press)
			self.root.bind("<KeyRelease>", self.key_release)

		self.ball = Ball(visual, self.canvas, width, height, x=0, y=0, vx=0, vy=0.02, radius=0.2, color="yellow")
		self.prediction = Ball(visual, self.canvas, width, height, x=0, y=0, vx=0, vy=0, radius=0.1, color="green")

		self.paddle_bottom = Paddle(visual, self.canvas, width, height, 0, -6.5, color="green", width=1.5, height=0.5)
		self.paddle_top = Paddle(visual, self.canvas, width, height, 0, 6.5, color="purple", width=1.5, height=0.5)

	def key_press(self, event):
		self.keys_pressed[event.keysym] = True

	def key_release(self, event):
		self.keys_pressed[event.keysym] = False

	def get_actions(self, paddle):
		coming_towards_paddle = (self.ball.vy < 0 and paddle == self.paddle_bottom) or \
							   (self.ball.vy > 0 and paddle == self.paddle_top)

		if coming_towards_paddle:
			if paddle == self.paddle_bottom:
				distance_y = paddle.y - self.ball.y
			else:
				distance_y = self.ball.y - paddle.y

			if self.ball.vy == 0:
				projected_x = self.ball.x
			else:
				time_to_reach = abs(distance_y / self.ball.vy)
				projected_x = self.ball.x + self.ball.vx * time_to_reach

				while projected_x < -6 or projected_x > 6:
					if projected_x < -6:
						projected_x = -12 - projected_x
					if projected_x > 6:
						projected_x = 12 - projected_x

				strategic_offset = 0
				if self.ball.x > 0:
					strategic_offset = -0.3
				else:
					strategic_offset = 0.3

				projected_x += strategic_offset

			if paddle.x < projected_x - 0.05:
				return 1
			elif paddle.x > projected_x + 0.05:
				return 0
			else:
				return 2
		else:
			if paddle.x < -0.1:
				return 1
			elif paddle.x > 0.1:
				return 0
			else:
				return 2

	def check_collision_wall(self):
		if self.ball.x < -6 or self.ball.x > 6:
			self.ball.vx *= -1

		if self.ball.y < -6.5:
			self.score2 += 1
			self.last_scorer = 2
			self.winner = 2
		elif self.ball.y > 6.5:
			self.score1 += 1
			self.last_scorer = 1
			self.winner = 1

	def get_state(self):
		state = [
			self.ball.x,
			self.ball.y,
			self.ball.vx,
			self.ball.vy
			]
		return state

	def reset(self):
		self.winner = 0
		self.ball.reset(self.last_scorer)
		self.paddle_bottom.reset()
		self.paddle_top.reset()
		self.num_hit = 0
		return self.get_state()

	def check_collision_paddle(self):
		if (self.ball.y < -5 and self.ball.y > -6 and
			abs(self.ball.x - self.paddle_bottom.x) < self.paddle_bottom.width/2 + self.ball.radius):

			offset = self.ball.x - self.paddle_bottom.x
			max_bounce_angle = math.pi / 3
			bounce_angle = (offset / (self.paddle_bottom.width/2)) * max_bounce_angle

			speed = math.sqrt(self.ball.vx**2 + self.ball.vy**2)
			self.ball.vx = speed * math.sin(bounce_angle)
			self.ball.vy = abs(speed * math.cos(bounce_angle))

			self.num_hit += 1
			self.paddle_top.hit = True

		if (self.ball.y > 5 and self.ball.y < 6 and
			abs(self.ball.x - self.paddle_top.x) < self.paddle_top.width/2 + self.ball.radius):

			offset = self.ball.x - self.paddle_top.x
			max_bounce_angle = math.pi / 3
			bounce_angle = (offset / (self.paddle_top.width/2)) * max_bounce_angle

			speed = math.sqrt(self.ball.vx**2 + self.ball.vy**2)
			self.ball.vx = speed * math.sin(bounce_angle)
			self.ball.vy = -abs(speed * math.cos(bounce_angle))

			self.num_hit += 1
			self.paddle_top.hit = True

		if self.num_hit >= 2:
			self.ball.vx += math.copysign(self.speed_increment, self.ball.vx)
			self.ball.vy += math.copysign(self.speed_increment, self.ball.vy)

			self.ball.vx = math.copysign(min(abs(self.ball.vx), self.ball.MAX_SPEED), self.ball.vx)
			self.ball.vy = math.copysign(min(abs(self.ball.vy), self.ball.MAX_SPEED), self.ball.vy)

			self.paddle_bottom.speed = min(self.paddle_bottom.speed + self.speed_increment, self.paddle_bottom.MAX_SPEED)
			self.paddle_top.speed = min(self.paddle_top.speed + self.speed_increment, self.paddle_top.MAX_SPEED)

			self.num_hit = 0

	def move_paddle(self, paddle, action):
		if action == 0:
			paddle.move_left()
		elif action == 1:
			paddle.move_right()

	def step(self, bottom_action=None, top_action=None):
		if bottom_action is None:
			bottom_action = self.get_actions(self.paddle_bottom)
		if top_action is None:
			top_action = self.get_actions(self.paddle_top)

		self.ball.move()
		self.move_paddle(self.paddle_bottom, bottom_action)
		self.move_paddle(self.paddle_top, top_action)

		self.check_collision_wall()
		self.check_collision_paddle()

		game_over = False
		if self.winner != 0:
			game_over = True
			self.reset()

		return self.get_state(), game_over

	def run(self):
		while(1):
			self.step()
			self.root.update()
			time.sleep(0.017)

if __name__ == "__main__":
	game = Game(600, 600, visual=True)
	game.run()
	game.root.mainloop()
