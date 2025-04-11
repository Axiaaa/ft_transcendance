import tkinter as tk
import math
import random

class PongGame:
	def __init__(self, master):
		self.master = master
		self.master.title("Pong 2D")
		self.master.geometry("800x600")
		self.master.resizable(False, False)
		self.master.configure(bg="black")

		self.num_hit = 0
		self.speed_increment = 0.2
		self.ball_speed_reached_max = False
		self.game_is_finished = False
		self.last_scorer = None

		self.field_width = 800
		self.field_height = 600
		self.paddle_width = 100
		self.paddle_height = 20
		self.ball_size = 20

		self.paddle_speed = 8
		self.max_paddle_speed = 12
		self.max_ball_speed = 12
		self.ball_speed = {"x": 10, "y": 0}

		self.player1_color = "#00FF00"
		self.player2_color = "#800080"
		self.ball_color = "#FFFF00"

		self.canvas = tk.Canvas(self.master,width=self.field_width,height=self.field_height,bg="black",highlightthickness=0)
		self.canvas.pack()

		self.create_paddles()
		self.create_ball()

		self.keys = {"Up": False, "Down": False, "w": False, "s": False}
		self.master.bind("<KeyPress>", self.key_press)
		self.master.bind("<KeyRelease>", self.key_release)

	def create_paddles(self):
		self.paddle1 = self.canvas.create_rectangle(30, self.field_height/2-self.paddle_height/2 - self.paddle_width/2,30+self.paddle_height, self.field_height/2+self.paddle_height/2 + self.paddle_width/2,fill=self.player1_color, outline=self.player1_color)
		self.paddle2 = self.canvas.create_rectangle(self.field_width-30-self.paddle_height, self.field_height/2-self.paddle_height/2 - self.paddle_width/2,self.field_width-30, self.field_height/2+self.paddle_height/2 + self.paddle_width/2,fill=self.player2_color, outline=self.player2_color)

	def create_ball(self):
		self.ball = self.canvas.create_oval(self.field_width/2-self.ball_size/2, self.field_height/2-self.ball_size/2,self.field_width/2+self.ball_size/2, self.field_height/2+self.ball_size/2,fill=self.ball_color, outline=self.ball_color)

	def key_press(self, event):
		key = event.keysym
		if key in self.keys:
			self.keys[key] = True

	def key_release(self, event):
		key = event.keysym
		if key in self.keys:
			self.keys[key] = False

	def move_paddles(self):
		if self.keys["w"] and self.canvas.coords(self.paddle1)[1] > 10:
			self.canvas.move(self.paddle1, 0, -self.paddle_speed)
		if self.keys["s"] and self.canvas.coords(self.paddle1)[3] < self.field_height-10:
			self.canvas.move(self.paddle1, 0, self.paddle_speed)

		if self.keys["Up"] and self.canvas.coords(self.paddle2)[1] > 10:
			self.canvas.move(self.paddle2, 0, -self.paddle_speed)
		if self.keys["Down"] and self.canvas.coords(self.paddle2)[3] < self.field_height-10:
			self.canvas.move(self.paddle2, 0, self.paddle_speed)

	def check_collision(self):
		ball_coords = self.canvas.coords(self.ball)
		paddle1_coords = self.canvas.coords(self.paddle1)
		paddle2_coords = self.canvas.coords(self.paddle2)

		ball_center_x = (ball_coords[0] + ball_coords[2]) / 2
		ball_center_y = (ball_coords[1] + ball_coords[3]) / 2

		if ball_coords[1] <= 10 or ball_coords[3] >= self.field_height-10:
			self.ball_speed["y"] *= -1

		if (ball_coords[0] <= paddle1_coords[2] and
			ball_coords[2] >= paddle1_coords[0] and
			ball_coords[3] >= paddle1_coords[1] and
			ball_coords[1] <= paddle1_coords[3] and
			self.ball_speed["x"] < 0):

			paddle1_center = (paddle1_coords[1] + paddle1_coords[3]) / 2
			offset = (ball_center_y - paddle1_center) / (self.paddle_width/2)
			max_bounce_angle = math.pi / 3
			bounce_angle = offset * max_bounce_angle

			speed = math.sqrt(self.ball_speed["x"]**2 + self.ball_speed["y"]**2)
			self.ball_speed["x"] = abs(speed * math.cos(bounce_angle))
			self.ball_speed["y"] = speed * math.sin(bounce_angle)

			self.num_hit += 1

			self.canvas.itemconfig(self.paddle1, fill="#FFFFFF")
			self.master.after(100, lambda: self.canvas.itemconfig(self.paddle1, fill=self.player1_color))

		if (ball_coords[2] >= paddle2_coords[0] and
			ball_coords[0] <= paddle2_coords[2] and
			ball_coords[3] >= paddle2_coords[1] and
			ball_coords[1] <= paddle2_coords[3] and
			self.ball_speed["x"] > 0):

			paddle2_center = (paddle2_coords[1] + paddle2_coords[3]) / 2
			offset = (ball_center_y - paddle2_center) / (self.paddle_width/2)
			max_bounce_angle = math.pi / 3
			bounce_angle = offset * max_bounce_angle

			speed = math.sqrt(self.ball_speed["x"]**2 + self.ball_speed["y"]**2)
			self.ball_speed["x"] = -abs(speed * math.cos(bounce_angle))
			self.ball_speed["y"] = speed * math.sin(bounce_angle)

			self.num_hit += 1

			self.canvas.itemconfig(self.paddle2, fill="#FFFFFF")
			self.master.after(100, lambda: self.canvas.itemconfig(self.paddle2, fill=self.player2_color))

		if self.num_hit >= 5:
			self.ball_speed["x"] += math.copysign(self.speed_increment, self.ball_speed["x"])
			self.ball_speed["y"] += math.copysign(self.speed_increment, self.ball_speed["y"])

			self.ball_speed["x"] = min(abs(self.ball_speed["x"]), self.max_ball_speed) * math.copysign(1, self.ball_speed["x"])
			self.ball_speed["y"] = min(abs(self.ball_speed["y"]), self.max_ball_speed) * math.copysign(1, self.ball_speed["y"])

			if abs(self.ball_speed["x"]) == self.max_ball_speed and not self.ball_speed_reached_max:
				self.ball_speed_reached_max = True

			self.paddle_speed = min(self.paddle_speed + self.speed_increment, self.max_paddle_speed)

			self.num_hit = 0

		if ball_coords[0] <= 10:
			self.last_scorer = 2
			self.reset()

		if ball_coords[2] >= self.field_width-10:
			self.last_scorer = 1
			self.reset()

	def reset(self):
		self.canvas.coords(self.ball,self.field_width/2-self.ball_size/2, self.field_height/2-self.ball_size/2,self.field_width/2+self.ball_size/2, self.field_height/2+self.ball_size/2)
		self.canvas.coords(self.paddle1,30, self.field_height/2-self.paddle_height/2 - self.paddle_width/2,30+self.paddle_height, self.field_height/2+self.paddle_height/2 + self.paddle_width/2)
		self.canvas.coords(self.paddle2,self.field_width-30-self.paddle_height, self.field_height/2-self.paddle_height/2 - self.paddle_width/2,self.field_width-30, self.field_height/2+self.paddle_height/2 + self.paddle_width/2)

		self.paddle_speed = 8
		self.num_hit = 0

		if self.last_scorer == 1:
			self.ball_speed = {"x": 10, "y": 0}
		else:
			self.ball_speed = {"x": -10, "y": 0}

	def restart_game(self):
		self.game_is_finished = False

		self.reset()

		self.game_loop()

	def game_loop(self):
		if not self.game_is_finished:
			self.move_paddles()
			self.canvas.move(self.ball, self.ball_speed["x"], self.ball_speed["y"])
			self.check_collision()
			self.master.after(16, self.game_loop)

	def get_state(self):
		ball_coords = self.canvas.coords(self.ball)
		paddle1_coords = self.canvas.coords(self.paddle1)
		paddle2_coords = self.canvas.coords(self.paddle2)

		ball_pos = []

if __name__ == "__main__":
	root = tk.Tk()
	game = PongGame(root)
	game.game_loop()
	root.mainloop()
