const { combineStats, makeAuto, makeOver, makeDeco, makeGuard, makeBird, makeRadialAuto, weaponArray } = require('../facilitators.js');
const { base, statnames, dfltskl, smshskl } = require('../constants.js');
const { g } = require('../gunvals.js')

//return console.log('[Arms Race Addon] Disabled by default.');

// Removes desmos
Class.basic.UPGRADES_TIER_1 = Class.basic.UPGRADES_TIER_1.filter(basic => basic !== 'desmos');
Class.basic.UPGRADES_TIER_1.push('single');
Class.assassin.UPGRADES_TIER_3 = Class.assassin_UPGRADES_TIER_3.filter(assassin => assassin !== 'single');

// Branches



// Tanks

console.log('[Arms Race Addon] Loaded Arms Race.')