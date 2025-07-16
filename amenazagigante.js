var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var LOCAL_STORAGE_ZOOM_KEY = "AmenazaGigante-zoom";
// @ts-ignore
GameGui = (function () {
    // this hack required so we fake extend GameGui
    function GameGui() { }
    return GameGui;
})();
// class AmenazaGigante<AmenazaGiganteGamedatas> extends GameGui {
var AmenazaGigante = /** @class */ (function (_super) {
    __extends(AmenazaGigante, _super);
    function AmenazaGigante() {
        return _super.call(this) || this;
    }
    AmenazaGigante.prototype.setup = function (gamedatas) {
        console.log("Starting game setup 1");
        this.gamedatas = gamedatas;
        console.log(this.gamedatas);
        this.getGameAreaElement().insertAdjacentHTML("beforeend", "\n            <div id=\"full-table\">\n                <div id=\"centered-table\">\n                    <div id=\"giant-table-center\">\n                        <div id=\"giant-table-row\"></div>\n                    </div>\n                    <div id=\"heroe-table-center\">\n                        <div id=\"heroe-table-row\"></div>\n                    </div>\n                    <div id=\"city-table-center\">\n                        <div id=\"city-table-row\"></div>\n                    </div>\n                </div>\n            </div>\n        ");
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
    };
    AmenazaGigante.prototype.onEnteringState = function (stateName, args) {
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
    };
    AmenazaGigante.prototype.onEnteringGiantOptionalMove = function (args) {
        this.giantManager.highlightGiantActions(false);
    };
    AmenazaGigante.prototype.onEnteringHeroePhase = function (args) {
        console.log("onEnteringHeroePhase", args.rondels);
        // TODO actualizar rondeles habilitados
        // this.heroeManager.updateRondelState(args.rondels);
        this.heroeManager.enableRondels();
    };
    AmenazaGigante.prototype.onEnteringGiantMandatoryMove = function (args) {
        console.log("onEnteringGiantMandatoryMove", args);
        // TODO MOVE TO NOTIF PICK GIANT CARD
        this.giantManager.updateGiant(args.giantPosition, args.giantArea, args.giantCards);
        this.giantManager.highlightGiantActions(true);
    };
    AmenazaGigante.prototype.onEnteringGiantSpecialAction = function (args) {
        console.log('onEnteringGiantSpecialAction');
        this.heroeManager.enableRondels();
    };
    AmenazaGigante.prototype.onLeavingState = function (stateName) {
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
    };
    AmenazaGigante.prototype.onLeavingGiantSpecialAction = function () {
        console.log('onLeavingGiantSpecialAction');
    };
    AmenazaGigante.prototype.onLeavingGiantOptionalMove = function () {
        this.giantManager.resetGiantActions();
    };
    AmenazaGigante.prototype.onLeavingHeroePhase = function () {
        this.heroeManager.resetAll();
    };
    AmenazaGigante.prototype.onLeavingGiantMandatoryMove = function () {
        this.giantManager.resetGiantActions();
        this.heroeManager.resetAll();
        // this.cardsManager.removeHighlighedtActions();
    };
    AmenazaGigante.prototype.onUpdateActionButtons = function (stateName, args) {
        var _this = this;
        this.statusBar.addActionButton("debug", function () {
            console.log(_this.heroeManager);
            console.log(_this.trackManager);
            console.log(_this.giantManager);
            // this.giantTableCenter.addNewCard();
        });
    };
    AmenazaGigante.prototype.setupNotifications = function () {
        this.bgaSetupPromiseNotifications();
    };
    AmenazaGigante.prototype.onTableCardClick = function (id, sector) {
        console.log("onTableCardClick", sector);
    };
    AmenazaGigante.prototype.onGiantTableCardClick = function (id, sector, index) {
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
    };
    AmenazaGigante.prototype.onHeroeActionCardClick = function (rondel, movement, newLocation) {
        this.playHeroeAction(rondel, movement, newLocation);
    };
    AmenazaGigante.prototype.onSpecialGiantActionClick = function (rondels, movement, newLocation) {
        console.log(rondels, movement, newLocation);
        var rondelsParam = rondels.map(function (rondel) { return rondel.char; });
        this.playSpecialGiantAction(rondelsParam, movement, newLocation, "actExecuteSpecialAction");
    };
    AmenazaGigante.prototype.playSpecialGiantAction = function (rondels, movement, newLocation, actName) {
        this.bgaPerformAction(actName, {
            rondels: rondels,
            movement: movement,
            newLocation: newLocation,
        });
    };
    AmenazaGigante.prototype.playGiantAction = function (id, sector, index, actName) {
        console.log(id, sector, index); // 18 'middle' 1
        this.bgaPerformAction(actName, {
            idCard: id,
            sector: sector,
            index: index,
        });
    };
    AmenazaGigante.prototype.playHeroeAction = function (rondel, movement, newLocation) {
        this.bgaPerformAction("actExecuteHeroesAction", {
            rondelChar: rondel.char,
            movement: movement,
            newLocation: newLocation,
        });
    };
    AmenazaGigante.prototype.notif_giantAction = function (args) {
        console.log("notif_giantAction", args);
        this.trackManager.updateTokens(args.track);
    };
    AmenazaGigante.prototype.notif_heroeAction = function (args) {
        console.log("notif_heroeAction", args);
        this.trackManager.updateTokens(args.track);
        this.heroeManager.updateRondel(args.rondelChar, args.newLocation, args.movement);
    };
    AmenazaGigante.prototype.notif_newGiantCard = function (args) {
        console.log("notif_newGiantCard", args);
        // reset movement
        // TODO actualizar rondeles habilitados
        this.heroeManager.resetEnableRondels();
        this.giantTableCenter.addNewCard(args.giantCards[args.giantCards.length - 1]);
    };
    return AmenazaGigante;
}(GameGui));
// declare const getLibUrl: Function;
define([
    "dojo", "dojo/_base/declare",
    "ebg/core/gamegui",
    "ebg/counter",
    getLibUrl('bga-zoom', '1.0.0'),
    getLibUrl('bga-score-sheet', '1.0.0'),
], function (dojo, declare, gamegui, counter, BgaZoom, BgaScoreSheet) {
    window.BgaZoom = BgaZoom;
    window.BgaScoreSheet = BgaScoreSheet;
    return declare("bgagame.amenazagigante", ebg.core.gamegui, new AmenazaGigante());
});
var BgaAnimation = /** @class */ (function () {
    function BgaAnimation(animationFunction, settings) {
        this.animationFunction = animationFunction;
        this.settings = settings;
        this.played = null;
        this.result = null;
        this.playWhenNoAnimation = false;
    }
    return BgaAnimation;
}());
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function attachWithAnimation(animationManager, animation) {
    var _a;
    var settings = animation.settings;
    var element = settings.animation.settings.element;
    var fromRect = element.getBoundingClientRect();
    settings.animation.settings.fromRect = fromRect;
    settings.attachElement.appendChild(element);
    (_a = settings.afterAttach) === null || _a === void 0 ? void 0 : _a.call(settings, element, settings.attachElement);
    return animationManager.play(settings.animation);
}
var BgaAttachWithAnimation = /** @class */ (function (_super) {
    __extends(BgaAttachWithAnimation, _super);
    function BgaAttachWithAnimation(settings) {
        var _this = _super.call(this, attachWithAnimation, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaAttachWithAnimation;
}(BgaAnimation));
/**
 * Just use playSequence from animationManager
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function cumulatedAnimations(animationManager, animation) {
    return animationManager.playSequence(animation.settings.animations);
}
var BgaCumulatedAnimation = /** @class */ (function (_super) {
    __extends(BgaCumulatedAnimation, _super);
    function BgaCumulatedAnimation(settings) {
        var _this = _super.call(this, cumulatedAnimations, settings) || this;
        _this.playWhenNoAnimation = true;
        return _this;
    }
    return BgaCumulatedAnimation;
}(BgaAnimation));
/**
 * Just does nothing for the duration
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function pauseAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a;
        var settings = animation.settings;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        setTimeout(function () { return success(); }, duration);
    });
    return promise;
}
var BgaPauseAnimation = /** @class */ (function (_super) {
    __extends(BgaPauseAnimation, _super);
    function BgaPauseAnimation(settings) {
        return _super.call(this, pauseAnimation, settings) || this;
    }
    return BgaPauseAnimation;
}(BgaAnimation));
/**
 * Show the element at the center of the screen
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function showScreenCenterAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d;
        var settings = animation.settings;
        var element = settings.element;
        var elementBR = element.getBoundingClientRect();
        var xCenter = (elementBR.left + elementBR.right) / 2;
        var yCenter = (elementBR.top + elementBR.bottom) / 2;
        var x = xCenter - (window.innerWidth / 2);
        var y = yCenter - (window.innerHeight / 2);
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaShowScreenCenterAnimation = /** @class */ (function (_super) {
    __extends(BgaShowScreenCenterAnimation, _super);
    function BgaShowScreenCenterAnimation(settings) {
        return _super.call(this, showScreenCenterAnimation, settings) || this;
    }
    return BgaShowScreenCenterAnimation;
}(BgaAnimation));
/**
 * Slide of the element from origin to destination.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        element.style.transition = null;
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg)");
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionCancel);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = (_e = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _e !== void 0 ? _e : null;
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideAnimation, _super);
    function BgaSlideAnimation(settings) {
        return _super.call(this, slideAnimation, settings) || this;
    }
    return BgaSlideAnimation;
}(BgaAnimation));
/**
 * Slide of the element from destination to origin.
 *
 * @param animationManager the animation manager
 * @param animation a `BgaAnimation` object
 * @returns a promise when animation ends
 */
function slideToAnimation(animationManager, animation) {
    var promise = new Promise(function (success) {
        var _a, _b, _c, _d, _e;
        var settings = animation.settings;
        var element = settings.element;
        var _f = getDeltaCoordinates(element, settings), x = _f.x, y = _f.y;
        var duration = (_a = settings === null || settings === void 0 ? void 0 : settings.duration) !== null && _a !== void 0 ? _a : 500;
        var originalZIndex = element.style.zIndex;
        var originalTransition = element.style.transition;
        var transitionTimingFunction = (_b = settings.transitionTimingFunction) !== null && _b !== void 0 ? _b : 'linear';
        element.style.zIndex = "".concat((_c = settings === null || settings === void 0 ? void 0 : settings.zIndex) !== null && _c !== void 0 ? _c : 10);
        var timeoutId = null;
        var cleanOnTransitionEnd = function () {
            element.style.zIndex = originalZIndex;
            element.style.transition = originalTransition;
            success();
            element.removeEventListener('transitioncancel', cleanOnTransitionEnd);
            element.removeEventListener('transitionend', cleanOnTransitionEnd);
            document.removeEventListener('visibilitychange', cleanOnTransitionEnd);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
        var cleanOnTransitionCancel = function () {
            var _a;
            element.style.transition = "";
            element.offsetHeight;
            element.style.transform = (_a = settings === null || settings === void 0 ? void 0 : settings.finalTransform) !== null && _a !== void 0 ? _a : null;
            element.offsetHeight;
            cleanOnTransitionEnd();
        };
        element.addEventListener('transitioncancel', cleanOnTransitionEnd);
        element.addEventListener('transitionend', cleanOnTransitionEnd);
        document.addEventListener('visibilitychange', cleanOnTransitionCancel);
        element.offsetHeight;
        element.style.transition = "transform ".concat(duration, "ms ").concat(transitionTimingFunction);
        element.offsetHeight;
        element.style.transform = "translate(".concat(-x, "px, ").concat(-y, "px) rotate(").concat((_d = settings === null || settings === void 0 ? void 0 : settings.rotationDelta) !== null && _d !== void 0 ? _d : 0, "deg) scale(").concat((_e = settings.scale) !== null && _e !== void 0 ? _e : 1, ")");
        // safety in case transitionend and transitioncancel are not called
        timeoutId = setTimeout(cleanOnTransitionEnd, duration + 100);
    });
    return promise;
}
var BgaSlideToAnimation = /** @class */ (function (_super) {
    __extends(BgaSlideToAnimation, _super);
    function BgaSlideToAnimation(settings) {
        return _super.call(this, slideToAnimation, settings) || this;
    }
    return BgaSlideToAnimation;
}(BgaAnimation));
function shouldAnimate(settings) {
    var _a;
    return document.visibilityState !== 'hidden' && !((_a = settings === null || settings === void 0 ? void 0 : settings.game) === null || _a === void 0 ? void 0 : _a.instantaneousMode);
}
/**
 * Return the x and y delta, based on the animation settings;
 *
 * @param settings an `AnimationSettings` object
 * @returns a promise when animation ends
 */
function getDeltaCoordinates(element, settings) {
    var _a;
    if (!settings.fromDelta && !settings.fromRect && !settings.fromElement) {
        throw new Error("[bga-animation] fromDelta, fromRect or fromElement need to be set");
    }
    var x = 0;
    var y = 0;
    if (settings.fromDelta) {
        x = settings.fromDelta.x;
        y = settings.fromDelta.y;
    }
    else {
        var originBR = (_a = settings.fromRect) !== null && _a !== void 0 ? _a : settings.fromElement.getBoundingClientRect();
        // TODO make it an option ?
        var originalTransform = element.style.transform;
        element.style.transform = '';
        var destinationBR = element.getBoundingClientRect();
        element.style.transform = originalTransform;
        x = (destinationBR.left + destinationBR.right) / 2 - (originBR.left + originBR.right) / 2;
        y = (destinationBR.top + destinationBR.bottom) / 2 - (originBR.top + originBR.bottom) / 2;
    }
    if (settings.scale) {
        x /= settings.scale;
        y /= settings.scale;
    }
    return { x: x, y: y };
}
function logAnimation(animationManager, animation) {
    var settings = animation.settings;
    var element = settings.element;
    if (element) {
        console.log(animation, settings, element, element.getBoundingClientRect(), element.style.transform);
    }
    else {
        console.log(animation, settings);
    }
    return Promise.resolve(false);
}
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var AnimationManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `AnimationManagerSettings` object
     */
    function AnimationManager(game, settings) {
        this.game = game;
        this.settings = settings;
        this.zoomManager = settings === null || settings === void 0 ? void 0 : settings.zoomManager;
        if (!game) {
            throw new Error('You must set your game as the first parameter of AnimationManager');
        }
    }
    AnimationManager.prototype.getZoomManager = function () {
        return this.zoomManager;
    };
    /**
     * Set the zoom manager, to get the scale of the current game.
     *
     * @param zoomManager the zoom manager
     */
    AnimationManager.prototype.setZoomManager = function (zoomManager) {
        this.zoomManager = zoomManager;
    };
    AnimationManager.prototype.getSettings = function () {
        return this.settings;
    };
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    AnimationManager.prototype.animationsActive = function () {
        return document.visibilityState !== 'hidden' && !this.game.instantaneousMode;
    };
    /**
     * Plays an animation if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @param animation the animation to play
     * @returns the animation promise.
     */
    AnimationManager.prototype.play = function (animation) {
        return __awaiter(this, void 0, void 0, function () {
            var settings, _a;
            var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        animation.played = animation.playWhenNoAnimation || this.animationsActive();
                        if (!animation.played) return [3 /*break*/, 2];
                        settings = animation.settings;
                        (_b = settings.animationStart) === null || _b === void 0 ? void 0 : _b.call(settings, animation);
                        (_c = settings.element) === null || _c === void 0 ? void 0 : _c.classList.add((_d = settings.animationClass) !== null && _d !== void 0 ? _d : 'bga-animations_animated');
                        animation.settings = __assign({ duration: (_h = (_f = (_e = animation.settings) === null || _e === void 0 ? void 0 : _e.duration) !== null && _f !== void 0 ? _f : (_g = this.settings) === null || _g === void 0 ? void 0 : _g.duration) !== null && _h !== void 0 ? _h : 500, scale: (_m = (_k = (_j = animation.settings) === null || _j === void 0 ? void 0 : _j.scale) !== null && _k !== void 0 ? _k : (_l = this.zoomManager) === null || _l === void 0 ? void 0 : _l.zoom) !== null && _m !== void 0 ? _m : undefined }, animation.settings);
                        _a = animation;
                        return [4 /*yield*/, animation.animationFunction(this, animation)];
                    case 1:
                        _a.result = _s.sent();
                        (_p = (_o = animation.settings).animationEnd) === null || _p === void 0 ? void 0 : _p.call(_o, animation);
                        (_q = settings.element) === null || _q === void 0 ? void 0 : _q.classList.remove((_r = settings.animationClass) !== null && _r !== void 0 ? _r : 'bga-animations_animated');
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, Promise.resolve(animation)];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Plays multiple animations in parallel.
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playParallel = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.all(animations.map(function (animation) { return _this.play(animation); }))];
            });
        });
    };
    /**
     * Plays multiple animations in sequence (the second when the first ends, ...).
     *
     * @param animations the animations to play
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playSequence = function (animations) {
        return __awaiter(this, void 0, void 0, function () {
            var result, others;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!animations.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.play(animations[0])];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.playSequence(animations.slice(1))];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, __spreadArray([result], others, true)];
                    case 3: return [2 /*return*/, Promise.resolve([])];
                }
            });
        });
    };
    /**
     * Plays multiple animations with a delay between each animation start.
     *
     * @param animations the animations to play
     * @param delay the delay (in ms)
     * @returns a promise for all animations.
     */
    AnimationManager.prototype.playWithDelay = function (animations, delay) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _this = this;
            return __generator(this, function (_a) {
                promise = new Promise(function (success) {
                    var promises = [];
                    var _loop_1 = function (i) {
                        setTimeout(function () {
                            promises.push(_this.play(animations[i]));
                            if (i == animations.length - 1) {
                                Promise.all(promises).then(function (result) {
                                    success(result);
                                });
                            }
                        }, i * delay);
                    };
                    for (var i = 0; i < animations.length; i++) {
                        _loop_1(i);
                    }
                });
                return [2 /*return*/, promise];
            });
        });
    };
    /**
     * Attach an element to a parent, then play animation from element's origin to its new position.
     *
     * @param animation the animation function
     * @param attachElement the destination parent
     * @returns a promise when animation ends
     */
    AnimationManager.prototype.attachWithAnimation = function (animation, attachElement) {
        var attachWithAnimation = new BgaAttachWithAnimation({
            animation: animation,
            attachElement: attachElement
        });
        return this.play(attachWithAnimation);
    };
    return AnimationManager;
}());
/**
 * The abstract stock. It shouldn't be used directly, use stocks that extends it.
 */
