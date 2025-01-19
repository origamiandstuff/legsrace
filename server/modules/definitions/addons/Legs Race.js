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
const note = () => {}
const b = {
    
}
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

const makeNuker = (type, name = -1, reload = 2.15) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [
        {
            POSITION: [15, 8, 1, 0, 0, 90, 0],
        }, 
        {
            POSITION: [4, 8, 1.7, 15, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {reload: reload}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [15, 8, 1, 0, 0, -90, 0],
        }, 
        {
            POSITION: [4, 8, 1.7, 15, 0, -90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, {reload: reload}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
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
	if (gunType.pen == 1) {
		cannons.push({
			POSITION: [15, 8, 1, 0, 0, 180, 0],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic]),
				TYPE: "bullet",
				LABEL: "Pen",
			},
		});
	}
  cannons.push({
        POSITION: [13, 8, 1, 0, 0, 180, 0],
    }, {
        POSITION: [4, 8, 1.7, 13, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.trap]),
            TYPE: "trap",
            STAT_CALCULATOR: "trap",
        }
    })
      cannons.push(
      {
			POSITION: [18, 8, 1, 0, 0, 130, 0.1],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
				TYPE: "bullet",
				LABEL: "Wing",
			},
	  	}, 
      {
			POSITION: [18, 8, 1, 0, 0, 230, 0.1],
			PROPERTIES: {
				SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle]),
				TYPE: "bullet",
				LABEL: "Wing",
			},
		  } 
      )
	output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
	output.LABEL = name == -1 ? "Bomber " + type.LABEL : name;
	return output;
};

const addBackDroner = (type, name = -1, droner, independent = false) => {
    type = ensureIsClass(type);
    droner = ensureIsClass(droner);
    let output = dereference(type);

    let cannons = droner.GUNS.map(gun => {
        let guns = { 
            ...gun, 
            POSITION: [...gun.POSITION] 
        };
        guns.POSITION[5] = (guns.POSITION[5] + 180) % 360;

        guns.PROPERTIES = { 
            ...gun.PROPERTIES, 
            TYPE: [gun.PROPERTIES.TYPE || gun.PROPERTIES.TYPE[0] || "drone", { INDEPENDENT: independent }]
        };
        return guns;
    });
  
    output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
    output.LABEL = name == -1 ? droner.LABEL + type.LABEL : name;
    
    return output;
};

const makeHangar = (type, name = -1) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [
        {
            POSITION: [8, 7, 0.6, 3.5, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [8, 7, 0.6, 3.5, -6, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
	];
  let h = {
      GUNS: []
  }
  h.GUNS = cannons
  h.GUNS = h.GUNS.concat(output.GUNS);
	output.GUNS = h.GUNS;
	output.LABEL = name == -1 ? "whar " + type.LABEL : name;
	return output;
};

const makeCoordinator = (type, name = -1) => {
	type = ensureIsClass(type);
	let output = dereference(type);
	let cannons = [
      easyGun([19.5, 8, 1, 0, 0, 0, 0])
	];
  let h = {}
  h.GUNS = cannons
  h.GUNS = h.GUNS.concat(output.GUNS);
	output.GUNS = h.GUNS;
	output.LABEL = name == -1 ? "dawg what are you doing you didnt rename the tank" : name;
	return output;
};

const addThrusters = (front = false, booster = false, onlyFront = false) => {
        let guns = []
        if (onlyFront == false) {
        guns = (booster == false ? [{
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster",
            },
        },
        {
            POSITION: [16, 8, 1, 0, 0, 210, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster",
            },
        }] : [{
            POSITION: [14, 8, 1, 0, -1, 140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [14, 8, 1, 0, 1, -140, 0.6],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, 150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 0, -150, 0.1],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.thruster]),
                TYPE: "bullet",
                LABEL: "thruster"
            }
        }])
        }
        if (front == true) guns.push(
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront, { recoil: 4 }]),
                TYPE: "bullet",
                LABEL: "Front",
            },
        },
        )
        return guns;
}

const animate = (me, baseName, frames, reverse, delay) => {
    if (reverse) {
            me.destroyAllChildren();
            for ( let i = frames - 1; i > -1; i-- ) {
                let multiplier = frames - i;
                setTimeout(() => {
                    me.define(Class[`${baseName}${i}`]);
                }, (multiplier - 1) * delay);
            }
    } else {
            me.destroyAllChildren();
            for ( let i = 1; i < frames + 1; i++ ) {
                setTimeout(() => {
                    me.define(Class[`${baseName}${i}`]);
                }, i * delay);
            }
        }
}

