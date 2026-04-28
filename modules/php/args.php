<?php

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

    public function argGameEnd1(): void
    {

    }

    // This function returns the hero cards sorted by their image location.
    public function argHeroSelection(): array {
        return [
            'heroCards' => $this->sortCardsByImageLocation($this->getCardsByLocation(HEROES_DECK)),
        ];
    }

    public function argGiantMandatoryMove(): array
    {
        /** 
         * Returns args
         * @var int
         * @var int
         * @var GiantCard[]
         * @var TrackState
         * */
        return [
            'giantData' => [
                'giantCards' => $this->getCardsByLocation(TABLE_GIANT),
                'giantPosition' => $this->getGiantPos(),
                'giantArea' => $this->getGiantPosArea(),
            ],
            'cityData' => [
                'track' => $this->getGameTracksState(),
            ],
        ];
    }

    public function argGiantSpecialAction(): array
    {
        return [
            'specialGiantAction' => $this->getSpecialGiantAction()
        ];
    }

    public function argGiantPlayerChoice(): array
    {
        /** 
         * Returns args
         * @var int
         * @var int
         * @var GiantCard[]
         * @var TrackState
         * */
        return [
            'giantData' => [
                'giantCards' => $this->getCardsByLocation(TABLE_GIANT),
                'giantPosition' => $this->getGiantPos(),
                'giantArea' => $this->getGiantPosArea(),
            ],
            'cityData' => [
                'track' => $this->getGameTracksState(),
            ],
        ];
        
    }

    public function argHeroPhase() {
        // $tracks = $this->getGameTracksState();
        $rondels = ($this->getRondelManager())->getAllData();
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

