enum TRACK {
  GIANT_LIFE = "giant-life",
  QUALITY_ATTACK = "quality-attack-track",
  QUALITY_REPAIR = "quality-repair-track",
  QUALITY_MORAL = "quality-moral-track",
  SUPPLY_AMMO = "supply-ammo-track",
  SUPPLY_TOOLS = "supply-tools-track",
  SUPPLY_TRUMPET = "supply-trumpet-track",
  CITY_DESTRUCTION = "city-destruction-track",
}

enum TRACK_ID {
  GIANT_LIFE = "life",
  QUALITY_ATTACK = "attack",
  QUALITY_REPAIR = "repair",
  QUALITY_MORAL = "moral",
  SUPPLY_AMMO = "ammo",
  SUPPLY_TOOLS = "tools",
  SUPPLY_TRUMPET = "trumpet",
  CITY_DESTRUCTION = "destruction",
}

enum TOKEN {
  LIFE = "token-life",
  ATTACK = "token-attack",
  REPAIR = "token-repair",
  MORAL = "token-moral",
  AMMO = "token-ammo",
  TOOLS = "token-tools",
  TRUMPET = "token-trumpet",
  DESTRUCTION = "token-destruction",
}

type TrackParam =
  | "giantLife"
  | "qualityAttack"
  | "qualityRepair"
  | "qualityMoral"
  | "supplyAmmo"
  | "supplyTools"
  | "supplyTrumpet"
  | "cityDestruction";

const mapTokenId = {
  ["token-giantLife"]: TOKEN.LIFE,
  ["token-qualityAttack"]: TOKEN.ATTACK,
  ["token-qualityRepair"]: TOKEN.REPAIR,
  ["token-qualityMoral"]: TOKEN.MORAL,
  ["token-supplyAmmo"]: TOKEN.AMMO,
  ["token-supplyTools"]: TOKEN.TOOLS,
  ["token-supplyTrumpet"]: TOKEN.TRUMPET,
  ["token-cityDestruction"]: TOKEN.DESTRUCTION,
};

const mapTrackId = {
  ["giantLife"]: TRACK_ID.GIANT_LIFE,
  ["qualityAttack"]: TRACK_ID.QUALITY_ATTACK,
  ["qualityRepair"]: TRACK_ID.QUALITY_REPAIR,
  ["qualityMoral"]: TRACK_ID.QUALITY_MORAL,
  ["supplyAmmo"]: TRACK_ID.SUPPLY_AMMO,
  ["supplyTools"]: TRACK_ID.SUPPLY_TOOLS,
  ["supplyTrumpet"]: TRACK_ID.SUPPLY_TRUMPET,
  ["cityDestruction"]: TRACK_ID.CITY_DESTRUCTION,
};

class TrackManager {
  private trackState: TrackState;

  constructor(public game: AmenazaGiganteGame) {
    this.trackState = game.gamedatas.trackState;
  }

  public setupTrack() {
    for (const track in this.trackState) {
      console.log("track", track, this.trackState[track]);
      this.printTokenOnBoard(
        this.getTokenIdForTrack(track as TrackParam),
        this.getTargetPositionIdForTrack(track as TrackParam)
      );
    }
  }

  private moveToken(track: TrackParam, newPosition: number) {
    this.updateTrackValue(track, newPosition);
    this.printTokenOnBoard(
      this.getTokenIdForTrack(track),
      this.getTargetPositionIdForTrack(track)
    );
  }

  public updateTokens(tracks: TrackState) {
    for (const track in tracks) {
        console.log(tracks[track])
        console.log(this.trackState[track])
        if (tracks[track] !== this.trackState[track]) {
            console.log('cambio ' + tracks[track])
            this.moveToken(track as TrackParam, tracks[track]);
        }
    }
  }

  public getTracks() {
    return this.trackState;
  }

  private updateTrackValue(track: TrackParam, newPosition: number) {
    this.trackState[track] = newPosition
  }

  /**
   * Returns the DOM ID of the token associated with a specific track.
   * Example: for 'life', returns 'token-life'.
   *
   * @param track - The name of the track (e.g., 'giantLife', 'qualityAttack', etc.)
   * @returns The DOM ID of the corresponding token element.
   */
  private getTokenIdForTrack(track: TrackParam) {
    // giantLife -> token-life
    return mapTokenId[`token-${track}`];
  }

  /**
   * Returns the DOM ID of the position element where the token should be placed
   * based on the current value of the given track.
   * Example: for track 'life' at position 2, returns 'life2'.
   *
   * @param track - The name of the track (e.g., 'life').
   * @returns The DOM ID of the target element (e.g., 'life2', etc.)
   */
  private getTargetPositionIdForTrack(track: TrackParam) {
    // giantLife -> life2
    return `${mapTrackId[track]}${this.trackState[track]}`;
  }

  private async printTokenOnBoard(origId, destId) {
    const token = document.getElementById(origId);
    const target = document.getElementById(destId);

    token.style.position = "absolute";
    token.style.left = "0px";
    token.style.top = "0px";

    console.log(this.game.bgaPlayDojoAnimation);
    const anim = this.game.slideToObject(token.id, target.id);
    await this.game.bgaPlayDojoAnimation(anim);

    target.appendChild(token);
    token.style.position = ""; // remove absolute positioning
  }
}
