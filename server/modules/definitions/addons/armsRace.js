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
const { base, statnames, dfltskl, smshskl } = require("../constants.js");
const g = require("../gunvals.js");

// Removes the desmos branch and adds the single branch to be upgradable from basic.
// Removes single from assassin branch.
// Adds the Arms Race menu to the Addons menu
Class.assassin.UPGRADES_TIER_3 = Class.assassin.UPGRADES_TIER_3.filter((assassin) => assassin !== "single");
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter((basic) => basic !== "desmos");
Class.basic.UPGRADES_TIER_2.push("single");

// Functions

const makeFighter = (type, name = -1) => {
  type = ensureIsClass(type);
  let output = dereference(type);
  let cannons = [
    {
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
  let cannons = [
    {
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
    thrusters: 0
  }
  let output = dereference(type);
  let cannons = []
  if (gunType.pen == 0) {
    cannons.push(
        {
        POSITION: [13, 8, 1, 0, 0, 180, 0],
        })
  } else {
      cannons.push(
        {
        POSITION: [15, 8, 1, 0, 0, 180, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.basic]),
            TYPE: "bullet",
            LABEL: "Pen"
          },
        },)  
  }
  if (gunType.thrusters == 1) {
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
        },
    )
  }
    cannons.push(
        {
            POSITION: [4, 8, 1.7, 13, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
  );
  output.GUNS = type.GUNS == null ? cannons : type.GUNS.concat(cannons);
  output.LABEL = name == -1 ? "Bomber " + type.LABEL : name;
  return output;
};


// Turrets, Traps, Bullets etc..

// Autos
Class.sniperAutoTankGun = makeTurret({
    GUNS: [
        {
            POSITION: [27, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [5, 8, -1.4, 8, 0, 0, 0]
        }
    ],
}, {canRepel: true, limitFov: true})
Class.megaAutoTurret = makeTurret({
    GUNS: [
        {
            POSITION: [22, 14, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder, g.pelleter, g.power, { recoil: 1.15 }, g.turret]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})
Class.driveAutoTurret = makeTurret({
    SHAPE: 4, 
    GUNS: [
        {
            POSITION: [22, 10, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pelleter, g.power, { recoil: 1.15 }, g.turret]),
                TYPE: "bullet",
            },
        },
    ],
}, {label: "Turret", fov: 0.8, extraStats: []})

// Storm Turrets
Class.stormProp = {
    PARENT: "overdriveDeco",
    LABEL: "Storm prop",
    GUNS: [
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
      }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 270, 0]
      }
    ]
}
Class.stormTurret = makeTurret({
    PARENT: "genericTank",
    GUNS: [
        {
        POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, 
      }
    ],
}, {canRepel: true, limitFov: true, fov: 10, independent: true, extraStats: []})
Class.vortexProp = {
    PARENT: "overdriveDeco",
    LABEL: "Vortex prop",
    GUNS: [
      {
        POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
      }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 180, 0]
      }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
      }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 270, 0]
      }
    ]
}
Class.vortexTurret = makeTurret({
    PARENT: "genericTank",
    GUNS: [
        {
        POSITION: [7, 7.5, 0.6, 7, 0, 90, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 270, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, 
      }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 0, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, }, {
        POSITION: [7, 7.5, 0.6, 7, 0, 180, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, }
    ],
}, {canRepel: true, limitFov: true, fov: 10, independent: true, extraStats: []})

// Traps 
Class.chargerTrapDeco = makeDeco(5)
Class.chargerTrap = {
	PARENT: "setTrap",
    INDEPENDENT: true,
    TURRETS: [
        {
            POSITION: [8, 0, 0, 0, 360, 1],
            TYPE: "chargerTrapDeco",
        },
    ],
    GUNS: weaponArray([
        {
            POSITION: [4, 4, 1, 0, 0, 180, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: ["trap", { PERSISTS_AFTER_DEATH: true }],
    			SHOOT_ON_DEATH: true,
                STAT_CALCULATOR: "trap"
            }
        }
    ], 5)
}

// Tanks

// Singles
Class.duo = {
  PARENT: "genericTank",
  LABEL: "Duo",
  DANGER: 7,
  GUNS: [
    {
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

Class.sharpshooter = {
  PARENT: "genericTank",
  LABEL: "Sharpshooter",
  DANGER: 7,
  GUNS: [
    {
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
Class.ternion = {
  PARENT: "genericTank",
  LABEL: "Ternion",
  DANGER: 7,
  BODY: {
    SPEED: 1.1 * base.SPEED,
  },
  GUNS: weaponArray(
    {
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
  GUNS: weaponArray(
    {
      POSITION: [5.5, 8, -1.8, 6.5, 0, 0, 0],
    },
    3
  ),
};

Class.avian = makeBird("single", "Avian");
Class.custodian = makeGuard("single", "Custodian");
Class.assistant = makeOver("single", "Assistant", {
  count: 1,
  independent: !0,
  cycle: !1,
});
Class.autoSingle = makeAuto("single");

// Smashers

// Trappers

// Chargers
Class.charger = {
    PARENT: "genericTank",
    LABEL: "Charger",
    GUNS: [
      {
          POSITION: [18, 12, 1, 0, 0, 0, 0],
      },
      {
          POSITION: [2, 12, 1.1, 18, 0, 0, 0],
          PROPERTIES: {
              SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, {}]),
              TYPE: ['chargerTrap'],
              STAT_CALCULATOR: "block"
          }
      }
    ]
}
// Machine Trappers
Class.machineTrapper = {
    PARENT: "genericTank",
    LABEL: "Machine Trapper",
    DANGER: 6,
    STAT_NAMES: statnames.trap,
    GUNS: [
        {
            POSITION: [15, 9, 1.4, 0, 0, 0, 0],
        },
        {
            POSITION: [3, 13, 1.3, 15, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}
// Mechs
Class.autoTrap = makeAuto("trap", { type: 'pillboxTurret' })
Class.mech = {
    PARENT: "genericTank",
    LABEL: "Mech",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
      {
        	POSITION: [15, 8, 1, 0, 0, 0, 0],
    	},
    	{
        	POSITION: [3, 9, 1.7, 15, 0, 0, 0],
        	PROPERTIES: {
            	SHOOT_SETTINGS: combineStats([g.trap]),
            	TYPE: "autoTrap",
            	STAT_CALCULATOR: 'trap',
        	},
    	}, 
      {
            POSITION: [4, 12, 1, 8, 0, 0, 0],
      },
    ]
}
Class.operator = {
    PARENT: "genericTank",
    LABEL: "Operator",
    DANGER: 7,
    STAT_NAMES: statnames.mixed,
    GUNS: [
      {
        	POSITION: [20, 8, 1, 0, 0, 0, 0],
          PROPERTIES: {
            	SHOOT_SETTINGS: combineStats([g.basic]),
            	TYPE: "bullet",
        	},
    	},
    	{
        	POSITION: [2.8, 8, 1.7, 15, 0, 0, 0],
        	PROPERTIES: {
            	SHOOT_SETTINGS: combineStats([g.trap]),
            	TYPE: "autoTrap",
            	STAT_CALCULATOR: 'trap',
        	},
    	}, 
      {
            POSITION: [4, 12, 1, 8, 0, 0, 0],
      },
    ]
}
Class.overMech = makeOver('mech', 'Overmech');
// Pens
Class.pen = {
    PARENT: "genericTank",
    LABEL: "Pen",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
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
            	STAT_CALCULATOR: 'trap',
        	},
    	}
    ]
}
Class.encircler = {
    PARENT: "genericTank",
    LABEL: "Pen",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
    	{
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
              SHOOT_SETTINGS: combineStats([g.trap, g.machineGun, {reload: 0.625, size: 0.625, spray: 0.75}]),
              TYPE: "trap",
              STAT_CALCULATOR: "trap",
          },
       },
    ]
}
Class.autoEncircler = makeAuto("encircler");
Class.stall = {
    PARENT: "genericTank",
    LABEL: "Stall",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
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
              STAT_CALCULATOR: "block"
          }
      }
    ]
}
Class.autoStall = makeAuto('stall');
Class.delayer = makeOver("stall", "Delayer", {
  count: 1,
  independent: !0,
  cycle: !1,
});
Class.hurdle = {
    PARENT: "genericTank",
    LABEL: "Hurdle",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
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
          POSITION: [18, 18, 1, 0, 0, 0, 0],
      },
      {
          POSITION: [2, 18, 1.2, 18, 0, 0, 0],
          PROPERTIES: {
              SHOOT_SETTINGS: combineStats([g.trap, g.setTrap, g.construct]),
              TYPE: "setTrap",
              STAT_CALCULATOR: "block"
          }
      }
    ]
}

