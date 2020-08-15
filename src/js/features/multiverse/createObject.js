import { CHARACTER, ITEM, ROOM } from "./objectTypes";
import { displayNameToName } from '@pixelwelders/tlh-universe-util';

const createBaseObj = () => ({
  id: '',
  _name: '',
  _type: '',
  displayName: '',
  description: 'An indescribable thing.',
  children: {}
});

const factoryMap = {
  [ROOM]: () => ({
    ...createBaseObj()
  }),
  [CHARACTER]:() => ({
    ...createBaseObj()
  }),
  [ITEM]: () => ({
    ...createBaseObj()
  })
};

const objectLibrary = {};
export const createObject = (type, overrides) => {
  if (objectLibrary[overrides]) throw new Error(`Already have an object by name ${overrides}.`);

  const defaultObj = factoryMap[type] ? factoryMap[type]() : createBaseObj();
  const object = { ...defaultObj, ...overrides, _type: type };

  object._name = object.id = displayNameToName(object.displayName);
  object.toString = () => object._name;

  return object;
};