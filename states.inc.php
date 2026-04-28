<?php

/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * amenazaGigante implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * states.inc.php
 *
 * amenazaGigante game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: $this->checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!
// require_once("modules/php/utils/constants.inc.php");

// const ST_BGA_GAME_SETUP = 1;
// const ST_GIANT_MANDATORY_MOVE  = 10;
// const ST_GIANT_PLAYER_CHOICE = 11;

// const ST_HERO_PHASE = 20;
// const ST_END_GAME = 99;

$machinestates = array(

    // The initial state. Please do not modify.

    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array("" => 82 )
    ),

    // Note: ID=2 => your first state

    82 => array(
        "name" => "heroSelection",
        "descriptionmyturn" => clienttranslate('${you} should select your 3 heroes'),
        "description" => clienttranslate("Select your 3 heroes"),
        "type" => "activeplayer",
        "args" => "argHeroSelection",
        "possibleactions" => array(
            "actSelectHeroes",
        ),
        "transitions" => array("done" => 10)
    ),

    10  => array(
        "name" => "initGiantTurn",
        "type" => "game",
        "action" => "stPickUpGiantCard",
        "updateGameProgression" => true,
        "transitions" => array("mandatory" => 11, "optional" => 12, "special" => 13)
    ),

    11  => array(
        "name" => "giantMandatoryMove",
        "descriptionmyturn" => clienttranslate('${you} must activate mandatory action for the Giant'),
        "type" => "activeplayer",
        // "args" => "argGiantMandatoryMove",
        "possibleactions" => array(
            // these actions are called from the front with bgaPerformAction, and matched to the function on the game.php file
            "actExecuteMandatoryAction",
        ),
        "transitions" => array("optional" => 12, "special" => 13, "done" => 20, "end" => 99)
    ),

    12 => array(
        "name" => "giantPlayerChoice",
        "descriptionmyturn" => clienttranslate('${you} must choose an optional action for the Giant'),
        "type" => "activeplayer",
        // "args" => "argGiantPlayerChoice",
        "possibleactions" => array(
            "actExecuteOptionalAction",
        ),
        "transitions" => ["special" => 13, "done" => 20, "debug" => 11, "end" => 99]
    ),

    13 => array(
        "name" => "giantSpecialAction",
        "descriptionmyturn" => clienttranslate('${you} must use the rondels'),
        "type" => "activeplayer",
        "args" => "argGiantSpecialAction",
        "possibleactions" => array(
            "actExecuteSpecialSwitchAction",
            "actExecuteSpecialMoveAction"
        ),
        "transitions" => ["optional" => 12, "done" => 20, "debug" => 11, "end" => 99]
    ),

    20 => array(
        "name" => "checkAvailableHeroeMoves",
        // "description" => clienttranslate("Next move"),
        "type" => "game",
        "action" => "stUpdateAvailableHeroeMoves",
        "updateGameProgression" => true,
        "transitions" => array("heroeAction" => 21, "verificationPhase" => 30)
    ),

    21 => array(
        "name" => "heroPhase",
        "descriptionmyturn" => clienttranslate('${you} must choose an action for the heroes'),
        "type" => "activeplayer",
        "args" => "argHeroPhase",
        "possibleactions" => array(
            "actExecuteHeroesAction",
        ),
        "transitions" => ["checkAvailableHeroeMoves" => 20, "end" => 99]
    ),

    30 => array(
        "name" => "verificationPhase",
        // "descriptionmyturn" => clienttranslate('${you} mustes'),
        "type" => "game",
        // "args" => "argHeroPhase",
        // "possibleactions" => array(
        //     "actExecuteHeroesAction",
        // ),
        "action" => "stVerificationPhase",
        "updateGameProgression" => true,
        "transitions" => ["initGiantTurn" => 10]
    ),

    // Final state.
    // Please do not modify (and do not overload action/args methods).
    99 => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    ),

);



