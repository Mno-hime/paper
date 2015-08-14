let step = self.options.step;

window.addEventListener('keydown', function(event) {
  if (event.target.tagName.toLowerCase() !== 'textarea') {
    switch (event.keyCode) { 
      case 74: // j
        window.scrollByLines(step);
        break;
      case 75: // k
        window.scrollByLines(-step);
        break;
      case 83: // s
        document.querySelectorAll('a[title="Save Article"]')[0].click();
        break;
    }
  }
});
