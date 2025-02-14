CREATE TABLE IF NOT EXISTS `users` (
	`id` INTEGER NOT NULL,
	`email` TEXT NOT NULL,
	`password` TEXT NOT NULL,
	`username` TEXT NOT NULL,
	`is_online` REAL NOT NULL,
	`created_at` REAL NOT NULL,
	`history` INTEGER NOT NULL,
	`win_nbr` INTEGER NOT NULL,
	`loss_nbr` INTEGER NOT NULL,
	`avatar` TEXT NOT NULL,
	`friend_list` INTEGER NOT NULL,
FOREIGN KEY(`email`) REFERENCES `fornecedor`(`id`),
FOREIGN KEY(`password`) REFERENCES `klasa`(`id`),
FOREIGN KEY(`is_online`) REFERENCES `prodotti`(`id`),
FOREIGN KEY(`history`) REFERENCES `Match`(`id`),
FOREIGN KEY(`friend_list`) REFERENCES `users`(`id`)
);
CREATE TABLE IF NOT EXISTS `tournaments` (
	`id` integer primary key NOT NULL UNIQUE,
	`members` BLOB NOT NULL,
	`winner` INTEGER NOT NULL,
	`created_at` REAL NOT NULL,
	`duration` INTEGER NOT NULL,
	`type` INTEGER NOT NULL,
FOREIGN KEY(`members`) REFERENCES `users`(`id`),
FOREIGN KEY(`winner`) REFERENCES `users`(`id`)
);
CREATE TABLE IF NOT EXISTS `Match` (
	`id` integer primary key NOT NULL UNIQUE,
	`users` INTEGER NOT NULL,
	`is_tournament` TEXT NOT NULL,
	`winner` INTEGER NOT NULL,
	`score` INTEGER NOT NULL,
	`date` REAL NOT NULL,
FOREIGN KEY(`users`) REFERENCES `users`(`id`),
FOREIGN KEY(`winner`) REFERENCES `users`(`id`)
);