const easyGun = (POSITION = [18, 8, 1, 0, 0, 0, 0], TYPE = "bullet", SHOOT_SETTINGS = [g.basic], LABEL = null, ALT_FIRE = false) => {
    return {
        POSITION: POSITION,
        PROPERTIES: {
            TYPE: TYPE,
            SHOOT_SETTINGS: combineStats(SHOOT_SETTINGS),
            LABEL: LABEL,
            ALT_FIRE: ALT_FIRE
        }
    }
}
const triSwarm = (dir = 0, gunvals = []) => {
      let gg = [g.swarm]
      for (let i = 0; i < gunvals.length; i++) gg.push(gunvals[i])
      return [
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 60 + dir, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats(gg),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
          },
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 180 + dir, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats(gg),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
          },
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 300 + dir, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats(gg),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
          },
      ]
}
const sts = (type = null) => {
  if (type == "trig") {
    return {
        HEALTH: 0.8 * base.HEALTH,
        SHIELD: 0.8 * base.SHIELD,
        DENSITY: 0.6 * base.DENSITY,
    }
  } else if (type == "a") {
    
  }
}
const makeMinion = (type = "basic", label = "Minion", stats = [g.basic]) => {
console.log(type)
let base = dereference(type);
let output = {
    PARENT: "genericTank",
    LABEL: label,
    TYPE: "minion",
    DAMAGE_CLASS: 0,
    HITS_OWN_TYPE: "hard",
    FACING_TYPE: "smoothToTarget",
    BODY: {
        FOV: 0.5,
        SPEED: 3,
        ACCELERATION: 1,
        HEALTH: 5,
        SHIELD: 0,
        DAMAGE: 1.2,
        RESIST: 1,
        PENETRATION: 1,
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
    GUNS: base.GUNS,
    TURRETS: base.TURRETS,
    ON: base.ON,
}
  stats.push(g.minionGun)
  for (let i = 0; i < base.GUNS.length; i++) {
      if ('PROPERTIES' in base.GUNS[i]) {
          if ('SHOOT_SETTINGS' in base.GUNS[i].PROPERTIES) {
              output.GUNS[i].PROPERTIES.SHOOT_SETTINGS = combineStats(stats)
          }
      }
  }
return output;
}

const turretTypes = ["ori_stormAutoTurret", "ori_machineAutoTurret", "ori_sniperAutoTurret", "ori_twinAutoTurret", "ori_pounderAutoTurret", "ori_FlankAutoTurret", "ori_TrapperAutoTurret"]
const turretNames = ["Storm", "Machine", "Sniper", "Twin", "Pounder", "Flank", "Trap"]
const turretClassNames = ["storm", "machine", "sniper", "twin", "pounder", "flank", "trapper"]
const defineAutoUpgrades = (type, className, upgradeType) => {
  let hhh = type
	type = ensureIsClass(type);
	let output = dereference(type);
  if ("UPGRADES_TIER_3" in Class[upgradeType]) {} else Class[upgradeType].UPGRADES_TIER_3 = []
	for (let i = 0; i < turretNames.length; i++) {
      Class["ori_" + turretClassNames[i] + "Auto" + className] = makeAuto(hhh, `${turretNames[i]}-Auto-${type.LABEL}`, {type: turretTypes[i]})
      Class[upgradeType].UPGRADES_TIER_3.push(`ori_${turretClassNames[i]}Auto${className}`)
  }
}
const pushMakeAuto = (type, h, name = "", path, opts = {}) => {
    Class["ori_auto" + h] = makeAuto(type, name, opts)
        if ("UPGRADES_TIER_3" in Class[path]) {} else Class[path].UPGRADES_TIER_3 = []
        Class[path].UPGRADES_TIER_3.push(`ori_auto${h}`)
}
// TURRETS
Class.ori_sniperAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [28, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.sniper]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.ori_stormAutoTurret = makeTurret({
    GUNS: [
        easyGun([7, 7.5, 0.6, 7, 0, 0, 0.5], "swarm", [g.swarm, g.pelleter, g.power]),
    ],
}, {label: "Storm Auto Turret", fov: 0.8, extraStats: []})
Class.ori_machineAutoTurret = makeTurret("machineGun", {label: "Machine Auto Turret", fov: 0.8, extraStats: [g.pelleter, g.power]})
Class.ori_sniperAutoTurret = makeTurret("sniper", {label: "Sniper Auto Turret", fov: 1, extraStats: [g.pelleter, g.power]})
Class.ori_twinAutoTurret = makeTurret("twin", {label: "Twin Auto Turret", fov: 0.8, extraStats: [g.pelleter, g.power]})
Class.ori_pounderAutoTurret = makeTurret("pounder", {label: "Sniper Auto Turret", fov: 1, extraStats: [g.pelleter, g.power]})
Class.ori_FlankAutoTurret = makeTurret("flankGuard", {label: "Flank Auto Turret", fov: 1, extraStats: [g.pelleter, g.power]})
Class.ori_TrapperAutoTurret = makeTurret("trapper", {label: "Trapper Auto Turret", fov: 0.8, extraStats: [g.pelleter, g.power]})
Class.ori_autoMinionGun = makeTurret({
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.minionGun]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})
Class.ori_fakeAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [28, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.fake, {shudder: 0}]),
                TYPE: "bullet",
            },
        },
    ],
}, {canRepel: true, limitFov: true, fov: 3})

// PROPS
Class.ori_roundDeco = makeDeco(0)
Class.ori_divaDeco = makeRadialAuto("ori_fakeAutoTankGun", {isTurret: true, danger: 6, label: ""})
Class.ori_divaDeco.COLOR = "grey"

// PROJECTILES
Class.ori_dancerMinion = makeMinion("flankGuard", "Flank Guard Minion", [g.basic, g.flankGuard]);
Class.ori_performerMinion = makeMinion("hexaTank", "Hexa Tank Minion", [g.basic, g.flankGuard, g.flankGuard]);
Class.ori_ballerinaMinion = makeMinion({
    PARENT: "genericTank",
    GUNS: triSwarm(0, [{range: 0.3, size: 0.65}])
}, "Ballerina Minion")
Class.ori_showpersonMinion = makeAuto("ori_dancerMinion", "Auto-Flank Guard Minion", {type: "droneAutoTurret"})
Class.ori_divaAuto3 = makeRadialAuto("ori_autoMinionGun", {isTurret: true, danger: 6, label: ""})
Class.ori_divaAuto3.GUNS = []
Class.ori_divaMinion = makeMinion("ori_divaAuto3", "Auto-3 Minion", [])
Class.ori_playwriteMinion = {
    PARENT: "minion",
    LABEL: "Trap Guard Minion",
    GUNS: [
        {
            POSITION: [17, 9, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.minionGun]),
                WAIT_TO_CYCLE: true,
                TYPE: "bullet",
            },
        },
        {
            POSITION: [13, 8, 1, 0, 0, 180, 0],
        }, {
            POSITION: [4, 8, 1.7, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minionGun]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            }
        }
    ]
}
Class.ori_symphonyTwin = makeMinion("twin", "Twin Minion", [g.basic, g.twin]);
Class.ori_symphonySniper = makeMinion("sniper", "Sniper Minion", [g.basic, g.sniper]);
Class.ori_symphonyPounder = makeMinion("pounder", "Pounder Minion", [g.basic, g.pounder]);
Class.ori_symphonyTrapper = makeMinion("trapper", "Trapper Minion", [g.trap]);
Class.ori_symphonySingle = makeMinion("single", "Single Minion", [g.basic, g.single]);
Class.ori_autoMinion = makeAuto("minion", "Auto-Flank Guard Minion", {type: "droneAutoTurret"})

// TANKS

// Twin Upgrades
Class.ori_hitman = {
    PARENT: "genericTank",
    LABEL: "Hitman",
    BODY: {
      FOV: base.FOV * 1.225
    },
    GUNS: [
        {
            POSITION: [24, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.twin]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: [24, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.twin]),
                TYPE: "bullet",
            }
        },
    ],
}
Class.ori_trapezium = {
    PARENT: "genericTank",
    LABEL: "Trapezium",
    BODY: sts("tri"),
    GUNS: [
        easyGun([18, 8, 1, 0, 5.5, 0, 0], "bullet", [g.basic, g.twin, g.triAngle, g.triAngleFront, {recoil: 2}]),
        easyGun([18, 8, 1, 0, -5.5, 0, 0.5], "bullet", [g.basic, g.twin, g.triAngle, g.triAngleFront, {recoil: 2}]),
        ...addThrusters(),
    ]
}
Class.ori_doubleGunner = {
    PARENT: "genericTank",
    LABEL: "Double Gunner",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], 2)
}

