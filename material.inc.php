<?php

/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * CastleCombo implementation : © <Your name here> <Your email address here>
 * 
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * material.inc.php
 *
 * CastleCombo game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *   
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

$this->CARDS = [
  // 1 -> Heroe cards
  1 => [
    1 => new HeroeCardType('Victor Oxin', 1, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(3,1),
      new HeroeAction(7,1),
      new HeroeAction(2,2),
      new HeroeAction(4,1),
      new HeroeAction(8,1),
      new HeroeAction(1,1),
      new HeroeAction(2,2)
    ])),
    2 => new HeroeCardType('Brainhelsing', 2, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(3,1),
      new HeroeAction(7,1),
      new HeroeAction(2,2),
      new HeroeAction(4,1),
      new HeroeAction(8,1),
      new HeroeAction(1,1),
      new HeroeAction(3,2)
    ])),
    3 => new HeroeCardType('Ursula Ramsbottom', 3, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(3,1),
      new HeroeAction(7,1),
      new HeroeAction(2,1),
      new HeroeAction(4,1),
      new HeroeAction(8,1),
      new HeroeAction(1,1),
      new HeroeAction(3,2)
    ])),
    4 => new HeroeCardType('Wang Fi Xalot', 4, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(3,1),
      new HeroeAction(3,2),
      new HeroeAction(6,1),
      new HeroeAction(1,1),
      new HeroeAction(2,1),
      new HeroeAction(8,1),
      new HeroeAction(3,2)
    ])),
    5 => new HeroeCardType('Henry 807', 5, new HeroeActions([
      new HeroeAction(2,2),
      new HeroeAction(8,1),
      new HeroeAction(2,1),
      new HeroeAction(3,2),
      new HeroeAction(1,1),
      new HeroeAction(2,2),
      new HeroeAction(3,2),
      new HeroeAction(8,1)
    ])),
    6 => new HeroeCardType('Rufina Gunn', 6, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(2,1),
      new HeroeAction(2,2),
      new HeroeAction(6,1),
      new HeroeAction(1,1),
      new HeroeAction(3,1),
      new HeroeAction(8,1),
      new HeroeAction(2,2)
    ])),
    7 => new HeroeCardType('Petronella Canning', 7, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(5,1),
      new HeroeAction(1,1),
      new HeroeAction(2,1),
      new HeroeAction(3,1),
      new HeroeAction(2,1),
      new HeroeAction(2,1),
      new HeroeAction(8,1)
    ])),
    8 => new HeroeCardType('Doctor Braun', 8, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(5,1),
      new HeroeAction(1,1),
      new HeroeAction(3,1),
      new HeroeAction(2,1),
      new HeroeAction(3,1),
      new HeroeAction(2,1),
      new HeroeAction(8,1)
    ])),
    9 => new HeroeCardType('Igor Clocktower', 9, new HeroeActions([
      new HeroeAction(4,1),
      new HeroeAction(5,1),
      new HeroeAction(8,1),
      new HeroeAction(3,1),
      new HeroeAction(2,1),
      new HeroeAction(3,1),
      new HeroeAction(2,1),
      new HeroeAction(8,1)
    ])),
  ],
  // 2 -> Giant cards
  2 => [
    1 => new GiantCardType('G1', 1, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(4, -1), new GiantAction(2, 1)]),
        // Optional
        [new GiantCardSlot([new GiantAction(9, 3)]), new GiantCardSlot([new GiantAction(9, 2)])]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(7, -1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1), new GiantAction(9, 1)]),
          new GiantCardSlot([new GiantAction(6, -1), new GiantAction(2, 1)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2)]),
        // Optional
        [new GiantCardSlot([new GiantAction(5, -1)]), new GiantCardSlot([new GiantAction(6, -1)])]
      ),
    ]),
    2 => new GiantCardType('G2', 2, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(9, 1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, 1)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(9, 3)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1), new GiantAction(7, -1), new GiantAction(4, 1)]),
          new GiantCardSlot([new GiantAction(7, -1), new GiantAction(3, 1)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(4, -1), new GiantAction(9, 1), new GiantAction(6, 1)]),
        // Optional
        []
      ),
    ]),
    3 => new GiantCardType('G3', 1, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(6, 1), new GiantAction(9, 1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(4, -1), new GiantAction(3, 1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, -2)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2), new GiantAction(7, -1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, -1)]),
          new GiantCardSlot([new GiantAction(6, -1)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(7, 1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, -1), new GiantAction(4, 1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(5, 1)]),
          new GiantCardSlot([new GiantAction(3, -1), new GiantAction(9, 3)])
        ]
      ),
    ]),
    4 => new GiantCardType('G4', 2, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(1, 1), new GiantAction(8, -2), new GiantAction(9, 2)]),
        // Optional
        []
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(7, 1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1), new GiantAction(9, 2)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, 1)]),
          new GiantCardSlot([new GiantAction(4, -1), new GiantAction(9, 2)])
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(5, -1), new GiantAction(7, -1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(3, -1), new GiantAction(6, -1), new GiantAction(4, 1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(3, 1)]),
        ]
      ),
    ]),
    5 => new GiantCardType('G5', 0, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(7, -1), new GiantAction(9, 1)]),
          new GiantCardSlot([new GiantAction(3, -1), new GiantAction(2, 1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(4, -1), new GiantAction(9, 2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(6, -1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(9, 1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(4, -1)]),
          new GiantCardSlot([new GiantAction(1, -1)]),
        ]
      ),
    ]),
    6 => new GiantCardType('G6', 1, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1), new GiantAction(9, 2)]),
          new GiantCardSlot([new GiantAction(6, -1), new GiantAction(9, 1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(9, 2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(7, -1), new GiantAction(6, -1), new GiantAction(9, 1)]),
          new GiantCardSlot([new GiantAction(6, -1), new GiantAction(5, -1), new GiantAction(9, 1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2), new GiantAction(3, -1), new GiantAction(6, -1), new GiantAction(5, -1)]),
        // Optional
        []
      ),
    ]),
    7 => new GiantCardType('G7', 2, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1), new GiantAction(7, -1)]),
          new GiantCardSlot([new GiantAction(7, -1), new GiantAction(9, 1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(1, 1), new GiantAction(5, -1), new GiantAction(7, -1),]),
        // Optional
        []
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(4, -1), new GiantAction(9, 2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(6, -1), new GiantAction(9, 1)]),
          new GiantCardSlot([new GiantAction(2, -1), new GiantAction(5, -1)]),
        ]
      ),
    ]),
    8 => new GiantCardType('G8', 2, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(1, 1)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1)]),
          new GiantCardSlot([new GiantAction(6, -1)]),
          new GiantCardSlot([new GiantAction(7, -1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([new GiantAction(4, -1), new GiantAction(5, -1), new GiantAction(7, -1)]),
        // Optional
        []
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2), new GiantAction(3, -1), new GiantAction(5, -1)]),
        // Optional
        []
      ),
    ]),
    9 => new GiantCardType('G9', 0, [
      new GiantCardSection(
        SectionPosition::TOP,
        // Mandatory
        new GiantCardSlot([new GiantAction(2, -1), new GiantAction(9, 2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(6, -1)]),
          new GiantCardSlot([new GiantAction(7, -1)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::MIDDLE,
        // Mandatory
        new GiantCardSlot([]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(7, -1), new GiantAction(9, 3)]),
          new GiantCardSlot([new GiantAction(4, -1), new GiantAction(5, 1), new GiantAction(9, 2)]),
        ]
      ),
      new GiantCardSection(
        SectionPosition::BOTTOM,
        // Mandatory
        new GiantCardSlot([new GiantAction(8, -2), new GiantAction(9, 2)]),
        // Optional
        [
          new GiantCardSlot([new GiantAction(5, -1)]),
          new GiantCardSlot([new GiantAction(6, -1)]),
        ]
      ),
    ]),
  ],

];
