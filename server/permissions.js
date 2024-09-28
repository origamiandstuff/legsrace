module.exports = [
  {
    key: process.env.developer || 'a',
    discordID: "0",
    nameColor: "#0292f2",
    class: "developer",
    infiniteLevelUp: true,
    note: "Developer Permissions",
  },
  {
    key: process.env.betaTester || 'b',
    discordID: "0",
    nameColor: "#fffff",
    class: "",
    infiniteLevelUp: true,
    note: "Beta Testing Permissions"
  },
  {
    key: '',
    nameColor: "#fffff"
  },
];
