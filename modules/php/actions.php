<?php
trait ActionTrait {
    private function checkOnlySpecialAction($card, $actions, $numActions, $hasSpecialAction): bool {
        if ($numActions == 1 && $hasSpecialAction) {
            $specialAction = $card->getSpecialAction($actions);
            $actionValue = $specialAction->value;
            $this->setSpecialGiantAction($actionValue);
            $this->notify->all("specialGiantAction", clienttranslate("A rondel action is available"), [
                "specialGiantAction" => $actionValue,
            ]);
            $this->gamestate->nextState("special");
            return true;
        }
        return false;
    }

    private function applyActions($actions) {
        // Get trackState & update obj
        $log = null;
        $trackState = $this->getGameTracksState();
        $trackState->updateTracksByActions($actions, $log);

        // Update trackState in DB
        $this->updateGameTracksState($trackState);

        $this->notify->all("giantAction", clienttranslate('Giant actions applied: ${log}'), [
            'cityData' => [
                'track' => $trackState,
            ],
            "log" => $log,
        ]);
    }

    public function actExecuteMandatoryAction(int $idCard, int $sector, int $index): void {
        $giantCards = $this->getCardsByLocation(TABLE_GIANT);

        /** @var GiantCard */
        $card = array_find($giantCards, fn($card) => $card->id === $idCard);
        if (!$card) {
            throw new \BgaUserException("ERROR 1");
        }

        /** @var GiantCardSection */
        $section = $card->sections[$sector];
        if (!$section) {
            throw new \BgaUserException("ERROR 2");
        }

        $numMandatoryActions = $card->getNumberOfActions(true, $sector);
        if ($numMandatoryActions == 0) {
            throw new \BgaUserException("ERROR 3");
        }

        // Mandatory action always should be index 0
        if ($index != 0) {
            throw new \BgaUserException("ERROR 4");
        }
        /** @var GiantCardSlot */
        $actions = $section->mandatory;

        $hasSpecialAction = $card->hasSpecialAction($actions);
        // Check if mandatory has only 1 special action
        if ($this->checkOnlySpecialAction($card, $actions, $numMandatoryActions, $hasSpecialAction)) {
            return;
        }

        $this->applyActions($actions);

        if ($this->checkEndGameCondition()) {
            return;
        }
        $numOptionalActions = $card->getNumberOfActions(false, $sector);
        if ($hasSpecialAction) {
            $actionValue = $card->getSpecialAction($actions)->value;
            $this->setSpecialGiantAction($actionValue);
            $this->notify->all("specialGiantAction", "", [
                "specialGiantAction" => $actionValue,
            ]);
            $this->gamestate->nextState("special");
        } elseif ($numOptionalActions > 0) {
            $this->setGameState(GAME_STATE["OPTIONAL"]);
            $this->gamestate->nextState("optional");
        } else {
            $this->setGameState(GAME_STATE["HERO"]);
            // No special or optional action
            $this->gamestate->nextState("done");
        }
    }

    public function actExecuteSpecialSwitchAction(string $rondelChar1, string $rondelChar2): void {
        $rondelManager = $this->getRondelManager();

        $rondelChar1 = RondelChar::from($rondelChar1);
        $rondel1 = $rondelManager->getRondelByChar($rondelChar1);
        $rondelChar2 = RondelChar::from($rondelChar2);
        $rondel2 = $rondelManager->getRondelByChar($rondelChar2);
        $rondelManager->switchRondels($rondelChar1, $rondelChar2);

        $this->updateRondelMovement($rondel1);
        $this->updateRondelMovement($rondel2);
        $this->actExecuteSpecialAction($rondelManager);
    }

    public function actExecuteSpecialMoveAction(string $rondelChar, int $newLocation): void {
        $rondelManager = $this->getRondelManager();

        $rondelChar = RondelChar::from($rondelChar);
        $rondel = $rondelManager->getRondelByChar($rondelChar);

        $rondel->updateRondelPosition(RondelLocation::from($newLocation), RondelMovement::from(0));
        $this->updateRondelMovement($rondel);
        $this->actExecuteSpecialAction($rondelManager);
    }

    public function actExecuteSpecialAction($rondelManager): void {
        $this->notify->all("specialActionDone", clienttranslate("Special action done"), [
            "rondels" => $rondelManager->getAllData(),
        ]);

        $gameState = $this->getGameState();

        if ($gameState == GAME_STATE["MANDATORY"]) {
            // TODO check if optional
            /** @var GiantCard[] */
            $cards = $this->getCardsByLocation(TABLE_GIANT);
            $giantPosition = $this->getGiantPos();
            $area = $this->getGiantPosArea();

            $card = $cards[$giantPosition - 1];

            $numOptionalActions = $card->getNumberOfActions(false, $area);
            if ($numOptionalActions > 0) {
                $this->gamestate->nextState("optional");
            } else {
                $this->gamestate->nextState("done");
            }
        } elseif ($gameState == GAME_STATE["OPTIONAL"]) {
            $this->gamestate->nextState("done");
        }
    }

