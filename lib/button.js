let locale = require("sdk/l10n");

let tabs = require('sdk/tabs');
let ui = require('sdk/ui');

// Creates a Paper button which executes the given function on click.
exports.create = function(onClick) {
  return ui.ActionButton({
    id: 'paper-button',
    label: locale.get('send_to_instapaper'),
    icon: './default.png',
    onClick: onClick
  });
}

let instapaper = require('./instapaper');
let notifications = require('sdk/notifications');
let prefs = require('sdk/simple-prefs').prefs;

// Sends given URL to Instapaper API. Updates button icon.
// If notifications are on, sends one.
exports.send = function(button, url) {
  instapaper.add(prefs.username, prefs.password, url, function() {
    if (prefs.notifications) {
      notifications.notify({
        title: locale.get('added_to_instapaper'),
        text: url.replace(/^https?:\/\//, '').replace(/\/$/, '')
      });
    }

    succeed(button);
  });
}

// Changes the icon on the button to Instapaper logo.
function restore(button) {
  button.state('window', { icon: './default.png' });
}

let timers = require('sdk/timers');

// Changes the icon on the button to a tick.
function succeed(button) {
  button.state('window', { icon: './success.png' });
  timers.setTimeout(function() { restore(button) }, 1400);
}
