const express = require('express');
const mysql = require('mysql');
const path = require('path');
const logger = require('./middleware/logger');
const app = express();

const port = 7000;

// create connection to database
// the mysql.createConnection function takes in a configuration object which contains host, user, password and the database name.
const db = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'password',
  port: '52000',
  // database: 'insiderapp'
  database: 'medicalApp',
  multipleStatements: true
});

// connect to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
global.db = db;

// Init middleware
// app.use(logger);

// set express to use this port
app.set('port', process.env.port || port);

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({
  extended: false
}));

// routes for the app
// Doctors API Routes
app.use('/api/doctors', require('./routes/api/doctors'));

// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});