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
 * .action.php
 *
 * dojoless main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/game/game/myAction.html", ...)
 *
 */
class action_amenazagigante extends APP_GameAction
{
    // Constructor: please do not modify
    public function __default()
    {
        if (self::isArg("notifwindow")) {
            $this->view = "common_notifwindow";
            $this->viewArgs["table"] = self::getArg("table", AT_posint, true);
        } else {
            $this->view = "amenazagigante_amenazagigante";
            self::trace("Complete reinitialization of board game");
        }
    }

    // Add your action methods here
    public function actPlayCard()
    {
        self::setAjaxMode();
        $card_id = self::getArg('card_id', AT_posint, true);
        $this->game->actPlayCard($card_id);
        self::ajaxResponse();
    }

    public function actPass()
    {
        self::setAjaxMode();
        $this->game->actPass();
        self::ajaxResponse();
    }

    public function actSelectHeroes()
    {
        $this->setAjaxMode();

        // Recuperamos los 3 argumentos enviados desde el JS
        // AT_posint valida que sean enteros positivos
        $cardA = $this->getArg("cardA", AT_posint, true);
        $cardB = $this->getArg("cardB", AT_posint, true);
        $cardC = $this->getArg("cardC", AT_posint, true);

        // Llamamos al método en la lógica del juego (game.php)
        $this->game->actSelectHeroes($cardA, $cardB, $cardC);

        $this->ajaxResponse();
    }

    public function actExecuteMandatoryAction()
    {
        self::setAjaxMode();
        $idCard = self::getArg('idCard', AT_posint, true);
        $sector = self::getArg('sector', AT_posint, true);
        $index = self::getArg('index', AT_posint, true);
        $this->game->actExecuteMandatoryAction($idCard, $sector, $index);
        self::ajaxResponse();
    }

    public function actExecuteOptionalAction()
    {
        self::setAjaxMode();
        $idCard = self::getArg('idCard', AT_posint, true);
        $sector = self::getArg('sector', AT_posint, true);
        $index = self::getArg('index', AT_posint, true);
        $this->game->actExecuteOptionalAction($idCard, $sector, $index);
        self::ajaxResponse();
    }

    public function actExecuteSpecialSwitchAction()
    {
        self::setAjaxMode();
        $action = self::getArg('action', AT_posint, true);
        $this->game->actExecuteSpecialSwitchAction($action);
        self::ajaxResponse();
    }

    public function actExecuteSpecialMoveAction()
    {
        self::setAjaxMode();
        $action = self::getArg('action', AT_posint, true);
        $this->game->actExecuteSpecialMoveAction($action);
        self::ajaxResponse();
    }
}
