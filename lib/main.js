'use strict';

const { ContentPolicy } = require('content-policy');
const GA_REGEX = /(.*\.)?google-analytics\.com$/i;

ContentPolicy({
  description: "Blocks Google Analytics",
  contract: "@erikvold.com/NoGA-policy",
  entry: "no-ga.stopGATrackingFiles",
  shouldLoad: function({location: location, origin: origin}) {
    // if the hist is google-analytics.com then block it
    if (location.host.match(GA_REGEX)) {
      console.log(location + ' was blocked on ' + origin);
      return false;
    }
    return true;
  }
});
