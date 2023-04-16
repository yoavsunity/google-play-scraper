'use strict';

const gplay = require('../index');
const assert = require('chai').assert;
const assertValidApp = require('./common').assertValidApp;

describe('Developer method', () => {
  it('should fetch a valid application list for the given developer with string id', () => {
    return gplay.developer({ devId: 'Jam City, Inc.' })
      .then((apps) => apps.map(assertValidApp))
      .then((apps) => apps.map((app) => assert.equal(app.developer, 'Jam City, Inc.')));
  });

  it('should fetch a valid application list for the given developer with numeric id', () => {
    return gplay.developer({ devId: '5700313618786177705' })
      .then((apps) => apps.map(assertValidApp))
      .then((apps) => apps.map((app) => {
        if (app.developerId) {
          assert.equal(app.developerId, '5700313618786177705');
        }
      }));
  });

  it('should not throw an error if too many apps requested', () => {
    return gplay.developer({ devId: '5700313618786177705', num: 500 })
      .then((apps) => {
        assert(apps.length >= 100, 'should return as many apps as availabe');
      });
  });

  it('should fetch a valid application list with full detail', () => {
    return gplay.developer({ devId: '5700313618786177705', num: 10, fullDetail: true })
      .then((apps) => apps.map(assertValidApp));
  }).timeout(15 * 1000);
});