var CardStock = /** @class */ (function () {
    /**
     * Creates the stock and register it on the manager.
     *
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function CardStock(manager, element, settings) {
        this.manager = manager;
        this.element = element;
        this.settings = settings;
        this.cards = [];
        this.selectedCards = [];
        this.selectionMode = 'none';
        manager.addStock(this);
        element === null || element === void 0 ? void 0 : element.classList.add('card-stock' /*, this.constructor.name.split(/(?=[A-Z])/).join('-').toLowerCase()* doesn't work in production because of minification */);
        this.bindClick();
        this.sort = settings === null || settings === void 0 ? void 0 : settings.sort;
    }
    /**
     * Removes the stock and unregister it on the manager.
     */
    CardStock.prototype.remove = function () {
        var _a;
        this.manager.removeStock(this);
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.remove();
    };
    /**
     * @returns the cards on the stock
     */
    CardStock.prototype.getCards = function () {
        return this.cards.slice();
    };
    /**
     * @returns if the stock is empty
     */
    CardStock.prototype.isEmpty = function () {
        return !this.cards.length;
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.getSelection = function () {
        return this.selectedCards.slice();
    };
    /**
     * @returns the selected cards
     */
    CardStock.prototype.isSelected = function (card) {
        var _this = this;
        return this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card
     * @returns if the card is present in the stock
     */
    CardStock.prototype.contains = function (card) {
        var _this = this;
        return this.cards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
    };
    /**
     * @param card a card in the stock
     * @returns the HTML element generated for the card
     */
    CardStock.prototype.getCardElement = function (card) {
        return this.manager.getCardElement(card);
    };
    /**
     * Checks if the card can be added. By default, only if it isn't already present in the stock.
     *
     * @param card the card to add
     * @param settings the addCard settings
     * @returns if the card can be added
     */
    CardStock.prototype.canAddCard = function (card, settings) {
        return !this.contains(card);
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    CardStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e;
        if (!this.canAddCard(card, settings)) {
            return Promise.resolve(false);
        }
        var promise;
        // we check if card is in a stock
        var originStock = this.manager.getCardStock(card);
        var index = this.getNewCardIndex(card);
        var settingsWithIndex = __assign({ index: index }, (settings !== null && settings !== void 0 ? settings : {}));
        var updateInformations = (_a = settingsWithIndex.updateInformations) !== null && _a !== void 0 ? _a : true;
        var needsCreation = true;
        if (originStock === null || originStock === void 0 ? void 0 : originStock.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, __assign(__assign({}, animation), { fromStock: originStock }), settingsWithIndex);
                needsCreation = false;
                if (!updateInformations) {
                    element.dataset.side = ((_b = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _b !== void 0 ? _b : this.manager.isCardVisible(card)) ? 'front' : 'back';
                }
            }
        }
        else if ((_c = animation === null || animation === void 0 ? void 0 : animation.fromStock) === null || _c === void 0 ? void 0 : _c.contains(card)) {
            var element = this.getCardElement(card);
            if (element) {
                promise = this.moveFromOtherStock(card, element, animation, settingsWithIndex);
                needsCreation = false;
            }
        }
        if (needsCreation) {
            var element = this.getCardElement(card);
            if (needsCreation && element) {
                console.warn("Card ".concat(this.manager.getId(card), " already exists, not re-created."));
            }
            // if the card comes from a stock but is not found in this stock, the card is probably hudden (deck with a fake top card)
            var fromBackSide = !(settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) && !(animation === null || animation === void 0 ? void 0 : animation.originalSide) && (animation === null || animation === void 0 ? void 0 : animation.fromStock) && !((_d = animation === null || animation === void 0 ? void 0 : animation.fromStock) === null || _d === void 0 ? void 0 : _d.contains(card));
            var createdVisible = fromBackSide ? false : (_e = settingsWithIndex === null || settingsWithIndex === void 0 ? void 0 : settingsWithIndex.visible) !== null && _e !== void 0 ? _e : this.manager.isCardVisible(card);
            var newElement = element !== null && element !== void 0 ? element : this.manager.createCardElement(card, createdVisible);
            promise = this.moveFromElement(card, newElement, animation, settingsWithIndex);
        }
        if (settingsWithIndex.index !== null && settingsWithIndex.index !== undefined) {
            this.cards.splice(index, 0, card);
        }
        else {
            this.cards.push(card);
        }
        if (updateInformations) { // after splice/push
            this.manager.updateCardInformations(card);
        }
        if (!promise) {
            console.warn("CardStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if (this.selectionMode !== 'none') {
            // make selectable only at the end of the animation
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settingsWithIndex.selectable) !== null && _a !== void 0 ? _a : true); });
        }
        return promise;
    };
    CardStock.prototype.getNewCardIndex = function (card) {
        if (this.sort) {
            var otherCards = this.getCards();
            for (var i = 0; i < otherCards.length; i++) {
                var otherCard = otherCards[i];
                if (this.sort(card, otherCard) < 0) {
                    return i;
                }
            }
            return otherCards.length;
        }
        else {
            return undefined;
        }
    };
    CardStock.prototype.addCardElementToParent = function (cardElement, settings) {
        var _a;
        var parent = (_a = settings === null || settings === void 0 ? void 0 : settings.forceToElement) !== null && _a !== void 0 ? _a : this.element;
        if ((settings === null || settings === void 0 ? void 0 : settings.index) === null || (settings === null || settings === void 0 ? void 0 : settings.index) === undefined || !parent.children.length || (settings === null || settings === void 0 ? void 0 : settings.index) >= parent.children.length) {
            parent.appendChild(cardElement);
        }
        else {
            parent.insertBefore(cardElement, parent.children[settings.index]);
        }
    };
    CardStock.prototype.moveFromOtherStock = function (card, cardElement, animation, settings) {
        var promise;
        var element = animation.fromStock.contains(card) ? this.manager.getCardElement(card) : animation.fromStock.element;
        var fromRect = element === null || element === void 0 ? void 0 : element.getBoundingClientRect();
        this.addCardElementToParent(cardElement, settings);
        this.removeSelectionClassesFromElement(cardElement);
        promise = fromRect ? this.animationFromElement(cardElement, fromRect, {
            originalSide: animation.originalSide,
            rotationDelta: animation.rotationDelta,
            animation: animation.animation,
        }) : Promise.resolve(false);
        // in the case the card was move inside the same stock we don't remove it
        if (animation.fromStock && animation.fromStock != this) {
            animation.fromStock.removeCard(card);
        }
        if (!promise) {
            console.warn("CardStock.moveFromOtherStock didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    CardStock.prototype.moveFromElement = function (card, cardElement, animation, settings) {
        var promise;
        this.addCardElementToParent(cardElement, settings);
        if (animation) {
            if (animation.fromStock) {
                promise = this.animationFromElement(cardElement, animation.fromStock.element.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
                animation.fromStock.removeCard(card);
            }
            else if (animation.fromElement) {
                promise = this.animationFromElement(cardElement, animation.fromElement.getBoundingClientRect(), {
                    originalSide: animation.originalSide,
                    rotationDelta: animation.rotationDelta,
                    animation: animation.animation,
                });
            }
        }
        else {
            promise = Promise.resolve(false);
        }
        if (!promise) {
            console.warn("CardStock.moveFromElement didn't return a Promise");
            promise = Promise.resolve(false);
        }
        return promise;
    };
    /**
     * Add an array of cards to the stock.
     *
     * @param cards the cards to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardSettings` object
     * @param shift if number, the number of milliseconds between each card. if true, chain animations
     */
    CardStock.prototype.addCards = function (cards_1, animation_1, settings_1) {
        return __awaiter(this, arguments, void 0, function (cards, animation, settings, shift) {
            var promises, result, others, _loop_2, i, results;
            var _this = this;
            if (shift === void 0) { shift = false; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.manager.animationsActive()) {
                            shift = false;
                        }
                        promises = [];
                        if (!(shift === true)) return [3 /*break*/, 4];
                        if (!cards.length) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.addCard(cards[0], animation, settings)];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, this.addCards(cards.slice(1), animation, settings, shift)];
                    case 2:
                        others = _a.sent();
                        return [2 /*return*/, result || others];
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        if (typeof shift === 'number') {
                            _loop_2 = function (i) {
                                promises.push(new Promise(function (resolve) {
                                    setTimeout(function () { return _this.addCard(cards[i], animation, settings).then(function (result) { return resolve(result); }); }, i * shift);
                                }));
                            };
                            for (i = 0; i < cards.length; i++) {
                                _loop_2(i);
                            }
                        }
                        else {
                            promises = cards.map(function (card) { return _this.addCard(card, animation, settings); });
                        }
                        _a.label = 5;
                    case 5: return [4 /*yield*/, Promise.all(promises)];
                    case 6:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove a card from the stock.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCard = function (card, settings) {
        var promise;
        if (this.contains(card) && this.element.contains(this.getCardElement(card))) {
            promise = this.manager.removeCard(card, settings);
        }
        else {
            promise = Promise.resolve(false);
        }
        this.cardRemoved(card, settings);
        return promise;
    };
    /**
     * Notify the stock that a card is removed.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.cardRemoved = function (card, settings) {
        var _this = this;
        var index = this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
        if (this.selectedCards.find(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); })) {
            this.unselectCard(card);
        }
    };
    /**
     * Remove a set of card from the stock.
     *
     * @param cards the cards to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeCards = function (cards, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var promises, results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = cards.map(function (card) { return _this.removeCard(card, settings); });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.some(function (result) { return result; })];
                }
            });
        });
    };
    /**
     * Remove all cards from the stock.
     * @param settings a `RemoveCardSettings` object
     */
    CardStock.prototype.removeAll = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var cards;
            return __generator(this, function (_a) {
                cards = this.getCards();
                return [2 /*return*/, this.removeCards(cards, settings)];
            });
        });
    };
    /**
     * Set if the stock is selectable, and if yes if it can be multiple.
     * If set to 'none', it will unselect all selected cards.
     *
     * @param selectionMode the selection mode
     * @param selectableCards the selectable cards (all if unset). Calls `setSelectableCards` method
     */
    CardStock.prototype.setSelectionMode = function (selectionMode, selectableCards) {
        var _this = this;
        if (selectionMode !== this.selectionMode) {
            this.unselectAll(true);
        }
        this.cards.forEach(function (card) { return _this.setSelectableCard(card, selectionMode != 'none'); });
        this.element.classList.toggle('bga-cards_selectable-stock', selectionMode != 'none');
        this.selectionMode = selectionMode;
        if (selectionMode === 'none') {
            this.getCards().forEach(function (card) { return _this.removeSelectionClasses(card); });
        }
        else {
            this.setSelectableCards(selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards());
        }
    };
    CardStock.prototype.setSelectableCard = function (card, selectable) {
        if (this.selectionMode === 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        if (selectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(selectableCardsClass, selectable);
        }
        if (unselectableCardsClass) {
            element === null || element === void 0 ? void 0 : element.classList.toggle(unselectableCardsClass, !selectable);
        }
        if (!selectable && this.isSelected(card)) {
            this.unselectCard(card, true);
        }
    };
    /**
     * Set the selectable class for each card.
     *
     * @param selectableCards the selectable cards. If unset, all cards are marked selectable. Default unset.
     */
    CardStock.prototype.setSelectableCards = function (selectableCards) {
        var _this = this;
        if (this.selectionMode === 'none') {
            return;
        }
        var selectableCardsIds = (selectableCards !== null && selectableCards !== void 0 ? selectableCards : this.getCards()).map(function (card) { return _this.manager.getId(card); });
        this.cards.forEach(function (card) {
            return _this.setSelectableCard(card, selectableCardsIds.includes(_this.manager.getId(card)));
        });
    };
    /**
     * Set selected state to a card.
     *
     * @param card the card to select
     */
    CardStock.prototype.selectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        var element = this.getCardElement(card);
        var selectableCardsClass = this.getSelectableCardClass();
        if (!element || !element.classList.contains(selectableCardsClass)) {
            return;
        }
        if (this.selectionMode === 'single') {
            this.cards.filter(function (c) { return _this.manager.getId(c) != _this.manager.getId(card); }).forEach(function (c) { return _this.unselectCard(c, true); });
        }
        var selectedCardsClass = this.getSelectedCardClass();
        element.classList.add(selectedCardsClass);
        this.selectedCards.push(card);
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Set unselected state to a card.
     *
     * @param card the card to unselect
     */
    CardStock.prototype.unselectCard = function (card, silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var element = this.getCardElement(card);
        var selectedCardsClass = this.getSelectedCardClass();
        element === null || element === void 0 ? void 0 : element.classList.remove(selectedCardsClass);
        var index = this.selectedCards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
        if (index !== -1) {
            this.selectedCards.splice(index, 1);
        }
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), card);
        }
    };
    /**
     * Select all cards
     */
    CardStock.prototype.selectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        if (this.selectionMode == 'none') {
            return;
        }
        this.cards.forEach(function (c) { return _this.selectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    /**
     * Unelect all cards
     */
    CardStock.prototype.unselectAll = function (silent) {
        var _this = this;
        var _a;
        if (silent === void 0) { silent = false; }
        var cards = this.getCards(); // use a copy of the array as we iterate and modify it at the same time
        cards.forEach(function (c) { return _this.unselectCard(c, true); });
        if (!silent) {
            (_a = this.onSelectionChange) === null || _a === void 0 ? void 0 : _a.call(this, this.selectedCards.slice(), null);
        }
    };
    CardStock.prototype.bindClick = function () {
        var _this = this;
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (event) {
            var cardDiv = event.target.closest('.card');
            if (!cardDiv) {
                return;
            }
            var card = _this.cards.find(function (c) { return _this.manager.getId(c) == cardDiv.id; });
            if (!card) {
                return;
            }
            _this.cardClick(card);
        });
    };
    CardStock.prototype.cardClick = function (card) {
        var _this = this;
        var _a;
        if (this.selectionMode != 'none') {
            var alreadySelected = this.selectedCards.some(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (alreadySelected) {
                this.unselectCard(card);
            }
            else {
                this.selectCard(card);
            }
        }
        (_a = this.onCardClick) === null || _a === void 0 ? void 0 : _a.call(this, card);
    };
    /**
     * @param element The element to animate. The element is added to the destination stock before the animation starts.
     * @param fromElement The HTMLElement to animate from.
     */
    CardStock.prototype.animationFromElement = function (element, fromRect, settings) {
        return __awaiter(this, void 0, void 0, function () {
            var side, cardSides_1, animation, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        side = element.dataset.side;
                        if (settings.originalSide && settings.originalSide != side) {
                            cardSides_1 = element.getElementsByClassName('card-sides')[0];
                            cardSides_1.style.transition = 'none';
                            element.dataset.side = settings.originalSide;
                            setTimeout(function () {
                                cardSides_1.style.transition = null;
                                element.dataset.side = side;
                            });
                        }
                        animation = settings.animation;
                        if (animation) {
                            animation.settings.element = element;
                            animation.settings.fromRect = fromRect;
                        }
                        else {
                            animation = new BgaSlideAnimation({ element: element, fromRect: fromRect });
                        }
                        return [4 /*yield*/, this.manager.animationManager.play(animation)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.played) !== null && _a !== void 0 ? _a : false];
                }
            });
        });
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     */
    CardStock.prototype.setCardVisible = function (card, visible, settings) {
        this.manager.setCardVisible(card, visible, settings);
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     */
    CardStock.prototype.flipCard = function (card, settings) {
        this.manager.flipCard(card, settings);
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? this.manager.getSelectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Use class from manager is unset.
     */
    CardStock.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? this.manager.getUnselectableCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Use class from manager is unset.
     */
    CardStock.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? this.manager.getSelectedCardClass() : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardStock.prototype.removeSelectionClasses = function (card) {
        this.removeSelectionClassesFromElement(this.getCardElement(card));
    };
    CardStock.prototype.removeSelectionClassesFromElement = function (cardElement) {
        var selectableCardsClass = this.getSelectableCardClass();
        var unselectableCardsClass = this.getUnselectableCardClass();
        var selectedCardsClass = this.getSelectedCardClass();
        cardElement === null || cardElement === void 0 ? void 0 : cardElement.classList.remove(selectableCardsClass, unselectableCardsClass, selectedCardsClass);
    };
    return CardStock;
}());
var SlideAndBackAnimation = /** @class */ (function (_super) {
    __extends(SlideAndBackAnimation, _super);
    function SlideAndBackAnimation(manager, element, tempElement) {
        var distance = (manager.getCardWidth() + manager.getCardHeight()) / 2;
        var angle = Math.random() * Math.PI * 2;
        var fromDelta = {
            x: distance * Math.cos(angle),
            y: distance * Math.sin(angle),
        };
        return _super.call(this, {
            animations: [
                new BgaSlideToAnimation({ element: element, fromDelta: fromDelta, duration: 250 }),
                new BgaSlideAnimation({ element: element, fromDelta: fromDelta, duration: 250, animationEnd: tempElement ? (function () { return element.remove(); }) : undefined }),
            ]
        }) || this;
    }
    return SlideAndBackAnimation;
}(BgaCumulatedAnimation));
/**
 * Abstract stock to represent a deck. (pile of cards, with a fake 3d effect of thickness). *
 * Needs cardWidth and cardHeight to be set in the card manager.
 */
