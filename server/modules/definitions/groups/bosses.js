const { combineStats, skillSet, makeAuto, addAura, LayeredBoss, makeDeco, weaponArray, setTurretProjectileRecoil } = require('../facilitators.js');
const { base, smshskl } = require('../constants.js');
const g = require('../gunvals.js');
require('./generics.js');
require('./tanks.js');
require('./turrets.js');

Class.miniboss = {
    PARENT: "genericBoss",
    CONTROLLERS: ["nearestDifferentMaster", "minion", "canRepel"],
    AI: { NO_LEAD: true },
}
Class.ramMiniboss = {
    PARENT: "genericBoss",
    CONTROLLERS: ["nearestDifferentMaster", "canRepel", "mapTargetToGoal"],
}

// ELITE CRASHERS
Class.elite = {
    PARENT: "miniboss",
    LABEL: "Elite Crasher",
    COLOR: "pink",
    SHAPE: 3,
    SIZE: 27,
    VALUE: 15e4,
    BODY: {
        FOV: 1.25,
        SPEED: 0.15 * base.SPEED,
        HEALTH: 7 * base.HEALTH,
        DAMAGE: 2.5 * base.DAMAGE,
        REGEN: 0.5 * base.REGEN,
    },
}
Class.eliteDestroyer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Destroyer",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray({
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 3),
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: "crasherSpawner",
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.eliteGunner = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Gunner",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: "auto4gun",
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: "auto4gun",
        },
    ],
}
Class.eliteSprayer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer",
    UPGRADE_COLOR: "pink",
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    AI: { NO_LEAD: false },
    HAS_NO_RECOIL: true,
    TURRETS: [
        {
            POSITION: [6, 0, 0, 0, 360, 1],
            TYPE: ["machineTripleTurret", { INDEPENDENT: true }],
        },
        ...weaponArray([
            {
                POSITION: [9, 6, -5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            }, {
                POSITION: [9, 6, 5, 60, 130, 0],
                TYPE: ["sprayer", { COLOR: "grey", GUN_STAT_SCALE: {damage: 0.9, resist: 0.95} }],
            }, 
        ], 3)
    ],
}
Class.eliteBattleship = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Battleship",
    UPGRADE_COLOR: "pink",
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 0.95, maxSpeed: 0.95, health: 1.1, resist: 1.05}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.eliteSpawner = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spawner",
    UPGRADE_COLOR: "pink",
    MAX_CHILDREN: 9,
    AI: { STRAFE: false },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentrySwarmMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryTrapMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.6, maxSpeed: 0.6, heath: 1.35}]),
                TYPE: "sentryGunMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}
Class.eliteTrapGuard = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Trap Guard",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    GUNS: weaponArray([
        {
            POSITION: [10.5, 6, 1, 0, 0, 60, 0],
        }, {
            POSITION: [3, 6, 1.7, 10.5, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {speed: 1.1, maxSpeed: 1.1, reload: 1.5, damage: 1.6}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: "triTrapGuardTurret",
        },
        ...weaponArray([
            {
                POSITION: [5, 8, -7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            }, {
                POSITION: [5, 8, 7, 60, 160, 0],
                TYPE: ["autoTurret", { INDEPENDENT: false, GUN_STAT_SCALE: {health: 1.1} }],
            },
        ], 3)
    ],
}
Class.eliteSpinner = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Spinner",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false },
    FACING_TYPE: ["spin", {speed: 0.08}],
    GUNS: weaponArray([
        {
            POSITION: [9.5, 2, 1, -1.5, 11.5, 10, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9.5, 2, 1, 3.5, 6.5, 10, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [9.5, 2, 1, 8.5, 1.5, 10, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.5, maxSpeed: 1.25 }]),
                TYPE: "bullet",
            },
        }, {
            POSITION: [2, 20, 0.75, 8, 0, 60, 0],
        },
    ], 3),
    TURRETS: [
        {
            POSITION: [9.5, 0, 0, 0, 360, 1],
            TYPE: ["eliteSpinnerCyclone", {COLOR: -1}],
        },
    ],
}

// OLD ELITE
Class.oldEliteSprayer = {
    PARENT: "elite",
    UPGRADE_LABEL: "Elite Sprayer (Old)",
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: [ "sprayer", { COLOR: -1 } ],
    }, 3)
};

// Legions
Class.destroyerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Destroyer Legion",
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: weaponArray({
        POSITION: [5, 16, 1, 6, 0, 60, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer, {health: 1.1}]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 3),
    TURRETS: [
        ...weaponArray({
            POSITION: [11, 0, 0, 60, 360, 0],
            TYPE: ["crasherSpawner", {GUN_STAT_SCALE: {health: 1.1}}],
        }, 3),
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: [ "bigauto4gun", { GUN_STAT_SCALE: {health: 1.1}, INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
}
Class.gunnerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Gunner Legion",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [14, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 16, 1.5, 14, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, {health: 1.1, speed: 1.5, range: 0.3}]),
                TYPE: "unsetPillbox",
                STAT_CALCULATOR: "trap",
            },
        }, {
            POSITION: [6, 14, -2, 2, 0, 60, 0],
        }, {
            POSITION: [6, 14, -2, 2, 0, 300, 0],
        },
    ],
    TURRETS: [
        {
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.15}}],
        }, {
            POSITION: [14, 8, 0, 300, 180, 0],
            TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.15}}],
        },
    ],
}
Class.sprayerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Sprayer Legion",
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    SKILL: [0, 9, 3, 9, 2, 9, 9, 9, 9, 0],
    HAS_NO_RECOIL: true,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    TURRETS: weaponArray({
        POSITION: [14, 6, 0, 60, 190, 0],
        TYPE: ["machineGun", {GUN_STAT_SCALE: {health: 1.1, damage: 1.2, speed: 1.2, resist: 1.05}, COLOR: -1}],
    }, 3)
}
Class.battleshipLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Battleship Legion",
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: weaponArray([
        {
            POSITION: [4, 6, 0.6, 7, -8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 0, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, {
            POSITION: [4, 6, 0.6, 7, 8, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship, {speed: 1.05, maxSpeed: 1.05, health: 1.2, resist: 1.1}]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 360, 1],
        TYPE: [ "autoTankGun", { GUN_STAT_SCALE: {health: 1.1}, INDEPENDENT: true, COLOR: -1 } ],
    }, 3)
}
Class.spawnerLegion = {
    PARENT: "elite",
    UPGRADE_LABEL: "Spawner Legion",
    UPGRADE_COLOR: "pink",
    AI: { NO_LEAD: false },
    SIZE: 30,
    BODY: {
        HEALTH: 8 * base.HEALTH,
    },
    GUNS: [
        {
            POSITION: [11, 16, 1, 0, 0, 60, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 180, 0],
        }, {
            POSITION: [11, 16, 1, 0, 0, 300, 0],
        }, {
            POSITION: [2, 18, 1, 11, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentrySwarmMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentryTrapMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        }, {
            POSITION: [2, 18, 1, 11, 0, 300, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, {reload: 2, size: 0.5, speed: 0.65, maxSpeed: 0.65, heath: 1.5}]),
                TYPE: "sentryGunMinion",
                SYNCS_SKILLS: true,
                AUTOFIRE: true,
                STAT_CALCULATOR: "drone",
            },
        },
    ],
    TURRETS: [
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: ["auto4gun", { GUN_STAT_SCALE: {health: 1.15}, INDEPENDENT: false, COLOR: -1 }],
        },
    ],
}

