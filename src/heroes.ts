enum GiantActionActive {
  ADVANCE_RONDEL = "advanceRondel",
  EXCHANGE_RONDEL = "exchangeRondel",
  MOVE_RONDEL = "moveRondel",
}

class HeroeManager {
  private heroes: HeroeCard[];
  private rondels: Rondel[];
  private availableMovements: number[];
  private handlers = {
    nutHandlers: [],
    availableMovementsHandlers: [],
  };
  private giantActionActive: GiantActionActive | null;

  constructor(public game: AmenazaGiganteGame) {
    this.heroes = this.game.gamedatas.heroeCards;
    this.rondels = this.game.gamedatas.rondels.rondels;
    this.availableMovements = this.game.gamedatas.rondels.availableMovements;
  }

  private mapRondelCharToIdLocation(rondel: Rondel, location?) {
    return `${rondel.heroe}-action${location ?? rondel.location}`;
  }

  private async printRondelOnBoard(rondelChar, destId) {
    const rondel = document.getElementById(`rondel${rondelChar}`);
    const target = document.getElementById(destId);

    rondel.style.position = "absolute";
    rondel.style.left = "0px";
    rondel.style.top = "0px";

    const anim = this.game.slideToObject(rondel.id, target.id);
    await this.game.bgaPlayDojoAnimation(anim);

    target.appendChild(rondel);
    rondel.style.position = ""; // remove absolute positioning
  }

  // Draw rondels in the card position
  public setupRondels() {
    for (const rondelKey in this.rondels) {
      const rondelObj = this.rondels[rondelKey];
      const rondelPosId = this.mapRondelCharToIdLocation(rondelObj);
      this.printRondelOnBoard(rondelObj.char, rondelPosId);
    }
  }

  public resetEnableRondels() {
    for (const rondelKey in this.rondels) {
      const rondelObj = this.rondels[rondelKey];
      rondelObj.enabled = true;
    }
  }

  // Add click event to available rondels
  public enableRondels() {
    this.removeNutAvailable();
    console.log("pepito el montonero");
    for (const rondelKey in this.rondels) {
      const rondel = this.rondels[rondelKey];
      console.log(rondel);
      if (rondel.enabled) {
        const rondelElem = document.getElementById(`rondel${rondel.char}`);
        rondelElem.classList.add("available-nut");
        const handler = dojo.connect(rondelElem, "onclick", () =>
          this.onNutSelected(rondel)
        );
        this.handlers.nutHandlers.push(handler);
      }
    }
  }

  private onNutSelected(rondel: Rondel) {
    this.resetAvailableMovement();
    this.enableAvailableMovements(rondel);
  }

  private removeHighlighedtActions() {
    document.querySelectorAll(".highlighted-action").forEach((el) => {
      el.classList.remove("highlighted-action");
    });
  }

  private removeNutAvailable() {
    document.querySelectorAll(".available-nut").forEach((el) => {
      el.classList.remove("available-nut");
    });
  }

  private resetAvailableMovement() {
    this.removeHighlighedtActions();
    this.handlers.availableMovementsHandlers.forEach((handler) =>
      handler.remove()
    );
    this.handlers.availableMovementsHandlers = [];
  }

  private resetNut() {
    this.removeNutAvailable();
    this.handlers.nutHandlers.forEach((handler) => handler.remove());
    this.handlers.nutHandlers = [];
  }

  public resetAll() {
    this.resetAvailableMovement();
    this.resetNut();
    this.giantActionActive = null;
  }

  public enableAvailableMovements(rondel: Rondel) {
    console.log(rondel, this.availableMovements);
    console.log(this.handlers);
    this.removeHighlighedtActions();

    if (this.giantActionActive) {
      switch (this.giantActionActive) {
        case GiantActionActive.ADVANCE_RONDEL:
          this.availableMovements = [1];
          break;
        case GiantActionActive.EXCHANGE_RONDEL:
            // Add button to cancel action
            for (const rondelKey in this.rondels) {
                const rondelObj = this.rondels[rondelKey];
                // console.log(rondel);
                if (rondelObj.char !== rondel.char) {
                  const rondelElem = document.getElementById(`rondel${rondel.char}`);
                  rondelElem.classList.add("available-nut");
                  const handler = dojo.connect(rondelElem, "onclick", () =>
                    this.onExchangeNutSelected(rondel, rondelObj)
                  );
                  this.handlers.nutHandlers.push(handler);
                }
              }
          break;
        case GiantActionActive.MOVE_RONDEL:
          this.availableMovements = [-1, 1];
          break;
        default:
          break;
      }
    }

    this.availableMovements.map((movement: number) => {
      const rondelNewLocation = ((rondel.location + movement - 1) % 8) + 1; // 1 to 8
      const elemId = this.mapRondelCharToIdLocation(rondel, rondelNewLocation);
      const elem = document.getElementById(elemId);
      elem.classList.add("highlighted-action");

      const handler = dojo.connect(elem, "onclick", () => {
        if (this.giantActionActive) {
            this.onSpecialGiantActionSelected([rondel], movement, rondelNewLocation)
        } else {
            this.onAvailableMovementSelected(rondel, movement, rondelNewLocation)
        }
      }
      );
      this.handlers.availableMovementsHandlers.push(handler);
    });
  }

  private onExchangeNutSelected(rondelA: Rondel, rondelB: Rondel) {
    this.game.onSpecialGiantActionClick([rondelA, rondelB], 0, 0);
  }

  private onSpecialGiantActionSelected(rondel: Rondel[], movement, rondelNewLocation) {
    this.game.onSpecialGiantActionClick(rondel, movement, rondelNewLocation);
  }

  private onAvailableMovementSelected(
    rondel: Rondel,
    movement,
    rondelNewLocation
  ) {
        this.game.onHeroeActionCardClick(rondel, movement, rondelNewLocation);
    }
  

  public updateRondel(rondelChar, newLocation, movement) {
    const rondel = this.rondels.find((rondel) => rondel.char == rondelChar);
    rondel.location = newLocation;
    rondel.movement = movement;
    rondel.enabled = false;
    this.removeMovement(movement);
    const rondelPosId = this.mapRondelCharToIdLocation(rondel);
    this.printRondelOnBoard(rondelChar, rondelPosId);
  }

  public updateRondelState(rondels: Rondels) {
    this.availableMovements = rondels.availableMovements;
    this.rondels = rondels.rondels;
  }

  private removeMovement(movement: number) {
    this.availableMovements = this.availableMovements.filter(
      (n) => n !== movement
    );
  }
}
