const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray, dereference } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const g = require('../gunvals.js')

//return console.log('[Arms Race Addon] Disabled by default.');

// Removes the desmos branch and adds the single branch to be upgradable from basic.
// Removes single from assassin branch.
Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter(assassin => assassin !== 'single');
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter(basic => basic !== 'desmos');
Class.basic.UPGRADES_TIER_2.push('single');


// Functions

const makeMulti = (type, count, name = -1, startRotation = 0) => {
    type = ensureIsClass(type);
    let greekNumbers = ',Double ,Triple ,Quad ,Penta ,Hexa ,Septa ,Octo ,Nona ,Deca ,Hendeca ,Dodeca ,Trideca ,Tetradeca ,Pentadeca ,Hexadeca ,Septadeca ,Octadeca ,Nonadeca ,Icosa ,Henicosa ,Doicosa ,Triaicosa ,Tetraicosa ,Pentaicosa ,Hexaicosa ,Septaicosa ,Octoicosa ,Nonaicosa ,Triaconta '.split(','),
        output = dereference(type),
        fraction = 360 / count;
    output.GUNS = [];
    for (let gun of type.GUNS) {
        for (let i = 0; i < count; i++) {
            let newgun = dereference(gun);
            if (Array.isArray(newgun.POSITION)) {
                newgun.POSITION[5] += startRotation + fraction * i;
            } else {
                newgun.POSITION.ANGLE = (newgun.POSITION.ANGLE ?? 0) + startRotation + fraction * i;
            }
            if (gun.PROPERTIES) newgun.PROPERTIES = gun.PROPERTIES;
            output.GUNS.push(newgun);
        };
    }
    output.LABEL = name == -1 ? (greekNumbers[count - 1] || (count + ' ')) + type.LABEL : name;
    return output;
}
const makeFighter = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    let cannons = [{
        POSITION: [16, 8, 1, 0, -1, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
            TYPE: "bullet",
            LABEL: "Side",
        },
    }, {
        POSITION: [16, 8, 1, 0, 1, -90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
            TYPE: "bullet",
            LABEL: "Side",
        },
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? "Fighter " + type.LABEL : name;
    return output;
}
const makeSurfer = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    let cannons = [{
            POSITION: [7, 7.5, 0.6, 7, -1, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, 1, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: gunCalcNames.swarm,
            },
        }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? "Surfer " + type.LABEL : name;
    return output;
}
const makeSuperbird = (type, name = -1, frontRecoilFactor = 1, backRecoilFactor = 1, color) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    // Thrusters
    let backRecoil = 0.5 * backRecoilFactor;
    let thrusterProperties = { SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster, { recoil: backRecoil }]), TYPE: "bullet", LABEL: gunCalcNames.thruster };
    let shootyBois = [{
            POSITION: [14, 8, 1, 0, 0, 130, 0.6],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [14, 8, 1, 0, 0, -130, 0.6],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [16, 8, 1, 0, 0, -150, 0.1],
            PROPERTIES: thrusterProperties
        }, {
            POSITION: [18, 8, 1, 0, 0, 180, 0.35],
            PROPERTIES: thrusterProperties
        },];
    // Assign thruster color
    if (color) for (let gun of shootyBois) {
        gun.PROPERTIES.TYPE = [gun.PROPERTIES.TYPE, { COLOR: color }];
    }

    // Modify front barrels
    for (let gun of output.GUNS) {
        if (gun.PROPERTIES) {
            gun.PROPERTIES.ALT_FIRE = true;
            // Nerf front barrels
            if (gun.PROPERTIES.SHOOT_SETTINGS) {
                gun.PROPERTIES.SHOOT_SETTINGS = combineStats([gun.PROPERTIES.SHOOT_SETTINGS, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: frontRecoilFactor}]);
            }
        }
    }
    // Assign misc settings
    if (output.FACING_TYPE == "locksFacing") output.FACING_TYPE = "toTarget";
    output.GUNS = type.GUNS == null ? [...shootyBois] : [...output.GUNS, ...shootyBois];
    output.LABEL = name == -1 ? "Bird " + type.LABEL : name;
    return output;
}
const makeSplit = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    let cannons = [{
        POSITION: [18, 8, 1, 0, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
            TYPE: "bullet",
        },
    }, {
        POSITION: [18, 8, 1, 0, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard]),
            TYPE: "bullet",
        },
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? "Split " + type.LABEL : name;
    return output;
}
const makeTriGuard = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type),
    cannons = [{
        POSITION: [13, 8, 1, 0, 0, 180, 0],
        }, {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: gunCalcNames.trap,
        },
    },{
        POSITION: [13, 8, 1, 0, 0, 90, 0],
        }, {
        POSITION: [4, 8, 1.7, 13, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: gunCalcNames.trap,
        },
    },{
        POSITION: [13, 8, 1, 0, 0, 270, 0],
        }, {
        POSITION: [4, 8, 1.7, 13, 0, 270, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: gunCalcNames.trap,
        },
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? "Tri-" + type.LABEL + " Guard" : name;
    return output;
}
const makePenGuard = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type),
    cannons = [{
        POSITION: [20, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: "bullet",
        }
        }, {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: gunCalcNames.trap,
        },
    }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? type.LABEL + " Guard" : name;
    return output;
}
const makeMechGuard = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type),
    cannons = [{
            POSITION: [15, 8, 1, 0, 0, 180, 0]
        },
        {
            POSITION: [3, 8, 1.7, 15, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "znpAR_autoTrap",
                STAT_CALCULATOR: gunCalcNames.trap
            }
        },
        {
            POSITION: [12, 11, 1, 0, 0, 180, 0]
        }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? type.LABEL + " Guard" : name;
    return output;
}
const makeMachineGuard = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type),
    cannons = [{
            POSITION: [15, 9, 1.4, 0, 0, 180, 0],
        },
        {
            POSITION: [3, 13, 1.3, 15, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: gunCalcNames.trap,
            },
        }];
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? type.LABEL + " Guard" : name;
    return output;
}