// Legionary Crasher
Class.legionaryCrasherTop = {
    PARENT: "elite",
    AI: { STRAFE: false, NO_LEAD: false },
    CONTROLLERS: [ ["spin", { independent: true, speed: -0.005 }] ],
    INDEPENDENT: true,
    GUNS: weaponArray([
        {
            POSITION: [4, 9.5, 0.7, 7, 5, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                TYPE: [ "swarm", { INDEPENDENT: true } ],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
                
            },
        }, {
            POSITION: [4, 9.5, 0.7, 7, -5, 60, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.pounder, { speed: 2, maxSpeed: 1.7, size: 0.6, range: 2.8}]),
                TYPE: [ "swarm", { INDEPENDENT: true } ],
                STAT_CALCULATOR: "swarm",
                AUTOFIRE: true,
            },
        },
    ], 3),
    TURRETS: weaponArray({
        POSITION: [9.5, 10, 0, 0, 190, 0],
        TYPE: ["auto4gun", {GUN_STAT_SCALE: {damage: 1.4, health: 1.1, speed: 1.2, maxSpeed: 1.2, resist: 1.1, range: 1.3}}],
    }, 3),
}
Class.legionaryCrasherSpawner = {
    PARENT: 'genericTank',
    SHAPE: "",
    INDEPENDENT: true,
    GUNS: [{
        POSITION: [0, 10, 0, 0, 0, 0, 10],
        PROPERTIES: {
            TYPE: 'destroyerLegion',
            SHOOT_SETTINGS: combineStats([{reload: 0.1}]),
            INDEPENDENT_CHILDREN: true,
            MAX_CHILDREN: 3,
            IDENTIFIER: 1,
            AUTOFIRE: true,
        }
    }],
    ON: [{
        event: "fire",
        handler: ({ gun }) => {
            gun.setBulletType(["destroyerLegion", "gunnerLegion", "sprayerLegion", "battleshipLegion", "spawnerLegion"][gun.identifier++ % 5]);
        }
    }],
}
Class.legionaryCrasher = {
    PARENT: "elite",
    LABEL: "Legionary Crasher",
    UPGRADE_COLOR: "pink",
    AI: { STRAFE: false, NO_LEAD: false },
    HAS_NO_RECOIL: true,
    VALUE: 5e6,
    SIZE: 75,
    BODY: {
        FOV: 1.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 2000,
        DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: [
        ...weaponArray([
            {
                POSITION: [14.5, 13, 1, 0, 0, 0, 0],
            }, {
                POSITION: [3, 13, 1.7, 14.5, 0, 0, 0],
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.pounder, { reload: 2, speed: 2, size: 0.65, maxSpeed: 2, range: 0.65 }]),
                    TYPE: "legionaryPillbox",
                    STAT_CALCULATOR: "trap",
                },
            },
        ], 3),
        ...weaponArray({
            POSITION: [5, 12, 1.6, -11, 0, 0, 0],
        }, 3),
    ],
    TURRETS: [
        {
            POSITION: [12, 0, 0, 0, 360, 1],
            TYPE: "legionaryCrasherTop",
        },
        ...weaponArray({
            POSITION: [14, 8, 0, 60, 180, 0],
            TYPE: [ "sprayer", { GUN_STAT_SCALE: {speed: 1.3, health: 1.5, damage: 1.4, resist: 1.2}, COLOR: -1 } ],
        }, 3),
        {
            POSITION: [12, 0, 0, 0, 0, 0],
            TYPE: 'legionaryCrasherSpawner'
        }
    ],
}

