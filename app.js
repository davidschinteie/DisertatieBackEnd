const express = require('express');
// const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

const port = 7000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection ({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '52000',
  // database: 'insiderapp'
  database: 'medicalApp'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(express.urlencoded({extended: true})); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.json()); // Parse JSON bodies (as sent by API clients)
// app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder

// routes for the app
const routes = require('./routes/index');
app.use('/', routes);

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});