class SetupHeroTableCenter {
  private heroACards: LineStock<Card>;
  private heroBCards: LineStock<Card>;
  private heroCCards: LineStock<Card>;
  private handlers: number[] = [];
  // Use TypeArg as card value
  private cardsSelected = {
    cardA: null,
    cardB: null,
    cardC: null
  };

  constructor(cardsManager: CardsManager, args: ArgsHeroSelection) {
    const heroCards: HeroeCard[] = args.heroCards;
    const sortedHeroCards: HeroeCard[] = sortedCardsByImageLocation(heroCards);

    document.getElementById(`city-table-center`).insertAdjacentHTML(
      "beforebegin",
      `                
            <div id="setup-table-center">
              <div id="setup-table-row">
                <div class="name-wrapper">
                  <span class="name" style="color: #red;">Select Hero</span>
                </div>
                <div id="setup-table-cards" class="setup-table-cards">
                  <div id="cards-a"></div>
                  <div id="cards-b"></div>
                  <div id="cards-c"></div>
                </div>
              </div>
            </div>
        `
    );

    this.heroACards = new LineStock<Card>(cardsManager, document.getElementById(`cards-a`), {
      center: true
    });

    this.heroBCards = new LineStock<Card>(cardsManager, document.getElementById(`cards-b`), {
      center: false
    });

    this.heroCCards = new LineStock<Card>(cardsManager, document.getElementById(`cards-c`), {
      center: false
    });

    this.heroACards.addCards([sortedHeroCards[0], sortedHeroCards[1], sortedHeroCards[2]]);
    this.heroBCards.addCards([sortedHeroCards[3], sortedHeroCards[4], sortedHeroCards[5]]);
    this.heroCCards.addCards([sortedHeroCards[6], sortedHeroCards[7], sortedHeroCards[8]]);

    document.querySelectorAll(".hero-actions").forEach((card) => {
      card.remove();
    });

    // setup click handler to select / highlight a card and keep one selected per column (A/B/C)
    document.querySelectorAll("#setup-table-cards .card").forEach((cardEl) => {
      const el = cardEl as HTMLElement;

      const handler = dojo.connect(el, "onclick", () => {
        const cardTypeArg = el.dataset.typeArg;

        // find which column this card belongs to
        const parent = el.closest("#cards-a, #cards-b, #cards-c") as HTMLElement | null;
        let key: "cardA" | "cardB" | "cardC" | null = null;
        if (parent) {
          if (parent.id === "cards-a") key = "cardA";
          else if (parent.id === "cards-b") key = "cardB";
          else if (parent.id === "cards-c") key = "cardC";
        }
        if (!key) return; // safety

        const alreadySelected = this.cardsSelected[key] === cardTypeArg;

        // remove previous selection in this column
        parent!.querySelectorAll(".card.selected").forEach((c) => c.classList.remove("selected"));

        if (!alreadySelected) {
          el.classList.add("selected");
          this.cardsSelected[key] = cardTypeArg;
        } else {
          // toggle off if clicked again
          this.cardsSelected[key] = null;
        }
      });
      this.handlers.push(handler);
    });
  }

  /**
   * Check if all hero cards are selected
   */
  public allCardsSelected(): boolean {
    return this.cardsSelected.cardA !== null && this.cardsSelected.cardB !== null && this.cardsSelected.cardC !== null;
  }

  /**
   * Return the selected hero cards (typeArg number)
   */
  public getSelectedCards(): { cardA: string | null; cardB: string | null; cardC: string | null } {
    return { ...this.cardsSelected };
  }

  /**
     * Clean up dojo connections when done
     */
    public destroy(): void {
        // Disconnect all stored handlers
        this.handlers.forEach(handler => {
            try {
                dojo.disconnect(handler);
            } catch (e) {
                console.warn('Failed to disconnect handler:', e);
            }
        });
        this.handlers = [];

        // Optional: remove DOM elements if needed
        document.getElementById('setup-table-center')?.remove();
    }
}
