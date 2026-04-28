// @ts-ignore
GameGui = /** @class */ (function () {
  function GameGui() {}
  return GameGui;
})();

/**
 * Class that extends default bga core game class with more functionality
 * Contains generally usefull features such as animation, additional utils, etc
 */

class GameBasics extends GameGui {
  laststate: string | undefined;
  pendingUpdate: boolean;
  currentPlayerWasActive: boolean;
  isLoadingLogsComplete: boolean;

  classActiveSlot: string = "active_slot";
  classButtonDisabled: string = "disabled";

  gamedatas_server: any; // copy of server state gamedatas
  defaultTooltipDelay: number = 800;
  defaultAnimationDuration: number = 500;
  _helpMode: boolean = false; // help mode where tooltip shown instead of click action
  _displayedTooltip: any = null; // used in help mode
  _notif_uid_to_log_id: any = {};
  _notif_uid_to_mobile_log_id: any = {};
  _last_notif: any = null;

  zoom: number = 1.0;

  constructor() {
    super();
    console.log("game constructor");
    this.laststate = null;
    this.pendingUpdate = false;
    this._notif_uid_to_log_id = {};
    this._notif_uid_to_mobile_log_id = {};
    this._last_notif = null;
  }

  setup(gamedatas: any) {
    console.log("Starting game setup", gamedatas);
    this.gamedatas_server = dojo.clone(this.gamedatas);
    this.setupInfoPanel();
    this.setupNotifications();
    this.upldateColorMapping(".player-name *");
  }

  setupInfoPanel() {
    // Setup info panel if needed
  }

  upldateColorMapping(selector: string) {
    // Update color mapping for players
  }

  // Utility method to get tooltip HTML
  getTooltipHtml(title: string, subtitle: string, description: string, footer: string): string {
    return `<div class="bga-tooltip">
      ${title ? `<div class="bga-tooltip-title">${title}</div>` : ''}
      ${subtitle ? `<div class="bga-tooltip-subtitle">${subtitle}</div>` : ''}
      ${description ? `<div class="bga-tooltip-description">${description}</div>` : ''}
      ${footer ? `<div class="bga-tooltip-footer">${footer}</div>` : ''}
    </div>`;
  }

  // Add tooltip to element
  addTooltipHtml(elementId: string, html: string, delay?: number) {
    this.addTooltip(elementId, html, delay || this.defaultTooltipDelay);
  }

  // Remove tooltip from element
  removeTooltip(elementId: string) {
    this.removeTooltip(elementId);
  }

  // Connect event handler to element
  connect(element: any, event: string, handler: Function) {
    dojo.connect(element, event, this, handler);
  }

  // Disconnect all handlers for element
  disconnect(element: any, event: string) {
    dojo.disconnect(element, event);
  }

  // Format number for display
  formatNumber(value: number): string {
    return value.toString();
  }

  // Get current player ID
  getCurrentPlayerId(): number {
    return this.player_id;
  }

  // Check if is spectator
  isSpectatorMode(): boolean {
    return this.isSpectator;
  }

  // Get player color
  getPlayerColor(playerId: number): string {
    return this.gamedatas.players[playerId]?.color || '';
  }

  // Get player name
  getPlayerName(playerId: number): string {
    return this.gamedatas.players[playerId]?.name || '';
  }

  // Check if current player is active
  isCurrentPlayerActive(): boolean {
    return this.isCurrentPlayerActive();
  }

  // Perform action on server
  bgaPerformAction(action: string, args?: any): Promise<any> {
    return this.ajaxcall({
      url: "/",
      json: { 
        action: action, 
        args: args || {} 
      }
    });
  }

  // Setup notifications
  setupNotifications() {
    console.log("Setting up notifications");
  }

  // Helper to translate
  _(text: string): string {
    return text;
  }
}