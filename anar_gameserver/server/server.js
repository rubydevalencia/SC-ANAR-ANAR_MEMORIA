var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    //app.start();
    app.io = require('socket.io')(app.start());

    // Escuchamos a conexiones entrantes
    app.io.on('connection', function(socket){
      console.log('Un usuario se conecto');

      // El usuario se desconecta
      socket.on('disconnect', function(){
          console.log('Un usuario se desconecto');
      });

      // El socket recibe un mensaje, y le dice a los clientes que se actualicen
      socket.on('message', function(message){
          console.log('Mensaje recibido:' + message);
          app.io.sockets.emit("update");
      });

      socket.on('players_ready',function() {
          console.log('Los jugadores estan listos.');
          app.io.sockets.emit('start_game');
      });

    });
});
