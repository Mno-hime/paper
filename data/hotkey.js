function emit(event) {
  event.preventDefault();

  let suppressor = function(e) { e.preventDefault };
  window.addEventListener('keydown', suppressor);

  let hotkey = '';
  if (event.ctrlKey) hotkey = 'ctrl-';
  if (event.altKey) hotkey = hotkey + 'alt-';
  if (event.metaKey) hotkey = hotkey + 'meta-';
  if (event.shiftKey && hotkey) hotkey = hotkey + 'shift-';

  if (hotkey) {
    hotkey = hotkey + String.fromCharCode(event.keyCode).toLowerCase();
    self.port.emit('press', hotkey);
    window.removeEventListener('keydown', suppressor);
    window.removeEventListener('keyup', emit);
    self.port.emit('stop');
  }
}

window.addEventListener('keyup', emit);