Class.cubicle = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Cubicle",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.75 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
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
                STAT_CALCULATOR: "block"
            },
        },
        {
            POSITION: [4, 14, 1, 8, 0, 0, 0],
        },
    ],
}

Class.incarcerator = {
    PARENT: "genericTank",
    LABEL: "Incarcerator",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: [
      {
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
            	STAT_CALCULATOR: 'trap',
        	},
    	}
    ]
}
Class.fender = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Fender",
    STAT_NAMES: statnames.trap,
    BODY: {
        SPEED: 0.75 * base.SPEED,
        FOV: 1.15 * base.FOV,
    },
    GUNS: [
        {
          	POSITION: [20, 8, 1, 0, 0, 0, 0],
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
                STAT_CALCULATOR: "block"
            },
        },
    ],
}

Class.tripen = {
    PARENT: "genericTank",
    LABEL: "Tri-Pen",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponArray([
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
            	STAT_CALCULATOR: 'trap',
        	},
    	}
    ], 3),
}
Class.corral = {
    PARENT: "genericTank",
    LABEL: "Corral",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponArray([
      {
            POSITION: [7, 7.5, 0.6, 7, 0, 60, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
            }
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
            	STAT_CALCULATOR: 'trap',
        	},
    	}
    ], 3),
}
Class.coop = makeAuto({
    PARENT: "genericTank",
    DANGER: 6,
    STAT_NAMES: statnames.mixed,
    GUNS: weaponArray([
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
            	STAT_CALCULATOR: 'trap',
        	},
    	}, 
      {
        	POSITION: [15, 8, 1, 0, 0, 60, 0],
    	},
    	{
        	POSITION: [4, 8, 1.7, 13, 0, 60, 0],
        	PROPERTIES: {
            	SHOOT_SETTINGS: combineStats([g.trap]),
            	TYPE: "trap",
            	STAT_CALCULATOR: 'trap',
        	},
    	}, 
    ], 3),
}, "Coop")
Class.autoPen = makeAuto('pen');
Class.cockatiel = makeBird('pen', 'Cockatiel');
Class.interner = makeOver("pen", "Interner", {
  count: 1,
  independent: !0,
  cycle: !1,
});
Class.parrotBase = makeSurfer("pen", "ParrotBase")
Class.parrot = makeBird("parrotBase", "Parrot");
Class.overpen = makeOver('pen', 'Overpen', {
  count: 2,
  independent: !1,
  cycle: !1
});
Class.fortifier = {
    PARENT: "genericTank",
    DANGER: 7,
    LABEL: "Fortifier",
    STAT_NAMES: statnames.mixed,
    BODY: {
        FOV: 1.15,
    },
    GUNS: [
        {
            POSITION: [28, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
              	SHOOT_SETTINGS: combineStats([g.basic]),
              	TYPE: "bullet",
      	    }, }, {
            POSITION: [4, 8, 1.3, 22, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 18, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
        {
            POSITION: [4, 8, 1.3, 14, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.minigun, { range: 0.5 }]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
    ],
}

// Builders

Class.fashioner = makeOver('builder', { count : 1, independent: true, cycle: false })
Class.autoFashioner = makeAuto('fashioner');
Class.autoEngineer = makeAuto('engineer');
Class.autoConstruct = makeAuto('construct');
Class.autoBoomer = makeAuto('boomer');
Class.megaAutoBuilder = makeAuto('builder', { type: 'megaAutoTurret' });
Class.overbuilder = makeOver('builder', 'Overbuilder', {
  count: 1,
  independent: !0,
  cycle: !1,
});

// Warks
Class.wark = {
    PARENT: "genericTank",
    LABEL: "Wark",
    STAT_NAMES: statnames.trap, 
    GUNS: [
        {
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
      ]
}

Class.wark = {
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
        })
}
Class.hutch = {
    PARENT: "genericTank",
    LABEL: "Hutch",
    STAT_NAMES: statnames.trap, 
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 5.5, 5, 0],
            PROPERTIES: {
              	SHOOT_SETTINGS: combineStats([g.basic]),
              	TYPE: "bullet",
      	    }, }, {
            POSITION: [3, 9, 1.5, 14, 5.5, 5, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            }, }, {
            POSITION: [20, 8, 1, 0, -5.5, 355, 0],
            PROPERTIES: {
              	SHOOT_SETTINGS: combineStats([g.basic]),
              	TYPE: "bullet",
      	    }, }, {
            POSITION: [3, 9, 1.5, 14, -5.5, 355, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap, g.twin]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap",
            },
        },
      ]
}

          
// Trap Guards
Class.triTrapGuard = {
    PARENT: "genericTank",
    LABEL: "Tri-Trap Guard",
    STAT_NAMES: statnames.mixed,
    GUNS: [
      {
            POSITION: {
                LENGTH: 20,
                WIDTH: 8,
                ASPECT: 1,
                X: 0,
                Y: 0,
                ANGLE: 0,
                DELAY: 0
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic]),
                TYPE: "bullet",
            }
        },
        {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ANGLE: 180
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 13, 
                ANGLE: 180
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ANGLE: 90
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 13, 
                ANGLE: 90
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, {
            POSITION: {
                LENGTH: 13,
                WIDTH: 7,
                ANGLE: 270
            }
        },
        {
            POSITION: {
                LENGTH: 3,
                WIDTH: 7,
                ASPECT: 1.7,
                X: 13, 
                ANGLE: 270
            },
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.trap]),
                TYPE: "trap",
                STAT_CALCULATOR: "trap"
            }
        }, 
    ]
}
// Pounders
// Launchers
Class.inceptionMissile = makeAuto("minimissile", "Inception Missile", { type: 'pillboxTurret' })
Class.inception = {
    PARENT: "genericTank",
    LABEL: "Inception",
    DANGER: 7,
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
            POSITION: [3, 7.5, 1, 6, 0, 0, 0],
        },
    ],
}
Class.hognoseMissile = makeAuto("snake", "Hognose Missile", { type: 'pillboxTurret' })
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
Class.seriemas = makeBird("launcher", "Seriemas");
// Hunters
// Subverters
Class.subverter = {
    PARENT: "genericTank",
    LABEL: "Subverter",
    DANGER: 6,
    BODY: {
        FOV: base.FOV * 1.2
    },
    GUNS: [
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [19, 12, 1, 0, 0, 0, 1/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 12, 1, 0, 0, 0, 2/3],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.pounder]),
                TYPE: "bullet"
            }
        }
    ]
}
Class.buttbuttin = addBackGunner("assassin", "Buttbuttin");
Class.hitman = makeOver("assassin", "Hitman", {
  count: 1,
  independent: !0,
  cycle: !1,
});
Class.sniper3 = makeRadialAuto("sniperAutoTankGun", {
  isTurret: !0,
  body: { FOV: 1.2 },
  danger: 7,
  label: "Sniper-3",
  count: 3,
});

