

class HeroeManager {
    private heroes: TrackState;

    constructor(public game: AmenazaGiganteGame, trackState: TrackState) {
        this.trackState = trackState;
    }

    // public setupTrack() {
    //     for (const track in this.trackState) {
    //         console.log("track", track, this.trackState[track]);
    //         this.printTokenOnBoard(
    //           mapTokenId[`token-${track}`],
    //           `${mapTrackId[track]}${this.trackState[track]}`
    //         );
    //       }
    // }

    // private async printTokenOnBoard (origId, destId) {
    //     const token = document.getElementById(origId);
    //     const target = document.getElementById(destId);

    //     token.style.position = 'absolute';
    //     token.style.left = '0px';
    //     token.style.top = '0px';

    //     console.log(this.game.bgaPlayDojoAnimation)
    //     const anim = this.game.slideToObject(token.id, target.id);
    //     await this.game.bgaPlayDojoAnimation(anim);

    //     target.appendChild(token);
    //     token.style.position = ''; // remove absolute positioning
    // }
}