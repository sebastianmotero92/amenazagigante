import { GameTokens } from "./GameTokens";
import { CardHand } from "./CardHand";
import { CardStack } from "./CardStack";
import { CustomAnimation } from "./CustomAnimation";
import { CustomRenders } from "./CustomRenders";
import { LocalSettings } from "./LocalSettings";

/**
 * Main game class for Amenaza Gigante
 * Extends GameTokens with game-specific functionality
 */

class GameXBody extends GameTokens {
  // Game constants
  readonly CARD_WIDTH = 186;
  readonly CARD_HEIGHT = 260;
  
  // Track enums
  readonly Track = {
    GiantLife: 'giant-life',
    QualityAttack: 'quality-attack-track',
    QualityRepair: 'quality-repair-track',
    QualityMoral: 'quality-moral-track',
    SupplyAmmo: 'supply-ammo-track',
    SupplyTools: 'supply-tools-track',
    SupplyTrumpet: 'supply-trumpet-track',
    CityDestruction: 'city-destruction-track',
  } as const;

  // Token IDs
  readonly TOKENS = {
    life: 'token-life',
    attack: 'token-attack',
    repair: 'token-repair',
    moral: 'token-moral',
    ammo: 'token-ammo',
    tools: 'token-tools',
    trumpet: 'token-trumpet',
    destruction: 'token-destruction',
  };

  // Game state
  isDoingSetup: boolean;
  private customAnimation: CustomAnimation;
  private localSettings: LocalSettings;
  private customRenders: CustomRenders;
  private cardHand: CardHand;
  private cardStacks: CardStack[];

  constructor() {
    super();
    this.isDoingSetup = false;
    this.customAnimation = new CustomAnimation(this);
    this.localSettings = new LocalSettings(this);
    this.customRenders = new CustomRenders(this);
    this.cardHand = new CardHand(this);
    this.cardStacks = [];
  }

  setup(gamedatas: any): void {
    try {
      this.isDoingSetup = true;
      this.instantaneousMode = true;

      console.log("Starting game setup", gamedatas);

      // Create main game container
      document.getElementById('game_play_area').insertAdjacentHTML('beforeend', `
        <div id="player-tables"></div>
      `);

      // Setup player boards
      document.getElementById('player-tables').insertAdjacentHTML('beforeend', `
        <div id="board-wrapper">
          <div class="tokens-track" id="tokens-track"></div>
          <div id="giants-path-row" class="board-row">
            <div class="giants-path-board">
              <strong>Giant's Path</strong>
              <div class="giants-path-cards-wrapper">
                <div class="giantToken" id="giantToken"></div>
                <div class="giants-path-cards" id="giants"></div>
              </div>
            </div>
          </div>
          <div id="heroes-row" class="board-row">
            <strong>Heroes</strong>
            <div class="heroes-cards-wrapper">
              <div class="heroes-cards" id="heroes"></div>
            </div>
          </div>
          <div id="city-row" class="board-row">
            <strong>City</strong>
            <div class="city-card-wrapper">
              <div class="city-cards">
                <div class="city-card" id="city-card">
                  <div class="city-tracks" id="city-tracks">
                    ${this.createCityTracksHTML()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `);

      // Setup giant cards
      if (gamedatas.giantCards) {
        for (const key in gamedatas.giantCards) {
          this.addCardToGiantsPath(gamedatas.giantCards[key], key);
        }
      }

      // Setup hero cards
      if (gamedatas.heroesCards) {
        this.addCardToHerosPath(gamedatas.heroesCards['8']);
        this.addCardToHerosPath(gamedatas.heroesCards['4']);
        this.addCardToHerosPath(gamedatas.heroesCards['1']);
      }

      // Setup track state
      if (gamedatas.trackState) {
        for (const track in gamedatas.trackState) {
          this.printTokenOnBoard(`token-${track}`, `${track}${gamedatas.trackState[track]}`);
        }
      }

      // Setup notifications
      this.setupNotifications();

      this.isDoingSetup = false;
      console.log("Ending game setup");
    } catch (error) {
      console.error("Error in setup:", error);
      this.isDoingSetup = false;
    }
  }

