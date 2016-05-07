'use strict';

app.controller('ProfileController', function ($scope) {
    $scope.category = "";
    $scope.unlockedLevels = [];
    $scope.levelsByCategory = {};
    $scope.array = [0, 1, 2, 3, 4];


    $scope.getCategory = function() {


      var unlockedLevels = $scope.user.levels.length;
      if (unlockedLevels < 10){
        $scope.category = "Principiante";
      }
      else if (unlockedLevels >= 10 && unlockedLevels < 25 ) {
        $scope.category = "Investigador";
      }
      else if (unlockedLevels >= 25 && unlockedLevels < 45 ) {
        $scope.category = "Aventurero";
      }
      else {
        $scope.category = "Investigador";
      }
    }

    $scope.getCategory();

});
