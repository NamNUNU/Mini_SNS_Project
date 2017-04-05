var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require("mysql")

// DATABASE SETTING
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "1234",
  database : "sns"
})
connection.connect();

// main page는 세션 페이지가 있을때만 접근이 가능하게 한다
router.get('/', function(req, res){
  var id = req.user;
  if(!id) res.render('login.ejs');

  var responseData = {};
  var query =  connection.query('select email from user where id="'+ id +'"', function(err,rows){
    if(err) throw err;
    if(rows[0]){
      //console.log(rows);
      responseData.result = "ok";
      responseData.email = rows[0].email;
    }else{
      responseData.result = "none";
      responseData.email = "";
    }

  res.render('main.ejs',{'id':responseData.email});
  })
})

router.get('/cards', function(req, res){
  var post;
  var comments;
  var postSql = 'select id, email, picture, DATE_FORMAT(writedate, "%Y-%c-%d-%h:%i %p") as writedate, contents from post order by writedate desc'
  var commentsSql = 'select p_id, email, id, comment from comments'
  connection.query(postSql, function(err, rows){
    if(err) throw err;
    post = rows
    connection.query(commentsSql, function(err, rows){
      if(err) throw err;
      comments = rows;
      for(var i = 0; i < post.length; i++){
        post[i].comments = [];
        for(var x = 0; x < comments.length; x++){
          if(post[i].id === comments[x].p_id){
            post[i].comments.push({
              "email" : comments[x].email,
              "comment" : comments[x].comment,
              "id" : comments[x].id
            })
          }
        }
      }
      res.json(post);
    })
  })
})

// card maker가 card를 생성할 때
router.post('/cards', function(req, res){
  //var email = req.body.email;
  var picture = req.body.picture;
  var contents = req.body.contents;
  var writedate = req.body.writedate;
  var email = "";

  var sql = 'select email from user where id = ?'
  var params = [req.user];

  connection.query(sql, params, function(err, rows){
    if(err) throw err;
    email = rows[0].email;

    var sql = 'insert into post(email, picture, contents, writedate) values(?, ?, ?, ?)';
    var params = [email, picture, contents, writedate];
    connection.query(sql, params, function(err, rows){
      if(err) throw err;
      res.json({
        id : rows.insertId,
        email : email
      });
    })

  })
})

router.post('/cards/comment', function(req, res){
  //var email = req.body.email;
  var comment = req.body.comment;
  var p_id = req.body.p_id;
  var email = "";

  var sql = 'select email from user where id = ?'
  var params = [req.user];

  connection.query(sql, params, function(err, rows){
    if(err) throw err;
    email = rows[0].email;

    var sql = 'insert into comments(p_id, email, comment) values(?, ?, ?)';
    var params = [p_id, email, comment];
    connection.query(sql, params, function(err, rows){
      if(err) throw err;
      res.json({
        id : rows.insertId,
        email : email
      });
    })

  })
})

router.delete('/cards/comment', function(req, res){
  //console.log(req.body.id)

  var id = req.body.id;
  var sql = 'delete from comments where id = ?'
  var params = [id];
  connection.query(sql, params, function(err, rows){
    if(err) throw err;
    //console.log(rows);
  })
})

module.exports = router;
