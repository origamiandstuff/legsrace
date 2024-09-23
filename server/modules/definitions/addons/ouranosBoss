const {
  combineStats,
  makeAuto,
  makeOver,
  makeDeco,
  makeGuard,
  makeBird,
  makeRadialAuto,
  weaponArray,
  addBackGunner,
  dereference,
  makeTurret,
  LayeredBoss,
} = require("../facilitators.js");
const { base, statnames, dfltskl, smshskl } = require("../constants.js");
const g = require("../gunvals.js");

//return console.log('[Uranus Boss] Disabled by default.'); //qhar
Class.extraBosses = {
    PARENT: "bosses",
    LABEL: "Extra bosses"
}

// OURANUS TURRETS
Class.triLayerTrapper = {
    PARENT: "genericTank",
    GUNS: [
        {
            POSITION: {
                LENGTH: 40,
                WIDTH: 3, 
                ASPECT: -3
            },
            PROPERTIES: {
                COLOR: 'black'
            }
        }, {
            POSITION: {
                LENGTH: 15,
                WIDTH: 10
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 10,
                ASPECT: 3,
                X: 16
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, {
            POSITION: {
                LENGTH: 4,
                WIDTH: 10.5,
                ASPECT: 1.2,
                X: 17
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, {
            POSITION: {
                LENGTH: 5,
                WIDTH: 7,
                ASPECT: 2,
                X: 12
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }
    ]
}
Class.triLayerTrapperTurret = makeTurret('triLayerTrapper', {canRepel: true, limitFov: true, color: 'mirror', extraStats: [{speed: 1.3, maxSpeed: 1.3}]})
//boss itself
Class.ascendant = { // what the hell is this
    PARENT: "miniboss",
    LABEL: "Ascendant",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    VALUE: 4e6,
    SHAPE: 11,
    SIZE: 90,
    CONTROLLERS: [["minion", {orbit: 300}]],
    BODY: {
        FOV: 1,
        HEALTH: 9000,
        SHIELD: 450,
        REGEN: base.REGEN * 0.3,
        SPEED: base.SPEED * 0.1,
        DAMAGE: 30,
    },
};

// Ascendants
let ouranos = new LayeredBoss(null, "Ouranos", "ascendant", 11, "veryLightGrey", "triLayerTrapperTurret", 6, 5.5);
ouranos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: "kronosSkimmerTurret",
}});
ouranos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: ["carrierTurret", {GUN_STAT_SCALE: g.battleship}],
}}, true, 4);
ouranos.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 160, 0],
    TYPE: ["tripletTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
}}, true, 4);

Class.addons.UPGRADES_TIER_0.push('ouranos');

console.log('[Uranus Boss] Loaded Ouranus Boss');