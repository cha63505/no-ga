'use strict';

const { ContentPolicy } = require('content-policy');

ContentPolicy({
  description: "Blocks Google Analytics",
  contract: "@erikvold.com/NoGA-policy",
  entry: "no-ga.stopGATrackingFiles",
  shouldLoad: function({location: location, origin: origin}) {
    // if the domain is google-analytics.com or anything like that
    if (location.host.match(/google-analytics/)) {
      // fuzzy reject of __utm.gif and ga.js
      if (location.path.match(/(utm|ga)\.(gif|js)/)) {
        console.log(location + ' was blocked on ' + origin);
        return false;
      }
    }
    return true;
  }
});
