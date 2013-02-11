'use strict';

const { Cc, Ci } = require("chrome");
const xpcom = require("xpcom");

const { Class } = require("sdk/core/heritage");
const { when: unload } = require('unload');

exports.preventCrossRequest = Class({
  extends: xpcom.Unknown,
  interfaces: ["nsIContentPolicy"],
  shouldLoad: function (contType, aContentLocation, reqOrig, ctx, typeGuess, extra) {
    // if the domain is google-analytics.com or anything like that
    if (aContentLocation.host.match(/google-analytics/)) {
      // fuzzy reject of __utm.gif and ga.js
      if (aContentLocation.path.match(/(utm|ga)\.(gif|js)/)) {
        console.log(aContentLocation.spec + ' was blocked on '+reqOrig.spec);
        return Ci.nsIContentPolicy.REJECT;
      }
    }
    return Ci.nsIContentPolicy.ACCEPT;
  },

  shouldProcess: function (contType, contLoc, reqOrig, ctx, mimeType, extra) {
    return Ci.nsIContentPolicy.ACCEPT;
  }
});

let factory = xpcom.Factory({
  Component:   exports.preventCrossRequest,
  description: "Blocks Google Analytics",
  contract:    "@erikvold.com/NoGA-policy"
});

const CM = Cc["@mozilla.org/categorymanager;1"]
    .getService(Ci.nsICategoryManager);
CM.addCategoryEntry("content-policy", "no-ga.stopGATrackingFiles", factory.contract, false, true);

unload(function() {
  CM.deleteCategoryEntry("content-policy", "no-ga.stopGATrackingFiles", false);
});
