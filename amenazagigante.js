define("src/managers/SetupHeroTableCenter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetupHeroTableCenter = void 0;
    class SetupHeroTableCenter {
        game;
        args;
        heroStock;
        // Guardamos las selecciones actuales
        selections = { A: null, B: null, C: null };
        constructor(game, args) {
            this.game = game;
            this.args = args;
            this.heroStock = this.initHeroStock();
        }
        initHeroStock() {
            const gridElement = document.getElementById('hero-selection-grid');
            if (!gridElement) {
                throw new Error("No se encontró el contenedor #hero-selection-grid");
            }
            const stock = new LineStock(this.game.cardsManager, gridElement, {
                gap: '20px',
                center: true,
            });
            stock.addCards(this.args.availableHeroes);
            stock.onCardClick = (hero) => {
                this.handleHeroClick(hero);
            };
            return stock;
        }
        handleHeroClick(hero) {
            const type = hero.type; // 'A', 'B' o 'C'
            // Lógica de reemplazo automático
            if (this.selections[type] === hero.id) {
                this.selections[type] = null;
            }
            else {
                this.selections[type] = hero.id;
            }
            this.refreshVisuals();
        }
        refreshVisuals() {
            const selectedIds = Object.values(this.selections).filter(id => id !== null);
            this.heroStock.getCards().forEach(hero => {
                const cardDiv = this.heroStock.getCardElement(hero);
                const isSelected = selectedIds.includes(hero.id);
                const isSameTypeButNotSelected = this.selections[hero.type] !== null && !isSelected;
                cardDiv.classList.toggle('selected', isSelected);
                cardDiv.classList.toggle('dimmed', isSameTypeButNotSelected);
            });
            // Actualizar indicadores de texto
            ['A', 'B', 'C'].forEach(type => {
                const badge = document.getElementById(`badge-type-${type}`);
                badge.innerText = `Tipo ${type}: ${this.selections[type] ? '✅' : '-'}`;
                badge.classList.toggle('complete', !!this.selections[type]);
            });
            // Habilitar/Deshabilitar botón de confirmar en el header de BGA
            const isReady = this.selections.A && this.selections.B && this.selections.C;
            this.game.setActionButtonDisabled('confirm_heroes_button', !isReady);
        }
        getFinalSelection() {
            return Object.values(this.selections).filter(id => id !== null);
        }
    }
    exports.SetupHeroTableCenter = SetupHeroTableCenter;
});
// constructor(cardsManager: CardsManager, args: ArgsHeroSelection) {
//   const heroCards: HeroeCard[] = args.heroCards;
//   const sortedHeroCards: HeroeCard[] = sortedCardsByImageLocation(heroCards);
// document.getElementById(`city-table-center`).insertAdjacentHTML(
//   "beforebegin",
//   `                
//         <div id="setup-table-center">
//           <div id="setup-table-row">
//             <div class="name-wrapper">
//               <span class="name" style="color: #red;">Select Hero</span>
//             </div>
//             <div id="setup-table-cards" class="setup-table-cards">
//               <div id="cards-a"></div>
//               <div id="cards-b"></div>
//               <div id="cards-c"></div>
//             </div>
//           </div>
//         </div>
//     `
// );
//   this.heroACards = new LineStock<Card>(cardsManager, document.getElementById(`cards-a`), {
//     center: true
//   });
//   this.heroBCards = new LineStock<Card>(cardsManager, document.getElementById(`cards-b`), {
//     center: false
//   });
//   this.heroCCards = new LineStock<Card>(cardsManager, document.getElementById(`cards-c`), {
//     center: false
//   });
//   this.heroACards.addCards([sortedHeroCards[0], sortedHeroCards[1], sortedHeroCards[2]]);
//   this.heroBCards.addCards([sortedHeroCards[3], sortedHeroCards[4], sortedHeroCards[5]]);
//   this.heroCCards.addCards([sortedHeroCards[6], sortedHeroCards[7], sortedHeroCards[8]]);
//   document.querySelectorAll(".hero-actions").forEach((card) => {
//     card.remove();
//   });
//   // setup click handler to select / highlight a card and keep one selected per column (A/B/C)
//   document.querySelectorAll("#setup-table-cards .card").forEach((cardEl) => {
//     const el = cardEl as HTMLElement;
//     const handler = dojo.connect(el, "onclick", () => {
//       const cardTypeArg = el.dataset.typeArg;
//       // find which column this card belongs to
//       const parent = el.closest("#cards-a, #cards-b, #cards-c") as HTMLElement | null;
//       let key: "cardA" | "cardB" | "cardC" | null = null;
//       if (parent) {
//         if (parent.id === "cards-a") key = "cardA";
//         else if (parent.id === "cards-b") key = "cardB";
//         else if (parent.id === "cards-c") key = "cardC";
//       }
//       if (!key) return; // safety
//       const alreadySelected = this.cardsSelected[key] === cardTypeArg;
//       // remove previous selection in this column
//       parent!.querySelectorAll(".card.selected").forEach((c) => c.classList.remove("selected"));
//       if (!alreadySelected) {
//         el.classList.add("selected");
//         this.cardsSelected[key] = cardTypeArg;
//       } else {
//         // toggle off if clicked again
//         this.cardsSelected[key] = null;
//       }
//     });
//     this.handlers.push(handler);
//   });
// }
// /**
//  * Check if all hero cards are selected
//  */
// public allCardsSelected(): boolean {
//   return this.cardsSelected.cardA !== null && this.cardsSelected.cardB !== null && this.cardsSelected.cardC !== null;
// }
// /**
//  * Return the selected hero cards (typeArg number)
//  */
// public getSelectedCards(): { cardA: string | null; cardB: string | null; cardC: string | null } {
//   return { ...this.cardsSelected };
// }
// /**
//    * Clean up dojo connections when done
//    */
// public destroy(): void {
//   // Disconnect all stored handlers
//   this.handlers.forEach(handler => {
//     try {
//       dojo.disconnect(handler);
//     } catch (e) {
//       console.warn('Failed to disconnect handler:', e);
//     }
//   });
//   this.handlers = [];
//   // Optional: remove DOM elements if needed
//   document.getElementById('setup-table-center')?.remove();
// }
// }
/// <reference path="../amenazagigante.d.ts" />
define("src/managers/HeroeManager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HeroeManager = void 0;
    var GiantActionActiveEnum;
    (function (GiantActionActiveEnum) {
        GiantActionActiveEnum["ADVANCE_RONDEL"] = "advanceRondel";
        GiantActionActiveEnum["EXCHANGE_RONDEL"] = "exchangeRondel";
        GiantActionActiveEnum["MOVE_RONDEL"] = "moveRondel";
    })(GiantActionActiveEnum || (GiantActionActiveEnum = {}));
    const mapSpecialGiantAction = {
        1: GiantActionActiveEnum.ADVANCE_RONDEL,
        2: GiantActionActiveEnum.EXCHANGE_RONDEL,
        3: GiantActionActiveEnum.MOVE_RONDEL
    };
    class HeroeManager {
        game;
        heroes;
        rondels;
        availableMovements;
        currSelectedRondel = null;
        handlers = {
            nutHandlers: [],
            availableMovementsHandlers: []
        };
        giantActionActive = null;
        trackManager;
        constructor(game, pHeroeCards, pRondels, pAvailableMovements, pTrackManager) {
            this.game = game;
            this.heroes = pHeroeCards;
            this.rondels = pRondels;
            this.availableMovements = pAvailableMovements;
            this.trackManager = pTrackManager;
        }
        mapRondelCharToIdLocation(rondel, location) {
            return `card-${rondel.heroe}-action-${location ?? rondel.location}`;
        }
        mapRondelCharToIdLocationHighlight(rondel, location) {
            return `card-${rondel.heroe}-action-highlight-${location ?? rondel.location}`;
        }
        async printRondelOnBoard(rondelChar, destId) {
            const rondel = document.getElementById(`rondel${rondelChar}`);
            const target = document.getElementById(destId);
            if (!rondel || !target) {
                console.error("Could not find rondel or target element");
                return;
            }
            rondel.style.position = "absolute";
            rondel.style.left = "0px";
            rondel.style.top = "0px";
            const anim = this.game.slideToObject(rondel.id, target.id);
            await this.game.bgaPlayDojoAnimation(anim);
            target.appendChild(rondel);
            rondel.style.position = "";
        }
        setupRondels() {
            for (const rondelKey in this.rondels) {
                const rondelObj = this.rondels[rondelKey];
                const rondelPosId = this.mapRondelCharToIdLocation(rondelObj);
                this.printRondelOnBoard(rondelObj.char, rondelPosId);
            }
        }
        getNutsFromChars(nutChars) {
            return this.rondels.filter((rondel) => nutChars.includes(rondel.char));
        }
        getNutObjByChar(rondelChar) {
            return this.rondels.find((rondel) => rondel.char === rondelChar);
        }
        getHTMLNutElemByChar(rondelChar) {
            return document.getElementById(`rondel${rondelChar}`);
        }
        setSelectableNut(nutsChar) {
            nutsChar.forEach((nutChar) => {
                this.getHTMLNutElemByChar(nutChar)?.classList.add("selectable-nut");
            });
        }
        removeSelectableNut(nutsChar) {
            nutsChar.forEach((nutChar) => {
                this.getHTMLNutElemByChar(nutChar)?.classList.remove("selectable-nut");
            });
        }
        setEnabledNut(nutChars, enabled) {
            this.getNutsFromChars(nutChars).forEach((nut) => {
                nut.enabled = enabled;
            });
        }
        addNutClickHandler(nutChars) {
            for (const nutChar of nutChars) {
                const nutHTMLElem = this.getHTMLNutElemByChar(nutChar);
                if (!nutHTMLElem)
                    continue;
                const handler = dojo.connect(nutHTMLElem, "onclick", () => this.onClickNutEvent(nutChar));
                this.handlers.nutHandlers.push({ rondel: nutChar, handler });
            }
        }
        removeNutClickHandler(nutChars) {
            const newHandlers = [];
            this.handlers.nutHandlers.forEach(({ rondel: char, handler }) => {
                if (nutChars.includes(char)) {
                    dojo.disconnect(handler);
                }
                else {
                    newHandlers.push({ rondel: char, handler });
                }
            });
            this.handlers.nutHandlers = newHandlers;
        }
        removeAvailableMovementsClickHandler() {
            this.handlers.availableMovementsHandlers.forEach((handler) => {
                dojo.disconnect(handler);
            });
            this.handlers.availableMovementsHandlers = [];
        }
        initGiantPhase(specialGiantAction) {
            this.giantActionActive = mapSpecialGiantAction[specialGiantAction];
            this.setEnabledNut(["A", "B", "C"], true);
            this.setSelectableNut(["A", "B", "C"]);
            this.addNutClickHandler(["A", "B", "C"]);
        }
        initHeroPhase() {
            this.giantActionActive = null;
            this.setEnabledNut(["A", "B", "C"], true);
            this.setSelectableNut(["A", "B", "C"]);
            this.addNutClickHandler(["A", "B", "C"]);
        }
        unselectNut(specialAction) {
            this.resetAll();
            this.setSpecialGiantAction(specialAction);
            this.enableRondels();
            this.currSelectedRondel = null;
        }
        getOthersNut(rondel) {
            return Object.values(this.rondels).filter((r) => r.char !== rondel.char);
        }
        removeSelectableRondels(rondels) {
            if (!rondels || rondels.length === 0) {
                document.querySelectorAll(".selectable-rondel").forEach((el) => {
                    el.classList.remove("selectable-rondel");
                });
                this.removeNutClickHandler(["A", "B", "C"]);
                this.handlers.nutHandlers = [];
            }
            else {
                const rondelChars = this.rondels.map((r) => r.char);
                rondelChars.forEach((char) => {
                    const selector = `#rondel${char}.selectable-rondel`;
                    document.querySelectorAll(selector).forEach((el) => {
                        el.classList.remove("selectable-rondel");
                    });
                });
                this.removeNutClickHandler(["A", "B", "C"]);
            }
        }
        unselectRondel() {
            console.debug("Unselecting rondel");
            this.removeHighlighedtActions();
            document.querySelectorAll(".selected-rondel").forEach((el) => {
                el.classList.remove("selected-rondel");
            });
            this.removeSelectableRondels();
            for (const rondelKey in this.rondels) {
                const rondel = this.rondels[rondelKey];
                if (rondel.enabled) {
                    // this.setSelectableRondel(rondel);
                }
            }
            this.resetAvailableMovement();
            this.currSelectedRondel = null;
        }
        setCurrSelectedRondel(rondel) {
            this.currSelectedRondel = rondel;
        }
        removeCurrSelectedRondel() {
            this.currSelectedRondel = null;
        }
        setSelectedNut(nutChar) {
            this.getHTMLNutElemByChar(nutChar)?.classList.add("selected-nut");
        }
        removeSelectedNut(nutChar) {
            this.getHTMLNutElemByChar(nutChar)?.classList.remove("selected-nut");
        }
        onClickNutEvent(nutChar) {
            if (this.currSelectedRondel?.char === nutChar) {
                console.log("deseleccion");
                this.removeSelectableNut([nutChar]);
                this.removeNutClickHandler([nutChar]);
                this.removeCurrSelectedRondel();
                this.setEnabledNut(["A", "B", "C"], true);
                this.setSelectableNut(["A", "B", "C"]);
                this.addNutClickHandler(["A", "B", "C"]);
                this.removeHighlighedtActions();
                this.removeAvailableMovementsClickHandler();
                this.removeSelectedNut(nutChar);
                return;
            }
            const nut = this.getNutObjByChar(nutChar);
            if (!nut)
                return;
            const nuts = this.getOthersNut(nut);
            this.removeSelectableNut(nuts.map((n) => n.char));
            this.removeNutClickHandler(nuts.map((n) => n.char));
            this.setCurrSelectedRondel(nut);
            this.setSelectedNut(nutChar);
            this.showAvailableHeroMovements(nut);
        }
        getValidMovementsByMoral() {
            const qualityMoral = this.trackManager.getTracks().qualityMoral;
            switch (qualityMoral) {
                case 5:
                case 4:
                    return [1, 2, 3, 4, 5, 6, 7, 8];
                case 3:
                case 2:
                    return [1, 2, 3, 5, 6, 7];
                case 1:
                    return [1, 3, 5, 7];
                default:
                    return [1, 2, 3, 4, 5, 6, 7, 8];
            }
        }
        adjustToValidLocation(currentLocation, validLocations) {
            if (validLocations.includes(currentLocation)) {
                return currentLocation;
            }
            const sorted = [...validLocations].sort((a, b) => a - b);
            for (let i = sorted.length - 1; i >= 0; i--) {
                if (sorted[i] < currentLocation) {
                    return sorted[i];
                }
            }
            return sorted[sorted.length - 1];
        }
        getNextRondelLocation(current, movement, morale) {
            const index = morale.indexOf(current);
            if (index === -1) {
                throw new Error("Invalid current location for given morale level");
            }
            const newIndex = (index + movement + morale.length) % morale.length;
            return morale[newIndex];
        }
        showSpecialMovement(rondel) {
            this.removeHighlighedtActions();
            let availableMovements;
            if (this.giantActionActive == GiantActionActiveEnum.ADVANCE_RONDEL) {
                availableMovements = [1];
            }
            else if (this.giantActionActive == GiantActionActiveEnum.MOVE_RONDEL) {
                availableMovements = [-1, 1];
            }
            else {
                throw new Error("ACTION INVALIDA");
            }
            const validMovements = this.getValidMovementsByMoral();
            const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
            availableMovements.forEach((movement) => {
                const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
                const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
                const elem = document.getElementById(elemId);
                if (!elem)
                    return;
                elem.classList.add("highlighted-action");
                const handler = dojo.connect(elem, "onclick", () => {
                    this.onSpecialGiantActionSelected([rondel.char], rondelNewLocation);
                });
                this.handlers.availableMovementsHandlers.push(handler);
            });
        }
        removeHighlighedtActions() {
            document.querySelectorAll(".highlighted-action").forEach((el) => {
                el.classList.remove("highlighted-action");
            });
        }
        removeNutAvailable() {
            document.querySelectorAll(".available-nut").forEach((el) => {
                el.classList.remove("available-nut");
            });
        }
        resetAvailableMovement() {
            this.removeHighlighedtActions();
            this.handlers.availableMovementsHandlers.forEach((handler) => dojo.disconnect(handler));
            this.handlers.availableMovementsHandlers = [];
        }
        resetNut() {
            this.removeNutAvailable();
            this.handlers.nutHandlers.forEach((h) => dojo.disconnect(h.handler));
            this.handlers.nutHandlers = [];
        }
        resetAll() {
            this.resetAvailableMovement();
            this.resetNut();
            this.giantActionActive = null;
        }
        enableSwitchMovement(rondelClicked) {
            console.log("enableSwitchMovement", rondelClicked);
            this.currSelectedRondel = rondelClicked;
            for (const rondelKey in this.rondels) {
                const rondelObj = this.rondels[rondelKey];
                if (rondelObj.char !== rondelClicked.char) {
                    const rondelElem = document.getElementById(`rondel${rondelObj.char}`);
                    if (!rondelElem)
                        continue;
                    rondelElem.parentElement?.classList.add("highlighted-action");
                    const handler = dojo.connect(rondelElem, "onclick", () => this.onExchangeNutSelected(rondelObj, rondelClicked));
                    this.handlers.nutHandlers.push({ rondel: rondelObj.char, handler });
                }
            }
        }
        showAvailableHeroMovements(rondel) {
            console.log(rondel, this.availableMovements);
            this.removeHighlighedtActions();
            const validMovements = this.getValidMovementsByMoral();
            const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
            this.availableMovements.forEach((movement) => {
                const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
                const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
                const elem = document.getElementById(elemId);
                if (!elem)
                    return;
                elem.classList.add("highlighted-action");
                const handler = dojo.connect(elem, "onclick", () => {
                    this.onAvailableMovementSelected(rondel, movement, rondelNewLocation);
                });
                this.handlers.availableMovementsHandlers.push(handler);
            });
        }
        onExchangeNutSelected(rondelA, rondelB) {
            console.log(rondelA, rondelB);
            this.game.onSpecialGiantActionClick([rondelA.char, rondelB.char], null, this.giantActionActive);
        }
        onSpecialGiantActionSelected(rondel, rondelNewLocation) {
            this.game.onSpecialGiantActionClick(rondel, rondelNewLocation, this.giantActionActive);
        }
        onAvailableMovementSelected(rondel, movement, rondelNewLocation) {
            this.game.onHeroeActionCardClick(rondel, movement, rondelNewLocation);
        }
        setSpecialGiantAction(specialAction) {
            if (specialAction === null) {
                this.giantActionActive = null;
            }
            else {
                this.giantActionActive = mapSpecialGiantAction[specialAction];
            }
        }
        enableRondels() {
            console.log("enableRondels called");
            this.removeNutAvailable();
            for (const rondelKey in this.rondels) {
                const rondel = this.rondels[rondelKey];
                console.log("enabled", rondel.enabled);
                if (rondel.enabled) {
                    const rondelElem = this.getHTMLNutElemByChar(rondel.char);
                    if (!rondelElem)
                        continue;
                    const handler = dojo.connect(rondelElem, "onclick", () => this.setSelectedRondel(rondel));
                    this.handlers.nutHandlers.push({ rondel: rondel.char, handler });
                }
            }
        }
        setSelectedRondel(rondel) {
            this.currSelectedRondel = rondel;
            this.getHTMLNutElemByChar(rondel.char)?.classList.add("selected-rondel");
            const otherChars = this.getOthersNut(rondel).map((r) => r.char);
            this.removeSelectableRondels(otherChars);
            this.showAvailableHeroMovements(rondel);
        }
    }
    exports.HeroeManager = HeroeManager;
});
define("src/amenazagigante", ["require", "exports", "src/managers/SetupHeroTableCenter", "src/managers/HeroeManager"], function (require, exports, SetupHeroTableCenter_1, HeroeManager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const LOCAL_STORAGE_ZOOM_KEY = "AmenazaGigante-zoom";
    // @ts-ignore
    const gameState = {
        playerSelectHeroes: "playerSelectHeroes",
        giantAdvance: "giantAdvance",
        giantResolution: "giantResolution",
        heroesDistribution: "heroesDistribution",
        heroesActions: "heroesActions",
        cityVerification: "cityVerification"
    };
    const actName = {
        selectHeroes: "actSelectHeroes",
        executeMandatoryAction: "actExecuteMandatoryAction",
        executeOptionalAction: "actExecuteOptionalAction",
        executeSpecialSwitchAction: "actExecuteSpecialSwitchAction",
        executeSpecialMoveAction: "actExecuteSpecialMoveAction"
    };
    // @ts-ignore
    GameGui = (function () {
        // this hack required so we fake extend GameGui
        function GameGui() { }
        return GameGui;
    })();
    class AmenazaGigante extends GameGui {
        // public cardsManager: CardsManager;
        // public animationManager: AnimationManager;
        // public trackManager: TrackManager;
        // public heroeManager: HeroeManager;
        // public giantManager: GiantManager;
        // public gamedatas: AmenazaGiganteGamedatas;
        // // @ts-ignore
        // private zoomManager: BgaZoom.Manager;
        // private giantTableCenter: GiantTableCenter;
        // private heroeTableCenter: HeroeTableCenter;
        // private cityTableCenter: CityTableCenter;
        // private currentGameState: string;
        // Referencias a los Managers
        animationManager;
        cardsManager;
        trackManager;
        heroManager;
        setupHeroTableCenter;
        giantManager;
        zoomManager;
        constructor() {
            super();
        }
        setup(gamedatas) {
            // 1. Inicialización de utilidades globales
            this.animationManager = new AnimationManager(this);
            this.cardsManager = new CardsManager(this);
            // 2. Configurar la UI según el estado actual al cargar la página
            this.updateUIVisibility(this.gamedatas.gamestate.name);
            this.initializeComponentsByState(gamedatas);
            // 3. Inicializar Zoom (apuntando al contenedor padre)
            this.initZoom();
            // 4. Suscripción única a notificaciones
            this.setupNotifications();
        }
        // Callback methods required by HeroeManager
        onSpecialGiantActionClick(rondelsChar, newLocation, actionType) {
            console.log(rondelsChar, newLocation, actionType);
            if (actionType === "exchangeRondel") {
                this.bgaPerformAction("actExecuteSpecialSwitchAction", {
                    rondelChar1: rondelsChar[0],
                    rondelChar2: rondelsChar[1]
                });
            }
            else {
                this.bgaPerformAction("actExecuteSpecialMoveAction", {
                    rondelChar: rondelsChar[0],
                    newLocation: newLocation
                });
            }
        }
        onHeroeActionCardClick(rondel, movement, newLocation) {
            console.log("Hero action clicked", rondel, movement, newLocation);
            this.bgaPerformAction("actExecuteOptionalAction", {
                rondelChar: rondel.char,
                movement: movement,
                newLocation: newLocation
            });
        }
        /**
         * Maneja el ruteo de estados de BGA
         */
        onEnteringState(stateName, args) {
            console.log("Entering state: " + stateName, args.args);
            this.updateUIVisibility(stateName);
            switch (stateName) {
                case gameState.playerSelectHeroes:
                    // Si no existe (porque refrescó justo en este estado), lo creamos
                    if (!this.setupHeroTableCenter) {
                        this.setupHeroTableCenter = new SetupHeroTableCenter_1.SetupHeroTableCenter(this, args);
                    }
                    break;
                case gameState.giantAdvance:
                    console.log("Entering giantAdvance state: Do nothing");
                    break;
                case gameState.giantResolution:
                    console.log("Entering giantResolution state: highlight actions");
                    // this.onEnteringGiantMandatoryMove();
                    break;
                case gameState.heroesDistribution:
                    console.log("Entering heroesDistribution state: Do nothing");
                    break;
                case gameState.heroesActions:
                    // this.onEnteringHeroePhase(args.args);
                    break;
                case gameState.cityVerification:
                    console.log("Entering cityVerification state: Do nothing");
                    break;
                default:
                    break;
            }
        }
        /**
           * Controla qué "pantalla" se ve (Selección vs Juego)
           */
        updateUIVisibility(stateName) {
            const isSelection = stateName === 'playerSelectHeroes';
            const heroSelectionPhase = document.getElementById("hero-selection-phase");
            const mainGamePhase = document.getElementById("main-game-phase");
            if (heroSelectionPhase)
                heroSelectionPhase.style.display = isSelection ? 'block' : 'none';
            if (mainGamePhase)
                mainGamePhase.style.display = isSelection ? 'none' : 'block';
        }
        /**
         * Instancia solo lo necesario para no sobrecargar el DOM
         */
        initializeComponentsByState(gamedatas) {
            const stateName = gamedatas.gamestate.name;
            // 1. Managers que SIEMPRE deben existir (Backend Logic)
            // Estos se encargan de procesar datos, independientemente de si se ven o no.
            this.animationManager = new AnimationManager(this);
            this.cardsManager = new CardsManager(this);
            // 2. Ruteo según el estado
            if (stateName === 'playerSelectHeroes') {
                this.initHeroSelection(gamedatas.gamestate.args);
            }
            else {
                this.initMainGame(gamedatas);
            }
        }
        initHeroSelection(args) {
            // Solo instanciamos el manager de la fase inicial
            this.setupHeroTableCenter = new SetupHeroTableCenter_1.SetupHeroTableCenter(this, args);
        }
        initMainGame(gamedatas) {
            // Si ya pasamos la selección, inicializamos todo el tablero
            this.trackManager = new TrackManager(gamedatas.cityData.track, this);
            this.trackManager.setupTrack();
            const { giantPosition, giantCards, giantArea } = gamedatas.giantData;
            this.giantManager = new GiantManager(giantPosition, giantArea, giantCards);
            this.giantManager.setupGiant();
            const { rondels, heroCards } = gamedatas.heroData;
            this.heroManager = new HeroeManager_1.HeroeManager(this, heroCards, rondels.rondels, rondels.availableMovements, this.trackManager);
            this.heroManager.setupRondels();
        }
        initZoom() {
            const fullTable = document.getElementById("full-table");
            if (!fullTable) {
                console.warn("Could not find full-table element for zoom");
                return;
            }
            this.zoomManager = new BgaZoom.Manager({
                element: fullTable,
                zoomLevels: [0.5, 0.75, 1, 1.25, 1.5],
                autoZoom: { expectedWidth: 880, minZoomLevel: 0.5 }
            });
        }
        // public onLeavingState(stateName: string) {
        //   switch (stateName) {
        //     case gameState.playerSelectHeroes:
        //       console.log("leaving playerSelectHeroes state: Do nothing");
        //       // document.getElementById('heroe-table-center').dataset.visible = 'true';
        //       break;
        //     case gameState.giantAdvance:
        //       console.log("leaving giantAdvance");
        //       break;
        //     case gameState.giantResolution:
        //       this.onLeavingGiantMandatoryMove();
        //       break;
        //     case gameState.heroesDistribution:
        //       console.log("leaving heroesDistribution");
        //       break;
        //     case gameState.heroesActions:
        //       this.onLeavingHeroePhase();
        //       break;
        //     case gameState.cityVerification:
        //       console.log("leaving cityVerification");
        //       break;
        //     default:
        //       break;
        //   }
        // }
        // private onEnteringGiantMandatoryMove() {
        //   console.log("onEnteringGiantMandatoryMove", this.giantManager);
        //   this.giantManager.highlightMandatoryAction();
        // }
        // private onLeavingGiantMandatoryMove() {
        //   this.giantManager.resetGiantActions();
        //   // this.heroeManager.resetAll();
        // }
        // private onEnteringGiantOptionalMove() {
        //   this.giantManager.highlightOptionalActions();
        // }
        // private onLeavingGiantOptionalMove() {
        //   this.giantManager.resetGiantActions();
        // }
        // private onEnteringGiantSpecialAction(args: EnteringGiantSpecialAction) {
        //   console.log("onEnteringGiantSpecialAction");
        //   this.heroeManager.initGiantPhase(args.specialGiantAction);
        //   // this.heroeManager.resetEnableRondels();
        //   // this.heroeManager.enableRondels();
        // }
        // private onLeavingGiantSpecialAction() {
        //   console.log("onLeavingGiantSpecialAction");
        //   this.heroeManager.resetAll();
        // }
        // private onEnteringHeroePhase(args: EnteringHeroePhase) {
        //   console.log("onEnteringHeroePhase", args.rondels);
        //   this.heroeManager.initHeroPhase();
        //   // TODO actualizar rondeles habilitados
        //   // console.log(this.heroeManager);
        //   // this.heroeManager.updateRondelState(args.rondels);
        //   // this.heroeManager.enableRondels();
        // }
        // private onLeavingHeroePhase() {
        //   this.heroeManager.resetAll();
        // }
        // public onUpdateActionButtons(stateName: string, args: any) {
        //   console.log("onUpdateActionButtons");
        //   switch (stateName) {
        //     case gameState.playerSelectHeroes:
        //       this.statusBar.addActionButton("Confirm Selection", () => {
        //         const setup = this.setupHeroTableCenter;
        //         if (!setup.allCardsSelected()) {
        //           alert("Please select three cards before continue.");
        //           return;
        //         }
        //         const selected = setup.getSelectedCards();
        //         this.playSelectedHeroes({
        //           cardA: selected.cardA,
        //           cardB: selected.cardB,
        //           cardC: selected.cardC
        //         });
        //       });
        //       break;
        //     case gameState.giantResolution:
        //       break;
        //     default:
        //       break;
        //   }
        //   this.statusBar.addActionButton("debug", () => {
        //     console.log(this.heroeManager);
        //     console.log(this.trackManager);
        //     console.log(this.giantManager);
        //     // console.log(this.giantManager.placeGiantToken());
        //     // this.giantTableCenter.addNewCard();
        //     const actName = "actSelectHeroes";
        //     // this.bgaPerformAction(actName, {
        //     //   cardA: '1',
        //     //   cardB: '5',
        //     //   cardC: '7'
        //     // });
        //   });
        // }
        setupNotifications() {
            this.bgaSetupPromiseNotifications();
        }
    }
});
// declare const getLibUrl: Function;
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    getLibUrl('bga-zoom', '1.0.0'),
    getLibUrl('bga-score-sheet', '1.0.0'),
], function (dojo, declare, gamegui, counter, BgaZoom, BgaScoreSheet) {
    window.BgaZoom = BgaZoom;
    window.BgaScoreSheet = BgaScoreSheet;
    return declare("bgagame.amenazagigante", ebg.core.gamegui, new AmenazaGigante());
});
class BgaAnimation {
    animationFunction;
    settings;
    played = null;
    result = null;
    playWhenNoAnimation = false;
    constructor(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
    }
}
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function attachWithAnimation(animationManager, animation) {
    const settings = animation.settings;
    const element = settings.animation.settings.element;
    const fromRect = element.getBoundingClientRect();
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.appendChild(element);
    settings.afterAttach?.(element, settings.attachElement);
    return animationManager.play(settings.animation);
}
class BgaAttachWithAnimation extends BgaAnimation {
    constructor(settings) {
        super(attachWithAnimation, settings);
        this.playWhenNoAnimation = true;
    }
}
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
class BgaCumulatedAnimation extends BgaAnimation {
    constructor(settings) {
        super(cumulatedAnimations, settings);
        this.playWhenNoAnimation = true;
    }
}
/**
 * Just does nothing for the duration
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function pauseAnimation(animationManager, animation) {
    const promise = new Promise((success) => {
        const settings = animation.settings;
        const duration = settings?.duration ?? 500;
        setTimeout(() => success(), duration);
    });
    return promise;
}
class BgaPauseAnimation extends BgaAnimation {
    constructor(settings) {
        super(pauseAnimation, settings);
    }
}
/**
 * Show the element at the center of the screen
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function showScreenCenterAnimation(animationManager, animation) {
    const promise = new Promise((success) => {
        const settings = animation.settings;
        const element = settings.element;
        const elementBR = element.getBoundingClientRect();
        const xCenter = (elementBR.left + elementBR.right) / 2;
        const yCenter = (elementBR.top + elementBR.bottom) / 2;
        const x = xCenter - (window.innerWidth / 2);
        const y = yCenter - (window.innerHeight / 2);
        const duration = settings?.duration ?? 500;
        const originalZIndex = element.style.zIndex;
        const originalTransition = element.style.transition;
        const transitionTimingFunction = settings.transitionTimingFunction ?? 'linear';
        element.style.zIndex = `${settings?.zIndex ?? 10}`;
        let timeoutId = null;
        const cleanOnTransitionEnd = () => {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        const cleanOnTransitionCancel = () => {
            element.style.transition = ``;
            element.offsetHeight;
            element.style.transform = settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
        element.offsetHeight;
        element.style.transform = `translate(${-x}px, ${-y}px) rotate(${settings?.rotationDelta ?? 0}deg)`;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
class BgaShowScreenCenterAnimation extends BgaAnimation {
    constructor(settings) {
        super(showScreenCenterAnimation, settings);
    }
}
/**
 * Slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideAnimation(animationManager, animation) {
    const promise = new Promise((success) => {
        const settings = animation.settings;
        const element = settings.element;
        let { x, y } = getDeltaCoordinates(element, settings);
        const duration = settings.duration ?? 500;
        const originalZIndex = element.style.zIndex;
        const originalTransition = element.style.transition;
        const transitionTimingFunction = settings.transitionTimingFunction ?? 'linear';
        element.style.zIndex = `${settings?.zIndex ?? 10}`;
        element.style.transition = null;
        element.offsetHeight;
        element.style.transform = `translate(${-x}px, ${-y}px) rotate(${settings?.rotationDelta ?? 0}deg)`;
        let timeoutId = null;
        const cleanOnTransitionEnd = () => {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        const cleanOnTransitionCancel = () => {
            element.style.transition = ``;
            element.offsetHeight;
            element.style.transform = settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
        element.offsetHeight;
        element.style.transform = settings?.finalTransform ?? null;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
class BgaSlideAnimation extends BgaAnimation {
    constructor(settings) {
        super(slideAnimation, settings);
    }
}
/**
 * Slide of the element from destination to origin.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideToAnimation(animationManager, animation) {
    const promise = new Promise((success) => {
        const settings = animation.settings;
        const element = settings.element;
        let { x, y } = getDeltaCoordinates(element, settings);
        const duration = settings?.duration ?? 500;
        const originalZIndex = element.style.zIndex;
        const originalTransition = element.style.transition;
        const transitionTimingFunction = settings.transitionTimingFunction ?? 'linear';
        element.style.zIndex = `${settings?.zIndex ?? 10}`;
        let timeoutId = null;
        const cleanOnTransitionEnd = () => {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        const cleanOnTransitionCancel = () => {
            element.style.transition = ``;
            element.offsetHeight;
            element.style.transform = settings?.finalTransform ?? null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = `transform ${duration}ms ${transitionTimingFunction}`;
        element.offsetHeight;
        element.style.transform = `translate(${-x}px, ${-y}px) rotate(${settings?.rotationDelta ?? 0}deg) scale(${settings.scale ?? 1})`;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
class BgaSlideToAnimation extends BgaAnimation {
    constructor(settings) {
        super(slideToAnimation, settings);
    }
}
function shouldAnimate(settings) {
    return document.visibilityState !== 'hidden' && !settings?.game?.instantaneousMode;
}
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
function getDeltaCoordinates(element, settings) {
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error(`[bga-animation] fromDelta, fromRect or fromElement need to be set`);
    }
    let x = 0;
    let y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        const originBR = settings.fromRect ?? settings.fromElement.getBoundingClientRect();
        // TODO make it an option ?
        const originalTransform = element.style.transform;
        element.style.transform = '';
        const destinationBR = element.getBoundingClientRect();
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x, y };
}
function logAnimation(animationManager, animation) {
    const settings = animation.settings;
    const element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
class AnimationManager {
    game;
    settings;
    /**
     * The zoom manager, providing the current scale.
     */
    zoomManager;
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    constructor(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings?.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    getZoomManager() {
        return this.zoomManager;
    }
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    setZoomManager(zoomManager) {
        this.zoomManager = zoomManager;
    }
    getSettings() {
        return this.settings;
    }
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    animationsActive() {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    }
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    async play(animation) {
        animation.played = animation.playWhenNoAnimation || this.animationsActive();
        if (animation.played) {
            const settings = animation.settings;
            settings.animationStart?.(animation);
            settings.element?.classList.add(settings.animationClass ?? 'bga-animations_animated');
            animation.settings = {
                duration: animation.settings?.duration ?? this.settings?.duration ?? 500,
                scale: animation.settings?.scale ?? this.zoomManager?.zoom ?? undefined,
                ...animation.settings,
            };
            animation.result = await animation.animationFunction(this, animation);
            animation.settings.animationEnd?.(animation);
            settings.element?.classList.remove(settings.animationClass ?? 'bga-animations_animated');
        }
        else {
            return Promise.resolve(animation);
        }
    }
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    async playParallel(animations) {
        return Promise.all(animations.map(animation => this.play(animation)));
    }
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    async playSequence(animations) {
        if (animations.length) {
            const result = await this.play(animations[0]);
            const others = await this.playSequence(animations.slice(1));
            return [result, ...others];
        }
        else {
            return Promise.resolve([]);
        }
    }
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    async playWithDelay(animations, delay) {
        const promise = new Promise((success) => {
            let promises = [];
            for (let i = 0; i < animations.length; i++) {
                setTimeout(() => {
                    promises.push(this.play(animations[i]));
                    if (i == animations.length - 1) {
                        Promise.all(promises).then(result => {
                            success(result);
                        });
                    }
                }, i * delay);
            }
        });
        return promise;
    }
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    attachWithAnimation(animation, attachElement) {
        const attachWithAnimation = new BgaAttachWithAnimation({
            animation,
            attachElement
        });
        return this.play(attachWithAnimation);
    }
}
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
class CardStock {
    manager;
    element;
    settings;
    cards = [];
    selectedCards = [];
    selectionMode = 'none';
    sort;
    /**
     * Called when selection change. Returns the selection.
     *
     * selection: the selected cards of the stock
     * lastChange: the last change on selection card (can be selected or unselected)
     */
    onSelectionChange;
    /**
     * Called when selection change. Returns the clicked card.
     *
     * card: the clicked card (can be selected or unselected)
     */
    onCardClick;
    /**
     * Creates the stock and register it on the manager.
     *
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        manager.addStock(this);
        element?.classList.add('card-stock' /*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        this.bindClick();
        this.sort = settings?.sort;
    }
    /**
     * Removes the stock and unregister it on the manager.
     */
    remove() {
        this.manager.removeStock(this);
        this.element?.remove();
    }
    /**
     * @returns the cards on the stock
     */
    getCards() {
        return this.cards.slice();
    }
    /**
     * @returns if the stock is empty
     */
    isEmpty() {
        return !this.cards.length;
    }
    /**
     * @returns the selected cards
     */
    getSelection() {
        return this.selectedCards.slice();
    }
    /**
     * @returns the selected cards
     */
    isSelected(card) {
        return this.selectedCards.some(c => this.manager.getId(c) == this.manager.getId(card));
    }
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    contains(card) {
        return this.cards.some(c => this.manager.getId(c) == this.manager.getId(card));
    }
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    getCardElement(card) {
        return this.manager.getCardElement(card);
    }
    /**
     * Checks if the card can be added. By default, only if it isn't already present in the stock.
     *
     * @param card the card to add
     * @param settings the addCard settings
     * @returns if the card can be added
     */
    canAddCard(card, settings) {
        return !this.contains(card);
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card, animation, settings) {
        if (!this.canAddCard(card, settings)) {
            return Promise.resolve(false);
        }
        let promise;
        // we check if card is in a stock
        const originStock = this.manager.getCardStock(card);
        const index = this.getNewCardIndex(card);
        const settingsWithIndex = {
            index,
            ...(settings ?? {})
        };
        const updateInformations = settingsWithIndex.updateInformations ?? true;
        let needsCreation = true;
        if (originStock?.contains(card)) {
            let element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, { ...animation, fromStock: originStock, }, settingsWithIndex);
                needsCreation = false;
                if (!updateInformations) {
                    element.dataset.side = (settingsWithIndex?.visible ?? this.manager.isCardVisible(card)) ? 'front' : 'back';
                }
            }
        }
        else if (animation?.fromStock?.contains(card)) {
            let element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, animation, settingsWithIndex);
                needsCreation = false;
            }
        }
        if (needsCreation) {
            const element = this.getCardElement(card);
            if (needsCreation && element) {
                console.warn(`Card ${this.manager.getId(card)} already exists, not re-created.`);
            }
            // if the card comes from a stock but is not found in this stock, the card is probably hudden (deck with a fake top card)
            const fromBackSide = !settingsWithIndex?.visible && !animation?.originalSide && animation?.fromStock && !animation?.fromStock?.contains(card);
            const createdVisible = fromBackSide ? false : settingsWithIndex?.visible ?? this.manager.isCardVisible(card);
            const newElement = element ?? this.manager.createCardElement(card, createdVisible);
            promise = this.moveFromElement(card, newElement, animation, settingsWithIndex);
        }
        if (settingsWithIndex.index !== null && settingsWithIndex.index !== undefined) {
            this.cards.splice(index, 0, card);
        }
        else {
            this.cards.push(card);
        }
        if (updateInformations) { // after splice/push
            this.manager.updateCardInformations(card);
        }
        if (!promise) {
            console.warn(`CardStock.addCard didn't return a Promise`);
            promise = Promise.resolve(false);
        }
        if (this.selectionMode !== 'none') {
            // make selectable only at the end of the animation
            promise.then(() => this.setSelectableCard(card, settingsWithIndex.selectable ?? true));
        }
        return promise;
    }
    getNewCardIndex(card) {
        if (this.sort) {
            const otherCards = this.getCards();
            for (let i = 0; i < otherCards.length; i++) {
                const otherCard = otherCards[i];
                if (this.sort(card, otherCard) < 0) {
                    return i;
                }
            }
            return otherCards.length;
        }
        else {
            return undefined;
        }
    }
    addCardElementToParent(cardElement, settings) {
        const parent = settings?.forceToElement ?? this.element;
        if (settings?.index === null || settings?.index === undefined || !parent.children.length || settings?.index >= parent.children.length) {
            parent.appendChild(cardElement);
        }
        else {
            parent.insertBefore(cardElement, parent.children[settings.index]);
        }
    }
    moveFromOtherStock(card, cardElement, animation, settings) {
        let promise;
        const element = animation.fromStock.contains(card) ? this.manager.getCardElement(card) : animation.fromStock.element;
        const fromRect = element?.getBoundingClientRect();
        this.addCardElementToParent(cardElement, settings);
        this.removeSelectionClassesFromElement(cardElement);
        promise = fromRect ? this.animationFromElement(cardElement, fromRect, {
            originalSide: animation.originalSide,
            rotationDelta: animation.rotationDelta,
            animation: animation.animation,
        }) : Promise.resolve(false);
        // in the case the card was move inside the same stock we don't remove it
        if (animation.fromStock && animation.fromStock != this) {
            animation.fromStock.removeCard(card);
        }
        if (!promise) {
            console.warn(`CardStock.moveFromOtherStock didn't return a Promise`);
            promise = Promise.resolve(false);
        }
        return promise;
    }
    moveFromElement(card, cardElement, animation, settings) {
        let promise;
        this.addCardElementToParent(cardElement, settings);
        if (animation) {
            if (animation.fromStock) {
                promise = this.animationFromElement(cardElement, animation.fromStock.element.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
                animation.fromStock.removeCard(card);
            }
            else if (animation.fromElement) {
                promise = this.animationFromElement(cardElement, animation.fromElement.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
            }
        }
        else {
            promise = Promise.resolve(false);
        }
        if (!promise) {
            console.warn(`CardStock.moveFromElement didn't return a Promise`);
            promise = Promise.resolve(false);
        }
        return promise;
    }
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    async addCards(cards, animation, settings, shift = false) {
        if (!this.manager.animationsActive()) {
            shift = false;
        }
        let promises = [];
        if (shift === true) {
            if (cards.length) {
                const result = await this.addCard(cards[0], animation, settings);
                const others = await this.addCards(cards.slice(1), animation, settings, shift);
                return result || others;
            }
        }
        else if (typeof shift === 'number') {
            for (let i = 0; i < cards.length; i++) {
                promises.push(new Promise(resolve => {
                    setTimeout(() => this.addCard(cards[i], animation, settings).then(result => resolve(result)), i * shift);
                }));
            }
        }
        else {
            promises = cards.map(card => this.addCard(card, animation, settings));
        }
        const results = await Promise.all(promises);
        return results.some(result => result);
    }
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    removeCard(card, settings) {
        let promise;
        if (this.contains(card) && this.element.contains(this.getCardElement(card))) {
            promise = this.manager.removeCard(card, settings);
        }
        else {
            promise = Promise.resolve(false);
        }
        this.cardRemoved(card, settings);
        return promise;
    }
    /**
     * Notify the stock that a card is removed.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    cardRemoved(card, settings) {
        const index = this.cards.findIndex(c => this.manager.getId(c) == this.manager.getId(card));
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
        if (this.selectedCards.find(c => this.manager.getId(c) == this.manager.getId(card))) {
            this.unselectCard(card);
        }
    }
    /**
     * Remove a set of card from the stock.
     *
     * @param cards the cards to remove
     * @param settings a `RemoveCardSettings` object
     */
    async removeCards(cards, settings) {
        const promises = cards.map(card => this.removeCard(card, settings));
        const results = await Promise.all(promises);
        return results.some(result => result);
    }
    /**
     * Remove all cards from the stock.
     * @param settings a `RemoveCardSettings` object
     */
    async removeAll(settings) {
        const cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        return this.removeCards(cards, settings);
    }
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     * @param selectableCards the selectable cards (all if unset). Calls `setSelectableCards` method
     */
    setSelectionMode(selectionMode, selectableCards) {
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.cards.forEach(card => this.setSelectableCard(card, selectionMode != 'none'));
        this.element.classList.toggle('bga-cards_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getCards().forEach(card => this.removeSelectionClasses(card));
        }
        else {
            this.setSelectableCards(selectableCards ?? this.getCards());
        }
    }
    setSelectableCard(card, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        const element = this.getCardElement(card);
        const selectableCardsClass = this.getSelectableCardClass();
        const unselectableCardsClass = this.getUnselectableCardClass();
        if (selectableCardsClass) {
            element?.classList.toggle(selectableCardsClass, selectable);
        }
        if (unselectableCardsClass) {
            element?.classList.toggle(unselectableCardsClass, !selectable);
        }
        if (!selectable && this.isSelected(card)) {
            this.unselectCard(card, true);
        }
    }
    /**
     * Set the selectable class for each card.
     *
     * @param selectableCards the selectable cards. If unset, all cards are marked selectable. Default unset.
     */
    setSelectableCards(selectableCards) {
        if (this.selectionMode === 'none') {
            return;
        }
        const selectableCardsIds = (selectableCards ?? this.getCards()).map(card => this.manager.getId(card));
        this.cards.forEach(card => this.setSelectableCard(card, selectableCardsIds.includes(this.manager.getId(card))));
    }
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    selectCard(card, silent = false) {
        if (this.selectionMode == 'none') {
            return;
        }
        const element = this.getCardElement(card);
        const selectableCardsClass = this.getSelectableCardClass();
        if (!element || !element.classList.contains(selectableCardsClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.cards.filter(c => this.manager.getId(c) != this.manager.getId(card)).forEach(c => this.unselectCard(c, true));
        }
        const selectedCardsClass = this.getSelectedCardClass();
        element.classList.add(selectedCardsClass);
        this.selectedCards.push(card);
        if (!silent) {
            this.onSelectionChange?.(this.selectedCards.slice(), card);
        }
    }
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    unselectCard(card, silent = false) {
        const element = this.getCardElement(card);
        const selectedCardsClass = this.getSelectedCardClass();
        element?.classList.remove(selectedCardsClass);
        const index = this.selectedCards.findIndex(c => this.manager.getId(c) == this.manager.getId(card));
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
        }
        if (!silent) {
            this.onSelectionChange?.(this.selectedCards.slice(), card);
        }
    }
    /**
     * Select all cards
     */
    selectAll(silent = false) {
        if (this.selectionMode == 'none') {
            return;
        }
        this.cards.forEach(c => this.selectCard(c, true));
        if (!silent) {
            this.onSelectionChange?.(this.selectedCards.slice(), null);
        }
    }
    /**
     * Unelect all cards
     */
    unselectAll(silent = false) {
        const cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        cards.forEach(c => this.unselectCard(c, true));
        if (!silent) {
            this.onSelectionChange?.(this.selectedCards.slice(), null);
        }
    }
    bindClick() {
        this.element?.addEventListener('click', event => {
            const cardDiv = event.target.closest('.card');
            if (!cardDiv) {
                return;
            }
            const card = this.cards.find(c => this.manager.getId(c) == cardDiv.id);
            if (!card) {
                return;
            }
            this.cardClick(card);
        });
    }
    cardClick(card) {
        if (this.selectionMode != 'none') {
            const alreadySelected = this.selectedCards.some(c => this.manager.getId(c) == this.manager.getId(card));
            if (alreadySelected) {
                this.unselectCard(card);
            }
            else {
                this.selectCard(card);
            }
        }
        this.onCardClick?.(card);
    }
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    async animationFromElement(element, fromRect, settings) {
        const side = element.dataset.side;
        if (settings.originalSide && settings.originalSide != side) {
            const cardSides = element.getElementsByClassName('card-sides')[0];
            cardSides.style.transition = 'none';
            element.dataset.side = settings.originalSide;
            setTimeout(() => {
                cardSides.style.transition = null;
                element.dataset.side = side;
            });
        }
        let animation = settings.animation;
        if (animation) {
            animation.settings.element = element;
            animation.settings.fromRect = fromRect;
        }
        else {
            animation = new BgaSlideAnimation({ element, fromRect });
        }
        const result = await this.manager.animationManager.play(animation);
        return result?.played ?? false;
    }
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    setCardVisible(card, visible, settings) {
        this.manager.setCardVisible(card, visible, settings);
    }
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    flipCard(card, settings) {
        this.manager.flipCard(card, settings);
    }
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    getSelectableCardClass() {
        return this.settings?.selectableCardClass === undefined ? this.manager.getSelectableCardClass() : this.settings?.selectableCardClass;
    }
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    getUnselectableCardClass() {
        return this.settings?.unselectableCardClass === undefined ? this.manager.getUnselectableCardClass() : this.settings?.unselectableCardClass;
    }
    /**
     * @returns the class to apply to selected cards. Use class from manager is unset.
     */
    getSelectedCardClass() {
        return this.settings?.selectedCardClass === undefined ? this.manager.getSelectedCardClass() : this.settings?.selectedCardClass;
    }
    removeSelectionClasses(card) {
        this.removeSelectionClassesFromElement(this.getCardElement(card));
    }
    removeSelectionClassesFromElement(cardElement) {
        const selectableCardsClass = this.getSelectableCardClass();
        const unselectableCardsClass = this.getUnselectableCardClass();
        const selectedCardsClass = this.getSelectedCardClass();
        cardElement?.classList.remove(selectableCardsClass, unselectableCardsClass, selectedCardsClass);
    }
}
class SlideAndBackAnimation extends BgaCumulatedAnimation {
    constructor(manager, element, tempElement) {
        const distance = (manager.getCardWidth() + manager.getCardHeight()) / 2;
        const angle = Math.random() * Math.PI * 2;
        const fromDelta = {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
        super({
            animations: [
                new BgaSlideToAnimation({ element, fromDelta, duration: 250 }),
                new BgaSlideAnimation({ element, fromDelta, duration: 250, animationEnd: tempElement ? (() => element.remove()) : undefined }),
            ]
        });
    }
}
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness). *
 * Needs cardWidth and cardHeight to be set in the card manager.
 */
class Deck extends CardStock {
    manager;
    element;
    cardNumber;
    autoUpdateCardNumber;
    autoRemovePreviousCards;
    fakeCardGenerator;
    thicknesses;
    constructor(manager, element, settings) {
        super(manager, element);
        this.manager = manager;
        this.element = element;
        element.classList.add('deck');
        const cardWidth = this.manager.getCardWidth();
        const cardHeight = this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            this.element.style.setProperty('--width', `${cardWidth}px`);
            this.element.style.setProperty('--height', `${cardHeight}px`);
        }
        else {
            throw new Error(`You need to set cardWidth and cardHeight in the card manager to use Deck.`);
        }
        this.fakeCardGenerator = settings?.fakeCardGenerator ?? manager.getFakeCardGenerator();
        this.thicknesses = settings.thicknesses ?? [0, 2, 5, 10, 20, 30];
        this.setCardNumber(settings.cardNumber ?? 0);
        this.autoUpdateCardNumber = settings.autoUpdateCardNumber ?? true;
        this.autoRemovePreviousCards = settings.autoRemovePreviousCards ?? true;
        const shadowDirection = settings.shadowDirection ?? 'bottom-right';
        const shadowDirectionSplit = shadowDirection.split('-');
        const xShadowShift = shadowDirectionSplit.includes('right') ? 1 : (shadowDirectionSplit.includes('left') ? -1 : 0);
        const yShadowShift = shadowDirectionSplit.includes('bottom') ? 1 : (shadowDirectionSplit.includes('top') ? -1 : 0);
        this.element.style.setProperty('--xShadowShift', '' + xShadowShift);
        this.element.style.setProperty('--yShadowShift', '' + yShadowShift);
        if (settings.topCard) {
            this.addCard(settings.topCard);
        }
        else if (settings.cardNumber > 0) {
            this.addCard(this.getFakeCard());
        }
        if (settings.counter && (settings.counter.show ?? true)) {
            if (settings.cardNumber === null || settings.cardNumber === undefined) {
                console.warn(`Deck card counter created without a cardNumber`);
            }
            this.createCounter(settings.counter.position ?? 'bottom', settings.counter.extraClasses ?? 'round', settings.counter.counterId);
            if (settings.counter?.hideWhenEmpty) {
                this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
            }
        }
        this.setCardNumber(settings.cardNumber ?? 0);
    }
    createCounter(counterPosition, extraClasses, counterId) {
        const left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        const top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', `${left}%`);
        this.element.style.setProperty('--bga-cards-deck-top', `${top}%`);
        this.element.insertAdjacentHTML('beforeend', `
            <div ${counterId ? `id="${counterId}"` : ''} class="bga-cards_deck-counter ${extraClasses}"></div>
        `);
    }
    /**
     * Get the the cards number.
     *
     * @returns the cards number
     */
    getCardNumber() {
        return this.cardNumber;
    }
    /**
     * Set the the cards number.
     *
     * @param cardNumber the cards number
     * @param topCard the deck top card. If unset, will generated a fake card (default). Set it to null to not generate a new topCard.
     */
    setCardNumber(cardNumber, topCard = undefined) {
        let promise = Promise.resolve(false);
        const oldTopCard = this.getTopCard();
        if (topCard !== null && cardNumber > 0) {
            const newTopCard = topCard || this.getFakeCard();
            if (!oldTopCard || this.manager.getId(newTopCard) != this.manager.getId(oldTopCard)) {
                promise = this.addCard(newTopCard, undefined, { autoUpdateCardNumber: false });
            }
        }
        else if (cardNumber == 0 && oldTopCard) {
            promise = this.removeCard(oldTopCard, { autoUpdateCardNumber: false });
        }
        this.cardNumber = cardNumber;
        this.element.dataset.empty = (this.cardNumber == 0).toString();
        let thickness = 0;
        this.thicknesses.forEach((threshold, index) => {
            if (this.cardNumber >= threshold) {
                thickness = index;
            }
        });
        this.element.style.setProperty('--thickness', `${thickness}px`);
        const counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = `${cardNumber}`;
        }
        return promise;
    }
    addCard(card, animation, settings) {
        if (settings?.autoUpdateCardNumber ?? this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber + 1, null);
        }
        const promise = super.addCard(card, animation, settings);
        if (settings?.autoRemovePreviousCards ?? this.autoRemovePreviousCards) {
            promise.then(() => {
                const previousCards = this.getCards().slice(0, -1); // remove last cards
                this.removeCards(previousCards, { autoUpdateCardNumber: false });
            });
        }
        return promise;
    }
    cardRemoved(card, settings) {
        if (settings?.autoUpdateCardNumber ?? this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber - 1);
        }
        super.cardRemoved(card, settings);
    }
    async removeAll(settings) {
        const promise = super.removeAll({
            ...settings,
            autoUpdateCardNumber: settings?.autoUpdateCardNumber ?? false
        });
        if (settings?.autoUpdateCardNumber ?? true) {
            this.setCardNumber(0, null);
        }
        return promise;
    }
    getTopCard() {
        const cards = this.getCards();
        return cards.length ? cards[cards.length - 1] : null;
    }
    /**
     * Shows a shuffle animation on the deck
     *
     * @param animatedCardsMax number of animated cards for shuffle animation.
     * @param fakeCardSetter a function to generate a fake card for animation. Required if the card id is not based on a numerci `id` field, or if you want to set custom card back
     * @returns promise when animation ends
     */
    async shuffle(settings) {
        const animatedCardsMax = settings?.animatedCardsMax ?? 10;
        this.addCard(settings?.newTopCard ?? this.getFakeCard(), undefined, { autoUpdateCardNumber: false });
        if (!this.manager.animationsActive()) {
            return Promise.resolve(false); // we don't execute as it's just visual temporary stuff
        }
        const animatedCards = Math.min(10, animatedCardsMax, this.getCardNumber());
        if (animatedCards > 1) {
            const elements = [this.getCardElement(this.getTopCard())];
            const getFakeCard = (uid) => {
                let newCard;
                if (settings?.fakeCardSetter) {
                    newCard = {};
                    settings?.fakeCardSetter(newCard, uid);
                }
                else {
                    newCard = this.fakeCardGenerator(`${this.element.id}-shuffle-${uid}`);
                }
                return newCard;
            };
            let uid = 0;
            for (let i = elements.length; i <= animatedCards; i++) {
                let newCard;
                do {
                    newCard = getFakeCard(uid++);
                } while (this.manager.getCardElement(newCard)); // To make sure there isn't a fake card remaining with the same uid
                const newElement = this.manager.createCardElement(newCard, false);
                newElement.dataset.tempCardForShuffleAnimation = 'true';
                this.element.prepend(newElement);
                elements.push(newElement);
            }
            await this.manager.animationManager.playWithDelay(elements.map(element => new SlideAndBackAnimation(this.manager, element, element.dataset.tempCardForShuffleAnimation == 'true')), 50);
            const pauseDelayAfterAnimation = settings?.pauseDelayAfterAnimation ?? 500;
            if (pauseDelayAfterAnimation > 0) {
                await this.manager.animationManager.play(new BgaPauseAnimation({ duration: pauseDelayAfterAnimation }));
            }
            return true;
        }
        else {
            return Promise.resolve(false);
        }
    }
    getFakeCard() {
        return this.fakeCardGenerator(this.element.id);
    }
}
class AllVisibleDeck extends CardStock {
    manager;
    element;
    constructor(manager, element, settings) {
        super(manager, element, settings);
        this.manager = manager;
        this.element = element;
        element.classList.add('all-visible-deck', settings.direction ?? 'vertical');
        const cardWidth = this.manager.getCardWidth();
        const cardHeight = this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            this.element.style.setProperty('--width', `${cardWidth}px`);
            this.element.style.setProperty('--height', `${cardHeight}px`);
        }
        else {
            throw new Error(`You need to set cardWidth and cardHeight in the card manager to use Deck.`);
        }
        element.style.setProperty('--vertical-shift', settings.verticalShift ?? settings.shift ?? '3px');
        element.style.setProperty('--horizontal-shift', settings.horizontalShift ?? settings.shift ?? '3px');
        if (settings.counter && (settings.counter.show ?? true)) {
            this.createCounter(settings.counter.position ?? 'bottom', settings.counter.extraClasses ?? 'round', settings.counter.counterId);
            if (settings.counter?.hideWhenEmpty) {
                this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
                this.element.dataset.empty = 'true';
            }
        }
    }
    addCard(card, animation, settings) {
        let promise;
        const order = this.cards.length;
        promise = super.addCard(card, animation, settings);
        const cardId = this.manager.getId(card);
        const cardDiv = document.getElementById(cardId);
        cardDiv.style.setProperty('--order', '' + order);
        this.cardNumberUpdated();
        return promise;
    }
    /**
     * Set opened state. If true, all cards will be entirely visible.
     *
     * @param opened indicate if deck must be always opened. If false, will open only on hover/touch
     */
    setOpened(opened) {
        this.element.classList.toggle('opened', opened);
    }
    cardRemoved(card) {
        super.cardRemoved(card);
        this.cards.forEach((c, index) => {
            const cardId = this.manager.getId(c);
            const cardDiv = document.getElementById(cardId);
            cardDiv.style.setProperty('--order', '' + index);
        });
        this.cardNumberUpdated();
    }
    createCounter(counterPosition, extraClasses, counterId) {
        const left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        const top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', `${left}%`);
        this.element.style.setProperty('--bga-cards-deck-top', `${top}%`);
        this.element.insertAdjacentHTML('beforeend', `
            <div ${counterId ? `id="${counterId}"` : ''} class="bga-cards_deck-counter ${extraClasses}"></div>
        `);
    }
    /**
     * Updates the cards number, if the counter is visible.
     */
    cardNumberUpdated() {
        const cardNumber = this.cards.length;
        this.element.style.setProperty('--tile-count', '' + cardNumber);
        this.element.dataset.empty = (cardNumber == 0).toString();
        const counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = `${cardNumber}`;
        }
    }
}
/**
 * A basic stock for a list of cards, based on flex.
 */
