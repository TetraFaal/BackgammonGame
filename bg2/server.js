const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

let dice1Value = 0;
let dice2Value = 0;

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
app.get('/api/main', (req, res) => {
  res.send({ express: 'Backgammon Game' });
});

app.get('/api/newGame', (req, res) => {
  res.send( {p1_pos,p2_pos} );
});


app.post('/api/login', (req, res) => {
  console.log(req.body);
  res.send(
    `Vous êtes connecté avec le pseudo : ${req.body.post}`,
  );
});
app.get('/api/dice', (req, res) => {
  dice1Value = throwDice();
  dice2Value = throwDice();
  res.send( [dice1Value,dice2Value] );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on('SIGTERM', () => {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});



function throwDice(){
  return (Math.floor(Math.random() * 6)) + 1; //return number between 0 and 5 we add 1 to make it from 1 to 6
}