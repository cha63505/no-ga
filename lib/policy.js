"use strict";

const { ContentPolicy } = require('content-policy');
const { prefs, on } = require('sdk/simple-prefs');
const { setImmediate } = require('sdk/timers');
const { emit } = require('sdk/event/core');

const events = {};

const GA_REGEX = /(.*\.)?google-anal?ytics\.com/i;
let logging = prefs.logging || false;
//on('logging', function() logging = prefs.logging);

ContentPolicy({
  description: "Blocks Google Analytics",
  contract: "@erikvold.com/NoGA-policy",
  entry: "no-ga.stopGATrackingFiles",
  shouldLoad: function({ location, origin }) {
    // if the host is google-analytics.com then block it
    try {
      //console.log('shouldLoad ' + location.spec)
      if (location.host.match(GA_REGEX) || origin.host.match(GA_REGEX)) {
        if (logging) {
          console.log(location.spec + ' was blocked on ' + origin.spec);
        }
        setImmediate(_ => {
          emit(events, 'blocked');
        });
        return false;
      }
    }
    catch(e) {
      if (logging) {
        console.exception(e);
      }
    }
    return true;
  }
});

exports.events = events;
