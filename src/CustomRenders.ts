import { GameXBody } from "./GameXBody";

/**
 * Custom renders for game elements
 */
class CustomRenders {
  private game: GameXBody;

  constructor(game: GameXBody) {
    this.game = game;
  }

  /**
   * Render giant card
   */
  renderGiantCard(cardId: string, cardData: any): void {
    const cardDivId = `card_G${cardId}`;
    const cardHtml = `
      <div id="${cardDivId}" class="card" data-type="${cardData.type}" data-arg="${cardData.type_arg}">
        <div class="card-section top"></div>
        <div class="card-section middle"></div>
        <div class="card-section bottom"></div>
      </div>`;

    const cardElem = dojo.byId('giants');
    if (cardElem) {
      dojo.place(cardHtml, cardElem);
      this.game.formatCardSprite(cardDivId, cardData.type, cardData.type_arg, parseInt(cardId));
    }
  }

  /**
   * Render hero card
   */
  renderHeroCard(cardId: string, cardData: any): void {
    const cardDivId = `card_H${cardId}`;
    const cardHtml = `
      <div id="${cardDivId}" class="card" data-type="${cardData.type}" data-arg="${cardData.type_arg}">
        <div class="hero-actions">
          <div class="nut"></div>
          <div class="hero-action action1"></div>
          <div class="hero-action action2"></div>
          <div class="hero-action action3"></div>
          <div class="hero-action action4"></div>
          <div class="hero-action action5"></div>
          <div class="hero-action action6"></div>
          <div class="hero-action action7"></div>
          <div class="hero-action action8"></div>
        </div>
      </div>`;

    const cardElem = dojo.byId('heroes');
    if (cardElem) {
      dojo.place(cardHtml, cardElem);
      this.game.formatCardSprite(cardDivId, cardData.type, cardData.type_arg, parseInt(cardId));
    }
  }

  /**
   * Render token on track
   */
  renderToken(tokenId: string, position: string): void {
    this.game.printTokenOnBoard(tokenId, position);
  }

  /**
   * Update player board
   */
  updatePlayerBoard(playerId: number, data: any): void {
    console.log("Updating player board:", playerId, data);
  }

  /**
   * Update score
   */
  updateScore(playerId: number, score: number): void {
    console.log("Updating score:", playerId, score);
  }
}