// Spawner Functions
const makeHybrid = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    let spawner = {
        POSITION: [6, 12, 1.2, 8, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.weak]),
            TYPE: ["drone", { INDEPENDENT: true }],
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: gunCalcNames.drone,
            WAIT_TO_CYCLE: false,
            MAX_CHILDREN: 3,
        },
    };
    output.GUNS = type.GUNS == null ? [spawner] : [spawner, ...type.GUNS];
    output.LABEL = name == -1 ? "Hybrid " + type.LABEL : name;
    return output;
}
const makeSwarming = (type, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    let spawner = {
        POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.swarm]),
            TYPE: "autoswarm",
            STAT_CALCULATOR: gunCalcNames.swarm,
        },
    };
    if (type.TURRETS != null) {
        output.TURRETS = type.TURRETS;
    }
    if (type.GUNS == null) {
        output.GUNS = [spawner];
    } else {
        output.GUNS = [...type.GUNS, spawner];
    }
    if (name == -1) {
        output.LABEL = "Swarming " + type.LABEL;
    } else {
        output.LABEL = name;
    }
    return output;
}

// Auto-Functions
const makeMegaAuto = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let turret = {
        type: "megaAutoTankGun",
        size: 12,
        independent: true,
        color: 16,
        angle: 180,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.size != null) {
        turret.size = options.size;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }
    if (options.color != null) {
        turret.color = options.color;
    }
    if (options.angle != null) {
        turret.angle = options.angle;
    }
    let output = dereference(type);
    let autogun = {
        POSITION: [turret.size, 0, 0, turret.angle, 360, 1],
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color,
            },
        ],
    };
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [autogun];
    } else {
        output.TURRETS = [...type.TURRETS, autogun];
    }
    if (name == -1) {
        output.LABEL = "Mega Auto-" + type.LABEL;
    } else {
        output.LABEL = name;
    }
    output.DANGER = type.DANGER + 2;
    return output;
}
const makeTripleAuto = (type, name = -1, options = {}) => {
    type = ensureIsClass(type);
    let turret = {
        type: "autoTurret",
        size: 6,
        independent: true,
        color: 16,
        angle: 180,
    };
    if (options.type != null) {
        turret.type = options.type;
    }
    if (options.independent != null) {
        turret.independent = options.independent;
    }
    if (options.color != null) {
        turret.color = options.color;
    }
    let output = dereference(type);
    let autogun = {
        POSITION: [turret.size, 4.5, 0, 0, 150, 1],
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color,
            },
        ],
    };
    let autogun1 = {
        POSITION: [turret.size, 4.5, 0, 120, 150, 1],
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color,
            },
        ],
    };
    let autogun2 = {
        POSITION: [turret.size, 4.5, 0, -120, 150, 1],
        TYPE: [
            turret.type,
            {
                CONTROLLERS: ["nearestDifferentMaster"],
                INDEPENDENT: turret.independent,
                COLOR: turret.color,
            },
        ],
    };
    if (type.GUNS != null) {
        output.GUNS = type.GUNS;
    }
    if (type.TURRETS == null) {
        output.TURRETS = [autogun, autogun1, autogun2];
    } else {
        output.TURRETS = [...type.TURRETS, autogun, autogun1, autogun2];
    }
    if (name == -1) {
        output.LABEL = "Triple Auto-" + type.LABEL;
    } else {
        output.LABEL = name;
    }
    output.DANGER = type.DANGER + 2;
    return output;
}

// Misc Functions
const makeFast = (type, mult = 1.1, name = -1) => {
    type = ensureIsClass(type);
    let output = dereference(type);
    if (output.BODY.SPEED) output.BODY.SPEED = base.SPEED;
    output.BODY.SPEED *= mult;
    output.LABEL = name == -1 ? output.LABEL : name;
    return output;
}

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
Class.assistant = makeOver('single', 'Assistant', { count: 1, independent: true, cycle: false })
Class.autoSingle = makeAuto('single');
//Sidewinders
Class.veerer = makeOver('sidewinder', 'Veerer');
//where did i fuck up for hognose missile
Class.hognoseMissile = makeAuto('snakeOld', 'Hognose missile', { type: 'hognoseTurret', independent: true, size: 5 });
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
    ],
}

console.log('[Arms Race Addon] Loaded Arms Race.')