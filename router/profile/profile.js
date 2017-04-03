var express = require('express'); //Express
var app = express(); //Express
var router = express.Router();
var path = require('path');
var ejs = require('ejs'); //ejs
var bodyParser = require("body-parser");
var mysql = require('mysql'); //mysql
var connection = mysql.createConnection({ //mysql connection
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'bjh0324',
  database: 'snstest'
});
connection.connect(function (err) { //mysql connection
  if (err) {
    console.log("! mysql connection error");
    console.log(err);
    throw err;
  } else {
    console.log("* mysql connection success");
  }
});

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', function (req, res) {
  console.log("/profile");
  res.sendFile(path.join(__dirname, "../../public/src/html/profile.html"));
});

router.post('/edit', function (req, res) {
  console.log("/profile/edit");
  var email = req.body.email;
  var query_str = "select email,phone,intro,picture from user where email='" + email + "'";
  var query = connection.query(query_str, function (err, rows) {
    res.render('profile_edit.ejs', {
      imgurl: "http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg",
      email: rows[0].email,
      phone: rows[0].phone,
      intro: rows[0].intro
    });
  });
});

router.post('/render', function (req, res) {
  var email = req.body.email.replace(/%40/, "@");
  var query_str = "select user.email, user.picture as pro_picture, user.intro, post.id, post.picture, post.contents from user inner join post on user.email = post.email where user.email = '" + email + "'";
  var query = connection.query(query_str, function (err, rows) {
    console.log(rows);
    res.json(rows);
  });
});

router.post('/edit_submit', function (req, res) {
  console.log("/profile/edit_submit");
  var query_str = "select pw from user where email='" + req.body.email + "';";
  var query = connection.query(query_str, function (err, rows) {
    if (rows[0].pw == req.body.pw_old) {
      query_str = "update user set pw ='" + req.body.pw + "', phone = '" + req.body.phone + "', intro = '" + req.body.intro + "', picture = '" + req.body.picture + "' where email='" + req.body.email + "'";
      var edit_query = connection.query(query_str, function (err, rows) {
        console.log("profile edit success")
        res.send("success");
      });
    } else {
      console.log("profile edit fail, password error");
      res.send("fail");
    }
  });
});


module.exports = router;