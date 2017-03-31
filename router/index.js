var express =  require('express')
var app = express();
var router = express.Router();
var path = require("path");
var bodyParser = require("body-parser");

router.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "../public/src/html/main.html"));
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

module.exports = router;