// STRANGE BOSSES
Class.sorcerer = {
    PARENT: "miniboss",
    LABEL: "Sorcerer",
    DANGER: 7,
    SHAPE: 0,
    COLOR: "veryLightGrey",
    UPGRADE_COLOR: "veryLightGrey",
    SIZE: 26,
    MAX_CHILDREN: 50,
    VALUE: 2e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.12 * base.SPEED,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.machineGun, g.machineGunner, { damage: 1.8, size: 0.4, spray: 150, speed: 2, shudder: 1.75 }]),
            TYPE: "minichip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 2)
};
Class.summoner = {
    PARENT: "miniboss",
    LABEL: "Summoner",
    DANGER: 8,
    SHAPE: 4,
    COLOR: "gold",
    UPGRADE_COLOR: "gold",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 3e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.1 * base.SPEED,
        HEALTH: 7 * base.HEALTH,
        DAMAGE: 2.6 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.8 }]),
            TYPE: "summonerDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 4)
};
Class.enchantress = {
    PARENT: "miniboss",
    LABEL: "Enchantress",
    DANGER: 8,
    SHAPE: 3.5,
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    SIZE: 26,
    MAX_CHILDREN: 28,
    VALUE: 4e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.09 * base.SPEED,
        HEALTH: 10 * base.HEALTH,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, { size: 0.9, damage: 1.1 }]),
            TYPE: "dorito",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 3)
};
Class.exorcistor = {
    PARENT: "miniboss",
    LABEL: "Exorcistor",
    DANGER: 8,
    SHAPE: 5.5,
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 5e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.08 * base.SPEED,
        HEALTH: 15 * base.HEALTH,
        DAMAGE: 4 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {maxSpeed: 1.2}]),
            TYPE: "demonchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 5)
};
Class.shaman = {
    PARENT: "miniboss",
    LABEL: "Shaman",
    DANGER: 8,
    SHAPE: 6,
    COLOR: "hexagon",
    UPGRADE_COLOR: "hexagon",
    SIZE: 26,
    MAX_CHILDREN: 20,
    VALUE: 6e5,
    BODY: {
        FOV: 0.5,
        SPEED: 0.07 * base.SPEED,
        HEALTH: 20 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [3.5, 8.65, 1.2, 8, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, { size: 1.1, maxSpeed: 1.2, damage: 1.1 }]),
            TYPE: "realchip",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
        },
    }, 6)
};
Class.eliteSkimmer = {
    PARENT: "elite",
    LABEL: "Elite Skimmer",
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    TURRETS: weaponArray({
            POSITION: [15, 5, 0, 60, 170, 0],
            TYPE: "skimmerTurret",
        }, 3)
};

// Nesters
Class.nestKeeper = {
    PARENT: "miniboss",
    LABEL: "Nest Keeper",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    MAX_CHILDREN: 15,
    VALUE: 3e5,
    GUNS: weaponArray({
        POSITION: [3.5, 6.65, 1.2, 8, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.nestKeeper]),
            TYPE: "drone",
            AUTOFIRE: true,
            LABEL: "Mega Crasher",
            STAT_CALCULATOR: "drone",
        },
    }, 5),
    TURRETS: [
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "auto4gun", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5),
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "boomerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
    ],
};
Class.nestWarden = {
    PARENT: "miniboss",
    LABEL: "Nest Warden",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    VALUE: 3e5,
    GUNS: weaponArray([
        {
            POSITION: [10.7, 8, 1, 0, 0, 36, 0],
        }, {
            POSITION: [1.5, 8, 1.2, 10.7, 0, 36, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, { speed: 1.2 }, g.setTrap, g.constructor]),
                TYPE: "unsetTrap",
                STAT_CALCULATOR: "block"
            },
        }
    ], 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "barricadeTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "cruiserTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}
Class.nestGuardian = {
    PARENT: "miniboss",
    LABEL: "Nest Guardian",
    COLOR: "purple",
    UPGRADE_COLOR: "purple",
    SHAPE: 5,
    SIZE: 50,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.25,
        HEALTH: base.HEALTH * 9,
        SHIELD: base.SHIELD * 1.5,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 2.5,
    },
    VALUE: 3e5,
    GUNS: weaponArray({
        POSITION: [5.5, 7, 1, 6, 0, 36, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pounder, g.destroyer]),
            TYPE: "bullet",
            LABEL: "Devastator",
        },
    }, 5),
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: [ "twisterTurret", { INDEPENDENT: true, COLOR: -1 } ],
        },
        ...weaponArray({
            POSITION: [8, 9, 0, 0, 120, 0],
            TYPE: [ "swarmerTurret", { INDEPENDENT: true, COLOR: -1 } ],
        }, 5)
    ],
}

// Rogues
Class.roguePalisade = {
    PARENT: "miniboss",
    LABEL: "Rogue Palisade",
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 6,
    SIZE: 30,
    VALUE: 5e5,
    CONTROLLERS: ['nearestDifferentMaster', 'onlyAcceptInArc'],
    BODY: {
        FOV: 1.4,
        SPEED: 0.05 * base.SPEED,
        HEALTH: 16 * base.HEALTH,
        SHIELD: 3 * base.SHIELD,
        DAMAGE: 3 * base.DAMAGE,
    },
    GUNS: weaponArray({
        POSITION: [4, 6, -1.6, 8, 0, 0, 0], 
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.factory, g.pounder, { reload: 2, damage: 0.7, density: 0.6 }]),
            TYPE: ["minion", {INDEPENDENT: true}],
            STAT_CALCULATOR: "drone",
            AUTOFIRE: true,
            MAX_CHILDREN: 3,
            SYNCS_SKILLS: true,
            WAIT_TO_CYCLE: true
        }
    }, 6),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 30, 110, 0],
        TYPE: ["baseTrapTurret", {GUN_STAT_SCALE: {health: 0.7, damage: 0.8}}]
    }, 6)
};
Class.rogueArmada = {
    PARENT: "miniboss",
    LABEL: 'Rogue Armada',
    COLOR: "darkGrey",
    UPGRADE_COLOR: "darkGrey",
    SHAPE: 7,
    SIZE: 28,
    VALUE: 500000,
    BODY: {
        FOV: 1.3,
        SPEED: base.SPEED * 0.1,
        HEALTH: base.HEALTH * 16,
        SHIELD: base.SHIELD * 3,
        REGEN: base.REGEN,
        DAMAGE: base.DAMAGE * 3,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 2, 1, 0, -2, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8, 2, 1, 0, -1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8, 2, 1, 0, -1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 3, 1, 0, 0.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 4, 1, 0, 1, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "bullet"
            }
        }, {
            POSITION: [8, 4, 1, 0, 1.5, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2, damage: 1.5, health: 1.5, resist: 1.25}]),
                TYPE: "casing"
            }
        }, {
            POSITION: [8.5, 6, 1, 4, 0, 360 / 14, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.shotgun, g.pounder, {reload: 2}, g.fake]),
                TYPE: "casing"
            }
        }, {
            POSITION: [7, 6, -1.6, 4, 0, 360 / 14, 0]
        }
    ], 7),
    TURRETS: weaponArray({
        POSITION: [5, 10, 0, 0, 110, 0],
        TYPE: "shottrapTurret"
    }, 7),
}

