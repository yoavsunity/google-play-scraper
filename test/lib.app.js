'use strict';

const assert = require('chai').assert;
const assertValidApp = require('./common').assertValidApp;
const gplay = require('../index');

describe('App method', () => {
  it('should fetch valid application data', () => {
    return gplay.app({ appId: 'com.sgn.pandapop.gp' })
      .then((app) => {
        assert.equal(app.url, 'https://play.google.com/store/apps/details?id=com.sgn.pandapop.gp&hl=en&gl=us');
        assert.equal(app.genre, 'Puzzle');
        assert.equal(app.androidVersionText, '7.0');
        assertValidApp(app);
      });
  });

  it('should fetch valid application data for country: es', () => {
    return gplay.app({
      appId: 'com.sgn.pandapop.gp',
      country: 'es',
      lang: 'es'
    })
      .then((app) => {
        assert.equal(app.url, 'https://play.google.com/store/apps/details?id=com.sgn.pandapop.gp&hl=es&gl=es');
        assert.equal(app.genre, 'Puzles');
        assert.equal(app.androidVersionText, '7.0');
        assert.equal(app.available, true);
        assertValidApp(app);
      });
  });

  it('should fetch valid application data for country: br', () => {
    return gplay.app({
      appId: 'com.sgn.pandapop.gp',
      country: 'br',
      lang: 'pt'
    })
      .then((app) => {
        assert.equal(app.url, 'https://play.google.com/store/apps/details?id=com.sgn.pandapop.gp&hl=pt&gl=br');
        assert.equal(app.genre, 'Quebra-cabeça');
        assert.equal(app.androidVersionText, '7.0');
        assert.equal(app.available, true);
        assertValidApp(app);
      });
  });

  it('should properly parse a VARY android version', () => {
    return gplay.app({ appId: 'com.facebook.katana' })
      .then((app) => {
        assert.equal(app.androidVersion, 'VARY');
        assert.equal(app.androidVersionText, 'Varies with device');
      });
  });

  it('should get the developer physical address', () => {
    return gplay.app({ appId: 'com.snapchat.android' })
      .then((app) => {
        assert.equal(app.developerAddress, '2772 Donald Douglas Loop, North\nSanta Monica, CA 90405\nUSA');
      });
  });

  it('should get the privacy policy', () => {
    return gplay.app({ appId: 'com.snapchat.android' })
      .then((app) => {
        assert.equal(app.privacyPolicy, 'http://www.snapchat.com/privacy');
      });
  });

  it('should fetch app in spanish', () => {
    return gplay.app({ appId: 'com.sgn.pandapop.gp', lang: 'es', country: 'ar' })
      .then((app) => {
        assert.equal(app.appId, 'com.sgn.pandapop.gp');
        assert.equal(app.title, 'Bubble Shooter: Panda Pop!');
        assert.equal(app.url, 'https://play.google.com/store/apps/details?id=com.sgn.pandapop.gp&hl=es&gl=ar');
        assert.isNumber(app.minInstalls);

        assert.equal(app.androidVersion, '7.0');
        assert.equal(app.androidVersionText, '7.0');
      });
  });

  it('should fetch app in french', () =>
    gplay.app({ appId: 'com.sgn.pandapop.gp', lang: 'fr', country: 'fr' })
      .then((app) => {
        assert.equal(app.appId, 'com.sgn.pandapop.gp');
        assert.equal(app.title, 'Panda Pop! Jeu de tir à bulles');
        assert.equal(app.url, 'https://play.google.com/store/apps/details?id=com.sgn.pandapop.gp&hl=fr&gl=fr');
        assert.isNumber(app.minInstalls);

        assert.equal(app.androidVersion, '7.0');
        assert.equal(app.androidVersionText, '7.0');
      }));

  it('should reject the promise for an invalid appId', () =>
    gplay.app({ appId: 'com.dxco.pandavszombiesasdadad' })
      .then(() => {
        throw Error('should not resolve');
      })
      .catch((err) => {
        assert.equal(err.message, 'Error requesting Google Play:Request failed with status code 404');
      }));

  it('should reject the promise when appId is not passed', () =>
    gplay.app({ Testkey: 'com.dxco.pandavszombiesasdadad' })
      .then(() => {
        throw Error('should not resolve');
      })
      .catch((err) => {
        assert.equal(err.message, 'appId missing');
      }));

  it('should fetch PriceText for paid apps properly', () => {
    return gplay.app({ appId: 'com.teslacoilsw.launcher.prime', country: 'in' })
      .then((app) => {
        assert.equal(app.priceText, `₹${app.price.toFixed(2)}`);
        assert.equal(app.currency, 'INR');
      });
  });

  it('should fetch valid internal developer_id, if it differs from developer_id', () => {
    return gplay.app({ appId: 'air.com.bitrhymes.bingo' })
      .then((app) => {
        assert.equal(app.developerInternalID, '9028773071151690823');
      });
  });

  it('should fetch available false for an app is unavailable in country', () => {
    return gplay.app({ appId: 'com.jlr.landrover.incontrolremote.appstore', country: 'tr' })
      .then((app) => {
        assert.equal(app.available, false);
      });
  });

  it('should fetch available tags for an app', async () => {
    return gplay.app({ appId: 'air.com.bitrhymes.bingo' })
      .then((app) => {
        assert.isArray(app.tags);
        assert.isAbove(app.tags.length, 0);
        app.tags.map((t) => assert.isString(t.label));
      });
  });

  it('should fetch available tags for an app in a country', async () => {
    return gplay.app({ appId: 'air.com.bitrhymes.bingo', lang: 'fr', country: 'fr' })
      .then((app) => {
        assert.isArray(app.tags);
        assert.isAbove(app.tags.length, 0);
        app.tags.map((t) => assert.isString(t.label));
      });
  });

  it('should fetch video preview for an app', async () => {
    return gplay.app({ appId: 'com.ea.gp.fifamobile' })
      .then((app) => {
        assert.equal(app.videoPreview, 'https://play-games.googleusercontent.com/vp/mp4/1280x720/Wdo80FFiyoo.mp4');
      });
  });
});
