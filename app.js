/* ----------- */
/* HTTP SERVER */
/* ----------- */

var http = require('http');
var io = require('socket.io');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var app = express();
var fs = require('fs');

app.use(express.static(__dirname ));

var server = http.createServer(app).listen(80);
var io = io.listen(server);

io.sockets.on('connection',  function(socket){
       socket.on('msg', function(msg){
                socket.emit('msg', msg);
                socket.broadcast.emit('msg', msg);
        });
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')}
,
  filename: function (req, files, cb) {
    cb(null, files.originalname)
//cb(null, Date.now()+'-'+files.originalname)
  }
  });

app.use('/', express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer( { dest: './uploads/', storage: storage } ).single('files'));

app.post('/', express.static(__dirname + '/index.html'));



app.post('/uploads/', function (req) {
  var v = req.body.content; 
  fs.rename('./uploads/'+req.body.filename,'./uploads/'+v);

/*

    var name = './uploads/'+Date.now()+'.png';
    var tempPath = req.files.file.path,
        targetPath = path.resolve(name);
    if (path.extname(req.files.file.name).toLowerCase() === '.png') {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            console.log(name);
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            console.error("Only .png files are allowed!");
        });
    }
    // ...
*/
});

app.post('/uploadsout', function(req, res){
var filename = req.body.filename;

fs.writeFile('./uploads/' + filename, req.body.file, function (err) {
      if (err) throw err;
    });

});



app.post('/logs', function(req){

console.log('outputfiles');

  var data;

    /* Output files */
   // var filename = currentTime() + '-' + req.body.filename;
   // vaf filename = req.body.filename;
  //  fs.writeFile('./uploads/' + filename, req.body.file, function (err) {
  //    if (err) throw err;
  //  });

    data = {
      "location" : req.body.location,
      "input" : req.body.input,
      "output" : req.body.output,
      "settings" : req.body.settings,
      "time" : currentTime()
    }

  //fs.appendFile('log/logs.txt', JSON.stringify(data) + "\n", function (err) {
   fs.appendFile('log/logs.txt', req.body.location + "	" +  req.body.input + "	" +  req.body.output + "	" + req.body.settings + "	" + currentTime() +"\n", function (err) {

 if (err) throw err;
  });
  console.log(data);
});

app.post('/settings', function(req){

  fs.writeFile('./uploads/' +req.body.filename, req.body.file, function (err) {
    if (err) throw err;
  });


 // fs.appendFile('uploads/'+currentTime()+'.txt', JSON.stringify(data) + "\n", function (err) {
// fs.writeFile('./uploads/'+req.body.filename, JSON.stringify(data) + "\n", function (err) {
// if (err) throw err;
 // });

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
