const { assert } = require('chai');
const throttled = require('../lib/utils/throttle');

let interval = 500;

describe('Throttle', function () {
  this.timeout(interval * 4);

  it('Should make three requests with 5000ms interval. (Throttle function)', async () => {
    const req = throttled(async () => {
      return new Date().getTime();
    }, {
      limit: 1,
      interval
    });

    const timestamps = await Promise.all([
      req(),
      req(),
      req(),
      req()
    ]);

    for (let i = 0; i < timestamps.length - 1; i++) {
      const diff = timestamps[i + 1] - timestamps[i];
      assert.isAtLeast(diff, interval);
    }
  });
});
