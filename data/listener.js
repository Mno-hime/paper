function listener(event) {
  var link = event.target;
  while (link && link.localName != "a")
    link = link.parentNode;

  if (link) {
    self.port.emit("click", link.href);
    event.preventDefault();
  }
}

function checkModifier(event) {
  switch (self.options.modifier) {
    case "alt":   return event.altKey;
    case "ctrl":  return event.ctrlKey;
    case "shift": return event.shiftKey;
    case "cmd":   return event.metaKey;
  }
}

window.addEventListener("keydown", function(event) {
  if (checkModifier(event))
    window.addEventListener("click", listener, false);
});

window.addEventListener("keyup", function(event) {
  if (!checkModifier(event))
    window.removeEventListener("click", listener, false);
});