// Double Twin Upgrades

// Triple Twin Upgrades
Class.ori_quadTwin = {
    PARENT: "genericTank",
    LABEL: "Quad Twin",
    GUNS: [
        ...weaponArray(easyGun([18, 8, 1, 0, 5.5, 0, 0], "bullet", [g.basic, g.twin, g.spam, g.doubleTwin]), 4),
        ...weaponArray(easyGun([18, 8, 1, 0, -5.5, 0, 0.5], "bullet", [g.basic, g.twin, g.spam, g.doubleTwin]), 4),
    ]
}
Class.ori_battery = {
    PARENT: "genericTank",
    LABEL: "Battery",
    GUNS: [
        ...weaponArray(easyGun([18, 8, 1, 0, 5.5, 0, 0], "bullet", [g.basic, g.twin, g.spam, g.doubleTwin]), 3),
        ...weaponArray(easyGun([18, 8, 1, 0, -5.5, 0, 0.5], "bullet", [g.basic, g.twin, g.spam, g.doubleTwin]), 3),
        ...triSwarm()
    ]
}
Class.ori_tripleTripleShot = {
    PARENT: "genericTank",
    LABEL: "Triple Triple Shot",
    DANGER: 6,
    BODY: {
        SPEED: base.SPEED * 0.85
    },
    GUNS: weaponArray([
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: -2,
                ANGLE: -17.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 19,
                WIDTH: 8,
                Y: 2,
                ANGLE: 17.5,
                DELAY: 0.5
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: {
                LENGTH: 22,
                WIDTH: 8
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.spam, g.doubleTwin]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.ori_autoTriple = makeAuto("tripleTwin", "Auto-Triple")
Class.ori_tripleGunner = {
    PARENT: "genericTank",
    LABEL: "Triple Gunner",
    DANGER: 7,
    GUNS: weaponArray([
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.spam, g.doubleTwin, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ], 3)
}

// Hewn Double Upgrades
Class.ori_slicedDouble = {
    PARENT: "genericTank",
    LABEL: "Sliced Double",
    DANGER: 7,
    BODY: {
        SPEED: base.SPEED * 1.15
    },
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 5.5, 205, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 5.5, 25, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -25, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.ori_hackedDouble = {
    PARENT: "genericTank",
    LABEL: "Hacked Double",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 5.5, 230, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -230, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 5.5, 205, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.ori_carvedDouble = makeSurfer("hewnDouble", "Carved Double")
Class.ori_chippedDouble = makeFighter("hewnDouble", "Chipped Double")
Class.ori_autoHewnDouble = makeAuto("hewnDouble")
Class.ori_chiselledDouble = {
    PARENT: "genericTank",
    LABEL: "Chiselled Double",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 5.5, 205, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 17.5, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
    ]
}
Class.ori_fashionedDouble = {
    PARENT: "genericTank",
    LABEL: "Fashioned Double",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 5.5, 205, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 0, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 0, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.ori_cutDouble = makeNuker("hewnDouble", "Cut Double")
Class.ori_shavedDouble = {
    PARENT: "genericTank",
    LABEL: "Shaved Double",
    DANGER: 7,
    GUNS: [
        {
            POSITION: [19, 8, 1, 0, 5.5, 205, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -5.5, -205, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.twin, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, 7.25, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [12, 3.5, 1, 0, -7.25, 180, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, 3.75, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 3.5, 1, 0, -3.75, 180, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.doubleTwin, g.hewnDouble, { recoil: 1.15 }, { speed: 1.2 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, 5.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [20, 8, 1, 0, -5.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.doubleTwin, g.hewnDouble]),
                TYPE: "bullet"
            }
        }
    ]
}

// Bent Double Upgrades
Class.ori_warpedDouble = {
    PARENT: "genericTank",
    LABEL: "Warped Double",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: weaponArray([
        {
            POSITION: [16, 8, 1, 0, -3, -30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        }
    ], 2)
}
Class.ori_dentedDouble = makeFighter("bentDouble", "Dented Double")
Class.ori_disfiguredDouble = makeSurfer("bentDouble", "Disfigured Double")
Class.ori_mutilatedDouble = makeNuker("bentDouble", "Mutilated Double")
Class.ori_mutatedDouble = {
    PARENT: "genericTank",
    LABEL: "Mutated Double",
    DANGER: 7,
    BODY: {
        SPEED: 0.85 * base.SPEED
    },
    GUNS: [
        {
            POSITION: [13, 8, 1, 0, -4, -45, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [13, 8, 1, 0, 4, 45, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8, 1, 0, -3, -30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [16, 8, 1, 0, 3, 30, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -15, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 15, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, -2, -195, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 8, 1, 0, 2, 195, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [22, 8, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.tripleShot]),
                TYPE: "bullet"
            }
        },
    ]
}


// Triple Shot Upgrades

// Gunner Upgrades

// Hexa Tank Upgrades

// Machine Gun Upgrades
Class.ori_rainmaker = {
    PARENT: "genericTank",
    LABEL: "Rainmaker",
    GUNS: [
        easyGun([8, 10, 1.45, 14, 0, 0, 0], "bullet", [g.basic, g.machineGun, {pen: 1.5, reload: 1.15, spray: 1.15, shudder: 0.4}]),
        easyGun([12, 9, 1.65, 7, 0, 0, 0.5], "bullet", [g.basic, g.machineGun, {size: 0.85, pen: 1.5, reload: 1.25, spray: 1.4, shudder: 0.4}]),
    ]
}

// Sniper Upgrades

// Assassin Upgrades

// Auto-Assassin Upgrades
defineAutoUpgrades("assassin", "Assassin", "autoAssassin")

// Ranger Upgrades
Class.ori_iconoclast0 = {
    PARENT: "genericTank",
    LABEL: "Iconoclast",
    DANGER: 7,
    BODY: {
        SPEED: 0.8 * base.SPEED,
        FOV: 1.5 * base.FOV,
    },
    ON_ALT: (body) => animate(body, "ori_iconoclast", 30, false, 21),
    GUNS: [
        {
            POSITION: [32, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0],
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#0000FF`
            }
        },
    ],
}
for ( let ii = 1; ii < 30; ii++ ) {
    let R1 = Math.floor((255 / 30) * ii)
    let R = R1.toString(16)
    let B1 = Math.floor((255 / 30) * (30 - ii))
    let B = B1.toString(16)
    Class["ori_iconoclast" + ii] = {
    PARENT: "genericTank",
    LABEL: "Iconoclast",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * (0.8 + (0.2 / 30) * ii),
        FOV: base.FOV * (1.5 - (0.5 / 30) * ii),
    },
    GUNS: [
        {
            POSITION: [32 - ((32 - 20.5) / 30) * ii, 8 + ((19.5 - 8) / 30) * ii, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [5 - (1/6) * ii, 8 + ((19.5 - 8) / 30) * ii, -1.4 + (0.4/30) * ii, 8 - (2/15) * ii, 0, 0, 0],
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#${R}00${B}`
            }
        },
    ],
}
}
Class.ori_iconoclast30 = {
    PARENT: "genericTank",
    LABEL: "Iconoclast",
    DANGER: 7,
    ON_ALT: (body) => animate(body, "ori_iconoclast", 30, true, 21),
    GUNS: [
        {
            POSITION: [20.5, 19.5, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.destroyer, g.annihilator]),
                TYPE: "bullet",
            },
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#FF0000`
            }
        },
    ],
}

// Rifle Upgrades
Class.ori_ritual0 = {
    PARENT: "genericTank",
    LABEL: "Ritual",
    BODY: {
        FOV: base.FOV * 1.225
    },
    ON_ALT: (body) => {animate(body, "ori_ritual", 10, false, 21), body.health.amount = body.health.amount - 40 },
    GUNS: [
        {
            POSITION: [20, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [24, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#0000FF`
            }
        },
    ]
}
for ( let ii = 1; ii < 10; ii++ ) {
    let R1 = Math.floor((255 / 10) * ii)
    let R = R1.toString(16)
    let B1 = Math.floor((255 / 10) * (10 - ii))
    let B = B1.toString(16)
    Class["ori_ritual" + ii] = {
        PARENT: "genericTank",
        LABEL: "Ritual",
        BODY: {
            FOV: base.FOV * 1.225
        },
        GUNS: [
            {
                POSITION: [20 + (ii * 0.2), 12, 1, 0, 0, 0, 0]
            },
            {
                POSITION: [24 + (ii * 0.2), 7, 1, 0, 0, 0, 0],
            },
            {
                POSITION: [14, 4, 1, 0, 0, 0, 0],
                PROPERTIES: {
                    COLOR: `#${R}00${B}`
                }
            }
        ]
    }
}
Class.ori_ritual10 = {
    PARENT: "genericTank",
    LABEL: "Ritual",
    BODY: {
        FOV: base.FOV * 1.225
    },
    ON_MAIN: (body) => animate(body, "ori_ritual", 10, true, 21),
    GUNS: [
        {
            POSITION: [22, 12, 1, 0, 0, 0, 0]
        },
        {
            POSITION: [26, 7, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.rifle, { damage: 2.5, pen: 2, health: 1.6, speed: 1.8 }]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#FF0000`
            }
        },
    ]
}

// Flank Guard Upgrades

// Tri Angle Upgrades
Class.ori_nuker = makeNuker("triAngle", "Nuker")
Class.ori_quadAngle = {
    PARENT: "genericTank",
    LABEL: "Quad-Angle",
    BODY: sts("tri"),
    GUNS: addThrusters(false, false),
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}

// Fighter Upgrades
Class.ori_gangster = makeFighter({
    PARENT: "genericTank",
    BODY: sts("tri"),
    GUNS: addThrusters(true, true)
}, "Gangster")
Class.ori_terrorist = {
    PARENT: "genericTank",
    LABEL: "Terrorist",
    BODY: sts("tri"),
    GUNS: [
        easyGun([17, 8, 1, 0, -1, 90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        easyGun([17, 8, 1, 0, 1, -90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        easyGun([4, 8, 1.7, 11, -1, 90, 0], "trap", [g.trap, {reload: 2.15}], "Side"),
        easyGun([4, 8, 1.7, 11, 1, -90, 0], "trap", [g.trap, {reload: 2.15}], "Side"),
        ...addThrusters(true, false)
    ]
}
Class.ori_boxer = {
    PARENT: "genericTank",
    LABEL: "Boxer",
    BODY: sts("tri"),
    GUNS: [
        ...addThrusters(true, false),
        easyGun([16, 5, 1, 0, -4, 90, 0.5], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront, g.twin], "Side"),
        easyGun([16, 5, 1, 0, 3, -90, 0.5], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront, g.twin], "Side"),
        easyGun([16, 5, 1, 0, 3, 90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront, g.twin], "Side"),
        easyGun([16, 5, 1, 0, -4, -90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront, g.twin], "Side"),
    ]
}
Class.ori_streetfighter = {
    PARENT: "genericTank",
    LABEL: "Streetfighter",
    BODY: sts("tri"),
    GUNS: [
        easyGun([16, 8, 1, 0, -1, 90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        easyGun([16, 8, 1, 0, 1, -90, 0], "bullet", [g.basic, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        ...addThrusters(true, false),
        easyGun([4, 8, 1.7, 11, 0, 0, 0], "trap", [g.trap, g.flankGuard, g.triAngle, g.triAngleFront], "Front"),
    ]
}
Class.ori_warplane = makeSurfer("fighter", "Warplane")
Class.ori_combatant = makeFighter({
    PARENT: "genericTank",
    BODY: sts("tri"),
    GUNS: [
        easyGun([21, 14, 1, 0, 0, 0, 0], "bullet", [g.basic, g.pounder, g.destroyer, g.flankGuard, g.triAngle, g.triAngleFront], "Front", true),
        ...addThrusters(false, false),
    ]
}, "Combatant")
Class.ori_soldier = {
    PARENT: "genericTank",
    LABEL: "Soldier",
    BODY: sts("tri"),
    GUNS: [
        easyGun([16.5, 12, 1, 0, 0, 90, 0], "bullet", [g.basic, g.pounder, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        easyGun([16.5, 12, 1, 0, 0, -90, 0], "bullet", [g.basic, g.pounder, g.flankGuard, g.triAngle, g.triAngleFront], "Side"),
        ...addThrusters(true, false),
    ]
}
Class.ori_warrior = makeFighter({
    PARENT: "genericTank",
    BODY: sts("tri"),
    GUNS: [
        easyGun([18, 8, 1, 0, 5.5, 0, 0], "bullet", [g.basic, g.twin, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: 2}]),
        easyGun([18, 8, 1, 0, -5.5, 0, 0.5], "bullet", [g.basic, g.twin, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: 2}]),
        ...addThrusters(false, false),
    ]
}, "Warrior")
note("scrimmer")
Class.ori_detonator = makeFighter("bomber", "Detonator")
Class.ori_autoFighter = makeAuto("fighter")

// Booster Upgrades
Class.ori_rocket = {
    PARENT: "genericTank",
    LABEL: "Rocket",
    BODY: sts("tri"),
    DANGER: 7,
    GUNS: [
        easyGun([12, 8, 1, 0, -1, 130, 0.85], "bullet", [g.basic, g.flankGuard, g.triAngle, g.thruster]),
        easyGun([12, 8, 1, 0, 1, -130, 0.85], "bullet", [g.basic, g.flankGuard, g.triAngle, g.thruster]),
        ...addThrusters(true, true)
    ]
}
note("gangsta")
Class.ori_minelayer = makeBomber({
    PARENT: "genericTank",
    BODY: sts("tri"),
    GUNS: [
        ...addThrusters(true, false, true),
        easyGun([16, 8, 1, 0, 0, 120, 0.2], "bullet", [g.basic, g.flankGuard, g.triAngle], "Wing"),
        easyGun([16, 8, 1, 0, 0, -120, 0.2], "bullet", [g.basic, g.flankGuard, g.triAngle], "Wing"),
    ]
}, "Minelayer", {thrusters: 1, pen: 0})
Class.ori_browser = makeSurfer("booster", "Browser")
Class.ori_trinitrotoluene = makeNuker("booster", "Trinitrotoluene")
Class.ori_jet = {
    PARENT: "genericTank",
    LABEL: "Jet",
    BODY: sts("tri"),
    GUNS: [
        easyGun([18, 8, 1, 0, 5.5, 0, 0], "bullet", [g.basic, g.twin, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: 2}]),
        easyGun([18, 8, 1, 0, -5.5, 0, 0.5], "bullet", [g.basic, g.twin, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: 2}]),
        ...addThrusters(false, true),
    ]
}
Class.ori_advocate = {
    PARENT: "genericTank",
    LABEL: "Advocate",
    BODY: sts("tri"),
    GUNS: [
        easyGun([21, 14, 1, 0, 0, 0, 0], "bullet", [g.basic, g.pounder, g.destroyer, g.flankGuard, g.triAngle, g.triAngleFront], "Front", true),
        ...addThrusters(false, true),
    ]
}
Class.ori_exhaust = {
    PARENT: "genericTank",
    LABEL: "Exhaust",
    BODY: sts("tri"),
    GUNS: [
        easyGun([9, 10, 1.3, 8, 0, 180, 0], "bullet", [g.basic, g.machineGun, g.flankGuard, g.triAngle, g.triAngleFront, {recoil: 0.2}]),
        ...addThrusters(true, true),
    ]
}
Class.ori_complier = {
    PARENT: "genericTank",
    LABEL: "Complier",
    BODY: sts("tri"),
    GUNS: [
        {
            POSITION: [6, 8, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 3,
                WAIT_TO_CYCLE: true
            }
        },
        ...addThrusters(true, true),
    ]
}
Class.ori_autoBooster = makeAuto("booster")
          
// Quad-Angle Upgrades
Class.ori_scrimmer = {
    PARENT: "genericTank",
    LABEL: "Scrimmer",
    BODY: sts("tri"),
    GUNS: addThrusters(true, false),
    TURRETS: [
        {
            POSITION: [9, 8, 0, 90, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -90, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_aspirer = {
    PARENT: "genericTank",
    LABEL: "Aspirer",
    BODY: sts("tri"),
    GUNS: addThrusters(false, true),
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_fleeter = makeBomber({
    PARENT: "genericTank",
    BODY: sts("tri"),
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}, "fleeter", {pen: 0, thrusters: 1})
Class.ori_autoQuadAngle = makeAuto("ori_quadAngle")
Class.ori_glider = makeSurfer("ori_quadAngle", "Glider")
Class.ori_conformer = {
    PARENT: "genericTank",
    LABEL: "Conformer",
    BODY: sts("tri"),
    GUNS: [
        {
            POSITION: [6, 8, 1.3, 7, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 3,
                WAIT_TO_CYCLE: true
            }
        },
        ...addThrusters(false, false), 
    ],
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_spoiler = {
    PARENT: "ori_quadAngle",
    LABEL: "Spoiler",
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["megaAutoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["megaAutoTankGun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_mandible = {
    PARENT: "ori_quadAngle",
    LABEL: "Mandible",
    TURRETS: [
        {
            POSITION: [11, 8, 0, 45, 190, 0],
            TYPE: ["auto4gun", {INDEPENDENT: true}]
        },
        {
            POSITION: [11, 8, 0, -45, 190, 0],
            TYPE: ["auto4gun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_waster = {
    PARENT: "ori_quadAngle",
    LABEL: "Waster",
    TURRETS: [
        {
            POSITION: [9, 8, 0, 45, 190, 0],
            TYPE: ["ori_sniperAutoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["ori_sniperAutoTankGun", {INDEPENDENT: true}]
        },
    ]
}
Class.ori_drifter = makeFighter("ori_quadAngle", "drifter")
Class.ori_hoverer = makeNuker("ori_quadAngle", "Hoverer")
Class.ori_hexaAngle = {
    PARENT: "genericTank",
    LABEL: "Hexa-Angle",
    BODY: sts("tri"),
    GUNS: addThrusters(false, false),
    TURRETS: [
        {
            POSITION: [9, 8, 0, 30, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -30, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, 90, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -90, 190, 0],
            TYPE: ["autoTankGun", {INDEPENDENT: true}]
        },
    ]
}

// Director Upgrades

// Overseer Upgrades

// Auto-Overseer Upgrades
defineAutoUpgrades("overseer", "Overseer", "autoOverseer")

// Spawner Upgrades
Class.ori_dancer = {
    PARENT: "genericTank",
    LABEL: "Dancer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_dancerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [15.5, 3, 1, 0, 0, 0, 0],
        },
    ],
}
Class.ori_hangar = makeHangar("spawner", "Hangar")
Class.ori_coordinator = makeCoordinator("spawner", "Coordinator")
Class.ori_melody = {
    PARENT: "genericTank",
    LABEL: "Melody",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                ALTERNATE_FIRE: ["ori_dancerMinion", "ori_symphonyTwin", "ori_symphonySniper", "ori_symphonyPounder", "ori_symphonyTrapper", "ori_symphonySingle"]
            },
        },
        {
            POSITION: [11.5, 12, -1.2, 0, 0, 0, 0],
        },
        {
            POSITION: [9.5, 10, -1.2, 0, 0, 0, 0],
        },
    ],
}
Class.ori_din = {
    PARENT: "genericTank",
    LABEL: "Din",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {reload: 0.6}]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1.2, 0, 0, 0, 0],
        },
    ],
}
Class.ori_captain = {
    PARENT: "genericTank",
    LABEL: "Captain",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
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
    ], 2)
}

// Factory Upgrades
Class.ori_symphony = {
    PARENT: "genericTank",
    LABEL: "Symphony",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "minion",
                MAX_CHILDREN: 6,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                ALTERNATE_FIRE: ["ori_dancerMinion", "ori_symphonyTwin", "ori_symphonySniper", "ori_symphonyPounder", "ori_symphonyTrapper", "ori_symphonySingle"]
            },
        },
        {
            POSITION: [12, 14, -1.2, 0, 0, 0, 0],
        },
        {
            POSITION: [11, 12, -1.2, 0, 0, 0, 0],
        },
    ],
}
Class.ori_impresario = {
    PARENT: "genericTank",
    LABEL: "Impresario",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6.5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 12.6, 10/9, 17, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 6,
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "ori_dancerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 14, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [16, 4, 1, 0, 0, 0, 0],
        },
    ],
}
Class.ori_aerodome = {
    PARENT: "genericTank",
    LABEL: "Aerodome",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [8.5, 6, 0.65, 3.5, 6.5, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [8.5, 6, 0.65, 3.5, -6.5, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
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
            POSITION: [12, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.ori_organiser = {
    PARENT: "genericTank",
    LABEL: "Organiser",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        easyGun([20.5, 8, 1, 0, 0, 0, 0]),
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
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
            POSITION: [12, 14, 1, 0, 0, 0, 0],
        },
    ],
}
Class.ori_racket = {
    PARENT: "genericTank",
    LABEL: "Racket",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [5, 11, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, {reload: 0.6}]),
                TYPE: "minion",
                MAX_CHILDREN: 4,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 14, 1.2, 0, 0, 0, 0],
        },
    ],
}

// Auto-Spawner Upgrades
defineAutoUpgrades("spawner", "Spawner", "autoSpawner")
pushMakeAuto("factory", "Factory", "Auto-Factory", "autoSpawner")
pushMakeAuto("ori_dancer", "Dancer", "Auto-Dancer", "autoSpawner")
pushMakeAuto("ori_hangar", "Hangar", "Auto-Hangar", "autoSpawner")
pushMakeAuto("ori_coordinator", "Coordinator", "Auto-Coordinator", "autoSpawner")
pushMakeAuto("ori_melody", "Melody", "Auto-Melody", "autoSpawner")
pushMakeAuto("ori_din", "Din", "Auto-Din", "autoSpawner")

// Dancer Upgrades
Class.ori_performer = {
    PARENT: "genericTank",
    LABEL: "Performer",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_performerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [13, 3, 1, 0, 2.5, 0, 0],
        },
        {
            POSITION: [13, 3, 1, 0, -2.5, 0, 0],
        },
        {
            POSITION: [14.5, 4, 1, 0, 0, 0, 0],
        },
    ],
}
Class.ori_ballerina = {
    PARENT: "genericTank",
    LABEL: "Ballerina",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_ballerinaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [14, 5, 0.85, 0, 0, 0, 0],
        },
    ],
}
Class.ori_showperson = {
    PARENT: "genericTank",
    LABEL: "Showperson",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_showpersonMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [15.5, 3, 1, 0, 0, 0, 0],
        },
    ],
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: "overdriveDeco"
    }]
}
Class.ori_diva = {
    PARENT: "genericTank",
    LABEL: "Diva",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_divaMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
    ],
    TURRETS: [{
        POSITION: [6.5, 7.5, 0, 0, 360, 1],
        TYPE: "ori_divaDeco"
    }]
}
Class.ori_actor = {
    PARENT: "genericTank",
    LABEL: "Actor",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    MAX_CHILDREN: 4,
    GUNS: weaponArray([
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, g.flankGuard]),
                TYPE: "ori_dancerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [15.5, 3, 1, 0, 0, 0, 0],
        },
    ], 3),
}
Class.ori_playwrite = {
    PARENT: "genericTank",
    LABEL: "Playwrite",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_playwriteMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [14, 5, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [2, 5, 1.4, 14, 0, 0, 0],
        },
    ],
}
Class.ori_musician = makeHangar("ori_dancer", "Musician")
Class.ori_pianist = makeCoordinator("ori_dancer", "Pianist")

