class GiantTableCenter {
    private giantTableCards: LineStock<Card>;

    constructor(private game: AmenazaGiganteGame, gamedatas: AmenazaGiganteGamedatas) {
        console.log('GiantTableCenter constructor', gamedatas);

        const visibleCount = 1;
        // const visibleCount = gamedatas.visibleCardCount;
        const visibleCards: GiantCard[]  = gamedatas.giantCards;
        console.log('cards', visibleCards)
        const totalCards = 9;
        const fakeCards: GiantCard[] = [];

        visibleCards.forEach((card, index) => {
            card.flipped = false;
        });

        for (let i = visibleCards.length; i < totalCards; i++) {
            fakeCards.push({
                flipped: true, // por si querés forzar que no se pueda interactuar
                id: 1000 + i, // un id que no colisione con los reales
                location: 'giant-row',
                locationArg: 0,
                type: 2, // o el tipo que corresponda al dorso
                typeArg: 1,
                index: 10, // este seria cual GCard se coloca esto hace que se pinte el dorso (según CardsManager)
                sections: [],
                // fake: true, // opcional, si querés identificarlas después
            });
        }

        const allCards = [...visibleCards, ...fakeCards];
        console.log('allCards', allCards)
        document.getElementById(`giant-table-row`).insertAdjacentHTML('beforeend', `                
            <div>
                <div class="name-wrapper">
                    <span class="name" style="color: #red;">Giant Path</span>
                </div>
                <div id="giant-table-cards" class="giant-table-cards"></div>
            </div>
        `);

        this.giantTableCards = new LineStock<Card>(this.game.cardsManager, document.getElementById(`giant-table-cards`), {
            center: false,
        });

        this.giantTableCards.addCards(allCards);
    }

    public async addNewCard(card: GiantCard) {
        const cards = this.giantTableCards.getCards();
        const firstFakeCard = cards.find(card => card.id > 1000)

        
        await this.giantTableCards.removeCard(firstFakeCard);        
        await this.giantTableCards.addCard(card, null,{index: card.locationArg - 1, visible: false});
        // INDEX ES 0 INDEX

        // await this.giantTableCards.flipCard(card, {

        // });
        const newCardElem = this.giantTableCards.getCardElement(card)
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