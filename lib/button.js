var instapaper = require('./instapaper');
var notifications = require('sdk/notifications');
var prefs = require('sdk/simple-prefs').prefs;
var tabs = require('sdk/tabs');
var timers = require('sdk/timers');
var ui = require('sdk/ui');

// Creates a Paper button which executes the given function on click.
exports.create = function(onClick) {
  return ui.ActionButton({
    id: 'paper-button',
    label: 'Send to Instapaper',
    icon: './default.png',
    onClick: function() { exports.send(this, tabs.activeTab.url) }
  });
}

// Sends given URL to Instapaper API. Updates button icon.
// If notifications are on, sends one.
exports.send = function(button, url) {
  instapaper.add(prefs.username, prefs.password, url, function() {
    if (prefs.notifications == true) {
      notifications.notify({
        title: 'Added to Instapaper',
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

// Changes the icon on the button to a tick.
function succeed(button) {
  button.state('window', { icon: './success.png' });
  timers.setTimeout(function() { restore(button) }, 1400);
}