// Hangar Upgrades
Class.ori_hideout = makeHangar("ori_coordinator", "Hideout")
Class.ori_opera = makeHangar("ori_melody", "Opera")
Class.ori_dissonance = makeHangar("ori_din", "Dissonance")
Class.ori_band0 = {
    PARENT: "genericTank",
    LABEL: "Band",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    ON_ALT: (body) => animate(body, "ori_band", 30, false, 17),
    GUNS: [
        {
            POSITION: [8, 7, 0.6, 3.5, 6, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [8, 7, 0.6, 3.5, -6, 0, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
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
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#0000FF`
            }
        }
    ],
}
for ( let ii = 1; ii < 30; ii++ ) {
    let R1 = Math.floor((255 / 30) * ii)
    let R = R1.toString(16)
    let B1 = Math.floor((255 / 30) * (30 - ii))
    let B = B1.toString(16)
    Class["ori_band" + ii] = {
    PARENT: "genericTank",
    LABEL: "Band",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [8 - (4/15) * ii, 7, 0.6, 3.5 - (3.5/30) * ii, 6, 0, 0],
        },
        {
            POSITION: [8 - (4/15) * ii, 7, 0.6, 3.5 - (3.5/30) * ii, -6, 0, 0.5],
        },
        {
            POSITION: [4.5 + (1.5 / 30) * ii, 10 - (1/15) * ii, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12 - (1.2/30) * ii, 1 + (0.1111111/30) * ii, 15 + (1.5 / 30), 0, 0, 0],
        },
        {
            POSITION: [11.5, 12, 1 - (0.1/30) * ii, 0, 0, 0, 0],
        },
        {
            POSITION: [(15.5/30) * ii, 8 - (5/30) * ii, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#${R}00${B}`
            }
        }
    ],
}
}
Class.ori_band30 = {
    PARENT: "genericTank",
    LABEL: "Band",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    ON_ALT: (body) => animate(body, "ori_band", 30, true, 17),
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_dancerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 0.9, 0, 0, 0, 0],
        },
        {
            POSITION: [15.5, 3, 1, 0, 0, 0, 0],
        },
        {
            POSITION: [14, 4, 1, 0, 0, 0, 0],
            PROPERTIES: {
                COLOR: `#FF0000`
            }
        }
    ],
}

