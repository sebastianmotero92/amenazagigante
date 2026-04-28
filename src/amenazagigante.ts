const LOCAL_STORAGE_ZOOM_KEY = "AmenazaGigante-zoom";

// @ts-ignore
const gameState = {
  playerSelectHeroes: "playerSelectHeroes",
  giantAdvance: "giantAdvance",
  giantResolution: "giantResolution",
  heroesDistribution: "heroesDistribution",
  heroesActions: "heroesActions",
  cityVerification: "cityVerification"
};

const actName = {
  selectHeroes: "actSelectHeroes",
  executeMandatoryAction: "actExecuteMandatoryAction",
  executeOptionalAction: "actExecuteOptionalAction",
  executeSpecialSwitchAction: "actExecuteSpecialSwitchAction",
  executeSpecialMoveAction: "actExecuteSpecialMoveAction"
};

// @ts-ignore
GameGui = (function () {
  // this hack required so we fake extend GameGui
  function GameGui() {}
  return GameGui;
})();

class AmenazaGigante extends GameGui<AmenazaGiganteGamedatas> implements AmenazaGiganteGame {
  public cardsManager: CardsManager;
  public animationManager: AnimationManager;
  public trackManager: TrackManager;
  public heroeManager: HeroeManager;
  public giantManager: GiantManager;
  public gamedatas: AmenazaGiganteGamedatas;
  // @ts-ignore
  private zoomManager: BgaZoom.Manager;

  private giantTableCenter: GiantTableCenter;
  private heroeTableCenter: HeroeTableCenter;
  private cityTableCenter: CityTableCenter;
  private setupHeroTableCenter: SetupHeroTableCenter;

  private currentGameState: string;

  constructor() {
    super();
  }

  public setup(gamedatas: AmenazaGiganteGamedatas) {
    console.log(`Starting game setup ${new Date().toISOString()}`);

    this.gamedatas = gamedatas;

    console.log("gamedatas", this.gamedatas);
    console.log("setup args", this.gamedatas.gamestate.args);
    const args: AnyStateArgs = this.gamedatas.gamestate.args;

    this.cardsManager = new CardsManager(this);
    this.animationManager = new AnimationManager(this);

    this.currentGameState = this.gamedatas.gamestate.name;

    this.getGameAreaElement().insertAdjacentHTML(
      "beforeend",
      `
      <div id="full-table">
        <div id="centered-table">
          <div id="giant-table-center">
            <div id="giant-table-row"></div>
          </div>
          <div id="heroe-table-center">
            <div id="heroe-table-row"></div>
          </div>
          <div id="city-table-center">
            <div id="city-table-row"></div>
          </div>
        </div>
      </div>
    `
    );

    this.cityTableCenter = new CityTableCenter();
    this.trackManager = new TrackManager(gamedatas.cityData.track, this);
    this.trackManager.setupTrack();

    const { giantPosition, giantCards, giantArea } = gamedatas.giantData;
    this.giantTableCenter = new GiantTableCenter(this, giantCards);
    this.giantManager = new GiantManager(giantPosition, giantArea, giantCards, this);
    this.giantManager.setupGiant();

    if (this.currentGameState === gameState.playerSelectHeroes) {
      console.log("Entering hero selection state SETUP");

      document.getElementById("heroe-table-center").dataset.visible = "false";
      this.setupHeroTableCenter = new SetupHeroTableCenter(this.cardsManager, args as ArgsHeroSelection);
    } else {
      console.log("Entering OTHERS state SETUP");
      document.getElementById("heroe-table-center").dataset.visible = "true";

      this.heroeTableCenter = new HeroeTableCenter(this, gamedatas.heroData.heroCards);
      const { rondels, heroCards } = gamedatas.heroData;
      this.heroeManager = new HeroeManager(this, heroCards, rondels.rondels, rondels.availableMovements, this.trackManager);
      this.heroeManager.setupRondels();
    }

    this.zoomManager = new BgaZoom.Manager({
      element: document.getElementById("full-table"),
      zoomControls: {
        color: "white"
      },
      zoomLevels: [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2],
      localStorageZoomKey: LOCAL_STORAGE_ZOOM_KEY,
      autoZoom: {
        expectedWidth: 880, // for the lines of cards of the table to fit
        minZoomLevel: 0.5
      }
    });

    this.setupNotifications();

    console.log("Ending game setup");
  }

