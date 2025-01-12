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
const triSwarm = () => {
      return [
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 1.15, health: 1.15}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
          },
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 180, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 1.15, health: 1.15}]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
            },
          },
          {
            POSITION: [7, 7.5, 0.6, 7, 0, 300, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, {damage: 1.15, health: 1.15}]),
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

// TURRETS
Class.sniperAutoTankGun = makeTurret({
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
Class.stormAutoTurret = makeTurret({
    GUNS: [
        easyGun([7, 7.5, 0.6, 7, 4, 0, 0], "swarm", [g.swarm, g.pelleter, g.power]),
        easyGun([7, 7.5, 0.6, 7, -4, 0, 0.5], "swarm", [g.swarm, g.pelleter, g.power]),
    ],
}, {label: "Storm Suto Turret", fov: 0.8, extraStats: []})

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
            TYPE: ["sniperAutoTankGun", {INDEPENDENT: true}]
        },
        {
            POSITION: [9, 8, 0, -45, 190, 0],
            TYPE: ["sniperAutoTankGun", {INDEPENDENT: true}]
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


// Spawner Upgrades





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
// Branches


//remove single from assassin branch
Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin", "deadeye"]

//add single
Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper", "single", "desmos"]

//Throw smasher into the abyss i hate rammers
Class.basic.UPGRADES_TIER_2 = []

// Upgrades
if (Config.ARMS_RACE) {
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

// Pounder Branch

// Trapper Branch

// Single Branch

// Desmos Branch

};
if (Config.ASS_BLASTER = true) {
    Class.basic.UPGRADES_TIER_2.push("assBlaster")
       Class.assBlaster.UPGRADES_TIER_3 = ["tacoBell", "explosiveDiarrhea", "deepAssShart", "mexican", "constipation", "laxatives"]
}
console.log("[Arms Race Addon] Loaded Arms Race.");