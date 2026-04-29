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

class amenazaGigante extends Game
{

    // Constants for card types
    const HERO_CARD_TYPE = 'hero';
    const GIANT_CARD_TYPE = 'giant';

    // Constants for locations
    const LOCATION_DECK = 'deck';
    const LOCATION_HAND = 'hand';
    const LOCATION_TABLE = 'table';
    const LOCATION_DISCARD = 'discard';

    function __construct()
    {
        parent::__construct();
    }

    protected function getGameName()
    {
        return "amenazagigante";
    }

    protected function setupNewGame($players, $options = [])
    {
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

    private function createHeroesDeck()
    {
        // Create 9 hero cards (each hero is unique)
        for ($i = 1; $i <= 9; $i++) {
            self::DbQuery("INSERT INTO card (card_type, card_type_arg, card_location, card_location_arg, flipped) 
                           VALUES ('" . self::HERO_CARD_TYPE . "', $i, '" . self::LOCATION_DECK . "', 0, 0)");
        }
    }

    private function createGiantDeck()
    {
        // Create 9 giant action cards
        for ($i = 1; $i <= 9; $i++) {
            self::DbQuery("INSERT INTO card (card_type, card_type_arg, card_location, card_location_arg, flipped) 
                           VALUES ('" . self::GIANT_CARD_TYPE . "', $i, '" . self::LOCATION_DECK . "', 0, 0)");
        }

        // Shuffle the giant deck
        self::DbQuery("UPDATE card SET card_location_arg = RAND() WHERE card_type = '" . self::GIANT_CARD_TYPE . "'");
        self::DbQuery("UPDATE card SET card_location = 'deck' WHERE card_type = '" . self::GIANT_CARD_TYPE . "'");
    }

    protected function getAllDatas(): array
    {
        return parent::getAllDatas();
    }

    function upgradeTableDb($from_version)
    {
        parent::upgradeTableDb($from_version);
    }

    // State machine action for game setup
    function stGameSetup()
    {
        // Game is already initialized in setupNewGame
        // Just transition to the next state
        $this->goToState(STATE_PLAYER_SELECT_HEROES);
    }

    public function stGiantAdvance()
    {
        // 1. Revelar la carta (si es necesario)
        $card = $this->giantCards->drawCard('deck', 'display');

        // 2. Obtener posición del gigante
        $currentPos = $this->getGameStateValue("giant_position"); // Ej: 0 a 10

        // 3. Determinar zona (Superior, Media, Inferior)
        // Supongamos: 0-3 Inferior, 4-7 Media, 8-10 Superior
        $zone = $this->calculateGiantZone($currentPos);

        // 4. Notificar al front para que anime la carta dándose vuelta
        $this->notifyAllPlayers("giantCardRevealed", "", [
            'card' => $card,
            'zone' => $zone
        ]);

        // 5. Ir al estado donde el jugador elige
        $this->gamestate->nextState("playerDecision");
    }

    public function argGiantChoice()
    {
        $card = $this->giantCards->getCardsInLocation('display')[0];
        $giantPos = $this->getGameStateValue("giant_position");
        $zone = $this->calculateGiantZone($giantPos);

        // Mapeamos la carta según tu material.inc.php
        // Las acciones disponibles dependen de la zona
        $availableActions = $this->giantCardDefinition[$card['type']]['actions'][$zone];

        return [
            'card_id' => $card['id'],
            'zone' => $zone,
            'options' => $availableActions // Ej: ['Ataque', 'Daño Ciudad', 'Movimiento']
        ];
    }

    //////////////////////////////////////////////////////////
    // STATE: STATE_PLAYER_SELECT_HEROES
    //////////////////////////////////////////////////////////

    /**
     * Called when entering STATE_PLAYER_SELECT_HEROES
     * Returns arguments for the state
     */
    function argSelectHeroes()
    {
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

        return [
            'heroes' => $heroes,
            'nbToSelect' => 3,
        ];
    }

    /**
     * Get all heroes currently in deck
     */
    private function getHeroesInDeck()
    {
        $sql = "SELECT card_id, card_type_arg as hero_id 
                FROM card 
                WHERE card_type = 'hero' AND card_location = 'deck' 
                ORDER BY card_id";
        return self::getCollectionFromDb($sql);
    }

    /**
     * Player action: select 3 heroes
     */
    public function actSelectHeroes($cardA, $cardB, $cardC)
    {
        // 1. Verificamos que sea el turno del jugador y el estado sea el correcto
        $this->checkAction('actSelectHeroes');

        $playerId = (int) $this->getCurrentPlayerId();
        $cards = [$cardA, $cardB, $cardC];

        // 2. Validación de Integridad: ¿Existen estas cartas y son de los tipos correctos?
        // Podés usar una consulta SQL o mirar en tu material.inc.php
        foreach ($cards as $cardId) {
            $cardInfo = $this->getCardInfo($cardId); // Método helper que deberías tener
            if (!$cardInfo || $cardInfo['location'] !== 'deck') {
                throw new BgaUserException($this->_("Una de las cartas elegidas no es válida."));
            }
        }

        // 3. Persistencia (Update en DB)
        // Asignamos las cartas al jugador y las movemos a su mano/rondel
        $sql = "UPDATE card SET card_location = 'hand', card_location_arg = '$playerId' 
            WHERE card_id IN (" . implode(',', $cards) . ")";
        $this->DbQuery($sql);

        // 4. Notificar a los demás (Opcional en esta fase si es simultáneo)
        $this->notifyPlayer($playerId, "heroesSelected", "", [
            "hero_ids" => $cards
        ]);

        // 5. Máquina de Estados: Avanzar
        // Si todos los jugadores eligieron, el framework pasará al siguiente estado
        $this->gamestate->setPlayerActionDone($playerId);
    }
}