// Coordinator Upgrades
Class.ori_conductor = makeCoordinator("ori_melody", "Conductor")
Class.ori_disturbance = makeCoordinator("ori_din", "Disturbance")

// Melody Upgrades
Class.ori_cacophony = {
    PARENT: "genericTank",
    LABEL: "Cacophony",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {reload: 0.6}]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                SHOOT_RANDOM: ["ori_dancerMinion", "ori_symphonyTwin", "ori_symphonySniper", "ori_symphonyPounder", "ori_symphonyTrapper", "ori_symphonySingle"]
            },
        },
        {
            POSITION: [11.5, 12, 1.2, 0, 0, 0, 0],
        },
        {
            POSITION: [10.5, 10, 1.2, 0, 0, 0, 0],
        },
    ],
}

// Din Upgrades
Class.ori_discord = {
    PARENT: "genericTank",
    LABEL: "Discord",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1.2, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {reload: 0.3}]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1.4, 0, 0, 0, 0],
        },
    ],
}
Class.ori_ruckus = {
    PARENT: "genericTank",
    LABEL: "Ruckus",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: [
        {
            POSITION: [6, 8, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 10.8, 10/9, 16.5, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 3,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory, {reload: 0.6}]),
                TYPE: "ori_dancerMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1.2, 0, 0, 0, 0],
        },
        {
            POSITION: [15.5, 3, 1, 0, 0, 0, 0],
        },
    ],
}

