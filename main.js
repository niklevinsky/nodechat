var http = require('http'),
  fs = require('fs'),
  sanitize = require('validator');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || 'localhost'

var app = http.createServer(function (request, response) {
  fs.readFile('client.html', 'utf-8', function (error, data){
    if (error != null)
    {
      response.writeHead(500, {'Content-Type': 'text/html'});
      response.write(error);
    }
    else
    {
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.write(data);
    }
    response.end();
  });
}).listen(server_port, server_ip_address);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
  socket.on('message_to_server', function(data) {
    var escaped_message = sanitize.escape(data["message"]);
    var escaped_username = sanitize.escape(data["username"]);
    io.sockets.emit('message_to_client', { message : escaped_message, username : escaped_username });
  });
});

