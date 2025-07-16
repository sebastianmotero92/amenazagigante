<?php
class RondelState
{
    public int $id;
    public string $char;
    public int $location;
    public bool $enabled;
    public int $heroe;
    public int $movement;

    public function __construct($rondel)
    {
        $this->id = intval($rondel['rondel_id']);
        $this->char = $rondel['rondel_char'];
        $this->location = intval($rondel['rondel_location']);
        $this->enabled = boolval($rondel['rondel_enabled']);
        $this->heroe = intval($rondel['heroe_card']);
        $this->movement = intval($rondel['last_movement']);
    }
}

class Rondels
{
    public RondelState $rondelA;
    public RondelState $rondelB;
    public RondelState $rondelC;

    /** @var int[] */
    public array $availableMovements = [];

    public function __construct($rondels)
    {
        foreach ($rondels as $rondel) {
            $rondel = new RondelState($rondel);
            $property = 'rondel' . $rondel->char;
            $this->$property = $rondel;
        }

        $this->updateAvailableMovements();
    }

    public function checkAvailableMovements(): bool
    {
        $rondels = [$this->rondelA, $this->rondelB, $this->rondelC];
        return array_some($rondels, fn($rondel) => $rondel->enabled == 1);
    }

    private function updateAvailableMovements(): void
    {
        $allMovements = [1, 2, 3];

        $used = array_filter([
            $this->rondelA->movement,
            $this->rondelB->movement,
            $this->rondelC->movement
        ], fn($m) => $m !== 0);

        $this->availableMovements = array_values(array_diff($allMovements, $used));
    }

    public function resetMovements(): void
    {
        $this->availableMovements = [1, 2, 3];
    }

    public function getRondelsInfo() {
        return [
            'rondels' => [$this->rondelA, $this->rondelB, $this->rondelC],
            'availableMovements' => $this->availableMovements
        ];
    }

    public function getRondelByChar($char): RondelState {
        $property = 'rondel' . $char;
        return $this->$property;
    }

    public function updateRondelPosByRondel(string $char, int $location, int $movement) {
        $property = 'rondel' . $char;
        $this->$property->enabled = false;
        $this->$property->location = $location;
        $this->$property->movement = $movement;

        $this->updateAvailableMovements();
    }

    public function switchRondels(string $rondel1Char, string $rondel2Char) {
        $property1 = 'rondel' . $rondel1Char;
        $property2 = 'rondel' . $rondel2Char;

        $auxRondel1Location = $this->$property1->location;
        $this->$property1->location = $this->$property2->location;
        $this->$property2->location = $auxRondel1Location;
    }
}
