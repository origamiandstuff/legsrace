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
} = require("../facilitators.js");
const {
	base,
	statnames,
	dfltskl,
	smshskl
} = require("../constants.js");
const g = require("../gunvals.js");

// Removes the desmos branch and adds the single branch to be upgradable from basic.
// Removes single from assassin branch.
/*Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter(
  (assassin) => assassin !== "marksman"
);
Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter(
  (assassin) => assassin !== "single"
);
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter(
  (basic) => basic !== "desmos"
);
Class.basic.UPGRADES_TIER_2.push("single");
*/
// Functions

const makeFighter = (type, name = -1) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [{
			POSITION: [16, 8, 1, 0, -1, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.basic,
					g.flankGuard,
					g.triAngle,
					g.triAngleFront,
				]),
				TYPE: "bullet",
				LABEL: "Side",
			},
		},
		{
			POSITION: [16, 8, 1, 0, 1, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.basic,
					g.flankGuard,
					g.triAngle,
					g.triAngleFront,
				]),
				TYPE: "bullet",
				LABEL: "Side",
			},
		},
	];
	output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
	output.LABEL = name == -1 ? "Fighter " + type.LABEL : name;
	return output;
};

const makeSurfer = (type, name = -1) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [{
			POSITION: [7, 7.5, 0.6, 7, -1, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm]),
				TYPE: "autoswarm",
			},
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 1, -90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm]),
				TYPE: "autoswarm",
			},
		},
	];
	output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
	output.LABEL = name == -1 ? "Surfer " + type.LABEL : name;
	return output;
};

const makeBomber = (type, name = -1, options = {}) => {
	type = ensureIsClass(type);
	let gunType = {
		pen: 0,
		thrusters: 0,
	};
	let output = dereference(type);
	let cannons = [];
	if (gunType.pen == 0) {
		cannons.push({
			POSITION: [13, 8, 1, 0, 0, 180, 0],
		});
	} else {
		cannons.push({
			POSITION: [15, 8, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
				LABEL: "Pen",
			},
		});
	}
	if (gunType.thrusters == 1) {
		cannons.push({
			POSITION: [18, 8, 1, 0, 0, 130, 0.1],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
				TYPE: "bullet",
				LABEL: "Wing",
			},
		}, {
			POSITION: [18, 8, 1, 0, 0, 230, 0.1],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
				TYPE: "bullet",
				LABEL: "Wing",
			},
		});
	}
	cannons.push({
		POSITION: [4, 8, 1.7, 13, 0, 180, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.trap]),
			TYPE: "trap",
			STAT_CALCULATOR: "trap",
		},
	});
	output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
	output.LABEL = name == -1 ? "Bomber " + type.LABEL : name;
	return output;
};

const makeBackCruiser = (type, name = -1) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [{
            POSITION: [7, 7.5, 0.6, 7, 4, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [7, 7.5, 0.6, 7, -4, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "autoswarm",
                STAT_CALCULATOR: "swarm",
            },
        },
	];
	output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
	output.LABEL = name == -1 ? "Cruiser " + type.LABEL : name;
	return output;
};


// Turrets, Traps, Bullets etc..

// Autos
Class.phs_tripleAutoTankGun = {
	TURRETS: [
        {
            POSITION: [6, 4.5, 0, 0, 150, 1],
            TYPE: "autoTankGun",
        },
		{
            POSITION: [6, 4.5, 0, 120, 150, 1],
            TYPE: "autoTankGun",
        },
		{
            POSITION: [6, 4.5, 0, -120, 150, 1],
            TYPE: "autoTankGun",
        },
    ],
}
Class.phs_sniperAutoTankGun = makeTurret({
	GUNS: [{
			POSITION: [27, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5, 8, -1.4, 8, 0, 0, 0],
		},
	],
}, {
	canRepel: true,
	limitFov: true,
	fov: 4
});
Class.phs_megaAutoTurret = makeTurret({
	GUNS: [{
		POSITION: [22, 14, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([
				g.basic,
				g.pounder,
				g.pelleter,
				g.power,
				{
					recoil: 1.15
				},
				g.turret,
			]),
			TYPE: "bullet",
		},
	}, ],
}, {
	canRepel: true,
	limitFov: true,
	fov: 3
});

