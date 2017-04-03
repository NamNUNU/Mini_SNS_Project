var express = require("express");
var app = express();
var router = express.Router();
var path = require('path');
var mysql = require("mysql")

// DATABASE SETTING
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "14858",
  database : "sns"
})
connection.connect();

// main page는 세션 페이지가 있을때만 접근이 가능하게 한다
router.get('/', function(req, res){
  var id = req.user;
  if(!id) res.render('login.ejs');

  var responseData = {};
  var query =  connection.query('select email from user where uid="'+ id +'"', function(err,rows){
    if(err) throw err;
    if(rows[0]){
      console.log(rows);
      responseData.result = "ok";
      responseData.email = rows[0].email;
    }else{
      responseData.result = "none";
      responseData.email = "";
    }
    
  res.render('main.ejs',{'id':responseData.email});
  })
})



module.exports = router;
