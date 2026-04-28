<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * amenazaGigante implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * amenazagigante.game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */

require_once "modules/php/Game.php";

class amenazaGigante extends Game {
    
    // Constants for card types
    const HERO_CARD_TYPE = 'hero';
    const GIANT_CARD_TYPE = 'giant';
    
    // Constants for locations
    const LOCATION_DECK = 'deck';
    const LOCATION_HAND = 'hand';
    const LOCATION_TABLE = 'table';
    const LOCATION_DISCARD = 'discard';
    
    function __construct() {
        parent::__construct();
    }

    protected function getGameName() {
        return "amenazagigante";
    }

    protected function setupNewGame($players, $options = []) {
        parent::setupNewGame($players, $options);
        
        // Get default player colors from gameinfos
        $gameinfos = self::getGameinfos();
        $default_colors = $gameinfos['player_colors'];
        
        // Initialize game state variables
        self::initGameStateLabels([
            'current_round' => 10,
            'giant_life' => 11,
            'city_destruction' => 12,
        ]);
        
        self::setGameStateInitialValue('current_round', 1);
        self::setGameStateInitialValue('giant_life', 10);
        self::setGameStateInitialValue('city_destruction', 0);
        
        // Create players (set colors)
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = [];
        foreach ($players as $player_id => $player) {
            $color = array_shift($default_colors);
            $values[] = "('$player_id', '$color', '{$player['player_canal']}', '" . addslashes($player['player_name']) . "', '" . addslashes($player['player_avatar']) . "')";
        }
        $sql .= implode(',', $values);
        self::DbQuery($sql);
        self::reloadPlayersBasicInfos();
        
        // Initialize generalTracks table
        self::DbQuery("INSERT INTO generalTracks (giantLife, qualityAttack, qualityRepair, qualityMoral, supplyAmmo, supplyTools, supplyTrumpet, cityDestruction) 
                       VALUES (10, 1, 1, 5, 2, 2, 2, 6)");
        
        // Initialize rondels (3 rondels, position 1 each)
        self::DbQuery("INSERT INTO rondelPosition (rondel_char, rondel_location, rondel_enabled, last_movement, heroe_card) VALUES 
                       ('A', 1, TRUE, 0, NULL), 
                       ('B', 1, TRUE, 0, NULL), 
                       ('C', 1, TRUE, 0, NULL)");
        
        // Create heroes deck (9 heroes)
        $this->createHeroesDeck();
        
        // Create and shuffle giant cards deck
        $this->createGiantDeck();
        
        // Activate first player
        $this->activeNextPlayer();
    }
    
    private function createHeroesDeck() {
        // Create 9 hero cards (each hero is unique)
        for ($i = 1; $i <= 9; $i++) {
            self::DbQuery("INSERT INTO card (card_type, card_type_arg, card_location, card_location_arg, flipped) 
                           VALUES ('" . self::HERO_CARD_TYPE . "', $i, '" . self::LOCATION_DECK . "', 0, 0)");
        }
    }
    
    private function createGiantDeck() {
        // Create 9 giant action cards
        for ($i = 1; $i <= 9; $i++) {
            self::DbQuery("INSERT INTO card (card_type, card_type_arg, card_location, card_location_arg, flipped) 
                           VALUES ('" . self::GIANT_CARD_TYPE . "', $i, '" . self::LOCATION_DECK . "', 0, 0)");
        }
        
        // Shuffle the giant deck
        self::DbQuery("UPDATE card SET card_location_arg = RAND() WHERE card_type = '" . self::GIANT_CARD_TYPE . "'");
        self::DbQuery("UPDATE card SET card_location = 'deck' WHERE card_type = '" . self::GIANT_CARD_TYPE . "'");
    }

    protected function getAllDatas(): array {
        return parent::getAllDatas();
    }

    function upgradeTableDb($from_version) {
        parent::upgradeTableDb($from_version);
    }
    
    // State machine action for game setup
    function stGameSetup() {
        // Game is already initialized in setupNewGame
        // Just transition to the next state
        $this->goToState(STATE_PLAYER_SELECT_HEROES);
    }
    
    //////////////////////////////////////////////////////////
    // STATE: STATE_PLAYER_SELECT_HEROES
    //////////////////////////////////////////////////////////
    
    /**
     * Called when entering STATE_PLAYER_SELECT_HEROES
     * Returns arguments for the state
     */
    function argSelectHeroes() {
        // Get all available heroes from deck
        $heroes = $this->getHeroesInDeck();
        
        // Add type information to each hero
        foreach ($heroes as &$hero) {
            $hero_id = $hero['hero_id'];
            if ($hero_id >= 1 && $hero_id <= 3) {
                $hero['type'] = 'A';
            } elseif ($hero_id >= 4 && $hero_id <= 6) {
                $hero['type'] = 'B';
            } else {
                $hero['type'] = 'C';
            }
        }
        
        // Also provide heroCards for compatibility with existing UI
        $heroCards = [];
        foreach ($heroes as $hero) {
            $heroCards[] = [
                'id' => $hero['card_id'],
                'type' => 'hero',
                'type_arg' => $hero['hero_id'],
                'location' => 'deck',
                'location_arg' => 0,
            ];
        }
        
        return [
            'heroes' => $heroes,
            'heroCards' => $heroCards,
            'nbToSelect' => 3,
        ];
    }
    
    /**
     * Get all heroes currently in deck
     */
    private function getHeroesInDeck() {
        $sql = "SELECT card_id, card_type_arg as hero_id 
                FROM card 
                WHERE card_type = 'hero' AND card_location = 'deck' 
                ORDER BY card_id";
        return self::getCollectionFromDb($sql);
    }
    
    /**
     * Player action: select 3 heroes
     */
    function actSelectHeroes($hero_ids) {
        self::checkAction('selectHeroes');
        
        $player_id = self::getActivePlayerId();
        
        // Validate: must select exactly 3 heroes
        $hero_array = is_array($hero_ids) ? $hero_ids : explode(',', $hero_ids);
        if (count($hero_array) != 3) {
            throw new BgaUserException(self::_("You must select exactly 3 heroes"));
        }
        
        // Validate: all heroes must be valid IDs from deck
        $valid_heroes = array_keys($this->getHeroesInDeck());
        foreach ($hero_array as $hero_id) {
            if (!in_array($hero_id, $valid_heroes)) {
                throw new BgaUserException(self::_("Invalid hero selection"));
            }
        }
        
        // Validate: must select 1 from each type (A: 1-3, B: 4-6, C: 7-9)
        $typeA = $typeB = $typeC = false;
        foreach ($hero_array as $hero_id) {
            if ($hero_id >= 1 && $hero_id <= 3) {
                $typeA = true;
            } elseif ($hero_id >= 4 && $hero_id <= 6) {
                $typeB = true;
            } elseif ($hero_id >= 7 && $hero_id <= 9) {
                $typeC = true;
            }
        }
        
        if (!$typeA || !$typeB || !$typeC) {
            throw new BgaUserException(self::_("You must select 1 hero from each type (A, B, C)"));
        }
        
        // Move selected heroes to player's hand/table
        foreach ($hero_array as $hero_id) {
            self::DbQuery("UPDATE card SET card_location = 'hand', card_location_arg = $player_id 
                          WHERE card_type = 'hero' AND card_type_arg = $hero_id");
        }
        
        // Notify players
        self::notifyAllPlayers("heroesSelected", clienttranslate('${player_name} selected their heroes'), [
            'player_id' => $player_id,
            'player_name' => self::getActivePlayerName(),
            'hero_ids' => $hero_array,
        ]);
        
        // Transition to next state
        $this->goToState(STATE_GIANT_ADVANCE);
    }
}