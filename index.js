'use strict';

/**
 * Register the plugin.
 *
 * ```js
 * var collections = require('verb-collections');
 *
 * // in your generator
 * app.use(collections());
 * ```
 * @api public
 */

function collections(options) {
  options = options || {};

  return function plugin(app, base) {
    if (!isValidInstance(app)) return;

    app.option(base.options);
    app.option(options);

    app.create('badges', { viewType: 'partial' });
    app.create('docs', { viewType: 'partial' });

    app.use(require('generate-collections'));
    return plugin;
  };
}

/**
 * Validate instance
 */

function isValidInstance(app) {
  if (!app.isApp && !app.isGenerator && !app.isVerb) {
    return false;
  }
  if (app.isRegistered('verb-collections')) {
    return false;
  }
  return true;
}

/**
 * Expose `plugin` function so that verb-collections
 * can be run as a global generator
 */

module.exports = collections();

/**
 * Expose `collection` function so that options can be passed
 */

module.exports.create = collections;
