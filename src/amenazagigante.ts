const LOCAL_STORAGE_ZOOM_KEY = "AmenazaGigante-zoom";

// @ts-ignore
GameGui = (function () {
  // this hack required so we fake extend GameGui
  function GameGui() {}
  return GameGui;
})();

// class AmenazaGigante<AmenazaGiganteGamedatas> extends GameGui {
class AmenazaGigante
  extends GameGui<AmenazaGiganteGamedatas>
  implements AmenazaGiganteGame
{
  public cardsManager: CardsManager;
  public animationManager: AnimationManager;
  public trackManager: TrackManager;
  public heroeManager: HeroeManager;
  public giantManager: GiantManager;
  public gamedatas: AmenazaGiganteGamedatas;
  // @ts-ignore
  private zoomManager: BgaZoom.Manager;
  // private tableCenter: TableCenter;

  private giantTableCenter: GiantTableCenter;
  private heroeTableCenter: HeroeTableCenter;
  private cityTableCenter: CityTableCenter;

  constructor() {
    super();
  }

  public setup(gamedatas: AmenazaGiganteGamedatas): void {
    console.log("Starting game setup 1");
    this.gamedatas = gamedatas;
    console.log(this.gamedatas);

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

    this.cardsManager = new CardsManager(this);
    this.animationManager = new AnimationManager(this);
    this.trackManager = new TrackManager(this);
    this.heroeManager = new HeroeManager(this);
    this.giantManager = new GiantManager(this);

    this.giantTableCenter = new GiantTableCenter(this, this.gamedatas);
    this.heroeTableCenter = new HeroeTableCenter(this, this.gamedatas);
    this.cityTableCenter = new CityTableCenter(this, this.gamedatas);

    this.zoomManager = new BgaZoom.Manager({
      element: document.getElementById("full-table"),
      zoomControls: {
        color: "white",
      },
      zoomLevels: [0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.25, 1.5, 1.75, 2],
      localStorageZoomKey: LOCAL_STORAGE_ZOOM_KEY,
      autoZoom: {
        expectedWidth: 880, // for the lines of cards of the table to fit
        minZoomLevel: 0.5,
      },
    });

    // TEST DELETE
    // this.cardsManager.highlightHeroeActions(this.gamedatas.heroeCards[0]);

    this.trackManager.setupTrack();
    this.heroeManager.setupRondels();
    // this.heroeManager.enableRondels();
    this.setupNotifications();

    console.log("Ending game setup");
  }

  public onEnteringState(stateName: string, args: any) {
    console.log("Entering state: " + stateName, args.args);

    switch (stateName) {
      case "giantMandatoryMove":
        this.onEnteringGiantMandatoryMove(args.args);
        break;
      case "giantPlayerChoice":
        this.onEnteringGiantOptionalMove(args.args);
        break;
        case "giantSpecialAction":
            this.onEnteringGiantSpecialAction(args.args);
            break;
      case "heroPhase":
        this.onEnteringHeroePhase(args.args);
        break;
      default:
        break;
    }
  }

  private onEnteringGiantOptionalMove(args: EnteringGiantOptionalMove) {
    this.giantManager.highlightGiantActions(false);
  }

  private onEnteringHeroePhase(args: EnteringHeroePhase) {
    console.log("onEnteringHeroePhase", args.rondels);
    // TODO actualizar rondeles habilitados
    // this.heroeManager.updateRondelState(args.rondels);
    this.heroeManager.enableRondels();
  }

  private onEnteringGiantMandatoryMove(args: EnteringGiantMandatoryMove) {
    console.log("onEnteringGiantMandatoryMove", args);
    // TODO MOVE TO NOTIF PICK GIANT CARD
    this.giantManager.updateGiant(
      args.giantPosition,
      args.giantArea,
      args.giantCards
    );
    this.giantManager.highlightGiantActions(true);
  }

  private onEnteringGiantSpecialAction(args) {
    console.log('onEnteringGiantSpecialAction');
    this.heroeManager.enableRondels();
  }

  public onLeavingState(stateName: string) {
    switch (stateName) {
      case "giantMandatoryMove":
        this.onLeavingGiantMandatoryMove();
        break;
      case "giantPlayerChoice":
        this.onLeavingGiantOptionalMove();
        break;
      case "giantSpecialAction":
        this.onLeavingGiantSpecialAction();
        break;
      case "heroPhase":
        this.onLeavingHeroePhase();
        break;
      default:
        break;
    }
  }

  private onLeavingGiantSpecialAction() {
    console.log('onLeavingGiantSpecialAction')
  }

  private onLeavingGiantOptionalMove() {
    this.giantManager.resetGiantActions();
  }

  private onLeavingHeroePhase() {
    this.heroeManager.resetAll();
  }

  private onLeavingGiantMandatoryMove() {
    this.giantManager.resetGiantActions();
    this.heroeManager.resetAll();
    // this.cardsManager.removeHighlighedtActions();
  }

  public onUpdateActionButtons(stateName: string, args: any) {
    this.statusBar.addActionButton("debug", () => {
      console.log(this.heroeManager);
      console.log(this.trackManager);
      console.log(this.giantManager);
      // this.giantTableCenter.addNewCard();
    });
  }

  public setupNotifications() {
    this.bgaSetupPromiseNotifications();
  }

  public onTableCardClick(id: number, sector: Sector) {
    console.log("onTableCardClick", sector);
  }

  public onGiantTableCardClick(id: number, sector: Sector, index: number) {
    console.log(id, sector, index, this.gamedatas.gamestate.name);
    switch (this.gamedatas.gamestate.name) {
      case "giantMandatoryMove":
        this.playGiantAction(id, sector, index, "actExecuteMandatoryAction");
        break;
      case "giantPlayerChoice":
        console.log("aca");
        this.playGiantAction(id, sector, index, "actExecuteOptionalAction");
        break;
      default:
        break;
    }
  }

  public onHeroeActionCardClick(
    rondel: Rondel,
    movement: number,
    newLocation: number
  ) {
    this.playHeroeAction(rondel, movement, newLocation);
  }

  public onSpecialGiantActionClick(
    rondels: Rondel[],
    movement: number,
    newLocation: number
  ) {
    console.log(rondels, movement, newLocation);
    const rondelsParam = rondels.map(rondel => rondel.char);
    this.playSpecialGiantAction(rondelsParam, movement, newLocation, "actExecuteSpecialAction")
  }

  public playSpecialGiantAction(
    rondels: string[],
    movement: number,
    newLocation: number,
    actName: GameAction) {
        this.bgaPerformAction(actName, {
            rondels: rondels,
            movement: movement,
            newLocation: newLocation,
          });
  }

  public playGiantAction(
    id: number,
    sector: Sector,
    index: number,
    actName: GameAction
  ) {
    console.log(id, sector, index); // 18 'middle' 1
    this.bgaPerformAction(actName, {
      idCard: id,
      sector: sector as string,
      index: index,
    });
  }

  public playHeroeAction(
    rondel: Rondel,
    movement: number,
    newLocation: number
  ) {
    this.bgaPerformAction("actExecuteHeroesAction", {
      rondelChar: rondel.char,
      movement: movement,
      newLocation: newLocation,
    });
  }

  public notif_giantAction(args: NotifGiantActionArgs) {
    console.log("notif_giantAction", args);
    this.trackManager.updateTokens(args.track);
  }

  public notif_heroeAction(args: NotifHeroeActionArgs) {
    console.log("notif_heroeAction", args);
    this.trackManager.updateTokens(args.track);
    this.heroeManager.updateRondel(
      args.rondelChar,
      args.newLocation,
      args.movement
    );
  }

  public notif_newGiantCard(args: any) {
    console.log("notif_newGiantCard", args);

    // reset movement
    // TODO actualizar rondeles habilitados
    this.heroeManager.resetEnableRondels();

    this.giantTableCenter.addNewCard(
      args.giantCards[args.giantCards.length - 1]
    );
  }
}
