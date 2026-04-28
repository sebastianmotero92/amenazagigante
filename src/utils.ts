const sortedCardsByImageLocation = (cards: Card[]) => {
    return cards.slice().sort((a, b) => (a.typeArg ?? 0) - (b.typeArg ?? 0));
}