// Captain Upgrades
Class.ori_supervisor = {
    PARENT: "genericTank",
    LABEL: "Supervisor",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 0, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 0, 0],
            PROPERTIES: {
                MAX_CHILDREN: 2,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "minion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 0, 0],
        },
    ], 4)
}
Class.ori_mandarin = {
    PARENT: "genericTank",
    LABEL: "Mandarin",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
            POSITION: [5, 11, 1, 10.5, 0, 90, 0],
        },
        {
            POSITION: [2, 14, 1, 15.5, 0, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.factory]),
                TYPE: "minion",
                MAX_CHILDREN: 5,
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [12, 14, 1, 0, 0, 90, 0],
        },
    ], 2)
}
Class.ori_captaindrive = {
    PARENT: "genericTank",
    LABEL: "Captaindrive",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
            POSITION: [4.5, 10, 1, 10.5, 0, 90, 0],
        },
        {
            POSITION: [1, 12, 1, 15, 0, 90, 0],
            PROPERTIES: {
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "ori_autoMinion",
                STAT_CALCULATOR: "drone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
            },
        },
        {
            POSITION: [11.5, 12, 1, 0, 0, 90, 0],
        },
    ], 2),
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: "overdriveDeco"
    }]
}
Class.ori_military = {
    PARENT: "genericTank",
    LABEL: "Military",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        {
            POSITION: [8, 7, 0.6, 3.5, 6, 90, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
            POSITION: [8, 7, 0.6, 3.5, -6, 90, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
        },
        {
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
    ], 2)
}
Class.ori_advisor = {
    PARENT: "genericTank",
    LABEL: "Advisor",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: base.SPEED * 0.8,
        FOV: 1.1,
    },
    GUNS: weaponArray([
        easyGun([19.5, 8, 1, 0, 0, 90, 0], "bullet", [g.basic, g.flankGuard]),
        {
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
    ], 2)
}














// Jokes
Class.baldEagle = makeBird("genericTank", "Bald Eagle")

// Ass Blaster
Class.assBlaster = {
    PARENT: "genericTank",
    LABEL: "Ass Blaster",
    GUNS: [
        easyGun(),
        easyGun([13, 10, 1.4, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 0.7, spray: 1.4, pen: 0.8}])
    ]
}
Class.tacoBell = {
    PARENT: "genericTank",
    LABEL: "Taco Bell",
    GUNS: [
        easyGun(),
        easyGun([16, 10, 1.55, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 0.45, spray: 1.6, pen: 0.8, health: 0.8}])
    ]
}
Class.explosiveDiarrhea = {
    PARENT: "genericTank",
    LABEL: "Explosive Diarrhea",
    GUNS: [
        easyGun(),
        easyGun([18, 10, 1.55, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, g.sniper, {reload: 0.6, spray: 5, pen: 0.8, speed: 1.2}])
    ]
}
Class.deepAssShart = {
    PARENT: "genericTank",
    LABEL: "Deep Ass Shart",
    GUNS: [
        easyGun(),
    ]
}
for (let i = 0; i < 12; i++) {
    Class.deepAssShart.GUNS.push(easyGun([15, 10, 1.7, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 20, spray: 2, pen: 0.9, speed: 1.5}]))
}
Class.mexican = {
    PARENT: "genericTank",
    LABEL: "Mexican",
    GUNS: [
        easyGun(),
        easyGun([18, 10, 1.7, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, g.machineGun, {reload: 0.35, spray: 1.6, pen: 0.8, health: 0.8}])
    ]
}
Class.constipation = {
    PARENT: "genericTank",
    LABEL: "Constipation",
    GUNS: [
        easyGun(),
        easyGun([13, 12, 1.4, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, g.pounder, {reload: 0.7, spray: 1.4, pen: 0.8}])
    ]
}
Class.laxatives = {
    PARENT: "genericTank",
    LABEL: "Laxatives",
    GUNS: [
        easyGun(),
    ]
}
for (let i = 0; i < 3; i++) {
    Class.laxatives.GUNS.push(easyGun([15, 10, 1.7, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 2.5, spray: 2, pen: 0.85, speed: 1.5}]))
}
Class.assSprayer = {
    PARENT: "genericTank",
    LABEL: "Ass Sprayer",
    GUNS: [
        easyGun(),
        easyGun([15, 8, 1.3, 10, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 0.9, spray: 1.2}]),
        easyGun([12, 10, 1.5, 9, 0, 180, 0], "bullet", [g.basic, g.machineGun, {reload: 0.7, spray: 1.4, pen: 0.8}]),
    ]
}


