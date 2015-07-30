// https://www.instapaper.com/api/simple

var request = require('sdk/request');

// Adds given URL to given Instapaper account.
// Calls function onSuccess on success.
exports.add = function(username, password, url, onSuccess) {
  var endpoint = ['https://www.instapaper.com/api/add?username=',
                  escape(username), '&password=', escape(password),
                  '&url=', preprocess(url)].join('');

  var handler = function(response) {
    if (response.status.toString()[0] == '2') onSuccess();
  };

  request.Request({ url: endpoint, onComplete: handler }).get();
}

// Prepares URL for Instapaper submission: deletes URL prefixes and escapes.
function preprocess(url) {
  if (url.indexOf('facebook.com/l.php?u=') == 0) {
    url = url.replace(/https?:\/\/(www\.|l\.)?facebook\.com\/l\.php\?u=/, '');
  }

  return escape(url);
}
