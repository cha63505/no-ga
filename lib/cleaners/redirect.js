"use strict";

const { Ci } = require('chrome');
const { newURI } = require('sdk/url/utils');
const querystring = require('sdk/querystring');

const events = require('pathfinder/connection/events');

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
