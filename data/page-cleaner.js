/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 'use strict';

function parse(query, separator, assigner) {
  separator = separator || '&';
  assigner = assigner || '=';
  let result = {};

  if (typeof query !== 'string' || query.length === 0)
    return result;

  query.split(separator).forEach(function(chunk) {
    let pair = chunk.split(assigner);
    let key = unescape(pair[0]);
    let value = unescape(pair.slice(1).join(assigner));

    if (!(key in result))
      result[key] = value;
    else if (Array.isArray(result[key]))
      result[key].push(value);
    else
      result[key] = [result[key], value];
  });

  return result;
};

let unescape = decodeURIComponent;

function escape(query) {
  return encodeURIComponent(query).
    replace(/%20/g, '+').
    replace(/!/g, '%21').
    replace(/'/g, '%27').
    replace(/\(/g, '%28').
    replace(/\)/g, '%29').
    replace(/\*/g, '%2A');
}

function stringify(options, separator, assigner) {
  separator = separator || '&';
  assigner = assigner || '=';
  // Explicitly return null if we have null, and empty string, or empty object.
  if (!options)
    return '';

  // If content is already a string, just return it as is.
  if (typeof(options) == 'string')
    return options;

  let encodedContent = [];
  function add(key, val) {
    encodedContent.push(escape(key) + assigner + escape(val));
  }

  function make(key, value) {
    if (value && typeof(value) === 'object')
      Object.keys(value).forEach(function(name) {
        make(key + '[' + name + ']', value[name]);
      });
    else
      add(key, value);
  }

  Object.keys(options).forEach(function(name) { make(name, options[name]); });
  return encodedContent.join(separator);
}

let links = window.document.links;
for(let i = links.length - 1; i >= 0; i--) {
  let linkHref = links[i].href;

  let match = linkHref.match(/(.*)\?([^#]*utm_[^#]*)(#.*)?/);
  if (!match || match.length < 3) {
    continue;
  }

  let qs = parse(match[2]);
  let noRedirect = true;
  Object.keys(qs).forEach(key => {
    if (/^utm_/.test(key)) {
      noRedirect = false;
      delete qs[key];
    }
  });

  if (noRedirect)
    continue;

  qs = stringify(qs);
  links[i].href = match[1] + (qs ? ('?' + qs) : '') + (match[3] || '');
}
