CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    `email` TEXT NOT NULL UNIQUE,
    `password` TEXT NOT NULL,
    `username` TEXT NOT NULL,
    `is_online` INTEGER NOT NULL CHECK (is_online IN (0,1)), 
    `created_at` REAL NOT NULL,
    `win_nbr` INTEGER NOT NULL DEFAULT 0,
    `loss_nbr` INTEGER NOT NULL DEFAULT 0,
    `avatar` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `friends` (
    `user_id` INTEGER NOT NULL,
    `friend_id` INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `matches` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    `date` REAL NOT NULL,
    `is_tournament` INTEGER NOT NULL CHECK (is_tournament IN (0,1)),
    `winner` INTEGER,
    `score` TEXT NOT NULL,
    FOREIGN KEY (`winner`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `match_participants` (
    `match_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    PRIMARY KEY (match_id, user_id),
    FOREIGN KEY (match_id) REFERENCES `matches`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `tournaments` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL,
    `name` TEXT NOT NULL,
    `password` TEXT,
    `created_at` REAL NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `duration` INTEGER,
    `type` INTEGER NOT NULL,
    `winner` INTEGER,
    FOREIGN KEY (`winner`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `tournament_members` (
    `tournament_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    PRIMARY KEY (tournament_id, user_id),
    FOREIGN KEY (tournament_id) REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES `users`(`id`) ON DELETE CASCADE
);
