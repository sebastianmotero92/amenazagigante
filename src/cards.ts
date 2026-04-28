type Sector = "top" | "middle" | "bottom";

type GameAction = "actExecuteMandatoryAction" | "actExecuteOptionalAction" | "actExecuteSpecialAction";

interface Card {
  flipped: boolean;
  id: number;
  location: string;
  locationArg: number;
  type: number;
  typeArg: number;
  index: number;
}

interface GiantAction {
  track: number;
  value: number;
}

interface GiantArea {
  actions: GiantAction[];
}

interface Section {
  mandatory: GiantArea;
  optional: GiantArea[];
  sectionPosition: Sector;
}

interface GiantCard extends Card {
  sections: Section[];
}

interface HeroeCard extends Card {}

class CardsManager extends CardManager<Card> {
  constructor(public game: AmenazaGiganteGame) {
    super(game, {
      getId: (card) => `card-${card.id}`,
      setupDiv: (card: Card, div: HTMLElement) => {
        div.dataset.cardId = "" + card.id;
        div.dataset.type = "" + card.type;
        div.dataset.typeArg = "" + card.typeArg;
      },
      setupFrontDiv: (card: Card, div: HTMLElement) => this.setupFrontDiv(card, div),
      isCardVisible: (card) => !card.flipped,
      animationManager: game.animationManager,
      cardWidth: 186, //149,
      cardHeight: 260 //208,
    });
  }

  public setupFrontDiv(card: Card, div: HTMLElement, ignoreTooltip: boolean = false) {
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
        div.insertAdjacentHTML(
          `beforeend`,
          `
            <div class="card-section top"></div>
            <div class="card-section middle"></div>
            <div class="card-section bottom"></div>
            `
        );

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
        div.insertAdjacentHTML(
          `beforeend`,
          `
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
            `
        );
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

  private drawGiantActionAreas(index: number, div: HTMLElement) {
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

  public highlightHeroeActions(card: HeroeCard) {
    console.log("highlightHeroeActions", card);
    const elemAreaNodes = document.querySelectorAll(`#card-${card.id}-front`);
    console.log(elemAreaNodes);
  }
}