class LineStock extends CardStock {
    manager;
    element;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    constructor(manager, element, settings) {
        super(manager, element, settings);
        this.manager = manager;
        this.element = element;
        element.classList.add('line-stock');
        element.dataset.center = (settings?.center ?? true).toString();
        element.style.setProperty('--wrap', settings?.wrap ?? 'wrap');
        element.style.setProperty('--direction', settings?.direction ?? 'row');
        element.style.setProperty('--gap', settings?.gap ?? '8px');
    }
}
/**
 * A stock with fixed slots (some can be empty)
 */
class SlotStock extends LineStock {
    manager;
    element;
    slotsIds = [];
    slots = [];
    slotClasses;
    mapCardToSlot;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    constructor(manager, element, settings) {
        super(manager, element, settings);
        this.manager = manager;
        this.element = element;
        element.classList.add('slot-stock');
        this.mapCardToSlot = settings.mapCardToSlot;
        this.slotsIds = settings.slotsIds ?? [];
        this.slotClasses = settings.slotClasses ?? [];
        this.slotsIds.forEach(slotId => {
            this.createSlot(slotId);
        });
    }
    createSlot(slotId) {
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        this.slots[slotId].classList.add(...['slot', ...this.slotClasses]);
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card, animation, settings) {
        const slotId = settings?.slot ?? this.mapCardToSlot?.(card);
        if (slotId === undefined) {
            throw new Error(`Impossible to add card to slot : no SlotId. Add slotId to settings or set mapCardToSlot to SlotCard constructor.`);
        }
        if (!this.slots[slotId]) {
            throw new Error(`Impossible to add card to slot "${slotId}" : slot "${slotId}" doesn't exists.`);
        }
        const newSettings = {
            ...settings,
            forceToElement: this.slots[slotId],
        };
        return super.addCard(card, animation, newSettings);
    }
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    setSlotsIds(slotsIds) {
        if (slotsIds.length == this.slotsIds.length && slotsIds.every((slotId, index) => this.slotsIds[index] === slotId)) {
            // no change
            return;
        }
        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds ?? [];
        this.slotsIds.forEach(slotId => {
            this.createSlot(slotId);
        });
    }
    /**
     * Add new slots ids. Will not change nor empty the existing ones.
     *
     * @param slotsIds the new slotsIds. Will be merged with the old ones.
     */
    addSlotsIds(newSlotsIds) {
        if (newSlotsIds.length == 0) {
            // no change
            return;
        }
        this.slotsIds.push(...newSlotsIds);
        newSlotsIds.forEach(slotId => {
            this.createSlot(slotId);
        });
    }
    canAddCard(card, settings) {
        if (!this.contains(card)) {
            return true;
        }
        else {
            const closestSlot = this.getCardElement(card).closest('.slot');
            if (closestSlot) {
                const currentCardSlot = closestSlot.dataset.slotId;
                const slotId = settings?.slot ?? this.mapCardToSlot?.(card);
                return currentCardSlot != slotId;
            }
            else {
                return true;
            }
        }
    }
    /**
     * Swap cards inside the slot stock.
     *
     * @param cards the cards to swap
     * @param settings for `updateInformations` and `selectable`
     */
    swapCards(cards, settings) {
        if (!this.mapCardToSlot) {
            throw new Error('You need to define SlotStock.mapCardToSlot to use SlotStock.swapCards');
        }
        const promises = [];
        const elements = cards.map(card => this.manager.getCardElement(card));
        const elementsRects = elements.map(element => element.getBoundingClientRect());
        const cssPositions = elements.map(element => element.style.position);
        // we set to absolute so it doesn't mess with slide coordinates when 2 div are at the same place
        elements.forEach(element => element.style.position = 'absolute');
        cards.forEach((card, index) => {
            const cardElement = elements[index];
            let promise;
            const slotId = this.mapCardToSlot?.(card);
            this.slots[slotId].appendChild(cardElement);
            cardElement.style.position = cssPositions[index];
            const cardIndex = this.cards.findIndex(c => this.manager.getId(c) == this.manager.getId(card));
            if (cardIndex !== -1) {
                this.cards.splice(cardIndex, 1, card);
            }
            if (settings?.updateInformations ?? true) { // after splice/push
                this.manager.updateCardInformations(card);
            }
            this.removeSelectionClassesFromElement(cardElement);
            promise = this.animationFromElement(cardElement, elementsRects[index], {});
            if (!promise) {
                console.warn(`CardStock.animationFromElement didn't return a Promise`);
                promise = Promise.resolve(false);
            }
            promise.then(() => this.setSelectableCard(card, settings?.selectable ?? true));
            promises.push(promise);
        });
        return Promise.all(promises);
    }
}
/**
 * A stock to make cards disappear (to automatically remove discarded cards, or to represent a bag)
 */
