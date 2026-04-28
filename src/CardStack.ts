import { GameXBody } from "./GameXBody";

/**
 * Card stack management for cards on table
 */
class CardStack {
  private game: GameXBody;
  private cards: Map<string, any>;
  private location: string;

  constructor(game: GameXBody, location: string) {
    this.game = game;
    this.location = location;
    this.cards = new Map();
  }

  /**
   * Add card to stack
   */
  addCard(cardId: string, cardData: any): void {
    this.cards.set(cardId, cardData);
    this.render();
  }

  /**
   * Remove card from stack
   */
  removeCard(cardId: string): void {
    this.cards.delete(cardId);
    this.render();
  }

  /**
   * Get all cards in stack
   */
  getCards(): any[] {
    return Array.from(this.cards.values());
  }

  /**
   * Get card count
   */
  getCount(): number {
    return this.cards.size;
  }

  /**
   * Render the stack
   */
  private render(): void {
    // Render cards in stack
  }

  /**
   * Get top card
   */
  getTopCard(): any | null {
    const cards = this.getCards();
    return cards.length > 0 ? cards[cards.length - 1] : null;
  }

  /**
   * Clear stack
   */
  clear(): void {
    this.cards.clear();
    this.render();
  }
}