// Bob.
Class.bob = {
    PARENT: "ramMiniboss",
    LABEL: "Bob",
    SHAPE: 0,
    COLOR: "aqua",
    UPGRADE_COLOR: "aqua",
    SIZE: 18,
    BODY: {
        FOV: 2,
        SPEED: 2 * base.SPEED,
        HEALTH: 5 * base.HEALTH,
        DAMAGE: 5 * base.DAMAGE,
        REGEN: 8 * base.REGEN,
        FOV: 0.5 * base.FOV,
        DENSITY: 6 * base.DENSITY,
    },
    CONTROLLERS: ["nearestDifferentMaster", "mapTargetToGoal"],
    TURRETS: [
        {
            POSITION: [21.5, 0, 0, 0, 360, 0],
            TYPE: "smasherBody",
        }, {
            POSITION: [21.5, 0, 0, 30, 360, 0],
            TYPE: "landmineBody",
        }, {
            POSITION: [23.75, 0, 0, 0, 360, 0],
            TYPE: "spikeBody",
        },
    ],
};
Class.nemesis = {
    PARENT: "bob",
    LABEL: "Nemesis",
    COLOR: "red",
    UPGRADE_COLOR: "red",
    BODY: {
        REGEN: 1e5,
        HEALTH: 1e6,
        DENSITY: 30,
        DAMAGE: 1e5,
        FOV: 5,
    },
};

// DIEP BOSSES
Class.guardian = {
    PARENT: "elite",
    LABEL: "Guardian of the Pentagons",
    UPGRADE_LABEL: "Guardian",
    UPGRADE_COLOR: "pink",
    FACING_TYPE: "toTarget",
    GUNS: [
        {
            POSITION: [4, 12, 1.4, 8, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, { size: 0.5 }]),
                TYPE: "swarm",
                AUTOFIRE: true,
            },
        },
    ],
    AI: { NO_LEAD: false },
};
Class.defenderAutoTankGun = {
    PARENT: "autoTankGun",
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret]),
                TYPE: ["bullet", {COLOR: "yellow"}],
            },
        },
    ],
};
Class.defender = {
    PARENT: "elite",
    LABEL: "Defender",
    COLOR: "orange",
    UPGRADE_COLOR: "orange",
    GUNS: weaponArray([
        {
            POSITION: [15, 7, 1, -3, 0, 60, 0],
        }, {
            POSITION: [3, 7, 1.7, 12, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.flankGuard, {reload: 1.33, damage: 2.5}]),
                TYPE: ["trap", {COLOR: "yellow"}],
                STAT_CALCULATOR: "trap",
            },
        }, 
    ], 3),
    TURRETS: weaponArray({
        POSITION: [5, 7, 0, 0, 190, 1],
        TYPE: "defenderAutoTankGun",
    }, 3),
    AI: { NO_LEAD: false },
};

// CELESTIALS
Class.terrestrial = {
    PARENT: "miniboss",
    LABEL: "Terrestrial",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    VALUE: 5e5,
    SHAPE: 7,
    SIZE: 35,
    CONTROLLERS: [["minion", {orbit: 170}]],
    BODY: {
        FOV: 1,
        HEALTH: 1000,
        SHIELD: 50,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.3,
        DAMAGE: 9,
    },
};
Class.celestial = {
    PARENT: "miniboss",
    LABEL: "Celestial",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    VALUE: 1e6,
    SHAPE: 9,
    SIZE: 45,
    CONTROLLERS: [["minion", {orbit: 200}]],
    BODY: {
        FOV: 1,
        HEALTH: 1500,
        SHIELD: 75,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.2,
        DAMAGE: 12,
    },
};
Class.rogueCelestial = {
    PARENT: "celestial",
    LABEL: "Rogue Celestial",
    COLOR: "darkGrey",
};
Class.eternal = {
    PARENT: "miniboss",
    LABEL: "Eternal",
    SKILL: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
    VALUE: 4e6,
    SHAPE: 11,
    SIZE: 90,
    CONTROLLERS: [["minion", {orbit: 240}]],
    BODY: {
        FOV: 1,
        HEALTH: 3000,
        SHIELD: 150,
        REGEN: base.REGEN * 0.1,
        SPEED: base.SPEED * 0.15,
        DAMAGE: 18,
    },
};

// Terrestrials
let ares = new LayeredBoss(null, "Ares", "terrestrial", 7, "purple", "terrestrialTrapTurret", 7, 5.5);
ares.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["demonchip", { INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, false, null, 18);
ares.addLayer({turret: {
    POSITION: [10, 8.5, 0, null, 160, 0],
    TYPE: ["protoSwarmerTurret", { INDEPENDENT: true }],
}}, true, 6.5);

let gersemi = new LayeredBoss(null, "Gersemi", "terrestrial", 7, "lightGreen", "terrestrialTrapTurret", 7, 5.5);
gersemi.addLayer({turret: {
    POSITION: [9, 8, 0, null, 160, 0],
    TYPE: ["swarmTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.7, damage: 1.2} }],
}});
gersemi.addLayer({turret: {
    POSITION: [9.5, 7.5, 0, null, 160, 0],
    TYPE: ["basicTurret", { INDEPENDENT: true, GUN_STAT_SCALE: {health: 1.8, damage: 1.3} }],
}}, true, 6.5);

let ezekiel = new LayeredBoss(null, "Ezekiel", "terrestrial", 7, "orange", "terrestrialTrapTurret", 7, 5.5);
ezekiel.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["dorito", { COLOR: "orange", INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 18);
ezekiel.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("skimmerTurret", 0.5), { COLOR: "grey", INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.5} }],
}}, true, 6.5)

let eris = new LayeredBoss(null, "Eris", "terrestrial", 7, "pink", "terrestrialTrapTurret", 7, 5.5);
eris.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
        TYPE: ["minion", { INDEPENDENT: true, COLOR: "pink" }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, false, null, 14);