var Deck = /** @class */ (function (_super) {
    __extends(Deck, _super);
    function Deck(manager, element, settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('deck');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        _this.fakeCardGenerator = (_a = settings === null || settings === void 0 ? void 0 : settings.fakeCardGenerator) !== null && _a !== void 0 ? _a : manager.getFakeCardGenerator();
        _this.thicknesses = (_b = settings.thicknesses) !== null && _b !== void 0 ? _b : [0, 2, 5, 10, 20, 30];
        _this.setCardNumber((_c = settings.cardNumber) !== null && _c !== void 0 ? _c : 0);
        _this.autoUpdateCardNumber = (_d = settings.autoUpdateCardNumber) !== null && _d !== void 0 ? _d : true;
        _this.autoRemovePreviousCards = (_e = settings.autoRemovePreviousCards) !== null && _e !== void 0 ? _e : true;
        var shadowDirection = (_f = settings.shadowDirection) !== null && _f !== void 0 ? _f : 'bottom-right';
        var shadowDirectionSplit = shadowDirection.split('-');
        var xShadowShift = shadowDirectionSplit.includes('right') ? 1 : (shadowDirectionSplit.includes('left') ? -1 : 0);
        var yShadowShift = shadowDirectionSplit.includes('bottom') ? 1 : (shadowDirectionSplit.includes('top') ? -1 : 0);
        _this.element.style.setProperty('--xShadowShift', '' + xShadowShift);
        _this.element.style.setProperty('--yShadowShift', '' + yShadowShift);
        if (settings.topCard) {
            _this.addCard(settings.topCard);
        }
        else if (settings.cardNumber > 0) {
            _this.addCard(_this.getFakeCard());
        }
        if (settings.counter && ((_g = settings.counter.show) !== null && _g !== void 0 ? _g : true)) {
            if (settings.cardNumber === null || settings.cardNumber === undefined) {
                console.warn("Deck card counter created without a cardNumber");
            }
            _this.createCounter((_h = settings.counter.position) !== null && _h !== void 0 ? _h : 'bottom', (_j = settings.counter.extraClasses) !== null && _j !== void 0 ? _j : 'round', settings.counter.counterId);
            if ((_k = settings.counter) === null || _k === void 0 ? void 0 : _k.hideWhenEmpty) {
                _this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
            }
        }
        _this.setCardNumber((_l = settings.cardNumber) !== null && _l !== void 0 ? _l : 0);
        return _this;
    }
    Deck.prototype.createCounter = function (counterPosition, extraClasses, counterId) {
        var left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        var top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', "".concat(left, "%"));
        this.element.style.setProperty('--bga-cards-deck-top', "".concat(top, "%"));
        this.element.insertAdjacentHTML('beforeend', "\n            <div ".concat(counterId ? "id=\"".concat(counterId, "\"") : '', " class=\"bga-cards_deck-counter ").concat(extraClasses, "\"></div>\n        "));
    };
    /**
     * Get the the cards number.
     *
     * @returns the cards number
     */
    Deck.prototype.getCardNumber = function () {
        return this.cardNumber;
    };
    /**
     * Set the the cards number.
     *
     * @param cardNumber the cards number
     * @param topCard the deck top card. If unset, will generated a fake card (default). Set it to null to not generate a new topCard.
     */
    Deck.prototype.setCardNumber = function (cardNumber, topCard) {
        var _this = this;
        if (topCard === void 0) { topCard = undefined; }
        var promise = Promise.resolve(false);
        var oldTopCard = this.getTopCard();
        if (topCard !== null && cardNumber > 0) {
            var newTopCard = topCard || this.getFakeCard();
            if (!oldTopCard || this.manager.getId(newTopCard) != this.manager.getId(oldTopCard)) {
                promise = this.addCard(newTopCard, undefined, { autoUpdateCardNumber: false });
            }
        }
        else if (cardNumber == 0 && oldTopCard) {
            promise = this.removeCard(oldTopCard, { autoUpdateCardNumber: false });
        }
        this.cardNumber = cardNumber;
        this.element.dataset.empty = (this.cardNumber == 0).toString();
        var thickness = 0;
        this.thicknesses.forEach(function (threshold, index) {
            if (_this.cardNumber >= threshold) {
                thickness = index;
            }
        });
        this.element.style.setProperty('--thickness', "".concat(thickness, "px"));
        var counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = "".concat(cardNumber);
        }
        return promise;
    };
    Deck.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a, _b;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber + 1, null);
        }
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoRemovePreviousCards) !== null && _b !== void 0 ? _b : this.autoRemovePreviousCards) {
            promise.then(function () {
                var previousCards = _this.getCards().slice(0, -1); // remove last cards
                _this.removeCards(previousCards, { autoUpdateCardNumber: false });
            });
        }
        return promise;
    };
    Deck.prototype.cardRemoved = function (card, settings) {
        var _a;
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : this.autoUpdateCardNumber) {
            this.setCardNumber(this.cardNumber - 1);
        }
        _super.prototype.cardRemoved.call(this, card, settings);
    };
    Deck.prototype.removeAll = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var promise;
            var _a, _b;
            return __generator(this, function (_c) {
                promise = _super.prototype.removeAll.call(this, __assign(__assign({}, settings), { autoUpdateCardNumber: (_a = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _a !== void 0 ? _a : false }));
                if ((_b = settings === null || settings === void 0 ? void 0 : settings.autoUpdateCardNumber) !== null && _b !== void 0 ? _b : true) {
                    this.setCardNumber(0, null);
                }
                return [2 /*return*/, promise];
            });
        });
    };
    Deck.prototype.getTopCard = function () {
        var cards = this.getCards();
        return cards.length ? cards[cards.length - 1] : null;
    };
    /**
     * Shows a shuffle animation on the deck
     *
     * @param animatedCardsMax number of animated cards for shuffle animation.
     * @param fakeCardSetter a function to generate a fake card for animation. Required if the card id is not based on a numerci `id` field, or if you want to set custom card back
     * @returns promise when animation ends
     */
    Deck.prototype.shuffle = function (settings) {
        return __awaiter(this, void 0, void 0, function () {
            var animatedCardsMax, animatedCards, elements, getFakeCard, uid, i, newCard, newElement, pauseDelayAfterAnimation;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        animatedCardsMax = (_a = settings === null || settings === void 0 ? void 0 : settings.animatedCardsMax) !== null && _a !== void 0 ? _a : 10;
                        this.addCard((_b = settings === null || settings === void 0 ? void 0 : settings.newTopCard) !== null && _b !== void 0 ? _b : this.getFakeCard(), undefined, { autoUpdateCardNumber: false });
                        if (!this.manager.animationsActive()) {
                            return [2 /*return*/, Promise.resolve(false)]; // we don't execute as it's just visual temporary stuff
                        }
                        animatedCards = Math.min(10, animatedCardsMax, this.getCardNumber());
                        if (!(animatedCards > 1)) return [3 /*break*/, 4];
                        elements = [this.getCardElement(this.getTopCard())];
                        getFakeCard = function (uid) {
                            var newCard;
                            if (settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter) {
                                newCard = {};
                                settings === null || settings === void 0 ? void 0 : settings.fakeCardSetter(newCard, uid);
                            }
                            else {
                                newCard = _this.fakeCardGenerator("".concat(_this.element.id, "-shuffle-").concat(uid));
                            }
                            return newCard;
                        };
                        uid = 0;
                        for (i = elements.length; i <= animatedCards; i++) {
                            newCard = void 0;
                            do {
                                newCard = getFakeCard(uid++);
                            } while (this.manager.getCardElement(newCard)); // To make sure there isn't a fake card remaining with the same uid
                            newElement = this.manager.createCardElement(newCard, false);
                            newElement.dataset.tempCardForShuffleAnimation = 'true';
                            this.element.prepend(newElement);
                            elements.push(newElement);
                        }
                        return [4 /*yield*/, this.manager.animationManager.playWithDelay(elements.map(function (element) { return new SlideAndBackAnimation(_this.manager, element, element.dataset.tempCardForShuffleAnimation == 'true'); }), 50)];
                    case 1:
                        _d.sent();
                        pauseDelayAfterAnimation = (_c = settings === null || settings === void 0 ? void 0 : settings.pauseDelayAfterAnimation) !== null && _c !== void 0 ? _c : 500;
                        if (!(pauseDelayAfterAnimation > 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.manager.animationManager.play(new BgaPauseAnimation({ duration: pauseDelayAfterAnimation }))];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3: return [2 /*return*/, true];
                    case 4: return [2 /*return*/, Promise.resolve(false)];
                }
            });
        });
    };
    Deck.prototype.getFakeCard = function () {
        return this.fakeCardGenerator(this.element.id);
    };
    return Deck;
}(CardStock));
var AllVisibleDeck = /** @class */ (function (_super) {
    __extends(AllVisibleDeck, _super);
    function AllVisibleDeck(manager, element, settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('all-visible-deck', (_a = settings.direction) !== null && _a !== void 0 ? _a : 'vertical');
        var cardWidth = _this.manager.getCardWidth();
        var cardHeight = _this.manager.getCardHeight();
        if (cardWidth && cardHeight) {
            _this.element.style.setProperty('--width', "".concat(cardWidth, "px"));
            _this.element.style.setProperty('--height', "".concat(cardHeight, "px"));
        }
        else {
            throw new Error("You need to set cardWidth and cardHeight in the card manager to use Deck.");
        }
        element.style.setProperty('--vertical-shift', (_c = (_b = settings.verticalShift) !== null && _b !== void 0 ? _b : settings.shift) !== null && _c !== void 0 ? _c : '3px');
        element.style.setProperty('--horizontal-shift', (_e = (_d = settings.horizontalShift) !== null && _d !== void 0 ? _d : settings.shift) !== null && _e !== void 0 ? _e : '3px');
        if (settings.counter && ((_f = settings.counter.show) !== null && _f !== void 0 ? _f : true)) {
            _this.createCounter((_g = settings.counter.position) !== null && _g !== void 0 ? _g : 'bottom', (_h = settings.counter.extraClasses) !== null && _h !== void 0 ? _h : 'round', settings.counter.counterId);
            if ((_j = settings.counter) === null || _j === void 0 ? void 0 : _j.hideWhenEmpty) {
                _this.element.querySelector('.bga-cards_deck-counter').classList.add('hide-when-empty');
                _this.element.dataset.empty = 'true';
            }
        }
        return _this;
    }
    AllVisibleDeck.prototype.addCard = function (card, animation, settings) {
        var promise;
        var order = this.cards.length;
        promise = _super.prototype.addCard.call(this, card, animation, settings);
        var cardId = this.manager.getId(card);
        var cardDiv = document.getElementById(cardId);
        cardDiv.style.setProperty('--order', '' + order);
        this.cardNumberUpdated();
        return promise;
    };
    /**
     * Set opened state. If true, all cards will be entirely visible.
     *
     * @param opened indicate if deck must be always opened. If false, will open only on hover/touch
     */
    AllVisibleDeck.prototype.setOpened = function (opened) {
        this.element.classList.toggle('opened', opened);
    };
    AllVisibleDeck.prototype.cardRemoved = function (card) {
        var _this = this;
        _super.prototype.cardRemoved.call(this, card);
        this.cards.forEach(function (c, index) {
            var cardId = _this.manager.getId(c);
            var cardDiv = document.getElementById(cardId);
            cardDiv.style.setProperty('--order', '' + index);
        });
        this.cardNumberUpdated();
    };
    AllVisibleDeck.prototype.createCounter = function (counterPosition, extraClasses, counterId) {
        var left = counterPosition.includes('right') ? 100 : (counterPosition.includes('left') ? 0 : 50);
        var top = counterPosition.includes('bottom') ? 100 : (counterPosition.includes('top') ? 0 : 50);
        this.element.style.setProperty('--bga-cards-deck-left', "".concat(left, "%"));
        this.element.style.setProperty('--bga-cards-deck-top', "".concat(top, "%"));
        this.element.insertAdjacentHTML('beforeend', "\n            <div ".concat(counterId ? "id=\"".concat(counterId, "\"") : '', " class=\"bga-cards_deck-counter ").concat(extraClasses, "\"></div>\n        "));
    };
    /**
     * Updates the cards number, if the counter is visible.
     */
    AllVisibleDeck.prototype.cardNumberUpdated = function () {
        var cardNumber = this.cards.length;
        this.element.style.setProperty('--tile-count', '' + cardNumber);
        this.element.dataset.empty = (cardNumber == 0).toString();
        var counterDiv = this.element.querySelector('.bga-cards_deck-counter');
        if (counterDiv) {
            counterDiv.innerHTML = "".concat(cardNumber);
        }
    };
    return AllVisibleDeck;
}(CardStock));
/**
 * A basic stock for a list of cards, based on flex.
 */
