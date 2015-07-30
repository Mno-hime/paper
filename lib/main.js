var button = require('button');
var data = require('sdk/self').data;
var hotkeys = require('sdk/hotkeys');
var menu = require('sdk/context-menu');
var prefs = require('sdk/simple-prefs').prefs;
var tabs = require('sdk/tabs');

var { PageMod } = require('sdk/page-mod');

var $ = button.create();

if (prefs.combo != '') {
  hotkeys.Hotkey({
    combo: prefs.combo,
    onPress: function() { button.send($, tabs.activeTab.url) }
  });
}

if (prefs.modifier != 'N') {
  PageMod({
    contentScriptFile: data.url('listener.js'),
    contentScriptOptions: { modifier: prefs.modifier },
    contentScriptWhen: 'ready',
    include: '*',
    onAttach: function(worker) {
      worker.port.on('click', function(url) { button.send($, url) });
    }
  });
}

if (prefs.rightClick == true) {
  menu.Item({
    label: 'Send to Instapaper',
    context: menu.SelectorContext('a[href]'),
    contentScriptFile: data.url('menu.js'),
    onMessage: function(url) { button.send($, url) }
  });
}
