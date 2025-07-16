<?php
trait ActionTrait
{
    // use UtilsTrait;

    public function actExecuteSpecialAction(array $rondelsArr, string $movement, int $newLocation): void
    {
        // TODO CHECK
        
        $rondels = $this->getRondelPosition();
        
        if(count($rondelsArr) == 1) {
            // movement
            $rondel = $rondels->getRondelByChar($rondelsArr[0]);
            $rondels->updateRondelPosByRondel($rondelsArr[0], $newLocation, $movement);
        } else {
            // exchange
            $rondels->switchRondels($rondelsArr[0], $rondelsArr[1]);
        }

        $this->updateRondelMovement($rondel);

        // $result = $this->executeGiantAction($nCard, $sector, $actionIndex, $giantCard, $actionType);

        // option 1 mandatory -> chequear optional o salir

        // option 2 optional -> salir

        // if ($result['special'] == true) {
        //     $this->gamestate->nextState('special');
        // } else if ($result['optionalActions'] == true) {
        //     $this->gamestate->nextState('next');
        // } else {
        //     $this->gamestate->nextState('done');
        // }
    }

    public function actExecuteMandatoryAction(int $idCard, string $sector, int $index): void
    {
        $args = $this->argGiantMandatoryMove();

        // TODO check is is the last card, position
        /** @var GiantCard */
        $card = array_find($args['giantCards'], fn($card) => $card->id === $idCard);
        if (!$card) {
            throw new \BgaUserException("ERROR");
        }

        $numSector = $card->getNumberSector($sector);

        /** @var GiantCardSection */
        $section = $card->sections[$numSector];
        if (!$section) {
            throw new \BgaUserException("ERROR");
        }

        // Mandatory action always should be index 1
        if ($index != 1) {
            throw new \BgaUserException("ERROR");
        }

        $numMandatoryActions = $card->getNumberOfActions(true, $numSector);
        if ($numMandatoryActions == 0) {
            throw new \BgaUserException("ERROR");
        }
        
        // Get trackState
        $trackState = $this->getGameTracksState();
        
        /** @var GiantCardSlot */
        $actions = $section->mandatory;
        $trackState->updateTracksByActions($actions);

        // Update trackState in DB
        $this->updateGameTracksState($trackState);
        
        $this->notify->all('giantAction', clienttranslate('Giant action notify '), array(
            // 'giantCards' => $giantCards,
            // 'nextArea' => $nextArea,
            // 'pepe' => $action['description'],
            // 'value' => $delta,
            'track' => $trackState,
        ));
        
        $this->checkEndGameCondition();
        
        $hasSpecialAction = $card->hasSpecialAction($actions);
        $numOptionalActions = $card->getNumberOfActions(false, $numSector);

        if ($hasSpecialAction) {
            $this->gamestate->nextState('special');
        } elseif ($numOptionalActions > 0) {
            $this->gamestate->nextState('optional');
        } else {
            // No special or optional action
            $this->gamestate->nextState('done');
        }
    }

    public function actExecuteOptionalAction(int $idCard, string $sector, int $index)
    {
        
        $args = $this->argGiantPlayerChoice();
        
        // TODO check is is the last card, position
        /** @var GiantCard */
        $card = array_find($args['giantCards'], fn($card) => $card->id === $idCard);
        if (!$card) {
            throw new \BgaUserException("ERROR");
        }
        
        $numSector = $card->getNumberSector($sector);
        
        /** @var GiantCardSection */
        $section = $card->sections[$numSector];
        if (!$section) {
            throw new \BgaUserException("ERROR");
        }
        
        $numOptionalActions = $card->getNumberOfActions(false, $numSector);
        if ($numOptionalActions == 0) {
            throw new \BgaUserException("ERROR");
        }
        
        if ($index < 1 || $index > $numOptionalActions) {
            throw new \BgaUserException("ERROR");
        }
        
        
        // Get trackState
        $trackState = $this->getGameTracksState();
        
        /** @var GiantCardSlot */
        $actions = $section->optional[$index];
        $trackState->updateTracksByActions($actions);

        // Update trackState in DB
        $this->updateGameTracksState($trackState);
        
        $this->notify->all('giantAction', clienttranslate('Giant action notify '), array(
            // 'giantCards' => $giantCards,
            // 'nextArea' => $nextArea,
            // 'pepe' => $action['description'],
            // 'value' => $delta,
            'track' => $trackState,
        ));

        $this->checkEndGameCondition();
        
        $hasSpecialAction = $card->hasSpecialAction($actions);

        if ($hasSpecialAction) {
            $this->gamestate->nextState('special');
        } else {
            // No special action
            $this->gamestate->nextState('done');
        }
    }

    public function actExecuteHeroesAction(string $rondelChar, int $movement, int $newLocation): void
    {
        // TODO CHECK
        $rondels = $this->getRondelPosition();
        $rondel = $rondels->getRondelByChar($rondelChar);
        $heroes =  $this->getCardsByLocation(TABLE_HEROE);
        $trackState = $this->getGameTracksState();

        $card = array_find($heroes, fn($heroe) => $heroe->typeArg === $rondel->heroe);
        $ability = $card->actions->actions[$newLocation - 1];

        
        if ($ability->track != 1 && $ability->track != 8) {
            $trackState->updateTracksByHeroeAction($ability);
            $this->updateGameTracksState($trackState);
        }

        $rondels->updateRondelPosByRondel($rondelChar, $newLocation, $movement);
        $this->updateRondelMovement($rondel);

        $this->notify->all('heroeAction', clienttranslate('Rondel ${rondelChar} moves ${movement} to ${newLocation} '), array(
            'track' => $trackState,
            'rondelChar' => $rondelChar,
            'movement' => $movement,
            'newLocation' => $newLocation,
        ));

        $this->gamestate->nextState('checkAvailableHeroeMoves');
    }
}
