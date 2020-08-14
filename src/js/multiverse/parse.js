const createWorld = require('./createWorld');
const createObject = require('./createObject');
const { ROOM } = require('./constants');

const parse = (json) => {
  const { meta, objects, graph, setup, aliases } = json;
  const world = createWorld(meta);

  console.log(`Creating ${objects.length} objects`);
  const { rooms, other } = objects.reduce((accum, { type, overrides }) => {
    const object = createObject(type, overrides);
    if (type === ROOM) {
      accum.rooms.push(object);
    } else {
      accum.other[object] = object;
    }
    return accum;
  }, { rooms: [], other: {} });

  console.log(`Adding ${rooms.length} rooms`);
  rooms.forEach(room => {
    const a = aliases[room];
    world.addItem(room, null, { aliases: a });
  });

  console.log('Setting up graph');
  graph.forEach(({ from, to }) => {
    world.linkRoom(from, to);
  });

  console.log('Setting up placement', setup);
  Object.entries(setup).forEach(([objectName, parentName]) => {
    const a = aliases[objectName];
    const object = other[objectName];
    if (!object) throw new Error(`No object by name ${objectName} found.`)
    world.addItem(object, parentName, { aliases: a });
  });

  return world;
};

module.exports = parse;
