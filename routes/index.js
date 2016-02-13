var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs-extra');
var models = require('../models');
var sizeOf = require('image-size');

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body);
});

router.post('/obstacle/add', function(req, res) {

  var form = new formidable.IncomingForm();
  var lat, lng;
  form.uploadDir = 'public/images/obstacles/tmp';

  form.parse(req, function(err, fields, files) {
    //console.log("Fields:", fields);
    //console.log("Files:", files);

    lat = parseFloat(fields.obstacleLat);
    lng = parseFloat(fields.obstacleLng);

    console.log("err", err);

    if (!err) {

    }
  });

  form.on('end', function () {
    console.log("Upload finished.", this.openedFiles[0].name);

    if (this.openedFiles[0].size) {
      var tempPath = this.openedFiles[0].path;
      var splitName = this.openedFiles[0].name.split('.');
      var fileName = randomString(10) + '.' + splitName[splitName.length-1];
      var newPath = 'public/images/';
      var dimensions = sizeOf(tempPath);

      fs.copy(tempPath, newPath + fileName, function (err) {
        if (err) {
          res.send(JSON.stringify({
            status: 'ERROR',
            text: 'File write error'
          }));
        } else {
          models.Obstacle.create({
              lat: lat,
              lng: lng,
              img: fileName,
              width: dimensions.width,
              height: dimensions.height
            })
            .then(function (obs) {
              fs.remove(tempPath);
              console.log(obs.get({
                plain: true
              }));
            })
            .then(function () {
              res.send(JSON.stringify({
                status: 'OK',
                text: 'File uploaded. Obstacle saved'
              }));
            });
        }
      });
    } else {
      models.Obstacle.create({
          lat: lat,
          lng: lng
        })
        .then(function (obs) {
          console.log(obs.get({
            plain: true
          }));
        })
        .then(function () {
          res.send(JSON.stringify({
            status: 'OK',
            text: 'Obstacle saved'
          }))
        });
    }
  });
});

router.get('/obstacle', function (req, res) {

  models.Obstacle.findAll()
    .then(function (obstacles) {
      var obstacleArray = [];

      for (var i = 0; i < obstacles.length; i++) {
        var obstacle = obstacles[i];
        obstacleArray.push(obstacle.get({plain:true}));
      }

      res.send(obstacleArray);
    });
});

var randomString = function(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


router.get('/admin', function (req, res) {
  res.render('index', { title: 'Obstacle admin panel' });
});

module.exports = router;
