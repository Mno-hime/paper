let simplePrefs = require('sdk/simple-prefs');

let data = require('sdk/self').data;
let prefs = simplePrefs.prefs;
let tabs = require('sdk/tabs');

let button = require('lib/button');
let $ = button.create();

let hotkeys = require('sdk/hotkeys');

if (prefs.combo != '') {
  hotkeys.Hotkey({
    combo: prefs.combo,
    onPress: function() { button.send($, tabs.activeTab.url) }
  });
}

let pageMod = require('sdk/page-mod');

if (prefs.modifier != 'N') {
  pageMod.PageMod({
    contentScriptFile: data.url('listener.js'),
    contentScriptOptions: { modifier: prefs.modifier },
    contentScriptWhen: 'ready',
    include: '*',
    onAttach: function(worker) {
      worker.port.on('click', function(url) { button.send($, url) });
    }
  });
}

let locale = require('sdk/l10n');
let menu = require('sdk/context-menu');

if (prefs.rightClick == true) {
  menu.Item({
    label: 'Send to Instapaper',
    context: menu.SelectorContext('a[href]'),
    contentScriptFile: data.url('menu.js'),
    onMessage: function(url) { button.send($, url) }
  });
}
