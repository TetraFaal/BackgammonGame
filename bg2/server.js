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

io.on('connection', socket => {
  let username = '';
  let p1_pos = [];
  let p2_pos = [];
  let p1Name = '';
  let p2Name = '';
  let p1Ready = '';
  let p2Ready = '';

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

  socket.on('username', data => {
    username = data[0];
    console.log(username, 'is now connected')
    socket.emit('loginStatus', true)
  });

  socket.on('startNewGame', () => {
    const p1_pos_init = [0,0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2,0]; //Start position of p1
    const p2_pos_init = [0,2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; //start position of p2
    p1_pos = p1_pos_init;
    p2_pos = p2_pos_init;
    console.log("New Game ",p1_pos)
    console.log("New game ",p2_pos)
    io.sockets.emit('newGamePos', [p1_pos,p2_pos]);
  });

  socket.on('movePawn', data => {
    const index = data[0];
    const diceValue = data[1];
    const playerNo = data[2];
    console.log("Place", index, "moved by", diceValue, "by player", playerNo)
    let newPos = move(playerNo, p1_pos, p2_pos, index, diceValue);
    p1_pos = newPos.p1_pos;
    p2_pos = newPos.p2_pos;
    console.log(p1_pos)
    console.log(p2_pos)
    io.sockets.emit('updatePos', [p1_pos,p2_pos])
  });

  socket.on('throwDice', () => {
    const dice1Value = throwDice();
    const dice2Value = throwDice();
    io.sockets.emit('diceValues', [dice1Value,dice2Value] );
  });

  socket.on('choosePlayer', data => {
    if (data[2] == 1) {
      p1Name = data[0];
      p1Ready = data[1];
      console.log('Player 1 :',p1Name,' status is ', p1Ready);
      io.sockets.emit('updatePlayer1', [p1Name, p1Ready])
    }
    else if (data[2] == 2) {
      p2Name = data[0];
      p2Ready = data[1];
      console.log('Player 2 :',p2Name,' status is ', p2Ready);
      io.sockets.emit('updatePlayer2', [p2Name, p2Ready])
    }
    else console.log("Problem with the player")  
  });

  socket.on('disconnect', () => {
    console.log('User disconnected')
  });
});

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

function move(player, newP1_pos, newP2_pos, position, diceValue){ 
	//if p1 : player = 1, if p2 : player = 2
	//newP1_pos position of player1
	//newP2_pos potion of player2
	//position is the actual position of the pawn (integer)
	//numberDice is the number of the dice

  let canPlay = false;

	//verification that there is at least one possible move
	if (player===1) {
		for(i = 1; i++; i < 26){
      //if there is a pawn && The movement is not out of the board &&	The movement leads to an equal or less than 1 opponent pawn -> then p1 can play
      if((newP1_pos[i] >= 1) && (i - diceValue > 0) && (newP2_pos[i - diceValue] <= 1)) {
        canPlay = true;
        break;
      }
    }
  }
  else if (player===2) {
		for(i = 0; i++; i < 25){
      //if there is a pawn && The movement is not out of the board &&	The movement leads to an equal or less than 1 opponent pawn -> then p2 can play
      if((newP2_pos[i] >= 1) && (i + diceValue < 25) && (newP1_pos[i + diceValue] <= 1)) {
        canPlay = true;
        break;
      }
		}
  }
  else console.log("There is a problem with the player");

	if(!canPlay){
    console.log("pas de move")
		io.sockets.emit('message', "Pas de mouvements possibles" );
		return {
      p1_pos: newP1_pos,
      p2_pos: newP2_pos
    };
  }
  else {
    if(player===1){ //for p1
      if(newP1_pos[position] > 0) {
        if(position-diceValue <= 0){ //case where the pawn goes out of the board (it may have omponent pawn too)
          newP1_pos[position] -= 1;
          newP1_pos[0] += 1;
        }
        else{
          if(newP2_pos[position-diceValue] <= 1){
            if(newP2_pos[position-diceValue] == 1){	//If there is one pawn at the next pos
              newP2_pos[position-diceValue] -= 1; 	//Delete this one
              newP2_pos[0] += 1;	//add him to the pos 0
            }
            newP1_pos[position] -= 1;					//-1 at the actual position
            newP1_pos[position-diceValue] += 1;		//+1 at the next position
          }
          else { 
            console.log("cannot move HERE")
            return {
              p1_pos: newP1_pos,
              p2_pos: newP2_pos
            };
          }
        }
      }
      else {
        console.log("no pawn HERE")
        return {
          p1_pos: newP1_pos,
          p2_pos: newP2_pos
        };
      }
    }
    else if(player===2){ //Same for p2
      if(newP1_pos[position] > 0) {
        if(position+diceValue >= 25){ //case where the pawn goes out of the board (it may have omponent pawn too)
          newP2_pos[position] -= 1;
          newP2_pos[25] += 1;
        }
        else{
          if(newP1_pos[position+diceValue] <=1){
            if(newP1_pos[position+diceValue] == 1){
              newP1_pos[position+diceValue] -= 1;
              newP1_pos[25] += 1;
            }
            newP2_pos[position] -=1;
            newP2_pos[position+diceValue] += 1;
          }
          else { 
            console.log("cannot move HERE")
            return {
              p1_pos: newP1_pos,
              p2_pos: newP2_pos
            };
          }
        }
      }
      else {
        console.log("no pawn HERE")
        return {
          p1_pos: newP1_pos,
          p2_pos: newP2_pos
        };
      }
    }
    else {
      console.log("There is a problem with the player");
      return {
        p1_pos: newP1_pos,
        p2_pos: newP2_pos
      };
    }
  }
	return {
    p1_pos: newP1_pos,
    p2_pos: newP2_pos
  }
}