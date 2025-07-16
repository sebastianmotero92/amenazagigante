<?php
enum SectionPosition: string
{
    case TOP = 'top';
    case MIDDLE = 'middle';
    case BOTTOM = 'bottom';
}

class GiantAction
{
    public int $track;
    public int $value;

    public function __construct(int $track, int $value)
    {
        $this->track = $track;
        $this->value = $value;
    }
}

class HeroeAction
{
    public int $track;
    public int $value;

    public function __construct(int $track, int $value)
    {
        $this->track = $track;
        $this->value = $value;
    }
}

class HeroeActions
{
    /** @var HeroeAction[] */
    public array $actions;

    public function __construct(array $actions)
    {
        $this->actions = $actions;
    }
}

class GiantCardSlot
{
    /** @var GiantAction[] */
    public array $actions;

    public function __construct(array $actions)
    {
        $this->actions = $actions;
    }
}


class GiantCardSection
{
    public ?GiantCardSlot $mandatory;
    /** @var GiantCardSlot[] */
    public array $optional;
    public SectionPosition $sectionPosition;

    public function __construct(SectionPosition $sectionPosition, ?GiantCardSlot $mandatory = null, array $optional = [])
    {
        $this->sectionPosition = $sectionPosition;
        $this->mandatory = $mandatory;
        $this->optional = $optional;
    }
}

class GiantCardType
{
    public string $name; // G1
    public int $nextPath;
    /** @var GiantCardSection[] */
    public array $sections; // array GiantCardSection (3)

    public function __construct(string $name, $nextPath, array $sections)
    {
        $this->name = $name;
        $this->nextPath = $nextPath;
        $this->sections = $sections;
    }
}

class HeroeCardType
{
    public string $name; // G1
    /** @var HeroeActions[] */
    public HeroeActions $actions; // array GiantCardSection (3)

    public function __construct(string $name, HeroeActions $actions)
    {
        $this->name = $name;
        $this->actions = $actions;
    }
}


class Card
{
    public int $id;
    public string $location;
    public int $locationArg;
    public int $type;
    public int $typeArg;
    public int $index;
    public bool $flipped = false;

    public function __construct($dbCard, $CARDS_TYPE)
    {
        $this->id = intval($dbCard['card_id']);
        $this->location = $dbCard['card_location'];
        $this->locationArg = intval($dbCard['card_location_arg']);
        $this->type = intval($dbCard['card_type']);
        $this->typeArg = intval($dbCard['card_type_arg']);
        $this->flipped = boolval($dbCard['flipped']);
        $this->index = intval($dbCard['card_type_arg']);
    }

    public static function onlyId(?Card $card)
    {
        if ($card == null) {
            return null;
        }

        return new Card([
            'card_id' => $card->id,
            'card_location' => $card->location,
            'card_location_arg' => $card->locationArg,
            'card_type' => $card->type,
            'card_type_arg' => null,
            'flipped' => $card->flipped,
        ], null);
    }

    public static function onlyIds(array $cards)
    {
        return array_map(fn($card) => self::onlyId($card), $cards);
    }
}

class HeroCard extends Card
{
    public int $rondelPosition;
    public HeroeActions $actions;
    public string $name;

    public function __construct(array $dbCard, array $CARDS_TYPE)
    {
        parent::__construct($dbCard, $CARDS_TYPE);

        if (isset($dbCard['card_type_arg'])) {
            //     $this->rondelPosition = intval($dbCard['card_type_arg']);
            $cardType = $CARDS_TYPE[$this->type][$this->index];

            $this->name = $cardType->name;
            $this->actions = $cardType->actions;
        }
    }
}

class GiantCard extends Card
{
    public string $name; // G1
    public int $nextPath;
    /** @var GiantCardSection[] */
    public array $sections;

    public function __construct(array $dbCard, array $CARDS_TYPE)
    {
        parent::__construct($dbCard, $CARDS_TYPE);

        $cardType = $CARDS_TYPE[$this->type][$this->index];
        $this->name = $cardType->name;
        $this->nextPath = $cardType->nextPath;
        $this->sections = $cardType->sections;
    }

    public function getNumberOfActions(bool $mandatory, int $sector)
    {
        // sector 0,1,2
        $actions = $this->sections[$sector];
        if ($mandatory) {
            // check action slot length
            return (count($actions->mandatory->actions) > 0) ? 1 : 0;
        } else {
            // check amount of action slots
            return count($actions->optional);
        }
    }

    public function getNumberSector(string $sector)
    {
        switch ($sector) {
            case 'top':
                return 0;
                break;
            case 'middle':
                return 1;
                break;
            case 'bottom':
                return 2;
                break;
            default:
                return -1;
                break;
        }
    }

    public function getSectionActions(int $section)
    {
        // foreach ($this->sections as $section) {
        //     if ($section->sectionPosition == $sector) {
        //         $section = $section;
        //         break;
        //     }
        // }
    }

    public function hasSpecialAction(GiantCardSlot $slot) {
        return array_some($slot->actions, fn($action) => $action->track == 9);
    }

    public function getSpecialAction(GiantCardSlot $slot) {
        // var_dump($slot);

        foreach ($slot->actions as $action) {
            var_dump($action->track == 9);
        }

        $pe = array_find_key($slot->actions, fn($action) => $action->track == 9);
        var_dump($pe);
    }
}
