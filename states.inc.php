<?php

/**
 * states.inc.php - State machine for Amenaza Gigante
 */

// State ID Definitions
if (!defined("STATE_GAME_SETUP")) {
    define("STATE_GAME_SETUP", 1);
    define("STATE_PLAYER_SELECT_HEROES", 5); // New: Initial hero selection
    define("STATE_GIANT_ADVANCE", 10);      
    define("STATE_GIANT_RESOLUTION", 11);   
    define("STATE_HEROES_DISTRIBUTION", 20); 
    define("STATE_HEROES_ACTIONS", 21);      
    define("STATE_CITY_VERIFICATION", 30);   
    define("STATE_END_GAME", 99);
}

$machinestates = [

    // 1. Initial Setup (Engine)
    STATE_GAME_SETUP => [
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => [ "" => STATE_PLAYER_SELECT_HEROES ]
    ],

    // 2. Player Selection: Choose 3 Heroes
    STATE_PLAYER_SELECT_HEROES => [
        "name" => "playerSelectHeroes",
        "description" => clienttranslate('${actplayer} must select 3 Heroes for the team'),
        "descriptionmyturn" => clienttranslate('${you} must select 3 Heroes'),
        "type" => "activeplayer",
        "args" => "argSelectHeroes",
        "possibleactions" => [ "selectHeroes" ],
        "transitions" => [
            "next" => STATE_GIANT_ADVANCE
        ],
    ],

    // --- PHASE 1: THE GIANT ACTS ---

    STATE_GIANT_ADVANCE => [
        "name" => "giantAdvance",
        "type" => "game",
        "action" => "stGiantAdvance", 
        "transitions" => [
            "goToResolution" => STATE_GIANT_RESOLUTION,
            "gameEnd" => STATE_END_GAME
        ],
    ],

    STATE_GIANT_RESOLUTION => [
        "name" => "giantResolution",
        "description" => clienttranslate('${actplayer} must resolve the threat: ${action_name}'),
        "descriptionmyturn" => clienttranslate('${you} must resolve the threat: ${action_name}'),
        "type" => "activeplayer",
        "args" => "argGiantOptions", 
        "possibleactions" => [
            "confirmOrangeBlock",    
            "moveRondelOneStep",     
            "swapRondels",           
            "selectGreenSector"      
        ],
        "transitions" => [
            "nextStep" => STATE_GIANT_RESOLUTION, 
            "finishGiant" => STATE_HEROES_DISTRIBUTION,
            "gameEnd" => STATE_END_GAME
        ],
    ],

    // --- PHASE 2: HERO ACTIONS ---

    STATE_HEROES_DISTRIBUTION => [
        "name" => "heroesDistribution",
        "description" => clienttranslate('${actplayer} must assign movement values (1, 2, and 3)'),
        "descriptionmyturn" => clienttranslate('${you} must assign the movements to the Heroes'),
        "type" => "activeplayer",
        "possibleactions" => [ "assignMovements" ],
        "transitions" => [
            "next" => STATE_HEROES_ACTIONS,
            "undo" => STATE_HEROES_DISTRIBUTION
        ],
    ],

    STATE_HEROES_ACTIONS => [
        "name" => "heroesActions",
        "description" => clienttranslate('${actplayer} is performing Hero actions'),
        "descriptionmyturn" => clienttranslate('${you} must activate your gears'),
        "type" => "activeplayer",
        "args" => "argAvailableSkills",
        "possibleactions" => [ "activateSkill", "attack", "repair", "useSpecial", "pass" ],
        "transitions" => [
            "nextHero" => STATE_HEROES_ACTIONS,
            "finishHeroes" => STATE_CITY_VERIFICATION,
            "gameEnd" => STATE_END_GAME
        ],
    ],

    // --- PHASE 3: CITY CHECK ---

    STATE_CITY_VERIFICATION => [
        "name" => "cityVerification",
        "type" => "game",
        "action" => "stCityVerification", 
        "updateGameProgression" => true,
        "transitions" => [
            "nextRound" => STATE_GIANT_ADVANCE,
            "gameEnd" => STATE_END_GAME
        ],
    ],

    STATE_END_GAME => [
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    ]

];