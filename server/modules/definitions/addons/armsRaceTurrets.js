const { combineStats, makeDeco, weaponArray, makeTurret } = require('../facilitators.js');
const { base } = require('../constants.js');
const g = require('../gunvals.js');

// Storm Turrets
Class.stormProp = {
    PARENT: "overdriveDeco",
    LABEL: "Storm prop",
    GUNS: [
      {
        POSITION: [7, 7.5, 0.6, 0, 0, 90, 0],
      }, {
        POSITION: [7, 7.5, 0.6, 0, 0, 270, 0]
      }
    ]
}
Class.stormTurret = makeTurret({
    GUNS: [
        {
        POSITION: [7, 7.5, 0.6, 0, 0, 90, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, }, {
        POSITION: [7, 7.5, 0.6, 0, 0, 270, 0],
        PROPERTIES: {
                SHOOT_SETTINGS: combineStats([g.swarm, g.battleship]),
                TYPE: "swarm",
                STAT_CALCULATOR: "swarm",
                LABEL: "Guided"
        }, 
      }
    ],
}, {canRepel: true, limitFov: true, fov: 10, independent: true, extraStats: []})

console.log("[Arms Race Turrets Addon] Loaded Arms Race.");