    public function actExecuteOptionalAction(int $idCard, int $sector, int $index) {
        $giantCards = $this->getCardsByLocation(TABLE_GIANT);

        /** @var GiantCard */
        $card = array_find($giantCards, fn($card) => $card->id === $idCard);
        if (!$card) {
            throw new \BgaUserException("ERROR CARD NOT FOUND");
        }

        /** @var GiantCardSection */
        $section = $card->sections[$sector];
        if (!$section) {
            throw new \BgaUserException("ERROR SECTOR");
        }

        $numOptionalActions = $card->getNumberOfActions(false, $sector);
        if ($numOptionalActions == 0) {
            throw new \BgaUserException("ERROR ACTION");
        }

        if ($index < 0 || $index > $numOptionalActions) {
            throw new \BgaUserException("ERROR INDEX");
        }

        /** @var GiantCardSlot */
        $actions = $section->optional[$index];

        $hasSpecialAction = $card->hasSpecialAction($actions);

        // Check if optional has only 1 special action
        if ($this->checkOnlySpecialAction($card, $actions, $numOptionalActions, $hasSpecialAction)) {
            return;
        }

        $this->applyActions($actions);

        if ($this->checkEndGameCondition()) {
            return;
        }

        if ($hasSpecialAction) {
            $actionValue = $card->getSpecialAction($actions)->value;
            $this->setSpecialGiantAction($actionValue);
            $this->notify->all("specialGiantAction", "", [
                "specialGiantAction" => $actionValue,
            ]);
            $this->gamestate->nextState("special");
        } else {
            // No special action
            $this->setGameState(GAME_STATE["HERO"]);
            $this->gamestate->nextState("done");
        }
    }

    public function actExecuteHeroesAction(string $rondelChar, int $movement, int $newLocation): void {
        // TODO CHECK valid movements
        $rondelManager = $this->getRondelManager();

        $rondelChar = RondelChar::from($rondelChar);
        $rondel = $rondelManager->getRondelByChar($rondelChar);
        $heroes = $this->getCardsByLocation(TABLE_HEROE);
        $trackState = $this->getGameTracksState();
        $card = array_find($heroes, fn($heroe) => $heroe->typeArg === $rondel->getHeroe());
        $ability = $card->actions->actions[$newLocation - 1];

        if ($ability->track !== 1 && $ability->track !== 8) {
            // Supply (5,6,7) & quality (2,3,4) tracks
            $trackState->updateTracksByHeroeAction($ability);
        } elseif ($ability->track === 1) {
            // teamwork
            $trackState->teamworkAction();
        }
        $this->updateGameTracksState($trackState);

        $rondel->updateRondelPosition(RondelLocation::from($newLocation), RondelMovement::from($movement));
        $rondel->blockRondelMovement();
        $this->updateRondelMovement($rondel);

        $this->notify->all("heroeAction", clienttranslate('Rondel ${rondelChar} moves ${movement} step to ${newLocation} position'), [
            "track" => $trackState,
            "rondelChar" => $rondelChar,
            "movement" => $movement,
            "newLocation" => $newLocation,
        ]);

        $this->gamestate->nextState("checkAvailableHeroeMoves");
    }

    public function actSelectHeroes(string $cardA, string $cardB, string $cardC): void {
        $this->selectHeroes([$cardA, $cardB, $cardC]);

        $heroes = $this->getCardsByLocation(TABLE_HEROE);

        self::DbQuery("DELETE FROM rondelPosition");
        $sql = sprintf(
            "INSERT INTO rondelPosition (rondel_char, heroe_card) VALUES ('A', %d), ('B', %d), ('C', %d)",
            $heroes[0]->typeArg,
            $heroes[1]->typeArg,
            $heroes[2]->typeArg
        );
        self::DbQuery($sql);

        $this->notify->all("heroesSelected", clienttranslate('Heroes selected: ${heroNames}'), [
            "heroData" => [
            "heroCards" => $this->getCardsByLocation(TABLE_HEROE),
            "rondels" => $this->getRondelManager()->getAllData(),
            ],
            "heroNames" => implode(", ", array_map(fn($hero) => $hero->name, $heroes)),
        ]);

        $this->gamestate->nextState("done");
    }
}