Class.hhhhh = {
    PARENT: "genericTank",
    GUNS: [
        {
            POSITION: [20, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet",
                ALTERNATE_FIRE: ["bullet", "missile", "minimissile", "hive"]
            }
        }
    ]
}
Class.hurricaneSatl = {
    PARENT: "satellite",
    SHAPE: "https://cdn.discordapp.com/avatars/1207892663223844865/f744f7e81407253bef857a367b38f747.webp?"
}
Class.dc_hurricane = {
    PARENT: "genericTank",
    LABEL: "Hurricane",
    DANGER: 6,
    ANGLE: 45,
    SHAPE: "https://cdn.discordapp.com/avatars/1207892663223844865/f744f7e81407253bef857a367b38f747.webp?",
    FACING_TYPE: ["spin", {speed: 0.5}],
    CONTROLLERS: ["whirlwind"],
    HAS_NO_RECOIL: true,
    STAT_NAMES: statnames.whirlwind,
    AI: {
        SPEED: 2, 
    }, 
    GUNS: (() => { 
        let output = []
        for (let i = 0; i < 8; i++) { 
            output.push({ 
                POSITION: {WIDTH: 8, LENGTH: 1, DELAY: i * 0.25},
                PROPERTIES: {
                    SHOOT_SETTINGS: combineStats([g.satellite]), 
                    TYPE: ["hurricaneSatl", {ANGLE: i * 45}], 
                    MAX_CHILDREN: 1,   
                    AUTOFIRE: true,  
                    SYNCS_SKILLS: false,
                    WAIT_TO_CYCLE: true
                }
            }) 
        }
        return output
    })()
}


