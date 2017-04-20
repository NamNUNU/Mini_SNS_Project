var express = require('express'); //Express
var app = express(); //Express
var router = express.Router();
var path = require('path');
var ejs = require('ejs'); //ejs
var bodyParser = require("body-parser");
var options = require('../option');
var mysql = require('mysql'); //mysql

var loginData = {
        host: options.storageConfig.HOST,
        user: options.storageConfig.user,
        password: options.storageConfig.password
};

var connection = mysql.createConnection({
  host: loginData.host,
  port:3306,
  user:loginData.user,
  password:loginData.password,
  database:'sns'
})
connection.connect();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

router.get('/', function (req, res) {
  console.log("/profile");
  res.sendFile(path.join(__dirname, "../../public/src/html/profile.html"));
});

router.get('/cur', function (req, res) {
  console.log("/cur");
  var query_str = "select email from user where id=" + req.user;
  var query = connection.query(query_str, function (err, rows) {
    console.log(rows[0].email);
    res.redirect("/profile?search=" + rows[0].email);
  });
});

router.post('/edit', function (req, res) {
  console.log(req.user)
  //console.log("/profile/edit");
  var email = req.body.email;
  var query_str = "select email,phone,intro,picture from user where email='" + email + "'";
  var query = connection.query(query_str, function (err, rows) {
    res.render('profile_edit.ejs', {
      imgurl: rows[0].picture,
      email: rows[0].email,
      phone: rows[0].phone,
      intro: rows[0].intro
    });
  });
});

router.post('/render', function (req, res) {
  var email = req.body.email.replace(/%40/, "@");
  var query_str = "select email from user where id=" + req.user;
  var query = connection.query(query_str, function (err, rows) {
    var q1 = rows[0].email;
    query_str = "select user.email, user.picture as pro_picture, user.intro from user where email='" + email + "'";
    console.log(query_str);
    var query = connection.query(query_str, function (err, rows) {
      var q2 = rows[0];
      query_str = "select post.id, post.picture, post.contents from user inner join post on user.email = post.email where user.email = '" + email + "'";
      var query = connection.query(query_str, function (err, rows) {
        console.log("포스트 정보", rows);
        var q3 = rows;
        var data = {
          q1: q1, //현재 로그인 유저 이메일
          q2: q2, //현재 프로필 창의 유저의 정보
          q3: q3 //현재 프로필 창의 post 정보
        }
        res.json(data);
      });

    });
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

router.post('/card_view', function (req, res) {
  console.log("/card_view req.body.id", req.body.id);
  var query_str = "select post.id, post.email, post.picture, post.contents from post where post.id =" + req.body.id;
  var query = connection.query(query_str, function (err, rows) {
    var q1 = rows;
    query_str = "select comments.email as c_email, comments.comment as c_comment from post inner join comments on post.id=comments.p_id where post.id=" + req.body.id;
    var query2 = connection.query(query_str, function (err, rows) {
      var data = {
        q1: q1,
        q2: rows
      }
      res.send(data);
    });
  });
});
router.post('/comment', function (req, res) {
  var query_str = "select email from user where id=" + req.user;
  var query = connection.query(query_str, function (err, rows) {
    var email = rows[0].email;
    query_str = "insert into comments (p_id, email, comment) values (" + req.body.comment_pid + ",'" + rows[0].email + "','" + req.body.comment_content + "')";
    console.log(query_str);
    var query = connection.query(query_str, function (err, rows) {
      if (err) {
        throw err
      };
    });
  });

});
module.exports = router;
