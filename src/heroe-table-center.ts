class HeroeTableCenter {
  private heroeTableCards: LineStock<Card>;
  private heroeCards: HeroeCard[];
  constructor(
    private game: AmenazaGiganteGame,
    pHeroeCards: HeroeCard[]
  ) {
    const heroeCards: HeroeCard[] = pHeroeCards;

    document.getElementById(`heroe-table-row`).insertAdjacentHTML(
      "beforeend",
      `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">Heroes</span>
                </div>
                <div id="heroe-table-cards" class="heroe-table-cards">

                </div>
            </div>
        `
    );

    this.heroeTableCards = new LineStock<Card>(
      this.game.cardsManager,
      document.getElementById(`heroe-table-cards`),
      {
        center: false,
      }
    );

    this.heroeTableCards.addCards(heroeCards);
  }
}