class VoidStock extends CardStock {
    manager;
    element;
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    constructor(manager, element) {
        super(manager, element);
        this.manager = manager;
        this.element = element;
        element.classList.add('void-stock');
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    addCard(card, animation, settings) {
        let promise = super.addCard(card, animation, settings);
        // center the element
        const cardElement = this.getCardElement(card);
        const originalLeft = cardElement.style.left;
        const originalTop = cardElement.style.top;
        cardElement.style.left = `${(this.element.clientWidth - cardElement.clientWidth) / 2}px`;
        cardElement.style.top = `${(this.element.clientHeight - cardElement.clientHeight) / 2}px`;
        if (!promise) {
            console.warn(`VoidStock.addCard didn't return a Promise`);
            promise = Promise.resolve(false);
        }
        if (settings?.remove ?? true) {
            return promise.then(() => {
                return this.removeCard(card);
            });
        }
        else {
            cardElement.style.left = originalLeft;
            cardElement.style.top = originalTop;
            return promise;
        }
    }
}
class CardManager {
    game;
    settings;
    animationManager;
    stocks = [];
    updateMainTimeoutId = [];
    updateFrontTimeoutId = [];
    updateBackTimeoutId = [];
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    constructor(game, settings) {
        this.game = game;
        this.settings = settings;
        this.animationManager = settings.animationManager ?? new AnimationManager(game);
    }
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    animationsActive() {
        return this.animationManager.animationsActive();
    }
    addStock(stock) {
        this.stocks.push(stock);
    }
    removeStock(stock) {
        const index = this.stocks.indexOf(stock);
        if (index !== -1) {
            this.stocks.splice(index, 1);
        }
    }
    /**
     * @param card the card informations
     * @return the id for a card
     */
    getId(card) {
        return this.settings.getId?.(card) ?? `card-${card.id}`;
    }
    createCardElement(card, visible = true) {
        const id = this.getId(card);
        const side = visible ? 'front' : 'back';
        if (this.getCardElement(card)) {
            throw new Error('This card already exists ' + JSON.stringify(card));
        }
        const element = document.createElement("div");
        element.id = id;
        element.dataset.side = '' + side;
        element.innerHTML = `
            <div class="card-sides">
                <div id="${id}-front" class="card-side front">
                </div>
                <div id="${id}-back" class="card-side back">
                </div>
            </div>
        `;
        element.classList.add('card');
        document.body.appendChild(element);
        this.settings.setupDiv?.(card, element);
        this.settings.setupFrontDiv?.(card, element.getElementsByClassName('front')[0]);
        this.settings.setupBackDiv?.(card, element.getElementsByClassName('back')[0]);
        document.body.removeChild(element);
        return element;
    }
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    getCardElement(card) {
        return document.getElementById(this.getId(card));
    }
    /**
     * Remove a card.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    removeCard(card, settings) {
        const id = this.getId(card);
        const div = document.getElementById(id);
        if (!div) {
            return Promise.resolve(false);
        }
        div.id = `deleted${id}`;
        div.remove();
        // if the card is in a stock, notify the stock about removal
        this.getCardStock(card)?.cardRemoved(card, settings);
        return Promise.resolve(true);
    }
    /**
     * Returns the stock containing the card.
     *
     * @param card the card informations
     * @return the stock containing the card
     */
    getCardStock(card) {
        return this.stocks.find(stock => stock.contains(card));
    }
    /**
     * Return if the card passed as parameter is suppose to be visible or not.
     * Use `isCardVisible` from settings if set, else will check if `card.type` is defined
     *
     * @param card the card informations
     * @return the visiblility of the card (true means front side should be displayed)
     */
    isCardVisible(card) {
        return this.settings.isCardVisible?.(card) ?? (card.type ?? false);
    }
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     * @param visible if the card is set to visible face. If unset, will use isCardVisible(card)
     * @param settings the flip params (to update the card in current stock)
     */
    setCardVisible(card, visible, settings) {
        const element = this.getCardElement(card);
        if (!element) {
            return;
        }
        const isVisible = visible ?? this.isCardVisible(card);
        element.dataset.side = isVisible ? 'front' : 'back';
        const stringId = JSON.stringify(this.getId(card));
        if (settings?.updateMain ?? false) {
            if (this.updateMainTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateMainTimeoutId[stringId]);
                delete this.updateMainTimeoutId[stringId];
            }
            const updateMainDelay = settings?.updateMainDelay ?? 0;
            if (isVisible && updateMainDelay > 0 && this.animationsActive()) {
                this.updateMainTimeoutId[stringId] = setTimeout(() => this.settings.setupDiv?.(card, element), updateMainDelay);
            }
            else {
                this.settings.setupDiv?.(card, element);
            }
        }
        if (settings?.updateFront ?? true) {
            if (this.updateFrontTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateFrontTimeoutId[stringId]);
                delete this.updateFrontTimeoutId[stringId];
            }
            const updateFrontDelay = settings?.updateFrontDelay ?? 500;
            if (!isVisible && updateFrontDelay > 0 && this.animationsActive()) {
                this.updateFrontTimeoutId[stringId] = setTimeout(() => this.settings.setupFrontDiv?.(card, element.getElementsByClassName('front')[0]), updateFrontDelay);
            }
            else {
                this.settings.setupFrontDiv?.(card, element.getElementsByClassName('front')[0]);
            }
        }
        if (settings?.updateBack ?? false) {
            if (this.updateBackTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateBackTimeoutId[stringId]);
                delete this.updateBackTimeoutId[stringId];
            }
            const updateBackDelay = settings?.updateBackDelay ?? 0;
            if (isVisible && updateBackDelay > 0 && this.animationsActive()) {
                this.updateBackTimeoutId[stringId] = setTimeout(() => this.settings.setupBackDiv?.(card, element.getElementsByClassName('back')[0]), updateBackDelay);
            }
            else {
                this.settings.setupBackDiv?.(card, element.getElementsByClassName('back')[0]);
            }
        }
        if (settings?.updateData ?? true) {
            // card data has changed
            const stock = this.getCardStock(card);
            const cards = stock.getCards();
            const cardIndex = cards.findIndex(c => this.getId(c) === this.getId(card));
            if (cardIndex !== -1) {
                stock.cards.splice(cardIndex, 1, card);
            }
        }
    }
    /**
     * Flips the card.
     *
     * @param card the card informations
     * @param settings the flip params (to update the card in current stock)
     */
    flipCard(card, settings) {
        const element = this.getCardElement(card);
        const currentlyVisible = element.dataset.side === 'front';
        this.setCardVisible(card, !currentlyVisible, settings);
    }
    /**
     * Update the card informations. Used when a card with just an id (back shown) should be revealed, with all data needed to populate the front.
     *
     * @param card the card informations
     */
    updateCardInformations(card, settings) {
        const newSettings = { ...(settings ?? {}), updateData: true, };
        this.setCardVisible(card, undefined, newSettings);
    }
    /**
     * @returns the card with set in the settings (undefined if unset)
     */
    getCardWidth() {
        return this.settings?.cardWidth;
    }
    /**
     * @returns the card height set in the settings (undefined if unset)
     */
    getCardHeight() {
        return this.settings?.cardHeight;
    }
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_selectable-card'.
     */
    getSelectableCardClass() {
        return this.settings?.selectableCardClass === undefined ? 'bga-cards_selectable-card' : this.settings?.selectableCardClass;
    }
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_disabled-card'.
     */
    getUnselectableCardClass() {
        return this.settings?.unselectableCardClass === undefined ? 'bga-cards_disabled-card' : this.settings?.unselectableCardClass;
    }
    /**
     * @returns the class to apply to selected cards. Default 'bga-cards_selected-card'.
     */
    getSelectedCardClass() {
        return this.settings?.selectedCardClass === undefined ? 'bga-cards_selected-card' : this.settings?.selectedCardClass;
    }
    getFakeCardGenerator() {
        return this.settings?.fakeCardGenerator ?? (deckId => ({ id: this.getId({ id: `${deckId}-fake-top-card` }) }));
    }
}
function sortFunction(...sortedFields) {
    return (a, b) => {
        for (let i = 0; i < sortedFields.length; i++) {
            let direction = 1;
            let field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            const type = typeof a[field];
            if (type === 'string') {
                const compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                const compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
class CardsManager extends CardManager {
    game;
    constructor(game) {
        super(game, {
            getId: (card) => `card-${card.id}`,
            setupDiv: (card, div) => {
                div.dataset.cardId = "" + card.id;
                div.dataset.type = "" + card.type;
                div.dataset.typeArg = "" + card.typeArg;
            },
            setupFrontDiv: (card, div) => this.setupFrontDiv(card, div),
            isCardVisible: (card) => !card.flipped,
            animationManager: game.animationManager,
            cardWidth: 186,
            cardHeight: 260 //208,
        });
        this.game = game;
    }
    setupFrontDiv(card, div, ignoreTooltip = false) {
        div.dataset.index = "" + card.index;
        const index = card.index;
        const col = (index % 9) - 1;
        const row = card.type - 1;
        div.style.backgroundPositionX = `${(col * 100) / 8}%`;
        div.style.backgroundPositionY = `${(row * 100) / 2}%`;
        if (card.index === 10) {
            // Fake card
            return;
        }
        // Check giant card
        if (card.type === 2) {
            // Draw section areas
            if (!div.querySelector(".card-section")) {
                div.insertAdjacentHTML(`beforeend`, `
            <div class="card-section top"></div>
            <div class="card-section middle"></div>
            <div class="card-section bottom"></div>
            `);
                this.drawGiantActionAreas(card.index, div);
            }
        }
        // Check heroe card
        if (card.type === 1) {
            let rondelChar;
            switch (card.typeArg) {
                case 1:
                case 2:
                case 3:
                    rondelChar = "A";
                    break;
                case 4:
                case 5:
                case 6:
                    rondelChar = "B";
                    break;
                case 7:
                case 8:
                case 9:
                    rondelChar = "C";
                    break;
                default:
                    break;
            }
            // Draw section areas
            if (!div.querySelector(".hero-actions")) {
                div.insertAdjacentHTML(`beforeend`, `
            <div class="hero-actions">
                <div class="nut" id="rondel${rondelChar}"></div>

                <div class="hero-action action-highlight" 
                     data-pos="1"
                     id="card-${card.typeArg}-action-highlight-1"></div>

                <div class="hero-action action" 
                     data-pos="1" 
                     id="card-${card.typeArg}-action-1"></div>

                <div class="hero-action action-highlight" 
                     data-pos="2" 
                     id="card-${card.typeArg}-action-highlight-2"></div>

                <div class="hero-action action" 
                     data-pos="2" 
                     id="card-${card.typeArg}-action-2"></div>
                
                     <div class="hero-action action-highlight" data-pos="3" id="card-${card.typeArg}-action-highlight-3"></div>
                <div class="hero-action action" data-pos="3" id="card-${card.typeArg}-action-3"></div>

                <div class="hero-action action-highlight" data-pos="4" id="card-${card.typeArg}-action-highlight-4"></div>
                <div class="hero-action action" data-pos="4" id="card-${card.typeArg}-action-4"></div>

                <div class="hero-action action-highlight" data-pos="5" id="card-${card.typeArg}-action-highlight-5"></div>
                <div class="hero-action action" data-pos="5" id="card-${card.typeArg}-action-5"></div>

                <div class="hero-action action-highlight" data-pos="6" id="card-${card.typeArg}-action-highlight-6"></div>
                <div class="hero-action action" data-pos="6" id="card-${card.typeArg}-action-6"></div>

                <div class="hero-action action-highlight" data-pos="7" id="card-${card.typeArg}-action-highlight-7"></div>
                <div class="hero-action action" data-pos="7" id="card-${card.typeArg}-action-7"></div>

                <div class="hero-action action-highlight" data-pos="8" id="card-${card.typeArg}-action-highlight-8"></div>
                <div class="hero-action action" data-pos="8" id="card-${card.typeArg}-action-8"></div>
            </div>
            `);
            }
        }
    }
    //  <div class="hero-action action1" id="${card.typeArg}-action1"></div>
    //         <div class="hero-action actionhighlighted1" id="${card.typeArg}-action1"></div>
    //         <div class="hero-action action2" id="${card.typeArg}-action2"></div>
    //         <div class="hero-action actionhighlighted2" id="${card.typeArg}-action2"></div>
    //         <div class="hero-action action3" id="${card.typeArg}-action3"></div>
    //         <div class="hero-action actionhighlighted3" id="${card.typeArg}-action3"></div>
    //         <div class="hero-action action4" id="${card.typeArg}-action4"></div>
    //         <div class="hero-action actionhighlighted4" id="${card.typeArg}-action4"></div>
    //         <div class="hero-action action5" id="${card.typeArg}-action5"></div>
    //         <div class="hero-action actionhighlighted5" id="${card.typeArg}-action5"></div>
    //         <div class="hero-action action6" id="${card.typeArg}-action6"></div>
    //         <div class="hero-action actionhighlighted6" id="${card.typeArg}-action6"></div>
    //         <div class="hero-action action7" id="${card.typeArg}-action7"></div>
    //         <div class="hero-action actionhighlighted7" id="${card.typeArg}-action7"></div>
    //         <div class="hero-action action8" id="${card.typeArg}-action8"></div>
    //         <div class="hero-action actionhighlighted8" id="${card.typeArg}-action8"></div>
    drawGiantActionAreas(index, div) {
        const cardAreasById = {
            1: {
                top: [1, 2, 3],
                middle: [1, 2, 3],
                bottom: [500, 701, 702] // listo
            },
            2: {
                top: [1, 2, 3],
                middle: [1, 22, 31],
                bottom: [111]
            },
            3: {
                top: [1, 22, 32],
                middle: [1, 2, 3],
                bottom: [300, 301, 302, 303] //listo
            },
            4: {
                top: [6],
                middle: [6, 7, 23, 32],
                bottom: [46, 47, 48]
            },
            5: {
                top: [4, 5],
                middle: [1, 2, 3],
                bottom: [500, 501, 502] //LISTO
            },
            6: {
                top: [1, 21, 31],
                middle: [64, 65, 66],
                bottom: [111] //LISTO
            },
            7: {
                top: [1, 2, 3],
                middle: [4],
                bottom: [500, 701, 702] //listo
            },
            8: {
                top: [1, 7, 8, 9],
                middle: [4],
                bottom: [111]
            },
            9: {
                top: [1, 2, 3],
                middle: [1, 5],
                bottom: [96, 97, 98]
            }
        };
        // const node = dojo.byId(cardDivId);
        const areas = cardAreasById[index] || [];
        for (const area in areas) {
            const zones = areas[area];
            const sectionElem = div.querySelector(`.card-section.${area}`);
            zones.forEach((zone) => {
                const areaElem = document.createElement("div");
                areaElem.classList.add("giant-action-area", `pos-${zone}`);
                sectionElem.appendChild(areaElem);
            });
        }
    }
    highlightHeroeActions(card) {
        console.log("highlightHeroeActions", card);
        const elemAreaNodes = document.querySelectorAll(`#card-${card.id}-front`);
        console.log(elemAreaNodes);
    }
}
var TRACK;
(function (TRACK) {
    TRACK["GIANT_LIFE"] = "giant-life";
    TRACK["QUALITY_ATTACK"] = "quality-attack-track";
    TRACK["QUALITY_REPAIR"] = "quality-repair-track";
    TRACK["QUALITY_MORAL"] = "quality-moral-track";
    TRACK["SUPPLY_AMMO"] = "supply-ammo-track";
    TRACK["SUPPLY_TOOLS"] = "supply-tools-track";
    TRACK["SUPPLY_TRUMPET"] = "supply-trumpet-track";
    TRACK["CITY_DESTRUCTION"] = "city-destruction-track";
})(TRACK || (TRACK = {}));
var TRACK_ID;
(function (TRACK_ID) {
    TRACK_ID["GIANT_LIFE"] = "life";
    TRACK_ID["QUALITY_ATTACK"] = "attack";
    TRACK_ID["QUALITY_REPAIR"] = "repair";
    TRACK_ID["QUALITY_MORAL"] = "moral";
    TRACK_ID["SUPPLY_AMMO"] = "ammo";
    TRACK_ID["SUPPLY_TOOLS"] = "tools";
    TRACK_ID["SUPPLY_TRUMPET"] = "trumpet";
    TRACK_ID["CITY_DESTRUCTION"] = "destruction";
})(TRACK_ID || (TRACK_ID = {}));
var TOKEN;
(function (TOKEN) {
    TOKEN["LIFE"] = "token-life";
    TOKEN["ATTACK"] = "token-attack";
    TOKEN["REPAIR"] = "token-repair";
    TOKEN["MORAL"] = "token-moral";
    TOKEN["AMMO"] = "token-ammo";
    TOKEN["TOOLS"] = "token-tools";
    TOKEN["TRUMPET"] = "token-trumpet";
    TOKEN["DESTRUCTION"] = "token-destruction";
})(TOKEN || (TOKEN = {}));
const mapTokenId = {
    ["token-giantLife"]: TOKEN.LIFE,
    ["token-qualityAttack"]: TOKEN.ATTACK,
    ["token-qualityRepair"]: TOKEN.REPAIR,
    ["token-qualityMoral"]: TOKEN.MORAL,
    ["token-supplyAmmo"]: TOKEN.AMMO,
    ["token-supplyTools"]: TOKEN.TOOLS,
    ["token-supplyTrumpet"]: TOKEN.TRUMPET,
    ["token-cityDestruction"]: TOKEN.DESTRUCTION,
};
const mapTrackId = {
    ["giantLife"]: TRACK_ID.GIANT_LIFE,
    ["qualityAttack"]: TRACK_ID.QUALITY_ATTACK,
    ["qualityRepair"]: TRACK_ID.QUALITY_REPAIR,
    ["qualityMoral"]: TRACK_ID.QUALITY_MORAL,
    ["supplyAmmo"]: TRACK_ID.SUPPLY_AMMO,
    ["supplyTools"]: TRACK_ID.SUPPLY_TOOLS,
    ["supplyTrumpet"]: TRACK_ID.SUPPLY_TRUMPET,
    ["cityDestruction"]: TRACK_ID.CITY_DESTRUCTION,
};
class TrackManager {
    trackStateParam;
    trackState;
    game;
    constructor(trackStateParam, game) {
        this.trackStateParam = trackStateParam;
        this.trackState = trackStateParam;
        this.game = game;
    }
    async setupTrack() {
        const operations = [];
        for (const track in this.trackState) {
            operations.push(this.printTokenOnBoard(this.getTokenIdForTrack(track), this.getTargetPositionIdForTrack(track)));
        }
        await Promise.all(operations);
    }
    async moveToken(track, newPosition) {
        this.updateTrackValue(track, newPosition);
        await this.printTokenOnBoard(this.getTokenIdForTrack(track), this.getTargetPositionIdForTrack(track));
    }
    async updateTokens(tracks) {
        for (const track in tracks) {
            if (tracks[track] !== this.trackState[track]) {
                await this.moveToken(track, tracks[track]);
            }
        }
    }
    getTracks() {
        return this.trackState;
    }
    updateTrackValue(track, newPosition) {
        this.trackState[track] = newPosition;
    }
    /**
     * Returns the DOM ID of the token associated with a specific track.
     * Example: for 'life', returns 'token-life'.
     *
     * @param track - The name of the track (e.g., 'giantLife', 'qualityAttack', etc.)
     * @returns The DOM ID of the corresponding token element.
     */
    getTokenIdForTrack(track) {
        // giantLife -> token-life
        return mapTokenId[`token-${track}`];
    }
    /**
     * Returns the DOM ID of the position element where the token should be placed
     * based on the current value of the given track.
     * Example: for track 'life' at position 2, returns 'life2'.
     *
     * @param track - The name of the track (e.g., 'life').
     * @returns The DOM ID of the target element (e.g., 'life2', etc.)
     */
    getTargetPositionIdForTrack(track) {
        // giantLife -> life2
        return `${mapTrackId[track]}${this.trackState[track]}`;
    }
    async printTokenOnBoard(origId, destId) {
        const token = document.getElementById(origId);
        const target = document.getElementById(destId);
        token.style.position = "absolute";
        token.style.left = "0px";
        token.style.top = "0px";
        // console.log(this.game.bgaPlayDojoAnimation);
        const anim = this.game.slideToObject(token.id, target.id);
        await this.game.bgaPlayDojoAnimation(anim);
        target.appendChild(token);
        token.style.position = ""; // remove absolute positioning
    }
}
// enum GiantActionActive {
//   ADVANCE_RONDEL = "advanceRondel",
//   EXCHANGE_RONDEL = "exchangeRondel",
//   MOVE_RONDEL = "moveRondel"
// }
// const mapSpecialGiantAction = {
//   1: GiantActionActive.ADVANCE_RONDEL,
//   2: GiantActionActive.EXCHANGE_RONDEL,
//   3: GiantActionActive.MOVE_RONDEL
// };
// function getActionNumber(action: GiantActionActive): number | null {
//   for (const [key, value] of Object.entries(mapSpecialGiantAction)) {
//     if (value === action) {
//       return Number(key);
//     }
//   }
//   return null;
// }
// // mover un rondel adelanmte
// // mover un rondel atras/adelante
// // intercambiar rondel position
// // mover rondel posicion normal
// class HeroeManager {
//   private heroes: HeroeCard[];
//   private rondels: Rondel[];
//   private availableMovements: number[];
//   private currSelectedRondel: Rondel | null = null;
//   private handlers = {
//     nutHandlers: [],
//     availableMovementsHandlers: []
//   };
//   public giantActionActive: GiantActionActive | null = null;
//   public trackManager: TrackManager;
//   constructor(
//     public game: AmenazaGiganteGame,
//     pHeroeCards: HeroeCard[],
//     pRondels: Rondel[],
//     pAvailableMovements: number[],
//     pTrackManager: TrackManager
//   ) {
//     this.heroes = pHeroeCards;
//     this.rondels = pRondels;
//     this.availableMovements = pAvailableMovements;
//     this.trackManager = pTrackManager;
//   }
//   private mapRondelCharToIdLocation(rondel: Rondel, location?: number) {
//     return `card-${rondel.heroe}-action-${location ?? rondel.location}`;
//   }
//   private mapRondelCharToIdLocationHighlight(rondel: Rondel, location?: number) {
//     return `card-${rondel.heroe}-action-highlight-${location ?? rondel.location}`;
//   }
//   private async printRondelOnBoard(rondelChar, destId) {
//     const rondel = document.getElementById(`rondel${rondelChar}`);
//     const target = document.getElementById(destId);
//     rondel.style.position = "absolute";
//     rondel.style.left = "0px";
//     rondel.style.top = "0px";
//     const anim = this.game.slideToObject(rondel.id, target.id);
//     await this.game.bgaPlayDojoAnimation(anim);
//     target.appendChild(rondel);
//     rondel.style.position = ""; // remove absolute positioning
//   }
//   // Draw rondels in the card position
//   public setupRondels() {
//     for (const rondelKey in this.rondels) {
//       const rondelObj = this.rondels[rondelKey];
//       const rondelPosId = this.mapRondelCharToIdLocation(rondelObj);
//       this.printRondelOnBoard(rondelObj.char, rondelPosId);
//     }
//   }
//   private getNutsFromChars(nutChars: TRondelChar[]): Rondel[] {
//     return this.rondels.filter((rondel) => nutChars.includes(rondel.char));
//   }
//   // ---------------------------------------
//   /**
//    * Returns the Rondel object given its character
//    */
//   public getNutObjByChar(rondelChar: TRondelChar): Rondel | undefined {
//     return this.rondels.find((rondel) => rondel.char === rondelChar);
//   }
//   /**
//    * @param rondelChar
//    * Returns the HTMLElement of the nut given its character
//    * */
//   private getHTMLNutElemByChar(rondelChar: TRondelChar): HTMLElement | null {
//     return document.getElementById(`rondel${rondelChar}`);
//   }
//   /**
//    *
//    * @param nutsChar
//    * Add selectable-nut style
//    */
//   public setSelectableNut(nutsChar: TRondelChar[]): void {
//     nutsChar.forEach((nutChar) => {
//       this.getHTMLNutElemByChar(nutChar)?.classList.add("selectable-nut");
//     });
//   }
//   /**
//    *
//    * @param nutsChar
//    * Remove selectable-nut style
//    */
//   public removeSelectableNut(nutsChar: TRondelChar[]): void {
//     nutsChar.forEach((nutChar) => {
//       this.getHTMLNutElemByChar(nutChar)?.classList.remove("selectable-nut");
//     });
//   }
//   /**
//    *
//    * @param nutChars
//    * @param enabled
//    */
//   public setEnabledNut(nutChars: TRondelChar[], enabled: boolean) {
//     this.getNutsFromChars(nutChars).map((nut) => {
//       nut.enabled = enabled;
//     });
//   }
//   public addNutClickHandler(nutChars: TRondelChar[]) {
//     for (const nutChar of nutChars) {
//       const nutHTMLElem = this.getHTMLNutElemByChar(nutChar);
//       const handler = dojo.connect(nutHTMLElem, "onclick", () => this.onClickNutEvent(nutChar));
//       this.handlers.nutHandlers.push({ rondel: nutChar, handler });
//     }
//   }
//   public removeNutClickHandler(nutChars: TRondelChar[]) {
//     const newHandlers = [];
//     this.handlers.nutHandlers.map(({ rondel: char, handler }) => {
//       if (nutChars.includes(char)) {
//         dojo.disconnect(handler);
//       } else {
//         newHandlers.push({ rondel: char, handler });
//       }
//     });
//     this.handlers.nutHandlers = newHandlers;
//   }
//   /**
//    * Remove click handlers for available movements
//    */
//   public removeAvailableMovementsClickHandler() {
//     this.handlers.availableMovementsHandlers.map((handler) => {
//       dojo.disconnect(handler);
//     });
//     this.handlers.availableMovementsHandlers = [];
//   }
//   public clickOnNut() {}
//   /**
//    *
//    * @param specialGiantAction
//    * 1 | 2 | 3
//    */
//   public initGiantPhase(specialGiantAction: TGiantSpecialAction) {
//     this.giantActionActive = mapSpecialGiantAction[specialGiantAction];
//     this.setEnabledNut(["A", "B", "C"], true);
//     this.setSelectableNut(["A", "B", "C"]);
//     this.addNutClickHandler(["A", "B", "C"]);
//   }
//   public initHeroPhase() {
//     this.giantActionActive = null;
//     this.setEnabledNut(["A", "B", "C"], true);
//     this.setSelectableNut(["A", "B", "C"]);
//     this.addNutClickHandler(["A", "B", "C"]);
//   }
//   // Add click event to available rondels
//   // public enableRondels() {
//   //   console.log("enableRondels called");
//   //   this.removeNutAvailable();
//   //   for (const rondelKey in this.rondels) {
//   //     const rondel = this.rondels[rondelKey];
//   //     console.log("enabled", rondel.enabled);
//   //     if (rondel.enabled) {
//   //       this.setSelectableRondel(rondel);
//   //       // const rondelElem = document.getElementById(`rondel${rondel.char}`);
//   //       // rondelElem.classList.add("available-nut");
//   //       const rondelElem = this.getHTMLNutElemByChar(rondel.char);
//   //       const handler = dojo.connect(rondelElem, "onclick", () => this.setSelectedRondel(rondel));
//   //       this.handlers.nutHandlers.push({ rondel: rondel.char, handler });
//   //     }
//   //   }
//   // }
//   public unselectNut(specialAction: number | null) {
//     this.resetAll();
//     this.setSpecialGiantAction(specialAction);
//     this.enableRondels();
//     this.currSelectedRondel = null;
//   }
//   private getOthersNut(rondel: Rondel): Rondel[] {
//     return Object.values(this.rondels).filter((r) => r.char !== rondel.char);
//   }
//   public removeSelectableRondels(rondels?: Rondel[]) {
//     if (!rondels || rondels.length === 0) {
//       // Remove all
//       console.log("Removing all selectable rondels");
//       document.querySelectorAll(".selectable-rondel").forEach((el) => {
//         el.classList.remove("selectable-rondel");
//       });
//       this.removenutHandlers();
//       this.handlers.nutHandlers = [];
//     } else {
//       // Remove only specified characters
//       const rondelChars: TRondelChar[] = this.rondels.map((r) => r.char);
//       console.log("Removing specified selectable rondels", rondelChars);
//       rondelChars.forEach((char) => {
//         const selector = `#rondel${char}.selectable-rondel`;
//         document.querySelectorAll(selector).forEach((el) => {
//           el.classList.remove("selectable-rondel");
//         });
//       });
//       this.removenutHandlers();
//     }
//   }
//   private unselectRondel() {
//     console.debug("Unselecting rondel");
//     // Limpiar visuales
//     this.removeHighlighedtActions();
//     document.querySelectorAll(".selected-rondel").forEach((el) => {
//       el.classList.remove("selected-rondel");
//     });
//     // Volver a hacer selectable todos los rondeles habilitados
//     this.removeSelectableRondels(); // sin parámetro = borra todos
//     for (const rondelKey in this.rondels) {
//       const rondel = this.rondels[rondelKey];
//       if (rondel.enabled) {
//         // this.setSelectableRondel(rondel);
//       }
//     }
//     // Reset estado
//     this.resetAvailableMovement();
//     this.currSelectedRondel = null;
//   }
//   setCurrSelectedRondel(rondel: Rondel) {
//     this.currSelectedRondel = rondel;
//   }
//   removeCurrSelectedRondel() {
//     this.currSelectedRondel = null;
//   }
//   setSelectedNut(nutChar: TRondelChar) {
//       this.getHTMLNutElemByChar(nutChar)?.classList.add("selected-nut");
//   }
//   public removeSelectedNut(nutChar: TRondelChar): void {
//     this.getHTMLNutElemByChar(nutChar)?.classList.remove("selected-nut");
//   }
//   private onClickNutEvent(nutChar: TRondelChar) {
//     // Check if the clicked nut is already selected
//     if (this.currSelectedRondel?.char === nutChar) {
//       console.log("deseleccion");
//       this.removeSelectableNut([nutChar]);
//       this.removeNutClickHandler([nutChar]);
//       this.removeCurrSelectedRondel();
//       this.setEnabledNut(["A", "B", "C"], true);
//       this.setSelectableNut(["A", "B", "C"]);
//       this.addNutClickHandler(["A", "B", "C"]);
//       // remover "highlighted-action");
//       this.removeHighlighedtActions();
//       this.removeAvailableMovementsClickHandler();
//       this.removeSelectedNut(nutChar);
//       return;
//     }
//     const rondel = this.getHTMLNutElemByChar(nutChar);
//     console.debug("Clicked on rondel: ", rondel);
//     const nut = this.getNutObjByChar(nutChar);
//     const nuts = this.getOthersNut(nut);
//     this.removeSelectableNut(nuts.map((n) => n.char));
//     this.removeNutClickHandler(nuts.map((n) => n.char));
//     this.setCurrSelectedRondel(nut);
//     this.setSelectedNut(nutChar);
//     this.showAvailableHeroMovements(nut);
//     return;
//     // Si es el mismo que ya estaba seleccionado, cancela la selección
//     if (rondel.char === this.currSelectedRondel?.char) {
//       this.unselectRondel();
//       return;
//     }
//     // Si hay uno seleccionado, limpiar antes
//     if (this.currSelectedRondel) {
//       this.removeHighlighedtActions();
//       this.resetAvailableMovement();
//     }
//     // Marcar como seleccionado
//     this.currSelectedRondel = rondel;
//     this.getHTMLNutElemByChar(rondel.char)?.classList.add("selected-rondel");
//     // Ocultar los otros rondeles
//     const otherChars = this.getOthersNut(rondel).map((r) => r.char);
//     console.log(otherChars);
//     this.removeSelectableRondels(otherChars);
//     // Evaluar caso
//     this.showAvailableHeroMovements(rondel);
//     return;
//     this.resetAvailableMovement();
//     console.log("onNutSelected", this.giantActionActive);
//     if (this.currRondelSelected?.char == rondel.char) {
//       this.unselectNut(null);
//     }
//     // .nut.selected
//     if (this.giantActionActive === GiantActionActive.EXCHANGE_RONDEL) {
//       console.log(0);
//       if (this.currRondelSelected?.char == rondel.char) {
//         // deshabilito, cancelo seleccion
//         this.unselectNut(2);
//       } else {
//         console.log("enableSwitchMovement", rondel);
//         this.enableSwitchMovement(rondel);
//       }
//     } else if (this.giantActionActive === GiantActionActive.ADVANCE_RONDEL || this.giantActionActive === GiantActionActive.MOVE_RONDEL) {
//       if (this.currRondelSelected?.char == rondel.char) {
//         // deshabilito, cancelo seleccion
//         const currSelect = this.giantActionActive === GiantActionActive.ADVANCE_RONDEL ? 1 : 3;
//         this.unselectNut(currSelect);
//       } else {
//         this.showSpecialMovement(rondel);
//         this.currRondelSelected = rondel;
//       }
//     } else {
//       if (this.currRondelSelected?.char == rondel.char) {
//         this.unselectNut(null);
//       } else {
//         this.showAvailableHeroMovements(rondel);
//         this.currRondelSelected = rondel;
//       }
//     }
//   }
//   private getValidMovementsByMoral(): number[] {
//     const qualityMoral: number = this.trackManager.getTracks().qualityMoral;
//     switch (qualityMoral) {
//       case 5:
//       case 4:
//         return [1, 2, 3, 4, 5, 6, 7, 8];
//       case 3:
//       case 2:
//         return [1, 2, 3, 5, 6, 7];
//       case 1:
//         return [1, 3, 5, 7];
//       default:
//         break;
//     }
//   }
//   private adjustToValidLocation(currentLocation: number, validLocations: number[]): number {
//     if (validLocations.includes(currentLocation)) {
//       return currentLocation;
//     }
//     const sorted = [...validLocations].sort((a, b) => a - b);
//     for (let i = sorted.length - 1; i >= 0; i--) {
//       if (sorted[i] < currentLocation) {
//         return sorted[i];
//       }
//     }
//     return sorted[sorted.length - 1];
//   }
//   private getNextRondelLocation(current: number, movement: number, morale: number[]): number {
//     const index = morale.indexOf(current);
//     if (index === -1) {
//       throw new Error("Invalid current location for given morale level");
//     }
//     const newIndex = (index + movement + morale.length) % morale.length;
//     return morale[newIndex];
//   }
//   private showSpecialMovement(rondel: Rondel) {
//     this.removeHighlighedtActions();
//     let availableMovements;
//     if (this.giantActionActive == GiantActionActive.ADVANCE_RONDEL) {
//       availableMovements = [1];
//     } else if (this.giantActionActive == GiantActionActive.MOVE_RONDEL) {
//       availableMovements = [-1, 1];
//     } else {
//       throw new Error("ACTION INVALIDA");
//     }
//     const validMovements = this.getValidMovementsByMoral();
//     const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
//     availableMovements.map((movement: number) => {
//       const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
//       const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
//       const elem = document.getElementById(elemId);
//       elem.classList.add("highlighted-action");
//       const handler = dojo.connect(elem, "onclick", () => {
//         this.onSpecialGiantActionSelected([rondel.char], rondelNewLocation);
//       });
//       this.handlers.availableMovementsHandlers.push(handler);
//     });
//   }
//   private removeHighlighedtActions() {
//     document.querySelectorAll(".highlighted-action").forEach((el) => {
//       el.classList.remove("highlighted-action");
//     });
//   }
//   private removeNutAvailable() {
//     document.querySelectorAll(".available-nut").forEach((el) => {
//       el.classList.remove("available-nut");
//     });
//   }
//   private resetAvailableMovement() {
//     this.removeHighlighedtActions();
//     this.handlers.availableMovementsHandlers.forEach((handler) => handler.remove());
//     this.handlers.availableMovementsHandlers = [];
//   }
//   private resetNut() {
//     this.removeNutAvailable();
//     this.handlers.nutHandlers.forEach((handler) => handler.remove());
//     this.handlers.nutHandlers = [];
//   }
//   public resetAll() {
//     this.resetAvailableMovement();
//     this.resetNut();
//     this.giantActionActive = null;
//   }
//   public enableSwitchMovement(rondelClicked: Rondel) {
//     console.log("enableSwitchMovement", rondelClicked);
//     // this.game.addCancelButton(rondelClicked);
//     this.currRondelSelected = rondelClicked;
//     for (const rondelKey in this.rondels) {
//       const rondelObj = this.rondels[rondelKey];
//       if (rondelObj.char !== rondelClicked.char) {
//         // Ignore rondel clicked
//         const rondelElem = document.getElementById(`rondel${rondelObj.char}`);
//         rondelElem.parentElement.classList.add("highlighted-action");
//         const handler = dojo.connect(rondelElem, "onclick", () => this.onExchangeNutSelected(rondelObj, rondelClicked));
//         this.handlers.nutHandlers.push(handler);
//       }
//     }
//   }
//   public showAvailableHeroMovements(rondel: Rondel) {
//     console.log(rondel, this.availableMovements);
//     console.log(this.handlers);
//     // this.removeHighlighedtActions();
//     const validMovements = this.getValidMovementsByMoral();
//     const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
//     this.availableMovements.map((movement: number) => {
//       const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
//       const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
//       const elem = document.getElementById(elemId);
//       elem.classList.add("highlighted-action");
//       const handler = dojo.connect(elem, "onclick", () => {
//         this.onAvailableMovementSelected(rondel, movement, rondelNewLocation);
//       });
//       this.handlers.availableMovementsHandlers.push(handler);
//     });
//   }
//   private onExchangeNutSelected(rondelA: Rondel, rondelB: Rondel) {
//     console.log(rondelA, rondelB);
//     this.game.onSpecialGiantActionClick([rondelA.char, rondelB.char], null, this.giantActionActive);
//   }
//   private onSpecialGiantActionSelected(rondel: string[], rondelNewLocation: number | null) {
//     this.game.onSpecialGiantActionClick(rondel, rondelNewLocation, this.giantActionActive);
//   }
//   private onAvailableMovementSelected(rondel: Rondel, movement, rondelNewLocation) {
//     this.game.onHeroeActionCardClick(rondel, movement, rondelNewLocation);
//   }
//   public updateRondel(rondelChar, newLocation, movement) {
//     const rondel = this.rondels.find((rondel) => rondel.char == rondelChar);
//     rondel.location = newLocation;
//     rondel.movement = movement;
//     rondel.enabled = false;
//     this.removeMovement(movement);
//     const rondelPosId = this.mapRondelCharToIdLocation(rondel);
//     this.printRondelOnBoard(rondelChar, rondelPosId);
//   }
//   public updateRondelState(rondels: Rondels) {
//     this.availableMovements = rondels.availableMovements;
//     this.rondels = rondels.rondels;
//   }
//   private removeMovement(movement: number) {
//     this.availableMovements = this.availableMovements.filter((n) => n !== movement);
//   }
//   // public setSpecialGiantAction(specialAction: number | null) {
//   //   this.giantActionActive = mapSpecialGiantAction[specialAction];
//   // }
// }
// class GiantAdvanceRondelPosBehavior {}
// class GiantExchangeRondelPosBehavior {}
// class GiantMoveRondelPosBehavior {}
// class HeroNormalMovementBehavior {}
const mapArea = {
    top: 0,
    middle: 1,
    bottom: 2
};
const mapAreaName = (area) => {
    switch (area) {
        case 0:
            return "top";
        case 1:
            return "middle";
        case 2:
            return "bottom";
        default:
            break;
    }
};
class GiantManager {
    pGiantPosition;
    pGiantArea;
    pGiantCards;
    pGame;
    giantPosition;
    giantArea;
    giantCards;
    currGiantCard;
    handlers;
    game;
    constructor(pGiantPosition, pGiantArea, pGiantCards, pGame) {
        this.pGiantPosition = pGiantPosition;
        this.pGiantArea = pGiantArea;
        this.pGiantCards = pGiantCards;
        this.pGame = pGame;
        this.giantPosition = pGiantPosition;
        this.giantArea = pGiantArea;
        this.giantCards = pGiantCards;
        this.handlers = [];
        this.currGiantCard = this.getCurrentGiantCard();
        this.game = pGame;
    }
    getCurrentGiantCard() {
        return this.giantCards[this.giantPosition - 1];
    }
    setupGiant() {
        this.placeGiantToken();
    }
    placeGiantToken() {
        const giantElem = document.querySelector(".giantToken");
        let currCardElem = null;
        currCardElem = document.querySelector(`#card-${this.currGiantCard?.id || 1000}`);
        if (!currCardElem) {
            console.error("Curr card element not found yet, retrying...");
            currCardElem = document.querySelector(`#card-1000`);
        }
        const toppx = {
            top: "18",
            middle: "102",
            bottom: "190"
        };
        if (giantElem && currCardElem) {
            // Aseguramos que la carta tenga posición relativa
            currCardElem.style.position = "relative";
            // Estilo del token
            Object.assign(giantElem.style, {
                position: "absolute",
                top: `${toppx[mapAreaName(this.giantArea)]}px`,
                // left: `${currCardElem.offsetWidth - 200}px`, // al costado derecho con 5px de offset
                left: "-38px",
                width: `${currCardElem.offsetWidth / 3}px`,
                height: "auto",
                zIndex: "11" // aseguramos que esté arriba
            });
            // Agregamos el token al DOM si no está ya dentro
            currCardElem.appendChild(giantElem);
        }
    }
    removeHighlighedtActions() {
        document.querySelectorAll(".highlighted-action").forEach((el) => {
            el.classList.remove("highlighted-action");
        });
    }
    getMandatoryActionSlot() {
        const activeSection = this.getCurrentSectionActive();
        return activeSection.mandatory;
    }
    getOptionalActionSlots() {
        const activeSection = this.getCurrentSectionActive();
        return activeSection.optional;
    }
    highlightGiantActions(isMandatoryStage = false) {
        if (!this.currGiantCard) {
            throw Error('No current Giant card face up');
        }
        const cardId = this.currGiantCard?.id;
        const areaName = mapAreaName(this.giantArea);
        const elemAreaNodes = document.querySelectorAll(`#card-${cardId}-front .${areaName} .giant-action-area`);
        if (!elemAreaNodes || elemAreaNodes.length === 0) {
            console.warn("highlightGiantActions: no action nodes found", { cardId, areaName });
            return;
        }
        if (isMandatoryStage) {
            const el = elemAreaNodes[0];
            if (!el) {
                console.warn("highlightGiantActions: mandatory element missing");
                return;
            }
            el.classList.add("highlighted-action");
            const handler = dojo.connect(el, "onclick", () => this.onActionSelected(0));
            this.handlers.push(handler);
            // console.log("Connected mandatory action handler");
        }
        else {
            const mandatorySlot = this.getMandatoryActionSlot();
            const hasMandatorySlot = Boolean(mandatorySlot && Array.isArray(mandatorySlot.actions) && mandatorySlot.actions.length);
            for (let index = hasMandatorySlot ? 1 : 0; index < elemAreaNodes.length; index++) {
                const actionIndex = hasMandatorySlot ? index - 1 : index;
                const el = elemAreaNodes[index];
                if (!el)
                    continue;
                el.classList.add("highlighted-action");
                const handler = dojo.connect(el, "onclick", () => this.onActionSelected(actionIndex));
                this.handlers.push(handler);
            }
            // console.log("Connected optional action handlers");
        }
    }
    // -------
    highlightMandatoryAction() {
        this.highlightGiantActions(true);
    }
    highlightOptionalActions() {
        this.highlightGiantActions(false);
    }
    updateGiant(newPosition, newArea, cards) {
        this.giantPosition = newPosition;
        this.giantArea = newArea;
        this.giantCards = cards;
        this.currGiantCard = this.getCurrentGiantCard();
    }
    /**
     * Remove highlight effects & handlers from actions
     */
    resetGiantActions() {
        this.removeHighlighedtActions();
        this.handlers.forEach((handler) => handler.remove());
        this.handlers = [];
    }
    onActionSelected(index) {
        console.log("Action selected:", index);
        // this.game.onGiantTableCardClick(this.currGiantCard.id, this.giantArea, index);
    }
    getCurrentCard() {
        return this.currGiantCard;
    }
    getCurrentSectionActive() {
        return this.currGiantCard.sections[this.giantArea];
    }
}
class GiantTableCenter {
    game;
    giantTableCards;
    constructor(game, pVisibleCards) {
        this.game = game;
        const visibleCards = pVisibleCards;
        const totalCards = 9;
        const fakeCards = [];
        visibleCards.forEach((card, index) => {
            card.flipped = false;
        });
        for (let i = visibleCards.length; i < totalCards; i++) {
            fakeCards.push({
                flipped: true,
                id: 1000 + i,
                location: 'giant-row',
                locationArg: 0,
                type: 2,
                typeArg: 1,
                index: 10,
                sections: [],
                // fake: true, // opcional, si querés identificarlas después
            });
        }
        const allCards = [...visibleCards, ...fakeCards];
        document.getElementById(`giant-table-row`).insertAdjacentHTML('beforeend', `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">Giant Path</span>
                </div>
                <div id="giant-table-cards" class="giant-table-cards">
                <div class="giantToken" id="giantToken"></div>
                </div>
            </div>
        `);
        this.giantTableCards = new LineStock(this.game.cardsManager, document.getElementById(`giant-table-cards`), {
            center: false,
        });
        this.giantTableCards.addCards(allCards);
    }
    async addNewCard(card) {
        const cards = this.giantTableCards.getCards();
        const firstFakeCard = cards.find(card => card.id > 1000);
        await this.giantTableCards.removeCard(firstFakeCard);
        await this.giantTableCards.addCard(card, null, { index: card.locationArg - 1, visible: false });
        // INDEX ES 0 INDEX
        // await this.giantTableCards.flipCard(card, {
        // });
        const newCardElem = this.giantTableCards.getCardElement(card);
        newCardElem.setAttribute('data-side', 'front');
        // public revealNextCard() {
        //     const cards = this.tableCards.getCards();
        //     const nextCard = cards.find(card => card.flipped);
        //     if (nextCard) {
        //         nextCard.flipped = false;
        //         // this.tableCards.replaceCard(nextCard); // actualizar visualmente
        //     }
        // }
    }
}
class HeroeTableCenter {
    game;
    heroeTableCards;
    heroeCards;
    constructor(game, pHeroeCards) {
        this.game = game;
        const heroeCards = pHeroeCards;
        document.getElementById(`heroe-table-row`).insertAdjacentHTML("beforeend", `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">Heroes</span>
                </div>
                <div id="heroe-table-cards" class="heroe-table-cards">

                </div>
            </div>
        `);
        this.heroeTableCards = new LineStock(this.game.cardsManager, document.getElementById(`heroe-table-cards`), {
            center: false,
        });
        this.heroeTableCards.addCards(heroeCards);
    }
}
class CityTableCenter {
    constructor() {
        document.getElementById(`city-table-row`).insertAdjacentHTML("beforeend", `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">City</span>
                </div>
                <div id="city-table-cards" class="city-table-cards">
                    <div class="city-card" id="city-card">
                        <div class="city-tracks" id="city-tracks"></div>
                    </div>
                </div>
            </div>
        `);
        document.getElementById(`city-tracks`).insertAdjacentHTML("beforeend", `
                      <div class="track-token" id="token-life"></div>
                      <div class="track-token" id="token-attack"></div>
                      <div class="track-token" id="token-repair"></div>
                      <div class="track-token" id="token-moral"></div>
                      <div class="track-token" id="token-ammo"></div>
                      <div class="track-token" id="token-tools"></div>
                      <div class="track-token" id="token-trumpet"></div>
                      <div class="track-token" id="token-destruction"></div>
      
                      <div class="${TRACK.GIANT_LIFE} life1" id="${TRACK_ID.GIANT_LIFE}1"></div>
                      <div class="${TRACK.GIANT_LIFE} life2" id="${TRACK_ID.GIANT_LIFE}2"></div>
                      <div class="${TRACK.GIANT_LIFE} life3" id="${TRACK_ID.GIANT_LIFE}3"></div>
                      <div class="${TRACK.GIANT_LIFE} life4" id="${TRACK_ID.GIANT_LIFE}4"></div>
                      <div class="${TRACK.GIANT_LIFE} life5" id="${TRACK_ID.GIANT_LIFE}5"></div>
                      <div class="${TRACK.GIANT_LIFE} life6" id="${TRACK_ID.GIANT_LIFE}6"></div>
                      <div class="${TRACK.GIANT_LIFE} life7" id="${TRACK_ID.GIANT_LIFE}7"></div>
                      <div class="${TRACK.GIANT_LIFE} life8" id="${TRACK_ID.GIANT_LIFE}8"></div>
                      <div class="${TRACK.GIANT_LIFE} life9" id="${TRACK_ID.GIANT_LIFE}9"></div>
                      <div class="${TRACK.GIANT_LIFE} life10" id="${TRACK_ID.GIANT_LIFE}10"></div>
      
                      <div class="${TRACK.QUALITY_ATTACK} attack0" id="${TRACK_ID.QUALITY_ATTACK}0"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack1" id="${TRACK_ID.QUALITY_ATTACK}1"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack2" id="${TRACK_ID.QUALITY_ATTACK}2"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack3" id="${TRACK_ID.QUALITY_ATTACK}3"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack4" id="${TRACK_ID.QUALITY_ATTACK}4"></div>
                      <div class="${TRACK.QUALITY_ATTACK} attack5" id="${TRACK_ID.QUALITY_ATTACK}5"></div>
      
                      <div class="${TRACK.QUALITY_REPAIR} repair0" id="${TRACK_ID.QUALITY_REPAIR}0"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair1" id="${TRACK_ID.QUALITY_REPAIR}1"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair2" id="${TRACK_ID.QUALITY_REPAIR}2"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair3" id="${TRACK_ID.QUALITY_REPAIR}3"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair4" id="${TRACK_ID.QUALITY_REPAIR}4"></div>
                      <div class="${TRACK.QUALITY_REPAIR} repair5" id="${TRACK_ID.QUALITY_REPAIR}5"></div>
      
                      <div class="${TRACK.QUALITY_MORAL} moral0" id="${TRACK_ID.QUALITY_MORAL}0"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral1" id="${TRACK_ID.QUALITY_MORAL}1"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral2" id="${TRACK_ID.QUALITY_MORAL}2"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral3" id="${TRACK_ID.QUALITY_MORAL}3"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral4" id="${TRACK_ID.QUALITY_MORAL}4"></div>
                      <div class="${TRACK.QUALITY_MORAL} moral5" id="${TRACK_ID.QUALITY_MORAL}5"></div>
      
                      <div class="${TRACK.SUPPLY_AMMO} ammo0" id="${TRACK_ID.SUPPLY_AMMO}0"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo1" id="${TRACK_ID.SUPPLY_AMMO}1"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo2" id="${TRACK_ID.SUPPLY_AMMO}2"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo3" id="${TRACK_ID.SUPPLY_AMMO}3"></div>
                      <div class="${TRACK.SUPPLY_AMMO} ammo4" id="${TRACK_ID.SUPPLY_AMMO}4"></div>
      
                      <div class="${TRACK.SUPPLY_TOOLS} tools0" id="${TRACK_ID.SUPPLY_TOOLS}0"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools1" id="${TRACK_ID.SUPPLY_TOOLS}1"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools2" id="${TRACK_ID.SUPPLY_TOOLS}2"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools3" id="${TRACK_ID.SUPPLY_TOOLS}3"></div>
                      <div class="${TRACK.SUPPLY_TOOLS} tools4" id="${TRACK_ID.SUPPLY_TOOLS}4"></div>
      
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet0" id="${TRACK_ID.SUPPLY_TRUMPET}0"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet1" id="${TRACK_ID.SUPPLY_TRUMPET}1"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet2" id="${TRACK_ID.SUPPLY_TRUMPET}2"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet3" id="${TRACK_ID.SUPPLY_TRUMPET}3"></div>
                      <div class="${TRACK.SUPPLY_TRUMPET} trumpet4" id="${TRACK_ID.SUPPLY_TRUMPET}4"></div>
      
                      <div class="${TRACK.CITY_DESTRUCTION} destruction1" id="${TRACK_ID.CITY_DESTRUCTION}1"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction2" id="${TRACK_ID.CITY_DESTRUCTION}2"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction3" id="${TRACK_ID.CITY_DESTRUCTION}3"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction4" id="${TRACK_ID.CITY_DESTRUCTION}4"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction5" id="${TRACK_ID.CITY_DESTRUCTION}5"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction6" id="${TRACK_ID.CITY_DESTRUCTION}6"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction7" id="${TRACK_ID.CITY_DESTRUCTION}7"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction8" id="${TRACK_ID.CITY_DESTRUCTION}8"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction9" id="${TRACK_ID.CITY_DESTRUCTION}9"></div>
                      <div class="${TRACK.CITY_DESTRUCTION} destruction10" id="${TRACK_ID.CITY_DESTRUCTION}10"></div>
              `);
    }
}
const sortedCardsByImageLocation = (cards) => {
    return cards.slice().sort((a, b) => (a.typeArg ?? 0) - (b.typeArg ?? 0));
};
