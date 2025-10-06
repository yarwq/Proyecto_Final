CREATE DATABASE IF NOT EXISTS draftosaurus;
USE draftosaurus;

CREATE TABLE IF NOT EXISTS users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
-- Tabla para almacenar los datos de cada partida
CREATE TABLE IF NOT EXISTS `games` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `status` ENUM('in_progress', 'finished') NOT NULL DEFAULT 'in_progress',
  `current_turn` INT(11) NOT NULL DEFAULT 1,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `finished_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para vincular jugadores a una partida y guardar su información
CREATE TABLE IF NOT EXISTS `game_players` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `game_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `hand_dinos` JSON, -- Almacena los dinosaurios que le quedan en la mano
  `score` INT(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla para guardar la ubicación de cada dinosaurio colocado
CREATE TABLE IF NOT EXISTS `dinosaur_placements` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `game_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `dinosaur_type` VARCHAR(50) NOT NULL,
  `enclosure_name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`game_id`) REFERENCES `games`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;