
app.controller('GameController', function($scope, $timeout) {
    var selectedCards = {};
    var totalCards;

    $scope.cards = [];
    $scope.array = [0, 1, 2, 3, 4];
    $scope.counter = $scope.level.time;

    // The first thing we do is set up the timer countdown
    onTimeout = function() {
        $scope.counter--;
        if ($scope.counter == 0) {
            document.getElementById("game_screen").style.display='none';
            document.getElementById("loser_screen").style.display='block';
        } else {
            mytimeout = $timeout(onTimeout,1000);
        }
    }
    var mytimeout = $timeout(onTimeout,1000);

    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }

    // Then we get the cards
    DBGetLevelCards($scope.level, function (err, result) {
        var cards = [];
        totalCards = result.rows.length;
        for (var i = 0; i < result.rows.length; i++) {
            var card = result.rows[i].doc;
            card.imageShown = 'images/done.png';
            card.position = i;
            cards.push(card);
        };

        cards = shuffle(cards);

        $scope.$apply(function(){
            $scope.cards = cards;
        });
    });

    // This functions are used to handle the game cards
    $scope.showCard = function(card) {
        if (!selectedCards.card1)
            selectedCards.card1 = card;
        else if (!selectedCards.card2)
            selectedCards.card2 = card;
        else {
            if (selectedCards.card1._id == selectedCards.card2._id && selectedCards.card1.position != selectedCards.card2.position) {
                removeCard(selectedCards.card1);
            } else {
                selectedCards.card1.imageShown = 'images/done.png';
                selectedCards.card2.imageShown = 'images/done.png';
            }

            delete selectedCards.card1;
            delete selectedCards.card2;
            return;
        }

        card.imageShown = card.image;
    }

    var removeCard = function(card) {
        document.getElementsByClassName(card._id)[0].style.display='none';
        document.getElementsByClassName(card._id)[1].style.display='none';

        totalCards -= 2;

        if (totalCards == 0) {
            // El timer se detiene y esconde
            $scope.stop();
            document.getElementById("timer").style.display='none';

            // Se actualiza el puntaje del nivel
            $scope.score = $scope.counter;

            // Se busca una carta aleatoria entre las cartas del nivel para entregar al usuario
            var random = Math.floor(Math.random() * $scope.cards.length);
            $scope.obtainedCard = $scope.cards[random];

            // Se instancia el usuario activo, se le actualiza el highscore, los niveles
            // y se le desbloquea la nueva carta para luego actualizar la base
            var newUser = $scope.user;
            var addCard = true;
            newUser.highscore += $scope.score;
            newUser.levels.push($scope.level.nextLevel);

            for (var i = 0; i < newUser.cards.length; ++i) {
                if (newUser.cards[i] == $scope.obtainedCard._id) {
                    addCard = false;
                }
            }

            if (addCard)
                newUser.cards.push($scope.obtainedCard._id);

            DBUpdateUser(newUser, function(err, response) {
                if (err)
                    console.log(err);
                else
                    $scope.changeUser(response);
            });

            document.getElementById("game_screen").style.display='none';
            document.getElementById("win_screen").style.display='block';
        }
    }

    $scope.restartGame = function() {

        // Reinicio el estado de las cartas
        var card;
        for (var i = 0; i < $scope.cards.length; ++i) {
            card = $scope.cards[i];
            card.imageShown = 'images/done.png';
            document.getElementsByClassName(card._id)[0].style.display='block';
            document.getElementsByClassName(card._id)[1].style.display='block';
        }

        // Reinicio las variables internas del controlador
        totalCards = $scope.cards.length;
        selectedCards = {};

        // Reinicio el contador
        $scope.counter = $scope.level.time;
        mytimeout = $timeout(onTimeout,1000);

        // Me aseguro que las pantallas correctas se esten mostrando
        document.getElementById("game_screen").style.display='block';
        document.getElementById("loser_screen").style.display='none';
        document.getElementById("win_screen").style.display='none';
    }
});
