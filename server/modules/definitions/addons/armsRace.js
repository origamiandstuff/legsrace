const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js')

//return console.log('[Arms Race Addon] Disabled by default.');

// Removes the desmos branch and adds the single branch to be upgradable from basic.
// Removes single from assassin branch.
Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter(assassin => assassin !== 'single');
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter(basic => basic !== 'desmos');
Class.basic.UPGRADES_TIER_2.push('single');

// Branches

Class.single.UPGRADES_TIER_3 = ['duo', 'sharpshooter', 'autoSingle'];

// Tanks

// Singles
Class.duo = {
  PARENT: 'genericTank',
  LABEL: 'Duo',
  GUNS: [
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: 5.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                Y: -5.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
                TYPE: "bullet"
            }
        },
    ],
  
};

Class.sharpshooter = {
    PARENT: "genericTank",
    LABEL: "Sharpshooter",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.single, g.sniper]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
        }
    ]
}
Class.ternion = {
    PARENT: "genericTank",
    LABEL: "Ternion",
    BODY: {
        SPEED: 1.1 * base.SPEED
    },
    GUNS: weaponArray({
        POSITION: {
            LENGTH: 18,
            WIDTH: 8
        },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.single]),
            TYPE: "bullet"
        },
        POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0]
    }, 3)
}

Class.avian = makeBird('single', 'Avian');
Class.custodian = makeGuard('single', 'Custodian')
Class.assistant = makeOver('single', 'Assistant', {count: 1, independent: true, cycle: false})
Class.autoSingle = makeAuto('single');
//Sidewinders


Class.hognoseMissile = makeAuto("snakeOld", "Hognose missile", {type: "pilboxTurret", reload: 0.6});
Class.hognose = {
    PARENT: "genericTank",
    LABEL: "Hognose",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.3 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [10, 11, -0.5, 14, 0, 0, 0],
        },
        {
            POSITION: [21, 12, -1.1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.hunter, g.sidewinder]),
                TYPE: "hognoseMissile",
                STAT_CALCULATOR: "sustained",
            },
        },
        {

            POSITION: [2, 11, -0.5, 14, 0, 0, 0],

        },
    ],
}

console.log('[Arms Race Addon] Loaded Arms Race.')