Class.phs_crowbarTurret = {
	PARENT: "genericTank",
	COLOR: 16,
	BODY: {
        FOV: 1,
    },
	TURRETS: [{
		POSITION: [20, 0, 0, 0, 360, 1],
		TYPE: makeTurret({
			PARENT: "genericTank",
			LABEL: "",
			BODY: {
				FOV: 6,
			},
			CONTROLLERS: ["onlyAcceptInArc", "nearestDifferentMaster"],
			COLOR: 16,
			GUNS: [
				{
					POSITION: [22, 10, 1, 0, 0, 0, 0],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.autoTurret, { recoil: 0}]),
						TYPE: "bullet",
					},
				},
			],
		}),
	}, ],
};
Class.phs_driveAutoTurret = makeTurret({
	SHAPE: 4,
	GUNS: [{
		POSITION: [22, 10, 1, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([
				g.basic,
				g.pelleter,
				g.power,
				{
					recoil: 1.15
				},
				g.turret,
			]),
			TYPE: "bullet",
		},
	}, ],
}, {
	label: "Turret",
	fov: 0.8,
	extraStats: []
});
// Minions
Class.phs_autoMinion = makeAuto("minion", "Auto-Minion", {
	TYPE: "droneAutoTurret",
});
Class.phs_megaMinion = {
    PARENT: "genericTank",
    LABEL: "Mega Minion",
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 1.7,
        ACCELERATION: 1.6,
        HEALTH: 11,
        SHIELD: 0,
        DAMAGE: 2,
        RESIST: 1,
        PENETRATION: 21,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "canRepel",
        "hangOutNearMaster",
    ],
    GUNS: [
        {
            POSITION: [17, 13, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.pounder]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
};
Class.phs_ultraMinion = {
    PARENT: "genericTank",
    LABEL: "Ultra Minion",
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 1.6,
        ACCELERATION: 1.6,
        HEALTH: 7,
        SHIELD: 0,
        DAMAGE: 1.7,
        RESIST: 1,
        PENETRATION: 21,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "canRepel",
        "hangOutNearMaster",
    ],
    GUNS: [
        {
            POSITION: [17, 17, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.destroyer]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
};
Class.phs_foundryMinion = {
    PARENT: "genericTank",
    LABEL: "Foundry Minion",
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 2.5,
        ACCELERATION: 1.6,
        HEALTH: 18,
        SHIELD: 0,
        DAMAGE: 0.8,
        RESIST: 1,
        PENETRATION: 23,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "canRepel",
        "hangOutNearMaster",
    ],
    GUNS: [
        {
            POSITION: [17, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.single, { damage: 4, reload: 2 }]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
};
Class.phs_shopperMinion = {
    PARENT: "genericTank",
    LABEL: "Foundry Minion",
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 2,
        ACCELERATION: 1.6,
        HEALTH: 20,
        SHIELD: 0,
        DAMAGE: 1,
        RESIST: 1,
        PENETRATION: 23,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "canRepel",
        "hangOutNearMaster",
    ],
    GUNS: [
        {
            POSITION: [17, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.single, { damage: 4, reload: 2 }]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
};
Class.phs_autoFoundryMinion = makeAuto("phs_foundryMinion", "Auto-Foundry Minion", {
	TYPE: "droneAutoTurret",
});
Class.phs_topBananaMinion = {
    PARENT: "genericTank",
    LABEL: "Top Banana Minion",
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 4,
        ACCELERATION: 1.6,
        HEALTH: 16,
        SHIELD: 0,
        DAMAGE: 0.9,
        RESIST: 1,
        PENETRATION: 23,
        DENSITY: 0.4,
    },
    AI: {
        BLIND: true,
    },
    DRAW_HEALTH: false,
    CLEAR_ON_MASTER_UPGRADE: true,
    GIVE_KILL_MESSAGE: false,
    CONTROLLERS: [
        "nearestDifferentMaster",
        "mapAltToFire",
        "minion",
        "canRepel",
        "hangOutNearMaster",
    ],
    GUNS: [
        {
            POSITION: [17, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun, g.single, { damage: 5, reload: 3 }]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
    ],
};
// Storm Turrets
Class.phs_stormProp = {
	PARENT: "overdriveDeco",
	LABEL: "Storm prop",
	GUNS: [{
			POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
		},
	],
};
Class.phs_stormTurret = makeTurret({
	PARENT: "genericTank",
	GUNS: [{
			POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
	],
}, {
	canRepel: true,
	limitFov: true,
	fov: 4,
	independent: true,
	extraStats: []
});
Class.phs_vortexProp = {
	PARENT: "overdriveDeco",
	LABEL: "Vortex prop",
	GUNS: [{
			POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 180, 0],
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
		},
	],
};
Class.phs_stormMinion = makeAuto("minion", "Storm Minion", {
	TYPE: "stormTurret"
});
Class.phs_vortexTurret = makeTurret({
	PARENT: "genericTank",
	GUNS: [{
			POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
		{
			POSITION: [7, 7.5, 0.6, 7, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.carrier]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
				LABEL: "Guided",
			},
		},
	],
}, {
	canRepel: true,
	limitFov: true,
	fov: 4,
	independent: true,
});

// Traps
Class.phs_autoTrap = makeAuto("trap", {
	type: "pillboxTurret"
});
Class.phs_chargerTrapDeco = makeDeco(5);
Class.phs_chargerTrap = {
	PARENT: "setTrap",
	INDEPENDENT: true,
	TURRETS: [{
		POSITION: [8, 0, 0, 0, 360, 1],
		TYPE: "chargerTrapDeco",
	}, ],
	GUNS: weaponArray(
		[{
			POSITION: [4, 4, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: ["trap", {
					PERSISTS_AFTER_DEATH: true
				}],
				SHOOT_ON_DEATH: true,
				STAT_CALCULATOR: "trap",
			},
		}, ],
		5
	),
};

// Drones
Class.phs_autoDrone = makeAuto("drone", {
	type: "droneAutoTurret"
});

// Tanks

// Singles
Class.phs_duo = {
	PARENT: "genericTank",
	LABEL: "Duo",
	DANGER: 7,
	GUNS: [{
			POSITION: {
				LENGTH: 20,
				WIDTH: 8,
				Y: 5.5,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: {
				LENGTH: 20,
				WIDTH: 8,
				Y: -5.5,
				DELAY: 0.5,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.single]),
				TYPE: "bullet",
			},
		},
	],
};

Class.phs_sharpshooter = {
	PARENT: "genericTank",
	LABEL: "Sharpshooter",
	DANGER: 7,
	GUNS: [{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.single, g.sniper]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
		},
	],
};
Class.phs_ternion = {
	PARENT: "genericTank",
	LABEL: "Ternion",
	DANGER: 7,
	BODY: {
		SPEED: 1.1 * base.SPEED,
	},
	GUNS: weaponArray({
			POSITION: {
				LENGTH: 18,
				WIDTH: 8,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.single]),
				TYPE: "bullet",
			},
		},
		3
	),
	GUNS: weaponArray({
			POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
		},
		3
	),
};

Class.phs_avian = makeBird("single", "Avian");
Class.phs_custodian = makeGuard("single", "Custodian");
Class.phs_assistant = makeOver("single", "Assistant", {
	count: 1,
	independent: !0,
	cycle: !1,
});
Class.phs_autoSingle = makeAuto("single");

// Smashers

