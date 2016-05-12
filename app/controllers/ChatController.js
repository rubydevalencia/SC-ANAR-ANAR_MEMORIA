'use strict';

app.controller('ChatController', function($scope, $http) {
  $scope.jugada = '';
  $scope.all_messages = [];


    // CONEXION CON EL SERVIDOR
    var connectSocket = function(){

        //Creating connection with server
        var socket = io.connect('http://0.0.0.0:3000/');
        socket.on('connect', function () {

          //Escuchamos a que el servidor envie el evento update
          socket.on('update',function(){
            console.log('Me dijeron que me actualizara');
            getMessages();
          });

        });

      return socket;
    };

    // Nos conectamos al servidor via socket. serverConnection contiene el socket a usar.
    var serverConnection = connectSocket();

    // PARA UNIR A UN JUGADOR AL JUEGO
    var registerUser = function() {
      $http.post('http://0.0.0.0:3000/api/players', {
              'username' : $scope.user._id,
              'category' : 'Principiante'
          })
          .success(function(data){
              $scope.playerID = data.id;
              console.log(data)
          })
          .error(function(data){
              console.log('Error: '+ data);
          });
      };

      // Para unir a un usuario a un juego
      var joinGame = function(gameID, playerID) {
        $http.put('http://0.0.0.0:3000/api/players/'+ playerID, {'gameId':gameID})
            .success(function(data){
                console.log(data)
            })
            .error(function(data){
                console.log('Error: '+ data);
            });
        };

      // Se registra el usuario para jugar
      registerUser();

      // PARA CREAR UN NUEVO JUEGO
      var createGame = function() {
        // dificultad, juego_libre, distribucion del tablero (para despues)
        $http.post('http://0.0.0.0:3000/api/games', {
              'difficulty' : 'easy',
              'is_free'    : true,
              'game_set'   : '--'
        })
        .success(function(data){
            $scope.gameID = data.id;
            // Unimos al jugador al nuevo juego creado
            joinGame($scope.gameID,$scope.playerID);
            console.log(data)
        })
        .error(function(data){
            console.log('Error: '+ data);
        });
      };

      // Busca si hay juegos disponibles, si no, crea uno
      var searchGames = function() {
        $http.get('http://0.0.0.0:3000/api/games')
        .success(function(data){
            if (data.length > 0) {
              $scope.gameID = data[0].id;
              console.log('Estoy ingresando al juego' + data[0].id);
              joinGame($scope.gameID,$scope.playerID);
            } else {
              createGame();
            }
            console.log(data)
        })
        .error(function(data){
            console.log('Error: '+ data);
        });
      };

      searchGames();

      var getMessages = function(){
          $http.get('http://0.0.0.0:3000/api/games/' + $scope.gameID + '/Messages')
            .success(function(data){
                $scope.all_messages = data;
                console.log(data)
            })
            .error(function(data){
                console.log('Error: '+ data);
            });
      };


      // Obtenemos los mensajes del chat
      getMessages();

      // Enviamos un nuevo mensaje al chat
      $scope.sendMessage = function() {
          $http.post('http://0.0.0.0:3000/api/games/' +  $scope.gameID + '/Messages',{
            'text' : '['+$scope.user._id +'] '+ $scope.jugada,
            'gameId' : $scope.gameID,
            'playerId' : $scope.playerId
        })
            .success(function(data) {
                console.log('Mensaje que enviare es: ' + $scope.jugada);
                // refrescamos los mensajes
                getMessages();
                serverConnection.emit('message',$scope.jugada);
                console.log("Se envió al juego con ID: " + $scope.gameID);
                console.log('El mensaje enviado fue:' + data.text);
                $scope.jugada = '';
            })
            .error(function(data){
                console.log('Error: ' + data);
                console.log("NO se envió al juego con ID: " + $scope.gameID);
            });
      };

});
