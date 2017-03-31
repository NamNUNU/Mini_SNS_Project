var express =  require('express')
var app = express();
var router = express.Router();
var router = require("./router/index")
var bodyParser = require("body-parser")

app.listen(3000, function(){
  console.log('server started on port 3000');
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public/src"));
app.set("view engine", "ejs");

app.use(router);