// Trappers
// Constructors
// Chargers
Class.phs_charger = {
	PARENT: "genericTank",
	LABEL: "Charger",
	GUNS: [{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [2, 12, 1.1, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, {}]),
				TYPE: ["chargerTrap"],
				STAT_CALCULATOR: "block",
			},
		},
	],
};
// Machine Trappers
Class.phs_machineTrapper = {
	PARENT: "genericTank",
	LABEL: "Machine Trapper",
	DANGER: 6,
	STAT_NAMES: statnames.trap,
	GUNS: [{
			POSITION: [15, 9, 1.4, 0, 0, 0, 0],
		},
		{
			POSITION: [3, 13, 1.3, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.trap,
					g.machineGun,
					{
						reload: 0.625,
						size: 0.625,
						spray: 0.75
					},
				]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};
Class.phs_propper = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Propper",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15,
    },
    GUNS: [
		{
            POSITION: [24, 8, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "autoTrap",
                STAT_CALCULATOR: "trap",
            },
        },
		{
		POSITION: [4, 12, 1, 8, 0, 0, 0],
		}
    ],
};
Class.phs_blockade = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Blockade",
    STAT_NAMES: statnames.trap,
    BODY: {
        FOV: 1.15,
    },
    GUNS: [
        {
            POSITION: [24, 14, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [4, 14, 1.1, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.minigun, g.spam, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 14, 1.1, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.minigun, g.spam, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 14, 1.1, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.minigun, g.spam, { range: 0.5, reload: 0.5, recoil: 0.2 }]),
                TYPE: "setTrap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
// Mechs
Class.phs_mech = {
	PARENT: "genericTank",
	LABEL: "Mech",
	DANGER: 7,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [15, 8, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [3, 9, 1.7, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "phs_autoTrap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [4, 12, 1, 8, 0, 0, 0],
		},
	],
};
Class.phs_operator = {
	PARENT: "genericTank",
	LABEL: "Operator",
	DANGER: 7,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [22, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 9, 1.7, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "phs_autoTrap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [4, 12, 1, 8, 0, 0, 0],
		},
	],
};
Class.phs_overMech = makeOver("mech", "Overmech");
// Pens
Class.phs_pen = {
	PARENT: "genericTank",
	LABEL: "Pen",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [20, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [4, 8, 1.7, 13, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};
Class.phs_encircler = {
	PARENT: "genericTank",
	LABEL: "Encircler",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [21, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [15, 9, 1.4, 0, 0, 0, 0],
		},
		{
			POSITION: [3, 13, 1.3, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.trap,
					g.machineGun,
					{
						reload: 0.625,
						size: 0.625,
						spray: 0.75
					},
				]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};
Class.phs_autoEncircler = makeAuto("encircler");
Class.phs_stall = {
	PARENT: "genericTank",
	LABEL: "Stall",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [2, 12, 1.1, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
				TYPE: "setTrap",
				STAT_CALCULATOR: "block",
			},
		},
	],
};
Class.phs_autoStall = makeAuto("stall");
Class.phs_delayer = makeOver("stall", "Delayer", {
	count: 1,
	independent: !0,
	cycle: !1,
});
Class.phs_hurdle = {
	PARENT: "genericTank",
	LABEL: "Hurdle",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [18, 18, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [2, 18, 1.2, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
				TYPE: "setTrap",
				STAT_CALCULATOR: "block",
			},
		},
	],
};

Class.phs_cubicle = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Cubicle",
	STAT_NAMES: statnames.trap,
	BODY: {
		SPEED: 0.75 * base.SPEED,
		FOV: 1.15 * base.FOV,
	},
	GUNS: [{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5, 11, 1, 10.5, 0, 0, 0],
		},
		{
			POSITION: [3, 14, 1, 15.5, 0, 0, 0],
		},
		{
			POSITION: [2, 14, 1.3, 18, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 6,
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
				TYPE: "pillbox",
				SYNCS_SKILLS: true,
				DESTROY_OLDEST_CHILD: true,
				STAT_CALCULATOR: "block",
			},
		},
		{
			POSITION: [4, 14, 1, 8, 0, 0, 0],
		},
	],
};

Class.phs_incarcerator = {
	PARENT: "genericTank",
	LABEL: "Incarcerator",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: [20, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [20, 8, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [4, 8, 1.7, 13, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};
Class.phs_fender = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Fender",
	STAT_NAMES: statnames.trap,
	BODY: {
		SPEED: 0.75 * base.SPEED,
		FOV: 1.15 * base.FOV,
	},
	GUNS: [{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [5, 10, 1, 13, 0, 0, 0],
		},
		{
			POSITION: [6, 10, -1.5, 7, 0, 0, 0],
		},
		{
			POSITION: [2, 10, 1.3, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.boomerang]),
				TYPE: "boomerang",
				STAT_CALCULATOR: "block",
			},
		},
	],
};
Class.phs_overthrower = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Overthrower",
	STAT_NAMES: statnames.mixed,
	BODY: {
		SPEED: 0.8 * base.SPEED,
	},
	REVERSE_TARGET_WITH_TANK: true,
	GUNS: [{
			POSITION: [21, 14, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [24, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [18, 12, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [2, 12, 1.1, 18, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
				TYPE: "setTrap",
				STAT_CALCULATOR: "block",
			},
		},
	],
};

Class.phs_tripen = {
	PARENT: "genericTank",
	LABEL: "Tri-Pen",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: weaponArray(
		[{
				POSITION: [20, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [4, 8, 1.7, 13, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.trap]),
					TYPE: "trap",
					STAT_CALCULATOR: "trap",
				},
			},
		],
		3
	),
};
Class.phs_corral = {
	PARENT: "genericTank",
	LABEL: "Corral",
	DANGER: 6,
	STAT_NAMES: statnames.mixed,
	GUNS: weaponArray(
		[{
				POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
					TYPE: "swarm",
					STAT_CALCULATOR: "swarm",
					LABEL: "Guided",
				},
			},
			{
				POSITION: [20, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [4, 8, 1.7, 13, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.trap]),
					TYPE: "trap",
					STAT_CALCULATOR: "trap",
				},
			},
		],
		3
	),
};
Class.phs_coop = makeAuto({
		PARENT: "genericTank",
		DANGER: 6,
		STAT_NAMES: statnames.mixed,
		GUNS: weaponArray(
			[{
					POSITION: [20, 8, 1, 0, 0, 0, 0],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([g.basic]),
						TYPE: "bullet",
					},
				},
				{
					POSITION: [4, 8, 1.7, 13, 0, 0, 0],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([g.trap]),
						TYPE: "trap",
						STAT_CALCULATOR: "trap",
					},
				},
				{
					POSITION: [15, 8, 1, 0, 0, 60, 0],
				},
				{
					POSITION: [4, 8, 1.7, 13, 0, 60, 0.5],
					PROPERTIES: {
						SHOOT_SETTINGS: combineStats([g.trap]),
						TYPE: "trap",
						STAT_CALCULATOR: "trap",
					},
				},
			],
			3
		),
	},
	"Coop"
);
Class.phs_autoPen = makeAuto("pen");
Class.phs_cockatiel = makeBird("pen", "Cockatiel");
Class.phs_interner = makeOver("pen", "Interner", {
	count: 1,
	independent: !0,
	cycle: !1,
});
Class.phs_overpen = makeOver("pen", "Overpen", {
	count: 2,
	independent: !1,
	cycle: !1,
});
Class.phs_fortifier = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Fortifier",
	STAT_NAMES: statnames.mixed,
	BODY: {
		FOV: 1.15,
	},
	GUNS: [{
			POSITION: [28, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [4, 8, 1.3, 22, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.minigun, {
					range: 0.5
				}]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [4, 8, 1.3, 18, 0, 0, 1 / 3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.minigun, {
					range: 0.5
				}]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [4, 8, 1.3, 14, 0, 0, 2 / 3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.minigun, {
					range: 0.5
				}]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};

// Builders

Class.phs_fashioner = makeOver('builder', "Fashioner", {count: 1, independent: true, cycle: false})
Class.phs_autoFashioner = makeAuto("fashioner");
Class.phs_autoEngineer = makeAuto("engineer");
Class.phs_autoConstruct = makeAuto("construct");
Class.phs_autoBoomer = makeAuto("boomer");
Class.phs_megaAutoBuilder = makeAuto("builder", {
	type: "megaAutoTurret"
});
Class.phs_overbuilder = makeOver("builder", "Overbuilder", {
	count: 1,
	independent: !0,
	cycle: !1,
});

Class.phs_assemble = {
    PARENT: "genericTank",
    LABEL: "Assembler",
    STAT_NAMES: statnames.trap,
    DANGER: 7,
    BODY: {
        FOV: 1.15 * base.FOV
    },
    GUNS: [
        {
            POSITION: [18, 18, 1.4, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 24, 1.6, 18, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 6,
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct, g.construct]),
                DESTROY_OLDEST_CHILD: true,
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            }
        }
    ]
}

