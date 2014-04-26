"use strict";

const { Loader } = require('sdk/test/loader');
const loader = Loader(module);
const { startServerAsync } = loader.require('sdk/test/httpd');
const { pathFor } = require('sdk/system');
const file = require('sdk/io/file');

const basePath = pathFor("ProfD");
const port = 8099;
const host = 'http://localhost:' + port + '/';

function serve({ name, content }) {
  content = content || '<html><head><title>'+name+'</title></head><body></body></html>';
  let srv = startServerAsync(port, basePath);
  let pagePath = file.join(basePath, name + '.html');
  let pageStream = file.open(pagePath, 'w');
  pageStream.write(content);
  pageStream.close();
  return srv;
}
exports.serve = serve;