eris.addLayer({turret: {
    POSITION: [10, 8.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("rocketeerTurret", 0.43), { INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.43} }],
}}, true, 6.5);

let selene = new LayeredBoss(null, "Selene", "terrestrial", 7, "gold", "terrestrialTrapTurret", 7, 5.5);
selene.addLayer({gun: {
    POSITION: [3.75, 7, 1.2, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.2, damage: 1.1, resist: 1.1, density: 1.5, maxSpeed: 1.25}]),
        TYPE: ["summonerDrone", { COLOR: "gold", INDEPENDENT: true }],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 18);
selene.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["hyperTwisterTurret", { INDEPENDENT: true }],
}}, true, 6.5);

// PALADIN
let paladin = new LayeredBoss(null, "Paladin", "celestial", 9, "purple", "baseTrapTurret", 6.5, 5.5);
paladin.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["demonchip", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
        STAT_CALCULATOR: "drone",
        WAIT_TO_CYCLE: true,
    },
}}, true, null, 16);
paladin.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["swarmerTurret", {GUN_STAT_SCALE: {speed: 1.45, maxSpeed: 0.5, health: 1.3, range: 1.3}}],
}}, true, 6);

// FREYJA
let freyja = new LayeredBoss(null, "Freyja", "celestial", 9, "lightGreen", "baseTrapTurret", 6.5, 5.5);
freyja.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: ["cruiserTurret", {GUN_STAT_SCALE: {health: 1.2, damage: 1.3, speed: 1.1, maxSpeed: 1.1, resist: 1.05}}],
}});
freyja.addLayer({turret: {
    POSITION: [10.6, 7.5, 0, null, 160, 0],
    TYPE: ["auto4gun", {GUN_STAT_SCALE: {health: 1.2, damage: 1.2, speed: 1.15, maxSpeed: 0.9, resist: 1.2}}],
}}, true, 6);

// ZAPHKIEL
let zaphkiel = new LayeredBoss(null, "Zaphkiel", "celestial", 9, "orange", "baseTrapTurret", 6.5, 5.5);
zaphkiel.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["dorito", {INDEPENDENT: true}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
zaphkiel.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("skimmerTurret", 0.65), {COLOR: "grey", INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.65}}],
}}, true, 6);

// NYX
let nyx = new LayeredBoss(null, "Nyx", "celestial", 9, "pink", "baseTrapTurret", 6.5, 5.5);
nyx.addLayer({gun: {
    POSITION: [3.8, 7, -1.4, 8, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.factory, { size: 0.7, maxSpeed: 0.85, damage: 0.8 }]),
        TYPE: ["minion", {INDEPENDENT: true,}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 16);
nyx.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("rocketeerTurret", 0.5), { INDEPENDENT: true, GUN_STAT_SCALE: {maxSpeed: 0.5} }],
}}, true, 6);

// THEIA
let theia = new LayeredBoss(null, "Theia", "celestial", 9, "gold", "baseTrapTurret", 6.5, 5.5);
theia.addLayer({gun: {
    POSITION: [3.8, 6, 1.4, 8, 0, null, 1],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.destroyer, {health: 1.4, damage: 1.4, resist: 1.2, density: 1.8, maxSpeed: 1.325}]),
        TYPE: ["summonerDrone", {INDEPENDENT: true}],
        AUTOFIRE: true,
        WAIT_TO_CYCLE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 35);
theia.addLayer({turret: {
    POSITION: [10, 7.5, 0, null, 160, 0],
    TYPE: ["twisterTurret", {INDEPENDENT: true, COLOR: "grey", GUN_STAT_SCALE: {health: 1.3, damage: 1.1, resist: 1.2, speed: 1.1, maxSpeed: 0.8}}],
}}, true, 6);

// ATLAS
let atlas = new LayeredBoss(null, "Atlas", "celestial", 9, "purple", "baseTrapTurret", 6.5, 5.5);
atlas.addLayer({turret: {
    POSITION: [7, 9, 0, null, 180, 0],
    TYPE: "artilleryTurret",
}});
atlas.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: ["nailgunTurret", {GUN_STAT_SCALE: {speed: 1.1, maxSpeed: 1.1, resist: 1.3}}],
}}, true, 6);

// RHEA
let rhea = new LayeredBoss(null, "Rhea", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
rhea.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "wrenchTurret",
}});
rhea.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "crowbarTurret",
}}, true, 6);

// JULIUS
let julius = new LayeredBoss(null, "Julius", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
julius.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "juliusLowerTurret",
}});
julius.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: [setTurretProjectileRecoil("launcherTurret", 0.82), {GUN_STAT_SCALE: {health: 1.3, damage: 1.3, maxSpeed: 0.82}}],
}}, true, 6);

// GENGHIS
let genghis = new LayeredBoss(null, "Genghis", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
genghis.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "genghisLowerTurret",
}});
genghis.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: ["auto4gun", {GUN_STAT_SCALE: {speed: 1.2, maxSpeed: 0.85, health: 1.15, damage: 1.2, resist: 1.2}}],
}}, true, 6);

// NAPOLEON
let napoleon = new LayeredBoss(null, "Napoleon", "celestial", 9, "darkGrey", "baseTrapTurret", 6.5, 5.5);
napoleon.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 180, 0],
    TYPE: "napoleonLowerTurret",
}});
napoleon.addLayer({turret: {
    POSITION: [10.5, 8, 0, null, 160, 0],
    TYPE: "napoleonUpperTurret",
}}, true, 6)

// Eternals
let kronos = new LayeredBoss(null, "Kronos", "eternal", 11, "veryLightGrey", "baseTrapTurret", 6, 5.5);
kronos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: "kronosSkimmerTurret",
}});
kronos.addLayer({turret: {
    POSITION: [6.5, 9, 0, null, 160, 0],
    TYPE: ["carrierTurret", {GUN_STAT_SCALE: g.battleship}],
}}, true, 4);
kronos.addLayer({turret: {
    POSITION: [8.5, 9, 0, null, 160, 0],
    TYPE: ["tripletTurret", {GUN_STAT_SCALE: {health: 1.15, damage: 1.1, resist: 1.3, speed: 1.1, maxSpeed: 0.9}}],
}}, true, 4);

