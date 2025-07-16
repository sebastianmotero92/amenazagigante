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

    public function updateTracksByActions(GiantCardSlot $actions): bool
    {
        $special = false;
        foreach ($actions->actions as $action) {
            if ($action->track === 9) {
                $special = true;
            } else {
                $property = $this->mapTrackNumToString($action->track);
                $newValue = $this->clampValue($action->track, $this->$property, $action->value);
                $this->$property = $newValue;
            }
        }

        return $special;
    }

    public function updateTracksByHeroeAction(HeroeAction $action)
    {
        $property = $this->mapTrackNumToString($action->track);
        $newValue = $this->clampValue($action->track, $this->$property, $action->value);
        $this->$property = $newValue;
    }

    private function clampValue(int $track, int $previous, int $change)
    {
        $newValue = $previous + $change;

        if ($newValue < TRACK_MIN_VALUES[$track]) {
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
}
