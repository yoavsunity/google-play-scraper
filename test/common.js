'use strict';

const assert = require('chai').assert;
const validator = require('validator');

function assertValidUrl (url) {
  return assert(validator.isURL(url, { allow_protocol_relative_urls: true }),
    `${url} is not a valid url`);
}

function assertValidApp (app) {
  assert.isString(app.appId);

  assert.isString(app.title);
  assert.isString(app.summary);
  assert.isString(app.url);
  assertValidUrl(app.url);

  assertValidUrl(app.icon);

  assert.isString(app.developer);
  if (app.developerId) assert.isString(app.developerId); // TODO: should return consistently

  assert.isBoolean(app.free);
  assert.isNumber(app.price);
  if (app.price > 0) {
    if (app.priceText) assert.isString(app.priceText); // TODO: should return consistently
    assert.isString(app.currency);
  }

  // new apps might not have a score yet
  if (app.score !== undefined) {
    assert.isString(app.scoreText);
    assert.isNumber(app.score);
    assert.isAtLeast(app.score, 0);
    assert.isAtMost(app.score, 5);
  }

  return app;
}

function assertValidFullApp (app) {
  assertValidApp(app);

  assert.isNumber(app.updated);
  assert.isNumber(app.minInstalls);
  assert.isNumber(app.maxInstalls);

  assert.isString(app.description);
  assert.isString(app.descriptionHTML);
  assert.isString(app.released);
  assert.isString(app.genre);
  assert.isString(app.genreId);
  // assert.isString(app.familyGenre);
  // assert.isString(app.familyGenreId);

  // IF APP IS NOT RELEASED
  // THIS MEANS THAT IT SHOULDN'T HAVE REVIEWS
  if (app.released) {
    assert.isNumber(app.reviews);
  }

  assert.isString(app.version);
  if (app.size) {
    assert.isString(app.size); // TODO: not working anymore?
  }
  assert.isString(app.contentRating);

  assert.isString(app.androidVersion);
  assert.isString(app.androidVersionText);

  assert.isBoolean(app.available);
  assert.isBoolean(app.offersIAP);
  if (app.offersIAP) {
    assert.isString(app.IAPRange);
  }
  // assert(app.preregister === false);

  assert.isString(app.developerInternalID);
  if (app.developerWebsite) {
    assertValidUrl(app.developerWebsite);
  }
  assert(validator.isEmail(app.developerEmail), `${app.developerEmail} is not an email`);

  // Assets
  if (app.video) {
    assertValidUrl(app.video);
    assertValidUrl(app.videoImage);
    assertValidUrl(app.videoPreview);
  }

  if (app.headerImage) assertValidUrl(app.headerImage);

  assert(app.screenshots.length);
  app.screenshots.map(assertValidUrl);
  ['1', '2', '3', '4', '5'].map((v) => assert.property(app.histogram, v));

  assert.isArray(app.comments);
  assert.isAbove(app.comments.length, 0);
  // app.comments.map(assert.isString); // TODO: comments are sometimes empty probably related to locale

  if (app.recentChanges) assert.isString(app.recentChanges); // TODO: should return consistently

  return app;
}

function assertIdsInArray (apps, ...ids) {
  assert.isTrue(ids.every((id) => apps.some((app) => app.appId === id)));
}

module.exports = { assertValidUrl, assertValidApp, assertValidFullApp, assertIdsInArray };
