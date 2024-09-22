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
} = require("../facilitators.js");
const { base, statnames, dfltskl, smshskl } = require("../constants.js");
const g = require("../gunvals.js");

return console.log('[Uranus Boss] Disabled by default.') // just make the boss like normal, it doesnt have any real difference ex

// URANUS TURRETS
Class.triLayerTrapper = {
    PARENT: "genericTank",
    GUNS: [
        {
            POSITION: {
                LENGTH: 15,
                WIDTH: 7
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 5,
                X: 15
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, {
            POSITION: {
                LENGTH: 4,
                WIDTH: 7.5,
                ASPECT: 4.2,
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
                ASPECT: 5,
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
Class.ascendant = {
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
let uranos = new LayeredBoss(null, "Uranos", "ascendant", 11, "veryLightGrey", "triLayerTrapperTurret", 6, 5.5);
uranos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: "kronosSkimmerTurret",
}});
uranos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: ["carrierTurret", {GUN_STAT_SCALE: g.battleship}],
}}, true, 4);
uranos.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 160, 0],
    TYPE: ["tripletTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
}}, true, 4);

console.log('[Uranus Boss] Loaded Uranus Boss')