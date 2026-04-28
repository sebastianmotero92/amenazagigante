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
 * .view.php
 *
 * This is the "view" file of your game.
 * (The "view" is the HTML template which is displayed to the users).
 *
 * You can render different views in this file.
 * But by default, there is only one view used for all games.
 *
 */

class View extends APP_GameView {
    protected function getGameLayout(): string {
        return "amenazagigante_amenazagigante";
    }

    protected function getTemplate() {
        return null;
    }

    protected function buildPage() {
        // Build the page
    }
}