/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * amenazaGigante implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * amenazagigante.js
 *
 * amenazaGigante user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

 const enum Track {
    'GiantLife'= 'giant-life',
    'quality-attack'= 'quality-attack-track',
    'quality-repair'= 'quality-repair-track',
    'quality-moral'= 'quality-moral-track',
    'supply-ammo'= 'supply-ammo-track',
    'supply-tools'= 'supply-tools-track',
    'supply-trumpet'= 'supply-trumpet-track',
    'city-destruction'= 'city-destruction-track',
 }

const TOKENS = {
    life: 'token-life',
    attack: 'token-attack',
    repair: 'token-repair',
    moral: 'token-moral',
    ammo: 'token-ammo',
    tools: 'token-tools',
    trumpet: 'token-trumpet',
    destruction: 'token-destruction',
};

var widthCard = 186;
var heightCard = 260;

define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter"
],
    function (dojo, declare) {
        return declare("bgagame.amenazagigante", ebg.core.gamegui, {
            constructor: function () {
                console.log('amenazagigante constructor');

                // Here, you can init the global variables of your user interface
                // Example:
                // this.myGlobalValue = 0;

            },

            /*
                setup:
                
                This method must set up the game user interface according to current game situation specified
                in parameters.
                
                The method is called each time the game interface is displayed to a player, ie:
                _ when the game starts
                _ when a player refreshes the game page (F5)
                
                "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
            */

            setup: async function (gamedatas: AmenazaGiganteGamedatas) {
                console.log("Starting game setup");

                document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
                <div id="player-tables"></div>
            `);

                // Setting up player boards

                document.getElementById('player-tables').insertAdjacentHTML('beforeend', `
                <div id="board-wrapper">
                    <div class="tokens-track" id="tokens-track">
                    </div>
                    <div id="giants-path-row" class="board-row">
                        <div class="giants-path-board">
                            <strong>Giant's Path</strong>
                            <div class="giants-path-cards-wrapper">
                                <div class="giantToken" id="giantToken"></div>
                                <div class="giants-path-cards" id="giants">
                                </div> 
                            </div>
                        </div>
                    </div>
                    <div id="heroes-row" class="board-row">
                        <strong>Heroes</strong>
                        <div class="heroes-cards-wrapper">
                            <div class="heroes-cards" id="heroes">
                            </div>
                        </div> 
                    </div>
                    <div id="city-row" class="board-row">
                        <strong>City</strong>
                        <div class="city-card-wrapper">
                            <div class="city-cards">
                                <div class="city-card" id="city-card">
                                    <div class="city-tracks" id="city-tracks">
                                        <div class="track-token" id="token-life"></div>
                                        <div class="track-token" id="token-attack"></div>
                                        <div class="track-token" id="token-repair"></div>
                                        <div class="track-token" id="token-moral"></div>
                                        <div class="track-token" id="token-ammo"></div>
                                        <div class="track-token" id="token-tools"></div>
                                        <div class="track-token" id="token-trumpet"></div>
                                        <div class="track-token" id="token-destruction"></div>

                                        <div class="${Track.GiantLife} life1" id="life1"></div>
                                        <div class="giant-life life2" id="life2"></div>
                                        <div class="giant-life life3" id="life3"></div>
                                        <div class="giant-life life4" id="life4"></div>
                                        <div class="giant-life life5" id="life5"></div>
                                        <div class="giant-life life6" id="life6"></div>
                                        <div class="giant-life life7" id="life7"></div>
                                        <div class="giant-life life8" id="life8"></div>
                                        <div class="giant-life life9" id="life9"></div>
                                        <div class="giant-life life10" id="life10"></div>

                                        <div class="quality-attack-track attack0"></div>
                                        <div class="quality-attack-track attack1" id="attack1"></div>
                                        <div class="quality-attack-track attack2"></div>
                                        <div class="quality-attack-track attack3"></div>
                                        <div class="quality-attack-track attack4"></div>
                                        <div class="quality-attack-track attack5"></div>

                                        <div class="quality-repair-track repair0"></div>
                                        <div class="quality-repair-track repair1" id="repair1"></div>
                                        <div class="quality-repair-track repair2"></div>
                                        <div class="quality-repair-track repair3"></div>
                                        <div class="quality-repair-track repair4"></div>
                                        <div class="quality-repair-track repair5"></div>

                                        <div class="quality-moral-track moral0"></div>
                                        <div class="quality-moral-track moral1"></div>
                                        <div class="quality-moral-track moral2"></div>
                                        <div class="quality-moral-track moral3"></div>
                                        <div class="quality-moral-track moral4"></div>
                                        <div class="quality-moral-track moral5" id="moral5"></div>

                                        <div class="supply-ammo-track ammo0"></div>
                                        <div class="supply-ammo-track ammo1"></div>
                                        <div class="supply-ammo-track ammo2" id="ammo2"></div>
                                        <div class="supply-ammo-track ammo3"></div>
                                        <div class="supply-ammo-track ammo4"></div>

                                        <div class="supply-tools-track tools0"></div>
                                        <div class="supply-tools-track tools1"></div>
                                        <div class="supply-tools-track tools2" id="tools2"></div>
                                        <div class="supply-tools-track tools3"></div>
                                        <div class="supply-tools-track tools4"></div>

                                        <div class="supply-trumpet-track trumpet0"></div>
                                        <div class="supply-trumpet-track trumpet1"></div>
                                        <div class="supply-trumpet-track trumpet2" id="trumpet2"></div>
                                        <div class="supply-trumpet-track trumpet3"></div>
                                        <div class="supply-trumpet-track trumpet4"></div>

                                        <div class="city-destruction-track destruction1"></div>
                                        <div class="city-destruction-track destruction2"></div>
                                        <div class="city-destruction-track destruction3"></div>
                                        <div class="city-destruction-track destruction4" id="destruction4"></div>
                                        <div class="city-destruction-track destruction5"></div>
                                        <div class="city-destruction-track destruction6" id="destruction6"></div>
                                        <div class="city-destruction-track destruction7"></div>
                                        <div class="city-destruction-track destruction8"></div>
                                        <div class="city-destruction-track destruction9"></div>
                                        <div class="city-destruction-track destruction10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `);
                // TODO: Set up your game interface here, according to "gamedatas"

                console.log(gamedatas.heroesCards)
                console.log(gamedatas.giantCards)
                const giantCards = gamedatas.giantCards
                for (const key in giantCards) {
                    console.log('key', key);
                    this.addCardToGiantsPath(giantCards[key], key);
                }

                this.addCardToHerosPath(gamedatas.heroesCards['8']);
                this.addCardToHerosPath(gamedatas.heroesCards['4']);
                this.addCardToHerosPath(gamedatas.heroesCards['1']);

                for (const track in gamedatas.trackState) {
                    console.log(`token-${track}`, `${track}${gamedatas.trackState[track]}`)
                    this.printTokenOnBoard(`token-${track}`, `${track}${gamedatas.trackState[track]}`);

                }



                // const track9 = document.getElementById('life9');
                const track9 = dojo.byId('life9');
                this.connect(track9, 'onclick', () => this.printTokenOnBoard(TOKENS.life, 'life9'));

                const track10 = dojo.byId('life10');
                this.connect(track10, 'onclick', () => this.printTokenOnBoard(TOKENS.life, 'life10'));

                // this.connect(token1, 'onclick', () => this.printTokenOnBoard(token1));

                const anim = this.slideToObject('giantToken', 'card_G1');
                await this.bgaPlayDojoAnimation(anim);
                const token: HTMLElement | null = document.getElementById('giantToken');
                console.log(gamedatas);
                if (token) {
                    token.style.transform = `translate(${2}px, -${2}px)`;
                }


                // await this.printTokenOnBoard(1, gamedatas.trackState[1]);
                // this.placeOnObject('giantToken', 'card_G8');
                // this.slideToObject( "giantToken", "card_G8" ).play();

                // Setup game notifications to handle (see "setupNotifications" method below)
                this.setupNotifications();

                console.log("Ending game setup");
            },


            ///////////////////////////////////////////////////
            //// Game & client states

            // onEnteringState: this method is called each time we are entering into a new game state.
            //                  You can use this method to perform some user interface changes at this moment.
            //
            onEnteringState: function (stateName, args) {
                console.log('Entering state: ' + stateName, args);

                switch (stateName) {
                    case 'giantTurn': 
                        const pos = args.args['giantPath']['giantPos'];

                        console.log('pepe', args.args['giantPath']['cards'][pos]['top']['mandatoryActions'])
                        args.args['giantPath']['cards'][pos]['top']['mandatoryActions'].forEach((action, index) => {
                            console.log('action', action, index);
                            const elem = document.querySelector(`#card_G1 .element.pos-${index+1}`)
                            console.log('elem', elem);
                            this.connect(elem, 'onclick', () => { 
                                console.log('click on action', action.length, action[0]); 

                                action.forEach((act) => {
                                    const element = document.getElementById('token-destruction');
                                    const parent = element.parentElement;
                                    console.log(parent);
    
                                    const num = parent.id.match(/\d+/)[0]; 
                                    const number = parseInt(num) + act.value;
                                    const trackName = `destruction${number}`;
                                    // destruction6
                                    // token-destruction

                                    // track "cityDestruction"
                                    // value : -2

                                    this.printTokenOnBoard(`token-destruction`, trackName);
                                })
                            });
                            elem.style.border = '2px solid red';
                        })
                        break;
                    /* Example:
                    
                    case 'myGameState':
                    
                        // Show some HTML block at this game state
                        dojo.style( 'my_html_block_id', 'display', 'block' );
                        
                        break;
                   */


                    case 'dummy':
                        break;
                }
            },

            // onLeavingState: this method is called each time we are leaving a game state.
            //                 You can use this method to perform some user interface changes at this moment.
            //
            onLeavingState: function (stateName) {
                console.log('Leaving state: ' + stateName);

                switch (stateName) {

                    /* Example:
                    
                    case 'myGameState':
                    
                        // Hide the HTML block we are displaying only during this game state
                        dojo.style( 'my_html_block_id', 'display', 'none' );
                        
                        break;
                   */


                    case 'dummy':
                        break;
                }
            },

            // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
            //                        action status bar (ie: the HTML links in the status bar).
            //        
            onUpdateActionButtons: function (stateName, args) {
                console.log('onUpdateActionButtons: ' + stateName, args);

                if (this.isCurrentPlayerActive()) {
                    switch (stateName) {
                        case 'playerTurn':
                            const playableCardsIds = args.playableCardsIds; // returned by the argPlayerTurn

                            // Add test action buttons in the action status bar, simulating a card click:
                            playableCardsIds.forEach(
                                cardId => this.statusBar.addActionButton(_('Play card with id ${card_id}').replace('${card_id}', cardId), () => this.onCardClick(cardId))
                            );

                            this.statusBar.addActionButton(_('Pass'), () => this.bgaPerformAction("actPass"), { color: 'secondary' });
                            break;
                    }
                }
            },

            ///////////////////////////////////////////////////
            //// Utility methods

            /*
            
                Here, you can defines some utility methods that you can use everywhere in your javascript
                script.
            
            */
            printTokenOnBoard: async function (origId, destId) {
                console.log('printTokenOnBoard', origId, destId);

                const token = document.getElementById(origId);
                const target = document.getElementById(destId);

                token.style.position = 'absolute';
                token.style.left = '0px';
                token.style.top = '0px';

                const anim = this.slideToObject(token.id, target.id);
                await this.bgaPlayDojoAnimation(anim);

                target.appendChild(token);
                token.style.position = ''; // remove absolute positioning
            },


            addCardToHerosPath: function (card) {
                const cardDivId = `card_H${card.id}`;
                const cardHtml = `
                <div id="${cardDivId}" class="card" data-type="${card.type}" data-arg="${card.type_arg}">
                    <div class="hero-actions">
                        <div class="nut"></div>
                        <div class="hero-action action1"></div>
                        <div class="hero-action action2"></div>
                        <div class="hero-action action3"></div>
                        <div class="hero-action action4"></div>
                        <div class="hero-action action5"></div>
                        <div class="hero-action action6"></div>
                        <div class="hero-action action7"></div>
                        <div class="hero-action action8"></div>
                    </div>
                </div>`;

                let cardElem = dojo.byId('heroes');
                dojo.place(cardHtml, cardElem);
                this.formatCardSprite(cardDivId, card.type, card.type_arg, card.id);
            },

            addCardToGiantsPath: function (card, key) {
                const cardDivId = `card_G${key}`;

                const cardHtml = `
                <div id="${cardDivId}" class="card" data-type="${card.type}" data-arg="${card.type_arg}">
                    <div class="card-section top">
                    </div>
                    <div class="card-section middle">
                    </div>
                    <div class="card-section bottom">
                    </div>
                </div>`;

                let cardElem = dojo.byId('giants');
                dojo.place(cardHtml, cardElem);

                this.renderCardZones(cardDivId, card.type_arg);
                this.formatCardSprite(cardDivId, card.type, card.type_arg, card.id);
            },

            renderCardZones: function (cardDivId, numCard) {
                const cardAreasById = {
                    1: {
                        top: [1, 2, 3],
                        middle: [1, 2, 3],
                        bottom: [],
                    },
                    2: {
                        top: [1, 2, 3],
                        middle: [1, 22, 31],
                        bottom: [],
                    },
                    3: {
                        top: [1, 22, 32],
                        middle: [1, 2, 3],
                        bottom: [],
                    },
                    4: {
                        top: [6],
                        middle: [6, 7, 23, 32],
                        bottom: [],
                    },
                    5: {
                        top: [4, 5],
                        middle: [1, 2, 3],
                        bottom: [],
                    },
                    6: {
                        top: [1, 21, 31],
                        middle: [5, 71, 61],
                        bottom: [],
                    },
                    7: {
                        top: [1, 2, 3],
                        middle: [4],
                        bottom: [],
                    },
                    8: {
                        top: [1, 7, 8, 9],
                        middle: [4],
                        bottom: [],
                    },
                    9: {
                        top: [1, 2, 3],
                        middle: [1, 5],
                        bottom: [],
                    },
                };

                const node = dojo.byId(cardDivId);
                const areas = cardAreasById[numCard] || [];

                for (const area in areas) {
                    const zones = areas[area];

                    const areaElem = node.querySelector(`.card-section.${area}`);
                    console.log(areaElem)
                    zones.forEach(zone => {
                        const highlight = document.createElement('div');
                        highlight.classList.add('element', `pos-${zone}`);
                        areaElem.appendChild(highlight);
                    });
                }
            },

            formatCardSprite: function (cardDivId, type, typeArg, index) {
                const node = dojo.byId(cardDivId);
                const col = typeArg - 1;
                const row = (type === 'hero') ? 0 : 1;
                node.style.backgroundImage = 'img/cards.png';
                node.style.backgroundSize = '900% 200%'; // 9 columns, 2 rows
                node.style.backgroundPosition = `${col * -100}% ${row * -100}%`;
                node.style.left = `${(index - 1) * (widthCard + 20)}px`;
            },


            ///////////////////////////////////////////////////
            //// Player's action

            /*
            
                Here, you are defining methods to handle player's action (ex: results of mouse click on 
                game objects).
                
                Most of the time, these methods:
                _ check the action is possible at this game state.
                _ make a call to the game server
            
            */

            // Example:

            onCardClick: function (card_id) {
                console.log('onCardClick', card_id);

                this.bgaPerformAction("actPlayCard", {
                    card_id,
                }).then(() => {
                    // What to do after the server call if it succeeded
                    // (most of the time, nothing, as the game will react to notifs / change of state instead)
                });
            },


            ///////////////////////////////////////////////////
            //// Reaction to cometD notifications

            /*
                setupNotifications:
                
                In this method, you associate each of your game notifications with your local method to handle it.
                
                Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                      your amenazagigante.game.php file.
            
            */
            setupNotifications: function () {
                console.log('notifications subscriptions setup');

                // TODO: here, associate your game notifications with local methods

                // Example 1: standard notification handling
                // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

                // Example 2: standard notification handling + tell the user interface to wait
                //            during 3 seconds after calling the method in order to let the players
                //            see what is happening in the game.
                // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
                // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
                // 
            },

            // TODO: from this point and below, you can write your game notifications handling methods

            /*
            Example:
            
            notif_cardPlayed: function( notif )
            {
                console.log( 'notif_cardPlayed' );
                console.log( notif );
                
                // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
                
                // TODO: play the card in the user interface.
            },    
            
            */
        });
    });
