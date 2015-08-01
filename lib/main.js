let simplePrefs = require('sdk/simple-prefs');

let data = require('sdk/self').data;
let prefs = simplePrefs.prefs;
let tabs = require('sdk/tabs');

let isHotkeyBeingSet = false;

simplePrefs.on('setCombo', function() {
  if (!isHotkeyBeingSet) {
    isHotkeyBeingSet = true;
    let worker = tabs.activeTab.attach({
      contentScriptFile: data.url('hotkey.js')
    });
    worker.port.on('press', function(combo) { prefs.combo = combo });
    worker.port.on('stop', function() { isHotkeyBeingSet = false });
  }
});

let button = require('./button');

function send() { button.send($, tabs.activeTab.url) }

let $ = button.create(send);
let hotkeys = require('sdk/hotkeys');

if (prefs.combo) {
  hotkeys.Hotkey({
    combo: prefs.combo,
    onPress: function() { send() }
  });
}

let pageMod = require('sdk/page-mod');

if (prefs.modifier !== 'N') {
  pageMod.PageMod({
    contentScriptFile: data.url('modifier.js'),
    contentScriptOptions: { modifier: prefs.modifier },
    contentScriptWhen: 'ready',
    include: '*',
    onAttach: function(worker) {
      worker.port.on('click', function(url) { button.send($, url) });
    }
  });
}

if (prefs.readShortcuts) {
  pageMod.PageMod({
    contentScriptFile: data.url('shortcuts.js'),
    contentScriptWhen: 'ready',
    include: 'https://www.instapaper.com/read/*',
  });
}

let locale = require('sdk/l10n');
let menu = require('sdk/context-menu');

if (prefs.rightClick) {
  menu.Item({
    label: locale.get('send_to_instapaper'),
    context: menu.SelectorContext('a[href]'),
    contentScriptFile: data.url('menu.js'),
    onMessage: function(url) { button.send($, url) }
  });
}
