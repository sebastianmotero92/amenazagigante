<?php

class TrackState
{
    public int $cityDestruction;
    public int $giantLife;
    public int $qualityAttack;
    public int $qualityMoral;
    public int $qualityRepair;
    public int $supplyAmmo;
    public int $supplyTools;
    public int $supplyTrumpet;

    public function __construct($trackState)
    {
        $this->cityDestruction = intval($trackState['cityDestruction']);
        $this->giantLife = intval($trackState['giantLife']);
        $this->qualityAttack = intval($trackState['qualityAttack']);
        $this->qualityMoral = intval($trackState['qualityMoral']);
        $this->qualityRepair = intval($trackState['qualityRepair']);
        $this->supplyAmmo = intval($trackState['supplyAmmo']);
        $this->supplyTools = intval($trackState['supplyTools']);
        $this->supplyTrumpet = intval($trackState['supplyTrumpet']);
    }

    private function getPointsNeccesaryToAttack() {
        switch ($this->giantLife) {
            case 10:
            case 9:
            case 8:
            case 7:
            case 6:
            case 5:
                return 2;
            case 4:
            case 3: 
            case 2:
                return 3;             
        }
    }

    private function getPointsNeccesaryToRepair() {
        switch ($this->cityDestruction) {
            case 2:
            case 3: 
            case 4:
                return 2;
            case 5:
            case 6:
                return 3;             
            case 7:
            case 8:
            case 9:
                return 4;
        }
    }

    public function isWallRepaired(): bool {
        // wall -> 8, 9, 10
        return $this->cityDestruction > 7;
    }

    public function updateTracksByActions(GiantCardSlot $actions, ?string &$log = null): void
    {
        $changes = [];

        foreach ($actions->actions as $action) {
            if ($action->track === TRACK_INDEX['special']) {
                // ignore special giant action
            } else {
                $property = $this->mapTrackNumToString($action->track);
                // check wall
                // Si esta la cityDestrucion en 8,9,10 el -2 es -1
                if ($this->isWallRepaired() && $action->track == TRACK_INDEX['cityDestruction']) {
                    $action->value = -1;
                }

                $oldValue = $this->$property;
                $newValue = $this->clampValue($action->track, $this->$property, $action->value);
                $this->$property = $newValue;

                $sign = ($action->value >= 0) ? '+' : '';
                $changes[] = sprintf("%s: %d -> %d (%s%d)", $property, $oldValue, $newValue, $sign, $action->value);
            }
        }

        
            $log = implode('; ', $changes);
        
    }

    public function updateTracksByHeroeAction(HeroeAction $action)
    {
        // Supply (5,6,7) & quality (2,3,4) tracks
        $property = $this->mapTrackNumToString($action->track);
        // Chequear puntos de ataque y de muralla para repar
        $newValue = $this->clampValue($action->track, $this->$property, $action->value);
        $this->$property = $newValue;
    }

    public function teamworkAction() {
        
        $attackPointsNeeded = $this->getPointsNeccesaryToAttack();
        while ($this->qualityAttack >= $attackPointsNeeded) {
            $newAttackValue = $this->clampValue(TRACK_INDEX['qualityAttack'], $this->qualityAttack, -$attackPointsNeeded);
            $this->qualityAttack = $newAttackValue;
            $newGiantLifeValue = $this->clampValue(TRACK_INDEX['giantLife'], $this->giantLife, -1);
            $this->giantLife = $newGiantLifeValue;

            $attackPointsNeeded = $this->getPointsNeccesaryToAttack();
        } 
        
        $repairPointsNeeded = $this->getPointsNeccesaryToRepair();
        while ($this->qualityRepair >= $repairPointsNeeded) {
            $newRepairValue = $this->clampValue(TRACK_INDEX['qualityRepair'], $this->qualityRepair, -$repairPointsNeeded);
            $this->qualityRepair = $newRepairValue;
            $newDestructionValue = $this->clampValue(TRACK_INDEX['cityDestruction'], $this->cityDestruction, 1);
            $this->cityDestruction = $newDestructionValue;

            $repairPointsNeeded = $this->getPointsNeccesaryToRepair();
        }
    }

