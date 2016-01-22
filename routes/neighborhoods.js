var express = require('express');
var router = express.Router();
var knex = require('../db/knex')
var request = require('request');
function Neighborhoods(){
  return knex('neighborhoods')
}

router.get('/index', function(req, res, next){
  res.render('neighborhoods/index')
});

router.get('/new', function(req, res, next) {
  res.render('neighborhoods/new')
})

router.get('/:id', function(req, res, next){
  Neighborhoods().where('id', req.params.id).first().then(function(neighborhoods){
    var name = neighborhoods.nameN
    var google_api = 'https://maps.googleapis.com/maps/api/geocode/json?';
    var addy = neighborhoods.epicenter;
    var addyy = addy.split(" ").join("+");
    var address = 'address='+addyy+''
    var my_key = '&key=' + 'AIzaSyD2R7OuzuTr3cWKV47SDvjV7Rowt7RD3F0';
    request(google_api+address+my_key, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jase = JSON.parse(body);
        var lat_long = jase.results[0].geometry.location;
        res.render('neighborhoods/show', { title: 'Express', lat_long : lat_long, nameN:name });
      }
    })
  })

});


router.post('/index', function(req, res, next){
  Neighborhoods().insert({
    nameN:req.body.neighborhood,
    epicenter:req.body.epicenter
  }).then(function(result){
    res.redirect('/neighborhoods/index')
  })
})





module.exports = router;
