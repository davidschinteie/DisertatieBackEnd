// npm install geoip-lite
var geoip = require('geoip-lite');
 
// var ip = "207.97.227.239";
var ip = "82.208.183.117";
var geo = geoip.lookup(ip);
 
console.log(geo);