  /**
   * Create HTML for city tracks
   */
  private createCityTracksHTML(): string {
    return `
      <div class="track-token" id="token-life"></div>
      <div class="track-token" id="token-attack"></div>
      <div class="track-token" id="token-repair"></div>
      <div class="track-token" id="token-moral"></div>
      <div class="track-token" id="token-ammo"></div>
      <div class="track-token" id="token-tools"></div>
      <div class="track-token" id="token-trumpet"></div>
      <div class="track-token" id="token-destruction"></div>

      <div class="${this.Track.GiantLife} life1" id="life1"></div>
      <div class="giant-life life2" id="life2"></div>
      <div class="giant-life life3" id="life3"></div>
      <div class="giant-life life4" id="life4"></div>
      <div class="giant-life life5" id="life5"></div>
      <div class="giant-life life6" id="life6"></div>
      <div class="giant-life life7" id="life7"></div>
      <div class="giant-life life8" id="life8"></div>
      <div class="giant-life life9" id="life9"></div>
      <div class="giant-life life10" id="life10"></div>

      <div class="quality-attack-track attack0"></div>
      <div class="quality-attack-track attack1" id="attack1"></div>
      <div class="quality-attack-track attack2"></div>
      <div class="quality-attack-track attack3"></div>
      <div class="quality-attack-track attack4"></div>
      <div class="quality-attack-track attack5"></div>

      <div class="quality-repair-track repair0"></div>
      <div class="quality-repair-track repair1" id="repair1"></div>
      <div class="quality-repair-track repair2"></div>
      <div class="quality-repair-track repair3"></div>
      <div class="quality-repair-track repair4"></div>
      <div class="quality-repair-track repair5"></div>

      <div class="quality-moral-track moral0"></div>
      <div class="quality-moral-track moral1"></div>
      <div class="quality-moral-track moral2"></div>
      <div class="quality-moral-track moral3"></div>
      <div class="quality-moral-track moral4"></div>
      <div class="quality-moral-track moral5" id="moral5"></div>

      <div class="supply-ammo-track ammo0"></div>
      <div class="supply-ammo-track ammo1"></div>
      <div class="supply-ammo-track ammo2" id="ammo2"></div>
      <div class="supply-ammo-track ammo3"></div>
      <div class="supply-ammo-track ammo4"></div>

      <div class="supply-tools-track tools0"></div>
      <div class="supply-tools-track tools1"></div>
      <div class="supply-tools-track tools2" id="tools2"></div>
      <div class="supply-tools-track tools3"></div>
      <div class="supply-tools-track tools4"></div>

      <div class="supply-trumpet-track trumpet0"></div>
      <div class="supply-trumpet-track trumpet1"></div>
      <div class="supply-trumpet-track trumpet2" id="trumpet2"></div>
      <div class="supply-trumpet-track trumpet3"></div>
      <div class="supply-trumpet-track trumpet4"></div>

      <div class="city-destruction-track destruction1"></div>
      <div class="city-destruction-track destruction2"></div>
      <div class="city-destruction-track destruction3"></div>
      <div class="city-destruction-track destruction4" id="destruction4"></div>
      <div class="city-destruction-track destruction5"></div>
      <div class="city-destruction-track destruction6" id="destruction6"></div>
      <div class="city-destruction-track destruction7"></div>
      <div class="city-destruction-track destruction8"></div>
      <div class="city-destruction-track destruction9"></div>
      <div class="city-destruction-track destruction10"></div>
    `;
  }

  ///////////////////////////////////////////////////
  //// Game & client states

  onEnteringState(stateName: string, args: any): void {
    console.log('Entering state: ' + stateName, args);

    switch (stateName) {
      case 'giantTurn':
        const pos = args.args['giantPath']['giantPos'];
        const giantCard = args.args['giantPath']['cards'][pos];
        
        if (giantCard?.top?.mandatoryActions) {
          giantCard.top.mandatoryActions.forEach((action: any[], index: number) => {
            const elem = document.querySelector(`#card_G1 .element.pos-${index + 1}`);
            if (elem) {
              this.connect(elem, 'onclick', () => {
                console.log('click on action', action.length, action[0]);
                action.forEach((act) => {
                  const element = document.getElementById('token-destruction');
                  const parent = element?.parentElement;
                  if (parent) {
                    const num = parent.id.match(/\d+/)?.[0];
                    if (num) {
                      const number = parseInt(num) + act.value;
                      const trackName = `destruction${number}`;
                      this.printTokenOnBoard(`token-destruction`, trackName);
                    }
                  }
                });
              });
              (elem as HTMLElement).style.border = '2px solid red';
            }
          });
        }
        break;

      default:
        break;
    }
  }

  onLeavingState(stateName: string): void {
    console.log('Leaving state: ' + stateName);
  }

