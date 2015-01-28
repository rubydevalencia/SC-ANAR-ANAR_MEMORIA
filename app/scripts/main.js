'use strict';

// Listens for the app launching then creates the window
chrome.app.runtime.onLaunched.addListener(function() {

  var screenWidth = window.screen.availWidth;
  var screenHeight = window.screen.availHeight;

  var width = screenWidth*0.8;
  var height = screenHeight*0.8

  chrome.app.window.create('index.html', {
    "id" : "index",
    "bounds" : {
      "width" : Math.round(width),
      "height": Math.round(height),
      "left" : Math.round((screenWidth - width)/2),
      "top" : Math.round((screenHeight - height)/2)
    } 
  });
});
