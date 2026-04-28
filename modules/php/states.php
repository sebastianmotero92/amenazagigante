<?php
trait StateTrait
{
    public function stPickUpGiantCard(): void
    {
        // Advance Giant position & returns the new one (1-9) | setup = 0
        /** @var int*/
        $newGiantPosition = $this->advanceGiantPos();

        // Pick a new Giant card for the current position
        $this->pickNewGiantCard($newGiantPosition);

        // Get all available giant cards 
        /** @var GiantCard[]*/
        $giantCards = $this->getCardsByLocation(TABLE_GIANT);

        $firstTurn = $newGiantPosition == 1;
        // Set giant card area depending on the previous giant card
        if ($firstTurn) {
            // First giant card, initial area -> sector middle
            $nextArea = 1;
            $this->setGiantArea($nextArea);
        } else {
            // Get previous card to check current area sector
            $prevGiantCard = $giantCards[$newGiantPosition - 2];
            $nextArea = $prevGiantCard->nextPath;
            $this->setGiantArea($nextArea);
        }

        // Notify
        $newGiantCard = $giantCards[$newGiantPosition - 1];
        $this->notify->all('newGiantCard', clienttranslate('Giant advance through the position ${giantData.giantPosition}, sector ${giantData.area_name}. ${giantData.card_name} is revealed'), array(
            'heroData' => [
                'heroCards' => $this->getCardsByLocation(TABLE_HEROE),
                'rondels' => ($this->getRondelManager())->getAllData()
            ],
            'giantData' => [
                'giantCards' => $giantCards,
                'giantPosition' => $newGiantPosition,
                'giantArea' => $nextArea,

                'area_name' => GIANT_CARD_AREA[$nextArea], // string
                'card_name' => $newGiantCard->name,       // string  
            ],
            'cityData' => [
                'track' => $this->getGameTracksState(),
            ],
            'firstTurn' => $firstTurn
        ));

        // Check if there is mandatory or optional action
        $lastCard = $giantCards[$newGiantPosition - 1];
        $mandatoryAction = true;
        $numberOfMandatoryAction = $lastCard->getNumberOfActions($mandatoryAction, $nextArea);

        if ($numberOfMandatoryAction > 0) {
            $this->setGameState(GAME_STATE['MANDATORY']);
            $this->gamestate->nextState('mandatory');
        } else {
            $this->setGameState(GAME_STATE['OPTIONAL']);
            $this->gamestate->nextState('optional');
        }
    }

    public function stUpdateAvailableHeroeMoves(): void
    {
        $rondels = $this->getRondelManager();

        $availableMovements = $rondels->checkAvailableMovements();

        
        if ($availableMovements) {
            $this->notify->all('s', clienttranslate('Heroe action available'), array());
            $this->setGameState(GAME_STATE['HERO']);
            $this->gamestate->nextState('heroeAction');
        } else {

            $this->makeAvailableAllRondels();
            $this->gamestate->nextState('verificationPhase');
        }
    }

    public function stVerificationPhase()
    {   
        $trackState = $this->getGameTracksState();
        $trackState->checkMinimum();
        $this->updateGameTracksState($trackState);
        // supply at minimum = decrease quality by 1
        // supply at maximum = increase quality by 1
        
        $this->notify->all('verificationPhase', clienttranslate('Verification phase'), array(
            'track' => $trackState->getAllData(),
        ));

        if ($this->checkEndGameCondition()) {
            return;
        };
        // check city destruction

        // check supply
        // check integridad ciudad
        // $this->notify->all('verip', clienttranslate('GTODO BIENTO '), array(

        // ));

        $this->gamestate->nextState('initGiantTurn');
    }
}
