<?php
trait StageAction {
    public function stPickUpGiantCard(): void
    {
        // Advance & get new pos (1-9) | setup = 0
        $newGiantPosition = $this->advanceGiantPos();
        
        $this->pickNewGiantCard($newGiantPosition);
        
        // Get giant cards
        $giantCards = $this->getCardsByLocation(TABLE_GIANT);
        
        // Set giant card area
        $nextArea = 1; // Middle sector
        if ($newGiantPosition == 1) {
            // First giant card, sector middle
            $this->setGiantArea($nextArea);
        } else {
            // Get previous card to check nextPath
            $prevGiantCard = $giantCards[$newGiantPosition - 2];
            $nextArea = $prevGiantCard->nextPath;
            $this->setGiantArea($nextArea);
        }

        // Notify
        $this->notify->all('newGiantCard', '', array(
            'giantCards' => $giantCards,
        ));

        // Check if there is mandatory action
        $lastCard = $giantCards[$newGiantPosition - 1];
        $mandatoryAction = true;
        $mandatoryAction = $lastCard->getNumberOfActions($mandatoryAction, $nextArea);

        if ($mandatoryAction > 0) {
            $this->setGameState(GAME_STATE['MANDATORY']);
            $this->gamestate->nextState('mandatory');
        } else {
            $this->setGameState(GAME_STATE['OPTIONAL']);
            $this->gamestate->nextState('optional');
        }
    }

    public function stUpdateAvailableHeroeMoves(): void {
        $rondels = $this->getRondelPosition();

        $availableMovements = $rondels->checkAvailableMovements();

        $this->notify->all('todobiento', clienttranslate('GTODO BIENTO '), array(

        ));

        if ($availableMovements) {
            $this->setGameState(GAME_STATE['HERO']);
            $this->gamestate->nextState('heroeAction');
        } else {

            $this->makeAvailableAllRondels();
            $this->gamestate->nextState('verificationPhase');
        }

    }

    public function stVerificationPhase() {
        // check supply
        // check integridad ciudad
        // $this->notify->all('verip', clienttranslate('GTODO BIENTO '), array(

        // ));

        $this->gamestate->nextState('initGiantTurn');
    }
}
 
?>