// Branches



// Upgrades
if (Config.LEGS_RACE) {
//remove single from assassin branch
Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin", "deadeye"]

//add single
Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper", "single", "desmos"]

//Throw smasher into the abyss i hate rammers
Class.basic.UPGRADES_TIER_2 = []
  
  
// Twin Branch
  Class.twin.UPGRADES_TIER_3.push("ori_hitman", "ori_trapezium")
    Class.doubleTwin.UPGRADES_TIER_3.push("ori_doubleGunner")
      Class.tripleTwin.UPGRADES_TIER_3 = ["ori_quadTwin", "ori_battery", "ori_tripleTripleShot", "ori_autoTriple", "ori_tripleGunner"]
      Class.bentDouble.UPGRADES_TIER_3 = ["ori_tripleTripleShot"]
      Class.hewnDouble.UPGRADES_TIER_3 = ["ori_slicedDouble", "ori_hackedDouble", "ori_carvedDouble", "ori_chippedDouble", "ori_autoHewnDouble", "ori_chiselledDouble", "ori_fashionedDouble", "ori_cutDouble"]
      Class.bentDouble.UPGRADES_TIER_3 = ["ori_warpedDouble", "ori_dentedDouble", "ori_disfiguredDouble", "ori_mutilatedDouble", "ori_mutatedDouble"]
      Class.ori_doubleGunner.UPGRADES_TIER_3 = ["ori_tripleGunner"]
// Sniper Branch
  
// Machine Gun Branch

// Flank Guard Branch
    Class.triAngle.UPGRADES_TIER_3 = ["fighter", "booster", "bomber", "surfer", "ori_nuker", "ori_quadAngle", "autoTriAngle", "falcon", "eagle", "phoenix", "vulture"]
      Class.fighter.UPGRADES_TIER_3 = ["ori_gangster", "ori_terrorist", "ori_boxer", "ori_streetfighter", "ori_warplane", "ori_combatant", "ori_soldier", "ori_warrior", "ori_scrimmer", "ori_detonator", "ori_autoFighter"]
      Class.booster.UPGRADES_TIER_3 = ["ori_rocket", "ori_gangster", "ori_minelayer", "ori_browser", "ori_trinitrotoluene", "ori_aspirer", "ori_jet", "ori_advocate", "ori_exhaust", "ori_autoBooster"]
      Class.ori_quadAngle.UPGRADES_TIER_3 = ["ori_hexaAngle", "ori_scrimmer", "ori_aspirer", "ori_fleeter", "ori_autoQuadAngle", "ori_glider", "ori_conformer", "ori_spoiler", "ori_mandible", "ori_waster", "ori_drifter", "ori_hoverer"]
// Director Branch
    Class.spawner.UPGRADES_TIER_3.push("ori_dancer", "ori_hangar", "ori_coordinator", "ori_melody", "ori_din", "ori_captain")
      Class.factory.UPGRADES_TIER_3 = ["ori_impresario", "ori_aerodome", "ori_organiser", "ori_symphony", "ori_autoFactory"]
      Class.ori_dancer.UPGRADES_TIER_3 = ["ori_performer", "ori_impresario", "ori_ballerina", "ori_showperson", "ori_diva", "ori_actor", "ori_playwrite", "ori_musician", "ori_pianist", "ori_ruckus", "ori_band30", "ori_autoDancer"]
      Class.ori_hangar.UPGRADES_TIER_3 = ["ori_aerodome", "ori_musician", "ori_hideout", "ori_dissonance", "ori_opera", "ori_band0", "ori_autoHangar"]
      Class.ori_coordinator.UPGRADES_TIER_3 = ["ori_organiser", "ori_pianist", "ori_hideout", "ori_conductor", "ori_disturbance", "ori_autoCoordinator"]
      Class.ori_melody.UPGRADES_TIER_3 = ["ori_symphony", "ori_cacophony", "ori_opera", "ori_conductor", "ori_autoMelody"]
      Class.ori_din.UPGRADES_TIER_3 = ["ori_discord", "ori_racket", "ori_dissonance", "ori_disturbance", "ori_ruckus", "ori_autoDin"]
      Class.ori_captain.UPGRADES_TIER_3 = ["ori_supervisor", "ori_mandarin", "ori_captaindrive", "ori_military", "ori_advisor"]
// Pounder Branch

// Trapper Branch

// Single Branch

// Desmos Branch

};
/*
if (Config.ASS_BLASTER = true) {
    Class.basic.UPGRADES_TIER_2.push("assBlaster")
       Class.assBlaster.UPGRADES_TIER_3 = ["tacoBell", "explosiveDiarrhea", "deepAssShart", "mexican", "constipation", "laxatives", "assSprayer"]
}*/
console.log("Loaded Legs Race");