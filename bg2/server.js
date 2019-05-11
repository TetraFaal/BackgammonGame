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


let con = mysql.createConnection({
	host: "10.194.69.15",
	user: "A2",
	password: "08DeFYaH16z75hVx",
	database: "A2"
});

con.connect(function(err){
	if (err) throw err;
	console.log('Connected to database ! \n');
});


let p1_pos = ['','','','','','','','','','','','','','','','','','','','','','','','','',''];
let p2_pos = ['','','','','','','','','','','','','','','','','','','','','','','','','',''];
let p1Name = 'Joueur 1';
let p2Name = 'Joueur 2';
let p1Ready = '';
let p2Ready = '';
let dice1Value = '';
let dice2Value = '';

io.on('connection', socket => {
  let username = '';
  let playedDice = 0;
  let hasPlayed = false;
  let victory = false;
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
    socket.emit('loginStatus', true)
    //On login, server sends the actual situation to the new-coming user
    socket.emit('updatePos', [p1_pos,p2_pos])
    socket.emit('updatePlayer1', [p1Name, p1Ready])
    socket.emit('updatePlayer2', [p2Name, p2Ready])
    socket.emit('diceValues', [dice1Value,dice2Value]);

    con.query("SELECT name FROM players WHERE name=?", [username],function(err,rows){
      console.log("\n>>> [mysql error] :",err)
      if(!err){
        if(rows && rows.length){
          console.log(username, "is now connected, user already exists in db")
        }
        else{
          con.query("INSERT INTO players(name) VALUES (?)",[username], function(err2, rows){
            console.log("\n>>> [mysql error] :", err2)
            console.log(username, "is now connected, user succesfully added to database")
          });
        }
      }
    });

  });

  socket.on('startNewGame', data => {
    let playerNo = data
    //const p1_pos_init = [0,0,0,0,0,0,5,0,3,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,2,0]; //Start position of p1 
    //const p2_pos_init = [0,2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; //start position of p2
    const p1_pos_init = [14,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    const p2_pos_init = [0,2,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,3,0,5,0,0,0,0,0,0]; 
    p1_pos = p1_pos_init;
    p2_pos = p2_pos_init;


    getRunningGames(function(rows1){
      getRunningGames(function(rows1){
        if(rows1 != "no"){
          p1_pos = rows1[1]
          p2_pos = rows1[2]
          playerNo = rows1[7]

          points_p1 = 0
          points_p2 = 0
          // dice1Value = rows1[]
          // dice2Value = rows[]
          // playerNo = rows1[]
          
        }
        else{
          con.query("INSERT INTO running_games(pos_p1, pos_p2, points_p1, points_p2, dice1, dice2, player_turn, hub, player1, player2) VALUES(?, ?, 0, 0, 0, 0, ?, 0, (SELECT id FROM players WHERE name=?), (SELECT id FROM players WHERE name=?))", [JSON.stringify(p1_pos),JSON.stringify(p2_pos),playerNo,p1Name, p2Name], function(err,rows){
            console.log("\n>>> [mysql error] :", err)
          });
        }
      });
    });
   
    console.log(p1_pos)
    io.sockets.emit('newGamePos', [p1_pos,p2_pos]);
    io.sockets.emit('nextTurn', playerNo)
  });

  // Called when the player wants to move a pawn
  socket.on('movePawn', data => {
    const index = data[0];
    const diceValue = data[1];
    const diceNo = data[2];
    const playerNo = data[3];

    /*
    index : the index number of the pawn place
    diceValue : the value of the played dice
    diceNo : the dice number (1 or 2)
    playerNo : the player number (1 or 2)
    */
    console.log("Place", index, "moved by", diceValue, "by player", playerNo)

    let newPos = move(playerNo, p1_pos, p2_pos, index, diceValue, socket);
    p1_pos = newPos.p1_pos;
    p2_pos = newPos.p2_pos;
    hasPlayed = newPos.hasPlayed;
    victory = newPos.victory;
    io.sockets.emit('updatePos', [p1_pos,p2_pos])
    if(victory) {
      io.sockets.emit('victory', playerNo)

      let id_
      let player1_
      let player2_
      let timestamp_
      let score1_
      let score_2_
      if(playerNo == 1){
        score1_ = 1
        score2_ = 0
      }
      else if(playerNo == 2){
        score1_ = 0
        score2_ = 1
      }
      getRunningGames(function(rows1){
        // A REMPLIR
          // id_ = rows1[]
          // player1_ = rows1[]
          // player2_ = rows1[]
          // timestamp_ = rows1[]
      });
      
      con.query("INSERT INTO played_game(id,player1,player2, score1,score2, timestamp) VALUES (?,?,?,?,?,?)", [id_, player1_, player2_, score1_, score2_, timestamp_],function(err,rows){
      console.log("Data inserted !");
      if(err) console.log("\n>>> [mysql error] :", err);
   });
  

    }

    if(hasPlayed) {
      io.sockets.emit('dicePlayed', diceNo)
      if(playedDice == 1) {
        io.sockets.emit('nextTurn', playerNo) //emits the player that finished the turn
        playedDice = 0
      }
      else {
        playedDice ++
      }
    }    
  });

  //Called when the player throws the dices
  socket.on('throwDice', () => {
    dice1Value = throwDice();
    dice2Value = throwDice();
    io.sockets.emit('diceValues', [dice1Value,dice2Value] );
  });

  //Called when users choose their "seat" (player1 or player2)
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
    socket.emit('canLeave', true) 
  });

  socket.on('leave', data => {
    if (data == 1) {
      p1Name = "Joueur 1";
      p1Ready = false;
      console.log("Player 1 left")
      io.sockets.emit('updatePlayer1', [p1Name, p1Ready])
    }
    else if (data == 2) {
      p2Name = "Joueur 2";
      p2Ready = false;
      console.log("Player 2 left");
      io.sockets.emit('updatePlayer2', [p2Name, p2Ready])
    }
    else console.log("Problem with the player") 
    socket.emit('canLeave', false)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected')


    con.query("UPDATE running_games SET pos_p1=?, pos_p2=?, points_p1=?, points_p2=?, dice1=?, dice2=?, player_turn=?, hub=?, player1=?, player2=?) WHERE ((player1=(SELECT id FROM players WHERE name=?) and player2=(SELECT id FROM players WHERE name=?)) OR (player2=(SELECT id FROM players WHERE name=?) and player1=(SELECT id FROM players WHERE name=?)) ", [JSON.stringify(p1_pos),JSON.stringify(p2_pos),0,0, dice1Value, dice2Value, playerNo, 0, p1Name, p2Name, p1Name, p2Name, p1Name, p2Name], function(err,rows){
      console.log("\n>>> [mysql error] :", err)

    
      //vider joueur
    });    
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('Closing http server.')
  server.close(() => {
    console.log('Http server closed.')
  })
})