    private function clampValue(int $track, int $previous, int $change)
    {
        $newValue = $previous + $change;

        if ($newValue < TRACK_MIN_VALUES[$track]) {
            // Each giant action incomplete = decrease moral
            if ($track != TRACK_INDEX['qualityMoral'] && $track != TRACK_INDEX['giantLife'] && $track != TRACK_INDEX['cityDestruction']) {
                // Ignore giant life, destruction of the city & moral
                $this->clampValue(TRACK_INDEX['qualityMoral'], $this->qualityMoral, -1);
            }
            return TRACK_MIN_VALUES[$track];
        }

        if ($newValue > TRACK_MAX_VALUES[$track]) {
            return TRACK_MAX_VALUES[$track];
        }

        return $newValue;
    }

    private function mapTrackNumToString(int $trackNumber)
    {
        return TRACK[$trackNumber];
    }

    public function getValidRondelMovements()
    {
        if ($this->qualityMoral >= 4) {
            // 4-5
            return [1, 2, 3, 4, 5, 6, 7, 8];
        } else if ($this->qualityMoral >= 2) {
            // 2-3
            return [1, 2, 3, 5, 6, 7];
        } else {
            // 1
            return [1, 3, 5, 7];
        }
    }

    public function checkMinimum() {
        if ($this->supplyAmmo == TRACK_MIN_VALUES[TRACK_INDEX['supplyAmmo']]) {
            $newAttackValue = $this->clampValue(TRACK_INDEX['qualityAttack'], $this->qualityAttack, -1);
            $this->qualityAttack = $newAttackValue;
        }
        if ($this->supplyTools == TRACK_MIN_VALUES[TRACK_INDEX['supplyTools']]) {
            $newRepairValue = $this->clampValue(TRACK_INDEX['qualityRepair'], $this->qualityRepair, -1);
            $this->qualityRepair = $newRepairValue;
        }
        if ($this->supplyTrumpet == TRACK_MIN_VALUES[TRACK_INDEX['supplyTrumpet']]) {
            $newMoralValue = $this->clampValue(TRACK_INDEX['qualityMoral'], $this->qualityMoral, -1);
            $this->qualityMoral = $newMoralValue;
        }

        if ($this->supplyAmmo == TRACK_MAX_VALUES[TRACK_INDEX['supplyAmmo']]) {
            $newAttackValue = $this->clampValue(TRACK_INDEX['qualityAttack'], $this->qualityAttack, 1);
            $this->qualityAttack = $newAttackValue;
        }
        if ($this->supplyTools == TRACK_MAX_VALUES[TRACK_INDEX['supplyTools']]) {
            $newRepairValue = $this->clampValue(TRACK_INDEX['qualityRepair'], $this->qualityRepair, 1);
            $this->qualityRepair = $newRepairValue;
        }
        if ($this->supplyTrumpet == TRACK_MAX_VALUES[TRACK_INDEX['supplyTrumpet']]) {
            $newMoralValue = $this->clampValue(TRACK_INDEX['qualityMoral'], $this->qualityMoral, 1);
            $this->qualityMoral = $newMoralValue;
        }
    }

    public function getAllData()
    {
        return [
            'cityDestruction' => $this->cityDestruction,
            'giantLife' => $this->giantLife,
            'qualityAttack' => $this->qualityAttack,
            'qualityMoral' => $this->qualityMoral,
            'qualityRepair' => $this->qualityRepair,
            'supplyAmmo' => $this->supplyAmmo,
            'supplyTools' => $this->supplyTools,
            'supplyTrumpet' => $this->supplyTrumpet,
        ];
    }
}
