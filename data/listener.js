window.addEventListener("click", function(event) {
  var link = event.target;
  while (link && link.localName != "a")
    link = link.parentNode;

  if (link) {
    self.port.emit("click", link.href);
    event.preventDefault();
  }
}, false);