// Rangers
Class.autoRanger = makeAuto("ranger");
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
};
Class.hawker = {
  PARENT: "genericTank",
  DANGER: 7,
  LABEL: "Hawker",
  BODY: {
    SPEED: 0.85 * base.SPEED,
    FOV: 1.35 * base.FOV,
  },
  INVISIBLE: [0.08, 0.03],
  TOOLTIP: "Stay still to turn invisible.",
  GUNS: [
    {
      POSITION: [32, 8, -1.8, 0, 0, 0, 0],
      PROPERTIES: {
        SHOOT_SETTINGS: combineStats([g.basic, g.sniper, g.assassin]),
        TYPE: "bullet",
      },
    },
  ],
};
Class.peregrine = makeBird("ranger", "Peregrine");
Class.owl = makeBird("stalker", "Owl");
Class.autoFalcon = makeAuto("falcon");
Class.harpy = addBackGunner("falcon", "Harpy");
Class.merlin = makeBird("assassin", "Merlin", { super: !0 });
// Droners
// Directordrives
Class.autoDrone = makeAuto("drone", { type: 'droneAutoTurret' })
Class.directordrive =  {
    PARENT: "genericTank",
    LABEL: "Directordrive",
    DANGER: 6,
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "overdriveDeco",
        },
    ],
    GUNS: [
        {
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "turretedDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
            },
        },
    ],
}
Class.stormDrone = makeAuto("drone", "Storm Drone", { type: 'stormTurret' })
Class.directorstorm = {
    PARENT: "genericTank",
    LABEL: "Directorstorm",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 7
            },
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "stormDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ],
    TURRETS: [{
          POSITION: [9, 0, 0, 0, 360, 1],
          TYPE: "stormProp"
    }]
}
Class.vortexDrone = makeAuto("drone", "Vortex Drone", { type: 'vortexTurret' })
Class.vortex = {
    PARENT: "genericTank",
    LABEL: "Vortex",
    STAT_NAMES: statnames.drone,
    BODY: {
        FOV: base.FOV * 1.1
    },
    GUNS: [
        {
            POSITION: {
                LENGTH: 6,
                WIDTH: 11,
                ASPECT: 1.3,
                X: 7
            },
            POSITION: [6, 11, 1.3, 7, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.drone]),
                TYPE: "vortexDrone",
                AUTOFIRE: true,
                SYNCS_SKILLS: true,
                STAT_CALCULATOR: "drone",
                MAX_CHILDREN: 6,
                WAIT_TO_CYCLE: true
            }
        }
    ],
    TURRETS: [{
          POSITION: [9, 0, 0, 0, 360, 1],
          TYPE: "vortexProp"
    }]
}
Class.overstorm = {
    PARENT: "genericTank",
    LABEL: "Overstorm",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "stormProp",
        },
    ],
    GUNS: weaponArray({
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "vortexDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 4
        }
    }, 2)
}
Class.tyrant = {
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
            WAIT_TO_CYCLE: true
        }
    }, 4),
    TURRETS: [{
        POSITION: [9, 0, 0, 0, 360, 1],
        TYPE: "overdriveDeco"
    }]
}
Class.autoMinion = makeAuto("minion", "Auto-Minion", { TYPE: 'droneAutoTurret' })
Class.spawnerdrive = {
    PARENT: "genericTank",
    LABEL: "Spawnerdrive",
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
                MAX_CHILDREN: 4,
                SHOOT_SETTINGS: combineStats([g.factory, g.babyfactory]),
                TYPE: "autoMinion",
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
        TYPE: "overdriveDeco"
    }]
}
Class.stormMinion = makeAuto("minion", "Storm Minion", { TYPE: 'stormTurret' })
Class.spawnerstorm = {
    PARENT: "genericTank",
    LABEL: "Spawnerstorm",
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
        TYPE: "stormProp"
    }]
}
Class.factorydrive = {
    PARENT: "genericTank",
    LABEL: "Factorydrive",
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
                TYPE: "autoMinion",
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
        TYPE: "overdriveDeco"
    }]
}
Class.autoOverdrive = {
    PARENT: "genericTank",
    LABEL: "Auto-Overdrive",
    DANGER: 7,
    STAT_NAMES: statnames.drone,
    BODY: {
        SPEED: 0.9 * base.SPEED,
        FOV: 1.1 * base.FOV,
    },
    TURRETS: [
        {
            POSITION: [9, 0, 0, 0, 360, 1],
            TYPE: "driveAutoTurret",
        },
    ],
    GUNS: weaponArray({
        POSITION: [6, 12, 1.2, 8, 0, 90, 0],
        PROPERTIES: {
            SHOOT_SETTINGS: combineStats([g.drone, g.overseer]),
            TYPE: "turretedDrone",
            AUTOFIRE: true,
            SYNCS_SKILLS: true,
            STAT_CALCULATOR: "drone",
            WAIT_TO_CYCLE: true,
            MAX_CHILDREN: 4
        }
    }, 2)
}
// Flanks
// Hexas
Class.mingler = {
    PARENT: "genericTank",
    LABEL: "Mingler",
    DANGER: 6,
    GUNS: weaponArray([
        {
            POSITION: [15, 3.5, 1, 0, 0, 30, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [15, 3.5, 1, 0, 0, 90, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.cyclone]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [18, 8, 1, 0, 0, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.flankGuard]),
                TYPE: "bullet"
            }
        }
    ], 3)
}
Class.autoMingler = makeAuto("mingler")
Class.unity = {
    PARENT: "genericTank",
    LABEL: "Unity",
    DANGER: 6,
    GUNS: weaponArray([
        {
            POSITION: [17, 4, 1, 0, 0, 30, 0.25],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [17, 4, 1, 0, 0, 90, 0.75],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.twin, g.gunner, g.flankGuard]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.pounder]),
                TYPE: "bullet"
            }
        },
        {
            POSITION: [21, 12, 1, 0, 0, 180, 0.5],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.pounder]),
                TYPE: "bullet"
            }
        }
    ], 3)
}

