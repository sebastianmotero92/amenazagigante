<?php

// namespace App\Utils;

// require_once(__DIR__ . '/../objects/card.php');

// use BgaVisibleSystemException;
// use App\Objects\Card; // Ensure the Card class exists in the specified namespace
// use Bga\Games\amenazaGigante\GiantData;
// use const Bga\Games\amenazaGigante\GIANT_CARD_AREA;
// use const Bga\Games\amenazaGigante\TRACK;
// use const Bga\Games\amenazaGigante\GIANT_NEXT_PATH;

function array_find(array $array, callable $fn)
{
    foreach ($array as $value) {
        if ($fn($value)) {
            return $value;
        }
    }
    return null;
}

function array_find_key(array $array, callable $fn)
{
    foreach ($array as $key => $value) {
        if ($fn($value)) {
            return $key;
        }
    }
    return null;
}

function array_some(array $array, callable $fn)
{
    foreach ($array as $value) {
        if ($fn($value)) {
            return true;
        }
    }
    return false;
}

function array_every(array $array, callable $fn)
{
    foreach ($array as $value) {
        if (!$fn($value)) {
            return false;
        }
    }
    return true;
}

function array_identical(array $a1, array $a2)
{
    if (count($a1) != count($a2)) {
        return false;
    }
    for ($i = 0; $i < count($a1); $i++) {
        if ($a1[$i] != $a2[$i]) {
            return false;
        }
    }
    return true;
}

trait UtilsTrait
{
    function getCardFromDb(?array $dbCard): ?Card
    {
        if ($dbCard == null) {
            return null;
        }
        // var_dump('PEPE');
        // var_dump($dbCard);
        // var_dump($this->CARDS);
        $cardType = $dbCard['card_type'];
        if ($cardType == "2") {
            return new GiantCard($dbCard, $this->CARDS);
        } else {
            return new HeroCard($dbCard, $this->CARDS);
        }
    }

    function getTrackStateFromDb($trackState): ?TrackState
    {
        if ($trackState == null) {
            return null;
        }

        return new TrackState($trackState);
    }

    function mapSectorToNumber(SectionPosition $sector)
    {
        switch ($sector) {
            case SectionPosition::TOP:
                return 0;
                break;
            case SectionPosition::MIDDLE:
                return 1;
                break;
            case SectionPosition::BOTTOM:
                return 2;
                break;
            default:
                # code...
                break;
        }
    }

    function setupCards()
    {
        foreach ([1, 2] as $row) {
            $cards = [];
            foreach ($this->CARDS[$row] as $index => $cardType) {
                $cards[] = ['type' => $row, 'type_arg' => $index, 'nbr' => 1];
            }

            // 1 => heroes | 2 => giant path
            $this->cards->createCards($cards, "deck$row");
            $this->cards->shuffle("deck$row");
        }
        // $this->pickNewGiantCard();
    }

    function selectHeroes($heroeCards)
    {
        // $heroeCards = [x, y, z];
        $inClause = implode(',', array_map('intval', $heroeCards));

        $sql = "SELECT * 
        FROM card 
        WHERE card_type = 1 
        AND card_type_arg IN ($inClause)";

        // $cards = self::getObjectListFromDb($sql, $heroeCards);
        $cards = $this->getCollectionFromDb($sql);
        // $this->dump("pepe", json_encode($cards));

        foreach ($cards as $card) {
            // var_dump("pepe", json_encode($cards));
            $this->cards->moveCard($card['card_id'], TABLE_HEROE, $card['card_type_arg']);
        }
    }

    function pickNewGiantCard(int $pos)
    {
        $this->cards->pickCardsForLocation(1, GIANT_DECK, TABLE_GIANT, $pos);
    }

    function getCardById(int $id)
    {
        $sql = "SELECT * FROM `card` WHERE `card_id` = $id";
        $dbResults = $this->getCollectionFromDb($sql);
        $cards = array_map(fn($dbCard) => $this->getCardFromDb($dbCard), array_values($dbResults));
        return count($cards) > 0 ? $cards[0] : null;
    }

    function getCardsByLocation(string $location, ?int $location_arg = null, ?int $type = null, ?int $index = null)
    {
        $sql = "SELECT * FROM `card` WHERE `card_location` = '$location'";
        if ($location_arg !== null) {
            $sql .= " AND `card_location_arg` = $location_arg";
        }
        if ($type !== null) {
            $sql .= " AND `card_type` = $type";
        }
        if ($index !== null) {
            $sql .= " AND `card_type_arg` = $index";
        }
        $sql .= " ORDER BY `card_location_arg`";
        $dbResults = $this->getCollectionFromDb($sql);
        return array_map(fn($dbCard) => $this->getCardFromDb($dbCard), array_values($dbResults));
    }


    // GIANT

