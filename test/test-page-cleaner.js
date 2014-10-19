/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const tabs = require('sdk/tabs');
const { defer, all } = require('sdk/core/promise');

require('../lib/cleaners/page');

exports['test page link cleaner'] = function(assert, done) {
  tabs.open({
    url: 'data:text/html;charset=utf-8,<a href="test.html?utm_z=134">test</a>',
    onLoad: tab => {
      let mod = tab.attach({
        contentScript: 'self.port.emit("href", window.document.links[0].href)'
      });
      mod.port.once('href', href => {
        assert.equal('test.html', href, 'link was modified');
        tab.close(done);
      });
    }
  })
}

require('sdk/test').run(exports);