var LineStock = /** @class */ (function (_super) {
    __extends(LineStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `LineStockSettings` object
     */
    function LineStock(manager, element, settings) {
        var _a, _b, _c, _d;
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('line-stock');
        element.dataset.center = ((_a = settings === null || settings === void 0 ? void 0 : settings.center) !== null && _a !== void 0 ? _a : true).toString();
        element.style.setProperty('--wrap', (_b = settings === null || settings === void 0 ? void 0 : settings.wrap) !== null && _b !== void 0 ? _b : 'wrap');
        element.style.setProperty('--direction', (_c = settings === null || settings === void 0 ? void 0 : settings.direction) !== null && _c !== void 0 ? _c : 'row');
        element.style.setProperty('--gap', (_d = settings === null || settings === void 0 ? void 0 : settings.gap) !== null && _d !== void 0 ? _d : '8px');
        return _this;
    }
    return LineStock;
}(CardStock));
/**
 * A stock with fixed slots (some can be empty)
 */
var SlotStock = /** @class */ (function (_super) {
    __extends(SlotStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     * @param settings a `SlotStockSettings` object
     */
    function SlotStock(manager, element, settings) {
        var _a, _b;
        var _this = _super.call(this, manager, element, settings) || this;
        _this.manager = manager;
        _this.element = element;
        _this.slotsIds = [];
        _this.slots = [];
        element.classList.add('slot-stock');
        _this.mapCardToSlot = settings.mapCardToSlot;
        _this.slotsIds = (_a = settings.slotsIds) !== null && _a !== void 0 ? _a : [];
        _this.slotClasses = (_b = settings.slotClasses) !== null && _b !== void 0 ? _b : [];
        _this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
        return _this;
    }
    SlotStock.prototype.createSlot = function (slotId) {
        var _a;
        this.slots[slotId] = document.createElement("div");
        this.slots[slotId].dataset.slotId = slotId;
        this.element.appendChild(this.slots[slotId]);
        (_a = this.slots[slotId].classList).add.apply(_a, __spreadArray(['slot'], this.slotClasses, true));
    };
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToSlotSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    SlotStock.prototype.addCard = function (card, animation, settings) {
        var _a, _b;
        var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
        if (slotId === undefined) {
            throw new Error("Impossible to add card to slot : no SlotId. Add slotId to settings or set mapCardToSlot to SlotCard constructor.");
        }
        if (!this.slots[slotId]) {
            throw new Error("Impossible to add card to slot \"".concat(slotId, "\" : slot \"").concat(slotId, "\" doesn't exists."));
        }
        var newSettings = __assign(__assign({}, settings), { forceToElement: this.slots[slotId] });
        return _super.prototype.addCard.call(this, card, animation, newSettings);
    };
    /**
     * Change the slots ids. Will empty the stock before re-creating the slots.
     *
     * @param slotsIds the new slotsIds. Will replace the old ones.
     */
    SlotStock.prototype.setSlotsIds = function (slotsIds) {
        var _this = this;
        if (slotsIds.length == this.slotsIds.length && slotsIds.every(function (slotId, index) { return _this.slotsIds[index] === slotId; })) {
            // no change
            return;
        }
        this.removeAll();
        this.element.innerHTML = '';
        this.slotsIds = slotsIds !== null && slotsIds !== void 0 ? slotsIds : [];
        this.slotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    /**
     * Add new slots ids. Will not change nor empty the existing ones.
     *
     * @param slotsIds the new slotsIds. Will be merged with the old ones.
     */
    SlotStock.prototype.addSlotsIds = function (newSlotsIds) {
        var _a;
        var _this = this;
        if (newSlotsIds.length == 0) {
            // no change
            return;
        }
        (_a = this.slotsIds).push.apply(_a, newSlotsIds);
        newSlotsIds.forEach(function (slotId) {
            _this.createSlot(slotId);
        });
    };
    SlotStock.prototype.canAddCard = function (card, settings) {
        var _a, _b;
        if (!this.contains(card)) {
            return true;
        }
        else {
            var closestSlot = this.getCardElement(card).closest('.slot');
            if (closestSlot) {
                var currentCardSlot = closestSlot.dataset.slotId;
                var slotId = (_a = settings === null || settings === void 0 ? void 0 : settings.slot) !== null && _a !== void 0 ? _a : (_b = this.mapCardToSlot) === null || _b === void 0 ? void 0 : _b.call(this, card);
                return currentCardSlot != slotId;
            }
            else {
                return true;
            }
        }
    };
    /**
     * Swap cards inside the slot stock.
     *
     * @param cards the cards to swap
     * @param settings for `updateInformations` and `selectable`
     */
    SlotStock.prototype.swapCards = function (cards, settings) {
        var _this = this;
        if (!this.mapCardToSlot) {
            throw new Error('You need to define SlotStock.mapCardToSlot to use SlotStock.swapCards');
        }
        var promises = [];
        var elements = cards.map(function (card) { return _this.manager.getCardElement(card); });
        var elementsRects = elements.map(function (element) { return element.getBoundingClientRect(); });
        var cssPositions = elements.map(function (element) { return element.style.position; });
        // we set to absolute so it doesn't mess with slide coordinates when 2 div are at the same place
        elements.forEach(function (element) { return element.style.position = 'absolute'; });
        cards.forEach(function (card, index) {
            var _a, _b;
            var cardElement = elements[index];
            var promise;
            var slotId = (_a = _this.mapCardToSlot) === null || _a === void 0 ? void 0 : _a.call(_this, card);
            _this.slots[slotId].appendChild(cardElement);
            cardElement.style.position = cssPositions[index];
            var cardIndex = _this.cards.findIndex(function (c) { return _this.manager.getId(c) == _this.manager.getId(card); });
            if (cardIndex !== -1) {
                _this.cards.splice(cardIndex, 1, card);
            }
            if ((_b = settings === null || settings === void 0 ? void 0 : settings.updateInformations) !== null && _b !== void 0 ? _b : true) { // after splice/push
                _this.manager.updateCardInformations(card);
            }
            _this.removeSelectionClassesFromElement(cardElement);
            promise = _this.animationFromElement(cardElement, elementsRects[index], {});
            if (!promise) {
                console.warn("CardStock.animationFromElement didn't return a Promise");
                promise = Promise.resolve(false);
            }
            promise.then(function () { var _a; return _this.setSelectableCard(card, (_a = settings === null || settings === void 0 ? void 0 : settings.selectable) !== null && _a !== void 0 ? _a : true); });
            promises.push(promise);
        });
        return Promise.all(promises);
    };
    return SlotStock;
}(LineStock));
/**
 * A stock to make cards disappear (to automatically remove discarded cards, or to represent a bag)
 */
var VoidStock = /** @class */ (function (_super) {
    __extends(VoidStock, _super);
    /**
     * @param manager the card manager
     * @param element the stock element (should be an empty HTML Element)
     */
    function VoidStock(manager, element) {
        var _this = _super.call(this, manager, element) || this;
        _this.manager = manager;
        _this.element = element;
        element.classList.add('void-stock');
        return _this;
    }
    /**
     * Add a card to the stock.
     *
     * @param card the card to add
     * @param animation a `CardAnimation` object
     * @param settings a `AddCardToVoidStockSettings` object
     * @returns the promise when the animation is done (true if it was animated, false if it wasn't)
     */
    VoidStock.prototype.addCard = function (card, animation, settings) {
        var _this = this;
        var _a;
        var promise = _super.prototype.addCard.call(this, card, animation, settings);
        // center the element
        var cardElement = this.getCardElement(card);
        var originalLeft = cardElement.style.left;
        var originalTop = cardElement.style.top;
        cardElement.style.left = "".concat((this.element.clientWidth - cardElement.clientWidth) / 2, "px");
        cardElement.style.top = "".concat((this.element.clientHeight - cardElement.clientHeight) / 2, "px");
        if (!promise) {
            console.warn("VoidStock.addCard didn't return a Promise");
            promise = Promise.resolve(false);
        }
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.remove) !== null && _a !== void 0 ? _a : true) {
            return promise.then(function () {
                return _this.removeCard(card);
            });
        }
        else {
            cardElement.style.left = originalLeft;
            cardElement.style.top = originalTop;
            return promise;
        }
    };
    return VoidStock;
}(CardStock));
var CardManager = /** @class */ (function () {
    /**
     * @param game the BGA game class, usually it will be `this`
     * @param settings: a `CardManagerSettings` object
     */
    function CardManager(game, settings) {
        var _a;
        this.game = game;
        this.settings = settings;
        this.stocks = [];
        this.updateMainTimeoutId = [];
        this.updateFrontTimeoutId = [];
        this.updateBackTimeoutId = [];
        this.animationManager = (_a = settings.animationManager) !== null && _a !== void 0 ? _a : new AnimationManager(game);
    }
    /**
     * Returns if the animations are active. Animation aren't active when the window is not visible (`document.visibilityState === 'hidden'`), or `game.instantaneousMode` is true.
     *
     * @returns if the animations are active.
     */
    CardManager.prototype.animationsActive = function () {
        return this.animationManager.animationsActive();
    };
    CardManager.prototype.addStock = function (stock) {
        this.stocks.push(stock);
    };
    CardManager.prototype.removeStock = function (stock) {
        var index = this.stocks.indexOf(stock);
        if (index !== -1) {
            this.stocks.splice(index, 1);
        }
    };
    /**
     * @param card the card informations
     * @return the id for a card
     */
    CardManager.prototype.getId = function (card) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.settings).getId) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : "card-".concat(card.id);
    };
    CardManager.prototype.createCardElement = function (card, visible) {
        var _a, _b, _c, _d, _e, _f;
        if (visible === void 0) { visible = true; }
        var id = this.getId(card);
        var side = visible ? 'front' : 'back';
        if (this.getCardElement(card)) {
            throw new Error('This card already exists ' + JSON.stringify(card));
        }
        var element = document.createElement("div");
        element.id = id;
        element.dataset.side = '' + side;
        element.innerHTML = "\n            <div class=\"card-sides\">\n                <div id=\"".concat(id, "-front\" class=\"card-side front\">\n                </div>\n                <div id=\"").concat(id, "-back\" class=\"card-side back\">\n                </div>\n            </div>\n        ");
        element.classList.add('card');
        document.body.appendChild(element);
        (_b = (_a = this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element);
        (_d = (_c = this.settings).setupFrontDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element.getElementsByClassName('front')[0]);
        (_f = (_e = this.settings).setupBackDiv) === null || _f === void 0 ? void 0 : _f.call(_e, card, element.getElementsByClassName('back')[0]);
        document.body.removeChild(element);
        return element;
    };
    /**
     * @param card the card informations
     * @return the HTML element of an existing card
     */
    CardManager.prototype.getCardElement = function (card) {
        return document.getElementById(this.getId(card));
    };
    /**
     * Remove a card.
     *
     * @param card the card to remove
     * @param settings a `RemoveCardSettings` object
     */
    CardManager.prototype.removeCard = function (card, settings) {
        var _a;
        var id = this.getId(card);
        var div = document.getElementById(id);
        if (!div) {
            return Promise.resolve(false);
        }
        div.id = "deleted".concat(id);
        div.remove();
        // if the card is in a stock, notify the stock about removal
        (_a = this.getCardStock(card)) === null || _a === void 0 ? void 0 : _a.cardRemoved(card, settings);
        return Promise.resolve(true);
    };
    /**
     * Returns the stock containing the card.
     *
     * @param card the card informations
     * @return the stock containing the card
     */
    CardManager.prototype.getCardStock = function (card) {
        return this.stocks.find(function (stock) { return stock.contains(card); });
    };
    /**
     * Return if the card passed as parameter is suppose to be visible or not.
     * Use `isCardVisible` from settings if set, else will check if `card.type` is defined
     *
     * @param card the card informations
     * @return the visiblility of the card (true means front side should be displayed)
     */
    CardManager.prototype.isCardVisible = function (card) {
        var _a, _b, _c, _d;
        return (_c = (_b = (_a = this.settings).isCardVisible) === null || _b === void 0 ? void 0 : _b.call(_a, card)) !== null && _c !== void 0 ? _c : ((_d = card.type) !== null && _d !== void 0 ? _d : false);
    };
    /**
     * Set the card to its front (visible) or back (not visible) side.
     *
     * @param card the card informations
     * @param visible if the card is set to visible face. If unset, will use isCardVisible(card)
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.setCardVisible = function (card, visible, settings) {
        var _this = this;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        var element = this.getCardElement(card);
        if (!element) {
            return;
        }
        var isVisible = visible !== null && visible !== void 0 ? visible : this.isCardVisible(card);
        element.dataset.side = isVisible ? 'front' : 'back';
        var stringId = JSON.stringify(this.getId(card));
        if ((_a = settings === null || settings === void 0 ? void 0 : settings.updateMain) !== null && _a !== void 0 ? _a : false) {
            if (this.updateMainTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateMainTimeoutId[stringId]);
                delete this.updateMainTimeoutId[stringId];
            }
            var updateMainDelay = (_b = settings === null || settings === void 0 ? void 0 : settings.updateMainDelay) !== null && _b !== void 0 ? _b : 0;
            if (isVisible && updateMainDelay > 0 && this.animationsActive()) {
                this.updateMainTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element); }, updateMainDelay);
            }
            else {
                (_d = (_c = this.settings).setupDiv) === null || _d === void 0 ? void 0 : _d.call(_c, card, element);
            }
        }
        if ((_e = settings === null || settings === void 0 ? void 0 : settings.updateFront) !== null && _e !== void 0 ? _e : true) {
            if (this.updateFrontTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateFrontTimeoutId[stringId]);
                delete this.updateFrontTimeoutId[stringId];
            }
            var updateFrontDelay = (_f = settings === null || settings === void 0 ? void 0 : settings.updateFrontDelay) !== null && _f !== void 0 ? _f : 500;
            if (!isVisible && updateFrontDelay > 0 && this.animationsActive()) {
                this.updateFrontTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupFrontDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('front')[0]); }, updateFrontDelay);
            }
            else {
                (_h = (_g = this.settings).setupFrontDiv) === null || _h === void 0 ? void 0 : _h.call(_g, card, element.getElementsByClassName('front')[0]);
            }
        }
        if ((_j = settings === null || settings === void 0 ? void 0 : settings.updateBack) !== null && _j !== void 0 ? _j : false) {
            if (this.updateBackTimeoutId[stringId]) { // make sure there is not a delayed animation that will overwrite the last flip request
                clearTimeout(this.updateBackTimeoutId[stringId]);
                delete this.updateBackTimeoutId[stringId];
            }
            var updateBackDelay = (_k = settings === null || settings === void 0 ? void 0 : settings.updateBackDelay) !== null && _k !== void 0 ? _k : 0;
            if (isVisible && updateBackDelay > 0 && this.animationsActive()) {
                this.updateBackTimeoutId[stringId] = setTimeout(function () { var _a, _b; return (_b = (_a = _this.settings).setupBackDiv) === null || _b === void 0 ? void 0 : _b.call(_a, card, element.getElementsByClassName('back')[0]); }, updateBackDelay);
            }
            else {
                (_m = (_l = this.settings).setupBackDiv) === null || _m === void 0 ? void 0 : _m.call(_l, card, element.getElementsByClassName('back')[0]);
            }
        }
        if ((_o = settings === null || settings === void 0 ? void 0 : settings.updateData) !== null && _o !== void 0 ? _o : true) {
            // card data has changed
            var stock = this.getCardStock(card);
            var cards = stock.getCards();
            var cardIndex = cards.findIndex(function (c) { return _this.getId(c) === _this.getId(card); });
            if (cardIndex !== -1) {
                stock.cards.splice(cardIndex, 1, card);
            }
        }
    };
    /**
     * Flips the card.
     *
     * @param card the card informations
     * @param settings the flip params (to update the card in current stock)
     */
    CardManager.prototype.flipCard = function (card, settings) {
        var element = this.getCardElement(card);
        var currentlyVisible = element.dataset.side === 'front';
        this.setCardVisible(card, !currentlyVisible, settings);
    };
    /**
     * Update the card informations. Used when a card with just an id (back shown) should be revealed, with all data needed to populate the front.
     *
     * @param card the card informations
     */
    CardManager.prototype.updateCardInformations = function (card, settings) {
        var newSettings = __assign(__assign({}, (settings !== null && settings !== void 0 ? settings : {})), { updateData: true });
        this.setCardVisible(card, undefined, newSettings);
    };
    /**
     * @returns the card with set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardWidth = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardWidth;
    };
    /**
     * @returns the card height set in the settings (undefined if unset)
     */
    CardManager.prototype.getCardHeight = function () {
        var _a;
        return (_a = this.settings) === null || _a === void 0 ? void 0 : _a.cardHeight;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_selectable-card'.
     */
    CardManager.prototype.getSelectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectableCardClass) === undefined ? 'bga-cards_selectable-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectableCardClass;
    };
    /**
     * @returns the class to apply to selectable cards. Default 'bga-cards_disabled-card'.
     */
    CardManager.prototype.getUnselectableCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.unselectableCardClass) === undefined ? 'bga-cards_disabled-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.unselectableCardClass;
    };
    /**
     * @returns the class to apply to selected cards. Default 'bga-cards_selected-card'.
     */
    CardManager.prototype.getSelectedCardClass = function () {
        var _a, _b;
        return ((_a = this.settings) === null || _a === void 0 ? void 0 : _a.selectedCardClass) === undefined ? 'bga-cards_selected-card' : (_b = this.settings) === null || _b === void 0 ? void 0 : _b.selectedCardClass;
    };
    CardManager.prototype.getFakeCardGenerator = function () {
        var _this = this;
        var _a, _b;
        return (_b = (_a = this.settings) === null || _a === void 0 ? void 0 : _a.fakeCardGenerator) !== null && _b !== void 0 ? _b : (function (deckId) { return ({ id: _this.getId({ id: "".concat(deckId, "-fake-top-card") }) }); });
    };
    return CardManager;
}());
function sortFunction() {
    var sortedFields = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sortedFields[_i] = arguments[_i];
    }
    return function (a, b) {
        for (var i = 0; i < sortedFields.length; i++) {
            var direction = 1;
            var field = sortedFields[i];
            if (field[0] == '-') {
                direction = -1;
                field = field.substring(1);
            }
            else if (field[0] == '+') {
                field = field.substring(1);
            }
            var type = typeof a[field];
            if (type === 'string') {
                var compare = a[field].localeCompare(b[field]);
                if (compare !== 0) {
                    return compare;
                }
            }
            else if (type === 'number') {
                var compare = (a[field] - b[field]) * direction;
                if (compare !== 0) {
                    return compare * direction;
                }
            }
        }
        return 0;
    };
}
var CardsManager = /** @class */ (function (_super) {
    __extends(CardsManager, _super);
    function CardsManager(game) {
        var _this = _super.call(this, game, {
            getId: function (card) { return "card-".concat(card.id); },
            setupDiv: function (card, div) {
                div.dataset.cardId = "" + card.id;
                div.dataset.type = "" + card.type;
            },
            setupFrontDiv: function (card, div) {
                return _this.setupFrontDiv(card, div);
            },
            isCardVisible: function (card) { return !card.flipped; },
            animationManager: game.animationManager,
            cardWidth: 186, //149,
            cardHeight: 260, //208,
        }) || this;
        _this.game = game;
        return _this;
    }
    CardsManager.prototype.setupFrontDiv = function (card, div, ignoreTooltip) {
        if (ignoreTooltip === void 0) { ignoreTooltip = false; }
        console.log("setupFrontDiv", card);
        div.dataset.index = "" + card.index;
        var index = card.index;
        var col = (index % 9) - 1;
        var row = card.type - 1;
        div.style.backgroundPositionX = "".concat((col * 100) / 8, "%");
        div.style.backgroundPositionY = "".concat((row * 100) / 2, "%");
        if (card.index === 10) {
            // Fake card
            return;
        }
        // Check giant card
        if (card.type === 2) {
            // Draw section areas
            if (!div.querySelector(".card-section")) {
                div.insertAdjacentHTML("beforeend", "\n            <div class=\"card-section top\"></div>\n            <div class=\"card-section middle\"></div>\n            <div class=\"card-section bottom\"></div>\n            ");
                this.drawGiantActionAreas(card.index, div);
            }
        }
        // Check heroe card
        if (card.type === 1) {
            var rondelChar = void 0;
            switch (card.typeArg) {
                case 1:
                case 2:
                case 3:
                    rondelChar = "A";
                    break;
                case 4:
                case 5:
                case 6:
                    rondelChar = "B";
                    break;
                case 7:
                case 8:
                case 9:
                    rondelChar = "C";
                    break;
                default:
                    break;
            }
            // Draw section areas
            if (!div.querySelector(".hero-actions")) {
                div.insertAdjacentHTML("beforeend", "\n            <div class=\"hero-actions\">\n                <div class=\"nut\" id=\"rondel".concat(rondelChar, "\"></div>\n                <div class=\"hero-action action1\" id=\"").concat(card.typeArg, "-action1\"></div>\n                <div class=\"hero-action action2\" id=\"").concat(card.typeArg, "-action2\"></div>\n                <div class=\"hero-action action3\" id=\"").concat(card.typeArg, "-action3\"></div>\n                <div class=\"hero-action action4\" id=\"").concat(card.typeArg, "-action4\"></div>\n                <div class=\"hero-action action5\" id=\"").concat(card.typeArg, "-action5\"></div>\n                <div class=\"hero-action action6\" id=\"").concat(card.typeArg, "-action6\"></div>\n                <div class=\"hero-action action7\" id=\"").concat(card.typeArg, "-action7\"></div>\n                <div class=\"hero-action action8\" id=\"").concat(card.typeArg, "-action8\"></div>\n            </div>\n            "));
            }
        }
    };
    CardsManager.prototype.drawGiantActionAreas = function (index, div) {
        var cardAreasById = {
            1: {
                top: [1, 2, 3],
                middle: [1, 2, 3],
                bottom: [500, 701, 702], // listo
            },
            2: {
                top: [1, 2, 3],
                middle: [1, 22, 31],
                bottom: [111],
            },
            3: {
                top: [1, 22, 32],
                middle: [1, 2, 3],
                bottom: [300, 301, 302, 303], //listo
            },
            4: {
                top: [6],
                middle: [6, 7, 23, 32],
                bottom: [111],
            },
            5: {
                top: [4, 5],
                middle: [1, 2, 3],
                bottom: [500, 501, 502], //LISTO
            },
            6: {
                top: [1, 21, 31],
                middle: [5, 71, 61],
                bottom: [111], //LISTO
            },
            7: {
                top: [1, 2, 3],
                middle: [4],
                bottom: [500, 701, 702], //listo
            },
            8: {
                top: [1, 7, 8, 9],
                middle: [4],
                bottom: [111],
            },
            9: {
                top: [1, 2, 3],
                middle: [1, 5],
                bottom: [111],
            },
        };
        // const node = dojo.byId(cardDivId);
        var areas = cardAreasById[index] || [];
        var _loop_3 = function (area) {
            var zones = areas[area];
            var sectionElem = div.querySelector(".card-section.".concat(area));
            zones.forEach(function (zone) {
                var areaElem = document.createElement("div");
                areaElem.classList.add("giant-action-area", "pos-".concat(zone));
                sectionElem.appendChild(areaElem);
            });
        };
        for (var area in areas) {
            _loop_3(area);
        }
    };
    CardsManager.prototype.highlightHeroeActions = function (card) {
        console.log("highlightHeroeActions", card);
        var elemAreaNodes = document.querySelectorAll("#card-".concat(card.id, "-front"));
        console.log(elemAreaNodes);
    };
    return CardsManager;
}(CardManager));
var _a, _b;
var TRACK;
(function (TRACK) {
    TRACK["GIANT_LIFE"] = "giant-life";
    TRACK["QUALITY_ATTACK"] = "quality-attack-track";
    TRACK["QUALITY_REPAIR"] = "quality-repair-track";
    TRACK["QUALITY_MORAL"] = "quality-moral-track";
    TRACK["SUPPLY_AMMO"] = "supply-ammo-track";
    TRACK["SUPPLY_TOOLS"] = "supply-tools-track";
    TRACK["SUPPLY_TRUMPET"] = "supply-trumpet-track";
    TRACK["CITY_DESTRUCTION"] = "city-destruction-track";
})(TRACK || (TRACK = {}));
var TRACK_ID;
(function (TRACK_ID) {
    TRACK_ID["GIANT_LIFE"] = "life";
    TRACK_ID["QUALITY_ATTACK"] = "attack";
    TRACK_ID["QUALITY_REPAIR"] = "repair";
    TRACK_ID["QUALITY_MORAL"] = "moral";
    TRACK_ID["SUPPLY_AMMO"] = "ammo";
    TRACK_ID["SUPPLY_TOOLS"] = "tools";
    TRACK_ID["SUPPLY_TRUMPET"] = "trumpet";
    TRACK_ID["CITY_DESTRUCTION"] = "destruction";
})(TRACK_ID || (TRACK_ID = {}));
var TOKEN;
(function (TOKEN) {
    TOKEN["LIFE"] = "token-life";
    TOKEN["ATTACK"] = "token-attack";
    TOKEN["REPAIR"] = "token-repair";
    TOKEN["MORAL"] = "token-moral";
    TOKEN["AMMO"] = "token-ammo";
    TOKEN["TOOLS"] = "token-tools";
    TOKEN["TRUMPET"] = "token-trumpet";
    TOKEN["DESTRUCTION"] = "token-destruction";
})(TOKEN || (TOKEN = {}));
var mapTokenId = (_a = {},
    _a["token-giantLife"] = TOKEN.LIFE,
    _a["token-qualityAttack"] = TOKEN.ATTACK,
    _a["token-qualityRepair"] = TOKEN.REPAIR,
    _a["token-qualityMoral"] = TOKEN.MORAL,
    _a["token-supplyAmmo"] = TOKEN.AMMO,
    _a["token-supplyTools"] = TOKEN.TOOLS,
    _a["token-supplyTrumpet"] = TOKEN.TRUMPET,
    _a["token-cityDestruction"] = TOKEN.DESTRUCTION,
    _a);