    public function matchSectorEnum($sectorStr)
    {
        return match ($sectorStr) {
            'top' => SectionPosition::TOP,
            'middle' => SectionPosition::MIDDLE,
            'bottom' => SectionPosition::BOTTOM,
            default => throw new BgaVisibleSystemException("Sector desconocido: $sectorStr"),
        };
    }

    public function advanceGiantPos()
    {
        $currentPos = $this->getGiantPos();
        $newPos = $currentPos + 1;
        $this->setGameStateValue('giant_position_card', $newPos);
        return (int) $newPos;
    }

    // GLOBAL VARS
    public function getGiantArea(): int
    {
        return $this->setGameStateValue('giant_position_area');
    }

    public function setGiantArea(int $area): void
    {
        $this->setGameStateValue('giant_position_area', $area);
    }

    public function getGameState(): int
    {
        return $this->getGameStateValue('game_state');
    }

    public function setGameState(int $stateGame): void
    {
        $this->setGameStateValue('game_state', $stateGame);
    }

    public function getGiantPos(): int
    {
        return (int) $this->getGameStateValue('giant_position_card');         // returns 1 - 9
    }

    public function setGiantPos(int $giantPos): void
    {
        $this->setGameStateValue('giant_position_card', $giantPos);
    }



    public function getNextGiantAreaByGCard(int $gcard)
    {
        return GIANT_NEXT_PATH[$gcard];
    }

    public function getGiantPosArea()
    {
        return GIANT_CARD_AREA[(int) $this->getGameStateValue('giant_position_area')];
    }

    // TRACKS
    public function getGameTracksState()
    {
        $dbResults = $this->getObjectFromDB("SELECT * FROM generalTracks");
        if ($dbResults == null) {
            return null;
        }

        return new TrackState($dbResults);
    }

    public function getGameTracksStateByState($columns)
    {
        $validColumns = [
            'giantLife',
            'qualityAttack',
            'qualityRepair',
            'qualityMoral',
            'supplyAmmo',
            'supplyTools',
            'supplyTrumpet',
            'cityDestruction'
        ];

        $safeColumns = array_intersect($columns, $validColumns);

        if (empty($safeColumns)) {
            throw new BgaVisibleSystemException("No valid columns requested");
        }

        $colList = implode(', ', $safeColumns);

        return $this->getObjectFromDB("SELECT $colList FROM generalTracks LIMIT 1");
    }

    public function updateGameTracksState(TrackState $newTrackValues)
    {
        $updates = [];
        $this->dump('pepe sql', $newTrackValues);
        foreach ($newTrackValues as $track => $value) {
            $intValue = (int) $value;
            $updates[] = "`$track` = $intValue";
        }

        $sql = "UPDATE generalTracks SET " . implode(", ", $updates);
        // var_dump('pepe sql', $sql);
        // Ejecutar la query con los parámetros
        $this->DbQuery($sql);
    }

    public function checkEndGameCondition()
    {
        /** @var TrackState */
        $trackState = $this->getGameTracksState();

        if ($trackState->qualityMoral == 0) {
            $this->gamestate->nextState('end');
        }
        if ($trackState->cityDestruction == 1) {
            $this->gamestate->nextState('end');
        }
        if ($trackState->giantLife == 1) {
            $this->gamestate->nextState('end');
        }

        // TODO que pasa si se dan dos condiciones?
        return;
    }

    public function getMaxValues()
    {
        return [
            TRACK[1] => 10,
            TRACK[2] => 5,
            TRACK[3] => 5,
            TRACK[4] => 5,
            TRACK[5] => 4,
            TRACK[6] => 4,
            TRACK[7] => 4,
            TRACK[8] => 10,
        ];
    }

    // RONDELS
    public function getRondelPosition()
    {
        $dbResults = $this->getCollectionFromDb("SELECT * FROM rondelPosition");
        if ($dbResults == null) {
            return null;
        }

        return new Rondels($dbResults);
    }

    public function areThereRondelsEnabled()
    {
        $rondels = $this->getRondelPosition();

        $hasEnabled = false;

        foreach ($rondels as $rondel) {
            if ($rondel['rondel_enabled'] == '1') {
                $hasEnabled = true;
                break;
            }
        }

        return $hasEnabled;
    }

    public function makeAvailableAllRondels()
    {
        $sql = "UPDATE rondelPosition SET rondel_enabled = 1, last_movement  = 0";
        $this->DbQuery($sql);
    }

    public function updateRondelMovement(RondelState $rondel)
    {
        $enabled = intval($rondel->enabled);
        $movement = intval($rondel->movement);
        $location = intval($rondel->location);
        $char = $rondel->char;
        $sql = "UPDATE rondelPosition 
            SET last_movement = $movement, 
                rondel_location = $location, 
                rondel_enabled = $enabled 
            WHERE rondel_char = '$char'";
        $this->DbQuery($sql);
    }

    // HEROES

    public function getHeroeCardsOnTable()
    {
        return $this->heroesCards->getCardsInLocation('heroes_table');
    }
}
