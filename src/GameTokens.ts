import { GameBasics } from "./GameBasics";

/**
 * Interface that mimics token database object
 */
interface Token {
  key: string;
  location: string;
  state: number;
}

interface TokenDisplayInfo {
  key: string;
  tokenId: string;
  typeKey: string;
  mainType: string;
  imageTypes: string;
  name?: string;
  tooltip?: string;
  tooltip_action?: string;
  showtooltip?: boolean;
  [key: string]: any;
}

interface TokenMoveInfo extends Token {
  x?: number;
  y?: number;
  position?: string;
  onEnd?: (node: Element) => void;
  onClick?: eventhandler;
  animtime?: number;
  relation?: string;
  nop?: boolean;
  from?: string;
}

class GameTokens extends GameBasics {
  restoreList: string[];
  player_color: string;
  clientStateArgs: any;
  original_click_id: any;

  constructor() {
    super();
    this.restoreList = [];
    this.clientStateArgs = null;
    this.original_click_id = null;
  }

  setup(gamedatas: any): void {
    super.setup(gamedatas);
    this.restoreList = [];

    const first_player_id = Object.keys(gamedatas.players)[0];
    if (!this.isSpectator) this.player_color = gamedatas.players[this.player_id].color;
    else this.player_color = gamedatas.players[first_player_id].color;
    
    if (!this.gamedatas.tokens) {
      console.error("Missing gamadatas.tokens!");
      this.gamedatas.tokens = {};
    }
  }

  // Get token element by ID
  getTokenElement(tokenId: string): HTMLElement | null {
    return document.getElementById(tokenId);
  }

  // Create token element
  createTokenElement(tokenId: string, className: string): HTMLElement {
    const token = document.createElement("div");
    token.id = tokenId;
    token.className = className;
    return token;
  }

  // Move token to position with animation
  async moveToken(tokenId: string, targetId: string, duration?: number): Promise<void> {
    const token = this.getTokenElement(tokenId);
    const target = this.getTokenElement(targetId);
    
    if (!token || !target) {
      console.error("Token or target not found", tokenId, targetId);
      return;
    }

    const anim = this.slideToObject(tokenId, targetId);
    await this.bgaPlayDojoAnimation(anim);
    target.appendChild(token);
  }

  // Add click handler to token
  addTokenClickHandler(tokenId: string, handler: Function): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      this.connect(token, "onclick", () => handler(tokenId));
    }
  }

  // Show token
  showToken(tokenId: string): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      dojo.style(token, "display", "block");
    }
  }

  // Hide token
  hideToken(tokenId: string): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      dojo.style(token, "display", "none");
    }
  }

  // Set token position
  setTokenPosition(tokenId: string, x: number, y: number): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      token.style.left = x + "px";
      token.style.top = y + "px";
    }
  }

  // Get token position
  getTokenPosition(tokenId: string): { x: number; y: number } {
    const token = this.getTokenElement(tokenId);
    if (!token) return { x: 0, y: 0 };
    
    return {
      x: parseInt(token.style.left || "0"),
      y: parseInt(token.style.top || "0")
    };
  }

  // Add class to token
  addTokenClass(tokenId: string, className: string): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      dojo.addClass(token, className);
    }
  }

  // Remove class from token
  removeTokenClass(tokenId: string, className: string): void {
    const token = this.getTokenElement(tokenId);
    if (token) {
      dojo.removeClass(token, className);
    }
  }

  // Clear restore list
  clearRestoreList(): void {
    this.restoreList = [];
  }

  // Add to restore list
  addToRestoreList(tokenId: string): void {
    if (!this.restoreList.includes(tokenId)) {
      this.restoreList.push(tokenId);
    }
  }
}