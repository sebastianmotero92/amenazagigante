<?php

// namespace Bga\Games\amenazaGigante;

/*
 * State constants
 */
// const ST_BGA_GAME_SETUP = 1;



// const ST_NEXT_PLAYER = 11;

const HEROES_DECK = 'deck1';
const GIANT_DECK = 'deck2';

const TABLE_HEROE = 'table1';
const TABLE_GIANT = 'table2';

const GAME_STATE = [
    'INITIAL' => 0,
    'MANDATORY' => 1,
    'OPTIONAL' => 2,
    'HERO' => 3
];

const TRACK = [
    1 => 'giantLife',
    2 => 'qualityAttack',
    3 => 'qualityRepair',
    4 => 'qualityMoral',
    5 => 'supplyAmmo',
    6 => 'supplyTools',
    7 => 'supplyTrumpet',
    8 => 'cityDestruction',
    9 => 'special',
];

const TRACK_MAX_VALUES = [
    1 => 10,
    2 => 5,
    3 => 5,
    4 => 5,
    5 => 5,
    6 => 5,
    7 => 5,
    8 => 10,
];

const TRACK_MIN_VALUES = [
    1 => 1,
    2 => 0,
    3 => 0,
    4 => 0,
    5 => 0,
    6 => 0,
    7 => 0,
    8 => 1,
];

const SPECIAL_GIANT_ACTION = [
    1 => 'advanceRondel',
    2 => 'swapRondels',
    3 => 'moveRondel',
];

const HEROE_POWER = [
    1 => 'teamwork',
    2 => 'qualityAttack',
    3 => 'qualityRepair',
    4 => 'qualityMoral',
    5 => 'supplyAmmo',
    6 => 'supplyTools',
    7 => 'supplyTrumpet',
    8 => 'special',
];

// $this -> ACTION_DESCRIPTION = [

// ];
// const GIANT_NEXT_PATH = [
//     1 => GIANT_CARD_AREA[2],
//     2 => GIANT_CARD_AREA[3],
//     3 => GIANT_CARD_AREA[2],
//     4 => GIANT_CARD_AREA[3],
//     5 => GIANT_CARD_AREA[1],
//     6 => GIANT_CARD_AREA[2],
//     7 => GIANT_CARD_AREA[3],
//     8 => GIANT_CARD_AREA[3],
//     9 => GIANT_CARD_AREA[1],
// ];

const GIANT_NEXT_PATH = [
    1 => 2,
    2 => 3,
    3 => 2,
    4 => 3,
    5 => 1,
    6 => 2,
    7 => 3,
    8 => 3,
    9 => 1,
];


const GIANT_CARD_AREA = [
    0 => 'top',
    1 => 'middle',
    2 => 'bottom'
];

const ACTION_TYPE = [
    1 => 'mandatoryActions',
    2 => 'optionalActions'
];

const ACTION_DESCRIPTION = [
    1 => 'Advance the Giant Status marker 1 space to the right',
    // 2 => 'Move the City Integrity marker 2 spaces back (to the left)',
    // 3 => 'Advance 1 Hero on the rondel. Does not trigger activation',
    // 4 => 'Swap the gear positions of 2 Heroes. Does not trigger activation',
    // 5 => 'Move 1 Hero forward or backward 1 space on the rondel. Does not trigger activation',
    // 6 => 'Advance the corresponding Trait or Supply marker',
    // 7 => 'Move the corresponding Trait or Supply marker back',

    // 1 => 'Pepe',
    2 => 'Pepe2',
    3 => 'Pepe3',
    4 => 'Pepe4',
    5 => 'Pepe5',
    6 => 'Pepe6',
    7 => 'Pepe7',

    // 1 => clienttranslate('Advance the Giant Status marker 1 space to the right'),
    // 2 => clienttranslate('Move the City Integrity marker 2 spaces back (to the left)'),
    // 3 => clienttranslate('Advance 1 Hero on the rondel. Does not trigger activation'),
    // 4 => clienttranslate('Swap the gear positions of 2 Heroes. Does not trigger activation'),
    // 5 => clienttranslate('Move 1 Hero forward or backward 1 space on the rondel. Does not trigger activation'),
    // 6 => clienttranslate('Advance the corresponding Trait or Supply marker'),
    // 7 => clienttranslate('Move the corresponding Trait or Supply marker back'),
];

