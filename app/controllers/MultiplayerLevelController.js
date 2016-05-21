'use strict';

app.controller('MultiplayerLevelController', function ($scope, sharedGlobals) {
    $scope.difficulty = ["Facil","Medio","Dificil"];

    $scope.startMultiplayerGame = function(value){
      sharedGlobals.setDifficulty(value);
      $scope.changePage('chat');
    };

});
