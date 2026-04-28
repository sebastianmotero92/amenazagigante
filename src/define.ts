// declare const getLibUrl: Function;

define([
    "dojo","dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    getLibUrl('bga-zoom', '1.0.0'),
    getLibUrl('bga-score-sheet', '1.0.0'),
],
function (dojo, declare, gamegui, counter, BgaZoom, BgaScoreSheet) {
    (window as any).BgaZoom = BgaZoom;
    (window as any).BgaScoreSheet = BgaScoreSheet;
    return declare("bgagame.amenazagigante", ebg.core.gamegui, new AmenazaGigante());
});