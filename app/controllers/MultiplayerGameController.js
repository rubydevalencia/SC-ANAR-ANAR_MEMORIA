'use strict';

app.controller('MultiplayerGameController', function($scope, $http, $q, sharedGlobals) {

  // Direccion del servidor de juego
  var serverURL = 'http://0.0.0.0:3000/';

  // Obtenemos la dificultad del juego que escogimos anteriormente.
  var dificultad = sharedGlobals.getDifficulty();
  $scope.gameDifficulty = dificultad;

  // Para Manejar las jugadas
  $scope.jugada = "";
  $scope.all_gameplays = [];

  // Para actualizar los jugadores.
  $scope.mynumber = 0;           // Me deja saber si soy el jugador 1 o el 2.
  $scope.mydata   = {};          // Almacena mis datos (username, id y score) manejados del servidor.
  $scope.other_player_data = {}; // Almacena los datos de mi contrincante.

  // Guarda los datos del juego
  $scope.gamedata = {};          // Almacena los datos del juego en el que estoy unido

  // ------------------- PARA LA SELECCIÓN DE LAS CARTAS. ----------------------
  var idFinal; // Indicará el id de la última carta.

  // Se selecciona el id de la última carta dependiendo de la dificultad elegida.
  switch (dificultad) {
    case 'Facil':
      var limListas = [5, 10];
      idFinal = limListas[Math.floor(Math.random() * limListas.length)];
      break;
    case 'Intermedio':
      var limListas = [15, 20, 25];
      idFinal = limListas[Math.floor(Math.random() * limListas.length)];
      break;
    case 'Medio':
      var limListas = [30, 35, 40, 45];
      idFinal = limListas[Math.floor(Math.random() * limListas.length)];
      break;
    case 'Dificil':
      var limListas = [50, 55, 60, 65, 70];
      idFinal = limListas[Math.floor(Math.random() * limListas.length)];
      break;
  }

  // Se crea el nivel a jugar.
  var level = {
      _id: "-1",                  // Se establece el id en -1 ya que no pertenece a ninguno de los niveles en solitario.
      difficulty: dificultad,
      name: 'Nivel Multijugador ' + dificultad, // Nombre inicial de la sala.
      cards: getArray(idFinal - 5, idFinal),    // Id de las cartas a elegir.
      numPieces: 10,                            // Número de piezas que estarán en el tablero.
      time: '100',                              // Tiempo que tendrá cada jugador en la partida.
      imageName: 'done.png',
      nextLevel: "Ninguno"                     // Como es multijugador no habrá ningún nivel desbloqueable.
  };
  console.log("El nivel es:");
  console.log(level);
  $scope.level = level   // "Nivel" que jugará los jugadores.

// -----------------------------------------------------------------------------

  // Para el uso de las cartas.
  var selectedCards = {}         // Conjunto con todas las cartas que aparecerán.
  var totalCards;

  $scope.cards = [];
  $scope.array = [0, 1, 2, 3, 4];

  // Para obtener las cartas que se utilizarán en la partida.
  DBGetLevelCards($scope.level, function (err, result) {
      var cards = [];
      totalCards = result.rows.length;
      //console.log("Generando cartas.");
      //console.log("La cantidad de cartas es:");
      //console.log(totalCards);
      for (var i = 0; i < result.rows.length; i++) {
          var card = result.rows[i].doc;
          card.imageShown = 'images/done.png';
          card.position = i;
          cards.push(card);
      };
      cards = shuffle(cards);
      console.log(cards);
      //console.log("Las cartas son:");
      //console.log(cards);
      $scope.cards = cards;
      $scope.$apply();
  });

  $scope.showCard = function(card) {
      if (!selectedCards.card1)
          selectedCards.card1 = card;
      else if (!selectedCards.card2)
          selectedCards.card2 = card;
      else {
          if (selectedCards.card1._id == selectedCards.card2._id && selectedCards.card1.position != selectedCards.card2.position) {
              removeCard(selectedCards.card1);
              console.log("Eliminando.");
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


  // CONEXION CON EL SERVIDOR PARA EL MULTIJUGADOR
  var connectSocket = function(){

      //Creating connection with server
      var socket = io.connect(serverURL);

      socket.on('connect', function () {

        // Escuchamos a que el servidor envie el evento update
        // cada vez que se envie un nuevo mensaje.
        socket.on('update',function(){
          console.log('Me dijeron que me actualizara');
          getGameplays();
        });

        // Cuando el jugador_2 se une al juego, comienza este.
        socket.on('start_game',function(){
          console.log('iniciando juego ');
          console.log('actualizando datos del juego');

          updateGameData().then(function() {
              console.log('actualizando datos de los jugadores.');
              updatePlayers();
          }, function(reason) {
              console.log(reason);
          });
        });

        // cuando suba el puntaje, actualizamos los jugadores.
        socket.on('update_scores',function(){
          updatePlayers();
        });
      });
    return socket;
  };

  var removeCard = function(card) {

      if (totalCards > 2 && $scope.counter > 1)
          moveToBottom(card);

      totalCards -= 2;
  }

  // Animación del movimiento de las cartas hacia abajo
  var moveToBottom = function (card) {
      var old = $("." + card._id);
      var newcard = $("." + card._id).first().clone().appendTo('#obtenidas');
      newcard.css('width', '110px').css('height','110px').css('padding', '0')
             .css('float','left');
      var newOffset = newcard.offset();
      var oldOffset1 = old.first().offset();
      var oldOffset2 = old.last().offset();
      var temp = old.clone().appendTo('body');
      temp.css('position', 'absolute').css('zIndex', 999)
          .css('top', oldOffset1.top).css('left', oldOffset1.left)
          .css('width', old.first().width())
          .css('height', old.first().height())
          .css('padding', 0);
      temp.last().css('top', oldOffset2.top).css('left',oldOffset2.left);
      old.hide();
      newcard.hide();
      quitarPar.play();
      temp.animate({
          top: newOffset.top,
          left: newOffset.left,
          width: newcard.width(),
          height: newcard.height(),
      }, 700, function () {
          newcard.show();
          temp.remove();
      });
  }

  // Nos conectamos al servidor via socket. serverConnection contiene el socket a usar.
  var serverConnection = connectSocket();

  // PARA UNIR A UN JUGADOR AL JUEGO
  var registerUser = function() {
    var deferred = $q.defer();  // Me permite saber si el usuario se registro satisfactoriamente
    $http.post(serverURL + 'api/players', {
            'username' : $scope.user._id,
            'category' : 'Principiante',
            'score'    : 0
        })
        .success(function(data){
            $scope.playerID = data.id;
            console.log(data)
            return deferred.resolve();
        })
        .error(function(data){
            console.log('Error: '+ data);
            return deferred.reject('No se pudo registrar el usuario');
        });

    return deferred.promise;
    };

    // Para unir a un usuario a un juego
    var joinGame = function(gameID, playerID, playerNumber) {

      var data = {}
      if (playerNumber == 1) {
          console.log("Soy el jugador1");
          data = {"player1": playerID};
      } else {
          console.log("Soy el jugador2");
          data = {"available":false,"player2": playerID};
          console.log(data);
      }

      $http.put(serverURL + 'api/Games/'+ gameID, data)
          .success(function(data){
              console.log(data)
          })
          .error(function(data){
              console.log('Error: '+ data);
          });
      };

    // PARA CREAR UN NUEVO JUEGO
    var createGame = function() {
      // dificultad, juego_libre, distribucion del tablero (para despues)
      $http.post(serverURL + 'api/Games', {
            'difficulty' :  $scope.gameDifficulty,
            'available'    : true,
            'game_set'   : '--'
      })
      .success(function(data){
          $scope.gamedata = data;
          // Unimos al jugador al nuevo juego creado
          $scope.mynumber = 1;
          joinGame($scope.gamedata.id,$scope.playerID,$scope.mynumber);
          console.log(data)
      })
      .error(function(data){
          console.log('Error: '+ data);
      });
    };

    // Busca si hay juegos disponibles en nuestra difucultad,
    // si no hy ninguno, creamos uno nuevo.
    var searchGames = function() {
      console.log('Buscando juegos disponibles.')
      $http.get(serverURL + 'api/Games/findOne?filter[where][available]=true' +
                            '&filter[where][difficulty]=' + $scope.gameDifficulty)
      .success(function(data){
          if (data) {
            $scope.gamedata = data;
            console.log('Estoy ingresando al juego' + $scope.gamedata.id);
            $scope.mynumber = 2;
            console.log("this is mi id as player2 " + $scope.playerID);
            joinGame($scope.gamedata.id, $scope.playerID, $scope.mynumber);
            serverConnection.emit('players_ready');
          } else {
            console.log('Ni hay juegos disponibles. Creando un juego nuevo.');
            createGame();
          }
      })
      .error(function(data){
          console.log('Creando primer juego del servidor.');
          createGame();
      });
    };


    // Obtiene todas las jugadas del juego
    var getGameplays = function(){
        $http.get(serverURL + 'api/Games/' + $scope.gamedata.id + '/gamePlays')
          .success(function(data){
              $scope.all_gameplays = data;
              console.log(data)
          })
          .error(function(data){
              console.log('Error: '+ data);
          });
    };

    // Actualiza los datos del juego, al momento de iniciar a jugar.
    var updateGameData = function() {
      var deferred = $q.defer();  // Me permite saber si actualizamos los satisfactoriamente
      $http.get(serverURL + 'api/Games/' + $scope.gamedata.id)
        .success(function(data){
            $scope.gamedata = data;
            console.log(data)
            return deferred.resolve();
        })
        .error(function(data){
            console.log('Error: '+ data);
            return deferred.reject('No se pudieron actualizar los datos del juego');
        });

        return deferred.promise;
    };

    // Actualiza los datos del jugador actual acorde al servidor.

    var updateMydata = function(id) {
      $http.get(serverURL + 'api/Players/' + id)
        .success(function(data){
            $scope.mydata = data;
        })
        .error(function(data){
            console.log('Error updating my data' + data);
        });
    };

    // Actualiza los datos de juego del jugador contrincante.
    var updateOponentData = function(id) {
      console.log("buscando al usuario con el id "+ id);
      $http.get(serverURL + 'api/Players/' + id)
        .success(function(data){
            $scope.other_player_data = data;
        })
        .error(function(data){
            console.log("Error updating my oponent's" + data);
        });
    };

    // Actualizamos los datos de ambos jugadores
    var updatePlayers = function() {
      if ($scope.mynumber == 1) {
        updateMydata($scope.gamedata.player1);
        updateOponentData($scope.gamedata.player2);
      } else {
        updateMydata($scope.gamedata.player2);
        updateOponentData($scope.gamedata.player1);
      }
    };

    // Actualizamos el puntaje de juego del jugador actual.
    var updateScore = function(points) {
      $http.put(serverURL + 'api/Players/'+ $scope.playerID, {'score':$scope.mydata.score+points})
          .success(function(data){
              console.log(data)
          })
          .error(function(data){
              console.log('Error: '+ data);
          });
          serverConnection.emit("new_score");
    };

    // Enviamos un nuevo mensaje al chat
    $scope.sendGameplay = function() {
        // Guarda la jugada obtenida desde el input
        $scope.jugada = this.jugada;
        $http.post(serverURL + 'api/Games/' +  $scope.gamedata.id + '/gamePlays',{
          'text'   : $scope.jugada,
          'gameId' : $scope.gamedata.id,
          'from'   : $scope.user._id
      })
          .success(function(data) {
              console.log('Mensaje que enviare es: ' + $scope.jugada);
              // refrescamos los mensajes
              updateScore(10);
              getGameplays();
              serverConnection.emit('message',$scope.jugada);
              console.log("Se envió al juego con ID: " + $scope.gamedata.id);
              console.log('El mensaje enviado fue:' + data.text);
              $scope.jugada = '';
          })
          .error(function(data){
              console.log('Error: ' + data);
              console.log("NO se envió al juego con ID: " + $scope.gamedata.id);
          });
    };

    // Iniciamos el proceso de multijugaor
    // searchGames solo se ejecuta si el usuario se registro en el servidor satisfactoriamente.

    registerUser().then(function() {
        searchGames();
    }, function(reason) {
        console.log(reason);
    });

    getGameplays();

});
