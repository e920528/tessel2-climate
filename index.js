// tessel
var tessel = require('tessel');

//http
var http = require('http');

// Require two other core Node.js modules
var fs = require('fs');
var url = require('url');

//Use express
var express = require('express');
var app = express();

//require climate module
var climatelib = require('climate-si7020');

//plug climate module in portA
var climate = climatelib.use(tessel.port['A']);

//use ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// running server on port 8080
app.listen(8080,function(){
  console.log('Server running at http://192.168.1.101:8080/');
});

//set views path
app.set('views',__dirname + '/views');

var viewTemperature,viewHumidity;

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('index.ejs',{T:viewTemperature, H:viewHumidity});
});


//app.get('/', function(req,res){
//  res.render('index',{T:te, H:hu});
//})
/*
// Respond to the request with our index.html page
function showIndex (url, request, response) {
  // Create a response header telling the browser to expect html
  response.writeHead(200, {"Content-Type": "text/html"});

  // Use fs to read in index.html
  fs.readFile(__dirname + '/index.html', function (err, content) {
    // If there was an error, throw to stop code execution
    if (err) {
      throw err;
    }

    // Serve the content of index.html read in by fs.readFile
    response.end(content);
  });
}
*/
  climate.on('ready', function () {
    console.log('Connected to climate module');

    // Loop forever
    setImmediate(function loop () {
      climate.readTemperature('f', function (err, temp) {
        climate.readHumidity(function (err, humid) {
        
        viewTemperature = ((temp-32)/9*5).toFixed(1);
        viewHumidity = humid.toFixed(1);
        console.log('Degrees:', viewTemperature + 'C', 'Humidity:', viewHumidity + '%');
        setTimeout(loop, 1000);
        });
      });
    });
  });

  climate.on('error', function(err) {
    console.log('error connecting module', err);
  });