// Tri Angles
Class.brawler = makeFighter("booster", "Brawler")
Class.autoSurfer = makeAuto("surfer")
Class.condor = makeSurfer("eagle", "Condor")
Class.soarer = makeSurfer("booster", "Soarer")
Class.autoBooster = makeAuto("booster")
Class.autoFighter = makeAuto("fighter")
Class.defect = makeBird("tripleShot", "Defect")
Class.klutz = makeSurfer("defect", "Klutz")
Class.deficiency = makeBird("pentaShot", "Deficiency")
Class.autoDefect = makeAuto("defect")
Class.mangle = makeFighter("defect")
Class.nuker = makeBomber({
    PARENT: "genericTank",
    BODY: {
        DENSITY: base.DENSITY * 0.6,
    },
    DANGER: 7,
    GUNS: [
        {
            POSITION: [20, 8, 1, 0, 0, 0, 0],
            PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.basic, g.flankGuard, g.triAngle, g.triAngleFront]),
                TYPE: "bullet",
                LABEL: "Front",
            }, }, ]
        }, "Nuker", { pen: 1 , thrusters: 1 })




// Trapper  Branch
Class.trapper.UPGRADES_TIER_2.push(...['pen'])
 Class.pen.UPGRADES_TIER_3 = ['stall', 'tripen', 'encircler','incarcerator', 'operator', 'cockatiel', 'hutch', 'interner', 'autoPen', 'fortifier']
  Class.tripen.UPGRADES_TIER_3 = ["corral"]
  Class.stall.UPGRADES_TIER_3 = ["cubicle", "hurdle"]
  Class.fortress.UPGRADES_TIER_3 = ["corral", "coop"]
  Class.engineer.UPGRADES_TIER_3 = ["cubicle", 'autoEngineer']
  Class.construct.UPGRADES_TIER_3 = ['hurdle', 'autoConstruct']
  Class.builder.UPGRADES_TIER_3 = ["stall"]
// Pounder Branch
 Class.inception.UPGRADES_TIER_3 = ['hognose']
 Class.sidewinder.UPGRADES_TIER_3 = ['hognose']
// Director Branch
Class.director.UPGRADES_TIER_2.push(['directordrive'])
 Class.directordrive.UPGRADES_TIER_2 = ['overdrive', 'directorstorm', 'spawnerdrive']
  Class.directorstorm.UPGRADES_TIER_3 = ['vortex', 'overstorm']
  Class.overdrive.UPGRADES_TIER_3 = ['overstorm', 'autoOverdrive']
  Class.overlord.UPGRADES_TIER_3 = ['tyrant']
  Class.spawnerdrive.UPGRADES_TIER_3 = ['spawnerstorm']

// Flank Guard Branch
 Class.booster.UPGRADES_TIER_3 = ['brawler']
 Class.fighter.UPGRADES_TIER_3 = ['brawler']
// Machine Gun Branch

// Sniper Branch

// Twin Branch

// Tanks

console.log("[Arms Race Addon] Loaded Arms Race.");
