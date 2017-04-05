var express =  require('express')
var app = express();
var router = express.Router();
var path = require("path");
var bodyParser = require("body-parser");

var logout = require("./logout/logout");
var main = require("./main/main");
var profile = require("./profile/profile");
var intro = require("./intro/intro");

router.get("/", function(req, res){
  res.render("intro.ejs",{message:''});
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

router.use('/logout', logout);
router.use('/main', main);
router.use('/profile', profile);
router.use('/intro', intro);

module.exports = router;
