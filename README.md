# 🖥️ ft_transcendance (Windows XPong) 🖥️

<div align="center">
<img src="./frontend/img/Readme/WindowsXPong.jpg" alt="Windows XP Banner" width="900"/>

*A nostalgic web-based multiplayer Pong game with modern features*

[![42 School Project](https://img.shields.io/badge/42%20School-Project-brightgreen?style=for-the-badge&logo=42&logoColor=white)](https://42.fr/)
</div>

## 🚀 Welcome to ft_transcendance!

This project is the culmination of the 42 school common core, a **feature-rich multiplayer Pong game** with real-time chat, user profiles, and tournament systems - all wrapped in a delightful Windows XP inspired interface.

---

## 📋 Table of Contents

- [🔍 Overview](#-overview)
- [✨ Features](#-features)
- [💻 Installation](#-installation)
- [🎮 How to Play](#-how-to-play)
- [🧩 Technologies](#-technologies)
- [🛠️ Configuration](#-configuration)
- [👥 Team](#-team)
- [❓ FAQ](#-faq)

---

## 🔍 Overview

**ft_transcendance** transforms the classic Pong game into a modern web application. We've built it using NestJS for the backend, with a PostgreSQL database, and a responsive frontend - all containerized with Docker for easy deployment.

<div align="center">
<img src="./frontend/img/Readme/readme-divider-features.jpg" alt="Windows XP Style Divider"/>
</div>

## ✨ Features

### 🎮 Game Features
- **Real-time Pong Gameplay** - Experience smooth, responsive gameplay
- **Tournaments** - Compete in organized tournaments

### 👤 User Features
- **User Authentication** - Secure login with OAuth 2.0
- **Profile Customization** - Avatars, stats, and achievement displays
- **Friend System** - Add friends and challenge them to matches

### 💬 Social Features
- **Game Stats** - Watch your games history with stats
- **Leaderboards** - See who ranks highest

<div align="center">
<img src="./frontend/img/Readme/readme-divider-install.jpg" alt="Windows XP Style Divider"/>
</div>

## 💻 Installation

```bash
# Clone the repository
git clone https://github.com/Axiaaa/ft_transcendance.git

# Navigate to project directory
cd ft_transcendance

# Start the application using Docker Compose
make
```

Then visit `https://localhost:443` in your browser!

<div align="center">
<img src="./frontend/img/Readme/readme-divider-howtoplay.jpg" alt="Windows XP Style Divider"/>
</div>

## 🎮 How to Play

1. **Create an Account** - Sign up or login through OAuth
2. **Find a Match** - Use quick play or challenge a friend
3. **Play the Game** - Control your paddle with mouse or keyboard

<div align="center">
<img src="./frontend/img/Readme/readme-divider-technos.jpg" alt="Game Controls"/>
</div>

## 🧩 Technologies

- **Backend**: NodeJS
- **Frontend**: Typescript & BabylonJS
- **Database**: SQlite
- **Containerization**: Docker & Docker Compose

<div align="center">
<img src="./frontend/img/Readme/readme-divider-features.jpg" alt="Windows XP Style Divider"/>
</div>

## 🛠️ Configuration

The application can be configured through environment variables in the `.env` file:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=transcendance

# OAuth Configuration
OAUTH_CLIENT_ID=your_client_id
OAUTH_CLIENT_SECRET=your_client_secret
```

<div align="center">
<img src="./frontend/img/Readme/readme-divider-features.jpg" alt="Windows XP Style Divider"/>
</div>

## 👥 Team

This project was created with love by:
- [Jcuzin](https://github.com/Ocyn)
- [Lcamerly](https://github.com/Axiaaa)
- [Aammirat](https://github.com/nonomex)
- [Mcourbon](https://github.com/mcourbon)
- [Yallo](https://github.com/Sarfoula)

<div align="center">
<img src="./frontend/img/Readme/readme-divider-faq.jpg" alt="Windows XP Style Divider"/>
</div>

## ❓ FAQ

**Q: Is my data secure?**  
A: Yes! We use industry-standard encryption and offer 2FA for added security.

**Q: Can I play on mobile?**  
A: Absolutely! Our responsive design works on all devices.

**Q: How is matchmaking determined?**  
A: Players are matched based on skill level determined by win/loss ratios.

---

<div align="center">
<p>© 2023 ft_transcendance Team | <a href="https://github.com/Axiaaa/ft_transcendance.git">GitHub Repository</a></p>

*You've just experienced a blast from the past with our Windows XP-themed README!*
</div>