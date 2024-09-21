const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, addBackGunner } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js')

//return console.log('[Arms Race Addon] Disabled by default.');

// Removes the desmos branch and adds the single branch to be upgradable from basic.
// Removes single from assassin branch.
// Adds the Arms Race menu to the Addons menu
Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter(assassin => assassin !== 'single');
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter(basic => basic !== 'desmos');
Class.basic.UPGRADES_TIER_2.push('single');
Class.addons.UPGRADES_TIER_0.push('armsRace');

// Menu
Class.armsRace = {
    PARENT: "genericTank",
    LABEL: "Arms Race Menu",
    BODY: {
        SHIELD: 1000,
        REGEN: 10,
        HEALTH: 100,
        DAMAGE: 10,
        DENSITY: 20,
        FOV: 2,
    },
    SKILL_CAP: Array(10).fill(dfltskl),
    IGNORED_BY_AI: true,
    RESET_CHILDREN: true,
    ACCEPTS_SCORE: true,
    CAN_BE_ON_LEADERBOARD: true,
    CAN_GO_OUTSIDE_ROOM: false,
    IS_IMMUNE_TO_TILES: false,
    DRAW_HEALTH: true,
    ARENA_CLOSER: true,
    INVISIBLE: [0, 0],
    ALPHA: [0, 1],
    HITS_OWN_TYPE: "hardOnlyTanks",
    NECRO: false,
    SHAPE: [
        [-1, -0.8],
        [-0.8, -1],
        [0.8, -1],
        [1, -0.8],
        [0.2, 0],
        [1, 0.8],
        [0.8, 1],
        [-0.8, 1],
        [-1, 0.8],
    ],
    GUNS: [
        {
            POSITION: [18, 10, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.op]),
                TYPE: "developerBullet"
            }
        }
    ],
}
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
    }, 3),
  GUNS: weaponArray({
    POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
  }, 3)
}

Class.avian = makeBird('single', 'Avian');
Class.custodian = makeGuard('single', 'Custodian');
Class.assistant = makeOver('single', 'Assistant', {count: 1, independent: true, cycle: false});
Class.autoSingle = makeAuto('single');

// Smashers 


// Trappers


// Pounders

// Launchers

Class.inceptionMissile = makeAuto("minimissile", "Inception Missile", {type: "pillboxTurret", reload: 0.6});
Class.inception = {
    PARENT: "genericTank",
    LABEL: "Inception",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [10, 9, 1, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
                TYPE: "inceptionMissile",
                STAT_CALCULATOR: "sustained",
            },
        },
        {

            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: -1,
                X: 17,
                Y: 0,
                ANGLE: 0,
                DELAY: 0},

        },
    ],
}

Class.hognoseMissile = makeAuto("snakeOld", "Hognose missile", {type: "pillboxTurret", reload: 0.6});
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

            POSITION: {
                LENGTH: 4,
                WIDTH: 8,
                ASPECT: -1,
                X: 17,
                Y: 0,
                ANGLE: 0,
                DELAY: 0},

        },
    ],
}

// Directors


// Flank Guards


// Machine Guns


// Snipers

// Assassins
Class.buttbuttin = addBackGunner('assassin', 'Buttbuttin');
Class.hitman = makeOver('assassin', 'Hitman', {count: 1, independent: !0, cycle: !1});
Class.sniper3 = makeRadialAuto('sniperAutoTankGun', { isTurret: !0, danger: 7, label: 'Sniper-3' ,count:3 }),Class.sniper3.BODY.FOV = 1.2;
// Twins



// Branches

Class.armsRace.UPGRADES_TIER_0 = ['inception', 'hognose'];
// Single Branch
Class.single.UPGRADES_TIER_3 = ['duo', 'sharpshooter', 'avian', 'custodian', 'assistant', 'autoSingle'];
// Smasher Branch

// Trapper Branch

// Pounder Branch

// Director Branch

// Flank Guard Branch

// Machine Gun Branch

// Sniper Branch

// Twin Branch

// Tanks


console.log('[Arms Race Addon] Loaded Arms Race.')