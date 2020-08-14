const parse = require('../parse');
const worldJSON = require('./testWorld.json');

// describe('parse', () => {
//   test('it should parse a JSON file', () => {
//     const world = parse(worldJSON);
//   });
// });

const go = () => {
  const world = parse(worldJSON);
  console.log(world.getAll());
};

go();