// Warks
Class.phs_wark = {
	PARENT: "genericTank",
	LABEL: "Wark",
	STAT_NAMES: statnames.trap,
	GUNS: [{
			POSITION: [14, 8, 1, 0, 5.5, 5, 0],
		},
		{
			POSITION: [3, 9, 1.5, 14, 5.5, 5, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [14, 8, 1, 0, -5.5, 355, 0],
		},
		{
			POSITION: [3, 9, 1.5, 14, -5.5, 355, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};

Class.phs_wark = {
	PARENT: "genericTank",
	LABEL: "Wark",
	STAT_NAMES: statnames.trap,
	GUNS: weaponArray({
		POSITION: [14, 8, 1, 0, 5.5, 5, 0],
		POSITION: [3, 9, 1.5, 14, 5.5, 5, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
			TYPE: "trap",
			STAT_CALCULATOR: "trap",
		},
		POSITION: [14, 8, 1, 0, -5.5, 355, 0],
		POSITION: [3, 9, 1.5, 14, -5.5, 355, 0.5],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
			TYPE: "trap",
			STAT_CALCULATOR: "trap",
		},
	}),
};
Class.phs_hutch = {
	PARENT: "genericTank",
	LABEL: "Hutch",
	STAT_NAMES: statnames.trap,
	GUNS: [{
			POSITION: [20, 8, 1, 0, 5.5, 5, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 9, 1.5, 14, 5.5, 5, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: [20, 8, 1, 0, -5.5, 355, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [3, 9, 1.5, 14, -5.5, 355, 0.5],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};

// Trap Guards
Class.phs_triTrapGuard = {
	PARENT: "genericTank",
	LABEL: "Tri-Trap Guard",
	STAT_NAMES: statnames.mixed,
	GUNS: [{
			POSITION: {
				LENGTH: 20,
				WIDTH: 8,
				ASPECT: 1,
				X: 0,
				Y: 0,
				ANGLE: 0,
				DELAY: 0,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: {
				LENGTH: 13,
				WIDTH: 7,
				ANGLE: 180,
			},
		},
		{
			POSITION: {
				LENGTH: 3,
				WIDTH: 7,
				ASPECT: 1.7,
				X: 13,
				ANGLE: 180,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: {
				LENGTH: 13,
				WIDTH: 7,
				ANGLE: 90,
			},
		},
		{
			POSITION: {
				LENGTH: 3,
				WIDTH: 7,
				ASPECT: 1.7,
				X: 13,
				ANGLE: 90,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
		{
			POSITION: {
				LENGTH: 13,
				WIDTH: 7,
				ANGLE: 270,
			},
		},
		{
			POSITION: {
				LENGTH: 3,
				WIDTH: 7,
				ASPECT: 1.7,
				X: 13,
				ANGLE: 270,
			},
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.trap]),
				TYPE: "trap",
				STAT_CALCULATOR: "trap",
			},
		},
	],
};
// Pounders
// Launchers
Class.phs_inception = {
	PARENT: "genericTank",
	LABEL: "Inception",
	DANGER: 7,
	BODY: {
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
			POSITION: [10, 9, 1, 9, 0, 0, 0],
		},
		{
			POSITION: [17, 13, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.launcher]),
				TYPE: makeAuto("minimissile", "Inception Missile"),
				STAT_CALCULATOR: "sustained",
			},
		},
		{
			POSITION: [3, 7.5, 1, 6, 0, 0, 0],
		},
	],
};
Class.phs_hognose = {
	PARENT: "genericTank",
	LABEL: "Hognose",
	DANGER: 7,
	BODY: {
		SPEED: 0.8 * base.SPEED,
		FOV: 1.3 * base.FOV,
	},
	GUNS: [{
			POSITION: [10, 11, -0.5, 14, 0, 0, 0],
		},
		{
			POSITION: [21, 12, -1.1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.basic,
					g.sniper,
					g.hunter,
					g.sidewinder,
				]),
				TYPE: makeAuto("snake", "Hognose Missile"),
				STAT_CALCULATOR: "sustained",
			},
		},
		{
		    POSITION: [4, 8, 1, 16.5, 0, 0, 0],
			SHOOT_SETTINGS: combineStats([
				g.basic,
			]),
		},
	],
};

Class.phs_helix_ = {
    PARENT: "genericTank",
    LABEL: "Helix",
    TOOLTIP: "Hold right click to reverse missile rotation.",
    DANGER: 7,
    BODY: {
        FOV: 1.1 * base.FOV,
    },
    GUNS: [
        {
            POSITION: [10, 13, -0.5, 9, 0, 0, 0],
        },
        {
            POSITION: [17, 14, -1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.artillery, g.artillery, g.skimmer, { reload: 4/3, speed: 1.3, maxSpeed: 1.2 }]),
                TYPE: makeAuto("spinmissile", "Helix Missile"),
                STAT_CALCULATOR: "sustained",
            },
        },
		{
		    POSITION: [4, 8, 1, 12.5, 0, 0, 0],
			SHOOT_SETTINGS: combineStats([
				g.basic,
			]),
		},
    ],
};
Class.phs_seriemas = makeBird("launcher", "Seriemas");
// Subverters
Class.phs_subverter = {
	PARENT: "genericTank",
	LABEL: "Subverter",
	DANGER: 6,
	BODY: {
		FOV: base.FOV * 1.2,
	},
	GUNS: [{
			POSITION: [21, 12, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [19, 12, 1, 0, 0, 0, 1 / 3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [17, 12, 1, 0, 0, 0, 2 / 3],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
				TYPE: "bullet",
			},
		},
	],
};
// Destroyers
Class.phs_autoDestroyer = makeAuto("destroyer");
Class.phs_compound = makeOver("destroyer", "Compound", {
	count: 2,
	independent: false,
	cycle: false,
});
// Annihilators
Class.phs_autoAnnihilator = makeAuto("annihilator");
Class.phs_compound = makeOver("annihilator", "Compound", {
	count: 1,
	independent: true,
	cycle: false,
});
Class.phs_wiper = addBackGunner("annihilator", "Wiper");
Class.phs_obliterator = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Obliterator",
    STAT_NAMES: statnames.mixed,
    BODY: {
        SPEED: 0.85 * base.SPEED,
    },
    REVERSE_TARGET_WITH_TANK: true,
    GUNS: [
		{
            POSITION: [20.5, 19.5, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [18, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 12, 1.1, 18, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.setTrap]),
                DESTROY_OLDEST_CHILD: true,
                MAX_CHILDREN: 17,
                TYPE: "setTrap",
                STAT_CALCULATOR: "block"
            },
        },
    ],
}
// Snipers
Class.phs_buttbuttin = addBackGunner("assassin", "Buttbuttin");
Class.phs_hitman = makeOver("assassin", "Hitman", {
	count: 1,
	independent: true,
	cycle: false,
});
Class.phs_autoHitman = makeAuto("hitman");
Class.phs_trailer = makeOver("stalker", "trailer", {
	count: 1,
	independent: true,
	cycle: false,
});
Class.phs_doorman = makeOver("ranger", "Doorman", {
	count: 1,
	independent: true,
	cycle: false,
});
Class.phs_mercenary = addBackGunner("hitman", "Mercenary");
Class.phs_overassassin = makeOver("assassin", "Overassassin", {
	count: 2,
	independent: false,
	cycle: false,
});
Class.phs_sniper3 = makeRadialAuto("phs_sniperAutoTankGun", {
	isTurret: true,
	body: {
		FOV: 1.2
	},
	danger: 7,
	label: "Sniper-3",
	count: 3,
});

