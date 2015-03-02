'use strict';

app.controller('GameController', function($scope) {
    this.init = function(level) {
        $scope.level = level;
        $scope.cards = [];
        // TODO get the cards for the level

    }
});