getRunningGames = function(callback) {
  con.connect()

  con.query("SELECT * FROM running_games WHERE ((player1=(SELECT id FROM players WHERE name=?) and player2=(SELECT id FROM players WHERE name=?)) OR (player2=(SELECT id FROM players WHERE name=?) and player1=(SELECT id FROM players WHERE name=?))", [p1Name, p2Name, p1Name, p2Name], function(err1, rows1){
    if (err1){
      console.log("\n>>> [mysql error-Select] :", err1)
    }
    else{
      if(rows1 && rows1.length){
        callback(rows1);
      }
      else{callback("no")}
      
    }
  });


  con.end()
}


function throwDice(){
  return (Math.floor(Math.random() * 6)) + 1; //return number between 0 and 5 we add 1 to make it from 1 to 6
}

function move(player, newP1_pos, newP2_pos, position, diceValue, socket){ 

  let pawnSum = 0;
  let canPlay = false;
  let hasPlayed = false;

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
    console.log("pas de move")
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
        console.log(pawnSum)
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
          console.log("cannot move here")
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
        console.log("no pawn here")
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
        console.log(pawnSum)
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
          console.log("cannot move here")
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
        console.log("no pawn here")
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
  else if(newP2_pos[25==15 && player == 2]) victory = true
  else victory = false

	return {
    p1_pos: newP1_pos,
    p2_pos: newP2_pos,
    hasPlayed: hasPlayed,
    victory: victory
  }
}