// class GiantData
// {

//     public static function getCards(): array
//     {
//         return [
//             1 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[3],
//                                 'description' => ACTION_DESCRIPTION[5]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ],
//                         ]
//                     ]
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                     ]
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                     ]
//                 ]
//             ],
//             2 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ]
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[3],
//                                 'description' => ACTION_DESCRIPTION[5]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                     ]
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ],
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                             ],
//                         ],
//                     ]
//                 ]
//             ],
//             3 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[3],
//                                 'description' => ACTION_DESCRIPTION[5]
//                             ],
//                         ]
//                     ],
//                 ]
//             ],
//             4 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[1],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[1]
//                             ],
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             // []
//                         ]
//                     ]
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ],
//                         ],
//                     ]
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ]
//                 ]
//             ],
//             5 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             // []
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ]
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[1],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                         ]
//                     ],
//                 ]
//             ],
//             6 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ]
//                     ]
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                     ]
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [

//                             ],
//                         ],
//                     ]
//                 ]
//             ],
//             7 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[1],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             // []
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[1],
//                                 'description' => ACTION_DESCRIPTION[3]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                 ]
//             ],
//             8 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[1],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[1]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             // []
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[3],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             // []
//                         ]
//                     ],
//                 ]
//             ],
//             9 => [
//                 GIANT_CARD_AREA[1] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[2],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[2] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             // []
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[7],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[3],
//                                 'description' => ACTION_DESCRIPTION[5]
//                             ]
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[4],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => 1,
//                                 'description' => ACTION_DESCRIPTION[6]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                 ],
//                 GIANT_CARD_AREA[3] => [
//                     // MANDATORY
//                     ACTION_TYPE[1] => [
//                         [
//                             [
//                                 'track' => TRACK[8],
//                                 'value' => -2,
//                                 'description' => ACTION_DESCRIPTION[2]
//                             ],
//                             [
//                                 'track' => TRACK[9],
//                                 'value' => SPECIAL_GIANT_ACTION[2],
//                                 'description' => ACTION_DESCRIPTION[4]
//                             ]
//                         ]
//                     ],
//                     // OPTIONAL
//                     ACTION_TYPE[2] => [
//                         [
//                             [
//                                 'track' => TRACK[5],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ],
//                         [
//                             [
//                                 'track' => TRACK[6],
//                                 'value' => -1,
//                                 'description' => ACTION_DESCRIPTION[7]
//                             ],
//                         ]
//                     ],
//                 ]
//             ],
//         ];
//     }

//     public static function getHeroeCardAbilities(): array
//     {
//         return [
//             1 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[7],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             2 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[7],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             3 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[7],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             4 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 2 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[6],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             5 => [
//                 1 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             6 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[6],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 2,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             7 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[5],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             8 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[5],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[1],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ],
//             9 => [
//                 1 => [
//                     'track' => HEROE_POWER[4],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],

//                 2 => [
//                     'track' => HEROE_POWER[5],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 3 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 4 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//                 5 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 6 => [
//                     'track' => HEROE_POWER[3],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 2
//                 ],
//                 7 => [
//                     'track' => HEROE_POWER[2],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 1
//                 ],
//                 8 => [
//                     'track' => HEROE_POWER[8],
//                     'value' => 1,
//                     'description' => ACTION_DESCRIPTION[6],
//                     'minMoral' => 4
//                 ],
//             ]
//         ];
//     }
// }

?>