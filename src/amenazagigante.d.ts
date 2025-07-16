/**
 * Your game interfaces
 */

interface AmenazaGigantePlayer extends Player {
//     cards: Card[];
}

interface Rondel {
    char: 'A' | 'B' | 'C';
    enabled: boolean;
    heroe: number;
    id: number;
    location: number;
    movement: number;
}

interface Rondels {
    rondels: Rondel[];
    availableMovements: number[];
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

    giantPosition: number;
    giantArea: string;
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

    slideToObject: any
    bgaPlayDojoAnimation: any
}

// STATES
interface EnteringGiantMandatoryMove {
    giantArea: string;
    giantCards: GiantCard[];
    giantPosition: number;
    tracks: any;
}

interface EnteringGiantOptionalMove {
    giantArea: string;
    giantCards: GiantCard[];
    giantPosition: number;
    tracks: any;
}

interface EnteringHeroePhase {
    // rondels: Rondel[];
    rondels: Rondels;
}

// NOTIFICATIONS
interface NotifGiantActionArgs {
    track: TrackState
}

interface NotifHeroeActionArgs {
    movement: number;
    newLocation: number;
    rondelChar: 'A' | 'B' | 'C'
    track: TrackState
}