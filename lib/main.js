let simplePrefs = require('sdk/simple-prefs');

let data = require('sdk/self').data;
let prefs = simplePrefs.prefs;
let tabs = require('sdk/tabs');

let isHotkeyCaptured = false;

simplePrefs.on('setCombo', function() {
  if (!isHotkeyCaptured) {
    isHotkeyCaptured = true;
    let worker = tabs.activeTab.attach({
      contentScriptFile: data.url('hotkey.js')
    });
    worker.port.on('press', function(combo) { prefs.combo = combo });
    worker.port.on('stop', function() { isHotkeyCaptured = false });
  }
});

let button = require('./button');
let $ = button.create();

tabs.on('pageshow', function(tab) { button.disable($, tab) });
tabs.on('activate', function(tab) { button.disable($, tab) });

if (prefs.combo) {
  let hotkeys = require('sdk/hotkeys');

  hotkeys.Hotkey({
    combo: prefs.combo,
    onPress: function() { button.send($) }
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
  let service = require('sdk/preferences/service');
  let step = service.get('toolkit.scrollbox.verticalScrollDistance', 3);

  pageMod.PageMod({
    contentScriptFile: data.url('shortcuts_read.js'),
    contentScriptOptions: { step: step },
    contentScriptWhen: 'ready',
    include: 'https://www.instapaper.com/read/*'
  });

  pageMod.PageMod({
    contentScriptFile: data.url('shortcuts_text.js'),
    contentScriptOptions: { step: step },
    contentScriptWhen: 'ready',
    include: 'https://www.instapaper.com/text?*'
  });
}

if (prefs.rightClick) {
  let locale = require('sdk/l10n');
  let menu = require('sdk/context-menu');

  menu.Item({
    label: locale.get('send_to_instapaper'),
    context: menu.SelectorContext('a[href]'),
    contentScriptFile: data.url('menu.js'),
    onMessage: function(url) { button.send($, url) }
  });
}