let odin = new LayeredBoss(null, "Odin", "eternal", 11, "aqua", "baseTrapTurret", 4.5, 3.5);
odin.addLayer({gun: {
    POSITION: [2.25, 3.25, -1.6, 9, 0, null, 0],
    PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.drone, g.summoner, g.pounder, g.destroyer, {speed: 1.25, maxSpeed: 1.25}]),
        TYPE: ["realchip", {INDEPENDENT: true, DRAW_HEALTH: true, COLOR: 'hexagon'}],
        AUTOFIRE: true,
        SYNCS_SKILLS: true,
    },
}}, true, null, 18);
odin.addLayer({turret: {
    POSITION: [7, 8, 0, null, 160, 0],
    TYPE: "autoSmasherLauncherTurret",
}}, true, 5.5);
odin.addLayer({turret: {
    POSITION: [8, 9, 0, null, 160, 0],
    TYPE: "gunnerCruiserTurret",
}}, true, 4.5);


const divide = 1000;
const arraySize = 10;
const colorArray = [];
const damageMultiplayer = 3.5;
const reloadMultiplayer = 2;
for (let i = 0; i < arraySize; i++) {
    const rgb = Math.round(255 * i / (arraySize - 1));
    colorArray.push('#' + ((1 << 24) + (rgb << 16) + (rgb << 8) + rgb).toString(16).slice(1));
}
class io_nearestDifferentMaster2 extends ioTypes.nearestDifferentMaster {
    constructor(body, opts = {}) {
        super(body);
        this.lookAtDanger = opts.lookAtDanger ?? true;
        this.firingAtMe = opts.firingAtMe ?? false;
        this.timeout = opts.timeout || 90;
    }
    buildList(range) {
        // Establish whom we judge in reference to
        let mostDangerous = 0,
            keepTarget = false;
        // Filter through everybody...
        let out = entities.filter(e =>
            // Only look at those within our view, and our parent's view, not dead, not invisible, not our kind, not a bullet/trap/block etc
            this.validate(e, this.body, this.body.master.master, range * range, range * range * 4 / 3)
        ).filter((e) => {
            // Only look at those within range and arc (more expensive, so we only do it on the few)
            if (this.body.firingArc == null || this.body.aiSettings.view360 || Math.abs(util.angleDifference(util.getDirection(this.body, e), this.body.firingArc[0])) < this.body.firingArc[1]) {
                mostDangerous = Math.max(e.dangerValue, mostDangerous);
                return true;
            }
        }).filter((e) => {
            // Even more expensive
            return !this.wouldHitWall(this.body, e);
        }).filter((e) => {
            // Only return the highest tier of danger
            if (!this.lookAtDanger) return true;
            if (this.body.aiSettings.farm || e.dangerValue === mostDangerous) {
                if (this.targetLock && e.id === this.targetLock.id) keepTarget = true;
                return true;
            }
        });
        // Reset target if it's not in there
        if (!keepTarget) this.targetLock = undefined;
        return out;
    }
    think(input) {
        // Override target lock upon other commands
        if (input.main || input.alt || this.body.master.autoOverride) {
            this.targetLock = undefined;
            return {};
        }
        // Otherwise, consider how fast we can either move to ram it or shoot at a potiential target.
        let tracking = this.body.topSpeed,
            damageRef = (this.body.bond == null) ? this.body : this.body.bond,
            range = this.body.fov;
        // Use whether we have functional guns to decide
        for (let i = 0; i < this.body.guns.length; i++) {
            if (this.body.guns[i].canShoot && !this.body.aiSettings.SKYNET) {
                let v = this.body.guns[i].getTracking();
                if (v.speed == 0 || v.range == 0) continue;
                tracking = v.speed;
                range = Math.min(range, (v.speed || 1.5) * (v.range < (this.body.size * 2) ? this.body.fov : v.range));
                break;
            }
        }
        if (!Number.isFinite(tracking)) {
            tracking = this.body.topSpeed + .01;
        }
        if (!Number.isFinite(range)) {
            range = 640 * this.body.FOV;
        }
        // Check if my target's alive
        if (this.targetLock && (
            !this.validate(this.targetLock, this.body, this.body.master.master, range * range, range * range * 4 / 3) ||
            this.wouldHitWall(this.body, this.targetLock) // Very expensive
        )) {
            this.targetLock = undefined;
            this.tick = 100;
        }
        // Think damn hard
        if (this.tick++ > 15 * Config.runSpeed) {
            this.tick = 0;
            this.validTargets = this.buildList(range);
            // Ditch our old target if it's invalid
            if (this.targetLock && this.validTargets.indexOf(this.targetLock) === -1) {
                this.targetLock = undefined;
            }
            // Lock new target if we still don't have one.
            if (this.targetLock == null && this.validTargets.length) {
                this.targetLock = (this.validTargets.length === 1) ? this.validTargets[0] : nearest(this.validTargets, {
                    x: this.body.x,
                    y: this.body.y
                });
                this.tick = -this.timeout;
            }
        }
        // Lock onto whoever's shooting me.
        if (this.firingAtMe && damageRef.collisionArray.length && damageRef.health.display() < this.oldHealth) {
            this.oldHealth = damageRef.health.display();
            if (this.validTargets.indexOf(damageRef.collisionArray[0]) === -1) {
                let a = (damageRef.collisionArray[0].master.id === -1)
                    ? damageRef.collisionArray[0].source
                    : damageRef.collisionArray[0].master;
                if (
                    this.body.firingArc == null ||
                    this.body.aiSettings.view360 ||
                    Math.abs(util.angleDifference(util.getDirection(this.body, a), this.body.firingArc[0])) < this.body.firingArc[1]
                ) {
                    this.targetLock = a;
                    this.tick = -(this.timeout * 5);
                }
            }
        }
        // Consider how fast it's moving and shoot at it
        if (this.targetLock != null) {
            let radial = this.targetLock.velocity;
            let diff = {
                x: this.targetLock.x - this.body.x,
                y: this.targetLock.y - this.body.y,
            }
            /// Refresh lead time
            if (this.tick % 4 === 0) {
                this.lead = 0
                // Find lead time (or don't)
                if (!this.body.aiSettings.chase) {
                    let toi = timeOfImpact(diff, radial, tracking)
                    this.lead = toi
                }
            }
            if (!Number.isFinite(this.lead)) {
                this.lead = 0;
            }
            if (!this.accountForMovement) this.lead = 0;
            // And return our aim
            return {
                target: {
                    x: diff.x + this.lead * radial.x,
                    y: diff.y + this.lead * radial.y,
                },
                fire: true,
                main: true
            };
        }
        return {};
    }
}
ioTypes.nearestDifferentMaster2 = io_nearestDifferentMaster2;
Class.toothlessBase = {
    PARENT: "genericTank",
    LABEL: "NightFury",
	UPGRADE_TOOLTIP: "A cute...",
    GLOW: {
        RADIUS: 2,
        COLOR: 42,
        ALPHA: 0.6,
        RECURSION: 6,
    },
	BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV,
        HEALTH: 6 * base.HEALTH,
        DAMAGE: 2 * base.DAMAGE,
    },
    LEVEL_CAP: 45,
    EXTRA_SKILL: 78, // 120 - 42
    SHAPE: 3,
    VALUE: 30e+3,
    SIZE: 24,
    COLOR: "purple",
    SKILL_CAP: Array(10).fill(smshskl + 3),
    LEVEL_SKILL_POINT_FUNCTION: level => {
        if (level < 2) return 0;
        if (level <= 40) return 1;
        if (level <= 45 && level & 1 == 1) return 1;
        return 0;
    },
}
Class.toothlessBossTurret = {
    PARENT: "genericTank",
    LABEL: "",
    BODY: {
        FOV: 3,
    },
    CONTROLLERS: [
        "onlyAcceptInArc",
        [ "nearestDifferentMaster2", { lookAtDanger: false, firingAtMe: true, timeout: 10 } ],
    ],
    COLOR: "grey",
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0.4],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin, {
                    pen: 0.8,
                    health: 0.6,
                    damage: 0.6,
                    recoil: 0,
                }]),
                TYPE: "bullet",
            },
        },
    ],
    ON: [{
        event: "fire",
        handler: ({ body }) => {
            const master = body.master;
            body._damage ??= [];
            body._reload ??= [];

            if (!body._loaded) {
                let _temp = 0;
                master._maxPower ??= 0;

                body.guns.forEach((gun, i) => {
                    body._damage[i] = gun.shootSettings.damage;
                    body._reload[i] = gun.shootSettings.reload;

                    _temp += (body._damage[i] * 3) / body._damage[i];
                    _temp += body._reload[i] / (body._reload[i] / 3);
                    _temp /= 2;
                });

                _temp /= body.guns.length;

                master._maxPower += (_temp - 1) * divide * 2;
                if (master._maxPower > _temp) master._maxPower /= 2;

                body._loaded = true;
            }

            if (master._mode) {
                master._power -= 1;
                if (master._power < 1) {
                    master._mode = 0;
                    master.color.base = 14;
                }
            }

            if (!master._oldPower) return;
            const power = master._oldPower / (divide * 2) + 1;

            body.guns.forEach((gun, i) => {
                let _1 = body._damage[i] * (master._mode ? power : 1);
                let _2 = body._reload[i] / (master._mode ? power : 1);
                let max_damage = body._damage[i] * damageMultiplayer;
                let min_reload = body._reload[i] / reloadMultiplayer;

                gun.shootSettings.damage = _1 > max_damage ? max_damage : _1;
                gun.shootSettings.reload = _2 < min_reload ? min_reload : _2;
            });
        },
    }],
};
Class.toothlessBossDeco = {
    PARENT: "genericTank",
    LABEL: "",
    SHAPE: 3,
    SIZE: 10,
    ON: [{
        event: "tick",
        handler: ({ body }) => {
            const master = body.master;
            if (master._maxPower)
                body.color.base = colorArray[
                    Math.floor(master._power / (master._maxPower / arraySize)) > arraySize - 1
                        ? arraySize - 1
                        : Math.floor(master._power / (master._maxPower / arraySize)
                    )
                ];
        },
    }],
};
Class.toothlessBoss = {
    PARENT: "toothlessBase",
    UPGRADE_COLOR: "magenta",
    TURRETS: [{
        POSITION: { SIZE: 15, LAYER: 1 },
        TYPE: ["toothlessBossDeco", { MIRROR_MASTER_ANGLE: true }],
    }, {
        POSITION: { SIZE: 23 },
        TYPE: ["triangle", { COLOR: "black", MIRROR_MASTER_ANGLE: true }],
    }],
    GUNS: [{
        POSITION: { LENGTH: 0, WIDTH: 0 },
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([ g.basic, {
                range: 0.1,
                speed: 0.1,
                maxSpeed: 0.1,
                recoil: 0,
            }]),
            TYPE: "bullet",
            ALT_FIRE: true,
        },
    }],
    ON: [{
        event: "altFire",
        handler: ({ body }) => {
            if (!body._power || body._mode) return;
            const power = Math.floor(body._power);

            if (power >= 1) {
                body._oldPower = body._power;
                body._mode = 1;
                body.color.base = 5;
            }
        },
    }, {
        event: "kill",
        handler: ({ body, entity }) => {
            body._power ??= 0;
            body._mode ??= 0;
            if (!body._mode) body._power += (entity.skill.score / divide) ** 0.8;
        },
    }],
}
Class.toothlessBoss.TURRETS = Class.toothlessBoss.TURRETS.concat(weaponArray([{
    POSITION: [8, 6, -5.6, 180, 180, 0],
    TYPE: "toothlessBossTurret",
}, {
    POSITION: [8, 6, 5.6, 180, 180, 0],
    TYPE: "toothlessBossTurret",
}], 3));

