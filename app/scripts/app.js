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

// DBCreateLevels();
DBCreateCards();

// DBGetHighscores(function (err, response) {
//   console.log(JSON.stringify(response.rows) + "\n");
  
//   for (var i = response.rows.length - 1; i >= 0; i--) {
//     console.log(JSON.stringify(response.rows[i]) + "\n\n");
//   };
// });