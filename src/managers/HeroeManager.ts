/// <reference path="../amenazagigante.d.ts" />

import { AmenazaGiganteGame, Rondel, TRondelChar, TRondelMovement, GiantActionActive, TGiantSpecialAction, TrackManager, HeroeCard } from "../amenazagigante";

enum GiantActionActiveEnum {
  ADVANCE_RONDEL = "advanceRondel",
  EXCHANGE_RONDEL = "exchangeRondel",
  MOVE_RONDEL = "moveRondel"
}

const mapSpecialGiantAction: Record<TGiantSpecialAction, GiantActionActiveEnum> = {
  1: GiantActionActiveEnum.ADVANCE_RONDEL,
  2: GiantActionActiveEnum.EXCHANGE_RONDEL,
  3: GiantActionActiveEnum.MOVE_RONDEL
};

export class HeroeManager {
  private heroes: HeroeCard[];
  private rondels: Rondel[];
  private availableMovements: number[];
  private currSelectedRondel: Rondel | null = null;
  private handlers = {
    nutHandlers: [] as { rondel: TRondelChar; handler: any }[],
    availableMovementsHandlers: [] as any[]
  };
  public giantActionActive: GiantActionActive | null = null;
  public trackManager: TrackManager;

  constructor(
    public game: AmenazaGiganteGame,
    pHeroeCards: HeroeCard[],
    pRondels: Rondel[],
    pAvailableMovements: number[],
    pTrackManager: TrackManager
  ) {
    this.heroes = pHeroeCards;
    this.rondels = pRondels;
    this.availableMovements = pAvailableMovements;
    this.trackManager = pTrackManager;
  }

  private mapRondelCharToIdLocation(rondel: Rondel, location?: number): string {
    return `card-${rondel.heroe}-action-${location ?? rondel.location}`;
  }

  private mapRondelCharToIdLocationHighlight(rondel: Rondel, location?: number): string {
    return `card-${rondel.heroe}-action-highlight-${location ?? rondel.location}`;
  }

