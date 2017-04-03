var express =  require('express')
var app = express();
var router = express.Router();
var path = require("path");
var bodyParser = require("body-parser");

var join = require("./join/join");
var login = require("./login/login");
var main = require("./main/main");
var profile = require("./profile/profile");

router.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "../public/src/html/login.html"));
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

router.use('/join', join);
router.use('/login', login);
router.use('/main', main);
router.use('/profile', profile);

module.exports = router;