// Rangers
Class.phs_autoRanger = makeAuto("ranger");
Class.phs_vindicator = {
	PARENT: "genericTank",
	LABEL: "Vindicator",
	DANGER: 7,
	BODY: {
		SPEED: 0.8 * base.SPEED,
		FOV: 1.8 * base.FOV,
	},
	GUNS: [{
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
};
Class.phs_hawker = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Hawker",
	BODY: {
		SPEED: 0.85 * base.SPEED,
		FOV: 1.35 * base.FOV,
	},
	INVISIBLE: [0.08, 0.03],
	TOOLTIP: "Stay still to turn invisible.",
	GUNS: [{
		POSITION: [32, 8, -1.8, 0, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
			TYPE: "bullet",
		},
	}, ],
};
Class.phs_peregrine = makeBird("ranger", "Peregrine");
Class.phs_owl = makeBird("stalker", "Owl");
Class.phs_autoFalcon = makeAuto("falcon");
Class.phs_harpy = addBackGunner("falcon", "Harpy");
Class.phs_merlin = makeBird("assassin", "Merlin", {
	super: true,
});
// Nailguns
// [4, 8, 1.3, 22, 0, 0, 0]
/*Class.phs_binder = {
    PARENT: "genericTank",
    LABEL: "Binder",
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [4, 3, 1.3, 0, -17.5, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.trapper]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [4, 3, 1.3, 0, 17.5, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.trapper]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [4, 3, 1.3, 0, 15, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, g.twin, g.nailgun, g.trapper]),
                TYPE: "trap",
            },
        },
        {
            POSITION: [5.5, 7, -1.8, 6.5, 0, 0, 0],
        },
    ],
}*/
// Droners
// Foundries
Class.phs_foundry = {
    PARENT: "genericTank",
    LABEL: "Foundry",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 15, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 17, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.pounder, { size: 0.85 }]),
                TYPE: "phs_foundryMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 17, 1, 0, 0, 0, 0],
        },
    ],
};
Class.phs_shopper = {
    PARENT: "genericTank",
    LABEL: "Shopper",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 15, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 18, 1, 14.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.pounder, { size: 0.9 }]),
                TYPE: "phs_shopperMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 18, 1, 0, 0, 0, 0],
        },
    ],
};
Class.phs_foundrydrive = {
    PARENT: "genericTank",
    LABEL: "Foundrydrive",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
    GUNS: [
        {
            POSITION: [4.5, 15, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 17, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.pounder, { size: 0.85 }]),
                TYPE: "autoFoundryMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 17, 1, 0, 0, 0, 0],
        },
    ],
};

Class.phs_stocker = {
    PARENT: "genericTank",
    LABEL: "Stocker",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
            POSITION: [4.5, 15, 1, 10.5, 0, 90, 0],
        },
        {
            POSITION: [1, 17, 1, 15, 0, 90, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.pounder, { size: 0.85 }]),
                TYPE: "phs_foundryMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 17, 1, 0, 0, 90, 0],
        },
    ], 2),
};
Class.phs_topBanana = {
    PARENT: "genericTank",
    LABEL: "Top Banana",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 18, 1, 11.5, 0, 0, 0],
        },
        {
            POSITION: [1, 20, 1, 16, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 1,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.destroyer, { size: 1.25, speed: 2, reload: 5 }]),
                TYPE: "topBananaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12.5, 20, 1, 0, 0, 0, 0],
        },
    ],
};
// Mega Spawners
Class.phs_megaSpawner = {
    PARENT: "genericTank",
    LABEL: "Mega Spawner",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 14, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 16, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.pounder, { size: 0.7 }]),
                TYPE: "phs_megaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 16, 1, 0, 0, 0, 0],
        },
    ],
};
Class.phs_ultraSpawner = {
    PARENT: "genericTank",
    LABEL: "Ultra Spawner",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 16, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 18, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.destroyer, { size: 0.65 }]),
                TYPE: "phs_ultraMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 18, 1, 0, 0, 0, 0],
        },
    ],
};
Class.phs_megaCaptain = {
	PARENT: "genericTank",
	LABEL: "Mega Captain",
	DANGER: 6,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: weaponArray(
		[{
            POSITION: [4.5, 14, 1, 10.5, 0, 90, 0],
        },
        {
            POSITION: [1, 16, 1, 15, 0, 90, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.pounder, { size: 0.7 }]),
                TYPE: "phs_megaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 16, 1, 0, 0, 90, 0],
        },
		],
		2
	),
};
Class.phs_megaFactory = {
    PARENT: "genericTank",
    LABEL: "Mega Factory",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 16, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 18, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.pounder, { size: 0.7}]),
                TYPE: "phs_megaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 18, 1, 0, 0, 0, 0],
        },
    ],
};
Class.phs_autoMegaSpawner = makeAuto("megaSpawner");
// Directordrives
Class.phs_directordrive = {
	PARENT: "genericTank",
	LABEL: "Directordrive",
	DANGER: 6,
	STAT_NAMES: statnames.drone,
	BODY: {
		FOV: base.FOV * 1.1,
	},
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
	GUNS: [{
		POSITION: [6, 11, 1.3, 7, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone]),
			TYPE: "turretedDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			MAX_CHILDREN: 6,
		},
	}, ],
};
Class.phs_stormDrone = makeAuto("drone", "Storm Drone", {
	type: "stormTurret"
});
Class.phs_directorstorm = {
	PARENT: "genericTank",
	LABEL: "Directorstorm",
	STAT_NAMES: statnames.drone,
	BODY: {
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
		POSITION: {
			LENGTH: 6,
			WIDTH: 11,
			ASPECT: 1.3,
			X: 7,
		},
		POSITION: [6, 11, 1.3, 7, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone]),
			TYPE: "stormDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			MAX_CHILDREN: 6,
			WAIT_TO_CYCLE: true,
		},
	}, ],
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "stormProp",
	}, ],
};
Class.phs_vortexDrone = makeAuto("drone", "Vortex Drone", {
	type: "vortexTurret"
});
Class.phs_vortex_ = {
	PARENT: "genericTank",
	LABEL: "Vortex",
	STAT_NAMES: statnames.drone,
	BODY: {
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
		POSITION: {
			LENGTH: 6,
			WIDTH: 11,
			ASPECT: 1.3,
			X: 7,
		},
		POSITION: [6, 11, 1.3, 7, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.drone]),
			TYPE: "vortexDrone",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			MAX_CHILDREN: 6,
			WAIT_TO_CYCLE: true,
		},
	}, ],
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "vortexProp",
	}, ],
};
Class.phs_overstorm = {
	PARENT: "genericTank",
	LABEL: "Overstorm",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: 0.9 * base.SPEED,
		FOV: 1.1 * base.FOV,
	},
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "stormProp",
	}, ],
	GUNS: weaponArray({
			POSITION: [6, 12, 1.2, 8, 0, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
				TYPE: "vortexDrone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: "drone",
				WAIT_TO_CYCLE: true,
				MAX_CHILDREN: 4,
			},
		},
		2
	),
};
Class.phs_tyrant = {
	PARENT: "genericTank",
	LABEL: "Tyrant",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: 0.8 * base.SPEED,
		FOV: 1.1 * base.FOV,
	},
	MAX_CHILDREN: 8,
	GUNS: weaponArray({
			POSITION: [6, 12, 1.2, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
				TYPE: "autoDrone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: "drone",
				WAIT_TO_CYCLE: true,
			},
		},
		4
	),
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
};
Class.phs_spawnerdrive = {
	PARENT: "genericTank",
	LABEL: "Spawnerdrive",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: [{
			POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
		},
		{
			POSITION: [1, 12, 1, 15, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
				TYPE: "phs_autoMinion",
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
			},
		},
		{
			POSITION: [11.5, 12, 1, 0, 0, 0, 0],
		},
	],
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
};

