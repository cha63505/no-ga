"use strict";

const { Ci } = require('chrome');
const { newURI } = require('sdk/url/utils');
const querystring = require('sdk/querystring');

const events = require('pathfinder/connection/events');

const fixtures = require('./fixtures');

const GA_REGEX = /^https?:\/\/(.*\.)?google-anal?ytics\.com\/ga\.js/i;

let fixureGA = "data:text/plain;charset=utf-8,var _gaq = [];\n";
console.log('fixureGA '+fixureGA);

function onRequest({ subject }) {
  let channel = subject.QueryInterface(Ci.nsIHttpChannel);
  let match = channel.URI.spec.match(GA_REGEX);
  if (!match) {
    return false;
  }

  channel.redirectTo(newURI(fixureGA));
  return true;
}
events.on('modify-request', onRequest);
