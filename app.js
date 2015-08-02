/* ----------- */
/* HTTP SERVER */
/* ----------- */

var express = require('express');
var app = express();
var fs = require('fs');

app.use('/', express.static(__dirname));
app.get('/', express.static(__dirname + '/index.html'));
app.get('/record', function(req){
  var data = {
    "user" : req.query.user,
    "content" : req.query.content,
    "time" : currentTime()
  }
  fs.appendFile('log/'+currentMonth()+'.txt', JSON.stringify(data) + "\n", function (err) {
    if (err) throw err;
  });
  console.log(data);
});

app.listen(3000, function() { console.log('listening')});


var currentMonth = function() {
  var d = new Date();
  return d.getFullYear()
    +(((d.getMonth()+1) < 10)?"0":"") + (d.getMonth()+1)
    +((d.getDate() < 10)?"0":"") + d.getDate();
}

var currentTime = function() {
  var d = new Date();
  return d.getFullYear()
    +(((d.getMonth()+1) < 10)?"0":"") + (d.getMonth()+1)
    +((d.getDate() < 10)?"0":"") + d.getDate()
    +((d.getHours() < 10)?"0":"") + d.getHours() 
    +((d.getMinutes() < 10)?"0":"") + d.getMinutes() 
    +((d.getSeconds() < 10)?"0":"") + d.getSeconds()
    +((d.getMilliseconds() < 100)?"0":"") + ((d.getMilliseconds() < 10)?"0":"") + d.getMilliseconds();
};