var mapTrackId = (_b = {},
    _b["giantLife"] = TRACK_ID.GIANT_LIFE,
    _b["qualityAttack"] = TRACK_ID.QUALITY_ATTACK,
    _b["qualityRepair"] = TRACK_ID.QUALITY_REPAIR,
    _b["qualityMoral"] = TRACK_ID.QUALITY_MORAL,
    _b["supplyAmmo"] = TRACK_ID.SUPPLY_AMMO,
    _b["supplyTools"] = TRACK_ID.SUPPLY_TOOLS,
    _b["supplyTrumpet"] = TRACK_ID.SUPPLY_TRUMPET,
    _b["cityDestruction"] = TRACK_ID.CITY_DESTRUCTION,
    _b);
var TrackManager = /** @class */ (function () {
    function TrackManager(game) {
        this.game = game;
        this.trackState = game.gamedatas.trackState;
    }
    TrackManager.prototype.setupTrack = function () {
        for (var track in this.trackState) {
            console.log("track", track, this.trackState[track]);
            this.printTokenOnBoard(this.getTokenIdForTrack(track), this.getTargetPositionIdForTrack(track));
        }
    };
    TrackManager.prototype.moveToken = function (track, newPosition) {
        this.updateTrackValue(track, newPosition);
        this.printTokenOnBoard(this.getTokenIdForTrack(track), this.getTargetPositionIdForTrack(track));
    };
    TrackManager.prototype.updateTokens = function (tracks) {
        for (var track in tracks) {
            console.log(tracks[track]);
            console.log(this.trackState[track]);
            if (tracks[track] !== this.trackState[track]) {
                console.log('cambio ' + tracks[track]);
                this.moveToken(track, tracks[track]);
            }
        }
    };
    TrackManager.prototype.getTracks = function () {
        return this.trackState;
    };
    TrackManager.prototype.updateTrackValue = function (track, newPosition) {
        this.trackState[track] = newPosition;
    };
    /**
     * Returns the DOM ID of the token associated with a specific track.
     * Example: for 'life', returns 'token-life'.
     *
     * @param track - The name of the track (e.g., 'giantLife', 'qualityAttack', etc.)
     * @returns The DOM ID of the corresponding token element.
     */
    TrackManager.prototype.getTokenIdForTrack = function (track) {
        // giantLife -> token-life
        return mapTokenId["token-".concat(track)];
    };
    /**
     * Returns the DOM ID of the position element where the token should be placed
     * based on the current value of the given track.
     * Example: for track 'life' at position 2, returns 'life2'.
     *
     * @param track - The name of the track (e.g., 'life').
     * @returns The DOM ID of the target element (e.g., 'life2', etc.)
     */
    TrackManager.prototype.getTargetPositionIdForTrack = function (track) {
        // giantLife -> life2
        return "".concat(mapTrackId[track]).concat(this.trackState[track]);
    };
    TrackManager.prototype.printTokenOnBoard = function (origId, destId) {
        return __awaiter(this, void 0, void 0, function () {
            var token, target, anim;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = document.getElementById(origId);
                        target = document.getElementById(destId);
                        token.style.position = "absolute";
                        token.style.left = "0px";
                        token.style.top = "0px";
                        console.log(this.game.bgaPlayDojoAnimation);
                        anim = this.game.slideToObject(token.id, target.id);
                        return [4 /*yield*/, this.game.bgaPlayDojoAnimation(anim)];
                    case 1:
                        _a.sent();
                        target.appendChild(token);
                        token.style.position = ""; // remove absolute positioning
                        return [2 /*return*/];
                }
            });
        });
    };
    return TrackManager;
}());
var GiantActionActive;
(function (GiantActionActive) {
    GiantActionActive["ADVANCE_RONDEL"] = "advanceRondel";
    GiantActionActive["EXCHANGE_RONDEL"] = "exchangeRondel";
    GiantActionActive["MOVE_RONDEL"] = "moveRondel";
})(GiantActionActive || (GiantActionActive = {}));
var HeroeManager = /** @class */ (function () {
    function HeroeManager(game) {
        this.game = game;
        this.handlers = {
            nutHandlers: [],
            availableMovementsHandlers: [],
        };
        this.heroes = this.game.gamedatas.heroeCards;
        this.rondels = this.game.gamedatas.rondels.rondels;
        this.availableMovements = this.game.gamedatas.rondels.availableMovements;
    }
    HeroeManager.prototype.mapRondelCharToIdLocation = function (rondel, location) {
        return "".concat(rondel.heroe, "-action").concat(location !== null && location !== void 0 ? location : rondel.location);
    };
    HeroeManager.prototype.printRondelOnBoard = function (rondelChar, destId) {
        return __awaiter(this, void 0, void 0, function () {
            var rondel, target, anim;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rondel = document.getElementById("rondel".concat(rondelChar));
                        target = document.getElementById(destId);
                        rondel.style.position = "absolute";
                        rondel.style.left = "0px";
                        rondel.style.top = "0px";
                        anim = this.game.slideToObject(rondel.id, target.id);
                        return [4 /*yield*/, this.game.bgaPlayDojoAnimation(anim)];
                    case 1:
                        _a.sent();
                        target.appendChild(rondel);
                        rondel.style.position = ""; // remove absolute positioning
                        return [2 /*return*/];
                }
            });
        });
    };
    // Draw rondels in the card position
    HeroeManager.prototype.setupRondels = function () {
        for (var rondelKey in this.rondels) {
            var rondelObj = this.rondels[rondelKey];
            var rondelPosId = this.mapRondelCharToIdLocation(rondelObj);
            this.printRondelOnBoard(rondelObj.char, rondelPosId);
        }
    };
    HeroeManager.prototype.resetEnableRondels = function () {
        for (var rondelKey in this.rondels) {
            var rondelObj = this.rondels[rondelKey];
            rondelObj.enabled = true;
        }
    };
    // Add click event to available rondels
    HeroeManager.prototype.enableRondels = function () {
        var _this = this;
        this.removeNutAvailable();
        console.log("pepito el montonero");
        var _loop_4 = function (rondelKey) {
            var rondel = this_1.rondels[rondelKey];
            console.log(rondel);
            if (rondel.enabled) {
                var rondelElem = document.getElementById("rondel".concat(rondel.char));
                rondelElem.classList.add("available-nut");
                var handler = dojo.connect(rondelElem, "onclick", function () {
                    return _this.onNutSelected(rondel);
                });
                this_1.handlers.nutHandlers.push(handler);
            }
        };
        var this_1 = this;
        for (var rondelKey in this.rondels) {
            _loop_4(rondelKey);
        }
    };
    HeroeManager.prototype.onNutSelected = function (rondel) {
        this.resetAvailableMovement();
        this.enableAvailableMovements(rondel);
    };
    HeroeManager.prototype.removeHighlighedtActions = function () {
        document.querySelectorAll(".highlighted-action").forEach(function (el) {
            el.classList.remove("highlighted-action");
        });
    };
    HeroeManager.prototype.removeNutAvailable = function () {
        document.querySelectorAll(".available-nut").forEach(function (el) {
            el.classList.remove("available-nut");
        });
    };
    HeroeManager.prototype.resetAvailableMovement = function () {
        this.removeHighlighedtActions();
        this.handlers.availableMovementsHandlers.forEach(function (handler) {
            return handler.remove();
        });
        this.handlers.availableMovementsHandlers = [];
    };
    HeroeManager.prototype.resetNut = function () {
        this.removeNutAvailable();
        this.handlers.nutHandlers.forEach(function (handler) { return handler.remove(); });
        this.handlers.nutHandlers = [];
    };
    HeroeManager.prototype.resetAll = function () {
        this.resetAvailableMovement();
        this.resetNut();
        this.giantActionActive = null;
    };
    HeroeManager.prototype.enableAvailableMovements = function (rondel) {
        var _this = this;
        console.log(rondel, this.availableMovements);
        console.log(this.handlers);
        this.removeHighlighedtActions();
        if (this.giantActionActive) {
            switch (this.giantActionActive) {
                case GiantActionActive.ADVANCE_RONDEL:
                    this.availableMovements = [1];
                    break;
                case GiantActionActive.EXCHANGE_RONDEL:
                    var _loop_5 = function (rondelKey) {
                        var rondelObj = this_2.rondels[rondelKey];
                        // console.log(rondel);
                        if (rondelObj.char !== rondel.char) {
                            var rondelElem = document.getElementById("rondel".concat(rondel.char));
                            rondelElem.classList.add("available-nut");
                            var handler = dojo.connect(rondelElem, "onclick", function () {
                                return _this.onExchangeNutSelected(rondel, rondelObj);
                            });
                            this_2.handlers.nutHandlers.push(handler);
                        }
                    };
                    var this_2 = this;
                    // Add button to cancel action
                    for (var rondelKey in this.rondels) {
                        _loop_5(rondelKey);
                    }
                    break;
                case GiantActionActive.MOVE_RONDEL:
                    this.availableMovements = [-1, 1];
                    break;
                default:
                    break;
            }
        }
        this.availableMovements.map(function (movement) {
            var rondelNewLocation = ((rondel.location + movement - 1) % 8) + 1; // 1 to 8
            var elemId = _this.mapRondelCharToIdLocation(rondel, rondelNewLocation);
            var elem = document.getElementById(elemId);
            elem.classList.add("highlighted-action");
            var handler = dojo.connect(elem, "onclick", function () {
                if (_this.giantActionActive) {
                    _this.onSpecialGiantActionSelected([rondel], movement, rondelNewLocation);
                }
                else {
                    _this.onAvailableMovementSelected(rondel, movement, rondelNewLocation);
                }
            });
            _this.handlers.availableMovementsHandlers.push(handler);
        });
    };
    HeroeManager.prototype.onExchangeNutSelected = function (rondelA, rondelB) {
        this.game.onSpecialGiantActionClick([rondelA, rondelB], 0, 0);
    };
    HeroeManager.prototype.onSpecialGiantActionSelected = function (rondel, movement, rondelNewLocation) {
        this.game.onSpecialGiantActionClick(rondel, movement, rondelNewLocation);
    };
    HeroeManager.prototype.onAvailableMovementSelected = function (rondel, movement, rondelNewLocation) {
        this.game.onHeroeActionCardClick(rondel, movement, rondelNewLocation);
    };
    HeroeManager.prototype.updateRondel = function (rondelChar, newLocation, movement) {
        var rondel = this.rondels.find(function (rondel) { return rondel.char == rondelChar; });
        rondel.location = newLocation;
        rondel.movement = movement;
        rondel.enabled = false;
        this.removeMovement(movement);
        var rondelPosId = this.mapRondelCharToIdLocation(rondel);
        this.printRondelOnBoard(rondelChar, rondelPosId);
    };
    HeroeManager.prototype.updateRondelState = function (rondels) {
        this.availableMovements = rondels.availableMovements;
        this.rondels = rondels.rondels;
    };
    HeroeManager.prototype.removeMovement = function (movement) {
        this.availableMovements = this.availableMovements.filter(function (n) { return n !== movement; });
    };
    return HeroeManager;
}());
var GiantManager = /** @class */ (function () {
    function GiantManager(game) {
        this.game = game;
        this.giantPosition = this.game.gamedatas.giantPosition;
        this.giantArea = this.game.gamedatas.giantArea;
        this.giantCards = this.game.gamedatas.giantCards;
        this.handlers = [];
        this.currGiantCard = this.getCurrentGiantCard();
    }
    GiantManager.prototype.updateGiant = function (newPosition, newArea, cards) {
        this.giantPosition = newPosition;
        this.giantArea = newArea;
        this.giantCards = cards;
        this.currGiantCard = this.getCurrentGiantCard();
    };
    GiantManager.prototype.getCurrentGiantCard = function () {
        return this.giantCards[this.giantPosition - 1];
    };
    GiantManager.prototype.removeHighlighedtActions = function () {
        document.querySelectorAll(".highlighted-action").forEach(function (el) {
            el.classList.remove("highlighted-action");
        });
    };
    GiantManager.prototype.resetGiantActions = function () {
        this.removeHighlighedtActions();
        this.handlers.forEach(function (handler) { return handler.remove(); });
        this.handlers = [];
    };
    GiantManager.prototype.onActionSelected = function (index) {
        this.game.onGiantTableCardClick(this.currGiantCard.id, this.giantArea, index);
    };
    GiantManager.prototype.highlightGiantActions = function (isMandatoryStage) {
        var _this = this;
        if (isMandatoryStage === void 0) { isMandatoryStage = false; }
        console.log('highlightGiantActions', isMandatoryStage);
        console.log(this.currGiantCard);
        console.log(this.giantArea);
        var elemAreaNodes = document.querySelectorAll("#card-".concat(this.currGiantCard.id, "-front .").concat(this.giantArea, " .giant-action-area"));
        console.log('elemAreaNodes', elemAreaNodes);
        if (isMandatoryStage) {
            elemAreaNodes[0].classList.add("highlighted-action");
            var handler = dojo.connect(elemAreaNodes[0], "onclick", function () { return _this.onActionSelected(1); });
            this.handlers.push(handler);
        }
        if (!isMandatoryStage) {
            var _loop_6 = function (i) {
                elemAreaNodes[i].classList.add("highlighted-action");
                var handler = dojo.connect(elemAreaNodes[i], "onclick", function () { return _this.onActionSelected(i); });
                this_3.handlers.push(handler);
            };
            var this_3 = this;
            for (var i = 1; i < elemAreaNodes.length; i++) {
                _loop_6(i);
            }
        }
    };
    return GiantManager;
}());
var GiantTableCenter = /** @class */ (function () {
    function GiantTableCenter(game, gamedatas) {
        this.game = game;
        console.log('GiantTableCenter constructor', gamedatas);
        var visibleCount = 1;
        // const visibleCount = gamedatas.visibleCardCount;
        var visibleCards = gamedatas.giantCards;
        console.log('cards', visibleCards);
        var totalCards = 9;
        var fakeCards = [];
        visibleCards.forEach(function (card, index) {
            card.flipped = false;
        });
        for (var i = visibleCards.length; i < totalCards; i++) {
            fakeCards.push({
                flipped: true, // por si querés forzar que no se pueda interactuar
                id: 1000 + i, // un id que no colisione con los reales
                location: 'giant-row',
                locationArg: 0,
                type: 2, // o el tipo que corresponda al dorso
                typeArg: 1,
                index: 10, // este seria cual GCard se coloca esto hace que se pinte el dorso (según CardsManager)
                sections: [],
                // fake: true, // opcional, si querés identificarlas después
            });
        }
        var allCards = __spreadArray(__spreadArray([], visibleCards, true), fakeCards, true);
        console.log('allCards', allCards);
        document.getElementById("giant-table-row").insertAdjacentHTML('beforeend', "                \n            <div>\n                <div class=\"name-wrapper\">\n                    <span class=\"name\" style=\"color: #red;\">Giant Path</span>\n                </div>\n                <div id=\"giant-table-cards\" class=\"giant-table-cards\"></div>\n            </div>\n        ");
        this.giantTableCards = new LineStock(this.game.cardsManager, document.getElementById("giant-table-cards"), {
            center: false,
        });
        this.giantTableCards.addCards(allCards);
    }
    GiantTableCenter.prototype.addNewCard = function (card) {
        return __awaiter(this, void 0, void 0, function () {
            var cards, firstFakeCard, newCardElem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cards = this.giantTableCards.getCards();
                        firstFakeCard = cards.find(function (card) { return card.id > 1000; });
                        return [4 /*yield*/, this.giantTableCards.removeCard(firstFakeCard)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.giantTableCards.addCard(card, null, { index: card.locationArg - 1, visible: false })];
                    case 2:
                        _a.sent();
                        newCardElem = this.giantTableCards.getCardElement(card);
                        newCardElem.setAttribute('data-side', 'front');
                        return [2 /*return*/];
                }
            });
        });
    };
    return GiantTableCenter;
}());
var HeroeTableCenter = /** @class */ (function () {
    function HeroeTableCenter(game, gamedatas) {
        this.game = game;
        console.log("HeroeTableCenter constructor", gamedatas);
        var heroeCards = gamedatas.heroeCards;
        document.getElementById("heroe-table-row").insertAdjacentHTML("beforeend", "                \n            <div>\n                <div class=\"name-wrapper\">\n                    <span class=\"name\" style=\"color: #red;\">Heroes</span>\n                </div>\n                <div id=\"heroe-table-cards\" class=\"heroe-table-cards\">\n\n                </div>\n            </div>\n        ");
        this.heroeTableCards = new LineStock(this.game.cardsManager, document.getElementById("heroe-table-cards"), {
            center: false,
        });
        this.heroeTableCards.addCards(heroeCards);
    }
    return HeroeTableCenter;
}());
var CityTableCenter = /** @class */ (function () {
    function CityTableCenter(game, gamedatas) {
        this.game = game;
        console.log("CityTableCenter constructor", gamedatas);
        document.getElementById("city-table-row").insertAdjacentHTML("beforeend", "                \n            <div>\n                <div class=\"name-wrapper\">\n                    <span class=\"name\" style=\"color: #red;\">City</span>\n                </div>\n                <div id=\"city-table-cards\" class=\"city-table-cards\">\n                    <div class=\"city-card\" id=\"city-card\">\n                        <div class=\"city-tracks\" id=\"city-tracks\"></div>\n                    </div>\n                </div>\n            </div>\n        ");
        document.getElementById("city-tracks").insertAdjacentHTML("beforeend", "\n                      <div class=\"track-token\" id=\"token-life\"></div>\n                      <div class=\"track-token\" id=\"token-attack\"></div>\n                      <div class=\"track-token\" id=\"token-repair\"></div>\n                      <div class=\"track-token\" id=\"token-moral\"></div>\n                      <div class=\"track-token\" id=\"token-ammo\"></div>\n                      <div class=\"track-token\" id=\"token-tools\"></div>\n                      <div class=\"track-token\" id=\"token-trumpet\"></div>\n                      <div class=\"track-token\" id=\"token-destruction\"></div>\n      \n                      <div class=\"".concat(TRACK.GIANT_LIFE, " life1\" id=\"").concat(TRACK_ID.GIANT_LIFE, "1\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life2\" id=\"").concat(TRACK_ID.GIANT_LIFE, "2\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life3\" id=\"").concat(TRACK_ID.GIANT_LIFE, "3\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life4\" id=\"").concat(TRACK_ID.GIANT_LIFE, "4\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life5\" id=\"").concat(TRACK_ID.GIANT_LIFE, "5\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life6\" id=\"").concat(TRACK_ID.GIANT_LIFE, "6\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life7\" id=\"").concat(TRACK_ID.GIANT_LIFE, "7\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life8\" id=\"").concat(TRACK_ID.GIANT_LIFE, "8\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life9\" id=\"").concat(TRACK_ID.GIANT_LIFE, "9\"></div>\n                      <div class=\"").concat(TRACK.GIANT_LIFE, " life10\" id=\"").concat(TRACK_ID.GIANT_LIFE, "10\"></div>\n      \n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack0\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "0\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack1\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "1\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack2\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "2\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack3\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "3\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack4\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "4\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_ATTACK, " attack5\" id=\"").concat(TRACK_ID.QUALITY_ATTACK, "5\"></div>\n      \n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair0\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "0\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair1\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "1\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair2\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "2\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair3\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "3\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair4\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "4\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_REPAIR, " repair5\" id=\"").concat(TRACK_ID.QUALITY_REPAIR, "5\"></div>\n      \n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral0\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "0\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral1\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "1\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral2\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "2\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral3\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "3\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral4\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "4\"></div>\n                      <div class=\"").concat(TRACK.QUALITY_MORAL, " moral5\" id=\"").concat(TRACK_ID.QUALITY_MORAL, "5\"></div>\n      \n                      <div class=\"").concat(TRACK.SUPPLY_AMMO, " ammo0\" id=\"").concat(TRACK_ID.SUPPLY_AMMO, "0\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_AMMO, " ammo1\" id=\"").concat(TRACK_ID.SUPPLY_AMMO, "1\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_AMMO, " ammo2\" id=\"").concat(TRACK_ID.SUPPLY_AMMO, "2\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_AMMO, " ammo3\" id=\"").concat(TRACK_ID.SUPPLY_AMMO, "3\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_AMMO, " ammo4\" id=\"").concat(TRACK_ID.SUPPLY_AMMO, "4\"></div>\n      \n                      <div class=\"").concat(TRACK.SUPPLY_TOOLS, " tools0\" id=\"").concat(TRACK_ID.SUPPLY_TOOLS, "0\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TOOLS, " tools1\" id=\"").concat(TRACK_ID.SUPPLY_TOOLS, "1\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TOOLS, " tools2\" id=\"").concat(TRACK_ID.SUPPLY_TOOLS, "2\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TOOLS, " tools3\" id=\"").concat(TRACK_ID.SUPPLY_TOOLS, "3\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TOOLS, " tools4\" id=\"").concat(TRACK_ID.SUPPLY_TOOLS, "4\"></div>\n      \n                      <div class=\"").concat(TRACK.SUPPLY_TRUMPET, " trumpet0\" id=\"").concat(TRACK_ID.SUPPLY_TRUMPET, "0\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TRUMPET, " trumpet1\" id=\"").concat(TRACK_ID.SUPPLY_TRUMPET, "1\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TRUMPET, " trumpet2\" id=\"").concat(TRACK_ID.SUPPLY_TRUMPET, "2\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TRUMPET, " trumpet3\" id=\"").concat(TRACK_ID.SUPPLY_TRUMPET, "3\"></div>\n                      <div class=\"").concat(TRACK.SUPPLY_TRUMPET, " trumpet4\" id=\"").concat(TRACK_ID.SUPPLY_TRUMPET, "4\"></div>\n      \n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction1\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "1\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction2\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "2\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction3\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "3\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction4\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "4\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction5\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "5\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction6\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "6\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction7\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "7\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction8\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "8\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction9\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "9\"></div>\n                      <div class=\"").concat(TRACK.CITY_DESTRUCTION, " destruction10\" id=\"").concat(TRACK_ID.CITY_DESTRUCTION, "10\"></div>\n              "));
    }
    return CityTableCenter;
}());
