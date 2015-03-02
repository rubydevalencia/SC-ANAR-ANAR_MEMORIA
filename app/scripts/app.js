'use strict';

var app = angular.module('AnarApp', ['ui.router']);

app.filter('range', function() {
  return function(input, total) {
    total = parseInt(total);
    for (var i=0; i<total; i++)
      input.push(i);
    return input;
  };
});

//DBCreateLevels();
//DBCreateCards(); 