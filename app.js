var express = require('express'); //Express
var app = express(); //Express
var bodyParser = require('body-parser'); //bodyParser
var ejs = require('ejs'); //ejs
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
app.use(express.static('public'));


app.get('/profile', function (req, res) {
  console.log(".. get '/' > profile.html");
  res.sendFile(__dirname + "/public/src/html/profile.html");
});

app.get('/profile_edit', function (req, res) {
  console.log(".. get '/' > profile_edit.html");
  res.sendFile(__dirname + "/public/src/html/profile_edit.html");
});

app.post('/test', function (req, res) {
  var email = "user1@mail.com";
  var query_str = "select user.email, user.picture, user.intro, post.id, post.picture, post.contents from user inner join post on user.email = post.email where user.email = '" + email + "'";
  var query = connection.query(query_str, function (err, rows) {
    res.json(rows);
  });
});

app.post('/edit', function (req, res) {
  console.log("/edit");
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

app.post('/profile_edit_submit', function (req, res) {
  console.log("/profile_edit_submit", req.body);

  var query_str = "select pw from user where email='" + req.body.email + "';";
  console.log("query_str", query_str);
  var query = connection.query(query_str, function (err, rows) {
    console.log(rows);
    if (rows[0].pw == req.body.pw_old) {
      query_str = "update user set pw ='" + req.body.pw + "', phone = '" + req.body.phone + "', intro = '" + req.body.intro + "', picture = '"+req.body.picture+"' where email='" + req.body.email + "'";
      console.log(query_str);
      var edit_query = connection.query(query_str, function(err, rows){
        console.log(rows);
      })
    } else {
      console.log("password error");
    }
  });
});


/****************************************************************************************************/

app.listen(3000, function () { // listen은 항상 아래에 두는 것이 좋다
  console.log("\n" + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " /start server!");
});


/*

insert into user (email, pw, phone, intro) values ('user1@mail.com', 'user1pw', '010-1234-5678', 'Hello World1');
insert into user (email, pw, phone, intro) values ('user2@mail.com', 'user2pw', '010-1234-5678', 'Hello World2');
insert into user (email, pw, phone, intro) values ('user3@mail.com', 'user3pw', '010-1234-5678', 'Hello World3');
insert into user (email, pw, phone, intro) values ('user4@mail.com', 'user4pw', '010-1234-5678', 'Hello World4');
insert into user (email, pw, phone, intro) values ('user5@mail.com', 'user5pw', '010-1234-5678', 'Hello World5');

insert into post (email, picture, contents) values ('user1@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content1');
insert into post (email, picture, contents) values ('user1@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content2');
insert into post (email, picture, contents) values ('user2@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content3');
insert into post (email, picture, contents) values ('user2@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content4');
insert into post (email, picture, contents) values ('user3@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content5');
insert into post (email, picture, contents) values ('user4@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content6');
insert into post (email, picture, contents) values ('user5@mail.com', 'http://static.naver.net/newsstand/2017/0313/article_img/9054/173200/001.jpg', 'content7');

*/