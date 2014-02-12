'use strict';

const { Ci } = require('chrome');
const { newURI } = require('sdk/url/utils');
const querystring = require('sdk/querystring');
const { prefs } = require('sdk/simple-prefs');

const { ContentPolicy } = require('pathfinder/content/policy');
const events = require('pathfinder/connection/events');

const GA_REGEX = /(.*\.)?google-anal?ytics\.com$/i;

ContentPolicy({
  description: "Blocks Google Analytics",
  contract: "@erikvold.com/NoGA-policy",
  entry: "no-ga.stopGATrackingFiles",
  shouldLoad: function({location: location, origin: origin}) {
    // if the host is google-analytics.com then block it
    try {
      if (location.host.match(GA_REGEX)) {
        if (prefs.logging) {
          console.log(location.spec + ' was blocked on ' + origin.spec);
        }
        return false;
      }
    } catch(e) {}
    return true;
  }
});

function onRequest({ subject }) {
  let channel = subject.QueryInterface(Ci.nsIHttpChannel);

  let match = channel.URI.spec.match(/(.*)\?([^#]*utm_[^#]*)(#.*)?/);
  if (!match || match.length < 3) {
    return false;
  }

  let qs = querystring.parse(match[2]);
  let noRedirect = true;
  Object.keys(qs).forEach(key => {
    if (/^utm_/.test(key)) {
      noRedirect = false;
      delete qs[key];
    }
  });

  if (noRedirect)
    return false;

  qs = querystring.stringify(qs);
  let redirctURI = newURI(match[1] + (qs ? ('?' + qs) : '') + (match[3] || ''));
  channel.redirectTo(redirctURI);
  return true;
}
events.on('modify-request', onRequest);
