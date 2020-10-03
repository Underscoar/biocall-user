const { Server } = require('node-osc'); // The OSC server for receiving eSense data
const net = require('net'); // The net server for receiving Facereader data

const host = '127.0.0.1';
const oscPort = 4559;
const faceReaderPort = 8052;


var socket;
function connectToSocket() {
  let serverAddress = document.getElementById('select-server').value;
  let room = document.getElementById('select-room').value;

  socket = io(serverAddress, {
    reconnection: false
  });
  socket.on('connect', () => {
    socket.emit('roomRequest', room + '-data');

    document.getElementById('select-server').disabled=true;
    document.getElementById('select-room').disabled=true;
    document.getElementById('connect-socket').classList.add('connect-to-disconnect');

    document.getElementById('connect-status').innerHTML='Connected to room <span>' + room + '</span> on <span>' + serverAddress + '<span>';
    document.getElementById('connect-socket').innerHTML='Disconnect';
    document.getElementById('connect-socket').setAttribute('onClick', 'disconnectFromSocket()');
  });

  socket.on('message', (msg) => {
    console.log(msg);
  });

  socket.on('disconnect', () => {
    document.getElementById('select-server').disabled=false;
    document.getElementById('select-room').disabled=false;
    document.getElementById('connect-socket').classList.remove('connect-to-disconnect');
    document.getElementById('connect-socket').innerHTML='Connect';

    document.getElementById('connect-status').innerHTML='Currently not connected to server';
    document.getElementById('connect-socket').setAttribute('onClick', 'connectToSocket()');
  });
}

function disconnectFromSocket() {
  socket.close();

  document.getElementById('select-server').disabled=false;
  document.getElementById('select-room').disabled=false;
  document.getElementById('connect-socket').classList.remove('connect-to-disconnect');

  document.getElementById('connect-status').innerHTML='Currently not connected to server';
  document.getElementById('connect-socket').setAttribute('onClick', 'connectToSocket()');
}





  var oscServer = new Server(oscPort, host);
  console.log('Listening for OSC data on port ' + oscPort);
  oscServer.on('message', function (msg) {
    if (msg[0] != '/time') {
      console.log(msg);
      document.getElementById('gsr-value').innerHTML=msg[1];
      if (socket) {
        socket.emit('eSenseData', msg[1]);
      }
    }
  });


  var faceReaderClient = null;
  var faceReaderIndex = 0;

  function connectToFaceReader(x) {
    if (faceReaderClient != null) {
      faceReaderClient.destroy();
      faceReaderClient = null;
    }
    document.getElementById('facereader-status').innerHTML="Facereader status: Connecting";
    document.getElementById('start-facereader').innerHTML="Connecting to FacereaderClient on port 8052";
    document.getElementById('start-facereader').disabled=true;
    faceReaderClient = new net.Socket();
    faceReaderClient.connect(faceReaderPort, host, function() {
      console.log('Connection to FaceReader client opened successfully! Listening for FaceReader data on port ' + faceReaderPort);
      document.getElementById('facereader-status').innerHTML="Facereader status: Connected!";
      document.getElementById('start-facereader').innerHTML="Connected to FacereaderClient on port 8052";
    });

    faceReaderClient.on('error', function(err) {
      faceReaderClient.destroy();
      faceReaderClient = null;
      console.log("ERROR: Connection could not be openend/reset. Msg: %s", err.message + ' -> trying again');
      let triedAmount=x+1;
      if (triedAmount < 2) {
        setTimeout(connectToFaceReader, 200, triedAmount);
      }
      else {
        document.getElementById('facereader-status').innerHTML="Facereader status: Could not connect";
        document.getElementById('start-facereader').innerHTML="Connect to FacereaderClient on port 8052";
        document.getElementById('start-facereader').disabled=false;
      }
    });

    faceReaderClient.on('data', function(data) {
      console.log("Received: %s", data);
      if (socket) {
        faceReaderIndex++;
        if (faceReaderIndex == 5) {
          socket.emit('faceReaderData', JSON.parse(data));
          faceReaderIndex=0;
        }
      }
    });
  }
