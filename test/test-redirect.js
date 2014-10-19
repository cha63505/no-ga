"use strict";

const tabs = require('sdk/tabs');

const { serve } = require('./httpd');
require('../lib/cleaners/redirect');

const port = 8099;
const host = 'http://localhost:' + port + '/';
const NAME = 'testRedirect';
const PAGE_URL = host + NAME;

exports['test regular redirect'] = function(assert, done) {
  let srv = serve({
    name: NAME
  });

  tabs.open({
    url: PAGE_URL + "?utm_3=5",
    onLoad: tab => {
      assert.equal(tab.url, PAGE_URL, 'the redirect happened');
      srv.stop(_ => tab.close(done));
    }
  })
}

exports['test redirect with hash'] = function(assert, done) {
  let srv = serve({
    name: NAME
  });

  tabs.open({
    url: PAGE_URL + "?utm_3=5#t",
    onLoad: tab => {
      assert.equal(tab.url, PAGE_URL + '#t', 'the redirect happened');
      srv.stop(_ => tab.close(done));
    }
  })
}

exports['test redirect with extra params'] = function(assert, done) {
  let srv = serve({
    name: NAME
  });

  tabs.open({
    url: PAGE_URL + "?utm_3=5&t=1",
    onLoad: tab => {
      assert.equal(tab.url, PAGE_URL + '?t=1', 'the redirect happened');
      srv.stop(_ => tab.close(done));
    }
  })
}

exports['test redirect with extra params and hash'] = function(assert, done) {
  let srv = serve({
    name: NAME
  });

  tabs.open({
    url: PAGE_URL + "?utm_3=5&t=1#t",
    onLoad: tab => {
      assert.equal(tab.url, PAGE_URL + '?t=1#t', 'the redirect happened');
      srv.stop(_ => tab.close(done));
    }
  })
}

require("sdk/test").run(exports);
