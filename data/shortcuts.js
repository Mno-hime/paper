window.addEventListener('keydown', function(event) {
  switch (event.keyCode) { 
    case 74: // j
      window.scrollBy(0, 100);
      break;
    case 75: // k
      window.scrollBy(0, -100);
      break;
    case 65: // a
      document.getElementsByClassName('js_archive_single')[0].click();
      break;
    case 76: // l
      document.getElementsByClassName('js_star_toggle')[0].click();
      break;
    case 68: // d
      document.getElementsByClassName('js_delete_single')[0].click();
      break;
  }
});