Class.phs_spawnerstorm = {
	PARENT: "genericTank",
	LABEL: "Spawnerstorm",
	DANGER: 6,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: [{
			POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
		},
		{
			POSITION: [1, 12, 1, 15, 0, 0, 0],
			PROPERTIES: {
				MAX_CHILDREN: 4,
				SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
				TYPE: "stormMinion",
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
			},
		},
		{
			POSITION: [11.5, 12, 1, 0, 0, 0, 0],
		},
	],
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "stormProp",
	}, ],
};
Class.phs_factorydrive = {
	PARENT: "genericTank",
	LABEL: "Factorydrive",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: [{
			POSITION: [5, 11, 1, 10.5, 0, 0, 0],
		},
		{
			POSITION: [2, 14, 1, 15.5, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.factory]),
				TYPE: "phs_autoMinion",
				MAX_CHILDREN: 6,
				STAT_CALCULATOR: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
			},
		},
		{
			POSITION: [12, 14, 1, 0, 0, 0, 0],
		},
	],
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
};
Class.phs_autoOverdrive = {
	PARENT: "genericTank",
	LABEL: "Auto-Overdrive",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: 0.9 * base.SPEED,
		FOV: 1.1 * base.FOV,
	},
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "driveAutoTurret",
	}, ],
	GUNS: weaponArray({
			POSITION: [6, 12, 1.2, 8, 0, 90, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
				TYPE: "turretedDrone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: "drone",
				WAIT_TO_CYCLE: true,
				MAX_CHILDREN: 4,
			},
		},
		2
	),
};
// Overlords
Class.phs_overczar = {
	PARENT: "genericTank",
	LABEL: "Overczar",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: 0.8 * base.SPEED,
		FOV: 1.1 * base.FOV,
	},
	MAX_CHILDREN: 12,
	GUNS: weaponArray({
			POSITION: [6, 12, 1.2, 8, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
				TYPE: "drone",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				STAT_CALCULATOR: "drone",
				WAIT_TO_CYCLE: true,
			},
		},
		6
	),
};
// Spawners
Class.phs_captain = {
	PARENT: "genericTank",
	LABEL: "Captain",
	DANGER: 6,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: weaponArray(
		[{
				POSITION: [4.5, 10, 1, 10.5, 0, 90, 0],
			},
			{
				POSITION: [1, 12, 1, 15, 0, 90, 0],
				PROPERTIES: {
					MAX_CHILDREN: 4,
					SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
					TYPE: "minion",
					STAT_CALCULATOR: "drone",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				},
			},
			{
				POSITION: [11.5, 12, 1, 0, 0, 90, 0],
			},
		],
		2
	),
};
Class.phs_supervisor = {
	PARENT: "genericTank",
	LABEL: "Supervisor",
	DANGER: 6,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: weaponArray(
		[{
				POSITION: [4.5, 10, 1, 10.5, 0, 90, 0],
			},
			{
				POSITION: [1, 12, 1, 15, 0, 90, 0],
				PROPERTIES: {
					MAX_CHILDREN: 4,
					SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
					TYPE: "minion",
					STAT_CALCULATOR: "drone",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				},
			},
			{
				POSITION: [11.5, 12, 1, 0, 0, 90, 0],
			},
		],
		4
	),
};
Class.phs_captaindrive = {
	PARENT: "genericTank",
	LABEL: "Captaindrive",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: weaponArray(
		[{
				POSITION: [4.5, 10, 1, 10.5, 0, 90, 0],
			},
			{
				POSITION: [1, 12, 1, 15, 0, 90, 0],
				PROPERTIES: {
					MAX_CHILDREN: 4,
					SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
					TYPE: "phs_autoMinion",
					STAT_CALCULATOR: "drone",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				},
			},
			{
				POSITION: [11.5, 12, 1, 0, 0, 90, 0],
			},
		],
		2
	),
	TURRETS: [{
		POSITION: [9, 0, 0, 0, 360, 1],
		TYPE: "overdriveDeco",
	}, ],
};
Class.phs_mandarin = {
	PARENT: "genericTank",
	LABEL: "Mandarin",
	DANGER: 7,
	STAT_NAMES: statnames.drone,
	BODY: {
		SPEED: base.SPEED * 0.8,
		FOV: 1.1,
	},
	GUNS: weaponArray(
		[{
				POSITION: [5, 11, 1, 10.5, 0, 90, 0],
			},
			{
				POSITION: [2, 14, 1, 15.5, 0, 90, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.factory]),
					TYPE: "minion",
					MAX_CHILDREN: 6,
					STAT_CALCULATOR: "drone",
					AUTOFIRE: true,
					SYNCS_SKILLS: true,
				},
			},
			{
				POSITION: [12, 14, 1, 0, 0, 90, 0],
			},
		],
		2
	),
};
Class.phs_industry = {
    PARENT: "genericTank",
    LABEL: "Industry",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 13, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [3, 16, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, {damage: 0.4, size: 0.95}]),
                TYPE: "minion",
                MAX_CHILDREN: 8,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 16, 1, 0, 0, 0, 0],
        },
    ],
}
Class.phs_autoCaptain = makeAuto("captain");
Class.phs_phantom = makeRadialAuto("phs_sniperAutoTankGun", {
	isTurret: true,
	danger: 7,
	size: 10,
	arc: 80,
	label: "Phantom",
	body: {
		SPEED: 0.8 * base.SPEED,
		FOV: 1.1 * base.FOV
	},
});
Class.phs_phantom.GUNS = weaponArray({
		POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
	}, {
		POSITION: [1, 12, 1, 15, 0, 0, 0],
		PROPERTIES: {
			SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
			TYPE: "minion",
			AUTOFIRE: true,
			SYNCS_SKILLS: true,
			STAT_CALCULATOR: "drone",
			WAIT_TO_CYCLE: true,
			MAX_CHILDREN: 2,
		},
	}, {
		POSITION: [11.5, 12, 1, 0, 0, 0, 0],
	},
	3
);
Class.phs_governer = {
	PARENT: "genericTank",
	LABEL: "Governer",
	STAT_NAMES: statnames.drone,
	DANGER: 7,
	BODY: {
		FOV: base.FOV * 1.15,
	},
	GUNS: [
		...weaponArray({
			POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
		}, {
			POSITION: [1, 12, 1, 15, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
				TYPE: "minion",
				AUTOFIRE: true,
				SYNCS_SKILLS: true,
				MAX_CHILDREN: 2,
				STAT_CALCULATOR: "drone",
			},
		}, {
			POSITION: [11.5, 12, 1, 0, 0, 0, 0],
		}, 3),
		...weaponArray({
			POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.swarm, g.commander]),
				TYPE: "swarm",
				STAT_CALCULATOR: "swarm",
			},
		}, 3, 1 / 3),
	],
};
// Cruisers
Class.phs_warship = {
	PARENT: "genericTank",
	LABEL: "Warship",
	DANGER: 7,
	STAT_NAMES: statnames.swarm,
	FACING_TYPE: "locksFacing",
	BODY: {
		FOV: 1.2 * base.FOV,
	},
	GUNS: weaponArray(
		[{
				POSITION: [7, 7.5, 0.6, 7, 4, 90, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
					TYPE: "swarm",
					STAT_CALCULATOR: "swarm",
					LABEL: "Guided",
				},
			},
			{
				POSITION: [7, 7.5, 0.6, 7, -4, 90, 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.swarm]),
					TYPE: "autoswarm",
					STAT_CALCULATOR: "swarm",
					LABEL: "Autonomous",
				},
			},
		],
		4
	),
};
// Flanks
// Hexas
Class.phs_mingler = {
	PARENT: "genericTank",
	LABEL: "Mingler",
	DANGER: 6,
	GUNS: weaponArray(
		[{
				POSITION: [15, 3.5, 1, 0, 0, 30, 0.25],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [15, 3.5, 1, 0, 0, 90, 0.75],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [18, 8, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [18, 8, 1, 0, 0, 180, 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
					TYPE: "bullet",
				},
			},
		],
		3
	),
};
Class.phs_autoMingler = makeAuto("mingler");
Class.phs_unity = {
	PARENT: "genericTank",
	LABEL: "Unity",
	DANGER: 6,
	GUNS: weaponArray(
		[{
				POSITION: [17, 4, 1, 0, 0, 30, 0.25],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([
						g.basic,
						g.twin,
						g.gunner,
						g.flankGuard,
					]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [17, 4, 1, 0, 0, 90, 0.75],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([
						g.basic,
						g.twin,
						g.gunner,
						g.flankGuard,
					]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [21, 12, 1, 0, 0, 0, 0],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.pounder]),
					TYPE: "bullet",
				},
			},
			{
				POSITION: [21, 12, 1, 0, 0, 180, 0.5],
				PROPERTIES: {
					SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.pounder]),
					TYPE: "bullet",
				},
			},
		],
		3
	),
};
Class.phs_gale = {
    PARENT: "genericTank",
    DANGER: 6,
    LABEL: "Gale",
    GUNS: weaponArray([
          {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                TYPE: "bullet",
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam])
            }
          },
          {
            POSITION: [18, 8, 1, 0, 0, 45, 0.5],
            PROPERTIES: {
                TYPE: "bullet",
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard, g.spam])
            }
          },
          {
            POSITION: [15, 3.5, 1, 0, 0, 30, 0.5],
            PROPERIES: {
                TYPE: "bullet",
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone])
            }
          },
          {
            POSITION: [15, 3.5, 1, 0, 0, 60, 0],
            PROPERTIES: {
                TYPE: "bullet",
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone])
            }
          }
    ], 4)
};
// Machine Guns
// Artilleries
Class.phs_force = makeOver('artillery', "Force", {count: 1, independent: true, cycle: false})//Newton's 3rd law
// Forces
Class.overartillery = makeOver('artillery', "Overartillery", {count: 2, independent: false, cycle: false})

