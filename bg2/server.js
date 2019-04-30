const mysql = require('mysql')
const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const session = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true
});
const sharedsession = require("express-socket.io-session");

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);
const io = socketIO(server);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session);

io.use(sharedsession(session, {
  autoSave: true
}));

let status = true;
val = 0;

let p1_pos = [0,0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2,0]; //Start position of p1
let p2_pos = [0,2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; //start position of p2

/*
let con = mysql.createConnection({
	host: "10.194.69.15",
	user: "A2",
	password: "08DeFYaH16z75hVx",
	database: "A2"
});

con.connect(function(err){
	if (err) throw err;
	console.log('Connectedto database !');
});
*/

app.get('/api/newGame', (req, res) => {
  res.send( {p1_pos,p2_pos} );
})

app.post('/api/login', (req, res) => {
  console.log(req.body);
  res.send(status);
})

io.on('connection', socket => {
  console.log('User connected')
  socket.on("login", function(userdata) {
    console.log(userdata)
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();
  });
  socket.on("logout", function(userdata) {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
    }
  });
  socket.on('throwDice', () => {
    const dice1Value = throwDice()
    const dice2Value = throwDice()
    io.sockets.emit('diceValues', [dice1Value,dice2Value] );
  })
  socket.on('startNewGame', () => {
    io.sockets.emit('newGamePos', [p1_pos,p2_pos] );
  })
  socket.on('disconnect', () => {
    console.log('User disconnected')
    clearInterval()    
  })
})

server.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('Closing http server.')
  server.close(() => {
    console.log('Http server closed.')
  })
})

function throwDice(){
  return (Math.floor(Math.random() * 6)) + 1; //return number between 0 and 5 we add 1 to make it from 1 to 6
}

function updatePos (positionIndex) {
  let value;
  if(this.rightClick()) {
    value = Math.min(this.props.dice1Value, this.props.dice2Value);
    alert(value,positionIndex);
  }
  else {
    value = Math.max(this.props.dice1Value, this.props.dice2Value);
    alert(value);
  }	
}