<?php

enum RondelLocation: int {
    case One = 1;
    case Two = 2;
    case Three = 3;
    case Four = 4;
    case Five = 5;
    case Six = 6;
    case Seven = 7;
    case Eight = 8;
}

enum RondelMovement: int {
    case Zero = 0;
    case One = 1;
    case Two = 2;
    case Three = 3;
}

enum RondelChar: string {
    case A = 'A';
    case B = 'B';
    case C = 'C';
}

class RondelState
{
    private int $id;
    private RondelChar $char;
    private RondelLocation $location;
    private bool $enabled;
    private int $heroe;
    private RondelMovement $movement;

    public function __construct($rondel)
    {
        $this->id = intval($rondel['rondel_id']);
        $this->char = RondelChar::from($rondel['rondel_char']);
        $this->location = RondelLocation::from(intval($rondel['rondel_location']));
        $this->enabled = boolval($rondel['rondel_enabled']);
        $this->heroe = intval($rondel['heroe_card']);
        $this->movement = RondelMovement::from(intval($rondel['last_movement']));
    }

    // States
    public function getHeroe(): int {
        return $this->heroe;
    }

    public function getChar(): RondelChar {
        return $this->char;
    }

    public function getMovement(): RondelMovement {
        return $this->movement;
    }

    public function getLocation(): RondelLocation {
        return $this->location;
    }

    public function isAvailable(): bool {
        return $this->enabled;
    }

    // Functions
    public function blockRondelMovement(): void {
        $this->enabled = false;
    }

    public function allowRondelMovement(): void {
        $this->enabled = true;
    }

    public function updateRondelPosition(RondelLocation $location, RondelMovement $movement): void {
        if (!$this->enabled) {
            throw new Exception("Rondel blocked to be udpated");
        }
        $this->location = $location;
        $this->movement = $movement;
    }

    public function getAllData() {
        return [
            'location' => $this->location,
            'movement' => $this->movement,
            'enabled' => $this->enabled,
            'char' => $this->char,
            'heroe' => $this->heroe,
        ];
    }
}

class Rondels
{
    private RondelState $rondelA;
    private RondelState $rondelB;
    private RondelState $rondelC;

    /** @var int[] */
    private array $availableMovements = [];

    public function __construct($rondels)
    {
        foreach ($rondels as $rondel) {
            /** @var RondelState */
            $rondel = new RondelState($rondel);
            $property = 'rondel' . $rondel->getChar()->value;
            $this->$property = $rondel;
        }

        $this->updateAvailableMovements();
    }

    public function checkAvailableMovements(): bool
    {
        $rondels = [$this->rondelA, $this->rondelB, $this->rondelC];
        return array_some($rondels, fn($rondel) => $rondel->isAvailable());
    }

    private function updateAvailableMovements(): void
    {
        $allMovements = [1, 2, 3];

        $used = array_filter([
            $this->rondelA->getMovement()->value,
            $this->rondelB->getMovement()->value,
            $this->rondelC->getMovement()->value
        ], fn($m) => $m !== 0);

        $this->availableMovements = array_values(array_diff($allMovements, $used));
    }

    public function resetMovements(): void
    {
        $this->availableMovements = [1, 2, 3];
    }

    public function getAllData() {
        return [
            'rondels' => [
                $this->rondelA->getAllData(), 
                $this->rondelB->getAllData(), 
                $this->rondelC->getAllData()
            ],
            'availableMovements' => $this->availableMovements
        ];
    }

    public function getRondelByChar(RondelChar $char): RondelState {
        $property = 'rondel' . $char->value;
        return $this->$property;
    }

    public function switchRondels(RondelChar $rondel1Char, RondelChar $rondel2Char) {
        $property1 = 'rondel' . $rondel1Char->value;
        $property2 = 'rondel' . $rondel2Char->value;

        $auxRondel1Location = $this->$property1->getLocation();

        // RondelLocation $location, RondelMovement $movement
        $this->$property1->updateRondelPosition($this->$property2->getLocation(), RondelMovement::from(0));
        $this->$property2->updateRondelPosition($auxRondel1Location, RondelMovement::from(0));
    }
}
