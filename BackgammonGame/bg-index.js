const mysql = require('mysql');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

let con = mysql.createConnection({
	host: "10.194.69.15",
	user: "A2",
	password: "08DeFYaH16z75hVx",
	database: "A2"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

con.connect(function(err){
	if (err) throw err;
	console.log('Connected!');
});

app.get('/',function(req,res) { //remplace le hello world par une page html
  res.sendFile(__dirname+'/bg-index.html');
});

app.post('/signup', function (req, res) {
   var postData  = req.body;
   con.query('INSERT INTO players SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

process.on('SIGTERM', () => {
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
  });
});