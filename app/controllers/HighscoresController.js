'use strict';

app.controller('HighscoresController', function ($scope) {
    DBGetHighscores(function (err, response) {
      if (err)
            return;
        
      $scope.users = response.rows;
      $scope.$apply();
    });
});