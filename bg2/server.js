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
var moment = require('moment');
var momentDurationFormatSetup = require("moment-duration-format");
momentDurationFormatSetup(moment);

//Stuff needed for express/sockets/sessions
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session);

const server = http.createServer(app);

const io = socketIO(server);
io.use(sharedsession(session, {
  autoSave: true
}));

//Database connection params
let con = mysql.createConnection({
	host: "10.194.69.15",
	user: "A2",
	password: "08DeFYaH16z75hVx",
	database: "A2"
});

con.connect(function(err){
	if (err) throw err;
	console.log('Connected to database !');
});

//Initializing the variables
function GameData(p1_pos, p2_pos, p1Name, p2Name, p1Ready, p2Ready, dice1Value, dice2Value, playerTurn, gameIsRunning, victory, roomNo) {
  this.p1_pos = p1_pos;
  this.p2_pos = p2_pos;
  this.p1Name = p1Name;
  this.p2Name = p2Name;
  this.p1Ready = p1Ready;
  this.p2Ready = p2Ready;
  this.dice1Value = dice1Value;
  this.dice2Value = dice2Value;
  this.playerTurn = playerTurn;
  this.gameIsRunning = gameIsRunning;
  this.victory = victory;
  this.roomNo = roomNo;
}
let room1Data = new GameData(['','','','','','','','','','','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','','','','','','','','','','',''],'Joueur 1','Joueur 2','','',null,null,0,false,false,1);
let room2Data = new GameData(['','','','','','','','','','','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','','','','','','','','','','',''],'Joueur 1','Joueur 2','','',null,null,0,false,false,2);
let room3Data = new GameData(['','','','','','','','','','','','','','','','','','','','','','','','','',''],['','','','','','','','','','','','','','','','','','','','','','','','','',''],'Joueur 1','Joueur 2','','',null,null,0,false,false,3);
let rooms = [room1Data, room2Data, room3Data];

