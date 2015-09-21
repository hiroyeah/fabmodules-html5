/* ----------- */
/* HTTP SERVER */
/* ----------- */

var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var fs = require('fs');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, currentTime() + "-" + file.originalname)
  }
});

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer( { dest: './uploads/', storage: storage } ).single('files'));

app.post('/', express.static(__dirname + '/index.html'));
app.post('/file', function(req, res){
  console.log(req.file); // form fields
  data = {
    "user" : req.body.user,
    "content" : req.body.content,
    "file" : req.file.filename,
    "time" : currentTime()
  }
  fs.appendFile('log/'+currentMonth()+'.txt', JSON.stringify(data) + "\n", function (err) {
    if (err) throw err;
  });
});
app.post('/record', function(req){
  var data;
  if (req.body.params && req.body.file) {
    var filename = currentTime() + '-' + req.body.filename;
    fs.writeFile('./uploads/' + filename, req.body.file, function (err) {
      if (err) throw err;
    });
    data = {
      "user" : req.body.user,
      "content" : req.body.content,
      "params" : req.body.params,
      "file" : filename,
      "time" : currentTime()
    }
  } else {
    data = {
      "user" : req.body.user,
      "content" : req.body.content,
      "time" : currentTime()
    }
  }
  fs.appendFile('log/'+currentMonth()+'.txt', JSON.stringify(data) + "\n", function (err) {
    if (err) throw err;
  });
  console.log(data);
});
app.post('/recordSettings', function(req){
  var data;
  fs.appendFile('settings/'+currentTime()+'.txt', JSON.stringify(data) + "\n", function (err) {
    if (err) throw err;
  });
  console.log(data);
});

PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log('listening on ' + PORT)});

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
