'use strict';

var falsey = require('falsey');
var extend = require('extend-shallow');
var isObject = require('isobject');

/**
 * Register the plugin.
 *
 * ```js
 * var collections = require('generate-collections');
 *
 * // in your generator
 * app.use(collections());
 * ```
 * @api public
 */

function collections(options) {
  return function plugin(app, base) {
    if (!isValidInstance(app)) return;

    var opts = extend({}, options, this.options);

    /**
     * Middleware for collections created by this generator
     */

    this.preLayout(/\.md/, function(view, next) {
      if (falsey(view.layout) && !view.isType('partial')) {
        // use the empty layout created above, to ensure that all
        // pre-and post-layout middleware are still triggered
        view.layout = app.resolveLayout(view) || 'empty';
        next();
        return;
      }

      if (view.isType('partial')) {
        view.options.layout = null;
        view.data.layout = null;
        view.layout = null;
        if (typeof view.partialLayout === 'string') {
          view.layout = view.partialLayout;
        }
      }
      next();
    });

    // add default view collections
    this.create('files', { viewType: 'renderable'});
    this.create('layouts', { viewType: 'layout' });
    this.create('includes', { viewType: 'partial' });
    this.create('badges', { viewType: 'partial' });
    this.create('docs', { viewType: 'partial' });

    // "noop" layout
    this.layout('empty', {content: '{% body %}'});

    // create collections defined on the options
    if (isObject(opts.create)) {
      for (var key in opts.create) {
        if (!this[key]) {
          this.create(key, opts.create[key]);
        } else {
          this[key].option(opts.create[key]);
        }
      }
    }

    // pass the plugin to sub-generators
    return plugin;
  };
}

/**
 * Validate instance
 */

function isValidInstance(app) {
  if (!app.isApp && !app.isGenerator) {
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