//Where the action starts --> called when a user connects to the server
io.on('connection', socket => {
  let username = ''; //username of the user
  let playedDice = 0; //number of dice that the user played
  let playerNo = 0; //number of the player (1 or 2)
  let hasPlayed = false; //true if the user has played, otherwise false
  let room = null;
  let roomData = null;
  
  console.log('\nUser connected')

  //Called when user logs in
  socket.on("login", function(userdata) {
    console.log(userdata)
    socket.handshake.session.userdata = userdata;
    socket.handshake.session.save();
  });

  //Called when user logs out
  socket.on("logout", function(userdata) {
    if (socket.handshake.session.userdata) {
      delete socket.handshake.session.userdata;
      socket.handshake.session.save();
    }
  });

  //Called when user logs in with username
  socket.on('username', data => {
    username = data;
    socket.emit('loginStatus', true)

    //Check if the user is already in the database
    con.query("SELECT name FROM players WHERE name=?", [username],function(err,rows){
      if(err) console.log("\n>>> [mysql error] :",err);
      if(!err){
        if(rows && rows.length){
          console.log(username, "is now connected, user already exists in db")
        }
        else{
          con.query("INSERT INTO players(name) VALUES (?)",[username], function(err2, rows){
            if(err2) console.log("\n>>> [mysql error] :", err2);
            console.log(username, "is now connected, user added to database succesfully")
          });
        }
      }
    });

  });

  //Called when user enters a room
  socket.on('selectRoom', data => {
    room = data
    socket.join(room)
    roomData = rooms[room-1]
    console.log(username + " joined the room number " + roomData.roomNo)
    //On login, server sends the actual situation to the new-coming user
    socket.emit('updatePos', [roomData.p1_pos,roomData.p2_pos])
    socket.emit('updatePlayer1', [roomData.p1Name, roomData.p1Ready])
    socket.emit('updatePlayer2', [roomData.p2Name, roomData.p2Ready])
    socket.emit('diceValues', [roomData.dice1Value,roomData.dice2Value]);
    socket.emit('canLeaveRoom', true)
  });

  //Called when user chooses its "seat" (player1 or player2)
  socket.on('choosePlayer', data => {
    playerNo = data[2]
    if (playerNo == 1) {
      roomData.p1Name = data[0];
      roomData.p1Ready = data[1];
      console.log('Player 1 :',roomData.p1Name,' status is ', roomData.p1Ready);
      io.to(room).emit('updatePlayer1', [roomData.p1Name, roomData.p1Ready])
    }
    else if (playerNo == 2) {
      roomData.p2Name = data[0];
      roomData.p2Ready = data[1];
      console.log('Player 2 :',roomData.p2Name,' status is ', roomData.p2Ready);
      io.to(room).emit('updatePlayer2', [roomData.p2Name, roomData.p2Ready])
    }
    else console.log("Problem with the player") 
    getRunningGames(roomData.p1Name, roomData.p2Name, function(rows1){
      if(rows1 != "no") {
        io.to(room).emit('runningGame', true)
      }
      else io.to(room).emit('runningGame', false)
    });
    socket.emit('canLeave', true)
  });

  //Called when user starts a new game
  socket.on('startNewGame', data => {    
    io.to(room).emit('runningGame', false)

    roomData.gameIsRunning = true;
    console.log("GameRunning" + roomData.gameIsRunning)

    const p1_pos_init = [14,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //Start position of p1 
    const p2_pos_init = [0,0,0,2,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; //start position of p2
    roomData.p1_pos = p1_pos_init;
    roomData.p2_pos = p2_pos_init;
    roomData.dice1Value = null;
    roomData.dice2Value = null;
    roomData.playerTurn = data;

    con.query("DELETE FROM running_games WHERE (player1=(SELECT id FROM players WHERE name=?) and player2=(SELECT id FROM players WHERE name=?))", [roomData.p1Name, roomData.p2Name, roomData.p1Name, roomData.p2Name], function(err){
      if(err) console.log("\n>>> [mysql error] :", err);
    });
    con.query("INSERT INTO running_games(pos_p1, pos_p2, points_p1, points_p2, dice1, dice2, player_turn, hub, player1, player2) VALUES(?, ?, 0, 0, ?, ?, ?, 0, (SELECT id FROM players WHERE name=?), (SELECT id FROM players WHERE name=?))", [JSON.stringify(roomData.p1_pos),JSON.stringify(roomData.p2_pos),roomData.dice1Value, roomData.dice2Value, roomData.playerTurn,roomData.p1Name, roomData.p2Name], function(err){
      if (err) console.log("\n>>> [mysql error] :", err);
    });

    io.to(room).emit('updatePos', [roomData.p1_pos,roomData.p2_pos]);
    io.to(room).emit('diceValues', [roomData.dice1Value,roomData.dice2Value]);
    io.to(room).emit('nextTurn', roomData.playerTurn);
  });

  //Called when user continue running game
  socket.on('continueGame', () => {
    io.to(room).emit('runningGame', false)

    roomData.gameIsRunning = true;
    console.log("GameRunning" + roomData.gameIsRunning)

    getRunningGames(roomData.p1Name, roomData.p2Name, function(rows1){
      if(rows1 != "no") {
        roomData.p1_pos = JSON.parse(rows1[0].pos_p1);
        roomData.p2_pos = JSON.parse(rows1[0].pos_p2);
        roomData.playerTurn = rows1[0].player_turn;
        points_p1 = 0;
        points_p2 = 0;
        roomData.dice1Value = rows1[0].dice1;
        roomData.dice2Value = rows1[0].dice2;
               
        io.to(room).emit('updatePos', [roomData.p1_pos,roomData.p2_pos]);
        io.to(room).emit('diceValues', [roomData.dice1Value,roomData.dice2Value]);
        io.to(room).emit('nextTurn', roomData.playerTurn);
      }
    });
  });

  //Called when the player throws the dices
  socket.on('throwDice', () => {
    roomData.dice1Value = throwDice();
    roomData.dice2Value = throwDice();
    io.to(room).emit('diceValues', [roomData.dice1Value,roomData.dice2Value] );
  });

  // Called when the player wants to move a pawn
  socket.on('movePawn', data => {
    const index = data[0];
    const diceValue = data[1];
    const diceNo = data[2];
    /*
    index : the index number of the pawn place
    diceValue : the value of the played dice
    diceNo : the dice number (1 or 2)
    playerNo : the player number (1 or 2)
    */
    
    let newPos = move(playerNo, roomData.p1_pos, roomData.p2_pos, index, diceValue, socket);
    
    roomData.p1_pos = newPos.p1_pos;
    roomData.p2_pos = newPos.p2_pos;
    io.to(room).emit('updatePos', [roomData.p1_pos,roomData.p2_pos])

    hasPlayed = newPos.hasPlayed;
    if(hasPlayed) {
      if(diceNo == 1) {
        roomData.dice1Value = null;
        io.to(room).emit('diceValues', [roomData.dice1Value, roomData.dice2Value]);
      }
      else if(diceNo == 2) {
        roomData.dice2Value = null;
        io.to(room).emit('diceValues', [roomData.dice1Value, roomData.dice2Value]);
      }
      if(playedDice == 1) {
        if(playerNo == 1) {
          roomData.playerTurn = 2
          io.to(room).emit('nextTurn', roomData.playerTurn)
        }
        else if(playerNo == 2) {
          roomData.playerTurn = 1
          io.to(room).emit('nextTurn', roomData.playerTurn)
        }
        playedDice = 0
      }
      else {
        playedDice ++
      }
    }
    
    roomData.victory = newPos.victory;
    if(roomData.victory) {
      let id_
      let player1_
      let player2_
      let timestamp_
      let score1_
      let score2_
      let playingTime_

      if(playerNo == 1){
        score1_ = 1
        score2_ = 0
      }
      else if(playerNo == 2){
        score1_ = 0
        score2_ = 1
      }
      getRunningGames(roomData.p1Name, roomData.p2Name, function(rows1){
        id_ = rows1[0].id
        player1_ = rows1[0].player1
        player2_ = rows1[0].player2
        timestamp_ = rows1[0].timestamp
        // Calculate and display playing time in h:m:s format, needs some conversions, using momentJS & momentDurationFormat librairies
        let startTime = rows1[0].timestamp
        startTime.toISOString()
        let endTime = new Date
        endTime.toISOString()
        playingTime_ = moment.utc(moment(endTime,"DD/MM/YYYY HH:mm:ss").diff(moment(startTime,"DD/MM/YYYY HH:mm:ss"))).format("HH:mm:ss")
        
        //Update database (removing game from "running_games" and adding it "played_games")
        con.query("INSERT INTO played_game(id, player1, player2, score1, score2, date, length) VALUES (?,?,?,?,?,?,?)", [id_, player1_, player2_, score1_, score2_, timestamp_, playingTime_],function(err,rows){
          console.log("Data inserted !");
          if(err) console.log("\n>>> [mysql error] :", err);
          else {
            if(playerNo == 1){
              con.query("UPDATE players SET win= win + 1, games=games +1 WHERE id=? ", [player1_], function(err, rows){
                if(err) console.log("\n>>> [mysql error] :", err);  
              })
              con.query("UPDATE players SET games=games +1 WHERE id=? ", [player2_], function(err, rows){
                if(err) console.log("\n>>> [mysql error] :", err);  
              })
            }
            else if(playerNo == 2){
              con.query("UPDATE players SET win= win + 1, games=games + 1 WHERE id=? ", [player2_], function(err, rows){
                if(err) console.log("\n>>> [mysql error] :", err);  
              })
              con.query("UPDATE players SET games= games + 1 WHERE id=? ", [player1_], function(err, rows){
                if(err) console.log("\n>>> [mysql error] :", err);  
              })
            }
          }
        });
        con.query("DELETE FROM running_games WHERE id=?", [id_], function(err1, rows1){
          if(err1) console.log("\n>>> [mysql error] :", err1);
        });        
        roomData.gameIsRunning = false;
        roomData.dice1Value = null;
        roomData.dice2Value = null;
        io.to(room).emit('diceValues', [roomData.dice1Value,roomData.dice2Value])
        roomData.playerTurn = -1;
        io.to(room).emit('nextTurn', roomData.playerTurn)
        //Sending data to players
        io.to(room).emit('summary', [id_,roomData.p1Name,roomData.p2Name, playingTime_, score1_, score2_])
      });
    }
    
  });

  //Called when user clicks on statistics
  socket.on('getStats', () => {
    con.query("SELECT * FROM players", (err,results) => {
      if(err) throw err;
      for(i=0;i<results.length; i++){
        //Calculate the win rate in % for each player
        results[i].rate = (results[i].win/results[i].games*100) 
      }
			socket.emit('stats', results);
    });
  })

  //Called when user leavs its "seat"
  socket.on('leave', data => {
    idFromName(roomData.p1Name, function(id){
      let idtempo_ = id
      idFromName(roomData.p2Name, function(id){
        let id2tempo_ = id
          register(roomData, data, idtempo_, id2tempo_, function(ok){});
      });
    });
    socket.emit('canLeave', false)
  });

  //Called when user leavs the room
  socket.on('leaveRoom', data => {
    if(playerNo == 1 || playerNo == 2) {
      idFromName(roomData.p1Name, function(id){
        let idtempo_ = id
        idFromName(roomData.p2Name, function(id){
          let id2tempo_ = id
            register(roomData, data, idtempo_, id2tempo_, function(ok){
              if(ok == "ok") {
                console.log(username + " left the room number " + roomData.roomNo)
                socket.leave(room);
                room = null;
                roomData = null;
              }
            });
        });
      });
    }
    socket.emit('canLeaveRoom', false)
  });

  socket.on('disconnect', () => {
    if(room != null) {
      if (playerNo == 1 || playerNo == 2) {
        idFromName(roomData.p1Name, function(id){
          let idtempo_ = id
          idFromName(roomData.p2Name, function(id){
            let id2tempo_ = id
            register(roomData, playerNo, idtempo_, id2tempo_, function(ok){
              if(ok == "ok") {
                socket.leave(room);
                room = null;
                roomData = null;
              }
            });
          });
        });
      }
    }
    console.log('User disconnected')
  });
});

server.listen(port, "0.0.0.0", () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('Closing http server.')
  server.close(() => {
    console.log('Http server closed.')
  })
})

register = function(roomData, playerNo, idtempo_, id2tempo_, callback){
  if(roomData.gameIsRunning) {
    con.query("UPDATE running_games SET pos_p1=?, pos_p2=?, points_p1=?, points_p2=?, dice1=?, dice2=?, player_turn=?, hub=? WHERE (player1=? and player2=?)", [JSON.stringify(roomData.p1_pos),JSON.stringify(roomData.p2_pos),0,0, roomData.dice1Value, roomData.dice2Value, roomData.playerTurn, 0, idtempo_, id2tempo_], function(err){
      if (err) console.log("\n>>> [mysql error] :", err);
    });
    console.log("Database updated");
    roomData.gameIsRunning = false;
  }

  roomData.dice1Value = null;
  roomData.dice2Value = null;
  io.to(roomData.roomNo).emit('diceValues', [roomData.dice1Value,roomData.dice2Value])
  roomData.playerTurn = -1;
  io.to(roomData.roomNo).emit('nextTurn', roomData.playerTurn)
  
  if (playerNo == 1) {
    roomData.p1Name = 'Joueur 1';
    roomData.p1Ready = false;
    io.to(roomData.roomNo).emit('updatePlayer1', [roomData.p1Name, roomData.p1Ready]);
    console.log("Player 1 left");
  }
  else if (playerNo == 2) {   
    roomData.p2Name = 'Joueur 2';
    roomData.p2Ready = false;
    io.to(roomData.roomNo).emit('updatePlayer2', [roomData.p2Name, roomData.p2Ready]);
    console.log("Player 2 left");
  }
  else console.log("Problem with the player");

  playerNo = 0;
  callback("ok");
}

getRunningGames = function(p1Name, p2Name, callback) {
  idFromName(p1Name, function(id){
    let idtempo_ = id
    idFromName(p2Name, function(id){
      let id2tempo_ = id
      con.query("SELECT * FROM running_games WHERE (player1=? and player2=?)", [idtempo_, id2tempo_], function(err1, rows1){
        if (err1){
          console.log("\n>>> [mysql error-Select] :", err1)
        }
        if(rows1 && rows1.length){
          callback(rows1);
        }
        else{callback("no")}
      });
    })
  })
}

idFromName = function(name, callback){
  con.query("SELECT id FROM players WHERE name=?", [name], function(err,rows){
    if(err) console.log("\n>>> [mysql error-Select] :", err);
    else{
      if(rows && rows.length){
        callback(rows[0].id)
      }
      else{callback(0)}
    }
  });
}

function throwDice(){
  return (Math.floor(Math.random() * 6)) + 1; //return number between 0 and 5 we add 1 to make it from 1 to 6
}

function move(player, newP1_pos, newP2_pos, position, diceValue, socket){ 

  let pawnSum = 0;
  let canPlay = false;
  let hasPlayed = false;
  let victory = false;

  /*
	if player1 : player = 1, if player2 : player = 2
	newP1_pos : new pawn positions of player1
	newP2_pos : new pawn positions of player2
	position : the actual position(aka index) of the pawn that the player wants to move(integer)
  diceValue : value of the dice chosen by the player
  
  pawnSum : the sum of the pawn in the upper/lower left quarter of the board
  canPlay : true if the player has at least one possible move
  hasPlayed : true if the player could actually move the selected pawn 
  */

  /*
  Verifies that there is at least one possible move
  */
	if (player==1) {
		for(i = 1; i < 26; i++){
      //if there is a pawn & The movement leads to an equal or less than 1 opponent pawn -> then p1 can play
      if(i - diceValue > 0) {
        if((newP1_pos[i] >= 1) && (newP2_pos[i - diceValue] <= 1)) {
          canPlay = true;
          break;
        }
      }
      else {
        canPlay = true;
        break;
      }
    }
  }
  else if (player==2) {
		for(i = 0; i < 25; i++){
      //if there is a pawn & The movement leads to an equal or less than 1 opponent pawn -> then p2 can play
      if(i - diceValue > 0) {
        if( (newP2_pos[i] >= 1) && (newP1_pos[i + diceValue] <= 1) ) {
          canPlay = true;
          break;
        }
      }
      else {
        canPlay = true;
        break;
      }
		}
  }
  else {
    console.log("There is a problem with the player")
    return {
      p1_pos: newP1_pos,
      p2_pos: newP2_pos,
    };
  }

	if(!canPlay){
    socket.emit('message', "Pas de mouvement possible, passe")
    hasPlayed = true
    return {
      p1_pos: newP1_pos,
      p2_pos: newP2_pos,
      hasPlayed: hasPlayed
    };
  }
  else {
    /*
    Moving pawn if player 1
    */
    if(player==1){ //for p1
      if(newP1_pos[position] > 0) { //place must have one pawn
        pawnSum = (newP1_pos[0]+newP1_pos[1]+newP1_pos[2]+newP1_pos[3]+newP1_pos[4]+newP1_pos[5]+newP1_pos[6])
        if(position-diceValue <= 0 && pawnSum ==15){ //case where the pawn goes out of the board (it may have omponent pawn too) -> all the pawns need to be last zone (upper left quarter of the board)
          newP1_pos[position] -= 1;
          newP1_pos[0] += 1;
        }
        else if(position-diceValue > 0 && newP2_pos[position-diceValue] <= 1){
          if(newP2_pos[position-diceValue] == 1){	//If there is one opponent pawn at the next pos
            newP2_pos[position-diceValue] -= 1; 	//Delete this one
            newP2_pos[0] += 1;	//add him to the pos 0
          }
          newP1_pos[position] -= 1;					//-1 at the actual position
          newP1_pos[position-diceValue] += 1;		//+1 at the next position
        }
        else {
          socket.emit('message', "Impossible de déplacer le pion ici")
          hasPlayed = false
          return {
            p1_pos: newP1_pos,
            p2_pos: newP2_pos,
            hasPlayed: hasPlayed
          };
        }
      }
      else {
        socket.emit('message', "Aucun pion à déplacer")
        hasPlayed = false
        return {
          p1_pos: newP1_pos,
          p2_pos: newP2_pos,
          hasPlayed: hasPlayed
        };
      }
    }
    /*
    Same if player 2
    */
    else if(player==2){
      if(newP2_pos[position] > 0) {
        pawnSum = (newP2_pos[25]+newP2_pos[24]+newP2_pos[23]+newP2_pos[22]+newP2_pos[21]+newP2_pos[20]+newP2_pos[19])
        if(position+diceValue >= 25 && pawnSum == 15){ //case where the pawn goes out of the board (it may have omponent pawn too)
          newP2_pos[position] -= 1;
          newP2_pos[25] += 1;
        }
        else if(position+diceValue < 25 && newP1_pos[position+diceValue] <=1){
          if(newP1_pos[position+diceValue] == 1){
            newP1_pos[position+diceValue] -= 1;
            newP1_pos[25] += 1;
          }
          newP2_pos[position] -=1;
          newP2_pos[position+diceValue] += 1;
        }
        else {
          socket.emit('message', "Impossible de déplacer le pion ici")
          hasPlayed = false
          return {
            p1_pos: newP1_pos,
            p2_pos: newP2_pos,
            hasPlayed: hasPlayed
          };
        }
      }
      else {
        socket.emit('message', "Aucun pion à déplacer")
        hasPlayed = false
        return {
          p1_pos: newP1_pos,
          p2_pos: newP2_pos,
          hasPlayed: hasPlayed
        };
      }
    }
    else {
      console.log("There is a problem with the player");
      hasPlayed = false
      return {
        p1_pos: newP1_pos,
        p2_pos: newP2_pos,
        hasPlayed: hasPlayed
      };
    }
  }
  hasPlayed = true
  /*
  Victory check
  */
  if(newP1_pos[0]==15 && player == 1) victory = true
  else if(newP2_pos[25]==15 && player == 2) victory = true
  else victory = false

	return {
    p1_pos: newP1_pos,
    p2_pos: newP2_pos,
    hasPlayed: hasPlayed,
    victory: victory
  }
}