Class.MKAura = addAura(5, 0, 0.1, 42);
Class.MKDoneAura = addAura(2, 1, 0.3, 32);
Class.MKFactoryAura = addAura(2.6, 1, 0.3, "trans");
Class.MKCarrierAura = addAura(2.1, 1, 0.3, 1);
Class.MKMinionAura = addAura(1.1, 1, 0.3, 32);
Class.MKDrone = {
    PARENT: "drone",
    LABEL: "MKShip Drone",
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKDoneAura",
        },
    ]
}
Class.MKMinion = {
    PARENT: "minion",
    LABEL: "MKShip Minion",
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKMinionAura",
        },
    ]
}
Class.MKTurretFactoryWithController = {
    PARENT: "MKTurretFactory",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        FOV: 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKFactoryAura",
        },
    ]
}
Class.MKTurretFactory = {
    PARENT: "genericTank",
    LABEL: "MKTurret factory",
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    COLOR: 16,
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "MKMinion",
                MAX_CHILDREN: 6,
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.MKTurretCarrier = {
    PARENT: "carrier",
    FACING_TYPE: "toTarget",
    LABEL: "MKTurret carrier",
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    COLOR: 16,
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
}
Class.MKTurretCarrierWithController = {
    PARENT: "MKTurretCarrier",
    CONTROLLERS: ["nearestDifferentMaster"],
    INDEPENDENT: true,
    BODY: {
        FOV: 2,
    },
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKCarrierAura",
        },
    ]
}
Class.MKTurretThruster = {
    PARENT: "genericTank",
    LABEL: "MKTurret Thruster",
    FACING_TYPE: "toTarget",
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    COLOR: 16,
    GUNS: [{
        POSITION: [14, 12, 1, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.375, reload: 0.75, recoil: 1.05 }]),
            TYPE: "bullet"
        }
    }, {
        POSITION: [12, 12, 1.4, 4, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.machineGun, g.machineGun, g.thruster, { range: 0.375, reload: 0.75, recoil: 1.05 }]),
            TYPE: "bullet"
        },
    }]
}
Class.MKTurret = {
    PARENT: "genericTank",
    FACING_TYPE: "toTarget",
    IGNORED_BY_AI: true,
    DAMAGE_EFFECTS: false,
    LABEL: "MKTurret",
    COLOR: 16,
    SHAPE: 5,
    SKILL: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
    TURRETS: [
        {
            POSITION: [13, 0, 0, 0, 360, 1],
            TYPE: "MKTurretFactory",
        },
        {
            POSITION: [10, 16.1, 2.6, 140, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, 2.6, 203, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, -3.9, 310, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 16.1, 2.6, 413, 180, 0],
            TYPE: "MKTurretFactoryWithController",
        },
        {
            POSITION: [10, 10.2, 0, 0, 360, 0],
            TYPE: "MKTurretCarrier",
        },
        {
            POSITION: [10, 10.2, 0, 105.5, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [10, 10.2, 0, 180, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [10, 10.2, 0, 255, 180, 0],
            TYPE: "MKTurretCarrierWithController",
        },
        {
            POSITION: [8, -10, -2, -45, 90, 0],
            TYPE: "MKTurretThruster"
        },
        {
            POSITION: [8, -10, 2, 45, 90, 0],
            TYPE: "MKTurretThruster"
        },
    ],
}
Class.AEMKShipBoss = {
    PARENT: "genericTank",
    LABEL: "MKShip",
    NAME: "Æ🚫Sports",
    SYNC_WITH_TANK: true,
    CONTROLLERS: ["nearestDifferentMaster", "minion"],
    UPGRADE_TOOLTIP: "Has 4 carrier's, 4 factories, and their own auras. NOW FACE MY DESTRUCTION!",
    COLOR: 32,
    UPGRADE_COLOR: 32,
    GLOW: {
        RADIUS: 1.5,
        COLOR: 32,
        ALPHA: 0.9,
        RECURSION: 3,
    },
    DANGER: 10,
    LEVEL_CAP: 45,
    LEVEL: 45,
    SIZE: Class.genericTank.SIZE * (17 / 3),
    SHAPE: 16,
    VALUE: 5e5,
    SKILL: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    BODY: {
        REGEN: 0.4,
        FOV: 1,
        SHIELD: 2,
        ACCEL: 0.2,
        SPEED: 0.6,
        HEALTH: 5000,
        PUSHABILITY: 0.15,
        DENSITY: 0.2,
        DAMAGE: 4,
    },
    HITS_OWN_TYPE: "pushOnlyTeam",
    TURRETS: [
        {
            POSITION: [18, 0, 0, 0, 360, 1],
            TYPE: "MKAura",
        },
        {
            POSITION: [11, 0, 0, 0, 360, 1],
            TYPE: "MKTurret",
        },
    ],
    GUNS: (() => {
        let e = [],
            T = [1];
        for (let e = 1; e < 8.5; e += 0.5) {
            let t = e / 16;
            T.push(t);
        }
        for (let t = 0; t < 16; t++) {
            let S = 22.5 * (t + 1),
                E = {
                    MAX_CHILDREN: 2,
                    SHOOT_SETTINGS: combineStats([g.drone, g.overseer, g.mothership]),
                    TYPE: "MKDrone",
                    AUTOFIRE: true,
                    SYNCS_SKILLS: true,
                    STAT_CALCULATOR: "drone",
                    WAIT_TO_CYCLE: true,
                };
            t % 2 == 0 &&
            (E.TYPE = [
                "MKDrone",
                {
                    AI: {
                        skynet: true,
                    },
                    INDEPENDENT: true,
                    LAYER: 10,
                    BODY: {
                        FOV: 2,
                    },
                },
            ]);
            let O = {
                POSITION: [4.3, 3.1, 1.2, 8, 0, S, T[t]],
                PROPERTIES: E,
            };
            e.push(O);
        }
        return e;
    })(),
}