  private async printRondelOnBoard(rondelChar: string, destId: string): Promise<void> {
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

  public setupRondels(): void {
    for (const rondelKey in this.rondels) {
      const rondelObj = this.rondels[rondelKey];
      const rondelPosId = this.mapRondelCharToIdLocation(rondelObj);
      this.printRondelOnBoard(rondelObj.char, rondelPosId);
    }
  }

  private getNutsFromChars(nutChars: TRondelChar[]): Rondel[] {
    return this.rondels.filter((rondel) => nutChars.includes(rondel.char));
  }

  public getNutObjByChar(rondelChar: TRondelChar): Rondel | undefined {
    return this.rondels.find((rondel) => rondel.char === rondelChar);
  }

  private getHTMLNutElemByChar(rondelChar: TRondelChar): HTMLElement | null {
    return document.getElementById(`rondel${rondelChar}`);
  }

  public setSelectableNut(nutsChar: TRondelChar[]): void {
    nutsChar.forEach((nutChar) => {
      this.getHTMLNutElemByChar(nutChar)?.classList.add("selectable-nut");
    });
  }

  public removeSelectableNut(nutsChar: TRondelChar[]): void {
    nutsChar.forEach((nutChar) => {
      this.getHTMLNutElemByChar(nutChar)?.classList.remove("selectable-nut");
    });
  }

  public setEnabledNut(nutChars: TRondelChar[], enabled: boolean): void {
    this.getNutsFromChars(nutChars).forEach((nut) => {
      nut.enabled = enabled;
    });
  }

  public addNutClickHandler(nutChars: TRondelChar[]): void {
    for (const nutChar of nutChars) {
      const nutHTMLElem = this.getHTMLNutElemByChar(nutChar);
      if (!nutHTMLElem) continue;
      const handler = dojo.connect(nutHTMLElem, "onclick", () => this.onClickNutEvent(nutChar));
      this.handlers.nutHandlers.push({ rondel: nutChar, handler });
    }
  }

  public removeNutClickHandler(nutChars: TRondelChar[]): void {
    const newHandlers: { rondel: TRondelChar; handler: any }[] = [];

    this.handlers.nutHandlers.forEach(({ rondel: char, handler }) => {
      if (nutChars.includes(char)) {
        dojo.disconnect(handler);
      } else {
        newHandlers.push({ rondel: char, handler });
      }
    });

    this.handlers.nutHandlers = newHandlers;
  }

  public removeAvailableMovementsClickHandler(): void {
    this.handlers.availableMovementsHandlers.forEach((handler) => {
      dojo.disconnect(handler);
    });
    this.handlers.availableMovementsHandlers = [];
  }

  public initGiantPhase(specialGiantAction: TGiantSpecialAction): void {
    this.giantActionActive = mapSpecialGiantAction[specialGiantAction];
    this.setEnabledNut(["A", "B", "C"], true);
    this.setSelectableNut(["A", "B", "C"]);
    this.addNutClickHandler(["A", "B", "C"]);
  }

  public initHeroPhase(): void {
    this.giantActionActive = null;
    this.setEnabledNut(["A", "B", "C"], true);
    this.setSelectableNut(["A", "B", "C"]);
    this.addNutClickHandler(["A", "B", "C"]);
  }

  public unselectNut(specialAction: number | null): void {
    this.resetAll();
    this.setSpecialGiantAction(specialAction);
    this.enableRondels();
    this.currSelectedRondel = null;
  }

  private getOthersNut(rondel: Rondel): Rondel[] {
    return Object.values(this.rondels).filter((r) => r.char !== rondel.char);
  }

  public removeSelectableRondels(rondels?: Rondel[]): void {
    if (!rondels || rondels.length === 0) {
      document.querySelectorAll(".selectable-rondel").forEach((el) => {
        el.classList.remove("selectable-rondel");
      });
      this.removeNutClickHandler(["A", "B", "C"]);
      this.handlers.nutHandlers = [];
    } else {
      const rondelChars: TRondelChar[] = this.rondels.map((r) => r.char);
      rondelChars.forEach((char) => {
        const selector = `#rondel${char}.selectable-rondel`;
        document.querySelectorAll(selector).forEach((el) => {
          el.classList.remove("selectable-rondel");
        });
      });
      this.removeNutClickHandler(["A", "B", "C"]);
    }
  }

  private unselectRondel(): void {
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

  setCurrSelectedRondel(rondel: Rondel): void {
    this.currSelectedRondel = rondel;
  }

  removeCurrSelectedRondel(): void {
    this.currSelectedRondel = null;
  }

  setSelectedNut(nutChar: TRondelChar): void {
    this.getHTMLNutElemByChar(nutChar)?.classList.add("selected-nut");
  }

  public removeSelectedNut(nutChar: TRondelChar): void {
    this.getHTMLNutElemByChar(nutChar)?.classList.remove("selected-nut");
  }

  private onClickNutEvent(nutChar: TRondelChar): void {
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
    if (!nut) return;
    
    const nuts = this.getOthersNut(nut);
    this.removeSelectableNut(nuts.map((n) => n.char));
    this.removeNutClickHandler(nuts.map((n) => n.char));
    this.setCurrSelectedRondel(nut);
    this.setSelectedNut(nutChar);
    this.showAvailableHeroMovements(nut);
  }

  private getValidMovementsByMoral(): number[] {
    const qualityMoral: number = this.trackManager.getTracks().qualityMoral;
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

  private adjustToValidLocation(currentLocation: number, validLocations: number[]): number {
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

  private getNextRondelLocation(current: number, movement: number, morale: number[]): number {
    const index = morale.indexOf(current);
    if (index === -1) {
      throw new Error("Invalid current location for given morale level");
    }
    const newIndex = (index + movement + morale.length) % morale.length;
    return morale[newIndex];
  }

  private showSpecialMovement(rondel: Rondel): void {
    this.removeHighlighedtActions();

    let availableMovements: number[];
    if (this.giantActionActive == GiantActionActiveEnum.ADVANCE_RONDEL) {
      availableMovements = [1];
    } else if (this.giantActionActive == GiantActionActiveEnum.MOVE_RONDEL) {
      availableMovements = [-1, 1];
    } else {
      throw new Error("ACTION INVALIDA");
    }

    const validMovements = this.getValidMovementsByMoral();
    const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
    availableMovements.forEach((movement: number) => {
      const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
      const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
      const elem = document.getElementById(elemId);
      if (!elem) return;
      elem.classList.add("highlighted-action");
      const handler = dojo.connect(elem, "onclick", () => {
        this.onSpecialGiantActionSelected([rondel.char], rondelNewLocation);
      });
      this.handlers.availableMovementsHandlers.push(handler);
    });
  }

  private removeHighlighedtActions(): void {
    document.querySelectorAll(".highlighted-action").forEach((el) => {
      el.classList.remove("highlighted-action");
    });
  }

  private removeNutAvailable(): void {
    document.querySelectorAll(".available-nut").forEach((el) => {
      el.classList.remove("available-nut");
    });
  }

  private resetAvailableMovement(): void {
    this.removeHighlighedtActions();
    this.handlers.availableMovementsHandlers.forEach((handler) => dojo.disconnect(handler));
    this.handlers.availableMovementsHandlers = [];
  }

  private resetNut(): void {
    this.removeNutAvailable();
    this.handlers.nutHandlers.forEach((h) => dojo.disconnect(h.handler));
    this.handlers.nutHandlers = [];
  }

  public resetAll(): void {
    this.resetAvailableMovement();
    this.resetNut();
    this.giantActionActive = null;
  }

  public enableSwitchMovement(rondelClicked: Rondel): void {
    console.log("enableSwitchMovement", rondelClicked);
    this.currSelectedRondel = rondelClicked;
    for (const rondelKey in this.rondels) {
      const rondelObj = this.rondels[rondelKey];
      if (rondelObj.char !== rondelClicked.char) {
        const rondelElem = document.getElementById(`rondel${rondelObj.char}`);
        if (!rondelElem) continue;
        rondelElem.parentElement?.classList.add("highlighted-action");
        const handler = dojo.connect(rondelElem, "onclick", () => this.onExchangeNutSelected(rondelObj, rondelClicked));
        this.handlers.nutHandlers.push({ rondel: rondelObj.char, handler });
      }
    }
  }

  public showAvailableHeroMovements(rondel: Rondel): void {
    console.log(rondel, this.availableMovements);
    this.removeHighlighedtActions();

    const validMovements = this.getValidMovementsByMoral();
    const validLocation = this.adjustToValidLocation(rondel.location, validMovements);
    this.availableMovements.forEach((movement: number) => {
      const rondelNewLocation = this.getNextRondelLocation(validLocation, movement, validMovements);
      const elemId = this.mapRondelCharToIdLocationHighlight(rondel, rondelNewLocation);
      const elem = document.getElementById(elemId);
      if (!elem) return;
      elem.classList.add("highlighted-action");
      const handler = dojo.connect(elem, "onclick", () => {
        this.onAvailableMovementSelected(rondel, movement, rondelNewLocation);
      });
      this.handlers.availableMovementsHandlers.push(handler);
    });
  }

  private onExchangeNutSelected(rondelA: Rondel, rondelB: Rondel): void {
    console.log(rondelA, rondelB);
    this.game.onSpecialGiantActionClick([rondelA.char, rondelB.char], null, this.giantActionActive);
  }

  private onSpecialGiantActionSelected(rondel: string[], rondelNewLocation: number | null): void {
    this.game.onSpecialGiantActionClick(rondel, rondelNewLocation, this.giantActionActive);
  }

  private onAvailableMovementSelected(rondel: Rondel, movement: number, rondelNewLocation: number): void {
    this.game.onHeroeActionCardClick(rondel, movement, rondelNewLocation);
  }

  public setSpecialGiantAction(specialAction: number | null): void {
    if (specialAction === null) {
      this.giantActionActive = null;
    } else {
      this.giantActionActive = mapSpecialGiantAction[specialAction as TGiantSpecialAction];
    }
  }

  public enableRondels(): void {
    console.log("enableRondels called");
    this.removeNutAvailable();
    for (const rondelKey in this.rondels) {
      const rondel = this.rondels[rondelKey];
      console.log("enabled", rondel.enabled);
      if (rondel.enabled) {
        const rondelElem = this.getHTMLNutElemByChar(rondel.char);
        if (!rondelElem) continue;
        const handler = dojo.connect(rondelElem, "onclick", () => this.setSelectedRondel(rondel));
        this.handlers.nutHandlers.push({ rondel: rondel.char, handler });
      }
    }
  }

  private setSelectedRondel(rondel: Rondel): void {
    this.currSelectedRondel = rondel;
    this.getHTMLNutElemByChar(rondel.char)?.classList.add("selected-rondel");
    const otherChars = this.getOthersNut(rondel).map((r) => r.char);
    this.removeSelectableRondels(otherChars);
    this.showAvailableHeroMovements(rondel);
  }
}