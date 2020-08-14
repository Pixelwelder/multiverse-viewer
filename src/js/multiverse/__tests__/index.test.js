const { ITEM, ROOM, CHARACTER } = require('../constants');
const { createObject, createWorld } = require('../index');

describe('general test', () => {
  test('general test again', () => {
    const character = createObject(
      CHARACTER,
      {
        displayName: 'Roge the Splendid'
      }
    );

    const age = createObject(
      ROOM,
      {
        displayName: 'The Space Age',
        description: `It’s been a tough century. First you had the plagues, then you had the riots, then you had that one guy 
who swore he could summon the spirits of our ancestors—and we all know how that turned out. 
But now, two billion deaths later, we have peace. Good job, [player]! Those of us who survived knew you could do it!`
      }
    );

    const age2a = createObject(
      ROOM,
      {
        displayName: 'Slow Start',
        description: `Wow, what a century! Not such a great start, but hey. We got somewhere.`
      }
    );

    const age2b = createObject(
      ROOM,
      {
        displayName: 'Fast Start',
        description: `Hey, not bad!`
      }
    );

    const hulk = createObject(
      ITEM,
      {
        displayName: 'Floating Hulk',
        description: 'Judging by the radiation damage, this has been out here for millions of years. Crazy that the AC still works.'
      }
    )

    const world = createWorld();
    world.addItem(age, null, { aliases: ['start'] });
    world.addItem(age2a);
    world.addItem(age2b);
    world.linkRoom(age, age2a.toString());
    world.linkRoom(age, age2b.toString());
    world.addItem(hulk, age2a.toString());
    world.addItem(character, age.toString(), { aliases: ['player'] });
    world.describe(age.toString());
    world.move('player', age.toString(), age2a.toString());
    world.reparent(hulk.toString(), age2a.toString(), 'player');
    world.describe(age2a.toString());
  });
});
