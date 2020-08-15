const { displayNameToName } = require('@pixelwelders/tlh-universe-util');
const { CHARACTER, ROOM, ITEM } = require('./constants');

const createBaseObj = () => ({
  _name: '',
  _type: '',
  displayName: '',
  description: 'An indescribable thing.',
  children: {}
});

const factoryMap = {
  [ROOM]: () => ({
    ...createBaseObj(),
    linkedRooms: {}
  }),
  [CHARACTER]:() => ({
    ...createBaseObj()
  }),
  [ITEM]: () => ({
    ...createBaseObj()
  })
};

const objectLibrary = {};
const createObject = (type, overrides) => {
  if (objectLibrary[overrides]) throw new Error(`Already have an object by name ${overrides}.`);

  const defaultObj = factoryMap[type] ? factoryMap[type]() : createBaseObj();
  const object = { ...defaultObj, ...overrides, _type: type };

  object._name = displayNameToName(object.displayName);
  object.toString = () => object._name;

  return object;
};

module.exports = createObject;