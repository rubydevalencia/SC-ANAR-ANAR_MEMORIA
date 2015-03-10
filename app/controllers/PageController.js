'use strict';

app.controller('PageController', function($scope) {
    $scope.page = 'auth';
    $scope.user = {};

    $scope.changePage = function (page) {
        $scope.page = page;
        $scope.$apply();
    }

    $scope.changeUser = function (user) {
        $scope.user = user;
        $scope.$apply();
    }

    $scope.startGame = function (level) {
        if (level.isUnlocked) {
            $scope.level = level;
            $scope.changePage('game');
        }
    }

    $scope.logOut = function() {
        $scope.page = 'auth';
        $scope.user = {};
        $scope.$apply();
    }
});