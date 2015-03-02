'use strict';

app.controller('GameController', function($scope) {
    $scope.cards = [];
    $scope.array = [0, 1, 2, 3, 4];

    this.init = function(level) {

        
    };

    // First we get the cards
    DBGetLevelCards($scope.level, function (err, result) {
        var cards = [];
        for (var i = 0; i < result.rows.length; i++) {
            cards.push(result.rows[i].doc);
        }

        $scope.cards = cards;
        $scope.$apply();
    });
});