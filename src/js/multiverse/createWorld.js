const { ROOM } = require('./constants');

const createWorld = (meta) => {
  const _meta = { ...meta };
  const getMeta = () => ({ ..._meta });

  const all = {};
  const getAll = () => ({ ...all });

  const aliasMap = {};

  // The graph.
  const nodes = {};
  const getNodes = () => ({ ...nodes });

  const edges = [];
  const getEdges = () => [...edges];

  const getObject = (objectName) => {
    const object = all[objectName] || all[aliasMap[objectName]];
    if (!object) throw new Error(`No object called (or aliased) '${objectName}'.`);

    return object;
  };

  const hasObject = (object) => {
    return !!(all[object] || all[aliasMap[object]]);
  };

  const parentNamesByObjectNames = {};
  const getParent = (object) => {
    const parentName = parentNamesByObjectNames[object];
    return hasObject(parentName) ? getObject(parentName) : null;
  };

  const addItem = (item, parentName, { aliases = [] } = {}) => {
    console.log(`Adding ${item} to ${parentName} with aliases ${aliases}.`);
    if (hasObject(item)) throw new Error(`${item} has already been added.`);

    if (item._type !== ROOM) {
      // Rooms don't have parents.
      if (!hasObject(parentName)) throw new Error(`Specified parent ${parentName} has not been added.`);
      const parent = getObject(parentName);
      parent.children[item] = true;
      parentNamesByObjectNames[item] = parent.toString();
    } else {
      nodes[item.toString()] = item;
    }

    all[item] = item;
    aliases.forEach((alias) => {
      if (aliasMap[alias]) throw new Error(`'${alias} is already an alias for ${aliasMap[alias]}.'`);
      aliasMap[alias] = item.toString();
    });

    console.log(`Added ${item} to ${parentName}.`);
    dispatch('change');
  };

  // Single direction.
  const linkRoom = (fromRoomName, toRoomName) => {
    const fromRoom = all[fromRoomName];
    if (!fromRoom) throw new Error(`No room called ${fromRoomName}.`);

    const toRoom = all[toRoomName];
    if (!toRoom) throw new Error(`No room called ${toRoomName}.`);

    if (fromRoom.linkedRooms[toRoom]) throw new Error(`${fromRoom} is already linked to ${toRoom}.`);

    edges.push({ from: fromRoomName, to: toRoomName });
    fromRoom.linkedRooms[toRoom] = true;

    console.log(`Linked ${fromRoom} to ${toRoom}.`);
    dispatch('change');
  };

  const move = (objectName, toRoomName) => {
    const fromRoomName = getParent(objectName).toString();
    const object = getObject(objectName);
    const fromRoom = getObject(fromRoomName);
    const toRoom = getObject(toRoomName);

    if (!fromRoom.children[object]) throw new Error(`${object} is not in ${fromRoom}.`);
    if (toRoom.children[object]) throw new Error(`${object} is already in ${toRoom}.`);
    if (!fromRoom.linkedRooms[toRoom]) throw new Error(`${toRoom} is not accessible from ${fromRoom}.`);

    console.log('???', JSON.stringify(fromRoom.children));
    delete fromRoom.children[object];
    console.log('???', JSON.stringify(fromRoom.children));
    toRoom.children[object] = object;

    console.log(`${object} moved from ${fromRoom} to ${toRoom}.`)
    dispatch('change');
  };

  const reparent = (itemName, toParentName) => {
    const item = getObject(itemName);
    const fromParent = getParent(itemName);
    const toParent = getObject(toParentName);

    if (!fromParent.children[item]) throw new Error(`${item} is not in ${fromParent}.`);
    if (toParent.children[item]) throw new Error(`${item} is already in ${toParent}.`);

    const { [item]: moved, ...newChildren } = fromParent.children;
    console.log('newChildren', newChildren);
    fromParent.children = newChildren;
    fromParent.what = 'the heck';


    toParent.children[item] = true;
    parentNamesByObjectNames[item] = toParent.toString();

    console.log('???', toParent);

    delete toParent.children[item];
    console.log('???', toParent);

    console.log(`Moved ${item} from ${fromParent} to ${toParent}.`);
    dispatch('change');
  };

  const describe = (objectName) => {
    const object = all[objectName];
    if (!object) throw new Error(`describe(): This world does not contain an object called '${objectName}'.`)

    let { description } = object;
    const vars = object.description.matchAll(/\[(.*?)\]/);
    for (const [full, partial] of vars) {
      const obj = getObject(partial);
      description = description.replace(full, obj.displayName);
    }
    console.log(description);
  };

  // TODO At the moment it's forever.
  const subscribers = {};
  const subscribe = (name, func) => {
    if (!subscribers[name]) subscribers[name] = [];
    subscribers[name].push(func);
  };

  const dispatch = (name, payload) => {
    const _subscribers = subscribers[name] || [];
    _subscribers.forEach(listener => listener(payload));
  }

  return {
    linkRoom, addItem, move, reparent, describe, getMeta, getNodes, getEdges, getObject, hasObject, getAll, getParent,
    subscribe, dispatch
  };
};

module.exports = createWorld;
