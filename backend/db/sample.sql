CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    `email` TEXT NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `username` TEXT NOT NULL,
    `is_online` INTEGER NOT NULL CHECK (is_online IN (0,1)), 
    `created_at` REAL NOT NULL,
    `win_nbr` INTEGER NOT NULL DEFAULT 0,
    `loss_nbr` INTEGER NOT NULL DEFAULT 0,
    `avatar` TEXT NOT NULL,
    `background` TEXT NOT NULL,
    `last_login` REAL NOT NULL,
    `font_size` INTEGER NOT NULL DEFAULT 12,
    `token` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `friends` (
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `pending_friends` (
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `matchs` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    `player1` TEXT NOT NULL,
    `player2` TEXT NOT NULL,
    `winner` TEXT,
    `score` TEXT NOT NULL,
    `created_at` REAL NOT NULL
);