  public onEnteringState(stateName: string, args: any) {
    console.log("Entering state: " + stateName, args.args);

    switch (stateName) {
      case gameState.playerSelectHeroes:
        console.log("Entering playerSelectHeroes state: Do nothing");
        break;
      case gameState.giantAdvance:
        console.log("Entering giantAdvance state: Do nothing");
        break;
      case gameState.giantResolution:
        console.log("Entering giantResolution state: highlight actions");
        this.onEnteringGiantMandatoryMove();
        break;
      case gameState.heroesDistribution:
        console.log("Entering heroesDistribution state: Do nothing");
        break;
      case gameState.heroesActions:
        this.onEnteringHeroePhase(args.args);
        break;
      case gameState.cityVerification:
        console.log("Entering cityVerification state: Do nothing");
        break;
      default:
        break;
    }
  }

  public onLeavingState(stateName: string) {
    switch (stateName) {
      case gameState.playerSelectHeroes:
        console.log("leaving playerSelectHeroes state: Do nothing");
        // document.getElementById('heroe-table-center').dataset.visible = 'true';
        break;
      case gameState.giantAdvance:
        console.log("leaving giantAdvance");
        break;
      case gameState.giantResolution:
        this.onLeavingGiantMandatoryMove();
        break;
      case gameState.heroesDistribution:
        console.log("leaving heroesDistribution");
        break;
      case gameState.heroesActions:
        this.onLeavingHeroePhase();
        break;
      case gameState.cityVerification:
        console.log("leaving cityVerification");
        break;
      default:
        break;
    }
  }

  private onEnteringGiantMandatoryMove() {
    console.log("onEnteringGiantMandatoryMove", this.giantManager);
    this.giantManager.highlightMandatoryAction();
  }

  private onLeavingGiantMandatoryMove() {
    this.giantManager.resetGiantActions();
    // this.heroeManager.resetAll();
  }

  private onEnteringGiantOptionalMove() {
    this.giantManager.highlightOptionalActions();
  }

  private onLeavingGiantOptionalMove() {
    this.giantManager.resetGiantActions();
  }

  private onEnteringGiantSpecialAction(args: EnteringGiantSpecialAction) {
    console.log("onEnteringGiantSpecialAction");
    this.heroeManager.initGiantPhase(args.specialGiantAction);
    // this.heroeManager.resetEnableRondels();
    // this.heroeManager.enableRondels();
  }

  private onLeavingGiantSpecialAction() {
    console.log("onLeavingGiantSpecialAction");
    this.heroeManager.resetAll();
  }

  private onEnteringHeroePhase(args: EnteringHeroePhase) {
    console.log("onEnteringHeroePhase", args.rondels);
    this.heroeManager.initHeroPhase();
    // TODO actualizar rondeles habilitados
    // console.log(this.heroeManager);
    // this.heroeManager.updateRondelState(args.rondels);
    // this.heroeManager.enableRondels();
  }

  private onLeavingHeroePhase() {
    this.heroeManager.resetAll();
  }

  public onUpdateActionButtons(stateName: string, args: any) {
    console.log("onUpdateActionButtons");

    switch (stateName) {
      case gameState.playerSelectHeroes:
        this.statusBar.addActionButton("Confirm Selection", () => {
          const setup = this.setupHeroTableCenter;
          if (!setup.allCardsSelected()) {
            alert("Please select three cards before continue.");
            return;
          }

          const selected = setup.getSelectedCards();
          this.playSelectedHeroes({
            cardA: selected.cardA,
            cardB: selected.cardB,
            cardC: selected.cardC
          });
        });
        break;
      case gameState.giantResolution:
        break;

      default:
        break;
    }

    this.statusBar.addActionButton("debug", () => {
      console.log(this.heroeManager);
      console.log(this.trackManager);
      console.log(this.giantManager);
      // console.log(this.giantManager.placeGiantToken());

      // this.giantTableCenter.addNewCard();
      const actName = "actSelectHeroes";
      // this.bgaPerformAction(actName, {
      //   cardA: '1',
      //   cardB: '5',
      //   cardC: '7'
      // });
    });
  }

  public setupNotifications() {
    this.bgaSetupPromiseNotifications();
  }

  public onTableCardClick(id: number, sector: Sector) {
    console.log("onTableCardClick", sector);
  }

  public onGiantTableCardClick(id: number, sector: TGiantArea, index: number) {
    console.log(id, sector, index, this.gamedatas.gamestate.name);
    switch (this.gamedatas.gamestate.name) {
      case gameState.giantResolution:
        this.playGiantAction(id, sector, index, "actExecuteMandatoryAction");
        break;
      case gameState.giantResolution:
        console.log("aca");
        this.playGiantAction(id, sector, index, "actExecuteOptionalAction");
        break;
      default:
        break;
    }
  }