// Cheeses
Class.phs_biggerCheese = {
    PARENT: "genericTank",
    LABEL: "Bigger Cheese",
    STAT_NAMES: statnames.drone,
    DANGER: 7,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    GUNS: [
        {
            POSITION: [20, 20, 1.4, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone, g.bigCheese, g.bigCheese]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 1,
            },
        },
    ],
};

Class.phs_autoBigCheese = makeAuto("bigCheese");
// Autos
// Crowbars
Class.phs_crowbar = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Crowbar",
	BODY: {
		ACCELERATION: base.ACCEL * 0.6,
		SPEED: base.SPEED * 0.85,
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
			POSITION: [42, 6.5, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [6, 8.5, -1.5, 8, 0, 0, 0],
		},
	],
	TURRETS: [{
			POSITION: [6, 42, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 32, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 22, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
	],
};

Class.phs_spanner = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Spanner",
	BODY: {
		ACCELERATION: base.ACCEL * 0.6,
		SPEED: base.SPEED * 0.85,
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
			POSITION: [46, 4, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, { recoil: 0.6 }]),
				TYPE: "bullet",
			},
		},
		{
			POSITION: [42, 6.5, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [6, 8.5, -1.5, 8, 0, 0, 0],
		},
	],
	TURRETS: [{
			POSITION: [6, 42, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 32, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 22, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
	],
};

Class.phs_wrench = {
	PARENT: "genericTank",
	DANGER: 7,
	LABEL: "Wrench",
	BODY: {
		ACCELERATION: base.ACCEL * 0.6,
		SPEED: base.SPEED * 0.85,
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
			POSITION: [72, 6.5, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [6, 8.5, -1.5, 8, 0, 0, 0],
		},
	],
	TURRETS: [{
			POSITION: [6, 72, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 62, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 52, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
	],
};

Class.phs_pryer = {
	PARENT: "genericTank",
	DANGER: 8,
	LABEL: "Pryer",
	BODY: {
		ACCELERATION: base.ACCEL * 0.6,
		SPEED: base.SPEED * 0.85,
		FOV: base.FOV * 1.1,
	},
	GUNS: [{
			POSITION: [62, 6.5, 1, 0, 0, 0, 0],
		},
		{
			POSITION: [6, 8.5, -1.5, 8, 0, 0, 0],
		},
	],
	TURRETS: [{
			POSITION: [6, 62, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 52, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 42, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 32, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
		{
			POSITION: [6, 22, 0, 0, 360, 1],
			TYPE: [
				"phs_crowbarTurret",
				{ INDEPENDENT: true }
			],
		},
	],
};

Class.phs_spindle = makeOver("crowbar", "Spindle", {
	count: 1,
	independent: true,
	cycle: false,
});

// Tri Angles
Class.phs_brawler = makeFighter("booster", "Brawler");
Class.phs_autoSurfer = makeAuto("surfer");
Class.phs_condor = makeSurfer("eagle", "Condor");
Class.phs_soarer = makeSurfer("booster", "Soarer");
Class.phs_autoBooster = makeAuto("booster");
Class.phs_autoFighter = makeAuto("fighter");
Class.phs_defect = makeBird("tripleShot", "Defect");
Class.phs_klutz = makeSurfer("defect", "Klutz");
Class.phs_deficiency = makeBird("pentaShot", "Deficiency");
Class.phs_autoDefect = makeAuto("defect");
Class.phs_mangle = makeFighter("defect");
Class.phs_autoCockatiel = makeAuto("cockatiel");
Class.phs_autoBomber = makeAuto("bomber");
Class.phs_autoSurfer = makeAuto("surfer");
Class.phs_autoEagle = makeAuto("eagle");
Class.phs_virago = addBackGunner("eagle", "Virago");
Class.phs_parakeet = makeBird("stall", "Parakeet");
Class.phs_quarrion = makeBird("encircler");
Class.phs_cacatua = makeBird("operator");
Class.phs_cockatoo = makeFighter("cockatiel");
Class.phs_parrot = makeSurfer("cockatiel");
Class.phs_corella = makeBird("hutch");
Class.phs_nuker = makeBomber({
		PARENT: "genericTank",
		BODY: {
			DENSITY: base.DENSITY * 0.6,
		},
		DANGER: 7,
		GUNS: [{
			POSITION: [20, 8, 1, 0, 0, 0, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([
					g.basic,
					g.flankGuard,
					g.triAngle,
					g.triAngleFront,
				]),
				TYPE: "bullet",
				LABEL: "Front",
			},
		}, ],
	},
	"Nuker", {
		pen: 1,
		thrusters: 1
	}
);

// Branches

if (Config.ARMS_RACE) {
// Trapper Branch
Class.phs_trapper.UPGRADES_TIER_2.push(...["phs_pen"]);
Class.phs_pen.UPGRADES_TIER_3 = ["phs_stall","phs_tripen","phs_encircler","phs_incarcerator","phs_operator","phs_cockatiel","phs_hutch","phs_interner","phs_autoPen","phs_fortifier",];
Class.phs_tripen.UPGRADES_TIER_3 = ["phs_corral"];
Class.phs_stall.UPGRADES_TIER_3 = ["phs_cubicle", "phs_hurdle", "phs_overthrower"];
Class.phs_fortress.UPGRADES_TIER_3 = ["phs_corral", "phs_coop"];
Class.phs_engineer.UPGRADES_TIER_3 = ["phs_cubicle", "phs_autoEngineer"];
Class.phs_construct.UPGRADES_TIER_3 = ["phs_hurdle", "phs_autoConstruct"];
Class.phs_builder.UPGRADES_TIER_3.push(["phs_stall"]);
// Pounder Branch
Class.phs_inception.UPGRADES_TIER_3 = ["phs_hognose"];
Class.phs_sidewinder.UPGRADES_TIER_3 = ["phs_hognose"];
// Director Branch
Class.phs_director.UPGRADES_TIER_2.push(["phs_directordrive"]);
Class.phs_directordrive.UPGRADES_TIER_2 = ["phs_overdrive", "phs_directorstorm", "phs_spawnerdrive"];
Class.phs_directorstorm.UPGRADES_TIER_3 = ["phs_vortex_", "phs_overstorm"];
Class.phs_overdrive.UPGRADES_TIER_3 = ["phs_overstorm", "phs_autoOverdrive"];
Class.phs_overlord.UPGRADES_TIER_3 = ["phs_tyrant"];
Class.phs_spawner.UPGRADES_TIER_2 = ["phs_foundry", "phs_megaSpawner"]
Class.phs_spawnerdrive.UPGRADES_TIER_3 = ["phs_spawnerstorm"];
Class.phs_megaSpawner.UPGRADES_TIER_3 = ["phs_ultraSpawner"];
Class.phs_foundry.UPGRADES_TIER_3 = ["phs_topBanana"];
// Flank Guard Branch
Class.phs_triAngle.UPGRADES_TIER_2 = ["phs_cockatiel"];
Class.phs_cockatiel.UPGRADES_TIER_3 = ["phs_autoCockatiel", "phs_parakeet", "phs_quarrion", "phs_cacatua", "phs_cockatoo", "phs_corella"];
Class.phs_booster.UPGRADES_TIER_3 = ["brawler"];
Class.phs_fighter.UPGRADES_TIER_3 = ["brawler"];
Class.autoTriAngle.UPGRADES_TIER_3 = ["phs_autoSurfer", "phs_autoBooster", "phs_autoBomber", "phs_autoFighter", "phs_autoDeflect", "phs_autoCockatiel", "phs_autoBomber"];
Class.phs_crowbar.UPGRADES_TIER_3 = ["phs_wrench","phs_pryer","phs_spindle","phs_spanner"];
// Machine Gun Branch

// Sniper Branch

// Twin Branch

// Tanks
};
console.log("[Arms Race Addon] Loaded Arms Race.");