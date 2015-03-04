'use strict';

app.controller('GameController', function($scope, $timeout) {
    $scope.card = {};
    $scope.cards = [];
    $scope.array = [0, 1, 2, 3, 4];
    $scope.counter = $scope.level.time;

    // The first thing we do is set up the timer countdown
    $scope.onTimeout = function(){
        $scope.counter--;
        if ($scope.counter == 0) {
            //finish game
        } else {
            mytimeout = $timeout($scope.onTimeout,1000);
        }
    }
    var mytimeout = $timeout($scope.onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

    // Then we get the cards
    DBGetLevelCards($scope.level, function (err, result) {
        var cards = [];
        for (var i = 0; i < result.rows.length; i++) {
            cards.push(result.rows[i].doc);
        }

        $scope.$apply(function(){
            $scope.cards = cards;
        });
    });

    $scope.showCard = function(card) {
        $scope.card = card;
        document.getElementById("modal").style.display="block";
        
    }

    $scope.hideCard = function() {
        $scope.card = {};
        document.getElementById("modal").style.display="none";
        
    }

    // TODO onclick flip card. limit flips to two. check if flips are compatible.
});