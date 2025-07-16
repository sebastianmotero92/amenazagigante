class GiantManager {
  private giantPosition: number;
  private giantArea: string;
  private giantCards: GiantCard[]
  private currGiantCard: GiantCard;
  private handlers: any[];

  constructor(public game: AmenazaGiganteGame) {
    this.giantPosition = this.game.gamedatas.giantPosition;
    this.giantArea = this.game.gamedatas.giantArea;
    this.giantCards = this.game.gamedatas.giantCards;
    this.handlers = [];
    this.currGiantCard = this.getCurrentGiantCard();
  }

  public updateGiant(newPosition, newArea, cards) {
    this.giantPosition = newPosition;
    this.giantArea = newArea
    this.giantCards = cards;
    this.currGiantCard = this.getCurrentGiantCard();
  }

  private getCurrentGiantCard() {
    return this.giantCards[this.giantPosition - 1];
  }

  public removeHighlighedtActions() {
    document.querySelectorAll(".highlighted-action").forEach((el) => {
      el.classList.remove("highlighted-action");
    });
  }

  public resetGiantActions() {
    this.removeHighlighedtActions();
    this.handlers.forEach(handler => handler.remove());
    this.handlers = [];
  }

  public onActionSelected(index) {
    this.game.onGiantTableCardClick(this.currGiantCard.id, this.giantArea, index);
  }

  public highlightGiantActions(isMandatoryStage: boolean = false) {
    console.log('highlightGiantActions', isMandatoryStage);
    console.log(this.currGiantCard)
    console.log(this.giantArea)
    const elemAreaNodes = document.querySelectorAll(
      `#card-${this.currGiantCard.id}-front .${this.giantArea} .giant-action-area`
    );
    console.log('elemAreaNodes', elemAreaNodes);
    if (isMandatoryStage) {
      elemAreaNodes[0].classList.add("highlighted-action");
      const handler = dojo.connect(elemAreaNodes[0], "onclick", () => this.onActionSelected(1));
      this.handlers.push(handler);
    }

    if (!isMandatoryStage) {
      for (let i = 1; i < elemAreaNodes.length; i++) {
        elemAreaNodes[i].classList.add("highlighted-action");
        const handler = dojo.connect(elemAreaNodes[i], "onclick", () => this.onActionSelected(i));
        this.handlers.push(handler);
      }
    }
  }
}
