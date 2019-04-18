//update index.js
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
  res.sendFile(__dirname+'/index.html');
});

app.get('/allPersons', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001'); // allows react access
	con.query('SELECT * FROM person', (err,results) => {
  		if(err) throw err;
			res.send(results);
	});
})

app.get('/person', function (req, res) {
   con.query('select * from person where id=?', [req.query.id], function (error, results, fields) {
	if (error) throw error;
	  res.send(results);
	});
});

app.post('/addPerson', function (req, res) {
   var postData  = req.body;
   con.query('INSERT INTO person SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

app.post('/updatePerson', function (req, res) {
   con.query('UPDATE person SET name=?,last_name=?,age=? where id=?', [req.body.name,req.body.last_name, req.body.age, req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.send(results);
	});
});

app.delete('/deletePerson', function (req, res) {
   con.query('DELETE FROM person WHERE id=?', [req.body.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end('Record has been deleted!');
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
