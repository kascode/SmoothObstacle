var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs-extra');

/* GET home page. */
router.post('/', function(req, res, next) {
  console.log(req.body);
});

router.post('/obstacle', function(req, res) {

  var form = new formidable.IncomingForm();
  form.uploadDir = 'public/images/obstacles/tmp';

  form.parse(req, function(err, fields, files) {
    console.log("Fields:", fields);
    console.log("Files:", files);

    if (!err) {
      form.on('end', function () {
        console.log("Upload finished.");

        var tempPath = this.openedFiles[0].path;
        var fileName = this.openedFiles[0].name;
        var newPath = 'public/images/';

        fs.copy(tempPath, newPath + fileName, function (err) {
          if (err) {
            res.send(JSON.stringify({
              status: 'ERROR',
              text: 'File write error'
            }));
          } else {
            res.send(JSON.stringify({
              status: 'OK',
              text: 'File uploaded'
            }));
          }
          fs.remove(tempPath);
        });
      });
    }
  });
});


router.get('/admin', function (req, res) {
  res.render('index', { title: 'Obstacle admin panel' });
});

module.exports = router;
