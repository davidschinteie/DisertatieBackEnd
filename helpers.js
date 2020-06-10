/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');


const util = require('util');
const mysql = require('mysql');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');
require('moment/locale/ro');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.isEmptyObject = (obj) => {
  return !Object.keys(obj).length;
}

// Making a static map is really long - this is a handy helper function to make one
exports.staticMap = ([lng, lat]) => `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=800x150&key=${process.env.MAP_KEY}&markers=${lat},${lng}&scale=2`;

// inserting an SVG
exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = `Clinica Medicala`;

exports.menu = [{
    slug: '/stores',
    title: 'Stores',
    icon: 'store',
  },
  {
    slug: '/tags',
    title: 'Tags',
    icon: 'tag',
  },
  {
    slug: '/top',
    title: 'Top',
    icon: 'top',
  },
  {
    slug: '/add',
    title: 'Add',
    icon: 'add',
  },
  {
    slug: '/map',
    title: 'Map',
    icon: 'map',
  },
];

require('dotenv').config({
  path: 'variables.env'
});
exports.db_config = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  multipleStatements: true
}

exports.makeDb = (db_config) => {
  const connection = mysql.createConnection(db_config);
  return {
    query(sql, args) {
      return util.promisify(connection.query)
        .call(connection, sql, args);
    },
    close() {
      return util.promisify(connection.end).call(connection);
    }
  };
}