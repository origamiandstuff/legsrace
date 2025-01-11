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

const addThrusters = (front = false, booster = false) => {
        let guns = (booster == false ? [{
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


// Branches
//remove single from assassin branch
Class.assassin.UPGRADES_TIER_3 = ["ranger", "falcon", "stalker", "autoAssassin", "deadeye"]
//replace desmos with single

Class.basic.UPGRADES_TIER_1 = ["twin", "sniper", "machineGun", "flankGuard", "director", "pounder", "trapper", "single"]

if (Config.ARMS_RACE) {
// Twin Branch

// Sniper Branch

// Machine Gun Branch

// Flank Guard Branch

// Director Branch

// Pounder Branch


// Trapper Branch

};
console.log("[Arms Race Addon] Loaded Arms Race.");