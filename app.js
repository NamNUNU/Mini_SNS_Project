var express = require('express'); //Express
var app = express(); //Express
var bodyParser = require('body-parser'); //bodyParser
var ejs = require('ejs'); //ejs

var router = express.Router();
var router = require("./router/index")


app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.use(router);




//

app.get('/', function (req, res) {
  console.log(".. get '/' > main.html");
  res.sendFile(__dirname + "/public/src/html/main.html");
});
/****************************************************************************************************/

app.listen(3000, function () { // listen은 항상 아래에 두는 것이 좋다
  console.log("\n" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " /start server!");
});