  public onHeroeActionCardClick(rondel: Rondel, movement: number, newLocation: number) {
    this.playHeroeAction(rondel, movement, newLocation);
  }

  public addCancelButton(rondelClicked: Rondel) {
    const buttonId = "cancel_rondel_selected";

    this.statusBar.addActionButton(buttonId, () => {
      this.heroeManager.resetAll();
      this.heroeManager.setSpecialGiantAction(2);
      this.heroeManager.enableRondels();

      this.statusBar.removeActionButtons();
    });
  }

  // public onCancelSwitchSeleccionClick() {
  //   this.heroeManager.setSpecialGiantAction(args.specialGiantAction);
  //   this.heroeManager.enableRondels();
  // }

  public onSpecialGiantActionClick(rondelsChar: string[], newLocation: number | null, actionType: GiantActionActive) {
    console.log(rondelsChar, newLocation, actionType);

    if (actionType === GiantActionActive.EXCHANGE_RONDEL) {
      this.playSpecialGiantAction(
        {
          rondelChar1: rondelsChar[0],
          rondelChar2: rondelsChar[1]
        },
        "actExecuteSpecialSwitchAction"
      );
    } else {
      this.playSpecialGiantAction(
        {
          rondelChar: rondelsChar[0],
          newLocation: newLocation
        },
        "actExecuteSpecialMoveAction"
      );
    }
  }

  public playSpecialGiantAction(params, actName: string) {
    this.bgaPerformAction(actName, params);
  }

  public playGiantAction(id: number, sector: TGiantArea, index: number, actName: GameAction) {
    console.log(id, sector, index, actName); // 18 'middle' 1
    this.bgaPerformAction(actName, {
      idCard: id,
      sector: sector,
      index: index
    });
  }

  public playSelectedHeroes(payload) {
    // send typeArg value
    this.bgaPerformAction(actName.selectHeroes, {
      cardA: payload.cardA,
      cardB: payload.cardB,
      cardC: payload.cardC
    });
  }

  public playHeroeAction(rondel: Rondel, movement: number, newLocation: number) {
    console.log("playHeroeAction");
    this.bgaPerformAction("actExecuteHeroesAction", {
      rondelChar: rondel.char,
      movement: movement,
      newLocation: newLocation
    });
  }

  public notif_specialActionDone(args: NotifSpecialActionDone) {
    console.log("notif_specialActionDone", args);
    // DRAW NUT NEW POSITIONS
    args.rondels.rondels.forEach((rondel: Rondel) => {
      this.heroeManager.updateRondel(rondel.char, rondel.location, 0);
    });
  }

  public async notif_giantAction(args: NotifGiantActionArgs) {
    console.log("notif_giantAction", args);
    await this.trackManager.updateTokens(args.cityData.track);
  }

  public async notif_heroeAction(args: NotifHeroeActionArgs) {
    console.log("notif_heroeAction", args);
    await this.trackManager.updateTokens(args.track);
    this.heroeManager.updateRondel(args.rondelChar, args.newLocation, args.movement);
  }

  public notif_specialGiantAction(args: NotifSpecialGiantAction) {
    console.log("notif_specialGiantAction", args);
  }

  public notif_verificationPhase(args: NotifVerificationPhase) {
    console.log("notif_verificationPhase", args);
    this.trackManager.updateTokens(args.track);
  }

  public async notif_newGiantCard(args: NotifNewGiantCard) {
    console.log("notif_newGiantCard", args);
    console.log(this.gamedatas.gamestate);
    // this.heroeManager.resetEnableRondels();

    const { giantCards, giantPosition, giantArea } = args.giantData;
    console.log(giantCards);
    await this.giantTableCenter.addNewCard(giantCards[giantCards.length - 1]);
    this.giantManager.updateGiant(giantPosition, giantArea, giantCards);
    this.giantManager.placeGiantToken();
  }

  public notif_heroesSelected(args: NotifHeroesSelected) {
    console.log("notif_heroesSelected", args);

    const setup = this.setupHeroTableCenter;
    setup.destroy();

    document.getElementById("heroe-table-center").dataset.visible = "true";

    this.heroeTableCenter = new HeroeTableCenter(this, args.heroData.heroCards);
    const { rondels, heroCards } = args.heroData;
    this.heroeManager = new HeroeManager(this, heroCards, rondels.rondels, rondels.availableMovements, this.trackManager);
    this.heroeManager.setupRondels();
  }
}
