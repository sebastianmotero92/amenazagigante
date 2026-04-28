const mapArea = {
  top: 0,
  middle: 1,
  bottom: 2
};

const mapAreaName = (area: TGiantArea): string => {
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
  private giantPosition: TGiantPosition;
  private giantArea: TGiantArea;
  private giantCards: GiantCard[];
  private currGiantCard: GiantCard;
  private handlers: any[];
  private game: AmenazaGiganteGame;

  constructor(
    public pGiantPosition: TGiantPosition,
    public pGiantArea: TGiantArea,
    public pGiantCards: GiantCard[],
    public pGame?: AmenazaGiganteGame
  ) {
    this.giantPosition = pGiantPosition;
    this.giantArea = pGiantArea;
    this.giantCards = pGiantCards;
    this.handlers = [];
    this.currGiantCard = this.getCurrentGiantCard();
    this.game = pGame;
  }

  private getCurrentGiantCard() {
    return this.giantCards[this.giantPosition - 1];
  }

  public setupGiant() {
    this.placeGiantToken();
  }

  public placeGiantToken() {
    const giantElem = document.querySelector(".giantToken") as HTMLElement | null;
    let currCardElem: HTMLElement | null = null;
    currCardElem = document.querySelector(`#card-${this.currGiantCard?.id || 1000}`) as HTMLElement | null;

    if (!currCardElem) {
      console.error("Curr card element not found yet, retrying...");
      currCardElem = document.querySelector(`#card-1000`) as HTMLElement | null;
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
        top: `${toppx[mapAreaName(this.giantArea)]}px`, // o ajustalo si querés centrar verticalmente
        // left: `${currCardElem.offsetWidth - 200}px`, // al costado derecho con 5px de offset
        left: "-38px",
        width: `${currCardElem.offsetWidth / 3}px`,
        height: "auto", // mantener proporciones
        zIndex: "11" // aseguramos que esté arriba
      });

      // Agregamos el token al DOM si no está ya dentro
      currCardElem.appendChild(giantElem);
    }
  }

  private removeHighlighedtActions() {
    document.querySelectorAll(".highlighted-action").forEach((el) => {
      el.classList.remove("highlighted-action");
    });
  }

  private getMandatoryActionSlot(): GiantArea {
    const activeSection: Section = this.getCurrentSectionActive();
    return activeSection.mandatory;
  }

  private getOptionalActionSlots(): GiantArea[] {
    const activeSection: Section = this.getCurrentSectionActive();
    return activeSection.optional;
  }

  private highlightGiantActions(isMandatoryStage: boolean = false) {
    if (!this.currGiantCard) {
      throw Error('No current Giant card face up')
    }
    const cardId = this.currGiantCard?.id;
    const areaName = mapAreaName(this.giantArea);

    const elemAreaNodes = document.querySelectorAll(`#card-${cardId}-front .${areaName} .giant-action-area`);

    if (!elemAreaNodes || elemAreaNodes.length === 0) {
      console.warn("highlightGiantActions: no action nodes found", { cardId, areaName });
      return;
    }

    if (isMandatoryStage) {
      const el = elemAreaNodes[0] as HTMLElement | undefined;
      if (!el) {
        console.warn("highlightGiantActions: mandatory element missing");
        return;
      }
      el.classList.add("highlighted-action");
      const handler = dojo.connect(el, "onclick", () => this.onActionSelected(0));
      this.handlers.push(handler);
      // console.log("Connected mandatory action handler");
    } else {
      const mandatorySlot = this.getMandatoryActionSlot();
      const hasMandatorySlot: boolean = Boolean(
        mandatorySlot && Array.isArray(mandatorySlot.actions) && mandatorySlot.actions.length
      );

      for (let index = hasMandatorySlot ? 1 : 0; index < elemAreaNodes.length; index++) {
        const actionIndex = hasMandatorySlot ? index - 1 : index;
        const el = elemAreaNodes[index] as HTMLElement | undefined;
        if (!el) continue;
        el.classList.add("highlighted-action");
        const handler = dojo.connect(el, "onclick", () => this.onActionSelected(actionIndex));
        this.handlers.push(handler);
      }
      // console.log("Connected optional action handlers");
    }
  }

  // -------

  public highlightMandatoryAction() {
    this.highlightGiantActions(true);
  }

  public highlightOptionalActions() {
    this.highlightGiantActions(false);
  }

  public updateGiant(newPosition: TGiantPosition, newArea: TGiantArea, cards: GiantCard[]) {
    this.giantPosition = newPosition;
    this.giantArea = newArea;
    this.giantCards = cards;
    this.currGiantCard = this.getCurrentGiantCard();
  }

  /**
   * Remove highlight effects & handlers from actions
   */
  public resetGiantActions() {
    this.removeHighlighedtActions();
    this.handlers.forEach((handler) => handler.remove());
    this.handlers = [];
  }

  public onActionSelected(index) {
    console.log("Action selected:", index);
    this.game.onGiantTableCardClick(this.currGiantCard.id, this.giantArea, index);
  }

  public getCurrentCard(): GiantCard {
    return this.currGiantCard;
  }

  public getCurrentSectionActive(): Section {
    return this.currGiantCard.sections[this.giantArea];
  }
}