  onUpdateActionButtons(stateName: string, args: any): void {
    console.log('onUpdateActionButtons: ' + stateName, args);

    if (this.isCurrentPlayerActive()) {
      switch (stateName) {
        case 'playerTurn':
          const playableCardsIds = args.playableCardsIds;
          if (playableCardsIds) {
            playableCardsIds.forEach((cardId: number) => {
              this.statusBar.addActionButton(
                this._('Play card with id ${card_id}').replace('${card_id}', cardId.toString()),
                () => this.onCardClick(cardId)
              );
            });
          }
          this.statusBar.addActionButton(this._('Pass'), () => this.bgaPerformAction("actPass"), { color: 'secondary' });
          break;
      }
    }
  }

  ///////////////////////////////////////////////////
  //// Utility methods

  async printTokenOnBoard(origId: string, destId: string): Promise<void> {
    console.log('printTokenOnBoard', origId, destId);

    const token = document.getElementById(origId);
    const target = document.getElementById(destId);

    if (!token || !target) {
      console.error("Token or target not found", origId, destId);
      return;
    }

    token.style.position = 'absolute';
    token.style.left = '0px';
    token.style.top = '0px';

    const anim = this.slideToObject(token.id, target.id);
    await this.bgaPlayDojoAnimation(anim);

    target.appendChild(token);
    token.style.position = '';
  }

  addCardToHerosPath(card: any): void {
    const cardDivId = `card_H${card.id}`;
    const cardHtml = `
      <div id="${cardDivId}" class="card" data-type="${card.type}" data-arg="${card.type_arg}">
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
      this.formatCardSprite(cardDivId, card.type, card.type_arg, card.id);
    }
  }

  addCardToGiantsPath(card: any, key: string): void {
    const cardDivId = `card_G${key}`;
    const cardHtml = `
      <div id="${cardDivId}" class="card" data-type="${card.type}" data-arg="${card.type_arg}">
        <div class="card-section top"></div>
        <div class="card-section middle"></div>
        <div class="card-section bottom"></div>
      </div>`;

    const cardElem = dojo.byId('giants');
    if (cardElem) {
      dojo.place(cardHtml, cardElem);
      this.renderCardZones(cardDivId, card.type_arg);
      this.formatCardSprite(cardDivId, card.type, card.type_arg, card.id);
    }
  }

  renderCardZones(cardDivId: string, numCard: number): void {
    const cardAreasById: { [key: number]: { top: number[]; middle: number[]; bottom: number[] } } = {
      1: { top: [1, 2, 3], middle: [1, 2, 3], bottom: [] },
      2: { top: [1, 2, 3], middle: [1, 22, 31], bottom: [] },
      3: { top: [1, 22, 32], middle: [1, 2, 3], bottom: [] },
      4: { top: [6], middle: [6, 7, 23, 32], bottom: [] },
      5: { top: [4, 5], middle: [1, 2, 3], bottom: [] },
      6: { top: [1, 21, 31], middle: [5, 71, 61], bottom: [] },
      7: { top: [1, 2, 3], middle: [4], bottom: [] },
      8: { top: [1, 7, 8, 9], middle: [4], bottom: [] },
      9: { top: [1, 2, 3], middle: [1, 5], bottom: [] },
    };

    const node = dojo.byId(cardDivId);
    if (!node) return;

    const areas = cardAreasById[numCard] || { top: [], middle: [], bottom: [] };

    for (const area in areas) {
      const zones = areas[area as keyof typeof areas];
      const areaElem = node.querySelector(`.card-section.${area}`);
      if (!areaElem) continue;

      zones.forEach(zone => {
        const highlight = document.createElement('div');
        highlight.classList.add('element', `pos-${zone}`);
        areaElem.appendChild(highlight);
      });
    }
  }

  formatCardSprite(cardDivId: string, type: string, typeArg: number, index: number): void {
    const node = dojo.byId(cardDivId);
    if (!node) return;

    const col = typeArg - 1;
    const row = (type === 'hero') ? 0 : 1;
    node.style.backgroundImage = 'img/cards.png';
    node.style.backgroundSize = '900% 200%';
    node.style.backgroundPosition = `${col * -100}% ${row * -100}%`;
    node.style.left = `${(index - 1) * (this.CARD_WIDTH + 20)}px`;
  }

  ///////////////////////////////////////////////////
  //// Player's action

  onCardClick(card_id: number): void {
    console.log('onCardClick', card_id);

    this.bgaPerformAction("actPlayCard", {
      card_id,
    });
  }

  ///////////////////////////////////////////////////
  //// Reaction to cometD notifications

  setupNotifications(): void {
    console.log('notifications subscriptions setup');
    // Add notification handlers here
  }
}