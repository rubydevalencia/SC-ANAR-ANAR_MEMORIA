

app.controller('GameController', function($scope, $timeout) {
    $scope.card = undefined;
    var cards = {};

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
            var card = result.rows[i].doc;
            card.imageShown = 'images/card.png';
            card.position = i;
            card.showing = true;
            cards.push(card);
        }

        $scope.$apply(function(){
            $scope.cards = cards;
        });
    });

    $scope.showCard = function(card) {
        if (!cards.card1) 
            cards.card1 = card;
        else if (!cards.card2)
            cards.card2 = card;
        else {
            if (cards.card1._id == cards.card2._id && cards.card1.position != cards.card2.position) {
                removeCard(cards.card1);
            } else {
                cards.card1.imageShown = 'images/card.png';
                cards.card2.imageShown = 'images/card.png';
            }

            delete cards.card1;
            delete cards.card2;
            return;
        }
        
        card.imageShown = card.image;
    }

    var removeCard = function(card) {
        document.getElementsByClassName(card._id)[0].style.display='none';
        document.getElementsByClassName(card._id)[1].style.display='none';
    }
});