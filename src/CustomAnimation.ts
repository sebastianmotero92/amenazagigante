import { GameXBody } from "./GameXBody";

/**
 * Custom animations for game elements
 */
class CustomAnimation {
  private game: GameXBody;
  private animationQueue: any[];

  constructor(game: GameXBody) {
    this.game = game;
    this.animationQueue = [];
  }

  /**
   * Slide token to target position
   */
  async slideTokenTo(tokenId: string, targetId: string, duration?: number): Promise<void> {
    const token = document.getElementById(tokenId);
    const target = document.getElementById(targetId);
    
    if (!token || !target) {
      console.error("Token or target not found");
      return;
    }

    const anim = this.game.slideToObject(tokenId, targetId);
    await this.game.bgaPlayDojoAnimation(anim);
    
    target.appendChild(token);
  }

  /**
   * Animate card play
   */
  async animateCardPlay(cardId: string, targetId: string): Promise<void> {
    console.log("Animating card play:", cardId, targetId);
    await this.slideTokenTo(cardId, targetId);
  }

  /**
   * Animate token movement
   */
  async animateTokenMove(tokenId: string, fromId: string, toId: string): Promise<void> {
    console.log("Animating token move:", tokenId, fromId, toId);
    await this.slideTokenTo(tokenId, toId);
  }

  /**
   * Animate score change
   */
  async animateScoreChange(playerId: number, delta: number): Promise<void> {
    console.log("Animating score change:", playerId, delta);
  }

  /**
   * Animate victory
   */
  async animateVictory(playerId: number): Promise<void> {
    console.log("Animating victory:", playerId);
  }

  /**
   * Clear animation queue
   */
  clearQueue(): void {
    this.animationQueue = [];
  }

  /**
   * Process queue
   */
  async processQueue(): Promise<void> {
    while (this.animationQueue.length > 0) {
      const anim = this.animationQueue.shift();
      await anim();
    }
  }
}