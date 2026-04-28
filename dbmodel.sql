-- ------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- amenazaGigante implementation : © <Your name here> <Your email address here>
--
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

-- CREATE TABLE IF NOT EXISTS `card` (
--   `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `card_type` varchar(16) NOT NULL,
--   `card_type_arg` int(11) NOT NULL,
--   `card_location` varchar(16) NOT NULL,
--   `card_location_arg` int(11) NOT NULL,
--   PRIMARY KEY (`card_id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- Example 2: add a custom field to the standard "player" table
-- ALTER TABLE `player` ADD `player_my_custom_field` INT UNSIGNED NOT NULL DEFAULT '0';

-- CREATE TABLE IF NOT EXISTS `heroesCard` (
--     `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--     `card_type` varchar(16) NOT NULL,
--     `card_type_arg` int(11) NOT NULL,
--     `card_location` varchar(16) NOT NULL,
--     `card_location_arg` int(11) NOT NULL,
--     PRIMARY KEY (`card_id`)
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;

-- CREATE TABLE IF NOT EXISTS `giantCard` (
--     `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--     `card_type` varchar(16) NOT NULL,
--     `card_type_arg` int(11) NOT NULL,
--     `card_location` varchar(16) NOT NULL,
--     `card_location_arg` int(11) NOT NULL,
--     PRIMARY KEY (`card_id`)
-- ) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `generalTracks` (
    `giantLife` int(10) unsigned NOT NULL DEFAULT 10,
    `qualityAttack` int(10) unsigned NOT NULL DEFAULT 1,
    `qualityRepair` int(10) unsigned NOT NULL DEFAULT 1,
    `qualityMoral` int(10) unsigned NOT NULL DEFAULT 5,
    `supplyAmmo` int(10) unsigned NOT NULL DEFAULT 2,
    `supplyTools` int(10) unsigned NOT NULL DEFAULT 2,
    `supplyTrumpet` int(10) unsigned NOT NULL DEFAULT 2,
    `cityDestruction` int(10) unsigned NOT NULL DEFAULT 6
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `rondelPosition` (
    `rondel_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `rondel_char` CHAR(1) NOT NULL CHECK (`rondel_char` IN ('A', 'B', 'C')),
    `rondel_location` TINYINT UNSIGNED NOT NULL DEFAULT 1 CHECK (`rondel_location` BETWEEN 1 AND 8),
    `rondel_enabled` BOOLEAN NOT NULL DEFAULT TRUE,
    `last_movement` INT(4) NOT NULL DEFAULT 0,
    `heroe_card` INT(10) NOT NULL,
    PRIMARY KEY (`rondel_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8 AUTO_INCREMENT = 1;

CREATE TABLE IF NOT EXISTS `card` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(25) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  `flipped` tinyint unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;