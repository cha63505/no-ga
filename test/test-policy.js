"use strict";

const { Request } = require('sdk/request');
const tabs = require('sdk/tabs');
const { prefs } = require('sdk/simple-prefs');
const { setTimeout } = require('sdk/timers');
const { once } = require('sdk/event/core');
const { defer, all } = require('sdk/core/promise');

let gaRedirect = require('./ga-redirect');

const { events } = require("../lib/policy");

/*
exports["test policy xhr"] = function(assert, done) {
  setTimeout(_ => {
    Request({
      'url': 'https://google-analytics.com/ga.js',
       onComplete: function (response) {
         assert.pass(response.status);
         assert.equal(response.text, '', 'the request should be the fake content');
         done();
       }
    }).get();
  }, 500);
};
*/

exports["test script tag"] = function(assert, done) {
  setTimeout(_ => {
    let blockedP = defer();
    once(events, 'blocked', _ => {
      assert.pass('the request was blocked');
      blockedP.resolve();
    })
    let tabP = defer();
    tabs.open({
      'url': 'data:text/html;charset=utf-8,<script src="https://google-analytics.com/ga.js"></script>',
      onLoad: aTab => {
        assert.pass('tab was opened');
        tabP.resolve(aTab);
      }
    })
    all([ tabP.promise, blockedP.promise ]).then(args => {
      let tab = args[0];
      tab.close(done);
    });
  })
}

exports["test policy tab"] = function(assert, done) {
  setTimeout(_ => {
    let blockedP = defer();
    once(events, 'blocked', _ => {
      assert.pass('the request was blocked');
      blockedP.resolve();
    })
    let tabP = defer();
    tabs.open({
      'url': 'https://google-analytics.com/ga.js',
      onOpen: aTab => {
        assert.pass('tab was opened');
        tabP.resolve(aTab);
      }
    })
    all([ tabP.promise, blockedP.promise ]).then(args => {
      let tab = args[0];
      tab.close(done);
    });
  })
};

require("sdk/test").run(exports);
