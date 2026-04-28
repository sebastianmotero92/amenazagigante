class TableCenter {
    // public decks: Deck<Card>[] = [];

    // public discardedCards: AllVisibleDeck<Card>[] = [];
    private tableCards: LineStock<Card>;

    constructor(private game: AmenazaGiganteGame, gamedatas: AmenazaGiganteGamedatas) {
        console.log('TableCenter constructor', gamedatas);
        // [1, 2].forEach(row => {
            document.getElementById('table-rows').innerHTML = `
                <div id="table-cards" class="table-cards"></div>
            `;
        
            // document.getElementById(`table-rows`).insertAdjacentHTML('beforeend', `                
            //     <div id="table-cards-1" class="table-cards"></div>
            //     `);
                
                // <div class="discard-space"><div id="discard-cards-${row}"></div></div>
                // <div id="deck-${row}"></div>
                // <div id="messenger-space-${row}">${gamedatas.messengerPawn === row ? `<div id="messenger"></div>` : ``}</div>
            
            //     this.discardedCards[row] = new AllVisibleDeck<Card>(this.game.cardsManager, document.getElementById(`discard-cards-${row}`), {
            //     direction: 'none' as any,
            //     horizontalShift: '1px',
            //     verticalShift: '1px',
            // });
            // this.discardedCards[row].addCards(gamedatas.discardedCards[row]);
            // this.discardedCards[row].onCardClick = () => this.showDiscardCardsPopin(this.discardedCards[row].getCards());

            this.tableCards = new LineStock<Card>(this.game.cardsManager, document.getElementById(`table-cards`), {
                center: false,
            });

            
            // this.tableCards[row] = new LineStock<Card>(this.game.cardsManager, document.getElementById(`table-cards-${row}`), {
            //     center: false,
            // });
            // this.tableCards[row].onCardClick = card => {
            //     this.tableCards[3 - row].unselectAll();
            //     this.game.onTableCardClick(card);
            // };

            this.tableCards.onCardClick = card => {
                if (!card.flipped) return;
                this.game.onTableCardClick(card);
            };

            // Inicialmente mostrar una descubierta, el resto "flipped"
            const visibleCount = 1;
            const cards = [];
            for (const card in gamedatas.giantCards) {
                console.log('Adding card', card, gamedatas.giantCards[card]);
                cards.push({
                    card,
                    flipped: cards.length >= visibleCount
                });
            }
            // const cards = gamedatas.giantCards.map((card, i) => ({
            //     ...card,
            //     flipped: i >= visibleCount
            // }));
            this.tableCards.addCards(cards);

            // this.tableCards[row].addCards(gamedatas.tableCards[row]);
    
            // this.decks[row] = new Deck<Card>(this.game.cardsManager, document.getElementById(`deck-${row}`), {
            //     cardNumber: gamedatas.remainingCardsInDecks[row],
            //     counter: {
            //         position: 'center',
            //         hideWhenEmpty: true,
            //     },
            //     fakeCardGenerator: deckId => ({ id: game.cardsManager.getId({ id: `${deckId}-fake-top-card` as any } as any), type: row } as any)
            // });
        // })
    }

    public revealNextCard() {
        const cards = this.tableCards.getCards();
        const nextCard = cards.find(card => card.flipped);
        if (nextCard) {
            nextCard.flipped = false;
            // this.tableCards.replaceCard(nextCard); // actualizar visualmente
        }
    }
    
    // public getTableCards(): Card[] {
    //     return [...this.tableCards[1].getCards(), ...this.tableCards[2].getCards()];
    // }

    // public getSelectedCard(): Card | undefined {
    //     return [...this.tableCards[1].getSelection(), ...this.tableCards[2].getSelection()][0];
    // }

    // public makeCardsSelectable(selectableRow: number) {
    //     [1, 2].forEach(row => this.tableCards[row].setSelectionMode(selectableRow === row ? 'single' : 'none'));
    // }

    // public setSelectedCard(selectedCard: Card) {
    //     this.game.cardsManager.getCardElement(selectedCard)?.classList.add('bga-cards_selected-card');
    // }
    
    // public async moveMessenger(row: number) {
    //     await this.game.animationManager.attachWithAnimation(
    //         new BgaSlideAnimation({
    //             element: document.getElementById(`messenger`),
    //           }),
    //           document.getElementById(`messenger-space-${row}`)
    //     );
    // }

    // private updateDeckAndDiscard(row: number, discardCards: Card[], deckCount: number) {
    //     this.decks[row].setCardNumber(deckCount);
    //     if (this.discardedCards[row].getCards().length > discardCards.length) {
    //         // reshuffle happened
    //         this.discardedCards[row].removeAll();
    //         this.discardedCards[row].addCards(discardCards);
    //     }
    // }

    // public async renewCards(row: number, discardedCards: Card[], tableCards: Card[], discardCards: Card[], deckCount: number) {
    //     await this.discardedCards[row].addCards(discardedCards);
    //     await sleep(ANIMATION_MS);
    //     await this.tableCards[row].addCards(tableCards, { fromStock: this.decks[row] }, undefined, true);
    //     this.updateDeckAndDiscard(row, discardCards, deckCount);
    // }    
    
    // public async refill(row: number, tableCards: Card[], discardCards: Card[], deckCount: number) {
    //     await this.tableCards[row].addCards(tableCards, { fromStock: this.decks[row] }, undefined, true);
    //     this.updateDeckAndDiscard(row, discardCards, deckCount);
    // }

    // public async discardCard(row: number, card: Card) {
    //     await this.discardedCards[row].addCard(card);
    // }
    
    // public async emptyRow(row: number) {
    //     await this.decks[row].removeAll();
    //     await this.tableCards[row].removeAll();
    // }
    
    // private showDiscardCardsPopin(cards: Card[]) {
    //     const viewCardsDialog = new ebg.popindialog();
    //     viewCardsDialog.create('castleComboViewDiscardedCardsDialog');
    //     viewCardsDialog.setTitle(_('Discarded cards'));
        
    //     var html = `<div id="see-discarded-cards"></div>`;
        
    //     // Show the dialog
    //     viewCardsDialog.setContent(html);
    //     const stock = new LineStock<Card>(this.game.cardsManager, document.getElementById('see-discarded-cards'));
    //     stock.addCards(cards.map(card => ({ ...card, id: -card.id } as Card)));
        
    //     viewCardsDialog.show();

    //     // Replace the function call when it's clicked
    //     viewCardsDialog.replaceCloseCallback(() => {  
    //         stock.remove();  
    //         viewCardsDialog.destroy();
    //     });
    // }
}