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


// Singles
Class.duo = {
  PARENT: 'genericTank',
  LABEL: 'Duo',
  DANGER: 7,
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
    DANGER: 7,
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
Class.sniper3 = makeRadialAuto('sniperAutoTankGun', { isTurret: !0, body: { FOV: 1.2 }, danger: 7, label: 'Sniper-3' ,count:3 });

// Rangers
Class.autoRanger = makeAuto('ranger');
Class.vindicator = {
    PARENT: "genericTank",
    LABEL: "Vindicator",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.8 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [35, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
    ],
}
Class.hawker = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Hawker",
    BODY: {
        SPEED: 0.85 * base.SPEED,
        FOV: 1.35 * base.FOV
    },
    INVISIBLE: [0.08, 0.03],
    TOOLTIP: "Stay still to turn invisible.",
    GUNS: [
        {
            POSITION: [32, 8, -1.8, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        }
    ]
}

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