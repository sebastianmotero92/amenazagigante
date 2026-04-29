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
