<?php

// namespace traits;
// namespace traits;

// require_once(__DIR__ . '/../utils/constants.inc.php');

// require_once("modules/php/utils/constants.inc.php");
// require_once("../utils/constants.inc.php");
// require_once(__DIR__ . '../utils/constants.inc.php');
// use Bga\Games\amenazaGigante;
// use Bga\Games\amenazaGigante\GiantData;
// use const Bga\Games\amenazaGigante\GIANT_CARD_AREA;
// use App\Utils\UtilsTrait;

trait ArgsTrait
{
    // use UtilsTrait;

    //////////////////////////////////////////////////////////////////////////////
    //////////// Game state arguments
    //////////////////////////////////////////////////////////////////////////////
    /*
        Here, you can create methods defined as 'game state arguments' (see 'args' property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    public function argGameEnd(): void
    {

    }

    public function argGiantMandatoryMove(): array
    {
        return [
            'giantPosition' => $this->getGiantPos(),
            'giantArea' => $this->getGiantPosArea(),
            'giantCards' => $this->getCardsByLocation(TABLE_GIANT),
            'tracks' => $this->getGameTracksState()
        ];
    }

    public function argGiantPlayerChoice(): array
    {
        return [
            'giantPosition' => $this->getGiantPos(),
            'giantArea' => $this->getGiantPosArea(),
            'giantCards' => $this->getCardsByLocation(TABLE_GIANT),
            'tracks' => $this->getGameTracksState()
        ];
    }

    public function argHeroPhase() {
        // $tracks = $this->getGameTracksState();
        $rondels = ($this->getRondelPosition())->getRondelsInfo();
        // $usedMovements = array_column($rondels, 'last_movement');
        // $usedMovements = array_filter($usedMovements); 

        // $allMovements = [1, 2, 3];
        // $availableMovements = array_values(array_diff($allMovements, $usedMovements));

        return [
            // 'tracks' => $tracks,
            'rondels' => $rondels,
            // 'availableMovements' => $availableMovements
        ];
    }
}

