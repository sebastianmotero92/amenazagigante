/**
 * Your game interfaces
 */
type TRondelLocation = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type TRondelMovement = 0 | 1 | 2 | 3;
type TRondelChar = 'A' | 'B' | 'C'

type TGiantPosition = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type TGiantArea = 0 | 1 | 2;
type TGiantAreaName = 'top' | 'middle' | 'bottom';
type TGiantSpecialAction = 1 | 2 | 3;

interface AmenazaGigantePlayer extends Player {}

interface Rondel {
    char: TRondelChar;
    enabled: boolean;
    heroe: number;
    location: TRondelLocation;
    movement: TRondelMovement;
}

interface Rondels {
    rondels: Rondel[];
    availableMovements: TRondelMovement[];
}

interface TrackState {
    cityDestruction: number;
    giantLife: number;
    qualityAttack: number;
    qualityMoral: number;
    qualityRepair: number;
    supplyAmmo: number;
    supplyTools: number;
    supplyTrumpet: number;
}

interface AmenazaGiganteGamedatas extends Gamedatas<AmenazaGigantePlayer> {
    // Add here variables you set up in getAllDatas
    giantCards: GiantCard[];
    heroeCards: HeroeCard[];
    trackState: TrackState;
    rondels: Rondels;

    giantData: GiantData;
    heroData: HeroData;
    cityData: CityData;

    giantPosition: TGiantPosition;
    giantArea: TGiantArea;
}

interface AmenazaGiganteGame extends Game {
    animationManager: AnimationManager;
    cardsManager: CardsManager;
    trackManager: TrackManager;
    heroeManager: HeroeManager;
    gamedatas: AmenazaGiganteGamedatas;

    onTableCardClick: any;
    onGiantTableCardClick: any;
    onHeroeActionCardClick: any
    onSpecialGiantActionClick: any;
    addCancelButton: any
    playSelectedHeroes: any;

    slideToObject: any
    bgaPlayDojoAnimation: any
}

type StateArgsMap = {
    playerSelectHeroes: ArgsHeroSelection;
    giantAdvance: ArgsGiantAdvance;
    giantResolution: ArgsGiantResolution;
    heroesDistribution: ArgsHeroesDistribution;
    heroesActions: ArgsHeroesActions;
    cityVerification: ArgsCityVerification;
};

type AnyStateArgs = StateArgsMap[keyof StateArgsMap];

// ARGS
interface ArgsHeroSelection {
    heroes: { hero_id: number; card_id: number; type: string }[]; // the hero cards from deck
    nbToSelect: number; // 3 heroes to select
    heroCards?: HeroeCard[]; // for compatibility with existing UI
}

interface ArgsGiantAdvance {
    // Arguments for giant advance state
}

interface ArgsGiantResolution {
    action_name: string;
    // Arguments for giant resolution state
}

interface ArgsHeroesDistribution {
    // Arguments for heroes distribution state
}

interface ArgsHeroesActions {
    // Arguments for heroes actions state
}

interface ArgsCityVerification {
    // Arguments for city verification state
}

interface ArgsGiantMandatoryMove {
    giantData: GiantData;
    cityData: CityData;
}

interface GiantData {
    giantPosition: TGiantPosition;
    giantArea: TGiantArea;
    giantCards: GiantCard[];
}

interface HeroData {
    heroCards: HeroeCard[];
    rondels: Rondels;
}

interface CityData {
    track: TrackState
}

interface GameData {
    heroData: HeroData;
    giantData: GiantData;
    cityData: CityData;
}

interface ArgsGiantOptionalMove {
    giantPosition: TGiantPosition;
    giantArea: TGiantArea;
    giantCards: GiantCard[];
    tracks: TrackState;
}

interface ArgsGiantSpecialAction {
    specialGiantAction: TGiantSpecialAction
}

interface ArgsHeroePhase {
    rondels: Rondels;
}

// STATES
type EnteringHeroSelection = ArgsHeroSelection;
type EnteringGiantMandatoryMove = ArgsGiantMandatoryMove;
type EnteringGiantOptionalMove = ArgsGiantOptionalMove;
type EnteringGiantSpecialAction = ArgsGiantSpecialAction;
type EnteringHeroePhase = ArgsHeroePhase;

// NOTIFICATIONS
interface NotifGiantActionArgs {
    track: TrackState
    cityData: CityData;
}

interface NotifSpecialActionDone {
    specialGiantAction: TGiantSpecialAction;
    rondels: Rondels;
}

interface NotifHeroeActionArgs {
    movement: TRondelMovement;
    newLocation: TRondelLocation;
    rondelChar: TRondelChar
    track: TrackState
}

interface NotifSpecialGiantAction {
    specialGiantAction: TGiantSpecialAction
}

interface NotifVerificationPhase {
    track: TrackState
}

interface NotifNewGiantCard {
    heroData: HeroData;
    giantData: GiantData;
    cityData: CityData;
    firstTurn: boolean
}

interface NotifHeroesSelected {
    // track: TrackState;
    // giantCards: GiantCard[];
    heroData: HeroData;
    // rondels: Rondels;
    // giantPosition: TGiantPosition;
    // giantArea: TGiantArea;
}
